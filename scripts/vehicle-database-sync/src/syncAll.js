#!/usr/bin/env node
/**
 * SYNC ALL - Sincroniza TODOS os veículos do Brasil
 * 
 * Carros, Motos, Caminhões - TODAS as marcas
 * 
 * Este script vai rodar por várias horas, mas vai coletar
 * ABSOLUTAMENTE TODOS os veículos da FIPE.
 */

import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BRAND_NAME_MAP, FUEL_MAP, BODY_TYPE_KEYWORDS } from './config.js';
import { loadLocalDatabase, compareWithLocal, groupMissingVehicles } from './databaseComparer.js';
import { parseVehicle } from './vehicleParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const CACHE_DIR = path.join(__dirname, '../cache');
const REPORTS_DIR = path.join(__dirname, '../reports');

// Garante diretórios
[DATA_DIR, CACHE_DIR, REPORTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// API FIPE oficial
const fipeApi = axios.create({
  baseURL: 'https://veiculos.fipe.org.br/api/veiculos',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'https://veiculos.fipe.org.br/',
    'Origin': 'https://veiculos.fipe.org.br',
  },
});

const VEHICLE_TYPE_CODE = { CARS: 1, MOTOS: 2, TRUCKS: 3 };
const TYPE_FILE_MAP = { CARS: 'carros', MOTOS: 'motos', TRUCKS: 'caminhoes' };

// Cache helpers
function loadCache(key) {
  const cacheFile = path.join(CACHE_DIR, `${key}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) return data.value;
    } catch (e) {}
  }
  return null;
}

function saveCache(key, value) {
  fs.writeFileSync(path.join(CACHE_DIR, `${key}.json`), JSON.stringify({ timestamp: Date.now(), value }));
}


// Busca modelos de uma marca
async function getModels(brandCode, type, retries = 5) {
  const cacheKey = `models_${type}_${brandCode}`;
  const cached = loadCache(cacheKey);
  if (cached) return cached;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await delay(2000);
      const response = await fipeApi.post('/ConsultarModelos', 
        `codigoTabelaReferencia=299&codigoTipoVeiculo=${VEHICLE_TYPE_CODE[type]}&codigoMarca=${brandCode}`
      );
      const models = response.data.Modelos || [];
      saveCache(cacheKey, models);
      return models;
    } catch (err) {
      if (attempt < retries) {
        console.warn(chalk.yellow(`   ⚠️ Retry ${attempt}/${retries}`));
        await delay(10000 * attempt);
      }
    }
  }
  return [];
}

// Busca anos de um modelo
async function getYears(brandCode, modelCode, type, retries = 5) {
  const cacheKey = `years_${type}_${brandCode}_${modelCode}`;
  const cached = loadCache(cacheKey);
  if (cached) return cached;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await delay(1500);
      const response = await fipeApi.post('/ConsultarAnoModelo',
        `codigoTabelaReferencia=299&codigoTipoVeiculo=${VEHICLE_TYPE_CODE[type]}&codigoMarca=${brandCode}&codigoModelo=${modelCode}`
      );
      saveCache(cacheKey, response.data);
      return response.data;
    } catch (err) {
      if (attempt < retries) await delay(5000 * attempt);
    }
  }
  return [];
}

// Detecta tipo de carroceria
function detectBodyType(modelName, vehicleType) {
  const name = modelName.toLowerCase();
  
  if (vehicleType === 'MOTOS') {
    for (const [type, keywords] of Object.entries(BODY_TYPE_KEYWORDS)) {
      if (['street', 'sport', 'naked', 'adventure', 'touring', 'cruiser', 'scooter', 'trail'].includes(type)) {
        if (keywords.some(k => name.includes(k.toLowerCase()))) return type;
      }
    }
    return 'street';
  }
  
  if (vehicleType === 'TRUCKS') return 'truck';
  
  // Carros
  for (const [type, keywords] of Object.entries(BODY_TYPE_KEYWORDS)) {
    if (['sedan', 'hatch', 'suv', 'pickup', 'van', 'wagon', 'coupe', 'convertible'].includes(type)) {
      if (keywords.some(k => name.includes(k.toLowerCase()))) return type;
    }
  }
  return 'hatch';
}

console.log(chalk.cyan.bold(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚗 SYNC ALL - Base Completa de Veículos do Brasil 🏍️      ║
║                                                              ║
║   Este processo vai coletar TODOS os veículos da FIPE:       ║
║   - Carros (todas as marcas)                                 ║
║   - Motos (todas as marcas)                                  ║
║   - Caminhões (todas as marcas)                              ║
║                                                              ║
║   ⏱️  Tempo estimado: 2-4 horas                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`));


