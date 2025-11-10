/**
 * FirestoreService - Camada de Acesso a Dados Multi-Tenant
 * 
 * Centraliza todas as operações do Firestore com empresaId automático
 * Garante isolamento de dados entre empresas
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

class FirestoreService {
  /**
   * Obtém empresaId do sessionStorage com validação
   * @returns {string|null} empresaId ou null se não disponível
   */
  getEmpresaId() {
    const empresaId = sessionStorage.getItem('empresaId');
    
    // SUPER ADMIN: Permitir acesso sem empresaId (dados antigos na raiz)
    if (!empresaId || empresaId === 'undefined' || empresaId === 'null') {
      console.log('[FirestoreService] Sem empresaId - Super Admin acessando dados antigos');
      return null; // Retorna null para usar estrutura antiga
    }
    
    // VALIDAÇÃO CRÍTICA: Verificar formato UUID ou string válida
    if (typeof empresaId !== 'string' || empresaId.trim().length === 0) {
      console.error('[FirestoreService] Invalid empresaId format:', empresaId);
      sessionStorage.removeItem('empresaId'); // Limpar empresaId inválido
      return null; // Usar estrutura antiga
    }
    
    // VALIDAÇÃO: Verificar se não contém caracteres perigosos
    if (!/^[a-zA-Z0-9_-]+$/.test(empresaId)) {
      console.error('[FirestoreService] empresaId contains invalid characters:', empresaId);
      sessionStorage.removeItem('empresaId');
      return null; // Usar estrutura antiga
    }
    
    return empresaId;
  }

  /**
   * Constrói caminho da coleção com empresaId
   * @param {string} collectionName - Nome da coleção
   * @returns {string} Caminho completo da coleção
   */
  getCollectionPath(collectionName) {
    const empresaId = this.getEmpresaId();
    
    // SUPER ADMIN: Se não tem empresaId definido, usar estrutura antiga (raiz)
    // Isso permite que Super Admins acessem dados antigos
    if (!empresaId || empresaId === 'undefined' || empresaId === 'null') {
      console.log('[FirestoreService] Super Admin sem empresaId - usando estrutura antiga (raiz)');
      return collectionName;
    }
    
    return `empresas/${empresaId}/${collectionName}`;
  }

  /**
   * Busca todos os documentos de uma coleção
   * @param {string} collectionName - Nome da coleção
   * @param {Object} options - Opções de query (orderBy, limit)
   * @returns {Promise<Array>} Array de documentos
   */
  async getAll(collectionName, options = {}) {
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
      throw error;
    }
  }

  /**
   * Busca um documento por ID
   * @param {string} collectionName - Nome da coleção
   * @param {string} id - ID do documento
   * @returns {Promise<Object|null>} Documento ou null se não encontrado
   */
  async getById(collectionName, id) {
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
      throw error;
    }
  }

  /**
   * Cria um novo documento
   * @param {string} collectionName - Nome da coleção
   * @param {Object} data - Dados do documento
   * @returns {Promise<string>} ID do documento criado
   */
  async create(collectionName, data) {
    try {
      const path = this.getCollectionPath(collectionName);
      const collectionRef = collection(db, path);
      
      const docData = {
        ...data,
        empresaId: this.getEmpresaId(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collectionRef, docData);
      
      console.log(`[FirestoreService] Created ${collectionName}/${docRef.id}`);
      
      return docRef.id;
    } catch (error) {
      console.error(`[FirestoreService] Error creating ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Atualiza um documento
   * @param {string} collectionName - Nome da coleção
   * @param {string} id - ID do documento
   * @param {Object} data - Dados a atualizar
   * @returns {Promise<void>}
   */
  async update(collectionName, id, data) {
    try {
      const path = this.getCollectionPath(collectionName);
      const docRef = doc(db, path, id);
      
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      
      console.log(`[FirestoreService] Updated ${collectionName}/${id}`);
    } catch (error) {
      console.error(`[FirestoreService] Error updating ${collectionName}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Deleta um documento
   * @param {string} collectionName - Nome da coleção
   * @param {string} id - ID do documento
   * @returns {Promise<void>}
   */
  async delete(collectionName, id) {
    try {
      const path = this.getCollectionPath(collectionName);
      const docRef = doc(db, path, id);
      
      await deleteDoc(docRef);
      
      console.log(`[FirestoreService] Deleted ${collectionName}/${id}`);
    } catch (error) {
      console.error(`[FirestoreService] Error deleting ${collectionName}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Busca documentos com filtros
   * @param {string} collectionName - Nome da coleção
   * @param {Array} filters - Array de filtros [{field, operator, value}]
   * @param {Object} options - Opções de query (orderBy, limit)
   * @returns {Promise<Array>} Array de documentos
   */
  async query(collectionName, filters = [], options = {}) {
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
      throw error;
    }
  }

  /**
   * Escuta mudanças em tempo real em uma coleção
   * @param {string} collectionName - Nome da coleção
   * @param {Function} callback - Função chamada quando há mudanças
   * @param {Object} options - Opções de query
   * @returns {Function} Função para cancelar a escuta
   */
  onSnapshot(collectionName, callback, options = {}) {
    try {
      // Verificar se empresaId está disponível antes de configurar listener
      const empresaId = this.getEmpresaId(false);
      if (!empresaId) {
        console.warn(`[FirestoreService] empresaId not available yet, skipping snapshot for ${collectionName}`);
        // Retornar função vazia para não quebrar
        return () => {};
      }
      
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
      });
      
      return unsubscribe;
    } catch (error) {
      console.error(`[FirestoreService] Error setting up snapshot for ${collectionName}:`, error);
      throw error;
    }
  }
}

// Exportar instância única
export const firestoreService = new FirestoreService();

export default firestoreService;
