/**
 * MOTOR DE COMPATIBILIDADE DE PEÇAS V2
 * 
 * Engine avançado com:
 * - 4 camadas de matching (direto, técnico, heurístico, fuzzy)
 * - Suporte a OEM numbers
 * - Cross-reference automático
 * - Score de confiança melhorado
 * - Cache inteligente
 * 
 * @version 2.0.0
 */

import { PARTS_DATABASE_V3 } from '../config/partNumbersV3.js';
import { PARTS_CHECKLIST } from '../config/partsChecklist.js';
import { 
  ENGINE_CODE_PARTS, 
  resolveEngineCode, 
  getPartsForVehicle,
  getUniversalMappingStats 
} from '../config/universalPartsMapping.js';

// Cache para otimização
const compatibilityCache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

/**
 * Normaliza texto para comparação
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calcula similaridade entre duas strings (Levenshtein simplificado)
 */
function calculateSimilarity(str1, str2) {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0;
  
  const words1 = s1.split(' ').filter(w => w.length > 1);
  const words2 = s2.split(' ').filter(w => w.length > 1);
  
  let matches = 0;
  for (const w1 of words1) {
    for (const w2 of words2) {
      if (w1 === w2 || w1.includes(w2) || w2.includes(w1)) {
        matches++;
        break;
      }
    }
  }
  
  return matches / Math.max(words1.length, words2.length, 1);
}

/**
 * Extrai informações do veículo para busca
 */
function extractVehicleInfo(vehicle) {
  const info = {
    brand: normalizeText(vehicle.brand || vehicle.marca || ''),
    model: normalizeText(vehicle.model || vehicle.modelo || ''),
    year: parseInt(vehicle.year || vehicle.ano || 0),
    engine: normalizeText(vehicle.engine || vehicle.engineCode || vehicle.motor || ''),
    displacement: vehicle.displacement || vehicle.cilindrada || '',
    fuel: normalizeText(vehicle.fuel || vehicle.combustivel || ''),
    vehicleType: normalizeText(vehicle.vehicleType || vehicle.tipo || 'car'),
    trim: normalizeText(vehicle.trim || vehicle.versao || ''),
  };
  
  // Extrai cilindrada do nome do modelo se não fornecida
  if (!info.displacement && info.model) {
    const dispMatch = info.model.match(/(\d\.\d)/);
    if (dispMatch) info.displacement = dispMatch[1];
  }
  
  // Detecta tipo de veículo
  if (info.vehicleType.includes('moto') || info.vehicleType.includes('motorcycle')) {
    info.vehicleType = 'motorcycle';
  } else if (info.vehicleType.includes('truck') || info.vehicleType.includes('caminhao')) {
    info.vehicleType = 'truck';
  } else {
    info.vehicleType = 'car';
  }
  
  return info;
}


/**
 * Busca peças em uma categoria específica
 */
function searchInCategory(categoryData, vehicleInfo, partType) {
  const results = [];
  
  if (!categoryData) return results;
  
  for (const [partNumber, partData] of Object.entries(categoryData)) {
    const matchResult = matchPartToVehicle(partData, vehicleInfo, partNumber);
    
    if (matchResult.matched) {
      results.push({
        partNumber,
        brand: partData.brand,
        oem: partData.oem,
        specs: partData.specs,
        equivalents: partData.equivalents || [],
        matchType: matchResult.matchType,
        confidence: matchResult.confidence,
        evidence: matchResult.evidence,
        applications: partData.applications,
      });
    }
  }
  
  // Ordena por confiança
  results.sort((a, b) => b.confidence - a.confidence);
  
  return results;
}

/**
 * Verifica se uma peça é compatível com o veículo
 */
