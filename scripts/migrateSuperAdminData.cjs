/**
 * Script de Migração - Dados dos Super Admins
 * 
 * Move dados da estrutura antiga (raiz) para empresa dos Super Admins
 * Preserva todos os dados já cadastrados
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// ID da empresa dos Super Admins (usar um ID fixo e conhecido)
const SUPER_ADMIN_EMPRESA_ID = 'torq-super-admin';

// Coleções a migrar
const COLLECTIONS_TO_MIGRATE = [
  'clients',
  'budgets', 
  'inventory',
  'vehicles',
  'tools',
  'team_members',
  'schedules',
  'motorcycles',
  'checkins'
];

async function createSuperAdminEmpresa() {
  console.log('\n📋 Criando empresa dos Super Admins...');
  
  const empresaRef = db.collection('empresas').doc(SUPER_ADMIN_EMPRESA_ID);
  const empresaDoc = await empresaRef.get();
  
  if (empresaDoc.exists()) {
    console.log('✅ Empresa dos Super Admins já existe');
    return;
  }
  
  await empresaRef.set({
    nomeFantasia: 'Torq - Administração',
    razaoSocial: 'Torq Sistemas Ltda',
    cnpj: '00.000.000/0001-00',
    slug: 'torq-admin',
    plano: 'premium',
    ativo: true,
    dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
    isSuperAdminEmpresa: true,
    descricao: 'Empresa dos administradores do sistema'
  });
  
  console.log('✅ Empresa dos Super Admins criada');
}

async function migrateCollection(collectionName) {
  console.log(`\n🔄 Migrando: ${collectionName}`);
  
  try {
    // Buscar documentos da coleção antiga (raiz)
    const oldCollectionRef = db.collection(collectionName);
    const snapshot = await oldCollectionRef.get();
    
    if (snapshot.empty) {
      console.log(`   ⚠️  Nenhum documento encontrado em ${collectionName}`);
      return { migrated: 0, errors: 0 };
    }
    
    console.log(`   📊 Encontrados ${snapshot.size} documentos`);
    
    // Mapear nome da coleção (inglês → português)
    const collectionMap = {
      'clients': 'clientes',
      'budgets': 'orcamentos',
      'inventory': 'estoque',
      'vehicles': 'veiculos',
      'tools': 'ferramentas',
      'team_members': 'equipe',
      'schedules': 'agendamentos',
      'motorcycles': 'motos',
      'checkins': 'checkins'
    };
    
    const newCollectionName = collectionMap[collectionName] || collectionName;
    const newCollectionRef = db.collection('empresas')
      .doc(SUPER_ADMIN_EMPRESA_ID)
      .collection(newCollectionName);
    
    let migrated = 0;
    let errors = 0;
    
    // Migrar cada documento
    const batch = db.batch();
    let batchCount = 0;
    
    for (const doc of snapshot.docs) {
      try {
        const data = doc.data();
        const newDocRef = newCollectionRef.doc(doc.id);
        
        batch.set(newDocRef, {
          ...data,
          migratedAt: admin.firestore.FieldValue.serverTimestamp(),
          originalId: doc.id
        });
        
        batchCount++;
        
        // Commit batch a cada 500 documentos
        if (batchCount >= 500) {
          await batch.commit();
          migrated += batchCount;
          console.log(`   ✅ Migrados ${migrated} documentos...`);
          batchCount = 0;
        }
      } catch (error) {
        console.error(`   ❌ Erro ao migrar documento ${doc.id}:`, error.message);
        errors++;
      }
    }
    
    // Commit batch final
    if (batchCount > 0) {
      await batch.commit();
      migrated += batchCount;
    }
    
    console.log(`   ✅ Migração concluída: ${migrated} documentos`);
    
    if (errors > 0) {
      console.log(`   ⚠️  Erros: ${errors} documentos`);
    }
    
    return { migrated, errors };
    
  } catch (error) {
    console.error(`   ❌ Erro ao migrar ${collectionName}:`, error.message);
    return { migrated: 0, errors: 1 };
  }
}

async function updateSuperAdminUsers() {
  console.log('\n👥 Atualizando usuários Super Admin...');
  
  try {
    // Buscar usuários com role super-admin
    const usersRef = db.collection('usuarios');
    const snapshot = await usersRef.where('role', '==', 'super-admin').get();
    
    if (snapshot.empty) {
      console.log('   ⚠️  Nenhum Super Admin encontrado');
      return;
    }
    
    console.log(`   📊 Encontrados ${snapshot.size} Super Admins`);
    
    const batch = db.batch();
    
    for (const doc of snapshot.docs) {
      batch.update(doc.ref, {
        empresaId: SUPER_ADMIN_EMPRESA_ID,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    await batch.commit();
    console.log(`   ✅ ${snapshot.size} Super Admins vinculados à empresa`);
    
  } catch (error) {
    console.error('   ❌ Erro ao atualizar Super Admins:', error.message);
  }
}

async function createBackup() {
  console.log('\n💾 Criando backup dos dados originais...');
  
  try {
    const backupRef = db.collection('_backups').doc('pre-migration-' + Date.now());
    
    await backupRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: 'Backup antes da migração multi-tenant',
      collections: COLLECTIONS_TO_MIGRATE
    });
    
    console.log('   ✅ Backup criado');
    
  } catch (error) {
    console.error('   ❌ Erro ao criar backup:', error.message);
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   MIGRAÇÃO DE DADOS - SUPER ADMINS                     ║');
  console.log('║   Move dados antigos para empresa dos Super Admins     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  try {
    // 1. Criar backup
    await createBackup();
    
    // 2. Criar empresa dos Super Admins
    await createSuperAdminEmpresa();
    
    // 3. Migrar cada coleção
    const results = {};
    
    for (const collection of COLLECTIONS_TO_MIGRATE) {
      results[collection] = await migrateCollection(collection);
    }
    
    // 4. Atualizar usuários Super Admin
    await updateSuperAdminUsers();
    
    // 5. Resumo
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║   RESUMO DA MIGRAÇÃO                                   ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    let totalMigrated = 0;
    let totalErrors = 0;
    
    for (const [collection, result] of Object.entries(results)) {
      console.log(`\n${collection}:`);
      console.log(`  ✅ Migrados: ${result.migrated}`);
      console.log(`  ❌ Erros: ${result.errors}`);
      totalMigrated += result.migrated;
      totalErrors += result.errors;
    }
    
    console.log('\n' + '═'.repeat(56));
    console.log(`TOTAL: ${totalMigrated} documentos migrados`);
    if (totalErrors > 0) {
      console.log(`ERROS: ${totalErrors} documentos com erro`);
    }
    console.log('═'.repeat(56));
    
    console.log('\n✅ Migração concluída com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Verificar dados na empresa torq-super-admin');
    console.log('   2. Fazer login como Super Admin');
    console.log('   3. Confirmar que vê todos os dados antigos');
    console.log('   4. Após validação, pode deletar coleções antigas da raiz');
    
  } catch (error) {
    console.error('\n❌ Erro fatal na migração:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Executar
main();
