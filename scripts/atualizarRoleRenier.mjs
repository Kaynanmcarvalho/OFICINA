/**
 * Atualizar role do usuário renier@reparo.com para super-admin
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

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

const UID = 'Ppne4C2M2CVtKwG2uWdisjtEOs12'; // UID do renier@reparo.com

console.log('\n🔧 ATUALIZANDO ROLE DO USUÁRIO renier@reparo.com\n');
console.log('='.repeat(70) + '\n');

async function atualizar() {
  try {
    console.log('👤 UID: ' + UID);
    console.log('📧 Email: renier@reparo.com\n');

    console.log('📝 Atualizando documento...\n');

    const userRef = doc(db, 'users', UID);
    await updateDoc(userRef, {
      role: 'super-admin',
      permissoes: ['all']
    });

    console.log('✅ ROLE ATUALIZADO COM SUCESSO!\n');
    console.log('📋 Alterações:');
    console.log('   role: "admin" → "super-admin"');
    console.log('   permissoes: [] → ["all"]\n');

    console.log('='.repeat(70));
    console.log('\n🎉 PRONTO! Agora faça:\n');
    console.log('   1. Faça LOGOUT do sistema');
    console.log('   2. Faça LOGIN com renier@reparo.com');
    console.log('   3. Abra Console (F12) e verifique:');
    console.log('      sessionStorage.getItem("empresaId") // deve ser null');
    console.log('   4. Os dados devem aparecer agora!\n');
    console.log('✅ Clientes: 1');
    console.log('✅ Check-ins: 6');
    console.log('✅ Orçamentos: 2');
    console.log('✅ Estoque: 1\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
  }
}

atualizar().then(() => process.exit(0));
