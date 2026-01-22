/**
 * Script de Configuração Automática do Firestore para Módulo de Caixa
 * 
 * Este script:
 * 1. Verifica se os índices necessários existem
 * 2. Fornece instruções para criar os índices
 * 3. Testa as permissões básicas
 * 
 * Uso: node scripts/setup-caixa-firestore.js
 */

const admin = require('firebase-admin');
const readline = require('readline');

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const REQUIRED_INDEXES = [
  {
    collection: 'caixas',
    fields: [
      { field: 'empresaId', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' },
      { field: 'dataAbertura', order: 'DESCENDING' }
    ],
    description: 'Índice para listar caixas por empresa e status'
  },
  {
    collection: 'caixas',
    fields: [
      { field: 'empresaId', order: 'ASCENDING' },
      { field: 'operadorAbertura.uid', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' }
    ],
    description: 'Índice para buscar caixa aberto do operador'
  }
];

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function printHeader() {
  console.clear();
  log.title('═══════════════════════════════════════════════════════════');
  log.title('   CONFIGURAÇÃO DO FIRESTORE - MÓDULO DE CAIXA');
  log.title('═══════════════════════════════════════════════════════════');
}

function printIndexInstructions() {
  log.title('📋 ÍNDICES NECESSÁRIOS');
  
  console.log('Você precisa criar os seguintes índices no Firebase Console:\n');
  
  REQUIRED_INDEXES.forEach((index, i) => {
    console.log(`${colors.bright}Índice ${i + 1}:${colors.reset}`);
    console.log(`  Collection: ${colors.cyan}${index.collection}${colors.reset}`);
    console.log(`  Descrição: ${index.description}`);
    console.log('  Fields:');
    index.fields.forEach(field => {
      console.log(`    - ${colors.yellow}${field.field}${colors.reset} (${field.order})`);
    });
    console.log('');
  });
  
  console.log(`${colors.bright}Como criar:${colors.reset}`);
  console.log('1. Acesse: https://console.firebase.google.com');
  console.log('2. Selecione seu projeto');
  console.log('3. Vá em Firestore Database > Indexes');
  console.log('4. Clique em "Create Index"');
  console.log('5. Configure cada índice conforme acima');
  console.log('6. Aguarde a criação (pode levar alguns minutos)\n');
}

function printRulesInstructions() {
  log.title('🔐 REGRAS DE SEGURANÇA');
  
  console.log('As regras de segurança estão documentadas em:');
  console.log(`${colors.cyan}.kiro/specs/caixa-auditoria-completa/FIRESTORE_RULES_CAIXA.md${colors.reset}\n`);
  
  console.log(`${colors.bright}Como aplicar:${colors.reset}`);
  console.log('1. Acesse: https://console.firebase.google.com');
  console.log('2. Selecione seu projeto');
  console.log('3. Vá em Firestore Database > Rules');
  console.log('4. Cole as regras do arquivo acima');
  console.log('5. Clique em "Publish"\n');
}

async function testFirestoreConnection() {
  log.title('🔌 TESTANDO CONEXÃO COM FIRESTORE');
  
  try {
    // Tentar ler a collection caixas
    const snapshot = await admin.firestore().collection('caixas').limit(1).get();
    log.success('Conexão com Firestore estabelecida!');
    log.info(`Collection 'caixas' ${snapshot.empty ? 'está vazia' : 'contém documentos'}`);
    return true;
  } catch (error) {
    log.error('Erro ao conectar com Firestore:');
    console.error(error.message);
    return false;
  }
}

async function checkIndexes() {
  log.title('🔍 VERIFICANDO ÍNDICES');
  
  log.warning('Nota: A verificação automática de índices não é possível via Admin SDK.');
  log.info('Você precisa verificar manualmente no Firebase Console.');
  
  console.log('\nPara verificar:');
  console.log('1. Acesse: https://console.firebase.google.com');
  console.log('2. Vá em Firestore Database > Indexes');
  console.log('3. Verifique se os índices listados acima existem\n');
  
  const answer = await question('Os índices já foram criados? (s/n): ');
  return answer.toLowerCase() === 's';
}

async function testBasicOperations() {
  log.title('🧪 TESTANDO OPERAÇÕES BÁSICAS');
  
  try {
    // Teste 1: Criar documento de teste
    log.info('Teste 1: Criando documento de teste...');
    const testDoc = {
      empresaId: 'test-empresa',
      status: 'teste',
      operadorAbertura: {
        uid: 'test-user',
        nome: 'Usuário Teste'
      },
      saldoInicial: 0,
      saldoEsperado: 0,
      dataAbertura: admin.firestore.Timestamp.now(),
      createdAt: admin.firestore.Timestamp.now(),
      _isTest: true
    };
    
    const docRef = await admin.firestore().collection('caixas').add(testDoc);
    log.success('Documento de teste criado!');
    
    // Teste 2: Ler documento
    log.info('Teste 2: Lendo documento de teste...');
    const doc = await docRef.get();
    if (doc.exists) {
      log.success('Documento lido com sucesso!');
    } else {
      log.error('Documento não encontrado!');
    }
    
    // Teste 3: Atualizar documento
    log.info('Teste 3: Atualizando documento de teste...');
    await docRef.update({ saldoEsperado: 100 });
    log.success('Documento atualizado!');
    
    // Teste 4: Excluir documento
    log.info('Teste 4: Excluindo documento de teste...');
    await docRef.delete();
    log.success('Documento excluído!');
    
    log.success('\n✓ Todos os testes básicos passaram!');
    return true;
  } catch (error) {
    log.error('\n✗ Erro nos testes:');
    console.error(error.message);
    return false;
  }
}

function printSummary(indexesCreated, testsPass) {
  log.title('📊 RESUMO DA CONFIGURAÇÃO');
  
  console.log(`Conexão com Firestore: ${colors.green}✓ OK${colors.reset}`);
  console.log(`Índices criados: ${indexesCreated ? colors.green + '✓ SIM' : colors.yellow + '⚠ PENDENTE'}${colors.reset}`);
  console.log(`Testes básicos: ${testsPass ? colors.green + '✓ PASSOU' : colors.red + '✗ FALHOU'}${colors.reset}`);
  
  if (indexesCreated && testsPass) {
    log.success('\n🎉 Configuração completa! O módulo de caixa está pronto para uso.');
  } else {
    log.warning('\n⚠ Configuração incompleta. Complete os passos pendentes.');
  }
}

function printNextSteps() {
  log.title('🚀 PRÓXIMOS PASSOS');
  
  console.log('1. Aplicar as regras de segurança (veja FIRESTORE_RULES_CAIXA.md)');
  console.log('2. Testar o fluxo completo (veja GUIA_TESTE_RAPIDO.md)');
  console.log('3. Validar com stakeholders');
  console.log('4. Deploy em produção\n');
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  try {
    printHeader();
    
    // Verificar se Firebase Admin está inicializado
    if (!admin.apps.length) {
      log.error('Firebase Admin não está inicializado!');
      log.info('Certifique-se de que o arquivo de credenciais está configurado.');
      process.exit(1);
    }
    
    // Testar conexão
    const connected = await testFirestoreConnection();
    if (!connected) {
      log.error('Não foi possível conectar ao Firestore. Verifique as credenciais.');
      process.exit(1);
    }
    
    // Mostrar instruções de índices
    printIndexInstructions();
    
    // Verificar se índices foram criados
    const indexesCreated = await checkIndexes();
    
    // Mostrar instruções de rules
    printRulesInstructions();
    
    // Perguntar se deseja executar testes
    const runTests = await question('\nDeseja executar testes básicos? (s/n): ');
    let testsPass = false;
    
    if (runTests.toLowerCase() === 's') {
      testsPass = await testBasicOperations();
    }
    
    // Resumo
    printSummary(indexesCreated, testsPass);
    
    // Próximos passos
    printNextSteps();
    
  } catch (error) {
    log.error('Erro durante a configuração:');
    console.error(error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main };
