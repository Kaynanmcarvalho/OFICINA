/**
 * TORQ - Store de Controle de Caixa
 * 
 * Gerencia o estado do caixa financeiro:
 * - Abertura e fechamento de caixa
 * - Controle de saldo em tempo real
 * - Movimentações (vendas, sangrias, reforços)
 * - Persistência de estado
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

const useCaixaStore = create(
  persist(
    (set, get) => ({
      // Estado do caixa atual
      caixaAtual: null,
      operadorAtual: null,
      isLoading: false,
      error: null,

      // ============================================================================
      // ABERTURA DE CAIXA
      // ============================================================================
      abrirCaixa: async (saldoInicial, turno, observacoes, operador) => {
        set({ isLoading: true, error: null });
        
        try {
          // 1. Verificar se já existe caixa aberto para este operador
          const caixasAbertosQuery = query(
            collection(db, 'caixas'),
            where('status', '==', 'aberto'),
            where('operadorAbertura.uid', '==', operador.uid),
            where('empresaId', '==', operador.empresaId)
          );
          
          const caixasAbertos = await getDocs(caixasAbertosQuery);
          
          if (!caixasAbertos.empty) {
            throw new Error('Você já tem um caixa aberto. Feche-o antes de abrir outro.');
          }

          // 2. Verificar se já existe caixa aberto neste ponto de venda
          const caixasPontoVendaQuery = query(
            collection(db, 'caixas'),
            where('status', '==', 'aberto'),
            where('empresaId', '==', operador.empresaId),
            where('pontoVenda', '==', 'PDV_01') // TODO: Tornar dinâmico
          );
          
          const caixasPontoVenda = await getDocs(caixasPontoVendaQuery);
          
          if (!caixasPontoVenda.empty) {
            throw new Error('Já existe um caixa aberto neste ponto de venda.');
          }

          // 3. Gerar número sequencial do caixa (baseado na data)
          const hoje = new Date().toISOString().split('T')[0];
          const caixasHojeQuery = query(
            collection(db, 'caixas'),
            where('empresaId', '==', operador.empresaId),
            where('dataAbertura', '>=', new Date(hoje)),
            orderBy('dataAbertura', 'desc'),
            limit(1)
          );
          
          const caixasHoje = await getDocs(caixasHojeQuery);
          const numeroCaixa = caixasHoje.empty ? 1 : caixasHoje.docs[0].data().numero + 1;

          // 4. Criar registro do caixa
          const caixaData = {
            // Identificação
            numero: numeroCaixa,
            empresaId: operador.empresaId,
            pontoVenda: 'PDV_01', // TODO: Tornar dinâmico
            
            // Status e Controle
            status: 'aberto',
            turno: turno || 'integral',
            
            // Datas e Timestamps
            dataAbertura: Timestamp.now(),
            dataFechamento: null,
            dataReabertura: null,
            dataCancelamento: null,
            
            // Usuários Responsáveis
            operadorAbertura: {
              uid: operador.uid,
              nome: operador.displayName || operador.email,
              email: operador.email
            },
            operadorFechamento: null,
            
            // Valores Financeiros
            saldoInicial: parseFloat(saldoInicial) || 0,
            
            entradas: {
              dinheiro: 0,
              pix: 0,
              cartaoDebito: 0,
              cartaoCredito: 0,
              cheque: 0,
              outros: 0,
              total: 0
            },
            
            saidas: {
              sangrias: 0,
              estornos: 0,
              total: 0
            },
            
            reforcos: {
              troco: 0,
              total: 0
            },
            
            // Cálculos
            saldoEsperado: parseFloat(saldoInicial) || 0,
            saldoContado: null,
            diferenca: null,
            
            // Estatísticas
            totalVendas: 0,
            totalItensVendidos: 0,
            ticketMedio: 0,
            
            // Observações
            observacoesAbertura: observacoes || '',
            observacoesFechamento: '',
            justificativaDiferenca: '',
            
            // Auditoria
            movimentacoes: [
              {
                id: `mov_${Date.now()}`,
                tipo: 'abertura',
                valor: parseFloat(saldoInicial) || 0,
                formaPagamento: null,
                timestamp: Timestamp.now(),
                usuario: {
                  uid: operador.uid,
                  nome: operador.displayName || operador.email
                },
                observacao: observacoes || 'Abertura de caixa',
                vendaId: null,
                autorizadoPor: null,
                comprovante: null
              }
            ],
            
            // Metadados
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            version: 1
          };

          // 5. Salvar no Firestore
          const caixaRef = await addDoc(collection(db, 'caixas'), caixaData);
          
          // 6. Buscar o documento criado
          const caixaDoc = await getDoc(caixaRef);
          const caixaCriado = { id: caixaDoc.id, ...caixaDoc.data() };

          // 7. Atualizar estado local
          set({ 
            caixaAtual: caixaCriado,
            operadorAtual: operador,
            isLoading: false,
            error: null
          });

          return { success: true, data: caixaCriado };
        } catch (error) {
          console.error('Erro ao abrir caixa:', error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // ============================================================================
      // REGISTRAR VENDA NO CAIXA
      // ============================================================================
      registrarVenda: async (vendaId, valorTotal, pagamentos) => {
        const { caixaAtual } = get();
        
        if (!caixaAtual) {
          throw new Error('Nenhum caixa aberto');
        }

        try {
          // Calcular valores por forma de pagamento
          const valoresPorForma = {
            dinheiro: 0,
            pix: 0,
            cartaoDebito: 0,
            cartaoCredito: 0,
            cheque: 0,
            outros: 0
          };

          let valorDinheiroFisico = 0;

          pagamentos.forEach(pag => {
            const valor = parseFloat(pag.valor) || 0;
            const metodo = pag.metodo.toLowerCase().replace(/[_\s]/g, '');
            
            if (metodo === 'dinheiro') {
              valoresPorForma.dinheiro += valor;
              valorDinheiroFisico += valor;
            } else if (metodo === 'pix') {
              valoresPorForma.pix += valor;
            } else if (metodo.includes('debito')) {
              valoresPorForma.cartaoDebito += valor;
            } else if (metodo.includes('credito')) {
              valoresPorForma.cartaoCredito += valor;
            } else if (metodo === 'cheque') {
              valoresPorForma.cheque += valor;
            } else {
              valoresPorForma.outros += valor;
            }
          });

          // Atualizar caixa no Firestore
          const caixaRef = doc(db, 'caixas', caixaAtual.id);
          
          await updateDoc(caixaRef, {
            'entradas.dinheiro': increment(valoresPorForma.dinheiro),
            'entradas.pix': increment(valoresPorForma.pix),
            'entradas.cartaoDebito': increment(valoresPorForma.cartaoDebito),
            'entradas.cartaoCredito': increment(valoresPorForma.cartaoCredito),
            'entradas.cheque': increment(valoresPorForma.cheque),
            'entradas.outros': increment(valoresPorForma.outros),
            'entradas.total': increment(valorTotal),
            saldoEsperado: increment(valorDinheiroFisico),
            totalVendas: increment(1),
            updatedAt: Timestamp.now(),
            movimentacoes: arrayUnion({
              id: `mov_${Date.now()}`,
              tipo: 'venda',
              valor: valorDinheiroFisico,
              formaPagamento: pagamentos[0]?.metodo || 'multiplo',
              timestamp: Timestamp.now(),
              usuario: {
                uid: caixaAtual.operadorAbertura.uid,
                nome: caixaAtual.operadorAbertura.nome
              },
              observacao: `Venda de R$ ${valorTotal.toFixed(2)}`,
              vendaId: vendaId,
              autorizadoPor: null,
              comprovante: null
            })
          });

          // Atualizar estado local
          const caixaAtualizado = {
            ...caixaAtual,
            entradas: {
              dinheiro: caixaAtual.entradas.dinheiro + valoresPorForma.dinheiro,
              pix: caixaAtual.entradas.pix + valoresPorForma.pix,
              cartaoDebito: caixaAtual.entradas.cartaoDebito + valoresPorForma.cartaoDebito,
              cartaoCredito: caixaAtual.entradas.cartaoCredito + valoresPorForma.cartaoCredito,
              cheque: caixaAtual.entradas.cheque + valoresPorForma.cheque,
              outros: caixaAtual.entradas.outros + valoresPorForma.outros,
              total: caixaAtual.entradas.total + valorTotal
            },
            saldoEsperado: caixaAtual.saldoEsperado + valorDinheiroFisico,
            totalVendas: caixaAtual.totalVendas + 1
          };

          set({ caixaAtual: caixaAtualizado });

          return { success: true, valorDinheiroFisico };
        } catch (error) {
          console.error('Erro ao registrar venda no caixa:', error);
          throw error;
        }
      },

      // ============================================================================
      // FECHAR CAIXA
      // ============================================================================
      fecharCaixa: async (saldoContado, observacoes, justificativa, autorizadoPor) => {
        const { caixaAtual, operadorAtual } = get();
        
        if (!caixaAtual) {
          throw new Error('Nenhum caixa aberto');
        }

        set({ isLoading: true, error: null });

        try {
          const diferenca = saldoContado - caixaAtual.saldoEsperado;

          // Atualizar caixa no Firestore
          const caixaRef = doc(db, 'caixas', caixaAtual.id);
          
          await updateDoc(caixaRef, {
            status: 'fechado',
            dataFechamento: Timestamp.now(),
            operadorFechamento: {
              uid: operadorAtual.uid,
              nome: operadorAtual.displayName || operadorAtual.email,
              email: operadorAtual.email
            },
            saldoContado: parseFloat(saldoContado),
            diferenca: diferenca,
            observacoesFechamento: observacoes || '',
            justificativaDiferenca: justificativa || '',
            updatedAt: Timestamp.now(),
            movimentacoes: arrayUnion({
              id: `mov_${Date.now()}`,
              tipo: 'fechamento',
              valor: saldoContado,
              formaPagamento: null,
              timestamp: Timestamp.now(),
              usuario: {
                uid: operadorAtual.uid,
                nome: operadorAtual.displayName || operadorAtual.email
              },
              observacao: observacoes || 'Fechamento de caixa',
              vendaId: null,
              autorizadoPor: autorizadoPor || null,
              comprovante: null
            })
          });

          // Limpar estado local
          set({ 
            caixaAtual: null,
            operadorAtual: null,
            isLoading: false,
            error: null
          });

          return { success: true, diferenca };
        } catch (error) {
          console.error('Erro ao fechar caixa:', error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // ============================================================================
      // CARREGAR CAIXA ABERTO
      // ============================================================================
      carregarCaixaAberto: async (operador) => {
        set({ isLoading: true, error: null });

        try {
          const caixasQuery = query(
            collection(db, 'caixas'),
            where('status', '==', 'aberto'),
            where('operadorAbertura.uid', '==', operador.uid),
            where('empresaId', '==', operador.empresaId),
            orderBy('dataAbertura', 'desc'),
            limit(1)
          );

          const caixasSnapshot = await getDocs(caixasQuery);

          if (caixasSnapshot.empty) {
            set({ caixaAtual: null, operadorAtual: null, isLoading: false });
            return { success: true, data: null };
          }

          const caixaDoc = caixasSnapshot.docs[0];
          const caixaData = { id: caixaDoc.id, ...caixaDoc.data() };

          set({ 
            caixaAtual: caixaData,
            operadorAtual: operador,
            isLoading: false,
            error: null
          });

          return { success: true, data: caixaData };
        } catch (error) {
          console.error('Erro ao carregar caixa aberto:', error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // ============================================================================
      // LIMPAR ESTADO
      // ============================================================================
      limparCaixa: () => {
        set({ 
          caixaAtual: null,
          operadorAtual: null,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'caixa-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        caixaAtual: state.caixaAtual,
        operadorAtual: state.operadorAtual
      })
    }
  )
);

export default useCaixaStore;
