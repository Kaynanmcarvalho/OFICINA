/**
 * Store Helpers - Funções auxiliares para garantir isolamento multi-tenant
 * 
 * Todos os stores devem usar estas funções ao invés de acessar Firestore diretamente
 */

import { firestoreService } from './firestoreService';

/**
 * Mapeamento de nomes de coleções
 * 
 * IMPORTANTE: Para Super Admins (dados antigos na raiz), usar nomes em INGLÊS
 * Para empresas clientes (dados isolados), usar nomes em PORTUGUÊS
 */
const COLLECTION_MAP = {
  // Mapeamento desativado - usar nomes originais
  // Isso permite que Super Admins acessem 'clients' na raiz
  // E empresas acessem 'clientes' em empresas/{id}/clientes
};

/**
 * Obtém nome correto da coleção
 * Agora retorna o nome original sem tradução
 */
const getCollectionName = (name) => {
  // Retornar nome original sem mapeamento
  // Isso permite acesso direto às coleções antigas
  return name;
};

/**
 * Adiciona documento à coleção isolada por empresa
 */
export const addDocument = async (collectionName, data) => {
  const collection = getCollectionName(collectionName);
  const docId = await firestoreService.create(collection, data);
  return { ...data, id: docId, firestoreId: docId };
};

/**
 * Busca todos os documentos da coleção isolada por empresa
 */
export const getAllDocuments = async (collectionName, options = {}) => {
  const collection = getCollectionName(collectionName);
  return await firestoreService.getAll(collection, options);
};

/**
 * Busca documento por ID da coleção isolada por empresa
 */
export const getDocumentById = async (collectionName, id) => {
  const collection = getCollectionName(collectionName);
  return await firestoreService.getById(collection, id);
};

/**
 * Atualiza documento da coleção isolada por empresa
 */
export const updateDocument = async (collectionName, id, data) => {
  const collection = getCollectionName(collectionName);
  return await firestoreService.update(collection, id, data);
};

/**
 * Deleta documento da coleção isolada por empresa
 */
export const deleteDocument = async (collectionName, id) => {
  const collection = getCollectionName(collectionName);
  return await firestoreService.delete(collection, id);
};

/**
 * Busca documentos com query da coleção isolada por empresa
 */
export const queryDocuments = async (collectionName, queryOptions) => {
  const collection = getCollectionName(collectionName);
  return await firestoreService.query(collection, queryOptions);
};

/**
 * Escuta mudanças em tempo real da coleção isolada por empresa
 */
export const subscribeToCollection = (collectionName, callback, options = {}) => {
  const collection = getCollectionName(collectionName);
  return firestoreService.onSnapshot(collection, callback, options);
};

/**
 * Busca documentos com paginação
 */
export const getDocumentsWithPagination = async (collectionName, options = {}) => {
  const collection = getCollectionName(collectionName);
  return await firestoreService.getAll(collection, {
    ...options,
    orderBy: options.orderBy || { field: 'createdAt', direction: 'desc' }
  });
};

/**
 * Conta documentos na coleção
 */
export const countDocuments = async (collectionName) => {
  const collection = getCollectionName(collectionName);
  const docs = await firestoreService.getAll(collection);
  return docs.length;
};

/**
 * Verifica se documento existe
 */
export const documentExists = async (collectionName, id) => {
  try {
    const collection = getCollectionName(collectionName);
    const doc = await firestoreService.getById(collection, id);
    return !!doc;
  } catch {
    return false;
  }
};

export default {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  queryDocuments,
  subscribeToCollection,
  getDocumentsWithPagination,
  countDocuments,
  documentExists
};
