/**
 * ProductCard - Sober Premium Design
 * Card de produto com design escuro, elegante e profundidade
 * @version 4.0.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

// Ícones SVG otimizados
const CardIcon = ({ name, size = 18 }) => {
  const icons = {
    package: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    eye: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    edit: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    info: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

const ProductCard = ({ product, onView, onEdit }) => {
  const { isDarkMode } = useThemeStore();
  const [showTooltip, setShowTooltip] = useState(false);

  const availableStock = (product.stock_total || 0) - (product.stock_reserved || 0);
  const isLowStock = availableStock <= (product.stock_min || 0);
  const isOutOfStock = availableStock <= 0;

  const hasExpiringSoon = product.lots?.some(lot => {
    if (!lot.validade) return false;
    const days = (new Date(lot.validade) - new Date()) / (1000 * 60 * 60 * 24);
    return days <= 30 && days > 0;
  });

  const getStatus = () => {
    if (isOutOfStock) return { label: 'Esgotado', type: 'danger' };
    if (isLowStock) return { label: 'Baixo Estoque', type: 'warning' };
    return { label: 'Em Estoque', type: 'success' };
  };

  const status = getStatus();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.997 }}
      className="inv-card group relative p-5 cursor-pointer"
      onClick={() => onView(product)}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${product.name}`}
      onKeyDown={(e) => e.key === 'Enter' && onView(product)}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-[var(--inv-surface)] border border-[var(--inv-border)]">
          {product.images?.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[var(--inv-primary)]"><CardIcon name="package" size={24} /></span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold truncate text-[var(--inv-text)]">{product.name}</h3>
            
            {/* Info Tooltip */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-full text-[var(--inv-muted)] hover:text-[var(--inv-text-secondary)] transition-colors"
                aria-label="Mais informações"
              >
                <CardIcon name="info" size={14} />
              </button>
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute z-50 left-0 top-full mt-2 p-3 rounded-xl text-xs w-48 bg-[var(--inv-panel)] border border-[var(--inv-border)] shadow-lg"
                  >
                    <div className="space-y-1.5">
                      {product.barcode && <p><span className="text-[var(--inv-muted)]">Código:</span> <span className="text-[var(--inv-text)]">{product.barcode}</span></p>}
                      {product.location && <p><span className="text-[var(--inv-muted)]">Local:</span> <span className="text-[var(--inv-text)]">{product.location}</span></p>}
                      {product.supplier && <p><span className="text-[var(--inv-muted)]">Fornecedor:</span> <span className="text-[var(--inv-text)]">{product.supplier}</span></p>}
                      {product.stock_reserved > 0 && <p><span className="text-[var(--inv-muted)]">Reservado:</span> <span className="text-[var(--inv-warning)]">{product.stock_reserved}</span></p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {product.sku && (
            <p className="text-xs mt-0.5 text-[var(--inv-muted)]">SKU: {product.sku}</p>
          )}
        </div>
      </div>


      {/* Status Pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={`inv-pill ${status.type}`}>
          <span className="inv-pill-dot" />
          {status.label}
        </span>
        {hasExpiringSoon && (
          <span className="inv-pill warning">
            <CardIcon name="clock" size={12} />
            Vencendo
          </span>
        )}
      </div>

      {/* Métricas de Estoque */}
      <div className="grid grid-cols-3 gap-3 py-3.5 mb-4 border-y border-[var(--inv-border)]">
        {[
          { label: 'Disponível', value: availableStock, highlight: isOutOfStock ? 'danger' : isLowStock ? 'warning' : 'accent' },
          { label: 'Total', value: product.stock_total || 0 },
          { label: 'Mínimo', value: product.stock_min || 0 },
        ].map((m, i) => (
          <div key={i} className="text-center">
            <p className={`text-lg font-semibold ${m.highlight ? `text-[var(--inv-${m.highlight})]` : 'text-[var(--inv-text)]'}`}>
              {m.value}
            </p>
            <p className="text-xs text-[var(--inv-muted)]">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="space-y-1.5 mb-4">
        {product.brand && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--inv-muted)]">Marca</span>
            <span className="text-xs font-medium text-[var(--inv-text-secondary)]">{product.brand}</span>
          </div>
        )}
        {product.category && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--inv-muted)]">Categoria</span>
            <span className="text-xs font-medium text-[var(--inv-text-secondary)]">{product.category}</span>
          </div>
        )}
      </div>

      {/* Preço */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--inv-muted)]">Preço de Venda</p>
          <p className="text-xl font-bold text-[var(--inv-primary)]">
            R$ {(product.sale_price || 0).toFixed(2)}
          </p>
        </div>
        {product.cost_price && (
          <div className="text-right">
            <p className="text-xs text-[var(--inv-muted)]">Custo</p>
            <p className="text-sm font-medium text-[var(--inv-text-secondary)]">
              R$ {product.cost_price.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => { e.stopPropagation(); onView(product); }}
          className="inv-btn-primary flex-1 justify-center"
          aria-label={`Ver detalhes de ${product.name}`}
        >
          <CardIcon name="eye" size={16} />
          Ver detalhes
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onEdit(product); }}
          className="inv-btn-icon"
          aria-label={`Editar ${product.name}`}
        >
          <CardIcon name="edit" size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
