/**
 * Script de teste para o serviço OBD-II
 * Execute: node test-obd.js
 */

const obdService = require('./services/obdService');

async function testOBD() {
  console.log('='.repeat(50));
  console.log('🔧 Teste do Serviço OBD-II');
  console.log('='.repeat(50));

  // 1. Listar portas
  console.log('\n📡 Listando portas seriais...');
  const ports = await obdService.listPorts();
  console.log('Portas encontradas:', ports);

  // 2. Testar scan rápido (modo simulação)
  console.log('\n⚡ Executando scan rápido (simulação)...');
  
  obdService.on('status', (status) => {
    console.log(`  [${status.progress}%] ${status.message}`);
  });

  const quickResult = await obdService.quickScan();
  console.log('\n📊 Resultado do scan rápido:');
  console.log(JSON.stringify(quickResult, null, 2));

  // 3. Testar scan completo (modo simulação)
  console.log('\n🔍 Executando scan completo (simulação)...');
  
  const fullResult = await obdService.fullScan();
  console.log('\n📊 Resultado do scan completo:');
  console.log(JSON.stringify(fullResult, null, 2));

  // 4. Status
  console.log('\n📋 Status atual:');
  console.log(obdService.getStatus());

  console.log('\n' + '='.repeat(50));
  console.log('✅ Teste concluído!');
  console.log('='.repeat(50));
}

testOBD().catch(console.error);
