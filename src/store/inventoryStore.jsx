import { create } from 'zustand';
import toast from 'react-hot-toast';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  subscribeToCollection
} from '../services/storeHelpers';

// CONFIGURAÇÕES DE ESTOQUE
const INVENTORY_CONFIG = {
  maxQuantity: 99999, // Quantidade máxima por item
  maxAdjustment: 1000, // Ajuste máximo sem aprovação
  alertThreshold: 100, // Alerta para quantidades grandes
  decimalPlaces: 2, // Casas decimais permitidas
};

// TIPOS DE ITEM
const ITEM_TYPES = {
  PART: 'part', // Peça
  SUPPLY: 'supply', // Insumo (óleo, graxa, etc)
  PRODUCT: 'product', // Produto de revenda
  TOOL: 'tool', // Ferramenta
};

// UNIDADES DE MEDIDA
const UNITS = {
  UN: 'un', // Unidade
  KG: 'kg', // Quilograma
  L: 'l', // Litro
  M: 'm', // Metro
  CX: 'cx', // Caixa
  PC: 'pc', // Pacote
  GL: 'gl', // Galão
};

// TIPOS DE MOVIMENTAÇÃO
const MOVEMENT_TYPES = {
  IN: 'in', // Entrada (compra)
  OUT: 'out', // Saída (venda/uso)
  ADJUSTMENT: 'adjustment', // Ajuste manual
  RETURN: 'return', // Devolução
  LOSS: 'loss', // Perda
  TRANSFER: 'transfer', // Transferência
  RESERVATION: 'reservation', // Reserva
  RELEASE: 'release', // Liberação de reserva
};

