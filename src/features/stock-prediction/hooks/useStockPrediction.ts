/**
 * TORQ Stock Prediction - Hook
 * Hook React para previsão de estoque
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { stockPredictionService } from '../services/stockPredictionService';
import type {
  StockPrediction,
  StockStatus,
  ReorderSuggestion,
  StockAnalytics,
  PredictionConfig,
} from '../types';

interface UseStockPredictionOptions {
  empresaId: string;
  autoLoad?: boolean;
  refreshInterval?: number; // em minutos
}

interface UseStockPredictionReturn {
  // Estado
  predictions: StockPrediction[];
  reorderSuggestions: ReorderSuggestion[];
  analytics: StockAnalytics | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Ações
  loadPredictions: () => Promise<void>;
  loadReorderSuggestions: () => Promise<void>;
  loadAnalytics: (startDate: Date, endDate: Date) => Promise<void>;
  setConfig: (config: Partial<PredictionConfig>) => void;
  refresh: () => Promise<void>;
  clearError: () => void;

  // Filtros
  filterByStatus: (status: StockStatus | null) => void;
  filterByUrgency: (urgency: StockPrediction['urgency'] | null) => void;
  searchByName: (query: string) => void;

  // Dados filtrados
  filteredPredictions: StockPrediction[];
  
  // Estatísticas
  stats: {
    total: number;
    critical: number;
    low: number;
    optimal: number;
    excess: number;
    stockout: number;
  };
}

export function useStockPrediction(
  options: UseStockPredictionOptions
): UseStockPredictionReturn {
  const { empresaId, autoLoad = true, refreshInterval } = options;

  // Estados
  const [predictions, setPredictions] = useState<StockPrediction[]>([]);
  const [reorderSuggestions, setReorderSuggestions] = useState<ReorderSuggestion[]>([]);
  const [analytics, setAnalytics] = useState<StockAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Filtros
  const [statusFilter, setStatusFilter] = useState<StockStatus | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState<StockPrediction['urgency'] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Carrega previsões
   */
  const loadPredictions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await stockPredictionService.generatePredictions(empresaId);
      setPredictions(result);
      setLastUpdated(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar previsões';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [empresaId]);

  /**
   * Carrega sugestões de reposição
   */
  const loadReorderSuggestions = useCallback(async () => {
    try {
      const result = await stockPredictionService.getReorderSuggestions(empresaId);
      setReorderSuggestions(result);
    } catch (err) {
      console.error('Erro ao carregar sugestões:', err);
    }
  }, [empresaId]);

  /**
   * Carrega analytics
   */
  const loadAnalytics = useCallback(
    async (startDate: Date, endDate: Date) => {
      try {
        const result = await stockPredictionService.getStockAnalytics(
          empresaId,
          startDate,
          endDate
        );
        setAnalytics(result);
      } catch (err) {
        console.error('Erro ao carregar analytics:', err);
      }
    },
    [empresaId]
  );

  /**
   * Configura parâmetros
   */
  const setConfig = useCallback((config: Partial<PredictionConfig>) => {
    stockPredictionService.setConfig(config);
  }, []);

  /**
   * Atualiza tudo
   */
  const refresh = useCallback(async () => {
    await Promise.all([
      loadPredictions(),
      loadReorderSuggestions(),
    ]);
  }, [loadPredictions, loadReorderSuggestions]);

  /**
   * Limpa erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Filtros
   */
  const filterByStatus = useCallback((status: StockStatus | null) => {
    setStatusFilter(status);
  }, []);

  const filterByUrgency = useCallback((urgency: StockPrediction['urgency'] | null) => {
    setUrgencyFilter(urgency);
  }, []);

  const searchByName = useCallback((query: string) => {
    setSearchQuery(query.toLowerCase());
  }, []);

  /**
   * Previsões filtradas
   */
  const filteredPredictions = useMemo(() => {
    return predictions.filter(p => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (urgencyFilter && p.urgency !== urgencyFilter) return false;
      if (searchQuery && !p.partName.toLowerCase().includes(searchQuery)) return false;
      return true;
    });
  }, [predictions, statusFilter, urgencyFilter, searchQuery]);

  /**
   * Estatísticas
   */
  const stats = useMemo(() => {
    const result = {
      total: predictions.length,
      critical: 0,
      low: 0,
      optimal: 0,
      excess: 0,
      stockout: 0,
    };

    predictions.forEach(p => {
      result[p.status]++;
    });

    return result;
  }, [predictions]);

  /**
   * Auto-load
   */
  useEffect(() => {
    if (autoLoad && empresaId) {
      refresh();
    }
  }, [autoLoad, empresaId, refresh]);

  /**
   * Refresh automático
   */
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval, refresh]);

  return {
    // Estado
    predictions,
    reorderSuggestions,
    analytics,
    isLoading,
    error,
    lastUpdated,

    // Ações
    loadPredictions,
    loadReorderSuggestions,
    loadAnalytics,
    setConfig,
    refresh,
    clearError,

    // Filtros
    filterByStatus,
    filterByUrgency,
    searchByName,

    // Dados
    filteredPredictions,
    stats,
  };
}
