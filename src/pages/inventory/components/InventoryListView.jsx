import { motion } from 'framer-motion';
import { Package, Edit, Eye, AlertTriangle } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';

const InventoryListView = ({ products, onViewProduct, onEditProduct }) => {
  const { isDarkMode } = useThemeStore();
  const MotionDiv = motion.div;
  const MotionTr = motion.tr;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        rounded-2xl backdrop-blur-xl overflow-hidden
        ${
          isDarkMode
            ? 'bg-gray-900/90 border-[4px] border-gray-500 shadow-[0_0_0_1px_rgba(59,130,246,0.3),0_8px_30px_rgba(0,0,0,0.6)]'
            : 'bg-white border-[4px] border-gray-400 shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_8px_30px_rgba(0,0,0,0.35)]'
        }
      `}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`
              ${
                isDarkMode
                  ? 'bg-gray-800/70 border-b-[3px] border-gray-600/80'
                  : 'bg-gray-100 border-b-[3px] border-gray-400/80'
              }
            `}
            >
              <th
                className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Produto
              </th>
              <th
                className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                SKU
              </th>
              <th
                className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Categoria
              </th>
              <th
                className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Disponível
              </th>
              <th
                className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Total
              </th>
              <th
                className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Preço
              </th>
              <th
                className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Status
              </th>
              <th
                className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const availableStock =
                (product.stock_total || 0) - (product.stock_reserved || 0);
              const isLowStock = availableStock <= (product.stock_min || 0);
              const isOutOfStock = availableStock <= 0;

              return (
                <MotionTr
                  key={product.id || product.firestoreId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`
                    transition-all
                    ${
                      isDarkMode
                        ? 'border-b-[2px] border-gray-700/60 hover:bg-gray-800/50'
                        : 'border-b-[2px] border-gray-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-gray-50'
                    }
                  `}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                        border-[2px] overflow-hidden
                        ${
                          isDarkMode
                            ? 'bg-gray-800 border-gray-600/60'
                            : 'bg-gray-100 border-gray-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                        }
                      `}
                      >
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package
                            className={`w-6 h-6 ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`font-semibold text-sm truncate ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {product.name}
                        </div>
                        {product.brand && (
                          <div
                            className={`text-xs mt-0.5 ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-600'
                            }`}
                          >
                            {product.brand}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`
                          inline-flex px-3 py-1.5 rounded-lg text-xs font-medium
                          border-[2px]
                          ${
                            isDarkMode
                              ? 'bg-gray-800/50 border-gray-600/60 text-gray-300'
                              : 'bg-white border-gray-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.12)] text-gray-700'
                          }
                        `}
                      >
                        {product.sku || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`
                          inline-flex px-3 py-1.5 rounded-lg text-xs font-medium
                          border-[2px]
                          ${
                            isDarkMode
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : 'bg-blue-100 border-blue-400/80 shadow-[0_2px_8px_rgba(59,130,246,0.2)] text-blue-700'
                          }
                        `}
                      >
                        {product.category || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <div
                        className={`
                        px-4 py-2 rounded-lg text-base font-bold
                        border-[2px]
                        ${
                          isOutOfStock
                            ? isDarkMode
                              ? 'bg-red-500/10 border-red-500/40 text-red-400'
                              : 'bg-red-100 border-red-400/80 shadow-[0_2px_8px_rgba(220,38,38,0.2)] text-red-600'
                            : isLowStock
                              ? isDarkMode
                                ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                                : 'bg-yellow-100 border-yellow-400/80 shadow-[0_2px_8px_rgba(234,179,8,0.2)] text-yellow-600'
                              : isDarkMode
                                ? 'bg-green-500/10 border-green-500/40 text-green-400'
                                : 'bg-green-100 border-green-400/80 shadow-[0_2px_8px_rgba(34,197,94,0.2)] text-green-600'
                        }
                      `}
                      >
                        {availableStock}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <div
                        className={`
                        px-4 py-2 rounded-lg text-base font-bold
                        border-[2px]
                        ${
                          isDarkMode
                            ? 'bg-gray-800/50 border-gray-600/60 text-white'
                            : 'bg-white border-gray-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.12)] text-gray-900'
                        }
                      `}
                      >
                        {product.stock_total || 0}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <div
                        className={`
                        px-4 py-2 rounded-lg text-base font-bold
                        border-[2px]
                        ${
                          isDarkMode
                            ? 'bg-green-500/10 border-green-500/40 text-green-400'
                            : 'bg-green-100 border-green-400/80 shadow-[0_2px_8px_rgba(34,197,94,0.2)] text-green-600'
                        }
                      `}
                      >
                        R$ {(product.sale_price || 0).toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center">
                      {isOutOfStock && (
                        <div
                          className={`
                          px-3 py-1.5 rounded-lg text-xs font-bold
                          border-[2px]
                          ${
                            isDarkMode
                              ? 'bg-red-500/20 border-red-500/50 text-red-400'
                              : 'bg-red-100 border-red-300 text-red-700'
                          }
                        `}
                        >
                          Sem Estoque
                        </div>
                      )}
                      {!isOutOfStock && isLowStock && (
                        <div
                          className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                          border-[2px]
                          ${
                            isDarkMode
                              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                              : 'bg-yellow-100 border-yellow-300 text-yellow-700'
                          }
                        `}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Baixo
                        </div>
                      )}
                      {!isOutOfStock && !isLowStock && (
                        <div
                          className={`
                          px-3 py-1.5 rounded-lg text-xs font-bold
                          border-[2px]
                          ${
                            isDarkMode
                              ? 'bg-green-500/20 border-green-500/50 text-green-400'
                              : 'bg-green-100 border-green-300 text-green-700'
                          }
                        `}
                        >
                          OK
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProduct(product);
                        }}
                        className={`
                          p-2.5 rounded-lg transition-all
                          border-[2px]
                          ${
                            isDarkMode
                              ? 'bg-gray-800 border-gray-600/60 hover:border-gray-500 text-gray-400 hover:text-gray-300'
                              : 'bg-gray-100 border-gray-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:border-gray-400 text-gray-600 hover:text-gray-900'
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
                          p-2.5 rounded-lg transition-all
                          border-[2px]
                          ${
                            isDarkMode
                              ? 'bg-blue-600/20 border-blue-500/40 hover:border-blue-500/60 text-blue-400 hover:text-blue-300'
                              : 'bg-blue-50 border-blue-300/60 hover:border-blue-400 text-blue-600 hover:text-blue-700'
                          }
                        `}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </MotionTr>
              );
            })}
          </tbody>
        </table>
      </div>
    </MotionDiv>
  );
};

export default InventoryListView;


