import { create } from 'zustand';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  subscribeToCollection
} from '../services/storeHelpers';
export const useMotorcycleStore = create((set, get) => ({
  // State
  motorcycles: [],
  currentMotorcycle: null,
  isLoading: false,
  error: null,
  searchResults: [],
  filters: {
    status: '',
    brand: '',
    model: '',
    year: null,
    clientId: '',
  },
  statuses: [
    'Em Montagem',
    'Aguardando Peças',
    'Teste',
    'Finalizada',
    'Entregue',
    'Cancelada'
  ],

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: { status: '', brand: '', model: '', year: null, clientId: '' } }),

  // Create new motorcycle
  createMotorcycle: async (motorcycleData) => {
    set({ isLoading: true, error: null });
    try {
      const newMotorcycle = {
        ...motorcycleData,
        motorcycleId: `MOT-${Date.now()}`,
        status: 'Em Montagem',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
        completionDate: null,
        deliveryDate: null,
        totalCost: 0,
        laborCost: 0,
        partsCost: 0,
        progress: 0,
        usedParts: [],
        workLog: [],
        photos: [],
        notes: '',
      };

      const motorcycleWithId = await addDocument('motorcycles', newMotorcycle);

      set((state) => ({
        motorcycles: [motorcycleWithId, ...state.motorcycles],
        isLoading: false,
      }));

      return { success: true, data: motorcycleWithId };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update motorcycle
  updateMotorcycle: async (motorcycleId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDocument('motorcycles', motorcycleId, updatedData);

      set((state) => ({
        motorcycles: state.motorcycles.map((motorcycle) =>
          motorcycle.firestoreId === motorcycleId
            ? { ...motorcycle, ...updatedData }
            : motorcycle
        ),
        currentMotorcycle: state.currentMotorcycle?.firestoreId === motorcycleId
          ? { ...state.currentMotorcycle, ...updatedData }
          : state.currentMotorcycle,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete motorcycle
  deleteMotorcycle: async (motorcycleId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDocument('motorcycles', motorcycleId);

      set((state) => ({
        motorcycles: state.motorcycles.filter((motorcycle) => motorcycle.firestoreId !== motorcycleId),
        currentMotorcycle: state.currentMotorcycle?.firestoreId === motorcycleId ? null : state.currentMotorcycle,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Fetch all motorcycles
  fetchMotorcycles: async () => {
    set({ isLoading: true, error: null });
    try {
      const motorcycles = await getAllDocuments('motorcycles', {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });

      set({ motorcycles, isLoading: false });
      return { success: true, data: motorcycles };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get motorcycle by ID
  getMotorcycleById: async (motorcycleId) => {
    set({ isLoading: true, error: null });
    try {
      const docSnap = await getDocumentById('motorcycles', motorcycleId);
      
      if (docSnap) {
        const motorcycle = docSnap;
        set({ currentMotorcycle: motorcycle, isLoading: false });
        return { success: true, data: motorcycle };
      } else {
        set({ error: 'Moto não encontrada', isLoading: false });
        return { success: false, error: 'Moto não encontrada' };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Search motorcycles
  searchMotorcycles: async (searchTerm) => {
    set({ isLoading: true, error: null });
    try {
      // Search by motorcycle ID
      const idQuery = query(
        collection(db, 'motorcycles'),
        where('motorcycleId', '>=', searchTerm),
        where('motorcycleId', '<=', searchTerm + '\uf8ff'),
        limit(20)
      );
      
      // Search by brand - usando busca local
      
      // Search by model - usando busca local
      
      // Search by client ID
      const clientQuery = query(
        collection(db, 'motorcycles'),
        where('clientId', '>=', searchTerm),
        where('clientId', '<=', searchTerm + '\uf8ff'),
        limit(20)
      );
      
      // Buscar todos e filtrar localmente
    const allItems = await getAllDocuments('modelResults');
    const searchLower = searchTerm.toLowerCase();
      
      const allResults = new Map();
      
      // Combine results and remove duplicates
      [...idResults.docs, ...brandResults.docs, ...modelResults.docs, ...clientResults.docs].forEach(doc => {
        allResults.set(doc.id, { ...doc.data(), firestoreId: doc.id });
      });
      
      const searchResults = Array.from(allResults.values());

      set({ searchResults, isLoading: false });
      return { success: true, data: searchResults };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update motorcycle status
  updateStatus: async (motorcycleId, newStatus) => {
    try {
      const updates = { status: newStatus };
      
      // Set completion date when finished
      if (newStatus === 'Finalizada') {
        updates.completionDate = new Date().toISOString();
        updates.progress = 100;
      }
      
      // Set delivery date when delivered
      if (newStatus === 'Entregue') {
        updates.deliveryDate = new Date().toISOString();
        if (!updates.completionDate) {
          updates.completionDate = new Date().toISOString();
        }
        updates.progress = 100;
      }
      
      await get().updateMotorcycle(motorcycleId, updates);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add part to motorcycle
  addPart: async (motorcycleId, partData) => {
    try {
      const motorcycle = get().motorcycles.find(m => m.firestoreId === motorcycleId);
      if (!motorcycle) return { success: false, error: 'Moto não encontrada' };
      
      const newPart = {
        id: Date.now().toString(),
        ...partData,
        addedAt: new Date().toISOString(),
      };
      
      const updatedParts = [...(motorcycle.usedParts || []), newPart];
      const newPartsCost = (motorcycle.partsCost || 0) + (partData.cost || 0);
      const newTotalCost = newPartsCost + (motorcycle.laborCost || 0);
      
      await get().updateMotorcycle(motorcycleId, {
        usedParts: updatedParts,
        partsCost: newPartsCost,
        totalCost: newTotalCost,
      });
      
      return { success: true, data: newPart };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove part from motorcycle
  removePart: async (motorcycleId, partId) => {
    try {
      const motorcycle = get().motorcycles.find(m => m.firestoreId === motorcycleId);
      if (!motorcycle) return { success: false, error: 'Moto não encontrada' };
      
      const partToRemove = motorcycle.usedParts.find(p => p.id === partId);
      const updatedParts = motorcycle.usedParts.filter(p => p.id !== partId);
      const newPartsCost = (motorcycle.partsCost || 0) - (partToRemove?.cost || 0);
      const newTotalCost = newPartsCost + (motorcycle.laborCost || 0);
      
      await get().updateMotorcycle(motorcycleId, {
        usedParts: updatedParts,
        partsCost: newPartsCost,
        totalCost: newTotalCost,
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add work log entry
  addWorkLog: async (motorcycleId, logData) => {
    try {
      const motorcycle = get().motorcycles.find(m => m.firestoreId === motorcycleId);
      if (!motorcycle) return { success: false, error: 'Moto não encontrada' };
      
      const newLog = {
        id: Date.now().toString(),
        ...logData,
        timestamp: new Date().toISOString(),
      };
      
      const updatedLog = [newLog, ...(motorcycle.workLog || [])];
      
      await get().updateMotorcycle(motorcycleId, {
        workLog: updatedLog,
      });
      
      return { success: true, data: newLog };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update progress
  updateProgress: async (motorcycleId, progress) => {
    try {
      await get().updateMotorcycle(motorcycleId, { progress });
      
      // Auto-update status based on progress
      if (progress === 100) {
        await get().updateStatus(motorcycleId, 'Finalizada');
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add photo
  addPhoto: async (motorcycleId, photoData) => {
    try {
      const motorcycle = get().motorcycles.find(m => m.firestoreId === motorcycleId);
      if (!motorcycle) return { success: false, error: 'Moto não encontrada' };
      
      const newPhoto = {
        id: Date.now().toString(),
        ...photoData,
        uploadedAt: new Date().toISOString(),
      };
      
      const updatedPhotos = [...(motorcycle.photos || []), newPhoto];
      
      await get().updateMotorcycle(motorcycleId, {
        photos: updatedPhotos,
      });
      
      return { success: true, data: newPhoto };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove photo
  removePhoto: async (motorcycleId, photoId) => {
    try {
      const motorcycle = get().motorcycles.find(m => m.firestoreId === motorcycleId);
      if (!motorcycle) return { success: false, error: 'Moto não encontrada' };
      
      const updatedPhotos = motorcycle.photos.filter(p => p.id !== photoId);
      
      await get().updateMotorcycle(motorcycleId, {
        photos: updatedPhotos,
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get filtered motorcycles
  getFilteredMotorcycles: () => {
    const { motorcycles, filters } = get();
    
    return motorcycles.filter(motorcycle => {
      if (filters.status && motorcycle.status !== filters.status) return false;
      if (filters.brand && motorcycle.brand !== filters.brand) return false;
      if (filters.model && motorcycle.model !== filters.model) return false;
      if (filters.year && motorcycle.year !== filters.year) return false;
      if (filters.clientId && motorcycle.clientId !== filters.clientId) return false;
      
      return true;
    });
  },

  // Get motorcycles by status
  getMotorcyclesByStatus: (status) => {
    const { motorcycles } = get();
    return motorcycles.filter(motorcycle => motorcycle.status === status);
  },

  // Get motorcycles by client
  getMotorcyclesByClient: (clientId) => {
    const { motorcycles } = get();
    return motorcycles.filter(motorcycle => motorcycle.clientId === clientId);
  },

  // Get motorcycle statistics
  getMotorcycleStatistics: () => {
    const { motorcycles } = get();
    
    const totalMotorcycles = motorcycles.length;
    const inProgress = motorcycles.filter(m => ['Em Montagem', 'Aguardando Peças', 'Teste'].includes(m.status)).length;
    const completed = motorcycles.filter(m => m.status === 'Finalizada').length;
    const delivered = motorcycles.filter(m => m.status === 'Entregue').length;
    
    // Calculate average completion time
    const completedMotorcycles = motorcycles.filter(m => m.completionDate && m.startDate);
    let averageCompletionTime = 0;
    
    if (completedMotorcycles.length > 0) {
      const totalTime = completedMotorcycles.reduce((sum, motorcycle) => {
        const start = new Date(motorcycle.startDate);
        const end = new Date(motorcycle.completionDate);
        return sum + (end - start);
      }, 0);
      
      averageCompletionTime = totalTime / completedMotorcycles.length / (1000 * 60 * 60 * 24); // days
    }
    
    // Total revenue
    const totalRevenue = motorcycles
      .filter(m => m.status === 'Entregue')
      .reduce((sum, m) => sum + (m.totalCost || 0), 0);
    
    // Most popular brands
    const brandCounts = {};
    motorcycles.forEach(m => {
      const brand = m.brand || 'Outros';
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
    
    const popularBrands = Object.entries(brandCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([brand, count]) => ({ brand, count }));
    
    return {
      totalMotorcycles,
      inProgress,
      completed,
      delivered,
      averageCompletionTime: Math.round(averageCompletionTime * 100) / 100,
      totalRevenue,
      popularBrands,
      completionRate: totalMotorcycles > 0 ? (completed / totalMotorcycles) * 100 : 0,
      deliveryRate: totalMotorcycles > 0 ? (delivered / totalMotorcycles) * 100 : 0,
    };
  },

  // Clear search results
  clearSearchResults: () => set({ searchResults: [] }),

  // Real-time listener
  subscribeToMotorcycles: () => {
    return subscribeToCollection('motorcycles', (motorcycles) => {
      set({ motorcycles });
    }, {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  },
}));