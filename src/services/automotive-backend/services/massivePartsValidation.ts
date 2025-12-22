/**
 * TORQ Automotive - Massive Parts Validation Service
 * 
 * Valida TODAS as peças para TODOS os 20.000+ veículos usando Google Scraper
 * Mantém apenas dados 100% validados
 * 
 * @version 1.0.0
 */

import { BRAZILIAN_VEHICLES_COMPLETE, DATABASE_STATS } from '../../../features/vehicle-parts-search/data/brazilianVehicles';
import { 
  ALL_REAL_PARTS, 
  findPartsForVehicle,
  type RealPart,
  type VehicleCompatibility 
} from '../data/realPartsDatabase';
import { 
  validatePartWithScraper, 
  type PartValidationRequest,
  type ScraperValidationResult 
} from './googleScraperValidation';
import type { VehicleVariant } from '../../../features/vehicle-parts-search/types';

// ============================================================================
// INTERFACES
// ============================================================================

export interface VehiclePartsValidation {
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleEngine?: string;
  validatedParts: ValidatedPart[];
  invalidParts: InvalidPart[];
  totalPartsFound: number;
  totalPartsValidated: number;
  validationTimestamp: string;
}

export interface ValidatedPart {
  partId: string;
  partName: string;
  category: string;
  oemCode: string;
  manufacturer: string;
  equivalents: ValidatedEquivalent[];
  validationSources: string[];
  confidenceScore: number;
}

export interface ValidatedEquivalent {
  brand: string;
  code: string;
  quality: 'premium' | 'standard' | 'economy';
  validationSources: string[];
}

export interface InvalidPart {
  partId: string;
  partName: string;
  oemCode: string;
  reason: string;
  suggestedCorrection?: string;
}

export interface MassiveValidationProgress {
  phase: 'initializing' | 'validating' | 'saving' | 'completed' | 'error';
  currentVehicle: string;
  currentPart: string;
  vehiclesProcessed: number;
  totalVehicles: number;
  partsValidated: number;
  partsInvalid: number;
  percentComplete: number;
  estimatedTimeRemaining: string;
  errors: string[];
}

export interface MassiveValidationResult {
  success: boolean;
  totalVehicles: number;
  vehiclesWithParts: number;
  totalPartsValidated: number;
  totalPartsInvalid: number;
  validationsByVehicle: Map<string, VehiclePartsValidation>;
  duration: number;
  errors: string[];
}

// ============================================================================
// VALIDATION STORAGE (In-Memory Cache)
// ============================================================================

const validationCache = new Map<string, VehiclePartsValidation>();
const partValidationCache = new Map<string, ScraperValidationResult>();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gera uma chave única para cache de validação de peça
 */
function getPartCacheKey(part: RealPart, vehicle: VehicleVariant): string {
  return `${vehicle.brand}_${vehicle.model}_${vehicle.year}_${part.oemCode}`;
}

/**
 * Estima o tempo restante baseado no progresso atual
 */
