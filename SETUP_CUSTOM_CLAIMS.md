# 🔐 Setup Custom Claims - Firebase Auth

## ⚠️ CRÍTICO - OBRIGATÓRIO PARA PRODUÇÃO

As Firestore Rules dependem de custom claims no JWT para funcionar corretamente.
Sem isso, **TODAS as operações serão negadas**.

---

## 📋 O Que São Custom Claims?

Custom claims são dados adicionais armazenados no token JWT do Firebase Auth.
Permitem que as Firestore Rules acessem `empresaId` e `role` sem fazer leituras extras.

**Antes (LENTO - 2+ leituras):**
```javascript
function getUserEmpresaId() {
  return get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.empresaId;
}
```

**Depois (RÁPIDO - 0 leituras):**
```javascript
function getUserEmpresaId() {
  return request.auth.token.empresaId; // Já está no JWT!
}
```

---

## 🚀 Implementação

### Opção 1: Cloud Function (Recomendado)

Crie uma Cloud Function que seta os custom claims após login:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Seta custom claims após login
 * Triggered por onCreate de usuário ou manualmente
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
      'Role inválida'
    );
  }

  try {
    // Setar custom claims
    await admin.auth().setCustomUserClaims(uid, {
      empresaId,
      role,
      updatedAt: Date.now()
    });

    console.log(`Custom claims set for user ${uid}:`, { empresaId, role });

    return {
      success: true,
      message: 'Custom claims atualizados com sucesso'
    };
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Erro ao atualizar custom claims'
    );
  }
});

/**
 * Atualiza custom claims quando usuário é modificado
 */
exports.onUserUpdate = functions.firestore
  .document('usuarios/{userId}')
  .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const newData = change.after.data();
    const oldData = change.before.data();

    // Verificar se empresaId ou role mudaram
    if (
      newData.empresaId !== oldData.empresaId ||
      newData.role !== oldData.role
    ) {
      try {
        await admin.auth().setCustomUserClaims(userId, {
          empresaId: newData.empresaId,
          role: newData.role,
          updatedAt: Date.now()
        });

        console.log(`Custom claims updated for user ${userId}`);
      } catch (error) {
        console.error('Error updating custom claims:', error);
      }
    }
  });

/**
 * Seta custom claims quando novo usuário é criado
 */
exports.onUserCreate = functions.firestore
  .document('usuarios/{userId}')
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;
    const userData = snap.data();

    if (userData.empresaId && userData.role) {
      try {
        await admin.auth().setCustomUserClaims(userId, {
          empresaId: userData.empresaId,
          role: userData.role,
          updatedAt: Date.now()
        });

        console.log(`Custom claims set for new user ${userId}`);
      } catch (error) {
        console.error('Error setting custom claims for new user:', error);
      }
    }
  });
```

### Opção 2: Admin SDK (Para Migração)

Script para setar claims em usuários existentes:

```javascript
// scripts/setCustomClaims.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setCustomClaimsForAllUsers() {
  try {
    // Buscar todos os usuários
    const usersSnapshot = await db.collection('usuarios').get();
    
    console.log(`Found ${usersSnapshot.size} users`);

    let updated = 0;
    let errors = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();

      if (!userData.empresaId || !userData.role) {
        console.warn(`User ${userId} missing empresaId or role, skipping`);
        continue;
      }

      try {
        await admin.auth().setCustomUserClaims(userId, {
          empresaId: userData.empresaId,
          role: userData.role,
          updatedAt: Date.now()
        });

        console.log(`✅ Updated claims for user ${userId}`);
        updated++;
      } catch (error) {
        console.error(`❌ Error updating user ${userId}:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ Updated: ${updated}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total: ${usersSnapshot.size}`);

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    process.exit(0);
  }
}

setCustomClaimsForAllUsers();
```

**Executar:**
```bash
node scripts/setCustomClaims.js
```

---

## 🔄 Atualizar Claims no Frontend

Após setar claims no backend, o frontend precisa forçar refresh do token:

```javascript
// src/services/authService.js
import { getAuth } from 'firebase/auth';

