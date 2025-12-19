/**
 * EXPORTADOR DA BASE DE PEÇAS PARA FIREBASE
 * Exporta todos os part numbers e suas informações para o Firestore
 * 
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { PART_NUMBERS_DATABASE } from './config/partNumbers.js';
import { EXTENDED_PARTS_DATABASE } from './config/partNumbersExtended.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Admin
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
      return true;
    } else {
      console.log(chalk.yellow('⚠️ Arquivo de credenciais não encontrado'));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erro ao inicializar Firebase: ${error.message}`));
    return false;
  }
}

/**
 * Mapeia categoria do banco para categoria legível
 */
function getCategoryName(dbKey) {
  const categoryMap = {
    'oil_filters': 'filtros',
    'air_filters': 'filtros',
    'fuel_filters': 'filtros',
    'cabin_filters': 'filtros',
    'brake_pads': 'freios',
    'brake_discs': 'freios',
    'spark_plugs': 'ignição',
    'engine_oils': 'lubrificantes',
    'chain_kits': 'transmissão',
    'timing_belts': 'motor',
    'shock_absorbers': 'suspensão',
    'batteries': 'elétrica',
    'water_pumps': 'arrefecimento',
    'thermostats': 'arrefecimento',
    'alternators': 'elétrica',
    'starter_motors': 'elétrica',
    'engine_mounts': 'motor',
    'suspension_bushings': 'suspensão',
    'ball_joints': 'suspensão',
    'tie_rod_ends': 'suspensão',
    'fluids': 'lubrificantes',
    'clutch_kits': 'transmissão',
    'wheel_bearings': 'rolamentos',
    'cv_joints': 'transmissão',
    'motorcycle_parts': 'motos',
    'truck_parts': 'caminhões',
    'bus_parts': 'ônibus',
  };
  return categoryMap[dbKey] || 'outros';
}

/**
 * Mapeia categoria do banco para nome legível
 */
function getPartTypeName(dbKey) {
  const typeMap = {
    'oil_filters': 'Filtro de Óleo',
    'air_filters': 'Filtro de Ar',
    'fuel_filters': 'Filtro de Combustível',
    'cabin_filters': 'Filtro de Cabine',
    'brake_pads': 'Pastilhas de Freio',
    'brake_discs': 'Discos de Freio',
    'spark_plugs': 'Velas de Ignição',
    'engine_oils': 'Óleo de Motor',
    'chain_kits': 'Kit Relação',
    'timing_belts': 'Correia Dentada',
    'shock_absorbers': 'Amortecedores',
    'batteries': 'Baterias',
    'water_pumps': 'Bomba d\'Água',
    'thermostats': 'Válvula Termostática',
    'alternators': 'Alternador',
    'starter_motors': 'Motor de Arranque',
    'engine_mounts': 'Coxim do Motor',
    'suspension_bushings': 'Buchas de Suspensão',
    'ball_joints': 'Pivôs de Suspensão',
    'tie_rod_ends': 'Terminais de Direção',
    'fluids': 'Fluidos',
    'clutch_kits': 'Kit de Embreagem',
    'wheel_bearings': 'Rolamentos de Roda',
    'cv_joints': 'Juntas Homocinéticas',
    'motorcycle_parts': 'Peças de Motos',
    'truck_parts': 'Peças de Caminhões',
    'bus_parts': 'Peças de Ônibus',
  };
  return typeMap[dbKey] || dbKey;
}

/**
 * Exporta base de peças para Firebase
 */
