/**
 * Serviço para buscar imagens de veículos da API
 * Conecta com o backend de imagens (backend/)
 */

// URL do backend de imagens - usar variável de ambiente ou fallback
const API_BASE_URL = import.meta.env.VITE_VEHICLE_IMAGE_API_URL || 
                     'https://torq.up.railway.app/api/vehicle-images';

// Flag para desenvolvimento
const isDevelopment = import.meta.env.DEV;
let apiDisabled = false;
let lastError = null;

/**
 * Busca imagem do veículo na API
 * @param {string} vehicleName - Nome completo do veículo (ex: "Yamaha R3 2016 vermelha")
 * @returns {Promise<Object>} Dados da imagem ou null se não encontrar
 */
export const searchVehicleImage = async (vehicleName) => {
  if (!vehicleName || vehicleName.trim().length === 0) {
    return null;
  }

  // Se API foi desabilitada devido a problemas, retorna null
  if (apiDisabled) {
    console.warn('[VehicleImageService] API desabilitada temporariamente');
    return null;
  }

  try {
    const encodedName = encodeURIComponent(vehicleName.trim());
    const url = `${API_BASE_URL}/search?name=${encodedName}`;
    
    console.log('[VehicleImageService] Buscando imagem:', vehicleName);
    console.log('[VehicleImageService] URL:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[VehicleImageService] API retornou ${response.status} para: ${vehicleName}`);
      return null;
    }

    const result = await response.json();

    if (result.success && result.data?.imageUrl) {
      console.log('[VehicleImageService] ✅ Imagem encontrada:', result.data.source);
      return {
        imageUrl: result.data.imageUrl,
        originalName: result.data.originalName || vehicleName,
        normalizedName: result.data.normalizedName,
        vehicleType: result.data.vehicleType,
        year: result.data.year,
        allImages: result.data.allImages || [],
        source: result.data.source || 'api',
        cached: result.data.cached || false
      };
    }

    console.warn('[VehicleImageService] Nenhuma imagem encontrada para:', vehicleName);
    return null;

  } catch (error) {
    lastError = error;

    if (error.name === 'AbortError') {
      console.warn('[VehicleImageService] Timeout na busca de imagem');
      return null;
    }

    // Se for erro de CORS ou rede, desabilita API temporariamente
    if (error.name === 'TypeError' || error.message?.includes('fetch') || error.message?.includes('network')) {
      console.warn(`[VehicleImageService] API indisponível - desabilitando por 2 minutos`);
      apiDisabled = true;
      
      // Reabilita após 2 minutos
      setTimeout(() => {
        apiDisabled = false;
        console.info('[VehicleImageService] API reabilitada para tentativas');
      }, 2 * 60 * 1000);
    } else {
      console.error('[VehicleImageService] Erro ao buscar imagem:', error.message);
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
  if (vehicle.brand || vehicle.marca) {
    parts.push(vehicle.brand || vehicle.marca);
  }

  // Adiciona modelo
  if (vehicle.model || vehicle.modelo) {
    parts.push(vehicle.model || vehicle.modelo);
  }

  // Adiciona ano
  if (vehicle.year || vehicle.ano) {
    parts.push(vehicle.year || vehicle.ano);
  }

  // Adiciona cor se disponível (ajuda na busca)
  if (vehicle.color || vehicle.cor) {
    parts.push(vehicle.color || vehicle.cor);
  }

  return parts.join(' ').trim();
};

/**
 * Cache em memória para evitar requisições desnecessárias
 */
const imageCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora

/**
 * Busca imagem com cache
 * @param {string} vehicleName - Nome do veículo
 * @returns {Promise<Object>} Dados da imagem
 */
export const searchVehicleImageCached = async (vehicleName) => {
  if (!vehicleName) return null;
  
  const cacheKey = vehicleName.toLowerCase().trim();

  // Verifica cache
  if (imageCache.has(cacheKey)) {
    const cached = imageCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[VehicleImageService] Cache hit:', cacheKey);
      return { ...cached.data, cached: true };
    }
    imageCache.delete(cacheKey);
  }

  // Busca na API
  const result = await searchVehicleImage(vehicleName);

  // Salva no cache (mesmo se null, para evitar requisições repetidas)
  if (result) {
    imageCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
  }

  return result;
};

/**
 * Busca imagens em lote
 * @param {Array<string>} vehicleNames - Lista de nomes de veículos
 * @returns {Promise<Object>} Mapa de nome -> imagem
 */
export const searchVehicleImagesBatch = async (vehicleNames) => {
  if (!vehicleNames || vehicleNames.length === 0) return {};

  const results = {};
  
  // Primeiro verifica cache
  const uncached = [];
  for (const name of vehicleNames) {
    const cacheKey = name.toLowerCase().trim();
    if (imageCache.has(cacheKey)) {
      const cached = imageCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        results[name] = { ...cached.data, cached: true };
        continue;
      }
    }
    uncached.push(name);
  }

  // Busca os não cacheados em paralelo (máximo 3 por vez)
  const batchSize = 3;
  for (let i = 0; i < uncached.length; i += batchSize) {
    const batch = uncached.slice(i, i + batchSize);
    const promises = batch.map(name => searchVehicleImage(name).then(result => ({ name, result })));
    const batchResults = await Promise.all(promises);
    
    for (const { name, result } of batchResults) {
      results[name] = result;
      if (result) {
        imageCache.set(name.toLowerCase().trim(), {
          data: result,
          timestamp: Date.now()
        });
      }
    }
  }

  return results;
};

/**
 * Limpa o cache de imagens
 */
export const clearImageCache = () => {
  imageCache.clear();
  console.info('[VehicleImageService] Cache limpo');
};

/**
 * Obtém estatísticas do cache
 */
export const getCacheStats = () => {
  return {
    size: imageCache.size,
    keys: Array.from(imageCache.keys()),
    apiDisabled,
    lastError: lastError?.message,
    apiUrl: API_BASE_URL
  };
};

/**
 * Reabilita a API manualmente
 */
export const enableAPI = () => {
  apiDisabled = false;
  lastError = null;
  console.info('[VehicleImageService] API reabilitada manualmente');
};

/**
 * Desabilita a API manualmente
 */
export const disableAPI = () => {
  apiDisabled = true;
  console.info('[VehicleImageService] API desabilitada manualmente');
};

/**
 * Verifica se a API está disponível
 */
export const checkAPIHealth = async () => {
  try {
    const healthUrl = API_BASE_URL.replace('/api/vehicle-images', '/health');
    const response = await fetch(healthUrl, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
};

export default {
  searchVehicleImage,
  searchVehicleImageCached,
  searchVehicleImagesBatch,
  buildVehicleName,
  clearImageCache,
  getCacheStats,
  enableAPI,
  disableAPI,
  checkAPIHealth
};
