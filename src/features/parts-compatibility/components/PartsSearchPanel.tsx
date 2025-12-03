/**
 * TORQ Parts Compatibility - Search Panel (Premium)
 * Painel inteligente de busca de peças compatíveis
 * - Busca por nome da peça (não por código)
 * - Dropdown de modelos com autocomplete
 * - Prioriza peças em estoque
 * - Mostra alternativas compatíveis
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Car,
  Package,
  Filter,
  X,
  ChevronDown,
  Loader2,
  Check,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { usePartsCompatibility } from '../hooks/usePartsCompatibility';
import { PartCard } from './PartCard';
import { CategoryFilter } from './CategoryFilter';
import type { PartCategory } from '../types';
import { COMMON_PART_TYPES } from '../types';
import { 
  getAllMakes, 
  getModelsByMake,
} from '../data/vehicleDatabase';
import {
  intelligentPartSearch,
  type VehiclePartCompatibility,
} from '../data/partsDatabase';

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

type SearchMode = 'vehicle' | 'name';

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
    searchParts,
    filterByCategory,
    filterInStockOnly,
    clearSearch,
    clearError,
  } = usePartsCompatibility({ empresaId });

  // Estados locais
  const [searchMode, setSearchMode] = useState<SearchMode>('name');
  const [make, setMake] = useState(vehicleInfo?.make || '');
  const [model, setModel] = useState(vehicleInfo?.model || '');
  const [year, setYear] = useState(vehicleInfo?.year?.toString() || '');
  const [partName, setPartName] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | null>(null);
  const [inStock, setInStock] = useState(true); // Padrão: apenas em estoque
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showMarketSearch, setShowMarketSearch] = useState(false);
  const [marketParts, setMarketParts] = useState<VehiclePartCompatibility | null>(null);
  const [marketSearchLoading, setMarketSearchLoading] = useState(false);
  
  // Dropdowns
  const [showMakeDropdown, setShowMakeDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  
  // Refs para fechar dropdowns ao clicar fora
  const makeDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (makeDropdownRef.current && !makeDropdownRef.current.contains(event.target as Node)) {
        setShowMakeDropdown(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Todas as marcas disponíveis
  const allMakes = useMemo(() => getAllMakes(), []);

  // Modelos filtrados baseado na marca selecionada e busca
  const filteredModels = useMemo(() => {
    const models = getModelsByMake(make);
    if (!modelSearch) return models;
    return models.filter(m => 
      m.toLowerCase().includes(modelSearch.toLowerCase())
    );
  }, [make, modelSearch]);

  // Anos disponíveis (últimos 35 anos)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 35 }, (_, i) => currentYear - i);
  }, []);

  /**
   * Executa busca inteligente
   */
  const handleSearch = useCallback(async () => {
    if (searchMode === 'name') {
      if (!partName.trim()) return;
      
      // Busca por nome da peça + veículo (se informado)
      await searchParts({
        partName: partName.trim(),
        vehicleMake: make || undefined,
        vehicleModel: model || undefined,
        vehicleYear: year ? parseInt(year) : undefined,
        inStockOnly: inStock,
      });
    } else {
      // Busca por veículo
      if (!make || !model) return;
      await searchParts({
        vehicleMake: make,
        vehicleModel: model,
        vehicleYear: year ? parseInt(year) : undefined,
        inStockOnly: inStock,
      });
    }
  }, [searchMode, partName, make, model, year, inStock, searchParts]);

  /**
   * Busca rápida por tipo de peça
   */
  const handleQuickSearch = useCallback(async (partType: string, category: PartCategory) => {
    setPartName(partType);
    setSelectedCategory(category);
    
    await searchParts({
      partName: partType,
      partCategory: category,
      vehicleMake: make || undefined,
      vehicleModel: model || undefined,
      vehicleYear: year ? parseInt(year) : undefined,
      inStockOnly: inStock,
    });
  }, [make, model, year, inStock, searchParts]);

  /**
   * Limpa busca
   */
  const handleClear = useCallback(() => {
    setPartName('');
    setMake(vehicleInfo?.make || '');
    setModel(vehicleInfo?.model || '');
    setYear(vehicleInfo?.year?.toString() || '');
    setSelectedCategory(null);
    setShowAlternatives(false);
    setShowMarketSearch(false);
    setMarketParts(null);
    clearSearch();
  }, [vehicleInfo, clearSearch]);

  /**
   * Busca peças no mercado (quando não há em estoque)
   */
  const handleMarketSearch = useCallback(() => {
    if (!make || !model || !partName) return;
    
    setMarketSearchLoading(true);
    
    // Simula delay de busca
    setTimeout(() => {
      const result = intelligentPartSearch(make, model, partName);
      setMarketParts(result.exactMatch);
      setShowMarketSearch(true);
      setMarketSearchLoading(false);
    }, 500);
  }, [make, model, partName]);

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

  // Separar peças em estoque e alternativas
  const { partsInStock, alternativeParts } = useMemo(() => {
    const inStockParts = filteredParts.filter(p => p.stockQuantity && p.stockQuantity > 0);
    const alternatives = filteredParts.filter(p => !p.stockQuantity || p.stockQuantity <= 0);
    return { partsInStock: inStockParts, alternativeParts: alternatives };
  }, [filteredParts]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Buscar Peças Compatíveis
          </h3>
          
          {/* Toggle de modo */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSearchMode('name')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                searchMode === 'name'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 inline mr-1" />
              Por Nome
            </button>
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
          </div>
        </div>

        {/* Busca por Nome */}
        {searchMode === 'name' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Nome da Peça
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Ex: Filtro de óleo BMW 320i, Pastilha de freio Civic..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Buscas rápidas */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Buscas Rápidas
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_PART_TYPES.slice(0, 8).map((type) => (
                  <button
                    key={type.name}
                    onClick={() => handleQuickSearch(type.name, type.category)}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro opcional por veículo */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 col-span-3 mb-1">
                Filtrar por veículo (opcional)
              </div>

              {/* Marca com Dropdown */}
              <div ref={makeDropdownRef} className="relative">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Marca
                </label>
                <button
                  type="button"
                  onClick={() => setShowMakeDropdown(!showMakeDropdown)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-left flex items-center justify-between focus:ring-2 focus:ring-blue-500"
                >
                  <span className={make ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                    {make || 'Selecione...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showMakeDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showMakeDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    <button
                      onClick={() => { setMake(''); setModel(''); setShowMakeDropdown(false); }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Todas as marcas
                    </button>
                    {allMakes.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setMake(m); setModel(''); setShowMakeDropdown(false); }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                          make === m ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {m}
                        {make === m && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Modelo com Autocomplete */}
              <div ref={modelDropdownRef} className="relative">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Modelo
                </label>
                <input
                  type="text"
                  value={model || modelSearch}
                  onChange={(e) => {
                    setModelSearch(e.target.value);
                    setModel('');
                    setShowModelDropdown(true);
                  }}
                  onFocus={() => make && setShowModelDropdown(true)}
                  placeholder={make ? 'Digite o modelo...' : 'Selecione a marca'}
                  disabled={!make}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                
                {showModelDropdown && make && filteredModels.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredModels.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setModel(m); setModelSearch(''); setShowModelDropdown(false); }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                          model === m ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {m}
                        {model === m && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ano */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Ano
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Busca por Veículo */}
        {searchMode === 'vehicle' && (
          <div className="grid grid-cols-3 gap-3">
            {/* Marca com Dropdown */}
            <div ref={makeDropdownRef} className="relative">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Marca *
              </label>
              <button
                type="button"
                onClick={() => setShowMakeDropdown(!showMakeDropdown)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-left flex items-center justify-between focus:ring-2 focus:ring-blue-500"
              >
                <span className={make ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                  {make || 'Selecione...'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showMakeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showMakeDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {allMakes.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMake(m); setModel(''); setShowMakeDropdown(false); }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                        make === m ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {m}
                      {make === m && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modelo com Autocomplete */}
            <div ref={modelDropdownRef} className="relative">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Modelo *
              </label>
              <input
                type="text"
                value={model || modelSearch}
                onChange={(e) => {
                  setModelSearch(e.target.value);
                  setModel('');
                  setShowModelDropdown(true);
                }}
                onFocus={() => make && setShowModelDropdown(true)}
                placeholder={make ? 'Digite o modelo...' : 'Selecione a marca'}
                disabled={!make}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              
              {showModelDropdown && make && filteredModels.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {filteredModels.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setModel(m); setModelSearch(''); setShowModelDropdown(false); }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                        model === m ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {m}
                      {model === m && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ano */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Ano
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleSearch}
            disabled={isSearching || (searchMode === 'name' ? !partName.trim() : !make || !model)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/25"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar Peças
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
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => handleStockFilter(e.target.checked)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Priorizar peças em estoque
              </span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAlternatives}
                onChange={(e) => setShowAlternatives(e.target.checked)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Mostrar peças alternativas/compatíveis de outras marcas
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
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
              <span className="font-semibold text-gray-900 dark:text-white">{partsInStock.length}</span> em estoque
              {alternativeParts.length > 0 && (
                <span className="ml-2">
                  • <span className="font-semibold">{alternativeParts.length}</span> alternativas
                </span>
              )}
              {searchResult.searchedVehicle && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
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

          {/* Peças em Estoque */}
          {partsInStock.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Disponível em Estoque
                </h4>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                  {partsInStock.length}
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {partsInStock.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    onClick={() => onPartSelect?.(part.id)}
                    highlight
                  />
                ))}
              </div>
            </div>
          )}

          {/* Peças Alternativas */}
          {showAlternatives && alternativeParts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Peças Compatíveis / Alternativas
                </h4>
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full">
                  {alternativeParts.length}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Peças de outras marcas que são compatíveis pelo part number
              </p>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {alternativeParts.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    onClick={() => onPartSelect?.(part.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Nenhum resultado - Mostrar opção de consultar mercado */}
          {filteredParts.length === 0 && !showMarketSearch && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Nenhuma peça encontrada no estoque
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                {make && model 
                  ? `Não temos "${partName}" para ${make} ${model} em estoque`
                  : 'Tente buscar com outros termos ou selecione um veículo'}
              </p>
              
              {/* Botão para consultar no mercado */}
              {make && model && partName && (
                <button
                  onClick={handleMarketSearch}
                  disabled={marketSearchLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/25"
                >
                  {marketSearchLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  Consultar Peças Compatíveis no Mercado
                </button>
              )}
            </div>
          )}

          {/* Resultados do Mercado */}
          {showMarketSearch && marketParts && (
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Peças Compatíveis no Mercado
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {marketParts.partType} para {make} {model}
                  </p>
                </div>
              </div>

              {/* Peças OEM (Originais) */}
              {marketParts.oem.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    Peças Originais (OEM)
                  </h5>
                  <div className="space-y-2">
                    {marketParts.oem.map((part, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {part.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {part.brand} • {part.partNumber}
                            </p>
                          </div>
                          {part.price && (
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                R$ {part.price.min} - {part.price.max}
                              </p>
                              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full">
                                Original
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Peças Aftermarket */}
              {marketParts.aftermarket.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Peças Compatíveis (Aftermarket)
                  </h5>
                  <div className="space-y-2">
                    {marketParts.aftermarket.map((part, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          part.type === 'premium'
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
                            : part.type === 'economy'
                            ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                            : 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {part.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {part.brand} • {part.partNumber}
                            </p>
                          </div>
                          {part.price && (
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                R$ {part.price.min} - {part.price.max}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                part.type === 'premium'
                                  ? 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300'
                                  : part.type === 'economy'
                                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                  : 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                              }`}>
                                {part.type === 'premium' ? 'Premium' : part.type === 'economy' ? 'Econômico' : 'Compatível'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Indicador de Verificação */}
              {marketParts.verificationSource && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                      Dados Verificados
                    </p>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                    Fonte: {marketParts.verificationSource}
                  </p>
                </div>
              )}

              {/* Aviso Importante */}
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  ⚠️ <strong>Importante:</strong> Sempre confirme a compatibilidade no catálogo oficial do fabricante 
                  ou com seu mecânico antes de comprar. Os dados são baseados em catálogos HiFlo e K&N oficiais.
                </p>
              </div>
            </div>
          )}

          {/* Nenhum resultado no mercado */}
          {showMarketSearch && !marketParts && (
            <div className="text-center py-6 border-t border-gray-100 dark:border-gray-700 mt-4">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Não encontramos peças específicas para este veículo
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Recomendamos consultar o manual do proprietário ou uma concessionária autorizada
              </p>
            </div>
          )}

          {/* Sugestão para buscar alternativas */}
          {!showAlternatives && alternativeParts.length > 0 && (
            <button
              onClick={() => setShowAlternatives(true)}
              className="w-full mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Ver {alternativeParts.length} peças alternativas compatíveis
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Estado inicial */}
      {!searchResult && !isSearching && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">
            Busca Inteligente de Peças
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {searchMode === 'name'
              ? 'Digite o nome da peça (ex: "Filtro de óleo BMW 320i") para encontrar peças compatíveis'
              : 'Selecione o veículo para ver todas as peças compatíveis disponíveis'}
          </p>
        </div>
      )}
    </div>
  );
};
