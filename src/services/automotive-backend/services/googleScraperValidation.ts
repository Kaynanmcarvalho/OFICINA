/**
 * TORQ Automotive - Google Scraper Validation Service
 * 
 * Valida peças automotivas fazendo buscas no Google e extraindo
 * informações de catálogos oficiais e sites especializados
 * 
 * @version 1.0.0
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface PartValidationRequest {
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleEngine?: string;
  partName: string;
  oemCode: string;
  equivalents: { brand: string; code: string }[];
}

export interface ScraperValidationResult {
  isValid: boolean;
  oemCodeValid: boolean;
  oemCodeSources: string[];
  validEquivalents: { brand: string; code: string; sources: string[] }[];
  invalidEquivalents: { brand: string; code: string; reason: string }[];
  suggestedCorrections: { brand: string; correctCode: string; source: string }[];
  confidence: number;
  searchResults: SearchResult[];
  timestamp: string;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  isRelevant: boolean;
}

export interface BulkValidationProgress {
  current: number;
  total: number;
  partName: string;
  status: 'validating' | 'completed' | 'error';
}

// ============================================================================
// TRUSTED SOURCES - Sites confiáveis para validação
// ============================================================================

const TRUSTED_SOURCES = [
  // Catálogos oficiais de filtros
  'mann-filter.com',
  'mahle-aftermarket.com',
  'bosch.com.br',
  'fram.com.br',
  'tecfil.com.br',
  'wixfilters.com',
  
  // Catálogos de ignição
  'ngk.com.br',
  'denso.com.br',
  'champion-auto.com',
  
  // Catálogos de freios
  'trw.com',
  'ferodo.com',
  'fremax.com.br',
  'cobreq.com.br',
  'fras-le.com',
  
  // Catálogos de correias e bombas
  'gates.com',
  'continental-aftermarket.com',
  'dayco.com',
  'skf.com',
  'ina.de',
  
  // Catálogos de suspensão
  'monroe.com.br',
  'cofap.com.br',
  'kayaba.com',
  'nakata.com.br',
  
  // Catálogos de arrefecimento
  'mte-thomson.com.br',
  'wahler.de',
  
  // Sites de referência cruzada
  'partsfinder.com',
  'partslink24.com',
  'tecdoc.net',
  
  // Montadoras
  'parts.hyundai.com',
  'fiat.com.br',
  'vw.com.br',
  'toyota.com.br',
  'honda.com.br',
  'chevrolet.com.br',
  'renault.com.br',
];

// ============================================================================
// SEARCH QUERY BUILDERS
// ============================================================================

function buildOemValidationQuery(request: PartValidationRequest): string {
  return `"${request.oemCode}" ${request.vehicleBrand} ${request.vehicleModel} ${request.partName} compatível`;
}

function buildEquivalentValidationQuery(
  request: PartValidationRequest,
  equivalent: { brand: string; code: string }
): string {
  return `"${equivalent.code}" ${equivalent.brand} ${request.vehicleBrand} ${request.vehicleModel} ${request.partName}`;
}

function buildCrossReferenceQuery(request: PartValidationRequest): string {
  return `${request.oemCode} equivalente ${request.partName} ${request.vehicleBrand} ${request.vehicleModel}`;
}

// ============================================================================
// BACKEND SCRAPER ENDPOINT
// ============================================================================

/**
 * Faz a validação via backend (servidor Node.js com Puppeteer)
 * O backend faz o scraping real do Google
 */
async function validateViaBackend(request: PartValidationRequest): Promise<ScraperValidationResult> {
  // @ts-ignore - Vite env
  const apiUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${apiUrl}/api/parts/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('[GoogleScraper] Backend validation failed:', error);
    throw error;
  }
}

// ============================================================================
// LOCAL VALIDATION (Fallback sem backend)
// ============================================================================

/**
 * Validação local baseada em padrões conhecidos
 * Usado quando o backend não está disponível
 */
