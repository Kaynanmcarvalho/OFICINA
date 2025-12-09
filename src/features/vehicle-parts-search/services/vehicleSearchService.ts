/**
 * Vehicle Search Service - Autocomplete rápido
 * Busca de veículos com granularidade por ano/motor/trim
 * @version 2.0.0
 */

import { BRAZILIAN_VEHICLES_DATABASE, VEHICLES_BY_BRAND, BRAND_LOGOS } from '../data/brazilianVehicles';
import type { VehicleVariant, VehicleSuggestion, VehicleType } from '../types';

// Log para verificar se a base foi carregada
console.log(`[VehicleSearchService] Database loaded: ${BRAZILIAN_VEHICLES_DATABASE?.length || 0} vehicles`);

// Normaliza texto para busca
const normalize = (text: string): string =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

// Tokeniza query em palavras
const tokenize = (query: string): string[] =>
  normalize(query).split(/\s+/).filter(t => t.length > 0);

// Calcula score de relevância - BUSCA ESTRITA
// Só retorna resultados que realmente contenham o termo buscado
const calculateScore = (variant: VehicleVariant, tokens: string[]): number => {
  let score = 0;
  let hasAnyMatch = false;
  
  const brandNorm = normalize(variant.brand);
  const modelNorm = normalize(variant.model);
  const trimNorm = normalize(variant.trim || '');
  const engineNorm = normalize(variant.engineName || '');
  const engineCodeNorm = normalize(variant.engineCode || '');
  const yearStr = variant.year.toString();
  
  for (const token of tokens) {
    let tokenMatched = false;
    
    // Match na marca
    if (brandNorm === token) {
      score += 100;
      tokenMatched = true;
    } else if (brandNorm.startsWith(token) && token.length >= 2) {
      score += 60;
      tokenMatched = true;
    } else if (brandNorm.includes(token) && token.length >= 3) {
      score += 30;
      tokenMatched = true;
    }
    
    // Match no modelo - PRIORIDADE MÁXIMA
    if (modelNorm === token) {
      score += 200;
      tokenMatched = true;
    } else if (modelNorm.startsWith(token) && token.length >= 2) {
      score += 120;
      tokenMatched = true;
    } else if (modelNorm.includes(token) && token.length >= 3) {
      score += 60;
      tokenMatched = true;
    }

    // Match no ano - só se for número completo ou parcial válido
    if (yearStr === token) {
      score += 100;
      tokenMatched = true;
    } else if (token.length === 4 && yearStr.startsWith(token)) {
      score += 80;
      tokenMatched = true;
    } else if (token.length >= 2 && yearStr.includes(token)) {
      score += 40;
      tokenMatched = true;
    }
    
    // Match no trim
    if (trimNorm && trimNorm.includes(token) && token.length >= 2) {
      score += 35;
      tokenMatched = true;
    }
    
    // Match no motor
    if (engineNorm && engineNorm.includes(token) && token.length >= 2) {
      score += 45;
      tokenMatched = true;
    }
    
    // Match no engineCode
    if (engineCodeNorm && engineCodeNorm.includes(token) && token.length >= 2) {
      score += 60;
      tokenMatched = true;
    }
    
    if (tokenMatched) hasAnyMatch = true;
  }
  
  // Se nenhum token deu match, retorna 0 (não aparece nos resultados)
  if (!hasAnyMatch) return 0;
  
  // Bonus para veículos mais recentes
  const currentYear = new Date().getFullYear();
  if (variant.year >= currentYear - 2) score += 10;
  
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
 * Busca veículos por query (autocomplete)
 * Retorna variantes individuais (não ranges)
 */
export const searchVehicles = (
  query: string,
  options: SearchOptions = {}
): VehicleSuggestion[] => {
  const { limit = 20, vehicleTypes, brands, yearMin, yearMax } = options;
  
  console.log(`[VehicleSearch] searchVehicles called with query: "${query}"`);
  console.log(`[VehicleSearch] Database has ${BRAZILIAN_VEHICLES_DATABASE?.length || 0} vehicles`);
  
  if (!query || query.length < 2) {
    console.log('[VehicleSearch] Query too short, returning empty');
    return [];
  }
  
  const tokens = tokenize(query);
  console.log('[VehicleSearch] Tokens:', tokens);
  
  if (tokens.length === 0) {
    console.log('[VehicleSearch] No tokens, returning empty');
    return [];
  }
  
  const startTime = performance.now();
  
  // Filtra e pontua
  const scored: Array<{ variant: VehicleVariant; score: number }> = [];
  
  for (const variant of BRAZILIAN_VEHICLES_DATABASE) {
    // Aplica filtros
    if (vehicleTypes?.length && !vehicleTypes.includes(variant.vehicleType)) continue;
    if (brands?.length && !brands.includes(variant.brand)) continue;
    if (yearMin && variant.year < yearMin) continue;
    if (yearMax && variant.year > yearMax) continue;
    
    const score = calculateScore(variant, tokens);
    if (score > 0) {
      scored.push({ variant, score });
    }
  }
  
  // Ordena por score e limita
  scored.sort((a, b) => b.score - a.score);
  const topResults = scored.slice(0, limit);
  
  // Converte para suggestions
  const suggestions: VehicleSuggestion[] = topResults.map(({ variant, score }) => {
    const maxScore = tokens.length * 200; // Score máximo teórico
    const normalizedScore = Math.min(score / maxScore, 1);
    
    // Formata texto de exibição
    const parts = [variant.brand, variant.model, variant.year.toString()];
    if (variant.trim) parts.push(variant.trim);
    if (variant.engineName) parts.push(`| ${variant.engineName}`);
    if (variant.engineCode) parts.push(`(${variant.engineCode})`);
    
    return {
      id: variant.id,
      variant: {
        ...variant,
        brandLogo: BRAND_LOGOS[variant.brand],
      },
      displayText: parts.join(' '),
      searchScore: normalizedScore,
      highlights: {
        brand: tokens.some(t => normalize(variant.brand).includes(t)),
        model: tokens.some(t => normalize(variant.model).includes(t)),
        year: tokens.some(t => variant.year.toString().includes(t)),
        engine: tokens.some(t => 
          normalize(variant.engineName || '').includes(t) ||
          normalize(variant.engineCode || '').includes(t)
        ),
      },
    };
  });
  
  const elapsed = performance.now() - startTime;
  console.log(`[VehicleSearch] Found ${suggestions.length} results for "${query}" in ${elapsed.toFixed(1)}ms`);
  
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
