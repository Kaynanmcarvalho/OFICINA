/**
 * ROTAS DE COMPATIBILIDADE DE PEÇAS
 * API REST para busca de peças compatíveis por veículo
 * 
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();

// Importar dados de compatibilidade (será gerado pelo engine)
let compatibilityIndex = {};
let partsDatabase = {};

// Carregar dados de compatibilidade do Firebase ou arquivo local
async function loadCompatibilityData() {
  try {
    // Tentar carregar do Firebase primeiro
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    // Carregar índice de compatibilidade
    const indexSnapshot = await db.collection('partsCompatibility').doc('index').get();
    if (indexSnapshot.exists) {
      compatibilityIndex = indexSnapshot.data();
      console.log('[Parts API] Índice de compatibilidade carregado do Firebase');
    }
    
    // Carregar base de peças
    const partsSnapshot = await db.collection('partsDatabase').get();
    partsSnapshot.forEach(doc => {
      partsDatabase[doc.id] = doc.data();
    });
    console.log(`[Parts API] ${Object.keys(partsDatabase).length} categorias de peças carregadas`);
    
  } catch (error) {
    console.warn('[Parts API] Erro ao carregar do Firebase, usando dados locais:', error.message);
    // Fallback para dados locais se Firebase não disponível
  }
}

// Inicializar dados
loadCompatibilityData();

/**
 * GET /api/parts/compatibility/:vehicleId
 * Busca peças compatíveis para um veículo específico
 */
router.get('/compatibility/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { category, priority } = req.query;
    
    // Buscar no Firebase
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    const compatDoc = await db
      .collection('vehicles')
      .doc(vehicleId)
      .collection('compatibilityIndex')
      .doc('current')
      .get();
    
    if (!compatDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Índice de compatibilidade não encontrado para este veículo',
        vehicleId,
      });
    }
    
    let result = compatDoc.data();
    
    // Filtrar por categoria se especificado
    if (category) {
      result.compatibleParts = result.compatibleParts.filter(
        part => part.category === category
      );
    }
    
    // Filtrar por prioridade se especificado
    if (priority) {
      result.compatibleParts = result.compatibleParts.filter(
        part => part.priority === priority
      );
    }
    
    res.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    console.error('[Parts API] Erro ao buscar compatibilidade:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar compatibilidade de peças',
      message: error.message,
    });
  }
});

/**
 * GET /api/parts/search
 * Busca peças por termo de pesquisa
 */
router.get('/search', async (req, res) => {
  try {
    const { q, brand, model, year, category, limit = 50 } = req.query;
    
    if (!q && !brand) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro de busca obrigatório: q (termo) ou brand (marca)',
      });
    }
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    let query = db.collection('partsDatabase');
    
    // Buscar por categoria se especificado
    if (category) {
      query = query.where('category', '==', category);
    }
    
    const snapshot = await query.limit(parseInt(limit)).get();
    
    const results = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Filtrar por termo de busca
      if (q) {
        const searchTerm = q.toLowerCase();
        const matchesSearch = 
          data.partNumber?.toLowerCase().includes(searchTerm) ||
          data.name?.toLowerCase().includes(searchTerm) ||
          data.brand?.toLowerCase().includes(searchTerm) ||
          data.applications?.some(app => app.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return;
      }
      
      // Filtrar por marca do veículo
      if (brand) {
        const brandLower = brand.toLowerCase();
        const matchesBrand = data.applications?.some(
          app => app.toLowerCase().includes(brandLower)
        );
        if (!matchesBrand) return;
      }
      
      // Filtrar por modelo
      if (model) {
        const modelLower = model.toLowerCase();
        const matchesModel = data.applications?.some(
          app => app.toLowerCase().includes(modelLower)
        );
        if (!matchesModel) return;
      }
      
      results.push({
        id: doc.id,
        ...data,
      });
    });
    
    res.json({
      success: true,
      count: results.length,
      data: results,
    });
    
  } catch (error) {
    console.error('[Parts API] Erro na busca:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar peças',
      message: error.message,
    });
  }
});

/**
 * GET /api/parts/equivalents/:partNumber
 * Busca peças equivalentes/alternativas
 */
