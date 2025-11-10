import { motion } from 'framer-motion';
import { Package, Edit, Eye, AlertTriangle, Clock } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';

const InventoryListView = ({ products, onViewProduct, onEditProduct }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        rounded-2xl backdrop-blur-xl overflow-hidden
        ${isDarkMode
          ? 'bg-gray-900/80 border-[2px] border-gray-700/80'
          : 'bg-white/80 border-[2px] border-gray-200'
        }
      `}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`
              ${isDarkMode
                ? 'bg-gray-800/50 border-b border-gray-700'
                : 'bg-gray-50 border-b border-gray-200'
              }
            `}>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Produto
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                SKU
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Categoria
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Disponível
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total
              </th>
              <th className={`px-6 py-4 text-right text-xs font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Preço
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Status
              </th>
              <th className={`px-6 py-4 text-right text-xs font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
              const isLowStock = availableStock <= (product.stock_min || 0);
              const isOutOfStock = availableStock <= 0;

              return (
                <motion.tr
                  key={product.id || product.firestoreId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => onViewProduct(product)}
                  className={`
                    cursor-pointer transition-colors
                    ${isDarkMode
                      ? 'border-b border-gray-800 hover:bg-gray-800/50'
                      : 'border-b border-gray-100 hover:bg-gray-50'
                    }
                  `}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        ${isDarkMode
                          ? 'bg-gray-800'
                          : 'bg-gray-100'
                        }
                      `}>
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className={`w-5 h-5 ${
                            isDarkMode ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                      <div>
                        <div className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {product.name}
                        </div>
                        {product.brand && (
                          <div className={`text-xs ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            {product.brand}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {product.sku || '-'}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {product.category || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold ${
                      isOutOfStock
                        ? isDarkMode ? 'text-red-400' : 'text-red-600'
                        : isLowStock
                          ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                          : isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {availableStock}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-center font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {product.stock_total || 0}
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    R$ {(product.sale_price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {isOutOfStock && (
                        <div className={`
                          px-2 py-1 rounded-full text-xs font-semibold
                          ${isDarkMode
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-red-100 text-red-700'
                          }
                        `}>
                          Sem Estoque
                        </div>
                      )}
                      {!isOutOfStock && isLowStock && (
                        <div className={`
                          flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                          ${isDarkMode
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-yellow-100 text-yellow-700'
                          }
                        `}>
                          <AlertTriangle className="w-3 h-3" />
                          Baixo
                        </div>
                      )}
                      {!isOutOfStock && !isLowStock && (
                        <div className={`
                          px-2 py-1 rounded-full text-xs font-semibold
                          ${isDarkMode
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-green-100 text-green-700'
                          }
                        `}>
                          OK
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProduct(product);
                        }}
                        className={`
                          p-2 rounded-lg transition-colors
                          ${isDarkMode
                            ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }
                        `}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct(product);
                        }}
                        className={`
                          p-2 rounded-lg transition-colors
                          ${isDarkMode
                            ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }
                        `}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default InventoryListView;
