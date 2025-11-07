/**
 * Backend WhatsApp Simples e Funcional
 * Usa whatsapp-web.js sem abrir navegador visível
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
    'http://127.0.0.1:5173',
    'http://192.168.18.203:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Estado global
let client = null;
let qrCodeData = null;
let isReady = false;
let currentNumber = null;

// Inicializar cliente WhatsApp
function initializeWhatsApp() {
  if (client) {
    console.log('✓ Cliente já existe');
    return;
  }

  console.log('📱 Inicializando WhatsApp...');

  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: './whatsapp_session'
    }),
    puppeteer: {
      headless: true, // SEM ABRIR NAVEGADOR!
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
  client.on('qr', async (qr) => {
    console.log('📱 QR Code gerado!');
    qrCodeData = await qrcode.toDataURL(qr);
  });

  // Autenticado
  client.on('authenticated', () => {
    console.log('✅ Autenticado!');
    qrCodeData = null;
  });

  // Carregando sessão
  client.on('loading_screen', (percent, message) => {
    console.log(`⏳ Carregando sessão: ${percent}% - ${message}`);
  });

  // Pronto para usar
  client.on('ready', () => {
    console.log('✅ WhatsApp pronto!');
    isReady = true;
    qrCodeData = null;
    
    // Obter número
    if (client.info && client.info.wid) {
      currentNumber = client.info.wid.user;
      console.log(`📱 Conectado como: +${currentNumber}`);
    }
  });

  // Desconectado
  client.on('disconnected', (reason) => {
    console.log('❌ Desconectado:', reason);
    isReady = false;
    qrCodeData = null;
    currentNumber = null;
    
    // Tentar reconectar após 5 segundos
    setTimeout(() => {
      console.log('🔄 Tentando reconectar...');
      client = null;
      initializeWhatsApp();
    }, 5000);
  });

  // Erro de autenticação
  client.on('auth_failure', (msg) => {
    console.error('❌ Falha na autenticação:', msg);
    qrCodeData = null;
  });

  // Inicializar
  client.initialize();
}

// Inicializar automaticamente ao startar o servidor
console.log('🚀 Iniciando WhatsApp automaticamente...');
initializeWhatsApp();

// Rotas da API

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'whatsapp-automation' });
});

// Conectar WhatsApp
app.post('/api/whatsapp/connect', async (req, res) => {
  try {
    // Se já está pronto, retornar status
    if (isReady) {
      return res.json({
        status: 'already_authenticated',
        user_data: { phone: currentNumber }
      });
    }

    // Se não tem cliente, inicializar
    if (!client) {
      initializeWhatsApp();
    }

    // Aguardar QR Code (máximo 30 segundos)
    let attempts = 0;
    while (!qrCodeData && !isReady && attempts < 60) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    if (isReady) {
      return res.json({
        status: 'already_authenticated',
        user_data: { phone: currentNumber }
      });
    }

    if (qrCodeData) {
      return res.json({
        status: 'waiting_qr',
        qr_code: qrCodeData
      });
    }

    res.status(408).json({
      error: 'Timeout aguardando QR Code'
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
  res.json({
    connected: isReady,
    message: isReady ? 'Conectado' : 'Não conectado',
    user_data: isReady ? { phone: currentNumber } : null
  });
});

// Enviar mensagem
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { phone_number, message } = req.body;

    if (!phone_number || !message) {
      return res.status(400).json({
        error: 'phone_number e message são obrigatórios'
      });
    }

    if (!isReady) {
      return res.status(401).json({
        error: 'NOT_CONNECTED',
        message: 'WhatsApp não está conectado'
      });
    }

    // Limpar e formatar número
    let cleanNumber = phone_number.replace(/\D/g, '');
    
    // Se não tem código do país, adicionar 55 (Brasil)
    if (cleanNumber.length === 11 || cleanNumber.length === 10) {
      cleanNumber = '55' + cleanNumber;
    }
    
    // Verificar se o número é válido
    const numberId = await client.getNumberId(cleanNumber);
    
    if (!numberId || !numberId._serialized) {
      return res.status(400).json({
        error: 'INVALID_NUMBER',
        message: 'Número não está registrado no WhatsApp'
      });
    }

    // Enviar mensagem usando o ID verificado
    await client.sendMessage(numberId._serialized, message);

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      error: error.message,
      message: 'Erro ao enviar mensagem'
    });
  }
});

// Desconectar
app.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    if (client) {
      await client.logout();
      await client.destroy();
      client = null;
      isReady = false;
      qrCodeData = null;
      currentNumber = null;
    }

    res.json({
      success: true,
      message: 'Desconectado com sucesso'
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
  
  const sessionPath = path.join(__dirname, 'whatsapp_session');
  const hasSession = fs.existsSync(sessionPath);
  
  res.json({
    hasSession,
    isReady,
    currentNumber
  });
});

// Iniciar servidor em todas as interfaces de rede
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  WhatsApp Backend - Simples e Funcional                 ║
║  Servidor rodando em:                                    ║
║    - http://localhost:${PORT}                            ║
║    - http://192.168.18.203:${PORT}                       ║
║  SEM ABRIR NAVEGADOR - Headless Mode                    ║
║  Restauração automática de sessão: ATIVADA              ║
║  Acessível na rede local: SIM                           ║
╚══════════════════════════════════════════════════════════╝
  `);
});
