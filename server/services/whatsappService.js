const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

class WhatsAppService {
  constructor() {
    this.clients = new Map(); // userId -> WhatsApp Client
    this.qrCodes = new Map(); // userId -> QR Code data
    this.sessionPath = process.env.WHATSAPP_SESSION_PATH || './sessions';
    
    // Criar diretório de sessões se não existir
    if (!fs.existsSync(this.sessionPath)) {
      fs.mkdirSync(this.sessionPath, { recursive: true });
    }
  }

  /**
   * Gera QR Code para autenticação do WhatsApp
   * @param {string} userId - ID do usuário Firebase
   * @param {Function} onQRUpdate - Callback para atualizar QR Code
   * @param {Function} onReady - Callback quando conectado
   * @returns {Promise<string>} QR Code em base64
   */
  async generateQR(userId, onQRUpdate, onReady) {
    try {
      console.log(`[WhatsApp] Gerando QR para usuário: ${userId}`);

      // Se já existe um cliente, destruir
      if (this.clients.has(userId)) {
        await this.disconnect(userId);
      }

      // Criar novo cliente WhatsApp
      const client = new Client({
        authStrategy: new LocalAuth({
          clientId: userId,
          dataPath: path.join(this.sessionPath, userId)
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      });

      // Evento: QR Code gerado
      client.on('qr', async (qr) => {
        console.log(`[WhatsApp] QR Code gerado para ${userId}`);
        
        // Converter QR para base64
        const qrBase64 = await qrcode.toDataURL(qr);
        this.qrCodes.set(userId, qrBase64);

        // Salvar no Firestore
        await this.saveQRToFirestore(userId, qrBase64);

        // Callback para atualizar frontend
        if (onQRUpdate) {
          onQRUpdate(qrBase64);
        }
      });

      // Evento: Cliente pronto (autenticado)
      client.on('ready', async () => {
        console.log(`[WhatsApp] Cliente pronto para ${userId}`);
        
        const info = client.info;
        
        // Salvar sessão no Firestore
        await this.saveSessionToFirestore(userId, {
          isConnected: true,
          phoneNumber: info.wid.user,
          pushname: info.pushname,
          platform: info.platform,
          lastConnected: admin.firestore.FieldValue.serverTimestamp()
        });

        // Callback
        if (onReady) {
          onReady(info);
        }
      });

      // Evento: Autenticação bem-sucedida
      client.on('authenticated', () => {
        console.log(`[WhatsApp] Autenticado: ${userId}`);
      });

      // Evento: Falha na autenticação
      client.on('auth_failure', async (msg) => {
        console.error(`[WhatsApp] Falha na autenticação para ${userId}:`, msg);
        await this.saveErrorToFirestore(userId, 'auth_failure', msg);
      });

      // Evento: Desconectado
      client.on('disconnected', async (reason) => {
        console.log(`[WhatsApp] Desconectado ${userId}:`, reason);
        await this.updateConnectionStatus(userId, false);
        this.clients.delete(userId);
      });

      // Inicializar cliente
      await client.initialize();
      this.clients.set(userId, client);

      return { success: true, message: 'Cliente inicializado' };

    } catch (error) {
      console.error(`[WhatsApp] Erro ao gerar QR para ${userId}:`, error);
      await this.saveErrorToFirestore(userId, 'generate_qr_error', error.message);
      throw error;
    }
  }

  /**
   * Verifica status da conexão
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Status da conexão
   */
  async getConnectionStatus(userId) {
    try {
      const client = this.clients.get(userId);
      
      if (!client) {
        // Verificar no Firestore
        const doc = await admin.firestore()
          .collection('whatsapp_sessions')
          .doc(userId)
          .get();

        if (doc.exists) {
          return {
            isConnected: doc.data().isConnected || false,
            ...doc.data()
          };
        }

        return { isConnected: false };
      }

      const state = await client.getState();
      const isConnected = state === 'CONNECTED';

      return {
        isConnected,
        state,
        info: isConnected ? client.info : null
      };

    } catch (error) {
      console.error(`[WhatsApp] Erro ao verificar status para ${userId}:`, error);
      return { isConnected: false, error: error.message };
    }
  }

  /**
   * Desconecta sessão do WhatsApp
   * @param {string} userId - ID do usuário
   * @returns {Promise<boolean>} Sucesso
   */
  async disconnect(userId) {
    try {
      console.log(`[WhatsApp] Desconectando ${userId}`);

      const client = this.clients.get(userId);
      
      if (client) {
        await client.destroy();
        this.clients.delete(userId);
      }

      // Limpar QR Code
      this.qrCodes.delete(userId);

      // Atualizar Firestore
      await this.updateConnectionStatus(userId, false);

      // Limpar diretório de sessão
      const sessionDir = path.join(this.sessionPath, userId);
      if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      }

      console.log(`[WhatsApp] Desconectado com sucesso: ${userId}`);
      return true;

    } catch (error) {
      console.error(`[WhatsApp] Erro ao desconectar ${userId}:`, error);
      return false;
    }
  }

  /**
   * Envia mensagem via WhatsApp
   * @param {string} userId - ID do usuário
   * @param {string} phoneNumber - Número do destinatário
   * @param {string} message - Mensagem
   * @returns {Promise<Object>} Resultado
   */
  async sendMessage(userId, phoneNumber, message) {
    try {
      const client = this.clients.get(userId);
      
      if (!client) {
        throw new Error('Cliente não conectado');
      }

      // Formatar número
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      const chatId = `${formattedNumber}@c.us`;

      // Enviar mensagem
      await client.sendMessage(chatId, message);

      console.log(`[WhatsApp] Mensagem enviada de ${userId} para ${phoneNumber}`);
      return { success: true };

    } catch (error) {
      console.error(`[WhatsApp] Erro ao enviar mensagem:`, error);
      throw error;
    }
  }

  // ========== Métodos Auxiliares Firestore ==========

  async saveQRToFirestore(userId, qrCode) {
    try {
      await admin.firestore()
        .collection('whatsapp_sessions')
        .doc(userId)
        .set({
          userId,
          qrCode,
          expiresAt: admin.firestore.Timestamp.fromDate(
            new Date(Date.now() + 60000) // 60 segundos
          ),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
      console.error('[Firestore] Erro ao salvar QR:', error);
    }
  }

  async saveSessionToFirestore(userId, sessionData) {
    try {
      await admin.firestore()
        .collection('whatsapp_sessions')
        .doc(userId)
        .set({
          userId,
          ...sessionData,
          qrCode: null, // Limpar QR Code
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
      console.error('[Firestore] Erro ao salvar sessão:', error);
    }
  }

  async updateConnectionStatus(userId, isConnected) {
    try {
      await admin.firestore()
        .collection('whatsapp_sessions')
        .doc(userId)
        .update({
          isConnected,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
      console.error('[Firestore] Erro ao atualizar status:', error);
    }
  }

  async saveErrorToFirestore(userId, errorType, errorMessage) {
    try {
      await admin.firestore()
        .collection('whatsapp_sessions')
        .doc(userId)
        .set({
          lastError: {
            type: errorType,
            message: errorMessage,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          }
        }, { merge: true });
    } catch (error) {
      console.error('[Firestore] Erro ao salvar erro:', error);
    }
  }
}

module.exports = new WhatsAppService();
