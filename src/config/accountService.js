/**
 * Serviço para gerenciar contas a pagar e receber
 * Controla fluxo de caixa, vencimentos e pagamentos
 */

import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

class AccountService {
  constructor() {
    this.accountsCollection = 'contas';
    this.categoriesCollection = 'categorias_contas';
    this.paymentsCollection = 'pagamentos';
  }

  /**
   * Cria uma nova conta a pagar ou receber
   * @param {Object} accountData - Dados da conta
   * @returns {Object} Conta criada
   */
  async createAccount(accountData) {
    try {
      console.log('💰 Criando nova conta:', accountData);

      // Validar dados obrigatórios
      this.validateAccountData(accountData);

      const account = {
        ...accountData,
        status: accountData.status || 'pendente',
        dataVencimento: accountData.dataVencimento instanceof Date ? 
          Timestamp.fromDate(accountData.dataVencimento) : 
          Timestamp.fromDate(new Date(accountData.dataVencimento)),
        dataCriacao: Timestamp.now(),
        dataAtualizacao: Timestamp.now(),
        valorPago: 0,
        valorRestante: accountData.valor,
        juros: 0,
        multa: 0,
        desconto: 0,
        observacoes: accountData.observacoes || '',
        anexos: accountData.anexos || [],
        parcelas: accountData.parcelas || 1,
        parcelaAtual: accountData.parcelaAtual || 1,
        contaPai: accountData.contaPai || null, // Para contas parceladas
        ativo: true
      };

      const docRef = await addDoc(collection(db, this.accountsCollection), account);
      
      console.log('✅ Conta criada com sucesso:', docRef.id);
      
      return {
        id: docRef.id,
        ...account,
        dataVencimento: account.dataVencimento.toDate(),
        dataCriacao: account.dataCriacao.toDate(),
        dataAtualizacao: account.dataAtualizacao.toDate()
      };
    } catch (error) {
      console.error('❌ Erro ao criar conta:', error);
      throw error;
    }
  }

