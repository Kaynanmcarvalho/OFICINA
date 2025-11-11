/**
 * Script de Teste Automatizado - Sistema de Compatibilidade
 * Execução: node scripts/testCompatibilitySystem.js
 */

const admin = require('firebase-admin');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Inicializar Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    log('✓ Firebase Admin inicializado', 'green');
  } catch (error) {
    log('✗ Erro ao inicializar Firebase Admin', 'red');
    log(`  ${error.message}`, 'red');
    process.exit(1);
  }
}

const db = admin.firestore();

// Testes
const tests = {
  passed: 0,
  failed: 0,
  total: 0
};

async function test(name, fn) {
  tests.total++;
  try {
    await fn();
    tests.passed++;
    log(`✓ ${name}`, 'green');
    return true;
  } catch (error) {
    tests.failed++;
    log(`✗ ${name}`, 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('\n🧪 INICIANDO TESTES DO SISTEMA DE COMPATIBILIDADE\n', 'cyan');

  // Teste 1: Verificar coleções
  log('📦 Testando Estrutura Firestore...', 'blue');
  
  await test('Coleção /vehicles existe', async () => {
    const snapshot = await db.collection('vehicles').limit(1).get();
    if (snapshot.empty) throw new Error('Coleção vazia - execute addSampleCompatibility.js');
  });

  await test('Coleção /parts existe', async () => {
    const snapshot = await db.collection('parts').limit(1).get();
    if (snapshot.empty) throw new Error('Coleção vazia - execute addSampleCompatibility.js');
  });

  await test('Coleção /compatibility existe', async () => {
    const snapshot = await db.collection('compatibility').limit(1).get();
    if (snapshot.empty) throw new Error('Coleção vazia - execute addSampleCompatibility.js');
  });

  // Teste 2: Verificar estrutura de dados
  log('\n📋 Testando Estrutura de Dados...', 'blue');

  await test('Veículos têm campos obrigatórios', async () => {
    const snapshot = await db.collection('vehicles').limit(1).get();
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    if (!data.marca) throw new Error('Campo "marca" ausente');
    if (!data.modelo) throw new Error('Campo "modelo" ausente');
    if (!data.tipo) throw new Error('Campo "tipo" ausente');
  });

  await test('Peças têm campos obrigatórios', async () => {
    const snapshot = await db.collection('parts').limit(1).get();
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    if (!data.nome) throw new Error('Campo "nome" ausente');
  });

  await test('Compatibilidades têm campos obrigatórios', async () => {
    const snapshot = await db.collection('compatibility').limit(1).get();
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    if (!data.partId) throw new Error('Campo "partId" ausente');
    if (!data.vehicleId) throw new Error('Campo "vehicleId" ausente');
  });

  // Teste 3: Verificar integridade referencial
  log('\n🔗 Testando Integridade Referencial...', 'blue');

  await test('Compatibilidades referenciam veículos válidos', async () => {
    const compatSnapshot = await db.collection('compatibility').limit(5).get();
    
    for (const compatDoc of compatSnapshot.docs) {
      const vehicleId = compatDoc.data().vehicleId;
      const vehicleDoc = await db.collection('vehicles').doc(vehicleId).get();
      
      if (!vehicleDoc.exists) {
        throw new Error(`Veículo ${vehicleId} não encontrado`);
      }
    }
  });

  await test('Compatibilidades referenciam peças válidas', async () => {
    const compatSnapshot = await db.collection('compatibility').limit(5).get();
    
    for (const compatDoc of compatSnapshot.docs) {
      const partId = compatDoc.data().partId;
      const partDoc = await db.collection('parts').doc(partId).get();
      
      if (!partDoc.exists) {
        throw new Error(`Peça ${partId} não encontrada`);
      }
    }
  });

  // Teste 4: Verificar dados de exemplo
  log('\n📊 Testando Dados de Exemplo...', 'blue');

  await test('Honda CG 160 cadastrada', async () => {
    const snapshot = await db.collection('vehicles')
      .where('marca', '==', 'Honda')
      .where('modelo', '==', 'CG 160')
      .limit(1)
      .get();
    
    if (snapshot.empty) throw new Error('Honda CG 160 não encontrada');
  });

  await test('Filtro de Óleo cadastrado', async () => {
    const snapshot = await db.collection('parts')
      .where('nome', '==', 'Filtro de Óleo')
      .limit(1)
      .get();
    
    if (snapshot.empty) throw new Error('Filtro de Óleo não encontrado');
  });

  // Teste 5: Verificar evidências
  log('\n🔍 Testando Sistema de Evidências...', 'blue');

  await test('Compatibilidades têm evidências', async () => {
    const snapshot = await db.collection('compatibility').limit(1).get();
    const data = snapshot.docs[0].data();
    
    if (!data.evidencias || !Array.isArray(data.evidencias)) {
      throw new Error('Campo "evidencias" ausente ou inválido');
    }
    
    if (data.evidencias.length === 0) {
      throw new Error('Nenhuma evidência cadastrada');
    }
  });

  await test('Evidências têm estrutura correta', async () => {
    const snapshot = await db.collection('compatibility').limit(1).get();
    const data = snapshot.docs[0].data();
    const evidencia = data.evidencias[0];
    
    if (!evidencia.tipo) throw new Error('Campo "tipo" ausente na evidência');
    if (!evidencia.descricao) throw new Error('Campo "descricao" ausente na evidência');
  });

  // Teste 6: Verificar tipos de veículos
  log('\n🚗 Testando Tipos de Veículos...', 'blue');

  await test('Existem motos cadastradas', async () => {
    const snapshot = await db.collection('vehicles')
      .where('tipo', '==', 'motos')
      .limit(1)
      .get();
    
    if (snapshot.empty) throw new Error('Nenhuma moto cadastrada');
  });

  await test('Existem carros cadastrados', async () => {
    const snapshot = await db.collection('vehicles')
      .where('tipo', '==', 'carros')
      .limit(1)
      .get();
    
    if (snapshot.empty) throw new Error('Nenhum carro cadastrado');
  });

  // Teste 7: Contar documentos
  log('\n📈 Contando Documentos...', 'blue');

  const vehiclesCount = await db.collection('vehicles').count().get();
  const partsCount = await db.collection('parts').count().get();
  const compatCount = await db.collection('compatibility').count().get();

  log(`  Veículos: ${vehiclesCount.data().count}`, 'cyan');
  log(`  Peças: ${partsCount.data().count}`, 'cyan');
  log(`  Compatibilidades: ${compatCount.data().count}`, 'cyan');

  // Resultados
  log('\n' + '='.repeat(50), 'cyan');
  log('📊 RESULTADOS DOS TESTES', 'cyan');
  log('='.repeat(50), 'cyan');
  log(`Total: ${tests.total}`, 'blue');
  log(`Passou: ${tests.passed}`, 'green');
  log(`Falhou: ${tests.failed}`, tests.failed > 0 ? 'red' : 'green');
  log(`Taxa de Sucesso: ${((tests.passed / tests.total) * 100).toFixed(1)}%`, 
    tests.failed === 0 ? 'green' : 'yellow');
  log('='.repeat(50) + '\n', 'cyan');

  if (tests.failed === 0) {
    log('✅ TODOS OS TESTES PASSARAM!', 'green');
    log('Sistema de compatibilidade está 100% funcional.\n', 'green');
    return 0;
  } else {
    log('⚠️  ALGUNS TESTES FALHARAM', 'yellow');
    log('Execute: node scripts/addSampleCompatibility.js\n', 'yellow');
    return 1;
  }
}

// Executar testes
runTests()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    log('\n❌ ERRO FATAL NOS TESTES', 'red');
    log(error.message, 'red');
    console.error(error);
    process.exit(1);
  });
