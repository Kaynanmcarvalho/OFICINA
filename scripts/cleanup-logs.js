#!/usr/bin/env node
/**
 * Script de limpeza de console.logs
 * Remove console.log, console.warn e console.debug
 * Mantém apenas console.error para debugging de produção
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIRECTORIES_TO_SCAN = ['src'];
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
const EXCLUDE_PATTERNS = ['node_modules', 'dist', 'build', '.git'];

// Padrões a remover (mais seguros)
const PATTERNS_TO_REMOVE = [
  // console.log com ponto e vírgula
  /console\.log\([^)]*\);\s*\n?/g,
  // console.warn com ponto e vírgula
  /console\.warn\([^)]*\);\s*\n?/g,
  // console.debug com ponto e vírgula
  /console\.debug\([^)]*\);\s*\n?/g,
];

// Arquivos a ignorar (utilitários de debug)
const IGNORE_FILES = [
  'debugLogger.js',
  'vehicleImageDebug.js'
];

let filesProcessed = 0;
let logsRemoved = 0;

function shouldProcessFile(filePath) {
  const fileName = path.basename(filePath);
  
  // Ignorar arquivos específicos
  if (IGNORE_FILES.includes(fileName)) {
    return false;
  }
  
  // Verificar extensão
  const ext = path.extname(filePath);
  if (!EXTENSIONS.includes(ext)) {
    return false;
  }
  
  // Verificar padrões de exclusão
  for (const pattern of EXCLUDE_PATTERNS) {
    if (filePath.includes(pattern)) {
      return false;
    }
  }
  
  return true;
}

function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let removedCount = 0;
    
    // Remover cada padrão
    for (const pattern of PATTERNS_TO_REMOVE) {
      const matches = content.match(pattern);
      if (matches) {
        removedCount += matches.length;
        content = content.replace(pattern, '');
      }
    }
    
    // Remover linhas vazias extras
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    // Salvar apenas se houve mudanças
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ ${filePath}: ${removedCount} logs removidos`);
      logsRemoved += removedCount;
      filesProcessed++;
    }
  } catch (error) {
    console.error(`✗ Erro ao processar ${filePath}:`, error.message);
  }
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Verificar se deve processar diretório
      let shouldProcess = true;
      for (const pattern of EXCLUDE_PATTERNS) {
        if (entry.name.includes(pattern)) {
          shouldProcess = false;
          break;
        }
      }
      
      if (shouldProcess) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && shouldProcessFile(fullPath)) {
      cleanFile(fullPath);
    }
  }
}

console.log('🧹 Iniciando limpeza de console.logs...\n');

const rootDir = path.resolve(__dirname, '..');

for (const dir of DIRECTORIES_TO_SCAN) {
  const fullPath = path.join(rootDir, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`📂 Escaneando: ${dir}`);
    scanDirectory(fullPath);
  }
}

console.log(`\n✅ Limpeza concluída!`);
console.log(`   Arquivos processados: ${filesProcessed}`);
console.log(`   Logs removidos: ${logsRemoved}`);
