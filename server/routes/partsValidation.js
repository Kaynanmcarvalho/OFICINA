/**
 * TORQ Automotive - Parts Validation API
 * 
 * Endpoint para validação de peças via scraping do Google
 * Usa Puppeteer para fazer buscas e extrair informações
 * 
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();

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
];

// ============================================================================
// GOOGLE SEARCH SCRAPER
// ============================================================================

async function searchGoogle(query, maxResults = 10) {
  let browser = null;
  
  try {
    const puppeteer = require('puppeteer');
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
    
    const page = await browser.newPage();
    
    // User agent realista
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // Configurar viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navegar para o Google
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Aguardar resultados
    await page.waitForSelector('#search', { timeout: 10000 }).catch(() => {});
    
    // Extrair resultados
    const results = await page.evaluate((trustedDomains) => {
      const items = [];
      const searchResults = document.querySelectorAll('#search .g');
      
      searchResults.forEach((result, index) => {
        if (index >= 10) return;
        
        const titleEl = result.querySelector('h3');
        const linkEl = result.querySelector('a');
        const snippetEl = result.querySelector('.VwiC3b, .IsZvec');
        
        if (titleEl && linkEl) {
          const url = linkEl.href;
          const domain = new URL(url).hostname.replace('www.', '');
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
    
    // Verificar se há AI Overview (SGE)
    const aiOverview = await page.evaluate(() => {
      const aiBox = document.querySelector('[data-attrid="wa:/description"]');
      if (aiBox) {
        return aiBox.textContent;
      }
      
      // Tentar outros seletores de AI Overview
      const sgBox = document.querySelector('.kp-wholepage');
      if (sgBox) {
        return sgBox.textContent;
      }
      
      return null;
    });
    
    return {
      results,
      aiOverview,
      query,
    };
  } catch (error) {
    console.error('[GoogleScraper] Error:', error.message);
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
  const { results, aiOverview } = searchData;
  
  let oemValid = false;
  const oemSources = [];
  const validEquivalents = [];
  const invalidEquivalents = [];
  const suggestedCorrections = [];
  
  // Analisar resultados para código OEM
  for (const result of results) {
    const content = `${result.title} ${result.snippet}`.toLowerCase();
    const oemLower = request.oemCode.toLowerCase().replace(/[\s-]/g, '');
    
    // Verificar se o código OEM aparece nos resultados
    if (content.includes(oemLower) || content.includes(request.oemCode.toLowerCase())) {
      // Verificar se menciona o veículo
      const vehicleMatch = 
        content.includes(request.vehicleBrand.toLowerCase()) ||
        content.includes(request.vehicleModel.toLowerCase());
      
      if (vehicleMatch && result.isTrusted) {
        oemValid = true;
        oemSources.push(result.url);
      }
    }
  }
  
  // Analisar equivalentes
  for (const eq of request.equivalents) {
    let found = false;
    const sources = [];
    
    for (const result of results) {
      const content = `${result.title} ${result.snippet}`.toLowerCase();
      const eqCode = eq.code.toLowerCase().replace(/[\s-]/g, '');
      
      if (content.includes(eqCode) || content.includes(eq.code.toLowerCase())) {
        found = true;
        if (result.isTrusted) {
          sources.push(result.url);
        }
      }
    }
    
    if (found && sources.length > 0) {
      validEquivalents.push({
        brand: eq.brand,
        code: eq.code,
        sources,
      });
    } else if (!found) {
      invalidEquivalents.push({
        brand: eq.brand,
        code: eq.code,
        reason: 'Código não encontrado em fontes confiáveis',
      });
    }
  }
  
  // Calcular confiança
  const trustedResults = results.filter(r => r.isTrusted).length;
  const confidence = Math.min(0.95, 0.5 + (trustedResults * 0.1) + (oemSources.length * 0.1));
  
  return {
    isValid: oemValid && invalidEquivalents.length === 0,
    oemCodeValid: oemValid,
    oemCodeSources: oemSources,
    validEquivalents,
    invalidEquivalents,
    suggestedCorrections,
    confidence,
    searchResults: results.map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet,
      isRelevant: r.isTrusted,
    })),
    aiOverview: aiOverview || null,
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
router.post('/validate', async (req, res) => {
  try {
    const request = req.body;
    
    if (!request.oemCode || !request.vehicleBrand || !request.vehicleModel) {
      return res.status(400).json({
        error: 'Missing required fields: oemCode, vehicleBrand, vehicleModel',
      });
    }
    
    console.log(`[PartsValidation] Validating: ${request.partName} (${request.oemCode})`);
    
    // Construir query de busca
    const query = `"${request.oemCode}" ${request.vehicleBrand} ${request.vehicleModel} ${request.partName || ''} compatível`;
    
    // Fazer busca no Google
    const searchData = await searchGoogle(query);
    
    // Analisar resultados
    const result = analyzeSearchResults(searchData, request);
    
    console.log(`[PartsValidation] Result: ${result.isValid ? 'VALID' : 'INVALID'} (confidence: ${result.confidence})`);
    
    res.json(result);
  } catch (error) {
    console.error('[PartsValidation] Error:', error);
    res.status(500).json({
      error: error.message,
      isValid: false,
      confidence: 0,
    });
  }
});

/**
 * POST /api/parts/validate-batch
 * Valida múltiplas peças
 */
router.post('/validate-batch', async (req, res) => {
  try {
    const { parts } = req.body;
    
    if (!Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({
        error: 'Missing or empty parts array',
      });
    }
    
    console.log(`[PartsValidation] Batch validation: ${parts.length} parts`);
    
    const results = [];
    
    for (let i = 0; i < parts.length; i++) {
      const request = parts[i];
      
      // Rate limiting
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
    console.error('[PartsValidation] Batch error:', error);
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /api/parts/search
 * Busca informações sobre uma peça
 */
router.get('/search', async (req, res) => {
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
      aiOverview: searchData.aiOverview,
    });
  } catch (error) {
    console.error('[PartsValidation] Search error:', error);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
