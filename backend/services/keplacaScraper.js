const puppeteer = require('puppeteer-core');

// Cache para armazenar instância do browser
let browserInstance = null;

/**
 * Obtém ou cria uma instância do browser
 */
async function getBrowser() {
    if (browserInstance && browserInstance.isConnected()) {
        return browserInstance;
    }

    console.log('[PUPPETEER] 🚀 Iniciando browser...');
    
    // Tenta encontrar o Chrome instalado no sistema
    const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.CHROME_PATH,
        process.env.PUPPETEER_EXECUTABLE_PATH
    ].filter(Boolean);

    let executablePath = chromePaths.find(path => {
        try {
            const fs = require('fs');
            return fs.existsSync(path);
        } catch {
            return false;
        }
    });

    if (!executablePath) {
        throw new Error('Chrome não encontrado. Instale o Google Chrome.');
    }

    browserInstance = await puppeteer.launch({
        executablePath,
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-extensions',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1920,1080',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });

    console.log('[PUPPETEER] ✅ Browser iniciado');
    return browserInstance;
}

/**
 * Scraper do keplaca.com usando Puppeteer
 */
async function scrapeKeplaca(plate) {
    const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
    let page = null;

    try {
        console.log(`[KEPLACA] 🔍 Consultando placa: ${cleanPlate}`);

        const browser = await getBrowser();
        page = await browser.newPage();
        
        // Desabilita cache para evitar HTTP 304
        await page.setCacheEnabled(false);
        
        // Timeout global para a página
        page.setDefaultTimeout(30000);
        page.setDefaultNavigationTimeout(30000);
        
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
            // Remove chrome automation
            window.chrome = {
                runtime: {}
            };
        });
        
        // Configura viewport e user agent
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Configura headers extras
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'pt-BR,pt;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        });

        console.log(`[KEPLACA] 🌐 Acessando keplaca.com...`);
        
        // Navega para a página com timeout reduzido
        const response = await page.goto(`https://www.keplaca.com/placa/${cleanPlate}`, {
            waitUntil: 'domcontentloaded', // Mais rápido que networkidle2
            timeout: 25000
        });

        console.log(`[KEPLACA] 📡 Status HTTP: ${response.status()}`);

        // Aceita 200 e 304 (Not Modified)
        if (response.status() !== 200 && response.status() !== 304) {
            throw new Error(`HTTP ${response.status()}`);
        }

        // Aguarda menos tempo
        console.log('[KEPLACA] ⏳ Aguardando conteúdo...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Extrai dados da página
        const data = await page.evaluate(() => {
            const result = {
                marca: '',
                modelo: '',
                ano: '',
                cor: '',
                tipo: '',
                chassi: '',
                municipio: '',
                uf: ''
            };

            const bodyText = document.body.innerText;
            
            // Extrai Marca
            const marcaMatch = bodyText.match(/Marca:\s*([A-Z\/\s]+?)(?=\s*Modelo:|$)/i);
            if (marcaMatch) result.marca = marcaMatch[1].trim();
            
            // Extrai Modelo
            const modeloMatch = bodyText.match(/Modelo:\s*([A-Z0-9\/\s\-\.]+?)(?=\s*Importado:|Ano:|$)/i);
            if (modeloMatch) result.modelo = modeloMatch[1].trim();
            
            // Extrai Ano
            const anoMatch = bodyText.match(/Ano:\s*(\d{4})/i);
            if (anoMatch) result.ano = anoMatch[1];
            
            // Extrai Cor
            const corMatch = bodyText.match(/Cor:\s*([A-Za-z]+?)(?=\s*Combustível:|Chassi:|$)/i);
            if (corMatch) result.cor = corMatch[1].trim();

            // Extrai Combustível
            const combustivelMatch = bodyText.match(/Combustível:\s*([A-Za-z]+?)(?=\s*Chassi:|UF:|$)/i);
            if (combustivelMatch) result.tipo = combustivelMatch[1].trim();

            // Extrai Chassi
            const chassiMatch = bodyText.match(/Chassi:\s*([A-Z0-9\*]+?)(?=\s*UF:|Município:|$)/i);
            if (chassiMatch) result.chassi = chassiMatch[1].trim();

            // Extrai UF
            const ufMatch = bodyText.match(/UF:\s*([A-Z]{2})/i);
            if (ufMatch) result.uf = ufMatch[1];

            // Extrai Município
            const municipioMatch = bodyText.match(/Município:\s*([A-Z\s]+?)(?=\s*Esta placa|Valores FIPE|$)/i);
            if (municipioMatch) result.municipio = municipioMatch[1].trim();

            // Limpa dados
            Object.keys(result).forEach(key => {
                if (typeof result[key] === 'string') {
                    result[key] = result[key].replace(/\s+/g, ' ').trim();
                }
            });

            return result;
        });

        // Fecha a página imediatamente
        await page.close();
        page = null;

        // Verifica se encontrou dados
        if (!data.marca && !data.modelo) {
            console.log('[KEPLACA] ❌ Nenhum dado encontrado');
            return {
                success: false,
                error: 'Placa não encontrada'
            };
        }

        // Monta o modelo completo
        let modeloCompleto = '';
        if (data.marca) modeloCompleto += data.marca;
        if (data.modelo) modeloCompleto += (modeloCompleto ? ' ' : '') + data.modelo;
        if (data.ano) modeloCompleto += (modeloCompleto ? ' ' : '') + data.ano;

        console.log('[KEPLACA] ✅ Dados extraídos!');
        console.log(`[KEPLACA] 📦 ${data.marca} ${data.modelo} ${data.ano}`);

        return {
            success: true,
            data: {
                placa: cleanPlate,
                marca: data.marca,
                modelo: modeloCompleto || data.modelo,
                ano: data.ano,
                cor: data.cor,
                tipo: data.tipo,
                chassi: data.chassi,
                municipio: data.municipio,
                uf: data.uf
            }
        };

    } catch (error) {
        console.error('[KEPLACA] ❌ Erro:', error.message);
        if (page) {
            try {
                await page.close();
            } catch (e) {
                // Ignora erro ao fechar
            }
        }
        
        return {
            success: false,
            error: 'Erro ao consultar: ' + error.message
        };
    }
}

// Cleanup ao encerrar o processo
process.on('exit', () => {
    if (browserInstance) {
        browserInstance.close().catch(() => {});
    }
});

process.on('SIGINT', () => {
    if (browserInstance) {
        browserInstance.close().catch(() => {});
    }
    process.exit();
});

module.exports = { scrapeKeplaca };
