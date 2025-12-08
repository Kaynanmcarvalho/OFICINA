/**
 * TORQ Parts Compatibility - Search Panel (Premium)
 * Painel inteligente de busca de peças compatíveis
 * - Busca por nome da peça (não por código)
 * - Dropdown de modelos com autocomplete
 * - Prioriza peças em estoque
 * - Mostra alternativas compatíveis
 * - Suporte a veículos brasileiros clássicos
 * - Compatibilidade por faixa de anos
 * @version 2.1.0
 * @updated 2025-12-08
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
    // Limpa resultados de mercado anteriores ao fazer nova busca
    setShowMarketSearch(false);
    setMarketParts(null);
    
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
    
    // Extrai o tipo de peça do partName (remove referências ao veículo)
    // Ex: "filtro de óleo do monza" -> "filtro de óleo"
    let cleanPartName = partName.toLowerCase()
      .replace(new RegExp(make.toLowerCase(), 'gi'), '')
      .replace(new RegExp(model.toLowerCase(), 'gi'), '')
      .replace(/\s+(do|da|de|para|pro|pra)\s+/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Se ficou vazio, usa o partName original
    if (!cleanPartName) cleanPartName = partName;
    
    // Simula delay de busca
    setTimeout(() => {
      const result = intelligentPartSearch(make, model, cleanPartName);
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
      <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Buscar Peças Compatíveis
          </h3>
          
          {/* Toggle de modo */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 self-start sm:self-auto">
            <button
              onClick={() => setSearchMode('name')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                searchMode === 'name'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Por Nome
            </button>
            <button
              onClick={() => setSearchMode('vehicle')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                searchMode === 'vehicle'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Car className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 col-span-1 sm:col-span-3 mb-1">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
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
        <div className="p-3 sm:p-4">
          {/* Info da busca */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{partsInStock.length}</span> em estoque
              {alternativeParts.length > 0 && (
                <span className="ml-2">
                  • <span className="font-semibold">{alternativeParts.length}</span> alternativas
                </span>
              )}
              {searchResult.searchedVehicle && (
                <span className="block sm:inline sm:ml-2 text-blue-600 dark:text-blue-400 text-xs">
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
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  Disponível em Estoque
                </h4>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                  {partsInStock.length}
                </span>
              </div>
              <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-56 overflow-y-auto">
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
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  Peças Compatíveis / Alternativas
                </h4>
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full">
                  {alternativeParts.length}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                Peças de outras marcas que são compatíveis pelo part number
              </p>
              <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-56 overflow-y-auto">
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
            <div className="text-center py-4 sm:py-6">
              <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2 sm:mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
                Nenhuma peça encontrada no estoque
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 sm:mb-4 px-4">
                {make && model 
                  ? `Não temos "${partName}" para ${make} ${model} em estoque`
                  : 'Tente buscar com outros termos ou selecione um veículo'}
              </p>
              
              {/* Botão para consultar no mercado */}
              {make && model && partName && (
                <button
                  onClick={handleMarketSearch}
                  disabled={marketSearchLoading}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-purple-500/25"
                >
                  {marketSearchLoading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  <span className="hidden sm:inline">Consultar Peças Compatíveis no Mercado</span>
                  <span className="sm:hidden">Consultar no Mercado</span>
                </button>
              )}
            </div>
          )}

          {/* Resultados do Mercado */}
          {showMarketSearch && marketParts && (
            <div className="mt-4">
              {/* Premium Header Card - Apple Dark Style */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-5 mb-4 shadow-xl shadow-gray-900/20 border border-gray-700/50">
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
                {/* Subtle shine effect */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg border border-gray-600/50">
                    {/* Gear/Cog SVG icon */}
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Peças Compatíveis Encontradas
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {marketParts.partType} • {make} {model}
                      {marketParts.vehicleYearStart && marketParts.vehicleYearEnd && (
                        <span className="ml-2 text-cyan-400">
                          ({marketParts.vehicleYearStart} - {marketParts.vehicleYearEnd})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                    <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-300">Verificado</span>
                  </div>
                </div>
              </div>

              {/* Peças Originais (OEM) */}
              {marketParts.oem.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Peças Genuínas
                    </h5>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                      OEM
                    </span>
                  </div>
                  <div className="space-y-2">
                    {marketParts.oem.map((part, idx) => (
                      <div
                        key={idx}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/50 dark:border-blue-800/50 p-4 transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-700"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl blur-lg" />
                            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h6 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {part.name}
                              </h6>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-blue-600 dark:text-blue-400">{part.brand}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-400" />
                              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300">
                                {part.partNumber}
                              </span>
                              {part.yearStart && part.yearEnd && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                                  <span className="text-cyan-600 dark:text-cyan-400 font-medium">
                                    {part.yearStart} - {part.yearEnd}
                                  </span>
                                </>
                              )}
                            </div>
                            {part.notes && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                {part.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm">
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Original
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Peças Compatíveis (Aftermarket) */}
              {marketParts.aftermarket.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4V20M4 12H20M20 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Peças Compatíveis
                    </h5>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                      Aftermarket
                    </span>
                  </div>
                  <div className="space-y-2">
                    {marketParts.aftermarket.map((part, idx) => {
                      const isPremium = part.type === 'premium';
                      const gradientFrom = isPremium ? 'from-amber-50' : 'from-emerald-50';
                      const gradientTo = isPremium ? 'to-orange-50' : 'to-teal-50';
                      const darkGradientFrom = isPremium ? 'dark:from-amber-950/40' : 'dark:from-emerald-950/40';
                      const darkGradientTo = isPremium ? 'dark:to-orange-950/40' : 'dark:to-teal-950/40';
                      const borderColor = isPremium ? 'border-amber-200/50 dark:border-amber-800/50' : 'border-emerald-200/50 dark:border-emerald-800/50';
                      const iconGradientFrom = isPremium ? 'from-amber-500' : 'from-emerald-500';
                      const iconGradientTo = isPremium ? 'to-orange-600' : 'to-teal-600';
                      const brandColor = isPremium ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';
                      const badgeBg = isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500';
                      const badgeText = isPremium ? 'Premium' : 'Compatível';
                      
                      return (
                        <div
                          key={idx}
                          className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} ${darkGradientFrom} ${darkGradientTo} border ${borderColor} p-4 transition-all hover:shadow-lg hover:shadow-emerald-500/10`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className={`absolute inset-0 bg-gradient-to-br ${iconGradientFrom}/20 ${iconGradientTo}/20 rounded-xl blur-lg`} />
                              <div className={`relative w-12 h-12 bg-gradient-to-br ${iconGradientFrom} ${iconGradientTo} rounded-xl flex items-center justify-center shadow-lg`}>
                                <Package className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h6 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                  {part.name}
                                </h6>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className={`font-medium ${brandColor}`}>{part.brand}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300">
                                  {part.partNumber}
                                </span>
                                {part.yearStart && part.yearEnd && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                                    <span className="text-cyan-600 dark:text-cyan-400 font-medium">
                                      {part.yearStart} - {part.yearEnd}
                                    </span>
                                  </>
                                )}
                              </div>
                              {part.notes && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                  {part.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${badgeBg} text-white text-xs font-semibold rounded-lg shadow-sm`}>
                                {isPremium && (
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                                  </svg>
                                )}
                                {badgeText}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer com verificação */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800/50 dark:to-slate-800/50 border border-gray-200/50 dark:border-gray-700/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                      Dados Verificados
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {marketParts.verificationSource || 'Catálogos oficiais HiFlo e K&N'}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Sempre confirme a compatibilidade no catálogo oficial do fabricante antes de comprar. Os anos indicados representam o período de produção do veículo.
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
