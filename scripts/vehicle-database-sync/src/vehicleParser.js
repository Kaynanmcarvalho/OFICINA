/**
 * Parser de Veículos
 * Extrai informações detalhadas do nome do modelo (motor, versão, etc.)
 */

import { BODY_TYPE_KEYWORDS } from './config.js';

/**
 * Extrai informações do motor do nome do modelo
 * Ex: "Civic 2.0 16V EXL CVT" -> { displacement: 2.0, valves: 16, engineCode: null }
 */
export function parseEngine(modelName) {
  const result = {
    displacement: null,
    displacementCc: null,
    valves: null,
    turbo: false,
    engineCode: null,
    engineName: null,
  };
  
  // Extrai cilindrada (1.0, 1.4, 1.6, 1.8, 2.0, etc.)
  const displacementMatch = modelName.match(/(\d+)[.,](\d+)/);
  if (displacementMatch) {
    result.displacement = parseFloat(`${displacementMatch[1]}.${displacementMatch[2]}`);
    result.displacementCc = Math.round(result.displacement * 1000);
  }
  
  // Para motos, extrai cilindrada em cc (125, 150, 250, 300, 600, etc.)
  const ccMatch = modelName.match(/\b(\d{2,4})\s*(cc|CC)?\b/);
  if (ccMatch && !result.displacementCc) {
    const cc = parseInt(ccMatch[1]);
    if (cc >= 50 && cc <= 2500) {
      result.displacementCc = cc;
      result.displacement = cc / 1000;
    }
  }
  
  // Extrai número de válvulas (8V, 16V, 24V)
  const valvesMatch = modelName.match(/(\d+)\s*V\b/i);
  if (valvesMatch) {
    result.valves = parseInt(valvesMatch[1]);
  }
  
  // Detecta turbo
  result.turbo = /turbo|tsi|tfsi|t-jet|ecoboost|tdi|hdi|dci|cdti|jtd|multijet/i.test(modelName);
  
  // Extrai código do motor conhecido
  const engineCodes = [
    // VW
    'EA111', 'EA211', 'EA888', 'TSI', 'TFSI', 'TDI',
    // GM
    'Ecotec', 'VHCE', 'SPE/4',
    // Fiat
    'Fire', 'E.torQ', 'Firefly', 'T-Jet', 'MultiJet', 'T200', 'T270',
    // Ford
    'Duratec', 'EcoBoost', 'Sigma', 'Zetec', 'Dragon', 'Duratorq',
    // Honda
    'i-VTEC', 'VTEC',
    // Toyota
    'VVT-i', 'Dual VVT-i',
    // Hyundai/Kia
    'Kappa', 'Gamma', 'Nu', 'Theta',
    // Renault
    'SCe', 'TCe', 'dCi',
    // Peugeot/Citroën
    'THP', 'PureTech', 'BlueHDi',
  ];
  
  for (const code of engineCodes) {
    if (modelName.toUpperCase().includes(code.toUpperCase())) {
      result.engineCode = code;
      break;
    }
  }
  
  // Monta nome do motor
  if (result.displacement) {
    let name = `${result.displacement}`;
    if (result.valves) name += ` ${result.valves}V`;
    if (result.turbo) name += ' Turbo';
    result.engineName = name;
  }
  
  return result;
}

/**
 * Extrai versão/trim do nome do modelo
 * Ex: "Civic 2.0 16V EXL CVT" -> "EXL"
 */
export function parseTrim(modelName) {
  // Versões comuns
  const trims = [
    // Genéricos
    'LX', 'LXS', 'LXL', 'EX', 'EXL', 'EXR', 'EXS', 'DX', 'GL', 'GLS', 'GLX',
    'S', 'SE', 'SEL', 'SL', 'SR', 'ST', 'GT', 'GTI', 'GTS', 'RS', 'R',
    'Sport', 'Comfort', 'Comfortline', 'Highline', 'Trendline', 'Sportline',
    'Limited', 'Platinum', 'Titanium', 'Premier', 'Elite', 'Touring',
    'Adventure', 'Cross', 'Trail', 'Active', 'Style', 'Sense', 'Intense',
    'Longitude', 'Limited', 'Trailhawk', 'Overland', 'Rubicon',
    'Activ', 'Premier', 'Midnight', 'LTZ', 'LT', 'LS', 'Joy',
    'Attractive', 'Drive', 'Endurance', 'Freedom', 'Ranch', 'Volcano',
    'Urban', 'Life', 'Zen', 'Intense', 'Iconic', 'Bose',
    'Prestige', 'Performance', 'Ambition', 'Attraction', 'Launch Edition',
    'Black', 'Dark', 'Night', 'Edition', 'Pack', 'Plus',
    // Motos
    'ABS', 'CBS', 'DLX', 'STD', 'ES', 'KS', 'ESD', 'Repsol', 'Racing',
    'Special', 'Anniversary', 'R', 'S', 'RR', 'SP',
  ];
  
  for (const trim of trims) {
    const regex = new RegExp(`\\b${trim}\\b`, 'i');
    if (regex.test(modelName)) {
      return trim;
    }
  }
  
  return null;
}

