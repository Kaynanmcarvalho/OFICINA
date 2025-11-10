/**
 * ProductSelector - Componente para seleção de produtos em orçamentos e vendas
 * Com busca, preview e verificação de estoque
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, AlertTriangle, Check, X } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useInventoryIntegration } from '../../hooks/useInventoryIntegration';

const ProductSelector = ({ onSelect, onClose, selectedProducts = [] }) => {
  const { isDarkMode } = useThemeStore();
  const { searchProductsForSelection, checkStockAvailability, getProductInfo } = useInventoryIntegration();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    setIsSearching(true);
    const results = await searchProductsForSelection(searchTerm);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const availability = checkStockAvailability(selectedProduct.id, quantity);
    
    if (!availability.available) {
      alert(availability.reason);
      return;
    }

    onSelect({
      productId: selectedProduct.id || selectedProduct.firestoreId,
      name: selectedProduct.name,
      sku: selectedProduct.sku,
      quantity,
      price: selectedProduct.sale_price,
      cost: selectedProduct.cost_price,
      availableStock: availability.availableStock,
    });

    // Reset
    setSelectedProduct(null);
    setQuantity(1);
    setSearchTerm('');
    setSearchResults([]);
  };

  const isAlreadySelected = (productId) => {
    return selectedProducts.some(p => p.productId === productId);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`
          relative w-full max-w-2xl max-h-[80vh] flex flex-col
          rounded-3xl backdrop-blur-xl overflow-hidden
          ${isDarkMode
            ? 'bg-gray-900/95 border-[2px] border-gray-700/80 shadow-[0_20px_80px_rgba(0,0,0,0.8)]'
            : 'bg-white/95 border-[2px] border-gray-200 shadow-[0_20px_80px_rgba(0,0,0,0.2)]'
          }
        `}
      >
        {/* Header */}
        <div className={`
          flex items-center justify-between px-6 py-4 border-b
          ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Selecionar Produto
          </h2>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-xl transition-colors
              ${isDarkMode
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}">
          <div className={`
            relative flex items-center gap-3 px-4 py-3 rounded-xl
            ${isDarkMode
              ? 'bg-gray-800 border-[2px] border-gray-700'
              : 'bg-white border-[2px] border-gray-200'
            }
          `}>
            <Search className={`w-5 h-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, SKU ou código..."
              autoFocus
              className={`
                flex-1 bg-transparent outline-none text-sm
                ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
              `}
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSearching ? (
            <div className="text-center py-8">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Buscando...
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8">
              <Package className={`w-12 h-12 mx-auto mb-3 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchTerm.length >= 2
                  ? 'Nenhum produto encontrado'
                  : 'Digite para buscar produtos'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map((product) => {
                const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
                const isLowStock = availableStock <= (product.stock_min || 0);
                const isOutOfStock = availableStock <= 0;
                const alreadySelected = isAlreadySelected(product.id || product.firestoreId);

                return (
                  <button
                    key={product.id || product.firestoreId}
                    onClick={() => !isOutOfStock && !alreadySelected && handleSelectProduct(product)}
                    disabled={isOutOfStock || alreadySelected}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl text-left
                      transition-all
                      ${selectedProduct?.id === product.id
                        ? isDarkMode
                          ? 'bg-blue-600/20 border-[2px] border-blue-600'
                          : 'bg-blue-50 border-[2px] border-blue-500'
                        : isDarkMode
                          ? 'bg-gray-800 border-[2px] border-gray-700 hover:border-gray-600'
                          : 'bg-white border-[2px] border-gray-200 hover:border-gray-300'
                      }
                      ${(isOutOfStock || alreadySelected) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                    `}>
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className={`w-6 h-6 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {product.name}
                        </h3>
                        {alreadySelected && (
                          <span className={`
                            px-2 py-0.5 rounded-full text-xs font-semibold
                            ${isDarkMode
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-green-100 text-green-700'
                            }
                          `}>
                            Adicionado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          SKU: {product.sku || '-'}
                        </span>
                        <span className={`font-semibold ${
                          isOutOfStock
                            ? isDarkMode ? 'text-red-400' : 'text-red-600'
                            : isLowStock
                              ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                              : isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          Disponível: {availableStock}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                        R$ {(product.sale_price || 0).toFixed(2)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Product Actions */}
        {selectedProduct && (
          <div className={`
            p-6 border-t
            ${isDarkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}
          `}>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Quantidade
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  max={selectedProduct.stock_total - selectedProduct.stock_reserved}
                  className={`
                    w-full px-4 py-3 rounded-xl text-sm
                    ${isDarkMode
                      ? 'bg-gray-900 border-[2px] border-gray-700 text-white'
                      : 'bg-white border-[2px] border-gray-200 text-gray-900'
                    }
                  `}
                />
              </div>

              <div className="flex-1">
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Total
                </label>
                <div className={`
                  px-4 py-3 rounded-xl text-lg font-bold
                  ${isDarkMode
                    ? 'bg-gray-900 text-green-400'
                    : 'bg-white text-green-600'
                  }
                `}>
                  R$ {(selectedProduct.sale_price * quantity).toFixed(2)}
                </div>
              </div>

              <button
                onClick={handleAddProduct}
                className={`
                  self-end flex items-center gap-2 px-6 py-3 rounded-xl
                  font-semibold transition-all
                  ${isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                `}
              >
                <Check className="w-5 h-5" />
                Adicionar
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductSelector;
