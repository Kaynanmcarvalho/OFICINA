/**
 * Script de Verificação - Imports do Framer Motion
 * Execução: node scripts/checkMotionImports.js
 * 
 * Verifica se todos os componentes têm os imports corretos do motion
 * para evitar erros causados por autofix
 */

const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Arquivos que devem ter motion
const files = [
  {
    path: 'src/pages/inventory/InventoryPage.jsx',
    needsMotion: true,
    needsAnimatePresence: true
  },
  {
    path: 'src/components/inventory/VehicleSelector.jsx',
    needsMotion: true,
    needsAnimatePresence: true
  },
  {
    path: 'src/components/inventory/CompatiblePartsList.jsx',
    needsMotion: true,
    needsAnimatePresence: false
  },
  {
    path: 'src/components/inventory/EvidenceModal.jsx',
    needsMotion: true,
    needsAnimatePresence: true
  },
  {
    path: 'src/components/inventory/VehicleCompatibilitySearch.jsx',
    needsMotion: true,
    needsAnimatePresence: true
  }
];

let errors = 0;
let warnings = 0;

log('\n🔍 VERIFICANDO IMPORTS DO FRAMER MOTION\n', 'cyan');

files.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  
  // Verificar se arquivo existe
  if (!fs.existsSync(filePath)) {
    log(`❌ ${file.path}: Arquivo não encontrado`, 'red');
    errors++;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(file.path);
  
  // Verificar import do motion
  if (file.needsMotion) {
    const hasMotionImport = content.includes('import { motion') || 
                           content.includes('import {motion');
    
    if (!hasMotionImport) {
      log(`❌ ${fileName}: Import do 'motion' ausente`, 'red');
      errors++;
    } else {
      log(`✓ ${fileName}: Import do 'motion' OK`, 'green');
    }
  }
  
  // Verificar import do AnimatePresence
  if (file.needsAnimatePresence) {
    const hasAnimatePresence = content.includes('AnimatePresence');
    
    if (!hasAnimatePresence) {
      log(`❌ ${fileName}: Import do 'AnimatePresence' ausente`, 'red');
      errors++;
    }
  }
  
  // Verificar variável forçada (recomendado)
  const hasMotionDiv = content.includes('MotionDiv = motion.div') ||
                       content.includes('MotionDiv=motion.div');
  
  if (file.needsMotion && !hasMotionDiv) {
    log(`⚠️  ${fileName}: Variável forçada 'MotionDiv' ausente (recomendado)`, 'yellow');
    warnings++;
  }
  
  // Verificar uso de motion.div direto
  const usesMotionDirect = content.includes('<motion.div');
  const usesMotionVar = content.includes('<MotionDiv');
  
  if (file.needsMotion && !usesMotionDirect && !usesMotionVar) {
    log(`⚠️  ${fileName}: Nenhum uso de motion detectado`, 'yellow');
    warnings++;
  }
});

// Resumo
log('\n' + '='.repeat(50), 'cyan');
log('📊 RESUMO DA VERIFICAÇÃO', 'cyan');
log('='.repeat(50), 'cyan');
log(`Arquivos verificados: ${files.length}`, 'cyan');
log(`Erros: ${errors}`, errors > 0 ? 'red' : 'green');
log(`Avisos: ${warnings}`, warnings > 0 ? 'yellow' : 'green');
log('='.repeat(50) + '\n', 'cyan');

if (errors > 0) {
  log('❌ VERIFICAÇÃO FALHOU', 'red');
  log('Corrija os imports antes de continuar.\n', 'red');
  log('Solução:', 'yellow');
  log('1. Adicione: import { motion, AnimatePresence } from \'framer-motion\';', 'yellow');
  log('2. Adicione no componente: const MotionDiv = motion.div;\n', 'yellow');
  process.exit(1);
} else if (warnings > 0) {
  log('⚠️  VERIFICAÇÃO PASSOU COM AVISOS', 'yellow');
  log('Considere adicionar variáveis forçadas para proteção.\n', 'yellow');
  process.exit(0);
} else {
  log('✅ VERIFICAÇÃO PASSOU', 'green');
  log('Todos os imports estão corretos!\n', 'green');
  process.exit(0);
}
