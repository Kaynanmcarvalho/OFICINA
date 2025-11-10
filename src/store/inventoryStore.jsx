import { create } from 'zustand';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  subscribeToCollection
} from '../services/storeHelpers';

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
  clearFilters: () => set({ filters: { category: '', brand: '', inStock: null, lowStock: false } }),

  // Create new part
  createPart: async (partData) => {
    set({ isLoading: true, error: null });
    try {
      const newPart = {
        ...partData,
        partId: `PRT-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stockMovements: [],
        totalUsed: 0,
        lastUsedDate: null,
      };

      const partWithId = await addDocument('inventory', newPart);

      set((state) => ({
        parts: [partWithId, ...state.parts],
        isLoading: false,
      }));

      return { success: true, data: partWithId };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update part
  updatePart: async (partId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
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

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete part
  deletePart: async (partId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDocument('inventory', partId);

      set((state) => ({
        parts: state.parts.filter((part) => part.id !== partId && part.firestoreId !== partId),
        currentPart: (state.currentPart?.id === partId || state.currentPart?.firestoreId === partId) 
          ? null 
          : state.currentPart,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
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
        set({ error: 'Peça não encontrada', isLoading: false });
        return { success: false, error: 'Peça não encontrada' };
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
      // Get all parts and filter locally for better multi-tenant support
      const allParts = await getAllDocuments('inventory');
      
      const searchLower = searchTerm.toLowerCase();
      const searchResults = allParts.filter(part => 
        part.name?.toLowerCase().includes(searchLower) ||
        part.partId?.toLowerCase().includes(searchLower) ||
        part.brand?.toLowerCase().includes(searchLower) ||
        part.category?.toLowerCase().includes(searchLower)
      ).slice(0, 20);

      set({ searchResults, isLoading: false });
      return { success: true, data: searchResults };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update stock
  updateStock: async (partId, quantity, type = 'adjustment', reason = '') => {
    try {
      const part = get().parts.find(p => p.id === partId || p.firestoreId === partId);
      if (!part) return { success: false, error: 'Peça não encontrada' };
      
      const movement = {
        id: Date.now().toString(),
        type, // 'in', 'out', 'adjustment'
        quantity,
        reason,
        date: new Date().toISOString(),
        previousStock: part.currentStock,
        newStock: type === 'out' ? part.currentStock - quantity : part.currentStock + quantity,
      };
      
      const updatedMovements = [movement, ...(part.stockMovements || [])];
      const newStock = movement.newStock;
      
      await get().updatePart(partId, {
        currentStock: newStock,
        stockMovements: updatedMovements,
        lastMovementDate: movement.date,
      });
      
      return { success: true, data: movement };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Use part (decrease stock)
  usePart: async (partId, quantity, serviceId = null, reason = 'Usado em serviço') => {
    try {
      const part = get().parts.find(p => p.id === partId || p.firestoreId === partId);
      if (!part) return { success: false, error: 'Peça não encontrada' };
      
      if (part.currentStock < quantity) {
        return { success: false, error: 'Estoque insuficiente' };
      }
      
      const movement = {
        id: Date.now().toString(),
        type: 'out',
        quantity,
        reason,
        serviceId,
        date: new Date().toISOString(),
        previousStock: part.currentStock,
        newStock: part.currentStock - quantity,
      };
      
      const updatedMovements = [movement, ...(part.stockMovements || [])];
      const totalUsed = (part.totalUsed || 0) + quantity;
      
      await get().updatePart(partId, {
        currentStock: movement.newStock,
        stockMovements: updatedMovements,
        totalUsed,
        lastUsedDate: movement.date,
        lastMovementDate: movement.date,
      });
      
      return { success: true, data: movement };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get filtered parts
  getFilteredParts: () => {
    const { parts, filters } = get();
    
    return parts.filter(part => {
      if (filters.category && part.category !== filters.category) return false;
      if (filters.brand && part.brand !== filters.brand) return false;
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
    return parts.filter(part => part.currentStock <= part.minStock);
  },

  // Get out of stock parts
  getOutOfStockParts: () => {
    const { parts } = get();
    return parts.filter(part => part.currentStock <= 0);
  },

  // Get inventory statistics
  getInventoryStatistics: () => {
    const { parts } = get();
    
    const totalParts = parts.length;
    const totalValue = parts.reduce((sum, part) => sum + (part.currentStock * part.unitPrice), 0);
    const lowStockCount = parts.filter(part => part.currentStock <= part.minStock).length;
    const outOfStockCount = parts.filter(part => part.currentStock <= 0).length;
    
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
      lowStockCount,
      outOfStockCount,
      lowStockPercentage: totalParts > 0 ? (lowStockCount / totalParts) * 100 : 0,
      outOfStockPercentage: totalParts > 0 ? (outOfStockCount / totalParts) * 100 : 0,
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
          lowStock: 0,
        };
      }
      
      categories[category].count++;
      categories[category].totalValue += part.currentStock * part.unitPrice;
      if (part.currentStock <= part.minStock) {
        categories[category].lowStock++;
      }
    });
    
    return categories;
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
}));
