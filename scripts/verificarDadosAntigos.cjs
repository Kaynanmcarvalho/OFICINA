/**
 * Script para verificar dados antigos (raiz do Firebase)
 * Mostra quantos registros existem nas coleções antigas
 * 
 * IMPORTANTE: Este script precisa das credenciais do Firebase Admin
 * Você pode obter em: Firebase Console > Project Settings > Service Accounts
 * Salve como serviceAccountKey.json na raiz do projeto
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Verificar se arquivo de credenciais existe
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('\n❌ ERRO: Arquivo serviceAccountKey.json não encontrado!');
  console.error('\n📋 Para obter as credenciais:');
  console.error('   1. Acesse: https://console.firebase.google.com/');
  console.error('   2. Selecione seu projeto');
  console.error('   3. Vá em: Project Settings > Service Accounts');
  console.error('   4. Clique em "Generate new private key"');
  console.error('   5. Salve o arquivo como "serviceAccountKey.json" na raiz do projeto\n');
  process.exit(1);
}

// Inicializar Firebase Admin
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function verificarDadosAntigos() {
  console.log('\n🔍 VERIFICANDO DADOS ANTIGOS (RAIZ DO FIREBASE)\n');
  console.log('=' .repeat(60));

  const colecoes = [
    'clients',
    'clientes',
    'checkins',
    'budgets',
    'orcamentos',
    'inventory',
    'estoque',
    'vehicles',
    'veiculos',
    'tools',
    'ferramentas'
  ];

  const resultados = {};

  for (const colecao of colecoes) {
    try {
      const snapshot = await db.collection(colecao).get();
      const count = snapshot.size;
      
      if (count > 0) {
        console.log(`\n📦 ${colecao}: ${count} documento(s)`);
        
        // Mostrar alguns exemplos
        const exemplos = [];
        snapshot.docs.slice(0, 3).forEach(doc => {
          const data = doc.data();
          exemplos.push({
            id: doc.id,
            nome: data.name || data.nome || data.clientName || data.nomeCliente || 'Sem nome',
            criadoEm: data.createdAt || data.dataCriacao || 'Sem data'
          });
        });
        
        console.log('   Exemplos:');
        exemplos.forEach(ex => {
          console.log(`   - ${ex.nome} (ID: ${ex.id})`);
        });
        
        resultados[colecao] = count;
      } else {
        console.log(`\n📦 ${colecao}: 0 documentos`);
      }
    } catch (error) {
      console.log(`\n❌ ${colecao}: Erro ao acessar - ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 RESUMO:');
  
  const totalDocs = Object.values(resultados).reduce((sum, count) => sum + count, 0);
  console.log(`\nTotal de documentos antigos: ${totalDocs}`);
  
  if (totalDocs > 0) {
    console.log('\n✅ Super Admins DEVEM ter acesso a estes dados!');
    console.log('\n📋 Coleções com dados:');
    Object.entries(resultados).forEach(([colecao, count]) => {
      console.log(`   - ${colecao}: ${count} documento(s)`);
    });
  } else {
    console.log('\n⚠️  Nenhum dado antigo encontrado na raiz do Firebase');
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Verificação concluída!\n');
}

// Executar
verificarDadosAntigos()
  .then(() => {
    console.log('Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erro ao executar script:', error);
    process.exit(1);
  });
