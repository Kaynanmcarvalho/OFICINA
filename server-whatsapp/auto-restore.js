// Script para adicionar ao final do index.js

// Função para restaurar sessões salvas automaticamente
function autoRestoreSessions() {
  const fs = require('fs');
  const path = require('path');
  
  const sessionsDir = path.join(__dirname, 'whatsapp_sessions');
  
  if (!fs.existsSync(sessionsDir)) {
    console.log('📁 Nenhuma sessão salva');
    return;
  }
  
  const folders = fs.readdirSync(sessionsDir);
  const empresaFolders = folders.filter(f => f.startsWith('empresa-'));
  
  if (empresaFolders.length === 0) {
    console.log('📁 Nenhuma sessão para restaurar');
    return;
  }
  
  console.log(`🔄 Restaurando ${empresaFolders.length} sessão(ões)...`);
  
  // Restaurar cada sessão com delay entre elas
  empresaFolders.forEach((folder, index) => {
    const empresaId = folder.replace('empresa-', '');
    
    setTimeout(() => {
      console.log(`🚀 Restaurando sessão ${index + 1}/${empresaFolders.length}: ${empresaId}`);
      initializeWhatsApp(empresaId);
    }, index * 5000); // 5 segundos de delay entre cada
  });
}

// Adicionar no app.listen, após o console.log:
setTimeout(() => {
  console.log('\n🔄 Iniciando restauração automática de sessões...\n');
  autoRestoreSessions();
}, 10000);
