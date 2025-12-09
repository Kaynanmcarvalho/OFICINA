#!/usr/bin/env node
/**
 * Full Sync - Sincronização Completa Automatizada
 * 
 * Este script faz TUDO automaticamente:
 * 1. Consulta a API FIPE para obter todos os veículos
 * 2. Compara com a base de dados local
 * 3. Identifica veículos faltantes
 * 4. Adiciona automaticamente ao arquivo principal
 * 
 * Uso:
 *   node src/fullSync.js                    # Sincroniza tudo
 *   node src/fullSync.js --type=cars        # Apenas carros
 *   node src/fullSync.js --type=motos       # Apenas motos
 *   node src/fullSync.js --brand="Honda"    # Apenas uma marca
 *   node src/fullSync.js --dry-run          # Apenas mostra o que seria feito
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { CONFIG } from './config.js';
import fipeApi from './fipeApi.js';
import { parseVehicle } from './vehicleParser.js';
import { loadLocalDatabase, compareWithLocal, groupMissingVehicles, generateStats } from './databaseComparer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do arquivo principal - tenta múltiplos caminhos
function findMainDbPath() {
  const possiblePaths = [
    path.resolve(__dirname, '../../../src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
    path.resolve(__dirname, '../../src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
    path.resolve(process.cwd(), 'src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
    path.resolve(process.cwd(), '../../src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0]; // Fallback
}
const MAIN_DB_PATH = findMainDbPath();

// Parse argumentos
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

const vehicleType = getArg('type')?.toUpperCase() || null;
const targetBrand = getArg('brand') || null;
const dryRun = args.includes('--dry-run');

console.log(chalk.cyan.bold('\n🚀 FULL SYNC - Sincronização Completa Automatizada\n'));
console.log(chalk.gray('Este processo vai:'));
console.log(chalk.gray('  1. Consultar a API FIPE'));
console.log(chalk.gray('  2. Comparar com a base local'));
console.log(chalk.gray('  3. Adicionar veículos faltantes automaticamente\n'));

if (vehicleType) console.log(chalk.yellow(`📋 Tipo: ${vehicleType}`));
if (targetBrand) console.log(chalk.yellow(`📋 Marca: ${targetBrand}`));
if (dryRun) console.log(chalk.yellow(`📋 Modo: Dry Run (sem alterações)`));
console.log('');

/**
 * Gera código para uma variante de veículo
 */
function generateVariantLine(vehicle, startYear, endYear) {
  const parts = [
    `brand: '${vehicle.brand}'`,
    `model: '${vehicle.model}'`,
  ];
  
  if (vehicle.trim) parts.push(`trim: '${vehicle.trim}'`);
  if (vehicle.engineCode) parts.push(`engineCode: '${vehicle.engineCode}'`);
  if (vehicle.engineName) parts.push(`engineName: '${vehicle.engineName}'`);
  if (vehicle.displacementCc) parts.push(`displacementCc: ${vehicle.displacementCc}`);
  parts.push(`fuel: '${vehicle.fuel || 'flex'}'`);
  if (vehicle.transmission) parts.push(`transmission: '${vehicle.transmission}'`);
  parts.push(`bodyType: '${vehicle.bodyType || 'hatch'}'`);
  parts.push(`vehicleType: '${vehicle.vehicleType || 'car'}'`);
  if (vehicle.power) parts.push(`power: '${vehicle.power}'`);
  parts.push(`sources: ['fipe']`);
  
  return `  ...generateYearVariants({ ${parts.join(', ')} }, ${startYear}, ${endYear}),`;
}

/**
 * Agrupa veículos por variante única
 */
function groupVehiclesByVariant(vehicles) {
  const groups = new Map();
  
  for (const v of vehicles) {
    const key = `${v.brand}|${v.model}|${v.trim || ''}|${v.engineName || ''}|${v.fuel || ''}`;
    
    if (!groups.has(key)) {
      groups.set(key, { ...v, years: [] });
    }
    groups.get(key).years.push(v.year);
  }
  
  return Array.from(groups.values());
}

/**
 * Encontra ranges contínuos de anos
 */
function findYearRanges(years) {
  if (!years || years.length === 0) return [];
  const sorted = [...new Set(years)].filter(y => y && !isNaN(y)).sort((a, b) => a - b);
  if (sorted.length === 0) return [];
  
  const ranges = [];
  let start = sorted[0];
  let end = sorted[0];
  
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push({ start, end });
      start = sorted[i];
      end = sorted[i];
    }
  }
  ranges.push({ start, end });
  return ranges;
}

