/**
 * TORQ Automotive - AI Validation Service
 * 
 * Serviço de validação de peças usando Google Search Scraper
 * Busca informações em catálogos oficiais e sites especializados
 * 
 * @version 2.0.0 - Usando Google Scraper (sem API key)
 */

// Re-export everything from googleScraperValidation
export {
  validatePartWithScraper as validatePart,
  validatePartsBatch,
  type PartValidationRequest,
  type ScraperValidationResult as PartValidationResult,
  type BulkValidationProgress,
} from './googleScraperValidation';

// Re-export from partsValidationRunner
export {
  runFullValidation,
  runBrandValidation,
  validateSinglePart,
  generateCorrectedCode,
  type ValidationRunResult,
  type BulkValidationReport,
  type CorrectedPart,
} from './partsValidationRunner';

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

import {
  validatePartWithScraper,
  type ScraperValidationResult,
} from './googleScraperValidation';

/**
 * Gera relatório de validação formatado
 */
export function generateValidationReport(
  results: Map<string, ScraperValidationResult>
): {
  totalParts: number;
  validParts: number;
  invalidParts: number;
  corrections: { partId: string; partName: string; issue: string; correction: string }[];
  timestamp: string;
} {
  const corrections: { partId: string; partName: string; issue: string; correction: string }[] = [];
  let validParts = 0;
  let invalidParts = 0;

  results.forEach((result, key) => {
    if (result.isValid) {
      validParts++;
    } else {
      invalidParts++;

      // Add OEM correction
      if (!result.oemCodeValid) {
        corrections.push({
          partId: key,
          partName: key.split('_').pop() || key,
          issue: 'Código OEM não validado',
          correction: 'Verificar código no catálogo oficial',
        });
      }

      // Add equivalent corrections
      for (const invalid of result.invalidEquivalents) {
        corrections.push({
          partId: key,
          partName: key.split('_').pop() || key,
          issue: `${invalid.brand} ${invalid.code}: ${invalid.reason}`,
          correction: 'Verificar código no catálogo do fabricante',
        });
      }
    }
  });

  return {
    totalParts: results.size,
    validParts,
    invalidParts,
    corrections,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  validatePart: validatePartWithScraper,
  generateValidationReport,
};
