/**
 * TORQ Automotive - Serviço de Matriz de Compatibilidade
 * 
 * Este serviço mapeia veículos para plataformas compartilhadas,
 * permitindo encontrar peças compatíveis mesmo para veículos
 * que não estão diretamente no banco de dados.
 */

// Plataformas compartilhadas - veículos que usam as mesmas peças
export const SHARED_PLATFORMS: Record<string, PlatformConfig> = {
  // HYUNDAI/KIA - Plataforma K2 (Motor Gamma)
  'HYUNDAI_GAMMA': {
    partsPrefix: 'HY_GAMMA',
    vehicles: [
      { brand: 'Hyundai', models: ['Creta', 'HB20', 'HB20S', 'HB20X'], yearStart: 2012, yearEnd: 2024 },
      { brand: 'Kia', models: ['Cerato', 'Soul'], yearStart: 2013, yearEnd: 2024 }
    ],
    engineCodes: ['Gamma', 'G4FG', '1.6 16V']
  },
  
  // FIAT/JEEP - Plataforma MLA (Motor Firefly)
  'FIAT_FIREFLY': {
    partsPrefix: 'FIAT_FIREFLY',
    vehicles: [
      { brand: 'Fiat', models: ['Argo', 'Cronos', 'Mobi', 'Strada', 'Pulse', 'Fastback'], yearStart: 2017, yearEnd: 2024 },
      { brand: 'Jeep', models: ['Renegade'], yearStart: 2019, yearEnd: 2024 }
    ],
    engineCodes: ['Firefly', '1.0', '1.3']
  },
  
  // VW - Plataforma MQB (Motor EA211)
  'VW_EA211': {
    partsPrefix: 'VW_EA211',
    vehicles: [
      { brand: 'Volkswagen', models: ['Polo', 'Virtus', 'T-Cross', 'Nivus', 'Taos', 'Gol', 'Voyage', 'Saveiro'], yearStart: 2018, yearEnd: 2024 },
      { brand: 'Audi', models: ['A3'], yearStart: 2020, yearEnd: 2024 }
    ],
    engineCodes: ['EA211', 'TSI', '1.0 TSI', '1.4 TSI']
  },
  
  // GM - Plataforma GEM (Motor Turbo)
  'GM_TURBO': {
    partsPrefix: 'GM_TURBO',
    vehicles: [
      { brand: 'Chevrolet', models: ['Onix', 'Onix Plus', 'Tracker', 'Montana', 'Spin'], yearStart: 2020, yearEnd: 2024 }
    ],
    engineCodes: ['Turbo', '1.0 Turbo', '1.2 Turbo']
  },
  
  // TOYOTA - Plataforma TNGA (Motor 2ZR)
  'TOYOTA_2ZR': {
    partsPrefix: 'TOYOTA_2ZR',
    vehicles: [
      { brand: 'Toyota', models: ['Corolla', 'Corolla Cross'], yearStart: 2020, yearEnd: 2024 }
    ],
    engineCodes: ['2ZR-FE', '2.0 16V']
  },
  
  // TOYOTA - Motor 1NR
  'TOYOTA_1NR': {
    partsPrefix: 'TOYOTA_1NR',
    vehicles: [
      { brand: 'Toyota', models: ['Yaris', 'Yaris Sedan', 'Etios'], yearStart: 2018, yearEnd: 2024 }
    ],
    engineCodes: ['1NR-FE', '1.3 16V', '1.5 16V']
  },
  
  // HONDA - Motor L15
  'HONDA_L15': {
    partsPrefix: 'HONDA_L15',
    vehicles: [
      { brand: 'Honda', models: ['Civic', 'HR-V', 'City', 'City Hatch', 'WR-V'], yearStart: 2017, yearEnd: 2024 }
    ],
    engineCodes: ['L15B', '1.5 Turbo', '1.5 16V']
  },
  
  // RENAULT - Plataforma CMF-B (Motor SCe)
  'RENAULT_SCE': {
    partsPrefix: 'RENAULT_SCE',
    vehicles: [
      { brand: 'Renault', models: ['Kwid', 'Sandero', 'Logan', 'Stepway', 'Duster', 'Captur'], yearStart: 2017, yearEnd: 2024 },
      { brand: 'Nissan', models: ['Kicks', 'Versa', 'March'], yearStart: 2020, yearEnd: 2024 }
    ],
    engineCodes: ['SCe', '1.0 SCe', '1.6 SCe']
  },
  
  // PSA - Motor Firefly (compartilhado com Fiat)
  'PSA_FIREFLY': {
    partsPrefix: 'FIAT_FIREFLY', // Usa peças Fiat
    vehicles: [
      { brand: 'Peugeot', models: ['208', '2008'], yearStart: 2020, yearEnd: 2024 },
      { brand: 'Citroën', models: ['C3', 'C4 Cactus'], yearStart: 2020, yearEnd: 2024 }
    ],
    engineCodes: ['Firefly', '1.0', '1.6 THP']
  },
  
  // MOTOS HONDA 300cc
  'HONDA_MOTO_300': {
    partsPrefix: 'HONDA_MOTO',
    vehicles: [
      { brand: 'Honda', models: ['CB 300R', 'CB 300F Twister', 'XRE 300', 'CB Twister'], yearStart: 2009, yearEnd: 2024 }
    ],
    engineCodes: ['300cc']
  },
  
  // MOTOS HONDA 160cc
  'HONDA_MOTO_160': {
    partsPrefix: 'HONDA_MOTO',
    vehicles: [
      { brand: 'Honda', models: ['CG 160', 'CG 160 Titan', 'CG 160 Fan', 'CG 160 Start', 'Bros 160', 'NXR 160'], yearStart: 2016, yearEnd: 2024 }
    ],
    engineCodes: ['160cc']
  },
  
  // MOTOS YAMAHA 300cc
  'YAMAHA_MOTO_300': {
    partsPrefix: 'YAMAHA_MOTO',
    vehicles: [
      { brand: 'Yamaha', models: ['MT-03', 'YZF-R3', 'XJ6'], yearStart: 2015, yearEnd: 2024 }
    ],
    engineCodes: ['300cc', '321cc']
  },
  
  // MOTOS YAMAHA 250cc
  'YAMAHA_MOTO_250': {
    partsPrefix: 'YAMAHA_MOTO',
    vehicles: [
      { brand: 'Yamaha', models: ['Fazer 250', 'Lander 250', 'Tenere 250', 'YS 250'], yearStart: 2006, yearEnd: 2024 }
    ],
    engineCodes: ['250cc']
  }
};

