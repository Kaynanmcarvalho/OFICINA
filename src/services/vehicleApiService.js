import { getVehicleFromCache, saveVehicleToCache, incrementCacheHit } from './vehicleCacheService';
import { correctVehicleType } from './vehicleTypeDetector';

// URL do backend (já inclui /api no .env)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://torq.up.railway.app/api';

// Endpoints (sem /api pois já está no API_BASE_URL)
// Baseado na documentação: /api/vehicles/plate/:plate
const ENDPOINTS = {
    searchPlate: '/vehicles/plate',
    brands: '/vehicles/brands',
    models: '/vehicles/models',
    years: '/vehicles/years'
};

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

        const apiUrl = `${API_BASE_URL}${ENDPOINTS.searchPlate}/${cleanPlate}`;
        console.log(`[VEHICLE API] 🌐 URL da requisição:`, apiUrl);

        try {
            const response = await fetch(apiUrl, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            clearTimeout(timeoutId);

            // Verifica status da resposta primeiro
            if (!response.ok) {
                console.error('[VEHICLE API] ❌ Erro HTTP:', response.status);
                return {
                    success: false,
                    error: `Erro ao consultar placa (${response.status}). Preencha manualmente.`,
                    fallbackToManual: true
                };
            }

            // Verifica se a resposta é JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('[VEHICLE API] ❌ Resposta não é JSON:', contentType);
                console.error('[VEHICLE API] Status:', response.status, response.statusText);
                console.error('[VEHICLE API] URL:', apiUrl);
                
                // Tenta ler o corpo da resposta para debug
                try {
                    const text = await response.text();
                    console.error('[VEHICLE API] Corpo da resposta (primeiros 200 chars):', text.substring(0, 200));
                } catch (readError) {
                    console.error('[VEHICLE API] Não foi possível ler o corpo da resposta:', readError.message);
                }
                
                return {
                    success: false,
                    error: 'Serviço de consulta de placas indisponível. Preencha os dados manualmente.',
                    fallbackToManual: true
                };
            }

            // Tenta fazer parse do JSON com tratamento de erro
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error('[VEHICLE API] ❌ Erro ao fazer parse do JSON:', jsonError);
                return {
                    success: false,
                    error: 'Erro ao processar resposta. Preencha os dados manualmente.',
                    fallbackToManual: true
                };
            }

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
                    error: 'Tempo esgotado ao consultar placa. Preencha manualmente.',
                    fallbackToManual: true
                };
            }
            // Erro de rede ou outro erro não tratado
            console.error('[VEHICLE API] ❌ Erro de rede:', fetchError);
            return {
                success: false,
                error: 'Erro de conexão. Preencha os dados manualmente.',
                fallbackToManual: true
            };
        }

    } catch (error) {
        console.error('[VEHICLE API] ❌ Erro ao buscar veículo:', error);
        return {
            success: false,
            error: 'Serviço de consulta indisponível no momento. Preencha manualmente.',
            fallbackToManual: true
        };
    }
};

/**
 * Busca marcas de veículos através do backend
 */
export const fetchBrands = async (vehicleType = 'motos') => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.brands}/${vehicleType}`);
        
        // Verifica se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('[VEHICLE API] ❌ Resposta não é JSON ao buscar marcas');
            return {
                success: false,
                error: 'Serviço temporariamente indisponível'
            };
        }
        
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
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.models}/${vehicleType}/${brandCode}`);
        
        // Verifica se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('[VEHICLE API] ❌ Resposta não é JSON ao buscar modelos');
            return {
                success: false,
                error: 'Serviço temporariamente indisponível'
            };
        }
        
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
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.years}/${vehicleType}/${brandCode}/${modelCode}`);
        
        // Verifica se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('[VEHICLE API] ❌ Resposta não é JSON ao buscar anos');
            return {
                success: false,
                error: 'Serviço temporariamente indisponível'
            };
        }
        
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
