/**
 * TORQ Automotive - Parts Validation Runner
 * 
 * Executa validação completa de todas as peças do banco de dados
 * usando scraping do Google para verificar compatibilidade
 * 
 * @version 2.0.0 - Usando Google Scraper
 */

import {
  validatePartWithScraper,
  validatePartsBatch,
  type PartValidationRequest,
  type ScraperValidationResult,
  type BulkValidationProgress,
} from './googleScraperValidation';
import { ALL_REAL_PARTS, type RealPart } from '../data/realPartsDatabase';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ValidationRunResult {
  report: BulkValidationReport;
  correctedParts: CorrectedPart[];
  timestamp: string;
}

export interface BulkValidationReport {
  totalParts: number;
  validParts: number;
  invalidParts: number;
  corrections: {
    partId: string;
    partName: string;
    issue: string;
    correction: string;
  }[];
  timestamp: string;
}

export interface CorrectedPart {
  originalPart: RealPart;
  corrections: {
    field: 'oemCode' | 'equivalent';
    brand?: string;
    oldValue: string;
    newValue: string;
    reason: string;
  }[];
}

// ============================================================================
// CONVERT PARTS TO VALIDATION REQUESTS
// ============================================================================

function convertToValidationRequests(parts: RealPart[]): PartValidationRequest[] {
  const requests: PartValidationRequest[] = [];

  for (const part of parts) {
    // Get the first compatibility entry for vehicle info
    const firstCompat = part.compatibility[0];
    if (!firstCompat) continue;

    requests.push({
      vehicleBrand: firstCompat.brand,
      vehicleModel: firstCompat.model,
      vehicleYear: Math.floor((firstCompat.yearStart + firstCompat.yearEnd) / 2),
      vehicleEngine: firstCompat.engineCode,
      partName: part.name,
      oemCode: part.oemCode,
      equivalents: part.equivalents.map((eq) => ({
        brand: eq.brand,
        code: eq.code,
      })),
    });
  }

  return requests;
}

// ============================================================================
// APPLY CORRECTIONS TO PARTS
// ============================================================================

function applyCorrections(
  parts: RealPart[],
  validationResults: Map<string, ScraperValidationResult>
): CorrectedPart[] {
  const correctedParts: CorrectedPart[] = [];

  for (const part of parts) {
    const firstCompat = part.compatibility[0];
    if (!firstCompat) continue;

    const key = `${firstCompat.brand}_${firstCompat.model}_${part.name}`;
    const result = validationResults.get(key);

    if (!result || result.isValid) continue;

    const corrections: CorrectedPart['corrections'] = [];

    // Check OEM code
    if (!result.oemCodeValid) {
      const oemCorrection = result.suggestedCorrections.find(
        (c) => c.brand === 'OEM'
      );
      if (oemCorrection) {
        corrections.push({
          field: 'oemCode',
          oldValue: part.oemCode,
          newValue: oemCorrection.correctCode,
          reason: `Fonte: ${oemCorrection.source}`,
        });
      }
    }

    // Check equivalents
    for (const invalid of result.invalidEquivalents) {
      const correction = result.suggestedCorrections.find(
        (c) => c.brand === invalid.brand
      );
      corrections.push({
        field: 'equivalent',
        brand: invalid.brand,
        oldValue: invalid.code,
        newValue: correction?.correctCode || 'REMOVER',
        reason: invalid.reason,
      });
    }

    if (corrections.length > 0) {
      correctedParts.push({
        originalPart: part,
        corrections,
      });
    }
  }

  return correctedParts;
}

// ============================================================================
// GENERATE REPORT
// ============================================================================

