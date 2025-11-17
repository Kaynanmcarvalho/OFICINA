/**
 * Cache Manager
 * Gerenciamento de cache no Firestore
 */

const admin = require('firebase-admin');
const Logger = require('./logger');

class CacheManager {
  constructor(db) {
    this.db = db;
    this.logger = new Logger('CacheManager');
    this.collectionName = 'vehicle_history';
  }

  /**
   * Busca item do cache
   */
  async get(key) {
    try {
      const doc = await this.db.collection(this.collectionName).doc(key).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      this.logger.info('Cache hit', { key, hasData: !!data });
      
      return {
        id: doc.id,
        ...data
      };
    } catch (error) {
      this.logger.error('Erro ao buscar cache', { key, error: error.message });
      return null;
    }
  }

  /**
   * Salva item no cache
   */
  async set(key, data) {
    try {
      const cacheData = {
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection(this.collectionName).doc(key).set(cacheData, { merge: true });
      
      this.logger.info('Cache atualizado', { key });
      return true;
    } catch (error) {
      this.logger.error('Erro ao salvar cache', { key, error: error.message });
      return false;
    }
  }

  /**
   * Verifica se o cache expirou
   */
  isExpired(data) {
    if (!data || !data.cacheExpiry) {
      return true;
    }

    const now = Date.now();
    const expiry = data.cacheExpiry.toMillis ? data.cacheExpiry.toMillis() : data.cacheExpiry;
    
    return now > expiry;
  }

  /**
   * Remove item do cache
   */
  async delete(key) {
    try {
      await this.db.collection(this.collectionName).doc(key).delete();
      this.logger.info('Cache removido', { key });
      return true;
    } catch (error) {
      this.logger.error('Erro ao remover cache', { key, error: error.message });
      return false;
    }
  }

  /**
   * Limpa cache expirado
   */
  async cleanExpired() {
    try {
      const now = admin.firestore.Timestamp.now();
      const snapshot = await this.db.collection(this.collectionName)
        .where('cacheExpiry', '<', now)
        .limit(100)
        .get();

      const batch = this.db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      
      this.logger.info('Cache expirado limpo', { count: snapshot.size });
      return snapshot.size;
    } catch (error) {
      this.logger.error('Erro ao limpar cache', { error: error.message });
      return 0;
    }
  }
}

module.exports = CacheManager;
