/**
 * Hook para scroll automático até o primeiro campo com erro
 * Usado em modais com formulários multi-step
 */

import { useCallback } from 'react';

/**
 * Mapeamento de campos para seus IDs de elemento
 * Adicione novos campos conforme necessário
 */
const FIELD_ID_MAP = {
  // Check-in Modal
  cliente: 'field-cliente',
  telefone: 'field-telefone',
  placa: 'field-placa',
  modelo: 'field-modelo',
  marca: 'field-marca',
  ano: 'field-ano',
  cor: 'field-cor',
  kilometragem: 'field-kilometragem',
  nivelCombustivel: 'field-nivelCombustivel',
  responsavel: 'field-responsavel',
  servicoSolicitado: 'field-servicoSolicitado',
  observacoes: 'field-observacoes',
  
  // Budget Modal
  clientName: 'field-clientName',
  clientPhone: 'field-clientPhone',
  vehiclePlate: 'field-vehiclePlate',
  vehicleModel: 'field-vehicleModel',
  items: 'field-items',
  
  // Client Modal
  name: 'field-name',
  email: 'field-email',
  phone: 'field-phone',
  cpf: 'field-cpf',
  cnpj: 'field-cnpj',
  address: 'field-address',
};

/**
 * Hook que retorna uma função para fazer scroll até o primeiro erro
 */
export const useScrollToError = () => {
  /**
   * Faz scroll suave até o primeiro campo com erro
   * @param {Object} errors - Objeto com os erros de validação
   * @param {string} containerSelector - Seletor CSS do container scrollável (opcional)
   * @returns {boolean} - true se encontrou e scrollou para um erro
   */
  const scrollToFirstError = useCallback((errors, containerSelector = null) => {
    if (!errors || Object.keys(errors).length === 0) {
      return false;
    }

    // Pega a primeira chave de erro
    const firstErrorField = Object.keys(errors)[0];
    
    // Tenta encontrar o elemento pelo ID mapeado ou pelo data-field
    const fieldId = FIELD_ID_MAP[firstErrorField] || `field-${firstErrorField}`;
    let element = document.getElementById(fieldId);
    
    // Fallback: busca por data-field attribute
    if (!element) {
      element = document.querySelector(`[data-field="${firstErrorField}"]`);
    }
    
    // Fallback: busca por name attribute
    if (!element) {
      element = document.querySelector(`[name="${firstErrorField}"]`);
    }

    if (element) {
      // Se tiver um container específico, usa ele para scroll
      const container = containerSelector 
        ? document.querySelector(containerSelector)
        : element.closest('.overflow-y-auto') || element.closest('[data-modal-content]');

      if (container) {
        // Calcula a posição do elemento relativa ao container
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - 100; // 100px de offset

        container.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll do elemento diretamente
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

      // Foca no elemento após o scroll
      setTimeout(() => {
        const input = element.querySelector('input, textarea, select') || element;
        if (input && typeof input.focus === 'function') {
          input.focus();
        }
      }, 300);

      return true;
    }

    return false;
  }, []);

  return { scrollToFirstError };
};

/**
 * Função utilitária standalone para uso sem hook
 */
export const scrollToFirstErrorField = (errors, containerSelector = null) => {
  if (!errors || Object.keys(errors).length === 0) {
    return false;
  }

  const firstErrorField = Object.keys(errors)[0];
  const fieldId = FIELD_ID_MAP[firstErrorField] || `field-${firstErrorField}`;
  let element = document.getElementById(fieldId);
  
  if (!element) {
    element = document.querySelector(`[data-field="${firstErrorField}"]`);
  }
  
  if (!element) {
    element = document.querySelector(`[name="${firstErrorField}"]`);
  }

  if (element) {
    const container = containerSelector 
      ? document.querySelector(containerSelector)
      : element.closest('.overflow-y-auto') || element.closest('[data-modal-content]');

    if (container) {
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - 100;

      container.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth'
      });
    } else {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }

    setTimeout(() => {
      const input = element.querySelector('input, textarea, select') || element;
      if (input && typeof input.focus === 'function') {
        input.focus();
      }
    }, 300);

    return true;
  }

  return false;
};

export default useScrollToError;
