/**
 * TORQ Multiuse Parts - Hook
 * Hook React para análise de peças multiuso
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { multiusePartsService } from '../services/multiusePartsService';
import type {
  MultiusePart,
  MultiuseAnalysis,
  MultiuseRank,
  PartCategory,
  PartSubstitute,
  MultiuseSearchRequest,
} from '../types';

interface UseMultiusePartsOptions {
  empresaId: string;
  autoLoad?: boolean;
}

interface UseMultiusePartsReturn {
  // Estado
  analysis: MultiuseAnalysis | null;
  parts: MultiusePart[];
  substitutes: PartSubstitute[];
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;

  // Ações
  runAnalysis: () => Promise<void>;
  loadAnalysis: () => Promise<void>;
  searchParts: (request: MultiuseSearchRequest) => Promise<void>;
  findSubstitutes: (partId: string) => Promise<void>;
  clearError: () => void;

  // Filtros
  filterByRank: (rank: MultiuseRank | null) => void;
  filterByCategory: (category: PartCategory | null) => void;
  setMinScore: (score: number) => void;

  // Dados filtrados
  filteredParts: MultiusePart[];
  
  // Estatísticas
  stats: {
    totalParts: number;
    multiuseParts: number;
    percentage: number;
    potentialSavings: number;
  };
}

export function useMultiuseParts(
  options: UseMultiusePartsOptions
): UseMultiusePartsReturn {
  const { empresaId, autoLoad = false } = options;

  // Estados
  const [analysis, setAnalysis] = useState<MultiuseAnalysis | null>(null);
  const [parts, setParts] = useState<MultiusePart[]>([]);
  const [substitutes, setSubstitutes] = useState<PartSubstitute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [rankFilter, setRankFilter] = useState<MultiuseRank | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<PartCategory | null>(null);
  const [minScore, setMinScoreState] = useState(0);

  /**
   * Executa análise completa
   */
  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await multiusePartsService.analyzeMultiuseParts(empresaId);
      setAnalysis(result);
      setParts(result.topMultiuseParts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao analisar peças';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [empresaId]);

  /**
   * Carrega última análise
   */
  const loadAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await multiusePartsService.getLatestAnalysis(empresaId);
      if (result) {
        setAnalysis(result);
        setParts(result.topMultiuseParts);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar análise';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [empresaId]);

  /**
   * Busca peças com filtros
   */
  const searchParts = useCallback(
    async (request: MultiuseSearchRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await multiusePartsService.searchMultiuseParts(
          request,
          empresaId
        );

        setParts(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar peças';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [empresaId]
  );

  /**
   * Busca substitutos para uma peça
   */
  const findSubstitutes = useCallback(
    async (partId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await multiusePartsService.findSubstitutes(partId, empresaId);
        setSubstitutes(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar substitutos';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [empresaId]
  );

  /**
   * Limpa erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Filtros
   */
  const filterByRank = useCallback((rank: MultiuseRank | null) => {
    setRankFilter(rank);
  }, []);

  const filterByCategory = useCallback((category: PartCategory | null) => {
    setCategoryFilter(category);
  }, []);

  const setMinScore = useCallback((score: number) => {
    setMinScoreState(score);
  }, []);

  /**
   * Peças filtradas
   */
  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      if (rankFilter && part.multiuseRank !== rankFilter) return false;
      if (categoryFilter && part.category !== categoryFilter) return false;
      if (part.multiuseScore < minScore) return false;
      return true;
    });
  }, [parts, rankFilter, categoryFilter, minScore]);

  /**
   * Estatísticas
   */
  const stats = useMemo(() => {
    if (!analysis) {
      return {
        totalParts: 0,
        multiuseParts: 0,
        percentage: 0,
        potentialSavings: 0,
      };
    }

    return {
      totalParts: analysis.totalParts,
      multiuseParts: analysis.multiuseParts,
      percentage: analysis.multiusePercentage,
      potentialSavings: analysis.potentialSavings,
    };
  }, [analysis]);

  /**
   * Auto-load
   */
  useEffect(() => {
    if (autoLoad && empresaId) {
      loadAnalysis();
    }
  }, [autoLoad, empresaId, loadAnalysis]);

  return {
    // Estado
    analysis,
    parts,
    substitutes,
    isLoading,
    isAnalyzing,
    error,

    // Ações
    runAnalysis,
    loadAnalysis,
    searchParts,
    findSubstitutes,
    clearError,

    // Filtros
    filterByRank,
    filterByCategory,
    setMinScore,

    // Dados
    filteredParts,
    stats,
  };
}
