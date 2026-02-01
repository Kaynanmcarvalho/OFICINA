/**
 * InventoryPage - Sober Premium Design
 * Design escuro, elegante, com profundidade e imersividade
 * Inspirado em Apple, Linear, Stripe
 * @version 5.0.0
 */

import '../../styles/inventory-sober.css';
import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '../../store/productStore';
import { useThemeStore } from '../../store/themeStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Lazy load components
const InventoryGridView = lazy(() => import('./components/InventoryGridView'));
const InventoryListView = lazy(() => import('./components/InventoryListView'));
const ProductModal = lazy(() => import('./components/ProductModal'));
const EmptyState = lazy(() => import('./components/EmptyState'));

// TORQ AI Features
import { StockPredictionDashboard } from '../../features/stock-prediction';
import { MultiusePartsDashboard } from '../../features/multiuse-parts';
import { PartsSearchPanel } from '../../features/parts-compatibility';
import { VehiclePartsSearchModal } from '../../features/vehicle-parts-search';

const VIEW_MODES = { GRID: 'grid', LIST: 'list' };

// Ícones SVG otimizados (stroke 1.5-2px, corners rounded)
const Icon = ({ name, size = 20, className = '' }) => {
  const icons = {
    package: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    dollar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9.5c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2c-1.1 0-2 .9-2 2s.9 2 2 2h2c1.1 0 2-.9 2-2"/>
      </svg>
    ),
    alert: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    ban: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    archive: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    filter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    ),
    grid: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    list: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    trend: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    layers: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    car: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2"/>
        <circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>
      </svg>
    ),
    x: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
  };
  return <span className={className}>{icons[name]}</span>;
};

// Skeleton Loading
const SkeletonMetric = () => (
  <div className="inv-metric animate-pulse">
    <div className="w-11 h-11 rounded-[10px] bg-[var(--inv-surface)]" />
    <div className="flex-1">
      <div className="h-5 w-16 bg-[var(--inv-surface)] rounded mb-2" />
      <div className="h-3 w-24 bg-[var(--inv-surface)] rounded" />
    </div>
  </div>
);

