/**
 * Compatibility Service - Gerencia compatibilidade de peças com veículos
 * Integra com Firestore e calcula confidence scores
 */

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Pesos para cálculo de confidence score
const SOURCE_WEIGHTS = {
  OEM: 50,
  Marketplace: 30,
  Forum: 15,
  CoPurchase: 10
};

/**
 * Calcula o confidence score baseado nas fontes
 * @param {Array} sources - Array de objetos com tipo de fonte
 * @returns {number} Score de 0 a 100
 */
export const calculateConfidenceScore = (sources = []) => {
  if (!sources || sources.length === 0) return 0;
  
  const score = sources.reduce((acc, source) => {
    return acc + (SOURCE_WEIGHTS[source.tipo] || 0);
  }, 0);
  
  return Math.min(100, score);
};

/**
 * Categoriza o nível de confiança
 * @param {number} score - Score de 0 a 100
 * @returns {object} Categoria com label e cor
 */
export const getConfidenceLevel = (score) => {
  if (score >= 80) {
    return { level: 'high', label: 'Alta', color: 'green' };
  } else if (score >= 50) {
    return { level: 'medium', label: 'Média', color: 'yellow' };
  } else {
    return { level: 'low', label: 'Baixa', color: 'red' };
  }
};

/**
 * Busca ou cria um veículo no Firestore
 * @param {object} vehicleData - Dados do veículo da FIPE
 * @returns {string} ID do documento do veículo
 */
