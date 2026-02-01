import { create } from 'zustand';
import toast from 'react-hot-toast';
import { smartClientSearch } from '../utils/searchUtils';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  subscribeToCollection
} from '../services/storeHelpers';
import { checkOperationalLimit, recordOperation } from '../utils/operationalLimits';

// CONFIGURAÇÕES DE SEGMENTAÇÃO
const SEGMENTATION_CONFIG = {
  vip: {
    minTotalSpent: 5000,      // R$ 5.000+ gastos
    minServices: 10,           // 10+ serviços
    minFrequency: 0.5          // 0.5+ serviços/mês
  },
  regular: {
    minServices: 3,            // 3+ serviços
    maxInactiveDays: 90        // Ativo nos últimos 90 dias
  },
  new: {
    maxServices: 2,            // Até 2 serviços
    maxDaysSinceFirst: 30      // Cadastrado há menos de 30 dias
  },
  inactive: {
    minInactiveDays: 90        // Sem serviço há 90+ dias
  },
  churn: {
    minInactiveDays: 180       // Sem serviço há 180+ dias
  }
};

export const useClientStore = create((set, get) => ({
  // State
  clients: [],
  currentClient: null,
  isLoading: false,
  error: null,
  searchResults: [],
  migrationStatus: null,
  segmentationConfig: SEGMENTATION_CONFIG,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // ========== VALIDAÇÕES E PREVENÇÃO DE DUPLICIDADE ==========

  // Validar CPF
  validateCPF: (cpf) => {
    if (!cpf) return { valid: false, error: 'CPF é obrigatório' };
    
    const cleaned = cpf.replace(/\D/g, '');
    
    if (cleaned.length !== 11) {
      return { valid: false, error: 'CPF deve ter 11 dígitos' };
    }
    
    // Validação básica de CPF (sequências repetidas)
    if (/^(\d)\1{10}$/.test(cleaned)) {
      return { valid: false, error: 'CPF inválido' };
    }
    
    return { valid: true, normalized: cleaned };
  },

  // Validar CNPJ
  validateCNPJ: (cnpj) => {
    if (!cnpj) return { valid: true, normalized: '' }; // CNPJ é opcional
    
    const cleaned = cnpj.replace(/\D/g, '');
    
    if (cleaned.length !== 14) {
      return { valid: false, error: 'CNPJ deve ter 14 dígitos' };
    }
    
    // Validação básica de CNPJ (sequências repetidas)
    if (/^(\d)\1{13}$/.test(cleaned)) {
      return { valid: false, error: 'CNPJ inválido' };
    }
    
    return { valid: true, normalized: cleaned };
  },

  // Validar telefone
  validatePhone: (phone) => {
    if (!phone) return { valid: false, error: 'Telefone é obrigatório' };
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 10 || cleaned.length > 11) {
      return { valid: false, error: 'Telefone inválido' };
    }
    
    return { valid: true, normalized: cleaned };
  },

  // Validar email
  validateEmail: (email) => {
    if (!email) return { valid: false, error: 'Email é obrigatório' };
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
      return { valid: false, error: 'Email inválido' };
    }
    
    return { valid: true, normalized: email.toLowerCase().trim() };
  },

  // Buscar clientes similares (prevenção de duplicidade)
  findSimilarClients: (clientData) => {
    const { clients } = get();
    const similar = [];
    
    const normalizedName = clientData.name?.toLowerCase().trim();
    const normalizedPhone = clientData.phone?.replace(/\D/g, '');
    const normalizedCPF = clientData.cpf?.replace(/\D/g, '');
    const normalizedCNPJ = clientData.cnpj?.replace(/\D/g, '');
    
    clients.forEach(existing => {
      const reasons = [];
      let score = 0;
      
      // Verificar CPF (match exato = 100 pontos)
      if (normalizedCPF && existing.cpf?.replace(/\D/g, '') === normalizedCPF) {
        reasons.push('CPF idêntico');
        score += 100;
      }
      
      // Verificar CNPJ (match exato = 100 pontos)
      if (normalizedCNPJ && existing.cnpj?.replace(/\D/g, '') === normalizedCNPJ) {
        reasons.push('CNPJ idêntico');
        score += 100;
      }
      
      // Verificar telefone (match exato = 80 pontos)
      if (normalizedPhone && existing.phone?.replace(/\D/g, '') === normalizedPhone) {
        reasons.push('Telefone idêntico');
        score += 80;
      }
      
      // Verificar nome (similaridade)
      if (normalizedName && existing.name) {
        const existingName = existing.name.toLowerCase().trim();
        
        // Nome exato = 60 pontos
        if (normalizedName === existingName) {
          reasons.push('Nome idêntico');
          score += 60;
        }
        // Nome muito similar = 40 pontos
        else if (normalizedName.includes(existingName) || existingName.includes(normalizedName)) {
          reasons.push('Nome similar');
          score += 40;
        }
      }
      
      // Se score > 50, considerar similar
      if (score >= 50) {
        similar.push({
          client: existing,
          score,
          reasons,
          isDuplicate: score >= 100 // CPF ou CNPJ idêntico
        });
      }
    });
    
    // Ordenar por score (maior primeiro)
    return similar.sort((a, b) => b.score - a.score);
  },

  // Validar dados do cliente
  validateClientData: (clientData, excludeId = null) => {
    const errors = [];
    const warnings = [];
    
    // Validar nome
    if (!clientData.name || clientData.name.trim().length < 3) {
      errors.push('Nome deve ter no mínimo 3 caracteres');
    }
    
    // Validar telefone
    const phoneValidation = get().validatePhone(clientData.phone);
    if (!phoneValidation.valid) {
      errors.push(phoneValidation.error);
    }
    
    // Validar CPF ou CNPJ (pelo menos um obrigatório)
    const cpfValidation = get().validateCPF(clientData.cpf);
    const cnpjValidation = get().validateCNPJ(clientData.cnpj);
    
    if (!cpfValidation.valid && !cnpjValidation.valid) {
      errors.push('CPF ou CNPJ é obrigatório');
    }
    
    // Validar email
    if (clientData.email) {
      const emailValidation = get().validateEmail(clientData.email);
      if (!emailValidation.valid) {
        errors.push(emailValidation.error);
      }
    } else {
      warnings.push('Email não informado (recomendado para comunicação)');
    }
    
    // Validar endereço
    if (!clientData.address || clientData.address.trim().length < 10) {
      warnings.push('Endereço não informado ou incompleto');
    }
    
    // Buscar clientes similares (duplicidade)
    const similarClients = get().findSimilarClients(clientData);
    
    // Filtrar clientes similares (excluir o próprio cliente se estiver editando)
    const filteredSimilar = excludeId
      ? similarClients.filter(s => s.client.id !== excludeId && s.client.firestoreId !== excludeId)
      : similarClients;
    
    if (filteredSimilar.length > 0) {
      const duplicates = filteredSimilar.filter(s => s.isDuplicate);
      
      if (duplicates.length > 0) {
        errors.push(`Cliente já cadastrado: ${duplicates[0].reasons.join(', ')}`);
      } else {
        warnings.push(`${filteredSimilar.length} cliente(s) similar(es) encontrado(s)`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      similarClients: filteredSimilar,
      canCreate: errors.length === 0 || (errors.length === 1 && errors[0].includes('já cadastrado'))
    };
  },

  // ========== SEGMENTAÇÃO DE CLIENTES ==========

  // Calcular segmento do cliente
  calculateClientSegment: (client) => {
    const now = new Date();
    const serviceHistory = client.serviceHistory || [];
    const totalServices = serviceHistory.length;
    const totalSpent = serviceHistory.reduce((sum, s) => sum + (s.value || 0), 0);
    
    // Calcular dias desde último serviço
    let daysSinceLastService = Infinity;
    if (client.lastServiceDate) {
      const lastService = new Date(client.lastServiceDate);
      daysSinceLastService = Math.floor((now - lastService) / (1000 * 60 * 60 * 24));
    }
    
    // Calcular dias desde cadastro
    let daysSinceCreated = 0;
    if (client.createdAt) {
      const created = new Date(client.createdAt);
      daysSinceCreated = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    }
    
    // Calcular frequência (serviços por mês)
    let frequency = 0;
    if (totalServices > 1 && serviceHistory.length >= 2) {
      const firstService = new Date(serviceHistory[serviceHistory.length - 1].date);
      const lastService = new Date(serviceHistory[0].date);
      const monthsDiff = (lastService - firstService) / (1000 * 60 * 60 * 24 * 30);
      frequency = monthsDiff > 0 ? totalServices / monthsDiff : 0;
    }
    
    const config = SEGMENTATION_CONFIG;
    
    // Determinar segmento
    let segment = 'new';
    let segmentReason = '';
    
    // Churn (prioridade máxima)
    if (daysSinceLastService >= config.churn.minInactiveDays) {
      segment = 'churn';
      segmentReason = `Sem serviço há ${daysSinceLastService} dias`;
    }
    // Inativo
    else if (daysSinceLastService >= config.inactive.minInactiveDays) {
      segment = 'inactive';
      segmentReason = `Sem serviço há ${daysSinceLastService} dias`;
    }
    // VIP
    else if (
      totalSpent >= config.vip.minTotalSpent &&
      totalServices >= config.vip.minServices &&
      frequency >= config.vip.minFrequency
    ) {
      segment = 'vip';
      segmentReason = `R$ ${totalSpent.toFixed(2)} gastos, ${totalServices} serviços, ${frequency.toFixed(1)} serviços/mês`;
    }
    // Regular
    else if (
      totalServices >= config.regular.minServices &&
      daysSinceLastService <= config.regular.maxInactiveDays
    ) {
      segment = 'regular';
      segmentReason = `${totalServices} serviços, ativo`;
    }
    // Novo
    else if (
      totalServices <= config.new.maxServices ||
      daysSinceCreated <= config.new.maxDaysSinceFirst
    ) {
      segment = 'new';
      segmentReason = `${totalServices} serviço(s), cadastrado há ${daysSinceCreated} dias`;
    }
    
    return {
      segment,
      segmentReason,
      metrics: {
        totalServices,
        totalSpent,
        frequency,
        daysSinceLastService,
        daysSinceCreated
      }
    };
  },

  // Segmentar todos os clientes
  segmentAllClients: () => {
    const { clients } = get();
    
    const segmented = clients.map(client => ({
      ...client,
      ...get().calculateClientSegment(client)
    }));
    
    return segmented;
  },

  // Obter clientes por segmento
  getClientsBySegment: (segment) => {
    const segmented = get().segmentAllClients();
    return segmented.filter(c => c.segment === segment);
  },

  // Identificar clientes em risco de churn
  getChurnRiskClients: () => {
    const { clients } = get();
    const now = new Date();
    const riskClients = [];
    
    clients.forEach(client => {
      if (!client.lastServiceDate) return;
      
      const lastService = new Date(client.lastServiceDate);
      const daysSince = Math.floor((now - lastService) / (1000 * 60 * 60 * 24));
      
      // Cliente em risco se:
      // - Estava ativo (< 90 dias) e agora está entre 60-90 dias
      // - Ou está entre 90-180 dias (inativo mas não churn ainda)
      if (daysSince >= 60 && daysSince < 180) {
        const serviceHistory = client.serviceHistory || [];
        const totalServices = serviceHistory.length;
        
        // Calcular frequência esperada
        let expectedFrequency = 0;
        if (totalServices > 1) {
          const firstService = new Date(serviceHistory[serviceHistory.length - 1].date);
          const monthsDiff = (lastService - firstService) / (1000 * 60 * 60 * 24 * 30);
          expectedFrequency = monthsDiff > 0 ? totalServices / monthsDiff : 0;
        }
        
        riskClients.push({
          client,
          daysSinceLastService: daysSince,
          expectedFrequency,
          riskLevel: daysSince >= 90 ? 'high' : 'medium',
          suggestedAction: daysSince >= 90 
            ? 'Campanha de reativação urgente'
            : 'Lembrete de manutenção preventiva'
        });
      }
    });
    
    return riskClients.sort((a, b) => b.daysSinceLastService - a.daysSinceLastService);
  },

  // ========== LIFETIME VALUE (LTV) ==========

  // Calcular LTV do cliente
  calculateLTV: (client) => {
    const serviceHistory = client.serviceHistory || [];
    const totalServices = serviceHistory.length;
    
    if (totalServices === 0) {
      return {
        currentLTV: 0,
        projectedLTV: 0,
        averageServiceValue: 0,
        frequency: 0
      };
    }
    
    const totalSpent = serviceHistory.reduce((sum, s) => sum + (s.value || 0), 0);
    const averageServiceValue = totalSpent / totalServices;
    
    // Calcular frequência (serviços por mês)
    let frequency = 0;
    if (totalServices > 1) {
      const firstService = new Date(serviceHistory[serviceHistory.length - 1].date);
      const lastService = new Date(serviceHistory[0].date);
      const monthsDiff = (lastService - firstService) / (1000 * 60 * 60 * 24 * 30);
      frequency = monthsDiff > 0 ? totalServices / monthsDiff : 0;
    }
    
    // Projetar LTV para 12 meses
    const projectedServices = frequency * 12;
    const projectedLTV = projectedServices * averageServiceValue;
    
    return {
      currentLTV: totalSpent,
      projectedLTV,
      averageServiceValue,
      frequency
    };
  },

  // Migration from localStorage
  migrateFromLocalStorage: async () => {
    const STORAGE_KEY = 'oficina_clients';
    const MIGRATION_KEY = 'migration_status';
    
    try {
      // Check if migration already completed
      const existingMigration = localStorage.getItem(MIGRATION_KEY);
      if (existingMigration) {
        const status = JSON.parse(existingMigration);
        if (status.isComplete) {
          set({ migrationStatus: status });
          return status;
        }
      }

      // Get clients from localStorage
      const localClientsStr = localStorage.getItem(STORAGE_KEY);
      if (!localClientsStr) {
        return null;
      }

      const localClients = JSON.parse(localClientsStr);
      if (localClients.length === 0) {
        return null;
      }

      const migrationStatus = {
        isComplete: false,
        migratedCount: 0,
        failedCount: 0,
        skippedCount: 0,
        errors: [],
        timestamp: new Date().toISOString()
      };

      // Fetch existing clients from Firebase
      const existingClients = get().clients;
      for (const localClient of localClients) {
        try {
          // Check for duplicates by clientId, phone, or CPF
          const isDuplicate = existingClients.some(existing => {
            const match = existing.clientId === localClient.id ||
              existing.clientId === localClient.clientId ||
              (localClient.phone && existing.phone === localClient.phone) ||
              (localClient.cpf && existing.cpf === localClient.cpf);
            
            if (match) {
              }
            
            return match;
          });

          if (isDuplicate) {
            migrationStatus.skippedCount++;
            continue;
          }
          
          // Prepare client data for Firebase
          const clientData = {
            name: localClient.name,
            phone: localClient.phone,
            cpf: localClient.cpf || '',
            cnpj: localClient.cnpj || '',
            email: localClient.email || '',
            address: localClient.address || '',
            vehicles: localClient.vehicles || [],
            serviceHistory: localClient.serviceHistory || [],
            totalServices: localClient.totalServices || 0,
            lastServiceDate: localClient.lastServiceDate || null,
          };

          // Create client in Firebase
          const result = await get().createClient(clientData);
          
          if (result.success) {
            migrationStatus.migratedCount++;
            } else {
            migrationStatus.failedCount++;
            migrationStatus.errors.push(`Failed to migrate ${localClient.name}: ${result.error}`);
          }
        } catch (error) {
          migrationStatus.failedCount++;
          migrationStatus.errors.push(`Error migrating ${localClient.name}: ${error.message}`);
          console.error(`[Migration] Error migrating client:`, error);
        }
      }

      migrationStatus.isComplete = true;
      
      // Save migration status
      localStorage.setItem(MIGRATION_KEY, JSON.stringify(migrationStatus));
      set({ migrationStatus });

      // Show success notification
      if (migrationStatus.migratedCount > 0) {
        toast.success(
          `${migrationStatus.migratedCount} cliente(s) migrado(s) com sucesso!`,
          { duration: 5000 }
        );
      }

      // Show warning if there were failures
      if (migrationStatus.failedCount > 0) {
        toast.error(
          `${migrationStatus.failedCount} cliente(s) falharam na migração. Verifique o console.`,
          { duration: 7000 }
        );
      }

      // Schedule localStorage cleanup after 7 days
      const cleanupDate = new Date();
      cleanupDate.setDate(cleanupDate.getDate() + 7);
      localStorage.setItem('migration_cleanup_date', cleanupDate.toISOString());

      return migrationStatus;
    } catch (error) {
      console.error('[Migration] Fatal error:', error);
      
      const errorStatus = {
        isComplete: false,
        migratedCount: 0,
        failedCount: 0,
        skippedCount: 0,
        errors: [error.message],
        timestamp: new Date().toISOString()
      };
      
      set({ migrationStatus: errorStatus });
      
      // Show error notification
      toast.error(
            );
        'Falha ao migrar dados. Seus dados estão seguros no armazenamento local.',
        { duration: 7000 }

      return null;
    }
  },

  // Create new client
  createClient: async (clientData) => {
    set({ isLoading: true, error: null });
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      
      // 🔥 BLAST RADIUS: Verificar limite operacional
      const limitCheck = checkOperationalLimit(userId, 'CREATE_CLIENT');
      if (!limitCheck.allowed) {
        throw new Error(limitCheck.error);
      }
      
      // VALIDAÇÃO ROBUSTA
      const validation = get().validateClientData(clientData);
      
      if (!validation.canCreate) {
        throw new Error(`Validação falhou:\n${validation.errors.join('\n')}`);
      }
      
      // Mostrar warnings (não bloqueia, mas alerta)
      if (validation.warnings.length > 0) {
        validation.warnings.forEach(w => toast.warning(w, { duration: 3000 }));
      }
      
      // Alertar sobre clientes similares
      if (validation.similarClients.length > 0) {
        const similar = validation.similarClients[0];
        toast.warning(
          `Cliente similar encontrado: ${similar.client.name} - ${similar.reasons.join(', ')}`,
          { duration: 5000 }
        );
      }
      
      const now = new Date().toISOString();
      
      const newClient = {
        ...clientData,
        clientId: `CLI-${Date.now()}`,
        
        // Dados normalizados
        name: clientData.name.trim(),
        phone: clientData.phone.replace(/\D/g, ''),
        cpf: clientData.cpf?.replace(/\D/g, '') || '',
        cnpj: clientData.cnpj?.replace(/\D/g, '') || '',
        email: clientData.email?.toLowerCase().trim() || '',
        address: clientData.address?.trim() || '',
        
        // Novos campos
        birthDate: clientData.birthDate || null,
        howFound: clientData.howFound || '', // Como conheceu a oficina
        preferences: clientData.preferences || {
          preferredMechanic: '',
          preferredTime: '',
          observations: ''
        },
        complaints: [], // Histórico de reclamações
        compliments: [], // Histórico de elogios
        photoUrl: clientData.photoUrl || null,
        
        // Metadados
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        createdByName: userName,
        
        // Dados de serviço
        totalServices: 0,
        lastServiceDate: null,
        vehicles: clientData.vehicles || [],
        serviceHistory: [],
        
        // Segmentação (calculada automaticamente)
        segment: 'new',
        segmentReason: 'Cliente novo',
        
        // Auditoria
        history: [{
          action: 'created',
          timestamp: now,
          userId,
          userName,
          changes: 'Cliente criado'
        }]
      };

      const clientWithId = await addDocument('clients', newClient);

      set((state) => ({
        clients: [clientWithId, ...state.clients],
        isLoading: false,
      }));

      // 🔥 AUDITORIA: Registrar operação
      recordOperation(userId, 'CREATE_CLIENT', {
        clientId: clientWithId.id,
        remaining: limitCheck.remaining
      });

      toast.success('Cliente cadastrado com sucesso!');

      return { success: true, data: clientWithId, warnings: validation.warnings };
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      set({ error: error.message, isLoading: false });
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Update client
  updateClient: async (clientId, updates, reason = 'Atualização de dados') => {
    set({ isLoading: true, error: null });
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      const userName = sessionStorage.getItem('userName') || 'Usuário';
      const currentClient = get().clients.find(c => c.id === clientId || c.firestoreId === clientId);
      
      if (!currentClient) {
        throw new Error('Cliente não encontrado');
      }
      
      // Validar dados se estiver atualizando campos críticos
      if (updates.name || updates.phone || updates.cpf || updates.cnpj || updates.email) {
        const dataToValidate = {
          name: updates.name || currentClient.name,
          phone: updates.phone || currentClient.phone,
          cpf: updates.cpf || currentClient.cpf,
          cnpj: updates.cnpj || currentClient.cnpj,
          email: updates.email || currentClient.email,
          address: updates.address || currentClient.address
        };
        
        const validation = get().validateClientData(dataToValidate, clientId);
        
        if (!validation.valid) {
          throw new Error(`Validação falhou:\n${validation.errors.join('\n')}`);
        }
        
        if (validation.warnings.length > 0) {
          validation.warnings.forEach(w => toast.warning(w, { duration: 3000 }));
        }
      }
      
      const now = new Date().toISOString();
      
      // Registrar mudanças para auditoria
      const changes = {};
      Object.keys(updates).forEach(key => {
        if (currentClient[key] !== updates[key]) {
          changes[key] = {
            before: currentClient[key],
            after: updates[key]
          };
        }
      });
      
      const updatedData = {
        ...updates,
        updatedAt: now,
        history: [
          ...(currentClient.history || []),
          {
            action: 'updated',
            timestamp: now,
            userId,
            userName,
            reason,
            changes
          }
        ]
      };

      await updateDocument('clients', clientId, updatedData);

      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === clientId || client.firestoreId === clientId
            ? { ...client, ...updatedData }
            : client
        ),
        currentClient: (state.currentClient?.id === clientId || state.currentClient?.firestoreId === clientId)
          ? { ...state.currentClient, ...updatedData }
          : state.currentClient,
        isLoading: false,
      }));

      toast.success('Cliente atualizado com sucesso!');

      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao atualizar cliente:', error);
      set({ error: error.message, isLoading: false });
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete client
  deleteClient: async (clientId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDocument('clients', clientId);

      set((state) => ({
        clients: state.clients.filter((client) => 
          client.id !== clientId && client.firestoreId !== clientId
        ),
        currentClient: (state.currentClient?.id === clientId || state.currentClient?.firestoreId === clientId) 
          ? null 
          : state.currentClient,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Fetch all clients
  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const clients = await getAllDocuments('clients', {
        orderBy: { field: 'createdAt', direction: 'desc' }
      });

      set({ clients, isLoading: false });

      // Run migration after fetching clients (only once)
      const migrationStatus = get().migrationStatus;
      if (!migrationStatus) {
        await get().migrateFromLocalStorage();
        
        // Fetch again after migration to get newly migrated clients
        const updatedClients = await getAllDocuments('clients', {
          orderBy: { field: 'createdAt', direction: 'desc' }
        });
        
        set({ clients: updatedClients });
        return { success: true, data: updatedClients };
      }

      return { success: true, data: clients };
    } catch (error) {
      console.error('[fetchClients] Error:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get client by ID
  getClientById: async (clientId) => {
    set({ isLoading: true, error: null });
    try {
      const client = await getDocumentById('clients', clientId);
      
      if (client) {
        set({ currentClient: client, isLoading: false });
        return { success: true, data: client };
      } else {
        set({ error: 'Cliente não encontrado', isLoading: false });
        return { success: false, error: 'Cliente não encontrado' };
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Search clients with intelligent fuzzy matching
  searchClients: async (searchTerm) => {
    const startTime = performance.now();
    set({ isLoading: true, error: null });
    try {
      // Get all clients from cache or Firebase
      let allClients = get().clients;
      
      // If cache is empty, fetch from Firebase
      if (allClients.length === 0) {
        allClients = await getAllDocuments('clients');
        set({ clients: allClients });
      }
      
      // Use intelligent search with relevance scoring
      const searchResults = smartClientSearch(allClients, searchTerm, {
        maxResults: 10,
        minScore: 10,
        includeScore: false
      });

      set({ searchResults, isLoading: false });
      
      // Log performance
      const duration = performance.now() - startTime;

      // Warn if search is slow
      if (duration > 2000) {
        toast.warning('A busca está demorando mais que o esperado. Considere otimizar os índices do Firebase.');
      }

      return { success: true, data: searchResults };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      
      // Log error
      console.error('[Search Error]', {
        term: searchTerm,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      return { success: false, error: error.message };
    }
  },

  // Add vehicle to client
  addVehicle: async (clientId, vehicleData) => {
    try {
      const client = get().clients.find(c => c.id === clientId || c.firestoreId === clientId);
      if (!client) return { success: false, error: 'Cliente não encontrado' };
      
      const newVehicle = {
        id: Date.now().toString(),
        ...vehicleData,
        addedAt: new Date().toISOString(),
      };
      
      const updatedVehicles = [...(client.vehicles || []), newVehicle];
      
      await get().updateClient(clientId, { vehicles: updatedVehicles });
      
      return { success: true, data: newVehicle };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove vehicle from client
  removeVehicle: async (clientId, vehicleId) => {
    try {
      const client = get().clients.find(c => c.id === clientId || c.firestoreId === clientId);
      if (!client) return { success: false, error: 'Cliente não encontrado' };
      
      const updatedVehicles = client.vehicles.filter(v => v.id !== vehicleId);
      
      await get().updateClient(clientId, { vehicles: updatedVehicles });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add service to client history
  addServiceToHistory: async (clientId, serviceData) => {
    try {
      const client = get().clients.find(c => c.id === clientId || c.firestoreId === clientId);
      if (!client) return { success: false, error: 'Cliente não encontrado' };
      
      const newService = {
        id: Date.now().toString(),
        ...serviceData,
        date: new Date().toISOString(),
      };
      
      const updatedHistory = [newService, ...(client.serviceHistory || [])];
      const totalServices = (client.totalServices || 0) + 1;
      
      await get().updateClient(clientId, {
        serviceHistory: updatedHistory,
        totalServices,
        lastServiceDate: newService.date,
      });
      
      return { success: true, data: newService };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get client statistics
  getClientStatistics: (clientId) => {
    const client = get().clients.find(c => c.id === clientId || c.firestoreId === clientId);
    if (!client) return null;
    
    const serviceHistory = client.serviceHistory || [];
    const totalServices = serviceHistory.length;
    const totalSpent = serviceHistory.reduce((sum, service) => sum + (service.value || 0), 0);
    
    // Calcular frequência (serviços por mês)
    let frequency = 0;
    if (totalServices > 1) {
      const firstService = new Date(serviceHistory[serviceHistory.length - 1].date);
      const lastService = new Date(serviceHistory[0].date);
      const monthsDiff = (lastService - firstService) / (1000 * 60 * 60 * 24 * 30);
      frequency = monthsDiff > 0 ? totalServices / monthsDiff : 0;
    }
    
    // Calcular segmento
    const segmentation = get().calculateClientSegment(client);
    
    // Calcular LTV
    const ltv = get().calculateLTV(client);
    
    return {
      totalServices,
      totalSpent,
      averageServiceValue: totalServices > 0 ? totalSpent / totalServices : 0,
      frequency: Math.round(frequency * 100) / 100,
      lastServiceDate: client.lastServiceDate,
      vehicleCount: (client.vehicles || []).length,
      segment: segmentation.segment,
      segmentReason: segmentation.segmentReason,
      ltv: ltv.currentLTV,
      projectedLTV: ltv.projectedLTV
    };
  },

  // Get statistics with segmentation
  getAllStatistics: () => {
    const { clients } = get();
    const segmented = get().segmentAllClients();
    
    const stats = {
      total: clients.length,
      vip: segmented.filter(c => c.segment === 'vip').length,
      regular: segmented.filter(c => c.segment === 'regular').length,
      new: segmented.filter(c => c.segment === 'new').length,
      inactive: segmented.filter(c => c.segment === 'inactive').length,
      churn: segmented.filter(c => c.segment === 'churn').length,
      
      // Métricas financeiras
      totalLTV: segmented.reduce((sum, c) => {
        const ltv = get().calculateLTV(c);
        return sum + ltv.currentLTV;
      }, 0),
      
      averageLTV: clients.length > 0
        ? segmented.reduce((sum, c) => {
            const ltv = get().calculateLTV(c);
            return sum + ltv.currentLTV;
          }, 0) / clients.length
        : 0,
      
      // Taxa de churn
      churnRate: clients.length > 0
        ? (segmented.filter(c => c.segment === 'churn').length / clients.length) * 100
        : 0,
      
      // Clientes em risco
      atRisk: get().getChurnRiskClients().length
    };
    
    return stats;
  },

  // Get top clients by service count
  getTopClients: (limit = 10) => {
    const { clients } = get();
    return clients
      .sort((a, b) => (b.totalServices || 0) - (a.totalServices || 0))
      .slice(0, limit);
  },

  // Get recent clients
  getRecentClients: (limit = 10) => {
    const { clients } = get();
    return clients
      .filter(client => client.lastServiceDate)
      .sort((a, b) => new Date(b.lastServiceDate) - new Date(a.lastServiceDate))
      .slice(0, limit);
  },

  // Clear search results
  clearSearchResults: () => set({ searchResults: [] }),

  // Real-time listener
  subscribeToClients: () => {
    return subscribeToCollection('clients', (clients) => {
      set({ clients });
    }, {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  },
}));
