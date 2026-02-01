/**
 * Serviço para geração de relatórios financeiros e fiscais
 * Integra com vendas, estoque, contas e dados tributários
 */

import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import salesService from './salesService';
import productService from './productService';

class ReportService {
  constructor() {
    this.vendasCollection = 'vendas';
    this.produtosCollection = 'produtos';
    this.contasCollection = 'contas';
    this.configCollection = 'configuracoes';
  }

  /**
   * Gera relatório de vendas por período
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @param {Object} filters - Filtros adicionais
   * @returns {Object} Relatório de vendas
   */
  async generateSalesReport(startDate, endDate, filters = {}) {
    try {
      // Função helper para criar data local sem problemas de fuso horário
      const createLocalDate = (dateInput) => {
        if (typeof dateInput === 'string') {
          // Para strings no formato YYYY-MM-DD, criar data local
          const [year, month, day] = dateInput.split('-').map(Number);
          return new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
        }
        return new Date(dateInput);
      };

      // Converter strings de data para objetos Date se necessário
      const startDateObj = createLocalDate(startDate);
      const endDateObj = createLocalDate(endDate);

      // Buscar vendas do período atual
      const currentSalesRaw = await this.getSalesFromFirestore(startDateObj, endDateObj);
      
      // Enriquecer vendas com dados do usuário
      const currentSales = await this.enrichSalesWithUserData(currentSalesRaw);
      
      // Calcular período anterior para comparação de crescimento
      const periodDiff = endDateObj.getTime() - startDateObj.getTime();
      const previousEndDate = new Date(startDateObj.getTime() - 1);
      const previousStartDate = new Date(previousEndDate.getTime() - periodDiff);
      
      // Buscar vendas do período anterior
      const previousSales = await this.getSalesFromFirestore(previousStartDate, previousEndDate);

      // Filtrar vendas se necessário
      let filteredSales = currentSales;
      if (filters.vendedor) {
        filteredSales = currentSales.filter(sale => sale.vendedor === filters.vendedor);
      }
      if (filters.status) {
        filteredSales = currentSales.filter(sale => sale.status === filters.status);
      }

      // Calcular métricas detalhadas
      const metrics = this.calculateSalesMetrics(filteredSales);
      const previousMetrics = this.calculateSalesMetrics(previousSales);
      
      // Calcular crescimento
      const growth = this.calculateGrowth(metrics, previousMetrics);
      
      // Agrupar vendas por período
      const salesByPeriod = this.groupSalesByPeriod(filteredSales, filters.groupBy || 'day');
      
      // Top produtos vendidos (mais e menos vendidos)
      const topProducts = this.getTopSellingProducts(filteredSales);
      
      // Análise de formas de pagamento com valores em Reais
      const paymentAnalysis = this.analyzePaymentMethodsDetailed(filteredSales);

      return {
        periodo: {
          inicio: startDate,
          fim: endDate
        },
        resumo: {
          totalVendas: filteredSales.length,
          valorTotal: metrics.valorTotal,
          valorImpostos: metrics.valorImpostos,
          ticketMedio: metrics.ticketMedio,
          crescimento: growth,
          margemReal: this.calculateRealMargin(filteredSales)
        },
        vendas: filteredSales,
        vendasPorPeriodo: salesByPeriod,
        topProdutos: topProducts,
        formasPagamento: paymentAnalysis,
        geradoEm: new Date()
      };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de vendas:', error);
      throw error;
    }
  }

