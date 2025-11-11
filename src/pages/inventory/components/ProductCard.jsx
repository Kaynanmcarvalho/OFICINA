import { motion } from 'framer-motion';
import { Package, AlertTriangle, Edit, Eye, MoreVertical, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { useState } from 'react';

const ProductCard = ({ product, onView, onEdit }) => {
  const { isDarkMode } = useThemeStore();
  const [showActions, setShowActions] = useState(false);

  const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
  const isLowStock = availableStock <= (product.stock_min || 0);
  const isOutOfStock = availableStock <= 0;
  
  // Check for expiring lots
  const hasExpiringSoon = product.lots?.some(lot => {
    if (!lot.validade) return false;
    const expiryDate = new Date(lot.validade);
    const daysUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const getStockStatus = () => {
    if (isOutOfStock) return { label: 'Sem Estoque', color: 'red' };
    if (isLowStock) return { label: 'Estoque Baixo', color: 'yellow' };
    return { label: 'Em Estoque', color: 'green' };
  };

  const stockStatus = getStockStatus();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      className={`
        group relative p-6 rounded-2xl backdrop-blur-xl
        transition-all duration-500
        ${isDarkMode
          ? 'bg-gray-900/80 border-[3px] border-gray-700/80 hover:border-gray-600 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
          : 'bg-white border-[3px] border-gray-500/80 hover:border-gray-600 shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.30)]'
        }
      `}
      style={{ minWidth: '320px' }}
    >
      {/* Product Image or Icon */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          flex-shrink-0 overflow-hidden border-[2px]
          ${isDarkMode
            ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600/70'
            : 'bg-gradient-to-br from-blue-100 to-blue-50 border-gray-300/70'
          }
        `}>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className={`w-8 h-8 ${
              isDarkMode ? 'text-gray-400' : 'text-blue-600'
            }`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-bold truncate mb-1 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {product.name}
          </h3>
          
          {product.sku && (
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              SKU: {product.sku}
            </p>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className={`
          inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
          border-[1.5px]
          ${stockStatus.color === 'green'
            ? isDarkMode
              ? 'bg-green-500/20 border-green-500/40 text-green-400'
              : 'bg-green-100 border-green-300/70 text-green-700'
            : stockStatus.color === 'yellow'
              ? isDarkMode
                ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                : 'bg-yellow-100 border-yellow-300/70 text-yellow-700'
              : isDarkMode
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-red-100 border-red-300/70 text-red-700'
          }
        `}>
          {stockStatus.label}
        </div>

        {hasExpiringSoon && (
          <div className={`
            inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
            border-[1.5px]
            ${isDarkMode
              ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
              : 'bg-orange-100 border-orange-300/70 text-orange-700'
            }
          `}>
            <Clock className="w-3 h-3" />
            Vencendo
          </div>
        )}

        {product.stock_reserved > 0 && (
          <div className={`
            inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
            border-[1.5px]
            ${isDarkMode
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
              : 'bg-purple-100 border-purple-300/70 text-purple-700'
            }
          `}>
            {product.stock_reserved} Reservado(s)
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2 mb-4">
        {product.brand && (
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Marca:
            </span>
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-900'
            }`}>
              {product.brand}
            </span>
          </div>
        )}

        {product.category && (
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Categoria:
            </span>
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-900'
            }`}>
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* Stock Info */}
      <div className={`
        grid grid-cols-3 gap-3 py-3 border-t-[3px] border-b-[3px] mb-4
        ${isDarkMode 
          ? 'border-gray-500/80 shadow-[0_-2px_8px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.2)]' 
          : 'border-gray-400/80 shadow-[0_-2px_8px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.1)]'
        }
      `}>
        <div className="text-center">
          <div className={`text-xs mb-1 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Disponível
          </div>
          <div className={`text-lg font-bold ${
            isOutOfStock
              ? isDarkMode ? 'text-red-400' : 'text-red-600'
              : isLowStock
                ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                : isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>
            {availableStock}
          </div>
        </div>

        <div className="text-center">
          <div className={`text-xs mb-1 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Total
          </div>
          <div className={`text-lg font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {product.stock_total || 0}
          </div>
        </div>

        <div className="text-center">
          <div className={`text-xs mb-1 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Mínimo
          </div>
          <div className={`text-lg font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {product.stock_min || 0}
          </div>
        </div>
      </div>

      {/* Price Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Preço de Venda
          </div>
          <div className={`text-xl font-bold ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>
            R$ {(product.sale_price || 0).toFixed(2)}
          </div>
        </div>

        {product.cost_price && (
          <div className="text-right">
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Custo
            </div>
            <div className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              R$ {product.cost_price.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onView(product);
          }}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
            font-medium text-sm transition-all border-[2px]
            ${isDarkMode
              ? 'bg-blue-600 border-blue-500/50 hover:bg-blue-500 hover:border-blue-400/50 text-white'
              : 'bg-blue-600 border-blue-500/50 hover:bg-blue-700 hover:border-blue-600/50 text-white'
            }
          `}
        >
          <Eye className="w-4 h-4" />
          Ver Detalhes
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
          className={`
            p-2.5 rounded-lg transition-all border-[2px]
            ${isDarkMode
              ? 'bg-gray-800 border-gray-600/60 hover:bg-gray-700 hover:border-gray-500/60 text-gray-300'
              : 'bg-gray-200 border-gray-300/70 hover:bg-gray-300 hover:border-gray-400/70 text-gray-800'
            }
          `}
        >
          <Edit className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
