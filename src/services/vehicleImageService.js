/**
 * Serviço para buscar imagens de veículos da API
 */

const API_BASE_URL = 'https://torq.up.railway.app/api/vehicle-images';

// Flag para desenvolvimento - desabilita API quando há problemas de CORS
const isDevelopment = import.meta.env.DEV;
let apiDisabled = false;

/**
 * Busca imagem do veículo na API
 * @param {string} vehicleName - Nome completo do veículo (ex: "Yamaha R3 2016/2017 vermelha ABS")
 * @returns {Promise<Object>} Dados da imagem ou null se não encontrar
 */
export const searchVehicleImage = async (vehicleName) => {
  if (!vehicleName || vehicleName.trim().length === 0) {
    return null;
  }

  // Se API foi desabilitada devido a problemas de CORS, retorna null
  if (apiDisabled) {
    return null;
  }

  try {
    const encodedName = encodeURIComponent(vehicleName.trim());
    const response = await fetch(`${API_BASE_URL}/search?name=${encodedName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors', // Explicitamente definir modo CORS
    });

    if (!response.ok) {
      console.warn(`[VehicleImageService] API retornou ${response.status} para: ${vehicleName}`);
      return null;
    }

    const data = await response.json();

    if (data && data.imageUrl) {
      return {
        imageUrl: data.imageUrl,
        originalName: data.originalName || vehicleName,
        normalizedName: data.normalizedName,
        vehicleType: data.vehicleType,
        year: data.year,
        allImages: data.allImages || [],
        source: data.source || 'api',
        cached: data.cached || false
      };
    }

    return null;
  } catch (error) {
    // Se for erro de CORS ou rede, desabilita API temporariamente
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.warn(`[VehicleImageService] API indisponível (CORS/Network) - desabilitando temporariamente`);
      if (isDevelopment) {
        apiDisabled = true;
        // Reabilita após 5 minutos
        setTimeout(() => {
          apiDisabled = false;
          console.info('[VehicleImageService] API reabilitada para tentativas');
        }, 5 * 60 * 1000);
      }
    } else {
      console.error('[VehicleImageService] Erro ao buscar imagem:', error);
    }
    return null;
  }
};

/**
 * Constrói nome do veículo para busca na API
 * @param {Object} vehicle - Dados do veículo
 * @returns {string} Nome formatado para busca
 */
export const buildVehicleName = (vehicle) => {
  if (!vehicle) return '';

  const parts = [];

  // Adiciona marca
  if (vehicle.brand) {
    parts.push(vehicle.brand);
  }

  // Adiciona modelo
  if (vehicle.model) {
    parts.push(vehicle.model);
  }

  // Adiciona ano
  if (vehicle.year) {
    parts.push(vehicle.year);
  }

  // Adiciona cor se disponível
  if (vehicle.color) {
    parts.push(vehicle.color);
  }

  return parts.join(' ').trim();
};

/**
 * Cache simples em memória para evitar requisições desnecessárias
 */
const imageCache = new Map();

/**
 * Busca imagem com cache
 * @param {string} vehicleName - Nome do veículo
 * @returns {Promise<Object>} Dados da imagem
 */
export const searchVehicleImageCached = async (vehicleName) => {
  const cacheKey = vehicleName.toLowerCase().trim();

  // Verifica cache
  if (imageCache.has(cacheKey)) {
    const cached = imageCache.get(cacheKey);
    // Cache válido por 1 hora
    if (Date.now() - cached.timestamp < 60 * 60 * 1000) {
      return cached.data;
    }
    // Remove cache expirado
    imageCache.delete(cacheKey);
  }

  // Busca na API
  const result = await searchVehicleImage(vehicleName);

  // Salva no cache
  imageCache.set(cacheKey, {
    data: result,
    timestamp: Date.now()
  });

  return result;
};

/**
 * Limpa o cache de imagens
 */
export const clearImageCache = () => {
  imageCache.clear();
};

/**
 * Obtém estatísticas do cache
 */
export const getCacheStats = () => {
  return {
    size: imageCache.size,
    keys: Array.from(imageCache.keys()),
    apiDisabled
  };
};

/**
 * Reabilita a API manualmente
 */
export const enableAPI = () => {
  apiDisabled = false;
  console.info('[VehicleImageService] API reabilitada manualmente');
};

/**
 * Desabilita a API manualmente
 */
export const disableAPI = () => {
  apiDisabled = true;
  console.info('[VehicleImageService] API desabilitada manualmente');
};