export async function exportPartsDatabase(options = {}) {
  const { dryRun = false, batchSize = 500 } = options;
  
  console.log(chalk.cyan('\n📦 Exportando Base de Peças para Firebase...\n'));
  console.log(chalk.gray(`   Modo: ${dryRun ? 'DRY-RUN (simulação)' : 'PRODUÇÃO'}`));
  
  // Inicializa Firebase
  if (!dryRun) {
    const initialized = await initFirebase();
    if (!initialized) {
      console.log(chalk.yellow('⚠️ Continuando em modo dry-run'));
    }
  }
  
  // Combina todas as bases
  const allDatabases = {
    ...PART_NUMBERS_DATABASE,
    ...EXTENDED_PARTS_DATABASE,
  };
  
  // Estatísticas
  const stats = {
    categories: 0,
    parts: 0,
    exported: 0,
    errors: 0,
  };
  
  const allParts = [];
  
  // Processa cada categoria
  for (const [categoryKey, categoryData] of Object.entries(allDatabases)) {
    if (!categoryData || typeof categoryData !== 'object') continue;
    
    stats.categories++;
    const categoryName = getCategoryName(categoryKey);
    const partTypeName = getPartTypeName(categoryKey);
    
    console.log(chalk.cyan(`\n📂 ${partTypeName} (${categoryKey})`));
    
    // Processa cada peça na categoria
    for (const [partNumber, partData] of Object.entries(categoryData)) {
      stats.parts++;
      
      const partDoc = {
        partNumber,
        name: partTypeName,
        category: categoryName,
        categoryKey,
        brand: partData.brand || null,
        applications: partData.applications || [],
        specs: partData.specs || null,
        equivalents: partData.equivalents || [],
        position: partData.position || null,
        brands: partData.brands || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      allParts.push(partDoc);
    }
    
    console.log(chalk.gray(`   ${Object.keys(categoryData).length} peças`));
  }
  
  console.log(chalk.yellow(`\n📊 Total: ${stats.parts} peças em ${stats.categories} categorias\n`));
  
  // Exporta em lotes
  if (!dryRun && db) {
    console.log(chalk.cyan('📤 Exportando para Firebase...\n'));
    
    const batches = [];
    for (let i = 0; i < allParts.length; i += batchSize) {
      batches.push(allParts.slice(i, i + batchSize));
    }
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      
      try {
        const writeBatch = db.batch();
        
        for (const part of batch) {
          // Usa partNumber como ID do documento
          const docId = part.partNumber.replace(/[\/\\]/g, '_');
          const ref = db.collection('partsDatabase').doc(docId);
          writeBatch.set(ref, part, { merge: true });
        }
        
        await writeBatch.commit();
        stats.exported += batch.length;
        
        const percent = ((stats.exported / stats.parts) * 100).toFixed(1);
        console.log(chalk.gray(`   Lote ${batchIndex + 1}/${batches.length}: ${batch.length} peças (${percent}%)`));
        
      } catch (error) {
        console.log(chalk.red(`   ❌ Erro no lote ${batchIndex + 1}: ${error.message}`));
        stats.errors += batch.length;
      }
    }
  } else {
    stats.exported = stats.parts;
  }
  
  // Salva backup local
  const backupPath = path.join(__dirname, '../output/parts-database-backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(allParts, null, 2));
  console.log(chalk.gray(`\n💾 Backup salvo em: ${backupPath}`));
  
  // Resumo
  console.log(chalk.green('\n' + '═'.repeat(60)));
  console.log(chalk.green('📦 EXPORTAÇÃO DA BASE DE PEÇAS COMPLETA!'));
  console.log(chalk.green('═'.repeat(60)));
  
  console.log(chalk.cyan('\n📊 Estatísticas:'));
  console.log(chalk.gray(`   Categorias: ${stats.categories}`));
  console.log(chalk.gray(`   Total de peças: ${stats.parts}`));
  console.log(chalk.green(`   ✓ Exportadas: ${stats.exported}`));
  console.log(chalk.red(`   ✗ Erros: ${stats.errors}`));
  
  if (dryRun) {
    console.log(chalk.yellow('\n⚠️ MODO DRY-RUN - Nenhum dado foi gravado no Firebase'));
  }
  
  return stats;
}

/**
 * Gera estatísticas da base de peças
 */
export function getPartsStats() {
  const allDatabases = {
    ...PART_NUMBERS_DATABASE,
    ...EXTENDED_PARTS_DATABASE,
  };
  
  const stats = {
    categories: {},
    brands: new Set(),
    totalParts: 0,
    totalApplications: 0,
  };
  
  for (const [categoryKey, categoryData] of Object.entries(allDatabases)) {
    if (!categoryData || typeof categoryData !== 'object') continue;
    
    const categoryName = getPartTypeName(categoryKey);
    stats.categories[categoryName] = Object.keys(categoryData).length;
    
    for (const [partNumber, partData] of Object.entries(categoryData)) {
      stats.totalParts++;
      
      if (partData.brand) {
        stats.brands.add(partData.brand);
      }
      
      if (partData.applications) {
        stats.totalApplications += partData.applications.length;
      }
    }
  }
  
  return {
    ...stats,
    brands: Array.from(stats.brands),
    totalBrands: stats.brands.size,
  };
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const statsOnly = args.includes('--stats');
  
  if (statsOnly) {
    const stats = getPartsStats();
    console.log(chalk.cyan('\n📊 Estatísticas da Base de Peças:\n'));
    console.log(chalk.gray(`   Total de peças: ${stats.totalParts}`));
    console.log(chalk.gray(`   Total de aplicações: ${stats.totalApplications}`));
    console.log(chalk.gray(`   Marcas: ${stats.totalBrands}`));
    console.log(chalk.cyan('\n   Por categoria:'));
    for (const [cat, count] of Object.entries(stats.categories)) {
      console.log(chalk.gray(`     ${cat}: ${count}`));
    }
  } else {
    exportPartsDatabase({ dryRun });
  }
}

export default exportPartsDatabase;
