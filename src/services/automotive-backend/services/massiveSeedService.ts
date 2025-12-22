/**
 * TORQ Automotive Backend - Massive Seed Service
 * Sincroniza a base completa de veículos brasileiros com o Firebase
 * 
 * IMPORTANTE: Usa APENAS códigos OEM REAIS do realPartsDatabase.ts
 * 
 * @version 2.0.0 - Integrado com realPartsDatabase
 */

import { Timestamp, writeBatch, doc, collection, getDocs, query, limit, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { VehicleType, PartCategory, PartOrigin } from '../types';
import { BRAZILIAN_VEHICLES_DATABASE, TOTAL_VARIANTS } from '../../../features/vehicle-parts-search/data/brazilianVehicles';
import { 
  ALL_REAL_PARTS, 
  getDatabaseStats,
  type RealPart 
} from '../data/realPartsDatabase';

// ============================================================================
// CONSTANTS
// ============================================================================

const COLLECTIONS = {
  VEHICLES: 'torq_vehicles',
  PARTS: 'torq_parts',
  SHARED_PARTS: 'torq_shared_parts',
};

const BATCH_SIZE = 400; // Firebase limit is 500

// ============================================================================
// VEHICLE TYPE MAPPING
// ============================================================================

const mapVehicleType = (type: string): VehicleType => {
  switch (type?.toLowerCase()) {
    case 'motorcycle': return VehicleType.MOTORCYCLE;
    case 'car': return VehicleType.CAR;
    case 'suv': return VehicleType.SUV;
    case 'pickup': return VehicleType.CAR;
    case 'van': return VehicleType.VAN;
    case 'truck': return VehicleType.TRUCK;
    case 'bus': return VehicleType.BUS;
    default: return VehicleType.CAR;
  }
};

// ============================================================================
// CONVERT REAL PARTS TO FIREBASE FORMAT
// ============================================================================

interface FirebasePartDoc {
  id: string;
  name: string;
  category: PartCategory;
  oemPartNumber: string;
  alternativePartNumbers: string[];
  manufacturer: string;
  origin: PartOrigin;
  specs: Record<string, any>;
  compatibleVehicleIds: string[];
  totalCompatibleVehicles: number;
  confidenceScore: number;
  validationSources: string[];
  lastValidatedAt: any;
  createdAt: any;
  updatedAt: any;
}

function convertRealPartToFirebaseDoc(realPart: RealPart, compatibleVehicleIds: string[]): FirebasePartDoc {
  return {
    id: realPart.id,
    name: realPart.name,
    category: realPart.category,
    oemPartNumber: realPart.oemCode,
    alternativePartNumbers: realPart.equivalents.map(eq => `${eq.brand} ${eq.code}`),
    manufacturer: realPart.manufacturer,
    origin: realPart.origin,
    specs: realPart.specs || {},
    compatibleVehicleIds: compatibleVehicleIds.slice(0, 1000),
    totalCompatibleVehicles: compatibleVehicleIds.length,
    confidenceScore: realPart.confidenceScore,
    validationSources: realPart.validationSources,
    lastValidatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

// ============================================================================
// FIND COMPATIBLE VEHICLES FOR A PART
// ============================================================================

function findCompatibleVehicleIds(realPart: RealPart): string[] {
  const compatibleIds: string[] = [];
  
  for (const vehicle of BRAZILIAN_VEHICLES_DATABASE) {
    // Check if this vehicle matches any compatibility entry
    const isCompatible = realPart.compatibility.some(compat => {
      const brandMatch = vehicle.brand.toUpperCase() === compat.brand.toUpperCase();
      
      const modelMatch = 
        vehicle.model.toUpperCase().includes(compat.model.toUpperCase()) ||
        compat.model.toUpperCase().includes(vehicle.model.toUpperCase());
      
      const yearMatch = vehicle.year >= compat.yearStart && vehicle.year <= compat.yearEnd;
      
      // Engine code match (if specified)
      const engineMatch = !compat.engineCode || !vehicle.engineCode ||
        vehicle.engineCode.toUpperCase().includes(compat.engineCode.toUpperCase()) ||
        compat.engineCode.toUpperCase().includes(vehicle.engineCode?.toUpperCase() || '');
      
      return brandMatch && modelMatch && yearMatch && engineMatch;
    });
    
    if (isCompatible) {
      compatibleIds.push(vehicle.id);
    }
  }
  
  return compatibleIds;
}

// ============================================================================
// MAIN SEED FUNCTION - SINCRONIZA TUDO COM FIREBASE
// ============================================================================

export interface MassiveSeedResult {
  success: boolean;
  vehiclesProcessed: number;
  vehiclesSaved: number;
  partsProcessed: number;
  partsSaved: number;
  errors: string[];
  duration: number;
}

export async function massiveSeedDatabase(
  onProgress?: (progress: { phase: string; current: number; total: number }) => void
): Promise<MassiveSeedResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  let vehiclesSaved = 0;
  let partsSaved = 0;

  console.log('[MassiveSeed] 🚀 Iniciando sincronização massiva com dados REAIS...');
  console.log(`[MassiveSeed] Total de veículos na base local: ${TOTAL_VARIANTS}`);
  
  const dbStats = getDatabaseStats();
  console.log(`[MassiveSeed] Total de peças REAIS: ${dbStats.totalParts}`);
  console.log(`[MassiveSeed] Marcas cobertas: ${Object.keys(dbStats.partsByBrand).join(', ')}`);

  // ============================================================================
  // FASE 1: SALVAR VEÍCULOS EM BATCHES
  // ============================================================================
  console.log('[MassiveSeed] 📦 Fase 1: Salvando veículos...');
  
  const totalBatches = Math.ceil(BRAZILIAN_VEHICLES_DATABASE.length / BATCH_SIZE);
  
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const start = batchIndex * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, BRAZILIAN_VEHICLES_DATABASE.length);
    const batchVehicles = BRAZILIAN_VEHICLES_DATABASE.slice(start, end);
    
    onProgress?.({
      phase: 'Salvando veículos',
      current: end,
      total: BRAZILIAN_VEHICLES_DATABASE.length,
    });

    try {
      const batch = writeBatch(db);
      
      for (const vehicle of batchVehicles) {
        const vehicleDoc = {
          id: vehicle.id,
          brand: vehicle.brand.toUpperCase(),
          model: vehicle.model,
          year: vehicle.year,
          vehicleType: mapVehicleType(vehicle.vehicleType),
          trim: vehicle.trim || null,
          engineCode: vehicle.engineCode || null,
          engineName: vehicle.engineName || null,
          fuelType: vehicle.fuel || 'flex',
          power: vehicle.power || null,
          displacementCc: vehicle.displacementCc || null,
          transmission: vehicle.transmission || null,
          bodyType: vehicle.bodyType || null,
          checklistVersion: '2.0.0',
          checklistCompletion: 0,
          confidenceScore: 90,
          lastValidatedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        
        const docRef = doc(db, COLLECTIONS.VEHICLES, vehicle.id);
        batch.set(docRef, vehicleDoc, { merge: true });
      }
      
      await batch.commit();
      vehiclesSaved += batchVehicles.length;
      
      console.log(`[MassiveSeed] ✅ Batch ${batchIndex + 1}/${totalBatches}: ${batchVehicles.length} veículos salvos`);
    } catch (err: any) {
      console.error(`[MassiveSeed] ❌ Erro no batch ${batchIndex + 1}:`, err);
      errors.push(`Batch ${batchIndex + 1}: ${err.message}`);
    }
    
    // Pequena pausa entre batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // ============================================================================
  // FASE 2: SALVAR PEÇAS REAIS E VINCULAR AOS VEÍCULOS
  // ============================================================================
  console.log('[MassiveSeed] 🔧 Fase 2: Salvando peças REAIS e vinculando...');
  
  onProgress?.({
    phase: 'Processando peças REAIS',
    current: 0,
    total: ALL_REAL_PARTS.length,
  });

  for (let i = 0; i < ALL_REAL_PARTS.length; i++) {
    const realPart = ALL_REAL_PARTS[i];
    
    onProgress?.({
      phase: 'Processando peças REAIS',
      current: i + 1,
      total: ALL_REAL_PARTS.length,
    });

    try {
      // Encontrar veículos compatíveis
      const compatibleVehicleIds = findCompatibleVehicleIds(realPart);
      
      // Converter para formato Firebase
      const partDoc = convertRealPartToFirebaseDoc(realPart, compatibleVehicleIds);

      // Salvar no Firebase
      const docRef = doc(db, COLLECTIONS.PARTS, realPart.id);
      await setDoc(docRef, partDoc, { merge: true });
      
      partsSaved++;
      
      console.log(`[MassiveSeed] ✅ ${realPart.name} (${realPart.oemCode}): ${compatibleVehicleIds.length} veículos`);
    } catch (err: any) {
      console.error(`[MassiveSeed] ❌ Erro na peça ${realPart.id}:`, err);
      errors.push(`Peça ${realPart.id}: ${err.message}`);
    }
  }

  const duration = Date.now() - startTime;
  
  console.log('[MassiveSeed] 🎉 Sincronização concluída!');
  console.log(`[MassiveSeed] Veículos: ${vehiclesSaved}/${BRAZILIAN_VEHICLES_DATABASE.length}`);
  console.log(`[MassiveSeed] Peças REAIS: ${partsSaved}/${ALL_REAL_PARTS.length}`);
  console.log(`[MassiveSeed] Duração: ${(duration / 1000).toFixed(1)}s`);
  console.log(`[MassiveSeed] Erros: ${errors.length}`);

  return {
    success: errors.length === 0,
    vehiclesProcessed: BRAZILIAN_VEHICLES_DATABASE.length,
    vehiclesSaved,
    partsProcessed: ALL_REAL_PARTS.length,
    partsSaved,
    errors,
    duration,
  };
}

// ============================================================================
// CHECK SEED STATUS
// ============================================================================

export async function checkMassiveSeedStatus(): Promise<{
  isSeeded: boolean;
  vehicleCount: number;
  partCount: number;
  lastSeedDate?: Date;
  needsUpdate: boolean;
}> {
  try {
    const vehiclesQuery = query(collection(db, COLLECTIONS.VEHICLES), limit(1));
    const vehiclesSnapshot = await getDocs(vehiclesQuery);
    
    const partsQuery = query(collection(db, COLLECTIONS.PARTS), limit(1));
    const partsSnapshot = await getDocs(partsQuery);
    
    const hasVehicles = !vehiclesSnapshot.empty;
    const hasParts = !partsSnapshot.empty;
    
    // Check if we need to update (if parts count doesn't match real database)
    let needsUpdate = false;
    if (hasParts) {
      // Check if first part has real OEM code format
      const firstPart = partsSnapshot.docs[0].data();
      const oemCode = firstPart.oemPartNumber || '';
      // Real OEM codes have specific patterns (e.g., "25100-2B700", "04E 115 561 H")
      // Fake codes have patterns like "WP-HK001", "TH-HK001"
      const isFakeCode = /^[A-Z]{2}-[A-Z]{2}\d{3}$/.test(oemCode);
      needsUpdate = isFakeCode;
      
      if (needsUpdate) {
        console.log('[MassiveSeed] ⚠️ Dados antigos detectados, precisa atualizar');
      }
    }
    
    return {
      isSeeded: hasVehicles && hasParts && !needsUpdate,
      vehicleCount: hasVehicles ? TOTAL_VARIANTS : 0,
      partCount: hasParts ? ALL_REAL_PARTS.length : 0,
      needsUpdate,
    };
  } catch (err) {
    console.error('[MassiveSeed] Erro ao verificar status:', err);
    return {
      isSeeded: false,
      vehicleCount: 0,
      partCount: 0,
      needsUpdate: true,
    };
  }
}

// ============================================================================
// CLEAR OLD PARTS DATA
// ============================================================================

export async function clearOldPartsData(): Promise<void> {
  console.log('[MassiveSeed] 🗑️ Limpando dados antigos de peças...');
  
  try {
    const partsSnapshot = await getDocs(collection(db, COLLECTIONS.PARTS));
    
    const batch = writeBatch(db);
    let count = 0;
    
    for (const docSnap of partsSnapshot.docs) {
      batch.delete(docSnap.ref);
      count++;
      
      // Commit in batches of 400
      if (count % 400 === 0) {
        await batch.commit();
        console.log(`[MassiveSeed] Deletados ${count} documentos...`);
      }
    }
    
    // Commit remaining
    if (count % 400 !== 0) {
      await batch.commit();
    }
    
    console.log(`[MassiveSeed] ✅ ${count} documentos de peças removidos`);
  } catch (err) {
    console.error('[MassiveSeed] Erro ao limpar dados:', err);
    throw err;
  }
}

// ============================================================================
// FORCE RESEED WITH REAL DATA
// ============================================================================

export async function forceReseedWithRealData(
  onProgress?: (progress: { phase: string; current: number; total: number }) => void
): Promise<MassiveSeedResult> {
  console.log('[MassiveSeed] 🔄 Forçando re-seed com dados REAIS...');
  
  // Clear old parts first
  onProgress?.({ phase: 'Limpando dados antigos...', current: 0, total: 100 });
  await clearOldPartsData();
  
  // Run the seed with real data
  return massiveSeedDatabase(onProgress);
}

// ============================================================================
// GET DATABASE STATS
// ============================================================================

export function getLocalDatabaseStats() {
  const realPartsStats = getDatabaseStats();
  
  const stats = {
    totalVehicles: TOTAL_VARIANTS,
    totalParts: realPartsStats.totalParts,
    realPartsBrands: Object.keys(realPartsStats.partsByBrand),
    realPartsCategories: Object.keys(realPartsStats.partsByCategory),
    averageEquivalentsPerPart: realPartsStats.averageEquivalentsPerPart,
    byBrand: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    byYear: {} as Record<number, number>,
  };

  for (const vehicle of BRAZILIAN_VEHICLES_DATABASE) {
    stats.byBrand[vehicle.brand] = (stats.byBrand[vehicle.brand] || 0) + 1;
    stats.byType[vehicle.vehicleType] = (stats.byType[vehicle.vehicleType] || 0) + 1;
    stats.byYear[vehicle.year] = (stats.byYear[vehicle.year] || 0) + 1;
  }

  return stats;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  massiveSeedDatabase,
  checkMassiveSeedStatus,
  getLocalDatabaseStats,
  clearOldPartsData,
  forceReseedWithRealData,
};
