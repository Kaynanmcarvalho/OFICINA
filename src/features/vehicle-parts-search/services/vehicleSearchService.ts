/**
 * Vehicle Search Service - Autocomplete Inteligente
 * Busca de veículos com lógica avançada de filtragem
 * @version 3.0.0 - Busca Inteligente
 */

import { BRAZILIAN_VEHICLES_DATABASE, VEHICLES_BY_BRAND, BRAND_LOGOS } from '../data/brazilianVehicles';
import type { VehicleVariant, VehicleSuggestion, VehicleType } from '../types';

// Log para verificar se a base foi carregada
console.log(`[VehicleSearchService] Database loaded: ${BRAZILIAN_VEHICLES_DATABASE?.length || 0} vehicles`);

// Lista de todas as marcas conhecidas (normalizado)
const KNOWN_BRANDS = new Set([
  'volkswagen', 'vw', 'chevrolet', 'gm', 'fiat', 'ford', 'toyota', 'honda',
  'hyundai', 'renault', 'nissan', 'jeep', 'kia', 'peugeot', 'citroen', 'citroën',
  'mitsubishi', 'suzuki', 'bmw', 'audi', 'mercedes', 'mercedes-benz', 'volvo',
  'land rover', 'landrover', 'porsche', 'jaguar', 'lexus', 'mini', 'alfa romeo',
  'alfaromeo', 'maserati', 'ferrari', 'lamborghini', 'chery', 'jac', 'byd', 'gwm',
  'ram', 'dodge', 'chrysler', 'subaru', 'ssangyong', 'troller', 'yamaha', 'kawasaki',
  'ducati', 'harley', 'harley-davidson', 'triumph', 'ktm', 'royal enfield', 'dafra',
  'shineray', 'haojue', 'scania', 'iveco', 'daf', 'man', 'marcopolo'
]);

// Aliases de marcas
const BRAND_ALIASES: Record<string, string> = {
  'vw': 'volkswagen',
  'gm': 'chevrolet',
  'mercedes': 'mercedes-benz',
  'landrover': 'land rover',
  'alfaromeo': 'alfa romeo',
  'harley': 'harley-davidson',
  'citroën': 'citroen',
};

// Normaliza texto para busca
const normalize = (text: string): string =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

// Tokeniza query em palavras
const tokenize = (query: string): string[] =>
  normalize(query).split(/\s+/).filter(t => t.length > 0);

// Detecta se um token é uma marca conhecida
const isBrandToken = (token: string): string | null => {
  const normalized = normalize(token);
  if (KNOWN_BRANDS.has(normalized)) {
    return BRAND_ALIASES[normalized] || normalized;
  }
  // Verifica aliases
  if (BRAND_ALIASES[normalized]) {
    return BRAND_ALIASES[normalized];
  }
  return null;
};

// Detecta se um token é um ano (4 dígitos entre 1950 e 2030)
const isYearToken = (token: string): number | null => {
  if (/^\d{4}$/.test(token)) {
    const year = parseInt(token, 10);
    if (year >= 1950 && year <= 2030) return year;
  }
  return null;
};

// Analisa a query para extrair intenção do usuário
interface QueryAnalysis {
  detectedBrand: string | null;
  detectedYear: number | null;
  modelTokens: string[];
  isExactSearch: boolean;
}

const analyzeQuery = (query: string): QueryAnalysis => {
  const tokens = tokenize(query);
  let detectedBrand: string | null = null;
  let detectedYear: number | null = null;
  const modelTokens: string[] = [];
  
  for (const token of tokens) {
    // Verifica se é marca
    const brand = isBrandToken(token);
    if (brand && !detectedBrand) {
      detectedBrand = brand;
      continue;
    }
    
    // Verifica se é ano
    const year = isYearToken(token);
    if (year && !detectedYear) {
      detectedYear = year;
      continue;
    }
    
    // Resto são tokens de modelo
    modelTokens.push(token);
  }
  
  // Busca exata se tem marca + modelo ou modelo específico longo
  const isExactSearch = (detectedBrand && modelTokens.length > 0) || 
                        modelTokens.some(t => t.length >= 4);
  
  return { detectedBrand, detectedYear, modelTokens, isExactSearch };
};

