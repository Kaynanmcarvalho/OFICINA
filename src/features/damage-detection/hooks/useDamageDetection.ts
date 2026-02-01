/**
 * TORQ Damage Detection - Hook
 * Hook para análise de danos em fotos
 */

import { useState, useCallback } from 'react';
import {
  analyzeImage,
  analyzeMultipleImages,
  calculateDamageSummary,
} from '../services/damageDetectionService';
import type {
  DamageDetectionResult,
  DamageAnalysisRequest,
  DamageSeverity,
  VehicleCondition,
} from '../types';

interface UseDamageDetectionReturn {
  // Estado
  isAnalyzing: boolean;
  results: DamageDetectionResult[];
  error: string | null;
  summary: {
    totalDamages: number;
    bySeverity: Record<DamageSeverity, number>;
    byType: Record<string, number>;
    overallCondition: VehicleCondition;
  } | null;

  // Ações
  analyzePhoto: (imageBase64: string, vehicleInfo?: DamageAnalysisRequest['vehicleInfo']) => Promise<DamageDetectionResult | null>;
  analyzePhotos: (requests: DamageAnalysisRequest[]) => Promise<DamageDetectionResult[]>;
  clearResults: () => void;
  removeResult: (id: string) => void;
}

export function useDamageDetection(): UseDamageDetectionReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DamageDetectionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Analisar uma única foto
  const analyzePhoto = useCallback(
    async (
      imageBase64: string,
      vehicleInfo?: DamageAnalysisRequest['vehicleInfo']
    ): Promise<DamageDetectionResult | null> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        const result = await analyzeImage({
          imageBase64,
          vehicleInfo,
        });

        setResults((prev) => [...prev, result]);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar imagem';
        setError(errorMessage);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    []

  // Analisar múltiplas fotos
  const analyzePhotos = useCallback(
    async (requests: DamageAnalysisRequest[]): Promise<DamageDetectionResult[]> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        const newResults = await analyzeMultipleImages(requests);
        setResults((prev) => [...prev, ...newResults]);
        return newResults;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar imagens';
        setError(errorMessage);
        return [];
      } finally {
        setIsAnalyzing(false);
      }
    },
    []

  // Limpar todos os resultados
  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  // Remover um resultado específico
  const removeResult = useCallback((id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Calcular resumo
  const summary = results.length > 0 ? calculateDamageSummary(results) : null;

  return {
    isAnalyzing,
    results,
    error,
    summary,
    analyzePhoto,
    analyzePhotos,
    clearResults,
    removeResult,
  };
}

export default useDamageDetection;
