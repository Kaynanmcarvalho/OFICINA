/**
 * Workflow Helpers
 * Utilitários para gerenciar fluxos de trabalho dinâmicos
 */

// Tipos de fluxo de trabalho
export const WORKFLOW_TYPES = {
  CHECKIN_FIRST: 'checkin-first',  // Veículo entra primeiro
  BUDGET_FIRST: 'budget-first'      // Orçamento criado primeiro
};

// Status do orçamento
export const BUDGET_STATUS = {
  PENDING: 'pending',
  APPROVED_TOTAL: 'approved_total',
  APPROVED_PARTIAL: 'approved_partial',
  REJECTED_TOTAL: 'rejected_total',
  EXPIRED: 'expired'
};

// Definição das etapas para cada fluxo
const STAGE_DEFINITIONS = {
  [WORKFLOW_TYPES.CHECKIN_FIRST]: [
    {
      id: 'checkin',
      label: 'Check-in',
      description: 'Entrada do veículo'
    },
    {
      id: 'diagnostico',
      label: 'Diagnóstico',
      description: 'Análise técnica'
    },
    {
      id: 'orcamento',
      label: 'Orçamento',
      description: 'Aprovação de serviços'
    },
    {
      id: 'execucao',
      label: 'Execução',
      description: 'Realização dos serviços'
    },
    {
      id: 'finalizacao',
      label: 'Finalização',
      description: 'Controle de qualidade'
    },
    {
      id: 'checkout',
      label: 'Check-out',
      description: 'Entrega do veículo'
    }
  ],
  [WORKFLOW_TYPES.BUDGET_FIRST]: [
    {
      id: 'orcamento',
      label: 'Orçamento',
      description: 'Aprovação de serviços'
    },
    {
      id: 'checkin',
      label: 'Check-in',
      description: 'Entrada do veículo'
    },
    {
      id: 'diagnostico',
      label: 'Diagnóstico',
      description: 'Análise técnica'
    },
    {
      id: 'execucao',
      label: 'Execução',
      description: 'Realização dos serviços'
    },
    {
      id: 'finalizacao',
      label: 'Finalização',
      description: 'Controle de qualidade'
    },
    {
      id: 'checkout',
      label: 'Check-out',
      description: 'Entrega do veículo'
    }
  ]
};

/**
 * Determina o tipo de fluxo de trabalho
 * @param {string|null} checkinId - ID do check-in (null se orçamento primeiro)
 * @returns {string} Tipo de workflow
 */
export const determineWorkflowType = (checkinId) => {
  return checkinId ? WORKFLOW_TYPES.CHECKIN_FIRST : WORKFLOW_TYPES.BUDGET_FIRST;
};

/**
 * Obtém a ordem das etapas para um tipo de fluxo
 * @param {string} workflowType - Tipo de workflow
 * @returns {Array} Array com IDs das etapas na ordem correta
 */
export const getStageOrder = (workflowType = WORKFLOW_TYPES.CHECKIN_FIRST) => {
  const stages = STAGE_DEFINITIONS[workflowType] || STAGE_DEFINITIONS[WORKFLOW_TYPES.CHECKIN_FIRST];
  return stages.map(stage => stage.id);
};

/**
 * Obtém as definições completas das etapas
 * @param {string} workflowType - Tipo de workflow
 * @returns {Array} Array com definições completas das etapas
 */
export const getStageDefinitions = (workflowType = WORKFLOW_TYPES.CHECKIN_FIRST) => {
  return STAGE_DEFINITIONS[workflowType] || STAGE_DEFINITIONS[WORKFLOW_TYPES.CHECKIN_FIRST];
};

/**
 * Verifica se uma etapa deve ser pulada
 * @param {Object} stageData - Dados da etapa
 * @returns {boolean} True se a etapa foi pulada
 */
export const isStageSkipped = (stageData) => {
  return stageData?.skipped === true;
};

/**
 * Obtém o status visual de uma etapa
 * @param {Object} stageData - Dados da etapa
 * @returns {Object} Status visual { type, icon, color }
 */
export const getStageVisualStatus = (stageData) => {
  if (!stageData) {
    return { type: 'pending', icon: 'default', color: 'gray' };
  }

  // Etapa pulada (orçamento recusado/expirado)
  if (stageData.skipped) {
    return { type: 'skipped', icon: 'x', color: 'red' };
  }

  // Etapa concluída
  if (stageData.completed) {
    return { type: 'completed', icon: 'check', color: 'green' };
  }

  // Orçamento com status especial
  if (stageData.status) {
    switch (stageData.status) {
      case BUDGET_STATUS.PENDING:
        return { type: 'pending-approval', icon: 'clock', color: 'orange' };
      case BUDGET_STATUS.APPROVED_TOTAL:
      case BUDGET_STATUS.APPROVED_PARTIAL:
        return { type: 'approved', icon: 'check', color: 'green' };
      case BUDGET_STATUS.REJECTED_TOTAL:
        return { type: 'rejected', icon: 'x', color: 'red' };
      case BUDGET_STATUS.EXPIRED:
        return { type: 'expired', icon: 'alert', color: 'yellow' };
      default:
        return { type: 'in-progress', icon: 'default', color: 'orange' };
    }
  }

  // Etapa em progresso
  return { type: 'in-progress', icon: 'default', color: 'orange' };
};

