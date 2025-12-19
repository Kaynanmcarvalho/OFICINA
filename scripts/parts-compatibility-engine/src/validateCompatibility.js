/**
 * VALIDADOR DE COMPATIBILIDADE DE PEÇAS
 * Valida resultados gerados antes de exportar para Firebase
 * 
 * Regras de validação:
 * 1. Confiança mínima de 0.65
 * 2. Evidências presentes para cada peça
 * 3. Sem resultados vazios
 * 4. Consistência de dados
 * 
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { PARTS_CHECKLIST } from './config/partsChecklist.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESULTS_DIR = path.join(__dirname, '../output/results');
const VALIDATION_REPORT = path.join(__dirname, '../output/validation-report.json');

/**
 * Valida um resultado de compatibilidade
 */
function validateResult(result, options = {}) {
  const { strict = false, minConfidence = 0.65 } = options;
  
  const issues = [];
  const warnings = [];
  
  // 1. Verifica campos obrigatórios
  if (!result.vehicleId) {
    issues.push({ type: 'missing_field', field: 'vehicleId', severity: 'critical' });
  }
  
  if (!result.vehicleName) {
    issues.push({ type: 'missing_field', field: 'vehicleName', severity: 'critical' });
  }
  
  if (!result.vehicleType) {
    issues.push({ type: 'missing_field', field: 'vehicleType', severity: 'critical' });
  }
  
  // 2. Verifica se tem peças compatíveis OU peças faltantes (nunca vazio)
  if ((!result.compatibleParts || result.compatibleParts.length === 0) && 
      (!result.missingParts || result.missingParts.length === 0)) {
    issues.push({ 
      type: 'empty_result', 
      message: 'Resultado vazio - sem peças compatíveis nem faltantes',
      severity: 'critical' 
    });
  }
  
  // 3. Valida cada peça compatível
  if (result.compatibleParts) {
    for (const part of result.compatibleParts) {
      // Confiança mínima
      if (part.confidence < minConfidence) {
        if (strict) {
          issues.push({
            type: 'low_confidence',
            partNumber: part.partNumber,
            confidence: part.confidence,
            minRequired: minConfidence,
            severity: 'error'
          });
        } else {
          warnings.push({
            type: 'low_confidence',
            partNumber: part.partNumber,
            confidence: part.confidence,
            minRequired: minConfidence,
          });
        }
      }
      
      // Evidências presentes
      if (!part.evidence || part.evidence.length === 0) {
        issues.push({
          type: 'missing_evidence',
          partNumber: part.partNumber,
          severity: 'error'
        });
      }
      
      // Part number presente
      if (!part.partNumber) {
        warnings.push({
          type: 'missing_part_number',
          partTypeName: part.partTypeName,
        });
      }
      
      // Marca presente
      if (!part.brand) {
        warnings.push({
          type: 'missing_brand',
          partNumber: part.partNumber,
        });
      }
    }
  }
  
  // 4. Valida peças faltantes
  if (result.missingParts) {
    for (const missing of result.missingParts) {
      // Deve ter razão
      if (!missing.reason) {
        warnings.push({
          type: 'missing_reason',
          partTypeId: missing.partTypeId,
        });
      }
      
      // Peças críticas faltantes são issues
      if (missing.priority === 'critical') {
        warnings.push({
          type: 'critical_part_missing',
          partTypeId: missing.partTypeId,
          partTypeName: missing.partTypeName,
        });
      }
    }
  }
  
  // 5. Valida cobertura
  if (result.coverage < 0.5) {
    warnings.push({
      type: 'low_coverage',
      coverage: result.coverage,
      message: 'Menos de 50% das peças obrigatórias encontradas'
    });
  }
  
  // 6. Valida confiança geral
  if (result.confidence < minConfidence) {
    warnings.push({
      type: 'low_overall_confidence',
      confidence: result.confidence,
      minRequired: minConfidence,
    });
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings,
    stats: {
      compatibleParts: result.compatibleParts?.length || 0,
      missingParts: result.missingParts?.length || 0,
      sharedParts: result.sharedParts?.length || 0,
      coverage: result.coverage,
      confidence: result.confidence,
    }
  };
}

/**
 * Valida todos os resultados gerados
 */
