/**
 * TORQ Automotive Backend - Parts Lookup Service
 * Serviço de busca de peças com lógica Firebase-first
 * 
 * FLUXO:
 * 1. Consultar Firebase primeiro
 * 2. Se dados existirem e estiverem completos -> retornar
 * 3. Se não existirem ou incompletos -> buscar externamente e salvar
 */

import { Timestamp } from 'firebase/firestore';
import { VehicleType, PartCategory, PartOrigin } from '../types';
import { getChecklistForVehicle } from '../constants/checklists';
import * as firebaseService from './firebasePartsService';
import { findPlatformForVehicle, getPartsPrefix, hasPartsCoverage, getCoverageStats } from './compatibilityMatrixService';
import { ALL_REAL_PARTS } from '../data/realPartsDatabase';

// ============================================================================
// INTERFACES
// ============================================================================

export interface VehicleSearchResult {
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
  displayName: string;
  
  // Status no Firebase
  hasData: boolean;
  checklistCompletion: number;
  lastValidatedAt?: Date;
}

export interface PartSearchResult {
  id: string;
  name: string;
  category: PartCategory;
  categoryName: string;
  partNumber: string;
  alternativeNumbers: string[];
  manufacturer: string;
  origin: PartOrigin;
  
  // Compatibilidade
  isCompatible: boolean;
  confidenceScore: number;
  
  // Estoque (do inventário local)
  inStock: boolean;
  stockQuantity: number;
  price?: number;
  
  // Metadados
  checklistItemId?: string;
  checklistItemName?: string;
}

export interface ChecklistStatus {
  vehicleId: string;
  vehicleName: string;
  checklistVersion: string;
  totalItems: number;
  foundItems: number;
  completionPercentage: number;
  categories: CategoryStatus[];
}

export interface CategoryStatus {
  category: PartCategory;
  categoryName: string;
  totalItems: number;
  foundItems: number;
  items: ChecklistItemStatus[];
}

export interface ChecklistItemStatus {
  id: string;
  name: string;
  isRequired: boolean;
  quantity: number;
  status: 'found' | 'not_found' | 'partial';
  foundParts: PartSearchResult[];
}

// ============================================================================
// CATEGORY NAMES (PT-BR)
// ============================================================================

const CATEGORY_NAMES: Record<PartCategory, string> = {
  [PartCategory.ENGINE]: 'Motor',
  [PartCategory.FILTRATION]: 'Filtros',
  [PartCategory.IGNITION]: 'Ignição',
  [PartCategory.FUEL_SYSTEM]: 'Sistema de Combustível',
  [PartCategory.COOLING]: 'Arrefecimento',
  [PartCategory.LUBRICATION]: 'Lubrificação',
  [PartCategory.TRANSMISSION]: 'Transmissão',
  [PartCategory.CLUTCH]: 'Embreagem',
  [PartCategory.DRIVETRAIN]: 'Trem de Força',
  [PartCategory.SUSPENSION]: 'Suspensão',
  [PartCategory.STEERING]: 'Direção',
  [PartCategory.BRAKES]: 'Freios',
  [PartCategory.ELECTRICAL]: 'Elétrica',
  [PartCategory.LIGHTING]: 'Iluminação',
  [PartCategory.BATTERY]: 'Bateria',
  [PartCategory.EXHAUST]: 'Escapamento',
  [PartCategory.BODY]: 'Carroceria',
  [PartCategory.WHEELS]: 'Rodas e Pneus',
};

// ============================================================================
// MAIN SERVICE CLASS
// ============================================================================

export class PartsLookupService {
  private empresaId: string;
  
  constructor(empresaId: string) {
    this.empresaId = empresaId;
  }
  
  /**
   * Busca veículos por texto livre
   */
  async searchVehicles(query: string): Promise<VehicleSearchResult[]> {
    // Parse da query para extrair marca, modelo, ano
    const parsed = this.parseVehicleQuery(query);
    
    // Buscar no Firebase primeiro
    const firebaseResults = await firebaseService.searchVehicles(parsed);
    
    if (firebaseResults.length > 0) {
      return firebaseResults.map(v => this.mapFirebaseVehicle(v));
    }
    
    // Se não encontrou, retornar lista vazia
    // (a busca externa seria feita aqui se tivéssemos APIs)
    return [];
  }
  