function matchPartToVehicle(partData, vehicleInfo, partNumber) {
  const applications = partData.applications || [];
  const engines = partData.engines || [];
  
  // Camada 1: Match direto por aplicação
  for (const app of applications) {
    const appNorm = normalizeText(app);
    
    // Match exato de marca + modelo
    if (appNorm.includes(vehicleInfo.brand) && appNorm.includes(vehicleInfo.model)) {
      // Verifica ano se disponível
      if (vehicleInfo.year) {
        const yearMatch = app.match(/(\d{4})/);
        if (yearMatch && Math.abs(parseInt(yearMatch[1]) - vehicleInfo.year) <= 3) {
          return {
            matched: true,
            matchType: 'direct_exact',
            confidence: 0.98,
            evidence: `Aplicação direta: ${app}`,
          };
        }
      }
      return {
        matched: true,
        matchType: 'direct',
        confidence: 0.95,
        evidence: `Aplicação: ${app}`,
      };
    }
    
    // Match parcial (só marca ou só modelo)
    if (appNorm.includes(vehicleInfo.brand) || appNorm.includes(vehicleInfo.model)) {
      const similarity = calculateSimilarity(appNorm, `${vehicleInfo.brand} ${vehicleInfo.model}`);
      if (similarity > 0.5) {
        return {
          matched: true,
          matchType: 'direct_partial',
          confidence: 0.85 * similarity,
          evidence: `Aplicação similar: ${app}`,
        };
      }
    }
  }
  
  // Camada 2: Match por motor
  if (vehicleInfo.engine) {
    for (const engine of engines) {
      const engineNorm = normalizeText(engine);
      if (engineNorm.includes(vehicleInfo.engine) || vehicleInfo.engine.includes(engineNorm)) {
        return {
          matched: true,
          matchType: 'engine',
          confidence: 0.88,
          evidence: `Motor compatível: ${engine}`,
        };
      }
    }
    
    // Verifica nas aplicações também
    for (const app of applications) {
      const appNorm = normalizeText(app);
      if (appNorm.includes(vehicleInfo.engine)) {
        return {
          matched: true,
          matchType: 'engine_in_app',
          confidence: 0.85,
          evidence: `Motor encontrado em: ${app}`,
        };
      }
    }
  }
  
  // Camada 3: Match por cilindrada
  if (vehicleInfo.displacement) {
    for (const app of applications) {
      if (app.includes(vehicleInfo.displacement) && normalizeText(app).includes(vehicleInfo.brand)) {
        return {
          matched: true,
          matchType: 'displacement',
          confidence: 0.75,
          evidence: `Cilindrada ${vehicleInfo.displacement}L em: ${app}`,
        };
      }
    }
  }
  
  // Camada 4: Match heurístico (fuzzy)
  let bestMatch = { similarity: 0, app: '' };
  for (const app of applications) {
    const similarity = calculateSimilarity(app, `${vehicleInfo.brand} ${vehicleInfo.model} ${vehicleInfo.engine}`);
    if (similarity > bestMatch.similarity) {
      bestMatch = { similarity, app };
    }
  }
  
  if (bestMatch.similarity > 0.4) {
    return {
      matched: true,
      matchType: 'heuristic',
      confidence: 0.60 + (bestMatch.similarity * 0.25),
      evidence: `Similaridade ${(bestMatch.similarity * 100).toFixed(0)}% com: ${bestMatch.app}`,
      requiresValidation: true,
    };
  }
  
  return { matched: false };
}

/**
 * Mapeia tipo de peça para categoria no banco de dados
 */
function getPartCategory(partTypeId, vehicleType) {
  const isMoto = vehicleType === 'motorcycle';
  
  const categoryMap = {
    // Filtros
    'oil_filter': isMoto ? 'oil_filters_motorcycle' : 'oil_filters',
    'air_filter': isMoto ? 'air_filters_motorcycle' : 'air_filters',
    'fuel_filter': 'fuel_filters',
    'cabin_filter': 'cabin_filters',
    
    // Freios
    'brake_pads': isMoto ? 'brake_pads_motorcycle' : 'brake_pads',
    'brake_pads_front': isMoto ? 'brake_pads_motorcycle' : 'brake_pads',
    'brake_pads_rear': isMoto ? 'brake_pads_motorcycle' : 'brake_pads',
    'brake_discs': 'brake_discs',
    'brake_discs_front': 'brake_discs',
    'brake_discs_rear': 'brake_discs',
    
    // Ignição
    'spark_plugs': isMoto ? 'spark_plugs_motorcycle' : 'spark_plugs',
    'spark_plug': isMoto ? 'spark_plugs_motorcycle' : 'spark_plugs',
    
    // Lubrificantes
    'engine_oil': 'engine_oils',
    'oil': 'engine_oils',
    
    // Distribuição
    'timing_belt': 'timing_belts',
    'timing_belt_kit': 'timing_belts',
    
    // Transmissão (motos)
    'chain_kit': 'chain_kits',
    'chain': 'chain_kits',
    'sprocket': 'chain_kits',
    
    // Suspensão
    'shock_absorber': 'shock_absorbers',
    'shock_absorber_front': 'shock_absorbers',
    'shock_absorber_rear': 'shock_absorbers',
    
    // Elétrica
    'battery': 'batteries',
  };
  
  return categoryMap[partTypeId] || null;
}


