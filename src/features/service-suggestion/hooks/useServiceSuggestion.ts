/**
 * TORQ Service Suggestion - Hook
 * Hook para usar sugestões de serviços
 */

import { useState, useCallback } from 'react';
import { serviceSuggestionService } from '../services/serviceSuggestionService';
import type {
  SuggestionRequest,
  SuggestionResult,
  ServiceSuggestion,
} from '../types';

interface UseServiceSuggestionReturn {
  // Estado
  result: SuggestionResult | null;
  isLoading: boolean;
  error: string | null;
  
  // Ações
  generateSuggestions: (request: SuggestionRequest) => Promise<SuggestionResult | null>;
  clearSuggestions: () => void;
  
  // Helpers
  getSuggestionsByPriority: (priority: string) => ServiceSuggestion[];
  getSuggestionsByCategory: (category: string) => ServiceSuggestion[];
  getUrgentSuggestions: () => ServiceSuggestion[];
  getTotalEstimate: () => { cost: number; time: number };
}

export function useServiceSuggestion(): UseServiceSuggestionReturn {
  const [result, setResult] = useState<SuggestionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useCallback(async (
    request: SuggestionRequest
  ): Promise<SuggestionResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const suggestions = await serviceSuggestionService.generateSuggestions(request);
      setResult(suggestions);
      return suggestions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar sugestões';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const getSuggestionsByPriority = useCallback((priority: string): ServiceSuggestion[] => {
    if (!result) return [];
    return result.suggestions.filter(s => s.priority === priority);
  }, [result]);

  const getSuggestionsByCategory = useCallback((category: string): ServiceSuggestion[] => {
    if (!result) return [];
    return result.suggestions.filter(s => s.category === category);
  }, [result]);

  const getUrgentSuggestions = useCallback((): ServiceSuggestion[] => {
    if (!result) return [];
    return result.suggestions.filter(s => s.priority === 'urgent');
  }, [result]);

  const getTotalEstimate = useCallback((): { cost: number; time: number } => {
    if (!result) return { cost: 0, time: 0 };
    return {
      cost: result.summary.totalEstimatedCost,
      time: result.summary.totalEstimatedTime,
    };
  }, [result]);

  return {
    result,
    isLoading,
    error,
    generateSuggestions,
    clearSuggestions,
    getSuggestionsByPriority,
    getSuggestionsByCategory,
    getUrgentSuggestions,
    getTotalEstimate,
  };
}

export default useServiceSuggestion;
