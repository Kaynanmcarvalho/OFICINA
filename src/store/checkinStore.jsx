import { create } from 'zustand';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, db } from '../config/firebase';
import { firestoreService } from '../services/firestoreService';
import { checkOperationalLimit, recordOperation } from '../utils/operationalLimits';

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

  // Check for duplicate active checkin
  checkDuplicateCheckin: async (plate) => {
    try {
      const empresaId = sessionStorage.getItem('empresaId') || 'default';
      const normalizedPlate = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      
      const checkins = await firestoreService.query('checkins', [
        { field: 'empresaId', operator: '==', value: empresaId },
        { field: 'vehiclePlate', operator: '==', value: normalizedPlate },
        { field: 'status', operator: 'in', value: ['in-progress', 'pending', 'waiting-budget', 'ready'] }
      ]);
      
      return checkins.length > 0 ? checkins[0] : null;
    } catch (error) {
      console.error('[CheckinStore] Error checking duplicate:', error);
      return null;
    }
  },

  // Validação robusta de placa (Mercosul e formato antigo)
  validatePlate: (plate) => {
    if (!plate) return { valid: false, error: 'Placa é obrigatória' };
    
    const cleaned = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Formato Mercosul: ABC1D23
    const mercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    // Formato antigo: ABC1234
    const oldPattern = /^[A-Z]{3}[0-9]{4}$/;
    
    if (cleaned.length !== 7) {
      return { valid: false, error: 'Placa deve ter 7 caracteres' };
    }
    
    if (!mercosulPattern.test(cleaned) && !oldPattern.test(cleaned)) {
      return { valid: false, error: 'Formato de placa inválido. Use ABC1234 ou ABC1D23' };
    }
    
    return { valid: true, normalized: cleaned };
  },

  // Validação de CPF
  validateCPF: (cpf) => {
    if (!cpf) return { valid: false, error: 'CPF é obrigatório' };
    
    const cleaned = cpf.replace(/\D/g, '');
    
    if (cleaned.length !== 11) {
      return { valid: false, error: 'CPF deve ter 11 dígitos' };
    }
    
    // Validação básica de CPF
    if (/^(\d)\1{10}$/.test(cleaned)) {
      return { valid: false, error: 'CPF inválido' };
    }
    
    return { valid: true, normalized: cleaned };
  },

  // Validação de telefone
  validatePhone: (phone) => {
    if (!phone) return { valid: false, error: 'Telefone é obrigatório' };
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 10 || cleaned.length > 11) {
      return { valid: false, error: 'Telefone inválido. Use (00) 0000-0000 ou (00) 00000-0000' };
    }
    
    return { valid: true, normalized: cleaned };
  },

  // Validação de quilometragem
  validateMileage: (mileage) => {
    if (!mileage && mileage !== 0) return { valid: false, error: 'Quilometragem é obrigatória' };
    
    const km = parseInt(mileage, 10);
    
    if (isNaN(km) || km < 0) {
      return { valid: false, error: 'Quilometragem inválida' };
    }
    
    if (km > 999999) {
      return { valid: false, error: 'Quilometragem muito alta (máximo 999.999 km)' };
    }
    
    return { valid: true, normalized: km };
  },

  // Validação completa de dados obrigatórios
  validateCheckinData: (data) => {
    const errors = [];
    
    // Validar placa
    const plateValidation = get().validatePlate(data.vehiclePlate);
    if (!plateValidation.valid) errors.push(plateValidation.error);
    
    // Validar nome do cliente
    if (!data.clientName || data.clientName.trim().length < 3) {
      errors.push('Nome do cliente é obrigatório (mínimo 3 caracteres)');
    }
    
    // Validar telefone
    const phoneValidation = get().validatePhone(data.clientPhone);
    if (!phoneValidation.valid) errors.push(phoneValidation.error);
    
    // Validar CPF
    const cpfValidation = get().validateCPF(data.clientCPF);
    if (!cpfValidation.valid) errors.push(cpfValidation.error);
    
    // Validar quilometragem
    const mileageValidation = get().validateMileage(data.mileage);
    if (!mileageValidation.valid) errors.push(mileageValidation.error);
    
    // Validar nível de combustível
    if (!data.fuelLevel || !['empty', 'quarter', 'half', 'three-quarters', 'full'].includes(data.fuelLevel)) {
      errors.push('Nível de combustível é obrigatório');
    }
    
    // Validar descrição do problema
    if (!data.problemDescription || data.problemDescription.trim().length < 10) {
      errors.push('Descrição do problema é obrigatória (mínimo 10 caracteres)');
    }
    
    // Validar fotos (mínimo 3)
    if (!data.photos || data.photos.length < 3) {
      errors.push('Mínimo 3 fotos obrigatórias (frente, traseira, painel)');
    }
    
    // Validar valor máximo autorizado
    if (!data.maxAuthorizedValue || parseFloat(data.maxAuthorizedValue) <= 0) {
      errors.push('Valor máximo autorizado é obrigatório');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      normalized: errors.length === 0 ? {
        vehiclePlate: plateValidation.normalized,
        clientPhone: phoneValidation.normalized,
        clientCPF: cpfValidation.normalized,
        mileage: mileageValidation.normalized,
      } : null
    };
  },

  // Create new check-in with validation and transaction
  createCheckin: async (checkinData) => {
    set({ isLoading: true, error: null });
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      const empresaId = sessionStorage.getItem('empresaId') || 'default';
      
      // 🔥 BLAST RADIUS: Verificar limite operacional
      const limitCheck = checkOperationalLimit(userId, 'CREATE_CHECKIN');
      if (!limitCheck.allowed) {
        throw new Error(limitCheck.error);
      }
      
      // VALIDAÇÃO ROBUSTA
      const validation = get().validateCheckinData(checkinData);
      if (!validation.valid) {
        throw new Error(`Validação falhou:\n${validation.errors.join('\n')}`);
      }
      
      const normalizedData = validation.normalized;
      
      // Verificar duplicidade
      const duplicate = await get().checkDuplicateCheckin(normalizedData.vehiclePlate);
      if (duplicate) {
        throw new Error(`Veículo ${normalizedData.vehiclePlate} já possui check-in ativo (ID: ${duplicate.id})`);
      }
      
      const now = new Date().toISOString();
      const protocolNumber = `CHK-${Date.now()}`;
      
      const newCheckin = {
        // Dados normalizados
        vehiclePlate: normalizedData.vehiclePlate,
        clientName: checkinData.clientName.trim(),
        clientPhone: normalizedData.clientPhone,
        clientCPF: normalizedData.clientCPF,
        clientEmail: checkinData.clientEmail?.trim() || '',
        
        // Dados do veículo
        vehicleBrand: checkinData.vehicleBrand || '',
        vehicleModel: checkinData.vehicleModel || '',
        vehicleYear: checkinData.vehicleYear || '',
        vehicleColor: checkinData.vehicleColor || '',
        mileage: normalizedData.mileage,
        fuelLevel: checkinData.fuelLevel,
        
        // Problema e serviços
        problemDescription: checkinData.problemDescription.trim(),
        urgency: checkinData.urgency || 'normal', // low, normal, high, emergency
        requestedServices: checkinData.requestedServices || [],
        
        // Autorização e valores
        maxAuthorizedValue: parseFloat(checkinData.maxAuthorizedValue),
        estimatedValue: parseFloat(checkinData.estimatedValue) || 0,
        estimatedDeliveryDate: checkinData.estimatedDeliveryDate || null,
        
        // Fotos e evidências
        photos: checkinData.photos || [],
        vehicleCondition: checkinData.vehicleCondition || {}, // arranhões, amassados, etc
        itemsInVehicle: checkinData.itemsInVehicle || [], // objetos deixados no carro
        
        // Checklist
        checklist: checkinData.checklist || [],
        
        // Termo de aceite
        termsAccepted: true,
        termsAcceptedAt: now,
        termsAcceptedBy: checkinData.clientName.trim(),
        digitalSignature: checkinData.digitalSignature || null,
        
        // Protocolo e controle
        id: protocolNumber,
        protocolNumber,
        checkinDate: now,
        createdAt: now,
        updatedAt: now,
        status: 'pending-budget', // pending-budget, budget-approved, in-progress, waiting-parts, ready, completed
        currentStage: 'checkin',
        empresaId,
        createdBy: userId,
        createdByName: userName,
        
        // Auditoria
        stages: {
          checkin: {
            completed: true,
            timestamp: now,
            userId,
            userName,
            ip: checkinData.clientIP || null,
            userAgent: navigator?.userAgent || null
          }
        },
        
        // Notificações
        notificationsSent: {
          clientConfirmation: false,
          mechanicAssignment: false
        }
      };

      const docId = await firestoreService.create('checkins', newCheckin);
      const checkinWithId = { ...newCheckin, firestoreId: docId };

      set((state) => ({
        checkins: [checkinWithId, ...state.checkins],
        isLoading: false,
      }));

      // 🔥 AUDITORIA: Registrar operação
      recordOperation(userId, 'CREATE_CHECKIN', {
        checkinId: docId,
        remaining: limitCheck.remaining
      });

      // TODO: Enviar confirmação automática por email/WhatsApp
      // TODO: Criar orçamento inicial automaticamente
      // TODO: Notificar mecânico

      return { success: true, data: checkinWithId };
    } catch (error) {
      console.error('[CheckinStore] Error creating checkin:', error);
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

  // Delete check-in
  deleteCheckin: async (checkinId) => {
    set({ isLoading: true, error: null });
    try {
      await firestoreService.delete('checkins', checkinId);
      
      set((state) => ({
        checkins: state.checkins.filter(c => c.firestoreId !== checkinId),
        currentCheckin: state.currentCheckin?.firestoreId === checkinId ? null : state.currentCheckin,
        isLoading: false,
      }));
      
      return { success: true };
    } catch (error) {
      console.error('[CheckinStore] Error deleting checkin:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Fetch all check-ins
  fetchCheckins: async () => {
    set({ isLoading: true, error: null });
    try {
      const checkins = await firestoreService.getAll('checkins', {
        orderBy: { field: 'createdAt', direction: 'desc' }
      });

      set({ checkins, isLoading: false });
      return { success: true, data: checkins };
    } catch (error) {
      console.error('[CheckinStore] Error fetching checkins:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get check-in by ID
  getCheckinById: async (checkinId) => {
    set({ isLoading: true, error: null });
    try {
      const checkin = await firestoreService.getById('checkins', checkinId);
      
      if (checkin) {
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
      const results = await firestoreService.query('checkins', [
        { field: 'clientName', operator: '>=', value: searchTerm },
        { field: 'clientName', operator: '<=', value: searchTerm + '\uf8ff' }
      ], {
        orderBy: { field: 'clientName', direction: 'asc' },
        limit: 20
      });

      set({ isLoading: false });
      return { success: true, data: results };
    } catch (error) {
      console.error('[CheckinStore] Error searching checkins:', error);
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
    return firestoreService.onSnapshot('checkins', (checkins) => {
      set({ checkins });
    }, {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  },
}));