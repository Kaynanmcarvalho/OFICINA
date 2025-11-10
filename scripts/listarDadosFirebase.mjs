/**
 * Script para listar TODOS os dados do Firebase
 * Usa Firebase Web SDK (não precisa de serviceAccountKey)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMhYAH03gzL0H705XjSBp8-4gxhmE246Q",
  authDomain: "oficina-reparofacil.firebaseapp.com",
  projectId: "oficina-reparofacil",
  storageBucket: "oficina-reparofacil.firebasestorage.app",
  messagingSenderId: "610352587990",
  appId: "1:610352587990:web:dc0add122ccb7f54c09577"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('\n🔍 LISTANDO DADOS DO FIREBASE\n');
console.log('Projeto: oficina-reparofacil');
console.log('='.repeat(70) + '\n');

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
  'ferramentas',
  'usuarios',
  'empresas'
];

let totalGeral = 0;

for (const nomeColecao of colecoes) {
  try {
    const colRef = collection(db, nomeColecao);
    const snapshot = await getDocs(colRef);
    const count = snapshot.size;

    if (count > 0) {
      console.log(`\n📦 ${nomeColecao}: ${count} documento(s)`);
      totalGeral += count;
      
      // Mostrar primeiros 3 documentos
      snapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        const nome = data.name || data.nome || data.clientName || data.nomeCliente || 
                     data.email || data.nomeFantasia || 'Sem identificação';
        console.log(`   ${index + 1}. ${nome} (ID: ${doc.id})`);
      });
    } else {
      console.log(`\n📦 ${nomeColecao}: VAZIO`);
    }
  } catch (error) {
    console.log(`\n❌ ${nomeColecao}: ERRO - ${error.message}`);
  }
}

// Verificar estrutura multi-tenant
console.log('\n' + '='.repeat(70));
console.log('\n🏢 VERIFICANDO ESTRUTURA MULTI-TENANT\n');

try {
  const empresasRef = collection(db, 'empresas');
  const empresasSnapshot = await getDocs(empresasRef);

  if (empresasSnapshot.empty) {
    console.log('⚠️  Nenhuma empresa encontrada\n');
  } else {
    console.log(`✅ ${empresasSnapshot.size} empresa(s) encontrada(s)\n`);

    for (const empresaDoc of empresasSnapshot.docs) {
      const empresaId = empresaDoc.id;
      const empresaData = empresaDoc.data();
      const nomeEmpresa = empresaData.nomeFantasia || empresaData.razaoSocial || 'Sem nome';

      console.log(`\n📊 Empresa: ${nomeEmpresa}`);
      console.log(`   ID: ${empresaId}`);
      console.log(`   Status: ${empresaData.ativo ? 'Ativa' : 'Inativa'}`);

      // Verificar subcoleções
      const subcolecoes = ['clientes', 'checkins', 'orcamentos', 'estoque', 'veiculos'];
      
      for (const sub of subcolecoes) {
        try {
          const subRef = collection(db, 'empresas', empresaId, sub);
          const subSnap = await getDocs(subRef);
          
          if (subSnap.size > 0) {
            console.log(`   ✅ ${sub}: ${subSnap.size} documento(s)`);
            totalGeral += subSnap.size;
          }
        } catch (error) {
          // Ignorar erros de subcoleções
        }
      }
    }
  }
} catch (error) {
  console.log('❌ Erro ao verificar empresas:', error.message);
}

console.log('\n' + '='.repeat(70));
console.log(`\n📊 TOTAL GERAL: ${totalGeral} documentos\n`);

if (totalGeral === 0) {
  console.log('⚠️  ATENÇÃO: Nenhum dado encontrado no Firebase!');
  console.log('\n💡 Possíveis causas:');
  console.log('   1. O banco de dados está realmente vazio');
  console.log('   2. As regras do Firestore estão bloqueando o acesso');
  console.log('   3. Os dados estão em outra estrutura/projeto');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Verifique o Firebase Console manualmente');
  console.log('   2. Verifique as regras em firestore.rules');
  console.log('   3. Crie dados de teste se necessário\n');
} else {
  console.log('✅ Dados encontrados! O sistema deve estar funcionando.\n');
}

process.exit(0);