  /**
   * Cria contas parceladas
   * @param {Object} accountData - Dados da conta principal
   * @param {number} parcelas - Número de parcelas
   * @returns {Array} Contas criadas
   */
  async createInstallmentAccounts(accountData, parcelas) {
    try {
      console.log('📅 Criando contas parceladas:', { accountData, parcelas });

      if (parcelas < 2) {
        throw new Error('Número de parcelas deve ser maior que 1');
      }

      const valorParcela = accountData.valor / parcelas;
      const dataBase = new Date(accountData.dataVencimento);
      const accounts = [];

      // Criar conta principal (controle)
      const mainAccount = await this.createAccount({
        ...accountData,
        descricao: `${accountData.descricao} (Parcelado ${parcelas}x)`,
        valor: accountData.valor,
        parcelas,
        parcelaAtual: 0,
        status: 'parcelado',
        tipo: accountData.tipo
      });

      // Criar parcelas individuais
      for (let i = 1; i <= parcelas; i++) {
        const dataVencimento = new Date(dataBase);
        dataVencimento.setMonth(dataBase.getMonth() + (i - 1));

        const parcela = await this.createAccount({
          ...accountData,
          descricao: `${accountData.descricao} (${i}/${parcelas})`,
          valor: valorParcela,
          dataVencimento,
          parcelas,
          parcelaAtual: i,
          contaPai: mainAccount.id
        });

        accounts.push(parcela);
      }

      console.log('✅ Contas parceladas criadas:', accounts.length);
      return { mainAccount, parcelas: accounts };
    } catch (error) {
      console.error('❌ Erro ao criar contas parceladas:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma conta
   * @param {string} accountId - ID da conta
   * @param {Object} updateData - Dados para atualização
   * @returns {Object} Conta atualizada
   */
  async updateAccount(accountId, updateData) {
    try {
      console.log('📝 Atualizando conta:', { accountId, updateData });

      const accountRef = doc(db, this.accountsCollection, accountId);
      
      // Preparar dados para atualização
      const dataToUpdate = {
        ...updateData,
        dataAtualizacao: Timestamp.now()
      };

      // Converter datas se necessário
      if (updateData.dataVencimento) {
        dataToUpdate.dataVencimento = updateData.dataVencimento instanceof Date ?
          Timestamp.fromDate(updateData.dataVencimento) :
          Timestamp.fromDate(new Date(updateData.dataVencimento));
      }

      await updateDoc(accountRef, dataToUpdate);
      
      // Buscar conta atualizada
      const updatedAccount = await this.getAccountById(accountId);
      
      console.log('✅ Conta atualizada com sucesso');
      return updatedAccount;
    } catch (error) {
      console.error('❌ Erro ao atualizar conta:', error);
      throw error;
    }
  }

  /**
   * Registra pagamento de uma conta
   * @param {string} accountId - ID da conta
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Object} Resultado do pagamento
   */
  async registerPayment(accountId, paymentData) {
    try {
      console.log('💳 Registrando pagamento:', { accountId, paymentData });

      const account = await this.getAccountById(accountId);
      
      if (!account) {
        throw new Error('Conta não encontrada');
      }

      if (account.status === 'pago') {
        throw new Error('Conta já está paga');
      }

      // Calcular juros e multa se em atraso
      const today = new Date();
      const dueDate = new Date(account.dataVencimento);
      const isLate = today > dueDate;
      
      let juros = 0;
      let multa = 0;
      
      if (isLate && paymentData.calcularJurosMulta !== false) {
        const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        
        // Multa de 2% + juros de 1% ao mês (simplificado)
        multa = account.valor * 0.02;
        juros = account.valor * 0.01 * (daysLate / 30);
      }

      const valorTotal = account.valor + juros + multa - (paymentData.desconto || 0);
      const valorPago = paymentData.valorPago || valorTotal;
      
      // Registrar pagamento
      const payment = {
        contaId: accountId,
        valorOriginal: account.valor,
        valorPago,
        juros,
        multa,
        desconto: paymentData.desconto || 0,
        valorTotal,
        formaPagamento: paymentData.formaPagamento,
        dataPagamento: paymentData.dataPagamento ? 
          Timestamp.fromDate(new Date(paymentData.dataPagamento)) : 
          Timestamp.now(),
        observacoes: paymentData.observacoes || '',
        comprovante: paymentData.comprovante || null,
        createdAt: Timestamp.now()
      };

      const paymentRef = await addDoc(collection(db, this.paymentsCollection), payment);

      // Atualizar status da conta
      const newStatus = valorPago >= valorTotal ? 'pago' : 'parcial';
      const valorPagoTotal = account.valorPago + valorPago;
      const valorRestante = Math.max(0, account.valor - valorPagoTotal);

      await this.updateAccount(accountId, {
        status: newStatus,
        valorPago: valorPagoTotal,
        valorRestante,
        juros: account.juros + juros,
        multa: account.multa + multa,
        desconto: account.desconto + (paymentData.desconto || 0),
        dataPagamento: newStatus === 'pago' ? payment.dataPagamento : null
      });

      console.log('✅ Pagamento registrado com sucesso');
      
      return {
        paymentId: paymentRef.id,
        payment: {
          id: paymentRef.id,
          ...payment,
          dataPagamento: payment.dataPagamento.toDate()
        },
        account: await this.getAccountById(accountId)
      };
    } catch (error) {
      console.error('❌ Erro ao registrar pagamento:', error);
      throw error;
    }
  }

  /**
   * Busca contas por filtros
   * @param {Object} filters - Filtros de busca
   * @returns {Array} Lista de contas
   */
  async getAccounts(filters = {}) {
    try {
      console.log('🔍 Buscando contas:', filters);

      let q = collection(db, this.accountsCollection);
      const constraints = [];

      // Aplicar filtros
      if (filters.tipo) {
        constraints.push(where('tipo', '==', filters.tipo));
      }
      
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      
      if (filters.categoria) {
        constraints.push(where('categoria', '==', filters.categoria));
      }
      
      if (filters.dataInicio && filters.dataFim) {
        constraints.push(
          where('dataVencimento', '>=', Timestamp.fromDate(new Date(filters.dataInicio))),
          where('dataVencimento', '<=', Timestamp.fromDate(new Date(filters.dataFim)))
        );
      }
      
      if (filters.vencidas) {
        constraints.push(where('dataVencimento', '<', Timestamp.now()));
        constraints.push(where('status', '!=', 'pago'));
      }

      // Ordenação
      constraints.push(orderBy('dataVencimento', filters.order || 'asc'));
      
      // Limite
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      q = query(q, ...constraints);
      const querySnapshot = await getDocs(q);
      
      const accounts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        accounts.push({
          id: doc.id,
          ...data,
          dataVencimento: data.dataVencimento?.toDate(),
          dataCriacao: data.dataCriacao?.toDate(),
          dataAtualizacao: data.dataAtualizacao?.toDate(),
          dataPagamento: data.dataPagamento?.toDate()
        });
      });

      console.log(`✅ ${accounts.length} contas encontradas`);
      return accounts;
    } catch (error) {
      console.error('❌ Erro ao buscar contas:', error);
      throw error;
    }
  }

  /**
   * Busca uma conta específica
   * @param {string} accountId - ID da conta
   * @returns {Object} Dados da conta
   */
  async getAccountById(accountId) {
    try {
      const accountDoc = await getDoc(doc(db, this.accountsCollection, accountId));
      
      if (!accountDoc.exists()) {
        return null;
      }

      const data = accountDoc.data();
      return {
        id: accountDoc.id,
        ...data,
        dataVencimento: data.dataVencimento?.toDate(),
        dataCriacao: data.dataCriacao?.toDate(),
        dataAtualizacao: data.dataAtualizacao?.toDate(),
        dataPagamento: data.dataPagamento?.toDate()
      };
    } catch (error) {
      console.error('❌ Erro ao buscar conta:', error);
      throw error;
    }
  }

  /**
   * Busca pagamentos de uma conta
   * @param {string} accountId - ID da conta
   * @returns {Array} Lista de pagamentos
   */
  async getAccountPayments(accountId) {
    try {
      const q = query(
        collection(db, this.paymentsCollection),
        where('contaId', '==', accountId),
        orderBy('dataPagamento', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const payments = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        payments.push({
          id: doc.id,
          ...data,
          dataPagamento: data.dataPagamento?.toDate()
        });
      });

      return payments;
    } catch (error) {
      console.error('❌ Erro ao buscar pagamentos:', error);
      throw error;
    }
  }

  /**
   * Exclui uma conta
   * @param {string} accountId - ID da conta
   * @returns {boolean} Sucesso da operação
   */
  async deleteAccount(accountId) {
    try {
      console.log('🗑️ Excluindo conta:', accountId);

      const account = await this.getAccountById(accountId);
      
      if (!account) {
        throw new Error('Conta não encontrada');
      }

      if (account.status === 'pago') {
        throw new Error('Não é possível excluir conta já paga');
      }

      // Excluir pagamentos relacionados
      const payments = await this.getAccountPayments(accountId);
      for (const payment of payments) {
        await deleteDoc(doc(db, this.paymentsCollection, payment.id));
      }

      // Excluir conta
      await deleteDoc(doc(db, this.accountsCollection, accountId));
      
      console.log('✅ Conta excluída com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao excluir conta:', error);
      throw error;
    }
  }

  /**
   * Gera relatório de fluxo de caixa
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Object} Relatório de fluxo de caixa
   */
  async getCashFlowReport(startDate, endDate) {
    try {
      console.log('📊 Gerando relatório de fluxo de caixa:', { startDate, endDate });

      const accounts = await this.getAccounts({
        dataInicio: startDate,
        dataFim: endDate,
        limit: 1000
      });

      const report = {
        periodo: { inicio: startDate, fim: endDate },
        contasReceber: {
          total: 0,
          pagas: 0,
          pendentes: 0,
          vencidas: 0,
          valorTotal: 0,
          valorPago: 0,
          valorPendente: 0
        },
        contasPagar: {
          total: 0,
          pagas: 0,
          pendentes: 0,
          vencidas: 0,
          valorTotal: 0,
          valorPago: 0,
          valorPendente: 0
        },
        saldo: {
          receber: 0,
          pagar: 0,
          liquido: 0
        }
      };

      const today = new Date();

      accounts.forEach(account => {
        const isReceivable = account.tipo === 'receber';
        const isPayable = account.tipo === 'pagar';
        const isOverdue = new Date(account.dataVencimento) < today && account.status !== 'pago';
        
        if (isReceivable) {
          report.contasReceber.total++;
          report.contasReceber.valorTotal += account.valor;
          
          if (account.status === 'pago') {
            report.contasReceber.pagas++;
            report.contasReceber.valorPago += account.valorPago;
          } else {
            report.contasReceber.pendentes++;
            report.contasReceber.valorPendente += account.valorRestante;
            
            if (isOverdue) {
              report.contasReceber.vencidas++;
            }
          }
        }
        
        if (isPayable) {
          report.contasPagar.total++;
          report.contasPagar.valorTotal += account.valor;
          
          if (account.status === 'pago') {
            report.contasPagar.pagas++;
            report.contasPagar.valorPago += account.valorPago;
          } else {
            report.contasPagar.pendentes++;
            report.contasPagar.valorPendente += account.valorRestante;
            
            if (isOverdue) {
              report.contasPagar.vencidas++;
            }
          }
        }
      });

      // Calcular saldos
      report.saldo.receber = report.contasReceber.valorPendente;
      report.saldo.pagar = report.contasPagar.valorPendente;
      report.saldo.liquido = report.saldo.receber - report.saldo.pagar;

      console.log('✅ Relatório de fluxo de caixa gerado');
      return report;
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de fluxo de caixa:', error);
      throw error;
    }
  }

  /**
   * Busca contas vencidas
   * @param {number} days - Dias de atraso (opcional)
   * @returns {Array} Contas vencidas
   */
  async getOverdueAccounts(days = null) {
    try {
      const today = new Date();
      let dateLimit = today;
      
      if (days) {
        dateLimit = new Date();
        dateLimit.setDate(today.getDate() - days);
      }

      return await this.getAccounts({
        vencidas: true,
        dataFim: dateLimit,
        limit: 500
      });
    } catch (error) {
      console.error('❌ Erro ao buscar contas vencidas:', error);
      throw error;
    }
  }

  /**
   * Busca contas que vencem em X dias
   * @param {number} days - Dias para vencimento
   * @returns {Array} Contas que vencem
   */
  async getAccountsDueSoon(days = 7) {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      return await this.getAccounts({
        dataInicio: today,
        dataFim: futureDate,
        status: 'pendente',
        limit: 500
      });
    } catch (error) {
      console.error('❌ Erro ao buscar contas a vencer:', error);
      throw error;
    }
  }

