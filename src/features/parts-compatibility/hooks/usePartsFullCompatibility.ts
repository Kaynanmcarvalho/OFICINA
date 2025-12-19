/**
 * Hook de Compatibilidade Completa de Peças
 * Gerencia estado e chamadas à API de peças com cross-compatibility
 * 
 * @version 2.0.0
 */

import { useState, useCallback, useEffect } from 'react';
import partsFullService, {
  type VehicleCompatibility,
  type VehicleSearchResult,
  type CompatibilityStats,
  type PartData,
  type CheaperAlternative,
  type CrossCompatibleVehicle,
} from '../services/partsFullService';

interface UsePartsFullCompatibilityState {
  // Data
  stats: CompatibilityStats | null;
  vehicleData: VehicleCompatibility | null;
  searchResults: VehicleSearchResult[];
  categories: string[];
  platforms: string[];
  
  // Loading states
  isLoading: boolean;
  isSearching: boolean;
  
  // Error
  error: string | null;
  
  // Selected
  selectedCategory: string | null;
  selectedPart: PartData | null;
}

interface UsePartsFullCompatibilityReturn extends UsePartsFullCompatibilityState {
  // Actions
  loadStats: () => Promise<void>;
  loadVehicle: (vehicleId: string) => Promise<void>;
  loadVehicleByInfo: (brand: string, model: string, year: number) => Promise<void>;
  searchVehicles: (params: { brand?: string; model?: string; year?: number; type?: string }) => Promise<void>;
  loadCategories: () => Promise<void>;
  loadPlatforms: () => Promise<void>;
  
  // Part actions
  selectCategory: (category: string | null) => void;
  selectPart: (part: PartData | null) => void;
  getCheaperAlternatives: (partNumber: string) => Promise<{ alternatives: CheaperAlternative[]; crossCompatible: CrossCompatibleVehicle[] }>;
  getCrossCompatibility: (partNumber: string) => Promise<{ totalVehicles: number; byBrand: Record<string, VehicleSearchResult[]> }>;
  
  // Helpers
  getPartsByCategory: (category: string) => PartData[];
  getTotalSavings: () => { totalOriginal: number; totalWithAlternatives: number; totalSavings: number; savingsPercent: number };
  formatPrice: (price: number) => string;
  clearError: () => void;
  reset: () => void;
}

export function usePartsFullCompatibility(): UsePartsFullCompatibilityReturn {
  const [state, setState] = useState<UsePartsFullCompatibilityState>({
    stats: null,
    vehicleData: null,
    searchResults: [],
    categories: [],
    platforms: [],
    isLoading: false,
    isSearching: false,
    error: null,
    selectedCategory: null,
    selectedPart: null,
  });

  // Load stats
  const loadStats = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const stats = await partsFullService.getStats();
      setState(prev => ({ ...prev, stats, isLoading: false }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Erro ao carregar estatísticas',
        isLoading: false 
      }));
    }
  }, []);

  // Load vehicle by ID
  const loadVehicle = useCallback(async (vehicleId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const vehicleData = await partsFullService.getVehicleCompatibility(vehicleId);
      setState(prev => ({ 
        ...prev, 
        vehicleData, 
        isLoading: false,
        selectedCategory: null,
        selectedPart: null,
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Veículo não encontrado',
        isLoading: false 
      }));
    }
  }, []);

  // Load vehicle by brand/model/year
  const loadVehicleByInfo = useCallback(async (brand: string, model: string, year: number) => {
    const vehicleId = partsFullService.generateVehicleId(brand, model, year);
    await loadVehicle(vehicleId);
  }, [loadVehicle]);

  // Search vehicles
  const searchVehicles = useCallback(async (params: { brand?: string; model?: string; year?: number; type?: string }) => {
    setState(prev => ({ ...prev, isSearching: true, error: null }));
    try {
      const searchResults = await partsFullService.searchVehicles(params);
      setState(prev => ({ ...prev, searchResults, isSearching: false }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Erro na busca',
        isSearching: false 
      }));
    }
  }, []);

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const categories = await partsFullService.getCategories();
      setState(prev => ({ ...prev, categories }));
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  }, []);

  // Load platforms
  const loadPlatforms = useCallback(async () => {
    try {
      const result = await partsFullService.getPlatforms();
      setState(prev => ({ ...prev, platforms: result.data }));
    } catch (err) {
      console.error('Erro ao carregar plataformas:', err);
    }
  }, []);

  // Select category
  const selectCategory = useCallback((category: string | null) => {
    setState(prev => ({ ...prev, selectedCategory: category, selectedPart: null }));
  }, []);

  // Select part
  const selectPart = useCallback((part: PartData | null) => {
    setState(prev => ({ ...prev, selectedPart: part }));
  }, []);

  // Get cheaper alternatives
  const getCheaperAlternatives = useCallback(async (partNumber: string) => {
    if (!state.vehicleData) {
      throw new Error('Nenhum veículo selecionado');
    }
    return partsFullService.getCheaperAlternatives(state.vehicleData.vehicleId, partNumber);
  }, [state.vehicleData]);

  // Get cross compatibility
  const getCrossCompatibility = useCallback(async (partNumber: string) => {
    const result = await partsFullService.getCrossCompatibility(partNumber);
    return {
      totalVehicles: result.totalVehicles,
      byBrand: result.byBrand,
    };
  }, []);

  // Get parts by category
  const getPartsByCategory = useCallback((category: string): PartData[] => {
    if (!state.vehicleData) return [];
    return state.vehicleData.partsByCategory[category] || [];
  }, [state.vehicleData]);

  // Get total savings
  const getTotalSavings = useCallback(() => {
    if (!state.vehicleData) {
      return { totalOriginal: 0, totalWithAlternatives: 0, totalSavings: 0, savingsPercent: 0 };
    }
    return partsFullService.calculateTotalSavings(state.vehicleData.compatibleParts);
  }, [state.vehicleData]);

  // Format price
  const formatPrice = useCallback((price: number) => {
    return partsFullService.formatPrice(price);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Reset
  const reset = useCallback(() => {
    setState({
      stats: null,
      vehicleData: null,
      searchResults: [],
      categories: [],
      platforms: [],
      isLoading: false,
      isSearching: false,
      error: null,
      selectedCategory: null,
      selectedPart: null,
    });
  }, []);

  // Load initial data
  useEffect(() => {
    loadStats();
    loadCategories();
  }, [loadStats, loadCategories]);

  return {
    ...state,
    loadStats,
    loadVehicle,
    loadVehicleByInfo,
    searchVehicles,
    loadCategories,
    loadPlatforms,
    selectCategory,
    selectPart,
    getCheaperAlternatives,
    getCrossCompatibility,
    getPartsByCategory,
    getTotalSavings,
    formatPrice,
    clearError,
    reset,
  };
}

export default usePartsFullCompatibility;
