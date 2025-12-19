/**
 * HOOK DE COMPATIBILIDADE DE PEÇAS V2
 * Hook React para busca de peças compatíveis
 * 
 * @version 2.0.0
 */

import { useState, useCallback, useEffect } from 'react';
import partsCompatibilityService, {
  Vehicle,
  CompatibilityResult,
  PartLookupResult,
  EquivalentsResult,
  SearchResult,
  DatabaseStats,
  Category,
  Brand,
} from '../services/partsCompatibilityServiceV2';

interface UsePartsCompatibilityState {
  loading: boolean;
  error: string | null;
  compatibility: CompatibilityResult | null;
  searchResults: SearchResult[];
  partLookup: PartLookupResult | null;
  equivalents: EquivalentsResult | null;
  stats: DatabaseStats | null;
  categories: Category[];
  brands: Brand[];
}

interface UsePartsCompatibilityActions {
  generateCompatibility: (vehicle: Vehicle) => Promise<CompatibilityResult | null>;
  searchParts: (query: string, options?: { category?: string; brand?: string; limit?: number }) => Promise<SearchResult[]>;
  lookupPart: (partNumber: string) => Promise<PartLookupResult | null>;
  findEquivalents: (partNumber: string) => Promise<EquivalentsResult | null>;
  loadStats: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadBrands: () => Promise<void>;
  clearError: () => void;
  clearResults: () => void;
}

export function usePartsCompatibilityV2(): UsePartsCompatibilityState & UsePartsCompatibilityActions {
  const [state, setState] = useState<UsePartsCompatibilityState>({
    loading: false,
    error: null,
    compatibility: null,
    searchResults: [],
    partLookup: null,
    equivalents: null,
    stats: null,
    categories: [],
    brands: [],
  });

  const setLoading = (loading: boolean) => setState(prev => ({ ...prev, loading }));
  const setError = (error: string | null) => setState(prev => ({ ...prev, error, loading: false }));

  /**
   * Gera compatibilidade de peças para um veículo
   */
  const generateCompatibility = useCallback(async (vehicle: Vehicle): Promise<CompatibilityResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await partsCompatibilityService.generateCompatibility(vehicle);
      setState(prev => ({ ...prev, compatibility: result, loading: false }));
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao gerar compatibilidade';
      setError(message);
      return null;
    }
  }, []);

  /**
   * Busca peças por termo
   */
  const searchParts = useCallback(async (
    query: string,
    options?: { category?: string; brand?: string; limit?: number }
  ): Promise<SearchResult[]> => {
    setLoading(true);
    setError(null);

    try {
      const results = await partsCompatibilityService.searchParts(query, options);
      setState(prev => ({ ...prev, searchResults: results, loading: false }));
      return results;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro na busca';
      setError(message);
      return [];
    }
  }, []);

  /**
   * Busca peça por part number
   */
  const lookupPart = useCallback(async (partNumber: string): Promise<PartLookupResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await partsCompatibilityService.lookupPart(partNumber);
      setState(prev => ({ ...prev, partLookup: result, loading: false }));
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar peça';
      setError(message);
      return null;
    }
  }, []);

  /**
   * Busca equivalentes de uma peça
   */
  const findEquivalents = useCallback(async (partNumber: string): Promise<EquivalentsResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await partsCompatibilityService.findEquivalents(partNumber);
      setState(prev => ({ ...prev, equivalents: result, loading: false }));
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar equivalentes';
      setError(message);
      return null;
    }
  }, []);

  /**
   * Carrega estatísticas do banco
   */
  const loadStats = useCallback(async (): Promise<void> => {
    try {
      const stats = await partsCompatibilityService.getStats();
      setState(prev => ({ ...prev, stats }));
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, []);

  /**
   * Carrega categorias
   */
  const loadCategories = useCallback(async (): Promise<void> => {
    try {
      const categories = await partsCompatibilityService.getCategories();
      setState(prev => ({ ...prev, categories }));
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  }, []);

  /**
   * Carrega marcas
   */
  const loadBrands = useCallback(async (): Promise<void> => {
    try {
      const brands = await partsCompatibilityService.getBrands();
      setState(prev => ({ ...prev, brands }));
    } catch (err) {
      console.error('Erro ao carregar marcas:', err);
    }
  }, []);

  /**
   * Limpa erro
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Limpa resultados
   */
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      compatibility: null,
      searchResults: [],
      partLookup: null,
      equivalents: null,
    }));
  }, []);

  // Carrega dados iniciais
  useEffect(() => {
    loadCategories();
    loadBrands();
  }, [loadCategories, loadBrands]);

  return {
    ...state,
    generateCompatibility,
    searchParts,
    lookupPart,
    findEquivalents,
    loadStats,
    loadCategories,
    loadBrands,
    clearError,
    clearResults,
  };
}

export default usePartsCompatibilityV2;