/**
 * Extrai tipo de transmissão
 */
export function parseTransmission(modelName) {
  if (/\bCVT\b/i.test(modelName)) return 'cvt';
  if (/\bDCT\b|\bDSG\b|\bS-?Tronic\b|\bPDK\b/i.test(modelName)) return 'dct';
  if (/\bAT\b|\bAuto(mático|matic)?\b|\bTiptronic\b|\bSteptronic\b/i.test(modelName)) return 'automatic';
  if (/\bMT\b|\bManual\b/i.test(modelName)) return 'manual';
  if (/\bAMT\b|\bI-?Motion\b|\bEasytronic\b|\bDualogic\b/i.test(modelName)) return 'automated';
  
  return null; // Não identificado
}

/**
 * Detecta tipo de carroceria baseado no nome do modelo
 */
export function parseBodyType(modelName, vehicleType) {
  const nameLower = modelName.toLowerCase();
  
  // Para cada tipo de carroceria, verifica se alguma keyword está presente
  for (const [bodyType, keywords] of Object.entries(BODY_TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword.toLowerCase())) {
        return bodyType;
      }
    }
  }
  
  // Fallback baseado no tipo de veículo
  switch (vehicleType) {
    case 'CARS': return 'hatch';
    case 'MOTOS': return 'street';
    case 'TRUCKS': return 'truck';
    default: return 'hatch';
  }
}

/**
 * Extrai potência do nome (se disponível)
 */
export function parsePower(modelName) {
  // Padrão: 150cv, 150 cv, 150hp, 150 hp
  const match = modelName.match(/(\d+)\s*(cv|hp|bhp|ps)/i);
  if (match) {
    return `${match[1]}cv`;
  }
  return null;
}

/**
 * Limpa e normaliza nome do modelo
 */
export function cleanModelName(modelName) {
  // Remove informações redundantes
  let clean = modelName
    .replace(/\s+/g, ' ')
    .replace(/\(.*?\)/g, '') // Remove parênteses
    .replace(/\d{4}\/\d{4}/g, '') // Remove anos
    .replace(/\bFlex\b|\bGasolina\b|\bDiesel\b|\bÁlcool\b/gi, '')
    .trim();
  
  return clean;
}

/**
 * Extrai nome base do modelo (sem versão, motor, etc.)
 */
