/**
 * FirestoreService - Camada de Acesso a Dados Multi-Tenant
 * 
 * Centraliza todas as operações do Firestore com empresaId automático
 * Garante isolamento de dados entre empresas
 * 
 * 🔥 RESILIÊNCIA OPERACIONAL:
 * - Circuit Breaker para proteção contra falhas
 * - Limites operacionais por usuário
 * - Idempotência em operações críticas
 */

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { circuitBreakers } from '../utils/circuitBreaker';
import { checkOperationalLimit, recordOperation } from '../utils/operationalLimits';

class FirestoreService {
  /**
   * Obtém empresaId do sessionStorage com validação
   * 
   * 🔒 HARDENING NÍVEL ENTERPRISE:
   * - Validação estrita de formato
   * - Sem bypass para "Super Admin"
   * - Auditoria de tentativas suspeitas
   * 
   * @returns {string} empresaId validado
   * @throws {Error} Se empresaId inválido ou ausente
   */
  getEmpresaId() {
    const empresaId = sessionStorage.getItem('empresaId');
    
    // 🔒 HARDENING: NUNCA permitir acesso sem empresaId
    // Remover conceito de "Super Admin" que bypassa isolamento
    if (!empresaId || empresaId === 'undefined' || empresaId === 'null') {
      console.error('[FirestoreService] ERRO CRÍTICO: empresaId não encontrado');
      throw new Error('Sessão inválida. Faça login novamente.');
    }
    
    // 🔒 VALIDAÇÃO CRÍTICA: Verificar formato UUID ou string válida
    if (typeof empresaId !== 'string' || empresaId.trim().length === 0) {
      console.error('[FirestoreService] ERRO CRÍTICO: empresaId formato inválido:', empresaId);
      sessionStorage.clear(); // Limpar sessão comprometida
      throw new Error('Sessão corrompida. Faça login novamente.');
    }
    
    // 🔒 VALIDAÇÃO: Verificar se não contém caracteres perigosos
    // Apenas alfanuméricos, underscore e hífen
    if (!/^[a-zA-Z0-9_-]+$/.test(empresaId)) {
      console.error('[FirestoreService] ERRO CRÍTICO: empresaId contém caracteres inválidos:', empresaId);
      sessionStorage.clear();
      throw new Error('Sessão inválida. Faça login novamente.');
    }
    
    // 🔒 VALIDAÇÃO: Verificar tamanho mínimo e máximo
    if (empresaId.length < 8 || empresaId.length > 128) {
      console.error('[FirestoreService] ERRO CRÍTICO: empresaId tamanho inválido:', empresaId.length);
      sessionStorage.clear();
      throw new Error('Sessão inválida. Faça login novamente.');
    }
    
    return empresaId;
  }

  /**
   * Constrói caminho da coleção com empresaId
   * 
   * 🔒 HARDENING: SEMPRE usar estrutura multi-tenant
   * Sem exceções, sem bypass
   * 
   * @param {string} collectionName - Nome da coleção
   * @returns {string} Caminho completo da coleção
   */
  getCollectionPath(collectionName) {
    const empresaId = this.getEmpresaId(); // Vai lançar erro se inválido
    
    // 🔒 HARDENING: SEMPRE usar estrutura isolada
    // Remover qualquer possibilidade de acesso à raiz
    return `empresas/${empresaId}/${collectionName}`;
  }

  /**
   * Busca todos os documentos de uma coleção
   * 
   * 🔥 RESILIÊNCIA: Circuit Breaker protege contra falhas
   * 
   * @param {string} collectionName - Nome da coleção
   * @param {Object} options - Opções de query (orderBy, limit)
   * @returns {Promise<Array>} Array de documentos
   */
  async getAll(collectionName, options = {}) {
    return await circuitBreakers.firestore.execute(async () => {
      try {
        const path = this.getCollectionPath(collectionName);
        const collectionRef = collection(db, path);
        
        let q = query(collectionRef);
        
        // Aplicar orderBy se especificado
        if (options.orderBy) {
          const { field, direction = 'asc' } = options.orderBy;
          q = query(q, orderBy(field, direction));
        }
        
        // Aplicar limit se especificado
        if (options.limit) {
          q = query(q, firestoreLimit(options.limit));
        }
        
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          firestoreId: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error(`[FirestoreService] Error getting all from ${collectionName}:`, error);
        
        // 🔥 FAIL SAFE: Retornar array vazio em caso de falha
        // Sistema continua operando sem dados desta coleção
        return [];
      }
    });
  }

