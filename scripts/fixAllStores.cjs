/**
 * Script para corrigir todos os stores de uma vez
 * Aplica isolamento multi-tenant usando storeHelpers
 */

const fs = require('fs');
const path = require('path');

const STORES_TO_FIX = [
  { file: 'vehicleStore.jsx', collection: 'vehicles' },
  { file: 'toolStore.jsx', collection: 'tools' },
  { file: 'teamStore.jsx', collections: ['team_members', 'schedules'] },
  { file: 'motorcycleStore.jsx', collection: 'motorcycles' }
];

const STORES_DIR = path.join(__dirname, '../src/store');

function fixStore(storeInfo) {
  const filePath = path.join(STORES_DIR, storeInfo.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${storeInfo.file}`);
    return false;
  }
  
  console.log(`\n🔧 Corrigindo: ${storeInfo.file}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // 1. Remover imports do Firebase (linha por linha para evitar problemas de regex)
  const firebaseImports = [
    /import\s*\{[^}]*\}\s*from\s*['"]firebase\/firestore['"];?\s*/g,
    /import\s*\{\s*db\s*\}\s*from\s*['"]\.\.\/config\/firebase['"];?\s*/g
  ];
  
  firebaseImports.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  // 2. Adicionar import do storeHelpers
  if (!content.includes('storeHelpers')) {
    const zustandImport = /import\s*\{\s*create\s*\}\s*from\s*['"]zustand['"];/;
    content = content.replace(zustandImport, (match) => {
      return `${match}\nimport {\n  addDocument,\n  getAllDocuments,\n  getDocumentById,\n  updateDocument,\n  deleteDocument,\n  subscribeToCollection\n} from '../services/storeHelpers';`;
    });
  }
  
  // 3. Substituir operações do Firestore
  
  // addDoc
  content = content.replace(
    /const\s+docRef\s*=\s*await\s+addDoc\(collection\(db,\s*['"]([^'"]+)['"]\),\s*([^)]+)\);\s*const\s+(\w+)\s*=\s*\{\s*\.\.\.([^,]+),\s*firestoreId:\s*docRef\.id\s*\};/g,
    "const $3 = await addDocument('$1', $4);"
  );
  
  // updateDoc
  content = content.replace(
    /const\s+(\w+)Ref\s*=\s*doc\(db,\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\);\s*([^]*?)await\s+updateDoc\(\1Ref,\s*([^)]+)\);/g,
    (match, refName, collection, id, middle, data) => {
      return `${middle}await updateDocument('${collection}', ${id}, ${data});`;
    }
  );
  
  // deleteDoc
  content = content.replace(
    /await\s+deleteDoc\(doc\(db,\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\)\);/g,
    "await deleteDocument('$1', $2);"
  );
  
  // getDoc
  content = content.replace(
    /const\s+docRef\s*=\s*doc\(db,\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\);\s*const\s+docSnap\s*=\s*await\s+getDoc\(docRef\);/g,
    "const docSnap = await getDocumentById('$1', $2);"
  );
  
  // Ajustar verificação de existência
  content = content.replace(
    /if\s*\(docSnap\.exists\(\)\)\s*\{/g,
    "if (docSnap) {"
  );
  
  content = content.replace(
    /const\s+(\w+)\s*=\s*\{\s*\.\.\.docSnap\.data\(\),\s*firestoreId:\s*docSnap\.id\s*\};/g,
    "const $1 = docSnap;"
  );
  
  // getDocs com query
  content = content.replace(
    /const\s+q\s*=\s*query\(\s*collection\(db,\s*['"]([^'"]+)['"]\),\s*orderBy\(['"]([^'"]+)['"]\)\s*\);\s*const\s+querySnapshot\s*=\s*await\s+getDocs\(q\);\s*const\s+(\w+)\s*=\s*querySnapshot\.docs\.map\(doc\s*=>\s*\(\{\s*\.\.\.doc\.data\(\),\s*firestoreId:\s*doc\.id,?\s*\}\)\);/g,
    "const $3 = await getAllDocuments('$1', {\n      orderBy: { field: '$2', direction: 'asc' }\n    });"
  );
  
  // onSnapshot
  content = content.replace(
    /const\s+q\s*=\s*query\(\s*collection\(db,\s*['"]([^'"]+)['"]\),\s*orderBy\(['"]([^'"]+)['"]\)\s*\);\s*return\s+onSnapshot\(q,\s*\(querySnapshot\)\s*=>\s*\{\s*const\s+(\w+)\s*=\s*querySnapshot\.docs\.map\(doc\s*=>\s*\(\{\s*\.\.\.doc\.data\(\),\s*firestoreId:\s*doc\.id,?\s*\}\)\);\s*set\(\{\s*\3\s*\}\);?\s*\}\);/g,
    "return subscribeToCollection('$1', ($3) => {\n      set({ $3 });\n    }, {\n      orderBy: { field: '$2', direction: 'asc' }\n    });"
  );
  
  // Verificar se houve mudanças
  if (content === originalContent) {
    console.log(`⚠️  Nenhuma mudança em: ${storeInfo.file}`);
    return false;
  }
  
  // Salvar arquivo corrigido
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Corrigido: ${storeInfo.file}`);
  return true;
}

function main() {
  console.log('🔧 Iniciando correção de isolamento de dados...\n');
  
  let fixedCount = 0;
  
  STORES_TO_FIX.forEach(storeInfo => {
    if (fixStore(storeInfo)) {
      fixedCount++;
    }
  });
  
  console.log(`\n✅ Correção concluída! ${fixedCount}/${STORES_TO_FIX.length} stores corrigidos.`);
  console.log('\n⚠️  IMPORTANTE: Revise os arquivos e teste o sistema!');
}

main();
