/**
 * TORQ Automotive Backend - Firebase Parts Service
 * Serviço de persistência e consulta de peças no Firebase
 * 
 * PRINCÍPIO: Consultar Firebase primeiro, só buscar externamente se não existir
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { VehicleType, PartCategory, PartOrigin } from '../types';
import { getChecklistForVehicle } from '../constants/checklists';

// ============================================================================
// INTERFACES
// ============================================================================

export interface FirebaseVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  yearEnd?: number;
  vehicleType: VehicleType;
  trim?: string;
  engineCode?: string;
  engineName?: string;
  fuelType: string;
  
  // Metadados
  checklistVersion: string;
  checklistCompletion: number; // 0-100%
  lastValidatedAt: Timestamp;
  confidenceScore: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebasePart {
  id: string;
  name: string;
  category: PartCategory;
  subcategory?: string;
  
  // Part Numbers
  oemPartNumber: string;
  alternativePartNumbers: string[];
  
  // Fabricante
  manufacturer: string;
  origin: PartOrigin;
  
  // Especificações
  specs: Record<string, any>;
  
  // Compatibilidade
  compatibleVehicleIds: string[];
  
  // Metadados
  confidenceScore: number;
  validationSources: string[];
  lastValidatedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseVehicleParts {
  vehicleId: string;
  checklistVersion: string;
  completionPercentage: number;
  parts: {
    checklistItemId: string;
    checklistItemName: string;
    category: PartCategory;
    status: 'found' | 'not_found' | 'partial';
    foundParts: {
      partId: string;
      partNumber: string;
      manufacturer: string;
      origin: PartOrigin;
      confidenceScore: number;
    }[];
  }[];
  lastValidatedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SharedPart {
  id: string;
  partNumber: string;
  name: string;
  vehicleIds: string[];
  vehicleNames: string[];
  technicalReason: string;
  confidenceScore: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// COLLECTION NAMES
// ============================================================================

const COLLECTIONS = {
  VEHICLES: 'torq_vehicles',
  PARTS: 'torq_parts',
  VEHICLE_PARTS: 'torq_vehicle_parts',
  SHARED_PARTS: 'torq_shared_parts',
};

// ============================================================================
// VEHICLE OPERATIONS
// ============================================================================

/**
 * Busca um veículo no Firebase pelo ID
 */
export async function getVehicleById(vehicleId: string): Promise<FirebaseVehicle | null> {
  try {
    const docRef = doc(db, COLLECTIONS.VEHICLES, vehicleId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirebaseVehicle;
    }
    return null;
  } catch (error) {
    console.error('[FirebasePartsService] Error getting vehicle:', error);
    return null;
  }
}

/**
 * Busca veículos por marca/modelo/ano
 */
export async function searchVehicles(params: {
  brand?: string;
  model?: string;
  year?: number;
  vehicleType?: VehicleType;
}): Promise<FirebaseVehicle[]> {
  try {
    let q = collection(db, COLLECTIONS.VEHICLES);
    const constraints: any[] = [];
    
    if (params.brand) {
      constraints.push(where('brand', '==', params.brand.toUpperCase()));
    }
    if (params.model) {
      constraints.push(where('model', '==', params.model.toUpperCase()));
    }
    if (params.year) {
      constraints.push(where('year', '<=', params.year));
      constraints.push(where('yearEnd', '>=', params.year));
    }
    if (params.vehicleType) {
      constraints.push(where('vehicleType', '==', params.vehicleType));
    }
    
    constraints.push(limit(50));
    
    const queryRef = query(q, ...constraints);
    const snapshot = await getDocs(queryRef);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseVehicle));
  } catch (error) {
    console.error('[FirebasePartsService] Error searching vehicles:', error);
    return [];
  }
}

/**
 * Salva ou atualiza um veículo no Firebase
 */
