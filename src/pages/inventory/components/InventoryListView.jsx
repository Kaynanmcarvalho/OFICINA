/**
 * InventoryListView - Sober Premium Table
 * Tabela elegante com design escuro e profundidade
 * @version 4.0.0
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

// Ícones SVG
const TableIcon = ({ name, size = 16 }) => {
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
    sortAsc: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12l7-7 7 7"/>
      </svg>
    ),
    sortDesc: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7 7 7-7"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

const InventoryListView = ({ products, onViewProduct, onEditProduct }) => {
  const { isDarkMode } = useThemeStore();
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      let aVal, bVal;
      switch (sortConfig.key) {
        case 'name': aVal = a.name?.toLowerCase() || ''; bVal = b.name?.toLowerCase() || ''; break;
        case 'sku': aVal = a.sku?.toLowerCase() || ''; bVal = b.sku?.toLowerCase() || ''; break;
        case 'category': aVal = a.category?.toLowerCase() || ''; bVal = b.category?.toLowerCase() || ''; break;
        case 'available': aVal = (a.stock_total || 0) - (a.stock_reserved || 0); bVal = (b.stock_total || 0) - (b.stock_reserved || 0); break;
        case 'total': aVal = a.stock_total || 0; bVal = b.stock_total || 0; break;
        case 'price': aVal = a.sale_price || 0; bVal = b.sale_price || 0; break;
        default: return 0;
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [products, sortConfig]);

  const columns = [
    { key: 'name', label: 'Produto', sortable: true },
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'category', label: 'Categoria', sortable: true },
    { key: 'available', label: 'Disponível', sortable: true },
    { key: 'total', label: 'Total', sortable: true },
    { key: 'price', label: 'Preço', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Ações', sortable: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="inv-card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="inv-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`${col.sortable ? 'cursor-pointer hover:text-[var(--inv-primary)] select-none' : ''} ${sortConfig.key === col.key ? 'text-[var(--inv-primary)]' : ''}`}
                  aria-sort={col.sortable && sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && sortConfig.key === col.key && (
                      <span className="opacity-80">
                        <TableIcon name={sortConfig.direction === 'asc' ? 'sortAsc' : 'sortDesc'} size={12} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => {
              const avail = (product.stock_total || 0) - (product.stock_reserved || 0);
              const isLow = avail <= (product.stock_min || 0);
              const isOut = avail <= 0;
              const status = isOut ? { label: 'Esgotado', type: 'danger' } : isLow ? { label: 'Baixo Estoque', type: 'warning' } : { label: 'Em Estoque', type: 'success' };

              return (
                <motion.tr
                  key={product.id || product.firestoreId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(index * 0.02, 0.2) }}
                  className="group"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-[var(--inv-surface)] border border-[var(--inv-border)]">
                        {product.images?.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[var(--inv-primary)]"><TableIcon name="package" size={18} /></span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-[var(--inv-text)]">{product.name}</p>
                        {product.brand && <p className="text-xs text-[var(--inv-muted)]">{product.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td><span className="text-sm text-[var(--inv-text-secondary)]">{product.sku || '-'}</span></td>
                  <td>
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--inv-surface)] text-[var(--inv-text-secondary)] border border-[var(--inv-border)]">
                      {product.category || '-'}
                    </span>
                  </td>
                  <td>
                    <span className={`text-sm font-semibold text-[var(--inv-${isOut ? 'danger' : isLow ? 'warning' : 'accent'})]`}>
                      {avail}
                    </span>
                  </td>
                  <td><span className="text-sm text-[var(--inv-text)]">{product.stock_total || 0}</span></td>
                  <td><span className="text-sm font-semibold text-[var(--inv-primary)]">R$ {(product.sale_price || 0).toFixed(2)}</span></td>
                  <td>
                    <span className={`inv-pill ${status.type}`}>
                      <span className="inv-pill-dot" />
                      {status.label}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewProduct(product); }}
                        className="inv-btn-icon !w-8 !h-8"
                        aria-label={`Ver ${product.name}`}
                      >
                        <TableIcon name="eye" size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditProduct(product); }}
                        className="inv-btn-icon !w-8 !h-8"
                        aria-label={`Editar ${product.name}`}
                      >
                        <TableIcon name="edit" size={14} />
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
