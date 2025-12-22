/**
 * TORQ Automotive - Parts Validation UI Service
 * 
 * Serviço para integração da validação de peças com a UI
 * Permite executar validação em background e mostrar progresso
 * 
 * @version 2.0.0 - Usando Google Scraper
 */

import {
  runFullValidation,
  runBrandValidation,
  generateCorrectedCode,
  type ValidationRunResult,
} from './partsValidationRunner';
import { getDatabaseStats, ALL_REAL_PARTS } from '../data/realPartsDatabase';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ValidationProgress {
  phase: 'idle' | 'validating' | 'completed' | 'error';
  currentPart: string;
  currentIndex: number;
  totalParts: number;
  percentComplete: number;
  validCount: number;
  invalidCount: number;
  errors: string[];
}

export interface ValidationSummary {
  totalParts: number;
  validParts: number;
  invalidParts: number;
  correctionsNeeded: number;
  averageConfidence: number;
  timestamp: string;
  duration: number;
}

// ============================================================================
// STATE
// ============================================================================

let currentProgress: ValidationProgress = {
  phase: 'idle',
  currentPart: '',
  currentIndex: 0,
  totalParts: 0,
  percentComplete: 0,
  validCount: 0,
  invalidCount: 0,
  errors: [],
};

let lastResult: ValidationRunResult | null = null;

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

/**
 * Retorna o progresso atual da validação
 */
export function getValidationProgress(): ValidationProgress {
  return { ...currentProgress };
}

/**
 * Retorna o último resultado de validação
 */
export function getLastValidationResult(): ValidationRunResult | null {
  return lastResult;
}

/**
 * Reseta o estado de validação
 */
export function resetValidationState(): void {
  currentProgress = {
    phase: 'idle',
    currentPart: '',
    currentIndex: 0,
    totalParts: 0,
    percentComplete: 0,
    validCount: 0,
    invalidCount: 0,
    errors: [],
  };
  lastResult = null;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Executa validação completa de todas as peças
 */
export async function startFullValidation(
  onProgressUpdate?: (progress: ValidationProgress) => void
): Promise<ValidationSummary> {
  const startTime = Date.now();
  
  currentProgress = {
    phase: 'validating',
    currentPart: '',
    currentIndex: 0,
    totalParts: ALL_REAL_PARTS.length,
    percentComplete: 0,
    validCount: 0,
    invalidCount: 0,
    errors: [],
  };
  
  onProgressUpdate?.(currentProgress);
  
  try {
    const result = await runFullValidation((current, total, partName) => {
      currentProgress = {
        ...currentProgress,
        currentPart: partName,
        currentIndex: current,
        percentComplete: Math.round((current / total) * 100),
      };
      onProgressUpdate?.(currentProgress);
    });
    
    lastResult = result;
    
    currentProgress = {
      phase: 'completed',
      currentPart: '',
      currentIndex: result.report.totalParts,
      totalParts: result.report.totalParts,
      percentComplete: 100,
      validCount: result.report.validParts,
      invalidCount: result.report.invalidParts,
      errors: result.report.corrections.map(c => c.issue),
    };
    
    onProgressUpdate?.(currentProgress);
    
    const duration = Date.now() - startTime;
    
    return {
      totalParts: result.report.totalParts,
      validParts: result.report.validParts,
      invalidParts: result.report.invalidParts,
      correctionsNeeded: result.report.corrections.length,
      averageConfidence: getDatabaseStats().averageConfidence,
      timestamp: result.timestamp,
      duration,
    };
  } catch (error: any) {
    currentProgress = {
      ...currentProgress,
      phase: 'error',
      errors: [error.message],
    };
    onProgressUpdate?.(currentProgress);
    throw error;
  }
}

/**
 * Executa validação para uma marca específica
 */
export async function startBrandValidation(
  brand: string,
  onProgressUpdate?: (progress: ValidationProgress) => void
): Promise<ValidationSummary> {
  const startTime = Date.now();
  
  const brandParts = ALL_REAL_PARTS.filter(part =>
    part.compatibility.some(c => c.brand.toUpperCase() === brand.toUpperCase())
  );
  
  currentProgress = {
    phase: 'validating',
    currentPart: '',
    currentIndex: 0,
    totalParts: brandParts.length,
    percentComplete: 0,
    validCount: 0,
    invalidCount: 0,
    errors: [],
  };
  
  onProgressUpdate?.(currentProgress);
  
  try {
    const result = await runBrandValidation(brand, (current, total, partName) => {
      currentProgress = {
        ...currentProgress,
        currentPart: partName,
        currentIndex: current,
        percentComplete: Math.round((current / total) * 100),
      };
      onProgressUpdate?.(currentProgress);
    });
    
    lastResult = result;
    
    currentProgress = {
      phase: 'completed',
      currentPart: '',
      currentIndex: result.report.totalParts,
      totalParts: result.report.totalParts,
      percentComplete: 100,
      validCount: result.report.validParts,
      invalidCount: result.report.invalidParts,
      errors: result.report.corrections.map(c => c.issue),
    };
    
    onProgressUpdate?.(currentProgress);
    
    const duration = Date.now() - startTime;
    
    return {
      totalParts: result.report.totalParts,
      validParts: result.report.validParts,
      invalidParts: result.report.invalidParts,
      correctionsNeeded: result.report.corrections.length,
      averageConfidence: getDatabaseStats().averageConfidence,
      timestamp: result.timestamp,
      duration,
    };
  } catch (error: any) {
    currentProgress = {
      ...currentProgress,
      phase: 'error',
      errors: [error.message],
    };
    onProgressUpdate?.(currentProgress);
    throw error;
  }
}

/**
 * Gera código com correções sugeridas
 */
export function generateCorrectionsCode(): string {
  if (!lastResult) {
    return '// Nenhuma validação executada ainda';
  }
  return generateCorrectedCode(lastResult.correctedParts);
}

// ============================================================================
// QUICK STATS
// ============================================================================

/**
 * Retorna estatísticas rápidas do banco de dados
 */
export function getQuickStats() {
  const stats = getDatabaseStats();
  return {
    totalParts: stats.totalParts,
    totalEquivalents: stats.totalEquivalents,
    averageConfidence: stats.averageConfidence,
    brandsCovered: Object.keys(stats.partsByBrand).length,
    categoriesCovered: Object.keys(stats.partsByCategory).length,
    partsByBrand: stats.partsByBrand,
    partsByCategory: stats.partsByCategory,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getValidationProgress,
  getLastValidationResult,
  resetValidationState,
  startFullValidation,
  startBrandValidation,
  generateCorrectionsCode,
  getQuickStats,
};
