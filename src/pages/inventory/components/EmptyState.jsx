/**
 * EmptyState - Sober Premium Design
 * Estado vazio elegante com design escuro
 * @version 3.0.0
 */

import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

// Ícones SVG
const EmptyIcon = ({ name, size = 48 }) => {
  const icons = {
    package: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    plus: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

const EmptyState = ({ hasProducts, hasFilters, onNewProduct, onClearFilters }) => {
  const { isDarkMode } = useThemeStore();

  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inv-card flex flex-col items-center justify-center py-16 px-6"
      >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 bg-[var(--inv-surface)] border border-[var(--inv-border)]">
          <span className="text-[var(--inv-muted)]"><EmptyIcon name="search" size={36} /></span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[var(--inv-text)]">
          Nenhum produto encontrado
        </h3>
        <p className="text-sm text-center mb-6 max-w-sm text-[var(--inv-text-secondary)]">
          Não encontramos produtos com os filtros aplicados.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClearFilters}
          className="inv-btn-primary"
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
      className="inv-card flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-5 bg-[var(--inv-primary-muted)]">
        <span className="text-[var(--inv-primary)]"><EmptyIcon name="package" size={44} /></span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-[var(--inv-text)]">
        Nenhum produto cadastrado
      </h3>
      <p className="text-sm text-center mb-6 max-w-sm text-[var(--inv-text-secondary)]">
        Comece adicionando seu primeiro produto ao inventário.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNewProduct}
        className="inv-btn-primary"
      >
        <EmptyIcon name="plus" />
        Adicionar Produto
      </motion.button>
    </motion.div>
  );
};

export default EmptyState;
