/**
 * TORQ Automotive - Full Parts Validation Orchestrator
 * 
 * Orquestra a validação completa de TODAS as peças para TODOS os veículos:
 * 1. Valida peças existentes na base de dados
 * 2. Gera peças para veículos sem cobertura
 * 3. Armazena apenas dados 100% validados no Firebase
 * 
 * @version 1.0.0
 */

import { BRAZILIAN_VEHICLES_COMPLETE, DATABASE_STATS, VEHICLES_BY_BRAND } from '../../../features/vehicle-parts-search/data/brazilianVehicles';
import { ALL_REAL_PARTS, findPartsForVehicle, getAvailableVehicleBrands } from '../data/realPartsDatabase';
import { 
  runMassiveValidation, 
  validateBrandParts,
  type MassiveValidationProgress,
  type MassiveValidationResult,
  type VehiclePartsValidation 
} from './massivePartsValidation';
import { 
  generatePartsForVehicle, 
  getTotalTemplates,
  type GeneratedPart 
} from './partsGeneratorService';
import type { VehicleVariant } from '../../../features/vehicle-parts-search/types';

// ============================================================================
// INTERFACES
// ============================================================================

export interface OrchestratorProgress {
  phase: 'analyzing' | 'validating-existing' | 'generating-new' | 'saving' | 'completed' | 'error';
  currentBrand: string;
  currentModel: string;
  brandsProcessed: number;
  totalBrands: number;
  vehiclesWithCoverage: number;
  vehiclesWithoutCoverage: number;
  partsValidated: number;
  partsGenerated: number;
  partsInvalid: number;
  percentComplete: number;
  estimatedTimeRemaining: string;
  errors: string[];
}

export interface OrchestratorResult {
  success: boolean;
  summary: {
    totalVehicles: number;
    vehiclesWithExistingParts: number;
    vehiclesWithGeneratedParts: number;
    vehiclesWithNoParts: number;
    totalPartsValidated: number;
    totalPartsGenerated: number;
    totalPartsInvalid: number;
  };
  validationsByBrand: Map<string, BrandValidationSummary>;
  duration: number;
  errors: string[];
}

export interface BrandValidationSummary {
  brand: string;
  totalVehicles: number;
  vehiclesWithParts: number;
  totalParts: number;
  validatedParts: number;
  generatedParts: number;
  invalidParts: number;
}

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analisa a cobertura atual de peças por marca
 */
