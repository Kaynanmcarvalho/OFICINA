import { useState, useEffect, useCallback } from 'react';
import costVariationScannerService from '../services/costVariationScannerService';

export const useCostVariationScanner = (productId, empresaId, period = 90) => {
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadScan = useCallback(async () => {
    if (!productId || !empresaId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await costVariationScannerService.scanProductCostVariation(
        productId,
        empresaId,
        period
      );
      setScan(data);
    } catch (err) {
      console.error('Erro ao carregar scan:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId, empresaId, period]);

  useEffect(() => {
    loadScan();
  }, [loadScan]);

  const refresh = useCallback(() => {
    loadScan();
  }, [loadScan]);

  return {
    scan,
    loading,
    error,
    refresh
  };
};

export const useBulkCostVariationScanner = (productIds, empresaId, period = 90) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadScans = useCallback(async () => {
    if (!productIds?.length || !empresaId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await costVariationScannerService.scanMultipleProducts(
        productIds,
        empresaId,
        period
      );
      setScans(data);
    } catch (err) {
      console.error('Erro ao carregar scans:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productIds, empresaId, period]);

  useEffect(() => {
    loadScans();
  }, [loadScans]);

  const refresh = useCallback(() => {
    loadScans();
  }, [loadScans]);

  const highVariationProducts = useCallback(() => {
    return costVariationScannerService.identifyHighVariationProducts(scans);
  }, [scans]);

  return {
    scans,
    loading,
    error,
    refresh,
    highVariationProducts
  };
};
