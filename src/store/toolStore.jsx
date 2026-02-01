import { create } from 'zustand';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  subscribeToCollection
} from '../services/storeHelpers';
export const useToolStore = create((set, get) => ({
  // State
  tools: [],
  currentTool: null,
  isLoading: false,
  error: null,
  searchResults: [],
  filters: {
    category: '',
    status: '',
    location: '',
    assignedTo: '',
  },
  categories: [
    'Chaves',
    'Alicates',
    'Chaves de Fenda',
    'Martelos',
    'Furadeiras',
    'Soldas',
    'Medição',
    'Elétrica',
    'Pneumática',
    'Hidráulica',
    'Outros'
  ],
  statuses: [
    'Disponível',
    'Em Uso',
    'Manutenção',
    'Quebrada',
    'Emprestada'
  ],

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: { category: '', status: '', location: '', assignedTo: '' } }),

  // Create new tool
  createTool: async (toolData) => {
    set({ isLoading: true, error: null });
    try {
      const newTool = {
        ...toolData,
        toolId: `TL-${Date.now()}`,
        status: 'Disponível',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUsedDate: null,
        totalUsageHours: 0,
        maintenanceHistory: [],
        usageLog: [],
        assignedTo: null,
        currentLocation: toolData.defaultLocation || 'Oficina Principal',
      };

      const toolWithId = await addDocument('tools', newTool);

      set((state) => ({
        tools: [toolWithId, ...state.tools],
        isLoading: false,
      }));

      return { success: true, data: toolWithId };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update tool
  updateTool: async (toolId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDocument('tools', toolId, updatedData);

      set((state) => ({
        tools: state.tools.map((tool) =>
          tool.firestoreId === toolId
            ? { ...tool, ...updatedData }
            : tool
        ),
        currentTool: state.currentTool?.firestoreId === toolId
          ? { ...state.currentTool, ...updatedData }
          : state.currentTool,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete tool
  deleteTool: async (toolId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDocument('tools', toolId);

      set((state) => ({
        tools: state.tools.filter((tool) => tool.firestoreId !== toolId),
        currentTool: state.currentTool?.firestoreId === toolId ? null : state.currentTool,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Fetch all tools
  fetchTools: async () => {
    set({ isLoading: true, error: null });
    try {
      const tools = await getAllDocuments('tools', {
      orderBy: { field: 'name', direction: 'asc' }
    });

      set({ tools, isLoading: false });
      return { success: true, data: tools };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get tool by ID
  getToolById: async (toolId) => {
    set({ isLoading: true, error: null });
    try {
      const docSnap = await getDocumentById('tools', toolId);
      
      if (docSnap) {
        const tool = docSnap;
        set({ currentTool: tool, isLoading: false });
        return { success: true, data: tool };
      } else {
        set({ error: 'Ferramenta não encontrada', isLoading: false });
        return { success: false, error: 'Ferramenta não encontrada' };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Search tools
  searchTools: async (searchTerm) => {
    set({ isLoading: true, error: null });
    try {
      // Search by name - usando busca local
      
      // Search by tool ID
      const idQuery = query(
        collection(db, 'tools'),
        where('toolId', '>=', searchTerm),
        where('toolId', '<=', searchTerm + '\uf8ff'),
        limit(20)
      );
      
      // Search by brand - usando busca local
      
      // Buscar todos e filtrar localmente
      const allItems = await getAllDocuments('brandResults');
    const searchLower = searchTerm.toLowerCase();
      
      const allResults = new Map();
      
      // Combine results and remove duplicates
      [...nameResults.docs, ...idResults.docs, ...brandResults.docs].forEach(doc => {
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

  // Check out tool (assign to user)
  checkOutTool: async (toolId, userId, purpose = '', estimatedReturnDate = null) => {
    try {
      const tool = get().tools.find(t => t.firestoreId === toolId);
      if (!tool) return { success: false, error: 'Ferramenta não encontrada' };
      
      if (tool.status !== 'Disponível') {
        return { success: false, error: 'Ferramenta não está disponível' };
      }
      
      const checkoutLog = {
        id: Date.now().toString(),
        type: 'checkout',
        userId,
        purpose,
        timestamp: new Date().toISOString(),
        estimatedReturnDate,
        returnDate: null,
      };
      
      const updatedLog = [checkoutLog, ...(tool.usageLog || [])];
      
      await get().updateTool(toolId, {
        status: 'Em Uso',
        assignedTo: userId,
        usageLog: updatedLog,
        lastUsedDate: new Date().toISOString(),
      });
      
      return { success: true, data: checkoutLog };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check in tool (return from user)
  checkInTool: async (toolId, condition = 'Boa', notes = '') => {
    try {
      const tool = get().tools.find(t => t.firestoreId === toolId);
      if (!tool) return { success: false, error: 'Ferramenta não encontrada' };
      
      if (tool.status !== 'Em Uso') {
        return { success: false, error: 'Ferramenta não está em uso' };
      }
      
      // Find the latest checkout log and update it
      const updatedLog = tool.usageLog.map(log => {
        if (log.type === 'checkout' && !log.returnDate) {
          return {
            ...log,
            returnDate: new Date().toISOString(),
            returnCondition: condition,
            returnNotes: notes,
          };
        }
        return log;
      });
      
      // Calculate usage hours
      const latestCheckout = tool.usageLog.find(log => log.type === 'checkout' && !log.returnDate);
      let usageHours = 0;
      
      if (latestCheckout) {
        const checkoutTime = new Date(latestCheckout.timestamp);
        const returnTime = new Date();
        usageHours = (returnTime - checkoutTime) / (1000 * 60 * 60); // hours
      }
      
      const newStatus = condition === 'Quebrada' ? 'Quebrada' : 
                       condition === 'Precisa Manutenção' ? 'Manutenção' : 'Disponível';
      
      await get().updateTool(toolId, {
        status: newStatus,
        assignedTo: null,
        usageLog: updatedLog,
        totalUsageHours: (tool.totalUsageHours || 0) + usageHours,
      });
      
      return { success: true, data: { usageHours, condition } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add maintenance record
  addMaintenanceRecord: async (toolId, maintenanceData) => {
    try {
      const tool = get().tools.find(t => t.firestoreId === toolId);
      if (!tool) return { success: false, error: 'Ferramenta não encontrada' };
      
      const maintenanceRecord = {
        id: Date.now().toString(),
        ...maintenanceData,
        date: new Date().toISOString(),
      };
      
      const updatedHistory = [maintenanceRecord, ...(tool.maintenanceHistory || [])];
      
      // Update status based on maintenance type
      let newStatus = tool.status;
      if (maintenanceData.type === 'Preventiva' || maintenanceData.type === 'Corretiva') {
        newStatus = maintenanceData.completed ? 'Disponível' : 'Manutenção';
      }
      
      await get().updateTool(toolId, {
        maintenanceHistory: updatedHistory,
        status: newStatus,
        lastMaintenanceDate: maintenanceRecord.date,
      });
      
      return { success: true, data: maintenanceRecord };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update tool location
  updateLocation: async (toolId, newLocation) => {
    try {
      await get().updateTool(toolId, {
        currentLocation: newLocation,
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get filtered tools
  getFilteredTools: () => {
    const { tools, filters } = get();
    
    return tools.filter(tool => {
      if (filters.category && tool.category !== filters.category) return false;
      if (filters.status && tool.status !== filters.status) return false;
      if (filters.location && tool.currentLocation !== filters.location) return false;
      if (filters.assignedTo && tool.assignedTo !== filters.assignedTo) return false;
      
      return true;
    });
  },

  // Get tools by status
  getToolsByStatus: (status) => {
    const { tools } = get();
    return tools.filter(tool => tool.status === status);
  },

  // Get tools by category
  getToolsByCategory: (category) => {
    const { tools } = get();
    return tools.filter(tool => tool.category === category);
  },

  // Get tools assigned to user
  getToolsByUser: (userId) => {
    const { tools } = get();
    return tools.filter(tool => tool.assignedTo === userId);
  },

  // Get tools needing maintenance
  getToolsNeedingMaintenance: () => {
    const { tools } = get();
    const now = new Date();
    
    return tools.filter(tool => {
      // Tools in maintenance status
      if (tool.status === 'Manutenção' || tool.status === 'Quebrada') return true;
      
      // Tools that haven't had maintenance in a while
      if (tool.maintenanceInterval && tool.lastMaintenanceDate) {
        const lastMaintenance = new Date(tool.lastMaintenanceDate);
        const daysSinceLastMaintenance = (now - lastMaintenance) / (1000 * 60 * 60 * 24);
        return daysSinceLastMaintenance >= tool.maintenanceInterval;
      }
      
      // Tools with high usage hours
      if (tool.maxUsageHours && tool.totalUsageHours >= tool.maxUsageHours) return true;
      
      return false;
    });
  },

  // Get tool statistics
  getToolStatistics: () => {
    const { tools } = get();
    
    const totalTools = tools.length;
    const available = tools.filter(t => t.status === 'Disponível').length;
    const inUse = tools.filter(t => t.status === 'Em Uso').length;
    const maintenance = tools.filter(t => t.status === 'Manutenção').length;
    const broken = tools.filter(t => t.status === 'Quebrada').length;
    
    // Most used tools
    const mostUsedTools = tools
      .sort((a, b) => (b.totalUsageHours || 0) - (a.totalUsageHours || 0))
      .slice(0, 10);
    
    // Tools by category
    const categoryStats = {};
    tools.forEach(tool => {
      const category = tool.category || 'Outros';
      if (!categoryStats[category]) {
        categoryStats[category] = {
          total: 0,
          available: 0,
          inUse: 0,
          maintenance: 0,
        };
      }
      
      categoryStats[category].total++;
      if (tool.status === 'Disponível') categoryStats[category].available++;
      if (tool.status === 'Em Uso') categoryStats[category].inUse++;
      if (tool.status === 'Manutenção' || tool.status === 'Quebrada') categoryStats[category].maintenance++;
    });
    
    // Utilization rate
    const utilizationRate = totalTools > 0 ? (inUse / totalTools) * 100 : 0;
    
    return {
      totalTools,
      available,
      inUse,
      maintenance,
      broken,
      utilizationRate,
      mostUsedTools,
      categoryStats,
      availabilityRate: totalTools > 0 ? (available / totalTools) * 100 : 0,
      maintenanceRate: totalTools > 0 ? (maintenance / totalTools) * 100 : 0,
    };
  },

  // Get tool locations
  getToolLocations: () => {
    const { tools } = get();
    const locations = {};
    
    tools.forEach(tool => {
      const location = tool.currentLocation || 'Não Definido';
      if (!locations[location]) {
        locations[location] = {
          total: 0,
          available: 0,
          inUse: 0,
          tools: [],
        };
      }
      
      locations[location].total++;
      locations[location].tools.push(tool);
      
      if (tool.status === 'Disponível') locations[location].available++;
      if (tool.status === 'Em Uso') locations[location].inUse++;
    });
    
    return locations;
  },

  // Clear search results
  clearSearchResults: () => set({ searchResults: [] }),

  // Real-time listener
  subscribeToTools: () => {
    return subscribeToCollection('tools', (tools) => {
      set({ tools });
    }, {
      orderBy: { field: 'name', direction: 'asc' }
    });
  },
}));