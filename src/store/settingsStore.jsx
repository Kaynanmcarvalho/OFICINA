import { create } from 'zustand';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

export const settingsStore = (set, get) => ({
  // Settings state
  settings: null,
  isLoading: false,
  error: null,

  // Default settings
  defaultSettings: {
    theme: 'auto',
    language: 'pt-BR',
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    appointmentReminders: true,
    createdAt: null,
    updatedAt: null
  },

  // Actions
  fetchSettings: async (userId) => {
    if (!userId) return;
    
    set({ isLoading: true, error: null });
    try {
      const settingsDoc = await getDoc(doc(db, 'userSettings', userId));
      
      if (settingsDoc.exists()) {
        const settingsData = settingsDoc.data();
        set({
          settings: { id: userId, ...settingsData },
          isLoading: false
        });
      } else {
        // Create default settings if they don't exist
        const defaultSettings = {
          ...get().defaultSettings,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'userSettings', userId), defaultSettings);
        set({
          settings: { id: userId, ...defaultSettings },
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao carregar configurações');
    }
  },

  updateSettings: async (userId, updates) => {
    if (!userId) return { success: false, error: 'ID do usuário não fornecido' };
    
    set({ isLoading: true, error: null });
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const settingsRef = doc(db, 'userSettings', userId);
      const settingsDoc = await getDoc(settingsRef);
      
      if (settingsDoc.exists()) {
        await updateDoc(settingsRef, updatedData);
      } else {
        await setDoc(settingsRef, {
          ...get().defaultSettings,
          ...updatedData,
          createdAt: new Date().toISOString()
        });
      }
      
      set({
        settings: { 
          ...get().settings, 
          ...updatedData 
        },
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating settings:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao atualizar configurações');
      return { success: false, error: error.message };
    }
  },

  // Get specific setting
  getSetting: (key) => {
    const { settings, defaultSettings } = get();
    return settings?.[key] ?? defaultSettings[key];
  },

  // Clear settings
  clearSettings: () => {
    set({
      settings: null,
      error: null
    });
  }
});

export const useSettingsStore = create(settingsStore);
