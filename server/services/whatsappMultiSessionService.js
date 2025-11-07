/**
 * WhatsApp Multi-Session Service
 * Gerencia múltiplas sessões do WhatsApp isoladas por empresa
 * Cada empresa tem sua própria sessão e diretório de autenticação
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs-extra');
const path = require('path');
const admin = require('firebase-admin');

class WhatsAppMultiSessionService {
  constructor() {
    // Map para armazenar todas as sessões ativas
    // Key: empresaId, Value: { client, status, qr, phoneNumber }
    this.sessions = new Map();
    
    // Diretório base para armazenar sessões
    this.sessionsDir = path.join(__dirname, '..', 'sessions');
    
    // Garantir que o diretório existe
    fs.ensureDirSync(this.sessionsDir);
    
    // Referência ao Firestore
    this.db = admin.firestore();
    
    console.log('[WhatsApp Service] Serviço multi-sessão inicializado');
    console.log(`[WhatsApp Service] Diretório de sessões: ${this.sessionsDir}`);
  }

  /**
   * Inicializa ou restaura uma sessão do WhatsApp para uma empresa
   * @param {string} empresaId - ID único da empresa
   * @param {object} io - Instância do Socket.IO para emitir eventos
   * @returns {Promise<object>} Status da inicialização
   */
  async initializeSession(empresaId, io = null) {
    try {
      console.log(`[WhatsApp] Inicializando sessão para empresa: ${empresaId}`);

      // Verificar se já existe uma sessão ativa
      if (this.sessions.has(empresaId)) {
        const session = this.sessions.get(empresaId);
        
        if (session.status === 'connected') {
          console.log(`[WhatsApp] Sessão já conectada para empresa: ${empresaId}`);
          return {
            success: true,
            status: 'connected',
            message: 'Sessão já está conectada',
            phoneNumber: session.phoneNumber
          };
        }
        
        // Se existe mas não está conectada, destruir e recriar
        await this.destroySession(empresaId);
      }

      // Criar diretório específico para a empresa
      const sessionPath = path.join(this.sessionsDir, empresaId);
      await fs.ensureDir(sessionPath);

      // Criar novo cliente WhatsApp com autenticação local
      const client = new Client({
        authStrategy: new LocalAuth({
          clientId: empresaId,
          dataPath: sessionPath
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

      // Armazenar sessão
      this.sessions.set(empresaId, {
        client,
        status: 'initializing',
        qr: null,
        phoneNumber: null,
        createdAt: new Date(),
        io
      });

      // Configurar event listeners
      this.setupClientEvents(empresaId, client, io);

      // Inicializar cliente
      await client.initialize();

      console.log(`[WhatsApp] Cliente inicializado para empresa: ${empresaId}`);

      return {
        success: true,
        status: 'initializing',
        message: 'Sessão inicializada, aguardando QR code ou autenticação'
      };

    } catch (error) {
      console.error(`[WhatsApp] Erro ao inicializar sessão para ${empresaId}:`, error);
      
      // Atualizar status no Firebase
      await this.updateFirebaseStatus(empresaId, 'error', error.message);
      
      return {
        success: false,
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Configura todos os event listeners para um cliente WhatsApp
   */
  setupClientEvents(empresaId, client, io) {
    // QR Code gerado
    client.on('qr', async (qr) => {
      console.log(`[WhatsApp] QR Code gerado para empresa: ${empresaId}`);
      
      try {
        // Converter QR para base64
        const qrBase64 = await qrcode.toDataURL(qr);
        
        // Atualizar sessão
        const session = this.sessions.get(empresaId);
        if (session) {
          session.qr = qrBase64;
          session.status = 'qr_ready';
        }
        
        // Salvar no Firebase
        await this.updateFirebaseStatus(empresaId, 'qr_ready', null, qrBase64);
        
        // Emitir via Socket.IO
        if (io) {
          io.to(empresaId).emit('whatsapp:qr', {
            empresaId,
            qr: qrBase64,
            timestamp: new Date().toISOString()
          });
        }
        
      } catch (error) {
        console.error(`[WhatsApp] Erro ao processar QR para ${empresaId}:`, error);
      }
    });

    // Cliente autenticado
    client.on('authenticated', async () => {
      console.log(`[WhatsApp] Cliente autenticado para empresa: ${empresaId}`);
      
      const session = this.sessions.get(empresaId);
      if (session) {
        session.status = 'authenticated';
        session.qr = null;
      }
      
      await this.updateFirebaseStatus(empresaId, 'authenticated');
      
      if (io) {
        io.to(empresaId).emit('whatsapp:authenticated', {
          empresaId,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Cliente pronto (conectado)
    client.on('ready', async () => {
      console.log(`[WhatsApp] Cliente conectado para empresa: ${empresaId}`);
      
      try {
        // Obter informações do número conectado
        const info = client.info;
        const phoneNumber = info.wid.user;
        
        const session = this.sessions.get(empresaId);
        if (session) {
          session.status = 'connected';
          session.phoneNumber = phoneNumber;
          session.qr = null;
        }
        
        await this.updateFirebaseStatus(empresaId, 'connected', null, null, phoneNumber);
        
        if (io) {
          io.to(empresaId).emit('whatsapp:connected', {
            empresaId,
            phoneNumber,
            timestamp: new Date().toISOString()
          });
        }
        
      } catch (error) {
        console.error(`[WhatsApp] Erro ao obter info do cliente ${empresaId}:`, error);
      }
    });

    // Falha na autenticação
    client.on('auth_failure', async (msg) => {
      console.error(`[WhatsApp] Falha na autenticação para ${empresaId}:`, msg);
      
      const session = this.sessions.get(empresaId);
      if (session) {
        session.status = 'auth_failure';
      }
      
      await this.updateFirebaseStatus(empresaId, 'auth_failure', msg);
      
      if (io) {
        io.to(empresaId).emit('whatsapp:auth_failure', {
          empresaId,
          message: msg,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Cliente desconectado
    client.on('disconnected', async (reason) => {
      console.log(`[WhatsApp] Cliente desconectado para ${empresaId}:`, reason);
      
      const session = this.sessions.get(empresaId);
      if (session) {
        session.status = 'disconnected';
      }
      
      await this.updateFirebaseStatus(empresaId, 'disconnected', reason);
      
      if (io) {
        io.to(empresaId).emit('whatsapp:disconnected', {
          empresaId,
          reason,
          timestamp: new Date().toISOString()
        });
      }
      
      // Tentar reconectar após 5 segundos
      setTimeout(() => {
        console.log(`[WhatsApp] Tentando reconectar empresa: ${empresaId}`);
        this.initializeSession(empresaId, io);
      }, 5000);
    });

    // Mensagem recebida (opcional - para logs)
    client.on('message', async (message) => {
      console.log(`[WhatsApp] Mensagem recebida para ${empresaId}:`, message.from);
    });
  }

  /**
   * Atualiza o status da sessão no Firebase
   */
  async updateFirebaseStatus(empresaId, status, errorMessage = null, qr = null, phoneNumber = null) {
    try {
      const data = {
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        sessionPath: `sessions/${empresaId}`
      };
      
      if (errorMessage) data.errorMessage = errorMessage;
      if (qr) data.qr = qr;
      if (phoneNumber) data.phoneNumber = phoneNumber;
      
      await this.db.collection('empresas').doc(empresaId).collection('whatsapp').doc('status').set(data, { merge: true });
      
    } catch (error) {
      console.error(`[WhatsApp] Erro ao atualizar Firebase para ${empresaId}:`, error);
    }
  }

  /**
   * Obtém o status atual de uma sessão
   */
  getSessionStatus(empresaId) {
    const session = this.sessions.get(empresaId);
    
    if (!session) {
      return {
        exists: false,
        status: 'not_initialized',
        message: 'Sessão não inicializada'
      };
    }
    
    return {
      exists: true,
      status: session.status,
      phoneNumber: session.phoneNumber,
      qr: session.qr,
      createdAt: session.createdAt
    };
  }

  /**
   * Envia uma mensagem via WhatsApp
   */
  async sendMessage(empresaId, phoneNumber, message) {
    try {
      const session = this.sessions.get(empresaId);
      
      if (!session) {
        throw new Error('Sessão não encontrada. Inicialize a conexão primeiro.');
      }
      
      if (session.status !== 'connected') {
        throw new Error(`Sessão não está conectada. Status atual: ${session.status}`);
      }
      
      const client = session.client;
      
      // Formatar número (remover caracteres especiais e adicionar @c.us)
      const formattedNumber = phoneNumber.replace(/\D/g, '') + '@c.us';
      
      // Enviar mensagem
      const result = await client.sendMessage(formattedNumber, message);
      
      console.log(`[WhatsApp] Mensagem enviada para ${phoneNumber} via empresa ${empresaId}`);
      
      return {
        success: true,
        messageId: result.id.id,
        timestamp: result.timestamp
      };
      
    } catch (error) {
      console.error(`[WhatsApp] Erro ao enviar mensagem para ${empresaId}:`, error);
      throw error;
    }
  }

  /**
   * Destrói uma sessão específica
   */
  async destroySession(empresaId) {
    try {
      const session = this.sessions.get(empresaId);
      
      if (session && session.client) {
        await session.client.destroy();
        console.log(`[WhatsApp] Sessão destruída para empresa: ${empresaId}`);
      }
      
      this.sessions.delete(empresaId);
      
      await this.updateFirebaseStatus(empresaId, 'destroyed');
      
      return { success: true };
      
    } catch (error) {
      console.error(`[WhatsApp] Erro ao destruir sessão ${empresaId}:`, error);
      throw error;
    }
  }

  /**
   * Desconecta uma sessão (logout)
   */
  async logoutSession(empresaId) {
    try {
      const session = this.sessions.get(empresaId);
      
      if (!session || !session.client) {
        throw new Error('Sessão não encontrada');
      }
      
      await session.client.logout();
      
      // Remover diretório de sessão
      const sessionPath = path.join(this.sessionsDir, empresaId);
      await fs.remove(sessionPath);
      
      this.sessions.delete(empresaId);
      
      await this.updateFirebaseStatus(empresaId, 'logged_out');
      
      console.log(`[WhatsApp] Logout realizado para empresa: ${empresaId}`);
      
      return { success: true };
      
    } catch (error) {
      console.error(`[WhatsApp] Erro ao fazer logout ${empresaId}:`, error);
      throw error;
    }
  }

  /**
   * Restaura todas as sessões salvas ao iniciar o servidor
   */
  async restoreAllSessions(io) {
    try {
      console.log('[WhatsApp] Restaurando sessões salvas...');
      
      // Listar todos os diretórios de sessão
      const sessionDirs = await fs.readdir(this.sessionsDir);
      
      for (const empresaId of sessionDirs) {
        const sessionPath = path.join(this.sessionsDir, empresaId);
        const stats = await fs.stat(sessionPath);
        
        if (stats.isDirectory()) {
          console.log(`[WhatsApp] Restaurando sessão para empresa: ${empresaId}`);
          
          // Inicializar sessão (vai restaurar automaticamente se existir)
          await this.initializeSession(empresaId, io);
        }
      }
      
      console.log(`[WhatsApp] ${sessionDirs.length} sessões restauradas`);
      
    } catch (error) {
      console.error('[WhatsApp] Erro ao restaurar sessões:', error);
    }
  }

  /**
   * Lista todas as sessões ativas
   */
  getAllSessions() {
    const sessions = [];
    
    for (const [empresaId, session] of this.sessions.entries()) {
      sessions.push({
        empresaId,
        status: session.status,
        phoneNumber: session.phoneNumber,
        createdAt: session.createdAt
      });
    }
    
    return sessions;
  }
}

// Exportar instância única (singleton)
module.exports = new WhatsAppMultiSessionService();
