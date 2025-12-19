#!/usr/bin/env node
/**
 * PARTS COMPATIBILITY ENGINE - Entry Point
 * Motor de compatibilidade de peças automotivas
 * Cobertura total de 20.000+ veículos brasileiros
 * 
 * @version 3.0.0
 */

import chalk from 'chalk';
import { generateAllCompatibility } from './generateCompatibility.js';
import { validateAllCompatibility } from './validateCompatibility.js';
import { exportToFirebase } from './exportToFirebase.js';
import { exportPartsDatabase, getPartsStats } from './exportPartsDatabase.js';
import { showStats } from './stats.js';

// V2 Engine imports
import { 
  generateCompatibility as generateCompatibilityV2,
  findPartByNumber,
  findEquivalents,
  searchParts,
  getDatabaseStats as getV2Stats
} from './engine/compatibilityEngineV2.js';

const BANNER = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   🔧 PARTS COMPATIBILITY ENGINE v3.0.0                          ║
║   Motor de Compatibilidade de Peças Automotivas                 ║
║                                                                  ║
║   Cobertura: 20.000+ veículos brasileiros                       ║
║   - 15.669 carros                                               ║
║   - 1.669 motos                                                 ║
║   - 452 caminhões                                               ║
║   - 206 ônibus                                                  ║
║   - 332 vans                                                    ║
║   - 1.349 SUVs                                                  ║
║   - 403 pickups                                                 ║
║                                                                  ║
║   🆕 V2 Engine: 500+ PartNumbers com OEM e equivalentes         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;

async function main() {
  console.log(chalk.cyan(BANNER));
  
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  switch (command) {
    case 'generate':
      await runGenerate(args);
      break;
      
    case 'validate':
      await runValidate(args);
      break;
      
    case 'export':
      await runExport(args);
      break;
      
    case 'export-parts':
      await runExportParts(args);
      break;
      
    case 'parts-stats':
      showPartsStats();
      break;
      
    case 'stats':
      await showStats();
      break;
      
    case 'full':
      await runFullPipeline(args);
      break;
    
    // V2 Commands
    case 'v2-stats':
      showV2Stats();
      break;
      
    case 'v2-search':
      await runV2Search(args);
      break;
      
    case 'v2-lookup':
      await runV2Lookup(args);
      break;
      
    case 'v2-equivalents':
      await runV2Equivalents(args);
      break;
      
    case 'v2-compatibility':
      await runV2Compatibility(args);
      break;
      
    case 'help':
    default:
      showHelp();
      break;
  }
}

async function runGenerate(args) {
  console.log(chalk.yellow('\n🔄 Iniciando geração de compatibilidade...\n'));
  
  const typeArg = args.find(a => a.startsWith('--type='));
  const vehicleType = typeArg ? typeArg.split('=')[1] : null;
  
  const batchArg = args.find(a => a.startsWith('--batch='));
  const batchSize = batchArg ? parseInt(batchArg.split('=')[1]) : 100;
  
  await generateAllCompatibility({
    vehicleType,
    batchSize,
    saveProgress: true,
  });
}

async function runValidate(args) {
  console.log(chalk.yellow('\n✅ Iniciando validação de compatibilidade...\n'));
  
  const strictArg = args.includes('--strict');
  
  await validateAllCompatibility({
    strict: strictArg,
    minConfidence: 0.65,
  });
}

async function runExport(args) {
  console.log(chalk.yellow('\n📤 Iniciando exportação para Firebase...\n'));
  
  const dryRunArg = args.includes('--dry-run');
  
  await exportToFirebase({
    dryRun: dryRunArg,
    batchSize: 500,
  });
}

async function runExportParts(args) {
  console.log(chalk.yellow('\n📦 Iniciando exportação da base de peças...\n'));
  
  const dryRunArg = args.includes('--dry-run');
  
  await exportPartsDatabase({
    dryRun: dryRunArg,
    batchSize: 500,
  });
}

function showPartsStats() {
  const stats = getPartsStats();
  
  console.log(chalk.cyan('\n📊 ESTATÍSTICAS DA BASE DE PEÇAS\n'));
  console.log(chalk.gray('═'.repeat(50)));
  
  console.log(chalk.yellow(`\n📦 Total de peças: ${chalk.white(stats.totalParts)}`));
  console.log(chalk.yellow(`🚗 Total de aplicações: ${chalk.white(stats.totalApplications)}`));
  console.log(chalk.yellow(`🏭 Marcas: ${chalk.white(stats.totalBrands)}`));
  
  console.log(chalk.cyan('\n📂 Por categoria:\n'));
  for (const [cat, count] of Object.entries(stats.categories).sort((a, b) => b[1] - a[1])) {
    const bar = '█'.repeat(Math.min(count, 30));
    console.log(chalk.gray(`   ${cat.padEnd(25)} ${chalk.green(bar)} ${count}`));
  }
  
  console.log(chalk.cyan('\n🏭 Marcas disponíveis:\n'));
  console.log(chalk.gray('   ' + stats.brands.join(', ')));
  console.log();
}