  /**
   * Gera relatório de estoque
   * @param {Object} filters - Filtros para o relatório
   * @returns {Object} Relatório de estoque
   */
  async generateStockReport(filters = {}) {
    try {
      const products = await this.getProductsFromFirestore();
      
      // Filtrar produtos
      let filteredProducts = products;
      if (filters.categoria) {
        filteredProducts = products.filter(p => p.categoria === filters.categoria);
      }
      if (filters.estoqueMinimo) {
        filteredProducts = products.filter(p => p.estoque <= (p.estoqueMinimo || 0));
      }
      if (filters.vencimento) {
        const diasVencimento = filters.vencimento;
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + diasVencimento);
        
        filteredProducts = products.filter(p => {
          if (p.lotes && p.lotes.length > 0) {
            return p.lotes.some(lote => new Date(lote.vencimento) <= dataLimite);
          }
          return false;
        });
      }

      // Calcular métricas de estoque
      const metrics = this.calculateStockMetrics(filteredProducts);
      
      // Produtos com estoque baixo (quantidade <= quantidadeMinima)
      const lowStockProducts = products.filter(p => {
        const quantidade = Number(p.quantidade || 0);
        const quantidadeMinima = Number(p.quantidadeMinima || 0);
        return quantidade > 0 && quantidade <= quantidadeMinima;
      });
      
      // Produtos próximos ao vencimento
      const expiringProducts = await this.getExpiringProducts(30); // 30 dias
      
      // Análise por categoria
      const categoryAnalysis = this.analyzeStockByCategory(filteredProducts);
      
      // Valor total do estoque
      const stockValue = this.calculateStockValue(filteredProducts);

      // Calcular produtos sem estoque (quantidade = 0)
      const produtosSemEstoque = products.filter(p => {
        const quantidade = Number(p.quantidade || 0);
        return quantidade === 0;
      });

      // Calcular valor de custo total
      const valorCustoTotal = this.calculateCostValue(filteredProducts);
      
      // Calcular margem média
      const margemMedia = this.calculateAverageMargin(filteredProducts);
      
      // Análise de margem por categoria
      const margemPorCategoria = this.calculateMarginByCategory(filteredProducts);
      
      // Calcular ranking real de produtos vendidos
      const rankingProdutos = await this.calculateProductSalesRanking(filteredProducts);

      return {
        resumo: {
          totalProdutos: filteredProducts.length,
          produtosAtivos: filteredProducts.filter(p => p.ativo !== false).length,
          produtosBaixoEstoque: lowStockProducts.length,
          produtosSemEstoque: produtosSemEstoque.length,
          valorTotalEstoque: stockValue,
          valorCustoTotal: valorCustoTotal,
          margemMedia: margemMedia
        },
        totalProdutos: filteredProducts.length,
        valorTotal: stockValue,
        valorCustoTotal: valorCustoTotal,
        produtosBaixoEstoque: lowStockProducts.length,
        produtosSemEstoque: produtosSemEstoque.length,
        giroMedio: 0,
        margemMedia: margemMedia,
        metricas: metrics,
        produtos: filteredProducts,
        estoqueBaixo: lowStockProducts,
        semEstoque: produtosSemEstoque,
        produtosVencendo: expiringProducts,
        analiseCategoria: categoryAnalysis,
        margemPorCategoria: margemPorCategoria,
        rankingProdutos: rankingProdutos,
        geradoEm: new Date()
      };

      return reportData;
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de estoque:', error);
      throw error;
    }
  }

  /**
   * Gera relatório financeiro
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Object} Relatório financeiro
   */
  async generateFinancialReport(startDate, endDate) {
    try {
      // Função helper para criar data local sem problemas de fuso horário
      const createLocalDate = (dateInput) => {
        if (typeof dateInput === 'string') {
          // Para strings no formato YYYY-MM-DD, criar data local
          const [year, month, day] = dateInput.split('-').map(Number);
          return new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
        }
        return new Date(dateInput);
      };

      // Converter strings de data para objetos Date se necessário
      const startDateObj = createLocalDate(startDate);
      const endDateObj = createLocalDate(endDate);

      // Buscar vendas do período
      const sales = await this.getSalesFromFirestore(startDateObj, endDateObj);
      
      // Buscar contas a pagar/receber (se implementado)
      let accounts = [];
      try {
        const accountsQuery = query(
          collection(db, this.contasCollection),
          where('dataVencimento', '>=', Timestamp.fromDate(startDateObj)),
          where('dataVencimento', '<=', Timestamp.fromDate(endDateObj))

        const accountsSnapshot = await getDocs(accountsQuery);
        accounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        }

      // Calcular receitas
      const receitas = this.calculateRevenues(sales);
      
      // Calcular despesas
      const despesas = this.calculateExpenses(accounts);
      
      // Calcular impostos
      const impostos = this.calculateTaxes(sales);
      
      // Fluxo de caixa
      const fluxoCaixa = this.calculateCashFlow(receitas, despesas, impostos);
      
      // DRE simplificado
      const dre = this.generateSimplifiedDRE(receitas, despesas, impostos);
      
      // Análise de lucratividade
      const lucratividade = this.analyzeProfitability(sales);

      return {
        periodo: {
          inicio: startDate,
          fim: endDate
        },
        receitas,
        despesas,
        impostos,
        fluxoCaixa,
        dre,
        lucratividade,
        resumo: {
          receitaTotal: receitas?.total || 0,
          despesaTotal: despesas?.total || 0,
          impostoTotal: impostos?.total || 0,
          lucroLiquido: (receitas?.total || 0) - (despesas?.total || 0) - (impostos?.total || 0),
          margemLucro: receitas?.total > 0 ? (((receitas?.total || 0) - (despesas?.total || 0) - (impostos?.total || 0)) / receitas.total) * 100 : 0
        },
        geradoEm: new Date()
      };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório financeiro:', error);
      throw error;
    }
  }

  /**
   * Gera relatório fiscal
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Object} Relatório fiscal
   */
  async generateTaxReport(startDate, endDate) {
    try {
      // Função helper para criar data local sem problemas de fuso horário
      const createLocalDate = (dateInput) => {
        if (typeof dateInput === 'string') {
          // Para strings no formato YYYY-MM-DD, criar data local
          const [year, month, day] = dateInput.split('-').map(Number);
          return new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
        }
        return new Date(dateInput);
      };

      // Converter strings de data para objetos Date se necessário
      const startDateObj = createLocalDate(startDate);
      const endDateObj = createLocalDate(endDate);

      const sales = await salesService.getSalesByPeriod(startDateObj, endDateObj, 1000);
      
      // Calcular impostos por tipo
      const taxBreakdown = {
        icms: 0,
        pis: 0,
        cofins: 0,
        ipi: 0,
        aproximado: 0,
        total: 0
      };

      // Análise por NCM
      const ncmAnalysis = {};
      
      // Análise por regime tributário
      const regimeAnalysis = {
        simplesNacional: { vendas: 0, impostos: 0 },
        lucroPresumido: { vendas: 0, impostos: 0 },
        lucroReal: { vendas: 0, impostos: 0 }
      };

      sales.forEach(sale => {
        if (sale.status !== 'cancelada' && sale.impostos) {
          // Somar impostos por tipo
          Object.keys(taxBreakdown).forEach(tax => {
            if (sale.impostos[tax]) {
              taxBreakdown[tax] += sale.impostos[tax];
            }
          });
          
          taxBreakdown.total += sale.valorImpostos || 0;
        }
      });

      // Obrigações fiscais
      const obligations = this.calculateTaxObligations(taxBreakdown, startDate, endDate);
      
      // Sugestões de otimização fiscal
      const optimizations = this.generateTaxOptimizations(sales, taxBreakdown);

      return {
        periodo: {
          inicio: startDate,
          fim: endDate
        },
        resumo: {
          totalVendas: sales.filter(s => s.status !== 'cancelada').length,
          valorTotalVendas: sales.reduce((sum, s) => s.status !== 'cancelada' ? sum + (s.valorTotal || 0) : sum, 0),
          totalImpostos: taxBreakdown.total
        },
        impostosPorTipo: taxBreakdown,
        analiseNCM: ncmAnalysis,
        analiseRegime: regimeAnalysis,
        obrigacoesFiscais: obligations,
        otimizacoes: optimizations,
        geradoEm: new Date()
      };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório fiscal:', error);
      throw error;
    }
  }

  /**
   * Calcula métricas de vendas
   * @param {Array} sales - Lista de vendas
   * @returns {Object} Métricas calculadas
   */
  calculateSalesMetrics(sales) {
    const validSales = sales.filter(s => s.status !== 'cancelada');
    
    // Usar campo 'total' que é o que está sendo salvo no Firestore
    const valorTotal = validSales.reduce((sum, sale) => sum + (sale.total || sale.valorTotal || 0), 0);
    const valorImpostos = validSales.reduce((sum, sale) => sum + (sale.valorImpostos || 0), 0);
    const ticketMedio = validSales.length > 0 ? valorTotal / validSales.length : 0;
    
    // Estimativa de margem de lucro (simplificada)
    const margemLucro = valorTotal > 0 ? ((valorTotal - valorImpostos) / valorTotal) * 100 : 0;

    return {
      valorTotal,
      valorImpostos,
      ticketMedio,
      margemLucro,
      totalVendas: validSales.length
    };
  }

  /**
   * Agrupa vendas por período
   * @param {Array} sales - Lista de vendas
   * @param {string} groupBy - Tipo de agrupamento (day, week, month)
   * @returns {Object} Vendas agrupadas
   */
  groupSalesByPeriod(sales, groupBy = 'day') {
    const grouped = {};
    
    sales.forEach(sale => {
      if (sale.status === 'cancelada') return;
      
      let key;
      const date = new Date(sale.dataVenda);
      
      switch (groupBy) {
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default: // day
          key = date.toISOString().split('T')[0];
      }
      
      if (!grouped[key]) {
        grouped[key] = {
          vendas: 0,
          valor: 0,
          impostos: 0
        };
      }
      
      grouped[key].vendas += 1;
      grouped[key].valor += sale.valorTotal || 0;
      grouped[key].impostos += sale.valorImpostos || 0;
    });
    
    return grouped;
  }

  /**
   * Obtém produtos mais vendidos
   * @param {Array} sales - Lista de vendas
   * @returns {Array} Top produtos
   */
  async getTopSellingProducts(sales, limit = 10) {
    const productSales = {};
    
    // Seria necessário buscar os itens das vendas
    // Por simplicidade, retornando estrutura básica
    
    return [];
  }

  /**
   * Analisa formas de pagamento
   * @param {Array} sales - Lista de vendas
   * @returns {Object} Análise de pagamentos
   */
  analyzePaymentMethods(sales) {
    const analysis = {};
    
    sales.forEach(sale => {
      if (sale.status === 'cancelada') return;
      
      const method = sale.pagamento?.forma || 'Não informado';
      
      if (!analysis[method]) {
        analysis[method] = {
          quantidade: 0,
          valor: 0,
          percentual: 0
        };
      }
      
      analysis[method].quantidade += 1;
      analysis[method].valor += sale.valorTotal || 0;
    });
    
    // Calcular percentuais
    const total = Object.values(analysis).reduce((sum, item) => sum + item.valor, 0);
    Object.keys(analysis).forEach(method => {
      analysis[method].percentual = total > 0 ? (analysis[method].valor / total) * 100 : 0;
    });
    
    return analysis;
  }

  /**
   * Calcula métricas de estoque
   * @param {Array} products - Lista de produtos
   * @returns {Object} Métricas de estoque
   */
  calculateStockMetrics(products) {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.ativo).length;
    const lowStockProducts = products.filter(p => 
      p.controlarEstoque && p.estoque <= (p.estoqueMinimo || 0)
    ).length;
    
    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      stockTurnover: 0 // Seria necessário dados históricos
    };
  }

  /**
   * Obtém produtos próximos ao vencimento
   * @param {number} days - Dias para vencimento
   * @returns {Array} Produtos vencendo
   */
  async getExpiringProducts(days = 30) {
    try {
      const products = await productService.getBatchesNearExpiration(days);
      return products || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Analisa estoque por categoria
   * @param {Array} products - Lista de produtos
   * @returns {Object} Análise por categoria
   */
  analyzeStockByCategory(products) {
    const analysis = {};
    
    products.forEach(product => {
      const category = product.categoria || product.category || 'Sem categoria';
      const quantidade = Number(product.quantidade || product.estoque || product.stock || 0);
      const preco = Number(product.preco || product.price || product.valor || 0);
      const valorProduto = quantidade * preco;
      
      if (!analysis[category]) {
        analysis[category] = {
          quantidade: 0,
          valor: 0,
          produtos: 0
        };
      }
      
      analysis[category].produtos += 1;
      analysis[category].quantidade += quantidade;
      analysis[category].valor += valorProduto;
    });
    
    return analysis;
  }

  /**
   * Calcula valor total do estoque
   * @param {Array} products - Lista de produtos
   * @returns {number} Valor total
   */
  calculateStockValue(products) {
    return products.reduce((total, product) => {
      const quantidade = Number(product.quantidade || product.estoque || 0);
      const preco = Number(product.preco || 0);
      return total + (quantidade * preco);
    }, 0);
  }

  /**
   * Calcula receitas
   * @param {Array} sales - Lista de vendas
   * @returns {Object} Dados de receitas
   */
  calculateRevenues(sales) {
    const validSales = sales.filter(s => s.status !== 'cancelada');
    const total = validSales.reduce((sum, sale) => sum + (sale.valorTotal || 0), 0);
    
    return {
      total,
      vendas: validSales.length,
      ticketMedio: validSales.length > 0 ? total / validSales.length : 0
    };
  }

  /**
   * Calcula despesas
   * @param {Array} accounts - Lista de contas
   * @returns {Object} Dados de despesas
   */
  calculateExpenses(accounts) {
    const expenses = accounts.filter(acc => acc.tipo === 'pagar' && acc.status === 'pago');
    const total = expenses.reduce((sum, expense) => sum + (expense.valor || 0), 0);
    
    return {
      total,
      quantidade: expenses.length
    };
  }

  /**
   * Calcula impostos
   * @param {Array} sales - Lista de vendas
   * @returns {Object} Dados de impostos
   */
  calculateTaxes(sales) {
    const validSales = sales.filter(s => s.status !== 'cancelada');
    const total = validSales.reduce((sum, sale) => sum + (sale.valorImpostos || 0), 0);
    
    return {
      total,
      percentualMedio: validSales.length > 0 ? 
        (total / validSales.reduce((sum, sale) => sum + (sale.valorTotal || 0), 0)) * 100 : 0
    };
  }

  /**
   * Calcula fluxo de caixa
   * @param {Object} receitas - Dados de receitas
   * @param {Object} despesas - Dados de despesas
   * @param {Object} impostos - Dados de impostos
   * @returns {Object} Fluxo de caixa
   */
  calculateCashFlow(receitas, despesas, impostos) {
    const entradas = receitas.total;
    const saidas = despesas.total + impostos.total;
    const saldo = entradas - saidas;
    
    return {
      entradas,
      saidas,
      saldo,
      percentualLucro: entradas > 0 ? (saldo / entradas) * 100 : 0
    };
  }

  /**
   * Gera DRE simplificado
   * @param {Object} receitas - Dados de receitas
   * @param {Object} despesas - Dados de despesas
   * @param {Object} impostos - Dados de impostos
   * @returns {Object} DRE
   */
  generateSimplifiedDRE(receitas, despesas, impostos) {
    const receitaBruta = receitas.total;
    const receitaLiquida = receitaBruta - impostos.total;
    const lucroOperacional = receitaLiquida - despesas.total;
    const lucroLiquido = lucroOperacional; // Simplificado
    
    return {
      receitaBruta,
      impostos: impostos.total,
      receitaLiquida,
      despesasOperacionais: despesas.total,
      lucroOperacional,
      lucroLiquido,
      margemLiquida: receitaBruta > 0 ? (lucroLiquido / receitaBruta) * 100 : 0
    };
  }

  /**
   * Analisa lucratividade
   * @param {Array} sales - Lista de vendas
   * @returns {Object} Análise de lucratividade
   */
  analyzeProfitability(sales) {
    // Análise simplificada
    const validSales = sales.filter(s => s.status !== 'cancelada');
    const totalRevenue = validSales.reduce((sum, sale) => sum + (sale.valorTotal || 0), 0);
    const totalTaxes = validSales.reduce((sum, sale) => sum + (sale.valorImpostos || 0), 0);
    
    return {
      receitaTotal: totalRevenue,
      impostoTotal: totalTaxes,
      margemBruta: totalRevenue > 0 ? ((totalRevenue - totalTaxes) / totalRevenue) * 100 : 0
    };
  }

  /**
   * Calcula obrigações fiscais
   * @param {Object} taxBreakdown - Impostos por tipo
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Object} Obrigações fiscais
   */
  calculateTaxObligations(taxBreakdown, startDate, endDate) {
    // Simplificado - seria necessário mais lógica específica
    return {
      icms: {
        valor: taxBreakdown.icms,
        vencimento: this.getNextTaxDueDate('icms', endDate)
      },
      pis: {
        valor: taxBreakdown.pis,
        vencimento: this.getNextTaxDueDate('pis', endDate)
      },
      cofins: {
        valor: taxBreakdown.cofins,
        vencimento: this.getNextTaxDueDate('cofins', endDate)
      }
    };
  }

  /**
   * Obtém próxima data de vencimento de imposto
   * @param {string} taxType - Tipo de imposto
   * @param {Date} referenceDate - Data de referência
   * @returns {Date} Data de vencimento
   */
  getNextTaxDueDate(taxType, referenceDate) {
    const nextMonth = new Date(referenceDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // Simplificado - dia 20 do mês seguinte
    nextMonth.setDate(20);
    
    return nextMonth;
  }

  /**
   * Gera sugestões de otimização fiscal
   * @param {Array} sales - Lista de vendas
   * @param {Object} taxBreakdown - Impostos por tipo
   * @returns {Array} Sugestões
   */
  generateTaxOptimizations(sales, taxBreakdown) {
    const suggestions = [];
    
    // Análise simplificada
    if (taxBreakdown.total > 0) {
      suggestions.push({
        tipo: 'regime_tributario',
        descricao: 'Considere avaliar se o regime tributário atual é o mais vantajoso',
        impacto: 'medio'
      });
    }
    
    if (taxBreakdown.icms > taxBreakdown.total * 0.5) {
      suggestions.push({
        tipo: 'icms',
        descricao: 'ICMS representa mais de 50% dos impostos. Verifique benefícios fiscais disponíveis',
        impacto: 'alto'
      });
    }
    
    return suggestions;
  }

  /**
   * Exporta relatório para CSV
   * @param {Object} reportData - Dados do relatório
   * @param {string} reportType - Tipo do relatório
   * @returns {string} Conteúdo CSV
   */
  exportToCSV(reportData, reportType) {
    // Implementação básica - seria expandida conforme necessidade
    let csv = '';
    
    switch (reportType) {
      case 'sales':
        csv = this.generateSalesCSV(reportData);
        break;
      case 'stock':
        csv = this.generateStockCSV(reportData);
        break;
      case 'financial':
        csv = this.generateFinancialCSV(reportData);
        break;
      default:
        throw new Error('Tipo de relatório não suportado para exportação');
    }
    
    return csv;
  }

  /**
   * Gera CSV de vendas
   * @param {Object} reportData - Dados do relatório
   * @returns {string} CSV
   */
  generateSalesCSV(reportData) {
    const headers = ['Data', 'Valor', 'Impostos', 'Status', 'Vendedor'];
    let csv = headers.join(',') + '\n';
    
    reportData.vendas.forEach(sale => {
      const row = [
        sale.dataVenda?.toISOString().split('T')[0] || '',
        sale.valorTotal || 0,
        sale.valorImpostos || 0,
        sale.status || '',
        sale.vendedor || ''
      ];
      csv += row.join(',') + '\n';
    });
    
    return csv;
  }

  /**
   * Gera CSV de estoque
   * @param {Object} reportData - Dados do relatório
   * @returns {string} CSV
   */
  generateStockCSV(reportData) {
    const headers = ['Produto', 'Categoria', 'Estoque', 'Preço', 'Valor Total'];
    let csv = headers.join(',') + '\n';
    
    reportData.produtos.forEach(product => {
      const row = [
        product.nome || '',
        product.categoria || '',
        product.quantidade || 0,
        product.preco || 0,
        (product.quantidade || 0) * (product.preco || 0)
      ];
      csv += row.join(',') + '\n';
    });
    
    return csv;
  }

  /**
   * Gera CSV financeiro
   * @param {Object} reportData - Dados do relatório
   * @returns {string} CSV
   */
  generateFinancialCSV(reportData) {
    const headers = ['Métrica', 'Valor'];
    let csv = headers.join(',') + '\n';
    
    const metrics = [
      ['Receita Total', reportData.resumo.receitaTotal],
      ['Despesa Total', reportData.resumo.despesaTotal],
      ['Imposto Total', reportData.resumo.impostoTotal],
      ['Lucro Líquido', reportData.resumo.lucroLiquido],
      ['Margem de Lucro (%)', reportData.resumo.margemLucro]
    ];
    
    metrics.forEach(metric => {
      csv += metric.join(',') + '\n';
    });
    
    return csv;
  }

  /**
   * Busca vendas do Firestore por período
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Array} Lista de vendas
   */
  async getSalesFromFirestore(startDate, endDate) {
    try {
      // Função helper para criar data local sem problemas de fuso horário
      const createLocalDate = (dateInput) => {
        if (typeof dateInput === 'string') {
          // Para strings no formato YYYY-MM-DD, criar data local
          const [year, month, day] = dateInput.split('-').map(Number);
          return new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
        }
        return new Date(dateInput);
      };

      const startTimestamp = createLocalDate(startDate);
      startTimestamp.setHours(0, 0, 0, 0);
      
      const endTimestamp = createLocalDate(endDate);
      endTimestamp.setHours(23, 59, 59, 999);

      ,
        fim: endTimestamp.toLocaleDateString('pt-BR'),
        startTimestamp,
        endTimestamp
      });

      const salesQuery = query(
        collection(db, this.vendasCollection),
        where('timestamp', '>=', startTimestamp),
        where('timestamp', '<=', endTimestamp),
        orderBy('timestamp', 'desc')

      const salesSnapshot = await getDocs(salesQuery);
      const sales = salesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return sales;
    } catch (error) {
      console.error('❌ Erro ao buscar vendas do Firestore:', error);
      return [];
    }
  }

  /**
   * Calcula crescimento comparando períodos
   * @param {Object} currentMetrics - Métricas do período atual
   * @param {Object} previousMetrics - Métricas do período anterior
   * @returns {Object} Dados de crescimento
   */
  calculateGrowth(currentMetrics, previousMetrics) {
    const calculatePercentage = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      vendas: calculatePercentage(currentMetrics.totalVendas || 0, previousMetrics.totalVendas || 0),
      valor: calculatePercentage(currentMetrics.valorTotal || 0, previousMetrics.valorTotal || 0),
      ticketMedio: calculatePercentage(currentMetrics.ticketMedio || 0, previousMetrics.ticketMedio || 0)
    };
  }

  /**
   * Obtém produtos mais vendidos (top 10 mais e menos vendidos)
   * @param {Array} sales - Lista de vendas
   * @returns {Object} Produtos mais e menos vendidos
   */
  getTopSellingProducts(sales) {
    const productStats = {};

    // Agregar dados dos produtos
    sales.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          const productKey = item.id || item.nome;
          if (!productStats[productKey]) {
            productStats[productKey] = {
              nome: item.nome,
              quantidade: 0,
              valor: 0,
              vendas: 0
            };
          }
          productStats[productKey].quantidade += item.quantidade || 0;
          productStats[productKey].valor += (item.preco * item.quantidade) || 0;
          productStats[productKey].vendas += 1;
        });
      }
    });

    // Converter para array e ordenar
    const productsArray = Object.values(productStats);
    
    // Top 10 mais vendidos (por quantidade)
    const maisVendidos = productsArray
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    // Top 10 menos vendidos (por quantidade, excluindo zeros)
    const menosVendidos = productsArray
      .filter(p => p.quantidade > 0)
      .sort((a, b) => a.quantidade - b.quantidade)
      .slice(0, 10);

    return {
      maisVendidos,
      menosVendidos
    };
  }

  /**
   * Analisa formas de pagamento com detalhes em Reais
   * @param {Array} sales - Lista de vendas
   * @returns {Object} Análise detalhada de formas de pagamento
   */
  analyzePaymentMethodsDetailed(sales) {
    const paymentStats = {};
    let totalValue = 0;

    sales.forEach(sale => {
      let paymentMethod = 'Não informado';
      let saleValue = sale.total || 0;

      // Tentar extrair método de pagamento
      if (sale.paymentDetails && sale.paymentDetails.pagamentos && sale.paymentDetails.pagamentos.length > 0) {
        paymentMethod = sale.paymentDetails.pagamentos[0].metodo || 'Não informado';
      } else if (sale.paymentMethod) {
        paymentMethod = sale.paymentMethod;
      }

      // Normalizar nome do método
      paymentMethod = this.normalizePaymentMethod(paymentMethod);

      if (!paymentStats[paymentMethod]) {
        paymentStats[paymentMethod] = {
          quantidade: 0,
          valor: 0,
          percentual: 0
        };
      }

      paymentStats[paymentMethod].quantidade += 1;
      paymentStats[paymentMethod].valor += saleValue;
      totalValue += saleValue;
    });

    // Calcular percentuais
    Object.keys(paymentStats).forEach(method => {
      paymentStats[method].percentual = totalValue > 0 
        ? (paymentStats[method].valor / totalValue) * 100 
        : 0;
    });

    // Ordenar por valor
    const sortedPayments = Object.entries(paymentStats)
      .sort(([,a], [,b]) => b.valor - a.valor)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    return sortedPayments;
  }

  /**
   * Normaliza nomes de métodos de pagamento
   * @param {string} method - Método original
   * @returns {string} Método normalizado
   */
  normalizePaymentMethod(method) {
    const methodMap = {
      'dinheiro': 'Dinheiro',
      'cartao_credito': 'Cartão de Crédito',
      'cartao_debito': 'Cartão de Débito',
      'pix': 'PIX',
      'transferencia': 'Transferência',
      'cheque': 'Cheque',
      'boleto': 'Boleto'
    };

    const normalized = method?.toLowerCase() || 'não informado';
    return methodMap[normalized] || 
           method?.charAt(0).toUpperCase() + method?.slice(1).toLowerCase() || 
           'Não informado';
  }

  /**
   * Busca produtos do Firestore
   * @returns {Array} Lista de produtos
   */
  async getProductsFromFirestore() {
    try {
      const productsQuery = query(collection(db, this.produtosCollection));
      const productsSnapshot = await getDocs(productsQuery);
      return productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar produtos do Firestore:', error);
      return [];
    }
  }

  /**
   * Busca informações de usuários do Firestore
   * @returns {Object} Mapa de userId -> dados do usuário
   */
  async getUsersFromFirestore() {
    try {
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersMap = {};
      
      usersSnapshot.docs.forEach(doc => {
        const userData = doc.data();
        usersMap[doc.id] = {
          id: doc.id,
          name: userData.displayName || userData.name || userData.email?.split('@')[0] || 'Usuário',
          email: userData.email,
          ...userData
        };
      });
      
      return usersMap;
    } catch (error) {
      console.error('❌ Erro ao buscar usuários do Firestore:', error);
      return {};
    }
  }

  /**
   * Calcula valor total de custo do estoque
   * @param {Array} products - Lista de produtos
   * @returns {number} Valor total de custo
   */
  calculateCostValue(products) {
    return products.reduce((total, product) => {
      const quantidade = Number(product.quantidade || product.estoque || 0);
      const custo = Number(product.precoCusto || product.custo || 0);
      return total + (quantidade * custo);
    }, 0);
  }

  /**
   * Calcula margem média dos produtos
   * @param {Array} products - Lista de produtos
   * @returns {number} Margem média em percentual
   */
  calculateAverageMargin(products) {
    if (products.length === 0) return 0;

    let totalMargin = 0;
    let count = 0;

    products.forEach(product => {
      const preco = product.preco || 0;
      const custo = product.precoCusto || product.custo || 0;
      
      if (preco > 0 && custo > 0) {
        const margin = ((preco - custo) / preco) * 100;
        totalMargin += margin;
        count++;
      }
    });

    return count > 0 ? totalMargin / count : 0;
  }

  /**
   * Calcula margem por categoria
   * @param {Array} products - Lista de produtos
   * @returns {Object} Margens por categoria
   */
  calculateMarginByCategory(products) {
    const categoryMargins = {};

    products.forEach(product => {
      const category = product.categoria || 'Sem categoria';
      const preco = product.preco || 0;
      const custo = product.precoCusto || product.custo || 0;

      if (!categoryMargins[category]) {
        categoryMargins[category] = {
          totalMargin: 0,
          count: 0,
          products: 0
        };
      }

      categoryMargins[category].products += 1;

      if (preco > 0 && custo > 0) {
        const margin = ((preco - custo) / preco) * 100;
        categoryMargins[category].totalMargin += margin;
        categoryMargins[category].count += 1;
      }
    });

    // Calcular margem média por categoria
    Object.keys(categoryMargins).forEach(category => {
      const data = categoryMargins[category];
      data.margemMedia = data.count > 0 ? data.totalMargin / data.count : 0;
    });

    return categoryMargins;
  }

  /**
   * Obtém ranking de produtos mais/menos vendidos com filtro
   * @param {Array} sales - Lista de vendas
   * @param {number} limit - Limite de produtos (3-20)
   * @returns {Object} Ranking de produtos
   */
  getProductRanking(sales, limit = 10) {
    // Garantir que o limite está entre 3 e 20
    const safeLimit = Math.max(3, Math.min(20, limit));
    
    const productStats = {};

    // Agregar dados dos produtos
    sales.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          const productKey = item.id || item.nome;
          if (!productStats[productKey]) {
            productStats[productKey] = {
              nome: item.nome,
              quantidade: 0,
              valor: 0,
              vendas: 0
            };
          }
          productStats[productKey].quantidade += item.quantidade || 0;
          productStats[productKey].valor += (item.preco * item.quantidade) || 0;
          productStats[productKey].vendas += 1;
        });
      }
    });

    // Converter para array e ordenar
    const productsArray = Object.values(productStats);
    
    // Top mais vendidos (por quantidade)
    const maisVendidos = productsArray
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, safeLimit);

    // Top menos vendidos (por quantidade, excluindo zeros)
    const menosVendidos = productsArray
      .filter(p => p.quantidade > 0)
      .sort((a, b) => a.quantidade - b.quantidade)
      .slice(0, safeLimit);

    return {
      maisVendidos,
      menosVendidos,
      limit: safeLimit
    };
  }

  /**
   * Enriquece vendas com informações do usuário
   * @param {Array} sales - Lista de vendas
   * @returns {Array} Vendas com dados do usuário
   */
  async enrichSalesWithUserData(sales) {
    try {
      const usersMap = await this.getUsersFromFirestore();
      
      return sales.map(sale => ({
        ...sale,
        vendedorInfo: usersMap[sale.userId] || {
          name: sale.vendedor || 'Vendedor não identificado',
          email: 'N/A'
        }
      }));
    } catch (error) {
      console.error('❌ Erro ao enriquecer vendas com dados do usuário:', error);
      return sales;
    }
  }

  /**
   * Calcula margem real (Total de vendas - Custo total)
   * @param {Array} sales - Lista de vendas
   * @returns {Object} Dados de margem real
   */
  calculateRealMargin(sales) {
    let totalVendas = 0;
    let totalCusto = 0;

    sales.forEach(sale => {
      const valorVenda = sale.total || sale.valorTotal || 0;
      totalVendas += valorVenda;

      // Calcular custo baseado nos itens
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          const quantidade = item.quantidade || 0;
          const custo = item.precoCusto || item.custo || 0;
          totalCusto += quantidade * custo;
        });
      }
    });

    const margemReais = totalVendas - totalCusto;
    const margemPercentual = totalVendas > 0 ? (margemReais / totalVendas) * 100 : 0;

    return {
      totalVendas,
      totalCusto,
      margemReais,
      margemPercentual
    };
  }

  /**
   * Calcula ranking real de produtos vendidos baseado nas vendas
   * @param {Array} products - Lista de produtos para analisar
   * @returns {Object} Ranking de produtos mais e menos vendidos
   */
  async calculateProductSalesRanking(products) {
    try {
      // Buscar todas as vendas (últimos 6 meses para ter uma amostra significativa)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const salesQuery = query(
        collection(db, this.vendasCollection),
        where('timestamp', '>=', sixMonthsAgo),
        orderBy('timestamp', 'desc')

      const salesSnapshot = await getDocs(salesQuery);
      const sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Contar vendas por produto
      const productSalesCount = {};
      const productSalesValue = {};
      
      sales.forEach(sale => {
        if (sale.items && Array.isArray(sale.items)) {
          sale.items.forEach(item => {
            const productId = item.id;
            const quantidade = item.quantidade || 0;
            const valorTotal = (item.preco || 0) * quantidade;
            
            if (productSalesCount[productId]) {
              productSalesCount[productId] += quantidade;
              productSalesValue[productId] += valorTotal;
            } else {
              productSalesCount[productId] = quantidade;
              productSalesValue[productId] = valorTotal;
            }
          });
        }
      });

      // Criar ranking com dados dos produtos
      const productRanking = [];
      
      products.forEach(product => {
        const vendidas = productSalesCount[product.id] || 0;
        const valor = productSalesValue[product.id] || 0;
        
        productRanking.push({
          id: product.id,
          nome: product.nome,
          categoria: product.categoria,
          preco: product.preco || 0,
          estoque: product.quantidade || 0,
          quantidadeVendida: vendidas,
          valorVendido: valor,
          imagem: product.imagem || null
        });
      });

      // Ordenar por quantidade vendida (mais vendidos - apenas produtos que tiveram vendas)
      const maisVendidos = [...productRanking]
        .filter(p => p.quantidadeVendida > 0) // Apenas produtos que tiveram vendas
        .sort((a, b) => b.quantidadeVendida - a.quantidadeVendida)
        .slice(0, 20); // Top 20

      // Ordenar por quantidade vendida (menos vendidos, mas que tiveram pelo menos 1 venda)
      const menosVendidos = [...productRanking]
        .filter(p => p.quantidadeVendida > 0) // Apenas produtos que tiveram vendas
        .sort((a, b) => a.quantidadeVendida - b.quantidadeVendida)
        .slice(0, 20); // Bottom 20

      // Produtos nunca vendidos
      const nuncaVendidos = productRanking
        .filter(p => p.quantidadeVendida === 0)
        .sort((a, b) => b.estoque - a.estoque) // Ordenar por estoque (maior problema)
        .slice(0, 20);

      return {
        maisVendidos,
        menosVendidos,
        nuncaVendidos,
        totalProdutosComVendas: productRanking.filter(p => p.quantidadeVendida > 0).length,
        totalProdutosSemVendas: nuncaVendidos.length,
        periodoDados: 'Últimos 6 meses'
      };
    } catch (error) {
      console.error('❌ Erro ao calcular ranking de produtos:', error);
      return {
        maisVendidos: [],
        menosVendidos: [],
        nuncaVendidos: [],
        totalProdutosComVendas: 0,
        totalProdutosSemVendas: 0,
        periodoDados: 'Erro no cálculo'
      };
    }
  }

  /**
   * Deleta uma venda
   * @param {string} saleId - ID da venda
   * @returns {boolean} Sucesso da operação
   */
  async deleteVenda(saleId) {
    try {
      return await salesService.deleteSale(saleId);
    } catch (error) {
      console.error('❌ ReportService: Erro ao deletar venda:', error);
      throw error;
    }
  }
}

const reportService = new ReportService();
export default reportService;