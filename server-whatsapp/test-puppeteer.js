// Teste direto do Puppeteer
const puppeteer = require('puppeteer');

async function testPuppeteer() {
  console.log('🧪 Testando Puppeteer...');
  
  try {
    console.log('1️⃣ Iniciando browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    console.log('✅ Browser iniciado!');
    
    console.log('2️⃣ Abrindo página...');
    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    
    console.log('✅ Página aberta!');
    
    await browser.close();
    console.log('✅ SUCESSO! Puppeteer está funcionando!');
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
  }
}

testPuppeteer();
