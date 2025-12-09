/**
 * Cliente da Brasil API (alternativa à FIPE)
 * https://brasilapi.com.br/docs#tag/FIPE
 * 
 * Esta API é mais estável e tem menos rate limiting
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BRAND_NAME_MAP, FUEL_MAP } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache em disco
const CACHE_DIR = path.join(__dirname, '../cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const api = axios.create({
  baseURL: 'https://brasilapi.com.br/api/fipe/marcas/v1',
  timeout: 60000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
});

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Cache helpers
function loadCache(key) {
  const cacheFile = path.join(CACHE_DIR, `brasil_${key}.json`);
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
  const cacheFile = path.join(CACHE_DIR, `brasil_${key}.json`);
  fs.writeFileSync(cacheFile, JSON.stringify({ timestamp: Date.now(), value }));
}

// Mapeamento de tipos
const TYPE_MAP = {
  CARS: 'carros',
  MOTOS: 'motos',
  TRUCKS: 'caminhoes',
};

/**
 * Faz requisição com retry
 */
async function fetchWithRetry(url, description = '', retries = 5) {
  const cacheKey = url.replace(/[^a-zA-Z0-9]/g, '_');
  
  const cached = loadCache(cacheKey);
  if (cached) {
    console.log(`  📦 Cache: ${description}`);
    return cached;
  }
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`  🌐 Request: ${description}`);
      await delay(1000); // 1 segundo entre requests
      
      const response = await api.get(url);
      saveCache(cacheKey, response.data);
      return response.data;
    } catch (err) {
      console.warn(`  ⚠️  Tentativa ${attempt}/${retries}: ${err.message}`);
      if (attempt < retries) {
        const waitTime = 5000 * attempt;
        console.warn(`     Aguardando ${waitTime/1000}s...`);
        await delay(waitTime);
      }
    }
  }
  throw new Error(`Falha após ${retries} tentativas: ${description}`);
}

/**
 * Obtém todas as marcas
 */
export async function getBrands(vehicleType) {
  const type = TYPE_MAP[vehicleType.toUpperCase()];
  if (!type) throw new Error(`Tipo inválido: ${vehicleType}`);
  
  const brands = await fetchWithRetry(`/${type}`, `marcas ${type}`);
  
  return brands.map(brand => ({
    code: brand.valor,
    name: BRAND_NAME_MAP[brand.nome] || brand.nome,
    originalName: brand.nome,
  }));
}

/**
 * Obtém tabelas de referência disponíveis
 */
export async function getReferenceTables() {
  const tables = await fetchWithRetry('/tabelas', 'tabelas de referência');
  return tables;
}

export default {
  getBrands,
  getReferenceTables,
};
