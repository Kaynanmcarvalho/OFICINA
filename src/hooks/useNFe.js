/**
 * Hook para gerenciamento de NF-e
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createNFeFromBudget,
  sendToSEFAZ,
  generateDANFE,
  getNFe,
  listNFes,
  cancelNFe,
  getNFeConfig,
  saveNFeConfig
} from '../services/nfeService';

export function useNFe(nfeId = null) {
  const { currentUser } = useAuth();
  const [nfe, setNFe] = useState(null);
  const [nfes, setNFes] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const empresaId = currentUser?.empresaId;

  // Carregar NF-e específica
  useEffect(() => {
    if (nfeId && empresaId) {
      loadNFe();
    }
  }, [nfeId, empresaId]);

  // Carregar lista de NF-es
  useEffect(() => {
    if (!nfeId && empresaId) {
      loadNFes();
    }
  }, [nfeId, empresaId]);

  // Carregar configuração
  useEffect(() => {
    if (empresaId) {
      loadConfig();
    }
  }, [empresaId]);

  const loadNFe = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNFe(nfeId, empresaId);
      setNFe(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar NF-e:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadNFes = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await listNFes(empresaId, filters);
      setNFes(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar NF-es:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadConfig = async () => {
    try {
      const data = await getNFeConfig(empresaId);
      setConfig(data);
    } catch (err) {
      console.error('Erro ao carregar configuração:', err);
    }
  };

  const createFromBudget = async (budgetId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createNFeFromBudget(budgetId, empresaId);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao criar NF-e:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const send = async (id = nfeId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await sendToSEFAZ(id, empresaId);
      if (id === nfeId) {
        await loadNFe();
      }
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao enviar NF-e:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (id = nfeId) => {
    try {
      setLoading(true);
      setError(null);
      const pdfUrl = await generateDANFE(id, empresaId);
      return pdfUrl;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao gerar DANFE:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id = nfeId, motivo) => {
    try {
      setLoading(true);
      setError(null);
      const result = await cancelNFe(id, empresaId, motivo);
      if (id === nfeId) {
        await loadNFe();
      }
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao cancelar NF-e:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig) => {
    try {
      setLoading(true);
      setError(null);
      const data = await saveNFeConfig(empresaId, newConfig);
      setConfig(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao salvar configuração:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    if (nfeId) {
      loadNFe();
    } else {
      loadNFes();
    }
  };

  return {
    nfe,
    nfes,
    config,
    loading,
    error,
    createFromBudget,
    send,
    generatePDF,
    cancel,
    updateConfig,
    refresh,
    loadNFes
  };
}
