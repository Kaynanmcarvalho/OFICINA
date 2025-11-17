/**
 * Script de teste local
 * Testa os scrapers sem deploy
 */

const RecallScraper = require('./scrapers/recallScraper');
const LeilaoScraper = require('./scrapers/leilaoScraper');
const SinistroScraper = require('./scrapers/sinistroScraper');

async function testScrapers() {
  console.log('🧪 Iniciando testes dos scrapers...\n');

  const testPlaca = 'ABC1234';

  // Teste Recall Scraper
  console.log('📋 Testando Recall Scraper...');
  try {
    const recallScraper = new RecallScraper();
    const recalls = await recallScraper.scrape(testPlaca);
    console.log(`✅ Recalls encontrados: ${recalls.length}`);
    if (recalls.length > 0) {
      console.log('Exemplo:', JSON.stringify(recalls[0], null, 2));
    }
  } catch (error) {
    console.error('❌ Erro no Recall Scraper:', error.message);
  }

  console.log('\n---\n');

  // Teste Leilão Scraper
  console.log('🔨 Testando Leilão Scraper...');
  try {
    const leilaoScraper = new LeilaoScraper();
    const leiloes = await leilaoScraper.scrape(testPlaca);
    console.log(`✅ Leilões encontrados: ${leiloes.length}`);
    if (leiloes.length > 0) {
      console.log('Exemplo:', JSON.stringify(leiloes[0], null, 2));
    }
  } catch (error) {
    console.error('❌ Erro no Leilão Scraper:', error.message);
  }

  console.log('\n---\n');

  // Teste Sinistro Scraper
  console.log('🚨 Testando Sinistro Scraper...');
  try {
    const sinistroScraper = new SinistroScraper();
    const sinistros = await sinistroScraper.scrape(testPlaca);
    console.log(`✅ Sinistros encontrados: ${sinistros.length}`);
    if (sinistros.length > 0) {
      console.log('Exemplo:', JSON.stringify(sinistros[0], null, 2));
    }
  } catch (error) {
    console.error('❌ Erro no Sinistro Scraper:', error.message);
  }

  console.log('\n✨ Testes concluídos!\n');
}

// Executar testes
testScrapers().catch(console.error);
