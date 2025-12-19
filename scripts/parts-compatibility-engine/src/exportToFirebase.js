/**
 * EXPORTADOR PARA FIREBASE
 * Exporta índices de compatibilidade para Firestore
 * 
 * Estrutura no Firebase:
 * vehicles/{variantId}/compatibilityIndex
 * 
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESULTS_DIR = path.join(__dirname, '../output/results');
const EXPORT_LOG = path.join(__dirname, '../output/export-log.json');

// Configuração Firebase (será carregada do .env)
let firebaseAdmin = null;
let db = null;

/**
 * Inicializa Firebase Admin
 */
async function initFirebase() {
  if (firebaseAdmin) return;
  
  try {
    const admin = await import('firebase-admin');
    firebaseAdmin = admin.default;
    
    // Tenta carregar credenciais
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || 
      path.join(__dirname, '../../../firebase-service-account.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
      
      if (!firebaseAdmin.apps.length) {
        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(serviceAccount),
        });
      }
      
      db = firebaseAdmin.firestore();
      console.log(chalk.green('✅ Firebase inicializado com sucesso'));
    } else {
      console.log(chalk.yellow('⚠️ Arquivo de credenciais não encontrado'));
      console.log(chalk.gray(`   Esperado em: ${serviceAccountPath}`));
      console.log(chalk.gray('   Exportação será simulada (dry-run)'));
    }
  } catch (error) {
    console.log(chalk.yellow(`⚠️ Erro ao inicializar Firebase: ${error.message}`));
    console.log(chalk.gray('   Exportação será simulada (dry-run)'));
  }
}

/**
 * Prepara documento para Firestore
 */
function prepareDocument(result) {
  return {
    vehicleId: result.vehicleId,
    vehicleName: result.vehicleName,
    vehicleType: result.vehicleType,
    generatedAt: result.generatedAt,
    
    // Peças compatíveis
    compatibleParts: (result.compatibleParts || []).map(part => ({
      partTypeId: part.partTypeId,
      partTypeName: part.partTypeName,
      category: part.category,
      priority: part.priority,
      partNumber: part.partNumber || null,
      brand: part.brand || null,
      specs: part.specs || null,
      equivalents: part.equivalents || [],
      matchType: part.matchType,
      confidence: part.confidence,
      evidence: part.evidence || [],
    })),
    
    // Peças faltantes
    missingParts: (result.missingParts || []).map(part => ({
      partTypeId: part.partTypeId,
      partTypeName: part.partTypeName,
      category: part.category,
      priority: part.priority,
      reason: part.reason,
      searchedSources: part.searchedSources || [],
    })),
    
    // Peças compartilhadas
    sharedParts: (result.sharedParts || []).map(part => ({
      partNumber: part.partNumber,
      partName: part.partName,
      sharedWith: part.sharedWith || [],
      economySuggestion: part.economySuggestion || null,
    })),
    
    // Métricas
    coverage: result.coverage,
    confidence: result.confidence,
    
    // Metadata
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
  };
}

/**
 * Exporta para Firebase em lotes
 */
export async function exportToFirebase(options = {}) {
  const { dryRun = false, batchSize = 500 } = options;
  
  console.log(chalk.cyan('\n📤 Iniciando exportação para Firebase...\n'));
  console.log(chalk.gray(`   Modo: ${dryRun ? 'DRY-RUN (simulação)' : 'PRODUÇÃO'}`));
  console.log(chalk.gray(`   Tamanho do lote: ${batchSize}\n`));
  
  // Inicializa Firebase
  if (!dryRun) {
    await initFirebase();
  }
  
  // Verifica se diretório existe
  if (!fs.existsSync(RESULTS_DIR)) {
    console.log(chalk.red('❌ Diretório de resultados não encontrado!'));
    return null;
  }
  
  // Lista arquivos
  const files = fs.readdirSync(RESULTS_DIR).filter(f => f.endsWith('.json'));
  
  if (files.length === 0) {
    console.log(chalk.red('❌ Nenhum resultado encontrado para exportar!'));
    return null;
  }
  
  console.log(chalk.yellow(`📂 ${files.length} resultados para exportar\n`));
  
  // Estatísticas
  const stats = {
    total: files.length,
    exported: 0,
    errors: 0,
    skipped: 0,
    batches: 0,
  };
  
  const errors = [];
  const startTime = Date.now();
  
  // Processa em lotes
  const batches = [];
  for (let i = 0; i < files.length; i += batchSize) {
    batches.push(files.slice(i, i + batchSize));
  }
  
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchStart = Date.now();
    
    console.log(chalk.cyan(`\n═══ Lote ${batchIndex + 1}/${batches.length} ═══`));
    
    // Prepara documentos do lote
    const documents = [];
    
    for (const file of batch) {
      try {
        const filePath = path.join(RESULTS_DIR, file);
        const result = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const doc = prepareDocument(result);
        documents.push({ id: result.vehicleId, data: doc });
      } catch (error) {
        stats.errors++;
        errors.push({ file, error: error.message });
      }
    }
    
    // Exporta para Firebase
    if (!dryRun && db) {
      try {
        const writeBatch = db.batch();
        
        for (const { id, data } of documents) {
          const ref = db.collection('vehicles').doc(id).collection('compatibilityIndex').doc('current');
          writeBatch.set(ref, data, { merge: true });
        }
        
        await writeBatch.commit();
        stats.exported += documents.length;
        stats.batches++;
        
      } catch (error) {
        console.log(chalk.red(`   ❌ Erro no lote: ${error.message}`));
        stats.errors += documents.length;
        errors.push({ batch: batchIndex, error: error.message });
      }
    } else {
      // Dry run - apenas simula
      stats.exported += documents.length;
      stats.batches++;
    }
    
    // Log do lote
    const batchTime = ((Date.now() - batchStart) / 1000).toFixed(2);
    console.log(chalk.gray(`   ✓ ${documents.length} documentos em ${batchTime}s`));
    
    // Progresso
    const percent = ((stats.exported / stats.total) * 100).toFixed(1);
    console.log(chalk.yellow(`   📈 Progresso: ${percent}%`));
  }
  
  // Salva log de exportação
  const exportLog = {
    timestamp: new Date().toISOString(),
    dryRun,
    stats,
    errors: errors.slice(0, 100), // Limita a 100 erros no log
  };
  
  fs.writeFileSync(EXPORT_LOG, JSON.stringify(exportLog, null, 2));
  
  // Resumo final
  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
  
  console.log(chalk.green('\n' + '═'.repeat(60)));
  console.log(chalk.green('📤 EXPORTAÇÃO COMPLETA!'));
  console.log(chalk.green('═'.repeat(60)));
  
  console.log(chalk.cyan('\n📊 Estatísticas:'));
  console.log(chalk.gray(`   Total: ${stats.total}`));
  console.log(chalk.green(`   ✓ Exportados: ${stats.exported}`));
  console.log(chalk.red(`   ✗ Erros: ${stats.errors}`));
  console.log(chalk.gray(`   Lotes: ${stats.batches}`));
  console.log(chalk.gray(`   Tempo: ${totalTime} minutos`));
  
  if (dryRun) {
    console.log(chalk.yellow('\n⚠️ MODO DRY-RUN - Nenhum dado foi gravado no Firebase'));
    console.log(chalk.gray('   Execute sem --dry-run para gravar de verdade'));
  }
  
  console.log(chalk.gray(`\n📄 Log salvo em: ${EXPORT_LOG}\n`));
  
  return stats;
}