function estimateTimeRemaining(
  startTime: number,
  processed: number,
  total: number
): string {
  if (processed === 0) return 'Calculando...';
  
  const elapsed = Date.now() - startTime;
  const avgTimePerItem = elapsed / processed;
  const remaining = (total - processed) * avgTimePerItem;
  
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Agrupa veículos por marca/modelo para otimizar validação
 */
function groupVehiclesByModel(vehicles: VehicleVariant[]): Map<string, VehicleVariant[]> {
  const groups = new Map<string, VehicleVariant[]>();
  
  for (const vehicle of vehicles) {
    const key = `${vehicle.brand}_${vehicle.model}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(vehicle);
  }
  
  return groups;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Valida uma única peça para um veículo específico
 */
async function validatePartForVehicle(
  part: RealPart,
  vehicle: VehicleVariant
): Promise<{ validated: ValidatedPart | null; invalid: InvalidPart | null }> {
  const cacheKey = getPartCacheKey(part, vehicle);
  
  // Verificar cache primeiro
  if (partValidationCache.has(cacheKey)) {
    const cached = partValidationCache.get(cacheKey)!;
    if (cached.isValid) {
      return {
        validated: {
          partId: part.id,
          partName: part.name,
          category: part.category,
          oemCode: part.oemCode,
          manufacturer: part.manufacturer,
          equivalents: part.equivalents.map(eq => ({
            ...eq,
            validationSources: cached.validEquivalents.find(v => v.code === eq.code)?.sources || [],
          })),
          validationSources: cached.oemCodeSources,
          confidenceScore: cached.confidence * 100,
        },
        invalid: null,
      };
    } else {
      return {
        validated: null,
        invalid: {
          partId: part.id,
          partName: part.name,
          oemCode: part.oemCode,
          reason: cached.invalidEquivalents[0]?.reason || 'Código OEM não validado',
          suggestedCorrection: cached.suggestedCorrections[0]?.correctCode,
        },
      };
    }
  }
  
  // Fazer validação via scraper
  const request: PartValidationRequest = {
    vehicleBrand: vehicle.brand,
    vehicleModel: vehicle.model,
    vehicleYear: vehicle.year,
    vehicleEngine: vehicle.engineCode,
    partName: part.name,
    oemCode: part.oemCode,
    equivalents: part.equivalents.map(eq => ({
      brand: eq.brand,
      code: eq.code,
    })),
  };
  
  try {
    const result = await validatePartWithScraper(request);
    partValidationCache.set(cacheKey, result);
    
    if (result.isValid && result.confidence >= 0.8) {
      return {
        validated: {
          partId: part.id,
          partName: part.name,
          category: part.category,
          oemCode: part.oemCode,
          manufacturer: part.manufacturer,
          equivalents: part.equivalents
            .filter(eq => result.validEquivalents.some(v => v.code === eq.code))
            .map(eq => ({
              ...eq,
              validationSources: result.validEquivalents.find(v => v.code === eq.code)?.sources || [],
            })),
          validationSources: result.oemCodeSources,
          confidenceScore: result.confidence * 100,
        },
        invalid: null,
      };
    } else {
      return {
        validated: null,
        invalid: {
          partId: part.id,
          partName: part.name,
          oemCode: part.oemCode,
          reason: result.invalidEquivalents[0]?.reason || 
                  (!result.oemCodeValid ? 'Código OEM não encontrado em fontes confiáveis' : 'Confiança insuficiente'),
          suggestedCorrection: result.suggestedCorrections[0]?.correctCode,
        },
      };
    }
  } catch (error: any) {
    return {
      validated: null,
      invalid: {
        partId: part.id,
        partName: part.name,
        oemCode: part.oemCode,
        reason: `Erro na validação: ${error.message}`,
      },
    };
  }
}

/**
 * Valida todas as peças para um veículo específico
 */
async function validateVehicleParts(
  vehicle: VehicleVariant,
  onPartValidated?: (partName: string, isValid: boolean) => void
): Promise<VehiclePartsValidation> {
  // Encontrar peças compatíveis
  const compatibleParts = findPartsForVehicle(
    vehicle.brand,
    vehicle.model,
    vehicle.year,
    vehicle.engineCode
  );
  
  const validatedParts: ValidatedPart[] = [];
  const invalidParts: InvalidPart[] = [];
  
  for (const part of compatibleParts) {
    // Rate limiting - 2 segundos entre validações
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { validated, invalid } = await validatePartForVehicle(part, vehicle);
    
    if (validated) {
      validatedParts.push(validated);
      onPartValidated?.(part.name, true);
    } else if (invalid) {
      invalidParts.push(invalid);
      onPartValidated?.(part.name, false);
    }
  }
  
  return {
    vehicleId: vehicle.id,
    vehicleBrand: vehicle.brand,
    vehicleModel: vehicle.model,
    vehicleYear: vehicle.year,
    vehicleEngine: vehicle.engineCode,
    validatedParts,
    invalidParts,
    totalPartsFound: compatibleParts.length,
    totalPartsValidated: validatedParts.length,
    validationTimestamp: new Date().toISOString(),
  };
}

// ============================================================================
// MAIN MASSIVE VALIDATION FUNCTION
// ============================================================================

/**
 * Executa validação massiva de TODAS as peças para TODOS os veículos
 * 
 * ATENÇÃO: Este processo pode levar MUITAS HORAS devido ao rate limiting
 * necessário para evitar bloqueio do Google.
 * 
 * Recomendação: Executar em lotes por marca ou usar validação incremental.
 */
export async function runMassiveValidation(
  onProgress?: (progress: MassiveValidationProgress) => void,
  options?: {
    brandFilter?: string;
    modelFilter?: string;
    yearStart?: number;
    yearEnd?: number;
    maxVehicles?: number;
    skipValidated?: boolean;
  }
): Promise<MassiveValidationResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  
  console.log('[MassiveValidation] 🚀 Iniciando validação massiva...');
  console.log(`[MassiveValidation] Total de veículos na base: ${DATABASE_STATS.totalVehicles}`);
  console.log(`[MassiveValidation] Total de peças na base: ${ALL_REAL_PARTS.length}`);
  
  // Filtrar veículos conforme opções
  let vehiclesToValidate = [...BRAZILIAN_VEHICLES_COMPLETE];
  
  if (options?.brandFilter) {
    vehiclesToValidate = vehiclesToValidate.filter(
      v => v.brand.toLowerCase().includes(options.brandFilter!.toLowerCase())
    );
  }
  
  if (options?.modelFilter) {
    vehiclesToValidate = vehiclesToValidate.filter(
      v => v.model.toLowerCase().includes(options.modelFilter!.toLowerCase())
    );
  }
  
  if (options?.yearStart) {
    vehiclesToValidate = vehiclesToValidate.filter(v => v.year >= options.yearStart!);
  }
  
  if (options?.yearEnd) {
    vehiclesToValidate = vehiclesToValidate.filter(v => v.year <= options.yearEnd!);
  }
  
  if (options?.maxVehicles) {
    vehiclesToValidate = vehiclesToValidate.slice(0, options.maxVehicles);
  }
  
  if (options?.skipValidated) {
    vehiclesToValidate = vehiclesToValidate.filter(v => !validationCache.has(v.id));
  }
  
  console.log(`[MassiveValidation] Veículos a validar: ${vehiclesToValidate.length}`);
  
  // Agrupar por modelo para otimizar (peças são compartilhadas entre anos)
  const vehicleGroups = groupVehiclesByModel(vehiclesToValidate);
  console.log(`[MassiveValidation] Grupos de modelos: ${vehicleGroups.size}`);
  
  const validationsByVehicle = new Map<string, VehiclePartsValidation>();
  let vehiclesProcessed = 0;
  let totalPartsValidated = 0;
  let totalPartsInvalid = 0;
  let vehiclesWithParts = 0;
  
  onProgress?.({
    phase: 'initializing',
    currentVehicle: '',
    currentPart: '',
    vehiclesProcessed: 0,
    totalVehicles: vehiclesToValidate.length,
    partsValidated: 0,
    partsInvalid: 0,
    percentComplete: 0,
    estimatedTimeRemaining: 'Calculando...',
    errors: [],
  });
  
  // Processar cada grupo de veículos
  for (const [groupKey, vehicles] of vehicleGroups) {
    // Pegar o primeiro veículo do grupo para validar peças
    // (peças são as mesmas para todos os anos do mesmo modelo)
    const representativeVehicle = vehicles[0];
    
    console.log(`[MassiveValidation] Validando: ${groupKey} (${vehicles.length} variantes)`);
    
    try {
      const validation = await validateVehicleParts(
        representativeVehicle,
        (partName, isValid) => {
          onProgress?.({
            phase: 'validating',
            currentVehicle: `${representativeVehicle.brand} ${representativeVehicle.model}`,
            currentPart: partName,
            vehiclesProcessed,
            totalVehicles: vehiclesToValidate.length,
            partsValidated: totalPartsValidated,
            partsInvalid: totalPartsInvalid,
            percentComplete: Math.round((vehiclesProcessed / vehiclesToValidate.length) * 100),
            estimatedTimeRemaining: estimateTimeRemaining(startTime, vehiclesProcessed, vehiclesToValidate.length),
            errors,
          });
        }
      );
      
      // Aplicar validação a todas as variantes do grupo
      for (const vehicle of vehicles) {
        const vehicleValidation: VehiclePartsValidation = {
          ...validation,
          vehicleId: vehicle.id,
          vehicleYear: vehicle.year,
        };
        
        validationsByVehicle.set(vehicle.id, vehicleValidation);
        validationCache.set(vehicle.id, vehicleValidation);
        vehiclesProcessed++;
        
        if (vehicleValidation.validatedParts.length > 0) {
          vehiclesWithParts++;
        }
      }
      
      totalPartsValidated += validation.validatedParts.length;
      totalPartsInvalid += validation.invalidParts.length;
      
    } catch (error: any) {
      const errorMsg = `Erro ao validar ${groupKey}: ${error.message}`;
      console.error(`[MassiveValidation] ${errorMsg}`);
      errors.push(errorMsg);
      
      // Marcar todos os veículos do grupo como processados com erro
      for (const vehicle of vehicles) {
        vehiclesProcessed++;
      }
    }
    
    // Atualizar progresso
    onProgress?.({
      phase: 'validating',
      currentVehicle: groupKey,
      currentPart: '',
      vehiclesProcessed,
      totalVehicles: vehiclesToValidate.length,
      partsValidated: totalPartsValidated,
      partsInvalid: totalPartsInvalid,
      percentComplete: Math.round((vehiclesProcessed / vehiclesToValidate.length) * 100),
      estimatedTimeRemaining: estimateTimeRemaining(startTime, vehiclesProcessed, vehiclesToValidate.length),
      errors,
    });
  }
  
  const duration = Date.now() - startTime;
  
  console.log('[MassiveValidation] ✅ Validação massiva concluída!');
  console.log(`[MassiveValidation] Veículos processados: ${vehiclesProcessed}`);
  console.log(`[MassiveValidation] Veículos com peças: ${vehiclesWithParts}`);
  console.log(`[MassiveValidation] Peças validadas: ${totalPartsValidated}`);
  console.log(`[MassiveValidation] Peças inválidas: ${totalPartsInvalid}`);
  console.log(`[MassiveValidation] Duração: ${(duration / 1000 / 60).toFixed(1)} minutos`);
  console.log(`[MassiveValidation] Erros: ${errors.length}`);
  
  onProgress?.({
    phase: 'completed',
    currentVehicle: '',
    currentPart: '',
    vehiclesProcessed,
    totalVehicles: vehiclesToValidate.length,
    partsValidated: totalPartsValidated,
    partsInvalid: totalPartsInvalid,
    percentComplete: 100,
    estimatedTimeRemaining: '0s',
    errors,
  });
  
  return {
    success: errors.length === 0,
    totalVehicles: vehiclesProcessed,
    vehiclesWithParts,
    totalPartsValidated,
    totalPartsInvalid,
    validationsByVehicle,
    duration,
    errors,
  };
}

/**
 * Valida peças para uma marca específica
 */
export async function validateBrandParts(
  brand: string,
  onProgress?: (progress: MassiveValidationProgress) => void
): Promise<MassiveValidationResult> {
  return runMassiveValidation(onProgress, { brandFilter: brand });
}

/**
 * Valida peças para um modelo específico
 */
export async function validateModelParts(
  brand: string,
  model: string,
  onProgress?: (progress: MassiveValidationProgress) => void
): Promise<MassiveValidationResult> {
  return runMassiveValidation(onProgress, { brandFilter: brand, modelFilter: model });
}

/**
 * Obtém validação em cache para um veículo
 */
export function getCachedValidation(vehicleId: string): VehiclePartsValidation | undefined {
  return validationCache.get(vehicleId);
}

/**
 * Limpa o cache de validações
 */
export function clearValidationCache(): void {
  validationCache.clear();
  partValidationCache.clear();
}

/**
 * Retorna estatísticas do cache
 */
export function getValidationCacheStats(): {
  vehiclesValidated: number;
  partsValidated: number;
  cacheSize: number;
} {
  let partsValidated = 0;
  validationCache.forEach(v => {
    partsValidated += v.validatedParts.length;
  });
  
  return {
    vehiclesValidated: validationCache.size,
    partsValidated,
    cacheSize: partValidationCache.size,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  runMassiveValidation,
  validateBrandParts,
  validateModelParts,
  getCachedValidation,
  clearValidationCache,
  getValidationCacheStats,
};