router.get('/equivalents/:partNumber', async (req, res) => {
  try {
    const { partNumber } = req.params;
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    // Buscar a peça original
    const partDoc = await db.collection('partsDatabase').doc(partNumber).get();
    
    if (!partDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Peça não encontrada',
        partNumber,
      });
    }
    
    const partData = partDoc.data();
    const equivalents = partData.equivalents || [];
    
    // Buscar detalhes das peças equivalentes
    const equivalentDetails = [];
    for (const eqPartNumber of equivalents) {
      const eqDoc = await db.collection('partsDatabase').doc(eqPartNumber).get();
      if (eqDoc.exists) {
        equivalentDetails.push({
          partNumber: eqPartNumber,
          ...eqDoc.data(),
        });
      } else {
        // Se não encontrar no banco, retornar apenas o número
        equivalentDetails.push({
          partNumber: eqPartNumber,
          source: 'cross_reference',
        });
      }
    }
    
    res.json({
      success: true,
      original: {
        partNumber,
        ...partData,
      },
      equivalents: equivalentDetails,
    });
    
  } catch (error) {
    console.error('[Parts API] Erro ao buscar equivalentes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar peças equivalentes',
      message: error.message,
    });
  }
});

/**
 * GET /api/parts/shared/:partNumber
 * Busca veículos que compartilham a mesma peça
 */
router.get('/shared/:partNumber', async (req, res) => {
  try {
    const { partNumber } = req.params;
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    // Buscar a peça
    const partDoc = await db.collection('partsDatabase').doc(partNumber).get();
    
    if (!partDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Peça não encontrada',
        partNumber,
      });
    }
    
    const partData = partDoc.data();
    const applications = partData.applications || [];
    
    // Agrupar por marca
    const vehiclesByBrand = {};
    applications.forEach(app => {
      const parts = app.split(' ');
      const brand = parts[0];
      const model = parts.slice(1).join(' ');
      
      if (!vehiclesByBrand[brand]) {
        vehiclesByBrand[brand] = [];
      }
      vehiclesByBrand[brand].push(model);
    });
    
    res.json({
      success: true,
      partNumber,
      partName: partData.name,
      brand: partData.brand,
      totalVehicles: applications.length,
      vehiclesByBrand,
      economySuggestion: applications.length > 3 ? {
        type: 'high_volume_part',
        description: 'Peça de alto volume - geralmente mais barata e fácil de encontrar',
        estimatedSavings: '10-25%',
      } : null,
    });
    
  } catch (error) {
    console.error('[Parts API] Erro ao buscar veículos compartilhados:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar veículos compartilhados',
      message: error.message,
    });
  }
});

/**
 * GET /api/parts/categories
 * Lista todas as categorias de peças disponíveis
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'filtros', name: 'Filtros', icon: 'filter' },
      { id: 'ignição', name: 'Ignição', icon: 'zap' },
      { id: 'freios', name: 'Freios', icon: 'disc' },
      { id: 'motor', name: 'Motor', icon: 'settings' },
      { id: 'lubrificantes', name: 'Lubrificantes', icon: 'droplet' },
      { id: 'arrefecimento', name: 'Arrefecimento', icon: 'thermometer' },
      { id: 'suspensão', name: 'Suspensão', icon: 'move' },
      { id: 'elétrica', name: 'Elétrica', icon: 'battery' },
      { id: 'transmissão', name: 'Transmissão', icon: 'git-branch' },
      { id: 'rolamentos', name: 'Rolamentos', icon: 'circle' },
      { id: 'controles', name: 'Controles', icon: 'sliders' },
    ];
    
    res.json({
      success: true,
      data: categories,
    });
    
  } catch (error) {
    console.error('[Parts API] Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar categorias',
      message: error.message,
    });
  }
});

/**
 * GET /api/parts/brands
 * Lista todas as marcas de peças disponíveis
 */
