import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { useAuthStore } from './authStore.jsx';
import { useThemeStore } from './themeStore.jsx';
import { useNotificationStore } from './notificationStore.jsx';
import { useCheckinStore } from './checkinStore.jsx';
import { useClientStore } from './clientStore.jsx';
import { useInventoryStore } from './inventoryStore.jsx';
import { useVehicleStore } from './vehicleStore.jsx';
import { useToolStore } from './toolStore.jsx';
import { useTeamStore } from './teamStore.jsx';
import { useSettingsStore } from './settingsStore.jsx';
import { useOrganizationStore } from './organizationStore.jsx';
import { useBudgetStore } from './budgetStore.jsx';

// Main store combining all stores
export const useStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Global loading state
        isGlobalLoading: false,
        setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

        // Global error state
        globalError: null,
        setGlobalError: (error) => set({ globalError: error }),
        clearGlobalError: () => set({ globalError: null }),

        // Initialize all stores
        initializeStores: async () => {
          try {
            set({ isGlobalLoading: true });
            
            // Initialize auth store
            const authStore = useAuthStore.getState();
            await authStore.initializeAuth();
            
            // Initialize theme store
            const themeStore = useThemeStore.getState();
            themeStore.initializeTheme();
            
            // Initialize data stores if user is authenticated
            if (authStore.user) {
              await Promise.all([
                useCheckinStore.getState().fetchCheckins(),
                useClientStore.getState().fetchClients(),
                useInventoryStore.getState().fetchParts(),
                useVehicleStore.getState().fetchVehicles(),
                useToolStore.getState().fetchTools(),
                useTeamStore.getState().fetchMembers(),
                useBudgetStore.getState().fetchBudgets(),
              ]);
            }
            
            set({ isGlobalLoading: false });
          } catch (error) {
            set({ 
              globalError: error.message, 
              isGlobalLoading: false 
            });
          }
        },

        // Reset all stores
        resetStores: () => {
          useAuthStore.getState().logout();
          useNotificationStore.getState().clearNotifications();
          useCheckinStore.getState().clearError();
          useClientStore.getState().clearError();
          useInventoryStore.getState().clearError();
          useVehicleStore.getState().clearError();
          useToolStore.getState().clearError();
          useTeamStore.getState().clearError();
          set({ globalError: null, isGlobalLoading: false });
        },

        // Setup real-time listeners
        setupRealtimeListeners: () => {
          const unsubscribers = [];
          
          // Setup listeners for all stores
          unsubscribers.push(
            useCheckinStore.getState().subscribeToCheckins(),
            useClientStore.getState().subscribeToClients(),
            useInventoryStore.getState().subscribeToInventory(),
            useVehicleStore.getState().subscribeToVehicles(),
            useToolStore.getState().subscribeToTools(),
            useTeamStore.getState().subscribeToMembers(),
            useTeamStore.getState().subscribeToSchedules(),
            useBudgetStore.getState().subscribeToBudgets()
          );
          
          return () => {
            unsubscribers.forEach(unsubscribe => unsubscribe());
          };
        },
      }),
      {
        name: 'oficina-main-store',
        partialize: (state) => ({
          // Only persist specific state
          theme: useThemeStore.getState().theme,
          language: useThemeStore.getState().language,
          user: useAuthStore.getState().user,
        }),
      }
    )
  )
);

// Export individual stores for direct access
export { useAuthStore } from './authStore.jsx';
export { useThemeStore } from './themeStore.jsx';
export { useNotificationStore } from './notificationStore.jsx';
export { useCheckinStore } from './checkinStore.jsx';
export { useClientStore } from './clientStore.jsx';
export { useInventoryStore } from './inventoryStore.jsx';
export { useVehicleStore } from './vehicleStore.jsx';
export { useToolStore } from './toolStore.jsx';
export { useTeamStore } from './teamStore.jsx';
export { useSettingsStore } from './settingsStore.jsx';
export { useOrganizationStore } from './organizationStore.jsx';
export { useBudgetStore } from './budgetStore.jsx';