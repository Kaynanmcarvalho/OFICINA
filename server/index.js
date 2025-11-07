require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const admin = require('firebase-admin');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());

// Disponibilizar Socket.IO para as rotas
app.set('io', io);

// WhatsApp Service
const whatsappService = require('./services/whatsappMultiSessionService');

// Routes
const whatsappRoutes = require('./routes/whatsapp.routes');
app.use('/api/whatsapp', whatsappRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO - Autenticação e conexão
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Cliente conectado: ${socket.id}`);

  // Autenticar usuário via token Firebase
  socket.on('authenticate', async (token) => {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;
      
      // Adicionar socket à sala do usuário
      socket.join(userId);
      socket.userId = userId;
      
      console.log(`[Socket.IO] Usuário autenticado: ${userId}`);
      socket.emit('authenticated', { userId });

    } catch (error) {
      console.error('[Socket.IO] Erro na autenticação:', error);
      socket.emit('auth-error', { message: 'Token inválido' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Cliente desconectado: ${socket.id}`);
  });
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
server.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Socket.IO habilitado`);
  console.log(`🔥 Firebase Admin inicializado`);
  
  // Restaurar sessões do WhatsApp
  console.log('📱 Restaurando sessões do WhatsApp...');
  await whatsappService.restoreAllSessions(io);
  console.log('✅ Sistema pronto!');
});

module.exports = { app, server, io };
