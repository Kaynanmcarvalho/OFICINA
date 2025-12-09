#!/usr/bin/env node
/**
 * Safe Sync - Sincronização Segura com Pausas Longas
 * 
 * Este script processa UMA MARCA POR VEZ com pausas longas
 * para evitar rate limiting da API FIPE.
 * 
 * Uso:
 *   node src/syncSafe.js                    # Sincroniza tudo (uma marca por vez)
 *   node src/syncSafe.js --type=cars        # Apenas carros
 *   node src/syncSafe.js --brand="Honda"    # Apenas uma marca específica
 *   node src/syncSafe.js --resume           # Continua de onde parou
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

// Arquivo de progresso para resume
const PROGRESS_FILE = path.join(__dirname, '../cache/sync-progress.json');

// Caminho do arquivo principal
function findMainDbPath() {
  const possiblePaths = [
    path.resolve(__dirname, '../../../src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
    path.resolve(__dirname, '../../src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
    path.resolve(process.cwd(), 'src/features/vehicle-parts-search/data/brazilianVehicles.ts'),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
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
const resumeMode = args.includes('--resume');
const dryRun = args.includes('--dry-run');

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Pausa longa entre marcas (30 segundos)
const PAUSE_BETWEEN_BRANDS = 30000;

// Carrega progresso salvo
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    } catch (e) {
      return { completedBrands: [], vehicles: [] };
    }
  }
  return { completedBrands: [], vehicles: [] };
}

// Salva progresso
function saveProgress(progress) {
  const dir = path.dirname(PROGRESS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

console.log(chalk.cyan.bold('\n🛡️  SAFE SYNC - Sincronização Segura\n'));
console.log(chalk.gray('Processa uma marca por vez com pausas longas'));
console.log(chalk.gray('para evitar bloqueio da API FIPE.\n'));

if (vehicleType) console.log(chalk.yellow(`📋 Tipo: ${vehicleType}`));
if (targetBrand) console.log(chalk.yellow(`📋 Marca: ${targetBrand}`));
if (resumeMode) console.log(chalk.yellow(`📋 Modo: Resume (continuando de onde parou)`));
if (dryRun) console.log(chalk.yellow(`📋 Modo: Dry Run`));
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

async function main() {
  const startTime = Date.now();
  let progress = resumeMode ? loadProgress() : { completedBrands: [], vehicles: [] };
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
    
    // 3. Consulta API FIPE - UMA MARCA POR VEZ
    for (const type of typesToProcess) {
      console.log(chalk.blue.bold(`\n🔍 Consultando FIPE: ${type}...\n`));
      
      let brands;
      try {
        brands = await fipeApi.getBrands(type);
        console.log(chalk.gray(`   Encontradas ${brands.length} marcas na FIPE\n`));
      } catch (err) {
        console.log(chalk.red(`   ❌ Erro ao obter marcas: ${err.message}`));
        console.log(chalk.yellow(`   Aguardando 60s antes de tentar novamente...`));
        await delay(60000);
        
        try {
          brands = await fipeApi.getBrands(type);
        } catch (err2) {
          console.log(chalk.red(`   ❌ Falha definitiva. Pulando tipo ${type}.`));
          continue;
        }
      }
      
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
      
      // Remove marcas já processadas (se resume)
      if (resumeMode) {
        brandsToProcess = brandsToProcess.filter(b => 
          !progress.completedBrands.includes(`${type}:${b.code}`)
        );
        console.log(chalk.gray(`   ${progress.completedBrands.length} marcas já processadas anteriormente`));
      }
      
      console.log(chalk.gray(`   Processando ${brandsToProcess.length} marcas\n`));
      
      for (let i = 0; i < brandsToProcess.length; i++) {
        const brand = brandsToProcess[i];
        const brandKey = `${type}:${brand.code}`;
        
        console.log(chalk.yellow(`\n📦 [${i + 1}/${brandsToProcess.length}] ${brand.name}`));
        
        try {
          const vehicles = await fipeApi.getAllVehiclesFromBrand(
            type,
            brand.code,
            brand.name,
            (prog) => {
              process.stdout.write(`\r   ${chalk.gray(`${prog.current}/${prog.total}`)} ${prog.model.substring(0, 40).padEnd(40)}`);
            }
          );
          
          console.log(`\n   ${chalk.green('✓')} ${vehicles.length} veículos encontrados`);
          
          // Parse e adiciona ao progresso
          for (const vehicle of vehicles) {
            try {
              const parsed = parseVehicle(vehicle, type);
              progress.vehicles.push(parsed);
            } catch (err) {
              errors.push({ vehicle, error: err.message });
            }
          }
          
          // Marca como completa
          progress.completedBrands.push(brandKey);
          saveProgress(progress);
          
        } catch (err) {
          console.log(`   ${chalk.red('✗')} Erro: ${err.message}`);
          errors.push({ brand: brand.name, error: err.message });
        }
        
        // Pausa longa entre marcas
        if (i < brandsToProcess.length - 1) {
          console.log(chalk.gray(`\n   ⏳ Pausa de ${PAUSE_BETWEEN_BRANDS/1000}s antes da próxima marca...`));
          await delay(PAUSE_BETWEEN_BRANDS);
        }
      }
    }
    
    // 4. Compara com base local
    console.log(chalk.blue.bold(`\n\n📊 Comparando com base local...\n`));
    
    const comparison = compareWithLocal(progress.vehicles, localDb);
    const stats = generateStats(progress.vehicles, localDb, comparison);
    
    console.log(chalk.white('   Estatísticas:'));
    console.log(chalk.gray(`   - FIPE: ${stats.fipe.totalVehicles} veículos coletados`));
    console.log(chalk.gray(`   - Local: ${stats.local.totalBrands} marcas, ${stats.local.totalModels} modelos`));
    console.log(chalk.yellow(`   - Faltantes: ${stats.comparison.missing} veículos`));
    
    if (comparison.missing.length === 0) {
      console.log(chalk.green.bold('\n\n✅ Base de dados está completa! Nenhum veículo faltante.\n'));
      return;
    }
    
    // 5. Agrupa veículos faltantes
    const grouped = groupMissingVehicles(comparison.missing);
    
    // 6. Gera código para adicionar
    console.log(chalk.blue.bold(`\n\n📝 Gerando código para veículos faltantes...\n`));
    
    let totalLines = 0;
    const codeByBrand = {};
    
    for (const [brand, models] of Object.entries(grouped)) {
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
      
      const groupedVariants = groupVehiclesByVariant(vehicles);
      const lines = [];
      
      for (const variant of groupedVariants) {
        const ranges = findYearRanges(variant.years);
        for (const range of ranges) {
          lines.push(generateVariantLine(variant, range.start, range.end));
        }
      }
      
      if (lines.length > 0) {
        codeByBrand[brand] = lines;
        totalLines += lines.length;
        console.log(chalk.green(`   ${brand}: ${lines.length} variantes`));
      }
    }
    
    // 7. Salva código gerado em arquivo separado
    const outputPath = path.resolve(__dirname, '../reports/generated-vehicles.ts');
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let outputCode = `// Veículos gerados automaticamente via FIPE Sync\n`;
    outputCode += `// Data: ${new Date().toISOString()}\n`;
    outputCode += `// Total: ${totalLines} variantes\n\n`;
    
    for (const [brand, lines] of Object.entries(codeByBrand)) {
      outputCode += `\n// === ${brand.toUpperCase()} ===\n`;
      outputCode += lines.join('\n') + '\n';
    }
    
    fs.writeFileSync(outputPath, outputCode);
    console.log(chalk.green(`\n   ✓ Código salvo em: ${outputPath}`));
    
    // 8. Salva relatório
    const reportPath = path.resolve(__dirname, '../reports/safe-sync-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      stats,
      totalVariants: totalLines,
      brandsSynced: Object.keys(codeByBrand).length,
      errors,
    }, null, 2));
    
    console.log(chalk.green.bold(`\n\n✅ Sincronização completa!`));
    console.log(chalk.gray(`   ${totalLines} variantes geradas`));
    console.log(chalk.gray(`   Relatório: ${reportPath}`));
    console.log(chalk.gray(`   Código: ${outputPath}\n`));
    
    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    console.log(chalk.cyan(`⏱️  Tempo total: ${elapsed} minutos\n`));
    
    // Limpa progresso após sucesso
    if (fs.existsSync(PROGRESS_FILE)) {
      fs.unlinkSync(PROGRESS_FILE);
    }
    
  } catch (err) {
    console.error(chalk.red(`\n❌ Erro fatal: ${err.message}\n`));
    console.error(err.stack);
    
    // Salva progresso para resume
    saveProgress(progress);
    console.log(chalk.yellow(`\n💾 Progresso salvo. Use --resume para continuar.\n`));
    
    process.exit(1);
  }
}

main();
