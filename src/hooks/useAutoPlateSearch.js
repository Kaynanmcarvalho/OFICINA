/**
 * TORQ - Hook de Busca Automática de Placa
 * Busca dados do veículo automaticamente após digitar 7 caracteres
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { consultarPlaca, isValidPlate } from '../services/vehicleApiService';
import { validatePlate } from '../utils/validators';

/**
 * Hook para busca automática de placa
 * @param {string} plate - Placa digitada
 * @param {number} debounceMs - Tempo de debounce em ms (padrão: 500)
 * @returns {Object} - { isSearching, vehicleData, error, manualSearch }
 */
export const useAutoPlateSearch = (plate, debounceMs = 500) => {
  const [isSearching, setIsSearching] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const timeoutRef = useRef(null);
  const lastSearchedPlateRef = useRef(null);

  // Limpar placa (remover formatação)
  const cleanPlate = useCallback((p) => {
    return p?.replace(/[^A-Za-z0-9]/g, '').toUpperCase() || '';
  }, []);

  // Buscar dados da placa
  const searchPlate = useCallback(async (plateToSearch) => {
    const cleaned = cleanPlate(plateToSearch);
    
    // Não buscar se já buscou esta placa
    if (lastSearchedPlateRef.current === cleaned) {
      return;
    }
    
    // Validar formato
    if (!validatePlate(cleaned)) {
      setError('Placa inválida');
      setVehicleData(null);
      return;
    }
    
    setIsSearching(true);
    setError(null);
    lastSearchedPlateRef.current = cleaned;
    
    try {
      console.log(`[AutoPlateSearch] Searching for plate: ${cleaned}`);
      
      const result = await consultarPlaca(cleaned);
      
      if (result.success && result.data) {
        console.log('[AutoPlateSearch] Vehicle found:', result.data);
        setVehicleData(result.data);
        setError(null);
        setHasSearched(true);
      } else {
        console.log('[AutoPlateSearch] Vehicle not found');
        setVehicleData(null);
        setError('Veículo não encontrado. Preencha os dados manualmente.');
        setHasSearched(true);
      }
    } catch (err) {
      console.error('[AutoPlateSearch] Error:', err);
      setVehicleData(null);
      setError('Erro ao buscar dados do veículo. Tente novamente.');
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  }, [cleanPlate]);

  // Busca manual (forçada)
  const manualSearch = useCallback(() => {
    lastSearchedPlateRef.current = null; // Reset para permitir nova busca
    searchPlate(plate);
  }, [plate, searchPlate]);

  // Limpar dados
  const clearData = useCallback(() => {
    setVehicleData(null);
    setError(null);
    setHasSearched(false);
    lastSearchedPlateRef.current = null;
  }, []);

  // Auto-search com debounce
  useEffect(() => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const cleaned = cleanPlate(plate);
    
    // Só buscar se tiver 7 caracteres e não buscou ainda
    if (cleaned.length === 7 && lastSearchedPlateRef.current !== cleaned) {
      timeoutRef.current = setTimeout(() => {
        searchPlate(cleaned);
      }, debounceMs);
    } else if (cleaned.length < 7) {
      // Limpar dados se apagar a placa
      if (vehicleData || error) {
        clearData();
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [plate, debounceMs, searchPlate, cleanPlate, vehicleData, error, clearData]);

  return {
    isSearching,
    vehicleData,
    error,
    hasSearched,
    manualSearch,
    clearData
  };
};

export default useAutoPlateSearch;
