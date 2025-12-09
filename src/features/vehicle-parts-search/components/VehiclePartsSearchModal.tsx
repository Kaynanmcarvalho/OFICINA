/**
 * VehiclePartsSearchModal - Premium Apple-like Modal
 * Modal de busca de peças por veículo com design premium
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVehiclePartsSearch } from '../hooks/useVehiclePartsSearch';
import type { VehicleSuggestion, CompatiblePart, VehicleType } from '../types';

// Premium Colors
const COLORS = {
  blue: { light: '#4D7CFE', dark: '#6B8FFF', bg: 'rgba(77, 124, 254, 0.08)' },
  green: { light: '#3EBE64', dark: '#4FD97A', bg: 'rgba(62, 190, 100, 0.08)' },
  amber: { light: '#F7B731', dark: '#FFCA4D', bg: 'rgba(247, 183, 49, 0.08)' },
  red: { light: '#FF6B6B', dark: '#FF8585', bg: 'rgba(255, 107, 107, 0.08)' },
  purple: { light: '#A36BFF', dark: '#B585FF', bg: 'rgba(163, 107, 255, 0.08)' },
};

// Vehicle type icons
const VehicleTypeIcon: React.FC<{ type: VehicleType; size?: number; color?: string }> = ({ 
  type, size = 20, color = '#6B7280' 
}) => {
  const icons: Record<VehicleType, JSX.Element> = {
    car: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2"/>
        <circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>
      </svg>
    ),
    motorcycle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/>
        <path d="M9 17h6m-3-6l3-4h4l1 4M5 14l4-7h3"/>
      </svg>
    ),
    truck: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    suv: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M5 17h14v-5l-2-4H7l-2 4v5zm0 0a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4z"/>
      </svg>
    ),
    pickup: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M1 11l2-6h9l2 6M1 11v5h2m0 0a2 2 0 104 0m-4 0h4m10 0h2v-5l-3-6h-4v11h5zm0 0a2 2 0 104 0"/>
      </svg>
    ),
    van: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M3 17V7a2 2 0 012-2h10l4 4v8m-16 0a2 2 0 104 0m-4 0h4m8 0h4m-4 0a2 2 0 104 0"/>
      </svg>
    ),
    bus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 10h18M8 17v2m8-2v2"/>
      </svg>
    ),
    agricultural: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <circle cx="7" cy="17" r="4"/><circle cx="17" cy="15" r="2"/>
        <path d="M14 15V9l-4-4H5v10"/>
      </svg>
    ),
  };
  return icons[type] || icons.car;
};


// Premium Icons
const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const GridIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const ListIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const FilterIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const PackageIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

interface VehiclePartsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartSelect?: (part: CompatiblePart) => void;
  empresaId: string;
  isDarkMode?: boolean;
}

export const VehiclePartsSearchModal: React.FC<VehiclePartsSearchModalProps> = ({
  isOpen,
  onClose,
  onPartSelect,
  empresaId,
  isDarkMode = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    searchQuery,
    suggestions,
    selectedVehicle,
    compatibleParts,
    isLoadingSuggestions,
    isLoadingParts,
    filters,
    viewMode,
    error,
    setSearchQuery,
    selectVehicle,
    clearVehicle,
    setFilters,
    resetFilters,
    setViewMode,
    confirmCompatibility,
    groupedSuggestions,
    categories,
    partBrands,
    stats,
  } = useVehiclePartsSearch({ empresaId });
  
  const handlePartClick = useCallback((part: CompatiblePart) => {
    if (onPartSelect) {
      onPartSelect(part);
    }
  }, [onPartSelect]);
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return COLORS.green;
    if (confidence >= 0.7) return COLORS.blue;
    if (confidence >= 0.5) return COLORS.amber;
    return COLORS.red;
  };
  
  const getMatchTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      manual: 'Verificado',
      exact: 'Exato',
      tecdoc: 'TecDoc',
      oem: 'OEM',
      aftermarket: 'Aftermarket',
      heuristic: 'Sugerido',
      fipe: 'FIPE',
    };
    return labels[type] || type;
  };

  if (!isOpen) return null;


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 pb-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-5xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-zinc-900' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className={`flex-shrink-0 px-6 py-4 border-b ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedVehicle && (
                  <button
                    onClick={clearVehicle}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <ArrowLeftIcon size={20} color={isDarkMode ? '#A1A1AA' : '#6B7280'} />
                  </button>
                )}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.purple.bg }}>
                  <VehicleTypeIcon type={selectedVehicle?.bodyType || 'car'} size={22} color={COLORS.purple.light} />
                </div>
                <div>
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : 'Buscar Peças por Veículo'}
                  </h2>
                  <p className={`text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                    {selectedVehicle 
                      ? `${selectedVehicle.yearFrom}${selectedVehicle.yearTo !== selectedVehicle.yearFrom ? `–${selectedVehicle.yearTo}` : ''}`
                      : 'Digite marca, modelo ou ano do veículo'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <CloseIcon size={20} color={isDarkMode ? '#A1A1AA' : '#6B7280'} />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {!selectedVehicle ? (
              /* Search View */
              <div className="flex-1 overflow-y-auto p-6">
                {/* Search Input */}
                <div className="relative mb-6">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <SearchIcon size={20} color={searchQuery ? COLORS.blue.light : (isDarkMode ? '#71717A' : '#9CA3AF')} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Honda Civic 2020, CG 160, Hilux..."
                    autoFocus
                    className={`w-full pl-12 pr-4 py-4 rounded-xl text-base transition-all outline-none border-2 ${
                      isDarkMode 
                        ? 'bg-zinc-800 text-white placeholder-zinc-500 border-zinc-700 focus:border-[#A36BFF]' 
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-transparent focus:border-[#A36BFF] focus:bg-white'
                    }`}
                    style={{ boxShadow: searchQuery ? `0 0 0 3px ${COLORS.purple.bg}` : 'none' }}
                  />
                  {isLoadingSuggestions && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Suggestions */}
                {Object.keys(groupedSuggestions).length > 0 && (
                  <div className="space-y-4">
                    {Object.entries(groupedSuggestions).map(([brand, vehicles]) => (
                      <div key={brand}>
                        <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                          isDarkMode ? 'text-zinc-500' : 'text-gray-400'
                        }`}>
                          {brand}
                        </h3>
                        <div className="space-y-1">
                          {vehicles.map((vehicle) => (
                            <motion.button
                              key={vehicle.id}
                              whileHover={{ scale: 1.01, x: 4 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => selectVehicle(vehicle.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                                isDarkMode 
                                  ? 'hover:bg-zinc-800 border border-zinc-800' 
                                  : 'hover:bg-gray-50 border border-gray-100'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
                              }`}>
                                <VehicleTypeIcon type={vehicle.bodyType} size={20} color={COLORS.purple.light} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {vehicle.model}
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                                  {vehicle.yearRange}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {vehicle.bodyType === 'motorcycle' ? 'Moto' : 
                                 vehicle.bodyType === 'truck' ? 'Caminhão' :
                                 vehicle.bodyType === 'pickup' ? 'Pickup' :
                                 vehicle.bodyType === 'suv' ? 'SUV' :
                                 vehicle.bodyType === 'van' ? 'Van' : 'Carro'}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Empty State */}
                {searchQuery.length >= 2 && !isLoadingSuggestions && suggestions.length === 0 && (
                  <div className="text-center py-12">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
                    }`}>
                      <SearchIcon size={28} color={isDarkMode ? '#52525B' : '#D1D5DB'} />
                    </div>
                    <p className={`font-medium ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                      Nenhum veículo encontrado
                    </p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>
                      Tente buscar por marca, modelo ou ano
                    </p>
                  </div>
                )}
                
                {/* Initial State */}
                {searchQuery.length < 2 && (
                  <div className="text-center py-12">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
                    }`}>
                      <VehicleTypeIcon type="car" size={36} color={isDarkMode ? '#52525B' : '#D1D5DB'} />
                    </div>
                    <p className={`font-medium ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                      Selecione um veículo
                    </p>
                    <p className={`text-sm mt-1 max-w-sm mx-auto ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>
                      Digite pelo menos 2 caracteres para buscar veículos no banco de dados brasileiro
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Parts View */
              <>
                {/* Toolbar */}
                <div className={`flex-shrink-0 px-6 py-3 border-b flex items-center justify-between gap-4 ${
                  isDarkMode ? 'border-zinc-800' : 'border-gray-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
                      <span style={{ color: COLORS.purple.light }}>{stats.total}</span> peças encontradas
                    </span>
                    {stats.verified > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                        isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'
                      }`}>
                        <CheckIcon size={12} color={COLORS.green.light} />
                        {stats.verified} verificadas
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        showFilters
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/30'
                          : isDarkMode 
                            ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' 
                            : 'bg-gray-100 text-gray-600 border border-transparent'
                      }`}
                    >
                      <FilterIcon size={16} color={showFilters ? COLORS.purple.light : (isDarkMode ? '#A1A1AA' : '#6B7280')} />
                      Filtros
                    </button>
                    
                    <div className={`flex items-center p-1 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${
                          viewMode === 'grid' 
                            ? `${isDarkMode ? 'bg-zinc-700' : 'bg-white'} shadow-sm` 
                            : ''
                        }`}
                      >
                        <GridIcon size={16} color={viewMode === 'grid' ? COLORS.purple.light : (isDarkMode ? '#71717A' : '#9CA3AF')} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${
                          viewMode === 'list' 
                            ? `${isDarkMode ? 'bg-zinc-700' : 'bg-white'} shadow-sm` 
                            : ''
                        }`}
                      >
                        <ListIcon size={16} color={viewMode === 'list' ? COLORS.purple.light : (isDarkMode ? '#71717A' : '#9CA3AF')} />
                      </button>
                    </div>
                  </div>
                </div>

                
                {/* Filters Panel */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`flex-shrink-0 overflow-hidden border-b ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}
                    >
                      <div className="px-6 py-4 flex flex-wrap gap-3">
                        {/* Category Filter */}
                        <select
                          value={filters.category || ''}
                          onChange={(e) => setFilters({ category: e.target.value || undefined })}
                          className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                            isDarkMode 
                              ? 'bg-zinc-800 text-white border-zinc-700 focus:border-purple-500' 
                              : 'bg-white text-gray-900 border-gray-200 focus:border-purple-500'
                          }`}
                        >
                          <option value="">Todas categorias</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name} ({cat.count})</option>
                          ))}
                        </select>
                        
                        {/* Brand Filter */}
                        <select
                          value={filters.brand || ''}
                          onChange={(e) => setFilters({ brand: e.target.value || undefined })}
                          className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                            isDarkMode 
                              ? 'bg-zinc-800 text-white border-zinc-700 focus:border-purple-500' 
                              : 'bg-white text-gray-900 border-gray-200 focus:border-purple-500'
                          }`}
                        >
                          <option value="">Todas marcas</option>
                          {partBrands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                        
                        {/* In Stock Toggle */}
                        <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                          filters.inStockOnly
                            ? 'bg-green-500/10 border border-green-500/30'
                            : isDarkMode ? 'bg-zinc-800 border border-zinc-700' : 'bg-gray-100 border border-transparent'
                        }`}>
                          <input
                            type="checkbox"
                            checked={filters.inStockOnly || false}
                            onChange={(e) => setFilters({ inStockOnly: e.target.checked })}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                            filters.inStockOnly 
                              ? 'bg-green-500 border-green-500' 
                              : isDarkMode ? 'border-zinc-600' : 'border-gray-300'
                          }`}>
                            {filters.inStockOnly && <CheckIcon size={10} color="#FFFFFF" />}
                          </div>
                          <span className={`text-sm font-medium ${
                            filters.inStockOnly ? 'text-green-500' : isDarkMode ? 'text-zinc-300' : 'text-gray-600'
                          }`}>
                            Em estoque
                          </span>
                        </label>
                        
                        {/* Reset Filters */}
                        {(filters.category || filters.brand || filters.inStockOnly) && (
                          <button
                            onClick={resetFilters}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            Limpar filtros
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Parts List */}
                <div className="flex-1 overflow-y-auto p-6">
                  {isLoadingParts ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className={`text-sm ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                        Buscando peças compatíveis...
                      </p>
                    </div>
                  ) : error ? (
                    <div className={`text-center py-12 px-4 rounded-xl ${
                      isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
                    }`}>
                      <p className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        {error}
                      </p>
                    </div>
                  ) : compatibleParts.length === 0 ? (
                    <div className="text-center py-16">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
                      }`}>
                        <PackageIcon size={28} color={isDarkMode ? '#52525B' : '#D1D5DB'} />
                      </div>
                      <p className={`font-medium ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                        Nenhuma peça compatível encontrada
                      </p>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>
                        Tente ajustar os filtros ou adicionar peças ao inventário
                      </p>
                    </div>
                  ) : viewMode === 'grid' ? (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {compatibleParts.map((part) => {
                        const confidenceColor = getConfidenceColor(part.confidence);
                        return (
                          <motion.div
                            key={part.id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePartClick(part)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border ${
                              isDarkMode 
                                ? 'bg-zinc-800/50 border-zinc-700 hover:border-purple-500/50' 
                                : 'bg-white border-gray-100 hover:border-purple-200'
                            }`}
                            style={{ boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)' }}
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isDarkMode ? 'bg-zinc-700' : 'bg-gray-100'
                              }`}>
                                <PackageIcon size={20} color={COLORS.purple.light} />
                              </div>
                              <div className="flex items-center gap-1.5">
                                {part.manuallyVerified && (
                                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckIcon size={12} color={COLORS.green.light} />
                                  </span>
                                )}
                                <span 
                                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                                  style={{ 
                                    backgroundColor: confidenceColor.bg, 
                                    color: isDarkMode ? confidenceColor.dark : confidenceColor.light 
                                  }}
                                >
                                  {Math.round(part.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                            
                            {/* Content */}
                            <h4 className={`font-medium text-sm mb-1 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {part.name}
                            </h4>
                            <p className={`text-xs mb-3 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                              SKU: {part.sku}
                            </p>
                            
                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                part.stockQuantity > 0
                                  ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'
                                  : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'
                              }`}>
                                {part.stockQuantity > 0 ? `${part.stockQuantity} un.` : 'Sem estoque'}
                              </span>
                              <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                R$ {part.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    /* List View */
                    <div className="space-y-2">
                      {compatibleParts.map((part) => {
                        const confidenceColor = getConfidenceColor(part.confidence);
                        return (
                          <motion.div
                            key={part.id}
                            whileHover={{ scale: 1.005, x: 4 }}
                            whileTap={{ scale: 0.995 }}
                            onClick={() => handlePartClick(part)}
                            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${
                              isDarkMode 
                                ? 'bg-zinc-800/50 border-zinc-700 hover:border-purple-500/50' 
                                : 'bg-white border-gray-100 hover:border-purple-200'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center ${
                              isDarkMode ? 'bg-zinc-700' : 'bg-gray-100'
                            }`}>
                              <PackageIcon size={22} color={COLORS.purple.light} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-medium text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {part.name}
                                </h4>
                                {part.manuallyVerified && (
                                  <span className="w-4 h-4 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center">
                                    <CheckIcon size={10} color={COLORS.green.light} />
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                                  {part.sku}
                                </span>
                                {part.brand && (
                                  <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                                    {part.brand}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span 
                                className="text-xs px-2 py-1 rounded-full font-medium"
                                style={{ 
                                  backgroundColor: confidenceColor.bg, 
                                  color: isDarkMode ? confidenceColor.dark : confidenceColor.light 
                                }}
                              >
                                {getMatchTypeLabel(part.matchType)}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                part.stockQuantity > 0
                                  ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'
                                  : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'
                              }`}>
                                {part.stockQuantity > 0 ? `${part.stockQuantity} un.` : 'Sem estoque'}
                              </span>
                              <span className={`font-semibold text-sm min-w-[80px] text-right ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                R$ {part.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VehiclePartsSearchModal;
