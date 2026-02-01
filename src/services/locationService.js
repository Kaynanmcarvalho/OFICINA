/**
 * Location Service
 * Gerencia geolocalização e reverse geocoding
 */

/**
 * Obtém localização atual do usuário
 * @returns {Promise<object>} Coordenadas {latitude, longitude}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada pelo navegador'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        reject(error);
      },
      { 
        timeout: 10000, 
        enableHighAccuracy: true,
        maximumAge: 0
      }

  });
};

/**
 * Converte coordenadas em endereço (reverse geocoding)
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<object>} Endereço {cidade, estado, pais}
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`,
      {
        headers: {
          'User-Agent': 'TorqApp/1.0'
        }
      }

    if (!response.ok) {
      throw new Error('Erro no reverse geocoding');
    }
    
    const data = await response.json();
    
    return {
      cidade: data.address?.city || 
              data.address?.town || 
              data.address?.village || 
              data.address?.municipality || 
              'Desconhecida',
      estado: data.address?.state || 'Desconhecido',
      pais: data.address?.country || 'Brasil',
      endereco: data.display_name
    };
  } catch (error) {
    console.error('Erro no reverse geocoding:', error);
    return { 
      cidade: 'Desconhecida', 
      estado: 'Desconhecido',
      pais: 'Brasil'
    };
  }
};

/**
 * Obtém localização completa (coordenadas + endereço)
 * @returns {Promise<object>} Localização completa
 */
export const getFullLocation = async () => {
  try {
    const coords = await getCurrentLocation();
    const address = await reverseGeocode(coords.latitude, coords.longitude);
    
    return {
      ...coords,
      ...address
    };
  } catch (error) {
    console.error('Erro ao obter localização completa:', error);
    throw error;
  }
};

/**
 * Formata localização para exibição
 * @param {object} location - Objeto de localização
 * @returns {string} String formatada
 */
export const formatLocation = (location) => {
  if (!location) return 'Localização não disponível';
  
  const parts = [];
  if (location.cidade) parts.push(location.cidade);
  if (location.estado) parts.push(location.estado);
  
  return parts.join(', ') || 'Localização não disponível';
};

export default {
  getCurrentLocation,
  reverseGeocode,
  getFullLocation,
  formatLocation
};
