import { create } from 'zustand';
import toast from 'react-hot-toast';
import { smartClientSearch } from '../utils/searchUtils';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  subscribeToCollection
} from '../services/storeHelpers';

export const useClientStore = create((set, get) => ({
  // State
  clients: [],
  currentClient: null,
  isLoading: false,
  error: null,
  searchResults: [],
  migrationStatus: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Migration from localStorage
  migrateFromLocalStorage: async () => {
    const STORAGE_KEY = 'oficina_clients';
    const MIGRATION_KEY = 'migration_status';
    
    try {
      // Check if migration already completed
      const existingMigration = localStorage.getItem(MIGRATION_KEY);
      if (existingMigration) {
        const status = JSON.parse(existingMigration);
        if (status.isComplete) {
          console.log('[Migration] Already completed:', status);
          set({ migrationStatus: status });
          return status;
        }
      }

      // Get clients from localStorage
      const localClientsStr = localStorage.getItem(STORAGE_KEY);
      if (!localClientsStr) {
        console.log('[Migration] No clients found in localStorage');
        return null;
      }

      const localClients = JSON.parse(localClientsStr);
      if (localClients.length === 0) {
        console.log('[Migration] Empty clients array in localStorage');
        return null;
      }

      console.log(`[Migration] Found ${localClients.length} clients in localStorage`);

      const migrationStatus = {
        isComplete: false,
        migratedCount: 0,
        failedCount: 0,
        skippedCount: 0,
        errors: [],
        timestamp: new Date().toISOString()
      };

      // Fetch existing clients from Firebase
      const existingClients = get().clients;
      console.log(`[Migration] Existing clients in Firebase: ${existingClients.length}`);
      
      for (const localClient of localClients) {
        try {
          console.log(`[Migration] Processing client: ${localClient.name}`, localClient);
          
          // Check for duplicates by clientId, phone, or CPF
          const isDuplicate = existingClients.some(existing => {
            const match = existing.clientId === localClient.id ||
              existing.clientId === localClient.clientId ||
              (localClient.phone && existing.phone === localClient.phone) ||
              (localClient.cpf && existing.cpf === localClient.cpf);
            
            if (match) {
              console.log(`[Migration] Found duplicate match:`, {
                existing: { clientId: existing.clientId, phone: existing.phone, cpf: existing.cpf },
                local: { id: localClient.id, clientId: localClient.clientId, phone: localClient.phone, cpf: localClient.cpf }
              });
            }
            
            return match;
          });

          if (isDuplicate) {
            console.log(`[Migration] Skipping duplicate client: ${localClient.name}`);
            migrationStatus.skippedCount++;
            continue;
          }
          
          console.log(`[Migration] Client ${localClient.name} is not a duplicate, migrating...`);

          // Prepare client data for Firebase
          const clientData = {
            name: localClient.name,
            phone: localClient.phone,
            cpf: localClient.cpf || '',
            cnpj: localClient.cnpj || '',
            email: localClient.email || '',
            address: localClient.address || '',
            vehicles: localClient.vehicles || [],
            serviceHistory: localClient.serviceHistory || [],
            totalServices: localClient.totalServices || 0,
            lastServiceDate: localClient.lastServiceDate || null,
          };

          // Create client in Firebase
          const result = await get().createClient(clientData);
          
          if (result.success) {
            migrationStatus.migratedCount++;
            console.log(`[Migration] Migrated client: ${localClient.name}`);
          } else {
            migrationStatus.failedCount++;
            migrationStatus.errors.push(`Failed to migrate ${localClient.name}: ${result.error}`);
          }
        } catch (error) {
          migrationStatus.failedCount++;
          migrationStatus.errors.push(`Error migrating ${localClient.name}: ${error.message}`);
          console.error(`[Migration] Error migrating client:`, error);
        }
      }

      migrationStatus.isComplete = true;
      
      // Save migration status
      localStorage.setItem(MIGRATION_KEY, JSON.stringify(migrationStatus));
      set({ migrationStatus });

      console.log('[Migration] Complete:', migrationStatus);

      // Show success notification
      if (migrationStatus.migratedCount > 0) {
        toast.success(
          `${migrationStatus.migratedCount} cliente(s) migrado(s) com sucesso!`,
          { duration: 5000 }
        );
      }

      // Show warning if there were failures
      if (migrationStatus.failedCount > 0) {
        toast.error(
          `${migrationStatus.failedCount} cliente(s) falharam na migração. Verifique o console.`,
          { duration: 7000 }
        );
      }

      // Schedule localStorage cleanup after 7 days
      const cleanupDate = new Date();
      cleanupDate.setDate(cleanupDate.getDate() + 7);
      localStorage.setItem('migration_cleanup_date', cleanupDate.toISOString());

      return migrationStatus;
    } catch (error) {
      console.error('[Migration] Fatal error:', error);
      
      const errorStatus = {
        isComplete: false,
        migratedCount: 0,
        failedCount: 0,
        skippedCount: 0,
        errors: [error.message],
        timestamp: new Date().toISOString()
      };
      
      set({ migrationStatus: errorStatus });
      
      // Show error notification
      toast.error(
        'Falha ao migrar dados. Seus dados estão seguros no armazenamento local.',
        { duration: 7000 }
      );
      
      return null;
    }
  },

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

      const clientWithId = await addDocument('clients', newClient);

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
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDocument('clients', clientId, updatedData);

      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === clientId || client.firestoreId === clientId
            ? { ...client, ...updatedData }
            : client
        ),
        currentClient: (state.currentClient?.id === clientId || state.currentClient?.firestoreId === clientId)
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
      await deleteDocument('clients', clientId);

      set((state) => ({
        clients: state.clients.filter((client) => 
          client.id !== clientId && client.firestoreId !== clientId
        ),
        currentClient: (state.currentClient?.id === clientId || state.currentClient?.firestoreId === clientId) 
          ? null 
          : state.currentClient,
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
      const clients = await getAllDocuments('clients', {
        orderBy: { field: 'createdAt', direction: 'desc' }
      });

      set({ clients, isLoading: false });

      console.log('[fetchClients] Loaded clients from Firebase:', clients.length);

      // Run migration after fetching clients (only once)
      const migrationStatus = get().migrationStatus;
      if (!migrationStatus) {
        console.log('[fetchClients] Starting migration...');
        await get().migrateFromLocalStorage();
        
        // Fetch again after migration to get newly migrated clients
        const updatedClients = await getAllDocuments('clients', {
          orderBy: { field: 'createdAt', direction: 'desc' }
        });
        
        set({ clients: updatedClients });
        console.log('[fetchClients] Clients after migration:', updatedClients.length);
        
        return { success: true, data: updatedClients };
      }

      return { success: true, data: clients };
    } catch (error) {
      console.error('[fetchClients] Error:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get client by ID
  getClientById: async (clientId) => {
    set({ isLoading: true, error: null });
    try {
      const client = await getDocumentById('clients', clientId);
      
      if (client) {
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

  // Search clients with intelligent fuzzy matching
  searchClients: async (searchTerm) => {
    const startTime = performance.now();
    set({ isLoading: true, error: null });
    try {
      // Get all clients from cache or Firebase
      let allClients = get().clients;
      
      // If cache is empty, fetch from Firebase
      if (allClients.length === 0) {
        allClients = await getAllDocuments('clients');
        set({ clients: allClients });
      }
      
      // Use intelligent search with relevance scoring
      const searchResults = smartClientSearch(allClients, searchTerm, {
        maxResults: 10,
        minScore: 10,
        includeScore: false
      });

      set({ searchResults, isLoading: false });
      
      // Log performance
      const duration = performance.now() - startTime;
      console.log('[Smart Search]', {
        term: searchTerm,
        totalClients: allClients.length,
        results: searchResults.length,
        duration: `${Math.round(duration)}ms`,
        timestamp: new Date().toISOString()
      });

      // Warn if search is slow
      if (duration > 2000) {
        console.warn('[Search Performance] Search took longer than 2 seconds:', duration);
        toast.warning('A busca está demorando mais que o esperado. Considere otimizar os índices do Firebase.');
      }

      return { success: true, data: searchResults };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      
      // Log error
      console.error('[Search Error]', {
        term: searchTerm,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      return { success: false, error: error.message };
    }
  },

  // Add vehicle to client
  addVehicle: async (clientId, vehicleData) => {
    try {
      const client = get().clients.find(c => c.id === clientId || c.firestoreId === clientId);
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
      const client = get().clients.find(c => c.id === clientId || c.firestoreId === clientId);
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
      const client = get().clients.find(c => c.id === clientId || c.firestoreId === clientId);
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
    const client = get().clients.find(c => c.id === clientId || c.firestoreId === clientId);
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
    return subscribeToCollection('clients', (clients) => {
      set({ clients });
    }, {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  },
}));
