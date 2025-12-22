/**
 * TORQ Automotive - Servidor de Validação de Peças
 * 
 * Servidor simplificado apenas para validação de peças via Google Scraper
 * Não depende de Firebase ou WhatsApp
 * 
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// ============================================================================
// TRUSTED SOURCES
// ============================================================================

const TRUSTED_DOMAINS = [
  'mann-filter.com',
  'mahle-aftermarket.com',
  'bosch.com.br',
  'fram.com.br',
  'tecfil.com.br',
  'ngk.com.br',
  'denso.com.br',
  'trw.com',
  'ferodo.com',
  'gates.com',
  'skf.com',
  'monroe.com.br',
  'cofap.com.br',
  'parts.hyundai.com',
  'fiat.com.br',
  'vw.com.br',
  'toyota.com.br',
  'honda.com.br',
  'nakata.com.br',
  'sachs.com.br',
  'valeo.com',
];

// ============================================================================
// GOOGLE SEARCH SCRAPER
// ============================================================================

async function searchGoogle(query, maxResults = 10) {
  let browser = null;
  
  try {
    const puppeteer = require('puppeteer');
    
    console.log(`[Scraper] Buscando: ${query}`);
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1920,1080',
      ],
    });
    
    const page = await browser.newPage();
    
    // User agent realista
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    );
    
    // Configurar viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navegar para o Google
    const searchUrl = `https://www.google.com.br/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&num=20`;
    console.log(`[Scraper] URL: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Aguardar um pouco para a página carregar completamente
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Tirar screenshot para debug
    // await page.screenshot({ path: 'debug-search.png' });
    
    // Tentar múltiplos seletores
    const selectors = ['#search', '#rso', '.g', '[data-hveid]'];
    let foundSelector = null;
    
    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        foundSelector = selector;
        console.log(`[Scraper] Encontrado seletor: ${selector}`);
        break;
      } catch (e) {
        // Continuar tentando
      }
    }
    
    if (!foundSelector) {
      console.log('[Scraper] Nenhum seletor de resultados encontrado');
      // Pegar o HTML da página para debug
      const html = await page.content();
      console.log(`[Scraper] Tamanho do HTML: ${html.length} caracteres`);
      
      // Verificar se há CAPTCHA
      if (html.includes('captcha') || html.includes('unusual traffic')) {
        console.log('[Scraper] ⚠️ Google detectou tráfego incomum (CAPTCHA)');
      }
    }
    
    // Extrair resultados usando múltiplas estratégias
    const results = await page.evaluate((trustedDomains) => {
      const items = [];
      
      // Estratégia 1: Seletores tradicionais
      let searchResults = document.querySelectorAll('#search .g, #rso .g, .g[data-hveid]');
      
      // Estratégia 2: Links com h3
      if (searchResults.length === 0) {
        searchResults = document.querySelectorAll('a:has(h3)');
      }
      
      // Estratégia 3: Divs com data-ved
      if (searchResults.length === 0) {
        searchResults = document.querySelectorAll('div[data-ved] a[href^="http"]');
      }
      
      console.log(`Encontrados ${searchResults.length} elementos`);
      
      searchResults.forEach((result, index) => {
        if (index >= 15) return;
        
        let titleEl, linkEl, snippetEl;
        
        // Tentar diferentes estruturas
        if (result.tagName === 'A') {
          linkEl = result;
          titleEl = result.querySelector('h3');
          snippetEl = result.closest('.g')?.querySelector('[data-sncf], .VwiC3b, .IsZvec');
        } else {
          titleEl = result.querySelector('h3');
          linkEl = result.querySelector('a[href^="http"]');
          snippetEl = result.querySelector('[data-sncf], .VwiC3b, .IsZvec, .st');
        }
        
        if (titleEl && linkEl) {
          const url = linkEl.href;
          let domain = '';
          try {
            domain = new URL(url).hostname.replace('www.', '');
          } catch (e) {
            domain = url;
          }
          
          // Ignorar links do Google
          if (domain.includes('google.com') || domain.includes('google.com.br')) {
            return;
          }
          
          const isTrusted = trustedDomains.some(d => domain.includes(d));
          
          items.push({
            title: titleEl.textContent || '',
            url: url,
            snippet: snippetEl?.textContent || '',
            domain: domain,
            isTrusted: isTrusted,
          });
        }
      });
      
      return items;
    }, TRUSTED_DOMAINS);
    
    console.log(`[Scraper] Encontrados ${results.length} resultados`);
    
    return {
      results,
      query,
    };
  } catch (error) {
    console.error('[Scraper] Erro:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// ============================================================================
// VALIDATION LOGIC
// ============================================================================

function analyzeSearchResults(searchData, request) {
  const { results } = searchData;
  
  let oemValid = false;
  const oemSources = [];
  const validEquivalents = [];
  const invalidEquivalents = [];
  const suggestedCorrections = [];
  
  // Normalizar código OEM para comparação
  const oemNormalized = request.oemCode.replace(/[\s-]/g, '').toLowerCase();
  
  // Analisar resultados para código OEM
  for (const result of results) {
    const content = `${result.title} ${result.snippet}`.toLowerCase();
    const contentNormalized = content.replace(/[\s-]/g, '');
    
    // Verificar se o código OEM aparece nos resultados
    if (contentNormalized.includes(oemNormalized) || content.includes(request.oemCode.toLowerCase())) {
      // Verificar se menciona o veículo
      const vehicleMatch = 
        content.includes(request.vehicleBrand.toLowerCase()) ||
        content.includes(request.vehicleModel.toLowerCase());
      
      if (vehicleMatch || result.isTrusted) {
        oemValid = true;
        if (!oemSources.includes(result.url)) {
          oemSources.push(result.url);
        }
      }
    }
  }
  
  // Analisar equivalentes
  for (const eq of (request.equivalents || [])) {
    let found = false;
    const sources = [];
    const eqNormalized = eq.code.replace(/[\s-]/g, '').toLowerCase();
    
    for (const result of results) {
      const content = `${result.title} ${result.snippet}`.toLowerCase();
      const contentNormalized = content.replace(/[\s-]/g, '');
      
      if (contentNormalized.includes(eqNormalized) || content.includes(eq.code.toLowerCase())) {
        found = true;
        if (result.isTrusted && !sources.includes(result.url)) {
          sources.push(result.url);
        }
      }
    }
    
    if (found) {
      validEquivalents.push({
        brand: eq.brand,
        code: eq.code,
        sources,
      });
    } else {
      invalidEquivalents.push({
        brand: eq.brand,
        code: eq.code,
        reason: 'Código não encontrado nos resultados de busca',
      });
    }
  }
  
  // Calcular confiança
  const trustedResults = results.filter(r => r.isTrusted).length;
  const confidence = Math.min(0.95, 0.4 + (trustedResults * 0.1) + (oemSources.length * 0.15));
  
  return {
    isValid: oemValid && invalidEquivalents.length < (request.equivalents?.length || 0) / 2,
    oemCodeValid: oemValid,
    oemCodeSources: oemSources,
    validEquivalents,
    invalidEquivalents,
    suggestedCorrections,
    confidence,
    searchResults: results.slice(0, 10).map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet.substring(0, 200),
      isRelevant: r.isTrusted,
    })),
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * POST /api/parts/validate
 * Valida uma peça específica
 */
