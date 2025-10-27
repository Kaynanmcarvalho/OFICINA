import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useSettingsStore = create((set, get) => ({
  settings: {
    workshopName: '',
    address: '',
    phone: '',
    email: '',
    openingTime: '08:00',
    closingTime: '18:00',
    theme: 'auto',
    language: 'pt-BR',
  },
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ settings: docSnap.data(), isLoading: false });
      } else {
        // Default settings if not exist
        const defaultSettings = get().settings;
        await setDoc(docRef, defaultSettings);
        set({ settings: defaultSettings, isLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateSettings: async (newSettings) => {
    set({ isLoading: true });
    try {
      const docRef = doc(db, 'settings', 'global');
      await setDoc(docRef, newSettings, { merge: true });
      set({ settings: { ...get().settings, ...newSettings }, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));