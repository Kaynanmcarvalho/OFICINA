/**
 * InventoryPage - Premium Apple-like + Linear + Stripe Design
 * Design elegante com cores suaves, ícones premium e microdetalhes
 * @version 4.0.0
 */

import '../../styles/inventory-scale-20.css';
import '../../styles/inventory-apple.css';
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

// Cores Premium
const COLORS = {
  blue: { light: '#4D7CFE', dark: '#6B8FFF', bg: 'rgba(77, 124, 254, 0.08)', border: 'rgba(77, 124, 254, 0.2)' },
  green: { light: '#3EBE64', dark: '#4FD97A', bg: 'rgba(62, 190, 100, 0.08)', border: 'rgba(62, 190, 100, 0.2)' },
  amber: { light: '#F7B731', dark: '#FFCA4D', bg: 'rgba(247, 183, 49, 0.08)', border: 'rgba(247, 183, 49, 0.2)' },
  red: { light: '#FF6B6B', dark: '#FF8585', bg: 'rgba(255, 107, 107, 0.08)', border: 'rgba(255, 107, 107, 0.2)' },
  purple: { light: '#A36BFF', dark: '#B585FF', bg: 'rgba(163, 107, 255, 0.08)', border: 'rgba(163, 107, 255, 0.2)' },
  orange: { light: '#FF9F43', dark: '#FFB366', bg: 'rgba(255, 159, 67, 0.08)', border: 'rgba(255, 159, 67, 0.2)' },
};

// Ícones SVG Premium (estilo SF Symbols)
const PremiumIcon = ({ type, color, size = 20 }) => {
  const icons = {
    package: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    dollar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9.5c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2c-1.1 0-2 .9-2 2s.9 2 2 2h2c1.1 0 2-.9 2-2"/>
      </svg>
    ),
    alert: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    empty: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    archive: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    filter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
      </svg>
    ),
    grid: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    list: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    trend: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    layers: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    car: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

