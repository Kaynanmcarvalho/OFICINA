/**
 * Rotas da API WhatsApp
 * Gerencia endpoints para conexão, envio de mensagens e status
 */

const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappMultiSessionService');

/**
 * POST /api/whatsapp/:empresaId/start
 * Inicia ou restaura uma sessão do WhatsApp para uma empresa
 */
router.post('/:empresaId/start', async (req, res) => {
  try {
    const { empresaId } = req.params;
    
    console.log(`[API] Iniciando sessão WhatsApp para empresa: ${empresaId}`);
    
    // Obter instância do Socket.IO
    const io = req.app.get('io');
    
    // Inicializar sessão
    const result = await whatsappService.initializeSession(empresaId, io);
    
    // Se já está conectado, retornar status
    if (result.status === 'connected') {
      return res.json({
        success: true,
        status: 'connected',
        message: 'WhatsApp já está conectado',
        phoneNumber: result.phoneNumber
      });
    }
    
    // Se está inicializando, aguardar QR code
    if (result.status === 'initializing') {
      // Aguardar até 30 segundos pelo QR code
      let attempts = 0;
      const maxAttempts = 60; // 30 segundos (500ms * 60)
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const status = whatsappService.getSessionStatus(empresaId);
        
        if (status.status === 'qr_ready' && status.qr) {
          return res.json({
            success: true,
            status: 'qr_ready',
            qr: status.qr,
            message: 'QR Code gerado. Escaneie com seu WhatsApp.'
          });
        }
        
        if (status.status === 'connected') {
          return res.json({
            success: true,
            status: 'connected',
            message: 'WhatsApp conectado com sucesso',
            phoneNumber: status.phoneNumber
          });
        }
        
        if (status.status === 'auth_failure') {
          return res.status(400).json({
            success: false,
            status: 'auth_failure',
            message: 'Falha na autenticação'
          });
        }
        
        attempts++;
      }
      
      // Timeout
      return res.status(408).json({
        success: false,
        status: 'timeout',
        message: 'Timeout aguardando QR code'
      });
    }
    
    res.json(result);
    
  } catch (error) {
    console.error('[API] Erro ao iniciar sessão:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/whatsapp/:empresaId/status
 * Retorna o status atual da sessão
 */
router.get('/:empresaId/status', async (req, res) => {
  try {
    const { empresaId } = req.params;
    
    const status = whatsappService.getSessionStatus(empresaId);
    
    res.json({
      success: true,
      ...status
    });
    
  } catch (error) {
    console.error('[API] Erro ao obter status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/whatsapp/:empresaId/send
 * Envia uma mensagem via WhatsApp
 * Body: { phoneNumber, message }
 */
router.post('/:empresaId/send', async (req, res) => {
  try {
    const { empresaId } = req.params;
    const { phoneNumber, message } = req.body;
    
    // Validações
    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'phoneNumber e message são obrigatórios'
      });
    }
    
    console.log(`[API] Enviando mensagem para ${phoneNumber} via empresa ${empresaId}`);
    
    // Enviar mensagem
    const result = await whatsappService.sendMessage(empresaId, phoneNumber, message);
    
    res.json({
      success: true,
      ...result,
      message: 'Mensagem enviada com sucesso'
    });
    
  } catch (error) {
    console.error('[API] Erro ao enviar mensagem:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/whatsapp/:empresaId/logout
 * Faz logout da sessão (remove autenticação)
 */
router.post('/:empresaId/logout', async (req, res) => {
  try {
    const { empresaId } = req.params;
    
    console.log(`[API] Logout da sessão para empresa: ${empresaId}`);
    
    await whatsappService.logoutSession(empresaId);
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
    
  } catch (error) {
    console.error('[API] Erro ao fazer logout:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/whatsapp/:empresaId/destroy
 * Destrói a sessão (sem fazer logout)
 */
router.post('/:empresaId/destroy', async (req, res) => {
  try {
    const { empresaId } = req.params;
    
    console.log(`[API] Destruindo sessão para empresa: ${empresaId}`);
    
    await whatsappService.destroySession(empresaId);
    
    res.json({
      success: true,
      message: 'Sessão destruída com sucesso'
    });
    
  } catch (error) {
    console.error('[API] Erro ao destruir sessão:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/whatsapp/sessions
 * Lista todas as sessões ativas
 */
router.get('/sessions', async (req, res) => {
  try {
    const sessions = whatsappService.getAllSessions();
    
    res.json({
      success: true,
      count: sessions.length,
      sessions
    });
    
  } catch (error) {
    console.error('[API] Erro ao listar sessões:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
