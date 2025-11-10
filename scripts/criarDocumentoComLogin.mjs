/**
 * CRIAR DOCUMENTO AUTOMATICAMENTE
 * Faz login com renier@reparo.com e cria o documento no Firestore
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import readline from 'readline';

const firebaseConfig = {
  apiKey: "AIzaSyCMhYAH03gzL0H705XjSBp8-4gxhmE246Q",
  authDomain: "oficina-reparofacil.firebaseapp.com",
  projectId: "oficina-reparofacil",
  storageBucket: "oficina-reparofacil.firebasestorage.app",
  messagingSenderId: "610352587990",
  appId: "1:610352587990:web:dc0add122ccb7f54c09577"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

console.log('\n🔧 CRIAR DOCUMENTO PARA renier@reparo.com\n');
console.log('='.repeat(70) + '\n');

async function criarDocumento() {
  try {
    const senha = await question('🔑 Digite a senha de renier@reparo.com: ');
    console.log('');

    if (!senha || senha.trim() === '') {
      console.log('❌ Senha não pode ser vazia!\n');
      rl.close();
      return;
    }

    console.log('1️⃣ Fazendo login...\n');

    const userCredential = await signInWithEmailAndPassword(auth, 'renier@reparo.com', senha);
    const user = userCredential.user;

    console.log('✅ Login bem-sucedido!');
    console.log(`👤 UID: ${user.uid}`);
    console.log(`📧 Email: ${user.email}\n`);

    console.log('2️⃣ Criando documento no Firestore...\n');

    const userDoc = {
      email: 'renier@reparo.com',
      nome: 'Renier Pantoja',
      role: 'super-admin',
      permissoes: ['all'],
      ativo: true,
      // ⚠️ NÃO definir empresaId para acessar dados antigos!
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'usuarios', user.uid), userDoc);

    console.log('✅ DOCUMENTO CRIADO COM SUCESSO!\n');
    console.log('📋 Dados salvos:');
    console.log(JSON.stringify({
      ...userDoc,
      createdAt: 'timestamp',
      updatedAt: 'timestamp'
    }, null, 2));

    console.log('\n' + '='.repeat(70));
    console.log('\n🎉 PRONTO! Agora faça:\n');
    console.log('   1. Abra o sistema no navegador');
    console.log('   2. Faça LOGOUT');
    console.log('   3. Faça LOGIN com renier@reparo.com');
    console.log('   4. Abra Console (F12) e verifique:');
    console.log('      sessionStorage.getItem("empresaId") // deve ser null');
    console.log('   5. Navegue pelas páginas:\n');
    console.log('      ✅ Clientes → 1 cliente');
    console.log('      ✅ Check-ins → 6 check-ins');
    console.log('      ✅ Orçamentos → 2 orçamentos');
    console.log('      ✅ Estoque → 1 produto\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      console.log('\n💡 Senha incorreta! Tente novamente.\n');
    } else if (error.code === 'auth/user-not-found') {
      console.log('\n💡 Usuário não encontrado no Firebase Auth!\n');
    } else if (error.code === 'auth/too-many-requests') {
      console.log('\n💡 Muitas tentativas. Aguarde alguns minutos.\n');
    } else {
      console.log('\nCódigo do erro:', error.code);
    }
  }

  rl.close();
}

criarDocumento().then(() => process.exit(0));
