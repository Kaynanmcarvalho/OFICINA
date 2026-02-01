/**
 * TORQ Parts Compatibility - Hook
 * Hook React para gerenciar compatibilidade de peças
 */

import { useState, useCallback, useMemo } from 'react';
import { partsCompatibilityService } from '../services/partsCompatibilityService';
import type {
  Part,
  PartCategory,
  CompatibilitySearchRequest,
  CompatibilitySearchResult,
  PartWithCompatibility,
  VehiclePartsProfile,
  PartAlternative,
} from '../types';

interface UsePartsCompatibilityOptions {
  empresaId: string;
  autoSearch?: boolean;
}

interface UsePartsCompatibilityReturn {
  // Estado
  searchResult: CompatibilitySearchResult | null;
  selectedPart: Part | null;
  alternatives: PartAlternative[];
  vehicleProfile: VehiclePartsProfile | null;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;

  // Ações
  searchParts: (request: CompatibilitySearchRequest) => Promise<void>;
  searchByVehicle: (make: string, model: string, year: number, engine?: string) => Promise<void>;
  searchByPartNumber: (partNumber: string) => Promise<void>;
  searchByPartName: (partName: string, vehicleInfo?: { make?: string; model?: string; year?: number }) => Promise<void>;
  selectPart: (partId: string) => Promise<void>;
  loadAlternatives: (partId: string) => Promise<void>;
  loadVehicleProfile: (
    vehicleId: string,
    plate: string,
    info: { make: string; model: string; year: number; engine?: string }
  ) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;

  // Filtros
  filterByCategory: (category: PartCategory | null) => void;
  filterByPriceRange: (min?: number, max?: number) => void;
  filterInStockOnly: (inStock: boolean) => void;

  // Dados filtrados
  filteredParts: PartWithCompatibility[];
  categories: { category: PartCategory; count: number }[];
}

export function usePartsCompatibility(
  options: UsePartsCompatibilityOptions
): UsePartsCompatibilityReturn {
  const { empresaId } = options;

  // Estados
  const [searchResult, setSearchResult] = useState<CompatibilitySearchResult | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [alternatives, setAlternatives] = useState<PartAlternative[]>([]);
  const [vehicleProfile, setVehicleProfile] = useState<VehiclePartsProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros locais
  const [categoryFilter, setCategoryFilter] = useState<PartCategory | null>(null);
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();
  const [inStockOnly, setInStockOnly] = useState(false);

  /**
   * Busca peças com filtros
   */
  const searchParts = useCallback(
    async (request: CompatibilitySearchRequest) => {
      setIsSearching(true);
      setError(null);

      try {
        const result = await partsCompatibilityService.searchCompatibleParts(
          request,
          empresaId
        );

        setSearchResult(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar peças';
        setError(message);
      } finally {
        setIsSearching(false);
      }
    },
    [empresaId]
  );

  /**
   * Busca por veículo
   */
  const searchByVehicle = useCallback(
    async (make: string, model: string, year: number, engine?: string) => {
      await searchParts({
        vehicleMake: make,
        vehicleModel: model,
        vehicleYear: year,
        vehicleEngine: engine,
        inStockOnly,
      });
    },
    [searchParts, inStockOnly]
  );

  /**
   * Busca por número da peça
   */
  const searchByPartNumber = useCallback(
    async (partNumber: string) => {
      await searchParts({
        partNumber,
        inStockOnly,
      });
    },
    [searchParts, inStockOnly]
  );

  /**
   * Busca por nome da peça
   */
  const searchByPartName = useCallback(
    async (partName: string, vehicleInfo?: { make?: string; model?: string; year?: number }) => {
      await searchParts({
        partName,
        vehicleMake: vehicleInfo?.make,
        vehicleModel: vehicleInfo?.model,
        vehicleYear: vehicleInfo?.year,
        inStockOnly,
      });
    },
    [searchParts, inStockOnly]
  );

  /**
   * Seleciona uma peça
   */
  const selectPart = useCallback(
    async (partId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const part = await partsCompatibilityService.getPartById(partId, empresaId);
        setSelectedPart(part);

        // Carregar alternativas automaticamente
        if (part) {
          const alts = await partsCompatibilityService.getPartAlternatives(
            partId,
            empresaId
          );

          setAlternatives(alts);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar peça';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [empresaId]
  );

  /**
   * Carrega alternativas
   */
  const loadAlternatives = useCallback(
    async (partId: string) => {
      try {
        const alts = await partsCompatibilityService.getPartAlternatives(
          partId,
          empresaId
        );

        setAlternatives(alts);
      } catch (err) {
        console.error('Erro ao carregar alternativas:', err);
      }
    },
    [empresaId]
  );

  /**
   * Carrega perfil de peças do veículo
   */
  const loadVehicleProfile = useCallback(
    async (
      vehicleId: string,
      plate: string,
      info: { make: string; model: string; year: number; engine?: string }
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const profile = await partsCompatibilityService.getVehiclePartsProfile(
          vehicleId,
          plate,
          info,
          empresaId

        );

        setVehicleProfile(profile);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar perfil';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [empresaId]
  );

  /**
   * Limpa busca
   */
  const clearSearch = useCallback(() => {
    setSearchResult(null);
    setSelectedPart(null);
    setAlternatives([]);
    setCategoryFilter(null);
    setPriceMin(undefined);
    setPriceMax(undefined);
  }, []);

  /**
   * Limpa erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Filtros
   */
  const filterByCategory = useCallback((category: PartCategory | null) => {
    setCategoryFilter(category);
  }, []);

  const filterByPriceRange = useCallback((min?: number, max?: number) => {
    setPriceMin(min);
    setPriceMax(max);
  }, []);

  const filterInStockOnly = useCallback((inStock: boolean) => {
    setInStockOnly(inStock);
  }, []);

  /**
   * Peças filtradas
   */
  const filteredParts = useMemo(() => {
    if (!searchResult?.parts) return [];

    return searchResult.parts.filter((part) => {
      if (categoryFilter && part.category !== categoryFilter) return false;
      if (priceMin !== undefined && part.price < priceMin) return false;
      if (priceMax !== undefined && part.price > priceMax) return false;
      if (inStockOnly && (!part.stockQuantity || part.stockQuantity <= 0)) return false;
      return true;
    });
  }, [searchResult, categoryFilter, priceMin, priceMax, inStockOnly]);

  /**
   * Categorias com contagem
   */
  const categories = useMemo(() => {
    if (!searchResult?.parts) return [];

    const counts: Record<string, number> = {};
    searchResult.parts.forEach((part) => {
      counts[part.category] = (counts[part.category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([category, count]) => ({
        category: category as PartCategory,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [searchResult]);

  return {
    // Estado
    searchResult,
    selectedPart,
    alternatives,
    vehicleProfile,
    isLoading,
    isSearching,
    error,

    // Ações
    searchParts,
    searchByVehicle,
    searchByPartNumber,
    searchByPartName,
    selectPart,
    loadAlternatives,
    loadVehicleProfile,
    clearSearch,
    clearError,

    // Filtros
    filterByCategory,
    filterByPriceRange,
    filterInStockOnly,

    // Dados
    filteredParts,
    categories,
  };
}
