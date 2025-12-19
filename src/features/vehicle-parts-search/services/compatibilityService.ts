/**
 * Compatibility Service
 * Serviço para buscar compatibilidade de peças no Firebase
 * 
 * @version 2.0.0
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  deleteDoc,
  query, 
  where
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { VehicleVariant, CompatiblePart, CompatibilityStats, MatchType, PartSearchFilters } from '../types';

export interface CompatibilityIndex {
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;
  generatedAt: string;
  compatibleParts: CompatiblePartData[];
  missingParts: MissingPartData[];
  sharedParts: SharedPartData[];
  coverage: number;
  confidence: number;
  lastUpdated: string;
  version: string;
}

export interface CompatiblePartData {
  partTypeId: string;
  partTypeName: string;
  category: string;
  priority: string;
  partNumber: string | null;
  brand: string | null;
  specs: Record<string, any> | null;
  equivalents: string[];
  matchType: string;
  confidence: number;
  evidence: EvidenceData[];
}

export interface MissingPartData {
  partTypeId: string;
  partTypeName: string;
  category: string;
  priority: string;
  reason: string;
  searchedSources: string[];
}

export interface SharedPartData {
  partNumber: string;
  partName: string;
  sharedWith: { brand: string; model: string }[];
  economySuggestion: {
    type: string;
    description: string;
    estimatedSavings: string;
  } | null;
}

export interface EvidenceData {
  type: string;
  source: string;
  description: string;
  confidence: number;
  requiresValidation?: boolean;
}


/**
 * Busca índice de compatibilidade de um veículo
 */
export async function getVehicleCompatibility(vehicleId: string): Promise<CompatibilityIndex | null> {
  try {
    const docRef = doc(db, 'vehicles', vehicleId, 'compatibilityIndex', 'current');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as CompatibilityIndex;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar compatibilidade:', error);
    return null;
  }
}

/**
 * Converte dados do Firebase para o formato do frontend
 */
export function convertToCompatibleParts(
  compatibilityIndex: CompatibilityIndex,
  inventoryProducts: any[]
): CompatiblePart[] {
  const parts: CompatiblePart[] = [];
  
  for (const partData of compatibilityIndex.compatibleParts) {
    // Tenta encontrar produto no inventário
    const matchingProduct = inventoryProducts.find(p => 
      p.partNumbers?.includes(partData.partNumber) ||
      partData.equivalents?.some((eq: string) => p.partNumbers?.includes(eq))
    );
    
    const part: CompatiblePart = {
      id: `${compatibilityIndex.vehicleId}_${partData.partTypeId}`,
      productId: matchingProduct?.id || '',
      name: partData.partTypeName,
      sku: matchingProduct?.sku || partData.partNumber || '',
      brand: partData.brand || matchingProduct?.brand || '',
      category: partData.category,
      partNumbers: partData.partNumber 
        ? [partData.partNumber, ...partData.equivalents]
        : partData.equivalents,
      oemPartNumber: partData.partNumber || undefined,
      images: matchingProduct?.images || [],
      stockQuantity: matchingProduct?.stockQuantity || 0,
      price: matchingProduct?.price || 0,
      costPrice: matchingProduct?.costPrice,
      matchType: partData.matchType as MatchType,
      confidence: partData.confidence,
      matchTrace: {
        type: partData.matchType as MatchType,
        source: partData.evidence[0]?.source as any || 'manual',
        reason: partData.evidence[0]?.description || 'Compatibilidade verificada',
      },
      manuallyVerified: partData.matchType === 'direct',
      notes: partData.specs ? JSON.stringify(partData.specs) : undefined,
    };
    
    parts.push(part);
  }
  
  return parts;
}

/**
 * Calcula estatísticas de compatibilidade
 */
