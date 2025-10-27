import { localDB } from './localStorageService';

/**
 * Converte fotos para base64 (armazenamento local)
 */
export const uploadPhotos = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  try {
    const photoPromises = files.map(async (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          });
        };
        reader.readAsDataURL(file);
      });
    });

    return await Promise.all(photoPromises);
  } catch (error) {
    console.error('Erro ao processar fotos:', error);
    throw new Error('Falha ao processar as fotos');
  }
};

/**
 * Cria um novo check-in
 */
export const createCheckin = async (checkinData, photoFiles = []) => {
  try {
    // Processar fotos se houver
    let photos = [];
    if (photoFiles.length > 0) {
      photos = await uploadPhotos(photoFiles, 'temp');
    }

    // Criar check-in
    const newCheckin = await localDB.createCheckin({
      ...checkinData,
      photos
    });

    return {
      ...newCheckin,
      checkInDate: new Date(newCheckin.checkInDate)
    };
  } catch (error) {
    console.error('Erro ao criar check-in:', error);
    throw error;
  }
};

/**
 * Lista todos os check-ins
 */
export const getCheckins = async (filters = {}) => {
  try {
    const checkins = await localDB.getCheckins(filters);
    
    return checkins.map(checkin => ({
      ...checkin,
      checkInDate: new Date(checkin.checkInDate),
      checkOutDate: checkin.checkOutDate ? new Date(checkin.checkOutDate) : null
    }));
  } catch (error) {
    console.error('Erro ao buscar check-ins:', error);
    throw error;
  }
};

/**
 * Busca um check-in por ID
 */
export const getCheckinById = async (id) => {
  try {
    const checkin = await localDB.getCheckinById(id);
    
    if (!checkin) {
      throw new Error('Check-in não encontrado');
    }
    
    return {
      ...checkin,
      checkInDate: new Date(checkin.checkInDate),
      checkOutDate: checkin.checkOutDate ? new Date(checkin.checkOutDate) : null
    };
  } catch (error) {
    console.error('Erro ao buscar check-in:', error);
    throw error;
  }
};

/**
 * Realiza o checkout de um check-in
 */
export const checkoutCheckin = async (id, checkoutData, photoFiles = []) => {
  try {
    // Processar fotos de checkout se houver
    let checkoutPhotos = [];
    if (photoFiles.length > 0) {
      checkoutPhotos = await uploadPhotos(photoFiles, id);
    }
    
    const updatedCheckin = await localDB.checkoutCheckin(id, {
      ...checkoutData,
      checkoutPhotos
    });
    
    return {
      ...updatedCheckin,
      checkInDate: new Date(updatedCheckin.checkInDate),
      checkOutDate: new Date(updatedCheckin.checkOutDate)
    };
  } catch (error) {
    console.error('Erro ao fazer checkout:', error);
    throw error;
  }
};

/**
 * Cancela um check-in
 */
export const cancelCheckin = async () => {
  return true;
};

/**
 * Verifica se existe check-in ativo para uma placa
 */
export const checkDuplicatePlate = async (plate) => {
  try {
    return await localDB.checkDuplicatePlate(plate);
  } catch (error) {
    console.error('Erro ao verificar placa duplicada:', error);
    throw error;
  }
};

/**
 * Busca estatísticas de check-ins
 */
export const getCheckinStats = async () => {
  try {
    return await localDB.getCheckinStats();
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};

/**
 * Busca histórico de check-ins de um cliente
 */
export const getClientHistory = async (clientId) => {
  try {
    const history = await localDB.getClientHistory(clientId);
    
    return history.map(item => ({
      ...item,
      checkInDate: new Date(item.checkInDate),
      checkOutDate: item.checkOutDate ? new Date(item.checkOutDate) : null
    }));
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
};