function generateReport(
  results: Map<string, ScraperValidationResult>
): BulkValidationReport {
  const corrections: BulkValidationReport['corrections'] = [];
  let validParts = 0;
  let invalidParts = 0;

  results.forEach((result, key) => {
    if (result.isValid) {
      validParts++;
    } else {
      invalidParts++;

      // Add OEM correction
      if (!result.oemCodeValid) {
        const oemCorrection = result.suggestedCorrections.find(
          (c) => c.brand === 'OEM'
        );
        if (oemCorrection) {
          corrections.push({
            partId: key,
            partName: key.split('_').pop() || key,
            issue: 'Código OEM não encontrado em fontes confiáveis',
            correction: oemCorrection.correctCode,
          });
        }
      }

      // Add equivalent corrections
      for (const invalid of result.invalidEquivalents) {
        const correction = result.suggestedCorrections.find(
          (c) => c.brand === invalid.brand
        );
        corrections.push({
          partId: key,
          partName: key.split('_').pop() || key,
          issue: `${invalid.brand} ${invalid.code}: ${invalid.reason}`,
          correction: correction?.correctCode || 'Remover este equivalente',
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
// MAIN VALIDATION RUNNER
// ============================================================================

/**
 * Executa validação completa de todas as peças via Google Scraper
 */
export async function runFullValidation(
  onProgress?: (current: number, total: number, partName: string) => void
): Promise<ValidationRunResult> {
  console.log('[ValidationRunner] 🚀 Iniciando validação via Google Scraper...');
  console.log(`[ValidationRunner] Total de peças: ${ALL_REAL_PARTS.length}`);

  // Convert parts to validation requests
  const requests = convertToValidationRequests(ALL_REAL_PARTS);
  console.log(`[ValidationRunner] Requests gerados: ${requests.length}`);

  // Run validation with scraper
  const validationResults = await validatePartsBatch(
    requests,
    (progress: BulkValidationProgress) => {
      onProgress?.(progress.current, progress.total, progress.partName);
    }
  );

  // Generate report
  const report = generateReport(validationResults);

  // Apply corrections
  const correctedParts = applyCorrections(ALL_REAL_PARTS, validationResults);

  console.log('[ValidationRunner] ✅ Validação concluída!');
  console.log(
    `[ValidationRunner] Peças válidas: ${report.validParts}/${report.totalParts}`
  );
  console.log(
    `[ValidationRunner] Correções necessárias: ${report.corrections.length}`
  );

  return {
    report,
    correctedParts,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Valida apenas peças de uma marca específica
 */
export async function runBrandValidation(
  brand: string,
  onProgress?: (current: number, total: number, partName: string) => void
): Promise<ValidationRunResult> {
  console.log(`[ValidationRunner] 🚀 Validando peças para: ${brand}`);

  // Filter parts by brand
  const brandParts = ALL_REAL_PARTS.filter((part) =>
    part.compatibility.some(
      (c) => c.brand.toUpperCase() === brand.toUpperCase()
    )
  );

  console.log(`[ValidationRunner] Peças encontradas: ${brandParts.length}`);

  // Convert to requests
  const requests = convertToValidationRequests(brandParts);

  // Run validation
  const validationResults = await validatePartsBatch(
    requests,
    (progress: BulkValidationProgress) => {
      onProgress?.(progress.current, progress.total, progress.partName);
    }
  );

  // Generate report
  const report = generateReport(validationResults);

  // Apply corrections
  const correctedParts = applyCorrections(brandParts, validationResults);

  return {
    report,
    correctedParts,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Valida uma única peça
 */
export async function validateSinglePart(
  part: RealPart
): Promise<ScraperValidationResult> {
  const firstCompat = part.compatibility[0];
  if (!firstCompat) {
    throw new Error('Part has no compatibility info');
  }

  const request: PartValidationRequest = {
    vehicleBrand: firstCompat.brand,
    vehicleModel: firstCompat.model,
    vehicleYear: Math.floor((firstCompat.yearStart + firstCompat.yearEnd) / 2),
    vehicleEngine: firstCompat.engineCode,
    partName: part.name,
    oemCode: part.oemCode,
    equivalents: part.equivalents.map((eq) => ({
      brand: eq.brand,
      code: eq.code,
    })),
  };

  return validatePartWithScraper(request);
}

/**
 * Gera código TypeScript com as correções aplicadas
 */
export function generateCorrectedCode(correctedParts: CorrectedPart[]): string {
  let code = '// CORREÇÕES SUGERIDAS PELO GOOGLE SCRAPER\n';
  code += '// Gerado em: ' + new Date().toISOString() + '\n\n';

  for (const cp of correctedParts) {
    code += `// ${cp.originalPart.name} (${cp.originalPart.id})\n`;

    for (const correction of cp.corrections) {
      if (correction.field === 'oemCode') {
        code += `// OEM: ${correction.oldValue} -> ${correction.newValue}\n`;
        code += `// Motivo: ${correction.reason}\n`;
      } else {
        code += `// ${correction.brand}: ${correction.oldValue} -> ${correction.newValue}\n`;
        code += `// Motivo: ${correction.reason}\n`;
      }
    }

    code += '\n';
  }

  return code;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  runFullValidation,
  runBrandValidation,
  validateSinglePart,
  generateCorrectedCode,
};
