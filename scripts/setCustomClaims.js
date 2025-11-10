/**
 * Script para Setar Custom Claims em Usuários Existentes
 * 
 * CRÍTICO: Sem custom claims, as Firestore Rules NÃO funcionam!
 * 
 * Uso:
 * node scripts/setCustomClaims.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Seta custom claims para todos os usuários
 */
async function setCustomClaimsForAllUsers() {
  console.log('🚀 Iniciando configuração de custom claims...\n');
  
  try {
    // Buscar todos os usuários do Firestore
    const usersSnapshot = await db.collection('usuarios').get();
    
    if (usersSnapshot.empty) {
      console.log('⚠️  Nenhum usuário encontrado no Firestore');
      return;
    }
    
    console.log(`📊 Encontrados ${usersSnapshot.size} usuários\n`);

    let updated = 0;
    let errors = 0;
    let skipped = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();

      // Validar dados necessários
      if (!userData.empresaId) {
        console.log(`⚠️  User ${userId}: Missing empresaId, skipping`);
        skipped++;
        continue;
      }

      if (!userData.role) {
        console.log(`⚠️  User ${userId}: Missing role, skipping`);
        skipped++;
        continue;
      }

      // Validar role
      const validRoles = ['admin', 'atendente', 'financeiro'];
      if (!validRoles.includes(userData.role)) {
        console.log(`⚠️  User ${userId}: Invalid role "${userData.role}", skipping`);
        skipped++;
        continue;
      }

      try {
        // Setar custom claims
        await admin.auth().setCustomUserClaims(userId, {
          empresaId: userData.empresaId,
          role: userData.role,
          updatedAt: Date.now()
        });

        console.log(`✅ User ${userId}: Claims set (empresaId: ${userData.empresaId}, role: ${userData.role})`);
        updated++;
      } catch (error) {
        console.error(`❌ User ${userId}: Error - ${error.message}`);
        errors++;
      }
    }

    // Resumo
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO');
    console.log('='.repeat(60));
    console.log(`✅ Atualizados: ${updated}`);
    console.log(`⚠️  Pulados: ${skipped}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📊 Total: ${usersSnapshot.size}`);
    console.log('='.repeat(60));

    if (updated > 0) {
      console.log('\n✅ Custom claims configurados com sucesso!');
      console.log('\n📝 Próximos passos:');
      console.log('  1. Usuários precisam fazer logout e login novamente');
      console.log('  2. Ou forçar refresh do token no frontend:');
      console.log('     await user.getIdToken(true);');
      console.log('  3. Testar isolamento de dados');
    }

  } catch (error) {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

/**
 * Verifica custom claims de um usuário específico
 */
async function checkUserClaims(userId) {
  try {
    const user = await admin.auth().getUser(userId);
    console.log(`\n👤 User: ${userId}`);
    console.log('📋 Custom Claims:', user.customClaims);
    
    if (!user.customClaims || !user.customClaims.empresaId) {
      console.log('⚠️  Custom claims não configurados!');
    } else {
      console.log('✅ Custom claims OK');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar usuário:', error.message);
  }
}

// Executar
const args = process.argv.slice(2);

if (args.length > 0 && args[0] === 'check') {
  // Modo de verificação
  const userId = args[1];
  if (!userId) {
    console.error('❌ Uso: node scripts/setCustomClaims.js check <userId>');
    process.exit(1);
  }
  checkUserClaims(userId);
} else {
  // Modo de atualização em massa
  setCustomClaimsForAllUsers();
}
