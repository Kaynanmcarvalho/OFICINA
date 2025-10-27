// API 1: FIPE Parallelum (Principal)
const FIPE_API_BASE = 'https://parallelum.com.br/fipe/api/v1';

// API 2: Brasil API (Fallback)
const BRASIL_API_BASE = 'https://brasilapi.com.br/api/fipe';

// API 3: Placa Fipe (Busca por placa)
const PLACA_FIPE_BASE = 'https://wdapi2.com.br/consulta';

/**
 * Busca informações do veículo pela placa
 */
export const searchVehicleByPlate = async (plate) => {
    try {
        // Remove caracteres especiais da placa
        const cleanPlate = plate.replace(/[^A-Z0-9]/g, '');
        
        // Tenta API de consulta de placa (requer token - usar mock para desenvolvimento)
        // Em produção, você precisará de uma API key válida
        
        // Mock de resposta para desenvolvimento
        // TODO: Integrar com API real de consulta de placas
        const mockResponse = {
            placa: cleanPlate,
            marca: 'Honda',
            modelo: 'CB 600F Hornet',
            ano: '2023',
            cor: 'Vermelha',
            tipo: 'moto'
        };
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            data: mockResponse
        };
    } catch (error) {
        console.error('Erro ao buscar veículo por placa:', error);
        return {
            success: false,
            error: 'Não foi possível consultar a placa'
        };
    }
};

/**
 * Busca marcas de veículos
 */
export const fetchBrands = async (vehicleType = 'motos') => {
    try {
        // Tenta API principal (FIPE Parallelum)
        const response = await fetch(`${FIPE_API_BASE}/${vehicleType}/marcas`);
        
        if (!response.ok) throw new Error('Erro na API principal');
        
        const data = await response.json();
        return {
            success: true,
            data: data.map(brand => ({
                value: brand.codigo,
                label: brand.nome
            }))
        };
    } catch (error) {
        console.error('Erro ao buscar marcas:', error);
        
        // Fallback: retorna lista estática de marcas populares
        return {
            success: true,
            data: getFallbackBrands(vehicleType)
        };
    }
};

/**
 * Busca modelos de uma marca específica
 */
export const fetchModels = async (vehicleType, brandCode) => {
    try {
        const response = await fetch(`${FIPE_API_BASE}/${vehicleType}/marcas/${brandCode}/modelos`);
        
        if (!response.ok) throw new Error('Erro na API');
        
        const data = await response.json();
        return {
            success: true,
            data: data.modelos.map(model => ({
                value: model.codigo,
                label: model.nome
            }))
        };
    } catch (error) {
        console.error('Erro ao buscar modelos:', error);
        return {
            success: false,
            error: 'Não foi possível carregar os modelos'
        };
    }
};

/**
 * Busca anos de um modelo específico
 */
export const fetchYears = async (vehicleType, brandCode, modelCode) => {
    try {
        const response = await fetch(`${FIPE_API_BASE}/${vehicleType}/marcas/${brandCode}/modelos/${modelCode}/anos`);
        
        if (!response.ok) throw new Error('Erro na API');
        
        const data = await response.json();
        return {
            success: true,
            data: data.map(year => ({
                value: year.codigo,
                label: year.nome
            }))
        };
    } catch (error) {
        console.error('Erro ao buscar anos:', error);
        return {
            success: false,
            error: 'Não foi possível carregar os anos'
        };
    }
};

/**
 * Busca detalhes completos do veículo
 */
export const fetchVehicleDetails = async (vehicleType, brandCode, modelCode, yearCode) => {
    try {
        const response = await fetch(`${FIPE_API_BASE}/${vehicleType}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`);
        
        if (!response.ok) throw new Error('Erro na API');
        
        const data = await response.json();
        return {
            success: true,
            data: {
                brand: data.Marca,
                model: data.Modelo,
                year: data.AnoModelo,
                fuel: data.Combustivel,
                fipeCode: data.CodigoFipe,
                referenceMonth: data.MesReferencia,
                value: data.Valor
            }
        };
    } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        return {
            success: false,
            error: 'Não foi possível carregar os detalhes'
        };
    }
};

/**
 * Marcas populares como fallback
 */
const getFallbackBrands = (vehicleType) => {
    const brands = {
        motos: [
            { value: '1', label: 'Honda' },
            { value: '2', label: 'Yamaha' },
            { value: '3', label: 'Suzuki' },
            { value: '4', label: 'Kawasaki' },
            { value: '5', label: 'BMW' },
            { value: '6', label: 'Ducati' },
            { value: '7', label: 'Harley-Davidson' },
            { value: '8', label: 'Triumph' },
            { value: '9', label: 'KTM' },
            { value: '10', label: 'Royal Enfield' }
        ],
        carros: [
            { value: '1', label: 'Chevrolet' },
            { value: '2', label: 'Volkswagen' },
            { value: '3', label: 'Fiat' },
            { value: '4', label: 'Ford' },
            { value: '5', label: 'Toyota' },
            { value: '6', label: 'Honda' },
            { value: '7', label: 'Hyundai' },
            { value: '8', label: 'Nissan' },
            { value: '9', label: 'Renault' },
            { value: '10', label: 'Jeep' }
        ],
        caminhoes: [
            { value: '1', label: 'Mercedes-Benz' },
            { value: '2', label: 'Volkswagen' },
            { value: '3', label: 'Scania' },
            { value: '4', label: 'Volvo' },
            { value: '5', label: 'Iveco' },
            { value: '6', label: 'Ford' },
            { value: '7', label: 'DAF' },
            { value: '8', label: 'MAN' }
        ]
    };
    
    return brands[vehicleType] || brands.motos;
};

/**
 * Converte tipo de veículo para formato da API
 */
export const getVehicleTypeForApi = (type) => {
    const types = {
        'moto': 'motos',
        'carro': 'carros',
        'caminhao': 'caminhoes'
    };
    return types[type] || 'motos';
};
