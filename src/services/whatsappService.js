/**
 * WhatsApp Service - Multi-Tenant com Isolamento Total
 * Cada empresa tem sua própria sessão WhatsApp isolada
 */

import { useAuthStore } from '../store/authStore';

// Usar backend Node.js multi-tenant
const API_URL = import.meta.env.VITE_WHATSAPP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Obtém o empresaId do usuário logado
 * CRÍTICO: Garante isolamento total das sessões WhatsApp
 */
function getEmpresaId() {
  const authStore = useAuthStore.getState();
  const user = authStore.user;
  
  console.log('🔍 DEBUG getEmpresaId - user:', user);
  console.log('🔍 DEBUG getEmpresaId - authStore.empresaId:', authStore.empresaId);
  console.log('🔍 DEBUG getEmpresaId - user.role:', user?.role);
  console.log('🔍 DEBUG getEmpresaId - user.customClaims:', user?.customClaims);
  
  // Se não tem user, tentar pegar do localStorage como fallback
  if (!user) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('⚠️ User não estava no store, usando localStorage:', parsedUser);
        
        // Verificar se é super admin (aceitar ambos formatos)
        const isSuperAdmin = parsedUser.role === 'super_admin' || 
                            parsedUser.role === 'super-admin' ||
                            parsedUser.customClaims?.role === 'super_admin' ||
                            parsedUser.customClaims?.role === 'super-admin';
        
        if (isSuperAdmin) {
          const emailPrefix = parsedUser.email?.split('@')[0] || 'super-admin';
          const superAdminId = `super-admin-${emailPrefix}`;
          console.log('✅ SUPER ADMIN (localStorage)! Usando ID:', superAdminId);
          return superAdminId;
        }
        
        // Usuário normal
        if (parsedUser.empresaId) {
          console.log('✅ Usuário normal (localStorage) - empresaId:', parsedUser.empresaId);
          return parsedUser.empresaId;
        }
      } catch (e) {
        console.error('Erro ao parsear user do localStorage:', e);
      }
    }
  }
  
  // SUPER ADMIN: SEMPRE usar ID baseado no email, NUNCA usar empresaId
  // Aceitar tanto 'super_admin' quanto 'super-admin'
  const isSuperAdmin = user?.role === 'super_admin' || 
                       user?.role === 'super-admin' ||
                       user?.customClaims?.role === 'super_admin' ||
                       user?.customClaims?.role === 'super-admin';
  
  if (isSuperAdmin) {
    const emailPrefix = user.email?.split('@')[0] || 'super-admin';
    const superAdminId = `super-admin-${emailPrefix}`;
    console.log('✅ SUPER ADMIN detectado! Usando ID:', superAdminId, 'para email:', user.email);
    return superAdminId;
  }
  
  // USUÁRIO NORMAL: usar empresaId
  const empresaId = user?.empresaId || authStore.empresaId;
  
  if (!empresaId) {
    console.error('❌ ERRO CRÍTICO: empresaId não encontrado!', { 
      user, 
      authStoreEmpresaId: authStore.empresaId,
      role: user?.role,
      localStorage: localStorage.getItem('user')
    });
    
    // Último recurso: usar email como identificador temporário
    if (user?.email) {
      const tempId = `temp-${user.email.split('@')[0]}`;
      console.warn('⚠️ Usando ID temporário:', tempId);
      return tempId;
    }
    
    throw new Error('Usuário não está associado a uma empresa');
  }
  
  console.log('✅ Usuário normal - usando empresaId:', empresaId, 'para email:', user?.email);
  return empresaId;
}