export async function validateAllCompatibility(options = {}) {
  const { strict = false, minConfidence = 0.65 } = options;
  
  console.log(chalk.cyan('\n🔍 Iniciando validação de compatibilidade...\n'));
  console.log(chalk.gray(`   Modo: ${strict ? 'ESTRITO' : 'Normal'}`));
  console.log(chalk.gray(`   Confiança mínima: ${minConfidence}\n`));
  
  // Verifica se diretório existe
  if (!fs.existsSync(RESULTS_DIR)) {
    console.log(chalk.red('❌ Diretório de resultados não encontrado!'));
    console.log(chalk.gray(`   Execute primeiro: node src/index.js generate`));
    return null;
  }
  
  // Lista arquivos de resultado
  const files = fs.readdirSync(RESULTS_DIR).filter(f => f.endsWith('.json'));
  
  if (files.length === 0) {
    console.log(chalk.red('❌ Nenhum resultado encontrado para validar!'));
    return null;
  }
  
  console.log(chalk.yellow(`📂 ${files.length} resultados para validar\n`));
  
  // Estatísticas
  const stats = {
    total: files.length,
    valid: 0,
    invalid: 0,
    withWarnings: 0,
    totalIssues: 0,
    totalWarnings: 0,
    issuesByType: {},
    warningsByType: {},
    coverageDistribution: {
      full: 0,      // 100%
      high: 0,      // 80-99%
      medium: 0,    // 50-79%
      low: 0,       // <50%
    },
    invalidResults: [],
  };
  
  // Processa cada arquivo
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(RESULTS_DIR, file);
    
    try {
      const result = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const validation = validateResult(result, { strict, minConfidence });
      
      if (validation.valid) {
        stats.valid++;
      } else {
        stats.invalid++;
        stats.invalidResults.push({
          vehicleId: result.vehicleId,
          vehicleName: result.vehicleName,
          issues: validation.issues,
        });
      }
      
      if (validation.warnings.length > 0) {
        stats.withWarnings++;
      }
      
      stats.totalIssues += validation.issues.length;
      stats.totalWarnings += validation.warnings.length;
      
      // Conta issues por tipo
      for (const issue of validation.issues) {
        stats.issuesByType[issue.type] = (stats.issuesByType[issue.type] || 0) + 1;
      }
      
      // Conta warnings por tipo
      for (const warning of validation.warnings) {
        stats.warningsByType[warning.type] = (stats.warningsByType[warning.type] || 0) + 1;
      }
      
      // Distribuição de cobertura
      const coverage = validation.stats.coverage;
      if (coverage >= 1) stats.coverageDistribution.full++;
      else if (coverage >= 0.8) stats.coverageDistribution.high++;
      else if (coverage >= 0.5) stats.coverageDistribution.medium++;
      else stats.coverageDistribution.low++;
      
    } catch (error) {
      stats.invalid++;
      stats.invalidResults.push({
        file,
        error: error.message,
      });
    }
    
    // Progresso
    if ((i + 1) % 1000 === 0 || i === files.length - 1) {
      const percent = (((i + 1) / files.length) * 100).toFixed(1);
      process.stdout.write(`\r   Validando... ${percent}% (${i + 1}/${files.length})`);
    }
  }
  
  console.log('\n');
  
  // Salva relatório
  const report = {
    timestamp: new Date().toISOString(),
    options: { strict, minConfidence },
    stats,
  };
  
  fs.writeFileSync(VALIDATION_REPORT, JSON.stringify(report, null, 2));
  
  // Exibe resumo
  console.log(chalk.green('═'.repeat(60)));
  console.log(chalk.green('📋 RELATÓRIO DE VALIDAÇÃO'));
  console.log(chalk.green('═'.repeat(60)));
  
  console.log(chalk.cyan('\n📊 Resumo:'));
  console.log(chalk.gray(`   Total validados: ${stats.total}`));
  console.log(chalk.green(`   ✓ Válidos: ${stats.valid} (${((stats.valid / stats.total) * 100).toFixed(1)}%)`));
  console.log(chalk.red(`   ✗ Inválidos: ${stats.invalid} (${((stats.invalid / stats.total) * 100).toFixed(1)}%)`));
  console.log(chalk.yellow(`   ⚠ Com warnings: ${stats.withWarnings}`));
  
  console.log(chalk.cyan('\n📈 Distribuição de Cobertura:'));
  console.log(chalk.green(`   100%: ${stats.coverageDistribution.full} veículos`));
  console.log(chalk.blue(`   80-99%: ${stats.coverageDistribution.high} veículos`));
  console.log(chalk.yellow(`   50-79%: ${stats.coverageDistribution.medium} veículos`));
  console.log(chalk.red(`   <50%: ${stats.coverageDistribution.low} veículos`));
  
  if (Object.keys(stats.issuesByType).length > 0) {
    console.log(chalk.cyan('\n❌ Issues por Tipo:'));
    for (const [type, count] of Object.entries(stats.issuesByType)) {
      console.log(chalk.red(`   ${type}: ${count}`));
    }
  }
  
  if (Object.keys(stats.warningsByType).length > 0) {
    console.log(chalk.cyan('\n⚠️ Warnings por Tipo:'));
    for (const [type, count] of Object.entries(stats.warningsByType)) {
      console.log(chalk.yellow(`   ${type}: ${count}`));
    }
  }
  
  console.log(chalk.gray(`\n📄 Relatório salvo em: ${VALIDATION_REPORT}\n`));
  
  // Retorna se passou na validação
  const passed = stats.invalid === 0 || (!strict && stats.invalid < stats.total * 0.1);
  
  if (passed) {
    console.log(chalk.green('✅ VALIDAÇÃO APROVADA!\n'));
  } else {
    console.log(chalk.red('❌ VALIDAÇÃO REPROVADA!\n'));
    console.log(chalk.gray('   Corrija os issues antes de exportar para Firebase.\n'));
  }
  
  return { passed, stats, report };
}

export default validateAllCompatibility;
