/**
 * TESTES DO ENGINE DE COMPATIBILIDADE V2
 * 
 * Execute: node test-v2.js
 */

import { 
  generateCompatibility, 
  findPartByNumber, 
  findEquivalents, 
  searchParts,
  getDatabaseStats 
} from './src/engine/compatibilityEngineV2.js';

console.log('🔧 TESTE DO ENGINE DE COMPATIBILIDADE V2\n');
console.log('='.repeat(60));

// Teste 1: Estatísticas do banco
console.log('\n📊 1. ESTATÍSTICAS DO BANCO DE DADOS\n');
const stats = getDatabaseStats();
console.log(`   Total de peças: ${stats.totalParts}`);
console.log(`   Total de equivalentes: ${stats.totalEquivalents}`);
console.log(`   Total de aplicações: ${stats.totalApplications}`);
console.log(`   Total de marcas: ${stats.totalBrands}`);
console.log(`   Categorias: ${Object.keys(stats.categories).length}`);
console.log('\n   Detalhes por categoria:');
for (const [cat, catStats] of Object.entries(stats.categories)) {
  console.log(`   - ${cat}: ${catStats.parts} peças, ${catStats.equivalents} equivalentes`);
}

// Teste 2: Compatibilidade para carro popular
console.log('\n' + '='.repeat(60));
console.log('\n🚗 2. COMPATIBILIDADE - VW GOL G7 1.0\n');
const golResult = generateCompatibility({
  brand: 'VW',
  model: 'Gol G7',
  year: 2020,
  engine: 'EA111 1.0',
  vehicleType: 'car',
});
console.log(`   Veículo: ${golResult.vehicleName}`);
console.log(`   Cobertura: ${(golResult.coverage * 100).toFixed(1)}%`);
console.log(`   Confiança: ${(golResult.confidence * 100).toFixed(1)}%`);
console.log(`   Peças encontradas: ${golResult.totalPartsFound}`);
console.log(`   Equivalentes disponíveis: ${golResult.totalEquivalents}`);
console.log('\n   Peças compatíveis:');
for (const part of golResult.compatibleParts.slice(0, 5)) {
  console.log(`   - ${part.partTypeName}: ${part.partNumber} (${part.brand}) - ${(part.confidence * 100).toFixed(0)}%`);
  if (part.equivalents?.length > 0) {
    console.log(`     Equivalentes: ${part.equivalents.slice(0, 3).join(', ')}`);
  }
}

// Teste 3: Compatibilidade para moto
console.log('\n' + '='.repeat(60));
console.log('\n🏍️ 3. COMPATIBILIDADE - HONDA CB300R\n');
const cb300Result = generateCompatibility({
  brand: 'Honda',
  model: 'CB300R',
  year: 2022,
  vehicleType: 'motorcycle',
});
console.log(`   Veículo: ${cb300Result.vehicleName}`);
console.log(`   Cobertura: ${(cb300Result.coverage * 100).toFixed(1)}%`);
console.log(`   Confiança: ${(cb300Result.confidence * 100).toFixed(1)}%`);
console.log(`   Peças encontradas: ${cb300Result.totalPartsFound}`);
console.log('\n   Peças compatíveis:');
for (const part of cb300Result.compatibleParts.slice(0, 5)) {
  console.log(`   - ${part.partTypeName}: ${part.partNumber} (${part.brand}) - ${(part.confidence * 100).toFixed(0)}%`);
}

// Teste 4: Busca por part number
console.log('\n' + '='.repeat(60));
console.log('\n🔍 4. BUSCA POR PART NUMBER - W712/95\n');
const partResult = findPartByNumber('W712/95');
if (partResult.found) {
  console.log(`   Part Number: ${partResult.partNumber}`);
  console.log(`   Marca: ${partResult.brand}`);
  console.log(`   OEM: ${partResult.oem}`);
  console.log(`   Categoria: ${partResult.category}`);
  console.log(`   Aplicações: ${partResult.applications?.slice(0, 5).join(', ')}...`);
  console.log(`   Equivalentes: ${partResult.equivalents?.join(', ')}`);
} else {
  console.log('   Peça não encontrada');
}

