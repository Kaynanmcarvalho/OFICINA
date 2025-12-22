/**
 * TORQ Automotive - Script de Validação Massiva
 * 
 * Este script executa a validação completa de todas as peças
 * para todos os 20.000+ veículos usando Google Scraper.
 * 
 * ATENÇÃO: Este processo pode levar MUITAS HORAS!
 * 
 * Uso:
 *   npx ts-node scripts/run-massive-validation.ts [opções]
 * 
 * Opções:
 *   --brand=<marca>     Validar apenas uma marca específica
 *   --skip-existing     Pular validação de peças existentes
 *   --skip-generation   Pular geração de novas peças
 *   --max-vehicles=<n>  Limitar número de veículos por marca
 * 
 * Exemplos:
 *   npx ts-node scripts/run-massive-validation.ts --brand=Hyundai
 *   npx ts-node scripts/run-massive-validation.ts --brand=Fiat --max-vehicles=10
 *   npx ts-node scripts/run-massive-validation.ts --skip-generation
 */

import { 
  runFullOrchestration, 
  runBrandOrchestration,
  getCoverageStats,
  analyzeCoverage,
  type OrchestratorProgress 
} from '../src/services/automotive-backend/services/fullPartsValidationOrchestrator';

// Parse command line arguments
const args = process.argv.slice(2);
const options: {
  brand?: string;
  skipExisting?: boolean;
  skipGeneration?: boolean;
  maxVehicles?: number;
} = {};

for (const arg of args) {
  if (arg.startsWith('--brand=')) {
    options.brand = arg.split('=')[1];
  } else if (arg === '--skip-existing') {
    options.skipExisting = true;
  } else if (arg === '--skip-generation') {
    options.skipGeneration = true;
  } else if (arg.startsWith('--max-vehicles=')) {
    options.maxVehicles = parseInt(arg.split('=')[1], 10);
  }
}

// Progress callback
function onProgress(progress: OrchestratorProgress): void {
  const statusEmoji = {
    'analyzing': '🔍',
    'validating-existing': '✅',
    'generating-new': '🔧',
    'saving': '💾',
    'completed': '🎉',
    'error': '❌',
  }[progress.phase];
  
  console.clear();
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('           TORQ Automotive - Validação Massiva de Peças         ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log();
  console.log(`${statusEmoji} Fase: ${progress.phase}`);
  console.log(`📍 Marca atual: ${progress.currentBrand || '-'}`);
  console.log(`🚗 Modelo atual: ${progress.currentModel || '-'}`);
  console.log();
  console.log('───────────────────────────────────────────────────────────────');
  console.log('                         PROGRESSO                              ');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`📊 Progresso: ${progress.percentComplete}%`);
  console.log(`⏱️  Tempo restante: ${progress.estimatedTimeRemaining}`);
  console.log();
  console.log(`🏭 Marcas processadas: ${progress.brandsProcessed}/${progress.totalBrands}`);
  console.log(`🚙 Veículos com cobertura: ${progress.vehiclesWithCoverage}`);
  console.log(`🚗 Veículos sem cobertura: ${progress.vehiclesWithoutCoverage}`);
  console.log();
  console.log('───────────────────────────────────────────────────────────────');
  console.log('                          PEÇAS                                 ');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`✅ Peças validadas: ${progress.partsValidated}`);
  console.log(`🔧 Peças geradas: ${progress.partsGenerated}`);
  console.log(`❌ Peças inválidas: ${progress.partsInvalid}`);
  console.log();
  
  if (progress.errors.length > 0) {
    console.log('───────────────────────────────────────────────────────────────');
    console.log('                          ERROS                                ');
    console.log('───────────────────────────────────────────────────────────────');
    for (const error of progress.errors.slice(-5)) {
      console.log(`⚠️  ${error}`);
    }
    console.log();
  }
  
  // Progress bar
  const barWidth = 50;
  const filled = Math.round((progress.percentComplete / 100) * barWidth);
  const empty = barWidth - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  console.log(`[${bar}] ${progress.percentComplete}%`);
  console.log();
}

