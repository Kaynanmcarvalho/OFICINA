/**
 * Utilitários de debug para o sistema de imagens de veículos
 * Use no console do navegador para testar e controlar a API
 */

import { 
  enableAPI, 
  disableAPI, 
  getCacheStats, 
  clearImageCache,
  searchVehicleImageCached 
} from '../services/vehicleImageService';

// Disponibilizar no window para uso no console
if (typeof window !== 'undefined') {
  window.VehicleImageDebug = {
    // Controles da API
    enableAPI,
    disableAPI,
    
    // Cache
    getCacheStats,
    clearCache: clearImageCache,
    
    // Testes
    async testSearch(vehicleName) {
      console.log(`🔍 Testando busca para: "${vehicleName}"`);
      const result = await searchVehicleImageCached(vehicleName);
      
      if (result) {
        console.log('✅ Imagem encontrada:', result);
      } else {
        console.log('❌ Nenhuma imagem encontrada');
      }
      
      return result;
    },
    
    // Estatísticas
    showStats() {
      const stats = getCacheStats();
      console.log('📊 Estatísticas do Cache:');
      console.log(`   Itens em cache: ${stats.size}`);
      console.log(`   API desabilitada: ${stats.apiDisabled}`);
      console.log(`   Chaves:`, stats.keys);
      return stats;
    },
    
    // Testes rápidos
    async quickTest() {
      console.log('🚀 Executando testes rápidos...');
      
      const testCases = [
        'Yamaha R3 2016',
        'Honda CB 600F',
        'Volkswagen Gol 2018',
        'Ford Ka 2020'
      ];
      
      for (const testCase of testCases) {
        await this.testSearch(testCase);
      }
      
      this.showStats();
    },
    
    // Limpar tudo e reabilitar
    reset() {
      clearImageCache();
      enableAPI();
      console.log('🔄 Cache limpo e API reabilitada');
    }
  };
  
  console.log('🛠️ VehicleImageDebug carregado! Use no console:');
  console.log('   VehicleImageDebug.showStats() - Ver estatísticas');
  console.log('   VehicleImageDebug.testSearch("Yamaha R3") - Testar busca');
  console.log('   VehicleImageDebug.quickTest() - Testes rápidos');
  console.log('   VehicleImageDebug.enableAPI() - Reabilitar API');
  console.log('   VehicleImageDebug.disableAPI() - Desabilitar API');
  console.log('   VehicleImageDebug.reset() - Limpar cache e reabilitar');
}