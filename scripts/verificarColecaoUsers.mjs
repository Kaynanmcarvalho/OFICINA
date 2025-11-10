/**
 * Verificar coleção "users" no Firebase
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

console.log('\n🔍 VERIFICANDO COLEÇÃO "users"\n');
console.log('='.repeat(70) + '\n');

async function verificar() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    console.log(`📦 Coleção "users": ${snapshot.size} documento(s)\n`);

    if (snapshot.empty) {
      console.log('⚠️  Coleção "users" está vazia!\n');
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`👤 ${data.email || data.nome || 'Sem identificação'}`);
        console.log(`   UID: ${doc.id}`);
        console.log(`   Role: ${data.role || 'não definido'}`);
        console.log(`   empresaId: ${data.empresaId || 'null'}`);
        console.log('   Dados completos:');
        console.log(JSON.stringify(data, null, 2));
        console.log('');
      });
    }

    // Verificar também "usuarios"
    console.log('='.repeat(70) + '\n');
    console.log('📦 Coleção "usuarios" (para comparação):\n');
    
    const usuariosRef = collection(db, 'usuarios');
    const usuariosSnap = await getDocs(usuariosRef);
    
    console.log(`   ${usuariosSnap.size} documento(s)\n`);

    if (!usuariosSnap.empty) {
      usuariosSnap.forEach(doc => {
        const data = doc.data();
        console.log(`   👤 ${data.email || 'Sem email'}`);
      });
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n💡 CONCLUSÃO:\n');
    
    if (snapshot.size > 0 && usuariosSnap.size === 0) {
      console.log('✅ Os usuários estão na coleção "users"');
      console.log('❌ O código está buscando em "usuarios"');
      console.log('\n🔧 SOLUÇÃO: Alterar o código para buscar em "users"\n');
    } else if (snapshot.size === 0 && usuariosSnap.size > 0) {
      console.log('✅ Os usuários estão na coleção "usuarios"');
      console.log('✅ O código está correto\n');
    } else if (snapshot.size > 0 && usuariosSnap.size > 0) {
      console.log('⚠️  Existem usuários em AMBAS as coleções!');
      console.log('💡 Você precisa decidir qual usar e migrar os dados\n');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verificar().then(() => process.exit(0));
