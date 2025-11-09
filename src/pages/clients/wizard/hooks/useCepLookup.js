/**
 * useCepLookup - Hook para busca de CEP via API ViaCEP
 */

import { useState, useCallback } from 'react';

export const useCepLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const lookupCep = useCallback(async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return { success: false, error: 'CEP deve ter 8 dígitos' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar CEP');
      }

      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return { success: false, error: 'CEP não encontrado' };
      }

      const addressData = {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
        cep: cep
      };

      return { success: true, data: addressData };
    } catch (err) {
      const errorMessage = 'Erro ao buscar CEP. Tente novamente.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    lookupCep,
    isLoading,
    error,
    clearError
  };
};