export const refreshUserToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    // Forçar refresh do token para obter novos claims
    await user.getIdToken(true);
    
    // Obter token atualizado
    const idTokenResult = await user.getIdTokenResult();
    
    console.log('Custom claims:', idTokenResult.claims);
    
    return idTokenResult.claims;
  }

  return null;
};
```

**Chamar após login:**
```javascript
// Após login bem-sucedido
const userCredential = await signInWithEmailAndPassword(auth, email, password);

// Aguardar 1 segundo para claims serem setados
await new Promise(resolve => setTimeout(resolve, 1000));

// Refresh token
const claims = await refreshUserToken();

if (!claims.empresaId || !claims.role) {
  console.error('Custom claims não encontrados!');
  // Chamar Cloud Function manualmente
  await setUserClaims({ uid: userCredential.user.uid });
  await refreshUserToken();
}
```

---

## 🧪 Testar Custom Claims

### 1. Verificar Claims no Console

```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;

if (user) {
  const idTokenResult = await user.getIdTokenResult();
  console.log('Custom claims:', idTokenResult.claims);
  
  // Deve mostrar:
  // {
  //   empresaId: "empresa-123",
  //   role: "admin",
  //   updatedAt: 1234567890,
  //   ...
  // }
}
```

### 2. Testar Firestore Rules

```javascript
// Tentar ler dados da própria empresa
const empresaId = idTokenResult.claims.empresaId;
const clientesRef = collection(db, `empresas/${empresaId}/clientes`);
const snapshot = await getDocs(clientesRef);

console.log('✅ Leitura permitida:', snapshot.size, 'documentos');

// Tentar ler dados de outra empresa
const outraEmpresaId = 'empresa-diferente';
const outrosClientesRef = collection(db, `empresas/${outraEmpresaId}/clientes`);

try {
  await getDocs(outrosClientesRef);
  console.log('❌ FALHA: Conseguiu ler dados de outra empresa!');
} catch (error) {
  console.log('✅ Bloqueado corretamente:', error.code);
}
```

---

## 📦 Deploy

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2. Inicializar Functions

```bash
firebase init functions
# Escolher JavaScript ou TypeScript
# Instalar dependências
```

### 3. Deploy

```bash
# Deploy apenas functions
firebase deploy --only functions

# Deploy tudo (functions + rules + indexes)
firebase deploy
```

---

## ⚠️ IMPORTANTE

### Limitações dos Custom Claims

1. **Tamanho máximo**: 1000 bytes
2. **Propagação**: Pode levar até 1 hora para propagar
3. **Refresh necessário**: Frontend precisa forçar refresh do token
4. **Não são reativas**: Mudanças não atualizam automaticamente

### Solução para Propagação Lenta

```javascript
// Forçar refresh imediatamente após setar claims
await admin.auth().setCustomUserClaims(uid, claims);

// No frontend, forçar refresh
await user.getIdToken(true);
```

---

## 🐛 Troubleshooting

### Problema: "permission-denied" mesmo com claims

**Causa**: Token não foi atualizado

**Solução**:
```javascript
// Forçar logout e login novamente
await signOut(auth);
await signInWithEmailAndPassword(auth, email, password);
```

### Problema: Claims não aparecem no token

**Causa**: Cloud Function não foi executada

**Solução**:
```javascript
// Chamar manualmente
const setUserClaims = httpsCallable(functions, 'setUserClaims');
await setUserClaims({
  uid: user.uid,
  empresaId: 'empresa-123',
  role: 'admin'
});

// Refresh token
await user.getIdToken(true);
```

### Problema: Claims desatualizados

**Causa**: Cache do token (válido por 1 hora)

**Solução**:
```javascript
// Forçar refresh a cada operação crítica
await user.getIdToken(true);
```

---

## ✅ Checklist de Implementação

- [ ] Cloud Functions criadas e deployadas
- [ ] Script de migração executado para usuários existentes
- [ ] Frontend atualizado para refresh de token
- [ ] Testes de isolamento executados
- [ ] Firestore Rules atualizadas para usar claims
- [ ] Monitoring configurado para erros de permissão
- [ ] Documentação atualizada
- [ ] Equipe treinada

---

## 📚 Referências

- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions)

---

**Status**: 🔴 CRÍTICO - Implementar antes de produção
**Prioridade**: P0
**Estimativa**: 2-4 horas
