/**
 * useInventoryIntegration - Hook para integração do inventário com outros módulos
 * Facilita o uso de produtos em orçamentos, vendas e histórico de clientes
 */

import { useProductStore } from '../store/productStore';
import { useClientStore } from '../store/clientStore';
import toast from 'react-hot-toast';

export const useInventoryIntegration = () => {
  const {
    products,
    searchProducts,
    reserveStock,
    releaseReservedStock,
    decreaseStock,
    increaseStock,
  } = useProductStore();

  const { addServiceToHistory } = useClientStore();

  /**
   * Adicionar produto ao orçamento (reserva estoque)
   */
  const addProductToBudget = async (productId, quantity, budgetId) => {
    try {
      const result = await reserveStock(
        productId,
        quantity,
        budgetId,
        'Reserva para orçamento'

      if (result.success) {
        return { success: true };
      } else {
        toast.error(result.error || 'Erro ao reservar estoque');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error adding product to budget:', error);
      toast.error('Erro ao adicionar produto ao orçamento');
      return { success: false, error: error.message };
    }
  };

  /**
   * Remover produto do orçamento (libera reserva)
   */
  const removeProductFromBudget = async (productId, quantity, budgetId) => {
    try {
      const result = await releaseReservedStock(
        productId,
        quantity,
        budgetId,
        'Remoção do orçamento'

      if (result.success) {
        return { success: true };
      } else {
        toast.error(result.error || 'Erro ao liberar estoque');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error removing product from budget:', error);
      toast.error('Erro ao remover produto do orçamento');
      return { success: false, error: error.message };
    }
  };

  /**
   * Aprovar orçamento (baixa definitiva do estoque)
   */
  const approveBudget = async (budgetId, items, clientId) => {
    try {
      const results = [];

      for (const item of items) {
        const result = await decreaseStock(
          item.productId,
          item.quantity,
          'budget',
          budgetId,
          `Orçamento aprovado #${budgetId}`

        results.push(result);
      }

      // Registrar no histórico do cliente
      if (clientId) {
        await addServiceToHistory(clientId, {
          type: 'budget',
          budgetId,
          items,
          value: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        });
      }

      const allSuccess = results.every(r => r.success);
      if (allSuccess) {
        toast.success('Estoque baixado com sucesso!');
        return { success: true };
      } else {
        toast.error('Alguns itens não puderam ser baixados');
        return { success: false, errors: results.filter(r => !r.success) };
      }
    } catch (error) {
      console.error('Error approving budget:', error);
      toast.error('Erro ao aprovar orçamento');
      return { success: false, error: error.message };
    }
  };

  /**
   * Cancelar/Expirar orçamento (libera todas as reservas)
   */
  const cancelBudget = async (budgetId, items) => {
    try {
      const results = [];

      for (const item of items) {
        const result = await releaseReservedStock(
          item.productId,
          item.quantity,
          budgetId,
          `Orçamento cancelado/expirado #${budgetId}`

        results.push(result);
      }

      const allSuccess = results.every(r => r.success);
      if (allSuccess) {
        return { success: true };
      } else {
        return { success: false, errors: results.filter(r => !r.success) };
      }
    } catch (error) {
      console.error('Error canceling budget:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Venda direta (baixa definitiva sem reserva prévia)
   */
  const processSale = async (saleId, items, clientId) => {
    try {
      const results = [];

      for (const item of items) {
        const result = await decreaseStock(
          item.productId,
          item.quantity,
          'sale',
          saleId,
          `Venda direta #${saleId}`

        results.push(result);
      }

      // Registrar no histórico do cliente
      if (clientId) {
        await addServiceToHistory(clientId, {
          type: 'sale',
          saleId,
          items,
          value: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        });
      }

      const allSuccess = results.every(r => r.success);
      if (allSuccess) {
        toast.success('Venda processada com sucesso!');
        return { success: true };
      } else {
        toast.error('Alguns itens não puderam ser baixados');
        return { success: false, errors: results.filter(r => !r.success) };
      }
    } catch (error) {
      console.error('Error processing sale:', error);
      toast.error('Erro ao processar venda');
      return { success: false, error: error.message };
    }
  };

  /**
   * Entrada de estoque (compra/reposição)
   */
  const addStock = async (productId, quantity, lotData = null, reason = 'Entrada de estoque') => {
    try {
      const result = await increaseStock(productId, quantity, lotData, reason);

      if (result.success) {
        return { success: true };
      } else {
        toast.error(result.error || 'Erro ao adicionar estoque');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error('Erro ao adicionar estoque');
      return { success: false, error: error.message };
    }
  };

  /**
   * Buscar produtos para seleção
   */
  const searchProductsForSelection = async (searchTerm) => {
    try {
      const result = await searchProducts(searchTerm);
      if (result.success) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  };

  /**
   * Verificar disponibilidade de estoque
   */
  const checkStockAvailability = (productId, quantity) => {
    const product = products.find(p => p.id === productId || p.firestoreId === productId);
    if (!product) return { available: false, reason: 'Produto não encontrado' };

    const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
    
    if (availableStock < quantity) {
      return {
        available: false,
        reason: `Estoque insuficiente. Disponível: ${availableStock}`,
        availableStock,
      };
    }

    return { available: true, availableStock };
  };

  /**
   * Obter informações do produto
   */
  const getProductInfo = (productId) => {
    return products.find(p => p.id === productId || p.firestoreId === productId);
  };

  return {
    // Orçamentos
    addProductToBudget,
    removeProductFromBudget,
    approveBudget,
    cancelBudget,
    
    // Vendas
    processSale,
    
    // Estoque
    addStock,
    
    // Utilidades
    searchProductsForSelection,
    checkStockAvailability,
    getProductInfo,
  };
};
