/**
 * SCRIPT DE DEBUG - Cole no Console do Navegador (F12)
 * 
 * Este script verifica:
 * 1. Se empresaId está correto no sessionStorage
 * 2. Quais dados o firestoreService está tentando acessar
 * 3. Se há erros nas queries do Firestore
 */

console.log('🔍 INICIANDO DEBUG...\n');

// 1. Verificar empresaId
const empresaId = sessionStorage.getItem('empresaId');
console.log('📋 empresaId no sessionStorage:', empresaId);

if (empresaId === null || empresaId === 'null' || empresaId === 'undefined') {
  console.log('✅ Super Admin SEM empresaId - deve acessar dados da raiz');
} else {
  console.log('🏢 Usuário COM empresaId - deve acessar dados isolados');
  console.log('   Caminho: empresas/' + empresaId + '/...');
}

// 2. Verificar usuário logado
import { auth } from './src/config/firebase.js';
const user = auth.currentUser;
if (user) {
  console.log('\n👤 Usuário logado:', user.email);
  console.log('   UID:', user.uid);
} else {
  console.log('\n❌ Nenhum usuário logado!');
}

// 3. Testar acesso direto ao Firestore
import { db } from './src/config/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

console.log('\n🔍 Testando acesso às coleções...\n');

const colecoes = ['clients', 'clientes', 'checkins', 'inventory', 'estoque'];

for (const col of colecoes) {
  try {
    const snapshot = await getDocs(collection(db, col));
    console.log(`📦 ${col}: ${snapshot.size} documento(s)`);
    
    if (snapshot.size > 0) {
      console.log('   Exemplo:', snapshot.docs[0].data());
    }
  } catch (error) {
    console.error(`❌ ${col}: Erro -`, error.message);
  }
}

// 4. Se tem empresaId, testar estrutura multi-tenant
if (empresaId && empresaId !== 'null' && empresaId !== 'undefined') {
  console.log('\n🏢 Testando estrutura multi-tenant...\n');
  
  for (const col of ['clientes', 'checkins', 'estoque']) {
    try {
      const path = `empresas/${empresaId}/${col}`;
      const snapshot = await getDocs(collection(db, 'empresas', empresaId, col));
      console.log(`📦 ${path}: ${snapshot.size} documento(s)`);
      
      if (snapshot.size > 0) {
        console.log('   Exemplo:', snapshot.docs[0].data());
      }
    } catch (error) {
      console.error(`❌ empresas/${empresaId}/${col}: Erro -`, error.message);
    }
  }
}

// 5. Verificar stores
console.log('\n📊 Verificando stores...\n');

if (window.useClientStore) {
  const clientStore = window.useClientStore.getState();
  console.log('👥 clientStore.clients:', clientStore.clients.length, 'cliente(s)');
  console.log('   isLoading:', clientStore.isLoading);
  console.log('   error:', clientStore.error);
}

if (window.useInventoryStore) {
  const inventoryStore = window.useInventoryStore.getState();
  console.log('📦 inventoryStore.parts:', inventoryStore.parts.length, 'produto(s)');
  console.log('   isLoading:', inventoryStore.isLoading);
  console.log('   error:', inventoryStore.error);
}

if (window.useCheckinStore) {
  const checkinStore = window.useCheckinStore.getState();
  console.log('✅ checkinStore.checkins:', checkinStore.checkins.length, 'checkin(s)');
  console.log('   isLoading:', checkinStore.isLoading);
  console.log('   error:', checkinStore.error);
}

console.log('\n✅ DEBUG CONCLUÍDO!\n');
console.log('💡 Se todos os stores estão com 0 itens, o problema é:');
console.log('   1. Não há dados no Firebase nessas coleções');
console.log('   2. O caminho das coleções está errado');
console.log('   3. As regras do Firestore estão bloqueando o acesso');
