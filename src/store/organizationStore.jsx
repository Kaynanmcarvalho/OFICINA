import { create } from 'zustand';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

export const organizationStore = (set, get) => ({
  // Organization state
  organization: null,
  isLoading: false,
  error: null,

  // Organization data
  organizationData: {
    name: '',
    address: '',
    phone: '',
    email: '',
    openingTime: '',
    closingTime: '',
    cnpj: '',
    cpf: '',
    businessType: 'fisica', // 'fisica' or 'juridica'
    createdAt: null,
    updatedAt: null
  },

  // Actions
  fetchOrganization: async (organizationId) => {
    if (!organizationId) return;
    
    set({ isLoading: true, error: null });
    try {
      const orgDoc = await getDoc(doc(db, 'organizations', organizationId));
      
      if (orgDoc.exists()) {
        const orgData = orgDoc.data();
        set({
          organization: { id: organizationId, ...orgData },
          organizationData: orgData,
          isLoading: false
        });
      } else {
        // Create default organization if it doesn't exist
        const defaultOrg = {
          ...get().organizationData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'organizations', organizationId), defaultOrg);
        set({
          organization: { id: organizationId, ...defaultOrg },
          organizationData: defaultOrg,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao carregar dados da organização');
    }
  },

  updateOrganization: async (organizationId, updates) => {
    if (!organizationId) return { success: false, error: 'ID da organização não fornecido' };
    
    set({ isLoading: true, error: null });
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'organizations', organizationId), updatedData);
      
      set({
        organization: { 
          ...get().organization, 
          ...updatedData 
        },
        organizationData: { 
          ...get().organizationData, 
          ...updatedData 
        },
        isLoading: false
      });
      
      toast.success('Configurações da organização atualizadas com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('Error updating organization:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao atualizar configurações da organização');
      return { success: false, error: error.message };
    }
  },

  // Get organization name for display
  getOrganizationName: () => {
    const { organizationData } = get();
    return organizationData.name || 'Organização não configurada';
  },

  // Get organization display info
  getOrganizationInfo: () => {
    const { organizationData } = get();
    return {
      name: organizationData.name || 'Nome não configurado',
      address: organizationData.address || 'Endereço não configurado',
      phone: organizationData.phone || 'Telefone não configurado',
      email: organizationData.email || 'Email não configurado',
      businessHours: organizationData.openingTime && organizationData.closingTime 
        ? `${organizationData.openingTime} - ${organizationData.closingTime}`
        : 'Horário não configurado',
      document: organizationData.businessType === 'juridica' 
        ? organizationData.cnpj || 'CNPJ não configurado'
        : organizationData.cpf || 'CPF não configurado'
    };
  },

  // Clear organization data
  clearOrganization: () => {
    set({
      organization: null,
      organizationData: {
        name: '',
        address: '',
        phone: '',
        email: '',
        openingTime: '',
        closingTime: '',
        cnpj: '',
        cpf: '',
        businessType: 'fisica',
        createdAt: null,
        updatedAt: null
      },
      error: null
    });
  }
});

export const useOrganizationStore = create(organizationStore);