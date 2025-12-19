/**
 * ROTAS DE COMPATIBILIDADE DE PEÇAS V2
 * API REST avançada para busca de peças compatíveis
 * 
 * @version 2.0.0
 */

const express = require('express');
const router = express.Router();

// Importação dinâmica do engine (ES Modules)
let compatibilityEngine = null;

async function loadEngine() {
  if (!compatibilityEngine) {
    try {
      const module = await import('../../scripts/parts-compatibility-engine/src/engine/compatibilityEngineV2.js');
      compatibilityEngine = module.default || module;
      console.log('[Parts API V2] Engine carregado com sucesso');
    } catch (error) {
      console.error('[Parts API V2] Erro ao carregar engine:', error.message);
    }
  }
  return compatibilityEngine;
}

// Middleware para garantir que o engine está carregado
router.use(async (req, res, next) => {
  await loadEngine();
  if (!compatibilityEngine) {
    return res.status(503).json({
      success: false,
      error: 'Engine de compatibilidade não disponível',
    });
  }
  next();
});

/**
 * POST /api/v2/parts/compatibility
 * Gera compatibilidade de peças para um veículo
 */
router.post('/compatibility', async (req, res) => {
  try {
    const { vehicle } = req.body;
    
    if (!vehicle || (!vehicle.brand && !vehicle.marca)) {
      return res.status(400).json({
        success: false,
        error: 'Dados do veículo são obrigatórios (brand/marca, model/modelo)',
      });
    }
    
    const result = compatibilityEngine.generateCompatibility(vehicle);
    
    res.json({
      success: true,
      data: result,
      meta: {
        partsFound: result.totalPartsFound,
        coverage: `${(result.coverage * 100).toFixed(1)}%`,
        confidence: `${(result.confidence * 100).toFixed(1)}%`,
        equivalentsAvailable: result.totalEquivalents,
      },
    });
    
  } catch (error) {
    console.error('[Parts API V2] Erro ao gerar compatibilidade:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar compatibilidade',
      message: error.message,
    });
  }
});


/**
 * GET /api/v2/parts/search
 * Busca peças por termo
 */
router.get('/search', async (req, res) => {
  try {
    const { q, category, brand, limit = 50 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro de busca "q" é obrigatório',
      });
    }
    
    const results = compatibilityEngine.searchParts(q, {
      category,
      brand,
      limit: parseInt(limit),
    });
    
    res.json({
      success: true,
      query: q,
      count: results.length,
      data: results,
    });
    
  } catch (error) {
    console.error('[Parts API V2] Erro na busca:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar peças',
      message: error.message,
    });
  }
});

/**
 * GET /api/v2/parts/lookup/:partNumber
 * Busca peça por part number
 */
router.get('/lookup/:partNumber', async (req, res) => {
  try {
    const { partNumber } = req.params;
    
    const result = compatibilityEngine.findPartByNumber(partNumber);
    
    if (!result.found) {
      return res.status(404).json({
        success: false,
        error: 'Peça não encontrada',
        partNumber,
      });
    }
    
    res.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    console.error('[Parts API V2] Erro no lookup:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar peça',
      message: error.message,
    });
  }
});

/**
 * GET /api/v2/parts/equivalents/:partNumber
 * Busca equivalentes de uma peça
 */
router.get('/equivalents/:partNumber', async (req, res) => {
  try {
    const { partNumber } = req.params;
    
    const result = compatibilityEngine.findEquivalents(partNumber);
    
    if (!result.found) {
      return res.status(404).json({
        success: false,
        error: 'Peça não encontrada',
        partNumber,
      });
    }
    
    res.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    console.error('[Parts API V2] Erro ao buscar equivalentes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar equivalentes',
      message: error.message,
    });
  }
});

