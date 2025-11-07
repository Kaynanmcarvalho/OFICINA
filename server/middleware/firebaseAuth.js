const admin = require('firebase-admin');

/**
 * Middleware para verificar token Firebase
 */
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'Authorization header deve conter Bearer token'
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verificar token com Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Anexar userId ao request
    req.userId = decodedToken.uid;
    req.user = decodedToken;

    next();

  } catch (error) {
    console.error('[Auth] Erro ao verificar token:', error);
    
    return res.status(403).json({
      error: 'Token inválido',
      message: error.message
    });
  }
};

module.exports = { verifyFirebaseToken };
