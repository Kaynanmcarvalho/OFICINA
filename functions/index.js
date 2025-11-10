/**
 * Cloud Functions para Sistema Multi-Tenant Torq
 * 
 * CRÍTICO: Estas functions setam custom claims no JWT do Firebase Auth
 * Sem elas, as Firestore Rules NÃO funcionam!
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Seta custom claims manualmente (chamada via HTTPS)
 * 
 * Uso:
 * const setUserClaims = httpsCallable(functions, 'setUserClaims');
 * await setUserClaims({ uid: 'user-123', empresaId: 'empresa-abc', role: 'admin' });
 */
exports.setUserClaims = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuário não autenticado'
    );
  }

  const { uid, empresaId, role } = data;

  // Validar dados
  if (!uid || !empresaId || !role) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'uid, empresaId e role são obrigatórios'
    );
  }

  // Validar role
  const validRoles = ['admin', 'atendente', 'financeiro'];
  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Role inválida. Deve ser: ${validRoles.join(', ')}`
    );
  }

  // Validar formato de empresaId
  if (!/^[a-zA-Z0-9_-]+$/.test(empresaId)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'empresaId contém caracteres inválidos'
    );
  }

  try {
    // Setar custom claims
    await admin.auth().setCustomUserClaims(uid, {
      empresaId,
      role,
      updatedAt: Date.now()
    });

    console.log(`✅ Custom claims set for user ${uid}:`, { empresaId, role });

    return {
      success: true,
      message: 'Custom claims atualizados com sucesso',
      claims: { empresaId, role }
    };
  } catch (error) {
    console.error('❌ Error setting custom claims:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Erro ao atualizar custom claims: ${error.message}`
    );
  }
});

/**
 * Atualiza custom claims quando usuário é criado
 * Trigger: onCreate em /usuarios/{userId}
 */
exports.onUserCreate = functions.firestore
  .document('usuarios/{userId}')
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;
    const userData = snap.data();

    console.log(`📝 New user created: ${userId}`);

    if (!userData.empresaId || !userData.role) {
      console.warn(`⚠️ User ${userId} missing empresaId or role, skipping claims`);
      return null;
    }

    try {
      await admin.auth().setCustomUserClaims(userId, {
        empresaId: userData.empresaId,
        role: userData.role,
        updatedAt: Date.now()
      });

      console.log(`✅ Custom claims set for new user ${userId}`);
      return null;
    } catch (error) {
      console.error(`❌ Error setting custom claims for new user ${userId}:`, error);
      return null;
    }
  });

/**
 * Atualiza custom claims quando usuário é modificado
 * Trigger: onUpdate em /usuarios/{userId}
 */
exports.onUserUpdate = functions.firestore
  .document('usuarios/{userId}')
  .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const newData = change.after.data();
    const oldData = change.before.data();

    // Verificar se empresaId ou role mudaram
    if (
      newData.empresaId === oldData.empresaId &&
      newData.role === oldData.role
    ) {
      console.log(`ℹ️ User ${userId} updated but claims unchanged, skipping`);
      return null;
    }

    console.log(`📝 User ${userId} claims changed:`, {
      old: { empresaId: oldData.empresaId, role: oldData.role },
      new: { empresaId: newData.empresaId, role: newData.role }
    });

    try {
      await admin.auth().setCustomUserClaims(userId, {
        empresaId: newData.empresaId,
        role: newData.role,
        updatedAt: Date.now()
      });

      console.log(`✅ Custom claims updated for user ${userId}`);
      return null;
    } catch (error) {
      console.error(`❌ Error updating custom claims for user ${userId}:`, error);
      return null;
    }
  });

/**
 * Função de health check
 */
exports.healthCheck = functions.https.onRequest((req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    functions: [
      'setUserClaims',
      'onUserCreate',
      'onUserUpdate',
      'healthCheck'
    ]
  });
});
