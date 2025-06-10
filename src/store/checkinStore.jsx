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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export const useCheckinStore = create((set, get) => ({
  // State
  checkins: [],
  currentCheckin: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    employee: 'all',
    dateRange: null,
  },

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Create new check-in
  createCheckin: async (checkinData) => {
    set({ isLoading: true, error: null });
    try {
      const newCheckin = {
        ...checkinData,
        id: `CHK-${Date.now()}`,
        checkinDate: new Date().toISOString(),
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'checkins'), newCheckin);
      const checkinWithId = { ...newCheckin, firestoreId: docRef.id };

      set((state) => ({
        checkins: [checkinWithId, ...state.checkins],
        isLoading: false,
      }));

      return { success: true, data: checkinWithId };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update check-in
  updateCheckin: async (checkinId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const checkinRef = doc(db, 'checkins', checkinId);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(checkinRef, updatedData);

      set((state) => ({
        checkins: state.checkins.map((checkin) =>
          checkin.firestoreId === checkinId
            ? { ...checkin, ...updatedData }
            : checkin
        ),
        currentCheckin: state.currentCheckin?.firestoreId === checkinId
          ? { ...state.currentCheckin, ...updatedData }
          : state.currentCheckin,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Complete check-out
  completeCheckout: async (checkinId, checkoutData) => {
    set({ isLoading: true, error: null });
    try {
      const checkoutInfo = {
        ...checkoutData,
        status: 'completed',
        checkoutDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await get().updateCheckin(checkinId, checkoutInfo);
      
      // Notify completion
      const checkin = get().checkins.find(c => c.firestoreId === checkinId);
      if (checkin && window.notificationStore) {
        window.notificationStore.notifyServiceComplete(checkin.clientName, checkin.id);
      }

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Upload photos
  uploadPhotos: async (checkinId, files, type = 'before') => {
    set({ isLoading: true, error: null });
    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `${checkinId}/${type}/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `checkins/${fileName}`);
        
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          url: downloadURL,
          name: file.name,
          type,
          uploadedAt: new Date().toISOString(),
        };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      
      // Update checkin with new photos
      const checkin = get().checkins.find(c => c.firestoreId === checkinId);
      if (checkin) {
        const existingPhotos = checkin.photos || [];
        const updatedPhotos = [...existingPhotos, ...uploadedPhotos];
        
        await get().updateCheckin(checkinId, { photos: updatedPhotos });
      }

      set({ isLoading: false });
      return { success: true, data: uploadedPhotos };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete photo
  deletePhoto: async (checkinId, photoUrl) => {
    try {
      // Delete from storage
      const photoRef = ref(storage, photoUrl);
      await deleteObject(photoRef);
      
      // Update checkin
      const checkin = get().checkins.find(c => c.firestoreId === checkinId);
      if (checkin) {
        const updatedPhotos = checkin.photos.filter(photo => photo.url !== photoUrl);
        await get().updateCheckin(checkinId, { photos: updatedPhotos });
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Fetch all check-ins
  fetchCheckins: async () => {
    set({ isLoading: true, error: null });
    try {
      const q = query(
        collection(db, 'checkins'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const checkins = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
      }));

      set({ checkins, isLoading: false });
      return { success: true, data: checkins };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get check-in by ID
  getCheckinById: async (checkinId) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'checkins', checkinId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const checkin = { ...docSnap.data(), firestoreId: docSnap.id };
        set({ currentCheckin: checkin, isLoading: false });
        return { success: true, data: checkin };
      } else {
        set({ error: 'Check-in não encontrado', isLoading: false });
        return { success: false, error: 'Check-in não encontrado' };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Search check-ins
  searchCheckins: async (searchTerm) => {
    set({ isLoading: true, error: null });
    try {
      const q = query(
        collection(db, 'checkins'),
        where('clientName', '>=', searchTerm),
        where('clientName', '<=', searchTerm + '\uf8ff'),
        orderBy('clientName'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
      }));

      set({ isLoading: false });
      return { success: true, data: results };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Filter check-ins
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  getFilteredCheckins: () => {
    const { checkins, filters } = get();
    
    return checkins.filter((checkin) => {
      // Status filter
      if (filters.status !== 'all' && checkin.status !== filters.status) {
        return false;
      }
      
      // Employee filter
      if (filters.employee !== 'all' && checkin.responsibleEmployee !== filters.employee) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange) {
        const checkinDate = new Date(checkin.checkinDate);
        const { start, end } = filters.dateRange;
        if (checkinDate < start || checkinDate > end) {
          return false;
        }
      }
      
      return true;
    });
  },

  // Generate QR Code data
  generateQRData: (checkinId) => {
    return JSON.stringify({
      type: 'checkin',
      id: checkinId,
      timestamp: new Date().toISOString(),
    });
  },

  // Get statistics
  getStatistics: () => {
    const { checkins } = get();
    
    const total = checkins.length;
    const inProgress = checkins.filter(c => c.status === 'in-progress').length;
    const completed = checkins.filter(c => c.status === 'completed').length;
    const waitingParts = checkins.filter(c => c.status === 'waiting-parts').length;
    const waitingClient = checkins.filter(c => c.status === 'waiting-client').length;
    
    // Calculate average service time for completed services
    const completedCheckins = checkins.filter(c => c.status === 'completed' && c.checkoutDate);
    const averageServiceTime = completedCheckins.length > 0
      ? completedCheckins.reduce((acc, checkin) => {
          const start = new Date(checkin.checkinDate);
          const end = new Date(checkin.checkoutDate);
          return acc + (end - start);
        }, 0) / completedCheckins.length
      : 0;
    
    return {
      total,
      inProgress,
      completed,
      waitingParts,
      waitingClient,
      averageServiceTime: Math.round(averageServiceTime / (1000 * 60 * 60)), // in hours
    };
  },

  // Real-time listener
  subscribeToCheckins: () => {
    const q = query(
      collection(db, 'checkins'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const checkins = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
      }));
      
      set({ checkins });
    });
  },
}));