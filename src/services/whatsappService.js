/**
 * WhatsApp Service
 * Serviço para integração com WhatsApp API (Python Backend)
 */

import { useAuthStore } from '../store/authStore';

// Usar backend Python que já está funcionando
const API_URL = import.meta.env.VITE_WHATSAPP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const whatsappService = {
  /**
   * Envia uma mensagem via WhatsApp
   * @param {string} phoneNumber - Número do telefone (com DDD)
   * @param {string} message - Mensagem a ser enviada
   * @returns {Promise<object>} Resultado do envio
   */
  async sendMessage(phoneNumber, message) {
    try {
      const response = await fetch(`${API_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          message: message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao enviar mensagem');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      throw error;
    }
  },

  /**
   * Verifica o status da conexão WhatsApp
   * @returns {Promise<object>} Status da conexão
   */
  async getStatus() {
    try {
      const response = await fetch(`${API_URL}/api/whatsapp/status`);
      
      if (!response.ok) {
        throw new Error('Erro ao verificar status');
      }

      const data = await response.json();
      
      // Adaptar resposta do Python para formato esperado
      return {
        success: true,
        exists: data.connected,
        status: data.connected ? 'connected' : 'disconnected',
        phoneNumber: data.user_data?.phone
      };
    } catch (error) {
      console.error('Erro ao verificar status WhatsApp:', error);
      return {
        success: false,
        exists: false,
        status: 'disconnected'
      };
    }
  },

  /**
   * Inicia a conexão WhatsApp
   * @returns {Promise<object>} Resultado da inicialização
   */
  async connect() {
    try {
      const response = await fetch(`${API_URL}/api/whatsapp/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao conectar');
      }

      const data = await response.json();
      
      // Adaptar resposta do Python
      return {
        success: true,
        status: data.status === 'already_authenticated' ? 'connected' : 'qr_ready',
        qr: data.qr_code,
        phoneNumber: data.user_data?.phone
      };
    } catch (error) {
      console.error('Erro ao conectar WhatsApp:', error);
      throw error;
    }
  },

  /**
   * Desconecta o WhatsApp
   * @returns {Promise<object>} Resultado da desconexão
   */
  async disconnect() {
    try {
      const response = await fetch(`${API_URL}/api/whatsapp/disconnect`, {
        method: 'POST'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao desconectar');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error);
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