export const getOrCreateVehicle = async (vehicleData) => {
  try {
    const { tipo, marca, modelo, anoInicio, anoFim } = vehicleData;
    
    // Buscar veículo existente
    const vehiclesRef = collection(db, 'vehicles');
    const q = query(
      vehiclesRef,
      where('marca', '==', marca),
      where('modelo', '==', modelo),
      where('tipo', '==', tipo)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    
    // Criar novo veículo
    const newVehicle = {
      marca,
      modelo,
      anoInicio: anoInicio || null,
      anoFim: anoFim || null,
      tipo,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(vehiclesRef, newVehicle);
    return docRef.id;
  } catch (error) {
    console.error('[Compatibility] Erro ao buscar/criar veículo:', error);
    throw error;
  }
};

/**
 * Busca peças compatíveis com um veículo
 * Busca tanto no Firestore quanto nos produtos do inventário
 * @param {string} vehicleId - ID do veículo
 * @param {number} ano - Ano do veículo
 * @param {object} vehicleData - Dados do veículo (marca, modelo, tipo)
 * @param {Array} inventoryProducts - Produtos do inventário (opcional)
 * @returns {Array} Lista de peças compatíveis com scores
 */
export const findCompatibleParts = async (vehicleId, ano, vehicleData = null, inventoryProducts = []) => {
  try {
    // Buscar compatibilidades no Firestore
    const compatRef = collection(db, 'compatibility');
    const q = query(
      compatRef,
      where('vehicleId', '==', vehicleId)
    );
    
    const snapshot = await getDocs(q);
    const compatibilities = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Verificar se o ano está no range
      if (
        (!data.anoInicio || ano >= data.anoInicio) &&
        (!data.anoFim || ano <= data.anoFim)
      ) {
        compatibilities.push({
          id: doc.id,
          ...data,
          confidenceScore: calculateConfidenceScore(data.evidencias || [])
        });
      }
    });
    
    // Buscar detalhes das peças do Firestore
    const partsWithDetails = await Promise.all(
      compatibilities.map(async (compat) => {
        const partDoc = await getDoc(doc(db, 'parts', compat.partId));
        if (partDoc.exists()) {
          return {
            ...compat,
            part: {
              id: partDoc.id,
              ...partDoc.data()
            }
          };
        }
        return null;
      })
    );
    
    // Buscar também nos produtos do inventário (busca inteligente)
    let inventoryMatches = [];
    if (inventoryProducts && inventoryProducts.length > 0 && vehicleData) {
      inventoryMatches = searchInventoryProducts(inventoryProducts, vehicleData);
    }
    
    // Combinar resultados
    const allParts = [
      ...partsWithDetails.filter(item => item !== null),
      ...inventoryMatches
    ];
    
    // Remover duplicatas (se houver)
    const uniqueParts = allParts.reduce((acc, current) => {
      const exists = acc.find(item => 
        item.part?.id === current.part?.id || 
        item.part?.name === current.part?.name
      );
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    // Ordenar por confidence score
    return uniqueParts.sort((a, b) => b.confidenceScore - a.confidenceScore);
      
  } catch (error) {
    console.error('[Compatibility] Erro ao buscar peças compatíveis:', error);
    throw error;
  }
};

/**
 * Busca inteligente nos produtos do inventário
 * @param {Array} products - Produtos do inventário
 * @param {object} vehicleData - Dados do veículo
 * @returns {Array} Produtos compatíveis
 */
function searchInventoryProducts(products, vehicleData) {
  const { marca, modelo, tipo } = vehicleData;
  const matches = [];
  
  products.forEach(product => {
    let score = 0;
    const evidencias = [];
    
    // Buscar no nome do produto
    const productName = (product.name || '').toLowerCase();
    const productDesc = (product.description || '').toLowerCase();
    const productCategory = (product.category || '').toLowerCase();
    
    const marcaLower = marca.toLowerCase();
    const modeloLower = modelo.toLowerCase();
    
    // Verificar marca no nome ou descrição
    if (productName.includes(marcaLower) || productDesc.includes(marcaLower)) {
      score += 20;
      evidencias.push({
        tipo: 'Marketplace',
        descricao: `Marca "${marca}" encontrada no produto`,
        data: new Date().toISOString()
      });
    }
    
    // Verificar modelo no nome ou descrição
    if (productName.includes(modeloLower) || productDesc.includes(modeloLower)) {
      score += 20;
      evidencias.push({
        tipo: 'Marketplace',
        descricao: `Modelo "${modelo}" encontrado no produto`,
        data: new Date().toISOString()
      });
    }
    
    // Produtos universais (óleos, fluidos, etc)
    const universalKeywords = [
      'universal', 'todos', 'qualquer', 'genérico', 'compatível',
      'óleo', 'oleo', 'fluido', 'aditivo', 'lubrificante'
    ];
    
    const isUniversal = universalKeywords.some(keyword => 
      productName.includes(keyword) || 
      productDesc.includes(keyword) ||
      productCategory.includes(keyword)
    );
    
    if (isUniversal) {
      score += 30;
      evidencias.push({
        tipo: 'Marketplace',
        descricao: 'Produto universal compatível com múltiplos veículos',
        data: new Date().toISOString()
      });
    }
    
    // Verificar tipo de veículo
    const tipoKeywords = {
      motos: ['moto', 'motocicleta', 'bike'],
      carros: ['carro', 'auto', 'automóvel', 'veículo'],
      caminhoes: ['caminhão', 'caminhao', 'truck']
    };
    
    const tipoWords = tipoKeywords[tipo] || [];
    const matchesTipo = tipoWords.some(word => 
      productName.includes(word) || productDesc.includes(word)
    );
    
    if (matchesTipo) {
      score += 10;
      evidencias.push({
        tipo: 'Marketplace',
        descricao: `Produto específico para ${tipo}`,
        data: new Date().toISOString()
      });
    }
    
    // Se tiver alguma pontuação, adicionar aos resultados
    if (score > 0) {
      matches.push({
        id: `inventory-${product.id}`,
        partId: product.id,
        vehicleId: 'inventory-match',
        confidenceScore: Math.min(score, 100),
        evidencias,
        part: {
          id: product.id,
          nome: product.name,
          categoria: product.category,
          fabricante: product.brand,
          codigosOE: product.sku ? [product.sku] : [],
          imagemURL: product.image_url,
          // Dados adicionais do inventário
          preco: product.sale_price,
          estoque: product.stock_total,
          sku: product.sku
        }
      });
    }
  });
  
  return matches;
}

/**
 * Adiciona uma nova evidência de compatibilidade
 * @param {string} partId - ID da peça
 * @param {string} vehicleId - ID do veículo
 * @param {object} evidenceData - Dados da evidência
 */
export const addCompatibilityEvidence = async (partId, vehicleId, evidenceData) => {
  try {
    const compatRef = collection(db, 'compatibility');
    
    const newCompat = {
      partId,
      vehicleId,
      anoInicio: evidenceData.anoInicio || null,
      anoFim: evidenceData.anoFim || null,
      fonte: evidenceData.fonte || 'Manual',
      evidencias: evidenceData.evidencias || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await addDoc(compatRef, newCompat);
    
    console.log('[Compatibility] Evidência adicionada com sucesso');
  } catch (error) {
    console.error('[Compatibility] Erro ao adicionar evidência:', error);
    throw error;
  }
};

/**
 * Registra co-purchase (peças compradas juntas)
 * Aumenta o confidence score quando peças são vendidas para o mesmo veículo
 * @param {string} partId - ID da peça
 * @param {string} vehicleId - ID do veículo
 */
export const registerCoPurchase = async (partId, vehicleId) => {
  try {
    // Buscar compatibilidade existente
    const compatRef = collection(db, 'compatibility');
    const q = query(
      compatRef,
      where('partId', '==', partId),
      where('vehicleId', '==', vehicleId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Criar nova compatibilidade baseada em co-purchase
      await addCompatibilityEvidence(partId, vehicleId, {
        fonte: 'CoPurchase',
        evidencias: [{
          tipo: 'CoPurchase',
          descricao: 'Peça vendida para este veículo',
          data: new Date().toISOString()
        }]
      });
    } else {
      // Atualizar evidências existentes
      const docRef = doc(db, 'compatibility', snapshot.docs[0].id);
      const data = snapshot.docs[0].data();
      const evidencias = data.evidencias || [];
      
      evidencias.push({
        tipo: 'CoPurchase',
        descricao: 'Peça vendida para este veículo',
        data: new Date().toISOString()
      });
      
      await setDoc(docRef, {
        ...data,
        evidencias,
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('[Compatibility] Co-purchase registrado');
  } catch (error) {
    console.error('[Compatibility] Erro ao registrar co-purchase:', error);
  }
};
