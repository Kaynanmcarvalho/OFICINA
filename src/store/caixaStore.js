import { create } from 'zustand';
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { executeIdempotent } from '../utils/idempotency';

export const useCaixaStore = create((set, get) => ({
  // State
  movements: [],
  isLoading: false,
  error: null,
  balance: 0,
  caixaAtual: null, // Caixa aberto atual

  // Carregar caixa aberto
  carregarCaixaAberto: async (user) => {
    if (!user?.empresaId) {
      set({ error: 'Empresa não identificada', caixaAtual: null });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // 🔒 SEGURANÇA: Query com validação de empresaId
      const q = query(
        collection(db, 'caixas'),
        where('empresaId', '==', user.empresaId),
        where('status', '==', 'aberto'),
        orderBy('dataAbertura', 'desc')
      );

      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const caixaDoc = snapshot.docs[0];
        const caixaData = caixaDoc.data();
        
        // 🔒 VALIDAÇÃO ADICIONAL: Verificar se empresaId do documento corresponde
        if (caixaData.empresaId !== user.empresaId) {
          console.error('🚨 TENTATIVA DE ACESSO CROSS-TENANT BLOQUEADA');
          set({ error: 'Acesso negado', caixaAtual: null, isLoading: false });
          return;
        }
        
        const caixaAtual = {
          id: caixaDoc.id,
          ...caixaData,
          dataAbertura: caixaData.dataAbertura?.toDate?.() || new Date(caixaData.dataAbertura)
        };
        
        set({ caixaAtual, isLoading: false });
        
        // Carregar movimentações do caixa
        await get().loadMovements(user.empresaId);
      } else {
        set({ caixaAtual: null, isLoading: false });
      }
    } catch (error) {
      console.error('Erro ao carregar caixa aberto:', error);
      set({ error: error.message, isLoading: false, caixaAtual: null });
    }
  },

  // Registrar venda no caixa
  // 🔥 IDEMPOTÊNCIA: Previne duplicação de vendas
  registrarVenda: async (tenantId, venda) => {
    if (!tenantId) {
      throw new Error('TenantId não fornecido');
    }

    const caixaAtual = get().caixaAtual;
    if (!caixaAtual) {
      throw new Error('Nenhum caixa aberto');
    }

    // 🔥 IDEMPOTÊNCIA: Executar com proteção contra duplicação
    const userId = sessionStorage.getItem('userId') || 'unknown';
    const idempotencyData = {
      vendaId: venda.id,
      total: venda.total,
      caixaId: caixaAtual.id,
      timestamp: Date.now()
    };

    return await executeIdempotent(
      'REGISTRAR_VENDA',
      userId,
      idempotencyData,
      async () => {
        try {
          // Adicionar movimentação de entrada
          const movement = {
            type: 'entrada',
            amount: venda.total,
            description: `Venda #${venda.id || 'N/A'}`,
            category: 'venda',
            paymentMethod: venda.paymentMethod,
            date: new Date(),
            vendaId: venda.id,
            clienteId: venda.clienteId,
            caixaId: caixaAtual.id
          };

          await get().addMovement(tenantId, movement);
          
          return movement;
        } catch (error) {
          console.error('Erro ao registrar venda:', error);
          throw error;
        }
      }
    );
  },

  // Carregar movimentações do Firestore
  loadMovements: async (tenantId) => {
    if (!tenantId) {
      set({ error: 'TenantId não fornecido', movements: [] });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // 🔒 SEGURANÇA: Query com validação de tenantId
      const q = query(
        collection(db, 'caixa'),
        where('tenantId', '==', tenantId),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      const movements = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // 🔒 VALIDAÇÃO ADICIONAL: Verificar se tenantId do documento corresponde
        if (data.tenantId !== tenantId) {
          console.error('🚨 TENTATIVA DE ACESSO CROSS-TENANT BLOQUEADA:', doc.id);
          return null;
        }
        
        return {
          firestoreId: doc.id,
          ...data,
          date: data.date?.toDate?.() || new Date(data.date)
        };
      }).filter(Boolean); // Remove nulls

      // Calcular saldo
      const balance = movements.reduce((sum, m) => {
        const amount = parseFloat(m.amount) || 0;
        return m.type === 'entrada' ? sum + amount : sum - amount;
      }, 0);

      set({ movements, balance, isLoading: false });
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
      set({ error: error.message, isLoading: false, movements: [] });
    }
  },

  // Adicionar movimentação
  addMovement: async (tenantId, movement) => {
    if (!tenantId) {
      throw new Error('TenantId não fornecido');
    }

    set({ isLoading: true, error: null });

    try {
      // 🔒 SEGURANÇA: Garantir que tenantId está no documento
      const docData = {
        ...movement,
        tenantId, // Forçar tenantId do parâmetro
        createdAt: Timestamp.now(),
        date: movement.date ? Timestamp.fromDate(new Date(movement.date)) : Timestamp.now()
      };
      
      // 🔒 VALIDAÇÃO: Remover qualquer tentativa de sobrescrever tenantId
      if (movement.tenantId && movement.tenantId !== tenantId) {
        console.error('🚨 TENTATIVA DE MANIPULAÇÃO DE TENANT BLOQUEADA');
        throw new Error('Acesso negado');
      }

      const docRef = await addDoc(collection(db, 'caixa'), docData);

      const newMovement = {
        firestoreId: docRef.id,
        ...movement,
        tenantId,
        createdAt: new Date(),
        date: movement.date ? new Date(movement.date) : new Date()
      };

      set(state => ({
        movements: [newMovement, ...state.movements],
        balance: movement.type === 'entrada' 
          ? state.balance + parseFloat(movement.amount)
          : state.balance - parseFloat(movement.amount),
        isLoading: false
      }));

      return newMovement;
    } catch (error) {
      console.error('Erro ao adicionar movimentação:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Atualizar movimentação
  updateMovement: async (movementId, updates) => {
    set({ isLoading: true, error: null });

    try {
      const docRef = doc(db, 'caixa', movementId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });

      set(state => ({
        movements: state.movements.map(m =>
          m.firestoreId === movementId ? { ...m, ...updates } : m
        ),
        isLoading: false
      }));

      // Recalcular saldo
      get().recalculateBalance();
    } catch (error) {
      console.error('Erro ao atualizar movimentação:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Deletar movimentação
  deleteMovement: async (movementId) => {
    set({ isLoading: true, error: null });

    try {
      await deleteDoc(doc(db, 'caixa', movementId));

      set(state => ({
        movements: state.movements.filter(m => m.firestoreId !== movementId),
        isLoading: false
      }));

      // Recalcular saldo
      get().recalculateBalance();
    } catch (error) {
      console.error('Erro ao deletar movimentação:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Recalcular saldo
  recalculateBalance: () => {
    const movements = get().movements;
    const balance = movements.reduce((sum, m) => {
      const amount = parseFloat(m.amount) || 0;
      return m.type === 'entrada' ? sum + amount : sum - amount;
    }, 0);

    set({ balance });
  },

  // Limpar store
  clearStore: () => {
    set({ movements: [], balance: 0, error: null, isLoading: false });
  }
}));

export default useCaixaStore;
