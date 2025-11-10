/**
 * Backend WhatsApp Multi-Tenant
 * Isolamento por empresa com inicialização automática
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

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

// Cache de números verificados (para acelerar envios)
const numberCache = new Map(); // cleanNumber -> { numberId, timestamp }

// Obter ou criar sessão para uma empresa
function getSession(empresaId) {
  if (!empresaId) {
    throw new Error('empresaId é obrigatório');
  }
  
  if (!sessions.has(empresaId)) {
    sessions.set(empresaId, {
      client: null,
      qrCodeData: null,
      isReady: false,
      currentNumber: null,
      initializing: false
    });
  }
  
  return sessions.get(empresaId);
}

// Inicializar cliente WhatsApp para uma empresa específica
function initializeWhatsApp(empresaId) {
  const session = getSession(empresaId);
  
  if (session.client) {
    console.log(`✓ Cliente já existe para empresa ${empresaId}`);
    return;
  }

  if (session.initializing) {
    console.log(`⏳ Já está inicializando para empresa ${empresaId}`);
    return;
  }

  session.initializing = true;
  console.log(`📱 Inicializando WhatsApp para empresa ${empresaId}...`);

  session.client = new Client({
    authStrategy: new LocalAuth({
      dataPath: `./whatsapp_sessions/empresa-${empresaId}`
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

  // QR Code gerado
  session.client.on('qr', async (qr) => {
    console.log(`📱 QR Code gerado para empresa ${empresaId}!`);
    session.qrCodeData = await qrcode.toDataURL(qr);
  });

  // Autenticado
  session.client.on('authenticated', () => {
    console.log(`✅ Empresa ${empresaId} autenticada!`);
    session.qrCodeData = null;
  });

  // Carregando sessão
  session.client.on('loading_screen', (percent, message) => {
    console.log(`⏳ Empresa ${empresaId} carregando: ${percent}% - ${message}`);
  });

  // Pronto para usar
  session.client.on('ready', () => {
    console.log(`✅ WhatsApp pronto para empresa ${empresaId}!`);
    session.isReady = true;
    session.qrCodeData = null;
    session.initializing = false;
    
    // Obter número
    if (session.client.info && session.client.info.wid) {
      session.currentNumber = session.client.info.wid.user;
      console.log(`📱 Empresa ${empresaId} conectada como: +${session.currentNumber}`);
    }
  });

  // Desconectado
  session.client.on('disconnected', (reason) => {
    console.log(`❌ Empresa ${empresaId} desconectada:`, reason);
    session.isReady = false;
    session.qrCodeData = null;
    session.currentNumber = null;
    session.initializing = false;
    
    // Tentar reconectar após 5 segundos
    setTimeout(() => {
      console.log(`🔄 Tentando reconectar empresa ${empresaId}...`);
      session.client = null;
      initializeWhatsApp(empresaId);
    }, 5000);
  });

  // Erro de autenticação
  session.client.on('auth_failure', (msg) => {
    console.error(`❌ Falha na autenticação da empresa ${empresaId}:`, msg);
    session.qrCodeData = null;
    session.initializing = false;
  });

  // Inicializar
  session.client.initialize();
}

console.log('🚀 Servidor WhatsApp Multi-Tenant pronto!');

// Rotas da API

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'whatsapp-automation' });
});

// Conectar WhatsApp
app.post('/api/whatsapp/connect', async (req, res) => {
  try {
    const { empresaId } = req.body;
    
    console.log('🔌 POST /api/whatsapp/connect - empresaId:', empresaId);
    console.log('📦 Body completo:', JSON.stringify(req.body));
    
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
      return res.json({
        status: 'already_authenticated',
        user_data: { phone: session.currentNumber },
        empresaId
      });
    }

    // Se não tem cliente, inicializar
    if (!session.client && !session.initializing) {
      initializeWhatsApp(empresaId);
    }

    // Aguardar QR Code (máximo 30 segundos)
    let attempts = 0;
    while (!session.qrCodeData && !session.isReady && attempts < 60) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    if (session.isReady) {
      return res.json({
        status: 'already_authenticated',
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

    console.error('⏰ Timeout aguardando QR Code para empresaId:', empresaId);
    res.status(408).json({
      error: 'Timeout aguardando QR Code',
      empresaId
    });

  } catch (error) {
    console.error('Erro ao conectar:', error);
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
  
  res.json({
    connected: session.isReady,
    message: session.isReady ? 'Conectado' : 'Não conectado',
    user_data: session.isReady ? { phone: session.currentNumber } : null,
    empresaId
  });
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

    if (!session.isReady) {
      return res.status(401).json({
        error: 'NOT_CONNECTED',
        message: `WhatsApp não está conectado para empresa ${empresaId}`
      });
    }

    // Limpar e formatar número
    let cleanNumber = phone_number.replace(/\D/g, '');
    
    // Se não tem código do país, adicionar 55 (Brasil)
    if (cleanNumber.length === 11 || cleanNumber.length === 10) {
      cleanNumber = '55' + cleanNumber;
    }
    
    console.log(`📤 Enviando mensagem para ${cleanNumber} via empresa ${empresaId}...`);
    
    // Verificar cache (válido por 1 hora)
    const cached = numberCache.get(cleanNumber);
    const cacheValid = cached && (Date.now() - cached.timestamp < 3600000);
    
    let numberId;
    if (cacheValid) {
      console.log(`⚡ Usando cache para ${cleanNumber}`);
      numberId = cached.numberId;
    } else {
      // Obter ID do número (necessário para WhatsApp Web)
      numberId = await session.client.getNumberId(cleanNumber);
      
      if (!numberId || !numberId._serialized) {
        console.error(`❌ Número ${cleanNumber} não está no WhatsApp`);
        return res.status(400).json({
          error: 'INVALID_NUMBER',
          message: 'Número não está registrado no WhatsApp'
        });
      }
      
      // Salvar no cache
      numberCache.set(cleanNumber, {
        numberId: numberId._serialized,
        timestamp: Date.now()
      });
      console.log(`💾 Número ${cleanNumber} salvo no cache`);
    }
    
    // Enviar mensagem usando o ID verificado
    await session.client.sendMessage(numberId._serialized || numberId, message);

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
    
    if (session.client) {
      await session.client.logout();
      await session.client.destroy();
      session.client = null;
      session.isReady = false;
      session.qrCodeData = null;
      session.currentNumber = null;
      session.initializing = false;
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

// Verificar se tem sessão salva
app.get('/api/whatsapp/has-session', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const { empresaId } = req.query;
  
  if (!empresaId) {
    return res.status(400).json({
      error: 'empresaId é obrigatório'
    });
  }
  
  const sessionPath = path.join(__dirname, 'whatsapp_sessions', `empresa-${empresaId}`);
  const hasSession = fs.existsSync(sessionPath);
  
  const session = getSession(empresaId);
  
  res.json({
    hasSession,
    isReady: session.isReady,
    currentNumber: session.currentNumber,
    empresaId
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  WhatsApp Backend - Multi-Tenant                        ║
║  Servidor rodando em:                                    ║
║    - http://localhost:${PORT}                            ║
║    - http://192.168.18.203:${PORT}                       ║
║  Headless Mode: ATIVADO                                  ║
║  Isolamento por empresa: ATIVADO                         ║
╚══════════════════════════════════════════════════════════╝
  `);
});
