/**
 * TORQ OBD-II API Routes
 * Endpoints para comunicação com scanner OBD-II
 * PROTEGIDO: Requer autenticação
 */

const express = require('express');
const router = express.Router();
const obdService = require('../services/obdService');
const { authenticate } = require('../middleware/auth');
const { obdLimiter } = require('../middleware/rateLimiter');

// Aplicar autenticação em todas as rotas
router.use(authenticate);

/**
 * GET /api/obd/status
 * Retorna status atual da conexão OBD
 */
router.get('/status', (req, res) => {
  try {
    const status = obdService.getStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/obd/ports
 * Lista portas seriais disponíveis
 */
router.get('/ports', async (req, res) => {
  try {
    const result = await obdService.listPorts();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/obd/connect
 * Conecta ao dispositivo OBD-II
 * 
 * Body:
 * - type: 'serial' | 'wifi' | 'bluetooth'
 * - port: string (para serial, ex: 'COM3' ou '/dev/ttyUSB0')
 * - host: string (para wifi, ex: '192.168.0.10')
 * - tcpPort: number (para wifi, padrão: 35000)
 */
router.post('/connect', async (req, res) => {
  try {
    const { type = 'serial', port, host, tcpPort } = req.body;

    console.log('[OBD API] Conectando...', { type, port, host });

    const result = await obdService.connect({ type, port, host, tcpPort });

    res.json({
      success: true,
      data: result,
      message: 'Conectado com sucesso',
    });
  } catch (error) {
    console.error('[OBD API] Erro ao conectar:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/obd/disconnect
 * Desconecta do dispositivo OBD-II
 */
router.post('/disconnect', async (req, res) => {
  try {
    await obdService.disconnect();
    res.json({
      success: true,
      message: 'Desconectado com sucesso',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/obd/scan/quick
 * Executa scan rápido (dados básicos + MIL)
 * PROTEGIDO: Rate limited
 */
router.get('/scan/quick', obdLimiter, async (req, res) => {
  try {
    console.log('[OBD API] Iniciando scan rápido...');

    // Configurar SSE para progresso em tempo real (opcional)
    if (req.headers.accept === 'text/event-stream') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const onStatus = (status) => {
        res.write(`data: ${JSON.stringify(status)}\n\n`);
      };

      obdService.on('status', onStatus);

      const result = await obdService.quickScan();

      obdService.off('status', onStatus);
      res.write(`data: ${JSON.stringify({ type: 'result', ...result })}\n\n`);
      res.end();
    } else {
      const result = await obdService.quickScan();
      res.json(result);
    }
  } catch (error) {
    console.error('[OBD API] Erro no scan rápido:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/obd/scan/full
 * Executa scan completo (DTCs + dados ao vivo + sensores)
 * PROTEGIDO: Rate limited
 */
router.get('/scan/full', obdLimiter, async (req, res) => {
  try {
    console.log('[OBD API] Iniciando scan completo...');

    // Configurar SSE para progresso em tempo real (opcional)
    if (req.headers.accept === 'text/event-stream') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const onStatus = (status) => {
        res.write(`data: ${JSON.stringify(status)}\n\n`);
      };

      obdService.on('status', onStatus);

      const result = await obdService.fullScan();

      obdService.off('status', onStatus);
      res.write(`data: ${JSON.stringify({ type: 'result', ...result })}\n\n`);
      res.end();
    } else {
      const result = await obdService.fullScan();
      res.json(result);
    }
  } catch (error) {
    console.error('[OBD API] Erro no scan completo:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/obd/command
 * Envia comando OBD-II personalizado (para debug/avançado)
 * 
 * Body:
 * - command: string (ex: '010C' para RPM)
 */
router.post('/command', async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({
        success: false,
        error: 'Comando não especificado',
      });
    }

    console.log('[OBD API] Enviando comando:', command);

    const response = await obdService.sendCommand(command);

    res.json({
      success: true,
      command,
      response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/obd/live/:pid
 * Lê um PID específico em tempo real
 */
router.get('/live/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const command = `01${pid.toUpperCase()}`;

    const response = await obdService.sendCommand(command);

    res.json({
      success: true,
      pid,
      rawResponse: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/obd/dtc
 * Limpa códigos de falha (CUIDADO!)
 */
router.delete('/dtc', async (req, res) => {
  try {
    console.log('[OBD API] Limpando códigos de falha...');

    // Mode 04 - Clear DTCs
    const response = await obdService.sendCommand('04');

    res.json({
      success: true,
      message: 'Códigos de falha limpos',
      response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
