/**
 * TORQ - Serviço de Auditoria
 * Log completo de todas as ações críticas do sistema
 */

import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Registra uma ação no log de auditoria
 * @param {string} action - Tipo de ação (ex: 'checkin_created', 'checkin_updated')
 * @param {Object} data - Dados relevantes da ação
 * @param {Object} metadata - Metadados adicionais
 * @returns {Promise<string>} - ID do log criado
 */
export const logAction = async (action, data = {}, metadata = {}) => {
  try {
    const userId = sessionStorage.getItem('userId') || 'unknown';
    const userName = sessionStorage.getItem('userName') || 'Usuário Desconhecido';
    const empresaId = sessionStorage.getItem('empresaId') || 'default';
    
    const logEntry = {
      action,
      data,
      metadata,
      userId,
      userName,
      empresaId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ip: null, // Será preenchido pelo backend se necessário
    };
    
    const docRef = await addDoc(collection(db, 'audit_logs'), logEntry);
    
    console.log(`[Audit] ${action} logged:`, logEntry);
    
    return docRef.id;
  } catch (error) {
    console.error('[Audit] Error logging action:', error);
    // Não lançar erro para não quebrar o fluxo principal
    return null;
  }
};

/**
 * Registra criação de check-in
 */
export const logCheckinCreated = async (checkinId, checkinData) => {
  return logAction('checkin_created', {
    checkinId,
    plate: checkinData.vehiclePlate,
    clientName: checkinData.clientName,
    clientId: checkinData.clientId,
  }, {
    services: checkinData.services,
    priority: checkinData.priority,
  });
};

/**
 * Registra atualização de check-in
 */
export const logCheckinUpdated = async (checkinId, previousData, newData) => {
  const changes = {};
  
  // Identificar campos alterados
  Object.keys(newData).forEach(key => {
    if (JSON.stringify(previousData[key]) !== JSON.stringify(newData[key])) {
      changes[key] = {
        from: previousData[key],
        to: newData[key]
      };
    }
  });
  
  return logAction('checkin_updated', {
    checkinId,
    changes
  });
};

/**
 * Registra checkout
 */
export const logCheckout = async (checkinId, checkoutData) => {
  return logAction('checkout_completed', {
    checkinId,
    totalCost: checkoutData.totalCost,
    paymentMethod: checkoutData.paymentMethod,
  }, {
    servicesPerformed: checkoutData.servicesPerformed,
    partsUsed: checkoutData.partsUsed?.length || 0,
  });
};

/**
 * Registra exclusão de check-in
 */
export const logCheckinDeleted = async (checkinId, reason = '') => {
  return logAction('checkin_deleted', {
    checkinId,
    reason
  });
};

/**
 * Registra tentativa de check-in duplicado
 */
export const logDuplicateAttempt = async (plate, existingCheckinId) => {
  return logAction('duplicate_checkin_attempt', {
    plate,
    existingCheckinId
  }, {
    severity: 'warning'
  });
};

/**
 * Registra erro crítico
 */
export const logError = async (errorType, errorMessage, context = {}) => {
  return logAction('error', {
    errorType,
    errorMessage,
    context
  }, {
    severity: 'error'
  });
};

/**
 * Busca logs de auditoria
 * @param {Object} filters - Filtros de busca
 * @returns {Promise<Array>} - Lista de logs
 */
export const getAuditLogs = async (filters = {}) => {
  try {
    const empresaId = sessionStorage.getItem('empresaId') || 'default';
    
    let q = query(
      collection(db, 'audit_logs'),
      where('empresaId', '==', empresaId)
    );
    
    // Aplicar filtros
    if (filters.action) {
      q = query(q, where('action', '==', filters.action));
    }
    
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
    
    if (filters.startDate) {
      q = query(q, where('timestamp', '>=', filters.startDate));
    }
    
    if (filters.endDate) {
      q = query(q, where('timestamp', '<=', filters.endDate));
    }
    
    // Ordenar por timestamp decrescente
    q = query(q, orderBy('timestamp', 'desc'));
    
    // Limitar resultados
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const snapshot = await getDocs(q);
    const logs = [];
    
    snapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return logs;
  } catch (error) {
    console.error('[Audit] Error fetching logs:', error);
    return [];
  }
};

/**
 * Busca histórico de um check-in específico
 */
export const getCheckinHistory = async (checkinId) => {
  try {
    const logs = await getAuditLogs({
      limit: 100
    });
    
    // Filtrar logs relacionados ao check-in
    return logs.filter(log => 
      log.data?.checkinId === checkinId ||
      log.metadata?.checkinId === checkinId
    );
  } catch (error) {
    console.error('[Audit] Error fetching checkin history:', error);
    return [];
  }
};

export default {
  logAction,
  logCheckinCreated,
  logCheckinUpdated,
  logCheckout,
  logCheckinDeleted,
  logDuplicateAttempt,
  logError,
  getAuditLogs,
  getCheckinHistory
};
