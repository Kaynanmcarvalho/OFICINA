#!/usr/bin/env node
/**
 * Vehicle Database Sync - Script Principal
 * Sincroniza base de dados de veículos com a API FIPE
 * 
 * Uso:
 *   node src/index.js                    # Sincroniza tudo
 *   node src/index.js --type=cars        # Apenas carros
 *   node src/index.js --type=motos       # Apenas motos
 *   node src/index.js --type=trucks      # Apenas caminhões
 *   node src/index.js --brand="Honda"    # Apenas uma marca
 */

import chalk from 'chalk';
import cliProgress from 'cli-progress';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { CONFIG } from './config.js';
import fipeApi from './fipeApi.js';
import { parseVehicle } from './vehicleParser.js';
import { loadLocalDatabase, compareWithLocal, groupMissingVehicles, generateStats } from './databaseComparer.js';
import { generateMissingVehiclesFile, saveMissingVehiclesFile } from './codeGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse argumentos
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

const vehicleType = getArg('type')?.toUpperCase() || null;
const targetBrand = getArg('brand') || null;
const dryRun = args.includes('--dry-run');

console.log(chalk.cyan.bold('\n🚗 Vehicle Database Sync v1.0.0\n'));
console.log(chalk.gray('Sincronizando base de dados com API FIPE...\n'));

if (vehicleType) console.log(chalk.yellow(`📋 Tipo: ${vehicleType}`));
if (targetBrand) console.log(chalk.yellow(`📋 Marca: ${targetBrand}`));
if (dryRun) console.log(chalk.yellow(`📋 Modo: Dry Run (sem alterações)`));
console.log('');

// Progress bar
const progressBar = new cliProgress.SingleBar({
  format: chalk.cyan('{bar}') + ' | {percentage}% | {value}/{total} | {brand} - {model}',
  barCompleteChar: '█',
  barIncompleteChar: '░',
  hideCursor: true,
});

async function main() {
  const startTime = Date.now();
  const allFipeVehicles = [];
  const errors = [];
  
  try {
    // Carrega base local
    console.log(chalk.blue('📂 Carregando base de dados local...'));
    const localDb = loadLocalDatabase();
    console.log(chalk.green(`   ✓ ${localDb.brands.size} marcas, ${Array.from(localDb.models.values()).reduce((s, m) => s + m.size, 0)} modelos\n`));
    
    // Define tipos a processar
    const typesToProcess = vehicleType 
      ? [vehicleType] 
      : ['CARS', 'MOTOS', 'TRUCKS'];
    
    for (const type of typesToProcess) {
      console.log(chalk.blue.bold(`\n🔍 Processando ${type}...\n`));
      
      // Obtém marcas
      const brands = await fipeApi.getBrands(type);
      console.log(chalk.gray(`   Encontradas ${brands.length} marcas na FIPE\n`));
      
      // Filtra marcas prioritárias ou específica
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
      
      console.log(chalk.gray(`   Processando ${brandsToProcess.length} marcas prioritárias\n`));
      
      for (const brand of brandsToProcess) {
        console.log(chalk.yellow(`\n📦 ${brand.name} (${brand.originalName})`));
        
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
          
          // Parse e adiciona
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
    
    console.log(chalk.blue.bold(`\n\n📊 Comparando com base local...\n`));
    
    // Compara com base local
    const comparison = compareWithLocal(allFipeVehicles, localDb);
    const stats = generateStats(allFipeVehicles, localDb, comparison);
    
    console.log(chalk.white('   Estatísticas:'));
    console.log(chalk.gray(`   - FIPE: ${stats.fipe.totalVehicles} veículos, ${stats.fipe.uniqueBrands} marcas, ${stats.fipe.uniqueModels} modelos`));
    console.log(chalk.gray(`   - Local: ${stats.local.totalBrands} marcas, ${stats.local.totalModels} modelos`));
    console.log(chalk.yellow(`   - Faltantes: ${stats.comparison.missing} veículos`));
    console.log(chalk.gray(`     - Marcas novas: ${stats.comparison.missingByReason.brand_missing}`));
    console.log(chalk.gray(`     - Modelos novos: ${stats.comparison.missingByReason.model_missing}`));
    
    if (comparison.missing.length > 0) {
      console.log(chalk.blue.bold(`\n\n📝 Gerando código para veículos faltantes...\n`));
      
      // Agrupa veículos faltantes
      const grouped = groupMissingVehicles(comparison.missing);
      
      // Mostra resumo por marca
      for (const [brand, models] of Object.entries(grouped)) {
        const modelCount = Object.keys(models).length;
        const yearCount = Object.values(models).reduce((sum, m) => sum + m.years.length, 0);
        console.log(chalk.gray(`   ${brand}: ${modelCount} modelos, ${yearCount} variantes`));
      }
      
      if (!dryRun) {
        // Gera arquivo
        const code = generateMissingVehiclesFile(grouped);
        const outputPath = path.resolve(__dirname, '../reports/missingVehicles.ts');
        saveMissingVehiclesFile(code, outputPath);
        
        // Salva relatório JSON
        const reportPath = path.resolve(__dirname, '../reports/sync-report.json');
        const reportDir = path.dirname(reportPath);
        if (!fs.existsSync(reportDir)) {
          fs.mkdirSync(reportDir, { recursive: true });
        }
        
        fs.writeFileSync(reportPath, JSON.stringify({
          timestamp: new Date().toISOString(),
          stats,
          grouped,
          errors,
        }, null, 2));
        
        console.log(chalk.green(`\n✅ Relatório salvo: ${reportPath}`));
      }
    }
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(chalk.green.bold(`\n\n✨ Sincronização concluída em ${elapsed}s\n`));
    
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
