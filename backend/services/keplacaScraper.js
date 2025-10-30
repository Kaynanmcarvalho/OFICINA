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

        // Extrai dados da página com seletores mais precisos
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

            // Função auxiliar para extrair valor após label
            const extractValue = (labelText) => {
                // Tenta encontrar o elemento com o label
                const allText = document.body.innerText;
                const regex = new RegExp(`${labelText}:\\s*([^\\n]+)`, 'i');
                const match = allText.match(regex);
                return match ? match[1].trim() : '';
            };

            // Extrai cada campo individualmente
            result.marca = extractValue('Marca');
            result.modelo = extractValue('Modelo');
            
            // Para o ano, pega apenas os 4 dígitos
            const anoText = extractValue('Ano');
            const anoMatch = anoText.match(/(\d{4})/);
            result.ano = anoMatch ? anoMatch[1] : '';
            
            result.cor = extractValue('Cor');
            result.tipo = extractValue('Combustível');
            result.chassi = extractValue('Chassi');
            result.uf = extractValue('UF');
            result.municipio = extractValue('Município');

            // Limpa dados - remove quebras de linha e espaços extras
            Object.keys(result).forEach(key => {
                if (typeof result[key] === 'string') {
                    result[key] = result[key]
                        .replace(/\n/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
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

        // Limpa campos específicos
        // Remove texto extra que pode vir após o valor
        if (data.marca) {
            data.marca = data.marca.split(/Modelo:|Importado:/i)[0].trim();
        }
        if (data.modelo) {
            data.modelo = data.modelo.split(/Importado:|Ano:|Cor:/i)[0].trim();
        }
        if (data.cor) {
            data.cor = data.cor.split(/Combustível:|Chassi:/i)[0].trim();
        }

        console.log('[KEPLACA] ✅ Dados extraídos!');
        console.log(`[KEPLACA] 📦 Marca: ${data.marca} | Modelo: ${data.modelo} | Ano: ${data.ano} | Cor: ${data.cor}`);

        return {
            success: true,
            data: {
                placa: cleanPlate,
                marca: data.marca,
                modelo: data.modelo,
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
