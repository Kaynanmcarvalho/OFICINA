/**
 * Intelligent Compatibility Service
 * Analisa produtos do inventário e sugere compatibilidades automaticamente
 */

import { collection, query, getDocs, addDoc, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Analisa um produto e sugere veículos compatíveis
 * @param {object} product - Produto do inventário
 * @returns {Array} Lista de veículos compatíveis sugeridos
 */
export const analyzeProductCompatibility = async (product) => {
  const suggestions = [];
  
  const productName = (product.name || '').toLowerCase();
  const productDesc = (product.description || '').toLowerCase();
  const productBrand = (product.brand || '').toLowerCase();
  const productCategory = (product.category || '').toLowerCase();
  const productTags = (product.tags || []).map(t => t.toLowerCase());
  
  const allText = `${productName} ${productDesc} ${productBrand} ${productCategory} ${productTags.join(' ')}`;
  
  // 1. Detectar tipo de veículo
  const vehicleTypes = detectVehicleType(allText);
  
  // 2. Detectar marcas mencionadas
  const brands = await detectBrands(allText, vehicleTypes);
  
  // 3. Detectar modelos mencionados
  const models = await detectModels(allText, brands);
  
  // 4. Detectar anos mencionados
  const years = detectYears(allText);
  
  // 5. Verificar se é produto universal
  const isUniversal = detectUniversal(allText);
  
  // 6. Gerar sugestões
  if (isUniversal) {
    // Produto universal - compatível com todos os veículos do tipo
    for (const tipo of vehicleTypes) {
      suggestions.push({
        tipo,
        marca: 'Universal',
        modelo: 'Todos',
        anoInicio: years.min || 2000,
        anoFim: years.max || new Date().getFullYear(),
        confidenceScore: 30,
        reason: 'Produto universal',
        evidencias: [{
          tipo: 'Marketplace',
          descricao: 'Produto identificado como universal',
          data: new Date().toISOString()
        }]
      });
    }
  }
  
  // Sugestões específicas por marca/modelo
  for (const brand of brands) {
    if (models.length > 0) {
      // Tem marca E modelo
      for (const model of models) {
        suggestions.push({
          tipo: brand.tipo,
          marca: brand.nome,
          modelo: model.nome,
          anoInicio: years.min || 2000,
          anoFim: years.max || new Date().getFullYear(),
          confidenceScore: 70,
          reason: `Marca "${brand.nome}" e modelo "${model.nome}" encontrados no produto`,
          evidencias: [{
            tipo: 'Marketplace',
            descricao: `Produto menciona ${brand.nome} ${model.nome}`,
            data: new Date().toISOString()
          }]
        });
      }
    } else {
      // Só tem marca
      suggestions.push({
        tipo: brand.tipo,
        marca: brand.nome,
        modelo: 'Todos',
        anoInicio: years.min || 2000,
        anoFim: years.max || new Date().getFullYear(),
        confidenceScore: 50,
        reason: `Marca "${brand.nome}" encontrada no produto`,
        evidencias: [{
          tipo: 'Marketplace',
          descricao: `Produto menciona ${brand.nome}`,
          data: new Date().toISOString()
        }]
      });
    }
  }
  
  return suggestions;
};

/**
 * Detecta tipo de veículo no texto
 */
function detectVehicleType(text) {
  const types = [];
  
  const keywords = {
    motos: ['moto', 'motocicleta', 'bike', 'scooter', 'ciclomotor'],
    carros: ['carro', 'auto', 'automóvel', 'veículo', 'sedan', 'hatch', 'suv'],
    caminhoes: ['caminhão', 'caminhao', 'truck', 'caminhonete']
  };
  
  for (const [tipo, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      types.push(tipo);
    }
  }
  
  // Se não detectou nenhum, assume todos
  return types.length > 0 ? types : ['motos', 'carros', 'caminhoes'];
}

/**
 * Detecta marcas mencionadas no texto
 */
async function detectBrands(text, vehicleTypes) {
  const detectedBrands = [];
  
  // Marcas comuns brasileiras
  const commonBrands = {
    motos: [
      'honda', 'yamaha', 'suzuki', 'kawasaki', 'harley', 'bmw',
      'ducati', 'triumph', 'ktm', 'royal enfield', 'shineray'
    ],
    carros: [
      'fiat', 'volkswagen', 'vw', 'chevrolet', 'gm', 'ford',
      'toyota', 'hyundai', 'renault', 'nissan', 'jeep', 'honda',
      'peugeot', 'citroen', 'mitsubishi', 'kia', 'bmw', 'mercedes',
      'audi', 'volvo', 'land rover', 'porsche'
    ],
    caminhoes: [
      'mercedes', 'mercedes-benz', 'volvo', 'scania', 'iveco',
      'volkswagen', 'vw', 'ford', 'man', 'daf'
    ]
  };
  
  for (const tipo of vehicleTypes) {
    const brands = commonBrands[tipo] || [];
    for (const brand of brands) {
      if (text.includes(brand)) {
        detectedBrands.push({
          nome: capitalizeFirst(brand),
          tipo
        });
      }
    }
  }
  
  return detectedBrands;
}

/**
 * Detecta modelos mencionados no texto
 */
async function detectModels(text, brands) {
  const detectedModels = [];
  
  // Modelos comuns por marca
  const commonModels = {
    'Honda': ['cg', 'cg 160', 'titan', 'bros', 'biz', 'pop', 'xre', 'cb', 'pcx', 'civic', 'city', 'fit', 'hr-v', 'cr-v'],
    'Yamaha': ['factor', 'fazer', 'crosser', 'lander', 'mt', 'xt', 'xtz', 'neo'],
    'Fiat': ['uno', 'palio', 'siena', 'strada', 'toro', 'argo', 'mobi', 'cronos', 'pulse', 'fastback'],
    'Volkswagen': ['gol', 'voyage', 'polo', 'virtus', 'fox', 'saveiro', 'amarok', 't-cross', 'nivus', 'taos'],
    'Chevrolet': ['onix', 'prisma', 'cruze', 'tracker', 's10', 'montana', 'spin', 'cobalt'],
    'Toyota': ['corolla', 'hilux', 'sw4', 'yaris', 'etios', 'corolla cross'],
    'Ford': ['ka', 'fiesta', 'focus', 'ecosport', 'ranger', 'fusion'],
  };
  
  for (const brand of brands) {
    const models = commonModels[brand.nome] || [];
    for (const model of models) {
      // Buscar modelo com espaços e sem espaços
      const modelVariations = [
        model,
        model.replace(/\s/g, ''),
        model.replace(/\s/g, '-')
      ];
      
      if (modelVariations.some(v => text.includes(v))) {
        detectedModels.push({
          nome: capitalizeFirst(model),
          marca: brand.nome
        });
      }
    }
  }
  
  return detectedModels;
}

/**
 * Detecta anos mencionados no texto
 */
function detectYears(text) {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  // Regex para anos (1990-2030)
  const yearRegex = /\b(19\d{2}|20[0-3]\d)\b/g;
  const matches = text.match(yearRegex);
  
  if (matches) {
    matches.forEach(match => {
      const year = parseInt(match);
      if (year >= 1990 && year <= currentYear + 5) {
        years.push(year);
      }
    });
  }
  
  // Detectar ranges (ex: "2015-2024", "2015 a 2024")
  const rangeRegex = /\b(19\d{2}|20[0-3]\d)\s*[-a]\s*(19\d{2}|20[0-3]\d)\b/g;
  const rangeMatches = text.match(rangeRegex);
  
  if (rangeMatches) {
    rangeMatches.forEach(match => {
      const [start, end] = match.split(/[-a]/).map(y => parseInt(y.trim()));
      if (start && end) {
        years.push(start, end);
      }
    });
  }
  
  return {
    min: years.length > 0 ? Math.min(...years) : null,
    max: years.length > 0 ? Math.max(...years) : null,
    all: years
  };
}

/**
 * Detecta se é produto universal
 */
function detectUniversal(text) {
  const universalKeywords = [
    'universal', 'todos', 'qualquer', 'genérico', 'compatível',
    'óleo', 'oleo', 'fluido', 'aditivo', 'lubrificante',
    'graxa', 'desengraxante', 'limpa', 'polish', 'cera',
    'shampoo', 'detergente', 'removedor'
  ];
  
  return universalKeywords.some(keyword => text.includes(keyword));
}

/**
 * Capitaliza primeira letra
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Analisa TODOS os produtos do inventário
 * @param {Array} products - Lista de produtos
 * @returns {object} Relatório de análise
 */
export const analyzeAllProducts = async (products) => {
  const report = {
    total: products.length,
    analyzed: 0,
    withSuggestions: 0,
    suggestions: [],
    errors: []
  };
  
  for (const product of products) {
    try {
      const suggestions = await analyzeProductCompatibility(product);
      report.analyzed++;
      
      if (suggestions.length > 0) {
        report.withSuggestions++;
        report.suggestions.push({
          product: {
            id: product.id,
            name: product.name,
            sku: product.sku
          },
          suggestions
        });
      }
    } catch (error) {
      report.errors.push({
        productId: product.id,
        productName: product.name,
        error: error.message
      });
    }
  }
  
  return report;
};

/**
 * Salva sugestões de compatibilidade no Firestore
 * @param {string} productId - ID do produto
 * @param {Array} suggestions - Sugestões de compatibilidade
 * @returns {Promise} Resultado da operação
 */
export const saveSuggestedCompatibilities = async (productId, suggestions) => {
  const saved = [];
  
  for (const suggestion of suggestions) {
    try {
      // Buscar ou criar veículo
      const vehiclesRef = collection(db, 'vehicles');
      const q = query(
        vehiclesRef,
        where('marca', '==', suggestion.marca),
        where('modelo', '==', suggestion.modelo),
        where('tipo', '==', suggestion.tipo)
      );
      
      const snapshot = await getDocs(q);
      let vehicleId;
      
      if (snapshot.empty) {
        // Criar veículo
        const vehicleRef = await addDoc(vehiclesRef, {
          marca: suggestion.marca,
          modelo: suggestion.modelo,
          anoInicio: suggestion.anoInicio,
          anoFim: suggestion.anoFim,
          tipo: suggestion.tipo,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        vehicleId = vehicleRef.id;
      } else {
        vehicleId = snapshot.docs[0].id;
      }
      
      // Verificar se compatibilidade já existe
      const compatRef = collection(db, 'compatibility');
      const compatQuery = query(
        compatRef,
        where('partId', '==', productId),
        where('vehicleId', '==', vehicleId)
      );
      
      const compatSnapshot = await getDocs(compatQuery);
      
      if (compatSnapshot.empty) {
        // Criar compatibilidade
        await addDoc(compatRef, {
          partId: productId,
          vehicleId,
          anoInicio: suggestion.anoInicio,
          anoFim: suggestion.anoFim,
          fonte: 'AI',
          evidencias: suggestion.evidencias,
          confidenceScore: suggestion.confidenceScore,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        saved.push(suggestion);
      }
    } catch (error) {
      console.error('Erro ao salvar compatibilidade:', error);
    }
  }
  
  return saved;
};

export default {
  analyzeProductCompatibility,
  analyzeAllProducts,
  saveSuggestedCompatibilities
};
