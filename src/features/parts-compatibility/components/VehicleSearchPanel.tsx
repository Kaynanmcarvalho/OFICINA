/**
 * Painel de Busca de Veículos
 * Permite buscar veículos para ver peças compatíveis
 * 
 * @version 2.0.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Truck,
  RefreshCw,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { usePartsFullCompatibility } from '../hooks/usePartsFullCompatibility';
import type { VehicleSearchResult } from '../services/partsFullService';

interface VehicleSearchPanelProps {
  onVehicleSelect: (vehicle: VehicleSearchResult) => void;
  className?: string;
}

export function VehicleSearchPanel({ onVehicleSelect, className = '' }: VehicleSearchPanelProps) {
  const {
    stats,
    searchResults,
    isSearching,
    searchVehicles,
  } = usePartsFullCompatibility();

  const [searchBrand, setSearchBrand] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [vehicleType, setVehicleType] = useState<'car' | 'motorcycle' | ''>('');

  const handleSearch = useCallback(async () => {
    await searchVehicles({
      brand: searchBrand || undefined,
      model: searchModel || undefined,
      year: searchYear ? parseInt(searchYear) : undefined,
      type: vehicleType || undefined,
    });
  }, [searchBrand, searchModel, searchYear, vehicleType, searchVehicles]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Popular brands for quick selection
  const popularBrands = [
    { name: 'Volkswagen', icon: '🚗' },
    { name: 'Fiat', icon: '🚗' },
    { name: 'Chevrolet', icon: '🚗' },
    { name: 'Honda', icon: '🚗' },
    { name: 'Toyota', icon: '🚗' },
    { name: 'Hyundai', icon: '🚗' },
  ];

  const popularMotoBrands = [
    { name: 'Honda', icon: '🏍️' },
    { name: 'Yamaha', icon: '🏍️' },
    { name: 'Kawasaki', icon: '🏍️' },
    { name: 'Suzuki', icon: '🏍️' },
    { name: 'BMW', icon: '🏍️' },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Search className="w-6 h-6" />
          Buscar Veículo
        </h2>
        {stats && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats.totalVehicles.toLocaleString()}</div>
              <div className="text-xs text-indigo-100">Veículos</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats.totalParts}</div>
              <div className="text-xs text-indigo-100">Peças</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats.totalPlatforms}</div>
              <div className="text-xs text-indigo-100">Plataformas</div>
            </div>
          </div>
        )}
      </div>

      {/* Search Form */}
      <div className="p-6 space-y-4">
        {/* Vehicle Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setVehicleType(vehicleType === 'car' ? '' : 'car')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              vehicleType === 'car'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Truck className="w-5 h-5" />
            Carros
          </button>
          <button
            onClick={() => setVehicleType(vehicleType === 'motorcycle' ? '' : 'motorcycle')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              vehicleType === 'motorcycle'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Motos
          </button>
        </div>

        {/* Search Inputs */}
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Marca"
            value={searchBrand}
            onChange={(e) => setSearchBrand(e.target.value)}
            onKeyPress={handleKeyPress}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Modelo"
            value={searchModel}
            onChange={(e) => setSearchModel(e.target.value)}
            onKeyPress={handleKeyPress}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
          />
          <input
            type="number"
            placeholder="Ano"
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            onKeyPress={handleKeyPress}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Buscar Veículos
            </>
          )}
        </button>

        {/* Quick Brand Selection */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {vehicleType === 'motorcycle' ? 'Marcas populares de motos:' : 'Marcas populares:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {(vehicleType === 'motorcycle' ? popularMotoBrands : popularBrands).map((brand) => (
              <button
                key={brand.name}
                onClick={() => {
                  setSearchBrand(brand.name);
                  searchVehicles({ brand: brand.name, type: vehicleType || undefined });
                }}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {brand.icon} {brand.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {searchResults.length} veículos encontrados
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((vehicle) => (
                  <motion.button
                    key={vehicle.vehicleId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => onVehicleSelect(vehicle)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {vehicle.vehicleName}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {vehicle.platform} • {vehicle.totalParts} peças
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VehicleSearchPanel;
