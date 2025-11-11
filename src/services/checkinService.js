/**
 * Checkin Service
 * Gerencia check-ins no Firestore
 */

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  serverTimestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Cria um novo check-in
 * @param {object} checkinData - Dados do check-in
 * @param {string} empresaId - ID da empresa
 * @returns {Promise<string>} ID do documento criado
 */
export const createCheckin = async (checkinData, empresaId) => {
  try {
    const docData = {
      ...checkinData,
      empresaId,
      status: 'em_atendimento',
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'checkins'), docData);
    console.log('Check-in criado:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar check-in:', error);
    throw error;
  }
};

/**
 * Busca histórico de check-ins de uma placa
 * @param {string} placa - Placa do veículo
 * @param {string} empresaId - ID da empresa
 * @returns {Promise<Array>} Lista de check-ins
 */
export const getCheckinHistory = async (placa, empresaId) => {
  try {
    const q = query(
      collection(db, 'checkins'),
      where('empresaId', '==', empresaId),
      where('placa', '==', placa),
      orderBy('criadoEm', 'desc'),
      limit(5)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      criadoEm: doc.data().criadoEm?.toDate()
    }));
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
};

/**
 * Atualiza um check-in existente
 * @param {string} checkinId - ID do check-in
 * @param {object} updates - Dados a atualizar
 * @returns {Promise<void>}
 */
export const updateCheckin = async (checkinId, updates) => {
  try {
    const docRef = doc(db, 'checkins', checkinId);
    await updateDoc(docRef, {
      ...updates,
      atualizadoEm: serverTimestamp()
    });
    console.log('Check-in atualizado:', checkinId);
  } catch (error) {
    console.error('Erro ao atualizar check-in:', error);
    throw error;
  }
};

/**
 * Gera PIN único de 6 dígitos
 * @returns {string} PIN gerado
 */
export const generatePIN = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Valida PIN
 * @param {string} pin - PIN a validar
 * @returns {boolean} True se válido
 */
export const validatePIN = (pin) => {
  return /^\d{6}$/.test(pin);
};

/**
 * Realiza checkout de um check-in
 * @param {string} checkinId - ID do check-in
 * @param {object} checkoutData - Dados do checkout
 * @param {Array} photoFiles - Arquivos de fotos (opcional)
 * @returns {Promise<object>} Check-in atualizado
 */
export const checkoutCheckin = async (checkinId, checkoutData, photoFiles = []) => {
  try {
    // Upload de fotos se houver
    let fotosUrls = [];
    if (photoFiles && photoFiles.length > 0) {
      // Importar storageService dinamicamente para evitar dependência circular
      const { uploadCheckinPhoto } = await import('./storageService');
      
      for (const file of photoFiles) {
        try {
          const url = await uploadCheckinPhoto(`checkout-${checkinId}`, file);
          fotosUrls.push(url);
        } catch (error) {
          console.error('Erro ao fazer upload de foto:', error);
        }
      }
    }

    // Atualizar check-in com dados do checkout
    const docRef = doc(db, 'checkins', checkinId);
    const updateData = {
      status: 'concluido',
      checkout: {
        servicosRealizados: checkoutData.servicesPerformed || '',
        valorTotal: checkoutData.totalCost || 0,
        metodoPagamento: checkoutData.paymentMethod || '',
        observacoes: checkoutData.checkoutObservations || '',
        fotos: fotosUrls,
        dataHora: serverTimestamp()
      },
      atualizadoEm: serverTimestamp()
    };

    await updateDoc(docRef, updateData);
    
    console.log('Checkout realizado:', checkinId);
    
    return {
      id: checkinId,
      ...updateData
    };
  } catch (error) {
    console.error('Erro ao realizar checkout:', error);
    throw new Error('Erro ao realizar checkout: ' + error.message);
  }
};

export default {
  createCheckin,
  getCheckinHistory,
  updateCheckin,
  generatePIN,
  validatePIN,
  checkoutCheckin
};