/**
 * Calcula o progresso baseado na etapa atual e ordem
 * @param {string} currentStage - Etapa atual
 * @param {Array} stageOrder - Ordem das etapas
 * @returns {number} Progresso em porcentagem (0-100)
 */
export const calculateProgress = (currentStage, stageOrder) => {
  if (!currentStage || !stageOrder || stageOrder.length === 0) {
    return 0;
  }

  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex === -1) return 0;

  return ((currentIndex + 1) / stageOrder.length) * 100;
};

/**
 * Verifica se o orçamento expirou
 * @param {Date|Timestamp} expiresAt - Data de expiração
 * @returns {boolean} True se expirado
 */
export const isBudgetExpired = (expiresAt) => {
  if (!expiresAt) return false;
  
  const expirationDate = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
  return expirationDate < new Date();
};

/**
 * Calcula tempo restante até expiração
 * @param {Date|Timestamp} expiresAt - Data de expiração
 * @returns {Object} { hours, minutes, expired }
 */
export const getTimeUntilExpiration = (expiresAt) => {
  if (!expiresAt) return { hours: 0, minutes: 0, expired: true };
  
  const expirationDate = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
  const now = new Date();
  const diff = expirationDate - now;
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, expired: true };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes, expired: false };
};

/**
 * Formata tempo restante para exibição
 * @param {Date|Timestamp} expiresAt - Data de expiração
 * @returns {string} Texto formatado
 */
export const formatTimeUntilExpiration = (expiresAt) => {
  const { hours, minutes, expired } = getTimeUntilExpiration(expiresAt);
  
  if (expired) return 'Expirado';
  if (hours > 24) return `${Math.floor(hours / 24)} dias`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} minutos`;
};

/**
 * Obtém a próxima etapa na sequência
 * @param {string} currentStage - Etapa atual
 * @param {Array} stageOrder - Ordem das etapas
 * @returns {string|null} ID da próxima etapa ou null
 */
export const getNextStage = (currentStage, stageOrder) => {
  if (!currentStage || !stageOrder) return null;
  
  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === stageOrder.length - 1) return null;
  
  return stageOrder[currentIndex + 1];
};

/**
 * Obtém a etapa anterior na sequência
 * @param {string} currentStage - Etapa atual
 * @param {Array} stageOrder - Ordem das etapas
 * @returns {string|null} ID da etapa anterior ou null
 */
export const getPreviousStage = (currentStage, stageOrder) => {
  if (!currentStage || !stageOrder) return null;
  
  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex <= 0) return null;
  
  return stageOrder[currentIndex - 1];
};

/**
 * Valida se pode avançar para próxima etapa
 * @param {string} currentStage - Etapa atual
 * @param {Object} stages - Dados de todas as etapas
 * @returns {Object} { canAdvance, reason }
 */
export const canAdvanceToNextStage = (currentStage, stages) => {
  const stageData = stages[currentStage];
  
  if (!stageData) {
    return { canAdvance: false, reason: 'Etapa atual não encontrada' };
  }
  
  // Se é orçamento, verificar aprovação
  if (currentStage === 'orcamento') {
    if (stageData.status === BUDGET_STATUS.PENDING) {
      return { canAdvance: false, reason: 'Aguardando aprovação do orçamento' };
    }
    if (stageData.status === BUDGET_STATUS.REJECTED_TOTAL) {
      return { canAdvance: false, reason: 'Orçamento recusado' };
    }
    if (stageData.status === BUDGET_STATUS.EXPIRED) {
      return { canAdvance: false, reason: 'Orçamento expirado' };
    }
  }
  
  // Verificar se etapa está concluída
  if (!stageData.completed) {
    return { canAdvance: false, reason: 'Etapa atual não concluída' };
  }
  
  return { canAdvance: true, reason: null };
};

export default {
  WORKFLOW_TYPES,
  BUDGET_STATUS,
  determineWorkflowType,
  getStageOrder,
  getStageDefinitions,
  isStageSkipped,
  getStageVisualStatus,
  calculateProgress,
  isBudgetExpired,
  getTimeUntilExpiration,
  formatTimeUntilExpiration,
  getNextStage,
  getPreviousStage,
  canAdvanceToNextStage
};
