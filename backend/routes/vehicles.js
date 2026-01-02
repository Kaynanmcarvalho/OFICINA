const express = require('express');
const router = express.Router();
const axios = require('axios');
const { scrapeKeplaca } = require('../services/keplacaScraper');

/**
 * GET /api/vehicles/plate/:plate
 * Consulta dados do veículo pela placa usando APENAS Keplaca.com com Puppeteer
 */
router.get('/plate/:plate', async (req, res) => {
    try {
        const { plate } = req.params;
        const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();

        if (cleanPlate.length !== 7) {
            return res.status(400).json({
                success: false,
                error: 'Placa inválida. Use o formato ABC1234 ou ABC1D23'
            });
        }

        console.log(`[VEHICLE API] 🔍 Consultando placa: ${cleanPlate}`);

        // Keplaca.com com Puppeteer
        const result = await scrapeKeplaca(cleanPlate);
        
        if (result.success) {
            console.log('[VEHICLE API] ✅ Keplaca - SUCESSO!');
            return res.json(result);
        } else {
            console.log('[VEHICLE API] ⚠️  Keplaca - Placa não encontrada');
            return res.json({
                success: false,
                error: result.error || 'Placa não encontrada',
                details: 'Não foi possível obter os dados do veículo. Você pode preencher manualmente.',
                suggestions: [
                    'Verifique se digitou a placa corretamente',
                    'Tente novamente em alguns segundos',
                    'Preencha os dados manualmente'
                ]
            });
        }

    } catch (error) {
        console.error('[VEHICLE API] 💥 Erro geral:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao consultar placa: ' + error.message
        });
    }
});

/**
 * GET /api/vehicles/brands/:type
 * Busca marcas de veículos da FIPE
 */
router.get('/brands/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const vehicleType = getVehicleTypeForApi(type);

        console.log(`[VEHICLE API] 🏷️  Buscando marcas de ${vehicleType}...`);

        const response = await axios.get(
            `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas`,
            { timeout: 10000 }
        );

        const brands = response.data.map(brand => ({
            value: brand.codigo,
            label: brand.nome
        }));

        console.log(`[VEHICLE API] ✅ ${brands.length} marcas encontradas`);

        res.json({
            success: true,
            data: brands
        });

    } catch (error) {
        console.error('[VEHICLE API] ❌ Erro ao buscar marcas:', error.message);
        
        // Retorna marcas populares como fallback
        res.json({
            success: true,
            data: getFallbackBrands(req.params.type)
        });
    }
});

/**
 * GET /api/vehicles/models/:type/:brandCode
 * Busca modelos de uma marca específica
 */
router.get('/models/:type/:brandCode', async (req, res) => {
    try {
        const { type, brandCode } = req.params;
        const vehicleType = getVehicleTypeForApi(type);

        console.log(`[VEHICLE API] 🏍️  Buscando modelos de ${vehicleType}/${brandCode}...`);

        const response = await axios.get(
            `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos`,
            { timeout: 10000 }
        );

        const models = response.data.modelos.map(model => ({
            value: model.codigo,
            label: model.nome
        }));

        console.log(`[VEHICLE API] ✅ ${models.length} modelos encontrados`);

        res.json({
            success: true,
            data: models
        });

    } catch (error) {
        console.error('[VEHICLE API] ❌ Erro ao buscar modelos:', error.message);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar modelos'
        });
    }
});

/**
 * GET /api/vehicles/years/:type/:brandCode/:modelCode
 * Busca anos de um modelo específico
 */
router.get('/years/:type/:brandCode/:modelCode', async (req, res) => {
    try {
        const { type, brandCode, modelCode } = req.params;
        const vehicleType = getVehicleTypeForApi(type);

        console.log(`[VEHICLE API] 📅 Buscando anos de ${vehicleType}/${brandCode}/${modelCode}...`);

        const response = await axios.get(
            `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos/${modelCode}/anos`,
            { timeout: 10000 }
        );

        const years = response.data.map(year => ({
            value: year.codigo,
            label: year.nome
        }));

        console.log(`[VEHICLE API] ✅ ${years.length} anos encontrados`);

        res.json({
            success: true,
            data: years
        });

    } catch (error) {
        console.error('[VEHICLE API] ❌ Erro ao buscar anos:', error.message);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar anos'
        });
    }
});

// Funções auxiliares
function getVehicleTypeForApi(type) {
    const types = { 'moto': 'motos', 'carro': 'carros', 'caminhao': 'caminhoes' };
    return types[type] || 'motos';
}

function getFallbackBrands(type) {
    const brands = {
        moto: [
            { value: '104', label: 'Honda' },
            { value: '107', label: 'Yamaha' },
            { value: '127', label: 'Suzuki' },
            { value: '116', label: 'Kawasaki' },
            { value: '101', label: 'BMW' },
            { value: '103', label: 'Ducati' },
            { value: '105', label: 'Harley-Davidson' },
            { value: '133', label: 'Triumph' },
            { value: '117', label: 'KTM' }
        ],
        carro: [
            { value: '21', label: 'Chevrolet' },
            { value: '59', label: 'Volkswagen' },
            { value: '21', label: 'Fiat' },
            { value: '22', label: 'Ford' },
            { value: '56', label: 'Toyota' },
            { value: '26', label: 'Honda' },
            { value: '27', label: 'Hyundai' },
            { value: '38', label: 'Nissan' },
            { value: '44', label: 'Renault' },
            { value: '28', label: 'Jeep' }
        ],
        caminhao: [
            { value: '34', label: 'Mercedes-Benz' },
            { value: '59', label: 'Volkswagen' },
            { value: '48', label: 'Scania' },
            { value: '58', label: 'Volvo' },
            { value: '29', label: 'Iveco' },
            { value: '22', label: 'Ford' }
        ]
    };
    return brands[type] || brands.carro;
}

module.exports = router;
