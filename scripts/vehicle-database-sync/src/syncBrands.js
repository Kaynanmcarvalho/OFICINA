#!/usr/bin/env node
/**
 * Sync Brands - Sincroniza marcas específicas
 * 
 * Processa uma marca específica por vez.
 * Ideal para rodar manualmente ou em cron jobs.
 * 
 * Uso:
 *   node src/syncBrands.js Honda
 *   node src/syncBrands.js Volkswagen --type=cars
 *   node src/syncBrands.js Yamaha --type=motos
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { CONFIG } from './config.js';
import fipeApi from './fipeApi.js';
import { parseVehicle } from './vehicleParser.js';
import { loadLocalDatabase, compareWithLocal, groupMissingVehicles } from './databaseComparer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse argumentos
const args = process.argv.slice(2);
const brandName = args.find(a => !a.startsWith('--'));
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

const vehicleType = getArg('type')?.toUpperCase() || 'CARS';

if (!brandName) {
  console.log(chalk.red('\n❌ Uso: node src/syncBrands.js <MARCA> [--type=cars|motos|trucks]\n'));
  console.log(chalk.gray('Exemplos:'));
  console.log(chalk.gray('  node src/syncBrands.js Honda'));
  console.log(chalk.gray('  node src/syncBrands.js Volkswagen --type=cars'));
  console.log(chalk.gray('  node src/syncBrands.js Yamaha --type=motos\n'));
  process.exit(1);
}

console.log(chalk.cyan.bold(`\n🔧 Sincronizando: ${brandName} (${vehicleType})\n`));

async function main() {
  try {
    // 1. Carrega base local
    console.log(chalk.blue('📂 Carregando base local...'));
    const localDb = loadLocalDatabase();
    console.log(chalk.green(`   ✓ ${localDb.brands.size} marcas\n`));
    
    // 2. Busca marcas na FIPE
    console.log(chalk.blue('🔍 Buscando na FIPE...'));
    const brands = await fipeApi.getBrands(vehicleType);
    
    const matchingBrand = brands.find(b => 
      b.name.toLowerCase().includes(brandName.toLowerCase()) ||
      b.originalName.toLowerCase().includes(brandName.toLowerCase())
    );
    
    if (!matchingBrand) {
      console.log(chalk.red(`\n❌ Marca "${brandName}" não encontrada na FIPE.\n`));
      console.log(chalk.gray('Marcas disponíveis:'));
      brands.slice(0, 20).forEach(b => console.log(chalk.gray(`  - ${b.name}`)));
      process.exit(1);
    }
    
    console.log(chalk.green(`   ✓ Encontrada: ${matchingBrand.name} (código: ${matchingBrand.code})\n`));
    
    // 3. Busca todos os veículos da marca
    console.log(chalk.blue('📦 Buscando veículos...'));
    const vehicles = await fipeApi.getAllVehiclesFromBrand(
      vehicleType,
      matchingBrand.code,
      matchingBrand.name,
      (prog) => {
        process.stdout.write(`\r   ${chalk.gray(`${prog.current}/${prog.total}`)} ${prog.model.substring(0, 50).padEnd(50)}`);
      }
    );
    
    console.log(`\n   ${chalk.green('✓')} ${vehicles.length} veículos encontrados\n`);
    
    // 4. Parse veículos
    const parsedVehicles = [];
    for (const v of vehicles) {
      try {
        parsedVehicles.push(parseVehicle(v, vehicleType));
      } catch (e) {
        // Ignora erros de parse
      }
    }
    
    // 5. Compara com local
    console.log(chalk.blue('📊 Comparando com base local...'));
    const comparison = compareWithLocal(parsedVehicles, localDb);
    
    console.log(chalk.gray(`   - Existentes: ${comparison.existing.length}`));
    console.log(chalk.yellow(`   - Faltantes: ${comparison.missing.length}\n`));
    
    if (comparison.missing.length === 0) {
      console.log(chalk.green.bold('✅ Todos os veículos já existem na base!\n'));
      return;
    }
    
    // 6. Gera código
    const grouped = groupMissingVehicles(comparison.missing);
    
    let code = `// ${matchingBrand.name} - Veículos da FIPE\n`;
    code += `// Gerado em: ${new Date().toISOString()}\n\n`;
    
    for (const [brand, models] of Object.entries(grouped)) {
      for (const [model, data] of Object.entries(models)) {
        const years = [...new Set(data.years)].sort((a, b) => a - b);
        const yearRange = years.length > 1 
          ? `${years[0]}-${years[years.length - 1]}`
          : `${years[0]}`;
        
        code += `  ...generateYearVariants({ brand: '${brand}', model: '${model}', fuel: '${data.fuels[0] || 'flex'}', bodyType: 'hatch', vehicleType: 'car', sources: ['fipe'] }, ${years[0]}, ${years[years.length - 1]}),\n`;
      }
    }
    
    // 7. Salva arquivo
    const outputPath = path.resolve(__dirname, `../reports/${brandName.toLowerCase()}-vehicles.ts`);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, code);
    
    console.log(chalk.green.bold(`✅ ${comparison.missing.length} veículos faltantes identificados!`));
    console.log(chalk.gray(`   Código salvo em: ${outputPath}\n`));
    
  } catch (err) {
    console.error(chalk.red(`\n❌ Erro: ${err.message}\n`));
    process.exit(1);
  }
}

main();
