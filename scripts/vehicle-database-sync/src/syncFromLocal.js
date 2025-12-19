#!/usr/bin/env node
/**
 * Sync From Local - Sincroniza usando dados locais baixados
 * 
 * Usa os arquivos JSON baixados para evitar rate limiting.
 * Busca modelos de cada marca com delays longos.
 * 
 * Uso:
 *   node src/syncFromLocal.js                    # Sincroniza tudo
 *   node src/syncFromLocal.js --type=cars        # Apenas carros
 *   node src/syncFromLocal.js --brand="Honda"    # Apenas uma marca
 */

import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BRAND_NAME_MAP, FUEL_MAP } from './config.js';
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

// Parse argumentos
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

const vehicleType = getArg('type')?.toUpperCase() || 'CARS';
const targetBrand = getArg('brand') || null;

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// API FIPE oficial (com headers corretos)
const fipeApi = axios.create({
  baseURL: 'https://veiculos.fipe.org.br/api/veiculos',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'https://veiculos.fipe.org.br/',
    'Origin': 'https://veiculos.fipe.org.br',
  },
});


// Tipo de veículo para API
const VEHICLE_TYPE_CODE = { CARS: 1, MOTOS: 2, TRUCKS: 3 };
const TYPE_FILE_MAP = { CARS: 'carros', MOTOS: 'motos', TRUCKS: 'caminhoes' };

// Cache helpers
function loadCache(key) {
  const cacheFile = path.join(CACHE_DIR, `${key}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return data.value;
      }
    } catch (e) {}
  }
  return null;
}

function saveCache(key, value) {
  const cacheFile = path.join(CACHE_DIR, `${key}.json`);
  fs.writeFileSync(cacheFile, JSON.stringify({ timestamp: Date.now(), value }));
}

// Busca modelos de uma marca
async function getModels(brandCode, type, retries = 5) {
  const cacheKey = `models_${type}_${brandCode}`;
  const cached = loadCache(cacheKey);
  if (cached) {
    console.log(chalk.gray(`   📦 Cache: modelos`));
    return cached;
  }
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await delay(3000); // 3 segundos entre requests
      
      const response = await fipeApi.post('/ConsultarModelos', 
        `codigoTabelaReferencia=299&codigoTipoVeiculo=${VEHICLE_TYPE_CODE[type]}&codigoMarca=${brandCode}`
      );
      
      const models = response.data.Modelos || [];
      saveCache(cacheKey, models);
      return models;
    } catch (err) {
      console.warn(chalk.yellow(`   ⚠️ Tentativa ${attempt}/${retries}: ${err.message}`));
      if (attempt < retries) {
        const waitTime = 10000 * attempt;
        console.warn(chalk.gray(`      Aguardando ${waitTime/1000}s...`));
        await delay(waitTime);
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
      await delay(2000);
      
      const response = await fipeApi.post('/ConsultarAnoModelo',
        `codigoTabelaReferencia=299&codigoTipoVeiculo=${VEHICLE_TYPE_CODE[type]}&codigoMarca=${brandCode}&codigoModelo=${modelCode}`
      );
      
      saveCache(cacheKey, response.data);
      return response.data;
    } catch (err) {
      if (attempt < retries) {
        await delay(5000 * attempt);
      }
    }
  }
  return [];
}

console.log(chalk.cyan.bold('\n🔄 Sync From Local Data\n'));
console.log(chalk.gray(`Tipo: ${vehicleType}`));
if (targetBrand) console.log(chalk.gray(`Marca: ${targetBrand}`));
console.log('');


async function main() {
  try {
    // 1. Carrega marcas do arquivo local
    const brandsFile = path.join(DATA_DIR, `${TYPE_FILE_MAP[vehicleType]}-marcas.json`);
    if (!fs.existsSync(brandsFile)) {
      console.log(chalk.red(`❌ Arquivo não encontrado: ${brandsFile}`));
      console.log(chalk.yellow(`   Execute primeiro: node src/downloadFipeData.js`));
      process.exit(1);
    }
    
    const allBrands = JSON.parse(fs.readFileSync(brandsFile, 'utf-8'));
    console.log(chalk.green(`✓ ${allBrands.length} marcas carregadas do arquivo local\n`));
    
    // 2. Filtra marcas
    let brandsToProcess = allBrands;
    if (targetBrand) {
      brandsToProcess = allBrands.filter(b => 
        b.Label.toLowerCase().includes(targetBrand.toLowerCase())
      );
    } else {
      // Marcas prioritárias
      const priority = ['Honda', 'Toyota', 'Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 
        'Hyundai', 'Kia', 'Nissan', 'Renault', 'Jeep', 'Mitsubishi', 'BMW', 'Audi', 
        'Mercedes', 'Yamaha', 'Suzuki', 'Kawasaki'];
      brandsToProcess = allBrands.filter(b => 
        priority.some(p => b.Label.toLowerCase().includes(p.toLowerCase()))
      );
    }
    
    console.log(chalk.blue(`📋 Processando ${brandsToProcess.length} marcas\n`));
    
    // 3. Carrega base local
    const localDb = loadLocalDatabase();
    console.log(chalk.green(`✓ Base local: ${localDb.brands.size} marcas\n`));
    
    // 4. Processa cada marca
    const allVehicles = [];
    
    for (let i = 0; i < brandsToProcess.length; i++) {
      const brand = brandsToProcess[i];
      const brandName = BRAND_NAME_MAP[brand.Label] || brand.Label;
      
      console.log(chalk.yellow(`\n[${i + 1}/${brandsToProcess.length}] ${brandName}`));
      
      // Busca modelos
      const models = await getModels(brand.Value, vehicleType);
      console.log(chalk.gray(`   ${models.length} modelos`));
      
      // Para cada modelo, busca anos
      for (const model of models.slice(0, 50)) { // Limita a 50 modelos por marca
        const years = await getYears(brand.Value, model.Value, vehicleType);
        
        for (const year of years) {
          allVehicles.push({
            brand: brandName,
            model: model.Label,
            year: parseInt(year.Label) || 2024,
            fuel: year.Label.includes('Diesel') ? 'diesel' : 
                  year.Label.includes('Gasolina') ? 'gasoline' : 'flex',
            vehicleType: vehicleType === 'MOTOS' ? 'motorcycle' : 'car',
          });
        }
      }
      
      // Pausa entre marcas
      if (i < brandsToProcess.length - 1) {
        console.log(chalk.gray(`   ⏳ Pausa de 30s...`));
        await delay(30000);
      }
    }
    
    console.log(chalk.blue(`\n\n📊 Total coletado: ${allVehicles.length} veículos\n`));
    
    // 5. Compara com base local
    const comparison = compareWithLocal(allVehicles.map(v => parseVehicle(v, vehicleType)), localDb);
    console.log(chalk.yellow(`   Faltantes: ${comparison.missing.length}`));
    
    // 6. Salva resultado
    const outputFile = path.join(REPORTS_DIR, `sync-${vehicleType.toLowerCase()}-${Date.now()}.json`);
    fs.writeFileSync(outputFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      type: vehicleType,
      totalCollected: allVehicles.length,
      missing: comparison.missing.length,
      vehicles: allVehicles,
    }, null, 2));
    
    console.log(chalk.green(`\n✅ Resultado salvo em: ${outputFile}\n`));
    
  } catch (err) {
    console.error(chalk.red(`\n❌ Erro: ${err.message}\n`));
    console.error(err.stack);
    process.exit(1);
  }
}

main();