export function extractBaseModel(modelName) {
  // Lista de modelos conhecidos para match exato
  const knownModels = [
    // VW
    'Gol', 'Voyage', 'Saveiro', 'Fox', 'CrossFox', 'SpaceFox', 'Golf', 'Polo', 'Virtus',
    'Jetta', 'Passat', 'T-Cross', 'Nivus', 'Taos', 'Tiguan', 'Touareg', 'Amarok', 'Up!',
    'Fusca', 'Kombi', 'Santana', 'Parati', 'Brasília',
    // Chevrolet
    'Onix', 'Prisma', 'Cruze', 'Cobalt', 'Spin', 'Tracker', 'Equinox', 'Trailblazer',
    'S10', 'Montana', 'Celta', 'Corsa', 'Classic', 'Astra', 'Vectra', 'Omega', 'Camaro',
    'Captiva', 'Blazer', 'Opala', 'Chevette', 'Monza', 'Kadett',
    // Fiat
    'Uno', 'Palio', 'Siena', 'Punto', 'Linea', 'Bravo', 'Argo', 'Cronos', 'Mobi',
    'Pulse', 'Fastback', 'Strada', 'Toro', 'Fiorino', 'Doblò', 'Ducato', 'Idea',
    '500', 'Tempra', 'Tipo', '147', 'Elba', 'Prêmio', 'Freemont', 'Grand Siena',
    // Ford
    'Ka', 'Fiesta', 'Focus', 'Fusion', 'EcoSport', 'Territory', 'Edge', 'Ranger',
    'Maverick', 'Transit', 'Bronco Sport', 'Mustang', 'Escort', 'Verona', 'Del Rey',
    'Corcel', 'Belina', 'Pampa', 'F-250', 'F-1000', 'Courier', 'Cargo',
    // Toyota
    'Corolla', 'Corolla Cross', 'Etios', 'Yaris', 'Camry', 'Prius', 'RAV4', 'SW4',
    'Land Cruiser Prado', 'Hilux', 'Bandeirante',
    // Honda
    'Civic', 'City', 'Fit', 'HR-V', 'CR-V', 'WR-V', 'Accord', 'ZR-V',
    // Hyundai
    'HB20', 'HB20S', 'HB20X', 'Creta', 'Tucson', 'Santa Fe', 'i30', 'Elantra', 'Azera', 'ix35',
    // Kia
    'Picanto', 'Rio', 'Cerato', 'Sportage', 'Sorento', 'Carnival', 'Stinger', 'Soul', 'Seltos',
    // Renault
    'Kwid', 'Sandero', 'Logan', 'Duster', 'Captur', 'Oroch', 'Master', 'Kangoo',
    'Clio', 'Mégane', 'Fluence', 'Symbol',
    // Nissan
    'March', 'Versa', 'Sentra', 'Kicks', 'Frontier', 'Leaf', 'Tiida', 'Livina',
    // Jeep
    'Renegade', 'Compass', 'Commander', 'Wrangler', 'Grand Cherokee', 'Cherokee',
    // Peugeot
    '208', '2008', '308', '3008', '408', '5008', '508', 'Partner', 'Expert', 'Boxer',
    '206', '207', '307', '407',
    // Citroën
    'C3', 'C3 Aircross', 'C4 Cactus', 'C4 Lounge', 'C5 Aircross', 'Jumpy', 'Jumper',
    'Xsara', 'Picasso', 'Berlingo',
    // Mitsubishi
    'Lancer', 'ASX', 'Outlander', 'Pajero', 'L200', 'Eclipse Cross',
    // Suzuki
    'Swift', 'Vitara', 'Jimny', 'S-Cross', 'Grand Vitara', 'SX4',
    // BMW
    'Série 1', 'Série 2', 'Série 3', 'Série 4', 'Série 5', 'Série 7', 'Série 8',
    'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX',
    // Audi
    'A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron',
    // Mercedes
    'Classe A', 'Classe B', 'Classe C', 'Classe E', 'Classe S', 'CLA', 'CLS',
    'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'AMG GT', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS',
    // Porsche
    '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster', 'Cayman',
    // Motos Honda
    'CG', 'Biz', 'Pop', 'PCX', 'Elite', 'Lead', 'SH', 'ADV', 'CB', 'CBR', 'Hornet',
    'NC', 'XRE', 'CRF', 'Bros', 'Tornado', 'Transalp', 'Africa Twin', 'Gold Wing',
    // Motos Yamaha
    'Factor', 'Fazer', 'YBR', 'Crosser', 'Lander', 'Ténéré', 'MT-03', 'MT-07', 'MT-09',
    'XJ6', 'R1', 'R3', 'R6', 'R7', 'YZF', 'NMAX', 'XMAX', 'Tracer',
    // Motos Kawasaki
    'Ninja', 'Z', 'Versys', 'Vulcan', 'KLX', 'KX',
    // Motos BMW
    'G 310', 'F 750', 'F 850', 'F 900', 'R 1250', 'S 1000', 'K 1600',
    // Motos Ducati
    'Monster', 'Panigale', 'Multistrada', 'Scrambler', 'Diavel', 'Streetfighter', 'Hypermotard',
    // Motos Harley
    'Sportster', 'Softail', 'Touring', 'Street', 'Iron', 'Fat Boy', 'Road King', 'Electra Glide',
    // Motos Triumph
    'Street Triple', 'Speed Triple', 'Tiger', 'Bonneville', 'Scrambler', 'Rocket',
    // Motos Suzuki
    'GSX', 'GSX-R', 'GSX-S', 'V-Strom', 'Hayabusa', 'Boulevard', 'Burgman', 'Intruder',
  ];
  
  const nameLower = modelName.toLowerCase();
  
  for (const model of knownModels) {
    if (nameLower.includes(model.toLowerCase())) {
      return model;
    }
  }
  
  // Se não encontrou, pega a primeira palavra significativa
  const words = modelName.split(/\s+/);
  return words[0];
}

/**
 * Processa um veículo da FIPE e extrai todas as informações
 */
export function parseVehicle(fipeVehicle, vehicleType) {
  const engine = parseEngine(fipeVehicle.model);
  const trim = parseTrim(fipeVehicle.model);
  const transmission = parseTransmission(fipeVehicle.model);
  const bodyType = parseBodyType(fipeVehicle.model, vehicleType);
  const power = parsePower(fipeVehicle.model);
  const baseModel = extractBaseModel(fipeVehicle.model);
  
  // Determina vehicleType correto
  let vType = 'car';
  if (vehicleType === 'MOTOS') vType = 'motorcycle';
  else if (vehicleType === 'TRUCKS') {
    if (bodyType === 'bus') vType = 'bus';
    else vType = 'truck';
  }
  
  return {
    brand: fipeVehicle.brand,
    model: baseModel,
    fullModelName: fipeVehicle.model,
    year: fipeVehicle.year,
    trim: trim,
    engineCode: engine.engineCode,
    engineName: engine.engineName,
    displacementCc: engine.displacementCc,
    fuel: fipeVehicle.fuel,
    transmission: transmission,
    bodyType: bodyType,
    vehicleType: vType,
    power: power,
    turbo: engine.turbo,
    fipeCode: fipeVehicle.fipeCode,
  };
}

export default {
  parseEngine,
  parseTrim,
  parseTransmission,
  parseBodyType,
  parsePower,
  cleanModelName,
  extractBaseModel,
  parseVehicle,
};
