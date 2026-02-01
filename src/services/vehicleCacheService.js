import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, deleteDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

/**
 * Service para gerenciar cache de placas no Firebase
 * Cache compartilhado entre todos os clientes do SaaS
 */

const VEHICLES_CACHE_COLLECTION = 'vehiclesCache';

/**
 * Busca placa no cache do Firebase
 * @param {string} plate - Placa do veículo
 * @returns {Promise<Object|null>} Dados do veículo ou null se não encontrado
 */
export const getVehicleFromCache = async (plate) => {
    try {
        const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
        
        const docRef = doc(db, VEHICLES_CACHE_COLLECTION, cleanPlate);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            }`);
            
            return {
                success: true,
                source: 'cache',
                data: data.vehicleData,
                cachedAt: data.lastUpdated?.toDate?.(),
                hitCount: data.hitCount || 1
            };
        }
        
        return null;
        
    } catch (error) {
        console.error('[CACHE] ❌ Erro ao buscar no cache:', error);
        return null;
    }
};

/**
 * Salva dados da placa no cache do Firebase
 * APENAS se todos os campos obrigatórios estiverem preenchidos
 * @param {string} plate - Placa do veículo
 * @param {Object} vehicleData - Dados do veículo
 * @returns {Promise<boolean>} True se salvou com sucesso
 */
export const saveVehicleToCache = async (plate, vehicleData) => {
    try {
        const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
        
        // ✅ VALIDAÇÃO: Só salva se TODOS os campos obrigatórios estiverem preenchidos
        const requiredFields = ['marca', 'modelo', 'ano', 'cor'];
        const missingFields = requiredFields.filter(field => !vehicleData[field] || vehicleData[field].trim() === '');
        
        if (missingFields.length > 0) {
            }`);
            return false;
        }
        
        const docRef = doc(db, VEHICLES_CACHE_COLLECTION, cleanPlate);
        
        // Verifica se já existe para incrementar hitCount
        const existingDoc = await getDoc(docRef);
        const hitCount = existingDoc.exists() ? (existingDoc.data().hitCount || 0) + 1 : 1;
        
        await setDoc(docRef, {
            placa: cleanPlate,
            vehicleData: {
                placa: cleanPlate,
                marca: vehicleData.marca,
                modelo: vehicleData.modelo,
                ano: vehicleData.ano,
                cor: vehicleData.cor,
                tipo: vehicleData.tipo || '',
                chassi: vehicleData.chassi || '',
                municipio: vehicleData.municipio || '',
                uf: vehicleData.uf || ''
            },
            lastUpdated: serverTimestamp(),
            createdAt: existingDoc.exists() ? existingDoc.data().createdAt : serverTimestamp(),
            hitCount: hitCount,
            source: 'keplaca', // Origem dos dados
            isComplete: true // Flag indicando que tem todos os campos
        });

        return true;
        
    } catch (error) {
        console.error('[CACHE] ❌ Erro ao salvar no cache:', error);
        return false;
    }
};

/**
 * Atualiza contador de hits de uma placa no cache
 * @param {string} plate - Placa do veículo
 */
export const incrementCacheHit = async (plate) => {
    try {
        const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
        const docRef = doc(db, VEHICLES_CACHE_COLLECTION, cleanPlate);
        
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const currentHitCount = docSnap.data().hitCount || 0;
            await setDoc(docRef, {
                ...docSnap.data(),
                hitCount: currentHitCount + 1,
                lastAccessed: serverTimestamp()
            });
            }
    } catch (error) {
        console.error('[CACHE] ❌ Erro ao incrementar hit count:', error);
    }
};

/**
 * Busca placas mais consultadas (estatísticas)
 * @param {number} limit - Número de resultados
 * @returns {Promise<Array>} Lista de placas mais consultadas
 */
export const getMostSearchedPlates = async (limit = 10) => {
    try {
        const q = query(
            collection(db, VEHICLES_CACHE_COLLECTION),
            where('hitCount', '>', 1)

        const querySnapshot = await getDocs(q);
        const plates = [];
        
        querySnapshot.forEach((doc) => {
            plates.push({
                placa: doc.id,
                ...doc.data()
            });
        });
        
        // Ordena por hitCount decrescente
        plates.sort((a, b) => (b.hitCount || 0) - (a.hitCount || 0));
        
        return plates.slice(0, limit);
        
    } catch (error) {
        console.error('[CACHE] ❌ Erro ao buscar placas mais consultadas:', error);
        return [];
    }
};

/**
 * Obtém estatísticas do cache
 * @returns {Promise<Object>} Estatísticas do cache
 */
export const getCacheStats = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, VEHICLES_CACHE_COLLECTION));
        
        let totalPlates = 0;
        let totalHits = 0;
        
        querySnapshot.forEach((doc) => {
            totalPlates++;
            totalHits += doc.data().hitCount || 1;
        });
        
        return {
            totalPlates,
            totalHits,
            averageHitsPerPlate: totalPlates > 0 ? (totalHits / totalPlates).toFixed(2) : 0
        };
        
    } catch (error) {
        console.error('[CACHE] ❌ Erro ao obter estatísticas:', error);
        return {
            totalPlates: 0,
            totalHits: 0,
            averageHitsPerPlate: 0
        };
    }
};

/**
 * Verifica se uma placa precisa ser atualizada (mais de 30 dias)
 * @param {string} plate - Placa do veículo
 * @returns {Promise<boolean>} True se precisa atualizar
 */
export const needsCacheUpdate = async (plate) => {
    try {
        const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
        const docRef = doc(db, VEHICLES_CACHE_COLLECTION, cleanPlate);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            return true; // Não existe, precisa buscar
        }
        
        const lastUpdated = docSnap.data().lastUpdated?.toDate?.();
        if (!lastUpdated) {
            return true;
        }
        
        // Verifica se tem mais de 30 dias
        const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceUpdate > 30;
        
    } catch (error) {
        console.error('[CACHE] ❌ Erro ao verificar necessidade de atualização:', error);
        return true; // Em caso de erro, busca novamente
    }
};

/**
 * Deleta uma placa específica do cache
 * @param {string} plate - Placa do veículo
 * @returns {Promise<boolean>} True se deletou com sucesso
 */
export const deletePlateFromCache = async (plate) => {
    try {
        const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
        
        const docRef = doc(db, VEHICLES_CACHE_COLLECTION, cleanPlate);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            return false;
        }
        
        await deleteDoc(docRef);
        return true;
        
    } catch (error) {
        console.error('[CACHE] ❌ Erro ao deletar do cache:', error);
        return false;
    }
};
