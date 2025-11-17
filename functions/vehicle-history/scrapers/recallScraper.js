/**
 * Recall Scraper
 * Scraper para consulta de recalls no site oficial do governo
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const UserAgent = require('user-agents');
const Logger = require('../utils/logger');

class RecallScraper {
  constructor() {
    this.logger = new Logger('RecallScraper');
    this.baseUrl = 'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/recall';
    this.timeout = 15000; // 15 segundos
    this.maxRetries = 3;
  }

  /**
   * Scrape recalls para uma placa específica
   */
  async scrape(placa) {
    let browser = null;
    let retries = 0;

    while (retries < this.maxRetries) {
      try {
        this.logger.info('Iniciando scraping de recalls', { placa, tentativa: retries + 1 });

        // Configurar browser
        browser = await this.launchBrowser();
        const page = await browser.newPage();

        // Configurar página
        await this.setupPage(page);

        // Navegar para o site
        await page.goto(this.baseUrl, {
          waitUntil: 'networkidle2',
          timeout: this.timeout
        });

        // Buscar por placa
        const recalls = await this.searchByPlaca(page, placa);

        await browser.close();
        browser = null;

        this.logger.info('Scraping de recalls concluído', {
          placa,
          recalls: recalls.length,
          tentativa: retries + 1
        });

        return recalls;

      } catch (error) {
        this.logger.error('Erro no scraping de recalls', {
          placa,
          tentativa: retries + 1,
          error: error.message
        });

        if (browser) {
          await browser.close().catch(() => {});
          browser = null;
        }

        retries++;
        if (retries >= this.maxRetries) {
          throw new Error(`Falha após ${this.maxRetries} tentativas: ${error.message}`);
        }

        // Aguardar antes de tentar novamente
        await this.sleep(2000 * retries);
      }
    }
  }

  /**
   * Configura e lança o browser
   */
  async launchBrowser() {
    return await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      timeout: this.timeout
    });
  }

  /**
   * Configura a página
   */
  async setupPage(page) {
    // User agent aleatório
    const userAgent = new UserAgent();
    await page.setUserAgent(userAgent.toString());

    // Viewport
    await page.setViewport({ width: 1366, height: 768 });

    // Timeout padrão
    page.setDefaultTimeout(this.timeout);

    // Interceptar requests desnecessários
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  /**
   * Busca recalls por placa
   */
  async searchByPlaca(page, placa) {
    try {
      // Aguardar página carregar
      await page.waitForSelector('body', { timeout: this.timeout });

      // Procurar campo de busca
      const searchSelector = await this.findSearchField(page);
      if (!searchSelector) {
        throw new Error('Campo de busca não encontrado');
      }

      // Limpar e digitar placa
      await page.click(searchSelector);
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyA');
      await page.keyboard.up('Control');
      await page.type(searchSelector, placa, { delay: 100 });

      // Buscar botão de pesquisa
      const searchButton = await this.findSearchButton(page);
      if (searchButton) {
        await page.click(searchButton);
      } else {
        await page.keyboard.press('Enter');
      }

      // Aguardar resultados
      await this.waitForResults(page);

      // Extrair dados
      const recalls = await this.extractRecalls(page, placa);

      return recalls;

    } catch (error) {
      this.logger.error('Erro na busca por placa', {
        placa,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Encontra campo de busca
   */
  async findSearchField(page) {
    const selectors = [
      'input[type="search"]',
      'input[name*="search"]',
      'input[name*="busca"]',
      'input[name*="placa"]',
      'input[placeholder*="placa"]',
      'input[placeholder*="busca"]',
      '#search',
      '#busca',
      '.search-input',
      '.busca-input'
    ];

    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        return selector;
      } catch (e) {
        continue;
      }
    }

    return null;
  }

  /**
   * Encontra botão de busca
   */
  async findSearchButton(page) {
    const selectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:contains("Buscar")',
      'button:contains("Pesquisar")',
      '.search-button',
      '.btn-search',
      '#search-btn'
    ];

    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 1000 });
        return selector;
      } catch (e) {
        continue;
      }
    }

    return null;
  }

  /**
   * Aguarda resultados da busca
   */
  async waitForResults(page) {
    try {
      // Aguardar um dos possíveis estados
      await Promise.race([
        page.waitForSelector('.results', { timeout: 10000 }),
        page.waitForSelector('.recall-item', { timeout: 10000 }),
        page.waitForSelector('.no-results', { timeout: 10000 }),
        page.waitForSelector('.sem-resultados', { timeout: 10000 }),
        this.sleep(5000) // Fallback
      ]);
    } catch (error) {
      this.logger.warn('Timeout aguardando resultados', { error: error.message });
    }
  }

  /**
   * Extrai dados dos recalls
   */
  async extractRecalls(page, placa) {
    try {
      const html = await page.content();
      const $ = cheerio.load(html);
      const recalls = [];

      // Seletores possíveis para itens de recall
      const itemSelectors = [
        '.recall-item',
        '.resultado-item',
        '.campanha-item',
        '.item-recall',
        'tr[data-recall]',
        '.table tbody tr'
      ];

      let items = $();
      for (const selector of itemSelectors) {
        items = $(selector);
        if (items.length > 0) break;
      }

      // Se não encontrou itens estruturados, tentar busca por texto
      if (items.length === 0) {
        items = this.findRecallsByText($, placa);
      }

      items.each((index, element) => {
        try {
          const recall = this.parseRecallItem($, $(element), placa);
          if (recall) {
            recalls.push(recall);
          }
        } catch (error) {
          this.logger.warn('Erro ao processar item de recall', {
            index,
            error: error.message
          });
        }
      });

      return recalls;

    } catch (error) {
      this.logger.error('Erro ao extrair recalls', {
        placa,
        error: error.message
      });
      return [];
    }
  }

  /**
   * Busca recalls por texto quando não há estrutura clara
   */
  findRecallsByText($, placa) {
    const items = $();
    
    // Procurar por menções da placa ou termos relacionados
    const searchTerms = [placa, 'recall', 'campanha', 'chamamento'];
    
    searchTerms.forEach(term => {
      $(`*:contains("${term}")`).each((i, el) => {
        const $el = $(el);
        if ($el.text().length > 20 && $el.text().length < 500) {
          items.push(el);
        }
      });
    });

    return items;
  }

  /**
   * Faz parse de um item de recall
   */
  parseRecallItem($, $item, placa) {
    const text = $item.text().trim();
    
    if (!text || text.length < 10) {
      return null;
    }

    // Extrair informações básicas
    const recall = {
      id: this.generateRecallId(text),
      fabricante: this.extractFabricante($, $item),
      modelo: this.extractModelo($, $item),
      ano: this.extractAno($, $item),
      campanha: this.extractCampanha($, $item),
      descricao: this.extractDescricao($, $item),
      gravidade: this.extractGravidade($, $item),
      status: this.extractStatus($, $item),
      dataInicio: this.extractDataInicio($, $item),
      fonte: 'gov.br',
      url: this.baseUrl,
      realizado: false
    };

    // Validar se tem informações mínimas
    if (!recall.descricao && !recall.campanha) {
      return null;
    }

    return recall;
  }

  /**
   * Métodos de extração de dados específicos
   */
  extractFabricante($, $item) {
    const fabricantes = ['volkswagen', 'ford', 'chevrolet', 'fiat', 'toyota', 'honda', 'nissan', 'hyundai'];
    const text = $item.text().toLowerCase();
    
    for (const fabricante of fabricantes) {
      if (text.includes(fabricante)) {
        return fabricante.charAt(0).toUpperCase() + fabricante.slice(1);
      }
    }
    
    return 'Não informado';
  }

  extractModelo($, $item) {
    // Tentar extrair modelo do texto
    const text = $item.text();
    const modeloMatch = text.match(/modelo[:\s]+([\w\s]+)/i);
    return modeloMatch ? modeloMatch[1].trim() : 'Não informado';
  }

  extractAno($, $item) {
    const text = $item.text();
    const anoMatch = text.match(/(19|20)\d{2}/);
    return anoMatch ? parseInt(anoMatch[0]) : new Date().getFullYear();
  }

  extractCampanha($, $item) {
    const text = $item.text();
    const campanhaMatch = text.match(/campanha[:\s]+([\w\d\/\-]+)/i);
    return campanhaMatch ? campanhaMatch[1].trim() : this.generateCampaignId();
  }

  extractDescricao($, $item) {
    let text = $item.text().trim();
    
    // Limitar tamanho da descrição
    if (text.length > 200) {
      text = text.substring(0, 200) + '...';
    }
    
    return text || 'Recall identificado';
  }

  extractGravidade($, $item) {
    const text = $item.text().toLowerCase();
    
    if (text.includes('crítica') || text.includes('grave')) return 'alta';
    if (text.includes('média') || text.includes('moderada')) return 'media';
    return 'baixa';
  }

  extractStatus($, $item) {
    const text = $item.text().toLowerCase();
    
    if (text.includes('realizado') || text.includes('concluído')) return 'realizado';
    if (text.includes('não aplicável')) return 'nao_aplicavel';
    return 'pendente';
  }

  extractDataInicio($, $item) {
    const text = $item.text();
    const dataMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    
    if (dataMatch) {
      return `${dataMatch[3]}-${dataMatch[2].padStart(2, '0')}-${dataMatch[1].padStart(2, '0')}`;
    }
    
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Utilitários
   */
  generateRecallId(text) {
    return 'recall_' + Buffer.from(text.substring(0, 50)).toString('base64').substring(0, 10);
  }

  generateCampaignId() {
    return `CAMP_${Date.now()}`;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = RecallScraper;
