const puppeteer = require('puppeteer-core');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Importa serviço de base de dados de veículos
const { findVehicleByPlate, saveVehicle } = require('./vehicleDatabase');

// ═══════════════════════════════════════════════════════════════════════════
// SISTEMA INTELIGENTE DE CONSULTA DE PLACAS
// ═══════════════════════════════════════════════════════════════════════════
// PRIORIDADE:
// 1. Base de dados própria (Firebase - vehiclesDatabase)
// 2. APIs externas e scrapers (fallback)
// 
// Quando dados são obtidos de fontes externas, são salvos na base própria
// para consultas futuras, construindo gradualmente a base de dados.
// ═══════════════════════════════════════════════════════════════════════════

const SOURCE_STATUS_FILE = path.join(__dirname, '../.source-status.json');

// Cache em memória
let browserInstance = null;

// Status das fontes (bloqueadas, cooldown, etc)
let sourceStatus = {
  apiplacas: { blocked: false, blockedUntil: null, successCount: 0, failCount: 0 },
  placafipe: { blocked: false, blockedUntil: null, successCount: 0, failCount: 0 },
  keplaca: { blocked: false, blockedUntil: null, successCount: 0, failCount: 0 },
  consultaplaca: { blocked: false, blockedUntil: null, successCount: 0, failCount: 0 },
};

// Cooldown quando bloqueado (30 minutos)
const BLOCK_COOLDOWN = 30 * 60 * 1000;

// Carrega status das fontes
function loadSourceStatus() {
  try {
    if (fs.existsSync(SOURCE_STATUS_FILE)) {
      const saved = JSON.parse(fs.readFileSync(SOURCE_STATUS_FILE, 'utf8'));
      Object.keys(saved).forEach(source => {
        if (saved[source].blockedUntil && Date.now() > saved[source].blockedUntil) {
          saved[source].blocked = false;
          saved[source].blockedUntil = null;
        }
      });
      sourceStatus = { ...sourceStatus, ...saved };
    }
  } catch (e) {}
}

function saveSourceStatus() {
  try {
    fs.writeFileSync(SOURCE_STATUS_FILE, JSON.stringify(sourceStatus, null, 2));
  } catch (e) {}
}

loadSourceStatus();

// User Agents
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function markSourceBlocked(source) {
  sourceStatus[source].blocked = true;
  sourceStatus[source].blockedUntil = Date.now() + BLOCK_COOLDOWN;
  sourceStatus[source].failCount++;
  console.log(`[SOURCE] ⛔ ${source} BLOQUEADO por 30 minutos`);
  saveSourceStatus();
}

function markSourceSuccess(source) {
  sourceStatus[source].blocked = false;
  sourceStatus[source].blockedUntil = null;
  sourceStatus[source].successCount++;
  saveSourceStatus();
}

