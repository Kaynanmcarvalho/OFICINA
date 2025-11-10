/**
 * Adicionar documento de usuário no Firestore
 * Use este script se o usuário JÁ EXISTE no Firebase Auth
 * mas NÃO TEM documento no Firestore
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

console.log('\n🔧 ADICIONAR DOCUMENTO DE USUÁRIO NO FIRESTORE\n');
console.log('='.repeat(70) + '\n');

// ⚠️ IMPORTANTE: Você precisa descobrir o UID do usuário renier@reparo.com
// Opções para descobrir:
// 1. Firebase Console > Authentication > Users
// 2. Fazer login no sistema e ver no console: auth.currentUser.uid
// 3. Usar Firebase Admin SDK

const UID = 'COLE_O_UID_AQUI'; // ⚠️ SUBSTITUA PELO UID REAL!
const email = 'renier@reparo.com';

async function adicionarDocumento() {
  if (UID === 'COLE_O_UID_AQUI') {
    console.log('❌ ERRO: Você precisa substituir o UID no script!\n');
    console.log('💡 Como descobrir o UID:');
    console.log('   1. Acesse: https://console.firebase.google.com/');
    console.log('   2. Vá em Authentication > Users');
    console.log('   3. Procure por renier@reparo.com');
    console.log('   4. Copie o UID');
    console.log('   5. Cole no script na linha: const UID = "..."\n');
    return;
  }

  try {
    console.log(`📧 Email: ${email}`);
    console.log(`👤 UID: ${UID}\n`);

    const userDoc = {
      email: email,
      nome: 'Renier Pantoja',
      role: 'super-admin',
      permissoes: ['all'],
      ativo: true,
      // NÃO definir empresaId para Super Admin acessar dados antigos
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    console.log('📝 Criando documento...\n');
    await setDoc(doc(db, 'usuarios', UID), userDoc);

    console.log('✅ DOCUMENTO CRIADO COM SUCESSO!\n');
    console.log('📋 Dados salvos:');
    console.log(JSON.stringify(userDoc, null, 2));

    console.log('\n' + '='.repeat(70));
    console.log('\n🎉 PRONTO! Agora faça:');
    console.log('   1. Logout do sistema');
    console.log('   2. Login com renier@reparo.com');
    console.log('   3. Os dados devem aparecer!\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
  }
}

adicionarDocumento().then(() => process.exit(0));