// ============ V2 ENGINE FUNCTIONS ============

function showV2Stats() {
  const stats = getV2Stats();
  
  console.log(chalk.cyan('\n📊 ESTATÍSTICAS DO ENGINE V2\n'));
  console.log(chalk.gray('═'.repeat(50)));
  
  console.log(chalk.yellow(`\n📦 Total de peças: ${chalk.white(stats.totalParts)}`));
  console.log(chalk.yellow(`🏭 Marcas: ${chalk.white(stats.totalBrands)}`));
  console.log(chalk.yellow(`📂 Categorias: ${chalk.white(stats.totalCategories)}`));
  
  console.log(chalk.cyan('\n📂 Por categoria:\n'));
  for (const [cat, count] of Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])) {
    const bar = '█'.repeat(Math.min(count, 30));
    console.log(chalk.gray(`   ${cat.padEnd(25)} ${chalk.green(bar)} ${count}`));
  }
  
  console.log(chalk.cyan('\n🏭 Marcas disponíveis:\n'));
  console.log(chalk.gray('   ' + stats.brands.join(', ')));
  console.log();
}

async function runV2Search(args) {
  const queryArg = args.find(a => a.startsWith('--query='));
  if (!queryArg) {
    console.log(chalk.red('❌ Use: v2-search --query="filtro de óleo"'));
    return;
  }
  
  const query = queryArg.split('=')[1].replace(/"/g, '');
  console.log(chalk.yellow(`\n🔍 Buscando: "${query}"\n`));
  
  const results = searchParts(query, { limit: 20 });
  
  if (results.length === 0) {
    console.log(chalk.gray('Nenhum resultado encontrado.'));
    return;
  }
  
  console.log(chalk.green(`✅ ${results.length} resultados:\n`));
  results.forEach((part, i) => {
    console.log(chalk.cyan(`${i + 1}. ${part.partNumber}`));
    console.log(chalk.gray(`   ${part.name} - ${part.brand}`));
    console.log(chalk.gray(`   Categoria: ${part.category}`));
    if (part.oemNumbers?.length) {
      console.log(chalk.gray(`   OEM: ${part.oemNumbers.slice(0, 3).join(', ')}`));
    }
    console.log();
  });
}

async function runV2Lookup(args) {
  const partNumber = args[1];
  if (!partNumber) {
    console.log(chalk.red('❌ Use: v2-lookup OC500'));
    return;
  }
  
  console.log(chalk.yellow(`\n🔍 Buscando peça: ${partNumber}\n`));
  
  const part = findPartByNumber(partNumber);
  
  if (!part) {
    console.log(chalk.gray('Peça não encontrada.'));
    return;
  }
  
  console.log(chalk.green('✅ Peça encontrada:\n'));
  console.log(chalk.cyan(`   Part Number: ${part.partNumber}`));
  console.log(chalk.white(`   Nome: ${part.name}`));
  console.log(chalk.white(`   Marca: ${part.brand}`));
  console.log(chalk.white(`   Categoria: ${part.category}`));
  if (part.oemNumbers?.length) {
    console.log(chalk.white(`   OEM Numbers: ${part.oemNumbers.join(', ')}`));
  }
  if (part.equivalents?.length) {
    console.log(chalk.white(`   Equivalentes: ${part.equivalents.join(', ')}`));
  }
  if (part.specs) {
    console.log(chalk.white(`   Specs: ${JSON.stringify(part.specs)}`));
  }
  console.log();
}

async function runV2Equivalents(args) {
  const partNumber = args[1];
  if (!partNumber) {
    console.log(chalk.red('❌ Use: v2-equivalents OC500'));
    return;
  }
  
  console.log(chalk.yellow(`\n🔄 Buscando equivalentes para: ${partNumber}\n`));
  
  const equivalents = findEquivalents(partNumber);
  
  if (equivalents.length === 0) {
    console.log(chalk.gray('Nenhum equivalente encontrado.'));
    return;
  }
  
  console.log(chalk.green(`✅ ${equivalents.length} equivalentes:\n`));
  equivalents.forEach((part, i) => {
    console.log(chalk.cyan(`${i + 1}. ${part.partNumber} (${part.brand})`));
    console.log(chalk.gray(`   ${part.name}`));
  });
  console.log();
}

async function runV2Compatibility(args) {
  const brandArg = args.find(a => a.startsWith('--brand='));
  const modelArg = args.find(a => a.startsWith('--model='));
  const yearArg = args.find(a => a.startsWith('--year='));
  const categoryArg = args.find(a => a.startsWith('--category='));
  
  if (!brandArg || !modelArg) {
    console.log(chalk.red('❌ Use: v2-compatibility --brand=VW --model=Gol --year=2020 --category=filtro_oleo'));
    return;
  }
  
  const vehicle = {
    brand: brandArg.split('=')[1],
    model: modelArg.split('=')[1],
    year: yearArg ? parseInt(yearArg.split('=')[1]) : new Date().getFullYear()
  };
  
  const category = categoryArg ? categoryArg.split('=')[1] : null;
  
  console.log(chalk.yellow(`\n🚗 Buscando peças para: ${vehicle.brand} ${vehicle.model} ${vehicle.year}\n`));
  
  const result = generateCompatibilityV2(vehicle, category);
  
  console.log(chalk.green(`✅ ${result.parts.length} peças compatíveis (confiança: ${(result.confidence * 100).toFixed(0)}%):\n`));
  
  result.parts.slice(0, 15).forEach((part, i) => {
    console.log(chalk.cyan(`${i + 1}. ${part.partNumber} (${part.brand})`));
    console.log(chalk.gray(`   ${part.name} - ${part.category}`));
    console.log(chalk.gray(`   Match: ${part.matchType} | Score: ${(part.score * 100).toFixed(0)}%`));
  });
  
  if (result.parts.length > 15) {
    console.log(chalk.gray(`\n   ... e mais ${result.parts.length - 15} peças`));
  }
  console.log();
}

// ============ V1 ENGINE FUNCTIONS ============

async function runFullPipeline(args) {
  console.log(chalk.green('\n🚀 EXECUTANDO PIPELINE COMPLETO\n'));
  console.log(chalk.gray('Este processo pode levar várias horas...\n'));
  
  const startTime = Date.now();
  
  // 1. Gerar compatibilidade
  console.log(chalk.cyan('\n═══ ETAPA 1/3: GERAÇÃO ═══\n'));
  await runGenerate(args);
  
  // 2. Validar
  console.log(chalk.cyan('\n═══ ETAPA 2/3: VALIDAÇÃO ═══\n'));
  await runValidate(args);
  
  // 3. Exportar
  console.log(chalk.cyan('\n═══ ETAPA 3/3: EXPORTAÇÃO ═══\n'));
  await runExport(args);
  
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
  console.log(chalk.green(`\n✅ Pipeline completo em ${elapsed} minutos!\n`));
}

function showHelp() {
  console.log(`
${chalk.bold('Comandos disponíveis:')}

${chalk.bold.green('═══ V1 ENGINE (Legacy) ═══')}

  ${chalk.cyan('generate')}       Gera compatibilidade de peças para todos os veículos
                   --type=car|motorcycle|truck|bus|van|suv|pickup
                   --batch=100 (tamanho do lote)

  ${chalk.cyan('validate')}       Valida a compatibilidade gerada
                   --strict (modo estrito, rejeita confiança < 0.8)

  ${chalk.cyan('export')}         Exporta índices de compatibilidade para Firebase
                   --dry-run (simula sem gravar)

  ${chalk.cyan('export-parts')}   Exporta base de peças para Firebase
                   --dry-run (simula sem gravar)

  ${chalk.cyan('parts-stats')}    Mostra estatísticas da base de peças V1

  ${chalk.cyan('stats')}          Mostra estatísticas gerais do sistema

  ${chalk.cyan('full')}           Executa pipeline completo (generate + validate + export)

${chalk.bold.green('═══ V2 ENGINE (500+ PartNumbers) ═══')}

  ${chalk.cyan('v2-stats')}       Mostra estatísticas do engine V2

  ${chalk.cyan('v2-search')}      Busca peças por texto
                   --query="filtro de óleo"

  ${chalk.cyan('v2-lookup')}      Busca peça por part number
                   v2-lookup OC500

  ${chalk.cyan('v2-equivalents')} Encontra peças equivalentes
                   v2-equivalents OC500

  ${chalk.cyan('v2-compatibility')} Gera compatibilidade para veículo
                   --brand=VW --model=Gol --year=2020 --category=filtro_oleo

${chalk.bold('Exemplos V1:')}

  node src/index.js generate --type=motorcycle
  node src/index.js validate --strict
  node src/index.js export --dry-run

${chalk.bold('Exemplos V2:')}

  node src/index.js v2-stats
  node src/index.js v2-search --query="filtro óleo gol"
  node src/index.js v2-lookup OC500
  node src/index.js v2-equivalents OC500
  node src/index.js v2-compatibility --brand=VW --model=Gol --year=2020
  `);
}

main().catch(err => {
  console.error(chalk.red('\n❌ Erro fatal:'), err.message);
  process.exit(1);
});
