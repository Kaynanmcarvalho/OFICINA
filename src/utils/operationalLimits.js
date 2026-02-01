/**
 * Operational Limits - Blast Radius Control
 * 
 * Limita impacto de ações por usuário/tenant
 * Previne abuso e sobrecarga do sistema
 * Protege recursos compartilhados
 */

// Limites por operação (por hora)
export const OPERATIONAL_LIMITS = {
  // Criação de registros
  CREATE_CLIENT: 100,
  CREATE_BUDGET: 50,
  CREATE_CHECKIN: 30,
  CREATE_PRODUCT: 200,
  
  // Operações financeiras
  OPEN_CASH_REGISTER: 5,
  CLOSE_CASH_REGISTER: 5,
  CREATE_SALE: 500,
  
  // Operações de estoque
  STOCK_ADJUSTMENT: 100,
  STOCK_MOVEMENT: 500,
  
  // Operações de relatório
  GENERATE_REPORT: 20,
  EXPORT_DATA: 10,
  
  // Operações de busca
  SEARCH_OPERATIONS: 1000,
  
  // Operações de atualização em massa
  BULK_UPDATE: 10,
  BULK_DELETE: 5
};

// Armazenamento de contadores (em memória - em produção usar Redis)
const operationCounters = new Map();

/**
 * Verifica se operação está dentro do limite
 */
export function checkOperationalLimit(userId, operation, customLimit = null) {
  const limit = customLimit || OPERATIONAL_LIMITS[operation];
  
  if (!limit) {
    console.warn(`[OperationalLimits] Limite não definido para: ${operation}`);
    return { allowed: true, remaining: Infinity };
  }
  
  const key = `${userId}:${operation}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hora
  
  if (!operationCounters.has(key)) {
    operationCounters.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: now + windowMs
    };
  }
  
  const counter = operationCounters.get(key);
  
  // Reset se janela expirou
  if (now > counter.resetAt) {
    counter.count = 1;
    counter.resetAt = now + windowMs;
    
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: counter.resetAt
    };
  }
  
  // Verificar limite
  if (counter.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: counter.resetAt,
      error: `Limite de ${limit} operações/hora atingido para ${operation}`
    };
  }
  
  counter.count++;
  
  return {
    allowed: true,
    remaining: limit - counter.count,
    resetAt: counter.resetAt
  };
}

/**
 * Registra operação (para auditoria)
 */
export function recordOperation(userId, operation, metadata = {}) {
  console.log(`[OperationalLimits] ${userId} executou ${operation}`, metadata);
}

/**
 * Limpa contadores (para testes)
 */
export function clearCounters() {
  operationCounters.clear();
}

export default {
  OPERATIONAL_LIMITS,
  checkOperationalLimit,
  recordOperation,
  clearCounters
};
