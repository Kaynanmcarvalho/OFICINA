/**
 * Script de Migração para Multi-Tenant
 * 
 * ATENÇÃO: Este script move TODOS os dados existentes para a estrutura multi-tenant
 * 
 * Uso:
 * node scripts/migrateToMultiTenant.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ID da empresa padrão para dados existentes
const DEFAULT_EMPRESA_ID = 'default-empresa';
const DEFAULT_EMPRESA_NAME = 'Torq - Empresa Principal';

// Coleções a migrar
const COLLECTIONS_TO_MIGRATE = [
  'clientes',
  'veiculos',
  'orcamentos',
  'checkins'
];

/**
 * Cria empresa padrão
 */
async function createDefaultEmpresa() {
  console.log('\n📝 Criando empresa padrão...');
  
  const empresaRef = db.collection('empresas').doc(DEFAULT_EMPRESA_ID);
  const empresaDoc = await empresaRef.get();
  
  if (empresaDoc.exists()) {
    console.log('✅ Empresa padrão já existe');
    return;
  }
  
  await empresaRef.set({
    nomeFantasia: DEFAULT_EMPRESA_NAME,
    razaoSocial: DEFAULT_EMPRESA_NAME,
    cnpj: '',
    slug: 'torq',
    logo: null,
    plano: 'premium',
    ativo: true,
    dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
    dataExpiracao: null,
    contato: {
      email: 'contato@torq.app',
      telefone: '',
      endereco: ''
    }
  });
  
  console.log('✅ Empresa padrão criada:', DEFAULT_EMPRESA_ID);
}

/**
 * Cria configuração de tema padrão
 */
async function createDefaultTheme() {
  console.log('\n🎨 Criando tema padrão...');
  
  const temaRef = db
    .collection('empresas')
    .doc(DEFAULT_EMPRESA_ID)
    .collection('configuracoes')
    .doc('tema');
  
  const temaDoc = await temaRef.get();
  
  if (temaDoc.exists()) {
    console.log('✅ Tema padrão já existe');
    return;
  }
  
  await temaRef.set({
    corPrimaria: '#F28C1D',
    corSecundaria: '#007AFF',
    corFundo: '#FFFFFF',
    gradiente: ['#F28C1D', '#FF6B35', '#F28C1D'],
    borderRadius: '12px',
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  });
  
  console.log('✅ Tema padrão criado');
}

/**
 * Migra uma coleção
 */
