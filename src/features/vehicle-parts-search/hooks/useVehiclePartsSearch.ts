/**
 * useVehiclePartsSearch Hook
 * Hook para gerenciar estado e lógica da busca de peças por veículo
 * @version 1.0.0
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { searchVehicles, getVehicleById, groupSuggestionsByBrand } from '../services/vehicleSearchService';
import { findCompatibleParts, getAvailableCategories, getAvailablePartBrands, saveManualCompatibility } from '../services/compatibilityService';
import type { 
  NormalizedVehicle, 
  VehicleSuggestion, 
  CompatiblePart, 
  PartSearchFilters,
  VehiclePartsSearchState,
  PartCategory
} from '../types';

interface UseVehiclePartsSearchOptions {
  empresaId: string;
  debounceMs?: number;
  minQueryLength?: number;
}

interface UseVehiclePartsSearchReturn extends VehiclePartsSearchState {
  // Actions
  setSearchQuery: (query: string) => void;
  selectVehicle: (vehicleId: string) => Promise<void>;
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
  filteredParts: CompatiblePart[];
  stats: {
    total: number;
    inStock: number;
    verified: number;
    avgConfidence: number;
  };
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
  const { empresaId, debounceMs = 300, minQueryLength = 2 } = options;
  
  // State
  const [searchQuery, setSearchQueryState] = useState('');
  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<NormalizedVehicle | null>(null);
  const [compatibleParts, setCompatibleParts] = useState<CompatiblePart[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingParts, setIsLoadingParts] = useState(false);
  const [filters, setFiltersState] = useState<PartSearchFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [partBrands, setPartBrands] = useState<string[]>([]);
  
  // Refs
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Load categories and brands on mount
  useEffect(() => {
    const loadFiltersData = async () => {
      if (!empresaId) return;
      
      try {
        const [cats, brands] = await Promise.all([
          getAvailableCategories(empresaId),
          getAvailablePartBrands(empresaId),
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
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Clear suggestions if query is too short
    if (query.length < minQueryLength) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }
    
    setIsLoadingSuggestions(true);
    
    // Debounce search
    debounceRef.current = setTimeout(() => {
      try {
        const results = searchVehicles(query, { limit: 20 });
        setSuggestions(results);
      } catch (err) {
        console.error('[useVehiclePartsSearch] Search error:', err);
        setError('Erro ao buscar veículos');
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, debounceMs);
  }, [debounceMs, minQueryLength]);
  
  // Select vehicle and load parts
  const selectVehicle = useCallback(async (vehicleId: string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setError(null);
    setIsLoadingParts(true);
    setSuggestions([]);
    setSearchQueryState('');
    
    try {
      const vehicle = getVehicleById(vehicleId);
      
      if (!vehicle) {
        throw new Error('Veículo não encontrado');
      }
      
      setSelectedVehicle(vehicle);
      
      // Load compatible parts
      const parts = await findCompatibleParts(vehicle, empresaId, filters);
      setCompatibleParts(parts);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[useVehiclePartsSearch] Error selecting vehicle:', err);
        setError(err.message || 'Erro ao carregar peças compatíveis');
      }
    } finally {
      setIsLoadingParts(false);
    }
  }, [empresaId, filters]);
  
  // Clear vehicle selection
  const clearVehicle = useCallback(() => {
    setSelectedVehicle(null);
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
    if (!selectedVehicle || !empresaId) return;
    
    try {
      const userId = sessionStorage.getItem('userId') || 'unknown';
      await saveManualCompatibility(empresaId, productId, selectedVehicle.id, userId);
      
      // Update local state
      setCompatibleParts(prev => 
        prev.map(part => 
          part.productId === productId 
            ? { ...part, manuallyVerified: true, confidence: 1.0, matchType: 'manual' }
            : part
        )
      );
    } catch (err) {
      console.error('[useVehiclePartsSearch] Error confirming compatibility:', err);
      setError('Erro ao confirmar compatibilidade');
    }
  }, [selectedVehicle, empresaId]);
  
  // Refresh parts with current filters
  const refreshParts = useCallback(async () => {
    if (!selectedVehicle || !empresaId) return;
    
    setIsLoadingParts(true);
    setError(null);
    
    try {
      const parts = await findCompatibleParts(selectedVehicle, empresaId, filters);
      setCompatibleParts(parts);
    } catch (err: any) {
      console.error('[useVehiclePartsSearch] Error refreshing parts:', err);
      setError(err.message || 'Erro ao atualizar peças');
    } finally {
      setIsLoadingParts(false);
    }
  }, [selectedVehicle, empresaId, filters]);
  
  // Refresh when filters change
  useEffect(() => {
    if (selectedVehicle) {
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
  
  // Computed: filtered parts (client-side additional filtering)
  const filteredParts = compatibleParts.filter(part => {
    if (filters.inStockOnly && part.stockQuantity <= 0) return false;
    return true;
  });
  
  // Computed: stats
  const stats = {
    total: filteredParts.length,
    inStock: filteredParts.filter(p => p.stockQuantity > 0).length,
    verified: filteredParts.filter(p => p.manuallyVerified).length,
    avgConfidence: filteredParts.length > 0 
      ? filteredParts.reduce((sum, p) => sum + p.confidence, 0) / filteredParts.length 
      : 0,
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);
  
  return {
    // State
    searchQuery,
    suggestions,
    selectedVehicle,
    compatibleParts: filteredParts,
    isLoadingSuggestions,
    isLoadingParts,
    filters,
    viewMode,
    error,
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
    filteredParts,
    stats,
  };
};

export default useVehiclePartsSearch;