/**
 * Encontra a posição para inserir código de uma marca
 */
function findBrandInsertPosition(content, brandName) {
  const brandPatterns = [
    new RegExp(`// ${brandName.toUpperCase()}[^\\n]*\\n// =+\\nconst \\w+_VARIANTS`, 'i'),
    new RegExp(`const ${brandName.toUpperCase().replace(/[^A-Z]/g, '_')}_VARIANTS`, 'i'),
  ];
  
  for (const pattern of brandPatterns) {
    const match = content.match(pattern);
    if (match) {
      const startIndex = match.index;
      let bracketCount = 0;
      let inArray = false;
      
      for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '[') {
          bracketCount++;
          inArray = true;
        } else if (content[i] === ']') {
          bracketCount--;
          if (inArray && bracketCount === 0) {
            return { found: true, position: i, type: 'append' };
          }
        }
      }
    }
  }
  
  return { found: false };
}

async function main() {
  const startTime = Date.now();
  const allFipeVehicles = [];
  const errors = [];
  
  try {
    // 1. Carrega base local
    console.log(chalk.blue('📂 Carregando base de dados local...'));
    const localDb = loadLocalDatabase();
    console.log(chalk.green(`   ✓ ${localDb.brands.size} marcas, ${Array.from(localDb.models.values()).reduce((s, m) => s + m.size, 0)} modelos\n`));
    
    // 2. Define tipos a processar
    const typesToProcess = vehicleType 
      ? [vehicleType] 
      : ['CARS', 'MOTOS', 'TRUCKS'];
    
    // 3. Consulta API FIPE
    for (const type of typesToProcess) {
      console.log(chalk.blue.bold(`\n🔍 Consultando FIPE: ${type}...\n`));
      
      const brands = await fipeApi.getBrands(type);
      console.log(chalk.gray(`   Encontradas ${brands.length} marcas na FIPE\n`));
      
      // Filtra marcas
      let brandsToProcess = brands;
      if (targetBrand) {
        brandsToProcess = brands.filter(b => 
          b.name.toLowerCase().includes(targetBrand.toLowerCase()) ||
          b.originalName.toLowerCase().includes(targetBrand.toLowerCase())
        );
      } else {
        const priorityBrands = CONFIG.PRIORITY_BRANDS[type] || [];
        brandsToProcess = brands.filter(b => 
          priorityBrands.some(pb => 
            b.name.toLowerCase().includes(pb.toLowerCase()) ||
            b.originalName.toLowerCase().includes(pb.toLowerCase())
          )
        );
      }
      
      console.log(chalk.gray(`   Processando ${brandsToProcess.length} marcas\n`));
      
      for (const brand of brandsToProcess) {
        console.log(chalk.yellow(`\n📦 ${brand.name}`));
        
        try {
          const vehicles = await fipeApi.getAllVehiclesFromBrand(
            type,
            brand.code,
            brand.name,
            (progress) => {
              process.stdout.write(`\r   ${chalk.gray(`${progress.current}/${progress.total}`)} ${progress.model.substring(0, 40).padEnd(40)}`);
            }
          );
          
          console.log(`\n   ${chalk.green('✓')} ${vehicles.length} veículos encontrados`);
          
          for (const vehicle of vehicles) {
            try {
              const parsed = parseVehicle(vehicle, type);
              allFipeVehicles.push(parsed);
            } catch (err) {
              errors.push({ vehicle, error: err.message });
            }
          }
        } catch (err) {
          console.log(`   ${chalk.red('✗')} Erro: ${err.message}`);
          errors.push({ brand: brand.name, error: err.message });
        }
      }
    }
    
    // 4. Compara com base local
    console.log(chalk.blue.bold(`\n\n📊 Comparando com base local...\n`));
    
    const comparison = compareWithLocal(allFipeVehicles, localDb);
    const stats = generateStats(allFipeVehicles, localDb, comparison);
    
    console.log(chalk.white('   Estatísticas:'));
    console.log(chalk.gray(`   - FIPE: ${stats.fipe.totalVehicles} veículos`));
    console.log(chalk.gray(`   - Local: ${stats.local.totalBrands} marcas, ${stats.local.totalModels} modelos`));
    console.log(chalk.yellow(`   - Faltantes: ${stats.comparison.missing} veículos`));
    
    if (comparison.missing.length === 0) {
      console.log(chalk.green.bold('\n\n✅ Base de dados está completa! Nenhum veículo faltante.\n'));
      return;
    }
    
    // 5. Agrupa veículos faltantes
    const grouped = groupMissingVehicles(comparison.missing);
    
    // 6. Adiciona ao arquivo principal
    console.log(chalk.blue.bold(`\n\n📝 Adicionando veículos faltantes...\n`));
    
    let content = fs.readFileSync(MAIN_DB_PATH, 'utf-8');
    let totalAdded = 0;
    
    for (const [brand, models] of Object.entries(grouped)) {
      console.log(chalk.yellow(`\n   ${brand}:`));
      
      // Converte para lista de veículos
      const vehicles = [];
      for (const [model, data] of Object.entries(models)) {
        for (const year of data.years) {
          vehicles.push({
            brand,
            model,
            year,
            trim: data.trims[0] || null,
            engineName: data.engines[0] || null,
            fuel: data.fuels[0] || 'flex',
            vehicleType: 'car',
            bodyType: 'hatch',
          });
        }
      }
      
      // Agrupa por variante
      const groupedVariants = groupVehiclesByVariant(vehicles);
      
      // Gera código
      const lines = [];
      for (const variant of groupedVariants) {
        const ranges = findYearRanges(variant.years);
        for (const range of ranges) {
          lines.push(generateVariantLine(variant, range.start, range.end));
        }
      }
      
      if (lines.length === 0) continue;
      
      // Encontra posição para inserir
      const position = findBrandInsertPosition(content, brand);
      
      if (position.found) {
        const newCode = '\n  // === ADICIONADOS VIA FIPE SYNC ===\n' + lines.join('\n') + '\n';
        content = content.slice(0, position.position) + newCode + content.slice(position.position);
        console.log(chalk.green(`      ✓ ${lines.length} variantes`));
        totalAdded += lines.length;
      } else {
        // Cria nova seção
        const consolidationIndex = content.indexOf('// CONSOLIDAÇÃO E EXPORTAÇÕES');
        if (consolidationIndex > -1) {
          const brandVarName = brand.toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_NEW_VARIANTS';
          const newSection = `
// ============================================================================
// ${brand.toUpperCase()} - ADICIONADO VIA FIPE SYNC
// ============================================================================
const ${brandVarName}: VehicleVariant[] = [
${lines.join('\n')}
];

`;
          content = content.slice(0, consolidationIndex) + newSection + content.slice(consolidationIndex);
          
          // Adiciona ao array de consolidação
          const dbArrayMatch = content.match(/export const BRAZILIAN_VEHICLES_DATABASE: VehicleVariant\[\] = \[/);
          if (dbArrayMatch) {
            const insertPos = dbArrayMatch.index + dbArrayMatch[0].length;
            content = content.slice(0, insertPos) + `\n  ...${brandVarName},` + content.slice(insertPos);
          }
          
          console.log(chalk.green(`      ✓ Nova seção: ${lines.length} variantes`));
          totalAdded += lines.length;
        }
      }
    }
    
    // 7. Salva arquivo
    if (totalAdded > 0 && !dryRun) {
      fs.writeFileSync(MAIN_DB_PATH, content, 'utf-8');
      
      // Salva relatório
      const reportPath = path.resolve(__dirname, '../reports/full-sync-report.json');
      const reportDir = path.dirname(reportPath);
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }
      
      fs.writeFileSync(reportPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        stats,
        totalAdded,
        errors,
      }, null, 2));
      
      console.log(chalk.green.bold(`\n\n✅ ${totalAdded} variantes adicionadas com sucesso!`));
      console.log(chalk.gray(`   Relatório: ${reportPath}\n`));
    } else if (dryRun) {
      console.log(chalk.yellow.bold(`\n\n📋 DRY RUN: ${totalAdded} variantes seriam adicionadas\n`));
    }
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(chalk.cyan(`⏱️  Tempo total: ${elapsed}s\n`));
    
    if (errors.length > 0) {
      console.log(chalk.yellow(`⚠️  ${errors.length} erros durante o processo\n`));
    }
    
  } catch (err) {
    console.error(chalk.red(`\n❌ Erro fatal: ${err.message}\n`));
    console.error(err.stack);
    process.exit(1);
  }
}

main();