export function calculateCompatibilityStats(
  compatibilityIndex: CompatibilityIndex,
  parts: CompatiblePart[]
): CompatibilityStats {
  const byMatchType: Record<MatchType, number> = {
    exact: 0,
    tecdoc: 0,
    oem: 0,
    aftermarket: 0,
    attributes: 0,
    heuristic: 0,
    manual: 0,
    fipe: 0,
  };
  
  let totalConfidence = 0;
  let inStock = 0;
  let verified = 0;
  
  for (const part of parts) {
    byMatchType[part.matchType] = (byMatchType[part.matchType] || 0) + 1;
    totalConfidence += part.confidence;
    if (part.stockQuantity > 0) inStock++;
    if (part.manuallyVerified) verified++;
  }
  
  // Mapeia tipos do backend para frontend
  for (const partData of compatibilityIndex.compatibleParts) {
    const type = partData.matchType;
    if (type === 'direct') byMatchType.exact++;
    else if (type === 'technical') byMatchType.attributes++;
    else if (type === 'heuristic') byMatchType.heuristic++;
  }
  
  return {
    total: parts.length,
    inStock,
    verified,
    avgConfidence: parts.length > 0 ? totalConfidence / parts.length : 0,
    byMatchType,
  };
}

/**
 * Busca peças compartilhadas para economia
 */
export async function getSharedPartsForVehicle(vehicleId: string): Promise<SharedPartData[]> {
  try {
    const compatibility = await getVehicleCompatibility(vehicleId);
    return compatibility?.sharedParts || [];
  } catch (error) {
    console.error('Erro ao buscar peças compartilhadas:', error);
    return [];
  }
}

/**
 * Busca peças faltantes para um veículo
 */
export async function getMissingPartsForVehicle(vehicleId: string): Promise<MissingPartData[]> {
  try {
    const compatibility = await getVehicleCompatibility(vehicleId);
    return compatibility?.missingParts || [];
  } catch (error) {
    console.error('Erro ao buscar peças faltantes:', error);
    return [];
  }
}

/**
 * Verifica se um veículo tem índice de compatibilidade
 */
export async function hasCompatibilityIndex(vehicleId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'vehicles', vehicleId, 'compatibilityIndex', 'current');
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    return false;
  }
}

/**
 * Busca veículos que usam uma peça específica
 */
