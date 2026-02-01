/**
 * TORQ - Hook de Auto-Save
 * Salva progresso automaticamente a cada 30 segundos
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook para auto-save de formulários
 * @param {Object} data - Dados a serem salvos
 * @param {string} key - Chave única para localStorage
 * @param {number} interval - Intervalo em ms (padrão: 30000 = 30s)
 * @returns {Object} - { loadDraft, clearDraft, hasDraft }
 */
export const useAutoSave = (data, key, interval = 30000) => {
  const timeoutRef = useRef(null);
  const lastSavedRef = useRef(null);

  // Salvar no localStorage
  const saveDraft = useCallback(() => {
    try {
      const draft = {
        data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(`draft_${key}`, JSON.stringify(draft));
      lastSavedRef.current = draft.timestamp;
      } catch (error) {
      console.error('[AutoSave] Error saving draft:', error);
    }
  }, [data, key]);

  // Carregar do localStorage
  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(`draft_${key}`);
      if (!saved) return null;
      
      const draft = JSON.parse(saved);
      
      // Verificar se o draft não está muito antigo (24h)
      const draftTime = new Date(draft.timestamp);
      const now = new Date();
      const hoursDiff = (now - draftTime) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        clearDraft();
        return null;
      }
      
      return draft.data;
    } catch (error) {
      console.error('[AutoSave] Error loading draft:', error);
      return null;
    }
  }, [key]);

  // Limpar draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`draft_${key}`);
      lastSavedRef.current = null;
      } catch (error) {
      console.error('[AutoSave] Error clearing draft:', error);
    }
  }, [key]);

  // Verificar se existe draft
  const hasDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(`draft_${key}`);
      return !!saved;
    } catch {
      return false;
    }
  }, [key]);

  // Auto-save effect
  useEffect(() => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Não salvar se data estiver vazio
    if (!data || Object.keys(data).length === 0) {
      return;
    }

    // Agendar próximo save
    timeoutRef.current = setTimeout(() => {
      saveDraft();
    }, interval);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, interval, saveDraft]);

  // Salvar ao desmontar componente
  useEffect(() => {
    return () => {
      if (data && Object.keys(data).length > 0) {
        saveDraft();
      }
    };
  }, [data, saveDraft]);

  return {
    loadDraft,
    clearDraft,
    hasDraft,
    lastSaved: lastSavedRef.current
  };
};

export default useAutoSave;
