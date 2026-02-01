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
import { checkOperationalLimit, recordOperation } from '../utils/operationalLimits';

const EXPIRATION_HOURS = 48;

// CONFIGURAÇÕES DE MARGEM E DESCONTO
const MARGIN_CONFIG = {
  minimumMarginPercent: 15, // Margem mínima de 15%
  warningMarginPercent: 25, // Alerta se margem < 25%
  targetMarginPercent: 35,  // Margem alvo de 35%
};

const DISCOUNT_CONFIG = {
  maxDiscountPercentWithoutApproval: 10, // Máximo 10% sem aprovação
  maxDiscountPercentWithApproval: 30,    // Máximo 30% com aprovação
  requiresReasonAbovePercent: 5,         // Exige motivo se > 5%
};

export const useBudgetStore = create((set, get) => ({
  // State
  budgets: [],
  currentBudget: null,
  isLoading: false,
  error: null,
  marginConfig: MARGIN_CONFIG,
  discountConfig: DISCOUNT_CONFIG,

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

  // ========== VALIDAÇÕES FINANCEIRAS ==========

  // Calcular margem de um item
  calculateItemMargin: (item) => {
    const cost = item.cost || 0;
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    
    const totalCost = cost * quantity;
    const totalPrice = price * quantity;
    const marginValue = totalPrice - totalCost;
    const marginPercent = totalCost > 0 ? (marginValue / totalCost) * 100 : 0;
    
    return {
      cost: totalCost,
      price: totalPrice,
      marginValue,
      marginPercent,
      isNegative: marginValue < 0,
      isLow: marginPercent < MARGIN_CONFIG.minimumMarginPercent,
      isWarning: marginPercent < MARGIN_CONFIG.warningMarginPercent,
      isGood: marginPercent >= MARGIN_CONFIG.targetMarginPercent
    };
  },

  // Calcular margem total do orçamento
  calculateBudgetMargin: (items, discount = 0) => {
    const totals = items.reduce((acc, item) => {
      const margin = get().calculateItemMargin(item);
      return {
        totalCost: acc.totalCost + margin.cost,
        totalPrice: acc.totalPrice + margin.price,
        totalMarginValue: acc.totalMarginValue + margin.marginValue
      };
    }, { totalCost: 0, totalPrice: 0, totalMarginValue: 0 });
    
    const subtotal = totals.totalPrice;
    const finalTotal = Math.max(0, subtotal - discount);
    const finalMarginValue = finalTotal - totals.totalCost;
    const finalMarginPercent = totals.totalCost > 0 ? (finalMarginValue / totals.totalCost) * 100 : 0;
    
    return {
      subtotal,
      discount,
      total: finalTotal,
      totalCost: totals.totalCost,
      marginValue: finalMarginValue,
      marginPercent: finalMarginPercent,
      isNegative: finalMarginValue < 0,
      isLow: finalMarginPercent < MARGIN_CONFIG.minimumMarginPercent,
      isWarning: finalMarginPercent < MARGIN_CONFIG.warningMarginPercent,
      isGood: finalMarginPercent >= MARGIN_CONFIG.targetMarginPercent,
      discountPercent: subtotal > 0 ? (discount / subtotal) * 100 : 0
    };
  },

  // Validar item do orçamento
  validateBudgetItem: (item) => {
    const errors = [];
    
    // Validar nome
    if (!item.name || item.name.trim().length < 3) {
      errors.push('Nome do item deve ter no mínimo 3 caracteres');
    }
    
    // Validar descrição (obrigatória para serviços)
    if (item.type === 'service' && (!item.description || item.description.trim().length < 10)) {
      errors.push('Descrição do serviço deve ter no mínimo 10 caracteres');
    }
    
    // Validar quantidade
    if (!item.quantity || item.quantity < 1) {
      errors.push('Quantidade deve ser maior que zero');
    }
    
    // Validar custo
    if (item.cost === undefined || item.cost < 0) {
      errors.push('Custo é obrigatório e deve ser maior ou igual a zero');
    }
    
    // Validar preço
    if (!item.price || item.price <= 0) {
      errors.push('Preço deve ser maior que zero');
    }
    
    // Validar margem
    if (item.cost !== undefined && item.price !== undefined) {
      const margin = get().calculateItemMargin(item);
      
      if (margin.isNegative) {
        errors.push(`CRÍTICO: Preço (R$ ${item.price.toFixed(2)}) é menor que o custo (R$ ${item.cost.toFixed(2)}). Prejuízo de R$ ${Math.abs(margin.marginValue).toFixed(2)}`);
      } else if (margin.isLow) {
        errors.push(`ALERTA: Margem muito baixa (${margin.marginPercent.toFixed(1)}%). Mínimo recomendado: ${MARGIN_CONFIG.minimumMarginPercent}%`);
      }
    }
    
    // Validar prioridade
    if (!item.priority || !['required', 'recommended', 'optional'].includes(item.priority)) {
      errors.push('Prioridade é obrigatória (obrigatório, recomendado ou opcional)');
    }
    
    // Validar prazo de entrega
    if (!item.deliveryDays || item.deliveryDays < 0) {
      errors.push('Prazo de entrega é obrigatório');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: errors.filter(e => e.startsWith('ALERTA')),
      critical: errors.filter(e => e.startsWith('CRÍTICO'))
    };
  },

  // Validar desconto
  validateDiscount: (subtotal, discount, operatorRole = 'operator', discountReason = '') => {
    const errors = [];
    const warnings = [];
    
    if (discount < 0) {
      errors.push('Desconto não pode ser negativo');
      return { valid: false, errors, warnings, requiresApproval: false };
    }
    
    if (discount > subtotal) {
      errors.push('Desconto não pode ser maior que o subtotal');
      return { valid: false, errors, warnings, requiresApproval: false };
    }
    
    const discountPercent = subtotal > 0 ? (discount / subtotal) * 100 : 0;
    
    // Verificar se exige motivo
    if (discountPercent > DISCOUNT_CONFIG.requiresReasonAbovePercent && !discountReason) {
      errors.push(`Desconto acima de ${DISCOUNT_CONFIG.requiresReasonAbovePercent}% exige motivo`);
    }
    
    // Verificar se exige aprovação
    const requiresApproval = discountPercent > DISCOUNT_CONFIG.maxDiscountPercentWithoutApproval;
    
    if (requiresApproval && operatorRole !== 'manager' && operatorRole !== 'owner') {
      if (discountPercent > DISCOUNT_CONFIG.maxDiscountPercentWithApproval) {
        errors.push(`Desconto de ${discountPercent.toFixed(1)}% excede o máximo permitido (${DISCOUNT_CONFIG.maxDiscountPercentWithApproval}%)`);
      } else {
        warnings.push(`Desconto de ${discountPercent.toFixed(1)}% requer aprovação do gerente/dono`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      requiresApproval,
      discountPercent
    };
  },

  // Validar orçamento completo
  validateBudget: (budgetData, operatorRole = 'operator') => {
    const errors = [];
    const warnings = [];
    
    // Validar cliente
    if (!budgetData.clientName || budgetData.clientName.trim().length < 3) {
      errors.push('Nome do cliente é obrigatório');
    }
    
    if (!budgetData.clientPhone || budgetData.clientPhone.trim().length < 10) {
      errors.push('Telefone do cliente é obrigatório');
    }
    
    // Validar veículo
    if (!budgetData.vehiclePlate || budgetData.vehiclePlate.trim().length < 7) {
      errors.push('Placa do veículo é obrigatória');
    }
    
    // Validar itens
    if (!budgetData.items || budgetData.items.length === 0) {
      errors.push('Orçamento deve ter pelo menos um item');
    } else {
      // Validar cada item
      budgetData.items.forEach((item, index) => {
        const itemValidation = get().validateBudgetItem(item);
        if (!itemValidation.valid) {
          errors.push(`Item ${index + 1} (${item.name}): ${itemValidation.errors.join(', ')}`);
        }
        if (itemValidation.warnings.length > 0) {
          warnings.push(`Item ${index + 1} (${item.name}): ${itemValidation.warnings.join(', ')}`);
        }
      });
      
      // Validar margem total
      const margin = get().calculateBudgetMargin(budgetData.items, budgetData.discount || 0);
      
      if (margin.isNegative) {
        errors.push(`CRÍTICO: Orçamento com prejuízo de R$ ${Math.abs(margin.marginValue).toFixed(2)}. Não é possível criar orçamento com margem negativa.`);
      } else if (margin.isLow) {
        errors.push(`CRÍTICO: Margem total muito baixa (${margin.marginPercent.toFixed(1)}%). Mínimo recomendado: ${MARGIN_CONFIG.minimumMarginPercent}%`);
      } else if (margin.isWarning) {
        warnings.push(`ALERTA: Margem total abaixo do ideal (${margin.marginPercent.toFixed(1)}%). Recomendado: ${MARGIN_CONFIG.targetMarginPercent}%`);
      }
    }
    
    // Validar desconto
    if (budgetData.discount && budgetData.discount > 0) {
      const subtotal = budgetData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discountValidation = get().validateDiscount(
            );
        subtotal,
        budgetData.discount,
        operatorRole,
        budgetData.discountReason

      if (!discountValidation.valid) {
        errors.push(...discountValidation.errors);
      }
      if (discountValidation.warnings.length > 0) {
        warnings.push(...discountValidation.warnings);
      }
    }
    
    // Validar validade do orçamento
    if (!budgetData.validUntil) {
      warnings.push('Data de validade do orçamento não definida');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      canCreate: errors.filter(e => e.startsWith('CRÍTICO')).length === 0
    };
  },

  // Create new budget
  createBudget: async (budgetData) => {
    set({ isLoading: true, error: null });
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      const userRole = sessionStorage.getItem('userRole') || 'operator';
      
      // 🔥 BLAST RADIUS: Verificar limite operacional
      const limitCheck = checkOperationalLimit(userId, 'CREATE_BUDGET');
      if (!limitCheck.allowed) {
        throw new Error(limitCheck.error);
      }
      
      // VALIDAÇÃO ROBUSTA
      const validation = get().validateBudget(budgetData, userRole);
      
      if (!validation.canCreate) {
        const criticalErrors = validation.errors.filter(e => e.startsWith('CRÍTICO'));
        throw new Error(`Validação falhou:\n${criticalErrors.join('\n')}`);
      }
      
      // Mostrar warnings (não bloqueia, mas alerta)
      if (validation.warnings.length > 0) {
        }
      
      // Calcular margem total
      const margin = get().calculateBudgetMargin(budgetData.items, budgetData.discount || 0);
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + EXPIRATION_HOURS * 60 * 60 * 1000);
      
      // Reserve products from inventory (com transação)
      const reservedProducts = [];
      const inventoryStore = window.inventoryStore;
      
      try {
        if (inventoryStore && budgetData.items) {
          for (const item of budgetData.items) {
            if (item.type === 'product' && item.productId) {
              const result = await inventoryStore.updateStock(
                    );
                item.productId,
                item.quantity,
                'out',
                `Reservado para orçamento`

              if (!result.success) {
                throw new Error(`Erro ao reservar produto: ${item.name}`);
              }
              reservedProducts.push({ productId: item.productId, quantity: item.quantity });
            }
          }
        }
      } catch (error) {
        // Rollback: devolver produtos já reservados
        console.error('❌ Erro ao reservar produtos, fazendo rollback...', error);
        for (const reserved of reservedProducts) {
          await inventoryStore.updateStock(
            reserved.productId,
            reserved.quantity,
            'in',
            `Rollback - erro ao criar orçamento`
          );
        }
        throw error;
      }
      
      const approvalLink = uuidv4();
      const budgetNumber = get().generateBudgetNumber();
      
      const newBudget = {
        ...budgetData,
        budgetNumber,
        approvalLink,
        status: 'draft', // Começa como rascunho
        
        // Dados financeiros
        subtotal: margin.subtotal,
        discount: budgetData.discount || 0,
        discountReason: budgetData.discountReason || '',
        discountPercent: margin.discountPercent,
        total: margin.total,
        totalCost: margin.totalCost,
        marginValue: margin.marginValue,
        marginPercent: margin.marginPercent,
        
        // Metadados
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        createdBy: userId,
        createdByName: userName,
        createdByRole: userRole,
        
        // Versionamento
        version: 1,
        history: [{
          version: 1,
          action: 'created',
          createdAt: now.toISOString(),
          userId,
          userName,
          items: budgetData.items,
          total: margin.total,
          marginPercent: margin.marginPercent,
          reason: 'Criação inicial do orçamento'
        }],
        
        // Validações
        validationWarnings: validation.warnings
      };

      const budgetWithId = await addDocument('budgets', newBudget);

      set((state) => ({
        budgets: [budgetWithId, ...state.budgets],
        isLoading: false,
      }));

      // 🔥 AUDITORIA: Registrar operação
      recordOperation(userId, 'CREATE_BUDGET', {
        budgetId: budgetWithId.id,
        remaining: limitCheck.remaining
      });

      return { 
        success: true, 
        data: budgetWithId,
        warnings: validation.warnings
      };
    } catch (error) {
      console.error('❌ Erro ao criar orçamento:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update budget
  updateBudget: async (budgetId, updates, reason = 'Atualização do orçamento') => {
    set({ isLoading: true, error: null });
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      const currentBudget = get().budgets.find(b => b.id === budgetId || b.firestoreId === budgetId);
      
      if (!currentBudget) {
        throw new Error('Orçamento não encontrado');
      }
      
      // Se atualizou itens ou desconto, recalcular margem
      let marginData = {};
      if (updates.items || updates.discount !== undefined) {
        const items = updates.items || currentBudget.items;
        const discount = updates.discount !== undefined ? updates.discount : currentBudget.discount;
        const margin = get().calculateBudgetMargin(items, discount);
        
        marginData = {
          subtotal: margin.subtotal,
          discount,
          discountPercent: margin.discountPercent,
          total: margin.total,
          totalCost: margin.totalCost,
          marginValue: margin.marginValue,
          marginPercent: margin.marginPercent
        };
      }
      
      const updatedData = {
        ...updates,
        ...marginData,
        updatedAt: new Date().toISOString(),
        version: (currentBudget?.version || 0) + 1
      };

      // Add to history with detailed diff
      const historyEntry = {
        version: (currentBudget.version || 0) + 1,
        action: 'updated',
        createdAt: new Date().toISOString(),
        userId,
        userName,
        reason,
        changes: {
          items: updates.items ? {
            before: currentBudget.items?.length || 0,
            after: updates.items.length
          } : undefined,
          discount: updates.discount !== undefined ? {
            before: currentBudget.discount || 0,
            after: updates.discount
          } : undefined,
          total: marginData.total ? {
            before: currentBudget.total || 0,
            after: marginData.total
          } : undefined,
          marginPercent: marginData.marginPercent ? {
            before: currentBudget.marginPercent || 0,
            after: marginData.marginPercent
          } : undefined
        }
      };
      
      updatedData.history = [...(currentBudget.history || []), historyEntry];

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
      // Buscar orçamento no estado ou no Firestore
      let budget = get().budgets.find(b => b.id === budgetId || b.firestoreId === budgetId);
      
      // Se não encontrou no estado, buscar no Firestore
      if (!budget) {
        const result = await get().getBudgetById(budgetId);
        if (!result.success) {
          throw new Error('Orçamento não encontrado');
        }
        budget = result.data;
      }

      const allApproved = approvedItems.length === budget.items.length;
      const status = allApproved ? 'approved' : 'partially_approved';
      
      // Calcular novo total baseado nos itens aprovados
      const newTotal = approvedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const updateData = {
        status,
        approvedItems,
        approvedAt: new Date().toISOString(),
        total: newTotal
      };
      
      const updateResult = await get().updateBudget(budgetId, updateData);
      
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
      const budgets = await queryDocuments('budgets', {
        where: [{ field: 'approvalLink', operator: '==', value: approvalLink }]
      });

      if (budgets.length === 0) {
        console.error('❌ Nenhum orçamento encontrado com approvalLink:', approvalLink);
        
        set({ error: 'Orçamento não encontrado', isLoading: false });
        return { success: false, error: 'Orçamento não encontrado' };
      }

      const budget = budgets[0];
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
    const draft = budgets.filter(b => b.status === 'draft').length;
    const sent = budgets.filter(b => b.status === 'sent').length;
    const viewed = budgets.filter(b => b.status === 'viewed').length;
    const pending = budgets.filter(b => b.status === 'pending').length;
    const approved = budgets.filter(b => b.status === 'approved').length;
    const partiallyApproved = budgets.filter(b => b.status === 'partially_approved').length;
    const rejected = budgets.filter(b => b.status === 'rejected').length;
    const expired = budgets.filter(b => b.status === 'expired').length;
    const converted = budgets.filter(b => b.convertedToCheckin).length;

    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;

    const totalValue = budgets.reduce((sum, b) => sum + (b.total || 0), 0);
    const approvedValue = budgets
      .filter(b => b.status === 'approved' || b.status === 'partially_approved')
      .reduce((sum, b) => sum + (b.total || 0), 0);
    
    // Estatísticas de margem
    const budgetsWithMargin = budgets.filter(b => b.marginPercent !== undefined);
    const averageMargin = budgetsWithMargin.length > 0
      ? budgetsWithMargin.reduce((sum, b) => sum + (b.marginPercent || 0), 0) / budgetsWithMargin.length
      : 0;
    
    const totalMarginValue = budgets.reduce((sum, b) => sum + (b.marginValue || 0), 0);
    
    // Estatísticas de desconto
    const budgetsWithDiscount = budgets.filter(b => b.discount && b.discount > 0);
    const averageDiscount = budgetsWithDiscount.length > 0
      ? budgetsWithDiscount.reduce((sum, b) => sum + (b.discountPercent || 0), 0) / budgetsWithDiscount.length
      : 0;

    return {
      total,
      draft,
      sent,
      viewed,
      pending,
      approved,
      partiallyApproved,
      rejected,
      expired,
      converted,
      conversionRate,
      totalValue,
      approvedValue,
      averageMargin,
      totalMarginValue,
      averageDiscount,
      budgetsWithDiscount: budgetsWithDiscount.length
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