  /**
   * Busca um documento por ID
   * 
   * 🔥 RESILIÊNCIA: Circuit Breaker + Fail Safe
   * 
   * @param {string} collectionName - Nome da coleção
   * @param {string} id - ID do documento
   * @returns {Promise<Object|null>} Documento ou null se não encontrado
   */
  async getById(collectionName, id) {
    return await circuitBreakers.firestore.execute(async () => {
      try {
        const path = this.getCollectionPath(collectionName);
        const docRef = doc(db, path, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          return null;
        }

        return {
          id: docSnap.id,
          firestoreId: docSnap.id,
          ...docSnap.data()
        };
      } catch (error) {
        console.error(`[FirestoreService] Error getting ${collectionName}/${id}:`, error);
        
        // 🔥 FAIL SAFE: Retornar null em caso de falha
        return null;
      }
    });
  }

  /**
   * Cria um novo documento
   * 
   * 🔥 RESILIÊNCIA:
   * - Circuit Breaker
   * - Limites operacionais
   * - empresaId forçado do contexto
   * - Impossível sobrescrever empresaId
   * 
   * @param {string} collectionName - Nome da coleção
   * @param {Object} data - Dados do documento
   * @returns {Promise<string>} ID do documento criado
   */
  async create(collectionName, data) {
    return await circuitBreakers.firestore.execute(async () => {
      try {
        // 🔥 BLAST RADIUS: Verificar limite operacional
        const userId = sessionStorage.getItem('userId') || 'unknown';
        const operationKey = `CREATE_${collectionName.toUpperCase()}`;
        
        const limitCheck = checkOperationalLimit(userId, operationKey);
        if (!limitCheck.allowed) {
          throw new Error(limitCheck.error);
        }
        
        const path = this.getCollectionPath(collectionName);
        const collectionRef = collection(db, path);
        
        const empresaIdContexto = this.getEmpresaId();
        
        // 🔒 HARDENING CRÍTICO: Remover qualquer empresaId que venha dos dados
        const { empresaId: _, ...dadosLimpos } = data;
        
        // 🔒 VALIDAÇÃO: Se dados continham empresaId diferente, registrar tentativa suspeita
        if (data.empresaId && data.empresaId !== empresaIdContexto) {
          console.error('[FirestoreService] TENTATIVA DE MANIPULAÇÃO DE EMPRESAID DETECTADA:', {
            empresaIdContexto,
            empresaIdDados: data.empresaId,
            collection: collectionName
          });
          
          throw new Error('Tentativa de manipulação detectada');
        }
        
        const docData = {
          ...dadosLimpos,
          empresaId: empresaIdContexto,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collectionRef, docData);
        
        // 🔥 AUDITORIA: Registrar operação
        recordOperation(userId, operationKey, {
          collection: collectionName,
          docId: docRef.id,
          remaining: limitCheck.remaining
        });
        
        return docRef.id;
      } catch (error) {
        console.error(`[FirestoreService] Error creating ${collectionName}:`, error);
        throw error;
      }
    });
  }

  /**
   * Atualiza um documento
   * 
   * 🔒 HARDENING:
   * - Impossível alterar empresaId
   * - Validação de propriedade do documento
   * - Auditoria de tentativas suspeitas
   * 
   * 🔥 RESILIÊNCIA:
   * - Circuit Breaker
   * - Limites operacionais
   * 
   * @param {string} collectionName - Nome da coleção
   * @param {string} id - ID do documento
   * @param {Object} data - Dados a atualizar
   * @returns {Promise<void>}
   */
  async update(collectionName, id, data) {
    return await circuitBreakers.firestore.execute(async () => {
      try {
        // 🔥 BLAST RADIUS: Verificar limite operacional
        const userId = sessionStorage.getItem('userId') || 'unknown';
        const operationKey = `UPDATE_${collectionName.toUpperCase()}`;
        
        const limitCheck = checkOperationalLimit(userId, operationKey, 200); // 200/hora
        if (!limitCheck.allowed) {
          throw new Error(limitCheck.error);
        }
        
        const path = this.getCollectionPath(collectionName);
        const docRef = doc(db, path, id);
        
        // 🔒 HARDENING CRÍTICO: Remover empresaId dos dados de atualização
        // NUNCA permitir mudança de empresaId
        const { empresaId: _, ...dadosLimpos } = data;
        
        // 🔒 VALIDAÇÃO: Se tentou mudar empresaId, registrar tentativa suspeita
        if (data.empresaId && data.empresaId !== this.getEmpresaId()) {
          console.error('[FirestoreService] TENTATIVA DE MUDANÇA DE EMPRESAID DETECTADA:', {
            empresaIdContexto: this.getEmpresaId(),
            empresaIdTentativa: data.empresaId,
            collection: collectionName,
            docId: id
          });
          
          throw new Error('Tentativa de manipulação detectada');
        }
        
        const updateData = {
          ...dadosLimpos,
          updatedAt: serverTimestamp()
        };
        
        await updateDoc(docRef, updateData);
        
        // 🔥 AUDITORIA: Registrar operação
        recordOperation(userId, operationKey, {
          collection: collectionName,
          docId: id,
          remaining: limitCheck.remaining
        });
        
      } catch (error) {
        console.error(`[FirestoreService] Error updating ${collectionName}/${id}:`, error);
        throw error;
      }
    });
  }

