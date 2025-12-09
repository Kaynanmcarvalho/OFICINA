/**
 * InventoryListView - Premium Apple-like Table
 * Tabela elegante com cores suaves e microdetalhes
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
};

// Ícones SVG Premium
const TableIcon = ({ type, color, size = 18 }) => {
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
    alert: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

const InventoryListView = ({ products, onViewProduct, onEditProduct }) => {
  const { isDarkMode } = useThemeStore();
  const iconColor = isDarkMode ? '#A1A1AA' : '#6B7280';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`rounded-2xl overflow-hidden ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'}`}
      style={{ boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)' }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={isDarkMode ? 'bg-zinc-800/50' : 'bg-gray-50'}>
              {['Produto', 'SKU', 'Categoria', 'Disponível', 'Total', 'Preço', 'Status', 'Ações'].map(h => (
                <th key={h} className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-[#444444]'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const avail = (product.stock_total || 0) - (product.stock_reserved || 0);
              const isLow = avail <= (product.stock_min || 0);
              const isOut = avail <= 0;
              const status = isOut ? { label: 'Esgotado', color: COLORS.red } : isLow ? { label: 'Baixo Estoque', color: COLORS.amber } : { label: 'Em Estoque', color: COLORS.green };

              return (
                <motion.tr
                  key={product.id || product.firestoreId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(index * 0.02, 0.2) }}
                  className={`transition-colors ${isDarkMode ? 'border-b border-zinc-800 hover:bg-zinc-800/30' : 'border-b border-gray-50 hover:bg-gray-50/50'}`}
                  style={{ backgroundColor: !isDarkMode && index % 2 === 1 ? '#FAFAFA' : 'transparent' }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'}`}>
                        {product.images?.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <TableIcon type="package" color={isDarkMode ? COLORS.blue.dark : COLORS.blue.light} size={18} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</p>
                        {product.brand && <p className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>{product.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{product.sku || '-'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-100 text-gray-700'}`}>
                      {product.category || '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold" style={{ color: isDarkMode ? status.color.dark : status.color.light }}>
                      {avail}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{product.stock_total || 0}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold" style={{ color: isDarkMode ? COLORS.blue.dark : COLORS.blue.light }}>
                      R$ {(product.sale_price || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: status.color.bg, color: isDarkMode ? status.color.dark : status.color.light }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isDarkMode ? status.color.dark : status.color.light }} />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: isDarkMode ? '#3F3F46' : '#F3F4F6' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); onViewProduct(product); }}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                      >
                        <TableIcon type="eye" color="currentColor" size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: isDarkMode ? '#3F3F46' : '#F3F4F6' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); onEditProduct(product); }}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                      >
                        <TableIcon type="edit" color="currentColor" size={16} />
                      </motion.button>
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
