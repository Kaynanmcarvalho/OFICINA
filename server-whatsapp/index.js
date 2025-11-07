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
app.use(cors());
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

  // Pronto para usar
  client.on('ready', () => {
    console.log('✅ WhatsApp pronto!');
    isReady = true;
    
    // Obter número
    client.info.wid.user && (currentNumber = client.info.wid.user);
  });

  // Desconectado
  client.on('disconnected', (reason) => {
    console.log('❌ Desconectado:', reason);
    isReady = false;
    qrCodeData = null;
    currentNumber = null;
  });

  // Inicializar
  client.initialize();
}

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

    // Formatar número
    const formattedNumber = phone_number.replace(/\D/g, '') + '@c.us';

    // Enviar mensagem
    await client.sendMessage(formattedNumber, message);

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  WhatsApp Backend - Simples e Funcional                 ║
║  Servidor rodando em http://localhost:${PORT}            ║
║  SEM ABRIR NAVEGADOR - Headless Mode                    ║
╚══════════════════════════════════════════════════════════╝
  `);
});
