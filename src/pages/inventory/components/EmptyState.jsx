/**
 * EmptyState - Premium Apple-like Design
 * Estado vazio elegante com cores suaves
 * @version 2.0.0
 */

import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

// Cores Premium
const COLORS = {
  blue: { light: '#4D7CFE', dark: '#6B8FFF', bg: 'rgba(77, 124, 254, 0.08)' },
};

// Ícones SVG Premium
const EmptyIcon = ({ type, color, size = 48 }) => {
  const icons = {
    package: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    plus: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

const EmptyState = ({ hasProducts, hasFilters, onNewProduct, onClearFilters }) => {
  const { isDarkMode } = useThemeStore();
  const iconColor = isDarkMode ? '#52525B' : '#D1D5DB';

  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex flex-col items-center justify-center py-16 px-6 rounded-2xl ${
          isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'
        }`}
        style={{ boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)' }}
      >
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
          <EmptyIcon type="search" color={iconColor} size={36} />
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Nenhum produto encontrado
        </h3>
        <p className={`text-sm text-center mb-6 max-w-sm ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>
          Não encontramos produtos com os filtros aplicados.
        </p>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(77, 124, 254, 0.25)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onClearFilters}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #4D7CFE 0%, #5B8AFF 100%)', boxShadow: '0 4px 15px rgba(77, 124, 254, 0.3)' }}
        >
          Limpar Filtros
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-16 px-6 rounded-2xl ${
        isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'
      }`}
      style={{ boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)' }}
    >
      <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: COLORS.blue.bg }}>
        <EmptyIcon type="package" color={isDarkMode ? COLORS.blue.dark : COLORS.blue.light} size={44} />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Nenhum produto cadastrado
      </h3>
      <p className={`text-sm text-center mb-6 max-w-sm ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>
        Comece adicionando seu primeiro produto ao inventário.
      </p>
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(77, 124, 254, 0.25)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onNewProduct}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
        style={{ background: 'linear-gradient(135deg, #4D7CFE 0%, #5B8AFF 100%)', boxShadow: '0 4px 15px rgba(77, 124, 254, 0.3)' }}
      >
        <EmptyIcon type="plus" />
        Adicionar Produto
      </motion.button>
    </motion.div>
  );
};

export default EmptyState;