/**
 * Exporta índice consolidado para busca rápida
 */
export async function exportSearchIndex(options = {}) {
  const { dryRun = false } = options;
  
  console.log(chalk.cyan('\n🔍 Gerando índice de busca consolidado...\n'));
  
  if (!fs.existsSync(RESULTS_DIR)) {
    console.log(chalk.red('❌ Diretório de resultados não encontrado!'));
    return null;
  }
  
  const files = fs.readdirSync(RESULTS_DIR).filter(f => f.endsWith('.json'));
  
  // Cria índice consolidado
  const searchIndex = {
    vehicles: {},
    partNumbers: {},
    sharedParts: [],
    stats: {
      totalVehicles: 0,
      totalParts: 0,
      totalShared: 0,
    },
  };
  
  for (const file of files) {
    try {
      const filePath = path.join(RESULTS_DIR, file);
      const result = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // Índice por veículo
      searchIndex.vehicles[result.vehicleId] = {
        name: result.vehicleName,
        type: result.vehicleType,
        coverage: result.coverage,
        partsCount: result.compatibleParts?.length || 0,
      };
      
      // Índice por part number
      for (const part of result.compatibleParts || []) {
        if (part.partNumber) {
          if (!searchIndex.partNumbers[part.partNumber]) {
            searchIndex.partNumbers[part.partNumber] = {
              brand: part.brand,
              partType: part.partTypeName,
              vehicles: [],
            };
          }
          searchIndex.partNumbers[part.partNumber].vehicles.push(result.vehicleId);
        }
      }
      
      // Peças compartilhadas
      for (const shared of result.sharedParts || []) {
        searchIndex.sharedParts.push({
          partNumber: shared.partNumber,
          partName: shared.partName,
          vehicleId: result.vehicleId,
          vehicleName: result.vehicleName,
          sharedWith: shared.sharedWith,
          economySuggestion: shared.economySuggestion,
        });
      }
      
      searchIndex.stats.totalVehicles++;
      searchIndex.stats.totalParts += result.compatibleParts?.length || 0;
      
    } catch (error) {
      // Ignora erros silenciosamente
    }
  }
  
  searchIndex.stats.totalShared = searchIndex.sharedParts.length;
  
  // Salva índice local
  const indexPath = path.join(__dirname, '../output/search-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(searchIndex, null, 2));
  
  console.log(chalk.green(`✅ Índice gerado com ${searchIndex.stats.totalVehicles} veículos`));
  console.log(chalk.gray(`   Part numbers únicos: ${Object.keys(searchIndex.partNumbers).length}`));
  console.log(chalk.gray(`   Peças compartilhadas: ${searchIndex.stats.totalShared}`));
  console.log(chalk.gray(`   Salvo em: ${indexPath}`));
  
  // Exporta para Firebase se não for dry-run
  if (!dryRun && db) {
    try {
      await db.collection('partsCompatibility').doc('searchIndex').set(searchIndex);
      console.log(chalk.green('✅ Índice exportado para Firebase'));
    } catch (error) {
      console.log(chalk.red(`❌ Erro ao exportar índice: ${error.message}`));
    }
  }
  
  return searchIndex;
}

export default exportToFirebase;
