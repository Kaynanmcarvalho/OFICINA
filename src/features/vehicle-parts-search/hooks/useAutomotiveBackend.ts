/**
 * TORQ Automotive Backend - React Hook
 * Hook para integração do backend automotivo com o modal de busca de peças
 * 
 * Uso: Importar e usar diretamente no VehiclePartsSearchModal
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  PartsLookupService, 
  getPartsLookupService,
  VehicleSearchResult,
  PartSearchResult,
  ChecklistStatus,
  CategoryStatus,
} from '../../../services/automotive-backend/services/partsLookupService';
import { PartCategory } from '../../../services/automotive-backend/types';
import { massiveSeedDatabase, checkMassiveSeedStatus, getLocalDatabaseStats, forceReseedWithRealData } from '../../../services/automotive-backend/services/massiveSeedService';
import { findPlatformForVehicle, getCoverageStats, hasPartsCoverage } from '../../../services/automotive-backend/services/compatibilityMatrixService';
import { ALL_REAL_PARTS } from '../../../services/automotive-backend/data/realPartsDatabase';
import { getPartsPrefix } from '../../../services/automotive-backend/services/compatibilityMatrixService';

// ============================================================================
// INTERFACES
// ============================================================================

export interface UseAutomotiveBackendOptions {
  empresaId: string;
  autoLoadChecklist?: boolean;
}

export interface UseAutomotiveBackendReturn {
  // Estado
  isLoading: boolean;
  error: string | null;
  isSeeded: boolean;
  seedProgress: { phase: string; current: number; total: number } | null;
  
  // Veículos
  vehicles: VehicleSearchResult[];
  selectedVehicle: VehicleSearchResult | null;
  searchVehicles: (query: string) => Promise<void>;
  selectVehicle: (vehicle: VehicleSearchResult) => void;
  clearSelection: () => void;
  
  // Peças
  parts: PartSearchResult[];
  partsByCategory: Map<PartCategory, PartSearchResult[]>;
  loadParts: () => Promise<void>;
  loadPartsByCategory: (category: PartCategory) => Promise<void>;
  
  // Checklist
  checklistStatus: ChecklistStatus | null;
  loadChecklistStatus: () => Promise<void>;
  
  // Categorias
  categories: CategoryStatus[];
  selectedCategory: PartCategory | null;
  setSelectedCategory: (category: PartCategory | null) => void;
  
  // Cross-compatibility
  getSharedParts: (partNumber: string) => Promise<{
    partNumber: string;
    compatibleVehicles: string[];
    technicalReason: string;
  } | null>;
  
  // Seed
  seedDatabase: () => Promise<void>;
  checkSeed: () => Promise<void>;
  
  // Matriz de Compatibilidade
  getPartsFromMatrix: (vehicle: { brand: string; model: string; year: number }) => PartSearchResult[];
  hasCoverage: (vehicle: { brand: string; model: string; year: number }) => boolean;
  coverageStats: ReturnType<typeof getCoverageStats>;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useAutomotiveBackend(options: UseAutomotiveBackendOptions): UseAutomotiveBackendReturn {
  const { empresaId, autoLoadChecklist = true } = options;
  
  // Service instance
  const [service] = useState<PartsLookupService>(() => getPartsLookupService(empresaId));
  
  // Estado
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSeeded, setIsSeeded] = useState(false);
  
  // Veículos
  const [vehicles, setVehicles] = useState<VehicleSearchResult[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSearchResult | null>(null);
  
  // Peças
  const [parts, setParts] = useState<PartSearchResult[]>([]);
  const [partsByCategory, setPartsByCategory] = useState<Map<PartCategory, PartSearchResult[]>>(new Map());
  
  // Checklist
  const [checklistStatus, setChecklistStatus] = useState<ChecklistStatus | null>(null);
  
  // Categorias
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | null>(null);
  
  // ============================================================================
  // VEHICLE OPERATIONS
  // ============================================================================
  
  const searchVehicles = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setVehicles([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await service.searchVehicles(query);
      setVehicles(results);
    } catch (err: any) {
      console.error('[useAutomotiveBackend] Search error:', err);
      setError(err.message || 'Erro ao buscar veículos');
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  }, [service]);
  
  const selectVehicle = useCallback((vehicle: VehicleSearchResult) => {
    setSelectedVehicle(vehicle);
    setVehicles([]);
    setParts([]);
    setPartsByCategory(new Map());
    setChecklistStatus(null);
    setSelectedCategory(null);
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedVehicle(null);
    setParts([]);
    setPartsByCategory(new Map());
    setChecklistStatus(null);
    setSelectedCategory(null);
  }, []);
  
  // ============================================================================
  // PARTS OPERATIONS
  // ============================================================================
  
  const loadParts = useCallback(async () => {
    if (!selectedVehicle) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await service.getCompatibleParts(selectedVehicle.id);
      setParts(results);
      
      // Agrupar por categoria
      const byCategory = new Map<PartCategory, PartSearchResult[]>();
      for (const part of results) {
        const existing = byCategory.get(part.category) || [];
        existing.push(part);
        byCategory.set(part.category, existing);
      }
      setPartsByCategory(byCategory);
    } catch (err: any) {
      console.error('[useAutomotiveBackend] Load parts error:', err);
      setError(err.message || 'Erro ao carregar peças');
    } finally {
      setIsLoading(false);
    }
  }, [service, selectedVehicle]);
  
  const loadPartsByCategory = useCallback(async (category: PartCategory) => {
    if (!selectedVehicle) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await service.getPartsByCategory(selectedVehicle.id, category);
      
      // Atualizar mapa de categorias
      setPartsByCategory(prev => {
        const newMap = new Map(prev);
        newMap.set(category, results);
        return newMap;
      });
    } catch (err: any) {
      console.error('[useAutomotiveBackend] Load parts by category error:', err);
      setError(err.message || 'Erro ao carregar peças da categoria');
    } finally {
      setIsLoading(false);
    }
  }, [service, selectedVehicle]);
  
  // ============================================================================
  // CHECKLIST OPERATIONS
  // ============================================================================
  
  const loadChecklistStatus = useCallback(async () => {
    if (!selectedVehicle) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await service.getChecklistStatus(selectedVehicle.id);
      setChecklistStatus(status);
    } catch (err: any) {
      console.error('[useAutomotiveBackend] Load checklist error:', err);
      setError(err.message || 'Erro ao carregar checklist');
    } finally {
      setIsLoading(false);
    }
  }, [service, selectedVehicle]);
  
  // ============================================================================
  // CROSS-COMPATIBILITY
  // ============================================================================
  
  const getSharedParts = useCallback(async (partNumber: string) => {
    try {
      return await service.getSharedParts(partNumber);
    } catch (err: any) {
      console.error('[useAutomotiveBackend] Get shared parts error:', err);
      return null;
    }
  }, [service]);
  
  // ============================================================================
  // AUTO-LOAD EFFECTS
  // ============================================================================
  
  // Carregar peças e checklist quando veículo é selecionado
  useEffect(() => {
    if (selectedVehicle && autoLoadChecklist) {
      loadParts();
      loadChecklistStatus();
    }
  }, [selectedVehicle, autoLoadChecklist, loadParts, loadChecklistStatus]);
  
  // ============================================================================
  // SEED OPERATIONS
  // ============================================================================
  
  const [seedProgress, setSeedProgress] = useState<{ phase: string; current: number; total: number } | null>(null);
  
  const seedDatabase = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSeedProgress({ phase: 'Iniciando...', current: 0, total: 100 });
    
    try {
      // Mostrar estatísticas da base local
      const stats = getLocalDatabaseStats();
      // Use forceReseedWithRealData to ensure we have the latest real data
      const result = await forceReseedWithRealData((progress) => {
        setSeedProgress(progress);
      });
      
      if (result.success) {
        setIsSeeded(true);
      } else {
        console.error('[useAutomotiveBackend] ⚠️ Seed com erros:', result.errors);
        setError(`Seed parcial: ${result.errors.length} erros. ${result.vehiclesSaved} veículos salvos.`);
        setIsSeeded(result.vehiclesSaved > 0);
      }
    } catch (err: any) {
      console.error('[useAutomotiveBackend] ❌ Erro no seed:', err);
      setError(err.message || 'Erro ao popular banco de dados');
    } finally {
      setIsLoading(false);
      setSeedProgress(null);
    }
  }, []);
  
  const checkSeed = useCallback(async () => {
    try {
      const status = await checkMassiveSeedStatus();
      
      // If data needs update (old fake codes detected), force reseed
      if (status.needsUpdate) {
        setIsSeeded(false);
        return;
      }
      
      setIsSeeded(status.isSeeded);
      if (status.isSeeded) {
        }
    } catch (err) {
      console.error('[useAutomotiveBackend] Erro ao verificar seed:', err);
    }
  }, []);
  
  // Verificar seed ao inicializar
  useEffect(() => {
    checkSeed();
  }, [checkSeed]);
  
  // ============================================================================
  // MATRIZ DE COMPATIBILIDADE
  // ============================================================================
  
  const getPartsFromMatrix = useCallback((vehicle: { brand: string; model: string; year: number }): PartSearchResult[] => {
    const platformId = findPlatformForVehicle(vehicle);
    
    if (!platformId) {
      return [];
    }
    
    const partsPrefix = getPartsPrefix(platformId);
    if (!partsPrefix) return [];
    
    const compatibleParts = ALL_REAL_PARTS.filter(part => 
      part.id.startsWith(partsPrefix)
  );

  return compatibleParts.map(part => ({
      id: part.id,
      name: part.name,
      category: part.category,
      categoryName: part.category,
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
  }, []);
  
  const hasCoverage = useCallback((vehicle: { brand: string; model: string; year: number }): boolean => {
    return hasPartsCoverage(vehicle);
  }, []);
  
  const coverageStats = getCoverageStats();
  
  // ============================================================================
  // RETURN
  // ============================================================================
  
  return {
    // Estado
    isLoading,
    error,
    isSeeded,
    seedProgress,
    
    // Veículos
    vehicles,
    selectedVehicle,
    searchVehicles,
    selectVehicle,
    clearSelection,
    
    // Peças
    parts,
    partsByCategory,
    loadParts,
    loadPartsByCategory,
    
    // Checklist
    checklistStatus,
    loadChecklistStatus,
    
    // Categorias
    categories: checklistStatus?.categories || [],
    selectedCategory,
    setSelectedCategory,
    
    // Cross-compatibility
    getSharedParts,
    
    // Seed
    seedDatabase,
    checkSeed,
    
    // Matriz de Compatibilidade
    getPartsFromMatrix,
    hasCoverage,
    coverageStats,
  };
}

export default useAutomotiveBackend;