// Skeleton Premium
const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-zinc-900 rounded-2xl p-5 h-28 shadow-sm border border-gray-100 dark:border-zinc-800">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl"></div>
      <div className="flex-1">
        <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-gray-100 dark:bg-zinc-800 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const InventoryPage = () => {
  const { isDarkMode } = useThemeStore();
  const { products, fetchProducts, isLoading, getInventoryStatistics, getExpiringProducts } = useProductStore();

  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ category: '', brand: '', inStock: null, lowStock: false, expiringSoon: false });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] = useState(false);
  const [showStockPrediction, setShowStockPrediction] = useState(false);
  const [showMultiuseParts, setShowMultiuseParts] = useState(false);
  const [showPartsSearch, setShowPartsSearch] = useState(false);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.barcode?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    }
    if (activeFilters.category) filtered = filtered.filter(p => p.category === activeFilters.category);
    if (activeFilters.brand) filtered = filtered.filter(p => p.brand === activeFilters.brand);
    if (activeFilters.inStock !== null) filtered = filtered.filter(p => activeFilters.inStock ? ((p.stock_total || 0) - (p.stock_reserved || 0)) > 0 : ((p.stock_total || 0) - (p.stock_reserved || 0)) <= 0);
    if (activeFilters.lowStock) filtered = filtered.filter(p => ((p.stock_total || 0) - (p.stock_reserved || 0)) <= (p.stock_min || 0));
    if (activeFilters.expiringSoon) { const ids = getExpiringProducts(30).map(p => p.id); filtered = filtered.filter(p => ids.includes(p.id)); }
    return filtered;
  }, [products, searchQuery, activeFilters, getExpiringProducts]);

  const stats = useMemo(() => getInventoryStatistics(), [getInventoryStatistics]);
  const lastUpdate = new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleNewProduct = () => { setEditingProduct(null); setIsProductModalOpen(true); };
  const handleEditProduct = (p) => { setEditingProduct(p); setIsProductModalOpen(true); };
  const handleViewProduct = (p) => { setEditingProduct(p); setIsProductModalOpen(true); };

  // Métricas Premium com cores
  const metrics = [
    { key: 'total', label: 'Total de Produtos', value: stats.totalProducts, icon: 'package', color: COLORS.blue },
    { key: 'value', label: 'Valor em Estoque', value: `R$ ${stats.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`, icon: 'dollar', color: COLORS.green },
    { key: 'low', label: 'Estoque Baixo', value: stats.lowStockCount, icon: 'alert', color: COLORS.amber, alert: stats.lowStockCount > 0 },
    { key: 'out', label: 'Sem Estoque', value: stats.outOfStockCount, icon: 'empty', color: COLORS.red, alert: stats.outOfStockCount > 0 },
  ];

  // Ações rápidas com cores
  const quickActions = [
    { label: 'Previsão IA', icon: 'trend', color: COLORS.green, onClick: () => setShowStockPrediction(true) },
    { label: 'Peças Multiuso', icon: 'layers', color: COLORS.orange, onClick: () => setShowMultiuseParts(true) },
    { label: 'Buscar Peças', icon: 'search', color: COLORS.blue, onClick: () => setShowPartsSearch(true) },
    { label: 'Por Veículo', icon: 'car', color: COLORS.purple, onClick: () => setIsCompatibilityModalOpen(true) },
  ];

  const iconColor = isDarkMode ? '#A1A1AA' : '#6B7280';
  const activeIconColor = isDarkMode ? '#FFFFFF' : '#1F2937';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950' : 'bg-[#FAFBFC]'}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header Premium */}
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Inventário</h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>Última atualização: {lastUpdate}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(77, 124, 254, 0.25)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewProduct}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-xl transition-all shadow-lg"
            style={{ background: 'linear-gradient(135deg, #4D7CFE 0%, #5B8AFF 100%)', boxShadow: '0 4px 15px rgba(77, 124, 254, 0.3)' }}
          >
            <PremiumIcon type="plus" color="#FFFFFF" size={16} />
            Novo Produto
          </motion.button>
        </motion.header>

        {/* Métricas Premium com linha colorida */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.03 }}
              whileHover={{ scale: 1.015, y: -2, boxShadow: isDarkMode ? '0 12px 35px rgba(0,0,0,0.4)' : '0 12px 35px rgba(0,0,0,0.08)' }}
              className={`relative p-5 rounded-2xl transition-all duration-200 overflow-hidden ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'}`}
              style={{ boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)' }}
            >
              {/* Linha colorida inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${m.color.light}, ${m.color.light}80)` }} />
              
              {m.alert && <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: m.color.light }} />}
              
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: m.color.bg }}>
                <PremiumIcon type={m.icon} color={isDarkMode ? m.color.dark : m.color.light} size={20} />
              </div>
              <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{m.value}</p>
              <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>{m.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Barra de Busca Premium */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`p-4 rounded-2xl mb-6 ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'}`} style={{ boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-150">
                <PremiumIcon type="search" color={searchQuery ? COLORS.blue.light : iconColor} size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos por nome, SKU, marca..."
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl text-sm transition-all outline-none border-2 ${isDarkMode ? 'bg-zinc-800 text-white placeholder-zinc-500 border-zinc-700 focus:border-[#4D7CFE]' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-transparent focus:border-[#4D7CFE] focus:bg-white'}`}
                style={{ boxShadow: searchQuery ? `0 0 0 3px ${COLORS.blue.bg}` : 'none' }}
              />
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02, background: isDarkMode ? 'linear-gradient(135deg, #3F3F46 0%, #52525B 100%)' : 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium transition-all border ${isDarkMode ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-white text-gray-600 border-gray-200'}`}
              >
                <PremiumIcon type="filter" color={showFilters ? COLORS.blue.light : iconColor} size={16} />
                Filtros
              </motion.button>

              <div className={`flex items-center p-1.5 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? `bg-white dark:bg-zinc-700 shadow-sm` : ''}`}>
                  <PremiumIcon type="grid" color={viewMode === 'grid' ? activeIconColor : iconColor} size={16} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? `bg-white dark:bg-zinc-700 shadow-sm` : ''}`}>
                  <PremiumIcon type="list" color={viewMode === 'list' ? activeIconColor : iconColor} size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Filtros Expandidos */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className={`pt-4 mt-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'lowStock', label: 'Estoque Baixo', count: stats.lowStockCount, color: COLORS.amber },
                      { key: 'outOfStock', label: 'Sem Estoque', count: stats.outOfStockCount, color: COLORS.red },
                      { key: 'expiringSoon', label: 'Vencendo', count: stats.expiringCount, color: COLORS.orange },
                    ].map(f => (
                      <motion.button
                        key={f.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveFilters(prev => ({ ...prev, [f.key]: !prev[f.key] }))}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border`}
                        style={activeFilters[f.key] ? { backgroundColor: f.color.bg, borderColor: f.color.border, color: isDarkMode ? f.color.dark : f.color.light } : { backgroundColor: isDarkMode ? '#27272A' : '#F3F4F6', borderColor: 'transparent', color: isDarkMode ? '#A1A1AA' : '#6B7280' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: f.color.light }} />
                        {f.label}
                        {f.count > 0 && <span className="opacity-70">({f.count})</span>}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ações Rápidas Premium */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3 mb-6">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02, borderColor: action.color.light, boxShadow: `0 4px 15px ${action.color.bg}` }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' : 'bg-white border-gray-100 text-gray-600 hover:text-gray-900'}`}
              style={{ boxShadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.03)' }}
            >
              <PremiumIcon type={action.icon} color={isDarkMode ? action.color.dark : action.color.light} size={16} />
              {action.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Contador de Resultados */}
        {searchQuery && (
          <p className={`text-sm mb-4 font-medium ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>
            <span style={{ color: COLORS.blue.light }}>{filteredProducts.length}</span> resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading && products.length === 0 ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className={`text-sm mt-4 ${isDarkMode ? 'text-zinc-500' : 'text-[#6B6B6B]'}`}>Carregando produtos...</p>
              </div>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <Suspense fallback={<SkeletonCard />}>
                <EmptyState hasProducts={products.length > 0} hasFilters={searchQuery || Object.values(activeFilters).some(v => v)} onNewProduct={handleNewProduct} onClearFilters={() => { setSearchQuery(''); setActiveFilters({ category: '', brand: '', inStock: null, lowStock: false, expiringSoon: false }); }} />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div key={viewMode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Suspense fallback={<SkeletonCard />}>
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
      {isProductModalOpen && <Suspense fallback={null}><ProductModal isOpen={isProductModalOpen} onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }} product={editingProduct} /></Suspense>}
      
      {/* Vehicle Parts Search Modal - Premium */}
      <VehiclePartsSearchModal 
        isOpen={isCompatibilityModalOpen} 
        onClose={() => setIsCompatibilityModalOpen(false)} 
        onPartSelect={(part) => { console.log('Peça selecionada:', part); setIsCompatibilityModalOpen(false); }} 
        empresaId={sessionStorage.getItem('empresaId') || ''}
        isDarkMode={isDarkMode}
      />

      {/* TORQ AI Modals Premium */}
      <AnimatePresence>
        {showStockPrediction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowStockPrediction(false)}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} onClick={(e) => e.stopPropagation()} className={`w-full max-w-5xl max-h-[85vh] overflow-auto rounded-2xl shadow-2xl p-6 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.green.bg }}>
                    <PremiumIcon type="trend" color={COLORS.green.light} size={20} />
                  </div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Previsão de Estoque</h2>
                </div>
                <button onClick={() => setShowStockPrediction(false)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'}`}><span className="text-xl">×</span></button>
              </div>
              <StockPredictionDashboard empresaId={sessionStorage.getItem('empresaId') || ''} onItemClick={(id) => console.log('Item:', id)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMultiuseParts && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowMultiuseParts(false)}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} onClick={(e) => e.stopPropagation()} className={`w-full max-w-5xl max-h-[85vh] overflow-auto rounded-2xl shadow-2xl p-6 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.orange.bg }}>
                    <PremiumIcon type="layers" color={COLORS.orange.light} size={20} />
                  </div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Peças Multiuso</h2>
                </div>
                <button onClick={() => setShowMultiuseParts(false)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'}`}><span className="text-xl">×</span></button>
              </div>
              <MultiusePartsDashboard empresaId={sessionStorage.getItem('empresaId') || ''} onPartClick={(id) => console.log('Part:', id)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPartsSearch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 pb-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={() => setShowPartsSearch(false)}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} onClick={(e) => e.stopPropagation()} className={`w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
              <div className={`flex items-center justify-between p-4 border-b flex-shrink-0 ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.blue.bg }}>
                    <PremiumIcon type="search" color={COLORS.blue.light} size={20} />
                  </div>
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Buscar Peças Compatíveis</h2>
                </div>
                <button onClick={() => setShowPartsSearch(false)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'}`}><span className="text-xl">×</span></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <PartsSearchPanel empresaId={sessionStorage.getItem('empresaId') || ''} onPartSelect={(id) => { console.log('Peça:', id); setShowPartsSearch(false); }} className="!shadow-none !rounded-none" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryPage;