app.post('/api/parts/validate', async (req, res) => {
  try {
    const request = req.body;
    
    if (!request.oemCode || !request.vehicleBrand || !request.vehicleModel) {
      return res.status(400).json({
        error: 'Missing required fields: oemCode, vehicleBrand, vehicleModel',
      });
    }
    
    console.log(`[Validation] Validando: ${request.partName || 'Peça'} (${request.oemCode}) para ${request.vehicleBrand} ${request.vehicleModel}`);
    
    // Construir query de busca
    const query = `"${request.oemCode}" ${request.vehicleBrand} ${request.vehicleModel} ${request.partName || ''} peça compatível`;
    
    // Fazer busca no Google
    const searchData = await searchGoogle(query);
    
    // Analisar resultados
    const result = analyzeSearchResults(searchData, request);
    
    console.log(`[Validation] Resultado: ${result.isValid ? 'VÁLIDO' : 'INVÁLIDO'} (confiança: ${(result.confidence * 100).toFixed(0)}%)`);
    
    res.json(result);
  } catch (error) {
    console.error('[Validation] Erro:', error);
    res.status(500).json({
      error: error.message,
      isValid: false,
      confidence: 0,
    });
  }
});

/**
 * GET /api/parts/search
 * Busca informações sobre uma peça
 */
app.get('/api/parts/search', async (req, res) => {
  try {
    const { code, brand, vehicle } = req.query;
    
    if (!code) {
      return res.status(400).json({
        error: 'Missing required query parameter: code',
      });
    }
    
    const query = `"${code}" ${brand || ''} ${vehicle || ''} peça automotiva`;
    const searchData = await searchGoogle(query);
    
    res.json({
      query,
      results: searchData.results,
    });
  } catch (error) {
    console.error('[Search] Erro:', error);
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * POST /api/parts/validate-batch
 * Valida múltiplas peças
 */
app.post('/api/parts/validate-batch', async (req, res) => {
  try {
    const { parts } = req.body;
    
    if (!Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({
        error: 'Missing or empty parts array',
      });
    }
    
    console.log(`[Batch] Validando ${parts.length} peças...`);
    
    const results = [];
    
    for (let i = 0; i < parts.length; i++) {
      const request = parts[i];
      
      // Rate limiting - 3 segundos entre requisições
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      try {
        const query = `"${request.oemCode}" ${request.vehicleBrand} ${request.vehicleModel} ${request.partName || ''}`;
        const searchData = await searchGoogle(query);
        const result = analyzeSearchResults(searchData, request);
        
        results.push({
          partId: request.partId || `part_${i}`,
          partName: request.partName,
          ...result,
        });
        
        console.log(`[Batch] ${i + 1}/${parts.length}: ${request.partName} - ${result.isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
        
      } catch (error) {
        results.push({
          partId: request.partId || `part_${i}`,
          partName: request.partName,
          isValid: false,
          error: error.message,
        });
      }
    }
    
    res.json({
      total: parts.length,
      validated: results.filter(r => !r.error).length,
      valid: results.filter(r => r.isValid).length,
      invalid: results.filter(r => !r.isValid && !r.error).length,
      errors: results.filter(r => r.error).length,
      results,
    });
  } catch (error) {
    console.error('[Batch] Erro:', error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('       TORQ Automotive - Servidor de Validação de Peças        ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   POST /api/parts/validate - Validar uma peça`);
  console.log(`   POST /api/parts/validate-batch - Validar múltiplas peças`);
  console.log(`   GET  /api/parts/search - Buscar informações de peça`);
  console.log(`   GET  /health - Health check`);
  console.log('═══════════════════════════════════════════════════════════════');
});

module.exports = app;