  /**
   * Valida dados da conta
   * @param {Object} accountData - Dados da conta
   */
  validateAccountData(accountData) {
    const required = ['descricao', 'valor', 'dataVencimento', 'tipo'];
    
    for (const field of required) {
      if (!accountData[field]) {
        throw new Error(`Campo obrigatório: ${field}`);
      }
    }

    if (!['pagar', 'receber'].includes(accountData.tipo)) {
      throw new Error('Tipo deve ser "pagar" ou "receber"');
    }

    if (accountData.valor <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }
  }

  /**
   * Calcula estatísticas das contas
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Object} Estatísticas
   */
  async getAccountsStats(startDate, endDate) {
    try {
      const accounts = await this.getAccounts({
        dataInicio: startDate,
        dataFim: endDate,
        limit: 1000
      });

      const stats = {
        totalContas: accounts.length,
        contasReceber: accounts.filter(a => a.tipo === 'receber').length,
        contasPagar: accounts.filter(a => a.tipo === 'pagar').length,
        contasPagas: accounts.filter(a => a.status === 'pago').length,
        contasPendentes: accounts.filter(a => a.status === 'pendente').length,
        contasVencidas: accounts.filter(a => {
          return new Date(a.dataVencimento) < new Date() && a.status !== 'pago';
        }).length,
        valorTotal: accounts.reduce((sum, a) => sum + a.valor, 0),
        valorPago: accounts.reduce((sum, a) => sum + a.valorPago, 0),
        valorPendente: accounts.reduce((sum, a) => sum + a.valorRestante, 0)
      };

      return stats;
    } catch (error) {
      console.error('❌ Erro ao calcular estatísticas:', error);
      throw error;
    }
  }
}

const accountService = new AccountService();
export default accountService;