#!/usr/bin/env node
/**
 * Download FIPE Data
 * 
 * Baixa dados da FIPE de repositórios públicos que já coletaram os dados.
 * Isso evita o problema de rate limiting da API oficial.
 * 
 * Fontes:
 * - https://github.com/deividfortuna/fipe
 * - https://github.com/kelvins/Municipios-Brasileiros
 */

import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const CACHE_DIR = path.join(__dirname, '../cache');

// Garante diretórios
[DATA_DIR, CACHE_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// URLs de dados públicos da FIPE
const DATA_SOURCES = {
  // Repositório com dados da FIPE em JSON
  FIPE_JSON: 'https://raw.githubusercontent.com/deividfortuna/fipe/master/v2',
  // Alternativa
  FIPE_ALT: 'https://veiculos.fipe.org.br/api/veiculos',
};

const delay = (ms) => new Promise(r => setTimeout(r, ms));

console.log(chalk.cyan.bold('\n📥 Download de Dados FIPE\n'));

async function downloadBrands(type) {
  const typeMap = { CARS: 'carros', MOTOS: 'motos', TRUCKS: 'caminhoes' };
  const fipeType = typeMap[type];
  
  console.log(chalk.blue(`\n🔍 Baixando marcas de ${type}...`));
  
  try {
    // Tenta fonte principal
    const url = `${DATA_SOURCES.FIPE_JSON}/${fipeType}/marcas.json`;
    const response = await axios.get(url, { timeout: 30000 });
    
    const outputFile = path.join(DATA_DIR, `${fipeType}-marcas.json`);
    fs.writeFileSync(outputFile, JSON.stringify(response.data, null, 2));
    
    console.log(chalk.green(`   ✓ ${response.data.length} marcas salvas`));
    return response.data;
  } catch (err) {
    console.log(chalk.yellow(`   ⚠️ Fonte principal falhou: ${err.message}`));
    
    // Tenta fonte alternativa (API oficial com headers especiais)
    try {
      const response = await axios.post(
        `${DATA_SOURCES.FIPE_ALT}/ConsultarMarcas`,
        `codigoTabelaReferencia=299&codigoTipoVeiculo=${type === 'CARS' ? 1 : type === 'MOTOS' ? 2 : 3}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://veiculos.fipe.org.br/',
          },
          timeout: 30000,
        }
      );
      
      const outputFile = path.join(DATA_DIR, `${fipeType}-marcas.json`);
      fs.writeFileSync(outputFile, JSON.stringify(response.data, null, 2));
      
      console.log(chalk.green(`   ✓ ${response.data.length} marcas (fonte alt)`));
      return response.data;
    } catch (err2) {
      console.log(chalk.red(`   ❌ Falha: ${err2.message}`));
      return [];
    }
  }
}

async function main() {
  const types = ['CARS', 'MOTOS', 'TRUCKS'];
  const allBrands = {};
  
  for (const type of types) {
    const brands = await downloadBrands(type);
    allBrands[type] = brands;
    await delay(2000);
  }
  
  // Salva resumo
  const summaryFile = path.join(DATA_DIR, 'fipe-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    brands: allBrands,
  }, null, 2));
  
  console.log(chalk.green.bold(`\n✅ Download completo!`));
  console.log(chalk.gray(`   Dados salvos em: ${DATA_DIR}\n`));
}

main().catch(err => {
  console.error(chalk.red(`\n❌ Erro: ${err.message}\n`));
  process.exit(1);
});
