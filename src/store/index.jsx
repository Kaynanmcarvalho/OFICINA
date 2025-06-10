import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { useAuthStore } from './authStore.jsx';
import { useThemeStore } from './themeStore.jsx';
import { useNotificationStore } from './notificationStore.jsx';
import { useCheckinStore } from './checkinStore.jsx';
import { useClientStore } from './clientStore.jsx';
import { useInventoryStore } from './inventoryStore.jsx';
import { useMotorcycleStore } from './motorcycleStore.jsx';
import { useToolStore } from './toolStore.jsx';
import { useTeamStore } from './teamStore.jsx';

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
                useMotorcycleStore.getState().fetchMotorcycles(),
                useToolStore.getState().fetchTools(),
                useTeamStore.getState().fetchMembers(),
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
          useMotorcycleStore.getState().clearError();
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
            useMotorcycleStore.getState().subscribeToMotorcycles(),
            useToolStore.getState().subscribeToTools(),
            useTeamStore.getState().subscribeToMembers(),
            useTeamStore.getState().subscribeToSchedules()
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
export { useMotorcycleStore } from './motorcycleStore.jsx';
export { useToolStore } from './toolStore.jsx';
export { useTeamStore } from './teamStore.jsx';