export async function saveVehicle(vehicle: Omit<FirebaseVehicle, 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = doc(db, COLLECTIONS.VEHICLES, vehicle.id);
    const existing = await getDoc(docRef);
    
    const now = Timestamp.now();
    
    if (existing.exists()) {
      await updateDoc(docRef, {
        ...vehicle,
        updatedAt: now,
      });
    } else {
      await setDoc(docRef, {
        ...vehicle,
        createdAt: now,
        updatedAt: now,
      });
    }
    
    return vehicle.id;
  } catch (error) {
    console.error('[FirebasePartsService] Error saving vehicle:', error);
    throw error;
  }
}

// ============================================================================
// PARTS OPERATIONS
// ============================================================================

/**
 * Busca uma peça pelo part number
 */
export async function getPartByNumber(partNumber: string): Promise<FirebasePart | null> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PARTS),
      where('oemPartNumber', '==', partNumber.toUpperCase())
    );

    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as FirebasePart;
    }
    
    // Buscar também nos part numbers alternativos
    const qAlt = query(
      collection(db, COLLECTIONS.PARTS),
      where('alternativePartNumbers', 'array-contains', partNumber.toUpperCase())
    );

    const snapshotAlt = await getDocs(qAlt);
    
    if (!snapshotAlt.empty) {
      const doc = snapshotAlt.docs[0];
      return { id: doc.id, ...doc.data() } as FirebasePart;
    }
    
    return null;
  } catch (error) {
    console.error('[FirebasePartsService] Error getting part:', error);
    return null;
  }
}

/**
 * Busca peças compatíveis com um veículo
 */
export async function getPartsForVehicle(vehicleId: string): Promise<FirebasePart[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PARTS),
      where('compatibleVehicleIds', 'array-contains', vehicleId)
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebasePart));
  } catch (error) {
    console.error('[FirebasePartsService] Error getting parts for vehicle:', error);
    return [];
  }
}

/**
 * Busca peças por categoria
 */
export async function getPartsByCategory(
  vehicleId: string, 
  category: PartCategory
): Promise<FirebasePart[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PARTS),
      where('compatibleVehicleIds', 'array-contains', vehicleId),
      where('category', '==', category)
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebasePart));
  } catch (error) {
    console.error('[FirebasePartsService] Error getting parts by category:', error);
    return [];
  }
}

/**
 * Salva uma peça no Firebase
 */
export async function savePart(part: Omit<FirebasePart, 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = doc(db, COLLECTIONS.PARTS, part.id);
    const existing = await getDoc(docRef);
    
    const now = Timestamp.now();
    
    if (existing.exists()) {
      await updateDoc(docRef, {
        ...part,
        updatedAt: now,
      });
    } else {
      await setDoc(docRef, {
        ...part,
        createdAt: now,
        updatedAt: now,
      });
    }
    
    return part.id;
  } catch (error) {
    console.error('[FirebasePartsService] Error saving part:', error);
    throw error;
  }
}

/**
 * Salva múltiplas peças em batch
 */
export async function savePartsBatch(parts: Omit<FirebasePart, 'createdAt' | 'updatedAt'>[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    const now = Timestamp.now();
    
    for (const part of parts) {
      const docRef = doc(db, COLLECTIONS.PARTS, part.id);
      batch.set(docRef, {
        ...part,
        createdAt: now,
        updatedAt: now,
      }, { merge: true });
    }
    
    await batch.commit();
  } catch (error) {
    console.error('[FirebasePartsService] Error saving parts batch:', error);
    throw error;
  }
}

// ============================================================================
// VEHICLE PARTS CHECKLIST OPERATIONS
// ============================================================================

/**
 * Busca o checklist de peças de um veículo
 */
export async function getVehiclePartsChecklist(vehicleId: string): Promise<FirebaseVehicleParts | null> {
  try {
    const docRef = doc(db, COLLECTIONS.VEHICLE_PARTS, vehicleId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { vehicleId: docSnap.id, ...docSnap.data() } as FirebaseVehicleParts;
    }
    return null;
  } catch (error) {
    console.error('[FirebasePartsService] Error getting vehicle parts checklist:', error);
    return null;
  }
}

