/**
 * ProductCard - Premium Apple-like + Linear Design
 * Card de produto com cores suaves, ícones premium e microdetalhes
 * @version 2.0.0
 */

import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

// Cores Premium
const COLORS = {
  blue: { light: '#4D7CFE', dark: '#6B8FFF', bg: 'rgba(77, 124, 254, 0.08)' },
  green: { light: '#3EBE64', dark: '#4FD97A', bg: 'rgba(62, 190, 100, 0.08)' },
  amber: { light: '#F7B731', dark: '#FFCA4D', bg: 'rgba(247, 183, 49, 0.08)' },
  red: { light: '#FF6B6B', dark: '#FF8585', bg: 'rgba(255, 107, 107, 0.08)' },
  orange: { light: '#FF9F43', dark: '#FFB366', bg: 'rgba(255, 159, 67, 0.08)' },
};

// Ícones SVG Premium
const CardIcon = ({ type, color, size = 20 }) => {
  const icons = {
    package: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    eye: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    edit: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

const ProductCard = ({ product, onView, onEdit }) => {
  const { isDarkMode } = useThemeStore();

  const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
  const isLowStock = availableStock <= (product.stock_min || 0);
  const isOutOfStock = availableStock <= 0;

  const hasExpiringSoon = product.lots?.some(lot => {
    if (!lot.validade) return false;
    const days = (new Date(lot.validade) - new Date()) / (1000 * 60 * 60 * 24);
    return days <= 30 && days > 0;
  });

  const getStatus = () => {
    if (isOutOfStock) return { label: 'Esgotado', color: COLORS.red };
    if (isLowStock) return { label: 'Baixo Estoque', color: COLORS.amber };
    return { label: 'Em Estoque', color: COLORS.green };
  };

  const status = getStatus();
  const iconColor = isDarkMode ? COLORS.blue.dark : COLORS.blue.light;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ 
        scale: 1.008, 
        y: -3,
        boxShadow: isDarkMode ? '0 20px 50px rgba(0,0,0,0.4)' : '0 20px 50px rgba(0,0,0,0.08)',
        borderColor: isDarkMode ? '#3F3F46' : '#E5E7EB'
      }}
      whileTap={{ scale: 0.995 }}
      className={`group relative p-5 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden ${
        isDarkMode 
          ? 'bg-zinc-900 border border-zinc-800' 
          : 'bg-white border border-gray-100'
      }`}
      style={{ 
        boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)',
        background: isDarkMode 
          ? 'linear-gradient(180deg, #18181B 0%, #18181B 100%)' 
          : 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)'
      }}
      onClick={() => onView(product)}
    >
      {/* Gradiente sutil no topo */}
      <div className="absolute top-0 left-0 right-0 h-24 opacity-30 pointer-events-none" style={{ background: `linear-gradient(180deg, ${status.color.bg} 0%, transparent 100%)` }} />

      {/* Header com Imagem/Ícone */}
      <div className="relative flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border ${
          isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-100'
        }`}>
          {product.images?.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <CardIcon type="package" color={iconColor} size={24} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold truncate mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {product.name}
          </h3>
          {product.sku && (
            <p className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>
              SKU: {product.sku}
            </p>
          )}
        </div>
      </div>

      {/* Status Tags Premium */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span 
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
          style={{ backgroundColor: status.color.bg, color: isDarkMode ? status.color.dark : status.color.light }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isDarkMode ? status.color.dark : status.color.light }} />
          {status.label}
        </span>
        {hasExpiringSoon && (
          <span 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{ backgroundColor: COLORS.orange.bg, color: isDarkMode ? COLORS.orange.dark : COLORS.orange.light }}
          >
            <CardIcon type="clock" color={isDarkMode ? COLORS.orange.dark : COLORS.orange.light} size={12} />
            Vencendo
          </span>
        )}
      </div>

      {/* Métricas de Estoque */}
      <div className={`grid grid-cols-3 gap-3 py-3.5 mb-4 border-y ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}>
        {[
          { label: 'Disponível', value: availableStock, color: isOutOfStock ? COLORS.red : isLowStock ? COLORS.amber : COLORS.green },
          { label: 'Total', value: product.stock_total || 0, color: null },
          { label: 'Mínimo', value: product.stock_min || 0, color: null },
        ].map((m, i) => (
          <div key={i} className="text-center">
            <p className={`text-lg font-semibold`} style={{ color: m.color ? (isDarkMode ? m.color.dark : m.color.light) : (isDarkMode ? '#FFFFFF' : '#1F2937') }}>
              {m.value}
            </p>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="space-y-1.5 mb-4">
        {product.brand && (
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>Marca</span>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>{product.brand}</span>
          </div>
        )}
        {product.category && (
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>Categoria</span>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>{product.category}</span>
          </div>
        )}
      </div>

      {/* Preço Premium */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>Preço de Venda</p>
          <p className="text-xl font-semibold" style={{ color: isDarkMode ? COLORS.blue.dark : COLORS.blue.light }}>
            R$ {(product.sale_price || 0).toFixed(2)}
          </p>
        </div>
        {product.cost_price && (
          <div className="text-right">
            <p className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>Custo</p>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              R$ {product.cost_price.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Ações Premium */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(77, 124, 254, 0.25)' }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => { e.stopPropagation(); onView(product); }}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #4D7CFE 0%, #5B8AFF 100%)', boxShadow: '0 4px 15px rgba(77, 124, 254, 0.3)' }}
        >
          <CardIcon type="eye" color="#FFFFFF" size={16} />
          Ver detalhes
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? '#3F3F46' : '#F3F4F6' }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onEdit(product); }}
          className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-300' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}
        >
          <CardIcon type="edit" color="currentColor" size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
