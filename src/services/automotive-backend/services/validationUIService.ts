/**
 * TORQ Automotive - Validation UI Service
 * 
 * Serviço para executar validação massiva a partir do frontend
 * com interface de progresso e controle
 * 
 * @version 1.0.0
 */

import { 
  runFullOrchestration, 
  runBrandOrchestration,
  getCoverageStats,
  analyzeCoverage,
  type OrchestratorProgress,
  type OrchestratorResult 
} from './fullPartsValidationOrchestrator';
import {
  validateBrandParts,
  validateModelParts,
  type MassiveValidationProgress,
  type MassiveValidationResult
} from './massivePartsValidation';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ValidationUIState {
  isRunning: boolean;
  isPaused: boolean;
  progress: OrchestratorProgress | null;
  result: OrchestratorResult | null;
  error: string | null;
}

export interface ValidationOptions {
  brand?: string;
  model?: string;
  skipExistingValidation?: boolean;
  skipGeneration?: boolean;
  maxVehiclesPerBrand?: number;
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let currentState: ValidationUIState = {
  isRunning: false,
  isPaused: false,
  progress: null,
  result: null,
  error: null,
};

let abortController: AbortController | null = null;
const stateListeners: ((state: ValidationUIState) => void)[] = [];

function updateState(updates: Partial<ValidationUIState>): void {
  currentState = { ...currentState, ...updates };
  stateListeners.forEach(listener => listener(currentState));
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Obtém o estado atual da validação
 */
export function getValidationState(): ValidationUIState {
  return { ...currentState };
}

/**
 * Registra um listener para mudanças de estado
 */
export function subscribeToValidationState(
  listener: (state: ValidationUIState) => void
): () => void {
  stateListeners.push(listener);
  return () => {
    const index = stateListeners.indexOf(listener);
    if (index > -1) {
      stateListeners.splice(index, 1);
    }
  };
}

/**
 * Inicia a validação massiva
 */
export async function startValidation(
  options?: ValidationOptions
): Promise<OrchestratorResult> {
  if (currentState.isRunning) {
    throw new Error('Validação já está em execução');
  }
  
  abortController = new AbortController();
  
  updateState({
    isRunning: true,
    isPaused: false,
    progress: null,
    result: null,
    error: null,
  });
  
  try {
    let result: OrchestratorResult;
    
    if (options?.brand && options?.model) {
      // Validar modelo específico
      const massiveResult = await validateModelParts(
        options.brand,
        options.model,
        (progress) => {
          updateState({
            progress: {
              phase: progress.phase === 'completed' ? 'completed' : 'validating-existing',
              currentBrand: options.brand!,
              currentModel: progress.currentPart,
              brandsProcessed: 1,
              totalBrands: 1,
              vehiclesWithCoverage: progress.vehiclesProcessed,
              vehiclesWithoutCoverage: 0,
              partsValidated: progress.partsValidated,
              partsGenerated: 0,
              partsInvalid: progress.partsInvalid,
              percentComplete: progress.percentComplete,
              estimatedTimeRemaining: progress.estimatedTimeRemaining,
              errors: progress.errors,
            },
          });
        }

      result = {
        success: massiveResult.errors.length === 0,
        summary: {
          totalVehicles: massiveResult.totalVehicles,
          vehiclesWithExistingParts: massiveResult.vehiclesWithParts,
          vehiclesWithGeneratedParts: 0,
          vehiclesWithNoParts: massiveResult.totalVehicles - massiveResult.vehiclesWithParts,
          totalPartsValidated: massiveResult.totalPartsValidated,
          totalPartsGenerated: 0,
          totalPartsInvalid: massiveResult.totalPartsInvalid,
        },
        validationsByBrand: new Map(),
        duration: massiveResult.duration,
        errors: massiveResult.errors,
      };
      
    } else if (options?.brand) {
      // Validar marca específica
      result = await runBrandOrchestration(
        options.brand,
        (progress) => updateState({ progress })

    } else {
      // Validação completa
      result = await runFullOrchestration(
        (progress) => updateState({ progress }),
        {
          skipExistingValidation: options?.skipExistingValidation,
          skipGeneration: options?.skipGeneration,
          maxVehiclesPerBrand: options?.maxVehiclesPerBrand,
        }

    }
    
    updateState({
      isRunning: false,
      result,
    });
    
    return result;
    
  } catch (error: any) {
    updateState({
      isRunning: false,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Cancela a validação em execução
 */
export function cancelValidation(): void {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  
  updateState({
    isRunning: false,
    isPaused: false,
    error: 'Validação cancelada pelo usuário',
  });
}

/**
 * Obtém estatísticas de cobertura
 */
export function getStats(): ReturnType<typeof getCoverageStats> {
  return getCoverageStats();
}

/**
 * Obtém análise de cobertura detalhada
 */
export function getDetailedCoverage(): ReturnType<typeof analyzeCoverage> {
  return analyzeCoverage();
}

/**
 * Formata o tempo restante para exibição
 */
export function formatTimeRemaining(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Formata número grande para exibição
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('pt-BR');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getValidationState,
  subscribeToValidationState,
  startValidation,
  cancelValidation,
  getStats,
  getDetailedCoverage,
  formatTimeRemaining,
  formatNumber,
};
