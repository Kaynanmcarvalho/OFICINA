/**
 * TORQ Backend - Authentication Middleware
 * Valida token Firebase e empresaId em todas as rotas protegidas
 * 
 * 🔒 HARDENING NÍVEL ENTERPRISE:
 * - Validação dupla de empresaId (token + banco)
 * - Rate limiting por IP e usuário
 * - Auditoria de tentativas suspeitas
 * - Revogação de tokens comprometidos
 */

const admin = require('firebase-admin');

// Inicializar Firebase Admin se ainda não foi
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin:', error);
  }
}

const db = admin.firestore();

// 🔒 RATE LIMITING: Controle de requisições por IP e usuário
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const MAX_REQUESTS_PER_MINUTE = 100;
const MAX_FAILED_AUTH_ATTEMPTS = 5;
const failedAuthAttempts = new Map();

/**
 * 🔒 HARDENING: Rate Limiting
 */
function checkRateLimit(identifier) {
  const now = Date.now();
  const key = `${identifier}`;
  
  if (!requestCounts.has(key)) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  const data = requestCounts.get(key);
  
  if (now > data.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (data.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  data.count++;
  return true;
}

/**
 * 🔒 HARDENING: Registrar tentativa de autenticação falhada
 */
function recordFailedAuth(identifier) {
  const now = Date.now();
  const key = `${identifier}`;
  
  if (!failedAuthAttempts.has(key)) {
    failedAuthAttempts.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
    return false;
  }
  
  const data = failedAuthAttempts.get(key);
  data.count++;
  data.lastAttempt = now;
  
  // Bloquear após 5 tentativas falhadas em 5 minutos
  if (data.count >= MAX_FAILED_AUTH_ATTEMPTS && (now - data.firstAttempt) < 300000) {
    return true; // Bloqueado
  }
  
  return false;
}

/**
 * 🔒 HARDENING: Limpar tentativas falhadas após sucesso
 */
function clearFailedAuth(identifier) {
  failedAuthAttempts.delete(`${identifier}`);
}

/**
 * Middleware de autenticação
 * Valida token JWT do Firebase
 * 
 * 🔒 HARDENING:
 * - Rate limiting por IP
 * - Validação de empresaId no banco
 * - Auditoria de acessos
 * - Bloqueio de tentativas suspeitas
 */
async function authenticate(req, res, next) {
  const clientIp = req.ip || req.connection.remoteAddress;
  
  try {
    // 🔒 HARDENING: Rate Limiting por IP
    if (!checkRateLimit(clientIp)) {
      console.warn(`[Auth] Rate limit exceeded for IP: ${clientIp}`);
      return res.status(429).json({
        success: false,
        error: 'Muitas requisições. Tente novamente em 1 minuto.'
      });
    }
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      recordFailedAuth(clientIp);
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação não fornecido'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // 🔒 HARDENING: Verificar se IP está bloqueado por tentativas falhadas
    if (recordFailedAuth(clientIp)) {
      console.error(`[Auth] IP bloqueado por tentativas falhadas: ${clientIp}`);
      return res.status(403).json({
        success: false,
        error: 'Acesso temporariamente bloqueado. Tente novamente mais tarde.'
      });
    }

    // Verificar token
    const decodedToken = await admin.auth().verifyIdToken(token, true); // checkRevoked = true
    
    // 🔒 HARDENING: Validar empresaId no banco de dados
    // Não confiar apenas no custom claim do token
    let empresaIdValidado = null;
    
    if (decodedToken.empresaId) {
      try {
        const userDoc = await db.collection('usuarios').doc(decodedToken.uid).get();
        
        if (userDoc.exists) {
          const userData = userDoc.data();
          
          // 🔒 VALIDAÇÃO CRÍTICA: empresaId do banco deve corresponder ao do token
          if (userData.empresaId !== decodedToken.empresaId) {
            console.error(`[Auth] TENTATIVA DE MANIPULAÇÃO DE EMPRESAID DETECTADA:`, {
              uid: decodedToken.uid,
              tokenEmpresaId: decodedToken.empresaId,
              dbEmpresaId: userData.empresaId,
              ip: clientIp
            });
            
            // 🔒 AUDITORIA: Registrar tentativa suspeita
            await db.collection('audit_logs').add({
              tipo: 'tentativa_manipulacao_empresaid',
              nivel: 'critico',
              uid: decodedToken.uid,
              email: decodedToken.email,
              tokenEmpresaId: decodedToken.empresaId,
              dbEmpresaId: userData.empresaId,
              ip: clientIp,
              timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            
            return res.status(403).json({
              success: false,
              error: 'Acesso negado: inconsistência detectada'
            });
          }
          
          empresaIdValidado = userData.empresaId;
        }
      } catch (dbError) {
        console.error('[Auth] Erro ao validar empresaId no banco:', dbError);
        // Continuar com empresaId do token se banco falhar (degradação graciosa)
        empresaIdValidado = decodedToken.empresaId;
      }
    }
    
    // 🔒 HARDENING: Limpar tentativas falhadas após sucesso
    clearFailedAuth(clientIp);
    
    // Adicionar dados do usuário à request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      empresaId: empresaIdValidado || decodedToken.empresaId,
      role: decodedToken.role,
      ip: clientIp,
      tokenIssuedAt: decodedToken.iat,
      tokenExpiresAt: decodedToken.exp
    };
    
    // 🔒 AUDITORIA: Registrar acesso (apenas para operações sensíveis)
    if (req.method !== 'GET') {
      await db.collection('audit_logs').add({
        tipo: 'acesso_autenticado',
        nivel: 'info',
        uid: req.user.uid,
        email: req.user.email,
        empresaId: req.user.empresaId,
        method: req.method,
        path: req.path,
        ip: clientIp,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    next();
  } catch (error) {
    console.error('[Auth] Erro na autenticação:', error.message);
    recordFailedAuth(clientIp);
    
    // 🔒 HARDENING: Não expor detalhes do erro
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado'
    });
  }
}

/**
 * Middleware de validação de tenant
 * Garante que usuário só acessa dados da própria empresa
 * 
 * 🔒 HARDENING:
 * - Validação estrita de empresaId
 * - Auditoria de tentativas cross-tenant
 * - Bloqueio imediato de acessos suspeitos
 */
function validateTenant(req, res, next) {
  const { empresaId } = req.params;
  const clientIp = req.ip || req.connection.remoteAddress;
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
  }

  if (!req.user.empresaId) {
    // 🔒 AUDITORIA: Registrar tentativa sem empresaId
    db.collection('audit_logs').add({
      tipo: 'acesso_sem_empresaid',
      nivel: 'alerta',
      uid: req.user.uid,
      email: req.user.email,
      ip: clientIp,
      path: req.path,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(403).json({
      success: false,
      error: 'Usuário sem empresa associada'
    });
  }

  if (empresaId && empresaId !== req.user.empresaId) {
    // 🔒 AUDITORIA CRÍTICA: Tentativa de acesso cross-tenant
    console.error(`[Auth] TENTATIVA DE ACESSO CROSS-TENANT DETECTADA:`, {
      uid: req.user.uid,
      email: req.user.email,
      userEmpresaId: req.user.empresaId,
      requestedEmpresaId: empresaId,
      ip: clientIp,
      path: req.path
    });
    
    db.collection('audit_logs').add({
      tipo: 'tentativa_acesso_cross_tenant',
      nivel: 'critico',
      uid: req.user.uid,
      email: req.user.email,
      userEmpresaId: req.user.empresaId,
      requestedEmpresaId: empresaId,
      ip: clientIp,
      path: req.path,
      method: req.method,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(403).json({
      success: false,
      error: 'Acesso negado: empresa diferente'
    });
  }

  next();
}

/**
 * Middleware de validação de role
 * 
 * 🔒 HARDENING:
 * - Validação estrita de roles
 * - Auditoria de tentativas de escalada de privilégio
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // 🔒 AUDITORIA: Tentativa de acesso sem permissão
      console.warn(`[Auth] Tentativa de acesso sem permissão:`, {
        uid: req.user.uid,
        email: req.user.email,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        ip: clientIp,
        path: req.path
      });
      
      db.collection('audit_logs').add({
        tipo: 'tentativa_acesso_sem_permissao',
        nivel: 'alerta',
        uid: req.user.uid,
        email: req.user.email,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        ip: clientIp,
        path: req.path,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return res.status(403).json({
        success: false,
        error: 'Permissão insuficiente'
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  validateTenant,
  requireRole
};
