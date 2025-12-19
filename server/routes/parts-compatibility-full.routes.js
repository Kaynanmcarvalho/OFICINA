/**
 * ROTAS DE COMPATIBILIDADE COMPLETA DE PEÇAS V4
 * API REST para busca de peças compatíveis - 50 peças por veículo
 * Suporta 20.000+ veículos brasileiros
 * 
 * @version 4.0.0
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Carrega dados do JSON gerado
let compatibilityData = null;
let compatibilityIndex = null;

function loadData() {
  try {
    // Tenta carregar V4 primeiro (20.000+ veículos)
    const v4FullPath = path.join(__dirname, '../../scripts/parts-compatibility-engine/output/parts-compatibility-v4-full.json');
    const v4IndexPath = path.join(__dirname, '../../scripts/parts-compatibility-engine/output/parts-compatibility-v4-index.json');
    
    if (fs.existsSync(v4FullPath)) {
      const v4Data = JSON.parse(fs.readFileSync(v4FullPath, 'utf8'));
      compatibilityData = v4Data.vehicles;
      compatibilityIndex = v4Data.stats;
      console.log(`[Parts Full API V4] ✅ Carregados ${Object.keys(compatibilityData).length} veículos com ~50 peças cada`);
      return;
    }
    
    // Fallback para V3
    const v3FullPath = path.join(__dirname, '../../scripts/parts-compatibility-engine/output/parts-compatibility-v3-full.json');
    if (fs.existsSync(v3FullPath)) {
      const v3Data = JSON.parse(fs.readFileSync(v3FullPath, 'utf8'));
      compatibilityData = v3Data.vehicles;
      compatibilityIndex = v3Data.stats;
      console.log(`[Parts Full API V3] ✅ Carregados ${Object.keys(compatibilityData).length} veículos (fallback V3)`);
      return;
    }
    
    // Fallback para V2
    const dataPath = path.join(__dirname, '../../scripts/parts-compatibility-engine/output/parts-compatibility-full.json');
    const indexPath = path.join(__dirname, '../../scripts/parts-compatibility-engine/output/parts-compatibility-index.json');
    
    if (fs.existsSync(dataPath)) {
      const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      if (Array.isArray(rawData)) {
        compatibilityData = {};
        for (const v of rawData) {
          compatibilityData[v.vehicleId] = v;
        }
      } else {
        compatibilityData = rawData;
      }
      console.log(`[Parts Full API] ✅ Carregados ${Object.keys(compatibilityData).length} veículos (V2)`);
    }
    
    if (fs.existsSync(indexPath)) {
      compatibilityIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      console.log('[Parts Full API] ✅ Índice carregado');
    }
  } catch (error) {
    console.error('[Parts Full API] ❌ Erro ao carregar dados:', error.message);
  }
}

// Carrega dados na inicialização
loadData();

/**
 * GET /api/parts-full/stats
 * Retorna estatísticas gerais do sistema
 */
router.get('/stats', (req, res) => {
  if (!compatibilityIndex) {
    return res.status(503).json({
      success: false,
      error: 'Dados ainda não foram gerados. Execute o generator primeiro.',
    });
  }
  
  res.json({
    success: true,
    data: compatibilityIndex,
    version: '3.0.0',
  });
});

/**
 * GET /api/parts-full/platforms
 * Lista todas as plataformas de veículos
 */
router.get('/platforms', (req, res) => {
  if (!compatibilityIndex) {
    return res.status(503).json({
      success: false,
      error: 'Dados ainda não foram gerados.',
    });
  }
  
  res.json({
    success: true,
    data: compatibilityIndex.platforms || [],
  });
});

/**
 * GET /api/parts-full/categories
 * Lista todas as categorias de peças
 */
router.get('/categories', (req, res) => {
  if (!compatibilityIndex) {
    return res.status(503).json({
      success: false,
      error: 'Dados ainda não foram gerados.',
    });
  }
  
  res.json({
    success: true,
    data: compatibilityIndex.categories || [],
  });
});


/**
 * GET /api/parts-full/vehicle/:vehicleId
 * Busca todas as peças compatíveis para um veículo específico
 */
