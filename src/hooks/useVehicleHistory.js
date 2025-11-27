/**
 * useVehicleHistory Hook
 * Hook customizado para gerenciar histórico veicular
 */

import { useState, useEffect, useCallback } from 'react';
import vehicleHistoryService from '../services/vehicleHistoryService';
import { useAuthStore } from '../store/authStore';

export function useVehicleHistory(placa) {
  const { user } = useAuthStore();
  const empresaId = user?.organizationId || sessionStorage.getItem('empresaId');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cached, setCached] = useState(false);

  /**
   * Busca histórico do veículo
   */
  const fetchHistory = useCallback(async (forceRefresh = false) => {
    if (!placa || !empresaId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await vehicleHistoryService.getVehicleHistory(
        placa,
        empresaId,
        forceRefresh
      );

      if (result.success) {
        setHistory(result.data);
        setCached(result.cached);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [placa, empresaId]);

  /**
   * Atualiza histórico (força refresh)
   */
  const refreshHistory = useCallback(() => {
    return fetchHistory(true);
  }, [fetchHistory]);

  /**
   * Busca histórico ao montar ou quando placa mudar
   */
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  /**
   * Verifica se tem recalls pendentes
   */
  const hasRecalls = history?.recalls?.length > 0;
  const hasPendingRecalls = history?.recalls?.some(r => r.status === 'pendente');

  /**
   * Verifica se tem leilões
   */
  const hasLeiloes = history?.leiloes?.length > 0;

  /**
   * Verifica se tem sinistros
   */
  const hasSinistros = history?.sinistros?.length > 0;

  /**
   * Verifica se tem restrições ativas
   */
  const hasRestricoes = history?.restricoes?.some(r => r.status === 'ativa');

  /**
   * Calcula nível de risco
   */
  const riskLevel = history?.summary?.risco || 'baixo';

  /**
   * Verifica se deve mostrar alerta
   */
  const shouldShowAlert = hasPendingRecalls || hasSinistros || hasRestricoes;

  return {
    history,
    loading,
    error,
    cached,
    fetchHistory,
    refreshHistory,
    hasRecalls,
    hasPendingRecalls,
    hasLeiloes,
    hasSinistros,
    hasRestricoes,
    riskLevel,
    shouldShowAlert
  };
}