/**
 * Busca peças usando o mapeamento universal (fallback para 20.000+ veículos)
 */
function searchWithUniversalMapping(vehicle, vehicleInfo, partType) {
  const results = [];
  
  // Resolve o código do motor
  const engineCode = resolveEngineCode({
    brand: vehicle.brand || vehicle.marca,
    model: vehicle.model || vehicle.modelo,
    engineCode: vehicle.engineCode || vehicleInfo.engine,
    displacementCc: vehicle.displacementCc || parseInt(vehicleInfo.displacement?.replace('.', '') + '0') || 0,
    vehicleType: vehicleInfo.vehicleType,
  });
  
  if (!engineCode || !ENGINE_CODE_PARTS[engineCode]) {
    return results;
  }
  
  const engineParts = ENGINE_CODE_PARTS[engineCode];
  
  // Mapeia o tipo de peça para a categoria no mapeamento universal
  const categoryMap = {
    'oil_filter': 'filtro_oleo',
    'air_filter': 'filtro_ar',
    'fuel_filter': 'filtro_combustivel',
    'spark_plugs': 'vela_ignicao',
    'spark_plug': 'vela_ignicao',
    'timing_belt': 'correia_dentada',
    'timing_belt_kit': 'correia_dentada',
    'brake_pads': 'pastilha_freio',
    'brake_pads_front': 'pastilha_freio',
    'brake_pads_rear': 'pastilha_freio',
    'chain_kit': 'kit_relacao',
    'chain': 'kit_relacao',
  };
  
  const universalCategory = categoryMap[partType.id];
  if (!universalCategory || !engineParts[universalCategory]) {
    return results;
  }
  
  const partNumbers = engineParts[universalCategory];
  
  for (const pn of partNumbers) {
    results.push({
      partNumber: pn,
      brand: extractBrandFromPN(pn),
      oem: null,
      specs: null,
      equivalents: partNumbers.filter(p => p !== pn),
      matchType: 'universal_mapping',
      confidence: 0.85,
      evidence: `Mapeamento universal para motor ${engineCode}`,
      applications: [`${vehicle.brand || vehicle.marca} ${vehicle.model || vehicle.modelo}`],
    });
  }
  
  return results;
}

/**
 * Gera compatibilidade completa para um veículo
 */
