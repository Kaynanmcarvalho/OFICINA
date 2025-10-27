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
import { doc, getDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Helper to get permissions based on role
function getPermissions(role) {
  switch (role) {
    case 'saas': return ['super_admin', 'manage_admins', 'manage_funcs', 'full_access'];
    case 'admin': return ['manage_funcs', 'manage_data', 'view_reports'];
    case 'func': return ['basic_access', 'manage_own_tasks'];
    default: return [];
  }
}

export const authStore = (set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: true, // Começa como true para evitar flash da tela de login
  authError: null,

  // User roles and permissions
  userRole: null, // 'saas', 'admin', 'func'
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
          organizationId: userData?.cpfCnpj || userData?.cnpj || userData?.cpf || user.uid,
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
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let userData = userDoc.exists() ? userDoc.data() : null;
      
      if (!userData) {
        // New user - check if email is authorized for employees
        const authResult = await get().checkEmailAuthorization(user.email);
        
        if (authResult.authorized) {
          // Email is authorized - create employee profile
          userData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'func', // Employee role
            permissions: getPermissions('func'),
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            authorizedEmployee: true,
            employeeData: authResult.data
          };
          await setDoc(doc(db, 'users', user.uid), userData);
        } else {
          // Email not authorized - create incomplete profile
          userData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'admin', // Default to admin for new registrations
            permissions: [],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profileCompleted: false
          };
          await setDoc(doc(db, 'users', user.uid), userData);
        }
      } else {
        // Existing user - update last login
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
          organizationId: userData?.cpfCnpj || userData?.cnpj || userData?.cpf || user.uid,
          ...userData
        },
        isAuthenticated: true,
        userRole: userData.role,
        permissions: userData.permissions || getPermissions(userData.role),
        isLoading: false
      });
      
      // Check if profile needs completion
      if (!userData.cpfCnpj && !userData.authorizedEmployee) {
        return { success: true, needsProfileCompletion: true };
      }
      
      return { success: true, needsProfileCompletion: false };
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
        role: userData.role || 'func',
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
          organizationId: userProfile?.cpfCnpj || userProfile?.cnpj || userProfile?.cpf || user.uid,
          ...userProfile
        },
        isAuthenticated: true,
        userRole: userProfile.role,
        permissions: userProfile.permissions || getPermissions(userProfile.role),
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
    // Retorna uma Promise que resolve quando o estado de autenticação é verificado
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
        
        // Resolve a Promise na primeira verificação
        resolve(unsubscribe);
      });
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

  // Update user profile
  updateUser: async (updatedData) => {
    const { user } = get();
    if (!user) return;
    set({ isLoading: true });
    try {
      await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true });
      set({
        user: { ...user, ...updatedData },
        isLoading: false
      });
      return { success: true };
    } catch (error) {
      set({ authError: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Check if email is authorized for employees
  checkEmailAuthorization: async (email) => {
    try {
      const q = query(
        collection(db, 'authorizedEmployees'),
        where('email', '==', email.toLowerCase()),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const employeeData = querySnapshot.docs[0].data();
        return { 
          authorized: true, 
          data: employeeData 
        };
      }
      
      return { 
        authorized: false, 
        data: null 
      };
    } catch (error) {
      console.error('Error checking email authorization:', error);
      return { 
        authorized: false, 
        data: null 
      };
    }
  },

  // Clear auth error
  clearAuthError: () => set({ authError: null }),
});

// Create the useAuthStore hook
export const useAuthStore = create(authStore);