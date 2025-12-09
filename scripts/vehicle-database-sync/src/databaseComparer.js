/**
 * Comparador de Base de Dados
 * Compara veículos da FIPE com a base local e identifica lacunas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Carrega a base de dados local atual
 */
export function loadLocalDatabase() {
  // Tenta múltiplos caminhos possíveis
  const possiblePaths = [
    path.resolve(__dirname, '../../../src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
    path.resolve(__dirname, '../../src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
    path.resolve(process.cwd(), 'src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
    path.resolve(process.cwd(), '../../src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
  ];
  
  let dbPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      dbPath = p;
      break;
    }
  }
  
  if (!dbPath) {
    console.warn('⚠️  Arquivo de base de dados não encontrado');
    console.warn('   Caminhos tentados:', possiblePaths);
    return { vehicles: [], brands: new Set(), models: new Map() };
  }
  
  const content = fs.readFileSync(dbPath, 'utf-8');
  
  // Extrai informações básicas do arquivo
  const vehicles = [];
  const brands = new Set();
  const models = new Map(); // brand -> Set<model>
  
  // Regex para extrair generateYearVariants
  const variantRegex = /generateYearVariants\(\s*\{\s*brand:\s*['"]([^'"]+)['"]\s*,\s*model:\s*['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = variantRegex.exec(content)) !== null) {
    const brand = match[1];
    const model = match[2];
    
    brands.add(brand);
    
    if (!models.has(brand)) {
      models.set(brand, new Set());
    }
    models.get(brand).add(model);
    
    vehicles.push({ brand, model });
  }
  
  return { vehicles, brands, models };
}

/**
 * Normaliza nome para comparação
 */
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Compara veículos da FIPE com a base local
 */
export function compareWithLocal(fipeVehicles, localDb) {
  const missing = [];
  const existing = [];
  const updates = [];
  
  for (const fipeVehicle of fipeVehicles) {
    const brandNorm = normalize(fipeVehicle.brand);
    const modelNorm = normalize(fipeVehicle.model);
    
    // Verifica se a marca existe
    let brandFound = false;
    for (const localBrand of localDb.brands) {
      if (normalize(localBrand) === brandNorm) {
        brandFound = true;
        break;
      }
    }
    
    if (!brandFound) {
      missing.push({
        ...fipeVehicle,
        reason: 'brand_missing',
        message: `Marca não encontrada: ${fipeVehicle.brand}`,
      });
      continue;
    }
    
    // Verifica se o modelo existe
    let modelFound = false;
    for (const [localBrand, localModels] of localDb.models) {
      if (normalize(localBrand) === brandNorm) {
        for (const localModel of localModels) {
          // Verifica se o modelo local está contido no modelo FIPE ou vice-versa
          const localModelNorm = normalize(localModel);
          if (modelNorm.includes(localModelNorm) || localModelNorm.includes(modelNorm)) {
            modelFound = true;
            break;
          }
        }
        break;
      }
    }
    
    if (!modelFound) {
      missing.push({
        ...fipeVehicle,
        reason: 'model_missing',
        message: `Modelo não encontrado: ${fipeVehicle.brand} ${fipeVehicle.model}`,
      });
    } else {
      existing.push(fipeVehicle);
    }
  }
  
  return { missing, existing, updates };
}

/**
 * Agrupa veículos faltantes por marca e modelo
 */
export function groupMissingVehicles(missingVehicles) {
  const grouped = {};
  
  for (const vehicle of missingVehicles) {
    const brand = vehicle.brand;
    const model = vehicle.model;
    
    if (!grouped[brand]) {
      grouped[brand] = {};
    }
    
    if (!grouped[brand][model]) {
      grouped[brand][model] = {
        years: [],
        trims: new Set(),
        engines: new Set(),
        fuels: new Set(),
      };
    }
    
    grouped[brand][model].years.push(vehicle.year);
    if (vehicle.trim) grouped[brand][model].trims.add(vehicle.trim);
    if (vehicle.engineName) grouped[brand][model].engines.add(vehicle.engineName);
    if (vehicle.fuel) grouped[brand][model].fuels.add(vehicle.fuel);
  }
  
  // Converte Sets para Arrays
  for (const brand of Object.keys(grouped)) {
    for (const model of Object.keys(grouped[brand])) {
      grouped[brand][model].trims = Array.from(grouped[brand][model].trims);
      grouped[brand][model].engines = Array.from(grouped[brand][model].engines);
      grouped[brand][model].fuels = Array.from(grouped[brand][model].fuels);
      grouped[brand][model].years = [...new Set(grouped[brand][model].years)].sort((a, b) => a - b);
    }
  }
  
  return grouped;
}

/**
 * Gera estatísticas de comparação
 */
export function generateStats(fipeVehicles, localDb, comparison) {
  return {
    fipe: {
      totalVehicles: fipeVehicles.length,
      uniqueBrands: new Set(fipeVehicles.map(v => v.brand)).size,
      uniqueModels: new Set(fipeVehicles.map(v => `${v.brand}-${v.model}`)).size,
    },
    local: {
      totalBrands: localDb.brands.size,
      totalModels: Array.from(localDb.models.values()).reduce((sum, models) => sum + models.size, 0),
    },
    comparison: {
      missing: comparison.missing.length,
      existing: comparison.existing.length,
      missingByReason: {
        brand_missing: comparison.missing.filter(v => v.reason === 'brand_missing').length,
        model_missing: comparison.missing.filter(v => v.reason === 'model_missing').length,
      },
    },
  };
}

export default {
  loadLocalDatabase,
  compareWithLocal,
  groupMissingVehicles,
  generateStats,
};
