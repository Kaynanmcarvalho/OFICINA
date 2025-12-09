#!/usr/bin/env node
/**
 * Stats - Estatísticas da Base de Dados
 * Mostra informações detalhadas sobre a base de dados atual
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAIN_DB_PATH = path.resolve(__dirname, '../../../src/features/vehicle-parts-search/data/brazilianVehicles.ts');

console.log(chalk.cyan.bold('\n📊 Estatísticas da Base de Dados de Veículos\n'));

function analyzeDatabase() {
  if (!fs.existsSync(MAIN_DB_PATH)) {
    console.log(chalk.red('❌ Arquivo de base de dados não encontrado\n'));
    return;
  }
  
  const content = fs.readFileSync(MAIN_DB_PATH, 'utf-8');
  
  // Conta variantes por marca
  const brandCounts = new Map();
  const modelCounts = new Map();
  const typeCounts = { car: 0, motorcycle: 0, truck: 0, bus: 0, van: 0, suv: 0, pickup: 0 };
  
  // Regex para extrair generateYearVariants
  const variantRegex = /generateYearVariants\(\s*\{\s*brand:\s*['"]([^'"]+)['"]\s*,\s*model:\s*['"]([^'"]+)['"].*?vehicleType:\s*['"]([^'"]+)['"].*?\}\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gs;
  
  let match;
  let totalVariants = 0;
  
  while ((match = variantRegex.exec(content)) !== null) {
    const brand = match[1];
    const model = match[2];
    const vehicleType = match[3];
    const startYear = parseInt(match[4]);
    const endYear = parseInt(match[5]);
    
    const yearCount = endYear - startYear + 1;
    totalVariants += yearCount;
    
    // Conta por marca
    brandCounts.set(brand, (brandCounts.get(brand) || 0) + yearCount);
    
    // Conta por modelo
    const modelKey = `${brand}|${model}`;
    modelCounts.set(modelKey, (modelCounts.get(modelKey) || 0) + yearCount);
    
    // Conta por tipo
    if (typeCounts[vehicleType] !== undefined) {
      typeCounts[vehicleType] += yearCount;
    }
  }
  
  // Ordena marcas por quantidade
  const sortedBrands = Array.from(brandCounts.entries())
    .sort((a, b) => b[1] - a[1]);
  
  // Exibe estatísticas
  console.log(chalk.white.bold('📈 Resumo Geral:'));
  console.log(chalk.gray(`   Total de variantes: ${chalk.green(totalVariants.toLocaleString())}`));
  console.log(chalk.gray(`   Total de marcas: ${chalk.green(brandCounts.size)}`));
  console.log(chalk.gray(`   Total de modelos: ${chalk.green(modelCounts.size)}`));
  
  console.log(chalk.white.bold('\n🚗 Por Tipo de Veículo:'));
  for (const [type, count] of Object.entries(typeCounts)) {
    if (count > 0) {
      const bar = '█'.repeat(Math.min(50, Math.round(count / totalVariants * 100)));
      console.log(chalk.gray(`   ${type.padEnd(12)} ${chalk.cyan(count.toString().padStart(6))} ${chalk.blue(bar)}`));
    }
  }
  
  console.log(chalk.white.bold('\n🏭 Top 20 Marcas:'));
  for (let i = 0; i < Math.min(20, sortedBrands.length); i++) {
    const [brand, count] = sortedBrands[i];
    const percentage = ((count / totalVariants) * 100).toFixed(1);
    const bar = '█'.repeat(Math.min(30, Math.round(count / sortedBrands[0][1] * 30)));
    console.log(chalk.gray(`   ${(i + 1).toString().padStart(2)}. ${brand.padEnd(20)} ${chalk.cyan(count.toString().padStart(5))} (${percentage}%) ${chalk.green(bar)}`));
  }
  
  // Motos
  const motoBrands = sortedBrands.filter(([brand]) => 
    ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'BMW', 'Ducati', 'Harley-Davidson', 'Triumph', 'KTM', 'Royal Enfield', 'Dafra', 'Shineray', 'Haojue'].includes(brand)
  );
  
  if (motoBrands.length > 0) {
    console.log(chalk.white.bold('\n🏍️  Marcas de Motos:'));
    for (const [brand, count] of motoBrands) {
      console.log(chalk.gray(`   ${brand.padEnd(20)} ${chalk.cyan(count.toString().padStart(5))} variantes`));
    }
  }
  
  // Caminhões
  const truckBrands = ['Mercedes-Benz', 'Scania', 'Volvo', 'Iveco', 'DAF', 'MAN', 'Agrale'];
  const truckData = sortedBrands.filter(([brand]) => truckBrands.includes(brand));
  
  if (truckData.length > 0) {
    console.log(chalk.white.bold('\n🚛 Marcas de Caminhões:'));
    for (const [brand, count] of truckData) {
      console.log(chalk.gray(`   ${brand.padEnd(20)} ${chalk.cyan(count.toString().padStart(5))} variantes`));
    }
  }
  
  console.log('\n');
}

analyzeDatabase();