  /**
   * Busca peças compatíveis com um veículo
   */
  async getCompatibleParts(vehicleId: string): Promise<PartSearchResult[]> {
    // Verificar se veículo existe e tem dados completos
    const completion = await firebaseService.isVehicleComplete(vehicleId);
    
    if (completion.isComplete) {
      const parts = await firebaseService.getPartsForVehicle(vehicleId);
      return parts.map(p => this.mapFirebasePart(p, vehicleId));
    }
    
    // Buscar peças existentes
    const existingParts = await firebaseService.getPartsForVehicle(vehicleId);
    
    // TODO: Complementar com busca externa para categorias faltantes
    
    return existingParts.map(p => this.mapFirebasePart(p, vehicleId));
  }
  
  /**
   * Busca peças compatíveis usando a matriz de compatibilidade
   * Esta função usa o banco de dados local de peças reais
   */
  async getCompatiblePartsFromMatrix(vehicle: {
    brand: string;
    model: string;
    year: number;
    engine?: string;
  }): Promise<PartSearchResult[]> {
    // Encontrar a plataforma do veículo
    const platformId = findPlatformForVehicle(vehicle);
    
    if (!platformId) {
      return [];
    }
    
    // Obter o prefixo de peças para esta plataforma
    const partsPrefix = getPartsPrefix(platformId);
    
    if (!partsPrefix) {
      return [];
    }
    
    // Filtrar peças do banco de dados local que correspondem ao prefixo
    const compatibleParts = ALL_REAL_PARTS.filter(part => 
      part.id.startsWith(partsPrefix)
    );

    // Mapear para o formato de resultado
    return compatibleParts.map(part => ({
      id: part.id,
      name: part.name,
      category: part.category,
      categoryName: CATEGORY_NAMES[part.category] || part.category,
      partNumber: part.oemCode,
      alternativeNumbers: part.equivalents.map(e => `${e.brand}: ${e.code}`),
      manufacturer: part.manufacturer,
      origin: part.origin,
      isCompatible: true,
      confidenceScore: part.confidenceScore / 100,
      inStock: false,
      stockQuantity: 0,
      checklistItemId: part.id,
      checklistItemName: part.name,
    }));
  }
  
  /**
   * Verifica se um veículo tem cobertura de peças
   */
  hasPartsCoverage(vehicle: { brand: string; model: string; year: number }): boolean {
    return hasPartsCoverage(vehicle);
  }
  
  /**
   * Retorna estatísticas de cobertura do sistema
   */
  getCoverageStats() {
    return getCoverageStats();
  }
  
  /**
   * Busca peças por categoria
   */
  async getPartsByCategory(vehicleId: string, category: PartCategory): Promise<PartSearchResult[]> {
    const parts = await firebaseService.getPartsByCategory(vehicleId, category);
    return parts.map(p => this.mapFirebasePart(p, vehicleId));
  }
  
