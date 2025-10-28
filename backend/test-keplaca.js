/**
 * Script de teste para debugar o scraper do Keplaca.com
 * Uso: node test-keplaca.js RFV6C13
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testKeplaca(plate) {
    const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    console.log('='.repeat(60));
    console.log(`🔍 TESTANDO KEPLACA.COM - PLACA: ${cleanPlate}`);
    console.log('='.repeat(60));

    // Procura Chrome
    const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.CHROME_PATH
    ].filter(Boolean);

    let executablePath = chromePaths.find(path => fs.existsSync(path));

    if (!executablePath) {
        console.error('❌ Chrome não encontrado!');
        console.log('Instale o Chrome ou defina CHROME_PATH');
        process.exit(1);
    }

    console.log(`✅ Chrome encontrado: ${executablePath}`);

    let browser = null;
    let page = null;

    try {
        console.log('\n📡 Iniciando browser...');
        browser = await puppeteer.launch({
            executablePath,
            headless: false, // MODO VISÍVEL para debug
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--window-size=1920,1080',
                '--disable-blink-features=AutomationControlled'
            ]
        });

        page = await browser.newPage();

        // Remove detecção de automação
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
            Object.defineProperty(navigator, 'languages', {
                get: () => ['pt-BR', 'pt', 'en-US', 'en'],
            });
        });

        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        });

        const url = `https://www.keplaca.com/placa/${cleanPlate}`;
        console.log(`\n🌐 Acessando: ${url}`);

        const response = await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        console.log(`📡 Status HTTP: ${response.status()}`);

        // Aguarda carregar
        console.log('⏳ Aguardando página carregar...');
        await new Promise(resolve => setTimeout(resolve, 8000));

        // Tira screenshot
        const screenshotPath = `debug-${cleanPlate}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Screenshot salvo: ${screenshotPath}`);

        // Salva HTML
        const html = await page.content();
        const htmlPath = `debug-${cleanPlate}.html`;
        fs.writeFileSync(htmlPath, html);
        console.log(`📄 HTML salvo: ${htmlPath}`);

        // Extrai dados
        console.log('\n🔍 Extraindo dados...\n');

        const data = await page.evaluate(() => {
            const result = {
                marca: '',
                modelo: '',
                ano: '',
                cor: '',
                tipo: '',
                chassi: '',
                municipio: '',
                uf: '',
                debug: {
                    title: document.title,
                    bodyLength: document.body.innerText.length,
                    hasCloudflare: document.body.innerText.includes('Cloudflare'),
                    hasReCaptcha: document.body.innerText.includes('reCAPTCHA'),
                    allText: document.body.innerText.substring(0, 1000)
                }
            };

            // Busca todos os elementos de texto
            const allElements = document.querySelectorAll('*');
            const textPairs = [];

            allElements.forEach(elem => {
                const text = elem.textContent?.trim();
                if (text && text.length < 100) {
                    textPairs.push(text);
                }
            });

            result.debug.textPairs = textPairs.slice(0, 50);

            // Estratégia 1: Seletores comuns
            const selectors = {
                marca: ['.marca', '[data-field="marca"]', '.vehicle-brand', '#marca'],
                modelo: ['.modelo', '[data-field="modelo"]', '.vehicle-model', '#modelo'],
                ano: ['.ano', '[data-field="ano"]', '.vehicle-year', '#ano'],
                cor: ['.cor', '[data-field="cor"]', '.vehicle-color', '#cor']
            };

            Object.keys(selectors).forEach(key => {
                for (const selector of selectors[key]) {
                    const elem = document.querySelector(selector);
                    if (elem && elem.textContent.trim()) {
                        result[key] = elem.textContent.trim();
                        break;
                    }
                }
            });

            // Estratégia 2: Busca em tabelas
            document.querySelectorAll('tr, .row, .info-row, .data-row').forEach(row => {
                const cells = row.querySelectorAll('td, th, .cell, .col, span, div, strong, b');
                if (cells.length >= 2) {
                    const label = cells[0].textContent.trim().toLowerCase();
                    const value = cells[1].textContent.trim();
                    
                    if (label.includes('marca') && !result.marca) result.marca = value;
                    if (label.includes('modelo') && !result.modelo) result.modelo = value;
                    if (label.includes('ano') && !result.ano) result.ano = value;
                    if (label.includes('cor') && !result.cor) result.cor = value;
                }
            });

            // Estratégia 3: Regex no texto
            const bodyText = document.body.innerText;
            
            if (!result.marca) {
                const marcaMatch = bodyText.match(/Marca[:\s]+([A-Z\/\s]+?)(?=\s*Modelo|Ano|Cor|Tipo|\n|$)/i);
                if (marcaMatch) result.marca = marcaMatch[1].trim();
            }
            
            if (!result.modelo) {
                const modeloMatch = bodyText.match(/Modelo[:\s]+([A-Z0-9\/\s\-\.]+?)(?=\s*Ano|Cor|Tipo|\n|$)/i);
                if (modeloMatch) result.modelo = modeloMatch[1].trim();
            }
            
            if (!result.ano) {
                const anoMatch = bodyText.match(/Ano[:\s]+(\d{4})/i);
                if (anoMatch) result.ano = anoMatch[1];
            }

            if (!result.cor) {
                const corMatch = bodyText.match(/Cor[:\s]+([A-Z]+?)(?=\s*Tipo|Chassi|\n|$)/i);
                if (corMatch) result.cor = corMatch[1].trim();
            }

            return result;
        });

        console.log('📦 DADOS EXTRAÍDOS:');
        console.log('='.repeat(60));
        console.log(`Marca:     ${data.marca || '(não encontrado)'}`);
        console.log(`Modelo:    ${data.modelo || '(não encontrado)'}`);
        console.log(`Ano:       ${data.ano || '(não encontrado)'}`);
        console.log(`Cor:       ${data.cor || '(não encontrado)'}`);
        console.log(`Tipo:      ${data.tipo || '(não encontrado)'}`);
        console.log('='.repeat(60));

        console.log('\n🐛 DEBUG INFO:');
        console.log(`Title: ${data.debug.title}`);
        console.log(`Body Length: ${data.debug.bodyLength} chars`);
        console.log(`Has Cloudflare: ${data.debug.hasCloudflare}`);
        console.log(`Has reCAPTCHA: ${data.debug.hasReCaptcha}`);
        
        console.log('\n📝 Primeiros 1000 caracteres do body:');
        console.log('-'.repeat(60));
        console.log(data.debug.allText);
        console.log('-'.repeat(60));

        console.log('\n📋 Primeiros 50 elementos de texto:');
        data.debug.textPairs.forEach((text, i) => {
            console.log(`${i + 1}. ${text}`);
        });

        console.log('\n✅ Teste concluído!');
        console.log(`📸 Veja o screenshot: ${screenshotPath}`);
        console.log(`📄 Veja o HTML: ${htmlPath}`);

        // Aguarda 5 segundos antes de fechar
        console.log('\n⏳ Aguardando 5 segundos antes de fechar...');
        await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
        console.error(error.stack);
    } finally {
        if (page) await page.close();
        if (browser) await browser.close();
    }
}

// Executa
const plate = process.argv[2] || 'RFV6C13';
testKeplaca(plate).then(() => {
    console.log('\n✅ Script finalizado');
    process.exit(0);
}).catch(err => {
    console.error('\n❌ Erro fatal:', err);
    process.exit(1);
});