export async function getVehiclesUsingPart(partNumber: string): Promise<string[]> {
  try {
    // Busca no índice consolidado
    const indexRef = doc(db, 'partsCompatibility', 'searchIndex');
    const indexSnap = await getDoc(indexRef);
    
    if (indexSnap.exists()) {
      const index = indexSnap.data();
      return index.partNumbers?.[partNumber]?.vehicles || [];
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar veículos por peça:', error);
    return [];
  }
}

export default {
  getVehicleCompatibility,
  convertToCompatibleParts,
  calculateCompatibilityStats,
  getSharedPartsForVehicle,
  getMissingPartsForVehicle,
  hasCompatibilityIndex,
  getVehiclesUsingPart,
};


/**
 * Busca peças compatíveis para um veículo
 * Integra com a API de compatibilidade completa (2.920 veículos, 131 peças)
 * e também com o inventário local da empresa
 */
export async function findCompatibleParts(
  variant: VehicleVariant,
  empresaId: string,
  filters?: PartSearchFilters
): Promise<CompatiblePart[]> {
  try {
    const parts: CompatiblePart[] = [];
    
    // 1. Busca produtos do inventário da empresa (para verificar estoque)
    const inventoryProducts = await getInventoryProducts(empresaId);
    
    // 2. NOVO: Tenta buscar da API de compatibilidade completa (backend)
    console.log(`[compatibilityService] 🔍 Iniciando busca para: ${variant.brand} ${variant.model} ${variant.year}`);
    console.log(`[compatibilityService] Variant ID original: ${variant.id}`);
    
    let apiParts: any[] = [];
    try {
      apiParts = await fetchPartsFromFullAPI(variant);
      console.log(`[compatibilityService] ✅ API Full encontrou ${apiParts.length} peças para ${variant.brand} ${variant.model}`);
    } catch (apiError) {
      console.error(`[compatibilityService] ❌ Erro ao buscar API:`, apiError);
    }
    
    // 3. Converte peças da API para o formato CompatiblePart
    for (const apiPart of apiParts) {
      // Tenta encontrar produto no inventário pelo part number
      const matchingProduct = inventoryProducts.find(p => 
        p.partNumbers?.includes(apiPart.partNumber) ||
        p.sku === apiPart.partNumber ||
        apiPart.equivalents?.some((eq: string) => p.partNumbers?.includes(eq) || p.sku === eq)
      );
      
      parts.push({
        id: `${variant.id}_${apiPart.partNumber}_api`,
        productId: matchingProduct?.id || '',
        name: apiPart.name,
        sku: apiPart.partNumber,
        brand: apiPart.brand,
        category: apiPart.category,
        partNumbers: [apiPart.partNumber, ...(apiPart.equivalents || [])],
        oemPartNumber: apiPart.partNumber,
        images: matchingProduct?.images || [],
        stockQuantity: matchingProduct?.stockQuantity || matchingProduct?.quantidade || 0,
        price: matchingProduct?.price || matchingProduct?.preco || apiPart.avgPrice || 0,
        costPrice: matchingProduct?.costPrice || matchingProduct?.custo,
        matchType: (apiPart.matchType as MatchType) || 'exact',
        confidence: apiPart.confidence || 0.95,
        matchTrace: {
          type: (apiPart.matchType as MatchType) || 'exact',
          source: 'parts_database' as any,
          reason: `Compatível via plataforma ${apiPart.platform || variant.brand}`,
        },
        manuallyVerified: apiPart.confidence >= 0.9,
        notes: apiPart.cheaperAlternatives?.length 
          ? `Alternativas mais baratas: ${apiPart.cheaperAlternatives.map((a: any) => a.partNumber).join(', ')}`
          : undefined,
        // Dados extras da API
        cheaperAlternatives: apiPart.cheaperAlternatives,
        crossCompatible: apiPart.crossCompatible,
      } as CompatiblePart & { cheaperAlternatives?: any[]; crossCompatible?: any[] });
    }
    
    // 4. Fallback: Se API não retornou nada, usa engine local
    if (parts.length === 0) {
      console.log('[compatibilityService] API vazia, usando engine local...');
      const { findCompatiblePartsForVehicle } = await import('./partsCompatibilityEngine');
      const engineParts = findCompatiblePartsForVehicle(variant);
      
      for (const enginePart of engineParts) {
        const matchingProduct = inventoryProducts.find(p => 
          p.partNumbers?.includes(enginePart.partNumber) ||
          p.sku === enginePart.partNumber
        );
        
        parts.push({
          id: `${variant.id}_${enginePart.partNumber}_engine`,
          productId: matchingProduct?.id || '',
          name: enginePart.name,
          sku: enginePart.partNumber,
          brand: enginePart.brand,
          category: enginePart.category,
          partNumbers: [enginePart.partNumber, ...enginePart.equivalents],
          oemPartNumber: enginePart.partNumber,
          images: matchingProduct?.images || [],
          stockQuantity: matchingProduct?.stockQuantity || 0,
          price: matchingProduct?.price || 0,
          matchType: enginePart.matchType,
          confidence: enginePart.confidence,
          matchTrace: {
            type: enginePart.matchType,
            source: 'parts_database' as any,
            reason: enginePart.matchReason,
          },
          manuallyVerified: enginePart.matchType === 'exact',
        });
      }
    }
    
    // 5. Também busca no Firebase se houver índice de compatibilidade
    const compatibility = await getVehicleCompatibility(variant.id);
    if (compatibility) {
      const firebaseParts = convertToCompatibleParts(compatibility, inventoryProducts);
      for (const fbPart of firebaseParts) {
        const exists = parts.some(p => p.sku === fbPart.sku || p.partNumbers.some(pn => fbPart.partNumbers.includes(pn)));
        if (!exists) {
          parts.push(fbPart);
        }
      }
    }
    
    // 6. Aplica filtros e retorna
    return applyFilters(parts, filters);
    
  } catch (error) {
    console.error('[compatibilityService] Erro ao buscar peças:', error);
    // Fallback para busca local antiga
    const inventoryProducts = await getInventoryProducts(empresaId);
    const localParts = await findPartsLocally(variant, inventoryProducts);
    return applyFilters(localParts, filters);
  }
}

/**
 * Busca peças da API de compatibilidade completa V4 (backend)
 * Retorna 50 peças padronizadas por veículo (20.000+ veículos)
 */
async function fetchPartsFromFullAPI(variant: VehicleVariant): Promise<any[]> {
  try {
    const API_BASE = 'http://localhost:3001';
    
    // V4 usa o ID original do veículo (marca_modelo_ano_motor_versao)
    // Tenta primeiro com o ID original do variant
    const originalId = variant.id;
    
    console.log(`[compatibilityService V4] 🔍 Buscando: ${originalId}`);
    
    // Tenta buscar pelo ID original
    let response: Response;
    try {
      response = await fetch(`${API_BASE}/api/parts-full/vehicle/${encodeURIComponent(originalId)}`);
    } catch (fetchError) {
      console.error(`[compatibilityService V4] ❌ Erro de rede:`, fetchError);
      return [];
    }
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error(`[compatibilityService V4] ❌ Erro ao parsear JSON:`, jsonError);
      return [];
    }
    
    // V4 retorna parts diretamente
    if (data.success && data.data?.parts) {
      const parts = data.data.parts
        .filter((p: any) => p.partNumber && !p.partNumber.startsWith('N/A'))
        .map((p: any) => ({
          ...p,
          name: p.name,
          partNumber: p.partNumber,
          brand: p.brand,
          category: p.category,
          equivalents: p.equivalents || [],
          avgPrice: p.avgPrice || 0,
          matchType: p.matchType || 'exact',
          confidence: p.confidence || 0.95,
          platform: data.data.platform,
        }));
      
      console.log(`[compatibilityService V4] ✅ ${parts.length} peças para ${originalId}`);
      return parts;
    }
    
    // Se não encontrou pelo ID original, tenta buscar por marca/modelo/ano
    console.log('[compatibilityService V4] Tentando search por marca/modelo/ano...');
    const searchParams = new URLSearchParams({
      brand: variant.brand,
      model: variant.model,
      year: variant.year.toString(),
      limit: '20',
    });
    
    response = await fetch(`${API_BASE}/api/parts-full/search?${searchParams}`);
    let searchData = await response.json();
    
    // Se não encontrou com ano, tenta só com marca e modelo
    if (!searchData.success || searchData.data?.length === 0) {
      console.log('[compatibilityService V4] Tentando search só com marca/modelo...');
      const searchParams2 = new URLSearchParams({
        brand: variant.brand,
        model: variant.model,
        limit: '30',
      });
      response = await fetch(`${API_BASE}/api/parts-full/search?${searchParams2}`);
      searchData = await response.json();
    }
    
    // Se ainda não encontrou, tenta só com modelo
    if (!searchData.success || searchData.data?.length === 0) {
      console.log('[compatibilityService V4] Tentando search só com modelo...');
      const searchParams3 = new URLSearchParams({
        model: variant.model,
        limit: '50',
      });
      response = await fetch(`${API_BASE}/api/parts-full/search?${searchParams3}`);
      searchData = await response.json();
    }
    
    if (searchData.success && searchData.data?.length > 0) {
      // Encontra o veículo mais próximo do ano solicitado
      const sortedByYear = searchData.data
        .filter((v: any) => v.totalParts > 0)
        .sort((a: any, b: any) => Math.abs(a.year - variant.year) - Math.abs(b.year - variant.year));
      
      const foundVehicle = sortedByYear[0];
      
      if (foundVehicle) {
        console.log(`[compatibilityService V4] ✅ Encontrado similar: ${foundVehicle.vehicleId} (${foundVehicle.brand} ${foundVehicle.model} ${foundVehicle.year})`);
        
        response = await fetch(`${API_BASE}/api/parts-full/vehicle/${encodeURIComponent(foundVehicle.vehicleId)}`);
        data = await response.json();
        
        if (data.success && data.data?.parts) {
          return data.data.parts
            .filter((p: any) => p.partNumber && !p.partNumber.startsWith('N/A'))
            .map((p: any) => ({
              ...p,
              platform: data.data.platform,
              // Indica que é um match aproximado
              matchType: foundVehicle.year === variant.year ? 'exact' : 'heuristic',
              confidence: foundVehicle.year === variant.year ? 0.95 : 0.85,
            }));
        }
      }
    }
    
    console.log('[compatibilityService V4] ❌ Veículo não encontrado');
    return [];
  } catch (error) {
    console.error('[compatibilityService V4] ❌ Erro:', error);
    return [];
  }
}