async function migrateCollection(collectionName) {
  console.log(`\n📦 Migrando coleção: ${collectionName}`);
  
  try {
    // Buscar todos os documentos da coleção raiz
    const snapshot = await db.collection(collectionName).get();
    
    if (snapshot.empty) {
      console.log(`ℹ️ Coleção ${collectionName} está vazia, pulando...`);
      return { migrated: 0, errors: 0 };
    }
    
    console.log(`📊 Encontrados ${snapshot.size} documentos`);
    
    let migrated = 0;
    let errors = 0;
    
    // Processar em lotes de 500 (limite do Firestore)
    const batch = db.batch();
    let batchCount = 0;
    
    for (const doc of snapshot.docs) {
      try {
        const data = doc.data();
        
        // Criar documento na nova estrutura
        const newDocRef = db
          .collection('empresas')
          .doc(DEFAULT_EMPRESA_ID)
          .collection(collectionName)
          .doc(doc.id);
        
        // Adicionar empresaId aos dados
        batch.set(newDocRef, {
          ...data,
          empresaId: DEFAULT_EMPRESA_ID,
          migratedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        batchCount++;
        
        // Commit batch a cada 500 operações
        if (batchCount >= 500) {
          await batch.commit();
          console.log(`  ✅ Migrados ${batchCount} documentos`);
          batchCount = 0;
        }
        
        migrated++;
      } catch (error) {
        console.error(`  ❌ Erro ao migrar documento ${doc.id}:`, error.message);
        errors++;
      }
    }
    
    // Commit batch final
    if (batchCount > 0) {
      await batch.commit();
      console.log(`  ✅ Migrados ${batchCount} documentos`);
    }
    
    console.log(`✅ Coleção ${collectionName} migrada: ${migrated} documentos`);
    
    return { migrated, errors };
  } catch (error) {
    console.error(`❌ Erro ao migrar coleção ${collectionName}:`, error);
    return { migrated: 0, errors: 1 };
  }
}

/**
 * Atualiza usuários com empresaId
 */
async function updateUsers() {
  console.log('\n👥 Atualizando usuários...');
  
  try {
    const snapshot = await db.collection('usuarios').get();
    
    if (snapshot.empty) {
      console.log('ℹ️ Nenhum usuário encontrado');
      return { updated: 0, errors: 0 };
    }
    
    console.log(`📊 Encontrados ${snapshot.size} usuários`);
    
    let updated = 0;
    let errors = 0;
    
    for (const doc of snapshot.docs) {
      try {
        const data = doc.data();
        
        // Se já tem empresaId, pular
        if (data.empresaId) {
          console.log(`  ℹ️ Usuário ${doc.id} já tem empresaId, pulando...`);
          continue;
        }
        
        // Atualizar com empresaId padrão
        await doc.ref.update({
          empresaId: DEFAULT_EMPRESA_ID,
          role: data.role || 'admin', // Se não tem role, setar como admin
          migratedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`  ✅ Usuário ${doc.id} atualizado`);
        updated++;
      } catch (error) {
        console.error(`  ❌ Erro ao atualizar usuário ${doc.id}:`, error.message);
        errors++;
      }
    }
    
    console.log(`✅ Usuários atualizados: ${updated}`);
    
    return { updated, errors };
  } catch (error) {
    console.error('❌ Erro ao atualizar usuários:', error);
    return { updated: 0, errors: 1 };
  }
}

/**
 * Valida integridade dos dados
 */
async function validateMigration() {
  console.log('\n🔍 Validando migração...');
  
  const results = {};
  
  for (const collectionName of COLLECTIONS_TO_MIGRATE) {
    try {
      // Contar documentos na coleção raiz
      const rootSnapshot = await db.collection(collectionName).get();
      const rootCount = rootSnapshot.size;
      
      // Contar documentos na nova estrutura
      const newSnapshot = await db
        .collection('empresas')
        .doc(DEFAULT_EMPRESA_ID)
        .collection(collectionName)
        .get();
      const newCount = newSnapshot.size;
      
      results[collectionName] = {
        root: rootCount,
        migrated: newCount,
        match: rootCount === newCount
      };
      
      if (rootCount === newCount) {
        console.log(`  ✅ ${collectionName}: ${rootCount} = ${newCount}`);
      } else {
        console.log(`  ⚠️ ${collectionName}: ${rootCount} ≠ ${newCount}`);
      }
    } catch (error) {
      console.error(`  ❌ Erro ao validar ${collectionName}:`, error.message);
      results[collectionName] = { error: error.message };
    }
  }
  
  return results;
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando migração para multi-tenant...\n');
  console.log('⚠️  ATENÇÃO: Este script irá mover TODOS os dados existentes');
  console.log('⚠️  Certifique-se de ter um backup antes de continuar!\n');
  
  // Aguardar 5 segundos para dar tempo de cancelar
  console.log('⏳ Iniciando em 5 segundos... (Ctrl+C para cancelar)');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    const startTime = Date.now();
    
    // 1. Criar empresa padrão
    await createDefaultEmpresa();
    
    // 2. Criar tema padrão
    await createDefaultTheme();
    
    // 3. Migrar coleções
    const migrationResults = {};
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      migrationResults[collectionName] = await migrateCollection(collectionName);
    }
    
    // 4. Atualizar usuários
    const userResults = await updateUsers();
    
    // 5. Validar migração
    const validationResults = await validateMigration();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Resumo
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DA MIGRAÇÃO');
    console.log('='.repeat(60));
    
    console.log('\n📦 Coleções migradas:');
    for (const [collection, result] of Object.entries(migrationResults)) {
      console.log(`  ${collection}: ${result.migrated} documentos (${result.errors} erros)`);
    }
    
    console.log('\n👥 Usuários:');
    console.log(`  Atualizados: ${userResults.updated} (${userResults.errors} erros)`);
    
    console.log('\n🔍 Validação:');
    for (const [collection, result] of Object.entries(validationResults)) {
      if (result.match) {
        console.log(`  ✅ ${collection}: OK`);
      } else if (result.error) {
        console.log(`  ❌ ${collection}: ${result.error}`);
      } else {
        console.log(`  ⚠️ ${collection}: ${result.root} → ${result.migrated}`);
      }
    }
    
    console.log(`\n⏱️  Tempo total: ${duration}s`);
    console.log('\n✅ Migração concluída!');
    console.log('\n📝 Próximos passos:');
    console.log('  1. Executar: node scripts/setCustomClaims.js');
    console.log('  2. Deploy: firebase deploy --only firestore:rules,firestore:indexes');
    console.log('  3. Testar isolamento de dados');
    
  } catch (error) {
    console.error('\n❌ Erro fatal na migração:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Executar
main();
