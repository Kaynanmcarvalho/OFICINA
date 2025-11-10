/**
 * Script para corrigir referências restantes nos stores
 */

const fs = require('fs');
const path = require('path');

const STORES_DIR = path.join(__dirname, '../src/store');

const stores = [
  'vehicleStore.jsx',
  'toolStore.jsx',
  'teamStore.jsx',
  'motorcycleStore.jsx'
];

stores.forEach(storeName => {
  const filePath = path.join(STORES_DIR, storeName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${storeName}`);
    return;
  }
  
  console.log(`\n🔧 Corrigindo: ${storeName}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Substituir fetchVehicles/fetchTools/fetchMotorcycles/fetchSchedules
  content = content.replace(
    /const q = query\(\s*collection\(db, '([^']+)'\),\s*orderBy\('([^']+)'(?:, '([^']+)')?\)\s*\);\s*const querySnapshot = await getDocs\(q\);\s*const (\w+) = querySnapshot\.docs\.map\(doc => \(\{\s*\.\.\.doc\.data\(\),\s*firestoreId: doc\.id,?\s*\}\)\);/g,
    (match, collection, field, direction, varName) => {
      const dir = direction || 'asc';
      return `const ${varName} = await getAllDocuments('${collection}', {\n      orderBy: { field: '${field}', direction: '${dir}' }\n    });`;
    }
  );
  
  // Substituir searchVehicles/searchTools/searchMotorcycles (busca local)
  content = content.replace(
    /\/\/ Search by (\w+)\s*const (\w+)Query = query\(\s*collection\(db, '([^']+)'\),\s*where\('([^']+)', '>=', searchTerm\),\s*where\('[^']+', '<=', searchTerm \+ '\\uf8ff'\),?\s*(?:orderBy\('[^']+'\),?)?\s*(?:limit\(\d+\)\)?)?\s*\);/g,
    '// Search by $1 - usando busca local'
  );
  
  // Remover getDocs de queries de busca
  content = content.replace(
    /const \[(\w+), (\w+), (\w+)(?:, (\w+))?\] = await Promise\.all\(\[\s*getDocs\((\w+)Query\),\s*getDocs\((\w+)Query\),\s*getDocs\((\w+)Query\)(?:,\s*getDocs\((\w+)Query\))?\s*\]\);/g,
    '// Buscar todos e filtrar localmente\n    const allItems = await getAllDocuments(\'$3\');\n    const searchLower = searchTerm.toLowerCase();'
  );
  
  // Simplificar busca para usar getAllDocuments e filtrar localmente
  const searchPattern = /searchVehicles: async \(searchTerm\) => \{[\s\S]*?try \{[\s\S]*?\/\/ Search by[\s\S]*?const allResults = new Map\(\);[\s\S]*?return \{ success: true, data: searchResults \};[\s\S]*?\} catch/;
  
  if (searchPattern.test(content)) {
    content = content.replace(
      searchPattern,
      `searchVehicles: async (searchTerm) => {
    set({ isLoading: true, error: null });
    try {
      // Buscar todos e filtrar localmente para melhor suporte multi-tenant
      const allItems = await getAllDocuments('vehicles');
      const searchLower = searchTerm.toLowerCase();
      
      const searchResults = allItems.filter(item =>
        item.vehicleId?.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower) ||
        item.model?.toLowerCase().includes(searchLower) ||
        item.clientId?.toLowerCase().includes(searchLower) ||
        item.plate?.toLowerCase().includes(searchLower)
      ).slice(0, 20);

      set({ searchResults, isLoading: false });
      return { success: true, data: searchResults };
    } catch`
    );
  }
  
  // Salvar
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Corrigido: ${storeName}`);
});

console.log('\n✅ Correções aplicadas!');