router.get('/vehicle/:vehicleId', (req, res) => {
  if (!compatibilityData) {
    return res.status(503).json({
      success: false,
      error: 'Dados ainda não foram gerados.',
    });
  }
  
  const { vehicleId } = req.params;
  const vehicle = compatibilityData[vehicleId];
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      error: 'Veículo não encontrado',
      vehicleId,
      hint: 'Use /api/parts-full/search para encontrar veículos disponíveis',
    });
  }
  
  // Agrupa peças por categoria para facilitar exibição
  const partsByCategory = {};
  for (const part of vehicle.parts) {
    if (!partsByCategory[part.category]) {
      partsByCategory[part.category] = [];
    }
    partsByCategory[part.category].push(part);
  }
  
  res.json({
    success: true,
    data: {
      vehicleId: vehicle.vehicleId,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      platform: vehicle.platform,
      totalParts: vehicle.totalParts,
      totalChecklist: vehicle.totalChecklist,
      partsByCategory,
      parts: vehicle.parts,
      sharedParts: vehicle.sharedParts || [],
      generatedAt: vehicle.generatedAt,
    },
  });
});

/**
 * GET /api/parts-full/search
 * Busca veículos por marca, modelo ou ano
 */
router.get('/search', (req, res) => {
  if (!compatibilityData) {
    return res.status(503).json({
      success: false,
      error: 'Dados ainda não foram gerados.',
    });
  }
  
  const { brand, model, year, platform, limit = 50 } = req.query;
  
  let results = Object.values(compatibilityData);
  
  if (brand) {
    const brandLower = brand.toLowerCase();
    results = results.filter(v => 
      v.brand.toLowerCase().includes(brandLower)
    );
  }
  
  if (model) {
    const modelLower = model.toLowerCase();
    results = results.filter(v => 
      v.model.toLowerCase().includes(modelLower)
    );
  }
  
  if (year) {
    results = results.filter(v => v.year === parseInt(year));
  }
  
  if (platform) {
    results = results.filter(v => v.platform === platform);
  }
  
  // Limita resultados
  results = results.slice(0, parseInt(limit));
  
  res.json({
    success: true,
    count: results.length,
    data: results.map(v => ({
      vehicleId: v.vehicleId,
      brand: v.brand,
      model: v.model,
      year: v.year,
      platform: v.platform,
      totalParts: v.totalParts,
    })),
  });
});

/**
 * GET /api/parts-full/cross-compatibility/:partNumber
 * Busca veículos que compartilham uma peça específica
 */
router.get('/cross-compatibility/:partNumber', (req, res) => {
  if (!compatibilityData) {
    return res.status(503).json({
      success: false,
      error: 'Dados ainda não foram gerados.',
    });
  }
  
  const { partNumber } = req.params;
  const vehicles = [];
  
  for (const vehicle of Object.values(compatibilityData)) {
    const part = vehicle.parts.find(p => p.partNumber === partNumber);
    if (part) {
      vehicles.push({
        vehicleId: vehicle.vehicleId,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        platform: vehicle.platform,
      });
    }
  }
  
  // Agrupa por marca
  const byBrand = {};
  for (const v of vehicles) {
    if (!byBrand[v.brand]) {
      byBrand[v.brand] = [];
    }
    byBrand[v.brand].push(v);
  }
  
  res.json({
    success: true,
    partNumber,
    totalVehicles: vehicles.length,
    byBrand,
    economySuggestion: vehicles.length > 5 ? {
      type: 'high_volume_part',
      description: 'Peça de alto volume - geralmente mais barata e fácil de encontrar',
      estimatedSavings: '10-25%',
    } : null,
  });
});

/**
 * GET /api/parts-full/by-category/:vehicleId/:category
 * Busca peças de uma categoria específica para um veículo
 */
router.get('/by-category/:vehicleId/:category', (req, res) => {
  if (!compatibilityData) {
    return res.status(503).json({
      success: false,
      error: 'Dados ainda não foram gerados.',
    });
  }
  
  const { vehicleId, category } = req.params;
  const vehicle = compatibilityData[vehicleId];
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      error: 'Veículo não encontrado',
    });
  }
  
  const parts = vehicle.parts.filter(p => p.category === category);
  
  res.json({
    success: true,
    vehicleId,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    category,
    count: parts.length,
    parts,
  });
});

/**
 * POST /api/parts-full/reload
 * Recarrega os dados do JSON (admin)
 */
router.post('/reload', (req, res) => {
  try {
    loadData();
    res.json({
      success: true,
      message: 'Dados recarregados com sucesso',
      vehiclesLoaded: Object.keys(compatibilityData || {}).length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao recarregar dados',
      message: error.message,
    });
  }
});

module.exports = router;
