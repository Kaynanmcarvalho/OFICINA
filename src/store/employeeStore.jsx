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
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useEmployeeStore = create((set, get) => ({
  // State
  authorizedEmployees: [],
  isLoading: false,
  error: null,

  // Actions
  
  // Buscar funcionários autorizados
  fetchAuthorizedEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const q = query(
            );
        collection(db, 'authorizedEmployees'),
        orderBy('createdAt', 'desc')

      const querySnapshot = await getDocs(q);
      const employees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      set({ authorizedEmployees: employees, isLoading: false });
      return { success: true, data: employees };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Adicionar funcionário autorizado
  addAuthorizedEmployee: async (employeeData) => {
    set({ isLoading: true, error: null });
    try {
      const newEmployee = {
        ...employeeData,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      const docRef = await addDoc(collection(db, 'authorizedEmployees'), newEmployee);
      const employeeWithId = { id: docRef.id, ...newEmployee };
      
      set(state => ({
        authorizedEmployees: [employeeWithId, ...state.authorizedEmployees],
        isLoading: false
      }));
      
      return { success: true, data: employeeWithId };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Atualizar funcionário autorizado
  updateAuthorizedEmployee: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const employeeRef = doc(db, 'authorizedEmployees', id);
      const updatePayload = {
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(employeeRef, updatePayload);
      
      set(state => ({
        authorizedEmployees: state.authorizedEmployees.map(emp => 
          emp.id === id ? { ...emp, ...updatePayload } : emp
        ),
        isLoading: false
      }));
      
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Remover funcionário autorizado
  removeAuthorizedEmployee: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, 'authorizedEmployees', id));
      
      set(state => ({
        authorizedEmployees: state.authorizedEmployees.filter(emp => emp.id !== id),
        isLoading: false
      }));
      
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Verificar se um email está autorizado
  checkEmailAuthorization: async (email) => {
    try {
      const q = query(
            );
        collection(db, 'authorizedEmployees'),
        where('email', '==', email.toLowerCase()),
        where('status', '==', 'active')

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const employeeData = querySnapshot.docs[0].data();
        return { 
          success: true, 
          authorized: true, 
          data: employeeData 
        };
      }
      
      return { 
        success: true, 
        authorized: false, 
        data: null 
      };
    } catch (error) {
      return { 
        success: false, 
        authorized: false, 
        error: error.message 
      };
    }
  },

  // Buscar funcionário por email
  getEmployeeByEmail: async (email) => {
    try {
      const q = query(
        collection(db, 'authorizedEmployees'),
        where('email', '==', email.toLowerCase())
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { 
          success: true, 
          data: { id: doc.id, ...doc.data() } 
        };
      }
      
      return { 
        success: true, 
        data: null 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Limpar erro
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({ 
    authorizedEmployees: [], 
    isLoading: false, 
    error: null 
  })
}));

export default useEmployeeStore;