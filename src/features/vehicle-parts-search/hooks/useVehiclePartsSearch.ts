/**
 * useVehiclePartsSearch Hook
 * Hook para gerenciar estado e lógica da busca de peças por veículo
 * @version 2.0.0
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { searchVehicles, getVehicleById, getRelatedVariants, groupSuggestionsByBrand } from '../services/vehicleSearchService';
import { findCompatibleParts, getAvailableCategories, getAvailablePartBrands, saveManualCompatibility } from '../services/compatibilityService';
import type { 
  VehicleVariant, 
  VehicleSuggestion, 
  CompatiblePart, 
  PartSearchFilters,
  VehiclePartsSearchState,
  PartCategory,
  CompatibilityStats,
  MatchType,
} from '../types';

interface UseVehiclePartsSearchOptions {
  empresaId: string;
  debounceMs?: number;
  minQueryLength?: number;
}

interface UseVehiclePartsSearchReturn extends VehiclePartsSearchState {
  // Actions
  setSearchQuery: (query: string) => void;
  selectVehicle: (variantId: string) => Promise<void>;
  clearVehicle: () => void;
  setFilters: (filters: Partial<PartSearchFilters>) => void;
  resetFilters: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  confirmCompatibility: (productId: string) => Promise<void>;
  refreshParts: () => Promise<void>;
  // Computed
  groupedSuggestions: Record<string, VehicleSuggestion[]>;
  categories: PartCategory[];
  partBrands: string[];
  stats: CompatibilityStats;
}

const DEFAULT_FILTERS: PartSearchFilters = {
  category: undefined,
  brand: undefined,
  inStockOnly: false,
  minConfidence: 0.4,
  matchTypes: undefined,
  priceMin: undefined,
  priceMax: undefined,
};

export const useVehiclePartsSearch = (options: UseVehiclePartsSearchOptions): UseVehiclePartsSearchReturn => {
  const { empresaId, debounceMs = 150, minQueryLength = 2 } = options;
  
  // State
  const [searchQuery, setSearchQueryState] = useState('');
  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariant | null>(null);
  const [availableTrims, setAvailableTrims] = useState<VehicleVariant[]>([]);
  const [compatibleParts, setCompatibleParts] = useState<CompatiblePart[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingParts, setIsLoadingParts] = useState(false);
  const [filters, setFiltersState] = useState<PartSearchFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [partBrands, setPartBrands] = useState<string[]>([]);
  
  // Refs
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load categories and brands on mount
  useEffect(() => {
    const loadFiltersData = async () => {
      // Calcula effectiveEmpresaId dentro do effect
      const isSuperAdminCheck = !empresaId && !!sessionStorage.getItem('userId');
      const effectiveId = empresaId || (isSuperAdminCheck ? '__super_admin__' : '');
      
      if (!effectiveId) return;
      
      try {
        const [cats, brands] = await Promise.all([
          getAvailableCategories(effectiveId),
          getAvailablePartBrands(effectiveId),
        ]);
        setCategories(cats);
        setPartBrands(brands);
      } catch (err) {
        console.error('[useVehiclePartsSearch] Error loading filter data:', err);
      }
    };
    
    loadFiltersData();
  }, [empresaId]);


  // Debounced search
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
    setError(null);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (query.length < minQueryLength) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }
    
    setIsLoadingSuggestions(true);
    
    debounceRef.current = setTimeout(() => {
      try {
        const results = searchVehicles(query, { limit: 25 });
        setSuggestions(results);
      } catch (err) {
        console.error('[useVehiclePartsSearch] Search error:', err);
        setError('Erro ao buscar veículos');
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, debounceMs);
  }, [debounceMs, minQueryLength]);

  // Verifica se é Super Admin (não tem empresaId mas tem userId)
  const isSuperAdmin = !empresaId && !!sessionStorage.getItem('userId');
  
  // empresaId efetivo - SEMPRE permite busca local de peças mesmo sem empresaId
  // O engine local de peças não precisa de empresaId, apenas a busca no inventário
  const effectiveEmpresaId = empresaId || (isSuperAdmin ? '__super_admin__' : '__local_search__');

  // Select vehicle and load parts
  const selectVehicle = useCallback(async (variantId: string) => {
    // REMOVIDO: Validação de empresaId - agora permite busca local sempre
    // O engine de peças funciona localmente sem precisar de Firebase/empresaId
    console.log(`[useVehiclePartsSearch] Selecting vehicle, empresaId: ${effectiveEmpresaId}, isSuperAdmin: ${isSuperAdmin}`);
    
    console.log(`[useVehiclePartsSearch] Selecting vehicle, empresaId: ${effectiveEmpresaId}, isSuperAdmin: ${isSuperAdmin}`);
    
    setError(null);
    setIsLoadingParts(true);
    setSuggestions([]);
    setSearchQueryState('');
    
    try {
      const variant = getVehicleById(variantId);
      if (!variant) {
        throw new Error('Veículo não encontrado');
      }
      
      setSelectedVariant(variant);
      
      // Get related variants (same model/year, different trims)
      const related = getRelatedVariants(variant);
      setAvailableTrims(related);
      
      // Load compatible parts
      const parts = await findCompatibleParts(variant, effectiveEmpresaId, filters);
      setCompatibleParts(parts);
      
      console.log(`[useVehiclePartsSearch] Selected ${variant.brand} ${variant.model} ${variant.year}, found ${parts.length} parts`);
    } catch (err: any) {
      console.error('[useVehiclePartsSearch] Error selecting vehicle:', err);
      setError(err.message || 'Erro ao carregar peças compatíveis');
    } finally {
      setIsLoadingParts(false);
    }
  }, [effectiveEmpresaId, filters, isSuperAdmin]);

  // Clear vehicle selection
  const clearVehicle = useCallback(() => {
    setSelectedVariant(null);
    setAvailableTrims([]);
    setCompatibleParts([]);
    setSearchQueryState('');
    setSuggestions([]);
    setError(null);
  }, []);

  // Update filters
  const setFilters = useCallback((newFilters: Partial<PartSearchFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  // Set view mode
  const setViewMode = useCallback((mode: 'grid' | 'list') => {
    setViewModeState(mode);
  }, []);

  // Confirm manual compatibility
  const confirmCompatibility = useCallback(async (productId: string) => {
    if (!selectedVariant || !effectiveEmpresaId) return;
    
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      await saveManualCompatibility(effectiveEmpresaId, productId, selectedVariant.id, userId);
      
      // Update local state
      setCompatibleParts(prev => 
        prev.map(part => 
          part.productId === productId 
            ? { ...part, manuallyVerified: true, confidence: 1.0, matchType: 'manual' as MatchType }
            : part
        )
      );
    } catch (err) {
      console.error('[useVehiclePartsSearch] Error confirming compatibility:', err);
      setError('Erro ao confirmar compatibilidade');
    }
  }, [selectedVariant, effectiveEmpresaId]);

  // Refresh parts with current filters
  const refreshParts = useCallback(async () => {
    if (!selectedVariant) return;
    if (!effectiveEmpresaId) return;
    
    setIsLoadingParts(true);
    setError(null);
    
    try {
      const parts = await findCompatibleParts(selectedVariant, effectiveEmpresaId, filters);
      setCompatibleParts(parts);
    } catch (err: any) {
      console.error('[useVehiclePartsSearch] Error refreshing parts:', err);
      setError(err.message || 'Erro ao atualizar peças');
    } finally {
      setIsLoadingParts(false);
    }
  }, [selectedVariant, effectiveEmpresaId, filters]);

  // Refresh when filters change
  useEffect(() => {
    if (selectedVariant) {
      refreshParts();
    }
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Computed: grouped suggestions
  const groupedSuggestions = groupSuggestionsByBrand(suggestions);

  // Computed: categories with counts
  const categoriesWithCounts: PartCategory[] = categories.map(cat => ({
    id: cat,
    name: cat,
    icon: 'package',
    count: compatibleParts.filter(p => p.category === cat).length,
  }));

  // Computed: stats
  const stats: CompatibilityStats = {
    total: compatibleParts.length,
    inStock: compatibleParts.filter(p => p.stockQuantity > 0).length,
    verified: compatibleParts.filter(p => p.manuallyVerified).length,
    avgConfidence: compatibleParts.length > 0 
      ? compatibleParts.reduce((sum, p) => sum + p.confidence, 0) / compatibleParts.length 
      : 0,
    byMatchType: compatibleParts.reduce((acc, p) => {
      acc[p.matchType] = (acc[p.matchType] || 0) + 1;
      return acc;
    }, {} as Record<MatchType, number>),
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    // State
    searchQuery,
    suggestions,
    selectedVariant,
    availableTrims,
    compatibleParts,
    isLoadingSuggestions,
    isLoadingParts,
    filters,
    viewMode,
    error,
    showExportModal,
    // Actions
    setSearchQuery,
    selectVehicle,
    clearVehicle,
    setFilters,
    resetFilters,
    setViewMode,
    confirmCompatibility,
    refreshParts,
    // Computed
    groupedSuggestions,
    categories: categoriesWithCounts,
    partBrands,
    stats,
  };
};

export default useVehiclePartsSearch;