/**
 * GET /api/v2/parts/stats
 * Estatísticas do banco de dados
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = compatibilityEngine.getDatabaseStats();
    
    res.json({
      success: true,
      data: {
        ...stats,
        version: '3.0.0',
        lastUpdated: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    console.error('[Parts API V2] Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter estatísticas',
      message: error.message,
    });
  }
});

/**
 * GET /api/v2/parts/categories
 * Lista categorias disponíveis
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'oil_filters', name: 'Filtros de Óleo', icon: 'droplet', vehicleTypes: ['car'] },
      { id: 'oil_filters_motorcycle', name: 'Filtros de Óleo (Motos)', icon: 'droplet', vehicleTypes: ['motorcycle'] },
      { id: 'air_filters', name: 'Filtros de Ar', icon: 'wind', vehicleTypes: ['car'] },
      { id: 'air_filters_motorcycle', name: 'Filtros de Ar (Motos)', icon: 'wind', vehicleTypes: ['motorcycle'] },
      { id: 'brake_pads', name: 'Pastilhas de Freio', icon: 'disc', vehicleTypes: ['car'] },
      { id: 'brake_pads_motorcycle', name: 'Pastilhas de Freio (Motos)', icon: 'disc', vehicleTypes: ['motorcycle'] },
      { id: 'spark_plugs', name: 'Velas de Ignição', icon: 'zap', vehicleTypes: ['car'] },
      { id: 'spark_plugs_motorcycle', name: 'Velas de Ignição (Motos)', icon: 'zap', vehicleTypes: ['motorcycle'] },
      { id: 'engine_oils', name: 'Óleos de Motor', icon: 'droplet', vehicleTypes: ['car', 'motorcycle'] },
      { id: 'timing_belts', name: 'Correias Dentadas', icon: 'settings', vehicleTypes: ['car'] },
      { id: 'chain_kits', name: 'Kit Relação', icon: 'link', vehicleTypes: ['motorcycle'] },
      { id: 'shock_absorbers', name: 'Amortecedores', icon: 'move', vehicleTypes: ['car'] },
      { id: 'batteries', name: 'Baterias', icon: 'battery', vehicleTypes: ['car', 'motorcycle'] },
    ];
    
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
    
  } catch (error) {
    console.error('[Parts API V2] Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar categorias',
      message: error.message,
    });
  }
});

/**
 * GET /api/v2/parts/brands
 * Lista marcas disponíveis
 */
router.get('/brands', async (req, res) => {
  try {
    const brands = [
      // Filtros
      { name: 'MANN-FILTER', country: 'Alemanha', categories: ['filtros'], premium: true },
      { name: 'TECFIL', country: 'Brasil', categories: ['filtros'], premium: false },
      { name: 'FRAM', country: 'EUA', categories: ['filtros'], premium: false },
      { name: 'BOSCH', country: 'Alemanha', categories: ['filtros', 'ignição', 'elétrica'], premium: true },
      { name: 'MAHLE', country: 'Alemanha', categories: ['filtros'], premium: true },
      { name: 'HIFLOFILTRO', country: 'Reino Unido', categories: ['filtros_moto'], premium: false },
      { name: 'K&N', country: 'EUA', categories: ['filtros', 'filtros_moto'], premium: true },
      
      // Freios
      { name: 'COBREQ', country: 'Brasil', categories: ['freios'], premium: false },
      { name: 'FRAS-LE', country: 'Brasil', categories: ['freios'], premium: false },
      { name: 'TRW', country: 'Alemanha', categories: ['freios'], premium: true },
      { name: 'FERODO', country: 'Reino Unido', categories: ['freios'], premium: true },
      { name: 'EBC', country: 'Reino Unido', categories: ['freios_moto'], premium: true },
      { name: 'BREMBO', country: 'Itália', categories: ['freios', 'freios_moto'], premium: true },
      
      // Ignição
      { name: 'NGK', country: 'Japão', categories: ['ignição'], premium: true },
      { name: 'DENSO', country: 'Japão', categories: ['ignição'], premium: true },
      { name: 'CHAMPION', country: 'EUA', categories: ['ignição'], premium: false },
      
      // Lubrificantes
      { name: 'MOBIL', country: 'EUA', categories: ['lubrificantes'], premium: true },
      { name: 'CASTROL', country: 'Reino Unido', categories: ['lubrificantes'], premium: true },
      { name: 'SHELL', country: 'Holanda', categories: ['lubrificantes'], premium: true },
      { name: 'MOTUL', country: 'França', categories: ['lubrificantes'], premium: true },
      { name: 'PETRONAS', country: 'Malásia', categories: ['lubrificantes'], premium: false },
      { name: 'LIQUI MOLY', country: 'Alemanha', categories: ['lubrificantes'], premium: true },
      
      // Suspensão
      { name: 'MONROE', country: 'EUA', categories: ['suspensão'], premium: true },
      { name: 'COFAP', country: 'Brasil', categories: ['suspensão'], premium: false },
      { name: 'NAKATA', country: 'Brasil', categories: ['suspensão'], premium: false },
      { name: 'KAYABA', country: 'Japão', categories: ['suspensão'], premium: true },
      
      // Distribuição
      { name: 'CONTITECH', country: 'Alemanha', categories: ['distribuição'], premium: true },
      { name: 'GATES', country: 'EUA', categories: ['distribuição'], premium: true },
      { name: 'DAYCO', country: 'Itália', categories: ['distribuição'], premium: false },
      { name: 'SKF', country: 'Suécia', categories: ['distribuição', 'rolamentos'], premium: true },
      
      // Transmissão Motos
      { name: 'DID', country: 'Japão', categories: ['transmissão_moto'], premium: true },
      { name: 'RK', country: 'Japão', categories: ['transmissão_moto'], premium: true },
      { name: 'REGINA', country: 'Itália', categories: ['transmissão_moto'], premium: false },
      { name: 'RIFFEL', country: 'Brasil', categories: ['transmissão_moto'], premium: false },
      { name: 'VORTEX', country: 'EUA', categories: ['transmissão_moto'], premium: true },
      
      // Baterias
      { name: 'MOURA', country: 'Brasil', categories: ['elétrica'], premium: false },
      { name: 'HELIAR', country: 'Brasil', categories: ['elétrica'], premium: false },
      { name: 'YUASA', country: 'Japão', categories: ['elétrica'], premium: true },
      { name: 'VARTA', country: 'Alemanha', categories: ['elétrica'], premium: true },
      { name: 'ACDelco', country: 'EUA', categories: ['elétrica', 'filtros'], premium: false },
    ];
    
    res.json({
      success: true,
      count: brands.length,
      data: brands,
    });
    
  } catch (error) {
    console.error('[Parts API V2] Erro ao listar marcas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar marcas',
      message: error.message,
    });
  }
});