export const whatsappService = {
  /**
   * Envia uma mensagem via WhatsApp
   * @param {string} phoneNumber - Número do telefone (com DDD)
   * @param {string} message - Mensagem a ser enviada
   * @returns {Promise<object>} Resultado do envio
   */
  async sendMessage(phoneNumber, message) {
    try {
      const empresaId = getEmpresaId();
      
      const response = await fetch(`${API_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          message: message,
          empresaId: empresaId, // ISOLAMENTO GARANTIDO
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        // Propagar o código de erro também
        const errorMessage = error.error || error.message || 'Erro ao enviar mensagem';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Mensagem enviada via empresaId:', empresaId, 'de:', result.sentFrom);
      return result;
    } catch (error) {
      // Detectar erro de CORS ou falha de rede
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        console.error('❌ Erro de CORS');
        throw new Error('Erro de CORS: O servidor WhatsApp não está acessível. Verifique se o backend está rodando.');
      }
      console.error('❌ Erro ao enviar mensagem:', error);
      throw error;
    }
  },

  /**
   * Verifica o status da conexão WhatsApp
   * @returns {Promise<object>} Status da conexão
   */
  async getStatus() {
    try {
      const empresaId = getEmpresaId();
      
      const response = await fetch(`${API_URL}/api/whatsapp/status?empresaId=${empresaId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao verificar status');
      }

      const data = await response.json();
      
      console.log('📊 Status WhatsApp para empresaId:', empresaId, '- Conectado:', data.connected, '- Tem sessão salva:', data.hasSavedSession);
      
      // Se tem sessão salva, considerar como "exists" mesmo que não esteja conectado no momento
      const exists = data.connected || data.hasSavedSession;
      
      return {
        success: true,
        exists: exists,
        status: data.connected ? 'connected' : (data.hasSavedSession ? 'saved' : 'disconnected'),
        phoneNumber: data.user_data?.phone,
        hasSavedSession: data.hasSavedSession,
        empresaId: data.empresaId
      };
    } catch (error) {
      // Detectar erro de CORS ou falha de rede
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        console.error('❌ Erro de CORS');
      } else {
        console.error('❌ Erro ao verificar status:', error);
      }
      return {
        success: false,
        exists: false,
        status: 'disconnected',
        hasSavedSession: false
      };
    }
  },

  /**
   * Inicia a conexão WhatsApp
   * @returns {Promise<object>} Resultado da inicialização
   */
  async connect() {
    try {
      const empresaId = getEmpresaId();
      
      console.log('🔌 Conectando WhatsApp para empresaId:', empresaId);
      console.log('🌐 API_URL:', API_URL);
      console.log('📡 Fazendo requisição para:', `${API_URL}/api/whatsapp/connect`);
      
      const response = await fetch(`${API_URL}/api/whatsapp/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresaId: empresaId // ISOLAMENTO GARANTIDO
        })
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        // Propagar o código de erro também (TIMEOUT, NOT_CONNECTED, etc)
        const errorMessage = error.error || error.message || 'Erro ao conectar';
        const errorObj = new Error(errorMessage);
        errorObj.code = error.error;
        errorObj.suggestion = error.suggestion;
        throw errorObj;
      }

      const data = await response.json();
      
      console.log('📦 Dados recebidos:', data);
      console.log('✅ Conexão iniciada para empresaId:', data.empresaId);
      console.log('🔍 Status:', data.status);
      console.log('🔍 QR (qr_code):', data.qr_code ? 'existe' : 'não existe');
      console.log('🔍 QR (qr):', data.qr ? 'existe' : 'não existe');
      
      return {
        success: true,
        status: data.status === 'already_authenticated' ? 'connected' : 'qr_ready',
        qr: data.qr || data.qr_code, // Aceitar ambos os formatos
        phoneNumber: data.user_data?.phone,
        empresaId: data.empresaId
      };
    } catch (error) {
      // Detectar erro de CORS ou falha de rede
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        console.error('❌ Erro de CORS ou servidor inacessível');
        const corsError = new Error('Erro de CORS: O servidor WhatsApp não está acessível ou não permite requisições do frontend. Verifique se o backend está rodando e configurado corretamente.');
        corsError.code = 'CORS_ERROR';
        throw corsError;
      }
      console.error('❌ Erro ao conectar:', error);
      throw error;
    }
  },

  /**
   * Desconecta o WhatsApp
   * @returns {Promise<object>} Resultado da desconexão
   */
  async disconnect() {
    try {
      const empresaId = getEmpresaId();
      
      console.log('🔌 Desconectando WhatsApp para empresaId:', empresaId);
      
      const response = await fetch(`${API_URL}/api/whatsapp/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresaId: empresaId // ISOLAMENTO GARANTIDO
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao desconectar');
      }

      const result = await response.json();
      console.log('✅ Desconectado empresaId:', result.empresaId);
      return result;
    } catch (error) {
      // Detectar erro de CORS ou falha de rede
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        console.error('❌ Erro de CORS');
        throw new Error('Erro de CORS: O servidor WhatsApp não está acessível.');
      }
      console.error('❌ Erro ao desconectar:', error);
      throw error;
    }
  },

  /**
   * Formata uma mensagem de orçamento
   * @param {object} budget - Dados do orçamento
   * @returns {string} Mensagem formatada
   */
  formatBudgetMessage(budget) {
    const { client, vehicle, items, total } = budget;
    
    let message = `🔧 *Orçamento - Torq*\n\n`;
    message += `👤 Cliente: ${client.name}\n`;
    
    if (vehicle) {
      message += `🚗 Veículo: ${vehicle.brand} ${vehicle.model}\n`;
      if (vehicle.plate) {
        message += `📋 Placa: ${vehicle.plate}\n`;
      }
    }
    
    message += `\n*Serviços/Produtos:*\n`;
    
    if (items && items.length > 0) {
      items.forEach((item, index) => {
        message += `${index + 1}. ${item.description} - R$ ${item.price.toFixed(2)}\n`;
      });
    }
    
    message += `\n💰 *Total: R$ ${total.toFixed(2)}*\n\n`;
    message += `Obrigado pela preferência! 🙏`;
    
    return message;
  },

  /**
   * Envia um orçamento formatado via WhatsApp
   * @param {string} phoneNumber - Número do telefone
   * @param {object} budget - Dados do orçamento
   * @returns {Promise<object>} Resultado do envio
   */
  async sendBudget(phoneNumber, budget) {
    const message = this.formatBudgetMessage(budget);
    return this.sendMessage(phoneNumber, message);
  }
};

// Aliases para compatibilidade com código existente
export const initiateConnection = () => whatsappService.connect();
export const generateQRCode = () => whatsappService.connect();
export const getConnectionStatus = async () => {
  const status = await whatsappService.getStatus();
  return {
    connected: status.status === 'connected',
    ...status
  };
};
export const checkConnectionStatus = getConnectionStatus;
export const disconnectWhatsApp = () => whatsappService.disconnect();
export const sendMessage = (phoneNumber, message) => whatsappService.sendMessage(phoneNumber, message);
export const sendWhatsAppMessage = (phoneNumber, message) => whatsappService.sendMessage(phoneNumber, message);

export default whatsappService;
