/**
 * Circuit Breaker Pattern - Resiliência Operacional
 * 
 * Protege o sistema contra falhas em cascata
 * Isola falhas e permite recuperação graciosa
 * 
 * Estados:
 * - CLOSED: Operação normal
 * - OPEN: Bloqueado após muitas falhas
 * - HALF_OPEN: Testando recuperação
 */

const CIRCUIT_STATE = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN'
};

class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.successThreshold = options.successThreshold || 2;
    this.timeout = options.timeout || 60000; // 1 minuto
    this.name = options.name || 'unnamed';
    
    this.state = CIRCUIT_STATE.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(operation) {
    if (this.state === CIRCUIT_STATE.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error(`Circuit breaker [${this.name}] está ABERTO. Sistema em proteção.`);
      }
      
      // Tentar recuperação
      this.state = CIRCUIT_STATE.HALF_OPEN;
      this.successCount = 0;
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;

    if (this.state === CIRCUIT_STATE.HALF_OPEN) {
      this.successCount++;
      
      if (this.successCount >= this.successThreshold) {
        this.state = CIRCUIT_STATE.CLOSED;
        console.log(`✅ Circuit breaker [${this.name}] RECUPERADO`);
      }
    }
  }

  onFailure() {
    this.failureCount++;
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = CIRCUIT_STATE.OPEN;
      this.nextAttempt = Date.now() + this.timeout;
      
      console.error(`🚨 Circuit breaker [${this.name}] ABERTO após ${this.failureCount} falhas`);
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      nextAttempt: this.nextAttempt
    };
  }

  reset() {
    this.state = CIRCUIT_STATE.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
  }
}

// Circuit breakers globais para operações críticas
export const circuitBreakers = {
  firestore: new CircuitBreaker({ name: 'Firestore', failureThreshold: 5, timeout: 30000 }),
  firebase: new CircuitBreaker({ name: 'Firebase', failureThreshold: 5, timeout: 30000 }),
  api: new CircuitBreaker({ name: 'API', failureThreshold: 3, timeout: 60000 })
};

export default CircuitBreaker;
