/**
 * VehiclePartsSearchModal - Premium Apple-like Design
 * Modal de busca de peças por veículo com carrossel elegante
 * @version 5.0.0 - Firebase Auto-Sync + Real OEM Part Numbers
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchVehicles, getVehicleById, getRelatedVariants, groupSuggestionsByBrand } from '../services/vehicleSearchService';
import { findCompatibleParts, getAvailableCategories } from '../services/compatibilityService';
import { useAutomotiveBackend } from '../hooks/useAutomotiveBackend';
import type { VehicleVariant, VehicleSuggestion, CompatiblePart, PartSearchFilters } from '../types';
import './VehiclePartsSearchModal.css';

// ============================================================================
// UTILITY: Formatar combustível em português
// ============================================================================
const formatFuelType = (fuel: string | undefined): string => {
  if (!fuel) return 'Flex';
  const fuelMap: Record<string, string> = {
    'flex': 'Flex',
    'gasoline': 'Gasolina',
    'gasolina': 'Gasolina',
    'diesel': 'Diesel',
    'electric': 'Elétrico',
    'eletrico': 'Elétrico',
    'hybrid': 'Híbrido',
    'hibrido': 'Híbrido',
    'ethanol': 'Etanol',
    'etanol': 'Etanol',
    'gnv': 'GNV',
    'gas': 'Gás',
  };
  return fuelMap[fuel.toLowerCase()] || fuel.charAt(0).toUpperCase() + fuel.slice(1).toLowerCase();
};

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
  chevronLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
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
  oilFilter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="2" width="12" height="20" rx="3"/>
      <line x1="6" y1="6" x2="18" y2="6"/><line x1="6" y1="10" x2="18" y2="10"/>
      <line x1="6" y1="14" x2="18" y2="14"/><line x1="6" y1="18" x2="18" y2="18"/>
    </svg>
  ),
  brake: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>
    </svg>
  ),
  suspension: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1"/><path d="M12 6v2"/>
      <path d="M8 8h8l-1 3H9l-1-3z"/><path d="M9 11l1 2h4l1-2"/>
      <rect x="10" y="17" width="4" height="5" rx="1"/>
    </svg>
  ),
  electrical: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  cooling: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <path d="M4 9h16M4 15h16M9 4v16M15 4v16"/>
    </svg>
  ),
  transmission: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="5"/><circle cx="9" cy="9" r="2"/>
      <circle cx="17" cy="15" r="4"/><circle cx="17" cy="15" r="1.5"/>
    </svg>
  ),
  fuel: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M3 22h12"/>
      <rect x="5" y="8" width="8" height="5" rx="1"/>
      <path d="M15 12h2a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2"/><circle cx="21" cy="5" r="2"/>
    </svg>
  ),
  sparkPlug: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2h4v3h-4z"/><path d="M9 5h6v2H9z"/>
      <rect x="8" y="7" width="8" height="6" rx="1"/>
      <path d="M10 13v4l2 3 2-3v-4"/><path d="M12 20v2"/>
    </svg>
  ),
  belt: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="8" r="4"/><circle cx="18" cy="16" r="4"/>
      <path d="M9.5 5.5L14.5 12.5"/><path d="M9.5 10.5L14.5 19.5"/>
    </svg>
  ),
  battery: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="18" height="12" rx="2"/><path d="M20 10h2v4h-2"/>
      <path d="M6 11v4M10 11v4M14 11v4"/><path d="M7 4h2v3H7zM15 4h2v3h-2z"/>
    </svg>
  ),
};

const getCategoryIcon = (category: string): JSX.Element => {
  const c = category?.toLowerCase() || '';
  if (c.includes('filtro') && c.includes('óleo')) return Icons.oilFilter;
  if (c.includes('filtro')) return Icons.oilFilter;
  if (c.includes('freio') || c.includes('pastilha')) return Icons.brake;
  if (c.includes('suspens') || c.includes('amortec')) return Icons.suspension;
  if (c.includes('elétric') || c.includes('eletric')) return Icons.electrical;
  if (c.includes('arrefec') || c.includes('radiador')) return Icons.cooling;
  if (c.includes('câmbio') || c.includes('transmiss')) return Icons.transmission;
  if (c.includes('combust') || c.includes('injeç')) return Icons.fuel;
  if (c.includes('vela') || c.includes('ignição')) return Icons.sparkPlug;
  if (c.includes('correia') || c.includes('tensor')) return Icons.belt;
  if (c.includes('bateria')) return Icons.battery;
  if (c.includes('motor')) return Icons.engine;
  return Icons.package;
};

const getCategoryColor = (category: string): { bg: string; text: string } => {
  const c = category?.toLowerCase() || '';
  if (c.includes('filtro')) return { bg: 'var(--vps-cat-filter)', text: 'var(--vps-cat-filter-text)' };
  if (c.includes('freio') || c.includes('pastilha')) return { bg: 'var(--vps-cat-brake)', text: 'var(--vps-cat-brake-text)' };
  if (c.includes('suspens')) return { bg: 'var(--vps-cat-suspension)', text: 'var(--vps-cat-suspension-text)' };
  if (c.includes('elétric')) return { bg: 'var(--vps-cat-electrical)', text: 'var(--vps-cat-electrical-text)' };
  if (c.includes('arrefec')) return { bg: 'var(--vps-cat-cooling)', text: 'var(--vps-cat-cooling-text)' };
  if (c.includes('motor') || c.includes('vela')) return { bg: 'var(--vps-cat-engine)', text: 'var(--vps-cat-engine-text)' };
  return { bg: 'var(--vps-primary-muted)', text: 'var(--vps-primary)' };
};

const getVehicleIcon = (type: string) => {
  switch (type) {
    case 'motorcycle': return Icons.motorcycle;
    case 'truck': return Icons.truck;
    default: return Icons.car;
  }
};

// ============================================================================
// EQUIVALENTS CAROUSEL COMPONENT (Apple-like)
// ============================================================================
interface EquivalentPart {
  brand: string;
  partNumber: string;
}

const EquivalentsCarousel: React.FC<{ equivalents: EquivalentPart[] }> = ({ equivalents }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (equivalents.length === 0) return null;
  
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % equivalents.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + equivalents.length) % equivalents.length);
  
  const current = equivalents[currentIndex];
  
  return (
    <div className="vps-equiv-carousel">
      <span className="vps-equiv-header">Equivalentes</span>
      <div className="vps-equiv-slider">
        <button 
          className="vps-equiv-arrow vps-equiv-arrow-left" 
          onClick={goPrev}
          disabled={equivalents.length <= 1}
        >
          {Icons.chevronLeft}
        </button>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="vps-equiv-slide"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <span className="vps-equiv-brand">{current.brand}</span>
            <span className="vps-equiv-pn">{current.partNumber}</span>
          </motion.div>
        </AnimatePresence>
        
        <button 
          className="vps-equiv-arrow vps-equiv-arrow-right" 
          onClick={goNext}
          disabled={equivalents.length <= 1}
        >
          {Icons.chevronRight}
        </button>
      </div>
      
      {/* Dots indicator */}
      {equivalents.length > 1 && (
        <div className="vps-equiv-dots">
          {equivalents.map((_, idx) => (
            <button
              key={idx}
              className={`vps-equiv-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
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
  const [filters] = useState<PartSearchFilters>({ inStockOnly: false, minConfidence: 0.4 });
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  const isSuperAdmin = !empresaId && !!sessionStorage.getItem('userId');
  const effectiveEmpresaId = empresaId || (isSuperAdmin ? '__super_admin__' : '__local_search__');
  
  // Hook do Backend Automotivo Firebase (auto-sync)
  const automotiveBackend = useAutomotiveBackend({
    empresaId: effectiveEmpresaId,
    autoLoadChecklist: true,
  });

  // Auto-seed database on first load (sem botão)
  useEffect(() => {
    if (isOpen && !automotiveBackend.isSeeded && !automotiveBackend.isLoading && !automotiveBackend.seedProgress) {
      automotiveBackend.seedDatabase();
    }
  }, [isOpen, automotiveBackend]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Debounced search
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setError(null);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const localResults = searchVehicles(query, { limit: 25 });
        setSuggestions(localResults);
        
        try {
          await automotiveBackend.searchVehicles(query);
        } catch {
          // Firebase search failed, using local
        }
      } catch (err) {
        console.error('[Modal] Search error:', err);
        setError('Erro ao buscar veículos');
      } finally {
        setIsSearching(false);
      }
    }, 150);
  }, [automotiveBackend]);

  // Handle vehicle selection
  const handleSelectVehicle = useCallback(async (suggestion: VehicleSuggestion) => {
    setSearchQuery('');
    setSuggestions([]);
    setError(null);
    setCompatibleParts([]);
    
    const variant = getVehicleById(suggestion.id);
    if (!variant) {
      setError('Veículo não encontrado na base de dados');
      return;
    }
    
    setSelectedVariant(variant);
    const related = getRelatedVariants(variant);
    setRelatedVariants(related);
    
    setIsLoadingParts(true);
    try {
      automotiveBackend.selectVehicle({
        id: variant.id,
        brand: variant.brand,
        model: variant.model,
        year: variant.year,
        vehicleType: variant.vehicleType as any,
        fuelType: variant.fuel || 'flex',
        displayName: `${variant.brand} ${variant.model} ${variant.year}`,
        hasData: false,
        checklistCompletion: 0,
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (automotiveBackend.parts.length > 0) {
        const firebaseParts: CompatiblePart[] = automotiveBackend.parts.map(p => ({
          id: p.id,
          productId: '',
          name: p.name,
          sku: p.partNumber,
          brand: p.manufacturer,
          category: p.categoryName,
          partNumbers: [p.partNumber, ...p.alternativeNumbers],
          oemPartNumber: p.partNumber,
          images: [],
          stockQuantity: p.stockQuantity,
          price: p.price || 0,
          matchType: p.isCompatible ? 'exact' : 'heuristic',
          confidence: p.confidenceScore,
          matchTrace: { type: 'exact', source: 'parts_database' as any, reason: `Firebase - ${p.categoryName}` },
          manuallyVerified: p.confidenceScore >= 0.9,
        }));
        setCompatibleParts(firebaseParts);
        setIsLoadingParts(false);
        return;
      }
      
      const parts = await findCompatibleParts(variant, effectiveEmpresaId, filters);
      setCompatibleParts(parts);
    } catch (err: any) {
      console.error('[Modal] Error loading parts:', err);
      setError(err.message || 'Erro ao carregar peças compatíveis');
    } finally {
      setIsLoadingParts(false);
    }
  }, [filters, effectiveEmpresaId, automotiveBackend]);

  // Handle variant change
  const handleVariantChange = useCallback(async (variantId: string) => {
    const variant = getVehicleById(variantId);
    if (!variant) return;
    
    setSelectedVariant(variant);
    setIsLoadingParts(true);
    setError(null);
    
    try {
      automotiveBackend.selectVehicle({
        id: variant.id,
        brand: variant.brand,
        model: variant.model,
        year: variant.year,
        vehicleType: variant.vehicleType as any,
        fuelType: variant.fuel || 'flex',
        displayName: `${variant.brand} ${variant.model} ${variant.year}`,
        hasData: false,
        checklistCompletion: 0,
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (automotiveBackend.parts.length > 0) {
        const firebaseParts: CompatiblePart[] = automotiveBackend.parts.map(p => ({
          id: p.id,
          productId: '',
          name: p.name,
          sku: p.partNumber,
          brand: p.manufacturer,
          category: p.categoryName,
          partNumbers: [p.partNumber, ...p.alternativeNumbers],
          oemPartNumber: p.partNumber,
          images: [],
          stockQuantity: p.stockQuantity,
          price: p.price || 0,
          matchType: p.isCompatible ? 'exact' : 'heuristic',
          confidence: p.confidenceScore,
          matchTrace: { type: 'exact', source: 'parts_database' as any, reason: `Firebase - ${p.categoryName}` },
          manuallyVerified: p.confidenceScore >= 0.9,
        }));
        setCompatibleParts(firebaseParts);
        setIsLoadingParts(false);
        return;
      }
      
      const parts = await findCompatibleParts(variant, effectiveEmpresaId, filters);
      setCompatibleParts(parts);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar peças');
    } finally {
      setIsLoadingParts(false);
    }
  }, [effectiveEmpresaId, filters, automotiveBackend]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedVariant(null);
    setRelatedVariants([]);
    setCompatibleParts([]);
    setError(null);
    automotiveBackend.clearSelection();
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [automotiveBackend]);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    if (compatibleParts.length === 0) return;
    
    const headers = ['Nome', 'Código OEM', 'Equivalentes', 'Categoria'];
    const rows = compatibleParts.map(p => [
      p.name, p.sku, p.partNumbers.slice(1).join('; '), p.category || '',
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

  const groupedSuggestions = groupSuggestionsByBrand(suggestions);

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
                        <span className="vps-spec-value">{formatFuelType(selectedVariant.fuel)}</span>
                      </div>
                    )}
                  </div>

                  {relatedVariants.length > 0 && (
                    <div className="vps-variants-selector">
                      <label className="vps-variants-label">Outras versões:</label>
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

                {/* Parts Section */}
                <div className="vps-parts-section">
                  <div className="vps-parts-header">
                    <h4 className="vps-parts-title">
                      Peças Compatíveis
                      {compatibleParts.length > 0 && (
                        <span className="vps-parts-count">{compatibleParts.length}</span>
                      )}
                    </h4>
                    <div className="vps-parts-actions">
                      {compatibleParts.length > 0 && (
                        <button onClick={handleExportCSV} className="vps-export-btn">
                          {Icons.download}
                          CSV
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Loading State */}
                  {(isLoadingParts || automotiveBackend.isLoading) && (
                    <div className="vps-loading">
                      <div className="vps-loading-spinner" />
                      <span>Consultando base de dados...</span>
                    </div>
                  )}

                  {/* Empty State */}
                  {!isLoadingParts && !automotiveBackend.isLoading && compatibleParts.length === 0 && (
                    <div className="vps-empty">
                      <span className="vps-empty-icon">{Icons.package}</span>
                      <p>Nenhuma peça compatível encontrada</p>
                      <span className="vps-empty-hint">
                        Este veículo ainda não possui peças cadastradas. O sistema aprenderá conforme novos dados forem adicionados.
                      </span>
                    </div>
                  )}

                  {/* Parts Grid */}
                  {!isLoadingParts && compatibleParts.length > 0 && (
                    <div className="vps-parts-grid">
                      {compatibleParts.map((part, partIndex) => {
                        const categoryColors = getCategoryColor(part.category || '');
                        
                        // Parse equivalents from partNumbers - format is "BRAND CODE"
                        const equivalents: EquivalentPart[] = part.partNumbers.slice(1).map((pn) => {
                          // Split by first space to separate brand from code
                          const spaceIndex = pn.indexOf(' ');
                          if (spaceIndex > 0) {
                            return {
                              brand: pn.substring(0, spaceIndex).trim(),
                              partNumber: pn.substring(spaceIndex + 1).trim(),
                            };
                          }
                          // If no space, try to identify known brands
                          const knownBrands = ['MANN', 'BOSCH', 'MAHLE', 'FRAM', 'TECFIL', 'WEGA', 'NGK', 'DENSO', 'GATES', 'CONTINENTAL', 'TRW', 'FERODO', 'COBREQ', 'SKF', 'DOLZ', 'K&N', 'HIFLOFILTRO', 'EBC', 'DID', 'RK', 'ACDelco'];
                          for (const brand of knownBrands) {
                            if (pn.toUpperCase().startsWith(brand)) {
                              return {
                                brand: brand,
                                partNumber: pn.substring(brand.length).trim(),
                              };
                            }
                          }
                          return {
                            brand: 'Equivalente',
                            partNumber: pn,
                          };
                        });
                        
                        return (
                          <div key={`${part.id}-${partIndex}`} className="vps-part-card">
                            {/* Category Header */}
                            <div className="vps-card-category" style={{ backgroundColor: categoryColors.bg }}>
                              <span className="vps-card-category-icon" style={{ color: categoryColors.text }}>
                                {getCategoryIcon(part.category || '')}
                              </span>
                              <span className="vps-card-category-name" style={{ color: categoryColors.text }}>
                                {part.category || 'Peça'}
                              </span>
                            </div>

                            {/* Part Info */}
                            <div className="vps-card-content">
                              <h5 className="vps-card-title">{part.name}</h5>
                              
                              {/* OEM Part Number with Tooltip */}
                              <div className="vps-pn-main">
                                <span className="vps-pn-label vps-tooltip" data-tooltip="OEM (Original Equipment Manufacturer) é o código original da peça definido pelo fabricante do veículo. Este é o número de referência mais confiável para garantir compatibilidade.">
                                  OEM
                                </span>
                                <span className="vps-pn-code">{part.sku}</span>
                              </div>
                              
                              {/* Equivalents Carousel */}
                              {equivalents.length > 0 && (
                                <EquivalentsCarousel equivalents={equivalents} />
                              )}
                            </div>

                            {/* Verified Badge */}
                            {part.manuallyVerified && (
                              <div className="vps-card-verified-inline">
                                {Icons.check}
                                <span>Verificado</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
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