export const useInventoryStore = create((set, get) => ({
  // State
  parts: [],
  currentPart: null,
  isLoading: false,
  error: null,
  searchResults: [],
  filters: {
    category: '',
    brand: '',
    inStock: null,
    lowStock: false,
    itemType: '',
  },
  categories: [
    'Motor',
    'Transmissão',
    'Freios',
    'Suspensão',
    'Elétrica',
    'Carroceria',
    'Pneus',
    'Filtros',
    'Óleos',
    'Outros'
  ],

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ 
    filters: { 
      category: '', 
      brand: '', 
      inStock: null, 
      lowStock: false,
      itemType: '',
    } 
  }),

  // ========== VALIDAÇÕES ==========

  // Validar quantidade
  validateQuantity: (quantity, context = 'geral') => {
    // Validar tipo
    if (typeof quantity !== 'number' || isNaN(quantity)) {
      return { 
        valid: false, 
        error: 'Quantidade deve ser um número válido' 
      };
    }

    // Validar positivo
    if (quantity < 0) {
      return { 
        valid: false, 
        error: 'Quantidade não pode ser negativa' 
      };
    }

    // Validar zero
    if (quantity === 0 && context !== 'adjustment') {
      return { 
        valid: false, 
        error: 'Quantidade deve ser maior que zero' 
      };
    }

    // Validar máximo
    if (quantity > INVENTORY_CONFIG.maxQuantity) {
      return { 
        valid: false, 
        error: `Quantidade máxima permitida: ${INVENTORY_CONFIG.maxQuantity}` 
      };
    }

    // Validar casas decimais
    const decimalPlaces = (quantity.toString().split('.')[1] || '').length;
    if (decimalPlaces > INVENTORY_CONFIG.decimalPlaces) {
      return { 
        valid: false, 
        error: `Máximo ${INVENTORY_CONFIG.decimalPlaces} casas decimais` 
      };
    }

    // Alerta para quantidades grandes
    if (quantity > INVENTORY_CONFIG.alertThreshold) {
      return {
        valid: true,
        warning: `Quantidade grande: ${quantity}. Confirme se está correto.`
      };
    }

    return { valid: true };
  },

  // Validar preço
  validatePrice: (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return { valid: false, error: 'Preço deve ser um número válido' };
    }

    if (price < 0) {
      return { valid: false, error: 'Preço não pode ser negativo' };
    }

    if (price === 0) {
      return { 
        valid: true, 
        warning: 'Preço zero. Confirme se está correto.' 
      };
    }

    return { valid: true };
  },

  // Validar dados do item
  validateItemData: (itemData, isUpdate = false) => {
    const errors = [];
    const warnings = [];

    // Validar nome
    if (!itemData.name || itemData.name.trim().length < 3) {
      errors.push('Nome deve ter no mínimo 3 caracteres');
    }

    // Validar tipo de item
    if (!itemData.itemType || !Object.values(ITEM_TYPES).includes(itemData.itemType)) {
      errors.push('Tipo de item inválido');
    }

    // Validar unidade de medida
    if (!itemData.unit || !Object.values(UNITS).includes(itemData.unit)) {
      errors.push('Unidade de medida inválida');
    }

    // Validar categoria
    if (!itemData.category) {
      warnings.push('Categoria não informada');
    }

    // Validar preço unitário
    if (itemData.unitPrice !== undefined) {
      const priceValidation = get().validatePrice(itemData.unitPrice);
      if (!priceValidation.valid) {
        errors.push(priceValidation.error);
      }
      if (priceValidation.warning) {
        warnings.push(priceValidation.warning);
      }
    }

    // Validar estoque mínimo
    if (itemData.minStock !== undefined) {
      const minStockValidation = get().validateQuantity(itemData.minStock, 'minStock');
      if (!minStockValidation.valid) {
        errors.push(`Estoque mínimo: ${minStockValidation.error}`);
      }
    }

    // Validar estoque inicial (apenas na criação)
    if (!isUpdate && itemData.currentStock !== undefined) {
      const stockValidation = get().validateQuantity(itemData.currentStock, 'initial');
      if (!stockValidation.valid) {
        errors.push(`Estoque inicial: ${stockValidation.error}`);
      }
      if (stockValidation.warning) {
        warnings.push(stockValidation.warning);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  },

  // ========== CUSTO MÉDIO PONDERADO ==========

  // Calcular custo médio ponderado
  calculateAverageCost: (currentStock, currentAvgCost, incomingQty, incomingCost) => {
    if (currentStock === 0) {
      return incomingCost;
    }

    const totalValue = (currentStock * currentAvgCost) + (incomingQty * incomingCost);
    const totalQty = currentStock + incomingQty;

    return totalQty > 0 ? totalValue / totalQty : 0;
  },

  // ========== CRUD OPERATIONS ==========

  // Create new part
  createPart: async (partData) => {
    set({ isLoading: true, error: null });
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';

      // VALIDAÇÃO ROBUSTA
      const validation = get().validateItemData(partData, false);

      if (!validation.valid) {
        throw new Error(`Validação falhou:\n${validation.errors.join('\n')}`);
      }

      // Mostrar warnings
      if (validation.warnings.length > 0) {
        validation.warnings.forEach(w => toast.warning(w, { duration: 3000 }));
      }

      const now = new Date().toISOString();
      const initialStock = partData.currentStock || 0;
      const initialCost = partData.unitPrice || 0;

      const newPart = {
        ...partData,
        partId: `${partData.itemType.toUpperCase()}-${Date.now()}`,
        
        // Tipo e unidade
        itemType: partData.itemType || ITEM_TYPES.PART,
        unit: partData.unit || UNITS.UN,
        
        // Estoque
        currentStock: initialStock,
        reservedStock: 0, // Estoque reservado para OS
        availableStock: initialStock, // Estoque disponível
        
        // Custos
        unitPrice: initialCost, // Preço de venda
        averageCost: initialCost, // Custo médio ponderado
        lastPurchasePrice: initialCost, // Último preço de compra
        lastPurchaseDate: initialStock > 0 ? now : null,
        
        // Controle
        minStock: partData.minStock || 0,
        maxStock: partData.maxStock || null,
        
        // Localização
        location: partData.location || null, // {shelf, aisle, sector}
        
        // Lote e validade
        batchControl: partData.batchControl || false,
        expiryControl: partData.expiryControl || false,
        
        // Metadados
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        createdByName: userName,
        
        // Histórico
        stockMovements: [],
        priceHistory: initialCost > 0 ? [{
          price: initialCost,
          date: now,
          type: 'initial'
        }] : [],
        
        // Estatísticas
        totalUsed: 0,
        totalPurchased: initialStock,
        lastUsedDate: null,
        lastMovementDate: initialStock > 0 ? now : null,
        
        // Auditoria
        history: [{
          action: 'created',
          timestamp: now,
          userId,
          userName,
          changes: 'Item criado'
        }]
      };

      // Se tem estoque inicial, criar movimentação
      if (initialStock > 0) {
        newPart.stockMovements = [{
          id: `MOV-${Date.now()}`,
          type: MOVEMENT_TYPES.IN,
          quantity: initialStock,
          unitCost: initialCost,
          totalCost: initialStock * initialCost,
          reason: 'Estoque inicial',
          date: now,
          userId,
          userName,
          previousStock: 0,
          newStock: initialStock,
          previousAvgCost: 0,
          newAvgCost: initialCost,
        }];
      }

      const partWithId = await addDocument('inventory', newPart);

      set((state) => ({
        parts: [partWithId, ...state.parts],
        isLoading: false,
      }));

      toast.success('Item cadastrado com sucesso!');

      return { success: true, data: partWithId, warnings: validation.warnings };
    } catch (error) {
      console.error('❌ Erro ao criar item:', error);
      set({ error: error.message, isLoading: false });
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Update part
  updatePart: async (partId, updates, reason = 'Atualização de dados') => {
    set({ isLoading: true, error: null });
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      const currentPart = get().parts.find(p => p.id === partId || p.firestoreId === partId);

      if (!currentPart) {
        throw new Error('Item não encontrado');
      }

      // Validar dados se estiver atualizando campos críticos
      if (updates.name || updates.itemType || updates.unit || updates.unitPrice || updates.minStock) {
        const dataToValidate = {
          name: updates.name || currentPart.name,
          itemType: updates.itemType || currentPart.itemType,
          unit: updates.unit || currentPart.unit,
          unitPrice: updates.unitPrice !== undefined ? updates.unitPrice : currentPart.unitPrice,
          minStock: updates.minStock !== undefined ? updates.minStock : currentPart.minStock,
          category: updates.category || currentPart.category,
        };

        const validation = get().validateItemData(dataToValidate, true);

        if (!validation.valid) {
          throw new Error(`Validação falhou:\n${validation.errors.join('\n')}`);
        }

        if (validation.warnings.length > 0) {
          validation.warnings.forEach(w => toast.warning(w, { duration: 3000 }));
        }
      }

      const now = new Date().toISOString();

      // Registrar mudanças para auditoria
      const changes = {};
      Object.keys(updates).forEach(key => {
        if (currentPart[key] !== updates[key]) {
          changes[key] = {
            before: currentPart[key],
            after: updates[key]
          };
        }
      });

      // Atualizar histórico de preços se mudou
      let priceHistory = currentPart.priceHistory || [];
      if (updates.unitPrice !== undefined && updates.unitPrice !== currentPart.unitPrice) {
        priceHistory = [
          {
            price: updates.unitPrice,
            date: now,
            type: 'update',
            reason
          },
          ...priceHistory
        ];
      }

      const updatedData = {
        ...updates,
        priceHistory,
        updatedAt: now,
        history: [
          ...(currentPart.history || []),
          {
            action: 'updated',
            timestamp: now,
            userId,
            userName,
            reason,
            changes
          }
        ]
      };

      await updateDocument('inventory', partId, updatedData);

      set((state) => ({
        parts: state.parts.map((part) =>
          part.id === partId || part.firestoreId === partId
            ? { ...part, ...updatedData }
            : part
        ),
        currentPart: (state.currentPart?.id === partId || state.currentPart?.firestoreId === partId)
          ? { ...state.currentPart, ...updatedData }
          : state.currentPart,
        isLoading: false,
      }));

      toast.success('Item atualizado com sucesso!');

      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao atualizar item:', error);
      set({ error: error.message, isLoading: false });
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete part
  deletePart: async (partId) => {
    set({ isLoading: true, error: null });
    try {
      const part = get().parts.find(p => p.id === partId || p.firestoreId === partId);

      // Validar se pode deletar
      if (part && part.currentStock > 0) {
        throw new Error('Não é possível excluir item com estoque. Zere o estoque primeiro.');
      }

      if (part && part.reservedStock > 0) {
        throw new Error('Não é possível excluir item com estoque reservado.');
      }

      await deleteDocument('inventory', partId);

      set((state) => ({
        parts: state.parts.filter((part) => part.id !== partId && part.firestoreId !== partId),
        currentPart: (state.currentPart?.id === partId || state.currentPart?.firestoreId === partId) 
          ? null 
          : state.currentPart,
        isLoading: false,
      }));

      toast.success('Item excluído com sucesso!');

      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao excluir item:', error);
      set({ error: error.message, isLoading: false });
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Fetch all parts
  fetchParts: async () => {
    set({ isLoading: true, error: null });
    try {
      const parts = await getAllDocuments('inventory', {
        orderBy: { field: 'name', direction: 'asc' }
      });

      set({ parts, isLoading: false });
      return { success: true, data: parts };
    } catch (error) {
      console.error('❌ Erro ao buscar itens:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get part by ID
  getPartById: async (partId) => {
    set({ isLoading: true, error: null });
    try {
      const part = await getDocumentById('inventory', partId);
      
      if (part) {
        set({ currentPart: part, isLoading: false });
        return { success: true, data: part };
      } else {
        set({ error: 'Item não encontrado', isLoading: false });
        return { success: false, error: 'Item não encontrado' };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Search parts
  searchParts: async (searchTerm) => {
    set({ isLoading: true, error: null });
    try {
      const allParts = await getAllDocuments('inventory');
      
      const searchLower = searchTerm.toLowerCase();
      const searchResults = allParts.filter(part => 
        part.name?.toLowerCase().includes(searchLower) ||
        part.partId?.toLowerCase().includes(searchLower) ||
        part.brand?.toLowerCase().includes(searchLower) ||
        part.category?.toLowerCase().includes(searchLower) ||
        part.location?.shelf?.toLowerCase().includes(searchLower)
      ).slice(0, 20);

      set({ searchResults, isLoading: false });
      return { success: true, data: searchResults };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // ========== MOVIMENTAÇÕES DE ESTOQUE ==========

  // Entrada de estoque (compra)
  stockIn: async (partId, quantity, unitCost, options = {}) => {
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      const part = get().parts.find(p => p.id === partId || p.firestoreId === partId);
      
      if (!part) {
        return { success: false, error: 'Item não encontrado' };
      }

      // VALIDAR QUANTIDADE
      const qtyValidation = get().validateQuantity(quantity, 'in');
      if (!qtyValidation.valid) {
        return { success: false, error: qtyValidation.error };
      }

      // VALIDAR CUSTO
      const costValidation = get().validatePrice(unitCost);
      if (!costValidation.valid) {
        return { success: false, error: costValidation.error };
      }

      // Mostrar warnings
      if (qtyValidation.warning) {
        toast.warning(qtyValidation.warning, { duration: 5000 });
      }

      const now = new Date().toISOString();
      const previousStock = part.currentStock;
      const newStock = previousStock + quantity;

      // CALCULAR CUSTO MÉDIO PONDERADO
      const newAvgCost = get().calculateAverageCost(
            );
        previousStock,
        part.averageCost || 0,
        quantity,
        unitCost

      // CRIAR MOVIMENTAÇÃO
      const movement = {
        id: `MOV-${Date.now()}`,
        type: MOVEMENT_TYPES.IN,
        quantity,
        unitCost,
        totalCost: quantity * unitCost,
        reason: options.reason || 'Compra',
        supplier: options.supplier || null,
        invoice: options.invoice || null,
        batch: options.batch || null,
        expiryDate: options.expiryDate || null,
        date: now,
        userId,
        userName,
        previousStock,
        newStock,
        previousAvgCost: part.averageCost || 0,
        newAvgCost,
      };

      // ATUALIZAR ITEM
      const updates = {
        currentStock: newStock,
        availableStock: newStock - (part.reservedStock || 0),
        averageCost: newAvgCost,
        lastPurchasePrice: unitCost,
        lastPurchaseDate: now,
        lastMovementDate: now,
        totalPurchased: (part.totalPurchased || 0) + quantity,
        stockMovements: [movement, ...(part.stockMovements || [])],
        priceHistory: [
          {
            price: unitCost,
            date: now,
            type: 'purchase',
            quantity
          },
          ...(part.priceHistory || [])
        ]
      };

      await get().updatePart(partId, updates, 'Entrada de estoque');

      toast.success(`Entrada registrada: ${quantity} ${part.unit}`);

      return { success: true, data: movement };
    } catch (error) {
      console.error('❌ Erro na entrada de estoque:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Saída de estoque (uso/venda)
  stockOut: async (partId, quantity, options = {}) => {
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      const part = get().parts.find(p => p.id === partId || p.firestoreId === partId);
      
      if (!part) {
        return { success: false, error: 'Item não encontrado' };
      }

      // VALIDAR QUANTIDADE
      const qtyValidation = get().validateQuantity(quantity, 'out');
      if (!qtyValidation.valid) {
        return { success: false, error: qtyValidation.error };
      }

      // VALIDAR ESTOQUE DISPONÍVEL
      const availableStock = part.availableStock || (part.currentStock - (part.reservedStock || 0));
      if (availableStock < quantity) {
        return { 
          success: false, 
          error: `Estoque insuficiente. Disponível: ${availableStock} ${part.unit}` 
        };
      }

      const now = new Date().toISOString();
      const previousStock = part.currentStock;
      const newStock = previousStock - quantity;

      // VALIDAR ESTOQUE NEGATIVO (PROTEÇÃO FINAL)
      if (newStock < 0) {
        return { 
          success: false, 
          error: 'Operação resultaria em estoque negativo' 
        };
      }

      // CRIAR MOVIMENTAÇÃO
      const movement = {
        id: `MOV-${Date.now()}`,
        type: MOVEMENT_TYPES.OUT,
        quantity,
        unitCost: part.averageCost || 0,
        totalCost: quantity * (part.averageCost || 0),
        reason: options.reason || 'Usado em serviço',
        serviceId: options.serviceId || null,
        budgetId: options.budgetId || null,
        customerId: options.customerId || null,
        date: now,
        userId,
        userName,
        previousStock,
        newStock,
        previousAvgCost: part.averageCost || 0,
        newAvgCost: part.averageCost || 0, // Custo médio não muda na saída
      };

      // ATUALIZAR ITEM
      const updates = {
        currentStock: newStock,
        availableStock: newStock - (part.reservedStock || 0),
        lastMovementDate: now,
        lastUsedDate: now,
        totalUsed: (part.totalUsed || 0) + quantity,
        stockMovements: [movement, ...(part.stockMovements || [])],
      };

      await get().updatePart(partId, updates, 'Saída de estoque');

      toast.success(`Saída registrada: ${quantity} ${part.unit}`);

      return { success: true, data: movement };
    } catch (error) {
      console.error('❌ Erro na saída de estoque:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Ajuste de estoque
  adjustStock: async (partId, newQuantity, reason) => {
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      const part = get().parts.find(p => p.id === partId || p.firestoreId === partId);
      
      if (!part) {
        return { success: false, error: 'Item não encontrado' };
      }

      // VALIDAR NOVA QUANTIDADE
      const qtyValidation = get().validateQuantity(newQuantity, 'adjustment');
      if (!qtyValidation.valid) {
        return { success: false, error: qtyValidation.error };
      }

      // VALIDAR MOTIVO
      if (!reason || reason.trim().length < 10) {
        return { 
          success: false, 
          error: 'Motivo do ajuste deve ter no mínimo 10 caracteres' 
        };
      }

      const now = new Date().toISOString();
      const previousStock = part.currentStock;
      const difference = newQuantity - previousStock;

      // Alerta para ajustes grandes
      if (Math.abs(difference) > INVENTORY_CONFIG.maxAdjustment) {
        toast.warning(
          `Ajuste grande: ${Math.abs(difference)} ${part.unit}. Requer aprovação.`,
          { duration: 7000 }
        );
      }

      // CRIAR MOVIMENTAÇÃO
      const movement = {
        id: `MOV-${Date.now()}`,
        type: MOVEMENT_TYPES.ADJUSTMENT,
        quantity: Math.abs(difference),
        difference,
        unitCost: part.averageCost || 0,
        totalCost: Math.abs(difference) * (part.averageCost || 0),
        reason,
        date: now,
        userId,
        userName,
        previousStock,
        newStock: newQuantity,
        previousAvgCost: part.averageCost || 0,
        newAvgCost: part.averageCost || 0,
        requiresApproval: Math.abs(difference) > INVENTORY_CONFIG.maxAdjustment,
      };

      // ATUALIZAR ITEM
      const updates = {
        currentStock: newQuantity,
        availableStock: newQuantity - (part.reservedStock || 0),
        lastMovementDate: now,
        stockMovements: [movement, ...(part.stockMovements || [])],
      };

      await get().updatePart(partId, updates, `Ajuste de estoque: ${reason}`);

      toast.success(`Ajuste registrado: ${difference > 0 ? '+' : ''}${difference} ${part.unit}`);

      return { success: true, data: movement };
    } catch (error) {
      console.error('❌ Erro no ajuste de estoque:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Reservar estoque (para OS)
  reserveStock: async (partId, quantity, serviceId, reason = 'Reserva para OS') => {
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      const part = get().parts.find(p => p.id === partId || p.firestoreId === partId);
      
      if (!part) {
        return { success: false, error: 'Item não encontrado' };
      }

      // VALIDAR QUANTIDADE
      const qtyValidation = get().validateQuantity(quantity, 'reservation');
      if (!qtyValidation.valid) {
        return { success: false, error: qtyValidation.error };
      }

      // VALIDAR ESTOQUE DISPONÍVEL
      const availableStock = part.availableStock || (part.currentStock - (part.reservedStock || 0));
      if (availableStock < quantity) {
        return { 
          success: false, 
          error: `Estoque insuficiente para reserva. Disponível: ${availableStock} ${part.unit}` 
        };
      }

      const now = new Date().toISOString();
      const previousReserved = part.reservedStock || 0;
      const newReserved = previousReserved + quantity;

      // CRIAR MOVIMENTAÇÃO
      const movement = {
        id: `MOV-${Date.now()}`,
        type: MOVEMENT_TYPES.RESERVATION,
        quantity,
        reason,
        serviceId,
        date: now,
        userId,
        userName,
        previousReserved,
        newReserved,
        currentStock: part.currentStock,
      };

      // ATUALIZAR ITEM
      const updates = {
        reservedStock: newReserved,
        availableStock: part.currentStock - newReserved,
        lastMovementDate: now,
        stockMovements: [movement, ...(part.stockMovements || [])],
      };

      await get().updatePart(partId, updates, `Reserva de estoque: ${reason}`);

      toast.success(`Estoque reservado: ${quantity} ${part.unit}`);

      return { success: true, data: movement };
    } catch (error) {
      console.error('❌ Erro ao reservar estoque:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Liberar reserva de estoque
  releaseReservation: async (partId, quantity, serviceId, reason = 'Liberação de reserva') => {
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      const part = get().parts.find(p => p.id === partId || p.firestoreId === partId);
      
      if (!part) {
        return { success: false, error: 'Item não encontrado' };
      }

      // VALIDAR QUANTIDADE
      const qtyValidation = get().validateQuantity(quantity, 'release');
      if (!qtyValidation.valid) {
        return { success: false, error: qtyValidation.error };
      }

      // VALIDAR ESTOQUE RESERVADO
      const reservedStock = part.reservedStock || 0;
      if (reservedStock < quantity) {
        return { 
          success: false, 
          error: `Quantidade reservada insuficiente. Reservado: ${reservedStock} ${part.unit}` 
        };
      }

      const now = new Date().toISOString();
      const previousReserved = part.reservedStock || 0;
      const newReserved = previousReserved - quantity;

      // CRIAR MOVIMENTAÇÃO
      const movement = {
        id: `MOV-${Date.now()}`,
        type: MOVEMENT_TYPES.RELEASE,
        quantity,
        reason,
        serviceId,
        date: now,
        userId,
        userName,
        previousReserved,
        newReserved,
        currentStock: part.currentStock,
      };

      // ATUALIZAR ITEM
      const updates = {
        reservedStock: newReserved,
        availableStock: part.currentStock - newReserved,
        lastMovementDate: now,
        stockMovements: [movement, ...(part.stockMovements || [])],
      };

      await get().updatePart(partId, updates, `Liberação de reserva: ${reason}`);

      toast.success(`Reserva liberada: ${quantity} ${part.unit}`);

      return { success: true, data: movement };
    } catch (error) {
      console.error('❌ Erro ao liberar reserva:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Consumir reserva (finalizar OS)
  consumeReservation: async (partId, quantity, serviceId, reason = 'Consumo de reserva') => {
    try {
      // 1. Liberar reserva
      const releaseResult = await get().releaseReservation(partId, quantity, serviceId, reason);
      if (!releaseResult.success) {
        return releaseResult;
      }

      // 2. Dar saída no estoque
      const outResult = await get().stockOut(partId, quantity, {
        reason,
        serviceId
      });

      return outResult;
    } catch (error) {
      console.error('❌ Erro ao consumir reserva:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Continua no próximo bloco...

  // ========== FILTROS E CONSULTAS ==========

  // Get filtered parts
  getFilteredParts: () => {
    const { parts, filters } = get();
    
    return parts.filter(part => {
      if (filters.category && part.category !== filters.category) return false;
      if (filters.brand && part.brand !== filters.brand) return false;
      if (filters.itemType && part.itemType !== filters.itemType) return false;
      if (filters.inStock !== null) {
        if (filters.inStock && part.currentStock <= 0) return false;
        if (!filters.inStock && part.currentStock > 0) return false;
      }
      if (filters.lowStock && part.currentStock > part.minStock) return false;
      
      return true;
    });
  },

  // Get low stock parts
  getLowStockParts: () => {
    const { parts } = get();
    return parts.filter(part => 
      part.currentStock <= part.minStock && part.currentStock > 0
    );
  },

  // Get out of stock parts
  getOutOfStockParts: () => {
    const { parts } = get();
    return parts.filter(part => part.currentStock <= 0);
  },

  // Get parts with excess stock (> 180 days without movement)
  getExcessStockParts: () => {
    const { parts } = get();
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));

    return parts.filter(part => {
      if (!part.lastMovementDate) return false;
      const lastMovement = new Date(part.lastMovementDate);
      return lastMovement < sixMonthsAgo && part.currentStock > 0;
    });
  },

  // ========== ESTATÍSTICAS E ANÁLISES ==========

  // Get inventory statistics
  getInventoryStatistics: () => {
    const { parts } = get();
    
    const totalParts = parts.length;
    
    // Valor total do estoque (custo médio)
    const totalValue = parts.reduce((sum, part) => 
      sum + (part.currentStock * (part.averageCost || 0)), 0
    );
    
    // Valor total de venda
    const totalSaleValue = parts.reduce((sum, part) => 
      sum + (part.currentStock * (part.unitPrice || 0)), 0
    );
    // Margem potencial
    const potentialMargin = totalSaleValue - totalValue;
    const marginPercentage = totalValue > 0 ? (potentialMargin / totalValue) * 100 : 0;
    
    const lowStockCount = parts.filter(part => 
      part.currentStock <= part.minStock && part.currentStock > 0
    ).length;
    
    const outOfStockCount = parts.filter(part => part.currentStock <= 0).length;
    
    const excessStockCount = get().getExcessStockParts().length;
    
    // Itens com estoque reservado
    const reservedCount = parts.filter(part => (part.reservedStock || 0) > 0).length;
    
    // Most used parts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentlyUsedParts = parts
      .filter(part => part.lastUsedDate && new Date(part.lastUsedDate) >= thirtyDaysAgo)
      .sort((a, b) => (b.totalUsed || 0) - (a.totalUsed || 0))
      .slice(0, 10);
    
    return {
      totalParts,
      totalValue,
      totalSaleValue,
      potentialMargin,
      marginPercentage,
      lowStockCount,
      outOfStockCount,
      excessStockCount,
      reservedCount,
      lowStockPercentage: totalParts > 0 ? (lowStockCount / totalParts) * 100 : 0,
      outOfStockPercentage: totalParts > 0 ? (outOfStockCount / totalParts) * 100 : 0,
      excessStockPercentage: totalParts > 0 ? (excessStockCount / totalParts) * 100 : 0,
      recentlyUsedParts,
    };
  },

  // Get parts by category
  getPartsByCategory: () => {
    const { parts } = get();
    const categories = {};
    
    parts.forEach(part => {
      const category = part.category || 'Outros';
      if (!categories[category]) {
        categories[category] = {
          count: 0,
          totalValue: 0,
          totalSaleValue: 0,
          lowStock: 0,
          outOfStock: 0,
        };
      }
      
      categories[category].count++;
      categories[category].totalValue += part.currentStock * (part.averageCost || 0);
      categories[category].totalSaleValue += part.currentStock * (part.unitPrice || 0);
      
      if (part.currentStock <= part.minStock && part.currentStock > 0) {
        categories[category].lowStock++;
      }
      if (part.currentStock <= 0) {
        categories[category].outOfStock++;
      }
    });
    
    return categories;
  },

  // Calcular giro de estoque
  calculateStockTurnover: (partId, days = 30) => {
    const part = get().parts.find(p => p.id === partId || p.firestoreId === partId);
    if (!part) return null;

    // Calcular consumo nos últimos X dias
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const movements = part.stockMovements || [];
    const consumption = movements
      .filter(m => 
        m.type === MOVEMENT_TYPES.OUT && 
        new Date(m.date) >= cutoffDate
      )
      .reduce((sum, m) => sum + m.quantity, 0);

    // Estoque médio
    const avgStock = part.currentStock; // Simplificado

    // Giro = Consumo / Estoque Médio
    const turnover = avgStock > 0 ? consumption / avgStock : 0;

    // Dias de estoque = Estoque / (Consumo / Dias)
    const dailyConsumption = consumption / days;
    const daysOfStock = dailyConsumption > 0 ? part.currentStock / dailyConsumption : Infinity;

    return {
      consumption,
      avgStock,
      turnover,
      daysOfStock: Math.round(daysOfStock),
      dailyConsumption: Math.round(dailyConsumption * 100) / 100,
    };
  },

  // Curva ABC
  calculateABCCurve: () => {
    const { parts } = get();

    // Calcular valor total de cada item (custo médio * quantidade)
    const partsWithValue = parts.map(part => ({
      ...part,
      totalValue: part.currentStock * (part.averageCost || 0)
    }));

    // Ordenar por valor (maior primeiro)
    partsWithValue.sort((a, b) => b.totalValue - a.totalValue);

    // Calcular valor total
    const totalValue = partsWithValue.reduce((sum, p) => sum + p.totalValue, 0);

    // Calcular acumulado e classificar
    let accumulated = 0;
    const classified = partsWithValue.map(part => {
      accumulated += part.totalValue;
      const accumulatedPercentage = (accumulated / totalValue) * 100;

      let classification = 'C';
      if (accumulatedPercentage <= 80) {
        classification = 'A';
      } else if (accumulatedPercentage <= 95) {
        classification = 'B';
      }

      return {
        ...part,
        classification,
        accumulatedPercentage: Math.round(accumulatedPercentage * 100) / 100
      };
    });

    // Contar por classificação
    const classA = classified.filter(p => p.classification === 'A');
    const classB = classified.filter(p => p.classification === 'B');
    const classC = classified.filter(p => p.classification === 'C');

    return {
      parts: classified,
      summary: {
        A: {
          count: classA.length,
          percentage: (classA.length / parts.length) * 100,
          value: classA.reduce((sum, p) => sum + p.totalValue, 0),
          valuePercentage: 80
        },
        B: {
          count: classB.length,
          percentage: (classB.length / parts.length) * 100,
          value: classB.reduce((sum, p) => sum + p.totalValue, 0),
          valuePercentage: 15
        },
        C: {
          count: classC.length,
          percentage: (classC.length / parts.length) * 100,
          value: classC.reduce((sum, p) => sum + p.totalValue, 0),
          valuePercentage: 5
        }
      }
    };
  },

  // Sugestão de compra
  getPurchaseSuggestions: () => {
    const { parts } = get();
    const suggestions = [];

    parts.forEach(part => {
      // Calcular giro dos últimos 30 dias
      const turnover = get().calculateStockTurnover(part.id || part.firestoreId, 30);
      
      if (!turnover) return;

      // Se dias de estoque < 7, sugerir compra
      if (turnover.daysOfStock < 7 && turnover.daysOfStock > 0) {
        const suggestedQty = Math.ceil(turnover.dailyConsumption * 30); // 30 dias de estoque

        suggestions.push({
          part,
          reason: 'Ruptura iminente',
          priority: 'high',
          daysOfStock: turnover.daysOfStock,
          dailyConsumption: turnover.dailyConsumption,
          suggestedQuantity: suggestedQty,
          estimatedCost: suggestedQty * (part.lastPurchasePrice || part.averageCost || 0)
        });
      }
      // Se estoque <= mínimo
      else if (part.currentStock <= part.minStock && part.currentStock > 0) {
        const suggestedQty = Math.max(part.minStock * 2, 10);

        suggestions.push({
          part,
          reason: 'Estoque abaixo do mínimo',
          priority: 'medium',
          currentStock: part.currentStock,
          minStock: part.minStock,
          suggestedQuantity: suggestedQty,
          estimatedCost: suggestedQty * (part.lastPurchasePrice || part.averageCost || 0)
        });
      }
      // Se estoque = 0
      else if (part.currentStock === 0) {
        const suggestedQty = Math.max(part.minStock * 2, 10);

        suggestions.push({
          part,
          reason: 'Sem estoque',
          priority: 'urgent',
          suggestedQuantity: suggestedQty,
          estimatedCost: suggestedQty * (part.lastPurchasePrice || part.averageCost || 0)
        });
      }
    });

    // Ordenar por prioridade
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return suggestions;
  },

  // Clear search results
  clearSearchResults: () => set({ searchResults: [] }),

  // Real-time listener
  subscribeToInventory: () => {
    return subscribeToCollection('inventory', (parts) => {
      set({ parts });
    }, {
      orderBy: { field: 'name', direction: 'asc' }
    });
  },

  // Export constants
  ITEM_TYPES,
  UNITS,
  MOVEMENT_TYPES,
  INVENTORY_CONFIG,
}));
