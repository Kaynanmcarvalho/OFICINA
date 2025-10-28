/**
 * Serviço para integração com API do IBPT (Instituto Brasileiro de Planejamento e Tributação)
 * Fornece informações tributárias atualizadas baseadas no NCM dos produtos
 */

class IBPTService {
  constructor() {
    // URLs da API do IBPT
    this.baseURL = 'https://apidadosabertos.ibpt.org.br/api/v1';
    // Token será configurado nas configurações do sistema
    this.token = null;
  }

  /**
   * Configura o token da API
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Busca informações tributárias por NCM
   * @param {string} ncm - Código NCM do produto
   * @param {string} uf - Estado (UF) para cálculo do ICMS
   * @param {number} valor - Valor do produto para cálculo
   * @returns {Object} Informações tributárias
   */
  async getTaxInfoByNCM(ncm, uf = 'SP', valor = 100) {
    try {
      if (!this.token) {
        throw new Error('Token da API IBPT não configurado');
      }

      if (!ncm || ncm.length < 8) {
        throw new Error('NCM inválido. Deve ter pelo menos 8 dígitos');
      }

      console.log('🔍 Buscando informações tributárias no IBPT:', { ncm, uf, valor });

      const response = await fetch(
        `${this.baseURL}/produtos?token=${this.token}&codigo=${ncm}&uf=${uf}&valor=${valor}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Erro na API IBPT:', response.status, errorData);
        throw new Error(`Erro na API IBPT: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('📊 Dados recebidos do IBPT:', data);

      return this._formatTaxData(data);

    } catch (error) {
      console.error('❌ Erro ao buscar informações tributárias:', error);
      throw error;
    }
  }

  /**
   * Busca informações de serviços por código
   * @param {string} codigo - Código do serviço
   * @param {string} uf - Estado (UF)
   * @param {number} valor - Valor do serviço
   */
  async getServiceTaxInfo(codigo, uf = 'SP', valor = 100) {
    try {
      if (!this.token) {
        throw new Error('Token da API IBPT não configurado');
      }

      console.log('🔍 Buscando informações de serviço no IBPT:', { codigo, uf, valor });

      const response = await fetch(
        `${this.baseURL}/servicos?token=${this.token}&codigo=${codigo}&uf=${uf}&valor=${valor}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na API IBPT: ${response.status}`);
      }

      const data = await response.json();
      return this._formatTaxData(data);

    } catch (error) {
      console.error('❌ Erro ao buscar informações de serviço:', error);
      throw error;
    }
  }

  /**
   * Formata os dados recebidos da API
   * @private
   */
  _formatTaxData(data) {
    if (!data || !data.Codigo) {
      throw new Error('Dados inválidos recebidos da API IBPT');
    }

    return {
      codigo: data.Codigo,
      descricao: data.Descricao,
      tipo: data.Tipo, // 0 = Nacional, 1 = Importado
      
      // Impostos Federais
      aliquotaFederal: parseFloat(data.Nacional || 0),
      valorFederal: parseFloat(data.ValorFederal || 0),
      
      // Impostos Estaduais (ICMS)
      aliquotaEstadual: parseFloat(data.Estadual || 0),
      valorEstadual: parseFloat(data.ValorEstadual || 0),
      
      // Impostos Municipais (ISS)
      aliquotaMunicipal: parseFloat(data.Municipal || 0),
      valorMunicipal: parseFloat(data.ValorMunicipal || 0),
      
      // Impostos Importação (se aplicável)
      aliquotaImportacao: parseFloat(data.Importado || 0),
      valorImportacao: parseFloat(data.ValorImportado || 0),
      
      // Informações adicionais
      fonte: data.Fonte,
      versao: data.Versao,
      vigenciaInicio: data.VigenciaInicio,
      vigenciaFim: data.VigenciaFim,
      chave: data.Chave,
      
      // Cálculo total
      totalImpostos: (
        parseFloat(data.ValorFederal || 0) +
        parseFloat(data.ValorEstadual || 0) +
        parseFloat(data.ValorMunicipal || 0) +
        parseFloat(data.ValorImportado || 0)
      ),
      
      // Percentual total
      percentualTotal: (
        parseFloat(data.Nacional || 0) +
        parseFloat(data.Estadual || 0) +
        parseFloat(data.Municipal || 0) +
        parseFloat(data.Importado || 0)
      ),
      
      // Timestamp da consulta
      consultadoEm: new Date().toISOString(),
      
      // Dados originais para referência
      dadosOriginais: data
    };
  }

  /**
   * Valida se o token está configurado
   */
  isConfigured() {
    return !!this.token;
  }

  /**
   * Testa a conexão com a API
   */
  async testConnection() {
    try {
      if (!this.token) {
        return {
          success: false,
          message: 'Token não configurado'
        };
      }

      // Teste com um NCM comum (água mineral)
      const testNCM = '22011000';
      await this.getTaxInfoByNCM(testNCM, 'SP', 1);
      
      return {
        success: true,
        message: 'Conexão com IBPT estabelecida com sucesso'
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Erro na conexão: ${error.message}`
      };
    }
  }

  /**
   * Busca múltiplos NCMs de uma vez
   * @param {Array} ncms - Array de códigos NCM
   * @param {string} uf - Estado
   * @param {number} valor - Valor base para cálculo
   */
  async getBulkTaxInfo(ncms, uf = 'SP', valor = 100) {
    const results = [];
    const errors = [];

    for (const ncm of ncms) {
      try {
        const taxInfo = await this.getTaxInfoByNCM(ncm, uf, valor);
        results.push({ ncm, success: true, data: taxInfo });
        
        // Delay para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        errors.push({ ncm, error: error.message });
        results.push({ ncm, success: false, error: error.message });
      }
    }

    return {
      results,
      errors,
      total: ncms.length,
      success: results.filter(r => r.success).length,
      failed: errors.length
    };
  }

  /**
   * Formata dados para uso no sistema de NF
   */
  formatForNF(taxData, regimeTributario = 'simples_nacional') {
    if (regimeTributario === 'simples_nacional') {
      // Para Simples Nacional, usar alíquotas aproximadas
      return {
        icms: {
          aliquota: 0, // Simples Nacional não destaca ICMS
          cst: '102', // CSOSN 102
          origem: '0'
        },
        pis: {
          aliquota: 0, // Simples Nacional não destaca PIS
          cst: '49'
        },
        cofins: {
          aliquota: 0, // Simples Nacional não destaca COFINS
          cst: '49'
        },
        ipi: {
          aliquota: 0, // Geralmente isento para comércio
          cst: '53'
        },
        totalImpostos: taxData.percentualTotal || 0,
        observacoes: `Empresa optante pelo Simples Nacional. Impostos aproximados: ${taxData.percentualTotal?.toFixed(2)}%`
      };
    }

    // Para outros regimes, usar dados detalhados
    return {
      icms: {
        aliquota: taxData.aliquotaEstadual || 18,
        valor: taxData.valorEstadual || 0,
        cst: '00', // Tributada integralmente
        origem: '0'
      },
      pis: {
        aliquota: 1.65, // Alíquota padrão
        cst: '01'
      },
      cofins: {
        aliquota: 7.60, // Alíquota padrão
        cst: '01'
      },
      ipi: {
        aliquota: 0,
        cst: '53' // Isento
      },
      totalImpostos: taxData.totalImpostos || 0,
      percentualTotal: taxData.percentualTotal || 0,
      fonte: 'IBPT',
      consultadoEm: taxData.consultadoEm
    };
  }
}

const ibptService = new IBPTService();
export default ibptService;