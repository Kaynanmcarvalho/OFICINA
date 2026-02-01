/**
 * Idempotency Manager - Transações Seguras
 * 
 * Garante que operações críticas não sejam duplicadas
 * Essencial para operações financeiras
 * Previne duplicação em caso de retry
 */

// Armazenamento de operações executadas (em memória - em produção usar Redis)
const executedOperations = new Map();
const IDEMPOTENCY_WINDOW = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Gera chave de idempotência
 */
export function generateIdempotencyKey(operation, userId, data) {
  const dataHash = JSON.stringify(data);
  return `${operation}:${userId}:${dataHash}`;
}

/**
 * Verifica se operação já foi executada
 */
export function checkIdempotency(idempotencyKey) {
  if (!executedOperations.has(idempotencyKey)) {
    return { executed: false };
  }
  
  const record = executedOperations.get(idempotencyKey);
  const now = Date.now();
  
  // Limpar se expirou
  if (now > record.expiresAt) {
    executedOperations.delete(idempotencyKey);
    return { executed: false };
  }
  
  return {
    executed: true,
    result: record.result,
    executedAt: record.executedAt
  };
}

/**
 * Registra operação executada
 */
export function recordExecution(idempotencyKey, result) {
  const now = Date.now();
  
  executedOperations.set(idempotencyKey, {
    result,
    executedAt: now,
    expiresAt: now + IDEMPOTENCY_WINDOW
  });
}

/**
 * Wrapper para executar operação com idempotência
 */
export async function executeIdempotent(operation, userId, data, executor) {
  const idempotencyKey = generateIdempotencyKey(operation, userId, data);
  
  // Verificar se já foi executado
  const check = checkIdempotency(idempotencyKey);
  if (check.executed) {
    console.log(`[Idempotency] Operação já executada: ${operation}`, {
      executedAt: new Date(check.executedAt).toISOString()
    });
    return check.result;
  }
  
  // Executar operação
  try {
    const result = await executor();
    
    // Registrar execução
    recordExecution(idempotencyKey, result);
    
    return result;
  } catch (error) {
    // Não registrar falhas (permitir retry)
    throw error;
  }
}

/**
 * Limpa registros expirados
 */
export function cleanupExpired() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, record] of executedOperations.entries()) {
    if (now > record.expiresAt) {
      executedOperations.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`[Idempotency] Limpou ${cleaned} registros expirados`);
  }
}

// Limpar registros expirados a cada hora
setInterval(cleanupExpired, 60 * 60 * 1000);

export default {
  generateIdempotencyKey,
  checkIdempotency,
  recordExecution,
  executeIdempotent,
  cleanupExpired
};
