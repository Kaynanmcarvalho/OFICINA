/**
 * MOTOR DE COMPATIBILIDADE DE PEÇAS
 * 
 * Três camadas de matching:
 * 1. Matching direto (fitment tables)
 * 2. Matching técnico por atributos
 * 3. Matching heurístico para peças compartilhadas
 * 
 * @version 2.0.0
 */

import { PARTS_CHECKLIST } from '../config/partsChecklist.js';
import { PART_NUMBERS_DATABASE } from '../config/partNumbers.js';
import { EXTENDED_PARTS_DATABASE } from '../config/partNumbersExtended.js';

// Merge das bases de dados
const MERGED_DATABASE = {
  ...PART_NUMBERS_DATABASE,
  ...EXTENDED_PARTS_DATABASE,
};

/**
 * Gera compatibilidade de peças para um veículo
 */
export function generateCompatibility(vehicle) {
  const vehicleType = normalizeVehicleType(vehicle.vehicleType);
  const checklist = PARTS_CHECKLIST[vehicleType] || PARTS_CHECKLIST.car;
  
  const result = {
    vehicleId: vehicle.id,
    vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    vehicleType,
    generatedAt: new Date().toISOString(),
    compatibleParts: [],
    missingParts: [],
    sharedParts: [],
    coverage: 0,
    confidence: 0,
  };
  
  // Processa cada peça do checklist
  for (const partType of checklist) {
    const compatibility = findCompatiblePart(vehicle, partType);
    
    if (compatibility.found) {
      result.compatibleParts.push({
        ...compatibility,
        partTypeId: partType.id,
        partTypeName: partType.name,
        category: partType.category,
        priority: partType.priority,
      });
    } else {
      result.missingParts.push({
        partTypeId: partType.id,
        partTypeName: partType.name,
        category: partType.category,
        priority: partType.priority,
        reason: compatibility.reason,
        searchedSources: compatibility.searchedSources || [],
      });
    }
  }
  
  // Calcula métricas
  result.coverage = checklist.length > 0 ? result.compatibleParts.length / checklist.length : 0;
  result.confidence = calculateOverallConfidence(result.compatibleParts);

  
  // Busca peças compartilhadas
  result.sharedParts = findSharedParts(vehicle, result.compatibleParts);
  
  return result;
}

/**
 * Encontra peça compatível usando as 3 camadas de matching
 */
function findCompatiblePart(vehicle, partType) {
  // Camada 1: Matching direto
  const directMatch = findDirectMatch(vehicle, partType);
  if (directMatch.found) {
    return { ...directMatch, matchType: 'direct', confidence: 0.95 };
  }
  
  // Camada 2: Matching técnico
  const technicalMatch = findTechnicalMatch(vehicle, partType);
  if (technicalMatch.found) {
    return { ...technicalMatch, matchType: 'technical', confidence: 0.85 };
  }
  
  // Camada 3: Matching heurístico
  const heuristicMatch = findHeuristicMatch(vehicle, partType);
  if (heuristicMatch.found) {
    return { ...heuristicMatch, matchType: 'heuristic', confidence: 0.70 };
  }
  
  return {
    found: false,
    reason: 'Nenhuma peça compatível encontrada nas fontes disponíveis',
    searchedSources: ['direct_fitment', 'technical_specs', 'heuristic_analysis'],
  };
}

/**
 * Camada 1: Matching direto por fitment tables
 */
function findDirectMatch(vehicle, partType) {
  const database = getPartDatabase(partType.id);
  if (!database) return { found: false };
  
  const vehicleKey = normalizeVehicleKey(vehicle);
  const vehicleTerms = getVehicleSearchTerms(vehicle);
  
  for (const [partNumber, partData] of Object.entries(database)) {
    const applications = partData.applications || [];
    
    for (const app of applications) {
      if (matchesApplication(vehicleTerms, app)) {
        return {
          found: true,
          partNumber,
          brand: partData.brand,
          specs: partData.specs,
          equivalents: partData.equivalents || [],
          evidence: [{
            type: 'direct_fitment',
            source: 'manufacturer_catalog',
            description: `Aplicação direta: ${app}`,
            confidence: 0.95,
          }],
        };
      }
    }
  }
  
  return { found: false };
}

