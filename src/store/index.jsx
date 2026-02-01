import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Lazy imports for stores - only load when needed
let checkinStore = null;
let clientStore = null;
let inventoryStore = null;
let productStore = null;
let vehicleStore = null;
let toolStore = null;
let teamStore = null;
let budgetStore = null;

// Lazy store getters
export const getCheckinStore = () => {
  if (!checkinStore) {
    checkinStore = require('./checkinStore.jsx').useCheckinStore;
  }
  return checkinStore;
};

export const getClientStore = () => {
  if (!clientStore) {
    clientStore = require('./clientStore.jsx').useClientStore;
  }
  return clientStore;
};

export const getInventoryStore = () => {
  if (!inventoryStore) {
    inventoryStore = require('./inventoryStore.jsx').useInventoryStore;
  }
  return inventoryStore;
};

export const getProductStore = () => {
  if (!productStore) {
    productStore = require('./productStore.jsx').useProductStore;
  }
  return productStore;
};

export const getVehicleStore = () => {
  if (!vehicleStore) {
    vehicleStore = require('./vehicleStore.jsx').useVehicleStore;
  }
  return vehicleStore;
};

export const getToolStore = () => {
  if (!toolStore) {
    toolStore = require('./toolStore.jsx').useToolStore;
  }
  return toolStore;
};

export const getTeamStore = () => {
  if (!teamStore) {
    teamStore = require('./teamStore.jsx').useTeamStore;
  }
  return teamStore;
};

export const getBudgetStore = () => {
  if (!budgetStore) {
    budgetStore = require('./budgetStore.jsx').useBudgetStore;
  }
  return budgetStore;
};

// Main store - minimal, fast initialization
export const useStore = create(
  subscribeWithSelector((set, get) => ({
    // Global loading state
    isGlobalLoading: false,
    setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

    // Global error state
    globalError: null,
    setGlobalError: (error) => set({ globalError: error }),
    clearGlobalError: () => set({ globalError: null }),

    // Loaded stores tracking
    loadedStores: new Set(),

    // Load a specific store on demand
    loadStore: async (storeName) => {
      const { loadedStores } = get();
      if (loadedStores.has(storeName)) return;

      try {
        switch (storeName) {
          case 'checkin':
            await getCheckinStore().getState().fetchCheckins();
            break;
          case 'client':
            await getClientStore().getState().fetchClients();
            break;
          case 'inventory':
            await getInventoryStore().getState().fetchParts();
            break;
          case 'product':
            await getProductStore().getState().fetchProducts();
            break;
          case 'vehicle':
            await getVehicleStore().getState().fetchVehicles();
            break;
          case 'tool':
            await getToolStore().getState().fetchTools();
            break;
          case 'team':
            await getTeamStore().getState().fetchMembers();
            break;
          case 'budget':
            await getBudgetStore().getState().fetchBudgets();
            break;
        }
        loadedStores.add(storeName);
        set({ loadedStores: new Set(loadedStores) });
      } catch (error) {
        console.error(`Error loading ${storeName} store:`, error);
      }
    },

    // Reset all stores
    resetStores: () => {
      set({ globalError: null, isGlobalLoading: false, loadedStores: new Set() });
    },
  }))
);

// Export individual stores for direct access (lazy loaded)
export { useAuthStore } from './authStore.jsx';
export { useThemeStore } from './themeStore.jsx';
export { useNotificationStore } from './notificationStore.jsx';
export { useCheckinStore } from './checkinStore.jsx';
export { useClientStore } from './clientStore.jsx';
export { useInventoryStore } from './inventoryStore.jsx';
export { useProductStore } from './productStore.jsx';
export { useVehicleStore } from './vehicleStore.jsx';
export { useToolStore } from './toolStore.jsx';
export { useTeamStore } from './teamStore.jsx';
export { useSettingsStore } from './settingsStore.jsx';
export { useOrganizationStore } from './organizationStore.jsx';
export { useBudgetStore } from './budgetStore.jsx';
export { default as useCaixaStore } from './caixaStore.js';
export { useReportsStore } from './reportsStore.jsx';
