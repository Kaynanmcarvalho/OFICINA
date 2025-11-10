/**
 * Backend WhatsApp Multi-Tenant com Baileys
 * SEM Puppeteer - Conexão direta ao WhatsApp
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const pino = require('pino');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://192.168.18.203:5173',
    'http://192.168.18.203:5174',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Estado global - Múltiplas sessões por empresa
const sessions = new Map();

// Logger silencioso
const logger = pino({ level: 'silent' });

// Obter ou criar sessão para uma empresa
function getSession(empresaId) {
  if (!empresaId) {
    throw new Error('empresaId é obrigatório');
  }
  
  if (!sessions.has(empresaId)) {
    sessions.set(empresaId, {
      sock: null,
      qrCodeData: null,
      isReady: false,
      currentNumber: null,
      initializing: false
    });
  }
  
  return sessions.get(empresaId);
}

// Inicializar cliente WhatsApp com Baileys
async function initializeWhatsApp(empresaId) {
  const session = getSession(empresaId);
  
  if (session.sock) {
    console.log(`✓ Socket já existe para empresa ${empresaId}`);
    return;
  }

  if (session.initializing) {
    console.log(`⏳ Já está inicializando para empresa ${empresaId}`);
    return;
  }

  session.initializing = true;
  console.log(`📱 Inicializando WhatsApp (Baileys) para empresa ${empresaId}...`);

  try {
    // Diretório de autenticação
    const authDir = path.join(__dirname, 'whatsapp_sessions', `empresa-${empresaId}`);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }

    // Carregar estado de autenticação
    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    
    // Obter versão mais recente do Baileys
    const { version } = await fetchLatestBaileysVersion();

    // Criar socket
    const sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: false,
      auth: state,
      browser: ['Torq System', 'Chrome', '1.0.0']
    });

    session.sock = sock;

    // Evento: Atualização de conexão
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      // QR Code gerado
      if (qr) {
        console.log(`📱 QR Code gerado para empresa ${empresaId}!`);
        session.qrCodeData = await qrcode.toDataURL(qr);
      }

      // Conectado
      if (connection === 'open') {
        console.log(`✅ WhatsApp conectado para empresa ${empresaId}!`);
        session.isReady = true;
        session.qrCodeData = null;
        session.initializing = false;
        
        // Obter número
        if (sock.user) {
          session.currentNumber = sock.user.id.split(':')[0];
          console.log(`📱 Empresa ${empresaId} conectada como: +${session.currentNumber}`);
          
          // Salvar informações da sessão
          const sessionInfoPath = path.join(authDir, 'session-info.json');
          fs.writeFileSync(sessionInfoPath, JSON.stringify({
            phoneNumber: session.currentNumber,
            connectedAt: new Date().toISOString()
          }));
        }
      }

      // Desconectado
      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        
        console.log(`❌ Empresa ${empresaId} desconectada. Status:`, statusCode, 'Reconectar:', shouldReconnect);
        
        session.isReady = false;
        session.qrCodeData = null;
        session.sock = null;
        session.initializing = false;

        // Se foi desconectado permanentemente (logout), limpar sessão automaticamente
        if (!shouldReconnect) {
          console.log(`🗑️ Limpando sessão da empresa ${empresaId} (logout detectado)...`);
          
          try {
            // Remover diretório de sessão
            if (fs.existsSync(authDir)) {
              fs.rmSync(authDir, { recursive: true, force: true });
              console.log(`✅ Sessão da empresa ${empresaId} limpa com sucesso!`);
            }
            
            // Limpar dados da sessão em memória
            session.currentNumber = null;
          } catch (error) {
            console.error(`❌ Erro ao limpar sessão da empresa ${empresaId}:`, error);
          }
        } else {
          // Tentar reconectar
          setTimeout(() => {
            console.log(`🔄 Tentando reconectar empresa ${empresaId}...`);
            initializeWhatsApp(empresaId);
          }, 5000);
        }
      }
    });

    // Evento: Salvar credenciais
    sock.ev.on('creds.update', saveCreds);

  } catch (error) {
    console.error(`❌ Erro ao inicializar empresa ${empresaId}:`, error);
    session.initializing = false;
    session.sock = null;
  }
}

console.log('🚀 Servidor WhatsApp Multi-Tenant (Baileys) pronto!');

// Rotas da API

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'whatsapp-automation-baileys' });
});

// Conectar WhatsApp
app.post('/api/whatsapp/connect', async (req, res) => {
  try {
    const { empresaId } = req.body;
    
    console.log('🔌 POST /api/whatsapp/connect - empresaId:', empresaId);
    
    if (!empresaId || empresaId === 'undefined' || empresaId === 'null') {
      console.error('❌ empresaId inválido:', empresaId);
      return res.status(400).json({
        error: 'empresaId é obrigatório e deve ser válido',
        received: empresaId
      });
    }
    
    const session = getSession(empresaId);
    
    // Se já está pronto, retornar status
    if (session.isReady) {
      console.log('✅ Empresa já conectada:', empresaId);
      return res.json({
        status: 'connected',
        user_data: { phone: session.currentNumber },
        empresaId
      });
    }

    // Se já está inicializando, aguardar um pouco
    if (session.initializing) {
      console.log('⏳ Sessão já está inicializando, aguardando...');
      let attempts = 0;
      while (session.initializing && !session.isReady && !session.qrCodeData && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
    }

    // Se não tem socket e não está inicializando, inicializar
    if (!session.sock && !session.initializing) {
      console.log('🔄 Inicializando nova sessão para:', empresaId);
      
      // Verificar se tem sessão salva corrompida
      const authDir = path.join(__dirname, 'whatsapp_sessions', `empresa-${empresaId}`);
      const hasSavedSession = fs.existsSync(authDir) && fs.existsSync(path.join(authDir, 'creds.json'));
      
      if (hasSavedSession) {
        console.log('📂 Sessão salva encontrada, tentando restaurar...');
      }
      
      await initializeWhatsApp(empresaId);
    }

    // Aguardar QR Code ou conexão (máximo 15 segundos - reduzido de 30s)
    let attempts = 0;
    const maxAttempts = 30; // 30 x 500ms = 15 segundos
    
    while (!session.qrCodeData && !session.isReady && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
      
      // Log a cada 5 segundos
      if (attempts % 10 === 0) {
        console.log(`⏳ Aguardando QR Code... (${attempts * 0.5}s)`);
      }
    }

    if (session.isReady) {
      console.log('✅ Conectado durante aguardo:', empresaId);
      return res.json({
        status: 'connected',
        user_data: { phone: session.currentNumber },
        empresaId
      });
    }

    if (session.qrCodeData) {
      console.log('✅ Retornando QR Code para empresaId:', empresaId);
      return res.json({
        status: 'qr_ready',
        qr: session.qrCodeData,
        empresaId
      });
    }

    // Se chegou aqui, deu timeout - limpar sessão corrompida automaticamente
    console.error('⏰ Timeout aguardando QR Code para empresaId:', empresaId);
    console.log('🗑️ Limpando sessão corrompida automaticamente...');
    
    // Limpar estado em memória
    session.initializing = false;
    session.sock = null;
    session.qrCodeData = null;
    session.isReady = false;
    session.currentNumber = null;
    
    // Limpar arquivos da sessão
    try {
      const authDir = path.join(__dirname, 'whatsapp_sessions', `empresa-${empresaId}`);
      if (fs.existsSync(authDir)) {
        fs.rmSync(authDir, { recursive: true, force: true });
        console.log('✅ Sessão corrompida limpa com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro ao limpar sessão:', error);
    }
    
    res.status(408).json({
      error: 'TIMEOUT',
      message: 'Timeout aguardando QR Code. Sessão foi limpa automaticamente.',
      suggestion: 'Tente conectar novamente',
      empresaId,
      sessionCleaned: true
    });

  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
    res.status(500).json({
      error: error.message,
      message: 'Erro ao iniciar conexão'
    });
  }
});

// Status da conexão
app.get('/api/whatsapp/status', (req, res) => {
  const { empresaId } = req.query;
  
  if (!empresaId || empresaId === 'undefined' || empresaId === 'null') {
    return res.status(400).json({
      error: 'empresaId é obrigatório e deve ser válido'
    });
  }
  
  const session = getSession(empresaId);
  
  // Verificar se tem sessão salva
  const authDir = path.join(__dirname, 'whatsapp_sessions', `empresa-${empresaId}`);
  const hasSavedSession = fs.existsSync(authDir) && fs.existsSync(path.join(authDir, 'creds.json'));
  
  // Tentar ler número do arquivo
  let phoneNumber = session.currentNumber;
  if (!phoneNumber && hasSavedSession) {
    try {
      const sessionInfoPath = path.join(authDir, 'session-info.json');
      if (fs.existsSync(sessionInfoPath)) {
        const sessionInfo = JSON.parse(fs.readFileSync(sessionInfoPath, 'utf8'));
        phoneNumber = sessionInfo.phoneNumber;
      }
    } catch (error) {
      console.error('Erro ao ler session-info:', error);
    }
  }
  
  const statusResponse = {
    connected: session.isReady,
    message: session.isReady ? 'Conectado' : (hasSavedSession ? 'Sessão salva disponível' : 'Não conectado'),
    user_data: (session.isReady || phoneNumber) ? { phone: phoneNumber } : null,
    hasSavedSession: hasSavedSession,
    empresaId
  };
  
  console.log(`📊 Status para empresa ${empresaId}:`, {
    connected: statusResponse.connected,
    hasSavedSession: statusResponse.hasSavedSession,
    hasPhone: !!phoneNumber
  });
  
  res.json(statusResponse);
});

// Enviar mensagem
app.post('/api/whatsapp/send', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { phone_number, message, empresaId } = req.body;

    console.log(`📨 POST /api/whatsapp/send - empresaId: ${empresaId}, para: ${phone_number}`);

    if (!empresaId) {
      return res.status(400).json({
        error: 'empresaId é obrigatório'
      });
    }

    if (!phone_number || !message) {
      return res.status(400).json({
        error: 'phone_number e message são obrigatórios'
      });
    }

    const session = getSession(empresaId);

    // Se não está pronto, tentar inicializar
    if (!session.isReady) {
      const authDir = path.join(__dirname, 'whatsapp_sessions', `empresa-${empresaId}`);
      const hasSavedSession = fs.existsSync(authDir) && fs.existsSync(path.join(authDir, 'creds.json'));
      
      if (hasSavedSession && !session.initializing && !session.sock) {
        console.log(`🔄 Inicializando sessão salva para ${empresaId} antes de enviar...`);
        await initializeWhatsApp(empresaId);
        
        // Aguardar até 30 segundos
        let attempts = 0;
        while (!session.isReady && attempts < 60) {
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }
      }
      
      if (!session.isReady) {
        return res.status(401).json({
          error: 'NOT_CONNECTED',
          message: `WhatsApp não está conectado para empresa ${empresaId}`
        });
      }
    }

    // Limpar e formatar número
    let cleanNumber = phone_number.replace(/\D/g, '');
    
    // Se não tem código do país, adicionar 55 (Brasil)
    if (cleanNumber.length === 11 || cleanNumber.length === 10) {
      cleanNumber = '55' + cleanNumber;
    }
    
    // Formatar para JID do WhatsApp
    const jid = `${cleanNumber}@s.whatsapp.net`;
    
    console.log(`📤 Enviando mensagem para ${jid} via empresa ${empresaId}...`);
    
    // Enviar mensagem
    await session.sock.sendMessage(jid, { text: message });

    const duration = Date.now() - startTime;
    console.log(`✅ Mensagem enviada em ${duration}ms para ${cleanNumber} via empresa ${empresaId}`);

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      empresaId,
      duration: `${duration}ms`
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Erro ao enviar mensagem após ${duration}ms:`, error.message);
    res.status(500).json({
      error: error.message,
      message: 'Erro ao enviar mensagem'
    });
  }
});

// Desconectar
app.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    const { empresaId } = req.body;
    
    if (!empresaId) {
      return res.status(400).json({
        error: 'empresaId é obrigatório'
      });
    }
    
    const session = getSession(empresaId);
    
    if (session.sock) {
      await session.sock.logout();
      session.sock = null;
      session.isReady = false;
      session.qrCodeData = null;
      session.currentNumber = null;
      session.initializing = false;
    }

    // Remover diretório de sessão
    const authDir = path.join(__dirname, 'whatsapp_sessions', `empresa-${empresaId}`);
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true });
    }

    res.json({
      success: true,
      message: 'Desconectado com sucesso',
      empresaId
    });

  } catch (error) {
    console.error('Erro ao desconectar:', error);
    res.status(500).json({
      error: error.message,
      message: 'Erro ao desconectar'
    });
  }
});

// Função para restaurar sessões salvas automaticamente
function autoRestoreSessions() {
  const sessionsDir = path.join(__dirname, 'whatsapp_sessions');
  
  if (!fs.existsSync(sessionsDir)) {
    console.log('📁 Nenhuma sessão salva');
    return;
  }
  
  const folders = fs.readdirSync(sessionsDir);
  const empresaFolders = folders.filter(f => f.startsWith('empresa-'));
  
  if (empresaFolders.length === 0) {
    console.log('📁 Nenhuma sessão para restaurar');
    return;
  }
  
  console.log(`🔄 Restaurando ${empresaFolders.length} sessão(ões)...`);
  
  // Restaurar cada sessão com delay entre elas
  empresaFolders.forEach((folder, index) => {
    const empresaId = folder.replace('empresa-', '');
    
    // Verificar se tem credenciais salvas
    const credsPath = path.join(sessionsDir, folder, 'creds.json');
    if (fs.existsSync(credsPath)) {
      setTimeout(() => {
        console.log(`🚀 Restaurando sessão ${index + 1}/${empresaFolders.length}: ${empresaId}`);
        initializeWhatsApp(empresaId);
      }, index * 3000); // 3 segundos de delay entre cada
    }
  });
}

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  WhatsApp Backend - Multi-Tenant (BAILEYS)              ║
║  Servidor rodando em:                                    ║
║    - http://localhost:${PORT}                            ║
║    - http://192.168.18.203:${PORT}                       ║
║  Engine: Baileys (SEM Puppeteer)                         ║
║  Isolamento por empresa: ATIVADO                         ║
║  Auto-Restore: ATIVADO (delay 10s)                       ║
╚══════════════════════════════════════════════════════════╝
  `);
  
  // Restaurar sessões após 10 segundos
  setTimeout(() => {
    console.log('\n🔄 Iniciando restauração automática de sessões...\n');
    autoRestoreSessions();
  }, 10000);
});