/**
 * Camada 2: Matching técnico por especificações
 */
function findTechnicalMatch(vehicle, partType) {
  const database = getPartDatabase(partType.id);
  if (!database) return { found: false };
  
  // Busca por motor/motorização
  const engineCode = vehicle.engineCode || extractEngineCode(vehicle);
  
  for (const [partNumber, partData] of Object.entries(database)) {
    const applications = partData.applications || [];
    
    for (const app of applications) {
      // Match por código do motor
      if (engineCode && app.toLowerCase().includes(engineCode.toLowerCase())) {
        return {
          found: true,
          partNumber,
          brand: partData.brand,
          specs: partData.specs,
          equivalents: partData.equivalents || [],
          evidence: [{
            type: 'technical_match',
            source: 'engine_code_match',
            description: `Motor compatível: ${engineCode}`,
            confidence: 0.85,
          }],
        };
      }
      
      // Match por cilindrada
      if (vehicle.displacementCc) {
        const displacementStr = (vehicle.displacementCc / 1000).toFixed(1);
        if (app.includes(displacementStr) && app.toLowerCase().includes(vehicle.brand.toLowerCase())) {
          return {
            found: true,
            partNumber,
            brand: partData.brand,
            specs: partData.specs,
            equivalents: partData.equivalents || [],
            evidence: [{
              type: 'technical_match',
              source: 'displacement_match',
              description: `Cilindrada compatível: ${displacementStr}L`,
              confidence: 0.80,
            }],
          };
        }
      }
    }
  }
  
  return { found: false };
}

/**
 * Camada 3: Matching heurístico
 */
function findHeuristicMatch(vehicle, partType) {
  const database = getPartDatabase(partType.id);
  if (!database) return { found: false };
  
  // Busca por marca + modelo similar
  const brandMatches = [];
  
  for (const [partNumber, partData] of Object.entries(database)) {
    const applications = partData.applications || [];
    
    for (const app of applications) {
      const appLower = app.toLowerCase();
      const brandLower = vehicle.brand.toLowerCase();
      const modelLower = vehicle.model.toLowerCase();
      
      // Verifica se a marca está na aplicação
      if (appLower.includes(brandLower)) {
        const score = calculateSimilarityScore(vehicle, app);
        brandMatches.push({
          partNumber,
          partData,
          app,
          score,
        });
      }
      
      // Verifica se o modelo está na aplicação (e não foi adicionado pela marca)
      if (appLower.includes(modelLower)) {
        const existingMatch = brandMatches.find(m => m.partNumber === partNumber && m.app === app);
        if (!existingMatch) {
          const modelScore = calculateSimilarityScore(vehicle, app);
          brandMatches.push({
            partNumber,
            partData,
            app,
            score: modelScore,
          });
        }
      }
    }
  }
  
  // Ordena por score e retorna o melhor
  brandMatches.sort((a, b) => b.score - a.score);
  
  if (brandMatches.length > 0 && brandMatches[0].score > 0.4) {
    const best = brandMatches[0];
    return {
      found: true,
      partNumber: best.partNumber,
      brand: best.partData.brand,
      specs: best.partData.specs,
      equivalents: best.partData.equivalents || [],
      evidence: [{
        type: 'heuristic_match',
        source: 'similarity_analysis',
        description: `Similaridade com: ${best.app} (score: ${best.score.toFixed(2)})`,
        confidence: Math.min(0.70, 0.50 + best.score * 0.30),
        requiresValidation: true,
      }],
    };
  }
  
  return { found: false };
}


/**
 * Busca peças compartilhadas entre veículos diferentes
 * Ex: Filtro CB300 compatível com BMW GS
 */
