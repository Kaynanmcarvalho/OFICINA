/**
 * Servidor Simplificado - Apenas API de Compatibilidade de Peças
 * Não requer Firebase Admin SDK
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware - CORS liberado para desenvolvimento
app.use(cors({
  origin: true, // Aceita qualquer origem em desenvolvimento
  credentials: true
}));
app.use(express.json());

// Parts Compatibility Full Routes (base completa com cross-compatibility)
const partsCompatibilityFullRoutes = require('./routes/parts-compatibility-full.routes');
app.use('/api/parts-full', partsCompatibilityFullRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[Server] Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor simplificado rodando na porta ${PORT}`);
  console.log(`📦 API de Compatibilidade de Peças disponível em /api/parts-full`);
  console.log(`✅ Sistema pronto!`);
});

module.exports = app;