/**
 * Busca produtos do inventário
 */
async function getInventoryProducts(empresaId: string): Promise<any[]> {
  try {
    // Busca local não precisa de inventário - retorna vazio
    if (empresaId === '__local_search__') {
      console.log('[compatibilityService] Busca local - sem inventário');
      return [];
    }
    
    if (empresaId === '__super_admin__') {
      // Super admin vê todos os produtos
      const snapshot = await getDocs(collection(db, 'products'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    const q = query(
      collection(db, 'products'),
      where('empresaId', '==', empresaId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[compatibilityService] Erro ao buscar produtos:', error);
    return [];
  }
}

/**
 * Busca peças localmente quando não há índice no Firebase
 */
async function findPartsLocally(
  variant: VehicleVariant,
  products: any[]
): Promise<CompatiblePart[]> {
  const parts: CompatiblePart[] = [];
  
  for (const product of products) {
    // Verifica se o produto tem compatibilidade com o veículo
    const compatibility = checkLocalCompatibility(variant, product);
    
    if (compatibility.isCompatible) {
      parts.push({
        id: `${variant.id}_${product.id}`,
        productId: product.id,
        name: product.name || product.nome || '',
        sku: product.sku || product.codigo || '',
        brand: product.brand || product.marca || '',
        category: product.category || product.categoria || '',
        partNumbers: product.partNumbers || [],
        oemPartNumber: product.oemPartNumber,
        images: product.images || product.imagens || [],
        stockQuantity: product.stockQuantity || product.quantidade || 0,
        price: product.price || product.preco || 0,
        costPrice: product.costPrice || product.custo,
        matchType: compatibility.matchType,
        confidence: compatibility.confidence,
        matchTrace: {
          type: compatibility.matchType,
          source: 'manual' as any,
          reason: compatibility.reason,
        },
        manuallyVerified: false,
      });
    }
  }
  
  return parts;
}

/**
 * Verifica compatibilidade local de um produto com um veículo
 */
function checkLocalCompatibility(
  variant: VehicleVariant,
  product: any
): { isCompatible: boolean; matchType: MatchType; confidence: number; reason: string } {
  // Verifica se o produto tem veículos compatíveis listados
  const compatibleVehicles = product.compatibleVehicles || product.veiculosCompativeis || [];
  
  for (const cv of compatibleVehicles) {
    // Match exato por ID
    if (cv.variantId === variant.id) {
      return {
        isCompatible: true,
        matchType: 'exact',
        confidence: 1.0,
        reason: 'Compatibilidade confirmada manualmente',
      };
    }
    
    // Match por marca/modelo/ano
    const brandMatch = cv.brand?.toLowerCase() === variant.brand.toLowerCase();
    const modelMatch = cv.model?.toLowerCase() === variant.model.toLowerCase();
    const yearMatch = !cv.year || cv.year === variant.year || 
      (cv.yearStart && cv.yearEnd && variant.year >= cv.yearStart && variant.year <= cv.yearEnd);
    
    if (brandMatch && modelMatch && yearMatch) {
      return {
        isCompatible: true,
        matchType: 'aftermarket',
        confidence: 0.85,
        reason: `Compatível com ${cv.brand} ${cv.model}`,
      };
    }
  }
  
  // Verifica por tags/keywords
  const tags = product.tags || product.palavrasChave || [];
  const vehicleTerms = [
    variant.brand.toLowerCase(),
    variant.model.toLowerCase(),
    variant.engineCode?.toLowerCase(),
  ].filter(Boolean);
  
  const matchingTags = tags.filter((tag: string) => 
    vehicleTerms.some(term => tag.toLowerCase().includes(term as string))
  );
  
  if (matchingTags.length >= 2) {
    return {
      isCompatible: true,
      matchType: 'heuristic',
      confidence: 0.6,
      reason: `Match por tags: ${matchingTags.join(', ')}`,
    };
  }
  
  return {
    isCompatible: false,
    matchType: 'heuristic',
    confidence: 0,
    reason: 'Sem compatibilidade encontrada',
  };
}

/**
 * Aplica filtros às peças
 */
function applyFilters(parts: CompatiblePart[], filters?: PartSearchFilters): CompatiblePart[] {
  if (!filters) return parts;
  
  return parts.filter(part => {
    // Filtro por categoria
    if (filters.category && part.category !== filters.category) return false;
    
    // Filtro por marca
    if (filters.brand && part.brand !== filters.brand) return false;
    
    // Filtro por estoque
    if (filters.inStockOnly && part.stockQuantity <= 0) return false;
    
    // Filtro por confiança mínima
    if (filters.minConfidence && part.confidence < filters.minConfidence) return false;
    
    // Filtro por tipo de match
    if (filters.matchTypes && filters.matchTypes.length > 0) {
      if (!filters.matchTypes.includes(part.matchType)) return false;
    }
    
    // Filtro por preço
    if (filters.priceMin && part.price < filters.priceMin) return false;
    if (filters.priceMax && part.price > filters.priceMax) return false;
    
    return true;
  });
}

/**
 * Retorna categorias disponíveis
 */
export async function getAvailableCategories(empresaId: string): Promise<string[]> {
  try {
    // Para busca local, retorna categorias do engine
    if (empresaId === '__local_search__') {
      const { getAvailablePartsCategories } = await import('./partsCompatibilityEngine');
      return getAvailablePartsCategories();
    }
    
    const products = await getInventoryProducts(empresaId);
    const categories = new Set<string>();
    
    for (const product of products) {
      const cat = product.category || product.categoria;
      if (cat) categories.add(cat);
    }
    
    return Array.from(categories).sort();
  } catch (error) {
    console.error('[compatibilityService] Erro ao buscar categorias:', error);
    return [];
  }
}

/**
 * Retorna marcas de peças disponíveis
 */
export async function getAvailablePartBrands(empresaId: string): Promise<string[]> {
  try {
    // Para busca local, retorna marcas do engine
    if (empresaId === '__local_search__') {
      const { getAvailablePartsBrands } = await import('./partsCompatibilityEngine');
      return getAvailablePartsBrands();
    }
    
    const products = await getInventoryProducts(empresaId);
    const brands = new Set<string>();
    
    for (const product of products) {
      const brand = product.brand || product.marca;
      if (brand) brands.add(brand);
    }
    
    return Array.from(brands).sort();
  } catch (error) {
    console.error('[compatibilityService] Erro ao buscar marcas:', error);
    return [];
  }
}

/**
 * Salva compatibilidade manual
 */
export async function saveManualCompatibility(
  empresaId: string,
  productId: string,
  variantId: string,
  userId: string,
  notes?: string
): Promise<void> {
  try {
    const docRef = doc(db, 'manualCompatibility', `${empresaId}_${productId}_${variantId}`);
    
    await setDoc(docRef, {
      empresaId,
      productId,
      variantId,
      userId,
      notes: notes || '',
      confirmedAt: new Date().toISOString(),
    });
    
    console.log('[compatibilityService] Compatibilidade manual salva');
  } catch (error) {
    console.error('[compatibilityService] Erro ao salvar compatibilidade:', error);
    throw error;
  }
}

/**
 * Remove compatibilidade manual
 */
export async function removeManualCompatibility(
  empresaId: string,
  productId: string,
  variantId: string
): Promise<void> {
  try {
    const docRef = doc(db, 'manualCompatibility', `${empresaId}_${productId}_${variantId}`);
    await deleteDoc(docRef);
    
    console.log('[compatibilityService] Compatibilidade manual removida');
  } catch (error) {
    console.error('[compatibilityService] Erro ao remover compatibilidade:', error);
    throw error;
  }
}
