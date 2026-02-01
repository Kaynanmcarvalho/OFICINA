/**
 * TORQ Server - Authentication Middleware
 * Valida token Firebase e empresaId
 */

const admin = require('firebase-admin');

/**
 * Middleware de autenticação
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação não fornecido'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      empresaId: decodedToken.empresaId,
      role: decodedToken.role
    };

    next();
  } catch (error) {
    console.error('[Auth] Erro:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado'
    });
  }
}

/**
 * Valida tenant
 */
function validateTenant(req, res, next) {
  const { empresaId } = req.params;
  
  if (!req.user?.empresaId) {
    return res.status(403).json({
      success: false,
      error: 'Usuário sem empresa associada'
    });
  }

  if (empresaId && empresaId !== req.user.empresaId) {
    return res.status(403).json({
      success: false,
      error: 'Acesso negado'
    });
  }

  next();
}

module.exports = { authenticate, validateTenant };