  /**
   * Obtém o status do checklist de um veículo
   */
  async getChecklistStatus(vehicleId: string): Promise<ChecklistStatus | null> {
    const vehicle = await firebaseService.getVehicleById(vehicleId);
    if (!vehicle) {
      return null;
    }
    
    const checklist = getChecklistForVehicle(vehicle.vehicleType);
    const vehicleParts = await firebaseService.getVehiclePartsChecklist(vehicleId);
    
    const categories: CategoryStatus[] = [];
    let totalItems = 0;
    let foundItems = 0;
    
    for (const cat of checklist.categories) {
      const categoryItems: ChecklistItemStatus[] = [];
      
      for (const item of cat.items) {
        totalItems++;
        
        // Buscar peças encontradas para este item
        const foundPartsData = vehicleParts?.parts.find(p => p.checklistItemId === item.id);
        const status = foundPartsData?.status || 'not_found';
        
        if (status === 'found') foundItems++;
        
        categoryItems.push({
          id: item.id,
          name: item.name,
          isRequired: item.isRequired,
          quantity: item.quantity,
          status,
          foundParts: foundPartsData?.foundParts.map(fp => ({
            id: fp.partId,
            name: item.name,
            category: cat.category,
            categoryName: CATEGORY_NAMES[cat.category],
            partNumber: fp.partNumber,
            alternativeNumbers: [],
            manufacturer: fp.manufacturer,
            origin: fp.origin,
            isCompatible: true,
            confidenceScore: fp.confidenceScore,
            inStock: false,
            stockQuantity: 0,
            checklistItemId: item.id,
            checklistItemName: item.name,
          })) || [],
        });
      }
      
      categories.push({
        category: cat.category,
        categoryName: CATEGORY_NAMES[cat.category],
        totalItems: cat.items.length,
        foundItems: categoryItems.filter(i => i.status === 'found').length,
        items: categoryItems,
      });
    }
    
    return {
      vehicleId,
      vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      checklistVersion: checklist.version,
      totalItems,
      foundItems,
      completionPercentage: totalItems > 0 ? Math.round((foundItems / totalItems) * 100) : 0,
      categories,
    };
  }
  
  /**
   * Busca peças compartilhadas (cross-compatibility)
   */
  async getSharedParts(partNumber: string): Promise<{
    partNumber: string;
    compatibleVehicles: string[];
    technicalReason: string;
  } | null> {
    const shared = await firebaseService.getSharedPartsByNumber(partNumber);
    
    if (shared) {
      return {
        partNumber: shared.partNumber,
        compatibleVehicles: shared.vehicleNames,
        technicalReason: shared.technicalReason,
      };
    }
    
    return null;
  }
  
  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================
  
  private parseVehicleQuery(query: string): {
    brand?: string;
    model?: string;
    year?: number;
  } {
    const parts = query.trim().split(/\s+/);
    const result: { brand?: string; model?: string; year?: number } = {};
    
    // Tentar extrair ano (4 dígitos)
    const yearMatch = query.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      result.year = parseInt(yearMatch[0]);
    }
    
    // Primeira palavra geralmente é a marca
    if (parts.length > 0) {
      result.brand = parts[0].toUpperCase();
    }
    
    // Segunda palavra geralmente é o modelo
    if (parts.length > 1) {
      // Remover o ano se estiver na segunda posição
      const modelParts = parts.slice(1).filter(p => !p.match(/^(19|20)\d{2}$/));
      if (modelParts.length > 0) {
        result.model = modelParts.join(' ').toUpperCase();
      }
    }
    
    return result;
  }
  
  private mapFirebaseVehicle(v: firebaseService.FirebaseVehicle): VehicleSearchResult {
    return {
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      yearEnd: v.yearEnd,
      vehicleType: v.vehicleType,
      trim: v.trim,
      engineCode: v.engineCode,
      engineName: v.engineName,
      fuelType: v.fuelType,
      displayName: `${v.brand} ${v.model} ${v.year}${v.trim ? ' ' + v.trim : ''}`,
      hasData: true,
      checklistCompletion: v.checklistCompletion,
      lastValidatedAt: v.lastValidatedAt?.toDate(),
    };
  }
  
  private mapFirebasePart(p: firebaseService.FirebasePart, vehicleId: string): PartSearchResult {
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      categoryName: CATEGORY_NAMES[p.category] || p.category,
      partNumber: p.oemPartNumber,
      alternativeNumbers: p.alternativePartNumbers,
      manufacturer: p.manufacturer,
      origin: p.origin,
      isCompatible: p.compatibleVehicleIds.includes(vehicleId),
      confidenceScore: p.confidenceScore,
      inStock: false, // Será preenchido pelo inventário local
      stockQuantity: 0,
    };
  }
}

// ============================================================================
// SINGLETON FACTORY
// ============================================================================

let serviceInstance: PartsLookupService | null = null;

export function getPartsLookupService(empresaId: string): PartsLookupService {
  if (!serviceInstance || (serviceInstance as any).empresaId !== empresaId) {
    serviceInstance = new PartsLookupService(empresaId);
  }
  return serviceInstance;
}