/**
 * POST /api/v2/parts/universal-lookup
 * Busca peças usando o mapeamento universal (20.000+ veículos)
 */
router.post('/universal-lookup', async (req, res) => {
  try {
    const { brand, model, year, engineCode, displacementCc, vehicleType } = req.body;
    
    if (!brand) {
      return res.status(400).json({
        success: false,
        error: 'Marca do veículo é obrigatória',
      });
    }
    
    // Importa o mapeamento universal
    const { getPartsForVehicle, resolveEngineCode } = await import(
      '../../scripts/parts-compatibility-engine/src/config/universalPartsMapping.js'
    );
    
    const vehicle = { brand, model, year, engineCode, displacementCc, vehicleType };
    const resolvedEngine = resolveEngineCode(vehicle);
    const partsResult = getPartsForVehicle(vehicle);
    
    res.json({
      success: partsResult.found,
      vehicle: { brand, model, year, vehicleType },
      engineCode: resolvedEngine,
      message: partsResult.message,
      parts: partsResult.parts,
      coverage: '20.000+ veículos brasileiros',
    });
    
  } catch (error) {
    console.error('[Parts API V2] Erro no universal lookup:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar no mapeamento universal',
      message: error.message,
    });
  }
});

/**
 * POST /api/v2/parts/batch-compatibility
 * Gera compatibilidade para múltiplos veículos
 */
router.post('/batch-compatibility', async (req, res) => {
  try {
    const { vehicles } = req.body;
    
    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Array de veículos é obrigatório',
      });
    }
    
    if (vehicles.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Máximo de 10 veículos por requisição',
      });
    }
    
    const results = vehicles.map(vehicle => {
      try {
        return {
          vehicle: `${vehicle.brand || vehicle.marca} ${vehicle.model || vehicle.modelo}`,
          success: true,
          data: compatibilityEngine.generateCompatibility(vehicle),
        };
      } catch (error) {
        return {
          vehicle: `${vehicle.brand || vehicle.marca} ${vehicle.model || vehicle.modelo}`,
          success: false,
          error: error.message,
        };
      }
    });
    
    res.json({
      success: true,
      count: results.length,
      data: results,
    });
    
  } catch (error) {
    console.error('[Parts API V2] Erro no batch:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar batch',
      message: error.message,
    });
  }
});

module.exports = router;
