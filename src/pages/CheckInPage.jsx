/**
 * TORQ Check-in - Premium Operational Interface
 * Design denso, informativo, elegante
 * Toggle Lista/Grade + Dark/Light mode premium
 * Janeiro 2026
 */

import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckinStore, useThemeStore } from '../store';
import { useBudgetStore } from '../store/budgetStore';
import { getBrandLogoUrl, getEffectiveBrand, formatVehicleDisplay } from '../utils/vehicleBrandLogos';
import { getBrandTheme, OFFICIAL_BRAND_COLORS } from '../utils/brandModalTheme';
import '../styles/checkin-cinematic.css';

// Lazy load modals
const ModalCheckin = lazy(() => import('./checkin/componentes/NovoCheckinModal'));
const ModalCheckout = lazy(() => import('./checkin/componentes/ModalCheckoutPremium'));
const ModalEditarCheckin = lazy(() => import('./checkin/componentes/ModalEditarCheckin'));
const CreateBudgetRoute = lazy(() => import('../features/budget/routes/create').then(m => ({ default: m.CreateBudgetRoute })));
const EditBudgetRoute = lazy(() => import('../features/budget/routes/edit').then(m => ({ default: m.EditBudgetRoute })));
const CheckinDetailsModal = lazy(() => import('./checkin/components/details/CheckinDetailsModal'));

// Dock feature modals
const OBDScannerModal = lazy(() => import('../components/modals/OBDScannerModal'));
const VehicleHistoryModal = lazy(() => import('../components/modals/VehicleHistoryModal'));

// === ICON SYSTEM - Autoral, consistente ===
const Icons = {
  ArrowIn: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  ArrowOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Scan: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  File: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  List: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  Grid: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Car: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
      <path d="M3 17h2m14 0h2M5 17H3v-4l2-5h10l4 5v4h-2" />
    </svg>
  ),
  Moto: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="17" r="3" />
      <circle cx="19" cy="17" r="3" />
      <path d="M9 17l3-8 4 8" />
      <path d="M12 9l4-4h3" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

