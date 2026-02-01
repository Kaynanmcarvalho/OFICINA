/**
 * TORQ Backend - Rate Limiting Middleware
 * Protege contra DDoS e abuso de APIs
 */

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter geral (100 requests por 15 minutos)
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    success: false,
    error: 'Muitas requisições. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para consulta de placas (10 por minuto)
 */
const plateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10,
  message: {
    success: false,
    error: 'Limite de consultas de placas excedido. Aguarde 1 minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para OBD (5 scans por minuto)
 */
const obdLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,
  message: {
    success: false,
    error: 'Limite de scans OBD excedido. Aguarde 1 minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  plateLimiter,
  obdLimiter
};