function isSourceAvailable(source) {
  const status = sourceStatus[source];
  if (!status.blocked) return true;
  if (status.blockedUntil && Date.now() > status.blockedUntil) {
    status.blocked = false;
    status.blockedUntil = null;
    return true;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════
// FONTE 1: API Placas (wdapi2.com.br)
// ═══════════════════════════════════════════════════════════════════════════
async function tryApiPlacas(plate) {
  if (!isSourceAvailable('apiplacas')) return null;

  try {
    console.log('[APIPLACAS] 🔍 Tentando...');
    
    const response = await axios.get(`https://wdapi2.com.br/consulta/${plate}/b]hs9d8a7sbd8a7sd`, {
      timeout: 15000,
      headers: { 'User-Agent': getRandomUserAgent() }
    });

    if (response.data && response.data.MARCA) {
      markSourceSuccess('apiplacas');
      return {
        marca: response.data.MARCA,
        modelo: response.data.MODELO,
        ano: response.data.ano || response.data.ANO,
        cor: response.data.cor || response.data.COR,
        combustivel: response.data.combustivel,
        municipio: response.data.MUNICIPIO,
        uf: response.data.UF,
      };
    }
    return null;
  } catch (error) {
    if (error.response?.status === 429 || error.response?.status === 403) {
      markSourceBlocked('apiplacas');
    }
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FONTE 2: Placa FIPE (placafipe.com)
// ═══════════════════════════════════════════════════════════════════════════
async function tryPlacaFipe(plate) {
  if (!isSourceAvailable('placafipe')) return null;

  let page = null;
  try {
    console.log('[PLACAFIPE] 🔍 Tentando...');
    
    const browser = await getBrowser();
    page = await browser.newPage();
    await setupStealthPage(page);
    
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) req.abort();
      else req.continue();
    });

    const response = await page.goto(`https://www.placafipe.com/placa/${plate}`, {
      waitUntil: 'domcontentloaded', timeout: 20000
    });

    if (response.status() === 403 || response.status() === 429) {
      markSourceBlocked('placafipe');
      await page.close();
      return null;
    }

    await delay(2000);
    const data = await extractDataFromPage(page);
    await page.close();

    if (data.marca) {
      markSourceSuccess('placafipe');
      return data;
    }
    return null;
  } catch (error) {
    if (page) try { await page.close(); } catch (e) {}
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FONTE 3: Keplaca (keplaca.com)
// ═══════════════════════════════════════════════════════════════════════════
async function tryKeplaca(plate) {
  if (!isSourceAvailable('keplaca')) return null;

  let page = null;
  try {
    console.log('[KEPLACA] 🔍 Tentando...');
    
    const browser = await getBrowser(true);
    page = await browser.newPage();
    await setupStealthPage(page);
    
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) req.abort();
      else req.continue();
    });

    // Acessa homepage primeiro
    try {
      await page.goto('https://www.keplaca.com/', { waitUntil: 'domcontentloaded', timeout: 10000 });
      await delay(1500);
    } catch (e) {}

    const response = await page.goto(`https://www.keplaca.com/placa/${plate}`, {
      waitUntil: 'domcontentloaded', timeout: 25000
    });

    if (response.status() === 403 || response.status() === 429) {
      markSourceBlocked('keplaca');
      await page.close();
      return null;
    }

    await delay(3000);
    const data = await extractDataFromPage(page);
    await page.close();

    if (data.marca) {
      markSourceSuccess('keplaca');
      return data;
    }
    return null;
  } catch (error) {
    if (page) try { await page.close(); } catch (e) {}
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FONTE 4: Tabela FIPE Brasil
// ═══════════════════════════════════════════════════════════════════════════
async function tryTabelaFipe(plate) {
  if (!isSourceAvailable('consultaplaca')) return null;

  let page = null;
  try {
    console.log('[TABELAFIPE] 🔍 Tentando...');
    
    const browser = await getBrowser();
    page = await browser.newPage();
    await setupStealthPage(page);
    
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) req.abort();
      else req.continue();
    });

    const response = await page.goto(`https://www.tabelafipebrasil.com/placa/${plate}`, {
      waitUntil: 'domcontentloaded', timeout: 20000
    });

    if (response.status() === 403 || response.status() === 429) {
      markSourceBlocked('consultaplaca');
      await page.close();
      return null;
    }

    await delay(2500);
    const data = await extractDataFromPage(page);
    await page.close();

    if (data.marca) {
      markSourceSuccess('consultaplaca');
      return data;
    }
    return null;
  } catch (error) {
    if (page) try { await page.close(); } catch (e) {}
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXTRAÇÃO DE DADOS DA PÁGINA
// ═══════════════════════════════════════════════════════════════════════════
async function extractDataFromPage(page) {
  return await page.evaluate(() => {
    const text = document.body.innerText;
    const result = {};
    
    let match = text.match(/Marca:\s*([^\n\r]+?)(?=\s*Modelo:)/i);
    if (!match) match = text.match(/Marca:\s*([A-Z][A-Za-z\s\/\-]+?)[\n\r]/i);
    if (match) result.marca = match[1].trim();
    
    match = text.match(/Modelo:\s*([A-Z0-9\/\s\-\.]+?)(?=\s*Importado:|Ano:|$)/i);
    if (match) result.modelo = match[1].trim();
    
    match = text.match(/Ano:\s*(\d{4})/i);
    if (match) result.ano = match[1];
    
    match = text.match(/Cor:\s*([A-Za-zÀ-ÿ\s]+?)(?=\s*Combustível:|Chassi:|$)/i);
    if (!match) match = text.match(/Cor:\s*([A-Za-zÀ-ÿ]+)/i);
    if (match) result.cor = match[1].trim();

    match = text.match(/Combustível:\s*([A-Za-zÀ-ÿ\/\s]+?)(?=\s*Chassi:|UF:|$)/i);
    if (match) result.combustivel = match[1].trim();

    match = text.match(/UF:\s*([A-Z]{2})/i);
    if (match) result.uf = match[1];

    match = text.match(/Município:\s*([A-ZÀ-ÿ\s]+?)(?=\s*Esta placa|$)/i);
    if (match) result.municipio = match[1].trim();
    
    return result;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// BROWSER SETUP
// ═══════════════════════════════════════════════════════════════════════════
async function getBrowser(forceNew = false) {
  if (!forceNew && browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  if (browserInstance) {
    try { await browserInstance.close(); } catch (e) {}
    browserInstance = null;
  }

  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.CHROME_PATH,
  ].filter(Boolean);

  let executablePath = chromePaths.find(p => {
    try { return fs.existsSync(p); } catch { return false; }
  });

  if (!executablePath) throw new Error('Chrome não encontrado');

  browserInstance = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled', '--window-size=1920,1080', '--lang=pt-BR',
    ],
    ignoreDefaultArgs: ['--enable-automation'],
  });

  return browserInstance;
}

async function setupStealthPage(page) {
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'languages', { get: () => ['pt-BR', 'pt', 'en'] });
    window.chrome = { runtime: {} };
  });
  
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(getRandomUserAgent());
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
    'sec-ch-ua': '"Chromium";v="121", "Google Chrome";v="121"',
  });
  page.setDefaultTimeout(25000);
  
  return page;
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
async function scrapeKeplaca(plate) {
  const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`[CONSULTA] 🔍 Placa: ${cleanPlate}`);
  console.log(`${'═'.repeat(60)}`);

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORIDADE 1: BASE DE DADOS PRÓPRIA (FIREBASE)
  // ═══════════════════════════════════════════════════════════════════════
  console.log('\n[STEP 1] 📦 Consultando base de dados própria...');
  
  const dbResult = await findVehicleByPlate(cleanPlate);
  
  if (dbResult) {
    console.log(`[DATABASE] ✅ ENCONTRADO NA BASE PRÓPRIA!`);
    console.log(`[DATABASE] 📦 ${dbResult.marca} ${dbResult.modelo}, Cor: ${dbResult.cor}`);
    return { success: true, data: dbResult, source: 'database' };
  }
  
  console.log('[DATABASE] ❌ Não encontrado na base própria');

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORIDADE 2: FONTES EXTERNAS (APIs e Scrapers)
  // ═══════════════════════════════════════════════════════════════════════
  console.log('\n[STEP 2] 🌐 Consultando fontes externas...');
  
  // Mostra status das fontes
  console.log('[SOURCES] Status:');
  Object.entries(sourceStatus).forEach(([name, status]) => {
    const available = isSourceAvailable(name);
    console.log(`  - ${name}: ${available ? '✅' : '⛔'} (${status.successCount} ok, ${status.failCount} fail)`);
  });

  // Ordem de prioridade (APIs primeiro, depois scrapers)
  const sources = [
    { name: 'apiplacas', fn: tryApiPlacas },
    { name: 'placafipe', fn: tryPlacaFipe },
    { name: 'keplaca', fn: tryKeplaca },
    { name: 'consultaplaca', fn: tryTabelaFipe },
  ];

  // Ordena por taxa de sucesso
  sources.sort((a, b) => {
    const aSuccess = sourceStatus[a.name]?.successCount || 0;
    const bSuccess = sourceStatus[b.name]?.successCount || 0;
    return bSuccess - aSuccess;
  });

  for (const source of sources) {
    if (!isSourceAvailable(source.name)) continue;
    
    try {
      const data = await source.fn(cleanPlate);
      
      if (data && data.marca) {
        // Monta modelo completo
        let modeloCompleto = data.modelo || '';
        if (data.marca && !modeloCompleto.toLowerCase().includes(data.marca.toLowerCase())) {
          modeloCompleto = `${data.marca} ${modeloCompleto}`.trim();
        }
        if (data.ano && !modeloCompleto.includes(data.ano)) {
          modeloCompleto = `${modeloCompleto} ${data.ano}`.trim();
        }

        const result = {
          placa: cleanPlate,
          marca: data.marca,
          modelo: modeloCompleto,
          ano: data.ano,
          cor: data.cor,
          combustivel: data.combustivel,
          municipio: data.municipio,
          uf: data.uf,
          fonte: source.name,
        };

        console.log(`\n[${source.name.toUpperCase()}] ✅ SUCESSO!`);
        console.log(`[RESULT] 📦 ${result.marca} ${result.modelo}, Cor: ${result.cor}`);

        // ═══════════════════════════════════════════════════════════════════
        // SALVA NA BASE DE DADOS PRÓPRIA (FIREBASE)
        // ═══════════════════════════════════════════════════════════════════
        console.log('\n[STEP 3] 💾 Salvando na base de dados própria...');
        const saved = await saveVehicle(result);
        if (saved) {
          console.log('[DATABASE] ✅ Veículo salvo com sucesso!');
        }

        return { success: true, data: result, source: source.name };
      }
    } catch (error) {
      console.log(`[${source.name.toUpperCase()}] ❌ Erro:`, error.message);
    }
    
    await delay(1000);
  }

  // Todas as fontes falharam
  console.log('\n[RESULT] ❌ Nenhuma fonte retornou dados');
  
  return {
    success: false,
    error: 'Não foi possível consultar a placa em nenhuma fonte disponível.',
    blockedSources: Object.entries(sourceStatus)
      .filter(([_, s]) => s.blocked)
      .map(([name]) => name),
  };
}

// Cleanup
process.on('exit', () => {
  if (browserInstance) browserInstance.close().catch(() => {});
});

module.exports = { scrapeKeplaca };
