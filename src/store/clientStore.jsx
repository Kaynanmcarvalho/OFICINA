import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useClientStore = create((set, get) => ({
  // State
  clients: [],
  currentClient: null,
  isLoading: false,
  error: null,
  searchResults: [],

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Create new client
  createClient: async (clientData) => {
    set({ isLoading: true, error: null });
    try {
      const newClient = {
        ...clientData,
        clientId: `CLI-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalServices: 0,
        lastServiceDate: null,
        vehicles: clientData.vehicles || [],
        serviceHistory: [],
      };

      const docRef = await addDoc(collection(db, 'clients'), newClient);
      const clientWithId = { ...newClient, firestoreId: docRef.id };

      set((state) => ({
        clients: [clientWithId, ...state.clients],
        isLoading: false,
      }));

      return { success: true, data: clientWithId };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update client
  updateClient: async (clientId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const clientRef = doc(db, 'clients', clientId);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(clientRef, updatedData);

      set((state) => ({
        clients: state.clients.map((client) =>
          client.firestoreId === clientId
            ? { ...client, ...updatedData }
            : client
        ),
        currentClient: state.currentClient?.firestoreId === clientId
          ? { ...state.currentClient, ...updatedData }
          : state.currentClient,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete client
  deleteClient: async (clientId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, 'clients', clientId));

      set((state) => ({
        clients: state.clients.filter((client) => client.firestoreId !== clientId),
        currentClient: state.currentClient?.firestoreId === clientId ? null : state.currentClient,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Fetch all clients
  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const q = query(
        collection(db, 'clients'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const clients = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
      }));

      set({ clients, isLoading: false });
      return { success: true, data: clients };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get client by ID
  getClientById: async (clientId) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'clients', clientId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const client = { ...docSnap.data(), firestoreId: docSnap.id };
        set({ currentClient: client, isLoading: false });
        return { success: true, data: client };
      } else {
        set({ error: 'Cliente não encontrado', isLoading: false });
        return { success: false, error: 'Cliente não encontrado' };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Search clients
  searchClients: async (searchTerm) => {
    set({ isLoading: true, error: null });
    try {
      // Search by name
      const nameQuery = query(
        collection(db, 'clients'),
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        orderBy('name'),
        limit(10)
      );
      
      // Search by client ID
      const idQuery = query(
        collection(db, 'clients'),
        where('clientId', '>=', searchTerm),
        where('clientId', '<=', searchTerm + '\uf8ff'),
        limit(10)
      );
      
      // Search by phone
      const phoneQuery = query(
        collection(db, 'clients'),
        where('phone', '>=', searchTerm),
        where('phone', '<=', searchTerm + '\uf8ff'),
        limit(10)
      );
      
      const [nameResults, idResults, phoneResults] = await Promise.all([
        getDocs(nameQuery),
        getDocs(idQuery),
        getDocs(phoneQuery)
      ]);
      
      const allResults = new Map();
      
      // Combine results and remove duplicates
      [...nameResults.docs, ...idResults.docs, ...phoneResults.docs].forEach(doc => {
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

  // Add vehicle to client
  addVehicle: async (clientId, vehicleData) => {
    try {
      const client = get().clients.find(c => c.firestoreId === clientId);
      if (!client) return { success: false, error: 'Cliente não encontrado' };
      
      const newVehicle = {
        id: Date.now().toString(),
        ...vehicleData,
        addedAt: new Date().toISOString(),
      };
      
      const updatedVehicles = [...(client.vehicles || []), newVehicle];
      
      await get().updateClient(clientId, { vehicles: updatedVehicles });
      
      return { success: true, data: newVehicle };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove vehicle from client
  removeVehicle: async (clientId, vehicleId) => {
    try {
      const client = get().clients.find(c => c.firestoreId === clientId);
      if (!client) return { success: false, error: 'Cliente não encontrado' };
      
      const updatedVehicles = client.vehicles.filter(v => v.id !== vehicleId);
      
      await get().updateClient(clientId, { vehicles: updatedVehicles });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add service to client history
  addServiceToHistory: async (clientId, serviceData) => {
    try {
      const client = get().clients.find(c => c.firestoreId === clientId);
      if (!client) return { success: false, error: 'Cliente não encontrado' };
      
      const newService = {
        id: Date.now().toString(),
        ...serviceData,
        date: new Date().toISOString(),
      };
      
      const updatedHistory = [newService, ...(client.serviceHistory || [])];
      const totalServices = (client.totalServices || 0) + 1;
      
      await get().updateClient(clientId, {
        serviceHistory: updatedHistory,
        totalServices,
        lastServiceDate: newService.date,
      });
      
      return { success: true, data: newService };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get client statistics
  getClientStatistics: (clientId) => {
    const client = get().clients.find(c => c.firestoreId === clientId);
    if (!client) return null;
    
    const serviceHistory = client.serviceHistory || [];
    const totalServices = serviceHistory.length;
    const totalSpent = serviceHistory.reduce((sum, service) => sum + (service.value || 0), 0);
    
    // Calculate frequency (services per month)
    if (totalServices > 1) {
      const firstService = new Date(serviceHistory[serviceHistory.length - 1].date);
      const lastService = new Date(serviceHistory[0].date);
      const monthsDiff = (lastService - firstService) / (1000 * 60 * 60 * 24 * 30);
      const frequency = monthsDiff > 0 ? totalServices / monthsDiff : 0;
      
      return {
        totalServices,
        totalSpent,
        averageServiceValue: totalSpent / totalServices,
        frequency: Math.round(frequency * 100) / 100, // services per month
        lastServiceDate: client.lastServiceDate,
        vehicleCount: (client.vehicles || []).length,
      };
    }
    
    return {
      totalServices,
      totalSpent,
      averageServiceValue: totalSpent,
      frequency: 0,
      lastServiceDate: client.lastServiceDate,
      vehicleCount: (client.vehicles || []).length,
    };
  },

  // Get top clients by service count
  getTopClients: (limit = 10) => {
    const { clients } = get();
    return clients
      .sort((a, b) => (b.totalServices || 0) - (a.totalServices || 0))
      .slice(0, limit);
  },

  // Get recent clients
  getRecentClients: (limit = 10) => {
    const { clients } = get();
    return clients
      .filter(client => client.lastServiceDate)
      .sort((a, b) => new Date(b.lastServiceDate) - new Date(a.lastServiceDate))
      .slice(0, limit);
  },

  // Clear search results
  clearSearchResults: () => set({ searchResults: [] }),

  // Real-time listener
  subscribeToClients: () => {
    const q = query(
      collection(db, 'clients'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const clients = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
      }));
      
      set({ clients });
    });
  },
}));