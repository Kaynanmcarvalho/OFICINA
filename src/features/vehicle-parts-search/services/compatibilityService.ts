/**
 * Compatibility Service
 * Serviço de busca de peças compatíveis por veículo
 * @version 2.0.0
 */

import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { VehicleVariant, CompatiblePart, PartSearchFilters, MatchType, MatchTrace, DataSource } from '../types';

// Normaliza texto
const normalize = (text: string): string =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

// Calcula confiança do match
const calculateConfidence = (matchType: MatchType): number => {
  switch (matchType) {
    case 'exact': return 0.99;
    case 'tecdoc': return 0.98;
    case 'oem': return 0.95;
    case 'manual': return 1.0;
    case 'aftermarket': return 0.85;
    case 'attributes': return 0.80;
    case 'heuristic': return 0.60;
    case 'fipe': return 0.70;
    default: return 0.50;
  }
};

// Verifica compatibilidade por part number
const checkPartNumberMatch = (product: any, variant: VehicleVariant): MatchTrace | null => {
  // Verifica se produto tem compatibilidade manual com este veículo
  if (product.compatibleVehicles?.includes(variant.id)) {
    return {
      type: 'manual',
      source: 'manual',
      reason: `Compatibilidade confirmada manualmente para ${variant.brand} ${variant.model} ${variant.year}`,
    };
  }
  
  // Verifica metadados de compatibilidade do produto
  if (product.vehicleCompatibility) {
    const compat = product.vehicleCompatibility;
    const brandMatch = compat.brands?.some((b: string) => normalize(b) === normalize(variant.brand));
    const modelMatch = compat.models?.some((m: string) => normalize(m) === normalize(variant.model));
    
    if (brandMatch && modelMatch) {
      return {
        type: 'aftermarket',
        source: 'aftermarket',
        reason: `Match por catálogo aftermarket: ${variant.brand} ${variant.model}`,
        attributes: { brand: variant.brand, model: variant.model },
      };
    }
  }
  
  return null;
};


// Verifica compatibilidade por atributos (motor, cilindrada, etc)
const checkAttributeMatch = (product: any, variant: VehicleVariant): MatchTrace | null => {
  // Verifica compatibilidade por código do motor
  if (product.engineCodes && variant.engineCode) {
    const engineCodes = product.engineCodes.map((c: string) => normalize(c));
    if (engineCodes.includes(normalize(variant.engineCode))) {
      return {
        type: 'attributes',
        source: 'oem',
        reason: `Match por código do motor: ${variant.engineCode}`,
        attributes: { engineCode: variant.engineCode },
      };
    }
  }
  
  // Verifica compatibilidade por cilindrada (para motos)
  if (variant.vehicleType === 'motorcycle' && product.displacementRange && variant.displacementCc) {
    const { min, max } = product.displacementRange;
    if (variant.displacementCc >= min && variant.displacementCc <= max) {
      return {
        type: 'attributes',
        source: 'aftermarket',
        reason: `Match por cilindrada: ${variant.displacementCc}cc (range: ${min}-${max}cc)`,
        attributes: { displacement: variant.displacementCc.toString() },
      };
    }
  }
  
  // Verifica compatibilidade por tipo de combustível
  if (product.fuelTypes && variant.fuel) {
    if (product.fuelTypes.includes(variant.fuel)) {
      return {
        type: 'attributes',
        source: 'aftermarket',
        reason: `Match por combustível: ${variant.fuel}`,
        attributes: { fuel: variant.fuel },
      };
    }
  }
  
  return null;
};

// Verifica compatibilidade por texto (heurística)
const checkTextMatch = (product: any, variant: VehicleVariant): MatchTrace | null => {
  const productText = normalize(`${product.name} ${product.description || ''} ${product.tags?.join(' ') || ''}`);
  const brandNorm = normalize(variant.brand);
  const modelNorm = normalize(variant.model);
  
  const hasBrand = productText.includes(brandNorm);
  const hasModel = productText.includes(modelNorm);
  
  if (hasBrand && hasModel) {
    return {
      type: 'heuristic',
      source: 'scraper',
      reason: `Match textual: encontrado "${variant.brand}" e "${variant.model}" na descrição`,
      attributes: { brand: variant.brand, model: variant.model },
    };
  }
  
  if (hasModel) {
    return {
      type: 'heuristic',
      source: 'scraper',
      reason: `Match textual parcial: encontrado "${variant.model}" na descrição`,
      attributes: { model: variant.model },
    };
  }
  
  return null;
};

/**
 * Busca peças compatíveis com um veículo no inventário da empresa
 * Super Admins podem acessar produtos na estrutura raiz (sem empresaId)
 */
