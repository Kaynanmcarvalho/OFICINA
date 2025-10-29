import { getVehicleFromCache, saveVehicleToCache, incrementCacheHit } from './vehicleCacheService';
import { correctVehicleType } from './vehicleTypeDetector';

// URL do backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://torq.up.railway.app/api';

/**
 * Busca informações do veículo pela placa
 * 1. Primeiro tenta buscar no cache do Firebase (instantâneo)
 * 2. Se não encontrar, faz scraping e salva no cache
 */
export const searchVehicleByPlate = async (plate) => {
    try {
        const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();

        if (cleanPlate.length !== 7) {
            return {
                success: false,
                error: 'Placa inválida. Use o formato ABC1234 ou ABC1D23'
            };
        }

        console.log(`[VEHICLE API] 🔍 Buscando placa: ${cleanPlate}`);

        // 1. Tenta buscar no cache primeiro (RÁPIDO - < 1s)
        console.log(`[VEHICLE API] 📦 Verificando cache...`);
        const cachedData = await getVehicleFromCache(cleanPlate);

        if (cachedData && cachedData.success) {
            console.log(`[VEHICLE API] ✅ Cache HIT! Retornando dados instantaneamente`);

            // Corrige o tipo do veículo se necessário
            const correctedData = {
                ...cachedData,
                data: correctVehicleType(cachedData.data)
            };

            // Incrementa contador de hits em background
            incrementCacheHit(cleanPlate).catch(err =>
                console.error('Erro ao incrementar hit:', err)
            );

            return correctedData;
        }

        // 2. Não encontrou no cache, faz scraping
        console.log(`[VEHICLE API] ❌ Cache MISS. Iniciando scraping...`);

        // Cria AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 segundos

        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/plate/${cleanPlate}`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();

            if (data.success && data.data) {
                // Corrige o tipo do veículo antes de salvar
                const correctedData = correctVehicleType(data.data);

                // Salva no cache para próximas consultas
                console.log(`[VEHICLE API] 💾 Salvando no cache para futuras consultas...`);
                await saveVehicleToCache(cleanPlate, correctedData);
                console.log(`[VEHICLE API] ✅ Dados salvos no cache com sucesso!`);

                // Retorna dados corrigidos
                return {
                    ...data,
                    data: correctedData
                };
            }

            return data;
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                console.error('[VEHICLE API] ⏱️ Timeout ao consultar placa');
                return {
                    success: false,
                    error: 'Tempo esgotado ao consultar placa'
                };
            }
            throw fetchError;
        }

    } catch (error) {
        console.error('[VEHICLE API] ❌ Erro ao buscar veículo:', error);
        return {
            success: false,
            error: 'Erro ao consultar placa. Verifique se o backend está rodando.'
        };
    }
};

/**
 * Busca marcas de veículos através do backend
 */
export const fetchBrands = async (vehicleType = 'motos') => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/brands/${vehicleType}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar marcas:', error);
        return {
            success: false,
            error: 'Erro ao buscar marcas'
        };
    }
};

/**
 * Busca modelos de uma marca específica através do backend
 */
export const fetchModels = async (vehicleType, brandCode) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/models/${vehicleType}/${brandCode}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar modelos:', error);
        return {
            success: false,
            error: 'Erro ao buscar modelos'
        };
    }
};

/**
 * Busca anos de um modelo específico através do backend
 */
export const fetchYears = async (vehicleType, brandCode, modelCode) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vehicles/years/${vehicleType}/${brandCode}/${modelCode}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar anos:', error);
        return {
            success: false,
            error: 'Erro ao buscar anos'
        };
    }
};

/**
 * Converte tipo de veículo para formato da API
 */
export const getVehicleTypeForApi = (type) => {
    const types = {
        'moto': 'moto',
        'carro': 'carro',
        'caminhao': 'caminhao'
    };
    return types[type] || 'moto';
};
