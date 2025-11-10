// Teste completo do QR Code
const fetch = require('node-fetch');

async function testQRCode() {
  console.log('🧪 Testando geração de QR Code...\n');
  
  const empresaId = 'test-' + Date.now();
  console.log(`📱 Usando empresaId: ${empresaId}\n`);
  
  try {
    console.log('1️⃣ Verificando status inicial...');
    const statusRes = await fetch(`http://localhost:5000/api/whatsapp/status?empresaId=${empresaId}`);
    const statusData = await statusRes.json();
    console.log('Status:', JSON.stringify(statusData, null, 2));
    console.log('');
    
    console.log('2️⃣ Iniciando conexão...');
    console.log('⏳ Aguardando QR Code (pode levar até 60 segundos)...\n');
    
    const connectRes = await fetch('http://localhost:5000/api/whatsapp/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresaId })
    });
    
    const connectData = await connectRes.json();
    console.log('Resposta da conexão:');
    console.log('- Status:', connectData.status);
    console.log('- EmpresaId:', connectData.empresaId);
    
    if (connectData.qr) {
      console.log('- QR Code: ✅ GERADO!');
      console.log('- Tamanho:', connectData.qr.length, 'caracteres');
      console.log('- Formato:', connectData.qr.substring(0, 30) + '...');
      console.log('\n✅ SUCESSO! QR Code foi gerado corretamente!');
    } else if (connectData.status === 'already_authenticated') {
      console.log('✅ Já autenticado!');
    } else {
      console.log('❌ FALHA! QR Code não foi gerado');
      console.log('Resposta completa:', JSON.stringify(connectData, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testQRCode();
