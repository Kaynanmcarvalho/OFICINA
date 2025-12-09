/**
 * Compatibility Service
 * Serviço de busca de peças compatíveis por veículo
 * @version 1.0.0
 */

import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { NormalizedVehicle, CompatiblePart, PartCompatibility, PartSearchFilters, MatchType } from '../types';

// Normaliza texto
const normalize = (text: string): string =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

// Calcula confiança do match
const calculateConfidence = (product: any, vehicle: NormalizedVehicle, matchType: MatchType): number => {
  switch (matchType) {
    case 'exact': return 0.99;
    case 'tecdoc': return 0.98;
    case 'oem': return 0.95;
    case 'manual': return 1.0;
    case 'aftermarket': return 0.85;
    case 'heuristic': return 0.6;
    case 'fipe': return 0.7;
    default: return 0.5;
  }
};

// Verifica compatibilidade por part number
const checkPartNumberMatch = (product: any, vehicle: NormalizedVehicle): { match: boolean; type: MatchType; confidence: number } => {
  const productPartNumbers = [
    product.sku,
    product.partNumber,
    product.oemPartNumber,
    ...(product.alternativePartNumbers || []),
  ].filter(Boolean).map(pn => normalize(String(pn)));
  
  // Aqui seria integrado com TecDoc ou catálogo OEM
  // Por enquanto, usa heurística baseada em metadados
  
  if (product.compatibleVehicles?.includes(vehicle.id)) {
    return { match: true, type: 'manual', confidence: 1.0 };
  }
  
  // Verifica se o produto tem metadados de compatibilidade
  if (product.vehicleCompatibility) {
    const compat = product.vehicleCompatibility;
    const brandMatch = compat.brands?.some((b: string) => normalize(b) === vehicle.brandNormalized);
    const modelMatch = compat.models?.some((m: string) => normalize(m) === vehicle.modelNormalized);
    
    if (brandMatch && modelMatch) {
      return { match: true, type: 'aftermarket', confidence: 0.85 };
    }
  }
  
  return { match: false, type: 'heuristic', confidence: 0 };
};

// Verifica compatibilidade por atributos (motor, cilindrada, etc)
const checkAttributeMatch = (product: any, vehicle: NormalizedVehicle): { match: boolean; type: MatchType; confidence: number } => {
  // Verifica compatibilidade por código do motor
  if (product.engineCodes && vehicle.engineCode) {
    const engineCodes = product.engineCodes.map((c: string) => normalize(c));
    if (engineCodes.includes(normalize(vehicle.engineCode))) {
      return { match: true, type: 'oem', confidence: 0.95 };
    }
  }
  
  // Verifica compatibilidade por cilindrada (para motos)
  if (vehicle.bodyType === 'motorcycle' && product.displacementRange && vehicle.displacementCc) {
    const { min, max } = product.displacementRange;
    if (vehicle.displacementCc >= min && vehicle.displacementCc <= max) {
      return { match: true, type: 'heuristic', confidence: 0.7 };
    }
  }
  
  // Verifica compatibilidade por tipo de combustível
  if (product.fuelTypes && vehicle.fuelType) {
    if (product.fuelTypes.includes(vehicle.fuelType)) {
      return { match: true, type: 'heuristic', confidence: 0.6 };
    }
  }
  
  return { match: false, type: 'heuristic', confidence: 0 };
};

// Verifica compatibilidade por texto (heurística)
const checkTextMatch = (product: any, vehicle: NormalizedVehicle): { match: boolean; type: MatchType; confidence: number } => {
  const productText = normalize(`${product.name} ${product.description || ''} ${product.tags?.join(' ') || ''}`);
  const vehicleTerms = [vehicle.brandNormalized, vehicle.modelNormalized];
  
  const matchCount = vehicleTerms.filter(term => productText.includes(term)).length;
  
  if (matchCount === 2) {
    return { match: true, type: 'heuristic', confidence: 0.65 };
  }
  
  if (matchCount === 1 && productText.includes(vehicle.modelNormalized)) {
    return { match: true, type: 'heuristic', confidence: 0.5 };
  }
  
  return { match: false, type: 'heuristic', confidence: 0 };
};

/**
 * Busca peças compatíveis com um veículo no inventário da empresa
 */
