/**
 * Serviço para gerenciar vendas e operações do PDV
 * Integra com estoque, impostos e emissão de NF-e
 */

import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, limit, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import productService from './productService';
import taxCalculationService from './taxCalculationService';
import nfGenerationService from './nfGenerationService';

class SalesService {
  constructor() {
    this.salesCollection = 'vendas';
    this.salesItemsCollection = 'vendas_itens';
  }

  /**
   * Processa uma nova venda
   * @param {Object} saleData - Dados da venda
   * @param {Array} items - Itens da venda
   * @param {Object} customer - Dados do cliente (opcional)
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Object} Resultado da venda processada
   */
  async processSale(saleData, items, customer = null, paymentData = {}) {
    try {
      // Validar itens
      if (!items || items.length === 0) {
        throw new Error('Venda deve conter pelo menos um item');
      }

      // Verificar estoque disponível
      await this.validateStock(items);

      // Calcular totais e impostos
      const calculations = await this.calculateSaleTotals(items, customer);

      // Criar registro da venda
      const sale = {
        ...saleData,
        cliente: customer,
        dataVenda: Timestamp.now(),
        status: 'concluida',
        valorSubtotal: calculations.subtotal,
        valorDesconto: saleData.desconto || 0,
        valorTotal: calculations.total,
        valorImpostos: calculations.totalImpostos,
        pagamento: paymentData,
        impostos: calculations.impostos,
        observacoes: saleData.observacoes || '',
        vendedor: saleData.vendedor || 'Sistema',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Salvar venda no Firestore
      const saleRef = await addDoc(collection(db, this.salesCollection), sale);
      const saleId = saleRef.id;

      // Salvar itens da venda
      await this.saveSaleItems(saleId, items, calculations.itensCalculados);

      // Atualizar estoque
      await this.updateStock(items);

      // Gerar NF-e se necessário
      let nfeData = null;
      if (saleData.emitirNFe && customer) {
        try {
          nfeData = await this.generateNFe(saleId, sale, items, customer);
        } catch (nfeError) {
          // Venda continua mesmo se NF-e falhar
        }
      }

      return {
        success: true,
        saleId,
        sale: { ...sale, id: saleId },
        calculations,
        nfe: nfeData,
        message: 'Venda processada com sucesso'
      };

    } catch (error) {
      console.error('❌ Erro ao processar venda:', error);
      throw new Error(`Erro ao processar venda: ${error.message}`);
    }
  }

  /**
   * Valida se há estoque suficiente para todos os itens
   * @param {Array} items - Itens da venda
   */
  async validateStock(items) {
    for (const item of items) {
      const produto = await productService.getProductById(item.produtoId);
      
      if (!produto) {
        throw new Error(`Produto não encontrado: ${item.produtoId}`);
      }

      if (produto.controlarEstoque && produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}, Solicitado: ${item.quantidade}`);
      }
    }
  }

  /**
   * Calcula totais da venda e impostos
   * @param {Array} items - Itens da venda
   * @param {Object} customer - Dados do cliente
   * @returns {Object} Cálculos da venda
   */
  async calculateSaleTotals(items, customer = null) {
    let subtotal = 0;
    let totalImpostos = 0;
    const itensCalculados = [];
    const impostos = {
      icms: 0,
      pis: 0,
      cofins: 0,
      ipi: 0,
      aproximado: 0
    };

    for (const item of items) {
      const produto = await productService.getProductById(item.produtoId);
      const valorItem = item.preco * item.quantidade;
      subtotal += valorItem;

      // Calcular impostos do item
      const impostoItem = await taxCalculationService.calcularImpostoProduto(
        produto,
        item.quantidade,
        item.preco,
        customer?.uf || 'SP'

      totalImpostos += impostoItem.impostos.total || 0;
      
      // Somar impostos por tipo
      if (impostoItem.impostos.icms) impostos.icms += impostoItem.impostos.icms;
      if (impostoItem.impostos.pis) impostos.pis += impostoItem.impostos.pis;
      if (impostoItem.impostos.cofins) impostos.cofins += impostoItem.impostos.cofins;
      if (impostoItem.impostos.ipi) impostos.ipi += impostoItem.impostos.ipi;
      if (impostoItem.impostos.aproximado) impostos.aproximado += impostoItem.impostos.aproximado;

      itensCalculados.push({
        ...item,
        produto: produto.nome,
        valorUnitario: item.preco,
        valorTotal: valorItem,
        impostos: impostoItem.impostos
      });
    }

    return {
      subtotal,
      totalImpostos,
      total: subtotal,
      impostos,
      itensCalculados
    };
  }

  /**
   * Salva os itens da venda
   * @param {string} saleId - ID da venda
   * @param {Array} items - Itens originais
   * @param {Array} calculatedItems - Itens com cálculos
   */
  async saveSaleItems(saleId, items, calculatedItems) {
    const promises = calculatedItems.map(async (item, index) => {
      const itemData = {
        vendaId: saleId,
        produtoId: item.produtoId,
        produto: item.produto,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorTotal,
        impostos: item.impostos,
        ordem: index + 1,
        createdAt: Timestamp.now()
      };

      return addDoc(collection(db, this.salesItemsCollection), itemData);
    });

    await Promise.all(promises);
  }

  /**
   * Atualiza o estoque dos produtos vendidos
   * @param {Array} items - Itens da venda
   */
  async updateStock(items) {
    const promises = items.map(async (item) => {
      return productService.updateStock(item.produtoId, -item.quantidade);
    });

    await Promise.all(promises);
  }

  /**
   * Gera NF-e para a venda
   * @param {string} saleId - ID da venda
   * @param {Object} sale - Dados da venda
   * @param {Array} items - Itens da venda
   * @param {Object} customer - Dados do cliente
   * @returns {Object} Dados da NF-e gerada
   */
  async generateNFe(saleId, sale, items, customer) {
    try {
      const nfeData = {
        vendaId: saleId,
        cliente: customer,
        itens: items,
        totais: {
          subtotal: sale.valorSubtotal,
          desconto: sale.valorDesconto,
          total: sale.valorTotal,
          impostos: sale.valorImpostos
        },
        observacoes: sale.observacoes
      };

      return await nfGenerationService.generateNFe(nfeData);
    } catch (error) {
      console.error('❌ Erro ao gerar NF-e:', error);
      throw error;
    }
  }

  /**
   * Busca vendas por período
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @param {number} limitResults - Limite de resultados
   * @returns {Array} Lista de vendas
   */
  async getSalesByPeriod(startDate, endDate, limitResults = 100) {
    try {
      const q = query(
        collection(db, this.salesCollection),
        where('dataVenda', '>=', Timestamp.fromDate(startDate)),
        where('dataVenda', '<=', Timestamp.fromDate(endDate)),
        orderBy('dataVenda', 'desc'),
        limit(limitResults)

      const querySnapshot = await getDocs(q);
      const sales = [];

      querySnapshot.forEach((doc) => {
        sales.push({
          id: doc.id,
          ...doc.data(),
          dataVenda: doc.data().dataVenda?.toDate()
        });
      });

      return sales;
    } catch (error) {
      console.error('❌ Erro ao buscar vendas:', error);
      throw error;
    }
  }

  /**
   * Busca uma venda específica com seus itens
   * @param {string} saleId - ID da venda
   * @returns {Object} Dados completos da venda
   */
  async getSaleById(saleId) {
    try {
      const saleDoc = await getDoc(doc(db, this.salesCollection, saleId));
      
      if (!saleDoc.exists()) {
        throw new Error('Venda não encontrada');
      }

      const rawData = saleDoc.data();
      const saleData = {
        id: saleDoc.id,
        ...rawData,
        // Tratar dataVenda de forma segura
        dataVenda: rawData.dataVenda && typeof rawData.dataVenda.toDate === 'function' 
          ? rawData.dataVenda.toDate() 
          : rawData.dataVenda
      };

      // Buscar itens da venda
      const itemsQuery = query(
        collection(db, this.salesItemsCollection),
        where('vendaId', '==', saleId),
        orderBy('ordem')

      const itemsSnapshot = await getDocs(itemsQuery);
      const items = [];

      itemsSnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        ...saleData,
        itens: items
      };
    } catch (error) {
      console.error('❌ Erro ao buscar venda:', error);
      throw error;
    }
  }

  /**
   * Cancela uma venda
   * @param {string} saleId - ID da venda
   * @param {string} motivo - Motivo do cancelamento
   * @returns {boolean} Sucesso da operação
   */
  async cancelSale(saleId, motivo = '') {
    try {
      const sale = await this.getSaleById(saleId);
      
      if (sale.status === 'cancelada') {
        throw new Error('Venda já está cancelada');
      }

      // Atualizar status da venda
      await updateDoc(doc(db, this.salesCollection, saleId), {
        status: 'cancelada',
        motivoCancelamento: motivo,
        dataCancelamento: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Reverter estoque
      if (sale.itens && sale.itens.length > 0) {
        const promises = sale.itens.map(async (item) => {
          return productService.updateStock(item.produtoId, item.quantidade);
        });
        await Promise.all(promises);
      }

      return true;
    } catch (error) {
      console.error('❌ Erro ao cancelar venda:', error);
      throw error;
    }
  }

  /**
   * Deleta uma venda permanentemente
   * @param {string} saleId - ID da venda
   * @returns {boolean} Sucesso da operação
   */
  async deleteSale(saleId) {
    try {
      // Buscar a venda para verificar se existe e obter dados dos itens
      const sale = await this.getSaleById(saleId);
      
      if (!sale) {
        throw new Error('Venda não encontrada');
      }

      // Reverter estoque se a venda não estava cancelada
      if (sale.status !== 'cancelada' && sale.itens && sale.itens.length > 0) {
        const promises = sale.itens.map(async (item) => {
          return productService.updateStock(item.produtoId, item.quantidade);
        });
        await Promise.all(promises);
      }

      // Deletar itens da venda
      if (sale.itens && sale.itens.length > 0) {
        const deleteItemsPromises = sale.itens.map(async (item) => {
          // Buscar o documento do item para deletar
          const itemsQuery = query(
            collection(db, this.salesItemsCollection),
            where('vendaId', '==', saleId),
            where('produtoId', '==', item.produtoId)

          const itemsSnapshot = await getDocs(itemsQuery);
          
          const deletePromises = itemsSnapshot.docs.map(itemDoc => 
            deleteDoc(doc(db, this.salesItemsCollection, itemDoc.id))

          return Promise.all(deletePromises);
        });
        await Promise.all(deleteItemsPromises);
      }

      // Deletar a venda principal
      await deleteDoc(doc(db, this.salesCollection, saleId));

      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar venda:', error);
      throw error;
    }
  }

  /**
   * Calcula estatísticas de vendas
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Object} Estatísticas das vendas
   */
  async getSalesStats(startDate, endDate) {
    try {
      const sales = await this.getSalesByPeriod(startDate, endDate, 1000);
      
      const stats = {
        totalVendas: sales.length,
        valorTotal: 0,
        valorImpostos: 0,
        ticketMedio: 0,
        vendasPorDia: {},
        produtosMaisVendidos: {},
        formasPagamento: {}
      };

      sales.forEach(sale => {
        if (sale.status !== 'cancelada') {
          stats.valorTotal += sale.valorTotal || 0;
          stats.valorImpostos += sale.valorImpostos || 0;
          
          // Vendas por dia
          const dia = sale.dataVenda.toISOString().split('T')[0];
          stats.vendasPorDia[dia] = (stats.vendasPorDia[dia] || 0) + 1;
          
          // Formas de pagamento
          const formaPagamento = sale.pagamento?.forma || 'Não informado';
          stats.formasPagamento[formaPagamento] = (stats.formasPagamento[formaPagamento] || 0) + 1;
        }
      });

      stats.ticketMedio = stats.totalVendas > 0 ? stats.valorTotal / stats.totalVendas : 0;

      return stats;
    } catch (error) {
      console.error('❌ Erro ao calcular estatísticas:', error);
      throw error;
    }
  }
}

const salesService = new SalesService();
export default salesService;