/**
 * Script para limpar cache da placa FRD4486
 * Execute: node src/scripts/clear-cache-frd4486.js
 */

import { deletePlateFromCache } from '../services/vehicleCacheService.js';

async function clearCache() {
    try {
        const result = await deletePlateFromCache('FRD4486');
        
        if (result) {
            } else {
            }
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Erro ao limpar cache:', error);
        process.exit(1);
    }
}

clearCache();
