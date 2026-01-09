/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TORQ - BASE DE DADOS DE VEÍCULOS (COMPARTILHADA)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Coleção: vehiclesDatabase (compartilhada entre todas as empresas)
 * Documento ID: placa do veículo (ex: ABC1234)
 * 
 * Estrutura do documento:
 * {
 *   placa: "ABC1234",
 *   marca: "VOLKSWAGEN",
 *   modelo: "GOL 1.0",
 *   ano: "2020",
 *   cor: "Branca",
 *   combustivel: "Flex",
 *   municipio: "São Paulo",
 *   uf: "SP",
 *   chassi: "9BWAG...",
 *   fonte: "keplaca",           // Fonte original dos dados
 *   createdAt: Timestamp,       // Quando foi adicionado
 *   updatedAt: Timestamp,       // Última atualização
 *   consultCount: 5,            // Quantas vezes foi consultado
 *   lastConsultAt: Timestamp    // Última consulta
 * }
 */

const { getFirestore, isFirebaseAvailable } = require('./firebaseAdmin');

const COLLECTION_NAME = 'vehiclesDatabase';

/**
 * Busca veículo na base de dados pelo número da placa
 * @param {string} plate - Placa do veículo
 * @returns {Promise<Object|null>} Dados do veículo ou null se não encontrado
 */
async function findVehicleByPlate(plate) {
  if (!isFirebaseAvailable()) {
    console.log('[VEHICLE_DB] ⚠️ Firebase não disponível');
    return null;
  }

  try {
    const db = getFirestore();
    const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    console.log(`[VEHICLE_DB] 🔍 Buscando placa ${cleanPlate} na base própria...`);
    
    const docRef = db.collection(COLLECTION_NAME).doc(cleanPlate);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      console.log(`[VEHICLE_DB] ✅ ENCONTRADO! ${data.marca} ${data.modelo}`);
      
      // Atualiza contador de consultas (fire and forget)
      docRef.update({
        consultCount: (data.consultCount || 0) + 1,
        lastConsultAt: new Date()
      }).catch(() => {});
      
      return {
        placa: cleanPlate,
        marca: data.marca,
        modelo: data.modelo,
        ano: data.ano,
        cor: data.cor,
        combustivel: data.combustivel,
        municipio: data.municipio,
        uf: data.uf,
        chassi: data.chassi,
        fonte: 'database', // Indica que veio da nossa base
        fromDatabase: true
      };
    }
    
    console.log(`[VEHICLE_DB] ❌ Placa ${cleanPlate} não encontrada na base`);
    return null;
  } catch (error) {
    console.error('[VEHICLE_DB] ❌ Erro ao buscar:', error.message);
    return null;
  }
}

/**
 * Salva ou atualiza veículo na base de dados
 * @param {Object} vehicleData - Dados do veículo
 * @returns {Promise<boolean>} True se salvou com sucesso
 */
async function saveVehicle(vehicleData) {
  if (!isFirebaseAvailable()) {
    console.log('[VEHICLE_DB] ⚠️ Firebase não disponível, não salvou');
    return false;
  }

  try {
    const db = getFirestore();
    const cleanPlate = vehicleData.placa.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // Verifica se já existe
    const docRef = db.collection(COLLECTION_NAME).doc(cleanPlate);
    const existingDoc = await docRef.get();
    
    const now = new Date();
    
    if (existingDoc.exists) {
      // Atualiza documento existente (mantém dados antigos se novos estiverem vazios)
      const existing = existingDoc.data();
      await docRef.update({
        marca: vehicleData.marca || existing.marca,
        modelo: vehicleData.modelo || existing.modelo,
        ano: vehicleData.ano || existing.ano,
        cor: vehicleData.cor || existing.cor,
        combustivel: vehicleData.combustivel || existing.combustivel,
        municipio: vehicleData.municipio || existing.municipio,
        uf: vehicleData.uf || existing.uf,
        chassi: vehicleData.chassi || existing.chassi,
        fonte: vehicleData.fonte || existing.fonte,
        updatedAt: now,
        consultCount: (existing.consultCount || 0) + 1,
        lastConsultAt: now
      });
      console.log(`[VEHICLE_DB] 📝 Atualizado: ${cleanPlate}`);
    } else {
      // Cria novo documento
      await docRef.set({
        placa: cleanPlate,
        marca: vehicleData.marca || '',
        modelo: vehicleData.modelo || '',
        ano: vehicleData.ano || '',
        cor: vehicleData.cor || '',
        combustivel: vehicleData.combustivel || '',
        municipio: vehicleData.municipio || '',
        uf: vehicleData.uf || '',
        chassi: vehicleData.chassi || '',
        fonte: vehicleData.fonte || 'unknown',
        createdAt: now,
        updatedAt: now,
        consultCount: 1,
        lastConsultAt: now
      });
      console.log(`[VEHICLE_DB] ✅ Novo veículo salvo: ${cleanPlate} - ${vehicleData.marca} ${vehicleData.modelo}`);
    }
    
    return true;
  } catch (error) {
    console.error('[VEHICLE_DB] ❌ Erro ao salvar:', error.message);
    return false;
  }
}

/**
 * Obtém estatísticas da base de dados
 * @returns {Promise<Object>} Estatísticas
 */
async function getStats() {
  if (!isFirebaseAvailable()) {
    return { available: false };
  }

  try {
    const db = getFirestore();
    const snapshot = await db.collection(COLLECTION_NAME).count().get();
    const count = snapshot.data().count;
    
    return {
      available: true,
      totalVehicles: count
    };
  } catch (error) {
    return { available: false, error: error.message };
  }
}

module.exports = {
  findVehicleByPlate,
  saveVehicle,
  getStats,
  COLLECTION_NAME
};
