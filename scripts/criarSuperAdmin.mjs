/**
 * Criar usuário Super Admin no Firestore
 * Para: renier@reparo.com
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
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
const auth = getAuth(app);
const db = getFirestore(app);

console.log('\n🔧 CRIANDO SUPER ADMIN: renier@reparo.com\n');
console.log('='.repeat(70) + '\n');

const email = 'renier@reparo.com';
const senha = 'senha123'; // ALTERE ESTA SENHA!

async function criarSuperAdmin() {
  try {
    console.log('1️⃣ Tentando fazer login para obter UID...\n');
    
    let user;
    try {
      // Tentar fazer login primeiro
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      user = userCredential.user;
      console.log('✅ Usuário já existe no Firebase Auth');
      console.log(`   UID: ${user.uid}\n`);
    } catch (loginError) {
      if (loginError.code === 'auth/user-not-found' || loginError.code === 'auth/wrong-password') {
        console.log('⚠️  Usuário não encontrado, criando novo...\n');
        
        // Criar novo usuário
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        user = userCredential.user;
        console.log('✅ Usuário criado no Firebase Auth');
        console.log(`   UID: ${user.uid}\n`);
      } else {
        throw loginError;
      }
    }

    console.log('2️⃣ Criando documento no Firestore...\n');

    // Criar documento do usuário no Firestore
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

    await setDoc(doc(db, 'usuarios', user.uid), userDoc);

    console.log('✅ Documento criado no Firestore!');
    console.log('\n📋 Dados do Super Admin:');
    console.log(JSON.stringify(userDoc, null, 2));

    console.log('\n' + '='.repeat(70));
    console.log('\n🎉 SUPER ADMIN CRIADO COM SUCESSO!\n');
    console.log('📧 Email: renier@reparo.com');
    console.log('🔑 Senha: ' + senha);
    console.log('👤 UID: ' + user.uid);
    console.log('🎭 Role: super-admin');
    console.log('🏢 empresaId: null (acessa dados antigos)\n');
    console.log('💡 Próximos passos:');
    console.log('   1. Fazer logout do sistema');
    console.log('   2. Fazer login com renier@reparo.com');
    console.log('   3. Verificar se os dados aparecem\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('\nCódigo do erro:', error.code);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n💡 O email já está em uso. Tente fazer login manualmente.');
    }
  }
}

criarSuperAdmin().then(() => process.exit(0));
