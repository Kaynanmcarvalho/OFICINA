/**
 * Cliente da API FIPE
 * Consulta dados oficiais de veículos brasileiros
 * Com rate limiting agressivo e cache para evitar 429
 */

import axios from 'axios';
import pLimit from 'p-limit';
import pRetry from 'p-retry';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG, BRAND_NAME_MAP, FUEL_MAP } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache em memória e disco para evitar requisições repetidas
const CACHE_DIR = path.join(__dirname, '../cache');
const memoryCache = new Map();

// Garante que o diretório de cache existe
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Carrega cache do disco
function loadCache(key) {
  const cacheFile = path.join(CACHE_DIR, `${key}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      // Cache válido por 7 dias
      if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return data.value;
      }
    } catch (e) {
      // Cache corrompido, ignora
    }
  }
  return null;
}

// Salva cache no disco
function saveCache(key, value) {
  const cacheFile = path.join(CACHE_DIR, `${key}.json`);
  fs.writeFileSync(cacheFile, JSON.stringify({ timestamp: Date.now(), value }));
  memoryCache.set(key, value);
}

const api = axios.create({
  baseURL: CONFIG.FIPE_API.BASE_URL,
  timeout: 60000, // 60 segundos timeout
  headers: {
    'Accept': 'application/json',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Origin': 'https://veiculos.fipe.org.br',
    'Referer': 'https://veiculos.fipe.org.br/',
  },
});

// Rate limiter - apenas 1 requisição por vez
const limit = pLimit(CONFIG.RATE_LIMIT.CONCURRENT_REQUESTS);

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Contador de requisições para logging
let requestCount = 0;
let lastRequestTime = 0;

/**
 * Faz requisição com retry, rate limiting e cache
 */
async function fetchWithRetry(url, description = '') {
  // Verifica cache primeiro
  const cacheKey = url.replace(/\//g, '_');
  
  // Tenta memória primeiro
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }
  
  // Tenta disco
  const cachedValue = loadCache(cacheKey);
  if (cachedValue) {
    memoryCache.set(cacheKey, cachedValue);
    console.log(`  📦 Cache hit: ${description}`);
    return cachedValue;
  }
  
  return limit(async () => {
    // Garante delay mínimo entre requisições
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < CONFIG.RATE_LIMIT.DELAY_BETWEEN_REQUESTS) {
      await delay(CONFIG.RATE_LIMIT.DELAY_BETWEEN_REQUESTS - timeSinceLastRequest);
    }
    
    requestCount++;
    console.log(`  🌐 Request #${requestCount}: ${description}`);
    
    return pRetry(
      async () => {
        lastRequestTime = Date.now();
        const response = await api.get(url);
        
        // Salva no cache
        saveCache(cacheKey, response.data);
        
        return response.data;
      },
      {
        retries: CONFIG.RATE_LIMIT.RETRY_ATTEMPTS,
        minTimeout: CONFIG.RATE_LIMIT.RETRY_DELAY,
        factor: CONFIG.RATE_LIMIT.BACKOFF_MULTIPLIER,
        maxTimeout: CONFIG.RATE_LIMIT.MAX_RETRY_DELAY,
        onFailedAttempt: async (error) => {
          const waitTime = Math.min(
            CONFIG.RATE_LIMIT.RETRY_DELAY * Math.pow(CONFIG.RATE_LIMIT.BACKOFF_MULTIPLIER, error.attemptNumber),
            CONFIG.RATE_LIMIT.MAX_RETRY_DELAY
          );
          
          console.warn(`  ⚠️  Tentativa ${error.attemptNumber}/${CONFIG.RATE_LIMIT.RETRY_ATTEMPTS} falhou: ${description}`);
          console.warn(`     Erro: ${error.message}`);
          console.warn(`     Aguardando ${Math.round(waitTime/1000)}s antes de tentar novamente...`);
          
          await delay(waitTime);
        },
      }
    );
  });
}

/**
 * Obtém todas as marcas de um tipo de veículo
 */
