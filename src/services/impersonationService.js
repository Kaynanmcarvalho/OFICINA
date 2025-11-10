/**
 * Impersonation Service
 * 
 * Permite que Super Admins acessem o sistema como qualquer empresa
 * Mantém isolamento de dados e segurança
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const IMPERSONATION_KEY = 'impersonation_empresaId';
const ORIGINAL_EMPRESA_KEY = 'original_empresaId';

/**
 * Inicia impersonation de uma empresa
 * @param {string} empresaId - ID da empresa a ser impersonada
 * @param {string} currentEmpresaId - ID da empresa atual (super admin)
 * @returns {Promise<boolean>} - Sucesso ou falha
 */
export const startImpersonation = async (empresaId, currentEmpresaId) => {
  try {
    console.log('[Impersonation] Starting impersonation:', { empresaId, currentEmpresaId });

    // Validar empresaId
    if (!empresaId || typeof empresaId !== 'string') {
      throw new Error('ID de empresa inválido');
    }

    // Verificar se empresa existe e está ativa
    const empresaRef = doc(db, 'empresas', empresaId);
    const empresaDoc = await getDoc(empresaRef);

    if (!empresaDoc.exists()) {
      throw new Error('Empresa não encontrada');
    }

    const empresaData = empresaDoc.data();

    if (empresaData.ativo === false) {
      throw new Error('Empresa está desativada');
    }

    // Salvar empresa original (para voltar depois)
    sessionStorage.setItem(ORIGINAL_EMPRESA_KEY, currentEmpresaId);
    
    // Ativar impersonation
    sessionStorage.setItem(IMPERSONATION_KEY, empresaId);
    sessionStorage.setItem('empresaId', empresaId);

    console.log('[Impersonation] Impersonation started successfully');

    toast.success(`Acessando como: ${empresaData.nomeFantasia}`, {
      icon: '🎭',
      duration: 3000
    });

    return true;
  } catch (error) {
    console.error('[Impersonation] Error starting impersonation:', error);
    toast.error(error.message || 'Erro ao iniciar impersonation');
    return false;
  }
};

/**
 * Encerra impersonation e volta para empresa original
 * @returns {boolean} - Sucesso ou falha
 */
export const stopImpersonation = () => {
  try {
    console.log('[Impersonation] Stopping impersonation');

    const originalEmpresaId = sessionStorage.getItem(ORIGINAL_EMPRESA_KEY);

    if (!originalEmpresaId) {
      throw new Error('Empresa original não encontrada');
    }

    // Remover impersonation
    sessionStorage.removeItem(IMPERSONATION_KEY);
    sessionStorage.setItem('empresaId', originalEmpresaId);
    sessionStorage.removeItem(ORIGINAL_EMPRESA_KEY);

    console.log('[Impersonation] Impersonation stopped successfully');

    toast.success('Voltando para sua empresa', {
      icon: '👤',
      duration: 2000
    });

    return true;
  } catch (error) {
    console.error('[Impersonation] Error stopping impersonation:', error);
    toast.error('Erro ao encerrar impersonation');
    return false;
  }
};

/**
 * Verifica se está em modo impersonation
 * @returns {boolean}
 */
export const isImpersonating = () => {
  return sessionStorage.getItem(IMPERSONATION_KEY) !== null;
};

/**
 * Obtém ID da empresa sendo impersonada
 * @returns {string|null}
 */
export const getImpersonatedEmpresaId = () => {
  return sessionStorage.getItem(IMPERSONATION_KEY);
};

/**
 * Obtém ID da empresa original (super admin)
 * @returns {string|null}
 */
export const getOriginalEmpresaId = () => {
  return sessionStorage.getItem(ORIGINAL_EMPRESA_KEY);
};

/**
 * Limpa todos os dados de impersonation (logout)
 */
export const clearImpersonation = () => {
  sessionStorage.removeItem(IMPERSONATION_KEY);
  sessionStorage.removeItem(ORIGINAL_EMPRESA_KEY);
  console.log('[Impersonation] Impersonation data cleared');
};