function findSharedParts(vehicle, compatibleParts) {
  const sharedParts = [];
  
  for (const part of compatibleParts) {
    if (!part.partNumber) continue;
    
    // Busca outros veículos que usam a mesma peça ou equivalentes
    const otherVehicles = findVehiclesWithSamePart(part.partNumber, vehicle);
    
    if (otherVehicles.length > 0) {
      // Filtra veículos de outras marcas (mais interessante para economia)
      const crossBrandVehicles = otherVehicles.filter(v => 
        v.brand.toLowerCase() !== vehicle.brand.toLowerCase()
      );
      
      if (crossBrandVehicles.length > 0) {
        sharedParts.push({
          partNumber: part.partNumber,
          partName: part.partTypeName,
          sharedWith: crossBrandVehicles.slice(0, 5).map(v => ({
            brand: v.brand,
            model: v.model,
          })),
          economySuggestion: calculateEconomySuggestion(crossBrandVehicles),
        });
      }
    }
  }
  
  return sharedParts;
}

/**
 * Encontra veículos que usam a mesma peça
 */
function findVehiclesWithSamePart(partNumber, excludeVehicle) {
  const vehicles = [];
  const seen = new Set();
  
  // Busca em todas as databases de peças
  for (const database of Object.values(PART_NUMBERS_DATABASE)) {
    for (const [pn, partData] of Object.entries(database)) {
      // Verifica se é o mesmo part number ou equivalente
      const isMatch = pn === partNumber || 
        (partData.equivalents && partData.equivalents.includes(partNumber));
      
      if (isMatch) {
        for (const app of partData.applications || []) {
          const parsed = parseApplication(app);
          if (parsed) {
            const key = `${parsed.brand}_${parsed.model}`.toLowerCase();
            if (!seen.has(key) && parsed.brand.toLowerCase() !== excludeVehicle.brand.toLowerCase()) {
              seen.add(key);
              vehicles.push(parsed);
            }
          }
        }
      }
    }
  }
  
  return vehicles;
}

/**
 * Calcula sugestão de economia
 */
function calculateEconomySuggestion(otherVehicles) {
  // Veículos populares geralmente têm peças mais baratas
  const popularBrands = ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Volkswagen', 'Fiat', 'Chevrolet', 'Ford', 'Toyota', 'Hyundai', 'Renault'];
  
  const hasPopularVehicle = otherVehicles.some(v => 
    popularBrands.some(brand => v.brand.toLowerCase().includes(brand.toLowerCase()))
  );
  
  if (hasPopularVehicle) {
    return {
      type: 'cross_brand_savings',
      description: 'Peça compartilhada com veículos populares - possível economia',
      estimatedSavings: '15-30%',
    };
  }
  
  return {
    type: 'alternative_available',
    description: 'Peça compatível com outros veículos',
    estimatedSavings: '5-15%',
  };
}

/**
 * Helpers
 */
function normalizeVehicleType(type) {
  const typeMap = {
    'car': 'car',
    'motorcycle': 'motorcycle',
    'moto': 'motorcycle',
    'truck': 'truck',
    'caminhao': 'truck',
    'bus': 'bus',
    'onibus': 'bus',
    'van': 'van',
    'suv': 'suv',
    'pickup': 'pickup',
  };
  return typeMap[type?.toLowerCase()] || 'car';
}

function normalizeVehicleKey(vehicle) {
  return `${vehicle.brand} ${vehicle.model}`.toLowerCase();
}

function getVehicleSearchTerms(vehicle) {
  const terms = [];
  
  // Marca
  terms.push(vehicle.brand.toLowerCase());
  
  // Modelo
  terms.push(vehicle.model.toLowerCase());
  
  // Variações do modelo
  const modelParts = vehicle.model.split(/[\s-]+/);
  terms.push(...modelParts.map(p => p.toLowerCase()));
  
  // Trim
  if (vehicle.trim) {
    terms.push(vehicle.trim.toLowerCase());
  }
  
  // Engine code
  if (vehicle.engineCode) {
    terms.push(vehicle.engineCode.toLowerCase());
  }
  
  return [...new Set(terms)];
}

