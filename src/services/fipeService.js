/**
 * FIPE Service - API Pública Gratuita
 * Fonte: https://parallelum.com.br/fipe/api/v1/
 */

const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

const VEHICLE_TYPES = {
  CARRO: 'carros',
  MOTO: 'motos',
  CAMINHAO: 'caminhoes'
};

/**
 * Busca todas as marcas de um tipo de veículo
 * @param {string} tipo - 'carros', 'motos' ou 'caminhoes'
 */
export const fetchBrands = async (tipo) => {
  try {
    const response = await fetch(`${FIPE_BASE_URL}/${tipo}/marcas`);
    if (!response.ok) throw new Error('Erro ao buscar marcas');
    return await response.json();
  } catch (error) {
    console.error('[FIPE] Erro ao buscar marcas:', error);
    throw error;
  }
};

/**
 * Busca todos os modelos de uma marca
 * @param {string} tipo - 'carros', 'motos' ou 'caminhoes'
 * @param {string} brandId - ID da marca
 */
export const fetchModels = async (tipo, brandId) => {
  try {
    const response = await fetch(`${FIPE_BASE_URL}/${tipo}/marcas/${brandId}/modelos`);
    if (!response.ok) throw new Error('Erro ao buscar modelos');
    const data = await response.json();
    return data.modelos || [];
  } catch (error) {
    console.error('[FIPE] Erro ao buscar modelos:', error);
    throw error;
  }
};

/**
 * Busca todos os anos de um modelo
 * @param {string} tipo - 'carros', 'motos' ou 'caminhoes'
 * @param {string} brandId - ID da marca
 * @param {string} modelId - ID do modelo
 */
export const fetchYears = async (tipo, brandId, modelId) => {
  try {
    const response = await fetch(
      `${FIPE_BASE_URL}/${tipo}/marcas/${brandId}/modelos/${modelId}/anos`
    );
    if (!response.ok) throw new Error('Erro ao buscar anos');
    return await response.json();
  } catch (error) {
    console.error('[FIPE] Erro ao buscar anos:', error);
    throw error;
  }
};

/**
 * Busca detalhes completos de um veículo
 * @param {string} tipo - 'carros', 'motos' ou 'caminhoes'
 * @param {string} brandId - ID da marca
 * @param {string} modelId - ID do modelo
 * @param {string} yearCode - Código do ano
 */
export const fetchVehicleDetails = async (tipo, brandId, modelId, yearCode) => {
  try {
    const response = await fetch(
      `${FIPE_BASE_URL}/${tipo}/marcas/${brandId}/modelos/${modelId}/anos/${yearCode}`
    );
    if (!response.ok) throw new Error('Erro ao buscar detalhes');
    return await response.json();
  } catch (error) {
    console.error('[FIPE] Erro ao buscar detalhes:', error);
    throw error;
  }
};

export { VEHICLE_TYPES };
