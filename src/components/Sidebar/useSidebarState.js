import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sidebar-state';

/**
 * Hook customizado para gerenciar o estado da sidebar
 * Persiste o estado de expansão/colapso no LocalStorage
 * 
 * @param {boolean} defaultExpanded - Estado inicial da sidebar (padrão: true)
 * @returns {Object} Estado e funções de controle
 */
export function useSidebarState(defaultExpanded = true) {
  // Inicializa estado a partir do LocalStorage ou usa valor padrão
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.isExpanded ?? defaultExpanded;
      }
    } catch (error) {
      }
    return defaultExpanded;
  });

  // Sincroniza estado com LocalStorage sempre que mudar
  useEffect(() => {
    try {
      const state = {
        isExpanded,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Continua funcionando mesmo se LocalStorage falhar
    }
  }, [isExpanded]);

  // Função para alternar estado
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  // Função para definir estado explicitamente
  const setExpanded = (value) => {
    setIsExpanded(Boolean(value));
  };

  return {
    isExpanded,
    toggleExpanded,
    setExpanded,
  };
}
