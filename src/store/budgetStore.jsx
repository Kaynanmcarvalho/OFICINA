import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  subscribeToCollection,
  queryDocuments
} from '../services/storeHelpers';

const EXPIRATION_HOURS = 48;

export const useBudgetStore = create((set, get) => ({
  // State
  budgets: [],
  currentBudget: null,
  isLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Generate budget number
  generateBudgetNumber: () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORC-${year}${month}-${random}`;
  },

  // Create new budget
  createBudget: async (budgetData) => {
    set({ isLoading: true, error: null });
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + EXPIRATION_HOURS * 60 * 60 * 1000);
      
      // Reserve products from inventory
      const inventoryStore = window.inventoryStore;
      if (inventoryStore && budgetData.items) {
        for (const item of budgetData.items) {
          if (item.type === 'product' && item.productId) {
            const result = await inventoryStore.updateStock(
              item.productId,
              item.quantity,
              'out',
              `Reservado para orçamento`
            );
            if (!result.success) {
              throw new Error(`Erro ao reservar produto: ${item.name}`);
            }
          }
        }
      }
      
      const approvalLink = uuidv4();
      const budgetNumber = get().generateBudgetNumber();
      
      const newBudget = {
        ...budgetData,
        budgetNumber,
        approvalLink,
        status: 'pending',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        version: 1,
        history: [{
          version: 1,
          createdAt: now.toISOString(),
          items: budgetData.items,
          total: budgetData.total
        }]
      };

      console.log('💾 Criando orçamento:', budgetNumber);
      console.log('🔗 ApprovalLink gerado:', approvalLink);
      console.log('📋 Link completo:', `${window.location.origin}/orcamento/aprovar/${approvalLink}`);

      const budgetWithId = await addDocument('budgets', newBudget);

      console.log('✅ Orçamento salvo com ID:', budgetWithId.id || budgetWithId.firestoreId);
      console.log('✅ ApprovalLink salvo:', budgetWithId.approvalLink);

      set((state) => ({
        budgets: [budgetWithId, ...state.budgets],
        isLoading: false,
      }));

      return { success: true, data: budgetWithId };
    } catch (error) {
      console.error('❌ Erro ao criar orçamento:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update budget
  updateBudget: async (budgetId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const currentBudget = get().budgets.find(b => b.id === budgetId || b.firestoreId === budgetId);
      
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
        version: (currentBudget?.version || 0) + 1
      };

      // Add to history if items changed
      if (updates.items && currentBudget) {
        const historyEntry = {
          version: (currentBudget.version || 0) + 1,
          createdAt: new Date().toISOString(),
          items: updates.items,
          total: updates.total
        };
        updatedData.history = [...(currentBudget.history || []), historyEntry];
      }

      await updateDocument('budgets', budgetId, updatedData);

      set((state) => ({
        budgets: state.budgets.map((budget) =>
          budget.id === budgetId || budget.firestoreId === budgetId
            ? { ...budget, ...updatedData }
            : budget
        ),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Expire budget and return products to stock
  expireBudget: async (budgetId) => {
    try {
      const budget = get().budgets.find(b => b.id === budgetId || b.firestoreId === budgetId);
      if (!budget || budget.status !== 'pending') return;

      // Return products to stock
      if (budget.items && budget.items.length > 0) {
        const inventoryStore = window.inventoryStore;
        if (inventoryStore) {
          for (const item of budget.items) {
            if (item.type === 'product' && item.productId) {
              await inventoryStore.updateStock(
                item.productId,
                item.quantity,
                'in',
                `Devolvido - orçamento expirado ${budget.budgetNumber}`
              );
            }
          }
        }
      }

      await get().updateBudget(budgetId, { status: 'expired' });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Approve budget (full or partial)
  approveBudget: async (budgetId, approvedItems) => {
    set({ isLoading: true, error: null });
    try {
      console.log('💾 Aprovando orçamento:', budgetId);
      console.log('📋 Itens aprovados:', approvedItems.length);
      
      // Buscar orçamento no estado ou no Firestore
      let budget = get().budgets.find(b => b.id === budgetId || b.firestoreId === budgetId);
      
      // Se não encontrou no estado, buscar no Firestore
      if (!budget) {
        console.log('⚠️ Orçamento não encontrado no estado, buscando no Firestore...');
        const result = await get().getBudgetById(budgetId);
        if (!result.success) {
          throw new Error('Orçamento não encontrado');
        }
        budget = result.data;
      }

      const allApproved = approvedItems.length === budget.items.length;
      const status = allApproved ? 'approved' : 'partially_approved';
      
      console.log('📊 Status:', status);
      console.log('📊 Todos aprovados?', allApproved);

      // Calcular novo total baseado nos itens aprovados
      const newTotal = approvedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const updateData = {
        status,
        approvedItems,
        approvedAt: new Date().toISOString(),
        total: newTotal
      };
      
      console.log('💾 Dados para atualizar:', updateData);

      const updateResult = await get().updateBudget(budgetId, updateData);
      
      console.log('✅ Resultado da atualização:', updateResult);

      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao aprovar orçamento:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Reject budget items
  rejectBudgetItems: async (budgetId, rejectedItemIds, reason) => {
    try {
      const budget = get().budgets.find(b => b.id === budgetId || b.firestoreId === budgetId);
      if (!budget) throw new Error('Orçamento não encontrado');

      // Remove dependent services
      const itemsToRemove = new Set(rejectedItemIds);
      budget.items.forEach(item => {
        if (item.type === 'service' && item.dependsOn) {
          if (rejectedItemIds.includes(item.dependsOn)) {
            itemsToRemove.add(item.id);
          }
        }
      });

      const remainingItems = budget.items.filter(item => !itemsToRemove.has(item.id));
      const rejectedItems = budget.items.filter(item => itemsToRemove.has(item.id));

      // Return rejected products to stock
      const inventoryStore = window.inventoryStore;
      if (inventoryStore) {
        for (const item of rejectedItems) {
          if (item.type === 'product' && item.productId) {
            await inventoryStore.updateStock(
              item.productId,
              item.quantity,
              'in',
              `Devolvido - item rejeitado no orçamento ${budget.budgetNumber}`
            );
          }
        }
      }

      const newTotal = remainingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await get().updateBudget(budgetId, {
        items: remainingItems,
        total: newTotal,
        rejectedItems: [...(budget.rejectedItems || []), ...rejectedItems.map(item => ({
          ...item,
          rejectedAt: new Date().toISOString(),
          reason
        }))]
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Fetch all budgets
  fetchBudgets: async () => {
    set({ isLoading: true, error: null });
    try {
      const budgets = await getAllDocuments('budgets', {
        orderBy: { field: 'createdAt', direction: 'desc' }
      });

      set({ budgets, isLoading: false });
      return { success: true, data: budgets };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get budget by ID
  getBudgetById: async (budgetId) => {
    set({ isLoading: true, error: null });
    try {
      const budget = await getDocumentById('budgets', budgetId);

      if (budget) {
        set({ currentBudget: budget, isLoading: false });
        return { success: true, data: budget };
      } else {
        set({ error: 'Orçamento não encontrado', isLoading: false });
        return { success: false, error: 'Orçamento não encontrado' };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get budget by approval link
  getBudgetByApprovalLink: async (approvalLink) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔍 Buscando orçamento com approvalLink:', approvalLink);
      
      const budgets = await queryDocuments('budgets', {
        where: [{ field: 'approvalLink', operator: '==', value: approvalLink }]
      });

      console.log('📦 Orçamentos encontrados:', budgets.length);
      
      if (budgets.length === 0) {
        console.error('❌ Nenhum orçamento encontrado com approvalLink:', approvalLink);
        
        // Debug: buscar todos os orçamentos para ver se o link existe
        const allBudgets = await getAllDocuments('budgets');
        console.log('📋 Total de orçamentos no banco:', allBudgets.length);
        console.log('📋 Primeiros 5 approvalLinks:', allBudgets.slice(0, 5).map(b => ({
          budgetNumber: b.budgetNumber,
          approvalLink: b.approvalLink
        })));
        
        set({ error: 'Orçamento não encontrado', isLoading: false });
        return { success: false, error: 'Orçamento não encontrado' };
      }

      const budget = budgets[0];
      console.log('✅ Orçamento encontrado:', budget.budgetNumber);
      set({ currentBudget: budget, isLoading: false });
      return { success: true, data: budget };
    } catch (error) {
      console.error('❌ Erro ao buscar orçamento:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get statistics
  getStatistics: () => {
    const { budgets } = get();

    const total = budgets.length;
    const pending = budgets.filter(b => b.status === 'pending').length;
    const approved = budgets.filter(b => b.status === 'approved').length;
    const partiallyApproved = budgets.filter(b => b.status === 'partially_approved').length;
    const expired = budgets.filter(b => b.status === 'expired').length;
    const converted = budgets.filter(b => b.convertedToCheckin).length;

    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;

    const totalValue = budgets.reduce((sum, b) => sum + (b.total || 0), 0);
    const approvedValue = budgets
      .filter(b => b.status === 'approved' || b.status === 'partially_approved')
      .reduce((sum, b) => sum + (b.total || 0), 0);

    return {
      total,
      pending,
      approved,
      partiallyApproved,
      expired,
      converted,
      conversionRate,
      totalValue,
      approvedValue
    };
  },

  // Real-time listener
  subscribeToBudgets: () => {
    return subscribeToCollection('budgets', (budgets) => {
      set({ budgets });
    }, {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  },
}));
