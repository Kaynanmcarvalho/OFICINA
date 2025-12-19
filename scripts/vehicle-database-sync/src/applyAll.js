#!/usr/bin/env node
/**
 * Apply All - Aplica TODOS os veículos gerados ao arquivo principal
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const GENERATED_FILE = path.join(__dirname, '../reports/generated-vehicles-all.ts');

console.log(chalk.cyan.bold('\n📝 Aplicando TODOS os veículos gerados...\n'));

try {
  // Lê arquivo gerado
  if (!fs.existsSync(GENERATED_FILE)) {
    console.log(chalk.red('❌ Arquivo gerado não encontrado!'));
    console.log(chalk.yellow('   Execute primeiro: node src/syncAll.js'));
    process.exit(1);
  }
  
  const generatedCode = fs.readFileSync(GENERATED_FILE, 'utf-8');
  const lines = generatedCode.split('\n').filter(l => l.trim().startsWith('...generate'));
  
  console.log(chalk.green(`✓ ${lines.length} variantes para adicionar\n`));
  
  // Lê arquivo principal
  let mainContent = fs.readFileSync(MAIN_DB_PATH, 'utf-8');
  
  // Cria nova seção
  const newSection = `
// ============================================================================
// VEÍCULOS FIPE - SINCRONIZAÇÃO COMPLETA
// Gerado automaticamente em: ${new Date().toISOString()}
// Total: ${lines.length} variantes
// ============================================================================
const FIPE_COMPLETE_VARIANTS: VehicleVariant[] = [
${lines.join('\n')}
];

`;

  // Encontra posição para inserir (antes da consolidação)
  const consolidationIndex = mainContent.indexOf('// CONSOLIDAÇÃO E EXPORTAÇÕES');
  
  if (consolidationIndex === -1) {
    console.log(chalk.red('❌ Não encontrou seção de consolidação!'));
    process.exit(1);
  }
  
  // Insere código
  mainContent = mainContent.slice(0, consolidationIndex) + newSection + mainContent.slice(consolidationIndex);
  
  // Adiciona ao array de exportação
  const dbArrayMatch = mainContent.match(/export const BRAZILIAN_VEHICLES_DATABASE: VehicleVariant\[\] = \[/);
  if (dbArrayMatch) {
    const insertPos = dbArrayMatch.index + dbArrayMatch[0].length;
    mainContent = mainContent.slice(0, insertPos) + '\n  ...FIPE_COMPLETE_VARIANTS,' + mainContent.slice(insertPos);
  }
  
  // Salva
  fs.writeFileSync(MAIN_DB_PATH, mainContent, 'utf-8');
  
  console.log(chalk.green.bold(`✅ ${lines.length} variantes adicionadas com sucesso!`));
  console.log(chalk.gray(`   Arquivo: ${MAIN_DB_PATH}\n`));
  
} catch (err) {
  console.error(chalk.red(`\n❌ Erro: ${err.message}\n`));
  process.exit(1);
}
