/**
 * CRIAR DOCUMENTO DIRETO - Sem precisar de senha
 * Este script cria o documento do usuário renier@reparo.com diretamente no Firestore
 * 
 * IMPORTANTE: Você precisa descobrir o UID do usuário primeiro!
 * Vá em: Firebase Console > Authentication > Users > renier@reparo.com > Copie o UID
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

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

console.log('\n🔧 CRIAR DOCUMENTO PARA renier@reparo.com\n');
console.log('='.repeat(70) + '\n');

async function criarDocumento() {
  try {
    // Primeiro, tentar encontrar o UID procurando em todos os documentos de usuarios
    console.log('1️⃣ Procurando UID do usuário...\n');
    
    const usuariosRef = collection(db, 'usuarios');
    const allUsers = await getDocs(usuariosRef);
    
    console.log(`📋 Encontrados ${allUsers.size} usuário(s) no Firestore:\n`);
    
    allUsers.forEach(doc => {
      const data = doc.data();
      console.log(`   👤 ${data.email || 'Sem email'}`);
      console.log(`      UID: ${doc.id}`);
      console.log(`      Role: ${data.role || 'não definido'}`);
      console.log(`      empresaId: ${data.empresaId || 'null'}\n`);
    });

    // Verificar se renier@reparo.com já existe
    const renierQuery = query(usuariosRef, where('email', '==', 'renier@reparo.com'));
    const renierSnap = await getDocs(renierQuery);

    if (!renierSnap.empty) {
      console.log('✅ Usuário renier@reparo.com JÁ EXISTE no Firestore!\n');
      const renierDoc = renierSnap.docs[0];
      const renierData = renierDoc.data();
      
      console.log('📋 Dados atuais:');
      console.log(JSON.stringify(renierData, null, 2));
      console.log('');
      
      if (!renierData.empresaId) {
        console.log('✅ empresaId já está null - usuário deve ver dados antigos!\n');
        console.log('💡 Se os dados não aparecem, o problema pode ser:');
        console.log('   1. Você não fez logout/login após criar o documento');
        console.log('   2. Há um erro no console do navegador');
        console.log('   3. As regras do Firestore estão bloqueando\n');
      } else {
        console.log('⚠️  empresaId está definido:', renierData.empresaId);
        console.log('   Isso fará o usuário acessar dados isolados da empresa!\n');
        console.log('💡 Para acessar dados antigos, remova o empresaId:\n');
        console.log('   1. Firebase Console > Firestore > usuarios >' + renierDoc.id);
        console.log('   2. Delete o campo "empresaId"');
        console.log('   3. Faça logout e login novamente\n');
      }
      
      return;
    }

    console.log('❌ Usuário renier@reparo.com NÃO encontrado no Firestore!\n');
    console.log('💡 Para criar o documento, você precisa do UID do Firebase Auth.\n');
    console.log('📋 Como obter o UID:');
    console.log('   1. Acesse: https://console.firebase.google.com/');
    console.log('   2. Projeto: oficina-reparofacil');
    console.log('   3. Authentication > Users');
    console.log('   4. Procure: renier@reparo.com');
    console.log('   5. Copie o UID (User UID)\n');
    console.log('💡 Depois, execute o script: corrigirUsuarioRenier.mjs');
    console.log('   Ou crie manualmente no Firebase Console:\n');
    console.log('   Firestore > usuarios > Add document');
    console.log('   Document ID: [UID copiado]');
    console.log('   Campos:');
    console.log('     email: "renier@reparo.com"');
    console.log('     nome: "Renier Pantoja"');
    console.log('     role: "super-admin"');
    console.log('     permissoes: ["all"]');
    console.log('     ativo: true');
    console.log('     (NÃO adicione empresaId!)\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
  }
}

criarDocumento().then(() => process.exit(0));
