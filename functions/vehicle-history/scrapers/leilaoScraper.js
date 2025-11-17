/**
 * Leilão Scraper
 * Scraper para consulta de histórico de leilões
 */

const axios = require('axios');
const cheerio = require('cheerio');
const Logger = require('../utils/logger');

class LeilaoScraper {
  constructor() {
    this.logger = new Logger('LeilaoScraper');
    this.timeout = 10000;
    this.maxRetries = 3;
    
    // URLs de fontes públicas de leilões
    this.sources = [
      {
        name: 'Detran',
        url: 'https://www.detran.sp.gov.br/leilao',
        enabled: true
      }
    ];
  }

  /**
   * Scrape leilões para uma placa específica
   */
  async scrape(placa) {
    let retries = 0;

    while (retries < this.maxRetries) {
      try {
        this.logger.info('Iniciando scraping de leilões', { placa, tentativa: retries + 1 });

        const leiloes = await this.searchLeiloes(placa);

        this.logger.info('Scraping de leilões concluído', {
          placa,
          leiloes: leiloes.length,
          tentativa: retries + 1
        });

        return leiloes;

      } catch (error) {
        this.logger.error('Erro no scraping de leilões', {
          placa,
          tentativa: retries + 1,
          error: error.message
        });

        retries++;
        if (retries >= this.maxRetries) {
          // Retornar array vazio em vez de erro
          this.logger.warn('Retornando resultado vazio após falhas', { placa });
          return [];
        }

        await this.sleep(2000 * retries);
      }
    }

    return [];
  }

  /**
   * Busca leilões em múltiplas fontes
   */
  async searchLeiloes(placa) {
    const allLeiloes = [];

    // Buscar em cada fonte habilitada
    for (const source of this.sources.filter(s => s.enabled)) {
      try {
        const leiloes = await this.searchInSource(source, placa);
        allLeiloes.push(...leiloes);
      } catch (error) {
        this.logger.warn('Erro ao buscar em fonte', {
          source: source.name,
          error: error.message
        });
      }
    }

    // Remover duplicatas
    return this.removeDuplicates(allLeiloes);
  }

  /**
   * Busca em uma fonte específica
   */
  async searchInSource(source, placa) {
    try {
      const response = await axios.get(source.url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const leiloes = [];

      // Buscar por menções da placa
      const cleanPlaca = placa.replace(/[^A-Z0-9]/g, '');
      
      $('body').find('*').each((i, element) => {
        const text = $(element).text();
        if (text.includes(cleanPlaca) || text.includes(placa)) {
          const leilao = this.extractLeilaoInfo($, $(element), placa, source);
          if (leilao) {
            leiloes.push(leilao);
          }
        }
      });

      return leiloes;

    } catch (error) {
      this.logger.error('Erro ao buscar em fonte', {
        source: source.name,
        error: error.message
      });
      return [];
    }
  }

  /**
   * Extrai informações de leilão
   */
  extractLeilaoInfo($, $element, placa, source) {
    try {
      const text = $element.text().trim();
      
      if (!text || text.length < 20) {
        return null;
      }

      return {
        id: this.generateLeilaoId(text),
        placa,
        leiloeiro: this.extractLeiloeiro($, $element),
        lote: this.extractLote($, $element),
        dataLeilao: this.extractDataLeilao($, $element),
        valorInicial: this.extractValor($, $element),
        status: this.extractStatus($, $element),
        motivo: this.extractMotivo($, $element),
        local: this.extractLocal($, $element),
        fonte: source.name,
        url: source.url,
        detalhes: text.substring(0, 200)
      };

    } catch (error) {
      this.logger.warn('Erro ao extrair info de leilão', {
        error: error.message
      });
      return null;
    }
  }

  /**
   * Métodos de extração
   */
  extractLeiloeiro($, $element) {
    const text = $element.text();
    const match = text.match(/leiloeiro[:\s]+([^\n]+)/i);
    return match ? match[1].trim() : 'Não informado';
  }

  extractLote($, $element) {
    const text = $element.text();
    const match = text.match(/lote[:\s]+(\d+)/i);
    return match ? match[1] : null;
  }

  extractDataLeilao($, $element) {
    const text = $element.text();
    const match = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    
    if (match) {
      return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
    }
    
    return null;
  }

  extractValor($, $element) {
    const text = $element.text();
    const match = text.match(/R\$\s*([\d.,]+)/);
    
    if (match) {
      return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
    }
    
    return null;
  }

  extractStatus($, $element) {
    const text = $element.text().toLowerCase();
    
    if (text.includes('arrematado') || text.includes('vendido')) return 'arrematado';
    if (text.includes('cancelado')) return 'cancelado';
    if (text.includes('agendado') || text.includes('previsto')) return 'agendado';
    
    return 'desconhecido';
  }

  extractMotivo($, $element) {
    const text = $element.text().toLowerCase();
    
    if (text.includes('recuperação') || text.includes('seguradora')) return 'sinistro';
    if (text.includes('apreensão') || text.includes('judicial')) return 'judicial';
    if (text.includes('abandono')) return 'abandono';
    
    return 'outros';
  }

  extractLocal($, $element) {
    const text = $element.text();
    const match = text.match(/local[:\s]+([^\n]+)/i);
    return match ? match[1].trim() : 'Não informado';
  }

  /**
   * Utilitários
   */
  generateLeilaoId(text) {
    return 'leilao_' + Buffer.from(text.substring(0, 50)).toString('base64').substring(0, 10);
  }

  removeDuplicates(leiloes) {
    const seen = new Set();
    return leiloes.filter(leilao => {
      const key = `${leilao.lote}_${leilao.dataLeilao}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = LeilaoScraper;
