/**
 * GERADOR DE COMPATIBILIDADE DE PEÇAS
 * Processa todos os 20.000+ veículos e gera índice de compatibilidade
 * 
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import pLimit from 'p-limit';
import { fileURLToPath } from 'url';
import { generateCompatibility } from './engine/compatibilityEngine.js';
import { PARTS_CHECKLIST } from './config/partsChecklist.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretórios
const OUTPUT_DIR = path.join(__dirname, '../output');
const PROGRESS_FILE = path.join(OUTPUT_DIR, 'progress.json');
const RESULTS_DIR = path.join(OUTPUT_DIR, 'results');

// Garante que diretórios existem
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });

/**
 * Carrega veículos do banco de dados TypeScript
 */
async function loadVehicles() {
  console.log(chalk.gray('📂 Carregando banco de dados de veículos...'));
  
  // Lê o arquivo TypeScript e extrai os dados
  const vehiclesPath = path.join(__dirname, '../../../src/features/vehicle-parts-search/data/brazilianVehicles.ts');
  
  if (!fs.existsSync(vehiclesPath)) {
    throw new Error(`Arquivo de veículos não encontrado: ${vehiclesPath}`);
  }
  
  const content = fs.readFileSync(vehiclesPath, 'utf-8');
  
  // Extrai estatísticas do arquivo
  const stats = {
    car: 0,
    motorcycle: 0,
    truck: 0,
    bus: 0,
    van: 0,
    suv: 0,
    pickup: 0,
  };
  
  // Conta ocorrências de vehicleType
  const carMatches = content.match(/vehicleType:\s*['"]car['"]/g);
  const motoMatches = content.match(/vehicleType:\s*['"]motorcycle['"]/g);
  const truckMatches = content.match(/vehicleType:\s*['"]truck['"]/g);
  const busMatches = content.match(/vehicleType:\s*['"]bus['"]/g);
  const vanMatches = content.match(/vehicleType:\s*['"]van['"]/g);
  const suvMatches = content.match(/vehicleType:\s*['"]suv['"]/g);
  const pickupMatches = content.match(/vehicleType:\s*['"]pickup['"]/g);
  
  stats.car = carMatches?.length || 0;
  stats.motorcycle = motoMatches?.length || 0;
  stats.truck = truckMatches?.length || 0;
  stats.bus = busMatches?.length || 0;
  stats.van = vanMatches?.length || 0;
  stats.suv = suvMatches?.length || 0;
  stats.pickup = pickupMatches?.length || 0;
  
  // Extrai variantes usando regex
  const vehicles = [];
  
  // Pattern para extrair generateYearVariants
  const variantPattern = /generateYearVariants\(\s*\{\s*brand:\s*['"]([^'"]+)['"]\s*,\s*model:\s*['"]([^'"]+)['"]\s*(?:,\s*trim:\s*['"]([^'"]+)['"])?\s*(?:,\s*engineCode:\s*['"]([^'"]+)['"])?\s*(?:,\s*engineName:\s*['"]([^'"]+)['"])?\s*(?:,\s*displacementCc:\s*(\d+))?\s*,\s*fuel:\s*['"]([^'"]+)['"]\s*(?:,\s*transmission:\s*['"]([^'"]+)['"])?\s*,\s*bodyType:\s*['"]([^'"]+)['"]\s*,\s*vehicleType:\s*['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = variantPattern.exec(content)) !== null) {
    const [, brand, model, trim, engineCode, engineName, displacementCc, fuel, transmission, bodyType, vehicleType] = match;
    
    // Extrai anos do mesmo bloco
    const yearPattern = /},\s*(\d{4}),\s*(\d{4})\)/;
    const remaining = content.slice(match.index);
    const yearMatch = remaining.match(yearPattern);
    
    if (yearMatch) {
      const startYear = parseInt(yearMatch[1]);
      const endYear = parseInt(yearMatch[2]);
      
      // Gera uma variante para cada ano
      for (let year = startYear; year <= endYear; year++) {
        vehicles.push({
          id: `${brand}_${model}_${year}_${trim || 'base'}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          brand,
          model,
          year,
          trim: trim || undefined,
          engineCode: engineCode || undefined,
          engineName: engineName || undefined,
          displacementCc: displacementCc ? parseInt(displacementCc) : undefined,
          fuel,
          transmission: transmission || undefined,
          bodyType,
          vehicleType,
        });
      }
    }
  }
  
  console.log(chalk.green(`✅ ${vehicles.length} variantes carregadas`));
  console.log(chalk.gray(`   Carros: ${stats.car} | Motos: ${stats.motorcycle} | Caminhões: ${stats.truck}`));
  console.log(chalk.gray(`   Ônibus: ${stats.bus} | Vans: ${stats.van} | SUVs: ${stats.suv} | Pickups: ${stats.pickup}`));
  
  return vehicles;
}

/**
 * Carrega progresso salvo
 */
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return { processed: [], lastIndex: 0, stats: {} };
}

/**
 * Salva progresso
 */
function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

/**
 * Salva resultado de um veículo
 */
function saveResult(vehicleId, result) {
  const filePath = path.join(RESULTS_DIR, `${vehicleId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
}

/**
 * Gera compatibilidade para todos os veículos
 */
export async function generateAllCompatibility(options = {}) {
  const {
    vehicleType = null,
    batchSize = 100,
    saveProgress: shouldSaveProgress = true,
    concurrency = 10,
  } = options;
  
  const startTime = Date.now();
  
  // Carrega veículos
  let vehicles = await loadVehicles();
  
  // Filtra por tipo se especificado
  if (vehicleType) {
    vehicles = vehicles.filter(v => v.vehicleType === vehicleType);
    console.log(chalk.yellow(`\n🔍 Filtrado para tipo: ${vehicleType} (${vehicles.length} veículos)\n`));
  }
  
  // Carrega progresso
  const progress = loadProgress();
  const processedSet = new Set(progress.processed);
  
  // Filtra veículos já processados
  const pending = vehicles.filter(v => !processedSet.has(v.id));
  
  console.log(chalk.cyan(`\n📊 Status:`));
  console.log(chalk.gray(`   Total: ${vehicles.length}`));
  console.log(chalk.gray(`   Já processados: ${progress.processed.length}`));
  console.log(chalk.gray(`   Pendentes: ${pending.length}\n`));
  
  if (pending.length === 0) {
    console.log(chalk.green('✅ Todos os veículos já foram processados!'));
    return;
  }
  
  // Estatísticas
  const stats = {
    total: pending.length,
    processed: 0,
    success: 0,
    errors: 0,
    coverage: {
      full: 0,      // 100% das peças encontradas
      partial: 0,   // 50-99%
      low: 0,       // < 50%
    },
    byType: {},
    missingParts: {},
  };
  
  // Limiter para concorrência
  const limit = pLimit(concurrency);
  
  // Processa em lotes
  const batches = [];
  for (let i = 0; i < pending.length; i += batchSize) {
    batches.push(pending.slice(i, i + batchSize));
  }
  
  console.log(chalk.yellow(`🔄 Processando ${batches.length} lotes de ${batchSize} veículos...\n`));
  
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchStart = Date.now();
    
    console.log(chalk.cyan(`\n═══ Lote ${batchIndex + 1}/${batches.length} ═══`));
    
    // Processa lote em paralelo
    const results = await Promise.all(
      batch.map(vehicle => limit(async () => {
        try {
          const result = generateCompatibility(vehicle);
          
          // Salva resultado
          saveResult(vehicle.id, result);
          
          // Atualiza estatísticas
          stats.processed++;
          stats.success++;
          
          // Cobertura
          if (result.coverage >= 1) stats.coverage.full++;
          else if (result.coverage >= 0.5) stats.coverage.partial++;
          else stats.coverage.low++;
          
          // Por tipo
          stats.byType[vehicle.vehicleType] = (stats.byType[vehicle.vehicleType] || 0) + 1;
          
          // Peças faltantes
          for (const missing of result.missingParts) {
            stats.missingParts[missing.partTypeId] = (stats.missingParts[missing.partTypeId] || 0) + 1;
          }
          
          // Marca como processado
          progress.processed.push(vehicle.id);
          
          return { success: true, vehicle, result };
        } catch (error) {
          stats.errors++;
          console.log(chalk.red(`   ❌ Erro em ${vehicle.brand} ${vehicle.model}: ${error.message}`));
          return { success: false, vehicle, error: error.message };
        }
      }))
    );
    
    // Salva progresso
    if (shouldSaveProgress) {
      progress.stats = stats;
      saveProgress(progress);
    }
    
    // Log do lote
    const batchTime = ((Date.now() - batchStart) / 1000).toFixed(2);
    const successCount = results.filter(r => r.success).length;
    
    console.log(chalk.gray(`   ✓ ${successCount}/${batch.length} processados em ${batchTime}s`));
    
    // Progresso geral
    const percent = ((stats.processed / stats.total) * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    const eta = stats.processed > 0 
      ? (((stats.total - stats.processed) / stats.processed) * elapsed).toFixed(1)
      : '?';
    
    console.log(chalk.yellow(`   📈 Progresso: ${percent}% | Tempo: ${elapsed}min | ETA: ${eta}min`));
  }
  
  // Resumo final
  console.log(chalk.green('\n' + '═'.repeat(60)));
  console.log(chalk.green('✅ GERAÇÃO COMPLETA!'));
  console.log(chalk.green('═'.repeat(60)));
  
  console.log(chalk.cyan('\n📊 Estatísticas Finais:'));
  console.log(chalk.gray(`   Total processados: ${stats.processed}`));
  console.log(chalk.gray(`   Sucesso: ${stats.success}`));
  console.log(chalk.gray(`   Erros: ${stats.errors}`));
  
  console.log(chalk.cyan('\n📈 Cobertura:'));
  console.log(chalk.green(`   100% cobertura: ${stats.coverage.full} veículos`));
  console.log(chalk.yellow(`   50-99% cobertura: ${stats.coverage.partial} veículos`));
  console.log(chalk.red(`   <50% cobertura: ${stats.coverage.low} veículos`));
  
  console.log(chalk.cyan('\n🚗 Por Tipo de Veículo:'));
  for (const [type, count] of Object.entries(stats.byType)) {
    console.log(chalk.gray(`   ${type}: ${count}`));
  }
  
  console.log(chalk.cyan('\n⚠️ Top 10 Peças Mais Faltantes:'));
  const sortedMissing = Object.entries(stats.missingParts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  for (const [partId, count] of sortedMissing) {
    console.log(chalk.red(`   ${partId}: ${count} veículos sem cobertura`));
  }
  
  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
  console.log(chalk.green(`\n⏱️ Tempo total: ${totalTime} minutos\n`));
  
  return stats;
}

export default generateAllCompatibility;
