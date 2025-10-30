/**
 * Script para limpar cache da placa FRD4486
 * Execute: node src/scripts/clear-cache-frd4486.js
 */

import { deletePlateFromCache } from '../services/vehicleCacheService.js';

async function clearCache() {
    console.log('🗑️  Limpando cache da placa FRD4486...\n');
    
    try {
        const result = await deletePlateFromCache('FRD4486');
        
        if (result) {
            console.log('\n✅ Cache limpo com sucesso!');
            console.log('📝 Próxima busca irá pegar dados atualizados do scraper');
        } else {
            console.log('\n⚠️  Placa não estava no cache ou já foi removida');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Erro ao limpar cache:', error);
        process.exit(1);
    }
}

clearCache();
