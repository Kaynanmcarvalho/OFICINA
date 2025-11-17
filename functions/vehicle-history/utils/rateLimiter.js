/**
 * Rate Limiter
 * Controle de taxa de requisições
 */

const Logger = require('./logger');

class RateLimiter {
  constructor(db) {
    this.db = db;
    this.logger = new Logger('RateLimiter');
    this.collectionName = 'rate_limits';
  }

  /**
   * Verifica se pode prosseguir com a requisição
   * @param {string} key - Chave única do usuário/empresa
   * @param {number} maxRequests - Número máximo de requisições
   * @param {number} windowMs - Janela de tempo em milissegundos
   */
  async checkLimit(key, maxRequests = 10, windowMs = 60000) {
    try {
      const now = Date.now();
      const windowStart = now - windowMs;

      const doc = await this.db.collection(this.collectionName).doc(key).get();

      if (!doc.exists) {
        // Primeira requisição
        await this.db.collection(this.collectionName).doc(key).set({
          requests: [now],
          lastRequest: now
        });
        return true;
      }

      const data = doc.data();
      const requests = data.requests || [];

      // Filtrar requisições dentro da janela de tempo
      const recentRequests = requests.filter(timestamp => timestamp > windowStart);

      if (recentRequests.length >= maxRequests) {
        this.logger.warn('Rate limit excedido', {
          key,
          requests: recentRequests.length,
          maxRequests
        });
        return false;
      }

      // Adicionar nova requisição
      recentRequests.push(now);

      await this.db.collection(this.collectionName).doc(key).set({
        requests: recentRequests,
        lastRequest: now
      });

      return true;

    } catch (error) {
      this.logger.error('Erro ao verificar rate limit', {
        key,
        error: error.message
      });
      // Em caso de erro, permitir a requisição
      return true;
    }
  }

  /**
   * Reseta o contador de um usuário
   */
  async reset(key) {
    try {
      await this.db.collection(this.collectionName).doc(key).delete();
      this.logger.info('Rate limit resetado', { key });
      return true;
    } catch (error) {
      this.logger.error('Erro ao resetar rate limit', {
        key,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Limpa registros antigos
   */
  async cleanOld(olderThanMs = 3600000) {
    try {
      const cutoff = Date.now() - olderThanMs;
      const snapshot = await this.db.collection(this.collectionName)
        .where('lastRequest', '<', cutoff)
        .limit(100)
        .get();

      const batch = this.db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      
      this.logger.info('Rate limits antigos limpos', { count: snapshot.size });
      return snapshot.size;
    } catch (error) {
      this.logger.error('Erro ao limpar rate limits', { error: error.message });
      return 0;
    }
  }
}

module.exports = RateLimiter;
