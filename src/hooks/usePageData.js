import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/authStore.jsx';

/**
 * Hook para carregar dados de uma página sob demanda
 * Evita carregar todos os dados no início da aplicação
 */
export function usePageData(storeName, fetchFn, options = {}) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoaded = useRef(false);
  const { enabled = true, dependencies = [] } = options;

  const loadData = useCallback(async () => {
    if (!user || !enabled || hasLoaded.current) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await fetchFn();
      hasLoaded.current = true;
    } catch (err) {
      console.error(`Error loading ${storeName}:`, err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  }, [user, enabled, fetchFn, storeName]);

  useEffect(() => {
    loadData();
  }, [loadData, ...dependencies]);

  const refetch = useCallback(() => {
    hasLoaded.current = false;
    loadData();
  }, [loadData]);

  return { isLoading, error, refetch };
}

/**
 * Hook para carregar múltiplos stores de uma vez
 */
export function useMultiplePageData(stores, options = {}) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const hasLoaded = useRef(false);
  const { enabled = true, parallel = true } = options;

  const loadAllData = useCallback(async () => {
    if (!user || !enabled || hasLoaded.current) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});

      if (parallel) {
        // Load all stores in parallel
        const results = await Promise.allSettled(
          stores.map(({ name, fetchFn }) => 
            fetchFn().catch(err => {
              throw { name, error: err };
            })
          )
        );

        const newErrors = {};
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            newErrors[stores[index].name] = result.reason?.error?.message || 'Erro';
          }
        });
        setErrors(newErrors);
      } else {
        // Load stores sequentially
        for (const { name, fetchFn } of stores) {
          try {
            await fetchFn();
          } catch (err) {
            setErrors(prev => ({ ...prev, [name]: err.message }));
          }
        }
      }

      hasLoaded.current = true;
    } finally {
      setIsLoading(false);
    }
  }, [user, enabled, stores, parallel]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const refetch = useCallback(() => {
    hasLoaded.current = false;
    loadAllData();
  }, [loadAllData]);

  return { isLoading, errors, refetch, hasErrors: Object.keys(errors).length > 0 };
}

/**
 * Hook para setup de listeners em tempo real
 */
export function useRealtimeListener(subscribeFn, options = {}) {
  const { user } = useAuthStore();
  const { enabled = true } = options;

  useEffect(() => {
    if (!user || !enabled) return;

    const unsubscribe = subscribeFn();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user, enabled, subscribeFn]);
}

export default usePageData;
