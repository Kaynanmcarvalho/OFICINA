/**
 * Timeout Wrapper - Chaos Engineering Defense
 * 
 * Protege contra operações Firebase/API que nunca retornam
 * Garante que o sistema NUNCA trave esperando resposta
 * 
 * 🔥 RESILIÊNCIA: Timeout + Fallback + Retry
 */

const DEFAULT_TIMEOUT = 10000; // 10 segundos
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff

/**
 * Executa operação com timeout
 * Se exceder tempo, rejeita com erro controlado
 */
export async function withTimeout(promise, timeoutMs = DEFAULT_TIMEOUT, operationName = 'Operation') {
  let timeoutId;
  
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${operationName} timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Executa operação com timeout + retry
 * Tenta múltiplas vezes com backoff exponencial
 */
export async function withTimeoutAndRetry(
  operation,
  options = {}
) {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = 2,
    operationName = 'Operation',
    onRetry = null
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await withTimeout(
        operation(),
        timeout,
        `${operationName} (attempt ${attempt + 1}/${retries + 1})`
      );
      
      return result;
    } catch (error) {
      lastError = error;
      
      // Se é o último attempt, não fazer retry
      if (attempt === retries) {
        break;
      }
      
      // Callback de retry (para logging)
      if (onRetry) {
        onRetry(attempt + 1, error);
      }
      
      // Aguardar antes de tentar novamente
      const delay = RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Todas as tentativas falharam
  throw lastError;
}

/**
 * Executa operação com timeout + fallback
 * Se falhar, retorna valor padrão em vez de quebrar
 */
export async function withTimeoutAndFallback(
  operation,
  fallbackValue,
  options = {}
) {
  const {
    timeout = DEFAULT_TIMEOUT,
    operationName = 'Operation',
    logError = true
  } = options;
  
  try {
    return await withTimeout(operation(), timeout, operationName);
  } catch (error) {
    if (logError) {
      console.error(`[TimeoutWrapper] ${operationName} failed, using fallback:`, error.message);
    }
    return fallbackValue;
  }
}

/**
 * Wrapper específico para operações Firestore
 * Timeout padrão de 8 segundos (Firebase pode ser lento)
 */
export async function firestoreWithTimeout(operation, operationName = 'Firestore operation') {
  return withTimeoutAndRetry(operation, {
    timeout: 8000,
    retries: 2,
    operationName,
    onRetry: (attempt, error) => {
      console.warn(`[Firestore] ${operationName} failed (attempt ${attempt}), retrying...`, error.message);
    }
  });
}

/**
 * Wrapper específico para operações de API externa
 * Timeout padrão de 5 segundos (APIs devem ser rápidas)
 */
export async function apiWithTimeout(operation, operationName = 'API call') {
  return withTimeoutAndRetry(operation, {
    timeout: 5000,
    retries: 1,
    operationName,
    onRetry: (attempt, error) => {
      console.warn(`[API] ${operationName} failed (attempt ${attempt}), retrying...`, error.message);
    }
  });
}

/**
 * Wrapper para operações críticas que NÃO podem falhar
 * Usa fallback se todas as tentativas falharem
 */
export async function criticalWithFallback(
  operation,
  fallbackValue,
  operationName = 'Critical operation'
) {
  return withTimeoutAndFallback(operation, fallbackValue, {
    timeout: 10000,
    operationName,
    logError: true
  });
}

export default {
  withTimeout,
  withTimeoutAndRetry,
  withTimeoutAndFallback,
  firestoreWithTimeout,
  apiWithTimeout,
  criticalWithFallback
};
