import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiPlus, 
  FiMinus, 
  FiTrash, 
  FiX
} from 'react-icons/fi';
import { clsx } from 'clsx';

const Cart = ({ 
  isOpen, 
  onClose, 
  items = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onCheckout,
  isLoading = false 
}) => {
  // Calcular totais
  const subtotal = items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const total = subtotal;

  // Funções e arrays removidos: paymentMethods e handleCustomerDataChange não são mais necessários

  const handleCheckout = () => {
    const saleData = {
      items,
      total,
      subtotal,
      timestamp: new Date().toISOString()
    };
    
    onCheckout(saleData);
  };

  const canCheckout = items.length > 0 && !isLoading;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 cursor-pointer"
      />
      
      {/* Cart Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">
              Carrinho ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FiShoppingCart size={48} className="mb-4 opacity-50" />
              <p className="text-center">Carrinho vazio</p>
              <p className="text-sm text-center mt-1">Adicione produtos para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {item.nome}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          R$ {item.preco.toFixed(2)} cada
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                      >
                        <FiTrash size={14} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantidade - 1)}
                          disabled={item.quantidade <= 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantidade + 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Limpar Carrinho
                </button>
              )}
            </div>
          )}
        </div>

        {/* Checkout Section */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Resumo do Total */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Quant. Itens:</span>
                <span>{items.reduce((sum, item) => sum + item.quantidade, 0)}</span>
              </div>

              
              <div className="flex justify-between items-center font-semibold text-lg border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={!canCheckout}
              className={clsx(
                'w-full py-3 rounded-lg font-semibold transition-all',
                canCheckout
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </div>
              ) : (
                'Finalizar Venda'
              )}
            </button>
          </div>
        )}
      </motion.div>
    </>

};

export default Cart;