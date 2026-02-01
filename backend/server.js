const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const vehiclesRouter = require('./routes/vehicles');
const obdRouter = require('./routes/obd');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// CORS restrito
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Permitir requests sem origin (mobile apps, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origin não permitida pelo CORS'));
        }
    },
    credentials: true
}));

// Body parsing com limite
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting geral
app.use(generalLimiter);

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Backend API is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/obd', obdRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Endpoint not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('[ERROR]', err);
    
    // Não expor detalhes em produção
    const isDev = process.env.NODE_ENV !== 'production';
    
    res.status(err.status || 500).json({ 
        success: false, 
        error: isDev ? err.message : 'Erro interno do servidor'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Backend API Server Started');
    console.log('='.repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🚗 Vehicle API: http://localhost:${PORT}/api/vehicles`);
    console.log(`🔧 OBD-II API: http://localhost:${PORT}/api/obd`);
    console.log('='.repeat(50));
});

module.exports = app;
