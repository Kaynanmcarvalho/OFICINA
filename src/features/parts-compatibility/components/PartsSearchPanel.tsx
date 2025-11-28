/**
 * TORQ Parts Compatibility - Search Panel
 * Painel de busca de peças compatíveis
 */

import React, { useState, useCallback } from 'react';
import {
  Search,
  Car,
  Package,
  Filter,
  X,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { usePartsCompatibility } from '../hooks/usePartsCompatibility';
import { PartCard } from './PartCard';
import { CategoryFilter } from './CategoryFilter';
import type { PartCategory } from '../types';
import { POPULAR_MAKES, PART_CATEGORY_LABELS } from '../types';

interface PartsSearchPanelProps {
  empresaId: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    engine?: string;
  };
  onPartSelect?: (partId: string) => void;
  className?: string;
}

type SearchMode = 'vehicle' | 'part';

export const PartsSearchPanel: React.FC<PartsSearchPanelProps> = ({
  empresaId,
  vehicleInfo,
  onPartSelect,
  className = '',
}) => {
  const {
    searchResult,
    filteredParts,
    categories,
    isSearching,
    error,
    searchByVehicle,
    searchByPartNumber,
    filterByCategory,
    filterInStockOnly,
    clearSearch,
    clearError,
  } = usePartsCompatibility({ empresaId });

  // Estados locais
  const [searchMode, setSearchMode] = useState<SearchMode>(
    vehicleInfo ? 'vehicle' : 'part'
  );
  const [make, setMake] = useState(vehicleInfo?.make || '');
  const [model, setModel] = useState(vehicleInfo?.model || '');
  const [year, setYear] = useState(vehicleInfo?.year?.toString() || '');
  const [partNumber, setPartNumber] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | null>(null);
  const [inStock, setInStock] = useState(false);

  /**
   * Executa busca
   */
  const handleSearch = useCallback(async () => {
    if (searchMode === 'vehicle') {
      if (!make || !model || !year) return;
      await searchByVehicle(make, model, parseInt(year), vehicleInfo?.engine);
    } else {
      if (!partNumber) return;
      await searchByPartNumber(partNumber);
    }
  }, [searchMode, make, model, year, partNumber, searchByVehicle, searchByPartNumber, vehicleInfo]);

  /**
   * Limpa busca
   */
  const handleClear = useCallback(() => {
    setMake(vehicleInfo?.make || '');
    setModel(vehicleInfo?.model || '');
    setYear(vehicleInfo?.year?.toString() || '');
    setPartNumber('');
    setSelectedCategory(null);
    clearSearch();
  }, [vehicleInfo, clearSearch]);

  /**
   * Aplica filtro de categoria
   */
  const handleCategoryFilter = useCallback(
    (category: PartCategory | null) => {
      setSelectedCategory(category);
      filterByCategory(category);
    },
    [filterByCategory]
  );

  /**
   * Aplica filtro de estoque
   */
  const handleStockFilter = useCallback(
    (checked: boolean) => {
      setInStock(checked);
      filterInStockOnly(checked);
    },
    [filterInStockOnly]
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            Buscar Peças Compatíveis
          </h3>
          
          {/* Toggle de modo */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSearchMode('vehicle')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                searchMode === 'vehicle'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Car className="w-4 h-4 inline mr-1" />
              Por Veículo
            </button>
            <button
              onClick={() => setSearchMode('part')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                searchMode === 'part'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 inline mr-1" />
              Por Código
            </button>
          </div>
        </div>

        {/* Formulário de busca */}
        {searchMode === 'vehicle' ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Marca
              </label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                {POPULAR_MAKES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Modelo
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: Onix"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Ano
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2023"
                min="1990"
                max="2025"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Código da Peça
            </label>
            <input
              type="text"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="Ex: 0986B02365"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-xl transition-colors"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-colors ${
              showFilters
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          
          {searchResult && (
            <button
              onClick={handleClear}
              className="p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros expandidos */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => handleStockFilter(e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Apenas em estoque
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Resultados */}
      {searchResult && (
        <div className="p-4">
          {/* Info da busca */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredParts.length} peça{filteredParts.length !== 1 ? 's' : ''} encontrada{filteredParts.length !== 1 ? 's' : ''}
              {searchResult.searchedVehicle && (
                <span className="ml-1">
                  para {searchResult.searchedVehicle.make} {searchResult.searchedVehicle.model} {searchResult.searchedVehicle.year}
                </span>
              )}
            </p>
          </div>

          {/* Filtro por categoria */}
          {categories.length > 0 && (
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={handleCategoryFilter}
              className="mb-4"
            />
          )}

          {/* Lista de peças */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredParts.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                onClick={() => onPartSelect?.(part.id)}
              />
            ))}

            {filteredParts.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhuma peça encontrada
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estado inicial */}
      {!searchResult && !isSearching && (
        <div className="p-8 text-center">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            {searchMode === 'vehicle'
              ? 'Informe o veículo para buscar peças compatíveis'
              : 'Digite o código da peça para buscar'}
          </p>
        </div>
      )}
    </div>
  );
};
