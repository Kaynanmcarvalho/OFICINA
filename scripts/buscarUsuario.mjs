/**
 * Buscar usuário específico no Firebase
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

console.log('\n🔍 BUSCANDO USUÁRIO: renier@reparo.com\n');
console.log('='.repeat(70) + '\n');

try {
  // Buscar por email
  const usuariosRef = collection(db, 'usuarios');
  const q = query(usuariosRef, where('email', '==', 'renier@reparo.com'));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log('❌ Usuário renier@reparo.com NÃO encontrado na coleção "usuarios"!\n');
    console.log('💡 Isso significa que:');
    console.log('   1. O usuário existe no Firebase Auth mas não no Firestore');
    console.log('   2. O email pode estar diferente (maiúsculas/minúsculas)');
    console.log('   3. O documento do usuário não foi criado\n');
    
    // Listar TODOS os usuários
    console.log('📋 Listando TODOS os usuários cadastrados:\n');
    const allUsers = await getDocs(collection(db, 'usuarios'));
    
    if (allUsers.empty) {
      console.log('⚠️  Nenhum usuário encontrado na coleção "usuarios"!\n');
    } else {
      allUsers.forEach((doc) => {
        const data = doc.data();
        console.log(`👤 ${data.email || data.nome || 'Sem email'}`);
        console.log(`   UID: ${doc.id}`);
        console.log(`   Role: ${data.role || 'não definido'}`);
        console.log(`   empresaId: ${data.empresaId || 'null'}`);
        console.log('');
      });
    }
  } else {
    console.log('✅ Usuário encontrado!\n');
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`👤 Email: ${data.email}`);
      console.log(`   UID: ${doc.id}`);
      console.log(`   Nome: ${data.nome || data.name || 'Não definido'}`);
      console.log(`   Role: ${data.role || 'não definido'}`);
      console.log(`   empresaId: ${data.empresaId || 'null (Super Admin sem empresa)'}`);
      console.log(`   Permissões: ${JSON.stringify(data.permissoes || [])}`);
      console.log('\n📋 Dados completos:');
      console.log(JSON.stringify(data, null, 2));
    });
  }
} catch (error) {
  console.error('❌ Erro ao buscar usuário:', error.message);
}

console.log('\n' + '='.repeat(70) + '\n');

process.exit(0);