// Calcula score de relevância - BUSCA INTELIGENTE
const calculateScore = (
  variant: VehicleVariant, 
  analysis: QueryAnalysis
): number => {
  let score = 0;
  let requiredMatches = 0;
  let actualMatches = 0;
  
  const brandNorm = normalize(variant.brand);
  const modelNorm = normalize(variant.model);
  const trimNorm = normalize(variant.trim || '');
  const engineNorm = normalize(variant.engineName || '');
  const engineCodeNorm = normalize(variant.engineCode || '');
  const yearStr = variant.year.toString();
  
  // Se detectou marca, DEVE ser dessa marca
  if (analysis.detectedBrand) {
    requiredMatches++;
    if (brandNorm === analysis.detectedBrand || 
        brandNorm.includes(analysis.detectedBrand) ||
        analysis.detectedBrand.includes(brandNorm)) {
      score += 500; // Alta prioridade para marca correta
      actualMatches++;
    } else {
      return 0; // Marca errada = não aparece
    }
  }
  
  // Se detectou ano, DEVE ser desse ano
  if (analysis.detectedYear) {
    requiredMatches++;
    if (variant.year === analysis.detectedYear) {
      score += 300;
      actualMatches++;
    } else {
      return 0; // Ano errado = não aparece
    }
  }
  
  // Processa tokens de modelo
  for (const token of analysis.modelTokens) {
    let tokenMatched = false;
    
    // Match exato no modelo = máxima prioridade
    if (modelNorm === token) {
      score += 1000;
      tokenMatched = true;
    } 
    // Modelo começa com o token
    else if (modelNorm.startsWith(token) && token.length >= 2) {
      score += 400;
      tokenMatched = true;
    }
    // Modelo contém o token (para casos como "R3" em "YZF-R3")
    else if (modelNorm.includes(token) && token.length >= 2) {
      score += 200;
      tokenMatched = true;
    }
    // Match no trim
    else if (trimNorm && trimNorm.includes(token) && token.length >= 2) {
      score += 100;
      tokenMatched = true;
    }
    // Match no motor
    else if (engineNorm && engineNorm.includes(token) && token.length >= 2) {
      score += 80;
      tokenMatched = true;
    }
    // Match no engineCode
    else if (engineCodeNorm && engineCodeNorm.includes(token) && token.length >= 2) {
      score += 80;
      tokenMatched = true;
    }
    // Match na marca (se não foi detectada antes)
    else if (!analysis.detectedBrand && brandNorm.includes(token) && token.length >= 2) {
      score += 150;
      tokenMatched = true;
    }
    // Match no ano (parcial)
    else if (yearStr.includes(token) && token.length >= 2) {
      score += 50;
      tokenMatched = true;
    }
    
    if (tokenMatched) actualMatches++;
  }
  
  // Se é busca exata e não encontrou todos os tokens de modelo, penaliza muito
  if (analysis.isExactSearch && analysis.modelTokens.length > 0) {
    const matchRatio = actualMatches / (requiredMatches + analysis.modelTokens.length);
    if (matchRatio < 0.5) return 0; // Menos de 50% de match = não aparece
  }
  
  // Se não teve nenhum match, não aparece
  if (score === 0) return 0;
  
  // Bonus para veículos mais recentes
  const currentYear = new Date().getFullYear();
  if (variant.year >= currentYear - 2) score += 20;
  if (variant.year === currentYear) score += 10;
  
  return score;
};

interface SearchOptions {
  limit?: number;
  vehicleTypes?: VehicleType[];
  brands?: string[];
  yearMin?: number;
  yearMax?: number;
}

/**
 * Busca veículos por query (autocomplete) - BUSCA INTELIGENTE
 * 
 * Regras:
 * 1. Se usuário digita uma MARCA (ex: "Honda"), só mostra veículos dessa marca
 * 2. Se usuário digita MARCA + MODELO (ex: "Honda Civic"), só mostra esse modelo
 * 3. Se usuário digita MARCA + MODELO + ANO (ex: "Honda Civic 2020"), só mostra esse veículo
 * 4. Se usuário digita algo incompleto, busca por aproximação
 */
