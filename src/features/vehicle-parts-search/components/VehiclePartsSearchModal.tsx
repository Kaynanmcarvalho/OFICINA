/**
 * VehiclePartsSearchModal - Premium Sober Design
 * Modal de busca de peças por veículo com design Apple-like
 * @version 2.0.0
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchVehicles, getVehicleById, getRelatedVariants, groupSuggestionsByBrand } from '../services/vehicleSearchService';
import { findCompatibleParts, getAvailableCategories } from '../services/compatibilityService';
import type { VehicleVariant, VehicleSuggestion, CompatiblePart, PartSearchFilters } from '../types';
import './VehiclePartsSearchModal.css';

// ============================================================================
// ICONS (SVG inline - SF Symbols style)
// ============================================================================
const Icons = {
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  car: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
      <circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>
    </svg>
  ),

  motorcycle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/>
      <path d="M9 17h6m-9-5 3-3 4 2 4-4 2 3"/>
    </svg>
  ),
  truck: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 17h4V5H2v12h3m15 0h2v-3.34a4 4 0 0 0-1.17-2.83L15 8h-1v9h1"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  ),
  package: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  chevronRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  filter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  ),
  engine: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
    </svg>
  ),
};

const getVehicleIcon = (type: string) => {
  switch (type) {
    case 'motorcycle': return Icons.motorcycle;
    case 'truck': return Icons.truck;
    default: return Icons.car;
  }
};

// ============================================================================
// INTERFACES
// ============================================================================
interface VehiclePartsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartSelect?: (part: CompatiblePart) => void;
  empresaId: string;
  isDarkMode?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const VehiclePartsSearchModal: React.FC<VehiclePartsSearchModalProps> = ({
  isOpen,
  onClose,
  onPartSelect,
  empresaId,
  isDarkMode = true,
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariant | null>(null);
  const [relatedVariants, setRelatedVariants] = useState<VehicleVariant[]>([]);
  const [compatibleParts, setCompatibleParts] = useState<CompatiblePart[]>([]);
  const [isLoadingParts, setIsLoadingParts] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<PartSearchFilters>({ inStockOnly: false, minConfidence: 0.4 });
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Verifica se é Super Admin (não tem empresaId mas tem userId)
  const isSuperAdmin = !empresaId && !!sessionStorage.getItem('userId');
  
  // Debug: verificar se a função de busca está funcionando
  useEffect(() => {
    // Teste direto da função de busca
    const testResults = searchVehicles('golf', { limit: 5 });
    console.log('[Modal] Test search for "golf":', testResults.length, 'results');
    if (testResults.length > 0) {
      console.log('[Modal] First result:', testResults[0].displayText);
    }
  }, []);
  
  // Focus input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  
  // Load categories
  useEffect(() => {
    const effectiveId = empresaId || (isSuperAdmin ? '__super_admin__' : '');
    if (effectiveId) {
      getAvailableCategories(effectiveId).then(setCategories).catch(console.error);
    }
  }, [empresaId, isSuperAdmin]);


  // Debounced search
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    console.log('[Modal] Search query changed:', query);
    setSearchQuery(query);
    setError(null);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (query.length < 2) {
      console.log('[Modal] Query too short, clearing suggestions');
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      console.log('[Modal] Executing search for:', query);
      try {
        const results = searchVehicles(query, { limit: 25 });
        console.log('[Modal] Search results:', results.length, 'items');
        console.log('[Modal] First 3 results:', results.slice(0, 3).map(r => r.displayText));
        setSuggestions(results);
      } catch (err) {
        console.error('[Modal] Search error:', err);
        setError('Erro ao buscar veículos');
      } finally {
        setIsSearching(false);
      }
    }, 150);
  }, []);

  // Handle vehicle selection - FIXED: garantir que sempre dispara ação
  const handleSelectVehicle = useCallback(async (suggestion: VehicleSuggestion) => {
    console.log('[Modal] Vehicle selected:', suggestion.id);
    console.log('[Modal] empresaId:', empresaId, 'isSuperAdmin:', isSuperAdmin);
    
    // Limpa estado anterior
    setSearchQuery('');
    setSuggestions([]);
    setError(null);
    setCompatibleParts([]);
    
    // Obtém variante completa
    const variant = getVehicleById(suggestion.id);
    if (!variant) {
      setError('Veículo não encontrado na base de dados');
      return;
    }
    
    setSelectedVariant(variant);
    
    // Obtém variantes relacionadas (mesmo modelo/ano, diferentes trims)
    const related = getRelatedVariants(variant);
    setRelatedVariants(related);
    
    // Super Admin pode acessar sem empresaId
    const effectiveEmpresaId = empresaId || (isSuperAdmin ? '__super_admin__' : '');
    
    if (!effectiveEmpresaId) {
      setError('Sessão expirada. Faça login novamente.');
      return;
    }
    
    // Busca peças compatíveis
    setIsLoadingParts(true);
    try {
      const parts = await findCompatibleParts(variant, effectiveEmpresaId, filters);
      setCompatibleParts(parts);
      console.log(`[Modal] Found ${parts.length} compatible parts`);
    } catch (err: any) {
      console.error('[Modal] Error loading parts:', err);
      setError(err.message || 'Erro ao carregar peças compatíveis');
    } finally {
      setIsLoadingParts(false);
    }
  }, [empresaId, filters, isSuperAdmin]);

  // Handle trim/engine change
  const handleVariantChange = useCallback(async (variantId: string) => {
    const variant = getVehicleById(variantId);
    if (!variant) return;
    
    setSelectedVariant(variant);
    setIsLoadingParts(true);
    setError(null);
    
    const effectiveId = empresaId || (isSuperAdmin ? '__super_admin__' : '');
    
    try {
      const parts = await findCompatibleParts(variant, effectiveId, filters);
      setCompatibleParts(parts);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar peças');
    } finally {
      setIsLoadingParts(false);
    }
  }, [empresaId, filters, isSuperAdmin]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedVariant(null);
    setRelatedVariants([]);
    setCompatibleParts([]);
    setError(null);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    if (compatibleParts.length === 0) return;
    
    const headers = ['Nome', 'SKU', 'Part Numbers', 'Marca', 'Categoria', 'Estoque', 'Preço', 'Confiança', 'Tipo Match'];
    const rows = compatibleParts.map(p => [
      p.name,
      p.sku,
      p.partNumbers.join('; '),
      p.brand || '',
      p.category || '',
      p.stockQuantity.toString(),
      p.price.toFixed(2),
      (p.confidence * 100).toFixed(0) + '%',
      p.matchType,
    ]);
    
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pecas_${selectedVariant?.brand}_${selectedVariant?.model}_${selectedVariant?.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [compatibleParts, selectedVariant]);

  // Group suggestions by brand
  const groupedSuggestions = groupSuggestionsByBrand(suggestions);
  
  // Debug log
  console.log('[Modal] Render - suggestions:', suggestions.length, 'grouped:', Object.keys(groupedSuggestions).length);

  // Confidence badge color
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return 'var(--vps-success)';
    if (confidence >= 0.7) return 'var(--vps-warning)';
    return 'var(--vps-danger)';
  };

  if (!isOpen) return null;


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`vps-overlay ${isDarkMode ? 'vps-dark' : 'vps-light'}`}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="vps-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="vps-header">
            <div className="vps-header-content">
              <h2 className="vps-title">Buscar Peças por Veículo</h2>
              <p className="vps-subtitle">Digite marca, modelo, ano ou motor</p>
            </div>
            <button onClick={onClose} className="vps-close-btn" aria-label="Fechar">
              {Icons.close}
            </button>
          </header>

          {/* Search Bar */}
          <div className="vps-search-container">
            <div className="vps-search-wrapper">
              <span className="vps-search-icon">{Icons.search}</span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder='Ex: "Yamaha R1 2017", "VW Golf 1.0 TSI 2019"'
                className="vps-search-input"
                aria-label="Buscar veículo"
              />
              {isSearching && <div className="vps-search-spinner" />}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="vps-error">
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {/* Main Content */}
          <div className="vps-content">
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ padding: '8px', fontSize: '11px', color: 'var(--vps-text-muted)', borderBottom: '1px solid var(--vps-border)' }}>
                Query: "{searchQuery}" | Suggestions: {suggestions.length} | Selected: {selectedVariant ? 'Yes' : 'No'}
              </div>
            )}
            
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && !selectedVariant && (
              <div className="vps-suggestions">
                {Object.entries(groupedSuggestions).map(([brand, items]) => (
                  <div key={brand} className="vps-suggestion-group">
                    <div className="vps-suggestion-brand">
                      {items[0]?.variant.brandLogo && (
                        <img src={items[0].variant.brandLogo} alt={brand} className="vps-brand-logo" />
                      )}
                      <span>{brand}</span>
                    </div>
                    {items.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className="vps-suggestion-item"
                        onClick={() => handleSelectVehicle(suggestion)}
                        type="button"
                      >
                        <span className="vps-suggestion-icon">
                          {getVehicleIcon(suggestion.variant.vehicleType)}
                        </span>
                        <div className="vps-suggestion-info">
                          <span className="vps-suggestion-model">
                            {suggestion.variant.model}
                            <span className="vps-suggestion-year">{suggestion.variant.year}</span>
                          </span>
                          <span className="vps-suggestion-details">
                            {suggestion.variant.trim && <span>{suggestion.variant.trim}</span>}
                            {suggestion.variant.engineName && <span>| {suggestion.variant.engineName}</span>}
                            {suggestion.variant.engineCode && <span className="vps-engine-code">({suggestion.variant.engineCode})</span>}
                          </span>
                        </div>
                        <span className="vps-suggestion-arrow">{Icons.chevronRight}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Selected Vehicle Panel */}
            {selectedVariant && (
              <div className="vps-selected-panel">
                {/* Vehicle Card */}
                <div className="vps-vehicle-card">
                  <div className="vps-vehicle-header">
                    <div className="vps-vehicle-icon">
                      {getVehicleIcon(selectedVariant.vehicleType)}
                    </div>
                    <div className="vps-vehicle-info">
                      <h3 className="vps-vehicle-name">
                        {selectedVariant.brand} {selectedVariant.model}
                      </h3>
                      <p className="vps-vehicle-year">{selectedVariant.year}</p>
                    </div>
                    <button onClick={handleClearSelection} className="vps-change-btn">
                      Trocar
                    </button>
                  </div>
                  
                  <div className="vps-vehicle-specs">
                    {selectedVariant.trim && (
                      <div className="vps-spec">
                        <span className="vps-spec-label">Versão</span>
                        <span className="vps-spec-value">{selectedVariant.trim}</span>
                      </div>
                    )}
                    {selectedVariant.engineName && (
                      <div className="vps-spec">
                        <span className="vps-spec-label">Motor</span>
                        <span className="vps-spec-value">{selectedVariant.engineName}</span>
                      </div>
                    )}
                    {selectedVariant.engineCode && (
                      <div className="vps-spec">
                        <span className="vps-spec-label">Código</span>
                        <span className="vps-spec-value vps-mono">{selectedVariant.engineCode}</span>
                      </div>
                    )}
                    {selectedVariant.fuel && (
                      <div className="vps-spec">
                        <span className="vps-spec-label">Combustível</span>
                        <span className="vps-spec-value">{selectedVariant.fuel}</span>
                      </div>
                    )}
                    {selectedVariant.power && (
                      <div className="vps-spec">
                        <span className="vps-spec-label">Potência</span>
                        <span className="vps-spec-value">{selectedVariant.power}</span>
                      </div>
                    )}
                  </div>

                  {/* Related Variants Selector */}
                  {relatedVariants.length > 0 && (
                    <div className="vps-variants-selector">
                      <label className="vps-variants-label">Outras versões disponíveis:</label>
                      <select
                        value={selectedVariant.id}
                        onChange={(e) => handleVariantChange(e.target.value)}
                        className="vps-variants-select"
                      >
                        <option value={selectedVariant.id}>
                          {selectedVariant.trim} - {selectedVariant.engineName}
                        </option>
                        {relatedVariants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.trim} - {v.engineName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>


                {/* Parts List */}
                <div className="vps-parts-section">
                  <div className="vps-parts-header">
                    <h4 className="vps-parts-title">
                      Peças Compatíveis
                      {compatibleParts.length > 0 && (
                        <span className="vps-parts-count">{compatibleParts.length}</span>
                      )}
                    </h4>
                    <div className="vps-parts-actions">
                      <label className="vps-filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.inStockOnly}
                          onChange={(e) => setFilters(f => ({ ...f, inStockOnly: e.target.checked }))}
                        />
                        <span>Apenas em estoque</span>
                      </label>
                      {compatibleParts.length > 0 && (
                        <button onClick={handleExportCSV} className="vps-export-btn">
                          {Icons.download}
                          Exportar CSV
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Loading State */}
                  {isLoadingParts && (
                    <div className="vps-loading">
                      <div className="vps-loading-spinner" />
                      <span>Buscando peças compatíveis...</span>
                    </div>
                  )}

                  {/* Empty State */}
                  {!isLoadingParts && compatibleParts.length === 0 && (
                    <div className="vps-empty">
                      <span className="vps-empty-icon">{Icons.package}</span>
                      <p>Nenhuma peça compatível encontrada</p>
                      <span className="vps-empty-hint">
                        Cadastre peças com compatibilidade para este veículo
                      </span>
                    </div>
                  )}

                  {/* Parts Grid */}
                  {!isLoadingParts && compatibleParts.length > 0 && (
                    <div className="vps-parts-grid">
                      {compatibleParts
                        .filter(p => !filters.inStockOnly || p.stockQuantity > 0)
                        .map((part) => (
                        <div
                          key={part.id}
                          className="vps-part-card"
                          onClick={() => onPartSelect?.(part)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="vps-part-header">
                            {part.images?.[0] ? (
                              <img src={part.images[0]} alt={part.name} className="vps-part-image" />
                            ) : (
                              <div className="vps-part-placeholder">{Icons.package}</div>
                            )}
                            <div
                              className="vps-confidence-badge"
                              style={{ backgroundColor: getConfidenceColor(part.confidence) }}
                              title={`Confiança: ${(part.confidence * 100).toFixed(0)}%`}
                            >
                              {(part.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                          
                          <div className="vps-part-info">
                            <h5 className="vps-part-name">{part.name}</h5>
                            <p className="vps-part-sku">SKU: {part.sku}</p>
                            {part.brand && <p className="vps-part-brand">{part.brand}</p>}
                          </div>
                          
                          <div className="vps-part-footer">
                            <div className="vps-part-stock">
                              <span className={part.stockQuantity > 0 ? 'vps-in-stock' : 'vps-out-stock'}>
                                {part.stockQuantity > 0 ? `${part.stockQuantity} un.` : 'Sem estoque'}
                              </span>
                            </div>
                            <div className="vps-part-price">
                              R$ {part.price.toFixed(2)}
                            </div>
                          </div>
                          
                          <div className="vps-part-match">
                            <span className="vps-match-type">{part.matchType}</span>
                            {part.manuallyVerified && (
                              <span className="vps-verified">{Icons.check} Verificado</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Initial State */}
            {!selectedVariant && suggestions.length === 0 && !isSearching && (
              <div className="vps-initial">
                <div className="vps-initial-icon">{Icons.car}</div>
                <h3>Busque um veículo</h3>
                <p>Digite a marca, modelo, ano ou código do motor para encontrar peças compatíveis</p>
                <div className="vps-examples">
                  <span>Exemplos:</span>
                  <button onClick={() => setSearchQuery('Yamaha R1 2020')}>Yamaha R1 2020</button>
                  <button onClick={() => setSearchQuery('Corolla 2019')}>Corolla 2019</button>
                  <button onClick={() => setSearchQuery('Golf TSI')}>Golf TSI</button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VehiclePartsSearchModal;
