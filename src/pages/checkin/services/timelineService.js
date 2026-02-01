import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { firestoreWithTimeout } from '../../../utils/timeoutWrapper';
import { 
  getStageOrder as getStageOrderHelper,
  WORKFLOW_TYPES,
  BUDGET_STATUS,
  determineWorkflowType as determineWorkflowTypeHelper
} from '../utils/workflowHelpers';

// Ordem padrão das etapas (fluxo normal: check-in primeiro)
const STAGES_CHECKIN_FIRST = ['checkin', 'diagnostico', 'orcamento', 'execucao', 'finalizacao', 'checkout'];

// Ordem alternativa (fluxo invertido: orçamento primeiro)
const STAGES_BUDGET_FIRST = ['orcamento', 'checkin', 'diagnostico', 'execucao', 'finalizacao', 'checkout'];

// Função para determinar o tipo de fluxo (compatibilidade)
export const determineWorkflowType = (checkinId, budgetId) => {
  // Se tem budgetId mas não tem checkinId, é budget-first
  if (budgetId && !checkinId) {
    return WORKFLOW_TYPES.BUDGET_FIRST;
  }
  // Caso contrário, é checkin-first (padrão)
  return WORKFLOW_TYPES.CHECKIN_FIRST;
};

// Função para obter a ordem das etapas baseada no tipo de fluxo (compatibilidade)
export const getStageOrder = (workflowType) => {
  if (workflowType === WORKFLOW_TYPES.BUDGET_FIRST || workflowType === 'budget-first') {
    return STAGES_BUDGET_FIRST;
  }
  return STAGES_CHECKIN_FIRST;
};

// Manter compatibilidade com código existente
const STAGES = STAGES_CHECKIN_FIRST;

export const updateStage = async (checkinId, stageId, data = {}) => {
  if (!checkinId || !stageId) {
    throw new Error('checkinId e stageId são obrigatórios');
  }

  const stageIndex = STAGES.indexOf(stageId);
  if (stageIndex === -1) {
    throw new Error(`Estágio inválido: ${stageId}`);
  }

  try {
    const checkinRef = doc(db, 'checkins', checkinId);
    
    // Get current data to check current stage
    const checkinDoc = await firestoreWithTimeout(
      () => getDoc(checkinRef),
      'Get checkin for stage update'
    );
    
    if (!checkinDoc.exists()) {
      throw new Error('Check-in não encontrado');
    }

    const currentData = checkinDoc.data();
    const currentStageIndex = STAGES.indexOf(currentData.currentStage || 'checkin');

    // Only allow progression forward
    if (stageIndex <= currentStageIndex && stageId !== 'checkin') {
      throw new Error('Não é possível retroceder estágios');
    }

    const updateData = {
      currentStage: stageId,
      [`stages.${stageId}`]: {
        completed: true,
        timestamp: serverTimestamp(),
        userId: sessionStorage.getItem('userId') || 'unknown',
        userName: sessionStorage.getItem('userName') || 'Usuário',
        ...data
      },
      updatedAt: serverTimestamp()
    };

    await firestoreWithTimeout(
      () => updateDoc(checkinRef, updateData),
      'Update checkin stage'
    );
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar estágio:', error);
    throw error;
  }
};

export const addStageNote = async (checkinId, stageId, note) => {
  if (!checkinId || !stageId || !note?.trim()) {
    throw new Error('Parâmetros inválidos');
  }

  try {
    const checkinRef = doc(db, 'checkins', checkinId);
    await firestoreWithTimeout(
      () => updateDoc(checkinRef, {
        [`stages.${stageId}.notes`]: note.trim(),
        updatedAt: serverTimestamp()
      }),
      'Add stage note'
    );
    return { success: true };
  } catch (error) {
    console.error('Erro ao adicionar nota:', error);
    throw error;
  }
};

export const calculateProgress = (currentStage) => {
  const currentIndex = STAGES.indexOf(currentStage);
  if (currentIndex === -1) return 0;
  return ((currentIndex + 1) / STAGES.length) * 100;
};

export const getStageStatus = (currentStage, targetStage) => {
  const currentIndex = STAGES.indexOf(currentStage);
  const targetIndex = STAGES.indexOf(targetStage);
  
  if (targetIndex < currentIndex) return 'completed';
  if (targetIndex === currentIndex) return 'current';
  return 'pending';
};

/**
 * Atualiza a timeline quando um orçamento é criado
 * @param {string} checkinId - ID do check-in
 * @param {string} budgetId - ID do orçamento
 * @returns {Promise<Object>}
 */
