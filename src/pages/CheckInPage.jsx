import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  LogIn, 
  LogOut, 
  Search,
  Wrench,
  Clock,
  CheckCircle2,
  Package,
  TrendingUp,
  Check,
  Eye,
  Edit3,
  FileText,
  Bluetooth,
  Activity,
  History,
  Car,
  Bike,
  Truck,
  Trash2,
  Calendar
} from 'lucide-react';
import { useCheckinStore, useThemeStore } from '../store';
import { getBrandLogoUrl, getBrandInitials, getEffectiveBrand } from '../utils/vehicleBrandLogos';
import '../styles/checkin-apple.css';

// Lazy load heavy components
const ModalCheckin = lazy(() => import('./checkin/componentes/ModalCheckinPremium'));
const ModalCheckout = lazy(() => import('./checkin/componentes/ModalCheckoutPremium'));
const ModalEditarCheckin = lazy(() => import('./checkin/componentes/ModalEditarCheckin'));
const BudgetModal = lazy(() => import('./budgets/components/BudgetModalPremium'));
const CheckinDetailsModal = lazy(() => import('./checkin/components/details/CheckinDetailsModal'));

const CheckInPage = () => {
  const { checkins, fetchCheckins, isLoading, deleteCheckin } = useCheckinStore();
  const { isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsCheckinId, setDetailsCheckinId] = useState(null);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [selectedForCheckout, setSelectedForCheckout] = useState(null);
  const [checkinToEdit, setCheckinToEdit] = useState(null);
  const [checkinForBudget, setCheckinForBudget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [checkinToDelete, setCheckinToDelete] = useState(null);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const inProgress = checkins.filter(c => c.status === 'in-progress' || c.status === 'pending').length;
    const waitingBudget = checkins.filter(c => c.status === 'waiting-budget').length;
    const readyForPickup = checkins.filter(c => c.status === 'ready').length;
    const completedToday = checkins.filter(c => {
      if (c.status !== 'completed') return false;
      const completedDate = c.completedAt ? new Date(c.completedAt) : null;
      return completedDate && completedDate >= today;
    }).length;

    return { inProgress, waitingBudget, readyForPickup, completedToday };
  }, [checkins]);

  // Filtrar registros
  const filteredCheckins = useMemo(() => {
    if (!searchTerm.trim()) return checkins.slice(0, 15);
    
    const term = searchTerm.toLowerCase().replace(/[.\-\/\(\)\s]/g, '');
    return checkins.filter(c => {
      const searchFields = [
        c.clientName,
        c.vehiclePlate,
        c.vehicleBrand,
        c.vehicleModel,
        c.id
      ].map(f => (f || '').toLowerCase().replace(/[.\-\/\(\)\s]/g, ''));
      
      return searchFields.some(f => f.includes(term));
    }).slice(0, 15);
  }, [checkins, searchTerm]);

  const handleCheckInSuccess = async () => {
    try {
      await fetchCheckins();
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
    }
  };

  const handleCheckOutSuccess = async () => {
    try {
      await fetchCheckins();
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
    }
  };

  const handleCheckoutClick = () => {
    if (selectedForCheckout) {
      setSelectedCheckin(selectedForCheckout);
      setIsCheckOutModalOpen(true);
    }
  };

  const handleSelectForCheckout = (checkin) => {
    // Se já está selecionado, desseleciona
    if (selectedForCheckout?.firestoreId === checkin.firestoreId) {
      setSelectedForCheckout(null);
    } else {
      // Só permite selecionar se não estiver concluído
      if (checkin.status !== 'completed') {
        setSelectedForCheckout(checkin);
      }
    }
  };

  // Funções auxiliares para o novo design
  const getStatusConfig = (status) => {
    const configs = {
      'in-progress': { label: 'Em reparo', class: 'ck-record__status--progress' },
      'pending': { label: 'Em reparo', class: 'ck-record__status--progress' },
      'waiting-budget': { label: 'Aguardando', class: 'ck-record__status--waiting' },
      'ready': { label: 'Pronto', class: 'ck-record__status--ready' },
      'completed': { label: 'Entregue', class: 'ck-record__status--completed' }
    };
    return configs[status] || configs['in-progress'];
  };

  const formatPlate = (plate) => {
    if (!plate) return '---';
    const cleaned = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length === 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }
    return plate.toUpperCase();
  };

  // Detecta tipo de veículo baseado em marca/modelo
  const getVehicleType = (checkin) => {
    const brand = (checkin.vehicleBrand || '').toLowerCase();
    const model = (checkin.vehicleModel || '').toLowerCase();
    const combined = `${brand} ${model}`;
    
    // Motos
    const motorcycleBrands = ['honda', 'yamaha', 'suzuki', 'kawasaki', 'harley', 'bmw motorrad', 'ducati', 'triumph', 'ktm', 'royal enfield', 'dafra', 'shineray'];
    const motorcycleKeywords = ['moto', 'cg', 'biz', 'pop', 'factor', 'fazer', 'cb', 'xre', 'bros', 'titan', 'fan', 'pcx', 'nmax', 'crosser', 'lander', 'tenere', 'mt-', 'ninja', 'z900', 'z1000'];
    
    if (motorcycleBrands.some(b => brand.includes(b)) || motorcycleKeywords.some(k => combined.includes(k))) {
      return 'motorcycle';
    }
    
    // Caminhões
    const truckBrands = ['scania', 'volvo trucks', 'mercedes-benz trucks', 'man', 'iveco', 'daf'];
    const truckKeywords = ['caminhão', 'truck', 'cavalo', 'carreta', 'bitruck', 'toco', 'furgão', 'vuc', 'hr', 'bongo', 'sprinter', 'master', 'ducato', 'daily'];
    
    if (truckBrands.some(b => brand.includes(b)) || truckKeywords.some(k => combined.includes(k))) {
      return 'truck';
    }
    
    return 'car';
  };

  // Formata tempo relativo
  const formatRelativeTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const checkinDate = date instanceof Date ? date : new Date(date);
    
    if (isNaN(checkinDate.getTime())) return '';
    
    const diffMs = now - checkinDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays}d`;
    
    return checkinDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  // Deleta um checkin
  const handleDelete = async (checkin) => {
    setCheckinToDelete(checkin);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (checkin) => {
    const id = checkin.firestoreId || checkin.id;
    setDetailsCheckinId(id);
    setShowDetailsModal(true);
  };

  const handleEdit = (checkin) => {
    setCheckinToEdit(checkin);
    setIsEditModalOpen(true);
  };

  const handleCreateBudget = (checkin) => {
    setCheckinForBudget(checkin);
    setIsBudgetModalOpen(true);
  };

  return (
    <div className={`ck-page ${isDarkMode ? 'dark' : ''}`}>
      <div className="ck-container">
        {/* Header */}
        <header className="ck-header">
          <div className="ck-header__title-group">
            <h1 className="ck-header__title">Check-in / Check-out</h1>
            <p className="ck-header__subtitle">
              Gerencie entradas e saídas de veículos
            </p>
          </div>
          
          <div className="ck-search">
            <Search className="ck-search__icon" />
            <input
              type="text"
              className="ck-search__input"
              placeholder="Buscar cliente, placa, veículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Stats Cards */}
        <section className="ck-stats">
          <motion.div 
            className="ck-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="ck-stat-card__header">
              <div className="ck-stat-card__icon ck-stat-card__icon--orange">
                <Wrench />
              </div>
              <span className="ck-stat-card__trend ck-stat-card__trend--up">
                <TrendingUp size={12} />
              </span>
            </div>
            <span className="ck-stat-card__value">{stats.inProgress}</span>
            <span className="ck-stat-card__label">Em reparo</span>
          </motion.div>

          <motion.div 
            className="ck-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="ck-stat-card__header">
              <div className="ck-stat-card__icon ck-stat-card__icon--blue">
                <Clock />
              </div>
            </div>
            <span className="ck-stat-card__value">{stats.waitingBudget}</span>
            <span className="ck-stat-card__label">Aguardando orçamento</span>
          </motion.div>

          <motion.div 
            className="ck-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="ck-stat-card__header">
              <div className="ck-stat-card__icon ck-stat-card__icon--green">
                <CheckCircle2 />
              </div>
            </div>
            <span className="ck-stat-card__value">{stats.readyForPickup}</span>
            <span className="ck-stat-card__label">Pronto para retirada</span>
          </motion.div>

          <motion.div 
            className="ck-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="ck-stat-card__header">
              <div className="ck-stat-card__icon ck-stat-card__icon--purple">
                <Package />
              </div>
            </div>
            <span className="ck-stat-card__value">{stats.completedToday}</span>
            <span className="ck-stat-card__label">Entregue hoje</span>
          </motion.div>
        </section>

        {/* Action Cards */}
        <section className="ck-actions">
          <motion.div 
            className="ck-action-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <div className="ck-action-card__gradient ck-action-card__gradient--blue" />
            <div className="ck-action-card__header">
              <div className="ck-action-card__icon ck-action-card__icon--blue">
                <LogIn />
              </div>
              <h2 className="ck-action-card__title">Check-in</h2>
            </div>
            <p className="ck-action-card__description">
              Registre a entrada de um veículo com dados do cliente e fotos
            </p>
            <button
              className="ck-action-card__btn ck-action-card__btn--primary"
              onClick={() => setIsCheckInModalOpen(true)}
            >
              Fazer Check-in
            </button>
          </motion.div>

          <motion.div 
            className="ck-action-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={selectedForCheckout ? { y: -4 } : {}}
          >
            <div className={`ck-action-card__gradient ${selectedForCheckout ? 'ck-action-card__gradient--green' : ''}`} />
            <div className="ck-action-card__header">
              <div className={`ck-action-card__icon ${selectedForCheckout ? 'ck-action-card__icon--green' : 'ck-action-card__icon--disabled'}`}>
                <LogOut />
              </div>
              <h2 className="ck-action-card__title">Check-out</h2>
            </div>
            <p className="ck-action-card__description">
              {selectedForCheckout 
                ? `Selecionado: ${selectedForCheckout.clientName}`
                : 'Selecione um registro abaixo para fazer check-out'
              }
            </p>
            <button
              className={`ck-action-card__btn ${selectedForCheckout ? 'ck-action-card__btn--success' : 'ck-action-card__btn--disabled'}`}
              onClick={handleCheckoutClick}
              disabled={!selectedForCheckout}
            >
              {selectedForCheckout ? 'Fazer Check-out' : 'Selecione um registro'}
            </button>
          </motion.div>
        </section>

        {/* Quick Actions - TORQ AI */}
        <section className="ck-quick-actions">
          <motion.button 
            className="ck-quick-action" 
            whileHover={{ y: -2 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // TODO: Integrar com OBD Scanner feature
              console.log('Scanner OBD clicked');
            }}
          >
            <div className="ck-quick-action__icon" style={{ background: 'linear-gradient(135deg, #0071e3 0%, #0077ed 100%)' }}>
              <Bluetooth />
            </div>
            <span className="ck-quick-action__label">Scanner OBD</span>
          </motion.button>

          <motion.button 
            className="ck-quick-action" 
            whileHover={{ y: -2 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // TODO: Integrar com Vehicle Health feature
              console.log('Saúde do Veículo clicked');
            }}
          >
            <div className="ck-quick-action__icon" style={{ background: 'linear-gradient(135deg, #34c759 0%, #30d158 100%)' }}>
              <Activity />
            </div>
            <span className="ck-quick-action__label">Saúde do Veículo</span>
          </motion.button>

          <motion.button 
            className="ck-quick-action" 
            whileHover={{ y: -2 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // TODO: Integrar com Damage Report feature
              console.log('Relatório de Danos clicked');
            }}
          >
            <div className="ck-quick-action__icon" style={{ background: 'linear-gradient(135deg, #ff3b30 0%, #ff453a 100%)' }}>
              <FileText />
            </div>
            <span className="ck-quick-action__label">Relatório de Danos</span>
          </motion.button>

          <motion.button 
            className="ck-quick-action" 
            whileHover={{ y: -2 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // TODO: Integrar com Vehicle History feature
              console.log('Histórico clicked');
            }}
          >
            <div className="ck-quick-action__icon" style={{ background: 'linear-gradient(135deg, #af52de 0%, #bf5af2 100%)' }}>
              <History />
            </div>
            <span className="ck-quick-action__label">Histórico</span>
          </motion.button>
        </section>

        {/* Records List */}
        <motion.section 
          className="ck-records"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="ck-records__header">
            <h3 className="ck-records__title">Registros Recentes</h3>
            <span className="ck-records__count">{filteredCheckins.length} registros</span>
          </div>

          {isLoading ? (
            <div className="ck-loading">
              <div className="ck-loading__spinner" />
            </div>
          ) : filteredCheckins.length === 0 ? (
            <div className="ck-empty">
              <Car className="ck-empty__icon" />
              <h4 className="ck-empty__title">Nenhum registro encontrado</h4>
              <p className="ck-empty__description">
                {searchTerm ? 'Tente buscar por outro termo' : 'Faça um check-in para começar'}
              </p>
            </div>
          ) : (
            <div className="ck-records__list">
              <AnimatePresence>
                {filteredCheckins.map((checkin, index) => {
                  const isSelected = selectedForCheckout?.firestoreId === checkin.firestoreId;
                  const statusConfig = getStatusConfig(checkin.status);
                  const vehicleType = getVehicleType(checkin);
                  const relativeTime = formatRelativeTime(checkin.createdAt || checkin.checkInDate);
                  
                  // Get effective brand (inferred from model if not provided)
                  const effectiveBrand = getEffectiveBrand(checkin.vehicleBrand, checkin.vehicleModel);
                  
                  return (
                    <motion.div
                      key={checkin.firestoreId || checkin.id}
                      className={`ck-record ${isSelected ? 'ck-record--selected' : ''}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.04, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      onClick={() => handleSelectForCheckout(checkin)}
                      layout
                    >
                      {/* Col 1: Checkbox */}
                      <div className="ck-record__checkbox">
                        <Check />
                      </div>
                      
                      {/* Col 2: Vehicle Avatar */}
                      <div className={`ck-record__avatar ck-record__avatar--${vehicleType}`}>
                        {vehicleType === 'motorcycle' ? <Bike /> : vehicleType === 'truck' ? <Truck /> : <Car />}
                      </div>
                      
                      {/* Col 3: Client Name */}
                      <span className="ck-record__client">
                        {checkin.clientName || 'Cliente não identificado'}
                      </span>
                      
                      {/* Col 4: Plate Badge */}
                      <span className="ck-record__plate">
                        {formatPlate(checkin.vehiclePlate)}
                      </span>
                      
                      {/* Col 5: Vehicle with Brand Logo */}
                      <div className="ck-record__vehicle-wrapper">
                        {getBrandLogoUrl(effectiveBrand, checkin.vehicleModel) ? (
                          <img 
                            src={getBrandLogoUrl(effectiveBrand, checkin.vehicleModel)} 
                            alt={effectiveBrand}
                            className="ck-record__brand-logo"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span 
                          className="ck-record__brand-fallback"
                          style={{ display: getBrandLogoUrl(effectiveBrand, checkin.vehicleModel) ? 'none' : 'flex' }}
                        >
                          {getBrandInitials(effectiveBrand, checkin.vehicleModel)}
                        </span>
                        <span className="ck-record__vehicle">
                          {effectiveBrand} {checkin.vehicleModel} {checkin.vehicleYear ? `• ${checkin.vehicleYear}` : ''}
                        </span>
                      </div>
                      
                      {/* Col 6: Date/Time */}
                      <div className="ck-record__meta">
                        {relativeTime && (
                          <span className="ck-record__time">
                            <Calendar size={13} />
                            {relativeTime}
                          </span>
                        )}
                      </div>
                      
                      {/* Col 7: Status Badge */}
                      <span className={`ck-record__status ${statusConfig.class}`}>
                        <span className="ck-record__status-dot" />
                        {statusConfig.label}
                      </span>
                      
                      {/* Col 8: Action Buttons */}
                      <div className="ck-record__actions">
                        <button
                          className="ck-record__action-btn ck-record__action-btn--view"
                          onClick={(e) => { e.stopPropagation(); handleViewDetails(checkin); }}
                          title="Ver detalhes"
                        >
                          <Eye />
                        </button>
                        <button
                          className="ck-record__action-btn ck-record__action-btn--edit"
                          onClick={(e) => { e.stopPropagation(); handleEdit(checkin); }}
                          title="Editar"
                        >
                          <Edit3 />
                        </button>
                        <button
                          className="ck-record__action-btn ck-record__action-btn--budget"
                          onClick={(e) => { e.stopPropagation(); handleCreateBudget(checkin); }}
                          title="Criar orçamento"
                        >
                          <FileText />
                        </button>
                        <button
                          className="ck-record__action-btn ck-record__action-btn--delete"
                          onClick={(e) => { e.stopPropagation(); handleDelete(checkin); }}
                          title="Excluir"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </div>

      {/* Modais - só carregam quando abertos */}
      {isCheckInModalOpen && (
        <Suspense fallback={null}>
          <ModalCheckin
            isOpen={isCheckInModalOpen}
            onClose={() => setIsCheckInModalOpen(false)}
            onSuccess={handleCheckInSuccess}
          />
        </Suspense>
      )}

      {isCheckOutModalOpen && (
        <Suspense fallback={null}>
          <ModalCheckout
            isOpen={isCheckOutModalOpen}
            onClose={() => {
              setIsCheckOutModalOpen(false);
              setSelectedCheckin(null);
              setSelectedForCheckout(null);
            }}
            onSuccess={() => {
              handleCheckOutSuccess();
              setSelectedForCheckout(null);
            }}
            checkinData={selectedCheckin}
          />
        </Suspense>
      )}

      {isEditModalOpen && (
        <Suspense fallback={null}>
          <ModalEditarCheckin
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setCheckinToEdit(null);
            }}
            checkinData={checkinToEdit}
            onSave={(updatedCheckin) => {
              console.log('Checkin atualizado:', updatedCheckin);
              fetchCheckins();
            }}
          />
        </Suspense>
      )}

      {/* Modal de Orçamento */}
      {isBudgetModalOpen && (
        <Suspense fallback={null}>
          <BudgetModal
            isOpen={isBudgetModalOpen}
            onClose={() => {
              setIsBudgetModalOpen(false);
              setCheckinForBudget(null);
            }}
            budget={checkinForBudget ? {
              clientId: checkinForBudget.clientId,
              clientName: checkinForBudget.clientName,
              clientPhone: checkinForBudget.clientPhone,
              clientEmail: checkinForBudget.clientEmail,
              vehicleId: checkinForBudget.vehicleId,
              vehiclePlate: checkinForBudget.vehiclePlate,
              vehicleBrand: checkinForBudget.vehicleBrand,
              vehicleModel: checkinForBudget.vehicleModel,
              vehicleYear: checkinForBudget.vehicleYear,
              vehicleColor: checkinForBudget.vehicleColor,
              notes: `Orçamento criado a partir do check-in #${checkinForBudget.id}`,
              items: []
            } : null}
          />
        </Suspense>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-md w-full p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Excluir Registro
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Tem certeza que deseja excluir este registro?
                  </p>
                  {checkinToDelete && (
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                      {checkinToDelete.vehiclePlate} - {checkinToDelete.clientName}
                    </p>
                  )}
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCheckinToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (checkinToDelete) {
                      const result = await deleteCheckin(checkinToDelete.firestoreId);
                      if (result.success) {
                        toast.success('Registro excluído com sucesso');
                      } else {
                        toast.error('Erro ao excluir registro');
                      }
                    }
                    setShowDeleteModal(false);
                    setCheckinToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-lg shadow-red-500/30"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Detalhes Premium */}
      <AnimatePresence mode="wait">
        {showDetailsModal && detailsCheckinId && (
          <Suspense fallback={null}>
            <CheckinDetailsModal
              key="checkin-details"
              checkinId={detailsCheckinId}
              onClose={() => {
                setShowDetailsModal(false);
                setDetailsCheckinId(null);
              }}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckInPage;