interface PlatformConfig {
  partsPrefix: string;
  vehicles: {
    brand: string;
    models: string[];
    yearStart: number;
    yearEnd: number;
  }[];
  engineCodes: string[];
}

interface VehicleInfo {
  brand: string;
  model: string;
  year: number;
  engine?: string;
}

/**
 * Encontra a plataforma compatível para um veículo
 */
export function findPlatformForVehicle(vehicle: VehicleInfo): string | null {
  const { brand, model, year } = vehicle;
  const normalizedBrand = brand.toLowerCase().trim();
  const normalizedModel = model.toLowerCase().trim();
  
  for (const [platformId, config] of Object.entries(SHARED_PLATFORMS)) {
    for (const vehicleConfig of config.vehicles) {
      // Verificar marca
      if (vehicleConfig.brand.toLowerCase() !== normalizedBrand) continue;
      
      // Verificar modelo (busca parcial)
      const modelMatch = vehicleConfig.models.some(m => 
        normalizedModel.includes(m.toLowerCase()) || 
        m.toLowerCase().includes(normalizedModel)
      );
      if (!modelMatch) continue;
      
      // Verificar ano
      if (year < vehicleConfig.yearStart || year > vehicleConfig.yearEnd) continue;
      
      return platformId;
    }
  }
  
  return null;
}

/**
 * Retorna o prefixo de peças para uma plataforma
 */
export function getPartsPrefix(platformId: string): string | null {
  return SHARED_PLATFORMS[platformId]?.partsPrefix || null;
}

/**
 * Lista todas as marcas cobertas
 */
export function getCoveredBrands(): string[] {
  const brands = new Set<string>();
  Object.values(SHARED_PLATFORMS).forEach(config => {
    config.vehicles.forEach(v => brands.add(v.brand));
  });
  return Array.from(brands).sort();
}

/**
 * Lista todos os modelos cobertos para uma marca
 */
export function getCoveredModels(brand: string): string[] {
  const models = new Set<string>();
  const normalizedBrand = brand.toLowerCase();
  
  Object.values(SHARED_PLATFORMS).forEach(config => {
    config.vehicles.forEach(v => {
      if (v.brand.toLowerCase() === normalizedBrand) {
        v.models.forEach(m => models.add(m));
      }
    });
  });
  
  return Array.from(models).sort();
}

/**
 * Verifica se um veículo tem cobertura de peças
 */
export function hasPartsCoverage(vehicle: VehicleInfo): boolean {
  return findPlatformForVehicle(vehicle) !== null;
}

/**
 * Retorna estatísticas de cobertura
 */
export function getCoverageStats() {
  const brands = getCoveredBrands();
  let totalModels = 0;
  let totalYearCombinations = 0;
  
  Object.values(SHARED_PLATFORMS).forEach(config => {
    config.vehicles.forEach(v => {
      totalModels += v.models.length;
      totalYearCombinations += v.models.length * (v.yearEnd - v.yearStart + 1);
    });
  });
  
  return {
    platforms: Object.keys(SHARED_PLATFORMS).length,
    brands: brands.length,
    brandsList: brands,
    totalModels,
    totalVehicleCombinations: totalYearCombinations,
    partsInDatabase: 263
  };
}

export default {
  SHARED_PLATFORMS,
  findPlatformForVehicle,
  getPartsPrefix,
  getCoveredBrands,
  getCoveredModels,
  hasPartsCoverage,
  getCoverageStats
};