// Teste 5: Busca de equivalentes
console.log('\n' + '='.repeat(60));
console.log('\n🔄 5. EQUIVALENTES - FRAM PH6811\n');
const eqResult = findEquivalents('FRAM PH6811');
if (eqResult.found) {
  console.log(`   Original: ${eqResult.original.partNumber} (${eqResult.original.brand})`);
  console.log(`   Total de equivalentes: ${eqResult.totalEquivalents}`);
  console.log('\n   Equivalentes:');
  for (const eq of eqResult.equivalents.slice(0, 5)) {
    console.log(`   - ${eq.partNumber} (${eq.brand || 'N/A'})`);
  }
} else {
  console.log('   Peça não encontrada');
}

// Teste 6: Busca por termo
console.log('\n' + '='.repeat(60));
console.log('\n🔎 6. BUSCA POR TERMO - "Civic"\n');
const searchResult = searchParts('Civic', { limit: 10 });
console.log(`   Resultados encontrados: ${searchResult.length}`);
console.log('\n   Peças:');
for (const part of searchResult.slice(0, 5)) {
  console.log(`   - ${part.partNumber} (${part.brand}) - ${part.category}`);
  console.log(`     Encontrado em: ${part.matchedIn}`);
}

// Teste 7: Compatibilidade para carro premium
console.log('\n' + '='.repeat(60));
console.log('\n🚙 7. COMPATIBILIDADE - BMW 320i F30\n');
const bmwResult = generateCompatibility({
  brand: 'BMW',
  model: '320i F30',
  year: 2018,
  engine: 'N20B20',
  vehicleType: 'car',
});
console.log(`   Veículo: ${bmwResult.vehicleName}`);
console.log(`   Cobertura: ${(bmwResult.coverage * 100).toFixed(1)}%`);
console.log(`   Confiança: ${(bmwResult.confidence * 100).toFixed(1)}%`);
console.log(`   Peças encontradas: ${bmwResult.totalPartsFound}`);
console.log('\n   Peças compatíveis:');
for (const part of bmwResult.compatibleParts.slice(0, 5)) {
  console.log(`   - ${part.partTypeName}: ${part.partNumber} (${part.brand})`);
}

// Teste 8: Peças compartilhadas
console.log('\n' + '='.repeat(60));
console.log('\n🔗 8. PEÇAS COMPARTILHADAS\n');
if (golResult.sharedParts.length > 0) {
  console.log(`   Total de peças compartilhadas: ${golResult.sharedParts.length}`);
  for (const shared of golResult.sharedParts.slice(0, 3)) {
    console.log(`\n   ${shared.partNumber} (${shared.partName}):`);
    console.log(`   Compartilhada com ${shared.totalShared} veículos:`);
    for (const v of shared.sharedWith.slice(0, 3)) {
      console.log(`   - ${v.brand} ${v.model}`);
    }
    if (shared.economySuggestion) {
      console.log(`   💰 ${shared.economySuggestion.description} (${shared.economySuggestion.savings})`);
    }
  }
} else {
  console.log('   Nenhuma peça compartilhada encontrada');
}

// Teste 9: Cross-references
console.log('\n' + '='.repeat(60));
console.log('\n📋 9. CROSS-REFERENCES\n');
if (golResult.crossReferences.length > 0) {
  console.log(`   Total de cross-references: ${golResult.crossReferences.length}`);
  for (const cr of golResult.crossReferences.slice(0, 3)) {
    console.log(`\n   ${cr.original} (${cr.brand}) - ${cr.partType}:`);
    console.log(`   Equivalentes: ${cr.equivalents.slice(0, 4).join(', ')}`);
  }
} else {
  console.log('   Nenhum cross-reference encontrado');
}

// Teste 10: Compatibilidade para moto esportiva
console.log('\n' + '='.repeat(60));
console.log('\n🏍️ 10. COMPATIBILIDADE - KAWASAKI NINJA ZX-10R\n');
const zx10Result = generateCompatibility({
  brand: 'Kawasaki',
  model: 'Ninja ZX-10R',
  year: 2021,
  vehicleType: 'motorcycle',
});
console.log(`   Veículo: ${zx10Result.vehicleName}`);
console.log(`   Cobertura: ${(zx10Result.coverage * 100).toFixed(1)}%`);
console.log(`   Confiança: ${(zx10Result.confidence * 100).toFixed(1)}%`);
console.log(`   Peças encontradas: ${zx10Result.totalPartsFound}`);
console.log('\n   Peças compatíveis:');
for (const part of zx10Result.compatibleParts) {
  console.log(`   - ${part.partTypeName}: ${part.partNumber} (${part.brand})`);
}

console.log('\n' + '='.repeat(60));
console.log('\n✅ TESTES CONCLUÍDOS!\n');
