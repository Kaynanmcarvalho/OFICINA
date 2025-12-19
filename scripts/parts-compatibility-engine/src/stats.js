/**
 * ESTATÍSTICAS DO MOTOR DE COMPATIBILIDADE
 * Exibe estatísticas do banco de dados e resultados gerados
 * 
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { PARTS_CHECKLIST } from './config/partsChecklist.js';
import { PART_NUMBERS_DATABASE } from './config/partNumbers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../output');
const RESULTS_DIR = path.join(OUTPUT_DIR, 'results');
const PROGRESS_FILE = path.join(OUTPUT_DIR, 'progress.json');

/**
 * Exibe estatísticas completas
 */
export async function showStats() {
  console.log(chalk.cyan('\n' + '═'.repeat(60)));
  console.log(chalk.cyan('📊 ESTATÍSTICAS DO MOTOR DE COMPATIBILIDADE'));
  console.log(chalk.cyan('═'.repeat(60)));
  
  // 1. Estatísticas do checklist de peças
  console.log(chalk.yellow('\n📋 CHECKLIST DE PEÇAS OBRIGATÓRIAS:\n'));
  
  for (const [vehicleType, parts] of Object.entries(PARTS_CHECKLIST)) {
    const critical = parts.filter(p => p.priority === 'critical').length;
    const high = parts.filter(p => p.priority === 'high').length;
    const medium = parts.filter(p => p.priority === 'medium').length;
    
    console.log(chalk.gray(`   ${vehicleType.toUpperCase()}: ${parts.length} peças`));
    console.log(chalk.gray(`      Críticas: ${critical} | Alta: ${high} | Média: ${medium}`));
  }
  
  // 2. Estatísticas do banco de part numbers
  console.log(chalk.yellow('\n🔢 BANCO DE PART NUMBERS:\n'));
  
  let totalPartNumbers = 0;
  for (const [category, parts] of Object.entries(PART_NUMBERS_DATABASE)) {
    const count = Object.keys(parts).length;
    totalPartNumbers += count;
    console.log(chalk.gray(`   ${category}: ${count} part numbers`));
  }
  console.log(chalk.green(`   TOTAL: ${totalPartNumbers} part numbers cadastrados`));
  
  // 3. Estatísticas de resultados gerados
  console.log(chalk.yellow('\n📁 RESULTADOS GERADOS:\n'));
  
  if (fs.existsSync(RESULTS_DIR)) {
    const files = fs.readdirSync(RESULTS_DIR).filter(f => f.endsWith('.json'));
    console.log(chalk.gray(`   Arquivos de resultado: ${files.length}`));
    
    // Analisa amostra dos resultados
    if (files.length > 0) {
      let totalCoverage = 0;
      let totalConfidence = 0;
      let totalCompatible = 0;
      let totalMissing = 0;
      let totalShared = 0;
      
      const byType = {};
      const byCoverage = { full: 0, high: 0, medium: 0, low: 0 };
      
      for (const file of files) {
        try {
          const result = JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, file), 'utf-8'));
          
          totalCoverage += result.coverage || 0;
          totalConfidence += result.confidence || 0;
          totalCompatible += result.compatibleParts?.length || 0;
          totalMissing += result.missingParts?.length || 0;
          totalShared += result.sharedParts?.length || 0;
          
          // Por tipo
          const type = result.vehicleType || 'unknown';
          byType[type] = (byType[type] || 0) + 1;
          
          // Por cobertura
          const cov = result.coverage || 0;
          if (cov >= 1) byCoverage.full++;
          else if (cov >= 0.8) byCoverage.high++;
          else if (cov >= 0.5) byCoverage.medium++;
          else byCoverage.low++;
          
        } catch (e) {
          // Ignora erros
        }
      }
      
      const avgCoverage = (totalCoverage / files.length * 100).toFixed(1);
      const avgConfidence = (totalConfidence / files.length * 100).toFixed(1);
      
      console.log(chalk.gray(`   Cobertura média: ${avgCoverage}%`));
      console.log(chalk.gray(`   Confiança média: ${avgConfidence}%`));
      console.log(chalk.gray(`   Total peças compatíveis: ${totalCompatible}`));
      console.log(chalk.gray(`   Total peças faltantes: ${totalMissing}`));
      console.log(chalk.gray(`   Total peças compartilhadas: ${totalShared}`));
      
      console.log(chalk.cyan('\n   Por Tipo de Veículo:'));
      for (const [type, count] of Object.entries(byType)) {
        console.log(chalk.gray(`      ${type}: ${count}`));
      }
      
      console.log(chalk.cyan('\n   Por Cobertura:'));
      console.log(chalk.green(`      100%: ${byCoverage.full}`));
      console.log(chalk.blue(`      80-99%: ${byCoverage.high}`));
      console.log(chalk.yellow(`      50-79%: ${byCoverage.medium}`));
      console.log(chalk.red(`      <50%: ${byCoverage.low}`));
    }
  } else {
    console.log(chalk.gray('   Nenhum resultado gerado ainda'));
    console.log(chalk.gray('   Execute: node src/index.js generate'));
  }
  
  // 4. Progresso salvo
  console.log(chalk.yellow('\n💾 PROGRESSO SALVO:\n'));
  
  if (fs.existsSync(PROGRESS_FILE)) {
    const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    console.log(chalk.gray(`   Veículos processados: ${progress.processed?.length || 0}`));
    console.log(chalk.gray(`   Último índice: ${progress.lastIndex || 0}`));
    
    if (progress.stats) {
      console.log(chalk.gray(`   Sucesso: ${progress.stats.success || 0}`));
      console.log(chalk.gray(`   Erros: ${progress.stats.errors || 0}`));
    }
  } else {
    console.log(chalk.gray('   Nenhum progresso salvo'));
  }
  
  // 5. Arquivos de output
  console.log(chalk.yellow('\n📂 ARQUIVOS DE OUTPUT:\n'));
  
  if (fs.existsSync(OUTPUT_DIR)) {
    const outputFiles = fs.readdirSync(OUTPUT_DIR);
    for (const file of outputFiles) {
      const filePath = path.join(OUTPUT_DIR, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        const subFiles = fs.readdirSync(filePath);
        console.log(chalk.gray(`   📁 ${file}/ (${subFiles.length} arquivos)`));
      } else {
        const size = (stat.size / 1024).toFixed(1);
        console.log(chalk.gray(`   📄 ${file} (${size} KB)`));
      }
    }
  } else {
    console.log(chalk.gray('   Diretório de output não existe'));
  }
  
  console.log(chalk.cyan('\n' + '═'.repeat(60) + '\n'));
}

export default showStats;