// Main execution
async function main(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('           TORQ Automotive - Validação Massiva de Peças         ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log();
  
  // Show current coverage stats
  const stats = getCoverageStats();
  console.log('📊 Estatísticas atuais:');
  console.log(`   Total de veículos: ${stats.totalVehicles.toLocaleString()}`);
  console.log(`   Total de peças: ${stats.totalParts}`);
  console.log(`   Marcas com cobertura: ${stats.brandsWithCoverage}`);
  console.log(`   Marcas sem cobertura: ${stats.brandsWithoutCoverage}`);
  console.log(`   Cobertura: ${stats.coveragePercentage}%`);
  console.log();
  
  // Show coverage analysis
  const coverage = analyzeCoverage();
  console.log('📋 Marcas com cobertura de peças:');
  for (const brand of coverage.brandsWithCoverage) {
    const info = coverage.coverageByBrand.get(brand);
    console.log(`   ✅ ${brand}: ${info?.vehicles} veículos, ${info?.partsAvailable} peças`);
  }
  console.log();
  
  console.log('📋 Marcas SEM cobertura de peças:');
  for (const brand of coverage.brandsWithoutCoverage.slice(0, 10)) {
    const info = coverage.coverageByBrand.get(brand);
    console.log(`   ❌ ${brand}: ${info?.vehicles} veículos`);
  }
  if (coverage.brandsWithoutCoverage.length > 10) {
    console.log(`   ... e mais ${coverage.brandsWithoutCoverage.length - 10} marcas`);
  }
  console.log();
  
  // Show options
  console.log('⚙️  Opções:');
  console.log(`   Marca: ${options.brand || 'Todas'}`);
  console.log(`   Pular validação existente: ${options.skipExisting ? 'Sim' : 'Não'}`);
  console.log(`   Pular geração: ${options.skipGeneration ? 'Sim' : 'Não'}`);
  console.log(`   Máx. veículos por marca: ${options.maxVehicles || 'Sem limite'}`);
  console.log();
  
  console.log('⚠️  ATENÇÃO: Este processo pode levar MUITAS HORAS!');
  console.log('   Pressione Ctrl+C para cancelar a qualquer momento.');
  console.log();
  console.log('Iniciando em 5 segundos...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    const result = await runFullOrchestration(onProgress, {
      brandFilter: options.brand,
      skipExistingValidation: options.skipExisting,
      skipGeneration: options.skipGeneration,
      maxVehiclesPerBrand: options.maxVehicles,
    });
    
    console.log();
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                      RESULTADO FINAL                           ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log();
    console.log(`✅ Sucesso: ${result.success ? 'Sim' : 'Não'}`);
    console.log(`⏱️  Duração: ${(result.duration / 1000 / 60).toFixed(1)} minutos`);
    console.log();
    console.log('📊 Resumo:');
    console.log(`   Total de veículos: ${result.summary.totalVehicles.toLocaleString()}`);
    console.log(`   Veículos com peças existentes: ${result.summary.vehiclesWithExistingParts}`);
    console.log(`   Veículos com peças geradas: ${result.summary.vehiclesWithGeneratedParts}`);
    console.log(`   Veículos sem peças: ${result.summary.vehiclesWithNoParts}`);
    console.log();
    console.log('🔧 Peças:');
    console.log(`   Peças validadas: ${result.summary.totalPartsValidated}`);
    console.log(`   Peças geradas: ${result.summary.totalPartsGenerated}`);
    console.log(`   Peças inválidas: ${result.summary.totalPartsInvalid}`);
    console.log();
    
    if (result.errors.length > 0) {
      console.log('⚠️  Erros:');
      for (const error of result.errors) {
        console.log(`   - ${error}`);
      }
    }
    
    console.log();
    console.log('═══════════════════════════════════════════════════════════════');
    
  } catch (error: any) {
    console.error();
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  }
}

// Run
main().catch(console.error);