export const findCompatibleParts = async (
  vehicle: NormalizedVehicle,
  empresaId: string,
  filters: PartSearchFilters = {}
): Promise<CompatiblePart[]> => {
  const startTime = Date.now();
  
  try {
    // Busca produtos do inventário da empresa
    const productsRef = collection(db, `empresas/${empresaId}/products`);
    let q = query(productsRef);
    
    // Aplica filtros básicos
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.brand) {
      q = query(q, where('brand', '==', filters.brand));
    }
    if (filters.inStockOnly) {
      q = query(q, where('stock_total', '>', 0));
    }
    
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Verifica compatibilidade de cada produto
    const compatibleParts: CompatiblePart[] = [];
    
    for (const product of products) {
      // Tenta diferentes métodos de match
      let bestMatch = { match: false, type: 'heuristic' as MatchType, confidence: 0 };
      
      // 1. Verifica por part number
      const partNumberMatch = checkPartNumberMatch(product, vehicle);
      if (partNumberMatch.match && partNumberMatch.confidence > bestMatch.confidence) {
        bestMatch = partNumberMatch;
      }
      
      // 2. Verifica por atributos
      const attributeMatch = checkAttributeMatch(product, vehicle);
      if (attributeMatch.match && attributeMatch.confidence > bestMatch.confidence) {
        bestMatch = attributeMatch;
      }
      
      // 3. Verifica por texto
      const textMatch = checkTextMatch(product, vehicle);
      if (textMatch.match && textMatch.confidence > bestMatch.confidence) {
        bestMatch = textMatch;
      }
      
      // Se encontrou match, adiciona à lista
      if (bestMatch.match && bestMatch.confidence >= (filters.minConfidence || 0.4)) {
        // Aplica filtro de tipo de match
        if (filters.matchTypes?.length && !filters.matchTypes.includes(bestMatch.type)) {
          continue;
        }
        
        // Aplica filtro de preço
        const price = product.price || product.salePrice || 0;
        if (filters.priceMin && price < filters.priceMin) continue;
        if (filters.priceMax && price > filters.priceMax) continue;
        
        const stockAvailable = (product.stock_total || 0) - (product.stock_reserved || 0);
        
        compatibleParts.push({
          id: `${product.id}-${vehicle.id}`,
          productId: product.id,
          name: product.name,
          sku: product.sku || product.barcode || '',
          brand: product.brand,
          category: product.category,
          partNumbers: [
            product.sku,
            product.partNumber,
            product.oemPartNumber,
            ...(product.alternativePartNumbers || []),
          ].filter(Boolean),
          oemPartNumber: product.oemPartNumber,
          images: product.images || [],
          stockQuantity: stockAvailable,
          price: price,
          costPrice: product.costPrice,
          matchType: bestMatch.type,
          confidence: bestMatch.confidence,
          notes: product.notes,
          manuallyVerified: product.compatibleVehicles?.includes(vehicle.id) || false,
        });
      }
    }
    
    // Ordena por confiança (maior primeiro)
    compatibleParts.sort((a, b) => b.confidence - a.confidence);
    
    console.log(`[CompatibilityService] Found ${compatibleParts.length} compatible parts in ${Date.now() - startTime}ms`);
    
    return compatibleParts;
  } catch (error) {
    console.error('[CompatibilityService] Error finding compatible parts:', error);
    throw error;
  }
};

/**
 * Salva confirmação manual de compatibilidade
 */
export const saveManualCompatibility = async (
  empresaId: string,
  productId: string,
  vehicleId: string,
  userId: string
): Promise<void> => {
  try {
    const compatRef = doc(db, `empresas/${empresaId}/compatibilities/${productId}_${vehicleId}`);
    
    await setDoc(compatRef, {
      productId,
      vehicleId,
      matchType: 'manual',
      confidence: 1.0,
      manuallyVerified: true,
      verifiedBy: userId,
      verifiedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
    });
    
    // Atualiza o produto com o veículo compatível
    const productRef = doc(db, `empresas/${empresaId}/products/${productId}`);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const data = productSnap.data();
      const compatibleVehicles = data.compatibleVehicles || [];
      
      if (!compatibleVehicles.includes(vehicleId)) {
        await updateDoc(productRef, {
          compatibleVehicles: [...compatibleVehicles, vehicleId],
          updatedAt: Timestamp.now(),
        });
      }
    }
    
    console.log(`[CompatibilityService] Saved manual compatibility: ${productId} <-> ${vehicleId}`);
  } catch (error) {
    console.error('[CompatibilityService] Error saving manual compatibility:', error);
    throw error;
  }
};

/**
 * Remove confirmação manual de compatibilidade
 */
export const removeManualCompatibility = async (
  empresaId: string,
  productId: string,
  vehicleId: string
): Promise<void> => {
  try {
    // Remove documento de compatibilidade
    const compatRef = doc(db, `empresas/${empresaId}/compatibilities/${productId}_${vehicleId}`);
    await setDoc(compatRef, { deleted: true, deletedAt: Timestamp.now() }, { merge: true });
    
    // Remove veículo da lista do produto
    const productRef = doc(db, `empresas/${empresaId}/products/${productId}`);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const data = productSnap.data();
      const compatibleVehicles = (data.compatibleVehicles || []).filter((v: string) => v !== vehicleId);
      
      await updateDoc(productRef, {
        compatibleVehicles,
        updatedAt: Timestamp.now(),
      });
    }
    
    console.log(`[CompatibilityService] Removed manual compatibility: ${productId} <-> ${vehicleId}`);
  } catch (error) {
    console.error('[CompatibilityService] Error removing manual compatibility:', error);
    throw error;
  }
};

/**
 * Obtém categorias disponíveis para filtro
 */
export const getAvailableCategories = async (empresaId: string): Promise<string[]> => {
  try {
    const productsRef = collection(db, `empresas/${empresaId}/products`);
    const snapshot = await getDocs(productsRef);
    
    const categories = new Set<string>();
    snapshot.docs.forEach(doc => {
      const category = doc.data().category;
      if (category) categories.add(category);
    });
    
    return Array.from(categories).sort();
  } catch (error) {
    console.error('[CompatibilityService] Error getting categories:', error);
    return [];
  }
};

/**
 * Obtém marcas de peças disponíveis para filtro
 */
export const getAvailablePartBrands = async (empresaId: string): Promise<string[]> => {
  try {
    const productsRef = collection(db, `empresas/${empresaId}/products`);
    const snapshot = await getDocs(productsRef);
    
    const brands = new Set<string>();
    snapshot.docs.forEach(doc => {
      const brand = doc.data().brand;
      if (brand) brands.add(brand);
    });
    
    return Array.from(brands).sort();
  } catch (error) {
    console.error('[CompatibilityService] Error getting part brands:', error);
    return [];
  }
};