export function generateCompatibility(vehicle, categoryFilter = null) {
  const vehicleInfo = extractVehicleInfo(vehicle);
  const vehicleKey = `${vehicleInfo.brand}_${vehicleInfo.model}_${vehicleInfo.year}_${vehicleInfo.engine}`;
  
  // Verifica cache
  const cached = compatibilityCache.get(vehicleKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  // Determina checklist baseado no tipo de veículo
  const checklist = PARTS_CHECKLIST[vehicleInfo.vehicleType] || PARTS_CHECKLIST.car;
  
  const result = {
    vehicleId: vehicle.id || vehicleKey,
    vehicleName: `${vehicle.brand || vehicle.marca} ${vehicle.model || vehicle.modelo} ${vehicle.year || vehicle.ano || ''}`.trim(),
    vehicleType: vehicleInfo.vehicleType,
    vehicleInfo,
    generatedAt: new Date().toISOString(),
    compatibleParts: [],
    missingParts: [],
    sharedParts: [],
    crossReferences: [],
    coverage: 0,
    confidence: 0,
    totalPartsFound: 0,
    totalEquivalents: 0,
  };
  
  // Processa cada tipo de peça do checklist
  for (const partType of checklist) {
    // Aplica filtro de categoria se especificado
    if (categoryFilter && partType.id !== categoryFilter && partType.category !== categoryFilter) {
      continue;
    }
    
    const categoryName = getPartCategory(partType.id, vehicleInfo.vehicleType);
    const categoryData = categoryName ? PARTS_DATABASE_V3[categoryName] : null;
    
    // Busca no banco de dados V3
    let matches = categoryData ? searchInCategory(categoryData, vehicleInfo, partType) : [];
    
    // Se não encontrou, usa o mapeamento universal (fallback para 20.000+ veículos)
    if (matches.length === 0) {
      matches = searchWithUniversalMapping(vehicle, vehicleInfo, partType);
    }
    
    if (matches.length === 0) {
      result.missingParts.push({
        partTypeId: partType.id,
        partTypeName: partType.name,
        category: partType.category,
        priority: partType.priority,
        reason: 'Nenhuma peça compatível encontrada',
        searchedIn: categoryName || 'universal_mapping',
      });
      continue;
    }
    
    if (matches.length > 0) {
      const bestMatch = matches[0];
      
      result.compatibleParts.push({
        partTypeId: partType.id,
        partTypeName: partType.name,
        category: partType.category,
        priority: partType.priority,
        partNumber: bestMatch.partNumber,
        brand: bestMatch.brand,
        oem: bestMatch.oem,
        specs: bestMatch.specs,
        equivalents: bestMatch.equivalents,
        matchType: bestMatch.matchType,
        confidence: bestMatch.confidence,
        evidence: bestMatch.evidence,
        requiresValidation: bestMatch.requiresValidation || false,
        alternativeMatches: matches.slice(1, 4).map(m => ({
          partNumber: m.partNumber,
          brand: m.brand,
          confidence: m.confidence,
        })),
      });
      
      result.totalPartsFound++;
      result.totalEquivalents += (bestMatch.equivalents?.length || 0);
      
      // Adiciona cross-references
      if (bestMatch.equivalents?.length > 0) {
        result.crossReferences.push({
          original: bestMatch.partNumber,
          brand: bestMatch.brand,
          equivalents: bestMatch.equivalents,
          partType: partType.name,
        });
      }
    }
  }
  
  // Calcula métricas
  result.coverage = checklist.length > 0 
    ? result.compatibleParts.length / checklist.length 
    : 0;
  
  result.confidence = result.compatibleParts.length > 0
    ? result.compatibleParts.reduce((sum, p) => sum + p.confidence, 0) / result.compatibleParts.length
    : 0;
  
  // Busca peças compartilhadas
  result.sharedParts = findSharedParts(result.compatibleParts, vehicleInfo);
  
  // Salva no cache
  compatibilityCache.set(vehicleKey, {
    timestamp: Date.now(),
    data: result,
  });
  
  return result;
}

/**
 * Busca peças que são compartilhadas com outros veículos
 */
function findSharedParts(compatibleParts, vehicleInfo) {
  const sharedParts = [];
  
  for (const part of compatibleParts) {
    if (!part.partNumber) continue;
    
    // Busca a peça no banco para ver outras aplicações
    for (const [categoryName, categoryData] of Object.entries(PARTS_DATABASE_V3)) {
      const partData = categoryData[part.partNumber];
      if (!partData) continue;
      
      const applications = partData.applications || [];
      const otherVehicles = [];
      
      for (const app of applications) {
        const appNorm = normalizeText(app);
        // Verifica se é um veículo diferente
        if (!appNorm.includes(vehicleInfo.brand) || !appNorm.includes(vehicleInfo.model)) {
          // Extrai marca e modelo da aplicação
          const parts = app.split(' ');
          if (parts.length >= 2) {
            const brand = parts[0];
            const model = parts.slice(1).join(' ');
            
            // Evita duplicatas
            if (!otherVehicles.find(v => v.brand === brand && v.model === model)) {
              otherVehicles.push({ brand, model });
            }
          }
        }
      }
      
      if (otherVehicles.length > 0) {
        sharedParts.push({
          partNumber: part.partNumber,
          partName: part.partTypeName,
          brand: part.brand,
          sharedWith: otherVehicles.slice(0, 10),
          totalShared: otherVehicles.length,
          economySuggestion: otherVehicles.length > 5 
            ? { type: 'high_volume', savings: '15-30%', description: 'Peça de alto volume - geralmente mais barata' }
            : { type: 'alternative', savings: '5-15%', description: 'Alternativas disponíveis' },
        });
      }
      
      break; // Encontrou a peça, não precisa continuar
    }
  }
  
  return sharedParts;
}

/**
 * Busca peça por part number
 */
export function findPartByNumber(partNumber) {
  const normalizedPN = partNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  for (const [categoryName, categoryData] of Object.entries(PARTS_DATABASE_V3)) {
    for (const [pn, partData] of Object.entries(categoryData)) {
      const normalizedDBPN = pn.toUpperCase().replace(/[^A-Z0-9]/g, '');
      
      // Match direto
      if (normalizedDBPN === normalizedPN) {
        return {
          found: true,
          partNumber: pn,
          category: categoryName,
          ...partData,
        };
      }
      
      // Match por OEM
      if (partData.oem) {
        const normalizedOEM = partData.oem.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (normalizedOEM === normalizedPN) {
          return {
            found: true,
            partNumber: pn,
            category: categoryName,
            matchedBy: 'oem',
            ...partData,
          };
        }
      }
      
      // Match por equivalente
      if (partData.equivalents) {
        for (const eq of partData.equivalents) {
          const normalizedEQ = eq.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (normalizedEQ === normalizedPN) {
            return {
              found: true,
              partNumber: pn,
              category: categoryName,
              matchedBy: 'equivalent',
              originalSearch: partNumber,
              ...partData,
            };
          }
        }
      }
    }
  }
  
  return { found: false, partNumber };
}

/**
 * Busca equivalentes de uma peça
 */
export function findEquivalents(partNumber) {
  const part = findPartByNumber(partNumber);
  
  if (!part.found) {
    return { found: false, partNumber };
  }
  
  const equivalents = [];
  
  // Adiciona equivalentes diretos
  if (part.equivalents) {
    for (const eq of part.equivalents) {
      const eqPart = findPartByNumber(eq);
      equivalents.push({
        partNumber: eq,
        found: eqPart.found,
        brand: eqPart.brand || extractBrandFromPN(eq),
        specs: eqPart.specs,
      });
    }
  }
  
  // Busca peças que têm este part number como equivalente
  for (const [categoryName, categoryData] of Object.entries(PARTS_DATABASE_V3)) {
    for (const [pn, partData] of Object.entries(categoryData)) {
      if (pn === part.partNumber) continue;
      
      if (partData.equivalents?.includes(partNumber) || partData.equivalents?.includes(part.partNumber)) {
        if (!equivalents.find(e => e.partNumber === pn)) {
          equivalents.push({
            partNumber: pn,
            found: true,
            brand: partData.brand,
            specs: partData.specs,
            reverseMatch: true,
          });
        }
      }
    }
  }
  
  return {
    found: true,
    original: {
      partNumber: part.partNumber,
      brand: part.brand,
      oem: part.oem,
      specs: part.specs,
    },
    equivalents,
    totalEquivalents: equivalents.length,
  };
}

/**
 * Extrai marca do part number
 */
function extractBrandFromPN(partNumber) {
  const brandPatterns = {
    'MANN': /^(W|C|H|CU|FP)/i,
    'FRAM': /^(PH|CA|CH|CF)/i,
    'BOSCH': /^(F026|0986|BP)/i,
    'NGK': /^(BKR|BPR|CR|CPR|IK|IL|LK|LM)/i,
    'DENSO': /^(K|IK|SK|IU|U)/i,
    'TECFIL': /^(PSL|PSD|ARL)/i,
    'COBREQ': /^N-/i,
    'FRAS-LE': /^PD\//i,
    'HIFLOFILTRO': /^HF/i,
    'EBC': /^FA/i,
    'MONROE': /^GP/i,
    'COFAP': /^GP/i,
    'CONTITECH': /^CT/i,
    'GATES': /^(K|KP)/i,
    'MOURA': /^MI/i,
    'YUASA': /^YT/i,
  };
  
  for (const [brand, pattern] of Object.entries(brandPatterns)) {
    if (pattern.test(partNumber)) {
      return brand;
    }
  }
  
  return 'AFTERMARKET';
}

/**
 * Busca peças por termo de pesquisa
 */
export function searchParts(query, options = {}) {
  const { category, brand, limit = 50 } = options;
  const queryNorm = normalizeText(query);
  const results = [];
  
  for (const [categoryName, categoryData] of Object.entries(PARTS_DATABASE_V3)) {
    if (category && categoryName !== category) continue;
    
    for (const [partNumber, partData] of Object.entries(categoryData)) {
      if (brand && partData.brand?.toLowerCase() !== brand.toLowerCase()) continue;
      
      // Busca no part number
      if (partNumber.toLowerCase().includes(queryNorm)) {
        results.push({ partNumber, category: categoryName, ...partData, matchedIn: 'partNumber' });
        continue;
      }
      
      // Busca no OEM
      if (partData.oem?.toLowerCase().includes(queryNorm)) {
        results.push({ partNumber, category: categoryName, ...partData, matchedIn: 'oem' });
        continue;
      }
      
      // Busca nas aplicações
      const appMatch = partData.applications?.find(app => normalizeText(app).includes(queryNorm));
      if (appMatch) {
        results.push({ partNumber, category: categoryName, ...partData, matchedIn: 'application', matchedApp: appMatch });
        continue;
      }
      
      // Busca nos equivalentes
      const eqMatch = partData.equivalents?.find(eq => eq.toLowerCase().includes(queryNorm));
      if (eqMatch) {
        results.push({ partNumber, category: categoryName, ...partData, matchedIn: 'equivalent', matchedEq: eqMatch });
      }
    }
  }
  
  return results.slice(0, limit);
}

/**
 * Estatísticas do banco de dados
 */
export function getDatabaseStats() {
  const stats = {
    totalParts: 0,
    totalEquivalents: 0,
    totalApplications: 0,
    byCategory: {},
    brands: new Set(),
    totalCategories: 0,
  };
  
  // Estatísticas do banco V3
  for (const [categoryName, categoryData] of Object.entries(PARTS_DATABASE_V3)) {
    const categoryStats = {
      parts: Object.keys(categoryData).length,
      equivalents: 0,
      applications: 0,
    };
    
    for (const partData of Object.values(categoryData)) {
      categoryStats.equivalents += partData.equivalents?.length || 0;
      categoryStats.applications += partData.applications?.length || 0;
      if (partData.brand) stats.brands.add(partData.brand);
    }
    
    stats.byCategory[categoryName] = categoryStats.parts;
    stats.totalParts += categoryStats.parts;
    stats.totalEquivalents += categoryStats.equivalents;
    stats.totalApplications += categoryStats.applications;
  }
  
  // Adiciona estatísticas do mapeamento universal
  const universalStats = getUniversalMappingStats();
  
  stats.totalBrands = stats.brands.size;
  stats.brands = Array.from(stats.brands).sort();
  stats.totalCategories = Object.keys(stats.byCategory).length;
  
  // Informações do mapeamento universal
  stats.universalMapping = {
    engineCodes: universalStats.engineCodes,
    brandsSupported: universalStats.brands,
    motoModels: universalStats.motoModels,
    totalPartNumbers: universalStats.totalParts,
    categories: universalStats.categories,
    coverage: '20.000+ veículos brasileiros',
  };
  
  return stats;
}

// Limpa cache periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of compatibilityCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      compatibilityCache.delete(key);
    }
  }
}, CACHE_TTL);

export default {
  generateCompatibility,
  findPartByNumber,
  findEquivalents,
  searchParts,
  getDatabaseStats,
};