const CheckInPage = () => {
  const { checkins, fetchCheckins, isLoading } = useCheckinStore();
  const { isDarkMode } = useThemeStore();
  const { budgets, fetchBudgets } = useBudgetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsCheckinId, setDetailsCheckinId] = useState(null);
  const [detailsVehicleBrand, setDetailsVehicleBrand] = useState(null); // Marca do veículo para tema do modal
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [selectedForCheckout, setSelectedForCheckout] = useState(null);
  const [checkinToEdit, setCheckinToEdit] = useState(null);
  const [checkinForBudget, setCheckinForBudget] = useState(null);
  const [existingBudget, setExistingBudget] = useState(null);
  
  // Dock feature modals
  const [isOBDModalOpen, setIsOBDModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    fetchCheckins();
    fetchBudgets();
    // Restore view preference
    const saved = localStorage.getItem('checkin-view-mode');
    if (saved) setViewMode(saved);
  }, [fetchCheckins, fetchBudgets]);

  // Save view preference
  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('checkin-view-mode', mode);
  };

  // Stats
  const stats = useMemo(() => {
    const inProgress = checkins.filter(c => c.status === 'in-progress' || c.status === 'pending').length;
    
    // Contar checkins que NÃO têm orçamento ainda
    const waiting = checkins.filter(c => {
      const checkinId = c.firestoreId || c.id;
      const hasBudget = budgets.some(b => 
        b.checkinId === checkinId || 
        (b.vehiclePlate === c.vehiclePlate && b.clientName === c.clientName)
      );
      // Só conta se não tem orçamento E não está completo/entregue
      return !hasBudget && c.status !== 'completed';
    }).length;
    
    const ready = checkins.filter(c => c.status === 'ready').length;
    return { inProgress, waiting, ready, total: checkins.length };
  }, [checkins, budgets]);

  // Filtered records
  const filteredCheckins = useMemo(() => {
    if (!searchTerm.trim()) return checkins;
    const term = searchTerm.toLowerCase();
    return checkins.filter(c => 
      (c.clientName || '').toLowerCase().includes(term) ||
      (c.vehiclePlate || '').toLowerCase().includes(term) ||
      (c.vehicleModel || '').toLowerCase().includes(term)
    );
  }, [checkins, searchTerm]);

  const handleSelectForCheckout = (checkin) => {
    if (selectedForCheckout?.firestoreId === checkin.firestoreId) {
      setSelectedForCheckout(null);
    } else if (checkin.status !== 'completed') {
      setSelectedForCheckout(checkin);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const formatTimeAgo = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 60) return `${diff}min`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  };

  const getStatusConfig = (status) => {
    const configs = {
      'in-progress': { label: 'Em reparo', color: 'amber' },
      'pending': { label: 'Em reparo', color: 'amber' },
      'waiting-budget': { label: 'Aguardando orçamento', color: 'blue' },
      'ready': { label: 'Pronto para retirada', color: 'green' },
      'completed': { label: 'Entregue', color: 'gray' }
    };
    return configs[status] || configs['in-progress'];
  };

  // Função inteligente para abrir modal de orçamento
  const handleBudgetClick = useCallback((checkin) => {
    // Buscar orçamento existente para este checkin
    const checkinId = checkin.firestoreId || checkin.id;
    const foundBudget = budgets.find(b => 
      b.checkinId === checkinId || 
      (b.vehiclePlate === checkin.vehiclePlate && b.clientName === checkin.clientName)
    );
    
    if (foundBudget) {
      // Já existe orçamento - abrir em modo edição
      setExistingBudget(foundBudget);
      setCheckinForBudget(checkin);
    } else {
      // Não existe orçamento - abrir em modo criação
      setExistingBudget(null);
      setCheckinForBudget(checkin);
    }
    setIsBudgetModalOpen(true);
  }, [budgets]);

  return (
    <div className={`ck-premium ${isDarkMode ? 'dark' : 'light'}`}>
      
      {/* === OPERATIONAL PANEL === */}
      <header className="ck-panel">
        <div className="ck-panel__main">
          <div className="ck-panel__status">
            <span className="ck-panel__label">Status da Oficina</span>
            <h1 className="ck-panel__title">
              {stats.inProgress} veículo{stats.inProgress !== 1 ? 's' : ''} em reparo
            </h1>
          </div>
          
          <div className="ck-panel__metrics">
            <div className="ck-metric">
              <span className="ck-metric__value">{stats.waiting}</span>
              <span className="ck-metric__label">Aguardando orçamento</span>
            </div>
            <div className="ck-metric">
              <span className="ck-metric__value">{stats.ready}</span>
              <span className="ck-metric__label">Prontos</span>
            </div>
            <div className="ck-metric">
              <span className="ck-metric__value">{stats.total}</span>
              <span className="ck-metric__label">Total</span>
            </div>
          </div>
        </div>

        <div className="ck-panel__search">
          <Icons.Search />
          <input
            type="text"
            placeholder="Buscar cliente, placa ou veículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* === ACTION BLOCKS === */}
      <section className="ck-actions">
        <motion.button
          className="ck-action ck-action--primary"
          onClick={() => setIsCheckInModalOpen(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="ck-action__icon">
            <Icons.ArrowIn />
          </div>
          <div className="ck-action__content">
            <span className="ck-action__title">Registrar Check-in</span>
            <span className="ck-action__desc">Entrada de veículo com dados e fotos</span>
          </div>
        </motion.button>

        <motion.button
          className={`ck-action ck-action--secondary ${selectedForCheckout ? 'ck-action--active' : ''}`}
          onClick={() => {
            if (selectedForCheckout) {
              setSelectedCheckin(selectedForCheckout);
              setIsCheckOutModalOpen(true);
            }
          }}
          whileHover={selectedForCheckout ? { scale: 1.01 } : {}}
          whileTap={selectedForCheckout ? { scale: 0.99 } : {}}
          disabled={!selectedForCheckout}
        >
          <div className="ck-action__icon">
            <Icons.ArrowOut />
          </div>
          <div className="ck-action__content">
            <span className="ck-action__title">
              {selectedForCheckout ? `Check-out: ${selectedForCheckout.clientName}` : 'Realizar Check-out'}
            </span>
            <span className="ck-action__desc">
              {selectedForCheckout ? selectedForCheckout.vehiclePlate : 'Selecione um veículo na lista'}
            </span>
          </div>
        </motion.button>
      </section>

      {/* === DOCK - Quick Actions === */}
      <nav className="ck-dock">
        <button 
          className="ck-dock__btn" 
          title="Scanner OBD"
          onClick={() => setIsOBDModalOpen(true)}
        >
          <Icons.Scan />
          <span>Scanner</span>
        </button>
        <button 
          className="ck-dock__btn" 
          title="Histórico"
          onClick={() => setIsHistoryModalOpen(true)}
        >
          <Icons.Clock />
          <span>Histórico</span>
        </button>
      </nav>

      {/* === RECORDS SECTION === */}
      <section className="ck-records">
        <div className="ck-records__header">
          <div className="ck-records__info">
            <h2 className="ck-records__title">Registros</h2>
            <span className="ck-records__count">{filteredCheckins.length} veículos</span>
          </div>
          
          {/* View Toggle */}
          <div className="ck-view-toggle">
            <button 
              className={`ck-view-toggle__btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewChange('list')}
              title="Modo Lista"
            >
              <Icons.List />
            </button>
            <button 
              className={`ck-view-toggle__btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewChange('grid')}
              title="Modo Grade"
            >
              <Icons.Grid />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="ck-loading">
            <div className="ck-spinner" />
            <span>Carregando registros...</span>
          </div>
        ) : filteredCheckins.length === 0 ? (
          <div className="ck-empty">
            <Icons.Car />
            <h3>Nenhum registro encontrado</h3>
            <p>Comece registrando um novo check-in</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div 
                key="list"
                className="ck-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredCheckins.map((checkin, i) => (
                  <RecordRow 
                    key={checkin.firestoreId || checkin.id}
                    checkin={checkin}
                    index={i}
                    isSelected={selectedForCheckout?.firestoreId === checkin.firestoreId}
                    onSelect={handleSelectForCheckout}
                    onView={() => { 
                      setDetailsCheckinId(checkin.firestoreId); 
                      setDetailsVehicleBrand(checkin.vehicleBrand);
                      setShowDetailsModal(true); 
                    }}
                    onEdit={() => { setCheckinToEdit(checkin); setIsEditModalOpen(true); }}
                    onBudget={() => handleBudgetClick(checkin)}
                    formatDate={formatDate}
                    formatTimeAgo={formatTimeAgo}
                    getStatusConfig={getStatusConfig}
                    isDarkMode={isDarkMode}
                    hasBudget={budgets.some(b => b.checkinId === (checkin.firestoreId || checkin.id) || (b.vehiclePlate === checkin.vehiclePlate && b.clientName === checkin.clientName))}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                className="ck-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredCheckins.map((checkin, i) => (
                  <RecordCard 
                    key={checkin.firestoreId || checkin.id}
                    checkin={checkin}
                    index={i}
                    isSelected={selectedForCheckout?.firestoreId === checkin.firestoreId}
                    onSelect={handleSelectForCheckout}
                    onView={() => { 
                      setDetailsCheckinId(checkin.firestoreId); 
                      setDetailsVehicleBrand(checkin.vehicleBrand);
                      setShowDetailsModal(true); 
                    }}
                    onEdit={() => { setCheckinToEdit(checkin); setIsEditModalOpen(true); }}
                    onBudget={() => handleBudgetClick(checkin)}
                    formatDate={formatDate}
                    getStatusConfig={getStatusConfig}
                    isDarkMode={isDarkMode}
                    hasBudget={budgets.some(b => b.checkinId === (checkin.firestoreId || checkin.id) || (b.vehiclePlate === checkin.vehiclePlate && b.clientName === checkin.clientName))}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>

      {/* === MODALS === */}
      <Suspense fallback={null}>
        {isCheckInModalOpen && (
          <ModalCheckin
            isOpen={isCheckInModalOpen}
            onClose={() => setIsCheckInModalOpen(false)}
            onSuccess={() => fetchCheckins()}
          />
        )}
        {isCheckOutModalOpen && (
          <ModalCheckout
            isOpen={isCheckOutModalOpen}
            onClose={() => { setIsCheckOutModalOpen(false); setSelectedCheckin(null); setSelectedForCheckout(null); }}
            onSuccess={() => { fetchCheckins(); setSelectedForCheckout(null); }}
            checkinData={selectedCheckin}
          />
        )}
        {isEditModalOpen && (
          <ModalEditarCheckin
            isOpen={isEditModalOpen}
            onClose={() => { setIsEditModalOpen(false); setCheckinToEdit(null); }}
            checkinData={checkinToEdit}
            onSave={() => fetchCheckins()}
          />
        )}
        {isBudgetModalOpen && !existingBudget && (
          <CreateBudgetRoute
            isOpen={isBudgetModalOpen}
            onClose={() => { setIsBudgetModalOpen(false); setCheckinForBudget(null); setExistingBudget(null); }}
            onSuccess={() => { setIsBudgetModalOpen(false); setCheckinForBudget(null); setExistingBudget(null); }}
            checkinData={checkinForBudget ? {
              checkinId: checkinForBudget.id || checkinForBudget.firestoreId,
              clientId: checkinForBudget.clientId,
              clientName: checkinForBudget.clientName,
              clientPhone: checkinForBudget.clientPhone,
              vehiclePlate: checkinForBudget.vehiclePlate,
              vehicleBrand: checkinForBudget.vehicleBrand,
              vehicleModel: checkinForBudget.vehicleModel,
              vehicleYear: checkinForBudget.vehicleYear,
              vehicleColor: checkinForBudget.vehicleColor,
            } : undefined}
          />
        )}
        {isBudgetModalOpen && existingBudget && (
          <EditBudgetRoute
            isOpen={isBudgetModalOpen}
            onClose={() => { setIsBudgetModalOpen(false); setCheckinForBudget(null); setExistingBudget(null); }}
            onSuccess={() => { setIsBudgetModalOpen(false); setCheckinForBudget(null); setExistingBudget(null); }}
            budgetId={existingBudget.id || existingBudget.firestoreId}
          />
        )}
        {showDetailsModal && detailsCheckinId && (
          <CheckinDetailsModal
            checkinId={detailsCheckinId}
            vehicleBrand={detailsVehicleBrand}
            onClose={() => { 
              setShowDetailsModal(false); 
              setDetailsCheckinId(null); 
              setDetailsVehicleBrand(null);
            }}
            onEdit={(checkin) => {
              setShowDetailsModal(false);
              setDetailsCheckinId(null);
              setDetailsVehicleBrand(null);
              setCheckinToEdit(checkin);
              setIsEditModalOpen(true);
            }}
          />
        )}
        
        {/* Dock Feature Modals */}
        {isOBDModalOpen && (
          <OBDScannerModal
            isOpen={isOBDModalOpen}
            onClose={() => setIsOBDModalOpen(false)}
            vehicleInfo={selectedForCheckout ? {
              plate: selectedForCheckout.vehiclePlate,
              make: selectedForCheckout.vehicleBrand,
              model: selectedForCheckout.vehicleModel,
              mileage: selectedForCheckout.mileage || 45000,
            } : null}
          />
        )}
        {isHistoryModalOpen && (
          <VehicleHistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            vehicleInfo={selectedForCheckout ? {
              plate: selectedForCheckout.vehiclePlate,
              make: selectedForCheckout.vehicleBrand,
              model: selectedForCheckout.vehicleModel,
              mileage: selectedForCheckout.mileage || 45000,
            } : null}
          />
        )}
      </Suspense>
    </div>
  );
};

// ============================================================================
// BRAND COLORS - Sistema de tokens derivados automaticamente
// Usa cores oficiais como acento controlado, nunca dominante
// ============================================================================

/**
 * PREMIUM AUTOMOTIVE HOVER SYSTEM
 * Usa o mapa de temas premium para gerar cores de hover
 * Inspirado em pintura automotiva metálica
 */
const getBrandColors = (brand) => {
  const theme = getBrandTheme(brand);
  
  return {
    // Cor oficial
    primary: theme.brandOfficialColor,
    accent: theme.brandAccent,
    secondary: theme.brandAccentMuted,
    
    // Hover gradient premium - inspirado em pintura metálica
    hover: theme.brandHoverGradient,
    
    // Overlay metálico
    metallicOverlay: theme.brandMetallicOverlay,
    
    // Glow da marca
    glow: theme.brandGlow,
    
    // Borda luminosa
    borderGlow: theme.brandBorderGlow,
    
    // Sombra adaptada
    shadow: theme.brandShadow,
    
    // Texto
    text: '#FFFFFF',
    
    // Accent para destaques
    accentLight: theme.brandAccentLight,
    
    // Divider e border
    divider: theme.brandDivider,
    border: theme.brandBorder,
    
    // Focus
    focusRing: theme.brandFocusRing,
    
    // Linha lateral - cor pura
    energyLine: theme.brandAccent
  };
};


// === RECORD ROW (List Mode) ===
const RecordRow = ({ checkin, index, isSelected, onSelect, onView, onEdit, onBudget, formatDate, formatTimeAgo, getStatusConfig, isDarkMode, hasBudget }) => {
  const effectiveBrand = getEffectiveBrand(checkin.vehicleBrand, checkin.vehicleModel);
  const logoUrl = getBrandLogoUrl(effectiveBrand, checkin.vehicleModel, isDarkMode);
  const status = getStatusConfig(checkin.status);
  const brandInitial = (effectiveBrand || 'V').charAt(0).toUpperCase();
  const brandColors = getBrandColors(effectiveBrand);
  
  // Verificar tipo de logo para dark mode e tamanhos especiais
  const isNoFilterLogo = isDarkMode && logoUrl && (logoUrl.includes('ford-dark') || logoUrl.includes('ferrari-dark') || logoUrl.includes('bmw-dark'));
  const isInvertOnlyLogo = isDarkMode && logoUrl && (logoUrl.includes('svgrepo.com') || logoUrl.includes('kia') || logoUrl.includes('lamborghini-dark'));
  const isPorscheNoFilter = isDarkMode && logoUrl && logoUrl.includes('porsche') && logoUrl.includes('worldvectorlogo');
  const isJeep = !isDarkMode && logoUrl && logoUrl.includes('jeep');
  const isFord = logoUrl && logoUrl.includes('ford');
  const isMercedes = logoUrl && logoUrl.includes('mercedes');
  const isLandRover = logoUrl && (logoUrl.includes('land-rover') || logoUrl.includes('land_rover'));
  const isChevrolet = logoUrl && logoUrl.includes('chevrolet');
  const isKia = logoUrl && logoUrl.includes('kia');
  const isFerrari = logoUrl && logoUrl.includes('ferrari');
  const isByd = logoUrl && logoUrl.includes('byd');
  const isLamborghini = logoUrl && logoUrl.includes('lamborghini');
  const isMclaren = logoUrl && logoUrl.includes('mclaren');
  const isPeugeot = logoUrl && logoUrl.includes('peugeot');
  const isMitsubishi = logoUrl && logoUrl.includes('mitsubishi');
  const isCitroen = logoUrl && logoUrl.includes('citroen');
  const isNissan = logoUrl && logoUrl.includes('nissan');
  const isJaguar = logoUrl && logoUrl.includes('jaguar');
  const isHonda = logoUrl && logoUrl.includes('honda');
  const isRenault = logoUrl && logoUrl.includes('renault');
  const isVolkswagen = logoUrl && logoUrl.includes('volkswagen');
  const isYamaha = logoUrl && logoUrl.includes('yamaha');
  const isHyundai = logoUrl && logoUrl.includes('hyundai');
  const isToyota = logoUrl && logoUrl.includes('toyota');
  const isAudi = logoUrl && logoUrl.includes('audi');
  const isFiat = logoUrl && logoUrl.includes('fiat');
  const isBmw = logoUrl && logoUrl.includes('bmw');
  const isMini = logoUrl && logoUrl.includes('mini');
  const isDodge = logoUrl && logoUrl.includes('dodge');
  const isVolvo = logoUrl && logoUrl.includes('volvo');
  const isPorsche = logoUrl && logoUrl.includes('porsche');
  const isGwm = logoUrl && (logoUrl.includes('gwm') || logoUrl.includes('Logotipo Branco'));
  const isKawasaki = logoUrl && logoUrl.toLowerCase().includes('kawasaki');
  const isSuzuki = logoUrl && logoUrl.toLowerCase().includes('suzuki');
  const isJac = logoUrl && logoUrl.toLowerCase().includes('jac');
  const isRoyalEnfield = logoUrl && (logoUrl.includes('royal') || logoUrl.includes('Royal_Enfield'));
  const isChery = logoUrl && logoUrl.toLowerCase().includes('chery');
  const brandLower = (effectiveBrand || '').toLowerCase();
  const isLandRoverBrand = brandLower.includes('land') && brandLower.includes('rover');

  return (
    <motion.div
      className={`ck-row ${isSelected ? 'ck-row--selected' : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      onClick={() => onSelect(checkin)}
      style={{
        '--brand-primary': brandColors.primary,
        '--brand-secondary': brandColors.secondary,
        '--brand-accent': brandColors.accent || brandColors.secondary,
        '--brand-hover': brandColors.hover,
        '--brand-glow': brandColors.glow || 'rgba(0, 0, 0, 0.2)',
        '--brand-text': brandColors.text,
      }}
    >
      {/* Checkbox */}
      <div className={`ck-row__check ${isSelected ? 'checked' : ''}`}>
        {isSelected && <Icons.Check />}
      </div>

      {/* Brand Logo Avatar */}
      <div className="ck-row__brand">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={effectiveBrand} 
            className={`ck-row__brand-img ${isNoFilterLogo ? 'ck-row__brand-img--no-filter' : ''} ${isInvertOnlyLogo ? 'ck-row__brand-img--invert-only' : ''} ${isJeep ? 'ck-row__brand-img--jeep' : ''} ${isFord ? 'ck-row__brand-img--ford' : ''} ${isMercedes ? 'ck-row__brand-img--mercedes' : ''} ${(isLandRover || isLandRoverBrand) ? 'ck-row__brand-img--land-rover' : ''} ${isChevrolet ? 'ck-row__brand-img--chevrolet' : ''} ${isKia ? 'ck-row__brand-img--kia' : ''} ${isFerrari ? 'ck-row__brand-img--ferrari' : ''} ${isByd ? 'ck-row__brand-img--byd' : ''} ${isLamborghini ? 'ck-row__brand-img--lamborghini' : ''} ${isMclaren ? 'ck-row__brand-img--mclaren' : ''} ${isPeugeot ? 'ck-row__brand-img--peugeot' : ''} ${isMitsubishi ? 'ck-row__brand-img--mitsubishi' : ''} ${isCitroen ? 'ck-row__brand-img--citroen' : ''} ${isNissan ? 'ck-row__brand-img--nissan' : ''} ${isJaguar ? 'ck-row__brand-img--jaguar' : ''} ${isHonda ? 'ck-row__brand-img--honda' : ''} ${isRenault ? 'ck-row__brand-img--renault' : ''} ${isVolkswagen ? 'ck-row__brand-img--volkswagen' : ''} ${isYamaha ? 'ck-row__brand-img--yamaha' : ''} ${isHyundai ? 'ck-row__brand-img--hyundai' : ''} ${isToyota ? 'ck-row__brand-img--toyota' : ''} ${isAudi ? 'ck-row__brand-img--audi' : ''} ${isFiat ? 'ck-row__brand-img--fiat' : ''} ${isBmw ? 'ck-row__brand-img--bmw' : ''} ${isMini ? 'ck-row__brand-img--mini' : ''} ${isDodge ? 'ck-row__brand-img--dodge' : ''} ${isVolvo ? 'ck-row__brand-img--volvo' : ''} ${isPorsche ? 'ck-row__brand-img--porsche' : ''} ${isGwm ? 'ck-row__brand-img--gwm' : ''} ${isKawasaki ? 'ck-row__brand-img--kawasaki' : ''} ${isSuzuki ? 'ck-row__brand-img--suzuki' : ''} ${isJac ? 'ck-row__brand-img--jac' : ''} ${isRoyalEnfield ? 'ck-row__brand-img--royal-enfield' : ''} ${isChery ? 'ck-row__brand-img--chery' : ''}`}
          />
        ) : (
          <span className="ck-row__brand-fallback">{brandInitial}</span>
        )}
      </div>

      {/* Client */}
      <div className="ck-row__client">
        <span className="ck-row__name">{checkin.clientName || 'Cliente'}</span>
        <span className="ck-row__time">{formatTimeAgo(checkin.createdAt || checkin.checkinDate || checkin.checkInDate)}</span>
      </div>

      {/* Vehicle: Brand + Model */}
      <div className="ck-row__vehicle">
        <span className="ck-row__model">
          {formatVehicleDisplay(checkin.vehicleBrand, checkin.vehicleModel)}
        </span>
      </div>

      {/* Plate */}
      <div className="ck-row__plate">
        {(checkin.vehiclePlate || '---').toUpperCase()}
      </div>

      {/* Date */}
      <div className="ck-row__date">
        {formatDate(checkin.createdAt || checkin.checkinDate || checkin.checkInDate)}
      </div>

      {/* Status */}
      <div className={`ck-row__status ck-row__status--${status.color}`}>
        <span className="ck-row__status-dot" />
        {status.label}
      </div>

      {/* Actions - Premium hierarchy */}
      <div className="ck-row__actions">
        <button 
          className="ck-action-btn ck-action-btn--primary"
          onClick={(e) => { e.stopPropagation(); onView(); }} 
          title="Ver detalhes"
        >
          <Icons.Eye />
        </button>
        <button 
          className="ck-action-btn ck-action-btn--secondary"
          onClick={(e) => { e.stopPropagation(); onEdit(); }} 
          title="Editar"
        >
          <Icons.Edit />
        </button>
        <button 
          className={`ck-action-btn ck-action-btn--secondary ${hasBudget ? 'has-budget' : ''}`}
          onClick={(e) => { e.stopPropagation(); onBudget(); }} 
          title={hasBudget ? "Editar Orçamento" : "Criar Orçamento"}
        >
          <Icons.File />
          {hasBudget && <span className="budget-indicator" />}
        </button>
      </div>
    </motion.div>
  );
};

// === RECORD CARD (Grid Mode) - Premium Design ===
const RecordCard = ({ checkin, index, isSelected, onSelect, onView, onEdit, onBudget, formatDate, getStatusConfig, isDarkMode, hasBudget }) => {
  const effectiveBrand = getEffectiveBrand(checkin.vehicleBrand, checkin.vehicleModel);
  const logoUrl = getBrandLogoUrl(effectiveBrand, checkin.vehicleModel, isDarkMode);
  const status = getStatusConfig(checkin.status);
  const brandInitial = (effectiveBrand || 'V').charAt(0).toUpperCase();
  const brandColors = getBrandColors(effectiveBrand);
  
  // Verificar tipo de logo para dark mode
  const isNoFilterLogo = isDarkMode && logoUrl && (logoUrl.includes('ford-dark') || logoUrl.includes('ferrari-dark') || logoUrl.includes('bmw-dark'));
  const isInvertOnlyLogo = isDarkMode && logoUrl && (logoUrl.includes('svgrepo.com') || logoUrl.includes('kia') || logoUrl.includes('lamborghini-dark'));
  const isYamaha = logoUrl && logoUrl.includes('yamaha');
  const isLandRover = logoUrl && logoUrl.includes('land-rover');
  const isMercedes = logoUrl && logoUrl.includes('mercedes');
  const isJeep = !isDarkMode && logoUrl && logoUrl.includes('jeep');
  const isKia = logoUrl && logoUrl.includes('kia');
  const isFerrari = logoUrl && logoUrl.includes('ferrari');
  const isHonda = logoUrl && logoUrl.includes('honda');
  const isAudi = logoUrl && logoUrl.includes('audi');
  const isNissan = logoUrl && logoUrl.includes('nissan');
  const isCitroen = logoUrl && logoUrl.includes('citroen');
  const isToyota = logoUrl && logoUrl.includes('toyota');
  const isByd = logoUrl && logoUrl.includes('byd');
  const isLamborghini = logoUrl && logoUrl.includes('lamborghini');
  const isMclaren = logoUrl && logoUrl.includes('mclaren');
  const isFord = logoUrl && logoUrl.includes('ford');
  const isChevrolet = logoUrl && logoUrl.includes('chevrolet');
  const isRenault = logoUrl && logoUrl.includes('renault');
  const isFiat = logoUrl && logoUrl.includes('fiat');
  const isBmw = logoUrl && logoUrl.includes('bmw');
  const isPeugeot = logoUrl && logoUrl.includes('peugeot');
  const isMitsubishi = logoUrl && logoUrl.includes('mitsubishi');
  const isJaguar = logoUrl && logoUrl.includes('jaguar');
  const isVolkswagen = logoUrl && logoUrl.includes('volkswagen');
  const isHyundai = logoUrl && logoUrl.includes('hyundai');
  const isMini = logoUrl && logoUrl.includes('mini');
  const isDodge = logoUrl && logoUrl.includes('dodge');
  const isVolvo = logoUrl && logoUrl.includes('volvo');
  const isGwm = logoUrl && (logoUrl.includes('gwm') || logoUrl.includes('Logotipo Branco'));
  const isKawasaki = logoUrl && logoUrl.toLowerCase().includes('kawasaki');
  const isSuzuki = logoUrl && logoUrl.toLowerCase().includes('suzuki');
  const isJac = logoUrl && logoUrl.toLowerCase().includes('jac');
  const isRoyalEnfield = logoUrl && (logoUrl.includes('royal') || logoUrl.includes('Royal_Enfield'));
  const brandLower = (effectiveBrand || '').toLowerCase();
  const isLandRoverBrand = brandLower.includes('land') && brandLower.includes('rover');

  return (
    <motion.div
      className={`ck-card ${isSelected ? 'ck-card--selected' : ''} ck-card--${status.color}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onSelect(checkin)}
      style={{
        '--brand-primary': brandColors.primary,
        '--brand-secondary': brandColors.secondary,
        '--brand-accent': brandColors.accent || brandColors.secondary,
        '--brand-hover': brandColors.hover,
        '--brand-glow': brandColors.glow || 'rgba(0, 0, 0, 0.2)',
        '--brand-text': brandColors.text,
      }}
    >
      {/* Selection Indicator */}
      <div className={`ck-card__selector ${isSelected ? 'active' : ''}`}>
        {isSelected && <Icons.Check />}
      </div>

      {/* Brand Logo - Hero Element */}
      <div className="ck-card__brand-hero">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={effectiveBrand} 
            className={`ck-card__brand-logo ${isNoFilterLogo ? 'ck-card__brand-logo--no-filter' : ''} ${isInvertOnlyLogo ? 'ck-card__brand-logo--invert-only' : ''} ${isYamaha ? 'ck-card__brand-logo--yamaha' : ''} ${isLandRover || isLandRoverBrand ? 'ck-card__brand-logo--land-rover' : ''} ${isMercedes ? 'ck-card__brand-logo--mercedes' : ''} ${isJeep ? 'ck-card__brand-logo--jeep' : ''} ${isKia ? 'ck-card__brand-logo--kia' : ''} ${isFerrari ? 'ck-card__brand-logo--ferrari' : ''} ${isHonda ? 'ck-card__brand-logo--honda' : ''} ${isAudi ? 'ck-card__brand-logo--audi' : ''} ${isNissan ? 'ck-card__brand-logo--nissan' : ''} ${isCitroen ? 'ck-card__brand-logo--citroen' : ''} ${isToyota ? 'ck-card__brand-logo--toyota' : ''} ${isByd ? 'ck-card__brand-logo--byd' : ''} ${isLamborghini ? 'ck-card__brand-logo--lamborghini' : ''} ${isMclaren ? 'ck-card__brand-logo--mclaren' : ''} ${isFord ? 'ck-card__brand-logo--ford' : ''} ${isChevrolet ? 'ck-card__brand-logo--chevrolet' : ''} ${isRenault ? 'ck-card__brand-logo--renault' : ''} ${isFiat ? 'ck-card__brand-logo--fiat' : ''} ${isBmw ? 'ck-card__brand-logo--bmw' : ''} ${isPeugeot ? 'ck-card__brand-logo--peugeot' : ''} ${isMitsubishi ? 'ck-card__brand-logo--mitsubishi' : ''} ${isJaguar ? 'ck-card__brand-logo--jaguar' : ''} ${isVolkswagen ? 'ck-card__brand-logo--volkswagen' : ''} ${isHyundai ? 'ck-card__brand-logo--hyundai' : ''} ${isMini ? 'ck-card__brand-logo--mini' : ''} ${isDodge ? 'ck-card__brand-logo--dodge' : ''} ${isVolvo ? 'ck-card__brand-logo--volvo' : ''} ${isGwm ? 'ck-card__brand-logo--gwm' : ''} ${isKawasaki ? 'ck-card__brand-logo--kawasaki' : ''} ${isSuzuki ? 'ck-card__brand-logo--suzuki' : ''} ${isJac ? 'ck-card__brand-logo--jac' : ''} ${isRoyalEnfield ? 'ck-card__brand-logo--royal-enfield' : ''}`}
          />
        ) : (
          <span className="ck-card__brand-initial">{brandInitial}</span>
        )}
      </div>

      {/* Main Content */}
      <div className="ck-card__body">
        {/* Client Name - Primary */}
        <h3 className="ck-card__client">{checkin.clientName || 'Cliente'}</h3>
        
        {/* Vehicle: Brand + Model */}
        <p className="ck-card__vehicle">
          {formatVehicleDisplay(checkin.vehicleBrand, checkin.vehicleModel)}
        </p>

        {/* Plate Badge */}
        <div className="ck-card__plate-badge">
          {(checkin.vehiclePlate || '---').toUpperCase()}
        </div>
      </div>

      {/* Footer */}
      <div className="ck-card__footer">
        <div className="ck-card__meta">
          <span className={`ck-card__status ck-card__status--${status.color}`}>
            <span className="ck-card__status-dot" />
            {status.label}
          </span>
          <span className="ck-card__date">{formatDate(checkin.createdAt || checkin.checkinDate || checkin.checkInDate)}</span>
        </div>
        
        <div className="ck-card__actions">
          <button onClick={(e) => { e.stopPropagation(); onView(); }} title="Ver detalhes">
            <Icons.Eye />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} title="Editar">
            <Icons.Edit />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onBudget(); }} 
            title={hasBudget ? "Editar Orçamento" : "Criar Orçamento"}
            className={hasBudget ? 'has-budget' : ''}
          >
            <Icons.File />
            {hasBudget && <span className="budget-indicator" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckInPage;