function matchesApplication(vehicleTerms, application) {
  const appLower = application.toLowerCase();
  
  // Verifica se pelo menos marca e modelo estão na aplicação
  const brandMatch = vehicleTerms.some(term => appLower.includes(term));
  
  if (!brandMatch) return false;
  
  // Conta quantos termos matcham
  const matchCount = vehicleTerms.filter(term => appLower.includes(term)).length;
  
  // Precisa de pelo menos 2 matches (marca + algo mais)
  return matchCount >= 2;
}

function extractEngineCode(vehicle) {
  // Tenta extrair código do motor do trim ou engineName
  if (vehicle.engineCode) return vehicle.engineCode;
  
  if (vehicle.engineName) {
    // Padrões comuns de código de motor
    const patterns = [
      /([A-Z]{2,}\d{2,})/i,           // EA211, VHCE, etc
      /(\d\.\d)\s*(TSI|TDI|TFSI)/i,   // 1.4 TSI
      /([A-Z]\d{2,}[A-Z]?)/i,         // K4M, 2ZR, etc
    ];
    
    for (const pattern of patterns) {
      const match = vehicle.engineName.match(pattern);
      if (match) return match[1];
    }
  }
  
  return null;
}

function calculateSimilarityScore(vehicle, application) {
  const vehicleTerms = getVehicleSearchTerms(vehicle);
  const appTerms = application.toLowerCase().split(/[\s,]+/);
  
  let matches = 0;
  let totalWeight = 0;
  
  // Peso maior para marca e modelo
  const weights = {
    brand: 3,
    model: 3,
    trim: 2,
    engine: 2,
    other: 1,
  };
  
  for (const term of vehicleTerms) {
    if (term.length < 2) continue;
    
    const found = appTerms.some(at => at.includes(term) || term.includes(at));
    
    if (found) {
      // Determina o peso do termo
      let weight = weights.other;
      if (term === vehicle.brand.toLowerCase()) weight = weights.brand;
      else if (term === vehicle.model.toLowerCase()) weight = weights.model;
      else if (vehicle.trim && term === vehicle.trim.toLowerCase()) weight = weights.trim;
      else if (vehicle.engineCode && term === vehicle.engineCode.toLowerCase()) weight = weights.engine;
      
      matches += weight;
    }
    totalWeight += weights.other;
  }
  
  return totalWeight > 0 ? matches / (totalWeight * 2) : 0;
}

function calculateOverallConfidence(compatibleParts) {
  if (compatibleParts.length === 0) return 0;
  
  const totalConfidence = compatibleParts.reduce((sum, part) => sum + (part.confidence || 0), 0);
  return totalConfidence / compatibleParts.length;
}