export const onBudgetCreated = async (checkinId, budgetId) => {
  if (!checkinId || !budgetId) {
    throw new Error('checkinId e budgetId são obrigatórios');
  }

  try {
    const checkinRef = doc(db, 'checkins', checkinId);
    const checkinDoc = await firestoreWithTimeout(
      () => getDoc(checkinRef),
      'Get checkin for budget creation'
    );
    
    if (!checkinDoc.exists()) {
      throw new Error('Check-in não encontrado');
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 horas

    const updateData = {
      currentStage: 'orcamento',
      budgetId,
      budgetStatus: 'pending',
      [`stages.orcamento`]: {
        completed: false,
        status: 'pending',
        timestamp: serverTimestamp(),
        budgetId,
        expiresAt,
        approvedAt: null,
        rejectedAt: null,
        approvalType: null,
        userId: sessionStorage.getItem('userId') || 'unknown',
        userName: sessionStorage.getItem('userName') || 'Usuário'
      },
      updatedAt: serverTimestamp()
    };

    await firestoreWithTimeout(
      () => updateDoc(checkinRef, updateData),
      'Update timeline with budget'
    );
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar timeline com orçamento:', error);
    throw error;
  }
};

/**
 * Atualiza a timeline quando um orçamento é aprovado
 * @param {string} checkinId - ID do check-in
 * @param {string} budgetId - ID do orçamento
 * @param {string} approvalType - 'total' ou 'partial'
 * @param {Array} approvedItems - Itens aprovados (se parcial)
 * @returns {Promise<Object>}
 */
export const onBudgetApproved = async (checkinId, budgetId, approvalType = 'total', approvedItems = []) => {
  if (!checkinId || !budgetId) {
    throw new Error('checkinId e budgetId são obrigatórios');
  }

  try {
    const checkinRef = doc(db, 'checkins', checkinId);
    
    const updateData = {
      currentStage: 'execucao',
      budgetStatus: approvalType === 'total' ? 'approved_total' : 'approved_partial',
      [`stages.orcamento`]: {
        completed: true,
        status: approvalType === 'total' ? 'approved_total' : 'approved_partial',
        approvedAt: serverTimestamp(),
        approvalType,
        approvedItems: approvalType === 'partial' ? approvedItems : null,
        timestamp: serverTimestamp(),
        budgetId,
        userId: 'client',
        userName: 'Cliente'
      },
      [`stages.execucao`]: {
        completed: false,
        status: 'in_progress',
        timestamp: serverTimestamp(),
        userId: sessionStorage.getItem('userId') || 'unknown',
        userName: sessionStorage.getItem('userName') || 'Usuário'
      },
      updatedAt: serverTimestamp()
    };

    await firestoreWithTimeout(
      () => updateDoc(checkinRef, updateData),
      'Update timeline with budget approval'
    );
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao aprovar orçamento na timeline:', error);
    throw error;
  }
};

/**
 * Atualiza a timeline quando um orçamento é recusado
 * @param {string} checkinId - ID do check-in
 * @param {string} budgetId - ID do orçamento
 * @param {string} rejectionReason - Motivo da rejeição
 * @returns {Promise<Object>}
 */
export const onBudgetRejected = async (checkinId, budgetId, rejectionReason = 'client_decision') => {
  if (!checkinId || !budgetId) {
    throw new Error('checkinId e budgetId são obrigatórios');
  }

  try {
    const checkinRef = doc(db, 'checkins', checkinId);
    
    const updateData = {
      currentStage: 'checkout',
      budgetStatus: 'rejected_total',
      [`stages.orcamento`]: {
        completed: true,
        status: 'rejected_total',
        rejectedAt: serverTimestamp(),
        rejectionReason,
        timestamp: serverTimestamp(),
        budgetId,
        userId: 'client',
        userName: 'Cliente'
      },
      [`stages.execucao`]: {
        completed: false,
        skipped: true,
        skipReason: 'budget_rejected',
        timestamp: serverTimestamp()
      },
      [`stages.finalizacao`]: {
        completed: false,
        skipped: true,
        skipReason: 'budget_rejected',
        timestamp: serverTimestamp()
      },
      [`stages.checkout`]: {
        completed: false,
        status: 'awaiting_pickup',
        timestamp: serverTimestamp(),
        userId: sessionStorage.getItem('userId') || 'unknown',
        userName: sessionStorage.getItem('userName') || 'Usuário'
      },
      updatedAt: serverTimestamp()
    };

    await firestoreWithTimeout(
      () => updateDoc(checkinRef, updateData),
      'Update timeline with budget rejection'
    );
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao recusar orçamento na timeline:', error);
    throw error;
  }
};

/**
 * Atualiza a timeline quando um orçamento expira
 * @param {string} checkinId - ID do check-in
 * @param {string} budgetId - ID do orçamento
 * @returns {Promise<Object>}
 */
export const onBudgetExpired = async (checkinId, budgetId) => {
  if (!checkinId || !budgetId) {
    throw new Error('checkinId e budgetId são obrigatórios');
  }

  try {
    const checkinRef = doc(db, 'checkins', checkinId);
    
    const updateData = {
      currentStage: 'checkout',
      budgetStatus: 'expired',
      [`stages.orcamento`]: {
        completed: true,
        status: 'expired',
        expiredAt: serverTimestamp(),
        timestamp: serverTimestamp(),
        budgetId,
        userId: 'system',
        userName: 'Sistema (Expirado)'
      },
      [`stages.execucao`]: {
        completed: false,
        skipped: true,
        skipReason: 'budget_expired',
        timestamp: serverTimestamp()
      },
      [`stages.finalizacao`]: {
        completed: false,
        skipped: true,
        skipReason: 'budget_expired',
        timestamp: serverTimestamp()
      },
      [`stages.checkout`]: {
        completed: false,
        status: 'awaiting_pickup',
        timestamp: serverTimestamp(),
        userId: sessionStorage.getItem('userId') || 'unknown',
        userName: sessionStorage.getItem('userName') || 'Usuário'
      },
      updatedAt: serverTimestamp()
    };

    await firestoreWithTimeout(
      () => updateDoc(checkinRef, updateData),
      'Update timeline with budget expiration'
    );
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao expirar orçamento na timeline:', error);
    throw error;
  }
};
