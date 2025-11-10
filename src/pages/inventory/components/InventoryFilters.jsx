import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid3x3, List, X } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { useProductStore } from '../../../store/productStore';

const InventoryFilters = ({ activeFilters, onFilterChange, stats, viewMode, onViewModeChange }) => {
  const { isDarkMode } = useThemeStore();
  const { categories } = useProductStore();
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(v => v && v !== '');

  const filterOptions = [
    {
      label: 'Estoque Baixo',
      key: 'lowStock',
      type: 'boolean',
      count: stats.lowStockCount,
    },
    {
      label: 'Sem Estoque',
      key: 'inStock',
      type: 'boolean',
      value: false,
      count: stats.outOfStockCount,
    },
    {
      label: 'Vencendo',
      key: 'expiringSoon',
      type: 'boolean',
      count: stats.expiringCount,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      {/* View Mode Toggle */}
      <div className={`
        flex items-center gap-1 p-1 rounded-xl
        ${isDarkMode
          ? 'bg-gray-900/80 border-[2px] border-gray-700/80'
          : 'bg-white/80 border-[2px] border-gray-200'
        }
      `}>
        <button
          onClick={() => onViewModeChange('grid')}
          className={`
            p-2 rounded-lg transition-all
            ${viewMode === 'grid'
              ? isDarkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 text-white'
              : isDarkMode
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          <Grid3x3 className="w-5 h-5" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`
            p-2 rounded-lg transition-all
            ${viewMode === 'list'
              ? isDarkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 text-white'
              : isDarkMode
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`
          flex items-center gap-2 px-4 py-3 rounded-xl
          font-medium transition-all relative
          ${isDarkMode
            ? 'bg-gray-900/80 border-[2px] border-gray-700/80 hover:border-gray-600 text-gray-300'
            : 'bg-white/80 border-[2px] border-gray-200 hover:border-gray-300 text-gray-700'
          }
        `}
      >
        <Filter className="w-5 h-5" />
        Filtros
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {Object.values(activeFilters).filter(v => v && v !== '').length}
            </span>
          </div>
        )}
      </button>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`
                absolute right-0 top-full mt-2 w-80 p-4 rounded-2xl
                backdrop-blur-xl border-[2px] z-50
                ${isDarkMode
                  ? 'bg-gray-900/95 border-gray-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.5)]'
                  : 'bg-white/95 border-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.15)]'
                }
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Filtros
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={() => onFilterChange({
                      category: '',
                      brand: '',
                      inStock: null,
                      lowStock: false,
                      expiringSoon: false,
                    })}
                    className={`
                      text-xs font-medium px-2 py-1 rounded-lg
                      ${isDarkMode
                        ? 'text-blue-400 hover:bg-gray-800'
                        : 'text-blue-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    Limpar
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Quick Filters */}
                <div>
                  <label className={`text-xs font-medium mb-2 block ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Filtros Rápidos
                  </label>
                  <div className="space-y-2">
                    {filterOptions.map(option => (
                      <button
                        key={option.key}
                        onClick={() => {
                          if (option.type === 'boolean') {
                            onFilterChange({
                              [option.key]: option.value !== undefined 
                                ? option.value 
                                : !activeFilters[option.key]
                            });
                          }
                        }}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-lg
                          transition-all text-sm
                          ${activeFilters[option.key] || (option.value !== undefined && activeFilters[option.key] === option.value)
                            ? isDarkMode
                              ? 'bg-blue-600/20 text-blue-400 border-[2px] border-blue-600/50'
                              : 'bg-blue-50 text-blue-700 border-[2px] border-blue-200'
                            : isDarkMode
                              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-[2px] border-transparent'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-[2px] border-transparent'
                          }
                        `}
                      >
                        <span>{option.label}</span>
                        {option.count > 0 && (
                          <span className={`
                            px-2 py-0.5 rounded-full text-xs font-bold
                            ${activeFilters[option.key] || (option.value !== undefined && activeFilters[option.key] === option.value)
                              ? isDarkMode
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-600 text-white'
                              : isDarkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                            }
                          `}>
                            {option.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className={`text-xs font-medium mb-2 block ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Categoria
                  </label>
                  <select
                    value={activeFilters.category}
                    onChange={(e) => onFilterChange({ category: e.target.value })}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${isDarkMode
                        ? 'bg-gray-800 text-white border-[2px] border-gray-700'
                        : 'bg-white text-gray-900 border-[2px] border-gray-200'
                      }
                    `}
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryFilters;