export const searchVehicles = (
  query: string,
  options: SearchOptions = {}
): VehicleSuggestion[] => {
  const { limit = 30, vehicleTypes, brands, yearMin, yearMax } = options;
  
  if (!query || query.length < 2) {
    return [];
  }
  
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return [];
  }
  
  // Analisa a query para entender a intenção do usuário
  const analysis = analyzeQuery(query);
  
  console.log(`[VehicleSearch] Query: "${query}"`);
  console.log(`[VehicleSearch] Analysis:`, {
    brand: analysis.detectedBrand,
    year: analysis.detectedYear,
    modelTokens: analysis.modelTokens,
    isExact: analysis.isExactSearch
  });
  
  const startTime = performance.now();
  
  // Filtra e pontua
  const scored: Array<{ variant: VehicleVariant; score: number }> = [];
  
  for (const variant of BRAZILIAN_VEHICLES_DATABASE) {
    // Aplica filtros externos
    if (vehicleTypes?.length && !vehicleTypes.includes(variant.vehicleType)) continue;
    if (brands?.length && !brands.includes(variant.brand)) continue;
    if (yearMin && variant.year < yearMin) continue;
    if (yearMax && variant.year > yearMax) continue;
    
    const score = calculateScore(variant, analysis);
    if (score > 0) {
      scored.push({ variant, score });
    }
  }
  
  // Ordena por score e limita
  scored.sort((a, b) => b.score - a.score);
  
  // Se é busca exata e tem poucos resultados, mostra todos
  // Se é busca aproximada, limita mais
  const effectiveLimit = analysis.isExactSearch ? Math.min(limit * 2, 50) : limit;
  const topResults = scored.slice(0, effectiveLimit);
  
  // Agrupa por modelo+ano para evitar muitas variantes do mesmo carro
  const seen = new Map<string, number>();
  const dedupedResults: typeof topResults = [];
  
  for (const result of topResults) {
    const key = `${result.variant.brand}_${result.variant.model}_${result.variant.year}`;
    const count = seen.get(key) || 0;
    
    // Mostra no máximo 3 variantes do mesmo modelo/ano
    if (count < 3) {
      dedupedResults.push(result);
      seen.set(key, count + 1);
    }
  }
  
  // Converte para suggestions
  const suggestions: VehicleSuggestion[] = dedupedResults.slice(0, limit).map(({ variant, score }) => {
    const maxScore = 2000; // Score máximo teórico
    const normalizedScore = Math.min(score / maxScore, 1);
    
    // Formata texto de exibição
    const parts = [variant.brand, variant.model, variant.year.toString()];
    if (variant.trim) parts.push(variant.trim);
    if (variant.engineName) parts.push(`| ${variant.engineName}`);
    
    return {
      id: variant.id,
      variant: {
        ...variant,
        brandLogo: BRAND_LOGOS[variant.brand],
      },
      displayText: parts.join(' '),
      searchScore: normalizedScore,
      highlights: {
        brand: analysis.detectedBrand ? normalize(variant.brand).includes(analysis.detectedBrand) : false,
        model: analysis.modelTokens.some(t => normalize(variant.model).includes(t)),
        year: analysis.detectedYear === variant.year,
        engine: analysis.modelTokens.some(t => 
          normalize(variant.engineName || '').includes(t) ||
          normalize(variant.engineCode || '').includes(t)
        ),
      },
    };
  });
  
  const elapsed = performance.now() - startTime;
  console.log(`[VehicleSearch] Found ${suggestions.length} results in ${elapsed.toFixed(1)}ms`);
  
  return suggestions;
};

/**
 * Busca variante por ID
 */
export const getVehicleById = (id: string): VehicleVariant | null => {
  const variant = BRAZILIAN_VEHICLES_DATABASE.find(v => v.id === id);
  if (variant) {
    return { ...variant, brandLogo: BRAND_LOGOS[variant.brand] };
  }
  return null;
};

/**
 * Obtém outras variantes do mesmo modelo (diferentes trims/motores)
 */
export const getRelatedVariants = (variant: VehicleVariant): VehicleVariant[] => {
  return BRAZILIAN_VEHICLES_DATABASE.filter(v =>
    v.brand === variant.brand &&
    v.model === variant.model &&
    v.year === variant.year &&
    v.id !== variant.id
  ).map(v => ({ ...v, brandLogo: BRAND_LOGOS[v.brand] }));
};

/**
 * Agrupa sugestões por marca
 */
export const groupSuggestionsByBrand = (
  suggestions: VehicleSuggestion[]
): Record<string, VehicleSuggestion[]> => {
  const grouped: Record<string, VehicleSuggestion[]> = {};
  
  for (const suggestion of suggestions) {
    const brand = suggestion.variant.brand;
    if (!grouped[brand]) grouped[brand] = [];
    grouped[brand].push(suggestion);
  }
  
  return grouped;
};

/**
 * Obtém marcas disponíveis
 */
export const getAvailableBrands = (): string[] => {
  return Object.keys(VEHICLES_BY_BRAND).sort();
};

/**
 * Obtém modelos por marca
 */
export const getModelsByBrand = (brand: string): string[] => {
  const variants = VEHICLES_BY_BRAND[brand] || [];
  const models = new Set(variants.map(v => v.model));
  return Array.from(models).sort();
};

/**
 * Busca veículo por marca, modelo e ano
 */
export const findVehicle = (
  brand: string,
  model: string,
  year: number
): VehicleVariant[] => {
  return BRAZILIAN_VEHICLES_DATABASE.filter(v =>
    normalize(v.brand) === normalize(brand) &&
    normalize(v.model) === normalize(model) &&
    v.year === year
  ).map(v => ({ ...v, brandLogo: BRAND_LOGOS[v.brand] }));
};

/**
 * Estatísticas da base
 */
export const getDatabaseStats = () => ({
  totalVariants: BRAZILIAN_VEHICLES_DATABASE.length,
  totalBrands: Object.keys(VEHICLES_BY_BRAND).length,
  byType: {
    car: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.vehicleType === 'car').length,
    motorcycle: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.vehicleType === 'motorcycle').length,
    truck: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.vehicleType === 'truck').length,
    suv: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.vehicleType === 'suv').length,
    pickup: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.vehicleType === 'pickup').length,
    van: BRAZILIAN_VEHICLES_DATABASE.filter(v => v.vehicleType === 'van').length,
  },
});
