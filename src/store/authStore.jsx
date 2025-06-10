import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const authStore = (set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authError: null,

  // User roles and permissions
  userRole: null, // 'admin', 'employee', 'viewer'
  permissions: [],

  // Auth actions
  login: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      
      set({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          ...userData
        },
        isAuthenticated: true,
        userRole: userData?.role || 'viewer',
        permissions: userData?.permissions || [],
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      set({ 
        authError: error.message, 
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      return { success: false, error: error.message };
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, authError: null });
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Check if user exists in Firestore, if not create profile
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let userData = userDoc.exists() ? userDoc.data() : null;
      
      if (!userData) {
        // Create new user profile
        userData = {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'viewer', // Default role
          permissions: [],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), userData);
      } else {
        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          lastLogin: new Date().toISOString()
        }, { merge: true });
      }
      
      set({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          ...userData
        },
        isAuthenticated: true,
        userRole: userData.role,
        permissions: userData.permissions,
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      set({ 
        authError: error.message, 
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      return { success: false, error: error.message };
    }
  },

  register: async (email, password, userData = {}) => {
    set({ isLoading: true, authError: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      const userProfile = {
        email: user.email,
        displayName: userData.displayName || '',
        role: userData.role || 'viewer',
        permissions: userData.permissions || [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ...userData
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      set({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          ...userProfile
        },
        isAuthenticated: true,
        userRole: userProfile.role,
        permissions: userProfile.permissions,
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      set({ 
        authError: error.message, 
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({
        user: null,
        isAuthenticated: false,
        userRole: null,
        permissions: [],
        isLoading: false,
        authError: null
      });
      return { success: true };
    } catch (error) {
      set({ authError: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, authError: null });
    try {
      await sendPasswordResetEmail(auth, email);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ authError: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Initialize auth listener
  initializeAuth: () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        
        set({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            ...userData
          },
          isAuthenticated: true,
          userRole: userData?.role || 'viewer',
          permissions: userData?.permissions || [],
          isLoading: false
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          userRole: null,
          permissions: [],
          isLoading: false
        });
      }
    });
  },

  // Permission helpers
  hasPermission: (permission) => {
    const { permissions, userRole } = get();
    if (userRole === 'admin') return true;
    return permissions.includes(permission);
  },

  isAdmin: () => {
    const { userRole } = get();
    return userRole === 'admin';
  },

  isEmployee: () => {
    const { userRole } = get();
    return ['admin', 'employee'].includes(userRole);
  },

  // Clear auth error
  clearAuthError: () => set({ authError: null }),
});

// Create the useAuthStore hook
export const useAuthStore = create(authStore);