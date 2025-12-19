#!/usr/bin/env node
/**
 * Apply Sync - Aplica os resultados da sincronização ao arquivo principal
 * 
 * Lê os arquivos de relatório gerados pelo syncFromLocal.js
 * e adiciona os veículos faltantes ao brazilianVehicles.ts
 * 
 * Uso:
 *   node src/applySync.js                    # Aplica último sync
 *   node src/applySync.js --file=<path>      # Aplica arquivo específico
 *   node src/applySync.js --dry-run          # Apenas mostra o que seria feito
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadLocalDatabase, compareWithLocal, groupMissingVehicles } from './databaseComparer.js';
import { parseVehicle } from './vehicleParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORTS_DIR = path.join(__dirname, '../reports');

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

const specificFile = getArg('file');
const dryRun = args.includes('--dry-run');

console.log(chalk.cyan.bold('\n📝 Apply Sync Results\n'));


/**
 * Gera código TypeScript para uma variante
 */
function generateVariantCode(brand, model, years, fuel, vehicleType) {
  // Filtra anos válidos (1900-2030)
  const validYears = years.filter(y => y >= 1900 && y <= 2030);
  if (validYears.length === 0) return null;
  
  const startYear = Math.min(...validYears);
  let endYear = Math.max(...validYears);
  
  // Se o ano for muito alto (ex: 32000 = 0km), usa 2025
  if (endYear > 2030) endYear = 2025;
  
  const bodyType = vehicleType === 'motorcycle' ? 'naked' : 'hatch';
  const vType = vehicleType === 'motorcycle' ? 'motorcycle' : 'car';
  
  return `  ...generateYearVariants({ brand: '${brand}', model: '${model}', fuel: '${fuel}', bodyType: '${bodyType}', vehicleType: '${vType}', sources: ['fipe'] }, ${startYear}, ${endYear}),`;
}

async function main() {
  try {
    // 1. Encontra arquivo de sync mais recente
    let syncFile;
    if (specificFile) {
      syncFile = specificFile;
    } else {
      const files = fs.readdirSync(REPORTS_DIR)
        .filter(f => f.startsWith('sync-') && f.endsWith('.json'))
        .sort()
        .reverse();
      
      if (files.length === 0) {
        console.log(chalk.red('❌ Nenhum arquivo de sync encontrado.'));
        console.log(chalk.yellow('   Execute primeiro: node src/syncFromLocal.js'));
        process.exit(1);
      }
      
      syncFile = path.join(REPORTS_DIR, files[0]);
    }
    
    console.log(chalk.blue(`📂 Arquivo: ${path.basename(syncFile)}\n`));
    
    // 2. Carrega dados do sync
    const syncData = JSON.parse(fs.readFileSync(syncFile, 'utf-8'));
    console.log(chalk.gray(`   Tipo: ${syncData.type}`));
    console.log(chalk.gray(`   Veículos coletados: ${syncData.totalCollected}`));
    console.log(chalk.gray(`   Faltantes reportados: ${syncData.missing}\n`));
    
    // 3. Carrega base local atual
    const localDb = loadLocalDatabase();
    
    // 4. Compara novamente (pode ter mudado)
    const parsedVehicles = syncData.vehicles.map(v => parseVehicle(v, syncData.type));
    const comparison = compareWithLocal(parsedVehicles, localDb);
    
    console.log(chalk.yellow(`📊 Faltantes atuais: ${comparison.missing.length}\n`));
    
    if (comparison.missing.length === 0) {
      console.log(chalk.green.bold('✅ Base já está completa! Nada a adicionar.\n'));
      return;
    }
    
    // 5. Agrupa por marca/modelo
    const grouped = groupMissingVehicles(comparison.missing);
    
    // 6. Gera código
    const codeLines = [];
    codeLines.push('\n// ============================================================================');
    codeLines.push('// VEÍCULOS ADICIONADOS VIA FIPE SYNC');
    codeLines.push(`// Data: ${new Date().toISOString()}`);
    codeLines.push('// ============================================================================');
    codeLines.push('const FIPE_SYNC_VARIANTS: VehicleVariant[] = [');
    
    for (const [brand, models] of Object.entries(grouped)) {
      codeLines.push(`  // ${brand}`);
      for (const [model, data] of Object.entries(models)) {
        const code = generateVariantCode(brand, model, data.years, data.fuels[0] || 'flex', 
          syncData.type === 'MOTOS' ? 'motorcycle' : 'car');
        codeLines.push(code);
      }
    }
    
    codeLines.push('];');
    codeLines.push('');
    
    const newCode = codeLines.join('\n');
    
    if (dryRun) {
      console.log(chalk.yellow('📋 DRY RUN - Código que seria adicionado:\n'));
      console.log(chalk.gray(newCode));
      return;
    }
    
    // 7. Adiciona ao arquivo principal
    let content = fs.readFileSync(MAIN_DB_PATH, 'utf-8');
    
    // Encontra posição antes da consolidação
    const consolidationIndex = content.indexOf('// CONSOLIDAÇÃO E EXPORTAÇÕES');
    if (consolidationIndex === -1) {
      console.log(chalk.red('❌ Não encontrou seção de consolidação no arquivo.'));
      process.exit(1);
    }
    
    // Insere código
    content = content.slice(0, consolidationIndex) + newCode + '\n' + content.slice(consolidationIndex);
    
    // Adiciona ao array de exportação
    const dbArrayMatch = content.match(/export const BRAZILIAN_VEHICLES_DATABASE: VehicleVariant\[\] = \[/);
    if (dbArrayMatch) {
      const insertPos = dbArrayMatch.index + dbArrayMatch[0].length;
      content = content.slice(0, insertPos) + '\n  ...FIPE_SYNC_VARIANTS,' + content.slice(insertPos);
    }
    
    // Salva
    fs.writeFileSync(MAIN_DB_PATH, content, 'utf-8');
    
    console.log(chalk.green.bold(`✅ ${comparison.missing.length} veículos adicionados!`));
    console.log(chalk.gray(`   Arquivo: ${MAIN_DB_PATH}\n`));
    
  } catch (err) {
    console.error(chalk.red(`\n❌ Erro: ${err.message}\n`));
    console.error(err.stack);
    process.exit(1);
  }
}

main();
