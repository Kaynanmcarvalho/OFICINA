/**
 * Hook para previsão de estoque
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getStockPrediction,
  getAllStockPredictions,
  getCriticalProducts,
  calculateStockPrediction
} from '../services/stockPredictionService';

export function useStockPrediction(productId = null) {
  const { currentUser } = useAuth();
  const [prediction, setPrediction] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [criticalProducts, setCriticalProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const empresaId = currentUser?.empresaId;

  // Buscar previsão de um produto específico
  useEffect(() => {
    if (productId && empresaId) {
      loadPrediction();
    }
  }, [productId, empresaId]);

  // Buscar todas as previsões
  useEffect(() => {
    if (!productId && empresaId) {
      loadAllPredictions();
      loadCriticalProducts();
    }
  }, [productId, empresaId]);

  const loadPrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStockPrediction(productId, empresaId);
      setPrediction(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar previsão:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllStockPredictions(empresaId);
      setPredictions(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar previsões:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCriticalProducts = async () => {
    try {
      const data = await getCriticalProducts(empresaId, 7);
      setCriticalProducts(data);
    } catch (err) {
      console.error('Erro ao carregar produtos críticos:', err);
    }
  };

  const recalculate = async (prodId = productId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await calculateStockPrediction(prodId, empresaId);
      if (prodId === productId) {
        setPrediction(data);
      }
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao recalcular previsão:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    if (productId) {
      loadPrediction();
    } else {
      loadAllPredictions();
      loadCriticalProducts();
    }
  };

  return {
    prediction,
    predictions,
    criticalProducts,
    loading,
    error,
    recalculate,
    refresh
  };
}