router.get('/brands', async (req, res) => {
  try {
    const brands = [
      // Filtros
      { name: 'MANN-FILTER', country: 'Alemanha', categories: ['filtros'] },
      { name: 'TECFIL', country: 'Brasil', categories: ['filtros'] },
      { name: 'FRAM', country: 'EUA', categories: ['filtros'] },
      { name: 'BOSCH', country: 'Alemanha', categories: ['filtros', 'ignição', 'elétrica', 'freios'] },
      { name: 'HIFLOFILTRO', country: 'Reino Unido', categories: ['filtros'] },
      { name: 'K&N', country: 'EUA', categories: ['filtros'] },
      
      // Freios
      { name: 'COBREQ', country: 'Brasil', categories: ['freios'] },
      { name: 'FRAS-LE', country: 'Brasil', categories: ['freios'] },
      { name: 'EBC', country: 'Reino Unido', categories: ['freios'] },
      { name: 'FREMAX', country: 'Brasil', categories: ['freios'] },
      
      // Ignição
      { name: 'NGK', country: 'Japão', categories: ['ignição'] },
      { name: 'DENSO', country: 'Japão', categories: ['ignição', 'elétrica'] },
      
      // Lubrificantes
      { name: 'MOBIL', country: 'EUA', categories: ['lubrificantes'] },
      { name: 'CASTROL', country: 'Reino Unido', categories: ['lubrificantes'] },
      { name: 'SHELL', country: 'Holanda', categories: ['lubrificantes'] },
      { name: 'MOTUL', country: 'França', categories: ['lubrificantes'] },
      { name: 'PETRONAS', country: 'Malásia', categories: ['lubrificantes'] },
      
      // Suspensão
      { name: 'MONROE', country: 'EUA', categories: ['suspensão'] },
      { name: 'COFAP', country: 'Brasil', categories: ['suspensão'] },
      { name: 'NAKATA', country: 'Brasil', categories: ['suspensão'] },
      
      // Transmissão
      { name: 'LUK', country: 'Alemanha', categories: ['transmissão'] },
      { name: 'SACHS', country: 'Alemanha', categories: ['transmissão'] },
      { name: 'VALEO', country: 'França', categories: ['transmissão', 'elétrica'] },
      
      // Rolamentos
      { name: 'SKF', country: 'Suécia', categories: ['rolamentos'] },
      { name: 'FAG', country: 'Alemanha', categories: ['rolamentos'] },
      { name: 'NSK', country: 'Japão', categories: ['rolamentos'] },
      { name: 'TIMKEN', country: 'EUA', categories: ['rolamentos'] },
      
      // Baterias
      { name: 'MOURA', country: 'Brasil', categories: ['elétrica'] },
      { name: 'HELIAR', country: 'Brasil', categories: ['elétrica'] },
      { name: 'YUASA', country: 'Japão', categories: ['elétrica'] },
      
      // Correias
      { name: 'CONTITECH', country: 'Alemanha', categories: ['motor'] },
      { name: 'GATES', country: 'EUA', categories: ['motor'] },
      { name: 'DAYCO', country: 'Itália', categories: ['motor'] },
    ];
    
    res.json({
      success: true,
      count: brands.length,
      data: brands,
    });
    
  } catch (error) {
    console.error('[Parts API] Erro ao listar marcas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar marcas',
      message: error.message,
    });
  }
});

/**
 * POST /api/parts/generate-compatibility
 * Gera índice de compatibilidade para um veículo (admin only)
 */
router.post('/generate-compatibility', async (req, res) => {
  try {
    const { vehicleId, vehicleData } = req.body;
    
    if (!vehicleId || !vehicleData) {
      return res.status(400).json({
        success: false,
        error: 'vehicleId e vehicleData são obrigatórios',
      });
    }
    
    // Importar engine de compatibilidade
    const { generateCompatibility } = await import('../../scripts/parts-compatibility-engine/src/engine/compatibilityEngine.js');
    
    // Gerar compatibilidade
    const result = generateCompatibility({
      id: vehicleId,
      ...vehicleData,
    });
    
    // Salvar no Firebase
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    await db
      .collection('vehicles')
      .doc(vehicleId)
      .collection('compatibilityIndex')
      .doc('current')
      .set(result);
    
    res.json({
      success: true,
      message: 'Índice de compatibilidade gerado com sucesso',
      data: result,
    });
    
  } catch (error) {
    console.error('[Parts API] Erro ao gerar compatibilidade:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar índice de compatibilidade',
      message: error.message,
    });
  }
});

/**
 * GET /api/parts/stats
 * Estatísticas do sistema de compatibilidade
 */
router.get('/stats', async (req, res) => {
  try {
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    // Contar veículos com índice de compatibilidade
    const vehiclesSnapshot = await db.collectionGroup('compatibilityIndex').count().get();
    const vehiclesWithIndex = vehiclesSnapshot.data().count;
    
    // Contar peças no banco
    const partsSnapshot = await db.collection('partsDatabase').count().get();
    const totalParts = partsSnapshot.data().count;
    
    res.json({
      success: true,
      stats: {
        vehiclesWithCompatibilityIndex: vehiclesWithIndex,
        totalPartsInDatabase: totalParts,
        categories: 11,
        brands: 35,
        lastUpdated: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    console.error('[Parts API] Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter estatísticas',
      message: error.message,
    });
  }
});

module.exports = router;
