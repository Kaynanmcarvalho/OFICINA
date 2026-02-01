/**
 * Vehicle History Service
 * Serviço para consulta de histórico veicular (recalls, leilões, sinistros)
 */

import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';

class VehicleHistoryService {
  constructor() {
    this.collectionName = 'vehicle_history';
    this.logsCollectionName = 'vehicle_history_logs';
    this.cacheTTL = {
      recalls: 7 * 24 * 60 * 60 * 1000, // 7 dias
      leiloes: 30 * 24 * 60 * 60 * 1000, // 30 dias
      sinistros: 24 * 60 * 60 * 1000 // 24 horas
    };
  }

  /**
   * Busca histórico do veículo (com cache)
   */
  async getVehicleHistory(placa, empresaId, forceRefresh = false) {
    try {
      const historyId = this.generateHistoryId(placa, empresaId);
      
      // Verificar cache se não for refresh forçado
      if (!forceRefresh) {
        const cached = await this.getCachedHistory(historyId);
        if (cached && !this.isCacheExpired(cached)) {
          return {
            success: true,
            data: cached,
            cached: true
          };
        }
      }

      // Buscar dados frescos
      const freshData = await this.fetchFreshHistory(placa, empresaId);
      
      // Salvar no cache
      await this.saveToCache(historyId, freshData);
      
      return {
        success: true,
        data: freshData,
        cached: false
      };
    } catch (error) {
      console.error('❌ Erro ao buscar histórico:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca histórico fresco (chama Cloud Function)
   */
  async fetchFreshHistory(placa, empresaId) {
    // TODO: Implementar chamada para Cloud Function
    // Por enquanto, retorna estrutura vazia
    return {
      placa,
      empresaId,
      recalls: [],
      leiloes: [],
      sinistros: [],
      restricoes: [],
      summary: {
        totalRecalls: 0,
        recallsPendentes: 0,
        temLeilao: false,
        temSinistro: false,
        temRestricao: false,
        risco: 'baixo'
      },
      lastUpdate: Timestamp.now(),
      cacheExpiry: this.calculateCacheExpiry()
    };
  }

  /**
   * Busca histórico do cache
   */
  async getCachedHistory(historyId) {
    try {
      const docRef = doc(db, this.collectionName, historyId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar cache:', error);
      return null;
    }
  }

  /**
   * Salva histórico no cache
   */
  async saveToCache(historyId, data) {
    try {
      const docRef = doc(db, this.collectionName, historyId);
      await setDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }

  /**
   * Verifica se cache expirou
   */
  isCacheExpired(cachedData) {
    if (!cachedData.cacheExpiry) return true;
    
    const now = Date.now();
    const expiry = cachedData.cacheExpiry.toMillis();
    
    return now > expiry;
  }

  /**
   * Calcula data de expiração do cache
   */
  calculateCacheExpiry() {
    // Usa o menor TTL (24h para sinistros)
    const ttl = Math.min(...Object.values(this.cacheTTL));
    return Timestamp.fromMillis(Date.now() + ttl);
  }

  /**
   * Gera ID único para o histórico
   */
  generateHistoryId(placa, empresaId) {
    return `${empresaId}_${placa.replace(/[^a-zA-Z0-9]/g, '')}`;
  }

  /**
   * Busca históricos por empresa
   */
  async getHistoriesByEmpresa(empresaId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('empresaId', '==', empresaId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar históricos:', error);
      return [];
    }
  }

  /**
   * Registra log de consulta
   */
  async logConsulta(placa, empresaId, tipo, sucesso, erro = null) {
    try {
      const logRef = doc(collection(db, this.logsCollectionName));
      await setDoc(logRef, {
        empresaId,
        placa,
        tipo,
        sucesso,
        erro,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao registrar log:', error);
    }
  }

  /**
   * Calcula nível de risco baseado no histórico
   */
  calculateRisk(history) {
    let riskScore = 0;

    // Recalls pendentes
    if (history.recalls?.length > 0) {
      const pendentes = history.recalls.filter(r => r.status === 'pendente');
      riskScore += pendentes.length * 2;
    }

    // Leilões
    if (history.leiloes?.length > 0) {
      riskScore += history.leiloes.length * 3;
    }

    // Sinistros
    if (history.sinistros?.length > 0) {
      const graves = history.sinistros.filter(s => s.gravidade === 'alta');
      riskScore += graves.length * 5;
      riskScore += (history.sinistros.length - graves.length) * 2;
    }

    // Restrições ativas
    if (history.restricoes?.length > 0) {
      const ativas = history.restricoes.filter(r => r.status === 'ativa');
      riskScore += ativas.length * 4;
    }

    // Classificar risco
    if (riskScore === 0) return 'baixo';
    if (riskScore <= 5) return 'medio';
    return 'alto';
  }
}

export default new VehicleHistoryService();