const InventoryPage = () => {
  const { isDarkMode } = useThemeStore();
  const { products, fetchProducts, isLoading, getInventoryStatistics, getExpiringProducts } = useProductStore();

  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ category: '', brand: '', lowStock: false, expiringSoon: false });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] = useState(false);
  const [showStockPrediction, setShowStockPrediction] = useState(false);
  const [showMultiuseParts, setShowMultiuseParts] = useState(false);
  const [showPartsSearch, setShowPartsSearch] = useState(false);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Filtros
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.sku?.toLowerCase().includes(q) || 
        p.barcode?.toLowerCase().includes(q) || 
        p.brand?.toLowerCase().includes(q) || 
        p.category?.toLowerCase().includes(q)
      );
    }
    if (activeFilters.category) filtered = filtered.filter(p => p.category === activeFilters.category);
    if (activeFilters.brand) filtered = filtered.filter(p => p.brand === activeFilters.brand);
    if (activeFilters.lowStock) filtered = filtered.filter(p => ((p.stock_total || 0) - (p.stock_reserved || 0)) <= (p.stock_min || 0));
    if (activeFilters.expiringSoon) {
      const ids = getExpiringProducts(30).map(p => p.id);
      filtered = filtered.filter(p => ids.includes(p.id));
    }
    return filtered;
  }, [products, searchQuery, activeFilters, getExpiringProducts]);

  const stats = useMemo(() => getInventoryStatistics(), [getInventoryStatistics]);
  const uniqueCategories = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean))].sort(), [products]);
  const uniqueBrands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))].sort(), [products]);
  
  const lastUpdate = new Date().toLocaleString('pt-BR', { 
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const handleNewProduct = () => { setEditingProduct(null); setIsProductModalOpen(true); };
  const handleEditProduct = (p) => { setEditingProduct(p); setIsProductModalOpen(true); };
  const handleViewProduct = (p) => { setEditingProduct(p); setIsProductModalOpen(true); };
  const clearFilters = () => { setSearchQuery(''); setActiveFilters({ category: '', brand: '', lowStock: false, expiringSoon: false }); };

  // Métricas
  const metrics = [
    { key: 'total', label: 'Total de Produtos', value: stats.totalProducts, icon: 'package', accent: 'primary' },
    { key: 'value', label: 'Valor em Estoque', value: `R$ ${stats.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`, icon: 'dollar', accent: 'accent' },
    { key: 'low', label: 'Estoque Baixo', value: stats.lowStockCount, icon: 'alert', accent: 'warning', alert: stats.lowStockCount > 0 },
    { key: 'out', label: 'Sem Estoque', value: stats.outOfStockCount, icon: 'ban', accent: 'danger', alert: stats.outOfStockCount > 0 },
  ];

  // Ações rápidas
  const quickActions = [
    { label: 'Previsão IA', icon: 'trend', onClick: () => setShowStockPrediction(true) },
    { label: 'Peças Multiuso', icon: 'layers', onClick: () => setShowMultiuseParts(true) },
    { label: 'Buscar Peças', icon: 'search', onClick: () => setShowPartsSearch(true) },
    { label: 'Por Veículo', icon: 'car', onClick: () => setIsCompatibilityModalOpen(true) },
  ];

  return (
    <div className="inv-page" data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="inv-title">Inventário</h1>
            <p className="inv-subtitle mt-1">Última atualização: {lastUpdate}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewProduct}
            className="inv-btn-primary"
            aria-label="Adicionar novo produto"
          >
            <Icon name="plus" size={16} />
            Novo Produto
          </motion.button>
        </motion.header>

        {/* Métricas */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.05 }} 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {isLoading && products.length === 0 ? (
            <>
              <SkeletonMetric /><SkeletonMetric /><SkeletonMetric /><SkeletonMetric />
            </>
          ) : (
            metrics.map((m, i) => (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.03 }}
                className="inv-metric"
              >
                <div className="inv-metric-icon" style={{ color: `var(--inv-${m.accent})` }}>
                  <Icon name={m.icon} size={22} />
                </div>
                <div className="inv-metric-content">
                  <p className="inv-metric-value">{m.value}</p>
                  <p className="inv-metric-label">{m.label}</p>
                </div>
                {m.alert && (
                  <span 
                    className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse" 
                    style={{ background: `var(--inv-${m.accent})` }} 
                  />
                )}
                <div className={`inv-metric-accent ${m.accent}`} />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Barra de Busca e Filtros */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className="inv-card p-4 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Input de busca */}
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--inv-muted)]">
                <Icon name="search" size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos por nome, SKU, marca..."
                className="inv-search-input w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--inv-surface)] border border-[var(--inv-border)] focus:border-[var(--inv-primary)] transition-colors"
                aria-label="Buscar produtos"
              />
            </div>

            {/* Controles */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inv-btn-secondary ${showFilters ? '!border-[var(--inv-primary)] !text-[var(--inv-primary)]' : ''}`}
                aria-label="Mostrar filtros"
                aria-expanded={showFilters}
              >
                <Icon name="filter" size={16} />
                Filtros
              </button>

              {/* Toggle View */}
              <div className="flex items-center p-1 rounded-xl bg-[var(--inv-surface)] border border-[var(--inv-border)]">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`inv-btn-icon !border-0 ${viewMode === 'grid' ? '!bg-[var(--inv-glass)] !text-[var(--inv-text)]' : ''}`}
                  aria-label="Visualização em grade"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Icon name="grid" size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`inv-btn-icon !border-0 ${viewMode === 'list' ? '!bg-[var(--inv-glass)] !text-[var(--inv-text)]' : ''}`}
                  aria-label="Visualização em lista"
                  aria-pressed={viewMode === 'list'}
                >
                  <Icon name="list" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Filtros Expandidos */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }} 
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-[var(--inv-border)]">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {/* Categoria */}
                    <select
                      value={activeFilters.category}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="px-3 py-2 rounded-lg text-sm bg-[var(--inv-surface)] text-[var(--inv-text)] border border-[var(--inv-border)] focus:border-[var(--inv-primary)] outline-none transition-colors"
                      aria-label="Filtrar por categoria"
                    >
                      <option value="">Todas Categorias</option>
                      {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    
                    {/* Marca */}
                    <select
                      value={activeFilters.brand}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, brand: e.target.value }))}
                      className="px-3 py-2 rounded-lg text-sm bg-[var(--inv-surface)] text-[var(--inv-text)] border border-[var(--inv-border)] focus:border-[var(--inv-primary)] outline-none transition-colors"
                      aria-label="Filtrar por marca"
                    >
                      <option value="">Todas Marcas</option>
                      {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                    </select>
                    
                    {/* Limpar */}
                    {(activeFilters.category || activeFilters.brand || activeFilters.lowStock || activeFilters.expiringSoon || searchQuery) && (
                      <button onClick={clearFilters} className="px-3 py-2 text-sm text-[var(--inv-muted)] hover:text-[var(--inv-text)] transition-colors">
                        Limpar filtros
                      </button>
                    )}
                  </div>
                  
                  {/* Tags de Status */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'lowStock', label: 'Estoque Baixo', count: stats.lowStockCount, type: 'warning' },
                      { key: 'expiringSoon', label: 'Vencendo', count: stats.expiringCount || 0, type: 'danger' },
                    ].map(f => (
                      <button
                        key={f.key}
                        onClick={() => setActiveFilters(prev => ({ ...prev, [f.key]: !prev[f.key] }))}
                        className={`inv-pill ${activeFilters[f.key] ? f.type : ''} ${!activeFilters[f.key] ? 'bg-[var(--inv-surface)] text-[var(--inv-muted)]' : ''} cursor-pointer transition-all hover:opacity-80`}
                        aria-pressed={activeFilters[f.key]}
                      >
                        <span className={`inv-pill-dot ${!activeFilters[f.key] ? 'bg-[var(--inv-muted)]' : ''}`} />
                        {f.label}
                        {f.count > 0 && <span className="opacity-70">({f.count})</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ações Rápidas */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.15 }} 
          className="flex flex-wrap gap-3 mb-6"
        >
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className="inv-btn-secondary"
              aria-label={action.label}
            >
              <Icon name={action.icon} size={16} />
              {action.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Contador de Resultados */}
        {searchQuery && (
          <p className="text-sm mb-4 text-[var(--inv-muted)]">
            <span className="text-[var(--inv-primary)] font-medium">{filteredProducts.length}</span>
            {' '}resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Conteúdo Principal */}
        <AnimatePresence mode="wait">
          {isLoading && products.length === 0 ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-sm mt-4 text-[var(--inv-muted)]">Carregando produtos...</p>
              </div>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <Suspense fallback={<SkeletonMetric />}>
                <EmptyState 
                  hasProducts={products.length > 0} 
                  hasFilters={searchQuery || Object.values(activeFilters).some(v => v)} 
                  onNewProduct={handleNewProduct} 
                  onClearFilters={clearFilters} 
                />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div key={viewMode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Suspense fallback={<SkeletonMetric />}>
                {viewMode === VIEW_MODES.GRID ? (
                  <InventoryGridView products={filteredProducts} onViewProduct={handleViewProduct} onEditProduct={handleEditProduct} />
                ) : (
                  <InventoryListView products={filteredProducts} onViewProduct={handleViewProduct} onEditProduct={handleEditProduct} />
                )}
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      {isProductModalOpen && (
        <Suspense fallback={null}>
          <ProductModal 
            isOpen={isProductModalOpen} 
            onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }} 
            product={editingProduct} 
          />
        </Suspense>
      )}
      
      <VehiclePartsSearchModal 
        isOpen={isCompatibilityModalOpen} 
        onClose={() => setIsCompatibilityModalOpen(false)} 
        onPartSelect={(part) => { setIsCompatibilityModalOpen(false); }} 
        empresaId={sessionStorage.getItem('empresaId') || ''}
        isDarkMode={isDarkMode}
      />

      {/* Modal: Previsão de Estoque */}
      <AnimatePresence>
        {showStockPrediction && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowStockPrediction(false)}
          >
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.96, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-5xl max-h-[85vh] overflow-auto rounded-2xl shadow-2xl p-6 bg-[var(--inv-panel)] border border-[var(--inv-border)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="inv-metric-icon" style={{ color: 'var(--inv-accent)' }}>
                    <Icon name="trend" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-[var(--inv-text)]">Previsão de Estoque</h2>
                </div>
                <button onClick={() => setShowStockPrediction(false)} className="inv-btn-icon" aria-label="Fechar">
                  <Icon name="x" size={18} />
                </button>
              </div>
              <StockPredictionDashboard empresaId={sessionStorage.getItem('empresaId') || ''} onItemClick={(id) => setSelectedPartId(id)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Peças Multiuso */}
      <AnimatePresence>
        {showMultiuseParts && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowMultiuseParts(false)}
          >
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.96, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-5xl max-h-[85vh] overflow-auto rounded-2xl shadow-2xl p-6 bg-[var(--inv-panel)] border border-[var(--inv-border)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="inv-metric-icon" style={{ color: 'var(--inv-warning)' }}>
                    <Icon name="layers" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-[var(--inv-text)]">Peças Multiuso</h2>
                </div>
                <button onClick={() => setShowMultiuseParts(false)} className="inv-btn-icon" aria-label="Fechar">
                  <Icon name="x" size={18} />
                </button>
              </div>
              <MultiusePartsDashboard empresaId={sessionStorage.getItem('empresaId') || ''} onPartClick={(id) => setSelectedPartId(id)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Buscar Peças */}
      <AnimatePresence>
        {showPartsSearch && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 pb-4 bg-black/60 backdrop-blur-sm overflow-y-auto" 
            onClick={() => setShowPartsSearch(false)}
          >
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.96, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-[var(--inv-panel)] border border-[var(--inv-border)]"
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--inv-border)] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="inv-metric-icon" style={{ color: 'var(--inv-primary)' }}>
                    <Icon name="search" size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--inv-text)]">Buscar Peças Compatíveis</h2>
                </div>
                <button onClick={() => setShowPartsSearch(false)} className="inv-btn-icon" aria-label="Fechar">
                  <Icon name="x" size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <PartsSearchPanel 
                  empresaId={sessionStorage.getItem('empresaId') || ''} 
                  onPartSelect={(id) => { setShowPartsSearch(false); }} 
                  className="!shadow-none !rounded-none" 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryPage;
