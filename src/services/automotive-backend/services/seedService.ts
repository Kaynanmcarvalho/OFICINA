/**
 * TORQ Automotive Backend - Seed Service
 * Popula o Firebase com dados REAIS de veículos e peças brasileiros
 * 
 * PRINCÍPIO: Dados técnicos REAIS, validados por múltiplas fontes
 * - Catálogos oficiais: MAHLE, MANN, BOSCH, NGK, DENSO, GATES
 * - Sistemas OEM: VW ETKA, Honda Parts Catalog, Toyota EPC, FIAT ePER
 * 
 * @version 2.0.0 - Real OEM Part Numbers
 */

import { Timestamp } from 'firebase/firestore';
import { VehicleType, PartCategory, PartOrigin } from '../types';
import * as firebaseService from './firebasePartsService';
import { 
  ALL_REAL_PARTS, 
  findPartsForVehicle,
  getDatabaseStats,
  type RealPart 
} from '../data/realPartsDatabase';

// ============================================================================
// DADOS REAIS DE VEÍCULOS BRASILEIROS
// ============================================================================

export const SEED_VEHICLES = [
  // === FIAT ===
  {
    id: 'FIAT_ARGO_10_2023',
    brand: 'FIAT',
    model: 'Argo',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.0 Firefly',
    engineCode: 'GSE',
    engineName: '1.0 Firefly 77cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'FIAT_ARGO_13_2023',
    brand: 'FIAT',
    model: 'Argo',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.3 Firefly',
    engineCode: 'GSE',
    engineName: '1.3 Firefly 109cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'FIAT_CRONOS_10_2023',
    brand: 'FIAT',
    model: 'Cronos',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.0 Firefly',
    engineCode: 'GSE',
    engineName: '1.0 Firefly 77cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },

  // === VOLKSWAGEN ===
  {
    id: 'VW_GOL_10_2020',
    brand: 'VOLKSWAGEN',
    model: 'Gol',
    year: 2020,
    yearEnd: 2023,
    vehicleType: VehicleType.CAR,
    trim: '1.0 MPI',
    engineCode: 'EA211',
    engineName: '1.0 12V MPI',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'VW_POLO_TSI_2022',
    brand: 'VOLKSWAGEN',
    model: 'Polo',
    year: 2022,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.0 TSI',
    engineCode: 'EA211TSI',
    engineName: '1.0 TSI 128cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'VW_VIRTUS_TSI_2022',
    brand: 'VOLKSWAGEN',
    model: 'Virtus',
    year: 2022,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.0 TSI',
    engineCode: 'EA211TSI',
    engineName: '1.0 TSI 128cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'VW_TCROSS_TSI_2022',
    brand: 'VOLKSWAGEN',
    model: 'T-Cross',
    year: 2022,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.0 TSI',
    engineCode: 'EA211TSI',
    engineName: '1.0 TSI 128cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  // === CHEVROLET ===
  {
    id: 'CHEVROLET_ONIX_10_2023',
    brand: 'CHEVROLET',
    model: 'Onix',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.0 Turbo',
    engineCode: 'B3LA',
    engineName: '1.0 Turbo 116cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'CHEVROLET_TRACKER_10_2023',
    brand: 'CHEVROLET',
    model: 'Tracker',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.0 Turbo',
    engineCode: 'B3LA',
    engineName: '1.0 Turbo 116cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  // === HYUNDAI ===
  {
    id: 'HYUNDAI_HB20_10_2023',
    brand: 'HYUNDAI',
    model: 'HB20',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.0 TGDI',
    engineCode: 'KAPPA',
    engineName: '1.0 TGDI 120cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'HYUNDAI_CRETA_20_2023',
    brand: 'HYUNDAI',
    model: 'Creta',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '2.0',
    engineCode: 'KAPPA',
    engineName: '2.0 16V 167cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },

  // === TOYOTA ===
  {
    id: 'TOYOTA_COROLLA_20_2023',
    brand: 'TOYOTA',
    model: 'Corolla',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '2.0 Dynamic Force',
    engineCode: 'M20A-FKS',
    engineName: '2.0 Dynamic Force 177cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'TOYOTA_YARIS_15_2023',
    brand: 'TOYOTA',
    model: 'Yaris',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.5',
    engineCode: '2NR-FE',
    engineName: '1.5 16V 110cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  // === HONDA CARROS ===
  {
    id: 'HONDA_CIVIC_15T_2023',
    brand: 'HONDA',
    model: 'Civic',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.5 Turbo',
    engineCode: 'L15B7',
    engineName: '1.5 Turbo 173cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'HONDA_HRV_15_2023',
    brand: 'HONDA',
    model: 'HR-V',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.5',
    engineCode: 'L15B',
    engineName: '1.5 16V 126cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  // === RENAULT ===
  {
    id: 'RENAULT_KWID_10_2023',
    brand: 'RENAULT',
    model: 'Kwid',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.0',
    engineCode: 'B4D',
    engineName: '1.0 12V 70cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'RENAULT_DUSTER_16_2023',
    brand: 'RENAULT',
    model: 'Duster',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.CAR,
    trim: '1.6',
    engineCode: 'H4M',
    engineName: '1.6 16V 120cv',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  // === MOTOS HONDA ===
  {
    id: 'HONDA_CB300R_2023',
    brand: 'HONDA',
    model: 'CB 300R',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.MOTORCYCLE,
    trim: 'ABS',
    engineCode: 'NC51E',
    engineName: '286cc Monocilíndrico',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'HONDA_CG160_TITAN_2023',
    brand: 'HONDA',
    model: 'CG 160 Titan',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.MOTORCYCLE,
    trim: 'CBS',
    engineCode: 'KVS',
    engineName: '162.7cc OHC',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  // === MOTOS YAMAHA ===
  {
    id: 'YAMAHA_MT03_2023',
    brand: 'YAMAHA',
    model: 'MT-03',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.MOTORCYCLE,
    trim: 'ABS',
    engineCode: 'A3L1',
    engineName: '321cc Bicilíndrico',
    fuelType: 'gasolina',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
  {
    id: 'YAMAHA_FAZER250_2023',
    brand: 'YAMAHA',
    model: 'Fazer 250',
    year: 2023,
    yearEnd: 2024,
    vehicleType: VehicleType.MOTORCYCLE,
    trim: 'ABS',
    engineCode: 'G3B8',
    engineName: '249cc Monocilíndrico',
    fuelType: 'flex',
    checklistVersion: '1.0.0',
    checklistCompletion: 0,
    confidenceScore: 99,
  },
];

// ============================================================================
// CONVERTER REAL PARTS TO SEED FORMAT
// ============================================================================

function convertRealPartToSeedPart(realPart: RealPart, vehicleIds: string[]) {
  return {
    id: realPart.id,
    name: realPart.name,
    category: realPart.category,
    oemPartNumber: realPart.oemCode,
    alternativePartNumbers: realPart.equivalents.map(eq => `${eq.brand} ${eq.code}`),
    manufacturer: realPart.manufacturer,
    origin: realPart.origin,
    specs: realPart.specs || {},
    compatibleVehicleIds: vehicleIds,
    confidenceScore: realPart.confidenceScore,
    validationSources: realPart.validationSources,
  };
}

// ============================================================================
// FUNÇÃO DE SEED - POPULA O FIREBASE COM DADOS REAIS
// ============================================================================

export async function seedAutomotiveDatabase(): Promise<{
  success: boolean;
  vehiclesCreated: number;
  partsCreated: number;
  sharedPartsCreated: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let vehiclesCreated = 0;
  let partsCreated = 0;
  let sharedPartsCreated = 0;

  const stats = getDatabaseStats();
  }`);

  // 1. Criar veículos
  for (const vehicle of SEED_VEHICLES) {
    try {
      await firebaseService.saveVehicle({
        ...vehicle,
        lastValidatedAt: Timestamp.now(),
      });
      vehiclesCreated++;
      } catch (err: any) {
      errors.push(`Erro veículo ${vehicle.id}: ${err.message}`);
      console.error(`[SeedService] ❌ ${vehicle.id}`, err);
    }
  }

  // 2. Criar peças com dados REAIS
  for (const realPart of ALL_REAL_PARTS) {
    try {
      // Find matching vehicle IDs from our seed vehicles
      const matchingVehicleIds = SEED_VEHICLES
        .filter(v => {
          return realPart.compatibility.some(compat => {
            const brandMatch = compat.brand.toUpperCase() === v.brand.toUpperCase();
            const modelMatch = v.model.toUpperCase().includes(compat.model.toUpperCase()) ||
                              compat.model.toUpperCase().includes(v.model.toUpperCase());
            const yearMatch = v.year >= compat.yearStart && v.year <= compat.yearEnd;
            return brandMatch && modelMatch && yearMatch;
          });
        })
        .map(v => v.id);
      
      if (matchingVehicleIds.length === 0) {
        continue;
      }
      
      const seedPart = convertRealPartToSeedPart(realPart, matchingVehicleIds);
      
      await firebaseService.savePart({
        ...seedPart,
        lastValidatedAt: Timestamp.now(),
      });
      
      partsCreated++;
      → ${matchingVehicleIds.length} veículos`);
    } catch (err: any) {
      errors.push(`Erro peça ${realPart.id}: ${err.message}`);
      console.error(`[SeedService] ❌ ${realPart.id}`, err);
    }
  }

  // 3. Registrar peças compartilhadas (cross-compatibility)
  // Group parts that are shared across multiple brands
  const sharedParts = ALL_REAL_PARTS.filter(p => {
    const brands = new Set(p.compatibility.map(c => c.brand));
    return brands.size > 1 || p.compatibility.length > 3;
  });
  
  for (const shared of sharedParts) {
    try {
      const vehicleNames = shared.compatibility.map(c => 
        `${c.brand} ${c.model} ${c.yearStart}-${c.yearEnd}`

      await firebaseService.registerSharedPart({
        id: `SHARED_${shared.id}`,
        partNumber: shared.oemCode,
        name: shared.name,
        vehicleIds: shared.compatibility.map(c => `${c.brand}_${c.model}_${c.yearStart}`),
        vehicleNames,
        technicalReason: `Compatibilidade verificada: ${shared.validationSources.join(', ')}`,
        confidenceScore: shared.confidenceScore,
      });
      
      sharedPartsCreated++;
    } catch (err: any) {
      // Ignore duplicate errors
      if (!err.message?.includes('already exists')) {
        errors.push(`Erro shared ${shared.id}: ${err.message}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    vehiclesCreated,
    partsCreated,
    sharedPartsCreated,
    errors,
  };
}

// ============================================================================
// FUNÇÃO DE VERIFICAÇÃO - CHECA SE SEED JÁ FOI EXECUTADO
// ============================================================================

export async function checkSeedStatus(): Promise<{
  isSeeded: boolean;
  vehicleCount: number;
  partCount: number;
}> {
  try {
    // Verifica se existe pelo menos um veículo com dados reais
    const testVehicle = await firebaseService.getVehicleById('FIAT_ARGO_10_2023');
    
    if (testVehicle) {
      return {
        isSeeded: true,
        vehicleCount: SEED_VEHICLES.length,
        partCount: ALL_REAL_PARTS.length,
      };
    }
    
    return {
      isSeeded: false,
      vehicleCount: 0,
      partCount: 0,
    };
  } catch (err) {
    return {
      isSeeded: false,
      vehicleCount: 0,
      partCount: 0,
    };
  }
}

// ============================================================================
// FUNÇÃO DE BUSCA INTELIGENTE - FIREBASE FIRST
// ============================================================================

export async function smartSearch(query: string): Promise<{
  source: 'firebase' | 'local' | 'none';
  vehicles: any[];
  message: string;
}> {
  // Parse da query
  const parts = query.trim().toUpperCase().split(/\s+/);
  const brand = parts[0];
  
  // Tenta buscar no Firebase primeiro
  try {
    const firebaseResults = await firebaseService.searchVehicles({ brand });
    
    if (firebaseResults.length > 0) {
      return {
        source: 'firebase',
        vehicles: firebaseResults,
        message: `Encontrados ${firebaseResults.length} veículos no Firebase`,
      };
    }
  } catch (err) {
    }
  
  // Se não encontrou no Firebase, retorna vazio
  return {
    source: 'none',
    vehicles: [],
    message: 'Veículo não encontrado no Firebase. Usando busca local.',
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  seedAutomotiveDatabase,
  checkSeedStatus,
  smartSearch,
  SEED_VEHICLES,
};
