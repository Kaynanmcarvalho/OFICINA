/**
 * Script para corrigir isolamento de dados em todos os stores
 * 
 * Substitui queries diretas ao Firestore por storeHelpers
 */

const fs = require('fs');
const path = require('path');

const STORES_TO_FIX = [
  'budgetStore.jsx',
  'inventoryStore.jsx',
  'vehicleStore.jsx',
  'toolStore.jsx',
  'teamStore.jsx',
  'motorcycleStore.jsx'
];

const STORES_DIR = path.join(__dirname, '../src/store');

// Mapeamento de substituições
const replacements = [
  // Imports
  {
    from: /import\s*{\s*collection,\s*addDoc,\s*updateDoc,\s*deleteDoc,\s*doc,\s*getDocs,\s*getDoc,\s*query,\s*where,\s*orderBy,\s*limit,\s*onSnapshot[^}]*}\s*from\s*['"]firebase\/firestore['"];?/g,
    to: ''
  },
  {
    from: /import\s*{\s*db\s*}\s*from\s*['"]\.\.\/config\/firebase['"];?/g,
    to: ''
  },
  // Adicionar import do storeHelpers no início
  {
    from: /(import\s*{\s*create\s*}\s*from\s*['"]zustand['"];)/,
    to: `$1\nimport {\n  addDocument,\n  getAllDocuments,\n  getDocumentById,\n  updateDocument,\n  deleteDocument,\n  subscribeToCollection\n} from '../services/storeHelpers';`
  },
  // Substituir addDoc
  {
    from: /await\s+addDoc\(collection\(db,\s*['"]([^'"]+)['"]\),\s*([^)]+)\)/g,
    to: 'await addDocument(\'$1\', $2)'
  },
  // Substituir getDocs com query
  {
    from: /await\s+getDocs\(query\(collection\(db,\s*['"]([^'"]+)['"]\)[^)]*\)\)/g,
    to: 'await getAllDocuments(\'$1\', { orderBy: { field: \'createdAt\', direction: \'desc\' } })'
  },
  // Substituir getDocs simples
  {
    from: /await\s+getDocs\(collection\(db,\s*['"]([^'"]+)['"]\)\)/g,
    to: 'await getAllDocuments(\'$1\')'
  },
  // Substituir getDoc
  {
    from: /await\s+getDoc\(doc\(db,\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\)\)/g,
    to: 'await getDocumentById(\'$1\', $2)'
  },
  // Substituir updateDoc
  {
    from: /await\s+updateDoc\(doc\(db,\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\),\s*([^)]+)\)/g,
    to: 'await updateDocument(\'$1\', $2, $3)'
  },
  // Substituir deleteDoc
  {
    from: /await\s+deleteDoc\(doc\(db,\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\)\)/g,
    to: 'await deleteDocument(\'$1\', $2)'
  },
  // Substituir onSnapshot
  {
    from: /onSnapshot\(query\(collection\(db,\s*['"]([^'"]+)['"]\)[^)]*\),\s*\(([^)]+)\)\s*=>\s*{([^}]+)}\)/g,
    to: 'subscribeToCollection(\'$1\', ($2) => {$3}, { orderBy: { field: \'createdAt\', direction: \'desc\' } })'
  }
];

function fixStore(storeName) {
  const filePath = path.join(STORES_DIR, storeName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${storeName}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Aplicar todas as substituições
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  // Verificar se houve mudanças
  if (content === originalContent) {
    console.log(`⚠️  Nenhuma mudança necessária em: ${storeName}`);
    return false;
  }
  
  // Salvar arquivo
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Corrigido: ${storeName}`);
  return true;
}

function main() {
  console.log('🔧 Iniciando correção de isolamento de dados...\n');
  
  let fixedCount = 0;
  
  STORES_TO_FIX.forEach(storeName => {
    if (fixStore(storeName)) {
      fixedCount++;
    }
  });
  
  console.log(`\n✅ Correção concluída! ${fixedCount}/${STORES_TO_FIX.length} stores corrigidos.`);
}

main();
