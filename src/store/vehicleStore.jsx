import { create } from 'zustand';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  subscribeToCollection
} from '../services/storeHelpers';
export const useVehicleStore = create((set, get) => ({
  // State
  vehicles: [],
  currentVehicle: null,
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
  createVehicle: async (vehicleData) => {
    set({ isLoading: true, error: null });
    try {
      const newVehicle = {
        ...vehicleData,
        vehicleId: `VEH-${Date.now()}`,
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

      const vehicleWithId = await addDocument('vehicles', newVehicle);

      set((state) => ({
        vehicles: [vehicleWithId, ...state.vehicles],
        isLoading: false,
      }));

      return { success: true, data: vehicleWithId };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update motorcycle
  updateVehicle: async (vehicleId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDocument('vehicles', vehicleId, updatedData);

      set((state) => ({
        vehicles: state.vehicles.map((vehicle) =>
          vehicle.firestoreId === vehicleId
            ? { ...vehicle, ...updatedData }
            : vehicle
        ),
        currentVehicle: state.currentVehicle?.firestoreId === vehicleId
          ? { ...state.currentVehicle, ...updatedData }
          : state.currentVehicle,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete motorcycle
  deleteVehicle: async (vehicleId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDocument('vehicles', vehicleId);

      set((state) => ({
        vehicles: state.vehicles.filter((vehicle) => vehicle.firestoreId !== vehicleId),
        currentVehicle: state.currentVehicle?.firestoreId === vehicleId ? null : state.currentVehicle,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Fetch all motorcycles
  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const vehicles = await getAllDocuments('vehicles', {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });

      set({ vehicles, isLoading: false });
      return { success: true, data: vehicles };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get motorcycle by ID
  getVehicleById: async (vehicleId) => {
    set({ isLoading: true, error: null });
    try {
      const docSnap = await getDocumentById('vehicles', vehicleId);
      
      if (docSnap) {
        const vehicle = docSnap;
        set({ currentVehicle: vehicle, isLoading: false });
        return { success: true, data: vehicle };
      } else {
        set({ error: 'Veículo não encontrado', isLoading: false });
        return { success: false, error: 'Veículo não encontrado' };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  subscribeToVehicles: () => {
    return subscribeToCollection('vehicles', (vehicles) => {
      set({ vehicles });
    }, {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  },

  // Search motorcycles
  searchVehicles: async (searchTerm) => {
    set({ isLoading: true, error: null });
    try {
      // Buscar todos e filtrar localmente para melhor suporte multi-tenant
      const allItems = await getAllDocuments('vehicles');
      const searchLower = searchTerm.toLowerCase();
      
      const searchResults = allItems.filter(item =>
        item.vehicleId?.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower) ||
        item.model?.toLowerCase().includes(searchLower) ||
        item.clientId?.toLowerCase().includes(searchLower) ||
        item.plate?.toLowerCase().includes(searchLower)
      ).slice(0, 20);

      set({ searchResults, isLoading: false });
      return { success: true, data: searchResults };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update vehicle status
  updateStatus: async (vehicleId, newStatus) => {
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
      
      await get().updateVehicle(vehicleId, updates);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add part to vehicle
  addPart: async (vehicleId, partData) => {
    try {
      const vehicle = get().vehicles.find(m => m.firestoreId === vehicleId);
      if (!vehicle) return { success: false, error: 'Veículo não encontrado' };
      
      const newPart = {
        id: Date.now().toString(),
        ...partData,
        addedAt: new Date().toISOString(),
      };
      
      const updatedParts = [...(vehicle.usedParts || []), newPart];
      const newPartsCost = (vehicle.partsCost || 0) + (partData.cost || 0);
      const newTotalCost = newPartsCost + (vehicle.laborCost || 0);
      
      await get().updateVehicle(vehicleId, {
        usedParts: updatedParts,
        partsCost: newPartsCost,
        totalCost: newTotalCost,
      });
      
      return { success: true, data: newPart };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove part from vehicle
  removePart: async (vehicleId, partId) => {
    try {
      const vehicle = get().vehicles.find(m => m.firestoreId === vehicleId);
      if (!vehicle) return { success: false, error: 'Veículo não encontrado' };
      
      const partToRemove = vehicle.usedParts.find(p => p.id === partId);
      const updatedParts = vehicle.usedParts.filter(p => p.id !== partId);
      const newPartsCost = (vehicle.partsCost || 0) - (partToRemove?.cost || 0);
      const newTotalCost = newPartsCost + (vehicle.laborCost || 0);
      
      await get().updateVehicle(vehicleId, {
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
  addWorkLog: async (vehicleId, logData) => {
    try {
      const vehicle = get().vehicles.find(m => m.firestoreId === vehicleId);
      if (!vehicle) return { success: false, error: 'Veículo não encontrado' };
      
      const newLog = {
        id: Date.now().toString(),
        ...logData,
        timestamp: new Date().toISOString(),
      };
      
      const updatedLog = [newLog, ...(vehicle.workLog || [])];
      
      await get().updateVehicle(vehicleId, {
        workLog: updatedLog,
      });
      
      return { success: true, data: newLog };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update progress
  updateProgress: async (vehicleId, progress) => {
    try {
      await get().updateVehicle(vehicleId, { progress });
      
      // Auto-update status based on progress
      if (progress === 100) {
        await get().updateStatus(vehicleId, 'Finalizada');
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add photo
  addPhoto: async (vehicleId, photoData) => {
    try {
      const vehicle = get().vehicles.find(m => m.firestoreId === vehicleId);
      if (!vehicle) return { success: false, error: 'Veículo não encontrado' };
      
      const newPhoto = {
        id: Date.now().toString(),
        ...photoData,
        uploadedAt: new Date().toISOString(),
      };
      
      const updatedPhotos = [...(vehicle.photos || []), newPhoto];
      
      await get().updateVehicle(vehicleId, {
        photos: updatedPhotos,
      });
      
      return { success: true, data: newPhoto };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove photo
  removePhoto: async (vehicleId, photoId) => {
    try {
      const vehicle = get().vehicles.find(m => m.firestoreId === vehicleId);
      if (!vehicle) return { success: false, error: 'Veículo não encontrado' };
      
      const updatedPhotos = vehicle.photos.filter(p => p.id !== photoId);
      
      await get().updateVehicle(vehicleId, {
        photos: updatedPhotos,
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get filtered vehicles
  getFilteredVehicles: () => {
    const { vehicles, filters } = get();
    
    return vehicles.filter(vehicle => {
      if (filters.status && vehicle.status !== filters.status) return false;
      if (filters.brand && vehicle.brand !== filters.brand) return false;
      if (filters.model && vehicle.model !== filters.model) return false;
      if (filters.year && vehicle.year !== filters.year) return false;
      if (filters.clientId && vehicle.clientId !== filters.clientId) return false;
      
      return true;
    });
  },

  // Get vehicles by status
  getVehiclesByStatus: (status) => {
    const { vehicles } = get();
    return vehicles.filter(vehicle => vehicle.status === status);
  },

  // Get vehicles by client
  getVehiclesByClient: (clientId) => {
    const { vehicles } = get();
    return vehicles.filter(vehicle => vehicle.clientId === clientId);
  },

  // Get vehicle statistics
  getVehicleStatistics: () => {
    const { vehicles } = get();
    
    const totalVehicles = vehicles.length;
    const inProgress = vehicles.filter(m => ['Em Montagem', 'Aguardando Peças', 'Teste'].includes(m.status)).length;
    const completed = vehicles.filter(m => m.status === 'Finalizada').length;
    const delivered = vehicles.filter(m => m.status === 'Entregue').length;
    
    // Calculate average completion time
    const completedVehicles = vehicles.filter(m => m.completionDate && m.startDate);
    let averageCompletionTime = 0;
    
    if (completedVehicles.length > 0) {
      const totalTime = completedVehicles.reduce((sum, vehicle) => {
        const start = new Date(vehicle.startDate);
        const end = new Date(vehicle.completionDate);
        return sum + (end - start);
      }, 0);
      
      averageCompletionTime = totalTime / completedVehicles.length / (1000 * 60 * 60 * 24); // days
    }
    
    // Total revenue
    const totalRevenue = vehicles
      .filter(m => m.status === 'Entregue')
      .reduce((sum, m) => sum + (m.totalCost || 0), 0);
    
    // Most popular brands
    const brandCounts = {};
    vehicles.forEach(m => {
      const brand = m.brand || 'Outros';
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
    
    const popularBrands = Object.entries(brandCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([brand, count]) => ({ brand, count }));
    
    return {
      totalVehicles,
      inProgress,
      completed,
      delivered,
      averageCompletionTime: Math.round(averageCompletionTime * 100) / 100,
      totalRevenue,
      popularBrands,
      completionRate: totalVehicles > 0 ? (completed / totalVehicles) * 100 : 0,
      deliveryRate: totalVehicles > 0 ? (delivered / totalVehicles) * 100 : 0,
    };
  },

  // Clear search results
  clearSearchResults: () => set({ searchResults: [] }),

  // Real-time listener is already defined as subscribeToVehicles above
}));