async function syncType(type) {
  console.log(chalk.blue.bold(`\n${'='.repeat(60)}`));
  console.log(chalk.blue.bold(`🔄 Sincronizando: ${type}`));
  console.log(chalk.blue.bold(`${'='.repeat(60)}\n`));
  
  const brandsFile = path.join(DATA_DIR, `${TYPE_FILE_MAP[type]}-marcas.json`);
  if (!fs.existsSync(brandsFile)) {
    console.log(chalk.red(`❌ Arquivo não encontrado: ${brandsFile}`));
    return [];
  }
  
  const allBrands = JSON.parse(fs.readFileSync(brandsFile, 'utf-8'));
  console.log(chalk.green(`✓ ${allBrands.length} marcas carregadas\n`));
  
  const allVehicles = [];
  
  for (let i = 0; i < allBrands.length; i++) {
    const brand = allBrands[i];
    const brandName = BRAND_NAME_MAP[brand.Label] || brand.Label;
    
    console.log(chalk.yellow(`[${i + 1}/${allBrands.length}] ${brandName}`));
    
    const models = await getModels(brand.Value, type);
    console.log(chalk.gray(`   ${models.length} modelos`));
    
    for (const model of models) {
      const years = await getYears(brand.Value, model.Value, type);
      
      for (const year of years) {
        let yearNum = parseInt(year.Label) || 2024;
        // Corrige ano 32000 (0km) para 2025
        if (yearNum > 2030) yearNum = 2025;
        // Ignora anos muito antigos ou inválidos
        if (yearNum < 1900) continue;
        
        const fuel = year.Label.includes('Diesel') ? 'diesel' : 
                     year.Label.includes('Gasolina') ? 'gasoline' : 'flex';
        
        allVehicles.push({
          brand: brandName,
          model: model.Label,
          year: yearNum,
          fuel,
          vehicleType: type === 'MOTOS' ? 'motorcycle' : type === 'TRUCKS' ? 'truck' : 'car',
          bodyType: detectBodyType(model.Label, type),
        });
      }
    }
    
    // Pausa entre marcas
    if (i < allBrands.length - 1 && i % 5 === 4) {
      console.log(chalk.gray(`   ⏳ Pausa de 20s...`));
      await delay(20000);
    }
  }
  
  console.log(chalk.green(`\n✓ ${type}: ${allVehicles.length} veículos coletados\n`));
  return allVehicles;
}

async function main() {
  const startTime = Date.now();
  
  try {
    // Carrega base local
    console.log(chalk.blue('📂 Carregando base local...'));
    const localDb = loadLocalDatabase();
    console.log(chalk.green(`✓ ${localDb.brands.size} marcas, ${Array.from(localDb.models.values()).reduce((s, m) => s + m.size, 0)} modelos\n`));
    
    // Sincroniza cada tipo
    const allVehicles = [];
    
    for (const type of ['CARS', 'MOTOS', 'TRUCKS']) {
      const vehicles = await syncType(type);
      allVehicles.push(...vehicles);
    }
    
    // Compara com base local
    console.log(chalk.blue.bold(`\n${'='.repeat(60)}`));
    console.log(chalk.blue.bold(`📊 RESULTADO FINAL`));
    console.log(chalk.blue.bold(`${'='.repeat(60)}\n`));
    
    const parsedVehicles = allVehicles.map(v => {
      try { return parseVehicle(v, v.vehicleType === 'motorcycle' ? 'MOTOS' : 'CARS'); }
      catch { return v; }
    });
    
    const comparison = compareWithLocal(parsedVehicles, localDb);
    
    console.log(chalk.white(`Total coletado: ${allVehicles.length}`));
    console.log(chalk.green(`Já existentes: ${comparison.existing.length}`));
    console.log(chalk.yellow(`Faltantes: ${comparison.missing.length}`));
    
    // Salva resultado
    const outputFile = path.join(REPORTS_DIR, `sync-all-${Date.now()}.json`);
    fs.writeFileSync(outputFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalCollected: allVehicles.length,
      existing: comparison.existing.length,
      missing: comparison.missing.length,
      vehicles: allVehicles,
      missingVehicles: comparison.missing,
    }, null, 2));
    
    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    
    console.log(chalk.green.bold(`\n✅ Sincronização completa!`));
    console.log(chalk.gray(`   Tempo: ${elapsed} minutos`));
    console.log(chalk.gray(`   Resultado: ${outputFile}\n`));
    
    // Gera código para adicionar
    if (comparison.missing.length > 0) {
      console.log(chalk.yellow(`\n📝 Gerando código para ${comparison.missing.length} veículos faltantes...\n`));
      
      const grouped = groupMissingVehicles(comparison.missing);
      let code = `// VEÍCULOS FIPE - Gerado automaticamente\n`;
      code += `// Data: ${new Date().toISOString()}\n`;
      code += `// Total: ${comparison.missing.length} veículos\n\n`;
      
      for (const [brand, models] of Object.entries(grouped)) {
        code += `\n// === ${brand.toUpperCase()} ===\n`;
        for (const [model, data] of Object.entries(models)) {
          const years = [...new Set(data.years)].sort((a, b) => a - b);
          const startYear = years[0];
          const endYear = years[years.length - 1];
          code += `  ...generateYearVariants({ brand: '${brand}', model: '${model}', fuel: '${data.fuels[0] || 'flex'}', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, ${startYear}, ${endYear}),\n`;
        }
      }
      
      const codeFile = path.join(REPORTS_DIR, `generated-vehicles-all.ts`);
      fs.writeFileSync(codeFile, code);
      console.log(chalk.green(`✓ Código salvo: ${codeFile}\n`));
    }
    
  } catch (err) {
    console.error(chalk.red(`\n❌ Erro: ${err.message}\n`));
    console.error(err.stack);
    process.exit(1);
  }
}

main();
