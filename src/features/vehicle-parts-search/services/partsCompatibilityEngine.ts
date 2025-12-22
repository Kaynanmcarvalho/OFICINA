/**
 * Parts Compatibility Engine - VERSÃO COM CÓDIGOS OEM REAIS
 * 
 * IMPORTANTE: Este arquivo usa APENAS códigos OEM REAIS verificados
 * do realPartsDatabase.ts
 * 
 * @version 3.0.0 - Integrado com realPartsDatabase
 */

import type { VehicleVariant, MatchType } from '../types';
import { 
  ALL_REAL_PARTS, 
  findPartsForVehicle,
  getDatabaseStats,
  type RealPart 
} from '../../../services/automotive-backend/data/realPartsDatabase';
import { PartCategory } from '../../../services/automotive-backend/types';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CompatiblePartResult {
  partNumber: string;
  name: string;
  brand: string;
  category: string;
  categoryKey: string;
  equivalents: string[];
  specs: Record<string, any>;
  matchType: MatchType;
  confidence: number;
  matchReason: string;
}

// ============================================================================
// CATEGORY MAPPING
// ============================================================================

const CATEGORY_NAMES: Record<PartCategory, string> = {
  [PartCategory.ENGINE]: 'Motor',
  [PartCategory.FILTRATION]: 'Filtros',
  [PartCategory.IGNITION]: 'Ignição',
  [PartCategory.FUEL_SYSTEM]: 'Sistema de Combustível',
  [PartCategory.COOLING]: 'Arrefecimento',
  [PartCategory.LUBRICATION]: 'Lubrificação',
  [PartCategory.TRANSMISSION]: 'Transmissão',
  [PartCategory.CLUTCH]: 'Embreagem',
  [PartCategory.DRIVETRAIN]: 'Trem de Força',
  [PartCategory.SUSPENSION]: 'Suspensão',
  [PartCategory.STEERING]: 'Direção',
  [PartCategory.BRAKES]: 'Freios',
  [PartCategory.ELECTRICAL]: 'Elétrica',
  [PartCategory.LIGHTING]: 'Iluminação',
  [PartCategory.BATTERY]: 'Bateria',
  [PartCategory.EXHAUST]: 'Escapamento',
  [PartCategory.BODY]: 'Carroceria',
  [PartCategory.WHEELS]: 'Rodas e Pneus',
};

// ============================================================================
// CONVERT REAL PART TO COMPATIBLE PART RESULT
// ============================================================================

function convertRealPartToResult(realPart: RealPart): CompatiblePartResult {
  return {
    partNumber: realPart.oemCode,
    name: realPart.name,
    brand: realPart.manufacturer,
    category: CATEGORY_NAMES[realPart.category] || realPart.category,
    categoryKey: realPart.category,
    equivalents: realPart.equivalents.map(eq => `${eq.brand} ${eq.code}`),
    specs: realPart.specs || {},
    matchType: 'exact' as MatchType,
    confidence: realPart.confidenceScore / 100,
    matchReason: `Código OEM verificado: ${realPart.validationSources.join(', ')}`,
  };
}

// ============================================================================
// MAIN FUNCTION - FIND COMPATIBLE PARTS FOR VEHICLE
// ============================================================================

export function findCompatiblePartsForVehicle(variant: VehicleVariant): CompatiblePartResult[] {
  console.log(`[PartsEngine] 🔍 Buscando peças REAIS para: ${variant.brand} ${variant.model} ${variant.year}`);
  
  // Use the real parts database
  const realParts = findPartsForVehicle(
    variant.brand,
    variant.model,
    variant.year,
    variant.engineCode
  );
  
  console.log(`[PartsEngine] ✅ Encontradas ${realParts.length} peças REAIS`);
  
  // Convert to the expected format
  const results = realParts.map(convertRealPartToResult);
  
  // Log the parts found
  for (const part of results) {
    console.log(`[PartsEngine] 📦 ${part.name}: ${part.partNumber} (${part.brand})`);
  }
  
  return results;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Retorna categorias disponíveis
 */
export function getAvailablePartsCategories(): string[] {
  const stats = getDatabaseStats();
  return Object.keys(stats.partsByCategory).map(cat => CATEGORY_NAMES[cat as PartCategory] || cat);
}

/**
 * Retorna marcas de peças disponíveis
 */
export function getAvailablePartsBrands(): string[] {
  const brands = new Set<string>();
  
  for (const part of ALL_REAL_PARTS) {
    brands.add(part.manufacturer);
    for (const eq of part.equivalents) {
      brands.add(eq.brand);
    }
  }
  
  return Array.from(brands).sort();
}

/**
 * Busca peça por código OEM
 */
export function findPartByOemCode(oemCode: string): CompatiblePartResult | null {
  const normalizedCode = oemCode.replace(/[\s-]/g, '').toUpperCase();
  
  const realPart = ALL_REAL_PARTS.find(part => {
    const partCode = part.oemCode.replace(/[\s-]/g, '').toUpperCase();
    return partCode === normalizedCode;
  });
  
  if (realPart) {
    return convertRealPartToResult(realPart);
  }
  
  return null;
}

/**
 * Busca peças por código equivalente
 */
export function findPartsByEquivalentCode(code: string): CompatiblePartResult[] {
  const normalizedCode = code.replace(/[\s-]/g, '').toUpperCase();
  
  const matchingParts = ALL_REAL_PARTS.filter(part => {
    return part.equivalents.some(eq => {
      const eqCode = eq.code.replace(/[\s-]/g, '').toUpperCase();
      return eqCode === normalizedCode || eqCode.includes(normalizedCode);
    });
  });
  
  return matchingParts.map(convertRealPartToResult);
}

/**
 * Retorna estatísticas do banco de dados
 */
export function getEngineStats() {
  const stats = getDatabaseStats();
  return {
    totalParts: stats.totalParts,
    totalEquivalents: stats.totalEquivalents,
    brandsCovered: Object.keys(stats.partsByBrand),
    categoriesCovered: Object.keys(stats.partsByCategory).map(cat => CATEGORY_NAMES[cat as PartCategory] || cat),
    averageEquivalentsPerPart: stats.averageEquivalentsPerPart,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  findCompatiblePartsForVehicle,
  getAvailablePartsCategories,
  getAvailablePartsBrands,
  findPartByOemCode,
  findPartsByEquivalentCode,
  getEngineStats,
};