/**
 * Salva o checklist de peças de um veículo
 */
export async function saveVehiclePartsChecklist(data: FirebaseVehicleParts): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.VEHICLE_PARTS, data.vehicleId);
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('[FirebasePartsService] Error saving vehicle parts checklist:', error);
    throw error;
  }
}

// ============================================================================
// SHARED PARTS OPERATIONS
// ============================================================================

/**
 * Busca peças compartilhadas por part number
 */
export async function getSharedPartsByNumber(partNumber: string): Promise<SharedPart | null> {
  try {
    const q = query(
      collection(db, COLLECTIONS.SHARED_PARTS),
      where('partNumber', '==', partNumber.toUpperCase())
    );

    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as SharedPart;
    }
    return null;
  } catch (error) {
    console.error('[FirebasePartsService] Error getting shared parts:', error);
    return null;
  }
}

/**
 * Registra uma peça compartilhada entre veículos
 */
export async function registerSharedPart(data: Omit<SharedPart, 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.SHARED_PARTS, data.id);
    const existing = await getDoc(docRef);
    
    const now = Timestamp.now();
    
    if (existing.exists()) {
      // Merge vehicle IDs
      const existingData = existing.data() as SharedPart;
      const mergedVehicleIds = [...new Set([...existingData.vehicleIds, ...data.vehicleIds])];
      const mergedVehicleNames = [...new Set([...existingData.vehicleNames, ...data.vehicleNames])];
      
      await updateDoc(docRef, {
        vehicleIds: mergedVehicleIds,
        vehicleNames: mergedVehicleNames,
        confidenceScore: Math.max(existingData.confidenceScore, data.confidenceScore),
        updatedAt: now,
      });
    } else {
      await setDoc(docRef, {
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (error) {
    console.error('[FirebasePartsService] Error registering shared part:', error);
    throw error;
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Verifica se um veículo tem dados completos no Firebase
 */
export async function isVehicleComplete(vehicleId: string): Promise<{
  isComplete: boolean;
  completionPercentage: number;
  missingCategories: PartCategory[];
}> {
  try {
    const vehicle = await getVehicleById(vehicleId);
    if (!vehicle) {
      return { isComplete: false, completionPercentage: 0, missingCategories: [] };
    }
    
    const checklist = await getVehiclePartsChecklist(vehicleId);
    if (!checklist) {
      return { isComplete: false, completionPercentage: 0, missingCategories: [] };
    }
    
    const vehicleChecklist = getChecklistForVehicle(vehicle.vehicleType);
    const requiredCategories = vehicleChecklist.categories
      .filter(c => c.isRequired)
      .map(c => c.category);
    
    const foundCategories = checklist.parts
      .filter(p => p.status === 'found')
      .map(p => p.category);
    
    const missingCategories = requiredCategories.filter(c => !foundCategories.includes(c));
    
    return {
      isComplete: missingCategories.length === 0,
      completionPercentage: checklist.completionPercentage,
      missingCategories,
    };
  } catch (error) {
    console.error('[FirebasePartsService] Error checking vehicle completion:', error);
    return { isComplete: false, completionPercentage: 0, missingCategories: [] };
  }
}

/**
 * Gera um ID único para veículo baseado em suas características
 */
export function generateVehicleId(brand: string, model: string, year: number, trim?: string): string {
  const base = `${brand}_${model}_${year}`.toUpperCase().replace(/\s+/g, '_');
  if (trim) {
    return `${base}_${trim.toUpperCase().replace(/\s+/g, '_')}`;
  }
  return base;
}

/**
 * Gera um ID único para peça baseado no part number
 */
export function generatePartId(partNumber: string, manufacturer: string): string {
  return `${manufacturer}_${partNumber}`.toUpperCase().replace(/\s+/g, '_');
}
