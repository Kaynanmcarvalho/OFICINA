/**
 * Script de Validação - Verifica se TODOS os veículos retornam peças
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════');
console.log('   VALIDAÇÃO DE COMPATIBILIDADE DE PEÇAS V4');
console.log('   Verificando se TODOS os veículos têm peças');
console.log('═══════════════════════════════════════════════════════════════\n');

// Carrega dados V4
const dataPath = path.join(__dirname, 'output/parts-compatibility-v4-full.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const vehicles = data.vehicles;
const stats = data.stats;

console.log(`📊 Total de veículos: ${stats.totalVehicles}`);
console.log(`📋 Total de peças: ${stats.totalParts}`);
console.log(`📈 Média de peças/veículo: ${stats.avgPartsPerVehicle}\n`);

// Validação 1: Veículos sem peças
console.log('🔍 Verificando veículos sem peças...');
const vehiclesWithoutParts = [];
const vehiclesWithFewParts = [];
const partsCount = {};

for (const [vehicleId, vehicle] of Object.entries(vehicles)) {
  const numParts = vehicle.parts?.length || 0;
  
  if (numParts === 0) {
    vehiclesWithoutParts.push({
      id: vehicleId,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      platform: vehicle.platform,
    });
  } else if (numParts < 30) {
    vehiclesWithFewParts.push({
      id: vehicleId,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      platform: vehicle.platform,
      numParts,
    });
  }
  
  if (!partsCount[numParts]) {
    partsCount[numParts] = 0;
  }
  partsCount[numParts]++;
}

if (vehiclesWithoutParts.length === 0) {
  console.log('   ✅ TODOS os veículos têm peças!\n');
} else {
  console.log(`   ❌ ${vehiclesWithoutParts.length} veículos SEM peças:\n`);
  vehiclesWithoutParts.slice(0, 10).forEach(v => {
    console.log(`      - ${v.brand} ${v.model} ${v.year} (${v.platform})`);
  });
  if (vehiclesWithoutParts.length > 10) {
    console.log(`      ... e mais ${vehiclesWithoutParts.length - 10} veículos`);
  }
  console.log('');
}

if (vehiclesWithFewParts.length > 0) {
  console.log(`   ⚠️ ${vehiclesWithFewParts.length} veículos com POUCAS peças (<30):\n`);
  vehiclesWithFewParts.slice(0, 5).forEach(v => {
    console.log(`      - ${v.brand} ${v.model} ${v.year}: ${v.numParts} peças`);
  });
  console.log('');
}

// Validação 2: Distribuição de peças
console.log('📊 Distribuição de peças por veículo:');
const sortedCounts = Object.entries(partsCount).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
for (const [count, numVehicles] of sortedCounts) {
  const percent = ((numVehicles / stats.totalVehicles) * 100).toFixed(1);
  console.log(`   ${count} peças: ${numVehicles} veículos (${percent}%)`);
}
console.log('');

// Validação 3: Cobertura por marca
console.log('📊 Cobertura por marca:');
const brandStats = {};
for (const vehicle of Object.values(vehicles)) {
  if (!brandStats[vehicle.brand]) {
    brandStats[vehicle.brand] = { total: 0, withParts: 0, avgParts: 0, totalParts: 0 };
  }
  brandStats[vehicle.brand].total++;
  if (vehicle.parts?.length > 0) {
    brandStats[vehicle.brand].withParts++;
    brandStats[vehicle.brand].totalParts += vehicle.parts.length;
  }
}

// Calcula média e ordena por total
for (const brand of Object.keys(brandStats)) {
  if (brandStats[brand].withParts > 0) {
    brandStats[brand].avgParts = Math.round(brandStats[brand].totalParts / brandStats[brand].withParts);
  }
}

const sortedBrands = Object.entries(brandStats)
  .sort((a, b) => b[1].total - a[1].total)
  .slice(0, 20);

for (const [brand, stats] of sortedBrands) {
  const coverage = ((stats.withParts / stats.total) * 100).toFixed(0);
  console.log(`   ${brand}: ${stats.total} veículos, ${coverage}% cobertura, ~${stats.avgParts} peças/veículo`);
}
console.log('');

// Validação 4: Cobertura por plataforma
console.log('📊 Cobertura por plataforma:');
const platformStats = {};
for (const vehicle of Object.values(vehicles)) {
  if (!platformStats[vehicle.platform]) {
    platformStats[vehicle.platform] = { total: 0, avgParts: 0, totalParts: 0 };
  }
  platformStats[vehicle.platform].total++;
  platformStats[vehicle.platform].totalParts += vehicle.parts?.length || 0;
}

for (const platform of Object.keys(platformStats)) {
  platformStats[platform].avgParts = Math.round(platformStats[platform].totalParts / platformStats[platform].total);
}

const sortedPlatforms = Object.entries(platformStats)
  .sort((a, b) => b[1].total - a[1].total)
  .slice(0, 15);

for (const [platform, stats] of sortedPlatforms) {
  console.log(`   ${platform}: ${stats.total} veículos, ~${stats.avgParts} peças/veículo`);
}
console.log('');

// Validação 5: Teste de busca por ano
console.log('📊 Cobertura por ano (amostra):');
const yearStats = {};
for (const vehicle of Object.values(vehicles)) {
  if (!yearStats[vehicle.year]) {
    yearStats[vehicle.year] = 0;
  }
  yearStats[vehicle.year]++;
}

const years = Object.keys(yearStats).map(Number).sort((a, b) => b - a);
const recentYears = years.slice(0, 10);
for (const year of recentYears) {
  console.log(`   ${year}: ${yearStats[year]} veículos`);
}
console.log('');

// Resumo final
console.log('═══════════════════════════════════════════════════════════════');
console.log('   RESUMO DA VALIDAÇÃO');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`   ✅ Total de veículos: ${stats.totalVehicles}`);
console.log(`   ✅ Veículos com peças: ${stats.totalVehicles - vehiclesWithoutParts.length}`);
console.log(`   ${vehiclesWithoutParts.length === 0 ? '✅' : '❌'} Veículos sem peças: ${vehiclesWithoutParts.length}`);
console.log(`   ✅ Total de peças geradas: ${stats.totalParts}`);
console.log(`   ✅ Marcas cobertas: ${stats.brands.length}`);
console.log(`   ✅ Plataformas: ${stats.platforms.length}`);
console.log(`   ✅ Categorias de peças: ${stats.categories.length}`);

if (vehiclesWithoutParts.length === 0) {
  console.log('\n   🎉 VALIDAÇÃO APROVADA! Todos os veículos têm peças!');
} else {
  console.log('\n   ⚠️ ATENÇÃO: Alguns veículos não têm peças.');
}
console.log('═══════════════════════════════════════════════════════════════\n');
