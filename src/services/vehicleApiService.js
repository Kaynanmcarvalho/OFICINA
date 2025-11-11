/**
 * Vehicle API Service
 * Integração com API de consulta de placas
 */

const API_BASE_URL = 'https://torq.up.railway.app';

// Mock de dados para teste (remover quando API estiver funcionando)
const MOCK_DATA = {
  'ECO4087': {
    marca: 'Honda',
    modelo: 'CB 600F Hornet',
    ano: '2023',
    cor: 'Vermelha',
    chassi: '9C2JC50001R000001',
    renavam: '12345678901',
    cilindrada: '600',
    combustivel: 'Gasolina',
    categoria: 'Motocicleta',
  },
  'ABC1234': {
    marca: 'Yamaha',
    modelo: 'MT-07',
    ano: '2022',
    cor: 'Azul',
    chassi: '9C6KE1110NR000001',
    renavam: '98765432109',
    cilindrada: '689',
    combustivel: 'Gasolina',
    categoria: 'Motocicleta',
  }
};

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

    console.log('[VehicleAPI] Consultando placa:', cleanPlate);

    // MODO MOCK: Verificar se existe nos dados de teste
    if (MOCK_DATA[cleanPlate]) {
      console.log('[VehicleAPI] 🎭 MODO MOCK - Usando dados de teste');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay da API
      
      const mockData = MOCK_DATA[cleanPlate];
      console.log('[VehicleAPI] Dados mock:', mockData);
      
      return {
        success: true,
        data: {
          plate: cleanPlate,
          brand: mockData.marca || '',
          model: mockData.modelo || '',
          year: mockData.ano || '',
          color: mockData.cor || '',
          chassisNumber: mockData.chassi || '',
          renavam: mockData.renavam || '',
          engineSize: mockData.cilindrada || '',
          fuel: mockData.combustivel || '',
          category: mockData.categoria || '',
        }
      };
    }

    // Tentar API real
    console.log('[VehicleAPI] Tentando API real...');
    const response = await fetch(`${API_BASE_URL}/api/vehicle/${cleanPlate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Veículo não encontrado na base de dados');
      }
      throw new Error(`Erro na consulta: ${response.status}`);
    }

    const data = await response.json();
    console.log('[VehicleAPI] Dados recebidos da API:', data);

    return {
      success: true,
      data: {
        plate: cleanPlate,
        brand: data.marca || data.brand || '',
        model: data.modelo || data.model || '',
        year: data.ano || data.year || '',
        color: data.cor || data.color || '',
        chassisNumber: data.chassi || data.chassis || data.chassisNumber || '',
        renavam: data.renavam || '',
        engineSize: data.cilindrada || data.engineSize || '',
        // Campos adicionais que a API pode retornar
        fuel: data.combustivel || data.fuel || '',
        category: data.categoria || data.category || '',
        owner: data.proprietario || data.owner || '',
        city: data.cidade || data.city || '',
        state: data.estado || data.state || '',
      }
    };
  } catch (error) {
    console.error('[VehicleAPI] Erro na consulta:', error);
    return {
      success: false,
      error: error.message || 'Erro ao consultar placa'
    };
  }
};

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
