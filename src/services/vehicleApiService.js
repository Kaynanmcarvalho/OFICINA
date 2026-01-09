/**
 * Vehicle API Service
 * Integração com API de consulta de placas - Backend Local (Puppeteer/Scraper)
 */

// URL da API Local de Placas (Puppeteer Scraper)
const PLATE_API_URL = import.meta.env.VITE_PLATE_API_URL || 'http://localhost:3001';

/**
 * Consulta dados do veículo pela placa
 * @param {string} plate - Placa do veículo (formato: ABC1234 ou ABC-1234)
 * @returns {Promise<Object>} Dados do veículo
 */
export const consultarPlaca = async (plate) => {
  try {
    // Remover caracteres especiais da placa
    const cleanPlate = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    if (!cleanPlate || cleanPlate.length < 7) {
      throw new Error('Placa inválida');
    }

    const apiUrl = `${PLATE_API_URL}/api/vehicles/plate/${cleanPlate}`;
    
    console.log('[VehicleAPI] 🔍 Consultando placa:', cleanPlate);
    console.log('[VehicleAPI] 🌐 URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('[VehicleAPI] 📡 Status HTTP:', response.status);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Veículo não encontrado na base de dados');
      }
      if (response.status === 408 || response.status === 504) {
        throw new Error('Tempo limite excedido. Tente novamente.');
      }
      throw new Error(`Erro na consulta: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('[VehicleAPI] ✅ Dados recebidos (raw):', JSON.stringify(responseData, null, 2));

    // Verifica se a resposta indica sucesso
    if (responseData.success === false) {
      console.log('[VehicleAPI] ⚠️ API retornou success: false');
      return {
        success: false,
        error: responseData.error || 'Veículo não encontrado'
      };
    }

    // A API pode retornar {success, data} ou diretamente os dados
    const vehicleData = responseData.data || responseData;
    console.log('[VehicleAPI] 📦 Dados do veículo extraídos:', JSON.stringify(vehicleData, null, 2));

    const normalized = normalizeVehicleData(cleanPlate, vehicleData);
    console.log('[VehicleAPI] 🔄 Dados normalizados:', JSON.stringify(normalized, null, 2));
    
    return normalized;

  } catch (error) {
    console.error('[VehicleAPI] ❌ Erro na consulta:', error);
    return {
      success: false,
      error: error.message || 'Erro ao consultar placa'
    };
  }
};

/**
 * Normaliza os dados do veículo para formato padrão
 */
function normalizeVehicleData(plate, data) {
  return {
    success: true,
    data: {
      plate: plate,
      brand: data.marca || data.brand || '',
      model: data.modelo || data.model || '',
      year: data.ano || data.year || '',
      color: data.cor || data.color || '',
      chassisNumber: data.chassi || data.chassis || data.chassisNumber || '',
      renavam: data.renavam || '',
      engineSize: data.cilindrada || data.engineSize || '',
      fuel: data.combustivel || data.fuel || '',
      category: data.categoria || data.category || '',
      owner: data.proprietario || data.owner || '',
      city: data.cidade || data.city || '',
      state: data.estado || data.state || '',
    }
  };
}

/**
 * Formata placa para o padrão brasileiro
 * @param {string} plate - Placa sem formatação
 * @returns {string} Placa formatada (ABC-1234 ou ABC1D23)
 */
export const formatPlate = (plate) => {
  const clean = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // Placa antiga: ABC-1234
  if (/^[A-Z]{3}\d{4}$/.test(clean)) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  
  // Placa Mercosul: ABC1D23
  if (/^[A-Z]{3}\d{1}[A-Z]{1}\d{2}$/.test(clean)) {
    return clean;
  }
  
  return clean;
};

/**
 * Valida formato de placa
 * @param {string} plate - Placa a ser validada
 * @returns {boolean} True se válida
 */
export const isValidPlate = (plate) => {
  const clean = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // Placa antiga: ABC1234
  const oldFormat = /^[A-Z]{3}\d{4}$/;
  
  // Placa Mercosul: ABC1D23
  const mercosulFormat = /^[A-Z]{3}\d{1}[A-Z]{1}\d{2}$/;
  
  return oldFormat.test(clean) || mercosulFormat.test(clean);
};

export default {
  consultarPlaca,
  formatPlate,
  isValidPlate
};


/**
 * Busca marcas de veículos
 * @returns {Promise<Array>} Lista de marcas
 */
export const fetchBrands = async () => {
  // Mock de marcas - substitua pela API real quando disponível
  return [
    'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'BMW', 'Ducati',
    'Harley-Davidson', 'Triumph', 'KTM', 'Aprilia', 'Volkswagen',
    'Fiat', 'Chevrolet', 'Ford', 'Toyota', 'Hyundai', 'Nissan',
    'Renault', 'Peugeot', 'Citroën', 'Jeep', 'Mitsubishi'
  ];
};

/**
 * Busca modelos de uma marca específica
 * @param {string} brand - Marca do veículo
 * @returns {Promise<Array>} Lista de modelos
 */
export const fetchModels = async (brand) => {
  // Mock de modelos - substitua pela API real quando disponível
  const models = {
    'Honda': ['CB 600F Hornet', 'CB 500', 'CG 160', 'Civic', 'City', 'HR-V'],
    'Yamaha': ['MT-07', 'MT-09', 'Fazer 250', 'YBR 125'],
    'Volkswagen': ['Gol', 'Polo', 'Virtus', 'T-Cross', 'Tiguan'],
    'Fiat': ['Argo', 'Cronos', 'Mobi', 'Toro', 'Strada'],
    'Chevrolet': ['Onix', 'Tracker', 'S10', 'Spin'],
    'Toyota': ['Corolla', 'Hilux', 'SW4', 'Yaris'],
  };
  
  return models[brand] || [];
};

/**
 * Busca veículo por placa
 * @param {string} plate - Placa do veículo
 * @returns {Promise<Object>} Dados do veículo
 */
export const searchVehicleByPlate = async (plate) => {
  return consultarPlaca(plate);
};

/**
 * Obtém o tipo de veículo para API
 * @param {string} type - Tipo do veículo
 * @returns {string} Tipo formatado para API
 */
export const getVehicleTypeForApi = (type) => {
  const types = {
    'motorcycle': 'moto',
    'car': 'carro',
    'truck': 'caminhao',
    'van': 'van'
  };
  return types[type] || 'carro';
};