function validateLocally(request: PartValidationRequest): ScraperValidationResult {
  const validEquivalents: ScraperValidationResult['validEquivalents'] = [];
  const invalidEquivalents: ScraperValidationResult['invalidEquivalents'] = [];
  const suggestedCorrections: ScraperValidationResult['suggestedCorrections'] = [];
  
  // Padrões conhecidos de códigos por marca
  const brandPatterns: Record<string, RegExp> = {
    'MANN': /^[A-Z]{1,2}\s?\d{2,5}(\s?\/\s?\d+)?$/i,
    'MAHLE': /^[A-Z]{2,3}\s?\d{3,4}[A-Z]?$/i,
    'BOSCH': /^0\s?\d{3}\s?\d{3}\s?\d{3}$/,
    'FRAM': /^(PH|CA|CF|CH)\d{4,5}[A-Z]?$/i,
    'TECFIL': /^(PSL|ARL|GI|ACP)\s?\d{2,4}(\/\d)?$/i,
    'NGK': /^[A-Z]{2,8}\d{1,2}[A-Z]{0,4}\d?$/i,
    'DENSO': /^[A-Z]{2,4}\d{2}[A-Z]{0,2}$/i,
    'TRW': /^(GDB|DF)\d{4}$/i,
    'FERODO': /^FDB\d{4}$/i,
    'GATES': /^\d{4}XS$|^\dPK\d{4}$/i,
    'SKF': /^VK[A-Z]{2}\s?\d{5}$/i,
    'MONROE': /^[A-Z]\d{4}$/i,
    'HIFLOFILTRO': /^HF[A]?\d{3,4}$/i,
  };
  
  // Validar cada equivalente
  for (const eq of request.equivalents) {
    const pattern = brandPatterns[eq.brand.toUpperCase()];
    
    if (pattern) {
      const normalizedCode = eq.code.replace(/[\s-]/g, ' ').trim();
      if (pattern.test(normalizedCode)) {
        validEquivalents.push({
          brand: eq.brand,
          code: eq.code,
          sources: ['Padrão de código válido para a marca'],
        });
      } else {
        invalidEquivalents.push({
          brand: eq.brand,
          code: eq.code,
          reason: `Código não segue o padrão esperado para ${eq.brand}`,
        });
      }
    } else {
      // Marca desconhecida - assumir válido mas com baixa confiança
      validEquivalents.push({
        brand: eq.brand,
        code: eq.code,
        sources: ['Marca não verificada - assumido válido'],
      });
    }
  }
  
  // Verificar código OEM
  const oemValid = /^[\dA-Z]{2,}[-\s]?[\dA-Z]{2,}[-\s]?[\dA-Z]{0,}$/i.test(request.oemCode);
  
  return {
    isValid: oemValid && invalidEquivalents.length === 0,
    oemCodeValid: oemValid,
    oemCodeSources: ['Validação local por padrão'],
    validEquivalents,
    invalidEquivalents,
    suggestedCorrections,
    confidence: 0.6, // Confiança menor para validação local
    searchResults: [],
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Valida uma peça usando scraping do Google
 * Tenta usar o backend primeiro, fallback para validação local
 */
export async function validatePartWithScraper(
  request: PartValidationRequest
): Promise<ScraperValidationResult> {

  try {
    // Tentar validação via backend
    const result = await validateViaBackend(request);
    return result;
  } catch (error) {
    return validateLocally(request);
  }
}

/**
 * Valida múltiplas peças em lote
 */
export async function validatePartsBatch(
  requests: PartValidationRequest[],
  onProgress?: (progress: BulkValidationProgress) => void
): Promise<Map<string, ScraperValidationResult>> {
  const results = new Map<string, ScraperValidationResult>();
  
  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    const key = `${request.vehicleBrand}_${request.vehicleModel}_${request.partName}`;
    
    onProgress?.({
      current: i + 1,
      total: requests.length,
      partName: request.partName,
      status: 'validating',
    });
    
    // Rate limiting - esperar entre requisições
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    try {
      const result = await validatePartWithScraper(request);
      results.set(key, result);
    } catch (error: any) {
      results.set(key, {
        isValid: false,
        oemCodeValid: false,
        oemCodeSources: [],
        validEquivalents: [],
        invalidEquivalents: [],
        suggestedCorrections: [],
        confidence: 0,
        searchResults: [],
        timestamp: new Date().toISOString(),
      });
    }
  }
  
  onProgress?.({
    current: requests.length,
    total: requests.length,
    partName: '',
    status: 'completed',
  });
  
  return results;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  validatePartWithScraper,
  validatePartsBatch,
  TRUSTED_SOURCES,
};
