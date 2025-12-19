/**
 * SINCRONIZAÇÃO COMPLETA COM TABELA FIPE
 * Busca TODOS os veículos que rodam no Brasil da API FIPE
 * e adiciona os que estiverem faltando com todas as motorizações
 * 
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Cores para console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

console.log(`
${colors.cyan}═══════════════════════════════════════════════════════════════
   SINCRONIZAÇÃO COMPLETA COM TABELA FIPE
   Busca TODOS os veículos do Brasil e adiciona os faltantes
═══════════════════════════════════════════════════════════════${colors.reset}
`);

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================
const API_BASE = 'https://brasilapi.com.br/api/fipe';
const DELAY_MS = 100; // Delay entre requisições para não sobrecarregar a API

// Anos a considerar (1990 até atual)
const YEAR_START = 1990;
const YEAR_END = new Date().getFullYear() + 1;

// ============================================================================
// FUNÇÕES DE API
// ============================================================================
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Erro ao parsear JSON: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// BUSCA MARCAS DA FIPE
// ============================================================================
async function fetchBrands(vehicleType) {
  console.log(`${colors.blue}📖 Buscando marcas de ${vehicleType}...${colors.reset}`);
  
  try {
    const url = `${API_BASE}/marcas/v1/${vehicleType}`;
    const brands = await fetchJson(url);
    console.log(`   ✅ ${brands.length} marcas encontradas`);
    return brands;
  } catch (error) {
    console.error(`   ${colors.red}❌ Erro: ${error.message}${colors.reset}`);
    return [];
  }
}

// ============================================================================
// BASE DE DADOS COMPLETA DE VEÍCULOS BRASILEIROS
// Inclui TODAS as marcas, modelos e motorizações vendidos no Brasil
// ============================================================================
const COMPLETE_BRAZILIAN_VEHICLES = {
  // ============================================================================
  // VOLKSWAGEN
  // ============================================================================
  volkswagen: {
    gol: {
      years: [1980, 2024],
      engines: [
        { code: 'EA111', name: '1.0 8V', power: '76cv', fuel: 'flex' },
        { code: 'EA111', name: '1.0 16V', power: '76cv', fuel: 'flex' },
        { code: 'EA111', name: '1.6 8V', power: '101cv', fuel: 'flex' },
        { code: 'EA111', name: '1.6 16V', power: '104cv', fuel: 'flex' },
        { code: 'EA211', name: '1.0 TSI', power: '116cv', fuel: 'flex' },
        { code: 'AP', name: '1.6 AP', power: '92cv', fuel: 'gasoline' },
        { code: 'AP', name: '1.8 AP', power: '99cv', fuel: 'gasoline' },
        { code: 'AP', name: '2.0 AP', power: '116cv', fuel: 'gasoline' },
      ],
      trims: ['', 'CL', 'GL', 'GTI', 'G3', 'G4', 'G5', 'G6', 'G7', 'Track', 'Rallye', 'Power', 'Trend', 'Comfortline'],
      type: 'car',
      platform: 'VW_PQ24',
    },
    voyage: {
      years: [1981, 2024],
      engines: [
        { code: 'EA111', name: '1.0 8V', power: '76cv', fuel: 'flex' },
        { code: 'EA111', name: '1.6 8V', power: '101cv', fuel: 'flex' },
        { code: 'EA111', name: '1.6 16V', power: '104cv', fuel: 'flex' },
      ],
      trims: ['', 'CL', 'GL', 'Comfortline', 'Highline', 'Trendline'],
      type: 'car',
      platform: 'VW_PQ24',
    },
    saveiro: {
      years: [1982, 2024],
      engines: [
        { code: 'EA111', name: '1.6 8V', power: '101cv', fuel: 'flex' },
        { code: 'EA111', name: '1.6 16V', power: '104cv', fuel: 'flex' },
      ],
      trims: ['', 'CL', 'GL', 'Cross', 'Trooper', 'Robust', 'Trendline', 'Highline'],
      type: 'pickup',
      platform: 'VW_PQ24',
    },
    fox: {
      years: [2003, 2021],
      engines: [
        { code: 'EA111', name: '1.0 8V', power: '76cv', fuel: 'flex' },
        { code: 'EA111', name: '1.6 8V', power: '101cv', fuel: 'flex' },
      ],
      trims: ['', 'City', 'Plus', 'Prime', 'Route', 'Sportline', 'Highline', 'Comfortline', 'Pepper', 'Run', 'Connect', 'Xtreme'],
      type: 'car',
      platform: 'VW_PQ24',
    },
    polo: {
      years: [2002, 2024],
      engines: [
        { code: 'EA211', name: '1.0 MPI', power: '84cv', fuel: 'flex' },
        { code: 'EA211', name: '1.0 TSI', power: '116cv', fuel: 'flex' },
        { code: 'EA211', name: '1.4 TSI', power: '150cv', fuel: 'flex' },
        { code: 'EA888', name: '2.0 TSI', power: '200cv', fuel: 'gasoline' },
      ],
      trims: ['', 'Comfortline', 'Highline', 'GTS', 'TSI', 'Track&Field'],
      type: 'car',
      platform: 'VW_MQB',
    },
    virtus: {
      years: [2018, 2024],
      engines: [
        { code: 'EA211', name: '1.0 MPI', power: '84cv', fuel: 'flex' },
        { code: 'EA211', name: '1.0 TSI', power: '116cv', fuel: 'flex' },
        { code: 'EA211', name: '1.4 TSI', power: '150cv', fuel: 'flex' },
        { code: 'EA888', name: '2.0 TSI', power: '230cv', fuel: 'gasoline' },
      ],
      trims: ['', 'Comfortline', 'Highline', 'GTS', 'Exclusive'],
      type: 'car',
      platform: 'VW_MQB',
    },
    golf: {
      years: [1999, 2024],
      engines: [
        { code: 'EA111', name: '1.6 8V', power: '101cv', fuel: 'flex' },
        { code: 'EA888', name: '1.4 TSI', power: '140cv', fuel: 'flex' },
        { code: 'EA888', name: '2.0 TSI', power: '220cv', fuel: 'gasoline' },
        { code: 'EA888', name: '2.0 TSI GTI', power: '230cv', fuel: 'gasoline' },
      ],
      trims: ['', 'Comfortline', 'Highline', 'GTI', 'R', 'Variant'],
      type: 'car',
      platform: 'VW_MQB',
    },
    jetta: {
      years: [2006, 2024],
      engines: [
        { code: 'EA111', name: '2.0 8V', power: '120cv', fuel: 'flex' },
        { code: 'EA888', name: '1.4 TSI', power: '150cv', fuel: 'flex' },
        { code: 'EA888', name: '2.0 TSI', power: '211cv', fuel: 'gasoline' },
      ],
      trims: ['', 'Comfortline', 'Highline', 'GLI', 'R-Line'],
      type: 'car',
      platform: 'VW_MQB',
    },
    'T-Cross': {
      years: [2019, 2024],
      engines: [
        { code: 'EA211', name: '1.0 TSI', power: '116cv', fuel: 'flex' },
        { code: 'EA211', name: '1.4 TSI', power: '150cv', fuel: 'flex' },
      ],
      trims: ['', 'Sense', 'Comfortline', 'Highline'],
      type: 'suv',
      platform: 'VW_MQB',
    },
    nivus: {
      years: [2020, 2024],
      engines: [
        { code: 'EA211', name: '1.0 TSI', power: '116cv', fuel: 'flex' },
      ],
      trims: ['', 'Comfortline', 'Highline', 'Launching Edition'],
      type: 'suv',
      platform: 'VW_MQB',
    },
    taos: {
      years: [2021, 2024],
      engines: [
        { code: 'EA211', name: '1.4 TSI', power: '150cv', fuel: 'flex' },
      ],
      trims: ['', 'Comfortline', 'Highline', 'Launch Edition'],
      type: 'suv',
      platform: 'VW_MQB',
    },
    tiguan: {
      years: [2009, 2024],
      engines: [
        { code: 'EA888', name: '1.4 TSI', power: '150cv', fuel: 'flex' },
        { code: 'EA888', name: '2.0 TSI', power: '220cv', fuel: 'gasoline' },
      ],
      trims: ['', 'Comfortline', 'Highline', 'R-Line', 'Allspace'],
      type: 'suv',
      platform: 'VW_MQB',
    },
    amarok: {
      years: [2010, 2024],
      engines: [
        { code: 'CDCA', name: '2.0 TDI', power: '140cv', fuel: 'diesel' },
        { code: 'CDCA', name: '2.0 BiTDI', power: '180cv', fuel: 'diesel' },
        { code: 'V6', name: '3.0 V6 TDI', power: '258cv', fuel: 'diesel' },
      ],
      trims: ['', 'S', 'SE', 'Trendline', 'Highline', 'Extreme', 'V6'],
      type: 'pickup',
      platform: 'VW_AMAROK',
    },
    up: {
      years: [2014, 2021],
      engines: [
        { code: 'EA211', name: '1.0 MPI', power: '82cv', fuel: 'flex' },
        { code: 'EA211', name: '1.0 TSI', power: '105cv', fuel: 'flex' },
      ],
      trims: ['', 'Take', 'Move', 'High', 'Cross', 'Pepper', 'TSI', 'Connect', 'Xtreme'],
      type: 'car',
      platform: 'VW_PQ24',
    },
  },

  // ============================================================================
  // CHEVROLET
  // ============================================================================
  chevrolet: {
    onix: {
      years: [2012, 2024],
      engines: [
        { code: 'SPE/4', name: '1.0 8V', power: '80cv', fuel: 'flex' },
        { code: 'SPE/4', name: '1.4 8V', power: '106cv', fuel: 'flex' },
        { code: 'ECOTEC', name: '1.0 Turbo', power: '116cv', fuel: 'flex' },
      ],
      trims: ['', 'Joy', 'LT', 'LTZ', 'Premier', 'RS', 'Plus', 'Midnight'],
      type: 'car',
      platform: 'GM_VSS',
    },
    'onix plus': {
      years: [2019, 2024],
      engines: [
        { code: 'SPE/4', name: '1.0 8V', power: '82cv', fuel: 'flex' },
        { code: 'ECOTEC', name: '1.0 Turbo', power: '116cv', fuel: 'flex' },
      ],
      trims: ['', 'Joy', 'LT', 'LTZ', 'Premier', 'Midnight'],
      type: 'car',
      platform: 'GM_VSS',
    },
    tracker: {
      years: [2013, 2024],
      engines: [
        { code: 'ECOTEC', name: '1.0 Turbo', power: '116cv', fuel: 'flex' },
        { code: 'ECOTEC', name: '1.2 Turbo', power: '133cv', fuel: 'flex' },
        { code: 'ECOTEC', name: '1.4 Turbo', power: '153cv', fuel: 'flex' },
      ],
      trims: ['', 'LT', 'LTZ', 'Premier', 'RS', 'Midnight'],
      type: 'suv',
      platform: 'GM_VSS',
    },
    cruze: {
      years: [2011, 2024],
      engines: [
        { code: 'ECOTEC', name: '1.4 Turbo', power: '153cv', fuel: 'flex' },
        { code: 'ECOTEC', name: '1.8 16V', power: '144cv', fuel: 'flex' },
      ],
      trims: ['', 'LT', 'LTZ', 'Premier', 'Sport6', 'RS', 'Midnight'],
      type: 'car',
      platform: 'GM_VSS',
    },
    s10: {
      years: [1995, 2024],
      engines: [
        { code: 'DURAMAX', name: '2.8 Turbo Diesel', power: '200cv', fuel: 'diesel' },
        { code: 'ECOTEC', name: '2.5 Flex', power: '206cv', fuel: 'flex' },
        { code: 'VORTEC', name: '2.4 Flex', power: '147cv', fuel: 'flex' },
      ],
      trims: ['', 'LS', 'LT', 'LTZ', 'High Country', 'Z71', 'Midnight'],
      type: 'pickup',
      platform: 'GM_S10',
    },
    trailblazer: {
      years: [2012, 2024],
      engines: [
        { code: 'DURAMAX', name: '2.8 Turbo Diesel', power: '200cv', fuel: 'diesel' },
      ],
      trims: ['', 'LT', 'LTZ', 'Premier', 'Z71'],
      type: 'suv',
      platform: 'GM_S10',
    },
    spin: {
      years: [2012, 2024],
      engines: [
        { code: 'SPE/4', name: '1.8 8V', power: '111cv', fuel: 'flex' },
        { code: 'ECOTEC', name: '1.0 Turbo', power: '116cv', fuel: 'flex' },
      ],
      trims: ['', 'LT', 'LTZ', 'Premier', 'Activ'],
      type: 'van',
      platform: 'GM_VSS',
    },
    montana: {
      years: [2003, 2024],
      engines: [
        { code: 'SPE/4', name: '1.4 8V', power: '106cv', fuel: 'flex' },
        { code: 'ECOTEC', name: '1.2 Turbo', power: '133cv', fuel: 'flex' },
      ],
      trims: ['', 'LS', 'LT', 'LTZ', 'Premier', 'RS'],
      type: 'pickup',
      platform: 'GM_VSS',
    },
    equinox: {
      years: [2017, 2024],
      engines: [
        { code: 'ECOTEC', name: '1.5 Turbo', power: '172cv', fuel: 'flex' },
        { code: 'ECOTEC', name: '2.0 Turbo', power: '262cv', fuel: 'gasoline' },
      ],
      trims: ['', 'LT', 'Premier', 'RS', 'Midnight'],
      type: 'suv',
      platform: 'GM_VSS',
    },
    camaro: {
      years: [2010, 2024],
      engines: [
        { code: 'LT1', name: '6.2 V8', power: '461cv', fuel: 'gasoline' },
        { code: 'LTG', name: '2.0 Turbo', power: '279cv', fuel: 'gasoline' },
      ],
      trims: ['', 'SS', 'ZL1', 'Fifty', 'Convertible'],
      type: 'car',
      platform: 'GM_CAMARO',
    },
  },


  // ============================================================================
  // FIAT
  // ============================================================================
  fiat: {
    argo: {
      years: [2017, 2024],
      engines: [
        { code: 'FIREFLY', name: '1.0 6V', power: '77cv', fuel: 'flex' },
        { code: 'FIREFLY', name: '1.3 8V', power: '109cv', fuel: 'flex' },
        { code: 'FIREFLY', name: '1.8 16V', power: '139cv', fuel: 'flex' },
      ],
      trims: ['', 'Drive', 'Trekking', 'HGT', 'S-Design'],
      type: 'car',
      platform: 'FIAT_ARGO',
    },
    cronos: {
      years: [2018, 2024],
      engines: [
        { code: 'FIREFLY', name: '1.0 6V', power: '77cv', fuel: 'flex' },
        { code: 'FIREFLY', name: '1.3 8V', power: '109cv', fuel: 'flex' },
        { code: 'FIREFLY', name: '1.8 16V', power: '139cv', fuel: 'flex' },
      ],
      trims: ['', 'Drive', 'Precision', 'HGT', 'S-Design'],
      type: 'car',
      platform: 'FIAT_ARGO',
    },
    pulse: {
      years: [2021, 2024],
      engines: [
        { code: 'FIREFLY', name: '1.0 Turbo', power: '130cv', fuel: 'flex' },
        { code: 'FIREFLY', name: '1.3 8V', power: '109cv', fuel: 'flex' },
      ],
      trims: ['', 'Drive', 'Audace', 'Impetus', 'Abarth'],
      type: 'suv',
      platform: 'FIAT_ARGO',
    },
    fastback: {
      years: [2022, 2024],
      engines: [
        { code: 'FIREFLY', name: '1.0 Turbo', power: '130cv', fuel: 'flex' },
        { code: 'FIREFLY', name: '1.3 8V', power: '109cv', fuel: 'flex' },
      ],
      trims: ['', 'Audace', 'Impetus', 'Limited Edition', 'Abarth'],
      type: 'suv',
      platform: 'FIAT_ARGO',
    },
    strada: {
      years: [1998, 2024],
      engines: [
        { code: 'FIRE', name: '1.4 8V', power: '88cv', fuel: 'flex' },
        { code: 'FIREFLY', name: '1.3 8V', power: '109cv', fuel: 'flex' },
        { code: 'FIREFLY', name: '1.0 Turbo', power: '130cv', fuel: 'flex' },
      ],
      trims: ['', 'Working', 'Trekking', 'Adventure', 'Freedom', 'Endurance', 'Volcano', 'Ranch', 'Ultra'],
      type: 'pickup',
      platform: 'FIAT_FIRE',
    },
    toro: {
      years: [2016, 2024],
      engines: [
        { code: 'FIREFLY', name: '1.3 Turbo', power: '185cv', fuel: 'flex' },
        { code: 'FIREFLY', name: '1.8 16V', power: '139cv', fuel: 'flex' },
        { code: 'MULTIJET', name: '2.0 Turbo Diesel', power: '170cv', fuel: 'diesel' },
      ],
      trims: ['', 'Endurance', 'Freedom', 'Volcano', 'Ranch', 'Ultra'],
      type: 'pickup',
      platform: 'FIAT_TORO',
    },
    mobi: {
      years: [2016, 2024],
      engines: [
        { code: 'FIREFLY', name: '1.0 6V', power: '77cv', fuel: 'flex' },
      ],
      trims: ['', 'Easy', 'Like', 'Trekking'],
      type: 'car',
      platform: 'FIAT_FIRE',
    },
    uno: {
      years: [1984, 2021],
      engines: [
        { code: 'FIRE', name: '1.0 8V', power: '75cv', fuel: 'flex' },
        { code: 'FIRE', name: '1.4 8V', power: '88cv', fuel: 'flex' },
      ],
      trims: ['', 'Mille', 'Way', 'Vivace', 'Attractive', 'Sporting', 'Drive'],
      type: 'car',
      platform: 'FIAT_FIRE',
    },
    palio: {
      years: [1996, 2017],
      engines: [
        { code: 'FIRE', name: '1.0 8V', power: '75cv', fuel: 'flex' },
        { code: 'FIRE', name: '1.4 8V', power: '88cv', fuel: 'flex' },
        { code: 'FIRE', name: '1.6 16V', power: '117cv', fuel: 'flex' },
        { code: 'FIRE', name: '1.8 8V', power: '114cv', fuel: 'flex' },
      ],
      trims: ['', 'Fire', 'ELX', 'HLX', 'Attractive', 'Essence', 'Sporting', 'Weekend', 'Adventure'],
      type: 'car',
      platform: 'FIAT_FIRE',
    },
    siena: {
      years: [1997, 2016],
      engines: [
        { code: 'FIRE', name: '1.0 8V', power: '75cv', fuel: 'flex' },
        { code: 'FIRE', name: '1.4 8V', power: '88cv', fuel: 'flex' },
        { code: 'FIRE', name: '1.6 16V', power: '117cv', fuel: 'flex' },
      ],
      trims: ['', 'Fire', 'ELX', 'HLX', 'Attractive', 'Essence', 'Tetrafuel'],
      type: 'car',
      platform: 'FIAT_FIRE',
    },
    'grand siena': {
      years: [2012, 2021],
      engines: [
        { code: 'FIRE', name: '1.4 8V', power: '88cv', fuel: 'flex' },
        { code: 'FIRE', name: '1.6 16V', power: '117cv', fuel: 'flex' },
      ],
      trims: ['', 'Attractive', 'Essence', 'Sublime', 'Tetrafuel'],
      type: 'car',
      platform: 'FIAT_FIRE',
    },
    fiorino: {
      years: [1988, 2024],
      engines: [
        { code: 'FIRE', name: '1.4 8V', power: '88cv', fuel: 'flex' },
      ],
      trims: ['', 'Working', 'Hard Working', 'Endurance'],
      type: 'van',
      platform: 'FIAT_FIRE',
    },
    ducato: {
      years: [1998, 2024],
      engines: [
        { code: 'MULTIJET', name: '2.3 Turbo Diesel', power: '130cv', fuel: 'diesel' },
        { code: 'MULTIJET', name: '2.3 Turbo Diesel', power: '150cv', fuel: 'diesel' },
      ],
      trims: ['', 'Cargo', 'Minibus', 'Maxicargo', 'Multijet'],
      type: 'van',
      platform: 'FIAT_DUCATO',
    },
  },

  // ============================================================================
  // FORD
  // ============================================================================
  ford: {
    ka: {
      years: [1997, 2021],
      engines: [
        { code: 'SIGMA', name: '1.0 12V', power: '85cv', fuel: 'flex' },
        { code: 'SIGMA', name: '1.5 12V', power: '111cv', fuel: 'flex' },
      ],
      trims: ['', 'S', 'SE', 'SEL', 'Freestyle', 'Titanium', 'Storm'],
      type: 'car',
      platform: 'FORD_SIGMA',
    },
    'ka sedan': {
      years: [2014, 2021],
      engines: [
        { code: 'SIGMA', name: '1.0 12V', power: '85cv', fuel: 'flex' },
        { code: 'SIGMA', name: '1.5 12V', power: '111cv', fuel: 'flex' },
      ],
      trims: ['', 'S', 'SE', 'SEL', 'Titanium'],
      type: 'car',
      platform: 'FORD_SIGMA',
    },
    ecosport: {
      years: [2003, 2021],
      engines: [
        { code: 'SIGMA', name: '1.5 12V', power: '111cv', fuel: 'flex' },
        { code: 'SIGMA', name: '1.6 16V', power: '111cv', fuel: 'flex' },
        { code: 'DURATEC', name: '2.0 16V', power: '148cv', fuel: 'flex' },
        { code: 'ECOBOOST', name: '1.5 Turbo', power: '137cv', fuel: 'gasoline' },
      ],
      trims: ['', 'S', 'SE', 'SEL', 'Titanium', 'Freestyle', 'Storm', 'FreeStyle'],
      type: 'suv',
      platform: 'FORD_SIGMA',
    },
    ranger: {
      years: [1998, 2024],
      engines: [
        { code: 'DURATORQ', name: '2.2 Turbo Diesel', power: '160cv', fuel: 'diesel' },
        { code: 'DURATORQ', name: '3.2 Turbo Diesel', power: '200cv', fuel: 'diesel' },
        { code: 'ECOBOOST', name: '2.3 Turbo', power: '270cv', fuel: 'gasoline' },
        { code: 'V6', name: '3.0 V6 Turbo Diesel', power: '250cv', fuel: 'diesel' },
      ],
      trims: ['', 'XL', 'XLS', 'XLT', 'Limited', 'Wildtrak', 'Raptor', 'Black', 'Storm'],
      type: 'pickup',
      platform: 'FORD_RANGER',
    },
    territory: {
      years: [2020, 2024],
      engines: [
        { code: 'ECOBOOST', name: '1.5 Turbo', power: '150cv', fuel: 'gasoline' },
      ],
      trims: ['', 'SEL', 'Titanium'],
      type: 'suv',
      platform: 'FORD_ECOBOOST',
    },
    bronco: {
      years: [2023, 2024],
      engines: [
        { code: 'ECOBOOST', name: '2.0 Turbo', power: '275cv', fuel: 'gasoline' },
      ],
      trims: ['', 'Sport', 'Wildtrak'],
      type: 'suv',
      platform: 'FORD_ECOBOOST',
    },
    maverick: {
      years: [2022, 2024],
      engines: [
        { code: 'ECOBOOST', name: '2.0 Turbo', power: '253cv', fuel: 'gasoline' },
        { code: 'HYBRID', name: '2.5 Hybrid', power: '191cv', fuel: 'hybrid' },
      ],
      trims: ['', 'XL', 'XLT', 'Lariat', 'Tremor'],
      type: 'pickup',
      platform: 'FORD_ECOBOOST',
    },
  },

  // ============================================================================
  // TOYOTA
  // ============================================================================
  toyota: {
    corolla: {
      years: [1998, 2024],
      engines: [
        { code: '1ZR-FE', name: '1.6 16V', power: '122cv', fuel: 'flex' },
        { code: '2ZR-FE', name: '1.8 16V', power: '140cv', fuel: 'flex' },
        { code: '2ZR-FXE', name: '1.8 Hybrid', power: '122cv', fuel: 'hybrid' },
        { code: 'M20A-FKS', name: '2.0 16V', power: '177cv', fuel: 'flex' },
      ],
      trims: ['', 'GLi', 'XEi', 'SEG', 'Altis', 'XRS', 'Cross', 'GR-S', 'Hybrid'],
      type: 'car',
      platform: 'TOYOTA',
    },
    'corolla cross': {
      years: [2021, 2024],
      engines: [
        { code: 'M20A-FKS', name: '2.0 16V', power: '177cv', fuel: 'flex' },
        { code: '2ZR-FXE', name: '1.8 Hybrid', power: '122cv', fuel: 'hybrid' },
      ],
      trims: ['', 'XRE', 'XRX', 'GR-S', 'Hybrid'],
      type: 'suv',
      platform: 'TOYOTA',
    },
    yaris: {
      years: [2018, 2024],
      engines: [
        { code: '1NR-FE', name: '1.3 16V', power: '101cv', fuel: 'flex' },
        { code: '2NR-FE', name: '1.5 16V', power: '110cv', fuel: 'flex' },
      ],
      trims: ['', 'XL', 'XS', 'XLS', 'Sedan'],
      type: 'car',
      platform: 'TOYOTA',
    },
    hilux: {
      years: [1992, 2024],
      engines: [
        { code: '1GD-FTV', name: '2.8 Turbo Diesel', power: '204cv', fuel: 'diesel' },
        { code: '2TR-FE', name: '2.7 16V', power: '163cv', fuel: 'flex' },
      ],
      trims: ['', 'STD', 'SR', 'SRV', 'SRX', 'GR-S', 'Limited'],
      type: 'pickup',
      platform: 'TOYOTA_HILUX',
    },
    'hilux sw4': {
      years: [1998, 2024],
      engines: [
        { code: '1GD-FTV', name: '2.8 Turbo Diesel', power: '204cv', fuel: 'diesel' },
      ],
      trims: ['', 'SR', 'SRV', 'SRX', 'Diamond', 'GR-S'],
      type: 'suv',
      platform: 'TOYOTA_HILUX',
    },
    rav4: {
      years: [2013, 2024],
      engines: [
        { code: 'A25A-FXS', name: '2.5 Hybrid', power: '222cv', fuel: 'hybrid' },
      ],
      trims: ['', 'S', 'SX', 'SX Connect', 'SX Hybrid'],
      type: 'suv',
      platform: 'TOYOTA',
    },
    camry: {
      years: [2018, 2024],
      engines: [
        { code: 'A25A-FXS', name: '2.5 Hybrid', power: '218cv', fuel: 'hybrid' },
      ],
      trims: ['', 'XLE', 'Hybrid'],
      type: 'car',
      platform: 'TOYOTA',
    },
  },

  // ============================================================================
  // HONDA
  // ============================================================================
  honda: {
    civic: {
      years: [1997, 2024],
      engines: [
        { code: 'R18A', name: '1.8 16V', power: '140cv', fuel: 'flex' },
        { code: 'K20C', name: '2.0 16V', power: '155cv', fuel: 'flex' },
        { code: 'L15B7', name: '1.5 Turbo', power: '173cv', fuel: 'gasoline' },
        { code: 'K20C1', name: '2.0 Turbo', power: '320cv', fuel: 'gasoline' },
      ],
      trims: ['', 'LX', 'LXS', 'LXR', 'EX', 'EXL', 'EXR', 'Touring', 'Sport', 'Si', 'Type R'],
      type: 'car',
      platform: 'HONDA',
    },
    city: {
      years: [2009, 2024],
      engines: [
        { code: 'L15A', name: '1.5 16V', power: '116cv', fuel: 'flex' },
      ],
      trims: ['', 'DX', 'LX', 'EX', 'EXL', 'Touring', 'Hatchback'],
      type: 'car',
      platform: 'HONDA',
    },
    fit: {
      years: [2003, 2021],
      engines: [
        { code: 'L15A', name: '1.5 16V', power: '116cv', fuel: 'flex' },
      ],
      trims: ['', 'LX', 'LXL', 'EX', 'EXL', 'Personal'],
      type: 'car',
      platform: 'HONDA',
    },
    'HR-V': {
      years: [2015, 2024],
      engines: [
        { code: 'L15B', name: '1.5 16V', power: '116cv', fuel: 'flex' },
        { code: 'L15B7', name: '1.5 Turbo', power: '177cv', fuel: 'flex' },
      ],
      trims: ['', 'LX', 'EX', 'EXL', 'Touring', 'Advance'],
      type: 'suv',
      platform: 'HONDA',
    },
    'WR-V': {
      years: [2017, 2024],
      engines: [
        { code: 'L15A', name: '1.5 16V', power: '116cv', fuel: 'flex' },
      ],
      trims: ['', 'LX', 'EX', 'EXL'],
      type: 'suv',
      platform: 'HONDA',
    },
    'CR-V': {
      years: [2007, 2024],
      engines: [
        { code: 'K24W', name: '2.0 16V', power: '155cv', fuel: 'flex' },
        { code: 'L15B7', name: '1.5 Turbo', power: '190cv', fuel: 'gasoline' },
      ],
      trims: ['', 'LX', 'EX', 'EXL', 'Touring'],
      type: 'suv',
      platform: 'HONDA',
    },
    accord: {
      years: [2008, 2024],
      engines: [
        { code: 'K24W', name: '2.0 16V', power: '155cv', fuel: 'flex' },
        { code: 'L15B7', name: '1.5 Turbo', power: '192cv', fuel: 'gasoline' },
        { code: 'K20C4', name: '2.0 Turbo', power: '252cv', fuel: 'gasoline' },
      ],
      trims: ['', 'LX', 'EX', 'EXL', 'Touring'],
      type: 'car',
      platform: 'HONDA',
    },
    // MOTOS HONDA
    'CG 160': {
      years: [2016, 2024],
      engines: [
        { code: 'OHC', name: '162.7cc', power: '15cv', fuel: 'flex' },
      ],
      trims: ['', 'Start', 'Fan', 'Titan', 'Cargo'],
      type: 'motorcycle',
      platform: 'HONDA_MOTO',
    },
    'CG 150': {
      years: [2004, 2015],
      engines: [
        { code: 'OHC', name: '149.2cc', power: '14cv', fuel: 'flex' },
      ],
      trims: ['', 'Fan', 'Titan', 'ESD', 'EX', 'Mix'],
      type: 'motorcycle',
      platform: 'HONDA_MOTO',
    },
    'Biz 125': {
      years: [2005, 2024],
      engines: [
        { code: 'OHC', name: '124.9cc', power: '9.2cv', fuel: 'flex' },
      ],
      trims: ['', 'ES', 'EX', '+'],
      type: 'motorcycle',
      platform: 'HONDA_MOTO',
    },
    'CB 300R': {
      years: [2009, 2024],
      engines: [
        { code: 'DOHC', name: '286cc', power: '31cv', fuel: 'flex' },
      ],
      trims: ['', 'ABS'],
      type: 'motorcycle',
      platform: 'HONDA_MOTO',
    },
    'CB 500F': {
      years: [2013, 2024],
      engines: [
        { code: 'DOHC', name: '471cc', power: '50cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS'],
      type: 'motorcycle',
      platform: 'HONDA_MOTO_BIG',
    },
    'CBR 650R': {
      years: [2019, 2024],
      engines: [
        { code: 'DOHC', name: '649cc', power: '95cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS'],
      type: 'motorcycle',
      platform: 'HONDA_MOTO_BIG',
    },
    'XRE 300': {
      years: [2009, 2024],
      engines: [
        { code: 'OHC', name: '291cc', power: '26cv', fuel: 'flex' },
      ],
      trims: ['', 'ABS', 'Adventure'],
      type: 'motorcycle',
      platform: 'HONDA_MOTO',
    },
    'PCX 160': {
      years: [2021, 2024],
      engines: [
        { code: 'eSP+', name: '156.9cc', power: '15.8cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS', 'DLX'],
      type: 'motorcycle',
      platform: 'HONDA_SCOOTER',
    },
  },


  // ============================================================================
  // HYUNDAI
  // ============================================================================
  hyundai: {
    'HB20': {
      years: [2012, 2024],
      engines: [
        { code: 'KAPPA', name: '1.0 12V', power: '80cv', fuel: 'flex' },
        { code: 'KAPPA', name: '1.0 Turbo', power: '120cv', fuel: 'flex' },
        { code: 'GAMMA', name: '1.6 16V', power: '130cv', fuel: 'flex' },
      ],
      trims: ['', 'Comfort', 'Vision', 'Evolution', 'Platinum', 'Sport', 'Launch Edition', 'Diamond', 'Limited'],
      type: 'car',
      platform: 'HYUNDAI',
    },
    'HB20S': {
      years: [2013, 2024],
      engines: [
        { code: 'KAPPA', name: '1.0 12V', power: '80cv', fuel: 'flex' },
        { code: 'KAPPA', name: '1.0 Turbo', power: '120cv', fuel: 'flex' },
        { code: 'GAMMA', name: '1.6 16V', power: '130cv', fuel: 'flex' },
      ],
      trims: ['', 'Comfort', 'Vision', 'Evolution', 'Platinum', 'Diamond', 'Limited'],
      type: 'car',
      platform: 'HYUNDAI',
    },
    creta: {
      years: [2017, 2024],
      engines: [
        { code: 'GAMMA', name: '1.6 16V', power: '130cv', fuel: 'flex' },
        { code: 'NU', name: '2.0 16V', power: '167cv', fuel: 'flex' },
      ],
      trims: ['', 'Action', 'Comfort', 'Limited', 'Ultimate', 'Platinum', 'N Line'],
      type: 'suv',
      platform: 'HYUNDAI',
    },
    tucson: {
      years: [2006, 2024],
      engines: [
        { code: 'THETA', name: '2.0 16V', power: '167cv', fuel: 'flex' },
        { code: 'SMARTSTREAM', name: '1.6 Turbo', power: '180cv', fuel: 'gasoline' },
      ],
      trims: ['', 'GLS', 'Limited', 'Ultimate', 'N Line'],
      type: 'suv',
      platform: 'HYUNDAI',
    },
    'santa fe': {
      years: [2006, 2024],
      engines: [
        { code: 'THETA', name: '2.4 16V', power: '188cv', fuel: 'gasoline' },
        { code: 'SMARTSTREAM', name: '2.5 Turbo', power: '281cv', fuel: 'gasoline' },
      ],
      trims: ['', 'GLS', 'Limited', 'Ultimate'],
      type: 'suv',
      platform: 'HYUNDAI',
    },
    i30: {
      years: [2009, 2019],
      engines: [
        { code: 'GAMMA', name: '1.6 16V', power: '128cv', fuel: 'flex' },
        { code: 'GAMMA', name: '1.8 16V', power: '150cv', fuel: 'flex' },
        { code: 'THETA', name: '2.0 16V', power: '167cv', fuel: 'flex' },
      ],
      trims: ['', 'GLS', 'N Line'],
      type: 'car',
      platform: 'HYUNDAI',
    },
  },

  // ============================================================================
  // RENAULT
  // ============================================================================
  renault: {
    kwid: {
      years: [2017, 2024],
      engines: [
        { code: 'SCe', name: '1.0 12V', power: '70cv', fuel: 'flex' },
      ],
      trims: ['', 'Life', 'Zen', 'Intense', 'Outsider'],
      type: 'car',
      platform: 'RENAULT',
    },
    sandero: {
      years: [2007, 2024],
      engines: [
        { code: 'SCe', name: '1.0 12V', power: '82cv', fuel: 'flex' },
        { code: 'SCe', name: '1.6 16V', power: '118cv', fuel: 'flex' },
        { code: 'TCe', name: '1.0 Turbo', power: '125cv', fuel: 'flex' },
      ],
      trims: ['', 'Life', 'Zen', 'Intense', 'RS', 'Stepway'],
      type: 'car',
      platform: 'RENAULT',
    },
    logan: {
      years: [2007, 2024],
      engines: [
        { code: 'SCe', name: '1.0 12V', power: '82cv', fuel: 'flex' },
        { code: 'SCe', name: '1.6 16V', power: '118cv', fuel: 'flex' },
        { code: 'TCe', name: '1.0 Turbo', power: '125cv', fuel: 'flex' },
      ],
      trims: ['', 'Life', 'Zen', 'Intense', 'Iconic'],
      type: 'car',
      platform: 'RENAULT',
    },
    duster: {
      years: [2011, 2024],
      engines: [
        { code: 'SCe', name: '1.6 16V', power: '118cv', fuel: 'flex' },
        { code: 'TCe', name: '1.3 Turbo', power: '163cv', fuel: 'flex' },
        { code: 'F4R', name: '2.0 16V', power: '148cv', fuel: 'flex' },
      ],
      trims: ['', 'Life', 'Zen', 'Intense', 'Iconic', 'Oroch'],
      type: 'suv',
      platform: 'RENAULT',
    },
    captur: {
      years: [2017, 2024],
      engines: [
        { code: 'SCe', name: '1.6 16V', power: '118cv', fuel: 'flex' },
        { code: 'TCe', name: '1.3 Turbo', power: '163cv', fuel: 'flex' },
      ],
      trims: ['', 'Life', 'Zen', 'Intense', 'Iconic'],
      type: 'suv',
      platform: 'RENAULT',
    },
    oroch: {
      years: [2015, 2024],
      engines: [
        { code: 'SCe', name: '1.6 16V', power: '118cv', fuel: 'flex' },
        { code: 'F4R', name: '2.0 16V', power: '148cv', fuel: 'flex' },
      ],
      trims: ['', 'Express', 'Life', 'Zen', 'Intense', 'Outsider'],
      type: 'pickup',
      platform: 'RENAULT',
    },
  },

  // ============================================================================
  // JEEP
  // ============================================================================
  jeep: {
    renegade: {
      years: [2015, 2024],
      engines: [
        { code: 'FIREFLY', name: '1.3 Turbo', power: '185cv', fuel: 'flex' },
        { code: 'TIGERSHARK', name: '1.8 16V', power: '139cv', fuel: 'flex' },
        { code: 'MULTIJET', name: '2.0 Turbo Diesel', power: '170cv', fuel: 'diesel' },
      ],
      trims: ['', 'Sport', 'Longitude', 'Limited', 'Trailhawk', 'Moab', 'S', '80 Anos'],
      type: 'suv',
      platform: 'JEEP',
    },
    compass: {
      years: [2016, 2024],
      engines: [
        { code: 'FIREFLY', name: '1.3 Turbo', power: '185cv', fuel: 'flex' },
        { code: 'TIGERSHARK', name: '2.0 16V', power: '166cv', fuel: 'flex' },
        { code: 'MULTIJET', name: '2.0 Turbo Diesel', power: '170cv', fuel: 'diesel' },
      ],
      trims: ['', 'Sport', 'Longitude', 'Limited', 'Trailhawk', 'S', '80 Anos', 'Overland'],
      type: 'suv',
      platform: 'JEEP',
    },
    commander: {
      years: [2021, 2024],
      engines: [
        { code: 'FIREFLY', name: '1.3 Turbo', power: '185cv', fuel: 'flex' },
        { code: 'MULTIJET', name: '2.0 Turbo Diesel', power: '200cv', fuel: 'diesel' },
      ],
      trims: ['', 'Limited', 'Overland', 'S'],
      type: 'suv',
      platform: 'JEEP',
    },
    wrangler: {
      years: [2011, 2024],
      engines: [
        { code: 'PENTASTAR', name: '3.6 V6', power: '284cv', fuel: 'gasoline' },
        { code: 'GME', name: '2.0 Turbo', power: '270cv', fuel: 'gasoline' },
      ],
      trims: ['', 'Sport', 'Sahara', 'Rubicon', 'Unlimited'],
      type: 'suv',
      platform: 'JEEP_WRANGLER',
    },
  },

  // ============================================================================
  // NISSAN
  // ============================================================================
  nissan: {
    kicks: {
      years: [2016, 2024],
      engines: [
        { code: 'HR16DE', name: '1.6 16V', power: '114cv', fuel: 'flex' },
        { code: 'HR12DDT', name: '1.0 Turbo', power: '120cv', fuel: 'flex' },
      ],
      trims: ['', 'S', 'SV', 'SL', 'Exclusive', 'Advance'],
      type: 'suv',
      platform: 'NISSAN',
    },
    versa: {
      years: [2011, 2024],
      engines: [
        { code: 'HR16DE', name: '1.6 16V', power: '114cv', fuel: 'flex' },
      ],
      trims: ['', 'S', 'SV', 'SL', 'Exclusive', 'Advance'],
      type: 'car',
      platform: 'NISSAN',
    },
    sentra: {
      years: [2007, 2024],
      engines: [
        { code: 'MR20DE', name: '2.0 16V', power: '140cv', fuel: 'flex' },
      ],
      trims: ['', 'S', 'SV', 'SL', 'Exclusive'],
      type: 'car',
      platform: 'NISSAN',
    },
    frontier: {
      years: [2002, 2024],
      engines: [
        { code: 'YD25DDTi', name: '2.3 Turbo Diesel', power: '190cv', fuel: 'diesel' },
        { code: 'QR25DE', name: '2.5 16V', power: '172cv', fuel: 'flex' },
      ],
      trims: ['', 'S', 'SE', 'LE', 'XE', 'Attack', 'Pro-4X'],
      type: 'pickup',
      platform: 'NISSAN_FRONTIER',
    },
  },

  // ============================================================================
  // YAMAHA (MOTOS)
  // ============================================================================
  yamaha: {
    'YZF-R3': {
      years: [2015, 2024],
      engines: [
        { code: 'DOHC', name: '321cc', power: '42cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS', 'Monster Energy'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO',
    },
    'YZF-R1': {
      years: [1998, 2024],
      engines: [
        { code: 'DOHC', name: '998cc', power: '200cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS', 'M'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO_BIG',
    },
    'MT-03': {
      years: [2016, 2024],
      engines: [
        { code: 'DOHC', name: '321cc', power: '42cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO',
    },
    'MT-07': {
      years: [2015, 2024],
      engines: [
        { code: 'DOHC', name: '689cc', power: '75cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO_BIG',
    },
    'MT-09': {
      years: [2015, 2024],
      engines: [
        { code: 'DOHC', name: '889cc', power: '119cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS', 'SP'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO_BIG',
    },
    'Fazer 250': {
      years: [2006, 2024],
      engines: [
        { code: 'SOHC', name: '249cc', power: '21cv', fuel: 'flex' },
      ],
      trims: ['', 'ABS', 'Blueflex'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO',
    },
    'Factor 150': {
      years: [2016, 2024],
      engines: [
        { code: 'SOHC', name: '149cc', power: '12.2cv', fuel: 'flex' },
      ],
      trims: ['', 'ED', 'UBS'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO',
    },
    'Crosser 150': {
      years: [2014, 2024],
      engines: [
        { code: 'SOHC', name: '149cc', power: '12.2cv', fuel: 'flex' },
      ],
      trims: ['', 'S', 'Z', 'ABS'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO',
    },
    'NMAX 160': {
      years: [2016, 2024],
      engines: [
        { code: 'SOHC', name: '155cc', power: '14.7cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS', 'Connected'],
      type: 'motorcycle',
      platform: 'YAMAHA_SCOOTER',
    },
    'Lander 250': {
      years: [2006, 2024],
      engines: [
        { code: 'SOHC', name: '249cc', power: '21cv', fuel: 'flex' },
      ],
      trims: ['', 'ABS'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO',
    },
    'Tenere 250': {
      years: [2011, 2024],
      engines: [
        { code: 'SOHC', name: '249cc', power: '21cv', fuel: 'flex' },
      ],
      trims: ['', 'ABS', 'Blueflex'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO',
    },
    'Tenere 700': {
      years: [2020, 2024],
      engines: [
        { code: 'DOHC', name: '689cc', power: '72cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS'],
      type: 'motorcycle',
      platform: 'YAMAHA_MOTO_BIG',
    },
  },

  // ============================================================================
  // KAWASAKI (MOTOS)
  // ============================================================================
  kawasaki: {
    'Ninja 400': {
      years: [2018, 2024],
      engines: [
        { code: 'DOHC', name: '399cc', power: '49cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS', 'KRT Edition'],
      type: 'motorcycle',
      platform: 'KAWASAKI_MOTO',
    },
    'Ninja ZX-6R': {
      years: [2009, 2024],
      engines: [
        { code: 'DOHC', name: '636cc', power: '130cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS', 'KRT Edition'],
      type: 'motorcycle',
      platform: 'KAWASAKI_MOTO_BIG',
    },
    'Z400': {
      years: [2019, 2024],
      engines: [
        { code: 'DOHC', name: '399cc', power: '49cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS'],
      type: 'motorcycle',
      platform: 'KAWASAKI_MOTO',
    },
    'Z650': {
      years: [2017, 2024],
      engines: [
        { code: 'DOHC', name: '649cc', power: '68cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS'],
      type: 'motorcycle',
      platform: 'KAWASAKI_MOTO_BIG',
    },
    'Z900': {
      years: [2017, 2024],
      engines: [
        { code: 'DOHC', name: '948cc', power: '125cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS', 'RS', 'SE'],
      type: 'motorcycle',
      platform: 'KAWASAKI_MOTO_BIG',
    },
    'Versys 650': {
      years: [2010, 2024],
      engines: [
        { code: 'DOHC', name: '649cc', power: '69cv', fuel: 'gasoline' },
      ],
      trims: ['', 'ABS', 'Tourer'],
      type: 'motorcycle',
      platform: 'KAWASAKI_MOTO_BIG',
    },
  },
};