export const findCompatibleParts = async (
  variant: VehicleVariant,
  empresaId: string,
  filters: PartSearchFilters = {}
): Promise<CompatiblePart[]> => {
  const startTime = Date.now();
  
  // Verifica se é Super Admin
  const isSuperAdmin = empresaId === '__super_admin__';
  
  // Validação do empresaId (exceto para Super Admin)
  if (!empresaId || (empresaId.trim() === '' && !isSuperAdmin)) {
    console.warn('[CompatibilityService] empresaId is empty and not super admin, returning empty results');
    return [];
  }
  
  try {
    // Super Admin: busca na coleção raiz 'products'
    // Empresa normal: busca em 'empresas/{empresaId}/products'
    const productsRef = isSuperAdmin 
      ? collection(db, 'products')
      : collection(db, `empresas/${empresaId}/products`);
    
    console.log(`[CompatibilityService] Searching in: ${isSuperAdmin ? 'products (root)' : `empresas/${empresaId}/products`}`);
    
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
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    
    // Verifica compatibilidade de cada produto
    const compatibleParts: CompatiblePart[] = [];
    
    for (const product of products) {
      // Tenta diferentes métodos de match
      let bestMatch: MatchTrace | null = null;
      
      // 1. Verifica por part number / manual
      const partNumberMatch = checkPartNumberMatch(product, variant);
      if (partNumberMatch) bestMatch = partNumberMatch;
      
      // 2. Verifica por atributos
      if (!bestMatch) {
        const attributeMatch = checkAttributeMatch(product, variant);
        if (attributeMatch) bestMatch = attributeMatch;
      }
      
      // 3. Verifica por texto
      if (!bestMatch) {
        const textMatch = checkTextMatch(product, variant);
        if (textMatch) bestMatch = textMatch;
      }
      
      // Se encontrou match, adiciona à lista
      if (bestMatch) {
        const confidence = calculateConfidence(bestMatch.type);
        
        // Aplica filtro de confiança mínima
        if (confidence < (filters.minConfidence || 0.4)) continue;
        
        // Aplica filtro de tipo de match
        if (filters.matchTypes?.length && !filters.matchTypes.includes(bestMatch.type)) continue;
        
        // Aplica filtro de preço
        const price = product.sale_price || product.price || 0;
        if (filters.priceMin && price < filters.priceMin) continue;
        if (filters.priceMax && price > filters.priceMax) continue;
        
        const stockAvailable = (product.stock_total || 0) - (product.stock_reserved || 0);
        
        compatibleParts.push({
          id: `${product.id}-${variant.id}`,
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
          costPrice: product.cost_price,
          matchType: bestMatch.type,
          confidence: confidence,
          matchTrace: bestMatch,
          manuallyVerified: product.compatibleVehicles?.includes(variant.id) || false,
          notes: product.notes,
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
  variantId: string,
  userId: string,
  notes?: string
): Promise<void> => {
  if (!empresaId || !productId || !variantId) {
    throw new Error('Parâmetros inválidos');
  }
  
  try {
    const compatRef = doc(db, `empresas/${empresaId}/compatibilities/${productId}_${variantId}`);
    
    await setDoc(compatRef, {
      productId,
      variantId,
      matchType: 'manual',
      confidence: 1.0,
      manuallyVerified: true,
      verifiedBy: userId,
      verifiedAt: Timestamp.now(),
      notes: notes || null,
      createdAt: Timestamp.now(),
    });
    
    // Atualiza o produto com o veículo compatível
    const productRef = doc(db, `empresas/${empresaId}/products/${productId}`);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const data = productSnap.data();
      const compatibleVehicles = data.compatibleVehicles || [];
      
      if (!compatibleVehicles.includes(variantId)) {
        await updateDoc(productRef, {
          compatibleVehicles: [...compatibleVehicles, variantId],
          updatedAt: Timestamp.now(),
        });
      }
    }
    
    console.log(`[CompatibilityService] Saved manual compatibility: ${productId} <-> ${variantId}`);
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
  variantId: string
): Promise<void> => {
  if (!empresaId || !productId || !variantId) {
    throw new Error('Parâmetros inválidos');
  }
  
  try {
    // Remove documento de compatibilidade
    const compatRef = doc(db, `empresas/${empresaId}/compatibilities/${productId}_${variantId}`);
    await setDoc(compatRef, { deleted: true, deletedAt: Timestamp.now() }, { merge: true });
    
    // Remove veículo da lista do produto
    const productRef = doc(db, `empresas/${empresaId}/products/${productId}`);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const data = productSnap.data();
      const compatibleVehicles = (data.compatibleVehicles || []).filter((v: string) => v !== variantId);
      
      await updateDoc(productRef, {
        compatibleVehicles,
        updatedAt: Timestamp.now(),
      });
    }
    
    console.log(`[CompatibilityService] Removed manual compatibility: ${productId} <-> ${variantId}`);
  } catch (error) {
    console.error('[CompatibilityService] Error removing manual compatibility:', error);
    throw error;
  }
};

/**
 * Obtém categorias disponíveis para filtro
 * Super Admins acessam a coleção raiz
 */
export const getAvailableCategories = async (empresaId: string): Promise<string[]> => {
  const isSuperAdmin = empresaId === '__super_admin__';
  
  if (!empresaId || (empresaId.trim() === '' && !isSuperAdmin)) return [];
  
  try {
    const productsRef = isSuperAdmin 
      ? collection(db, 'products')
      : collection(db, `empresas/${empresaId}/products`);
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
 * Super Admins acessam a coleção raiz
 */
export const getAvailablePartBrands = async (empresaId: string): Promise<string[]> => {
  const isSuperAdmin = empresaId === '__super_admin__';
  
  if (!empresaId || (empresaId.trim() === '' && !isSuperAdmin)) return [];
  
  try {
    const productsRef = isSuperAdmin 
      ? collection(db, 'products')
      : collection(db, `empresas/${empresaId}/products`);
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
