/**
 * ClientsFilters - Filtros avançados com toggle de visualização
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid3x3, List, X, Check } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const ClientsFilters = ({ 
  activeFilters, 
  onFilterChange, 
  stats,
  viewMode,
  onViewModeChange 
}) => {
  const { isDarkMode } = useThemeStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Todos', count: stats.total },
    { value: 'active', label: 'Ativos', count: stats.active },
    { value: 'inactive', label: 'Inativos', count: stats.inactive }
  ];

  const handleStatusChange = (status) => {
    onFilterChange({ ...activeFilters, status });
  };

  const hasActiveFilters = activeFilters.status !== 'all' || activeFilters.tags.length > 0;

  const clearFilters = () => {
    onFilterChange({ status: 'all', tags: [], dateRange: null });
  };

  return (
    <div className="flex items-center gap-3">
      {/* View Mode Toggle */}
      <div className={`
        flex items-center p-1 rounded-lg backdrop-blur-xl border
        ${isDarkMode 
          ? 'bg-gray-900/50 border-gray-800 shadow-xl' 
          : 'glass-effect'
        }
      `}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewModeChange('grid')}
          className={`
            p-2 rounded-md transition-all duration-200
            ${viewMode === 'grid'
              ? isDarkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 text-white'
              : isDarkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }
          `}
          title="Visualização em Grade"
        >
          <Grid3x3 className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewModeChange('list')}
          className={`
            p-2 rounded-md transition-all duration-200
            ${viewMode === 'list'
              ? isDarkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 text-white'
              : isDarkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }
          `}
          title="Visualização em Lista"
        >
          <List className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Filter Button */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`
            relative flex items-center gap-2 px-4 py-2.5 rounded-lg
            backdrop-blur-xl border transition-all duration-200
            ${isDarkMode 
              ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700 text-gray-300 shadow-xl' 
              : 'glass-effect hover:shadow-md text-gray-700'
            }
          `}
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros</span>
          
          {/* Active Filter Badge */}
          {hasActiveFilters && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
            >
              <span className="text-xs text-white font-bold">
                {activeFilters.status !== 'all' ? 1 : 0}
              </span>
            </motion.div>
          )}
        </motion.button>

        {/* Filter Dropdown */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 z-40"
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`
                  absolute right-0 top-full mt-2 w-80 p-4 rounded-xl
                  backdrop-blur-xl border shadow-2xl z-50
                  ${isDarkMode 
                    ? 'bg-gray-900/95 border-gray-800' 
                    : 'glass-effect'
                  }
                `}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Filtros
                  </h3>
                  
                  {hasActiveFilters && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className={`
                        text-sm font-medium transition-colors
                        ${isDarkMode 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-700'
                        }
                      `}
                    >
                      Limpar tudo
                    </motion.button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Status
                  </label>
                  
                  <div className="space-y-2">
                    {statusOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ x: 2 }}
                        onClick={() => handleStatusChange(option.value)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-lg
                          transition-all duration-200
                          ${activeFilters.status === option.value
                            ? isDarkMode
                              ? 'bg-blue-600/20 border-2 border-blue-600'
                              : 'bg-blue-50 border-2 border-blue-600'
                            : isDarkMode
                              ? 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700'
                              : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-5 h-5 rounded-md border-2 flex items-center justify-center
                            transition-all duration-200
                            ${activeFilters.status === option.value
                              ? 'bg-blue-600 border-blue-600'
                              : isDarkMode
                                ? 'border-gray-600'
                                : 'border-gray-300'
                            }
                          `}>
                            {activeFilters.status === option.value && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          
                          <span className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                        
                        <span className={`
                          text-sm font-semibold px-2 py-1 rounded-md
                          ${activeFilters.status === option.value
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
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Future: Tags Filter */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <label className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Tags
                  </label>
                  <p className={`text-xs mt-2 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Em breve: filtros por tags personalizadas
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientsFilters;
