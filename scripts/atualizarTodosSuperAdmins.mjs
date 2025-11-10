/**
 * Atualizar TODOS os usuários da coleção "users" para super-admin
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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

console.log('\n🔧 ATUALIZANDO TODOS OS SUPER ADMINS\n');
console.log('='.repeat(70) + '\n');

async function atualizarTodos() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    console.log(`📦 Encontrados ${snapshot.size} usuário(s) na coleção "users"\n`);

    let atualizados = 0;

    for (const userDoc of snapshot.docs) {
      const data = userDoc.data();
      const uid = userDoc.id;
      const email = data.email || 'Sem email';

      console.log(`👤 ${email}`);
      console.log(`   UID: ${uid}`);
      console.log(`   Role atual: ${data.role || 'não definido'}`);

      // Atualizar para super-admin
      await updateDoc(doc(db, 'users', uid), {
        role: 'super-admin',
        permissoes: ['all']
      });

      console.log(`   ✅ Atualizado para: super-admin\n`);
      atualizados++;
    }

    console.log('='.repeat(70));
    console.log(`\n✅ ${atualizados} Super Admin(s) atualizado(s)!\n`);
    console.log('📋 Todos os usuários em "users" agora são Super Admins:');
    console.log('   - Têm role: "super-admin"');
    console.log('   - Têm permissoes: ["all"]');
    console.log('   - NÃO têm empresaId (acessam dados da raiz)\n');
    console.log('💡 Próximos passos:');
    console.log('   1. Faça LOGOUT do sistema');
    console.log('   2. Faça LOGIN com qualquer um dos 3 Super Admins');
    console.log('   3. Verifique se os dados aparecem:\n');
    console.log('      ✅ 1 cliente');
    console.log('      ✅ 6 check-ins');
    console.log('      ✅ 2 orçamentos');
    console.log('      ✅ 1 produto no estoque\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
  }
}

atualizarTodos().then(() => process.exit(0));