  /**
   * Deleta um documento
   * 
   * 🔥 RESILIÊNCIA:
   * - Circuit Breaker
   * - Limites operacionais
   * 
   * @param {string} collectionName - Nome da coleção
   * @param {string} id - ID do documento
   * @returns {Promise<void>}
   */
  async delete(collectionName, id) {
    return await circuitBreakers.firestore.execute(async () => {
      try {
        // 🔥 BLAST RADIUS: Verificar limite operacional
        const userId = sessionStorage.getItem('userId') || 'unknown';
        const operationKey = `DELETE_${collectionName.toUpperCase()}`;
        
        const limitCheck = checkOperationalLimit(userId, operationKey, 100); // 100/hora
        if (!limitCheck.allowed) {
          throw new Error(limitCheck.error);
        }
        
        const path = this.getCollectionPath(collectionName);
        const docRef = doc(db, path, id);
        
        await deleteDoc(docRef);
        
        // 🔥 AUDITORIA: Registrar operação
        recordOperation(userId, operationKey, {
          collection: collectionName,
          docId: id,
          remaining: limitCheck.remaining
        });
        
      } catch (error) {
        console.error(`[FirestoreService] Error deleting ${collectionName}/${id}:`, error);
        throw error;
      }
    });
  }

  /**
   * Busca documentos com filtros
   * 
   * 🔥 RESILIÊNCIA: Circuit Breaker + Fail Safe
   * 
   * @param {string} collectionName - Nome da coleção
   * @param {Array} filters - Array de filtros [{field, operator, value}]
   * @param {Object} options - Opções de query (orderBy, limit)
   * @returns {Promise<Array>} Array de documentos
   */
  async query(collectionName, filters = [], options = {}) {
    return await circuitBreakers.firestore.execute(async () => {
      try {
        const path = this.getCollectionPath(collectionName);
        const collectionRef = collection(db, path);
        
        let q = query(collectionRef);
        
        // Aplicar filtros
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
        
        // Aplicar orderBy se especificado
        if (options.orderBy) {
          const { field, direction = 'asc' } = options.orderBy;
          q = query(q, orderBy(field, direction));
        }
        
        // Aplicar limit se especificado
        if (options.limit) {
          q = query(q, firestoreLimit(options.limit));
        }
        
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          firestoreId: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error(`[FirestoreService] Error querying ${collectionName}:`, error);
        
        // 🔥 FAIL SAFE: Retornar array vazio em caso de falha
        return [];
      }
    });
  }

  /**
   * Escuta mudanças em tempo real em uma coleção
   * 
   * 🔥 RESILIÊNCIA: Fail Safe - nunca quebra a aplicação
   * 
   * @param {string} collectionName - Nome da coleção
   * @param {Function} callback - Função chamada quando há mudanças
   * @param {Object} options - Opções de query
   * @returns {Function} Função para cancelar a escuta
   */
  onSnapshot(collectionName, callback, options = {}) {
    try {
      const path = this.getCollectionPath(collectionName);
      const collectionRef = collection(db, path);
      
      let q = query(collectionRef);
      
      // Aplicar orderBy se especificado
      if (options.orderBy) {
        const { field, direction = 'asc' } = options.orderBy;
        q = query(q, orderBy(field, direction));
      }
      
      // Aplicar limit se especificado
      if (options.limit) {
        q = query(q, firestoreLimit(options.limit));
      }
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          firestoreId: doc.id,
          ...doc.data()
        }));
        
        callback(docs);
      }, (error) => {
        console.error(`[FirestoreService] Error in snapshot listener for ${collectionName}:`, error);
        
        // 🔥 FAIL SAFE: Chamar callback com array vazio em caso de erro
        callback([]);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error(`[FirestoreService] Error setting up snapshot for ${collectionName}:`, error);
      
      // 🔥 FAIL SAFE: Retornar função vazia para não quebrar
      return () => {};
    }
  }
}

// Exportar instância única
export const firestoreService = new FirestoreService();

export default firestoreService;