export async function getBrands(vehicleType) {
  const fipeType = CONFIG.FIPE_API.TYPES[vehicleType.toUpperCase()];
  if (!fipeType) throw new Error(`Tipo de veículo inválido: ${vehicleType}`);
  
  const url = CONFIG.FIPE_API.ENDPOINTS.BRANDS(fipeType);
  const brands = await fetchWithRetry(url, `marcas ${vehicleType}`);
  
  return brands.map(brand => ({
    code: brand.codigo,
    name: BRAND_NAME_MAP[brand.nome] || brand.nome,
    originalName: brand.nome,
  }));
}

/**
 * Obtém todos os modelos de uma marca
 */
export async function getModels(vehicleType, brandCode) {
  const fipeType = CONFIG.FIPE_API.TYPES[vehicleType.toUpperCase()];
  const url = CONFIG.FIPE_API.ENDPOINTS.MODELS(fipeType, brandCode);
  const data = await fetchWithRetry(url, `modelos marca ${brandCode}`);
  
  return {
    models: data.modelos.map(model => ({
      code: model.codigo,
      name: model.nome,
    })),
    years: data.anos || [],
  };
}

/**
 * Obtém todos os anos disponíveis para um modelo
 */
export async function getYears(vehicleType, brandCode, modelCode) {
  const fipeType = CONFIG.FIPE_API.TYPES[vehicleType.toUpperCase()];
  const url = CONFIG.FIPE_API.ENDPOINTS.YEARS(fipeType, brandCode, modelCode);
  const years = await fetchWithRetry(url, `anos modelo ${modelCode}`);
  
  return years.map(year => ({
    code: year.codigo,
    name: year.nome,
  }));
}

/**
 * Obtém detalhes completos de um veículo específico
 */
export async function getVehicleDetails(vehicleType, brandCode, modelCode, yearCode) {
  const fipeType = CONFIG.FIPE_API.TYPES[vehicleType.toUpperCase()];
  const url = CONFIG.FIPE_API.ENDPOINTS.VEHICLE(fipeType, brandCode, modelCode, yearCode);
  const vehicle = await fetchWithRetry(url, `veículo ${brandCode}/${modelCode}/${yearCode}`);
  
  return {
    fipeCode: vehicle.CodigoFipe,
    brand: BRAND_NAME_MAP[vehicle.Marca] || vehicle.Marca,
    model: vehicle.Modelo,
    year: parseInt(vehicle.AnoModelo) || extractYear(yearCode),
    fuel: FUEL_MAP[vehicle.Combustivel] || 'flex',
    fuelOriginal: vehicle.Combustivel,
    price: vehicle.Valor,
    referenceMonth: vehicle.MesReferencia,
    vehicleType: vehicleType,
  };
}

/**
 * Extrai ano do código (ex: "2023-1" -> 2023)
 */
function extractYear(yearCode) {
  const match = yearCode.match(/(\d{4})/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Obtém todos os veículos de uma marca (completo)
 */
export async function getAllVehiclesFromBrand(vehicleType, brandCode, brandName, onProgress) {
  const vehicles = [];
  
  try {
    const { models } = await getModels(vehicleType, brandCode);
    
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      
      if (onProgress) {
        onProgress({
          brand: brandName,
          model: model.name,
          current: i + 1,
          total: models.length,
        });
      }
      
      try {
        const years = await getYears(vehicleType, brandCode, model.code);
        
        for (const year of years) {
          try {
            const details = await getVehicleDetails(vehicleType, brandCode, model.code, year.code);
            vehicles.push({
              ...details,
              modelCode: model.code,
              yearCode: year.code,
            });
          } catch (err) {
            console.warn(`    ⚠️  Erro ao obter detalhes: ${brandName} ${model.name} ${year.name}`);
          }
        }
      } catch (err) {
        console.warn(`    ⚠️  Erro ao obter anos: ${brandName} ${model.name}`);
      }
    }
  } catch (err) {
    console.error(`  ❌ Erro ao processar marca ${brandName}: ${err.message}`);
  }
  
  return vehicles;
}

export default {
  getBrands,
  getModels,
  getYears,
  getVehicleDetails,
  getAllVehiclesFromBrand,
};
