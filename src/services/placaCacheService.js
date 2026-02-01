/**
 * PlacaCacheService - Cache Global de Consultas de Placas
 * 
 * Cache compartilhado entre TODAS as empresas para reduzir chamadas de API
 * Estrutura: /cache_placas/{placa} (global, fora de /empresas)
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

class PlacaCacheService {
  constructor() {
    // Cache local em memória (válido apenas durante a sessão)
    this.localCache = new Map();
    this.MAX_CACHE_SIZE = 500; // Limite de 500 placas em memória
    this.CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas em ms
    }

  /**
   * Consulta placa com estratégia de cache em 3 níveis:
   * 1. Cache local (memória)
   * 2. Cache global Firebase
   * 3. API externa
   * 
   * @param {string} placa - Placa do veículo
   * @param {Function} apiCallback - Função para chamar API externa se necessário
   * @returns {Promise<Object|null>} Dados do veículo ou null
   */
  async consultarPlaca(placa, apiCallback) {
    try {
      const placaNormalizada = this.normalizarPlaca(placa);
      
      // 1. Verificar cache local (memória)
      if (this.localCache.has(placaNormalizada)) {
        const cached = this.localCache.get(placaNormalizada);
        
        // Verificar se cache expirou
        if (this.isCacheExpired(cached)) {
          this.localCache.delete(placaNormalizada);
        } else {
          return cached.data;
        }
      }

      // 2. Verificar cache global Firebase
      const cacheDoc = await getDoc(doc(db, 'cache_placas', placaNormalizada));
      
      if (cacheDoc.exists()) {
        const data = cacheDoc.data();
        // Salvar no cache local com timestamp
        this.addToLocalCache(placaNormalizada, data);
        
        return data;
      }

      // 3. Chamar API externa
      if (!apiCallback || typeof apiCallback !== 'function') {
        return null;
      }

      const apiData = await apiCallback(placaNormalizada);
      
      if (apiData && this.isValidPlacaData(apiData)) {
        // Salvar no cache global Firebase
        await this.salvarNoCache(placaNormalizada, apiData);
        
        // Salvar no cache local com timestamp
        this.addToLocalCache(placaNormalizada, apiData);
        
        return apiData;
      }

      return null;

    } catch (error) {
      console.error('[PlacaCacheService] Error consulting plate:', error);
      return null;
    }
  }

  /**
   * Salva dados da placa no cache global Firebase
   * @param {string} placa - Placa normalizada
   * @param {Object} data - Dados do veículo
   * @returns {Promise<void>}
   */
  async salvarNoCache(placa, data) {
    try {
      const cacheData = {
        placa,
        marca: data.marca || data.brand || '',
        modelo: data.modelo || data.model || '',
        ano: data.ano || data.year || '',
        cor: data.cor || data.color || '',
        chassi: data.chassi || data.chassis || '',
        renavam: data.renavam || '',
        timestamp: serverTimestamp(),
        // Metadados
        fonte: data.fonte || 'api',
        ultimaAtualizacao: new Date().toISOString()
      };

      await setDoc(doc(db, 'cache_placas', placa), cacheData);
      
      } catch (error) {
      console.error('[PlacaCacheService] Error saving to cache:', error);
      // Não propagar erro - cache é opcional
    }
  }

  /**
   * Valida se os dados da placa são válidos
   * @param {Object} data - Dados do veículo
   * @returns {boolean}
   */
  isValidPlacaData(data) {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Pelo menos marca e modelo devem estar presentes
    const hasMarca = !!(data.marca || data.brand);
    const hasModelo = !!(data.modelo || data.model);

    return hasMarca && hasModelo;
  }

  /**
   * Normaliza placa removendo caracteres especiais
   * SEGURANÇA: Protege contra injection com Unicode
   * @param {string} placa - Placa original
   * @returns {string} Placa normalizada
   */
  normalizarPlaca(placa) {
    if (!placa) return '';
    
    // Converter para string e limitar tamanho
    let placaStr = String(placa).substring(0, 10); // Máximo 10 caracteres
    
    // Remover TODOS os caracteres não-ASCII primeiro (proteção Unicode)
    placaStr = placaStr.replace(/[^\x00-\x7F]/g, '');
    
    // Converter para maiúsculas e remover caracteres especiais
    placaStr = placaStr
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .trim();
    
    // Validar formato brasileiro (ABC1234 ou ABC1D23)
    if (placaStr.length !== 7) {
      }
    
    return placaStr;
  }
  
  /**
   * Adiciona item ao cache local com controle de tamanho
   * @param {string} placa - Placa normalizada
   * @param {Object} data - Dados do veículo
   */
  addToLocalCache(placa, data) {
    // Se cache está cheio, remover item mais antigo (FIFO)
    if (this.localCache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.localCache.keys().next().value;
      this.localCache.delete(firstKey);
      }
    
    // Adicionar com timestamp
    this.localCache.set(placa, {
      data,
      timestamp: Date.now()
    });
  }
  
  /**
   * Verifica se cache expirou
   * @param {Object} cached - Item do cache
   * @returns {boolean}
   */
  isCacheExpired(cached) {
    if (!cached || !cached.timestamp) return true;
    
    const age = Date.now() - cached.timestamp;
    return age > this.CACHE_TTL;
  }

  /**
   * Limpa cache local (memória)
   */
  clearLocalCache() {
    this.localCache.clear();
    }

  /**
   * Obtém estatísticas do cache local
   * @returns {Object} Estatísticas
   */
  getLocalCacheStats() {
    return {
      size: this.localCache.size,
      keys: Array.from(this.localCache.keys())
    };
  }

  /**
   * Busca diretamente no cache global sem chamar API
   * @param {string} placa - Placa do veículo
   * @returns {Promise<Object|null>}
   */
  async buscarNoCache(placa) {
    try {
      const placaNormalizada = this.normalizarPlaca(placa);

      // Verificar cache local primeiro
      if (this.localCache.has(placaNormalizada)) {
        const cached = this.localCache.get(placaNormalizada);
        
        if (!this.isCacheExpired(cached)) {
          return cached.data;
        }
        
        this.localCache.delete(placaNormalizada);
      }

      // Verificar cache global
      const cacheDoc = await getDoc(doc(db, 'cache_placas', placaNormalizada));
      
      if (cacheDoc.exists()) {
        const data = cacheDoc.data();
        this.addToLocalCache(placaNormalizada, data);
        return data;
      }

      return null;
    } catch (error) {
      console.error('[PlacaCacheService] Error searching cache:', error);
      return null;
    }
  }
}

// Exportar instância única
export const placaCacheService = new PlacaCacheService();

export default placaCacheService;
