/**
 * CORREÇÃO URGENTE: Adicionar documento do usuário renier@reparo.com
 * Este script cria o documento no Firestore para que o usuário possa acessar os dados
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
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

console.log('\n🔧 CORREÇÃO URGENTE: Usuário renier@reparo.com\n');
console.log('='.repeat(70) + '\n');

async function corrigirUsuario() {
  try {
    console.log('📧 Email: renier@reparo.com\n');
    
    // Pedir senha
    const senha = await question('🔑 Digite a senha do usuário renier@reparo.com: ');
    console.log('');

    if (!senha || senha.trim() === '') {
      console.log('❌ Senha não pode ser vazia!\n');
      rl.close();
      return;
    }

    console.log('1️⃣ Fazendo login para obter UID...\n');

    // Fazer login para obter UID
    const userCredential = await signInWithEmailAndPassword(auth, 'renier@reparo.com', senha);
    const user = userCredential.user;

    console.log('✅ Login bem-sucedido!');
    console.log(`👤 UID: ${user.uid}\n`);

    // Verificar se documento já existe
    console.log('2️⃣ Verificando se documento já existe...\n');
    const userDocRef = doc(db, 'usuarios', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const existingData = userDocSnap.data();
      console.log('⚠️  Documento já existe!');
      console.log('📋 Dados atuais:');
      console.log(JSON.stringify(existingData, null, 2));
      console.log('');

      const atualizar = await question('❓ Deseja atualizar para Super Admin? (s/n): ');
      
      if (atualizar.toLowerCase() !== 's') {
        console.log('\n❌ Operação cancelada.\n');
        rl.close();
        return;
      }
    }

    // Criar/atualizar documento
    console.log('\n3️⃣ Criando/atualizando documento no Firestore...\n');

    const userDoc = {
      email: 'renier@reparo.com',
      nome: 'Renier Pantoja',
      role: 'super-admin',
      permissoes: ['all'],
      ativo: true,
      // ⚠️ NÃO definir empresaId para acessar dados antigos!
      updatedAt: serverTimestamp()
    };

    // Se não existe, adicionar createdAt
    if (!userDocSnap.exists()) {
      userDoc.createdAt = serverTimestamp();
    }

    await setDoc(userDocRef, userDoc, { merge: true });

    console.log('✅ DOCUMENTO CRIADO/ATUALIZADO COM SUCESSO!\n');
    console.log('📋 Dados salvos:');
    console.log(JSON.stringify(userDoc, null, 2));

    console.log('\n' + '='.repeat(70));
    console.log('\n🎉 CORREÇÃO CONCLUÍDA!\n');
    console.log('📧 Email: renier@reparo.com');
    console.log('👤 UID: ' + user.uid);
    console.log('🎭 Role: super-admin');
    console.log('🏢 empresaId: null (acessa dados antigos na raiz)\n');
    
    console.log('💡 Próximos passos:');
    console.log('   1. Fazer LOGOUT do sistema');
    console.log('   2. Fazer LOGIN com renier@reparo.com');
    console.log('   3. Abrir Console (F12) e verificar:');
    console.log('      sessionStorage.getItem("empresaId") // deve ser null');
    console.log('   4. Navegar pelas páginas:');
    console.log('      - Clientes (deve mostrar 1 cliente)');
    console.log('      - Check-ins (deve mostrar 6 check-ins)');
    console.log('      - Orçamentos (deve mostrar 2 orçamentos)');
    console.log('      - Estoque (deve mostrar 1 produto)\n');

    console.log('✅ Os dados devem aparecer agora!\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      console.log('\n💡 Senha incorreta! Tente novamente.\n');
    } else if (error.code === 'auth/user-not-found') {
      console.log('\n💡 Usuário não encontrado no Firebase Auth!');
      console.log('   Você precisa criar o usuário primeiro no Firebase Console.\n');
    } else {
      console.log('\nCódigo do erro:', error.code);
    }
  }

  rl.close();
}

corrigirUsuario().then(() => process.exit(0));
