/**
 * Firebase Admin SDK para Backend
 * Conexão com Firestore para base de dados compartilhada de veículos
 */

const admin = require('firebase-admin');
const path = require('path');

let db = null;
let isInitialized = false;

/**
 * Inicializa o Firebase Admin SDK
 */
function initializeFirebase() {
  if (isInitialized) return db;

  try {
    const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    db = admin.firestore();
    isInitialized = true;
    console.log('[FIREBASE] ✅ Conectado ao projeto:', serviceAccount.project_id);
    return db;
  } catch (error) {
    console.error('[FIREBASE] ❌ Erro ao inicializar:', error.message);
    return null;
  }
}

/**
 * Obtém referência do Firestore
 */
function getFirestore() {
  if (!db) {
    initializeFirebase();
  }
  return db;
}

/**
 * Verifica se Firebase está disponível
 */
function isFirebaseAvailable() {
  if (!db) initializeFirebase();
  return db !== null;
}

module.exports = {
  initializeFirebase,
  getFirestore,
  isFirebaseAvailable,
  admin
};
