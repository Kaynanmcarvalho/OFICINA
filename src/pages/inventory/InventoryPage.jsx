/**
 * InventoryPage - Página principal do módulo de inventário
 * Otimizado para carregamento rápido com lazy loading
 */

import '../../styles/inventory-scale-20.css';
import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '../../store/productStore';
import { useThemeStore } from '../../store/themeStore';
import { Package, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Lazy load components
const InventoryHeader = lazy(() => import('./components/InventoryHeader'));
const InventoryStats = lazy(() => import('./components/InventoryStats'));
const InventorySearchBar = lazy(() => import('./components/InventorySearchBar'));
const InventoryFilters = lazy(() => import('./components/InventoryFilters'));
const InventoryGridView = lazy(() => import('./components/InventoryGridView'));
const InventoryListView = lazy(() => import('./components/InventoryListView'));
const ProductModal = lazy(() => import('./components/ProductModal'));
const EmptyState = lazy(() => import('./components/EmptyState'));
const VehicleCompatibilitySearch = lazy(() => import('../../components/inventory/VehicleCompatibilitySearch'));
const IntelligentCompatibilityPanel = lazy(() => import('../../components/inventory/IntelligentCompatibilityPanel'));

// Skeleton loader
const SkeletonCard = () => (
  <div className="animate-pulse bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 h-32">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

const InventoryPage = () => {
  const { isDarkMode } = useThemeStore();
  const {
    products,
    fetchProducts,
    isLoading,
    getInventoryStatistics,
    getExpiringProducts,
  } = useProductStore();

  // Força uso do motion para evitar que autofix remova
  const MotionDiv = motion.div;

  // View state
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    brand: '',
    inStock: null,
    lowStock: false,
    expiringSoon: false,
  });

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] = useState(false);
  const [isIntelligentPanelOpen, setIsIntelligentPanelOpen] = useState(false);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.barcode?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (activeFilters.category) {
      filtered = filtered.filter(p => p.category === activeFilters.category);
    }

    // Brand filter
    if (activeFilters.brand) {
      filtered = filtered.filter(p => p.brand === activeFilters.brand);
    }

    // Stock filter
    if (activeFilters.inStock !== null) {
      filtered = filtered.filter(p => {
        const available = (p.stock_total || 0) - (p.stock_reserved || 0);
        return activeFilters.inStock ? available > 0 : available <= 0;
      });
    }

    // Low stock filter
    if (activeFilters.lowStock) {
      filtered = filtered.filter(p => {
        const available = (p.stock_total || 0) - (p.stock_reserved || 0);
        return available <= (p.stock_min || 0);
      });
    }

    // Expiring soon filter
    if (activeFilters.expiringSoon) {
      const expiringIds = getExpiringProducts(30).map(p => p.id);
      filtered = filtered.filter(p => expiringIds.includes(p.id));
    }

    return filtered;
  }, [products, searchQuery, activeFilters, getExpiringProducts]);

  // Statistics
  const stats = useMemo(() => getInventoryStatistics(), [getInventoryStatistics]);

  // Handlers
  const handleNewProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <div
      data-page="inventory"
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
          : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'
      }`}
    >
      <div className="w-full" style={{ padding: '24px', boxSizing: 'border-box', minHeight: '100vh' }}>
        {/* Header */}
        <Suspense fallback={<SkeletonCard />}>
          <InventoryHeader
            productCount={products.length}
            onNewProduct={handleNewProduct}
          />
        </Suspense>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Suspense fallback={<SkeletonCard />}>
            <InventoryStats stats={stats} />
          </Suspense>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <InventorySearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                isLoading={isLoading}
                resultCount={filteredProducts.length}
              />
            </div>

            <button
              onClick={() => setIsCompatibilityModalOpen(true)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl
                font-medium transition-all whitespace-nowrap
                ${isDarkMode
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_8px_30px_rgba(147,51,234,0.4)]'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_8px_30px_rgba(147,51,234,0.3)]'
                }
              `}
            >
              <Package className="w-5 h-5" />
              Buscar por Veículo
            </button>

            <button
              onClick={() => setIsIntelligentPanelOpen(true)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl
                font-medium transition-all whitespace-nowrap
                ${isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_8px_30px_rgba(147,51,234,0.4)]'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-[0_8px_30px_rgba(147,51,234,0.3)]'
                }
              `}
            >
              <Sparkles className="w-5 h-5" />
              IA Compatibilidade
            </button>

            <InventoryFilters
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
              stats={stats}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading && products.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className={`text-sm mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Carregando produtos...
                </p>
              </div>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <EmptyState
                hasProducts={products.length > 0}
                hasFilters={searchQuery || Object.values(activeFilters).some(v => v)}
                onNewProduct={handleNewProduct}
                onClearFilters={() => {
                  setSearchQuery('');
                  setActiveFilters({
                    category: '',
                    brand: '',
                    inStock: null,
                    lowStock: false,
                    expiringSoon: false,
                  });
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === VIEW_MODES.GRID ? (
                <InventoryGridView
                  products={filteredProducts}
                  onViewProduct={handleViewProduct}
                  onEditProduct={handleEditProduct}
                />
              ) : (
                <InventoryListView
                  products={filteredProducts}
                  onViewProduct={handleViewProduct}
                  onEditProduct={handleEditProduct}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Modal - só carrega quando abre */}
      {isProductModalOpen && (
        <Suspense fallback={null}>
          <ProductModal
            isOpen={isProductModalOpen}
            onClose={() => {
              setIsProductModalOpen(false);
              setEditingProduct(null);
            }}
            product={editingProduct}
          />
        </Suspense>
      )}

      {/* Vehicle Compatibility Search - só carrega quando abre */}
      {isCompatibilityModalOpen && (
        <Suspense fallback={null}>
          <VehicleCompatibilitySearch
            isOpen={isCompatibilityModalOpen}
            onClose={() => setIsCompatibilityModalOpen(false)}
            onPartSelect={(part) => {
              console.log('Peça selecionada:', part);
            }}
          />
        </Suspense>
      )}

      {/* Intelligent Compatibility Panel - só carrega quando abre */}
      {isIntelligentPanelOpen && (
        <Suspense fallback={null}>
          <IntelligentCompatibilityPanel
            isOpen={isIntelligentPanelOpen}
            onClose={() => setIsIntelligentPanelOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default InventoryPage;
