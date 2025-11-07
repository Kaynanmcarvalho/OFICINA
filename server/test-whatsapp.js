/**
 * Script de Teste - WhatsApp Multi-Sessão
 * Execute: node test-whatsapp.js
 */

require('dotenv').config();
const whatsappService = require('./services/whatsappMultiSessionService');

const TEST_EMPRESA_ID = 'test-empresa-123';

async function testWhatsAppSystem() {
  console.log('🧪 Iniciando testes do sistema WhatsApp...\n');

  try {
    // Teste 1: Inicializar sessão
    console.log('📱 Teste 1: Inicializando sessão...');
    const initResult = await whatsappService.initializeSession(TEST_EMPRESA_ID);
    console.log('✅ Sessão inicializada:', initResult.status);
    console.log('');

    // Aguardar 5 segundos para gerar QR
    console.log('⏳ Aguardando 5 segundos para gerar QR Code...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Teste 2: Verificar status
    console.log('📊 Teste 2: Verificando status...');
    const status = whatsappService.getSessionStatus(TEST_EMPRESA_ID);
    console.log('✅ Status:', status);
    console.log('');

    if (status.status === 'qr_ready' && status.qr) {
      console.log('📱 QR Code gerado! Escaneie com seu WhatsApp:');
      console.log('   Abra o WhatsApp > Menu > Aparelhos conectados > Conectar aparelho');
      console.log('');
      console.log('⏳ Aguardando 60 segundos para você escanear...');
      
      // Aguardar conexão
      let attempts = 0;
      const maxAttempts = 60;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentStatus = whatsappService.getSessionStatus(TEST_EMPRESA_ID);
        
        if (currentStatus.status === 'connected') {
          console.log('✅ WhatsApp conectado com sucesso!');
          console.log('📞 Número:', currentStatus.phoneNumber);
          console.log('');
          
          // Teste 3: Enviar mensagem de teste
          console.log('📤 Teste 3: Deseja enviar uma mensagem de teste? (y/n)');
          console.log('   Digite o número (ex: 5511999999999) ou "n" para pular:');
          
          // Aguardar input do usuário
          const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
          });
          
          readline.question('Número: ', async (phoneNumber) => {
            if (phoneNumber && phoneNumber !== 'n') {
              try {
                console.log('📤 Enviando mensagem de teste...');
                const sendResult = await whatsappService.sendMessage(
                  TEST_EMPRESA_ID,
                  phoneNumber,
                  '🧪 Teste do sistema WhatsApp Multi-Sessão\n\nSistema funcionando perfeitamente! ✅'
                );
                console.log('✅ Mensagem enviada:', sendResult);
              } catch (error) {
                console.error('❌ Erro ao enviar mensagem:', error.message);
              }
            }
            
            readline.close();
            
            // Teste 4: Listar sessões
            console.log('');
            console.log('📋 Teste 4: Listando todas as sessões...');
            const sessions = whatsappService.getAllSessions();
            console.log('✅ Sessões ativas:', sessions.length);
            sessions.forEach(session => {
              console.log(`   - ${session.empresaId}: ${session.status}`);
            });
            
            console.log('');
            console.log('🎉 Todos os testes concluídos!');
            console.log('');
            console.log('💡 Dicas:');
            console.log('   - A sessão ficará ativa mesmo após fechar este script');
            console.log('   - Para desconectar, use: POST /api/whatsapp/:empresaId/logout');
            console.log('   - Para destruir, use: POST /api/whatsapp/:empresaId/destroy');
            
            process.exit(0);
          });
          
          return;
        }
        
        attempts++;
        
        if (attempts % 10 === 0) {
          console.log(`⏳ Ainda aguardando... (${attempts}/${maxAttempts}s)`);
        }
      }
      
      console.log('⏱️ Timeout: QR Code não foi escaneado a tempo');
      console.log('💡 Execute o script novamente para tentar outra vez');
      
    } else {
      console.log('ℹ️ QR Code não foi gerado. Status:', status.status);
      console.log('💡 Isso pode acontecer se já existe uma sessão ativa');
    }

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }

  process.exit(0);
}

// Executar testes
console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  🧪 TESTE DO SISTEMA WHATSAPP MULTI-SESSÃO');
console.log('═══════════════════════════════════════════════════════');
console.log('');

testWhatsAppSystem();
