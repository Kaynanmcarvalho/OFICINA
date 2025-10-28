/**
 * Serviço para cálculo de impostos e informações tributárias
 * Integra com as configurações do sistema, IBPT e fornece dados para NF-e
 */

import configService from './configService';
import ibptService from './ibptService';

class TaxCalculationService {
  constructor() {
    this.config = null;
  }

  /**
   * Carrega as configurações tributárias
   */
  async loadConfig(userId) {
    try {
      this.config = await configService.getConfig(userId);
      console.log('📊 Configurações tributárias carregadas:', this.config);
      
      // Configurar IBPT se ativo
      if (this.config.ibptAtivo && this.config.ibptToken) {
        ibptService.setToken(this.config.ibptToken);
        console.log('🔗 IBPT configurado e ativo');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações tributárias:', error);
      // Usar configurações padrão
      this.config = this.getDefaultConfig();
    }
  }

  /**
   * Retorna configurações padrão
   */
  getDefaultConfig() {
    return {
      nfRegimeTributario: 'lucro_presumido',
      nfAliquotaIcms: 18,
      nfAliquotaPis: 1.65,
      nfAliquotaCofins: 7.60,
      nfAliquotaIpi: 0,
      ibptAtivo: false
    };
  }
  /**
   * Calcula impostos para um produto específico
   * @param {Object} produto - Dados do produto
   * @param {number} quantidade - Quantidade
   * @param {number} preco - Preço unitário
   * @param {string} ufDestino - UF de destino
   * @returns {Object} Cálculo detalhado dos impostos
   */
  async calcularImpostoProduto(produto, quantidade = 1, preco = 0, ufDestino = null) {
    if (!this.config) {
      await this.loadConfig();
    }

    console.log('🧮 Calculando impostos para produto:', { produto, quantidade, preco, ufDestino });

    const valorTotal = preco * quantidade;
    const uf = ufDestino || this.config.uf || 'SP';
    
    let impostoData = null;

    // Tentar buscar no IBPT se ativo e NCM disponível
    if (this.config.ibptAtivo && produto.ncm && this.config.ibptToken) {
      try {
        console.log('🔍 Buscando impostos no IBPT para NCM:', produto.ncm);
        impostoData = await ibptService.getTaxInfoByNCM(produto.ncm, uf, valorTotal);
        console.log('📊 Dados do IBPT recebidos:', impostoData);
      } catch (error) {
        console.warn('⚠️ Erro ao buscar no IBPT, usando configurações manuais:', error.message);
      }
    }

    // Usar configurações manuais se IBPT não disponível
    if (!impostoData) {
      impostoData = this.getManualTaxData(valorTotal);
    }

    // Ajustar para regime tributário
    const impostoFinal = this.adjustForTaxRegime(impostoData, valorTotal);

    return {
      produto: produto.nome,
      ncm: produto.ncm || 'Não informado',
      quantidade,
      precoUnitario: preco,
      valorTotal,
      uf,
      fonte: impostoData.fonte || 'Manual',
      impostos: impostoFinal,
      observacoes: this.getObservacoes(impostoData)
    };
  }

  /**
   * Calcula impostos para uma venda completa
   * @param {Array} itens - Itens da venda
   * @param {Object} cliente - Dados do cliente
   * @param {string} userId - ID do usuário para carregar configurações
   * @returns {Object} Cálculo detalhado dos impostos
   */
  async calcularImpostos(itens, cliente = {}, userId = null) {
    if (!this.config || userId) {
      await this.loadConfig(userId);
    }

    console.log('🧮 Calculando impostos para venda:', { itens, cliente });

    let totalProdutos = 0;
    let totalIcms = 0;
    let totalPis = 0;
    let totalCofins = 0;
    let totalIpi = 0;
    let totalImpostos = 0;

    const itensCalculados = [];

    for (const item of itens) {
      const calculoItem = await this.calcularImpostoProduto(
        item,
        item.quantidade,
        item.preco,
        cliente.uf
      );

      totalProdutos += calculoItem.valorTotal;
      totalIcms += calculoItem.impostos.icms.valor;
      totalPis += calculoItem.impostos.pis.valor;
      totalCofins += calculoItem.impostos.cofins.valor;
      totalIpi += calculoItem.impostos.ipi.valor;
      totalImpostos += calculoItem.impostos.total;

      itensCalculados.push({
        ...item,
        ...calculoItem
      });
    }

    const resultado = {
      itens: itensCalculados,
      totais: {
        produtos: totalProdutos,
        icms: totalIcms,
        pis: totalPis,
        cofins: totalCofins,
        ipi: totalIpi,
        impostos: totalImpostos,
        venda: totalProdutos
      },
      percentuais: {
        icms: totalProdutos > 0 ? ((totalIcms / totalProdutos) * 100).toFixed(2) : 0,
        pis: totalProdutos > 0 ? ((totalPis / totalProdutos) * 100).toFixed(2) : 0,
        cofins: totalProdutos > 0 ? ((totalCofins / totalProdutos) * 100).toFixed(2) : 0,
        ipi: totalProdutos > 0 ? ((totalIpi / totalProdutos) * 100).toFixed(2) : 0,
        total: totalProdutos > 0 ? ((totalImpostos / totalProdutos) * 100).toFixed(2) : 0
      },
      configuracao: {
        regimeTributario: this.config.regimeTributario || 'simples_nacional',
        ibptAtivo: this.config.ibptAtivo || false,
        uf: this.config.uf || 'SP'
      },
      observacoes: this.getObservacoesGerais()
    };

    console.log('📊 Resultado do cálculo de impostos:', resultado);
    return resultado;
  }

  /**
   * Gera dados tributários manuais
   */
  getManualTaxData(valorTotal) {
    const regimeTributario = this.config.regimeTributario || 'simples_nacional';
    
    if (regimeTributario === 'simples_nacional') {
      return {
        aliquotaFederal: 0,
        aliquotaEstadual: 0,
        aliquotaMunicipal: 0,
        valorFederal: 0,
        valorEstadual: 0,
        valorMunicipal: 0,
        percentualTotal: 0,
        fonte: 'Manual - Simples Nacional'
      };
    }

    // Para outros regimes, usar alíquotas configuradas
    const icmsAliquota = this.config.nfAliquotaIcms || 18;
    const pisAliquota = this.config.nfAliquotaPis || 1.65;
    const cofinsAliquota = this.config.nfAliquotaCofins || 7.60;

    return {
      aliquotaFederal: pisAliquota + cofinsAliquota,
      aliquotaEstadual: icmsAliquota,
      aliquotaMunicipal: 0,
      valorFederal: valorTotal * ((pisAliquota + cofinsAliquota) / 100),
      valorEstadual: valorTotal * (icmsAliquota / 100),
      valorMunicipal: 0,
      percentualTotal: icmsAliquota + pisAliquota + cofinsAliquota,
      fonte: 'Manual'
    };
  }

  /**
   * Ajusta impostos baseado no regime tributário
   */
  adjustForTaxRegime(impostoData, valorTotal) {
    const regimeTributario = this.config.regimeTributario || 'simples_nacional';
    
    if (regimeTributario === 'simples_nacional') {
      return {
        icms: {
          aliquota: 0,
          valor: 0,
          cst: '102', // CSOSN 102
          origem: '0'
        },
        pis: {
          aliquota: 0,
          valor: 0,
          cst: '49'
        },
        cofins: {
          aliquota: 0,
          valor: 0,
          cst: '49'
        },
        ipi: {
          aliquota: 0,
          valor: 0,
          cst: '53'
        },
        total: 0,
        percentualTotal: impostoData.percentualTotal || 0,
        observacao: `Simples Nacional - Impostos aproximados: ${(impostoData.percentualTotal || 0).toFixed(2)}%`
      };
    }

    // Para outros regimes - usar configurações do usuário
    const icmsAliquota = this.config.nfAliquotaIcms || 18;
    const pisAliquota = this.config.nfAliquotaPis || 1.65;
    const cofinsAliquota = this.config.nfAliquotaCofins || 7.60;
    const ipiAliquota = this.config.nfAliquotaIpi || 0;
    
    const valorIcms = valorTotal * (icmsAliquota / 100);
    const valorPis = valorTotal * (pisAliquota / 100);
    const valorCofins = valorTotal * (cofinsAliquota / 100);
    const valorIpi = valorTotal * (ipiAliquota / 100);
    
    return {
      icms: {
        aliquota: icmsAliquota,
        valor: valorIcms,
        cst: '00',
        origem: '0'
      },
      pis: {
        aliquota: pisAliquota,
        valor: valorPis,
        cst: '01'
      },
      cofins: {
        aliquota: cofinsAliquota,
        valor: valorCofins,
        cst: '01'
      },
      ipi: {
        aliquota: ipiAliquota,
        valor: valorIpi,
        cst: '53'
      },
      total: valorIcms + valorPis + valorCofins + valorIpi,
      percentualTotal: icmsAliquota + pisAliquota + cofinsAliquota + ipiAliquota
    };
  }

  /**
   * Gera observações para um produto
   */
  getObservacoes(impostoData) {
    const observacoes = [];
    
    if (impostoData.fonte === 'IBPT') {
      observacoes.push('Impostos calculados via IBPT');
      observacoes.push(`Fonte: ${impostoData.fonte}`);
      if (impostoData.vigenciaInicio && impostoData.vigenciaFim) {
        observacoes.push(`Vigência: ${impostoData.vigenciaInicio} a ${impostoData.vigenciaFim}`);
      }
    } else {
      observacoes.push('Impostos calculados manualmente');
      observacoes.push('Valores aproximados para fins informativos');
    }
    
    if (this.config.regimeTributario === 'simples_nacional') {
      observacoes.push('Empresa optante pelo Simples Nacional');
    }
    
    return observacoes;
  }

  /**
   * Gera observações gerais
   */
  getObservacoesGerais() {
    const observacoes = [];
    
    if (this.config.ibptAtivo) {
      observacoes.push('Sistema integrado com IBPT para cálculos tributários');
    } else {
      observacoes.push('Cálculos baseados em configurações manuais');
    }
    
    observacoes.push('Consulte um contador para valores exatos');
    observacoes.push(`Regime tributário: ${this.config.regimeTributario || 'Não definido'}`);
    
    return observacoes;
  }

  /**
   * Calcula impostos para uma venda
   * @param {Object} saleData - Dados da venda
   * @param {Object} config - Configurações tributárias
   * @param {Array} products - Lista de produtos para obter dados tributários específicos
   * @returns {Object} Cálculo detalhado dos impostos
   */
  calculateTaxes(saleData, config, products = []) {
    console.log('🧮 Calculando impostos...', { saleData, config });
    
    const regimeTributario = config.nfRegimeTributario || config.regimeTributario || 'simples_nacional';
    const isSimpleNacional = regimeTributario === 'simples_nacional';
    const subtotal = saleData.total || 0;
    
    let totalIcms = 0;
    let totalPis = 0;
    let totalCofins = 0;
    let totalIpi = 0;
    
    // Calcular impostos por item
    const itemsWithTax = saleData.items?.map((item, index) => {
      const produto = products.find(p => p.id === item.id || p.codigo === item.codigo);
      const valorItem = item.preco * item.quantidade;
      
      // ICMS
      let icmsItem = 0;
      if (!isSimpleNacional) {
        const aliquotaIcms = produto?.aliquotaIcms || config.nfAliquotaIcms || 18;
        icmsItem = (valorItem * aliquotaIcms) / 100;
      }
      
      // PIS
      let pisItem = 0;
      if (!isSimpleNacional) {
        const aliquotaPis = produto?.aliquotaPis || config.nfAliquotaPis || 1.65;
        pisItem = (valorItem * aliquotaPis) / 100;
      }
      
      // COFINS
      let cofinsItem = 0;
      if (!isSimpleNacional) {
        const aliquotaCofins = produto?.aliquotaCofins || config.nfAliquotaCofins || 7.60;
        cofinsItem = (valorItem * aliquotaCofins) / 100;
      }
      
      // IPI
      let ipiItem = 0;
      const aliquotaIpi = produto?.aliquotaIpi || config.nfAliquotaIpi || 0;
      if (aliquotaIpi > 0) {
        ipiItem = (valorItem * aliquotaIpi) / 100;
      }
      
      totalIcms += icmsItem;
      totalPis += pisItem;
      totalCofins += cofinsItem;
      totalIpi += ipiItem;
      
      return {
        ...item,
        impostos: {
          icms: {
            aliquota: !isSimpleNacional ? (produto?.aliquotaIcms || config.nfAliquotaIcms || 18) : 0,
            valor: icmsItem,
            baseCalculo: valorItem
          },
          pis: {
            aliquota: !isSimpleNacional ? (produto?.aliquotaPis || config.nfAliquotaPis || 1.65) : 0,
            valor: pisItem,
            baseCalculo: valorItem
          },
          cofins: {
            aliquota: !isSimpleNacional ? (produto?.aliquotaCofins || config.nfAliquotaCofins || 7.60) : 0,
            valor: cofinsItem,
            baseCalculo: valorItem
          },
          ipi: {
            aliquota: produto?.aliquotaIpi || config.nfAliquotaIpi || 0,
            valor: ipiItem,
            baseCalculo: valorItem
          }
        }
      };
    }) || [];
    
    const totalImpostos = totalIcms + totalPis + totalCofins + totalIpi;
    const percentualTotal = subtotal > 0 ? (totalImpostos / subtotal) * 100 : 0;
    
    const calculation = {
      subtotal,
      icms: {
        aliquota: !isSimpleNacional ? (config.nfAliquotaIcms || 18) : 0,
        valor: totalIcms,
        baseCalculo: subtotal
      },
      pis: {
        aliquota: !isSimpleNacional ? (config.nfAliquotaPis || 1.65) : 0,
        valor: totalPis,
        baseCalculo: subtotal
      },
      cofins: {
        aliquota: !isSimpleNacional ? (config.nfAliquotaCofins || 7.60) : 0,
        valor: totalCofins,
        baseCalculo: subtotal
      },
      ipi: {
        aliquota: config.nfAliquotaIpi || 0,
        valor: totalIpi,
        baseCalculo: subtotal
      },
      totalImpostos,
      percentualTotal,
      regimeTributario: config.nfRegimeTributario,
      isSimpleNacional,
      items: itemsWithTax,
      observacoes: this._getObservacoes(config)
    };
    
    console.log('📊 Cálculo de impostos concluído:', calculation);
    return calculation;
  }
  
  /**
   * Gera observações sobre o cálculo
   * @private
   */
  _getObservacoes(config) {
    const observacoes = [];
    
    if ((config.nfRegimeTributario || config.regimeTributario || 'simples_nacional') === 'simples_nacional') {
      observacoes.push('Empresa optante pelo Simples Nacional');
      observacoes.push('Impostos recolhidos conforme LC 123/2006');
    }
    
    if (config.nfAliquotaIpi && config.nfAliquotaIpi > 0) {
      observacoes.push('IPI incidente conforme tabela TIPI');
    }
    
    return observacoes;
  }
  
  /**
   * Calcula apenas o resumo dos impostos (versão simplificada)
   */
  calculateTaxSummary(saleData, config) {
    const regimeTributario = config.nfRegimeTributario || config.regimeTributario || 'simples_nacional';
    const isSimpleNacional = regimeTributario === 'simples_nacional';
    const total = saleData.total || 0;
    
    if (isSimpleNacional) {
      // Para Simples Nacional, usar alíquota aproximada
      const aliquotaSimples = this._getAliquotaSimples(total);
      const impostoSimples = (total * aliquotaSimples) / 100;
      
      return {
        totalImpostos: impostoSimples,
        percentualTotal: aliquotaSimples,
        regimeTributario: 'simples_nacional',
        observacao: `Alíquota aproximada do Simples Nacional: ${aliquotaSimples.toFixed(2)}%`
      };
    }
    
    // Para outros regimes, calcular impostos separadamente
    const icms = (total * (config.nfAliquotaIcms || 18)) / 100;
    const pis = (total * (config.nfAliquotaPis || 1.65)) / 100;
    const cofins = (total * (config.nfAliquotaCofins || 7.60)) / 100;
    const ipi = (total * (config.nfAliquotaIpi || 0)) / 100;
    
    const totalImpostos = icms + pis + cofins + ipi;
    const percentualTotal = (totalImpostos / total) * 100;
    
    return {
      totalImpostos,
      percentualTotal,
      regimeTributario: config.nfRegimeTributario,
      detalhes: { icms, pis, cofins, ipi }
    };
  }
  
  /**
   * Calcula alíquota aproximada do Simples Nacional baseada no faturamento
   * @private
   */
  _getAliquotaSimples(valorVenda) {
    // Tabela simplificada do Simples Nacional para comércio
    // Anexo I - Comércio
    if (valorVenda <= 180000) return 4.0;
    if (valorVenda <= 360000) return 7.3;
    if (valorVenda <= 720000) return 9.5;
    if (valorVenda <= 1800000) return 10.7;
    if (valorVenda <= 3600000) return 14.3;
    return 19.0; // Acima de 3.6M
  }
  
  /**
   * Formata valores monetários
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  }
  
  /**
   * Formata percentuais
   */
  formatPercentage(value) {
    return `${(value || 0).toFixed(2)}%`;
  }
}

const taxCalculationService = new TaxCalculationService();
export default taxCalculationService;