function getPartDatabase(partTypeId) {
  const dbMap = {
    // Base original
    'oil_filter': PART_NUMBERS_DATABASE.oil_filters,
    'air_filter': PART_NUMBERS_DATABASE.air_filters,
    'fuel_filter': PART_NUMBERS_DATABASE.fuel_filters,
    'cabin_filter': PART_NUMBERS_DATABASE.cabin_filters,
    'brake_pads_front': PART_NUMBERS_DATABASE.brake_pads,
    'brake_pads_rear': PART_NUMBERS_DATABASE.brake_pads,
    'brake_pads': PART_NUMBERS_DATABASE.brake_pads,
    'brake_discs_front': PART_NUMBERS_DATABASE.brake_discs,
    'brake_discs_rear': PART_NUMBERS_DATABASE.brake_discs,
    'brake_discs': PART_NUMBERS_DATABASE.brake_discs,
    'spark_plugs': PART_NUMBERS_DATABASE.spark_plugs,
    'spark_plugs_iridium': PART_NUMBERS_DATABASE.spark_plugs,
    'spark_plug': PART_NUMBERS_DATABASE.spark_plugs,
    'engine_oil': PART_NUMBERS_DATABASE.engine_oils,
    'chain_kit': PART_NUMBERS_DATABASE.chain_kits,
    'timing_belt_kit': PART_NUMBERS_DATABASE.timing_belts,
    'serpentine_belt': PART_NUMBERS_DATABASE.timing_belts,
    'shock_absorber_front': PART_NUMBERS_DATABASE.shock_absorbers,
    'shock_absorber_rear': PART_NUMBERS_DATABASE.shock_absorbers,
    'shock_absorber': PART_NUMBERS_DATABASE.shock_absorbers,
    'battery': PART_NUMBERS_DATABASE.batteries,
    'brake_disc_front': PART_NUMBERS_DATABASE.brake_discs,
    'brake_disc_rear': PART_NUMBERS_DATABASE.brake_discs,
    
    // Base estendida - Componentes de Motor
    'water_pump': EXTENDED_PARTS_DATABASE.water_pumps,
    'thermostat': EXTENDED_PARTS_DATABASE.thermostats,
    'alternator': EXTENDED_PARTS_DATABASE.alternators,
    'starter_motor': EXTENDED_PARTS_DATABASE.starter_motors,
    'engine_mount': EXTENDED_PARTS_DATABASE.engine_mounts,
    
    // Base estendida - Suspensão e Direção
    'control_arm_bushings': EXTENDED_PARTS_DATABASE.suspension_bushings,
    'suspension_bushings': EXTENDED_PARTS_DATABASE.suspension_bushings,
    'ball_joint': EXTENDED_PARTS_DATABASE.ball_joints,
    'ball_joints': EXTENDED_PARTS_DATABASE.ball_joints,
    'tie_rod_end': EXTENDED_PARTS_DATABASE.tie_rod_ends,
    'tie_rod_ends': EXTENDED_PARTS_DATABASE.tie_rod_ends,
    
    // Base estendida - Fluidos
    'brake_fluid': EXTENDED_PARTS_DATABASE.fluids,
    'power_steering_fluid': EXTENDED_PARTS_DATABASE.fluids,
    'coolant': EXTENDED_PARTS_DATABASE.fluids,
    'transmission_oil': EXTENDED_PARTS_DATABASE.fluids,
    
    // Base estendida - Transmissão
    'clutch_kit': EXTENDED_PARTS_DATABASE.clutch_kits,
    'clutch': EXTENDED_PARTS_DATABASE.clutch_kits,
    
    // Base estendida - Rolamentos e Juntas
    'wheel_bearing': EXTENDED_PARTS_DATABASE.wheel_bearings,
    'wheel_bearings': EXTENDED_PARTS_DATABASE.wheel_bearings,
    'cv_joint': EXTENDED_PARTS_DATABASE.cv_joints,
    'cv_joints': EXTENDED_PARTS_DATABASE.cv_joints,
    
    // Base estendida - Motos
    'sprocket': EXTENDED_PARTS_DATABASE.motorcycle_parts,
    'pinion': EXTENDED_PARTS_DATABASE.motorcycle_parts,
    'voltage_regulator': EXTENDED_PARTS_DATABASE.motorcycle_parts,
    'clutch_lever': EXTENDED_PARTS_DATABASE.motorcycle_parts,
    'brake_lever': EXTENDED_PARTS_DATABASE.motorcycle_parts,
    'gasket_set': EXTENDED_PARTS_DATABASE.motorcycle_parts,
    'tire_front': EXTENDED_PARTS_DATABASE.motorcycle_parts,
    'tire_rear': EXTENDED_PARTS_DATABASE.motorcycle_parts,
    
    // Base estendida - Caminhões
    'brake_drums': EXTENDED_PARTS_DATABASE.truck_parts,
    'air_dryer': EXTENDED_PARTS_DATABASE.truck_parts,
    'leaf_spring': EXTENDED_PARTS_DATABASE.truck_parts,
    'fuel_water_separator': EXTENDED_PARTS_DATABASE.truck_parts,
  };
  return dbMap[partTypeId] || null;
}

function parseApplication(application) {
  // Parse de aplicação para extrair marca e modelo
  const parts = application.split(/[\s,]+/).filter(p => p.length > 1);
  
  if (parts.length >= 2) {
    return {
      brand: parts[0],
      model: parts.slice(1).join(' '),
    };
  }
  
  if (parts.length === 1) {
    return {
      brand: parts[0],
      model: '',
    };
  }
  
  return null;
}

export default {
  generateCompatibility,
  findCompatiblePart,
  findSharedParts,
};
