#!/usr/bin/env node
/**
 * Add Missing Vehicles
 * Adiciona veículos faltantes diretamente ao arquivo brazilianVehicles.ts
 * 
 * Uso:
 *   node src/addMissing.js                    # Adiciona todos os faltantes
 *   node src/addMissing.js --brand="Honda"    # Apenas uma marca
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do arquivo principal
const MAIN_DB_PATH = path.resolve(__dirname, '../../../src/features/vehicle-parts-search/data/brazilianVehicles.ts');
const REPORT_PATH = path.resolve(__dirname, '../reports/sync-report.json');

// Parse argumentos
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

const targetBrand = getArg('brand');
const dryRun = args.includes('--dry-run');

console.log(chalk.cyan.bold('\n🔧 Add Missing Vehicles\n'));

/**
 * Gera código para uma variante
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
 * Encontra a posição para inserir código de uma marca
 */
function findBrandInsertPosition(content, brandName) {
  // Procura pela seção da marca
  const brandPatterns = [
    new RegExp(`// ${brandName.toUpperCase()}[^\\n]*\\n// =+\\nconst \\w+_VARIANTS`, 'i'),
    new RegExp(`const ${brandName.toUpperCase().replace(/[^A-Z]/g, '_')}_VARIANTS`, 'i'),
  ];
  
  for (const pattern of brandPatterns) {
    const match = content.match(pattern);
    if (match) {
      // Encontra o final do array dessa marca
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
            // Encontrou o final do array
            return { found: true, position: i, type: 'append' };
          }
        }
      }
    }
  }
  
  return { found: false };
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
  const sorted = [...new Set(years)].sort((a, b) => a - b);
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
  // Verifica se existe relatório
  if (!fs.existsSync(REPORT_PATH)) {
    console.log(chalk.red('❌ Relatório não encontrado. Execute primeiro: npm run sync\n'));
    process.exit(1);
  }
  
  // Carrega relatório
  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'));
  const { grouped } = report;
  
  if (!grouped || Object.keys(grouped).length === 0) {
    console.log(chalk.green('✅ Nenhum veículo faltante encontrado!\n'));
    process.exit(0);
  }
  
  // Filtra por marca se especificado
  let brandsToProcess = Object.keys(grouped);
  if (targetBrand) {
    brandsToProcess = brandsToProcess.filter(b => 
      b.toLowerCase().includes(targetBrand.toLowerCase())
    );
  }
  
  console.log(chalk.gray(`Marcas a processar: ${brandsToProcess.join(', ')}\n`));
  
  // Carrega arquivo principal
  let content = fs.readFileSync(MAIN_DB_PATH, 'utf-8');
  let totalAdded = 0;
  
  for (const brand of brandsToProcess) {
    const models = grouped[brand];
    console.log(chalk.yellow(`\n📦 ${brand}`));
    
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
      // Insere antes do fechamento do array
      const newCode = '\n  // === ADICIONADOS AUTOMATICAMENTE ===\n' + lines.join('\n') + '\n';
      content = content.slice(0, position.position) + newCode + content.slice(position.position);
      
      console.log(chalk.green(`   ✓ ${lines.length} variantes adicionadas`));
      totalAdded += lines.length;
    } else {
      console.log(chalk.yellow(`   ⚠️  Seção da marca não encontrada - criando nova seção`));
      
      // Cria nova seção antes da consolidação
      const consolidationIndex = content.indexOf('// CONSOLIDAÇÃO E EXPORTAÇÕES');
      if (consolidationIndex > -1) {
        const brandVarName = brand.toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_VARIANTS';
        const newSection = `
// ============================================================================
// ${brand.toUpperCase()} - ADICIONADO AUTOMATICAMENTE
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
        
        console.log(chalk.green(`   ✓ Nova seção criada com ${lines.length} variantes`));
        totalAdded += lines.length;
      }
    }
  }
  
  if (totalAdded > 0 && !dryRun) {
    // Salva arquivo
    fs.writeFileSync(MAIN_DB_PATH, content, 'utf-8');
    console.log(chalk.green.bold(`\n\n✅ ${totalAdded} variantes adicionadas ao arquivo principal\n`));
  } else if (dryRun) {
    console.log(chalk.yellow(`\n\n📋 Dry run: ${totalAdded} variantes seriam adicionadas\n`));
  } else {
    console.log(chalk.gray('\n\nNenhuma alteração necessária.\n'));
  }
}

main().catch(err => {
  console.error(chalk.red(`\n❌ Erro: ${err.message}\n`));
  process.exit(1);
});