export function analyzeCoverage(): {
  brandsWithCoverage: string[];
  brandsWithoutCoverage: string[];
  coverageByBrand: Map<string, { vehicles: number; partsAvailable: number }>;
} {
  const availableBrands = getAvailableVehicleBrands();
  const allBrands = [...new Set(BRAZILIAN_VEHICLES_COMPLETE.map(v => v.brand))];
  
  const brandsWithCoverage = allBrands.filter(brand => 
    availableBrands.some(ab => ab.toLowerCase() === brand.toLowerCase())

  const brandsWithoutCoverage = allBrands.filter(brand => 
    !availableBrands.some(ab => ab.toLowerCase() === brand.toLowerCase())

  const coverageByBrand = new Map<string, { vehicles: number; partsAvailable: number }>();
  
  for (const brand of allBrands) {
    const vehicles = BRAZILIAN_VEHICLES_COMPLETE.filter(v => v.brand === brand);
    let partsAvailable = 0;
    
    // Verificar quantas peças estão disponíveis para um veículo representativo
    if (vehicles.length > 0) {
      const representative = vehicles[Math.floor(vehicles.length / 2)];
      const parts = findPartsForVehicle(
        representative.brand,
        representative.model,
        representative.year,
        representative.engineCode

      partsAvailable = parts.length;
    }
    
    coverageByBrand.set(brand, {
      vehicles: vehicles.length,
      partsAvailable,
    });
  }
  
  return {
    brandsWithCoverage,
    brandsWithoutCoverage,
    coverageByBrand,
  };
}

/**
 * Identifica veículos que precisam de geração de peças
 */
function getVehiclesNeedingParts(): VehicleVariant[] {
  return BRAZILIAN_VEHICLES_COMPLETE.filter(vehicle => {
    const parts = findPartsForVehicle(
      vehicle.brand,
      vehicle.model,
      vehicle.year,
      vehicle.engineCode

    return parts.length === 0;
  });
}

/**
 * Agrupa veículos por marca/modelo para otimização
 */
function groupVehiclesByBrandModel(vehicles: VehicleVariant[]): Map<string, VehicleVariant[]> {
  const groups = new Map<string, VehicleVariant[]>();
  
  for (const vehicle of vehicles) {
    const key = `${vehicle.brand}|${vehicle.model}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(vehicle);
  }
  
  return groups;
}

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================

/**
 * Executa a validação completa de todas as peças para todos os veículos
 * 
 * Este processo:
 * 1. Analisa a cobertura atual
 * 2. Valida peças existentes via Google Scraper
 * 3. Gera peças para veículos sem cobertura
 * 4. Armazena apenas dados 100% validados
 * 
 * ATENÇÃO: Este processo pode levar MUITAS HORAS!
 */
export async function runFullOrchestration(
  onProgress?: (progress: OrchestratorProgress) => void,
  options?: {
    skipExistingValidation?: boolean;
    skipGeneration?: boolean;
    brandFilter?: string;
    maxVehiclesPerBrand?: number;
  }
): Promise<OrchestratorResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  
  // Fase 1: Análise
  onProgress?.({
    phase: 'analyzing',
    currentBrand: '',
    currentModel: '',
    brandsProcessed: 0,
    totalBrands: 0,
    vehiclesWithCoverage: 0,
    vehiclesWithoutCoverage: 0,
    partsValidated: 0,
    partsGenerated: 0,
    partsInvalid: 0,
    percentComplete: 0,
    estimatedTimeRemaining: 'Analisando...',
    errors: [],
  });
  
  const coverage = analyzeCoverage();
  const vehiclesNeedingParts = getVehiclesNeedingParts();
  const validationsByBrand = new Map<string, BrandValidationSummary>();
  let totalPartsValidated = 0;
  let totalPartsGenerated = 0;
  let totalPartsInvalid = 0;
  let vehiclesWithExistingParts = 0;
  let vehiclesWithGeneratedParts = 0;
  let vehiclesWithNoParts = 0;
  
  // Filtrar marcas se necessário
  let brandsToProcess = [...new Set(BRAZILIAN_VEHICLES_COMPLETE.map(v => v.brand))];
  if (options?.brandFilter) {
    brandsToProcess = brandsToProcess.filter(b => 
      b.toLowerCase().includes(options.brandFilter!.toLowerCase())

  }
  
  // Fase 2: Validar peças existentes
  if (!options?.skipExistingValidation) {
    for (let i = 0; i < coverage.brandsWithCoverage.length; i++) {
      const brand = coverage.brandsWithCoverage[i];
      
      if (options?.brandFilter && !brand.toLowerCase().includes(options.brandFilter.toLowerCase())) {
        continue;
      }
      
      onProgress?.({
        phase: 'validating-existing',
        currentBrand: brand,
        currentModel: '',
        brandsProcessed: i,
        totalBrands: coverage.brandsWithCoverage.length,
        vehiclesWithCoverage: vehiclesWithExistingParts,
        vehiclesWithoutCoverage: vehiclesNeedingParts.length,
        partsValidated: totalPartsValidated,
        partsGenerated: totalPartsGenerated,
        partsInvalid: totalPartsInvalid,
        percentComplete: Math.round((i / brandsToProcess.length) * 50),
        estimatedTimeRemaining: 'Calculando...',
        errors,
      });
      
      try {
        const result = await validateBrandParts(brand, (progress) => {
          onProgress?.({
            phase: 'validating-existing',
            currentBrand: brand,
            currentModel: progress.currentVehicle,
            brandsProcessed: i,
            totalBrands: coverage.brandsWithCoverage.length,
            vehiclesWithCoverage: vehiclesWithExistingParts + progress.vehiclesProcessed,
            vehiclesWithoutCoverage: vehiclesNeedingParts.length,
            partsValidated: totalPartsValidated + progress.partsValidated,
            partsGenerated: totalPartsGenerated,
            partsInvalid: totalPartsInvalid + progress.partsInvalid,
            percentComplete: Math.round((i / brandsToProcess.length) * 50),
            estimatedTimeRemaining: progress.estimatedTimeRemaining,
            errors,
          });
        });
        
        totalPartsValidated += result.totalPartsValidated;
        totalPartsInvalid += result.totalPartsInvalid;
        vehiclesWithExistingParts += result.vehiclesWithParts;
        
        validationsByBrand.set(brand, {
          brand,
          totalVehicles: result.totalVehicles,
          vehiclesWithParts: result.vehiclesWithParts,
          totalParts: result.totalPartsValidated + result.totalPartsInvalid,
          validatedParts: result.totalPartsValidated,
          generatedParts: 0,
          invalidParts: result.totalPartsInvalid,
        });
        
        errors.push(...result.errors);
        
      } catch (error: any) {
        const errorMsg = `Erro ao validar marca ${brand}: ${error.message}`;
        console.error(`[Orchestrator] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }
  }
  
  // Fase 3: Gerar peças para veículos sem cobertura
  if (!options?.skipGeneration && vehiclesNeedingParts.length > 0) {
    const vehicleGroups = groupVehiclesByBrandModel(vehiclesNeedingParts);
    let groupsProcessed = 0;
    
    for (const [groupKey, vehicles] of vehicleGroups) {
      const [brand, model] = groupKey.split('|');
      
      if (options?.brandFilter && !brand.toLowerCase().includes(options.brandFilter.toLowerCase())) {
        continue;
      }
      
      // Limitar veículos por marca se configurado
      if (options?.maxVehiclesPerBrand) {
        const brandVehicles = [...vehicleGroups.entries()]
          .filter(([k]) => k.startsWith(brand))
          .flatMap(([, v]) => v);
        
        if (brandVehicles.indexOf(vehicles[0]) >= options.maxVehiclesPerBrand) {
          continue;
        }
      }
      
      onProgress?.({
        phase: 'generating-new',
        currentBrand: brand,
        currentModel: model,
        brandsProcessed: groupsProcessed,
        totalBrands: vehicleGroups.size,
        vehiclesWithCoverage: vehiclesWithExistingParts,
        vehiclesWithoutCoverage: vehiclesNeedingParts.length - vehiclesWithGeneratedParts,
        partsValidated: totalPartsValidated,
        partsGenerated: totalPartsGenerated,
        partsInvalid: totalPartsInvalid,
        percentComplete: 50 + Math.round((groupsProcessed / vehicleGroups.size) * 50),
        estimatedTimeRemaining: 'Calculando...',
        errors,
      });
      
      // Usar o veículo mais recente do grupo como representativo
      const representative = vehicles.reduce((newest, v) => 
        v.year > newest.year ? v : newest

      try {
        const generatedParts = await generatePartsForVehicle(
          representative.brand,
          representative.model,
          representative.year,
          representative.engineCode,
          (progress) => {
            onProgress?.({
              phase: 'generating-new',
              currentBrand: brand,
              currentModel: `${model} - ${progress.currentPart}`,
              brandsProcessed: groupsProcessed,
              totalBrands: vehicleGroups.size,
              vehiclesWithCoverage: vehiclesWithExistingParts,
              vehiclesWithoutCoverage: vehiclesNeedingParts.length - vehiclesWithGeneratedParts,
              partsValidated: totalPartsValidated,
              partsGenerated: totalPartsGenerated + progress.partsGenerated,
              partsInvalid: totalPartsInvalid,
              percentComplete: 50 + Math.round((groupsProcessed / vehicleGroups.size) * 50),
              estimatedTimeRemaining: 'Calculando...',
              errors,
            });
          }

        if (generatedParts.length > 0) {
          totalPartsGenerated += generatedParts.length;
          vehiclesWithGeneratedParts += vehicles.length;
          
          // Atualizar ou criar summary da marca
          const existing = validationsByBrand.get(brand);
          if (existing) {
            existing.generatedParts += generatedParts.length;
            existing.vehiclesWithParts += vehicles.length;
          } else {
            validationsByBrand.set(brand, {
              brand,
              totalVehicles: vehicles.length,
              vehiclesWithParts: vehicles.length,
              totalParts: generatedParts.length,
              validatedParts: 0,
              generatedParts: generatedParts.length,
              invalidParts: 0,
            });
          }
        } else {
          vehiclesWithNoParts += vehicles.length;
        }
        
      } catch (error: any) {
        const errorMsg = `Erro ao gerar peças para ${brand} ${model}: ${error.message}`;
        console.error(`[Orchestrator] ${errorMsg}`);
        errors.push(errorMsg);
        vehiclesWithNoParts += vehicles.length;
      }
      
      groupsProcessed++;
    }
  }
  
  const duration = Date.now() - startTime;
  
  // Resultado final
  const result: OrchestratorResult = {
    success: errors.length === 0,
    summary: {
      totalVehicles: DATABASE_STATS.totalVehicles,
      vehiclesWithExistingParts,
      vehiclesWithGeneratedParts,
      vehiclesWithNoParts,
      totalPartsValidated,
      totalPartsGenerated,
      totalPartsInvalid,
    },
    validationsByBrand,
    duration,
    errors,
  };
  
  .toFixed(1)} minutos`);
  onProgress?.({
    phase: 'completed',
    currentBrand: '',
    currentModel: '',
    brandsProcessed: brandsToProcess.length,
    totalBrands: brandsToProcess.length,
    vehiclesWithCoverage: vehiclesWithExistingParts,
    vehiclesWithoutCoverage: vehiclesWithNoParts,
    partsValidated: totalPartsValidated,
    partsGenerated: totalPartsGenerated,
    partsInvalid: totalPartsInvalid,
    percentComplete: 100,
    estimatedTimeRemaining: '0s',
    errors,
  });
  
  return result;
}

/**
 * Executa validação apenas para uma marca específica
 */
export async function runBrandOrchestration(
  brand: string,
  onProgress?: (progress: OrchestratorProgress) => void
): Promise<OrchestratorResult> {
  return runFullOrchestration(onProgress, { brandFilter: brand });
}

/**
 * Retorna estatísticas de cobertura atual
 */
export function getCoverageStats(): {
  totalVehicles: number;
  totalParts: number;
  brandsWithCoverage: number;
  brandsWithoutCoverage: number;
  coveragePercentage: number;
} {
  const coverage = analyzeCoverage();
  const totalBrands = coverage.brandsWithCoverage.length + coverage.brandsWithoutCoverage.length;
  
  return {
    totalVehicles: DATABASE_STATS.totalVehicles,
    totalParts: ALL_REAL_PARTS.length,
    brandsWithCoverage: coverage.brandsWithCoverage.length,
    brandsWithoutCoverage: coverage.brandsWithoutCoverage.length,
    coveragePercentage: Math.round((coverage.brandsWithCoverage.length / totalBrands) * 100),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  runFullOrchestration,
  runBrandOrchestration,
  analyzeCoverage,
  getCoverageStats,
};
