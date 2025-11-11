import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, Sparkles } from 'lucide-react';

// Modais existentes
import ModalCheckin from './checkin/componentes/ModalCheckin';
import ModalCheckout from './checkin/componentes/ModalCheckout';
import ModalEditarCheckin from './checkin/componentes/ModalEditarCheckin';
import BudgetModal from './budgets/components/BudgetModal';
import RecentSectionThemeAware from '../components/recent/RecentSectionThemeAware';

// Componentes Premium
import RealtimeDashboard from './checkin/components/dashboard/RealtimeDashboard';
import VehicleTimeline from './checkin/components/timeline/VehicleTimeline';
import VehicleSummary from './checkin/components/summary/VehicleSummary';
import VisitHistory from './checkin/components/history/VisitHistory';
import ServiceSuggestions from './checkin/components/suggestions/ServiceSuggestions';
import PinValidation from './checkin/components/pin/PinValidation';
import PinGenerator from './checkin/components/pin/PinGenerator';
import PhotoViewer3D from './checkin/components/photos/PhotoViewer3D';
import CheckinDetailsModal from './checkin/components/details/CheckinDetailsModal';

// Hooks e serviços
import { useCheckinStore } from '../store';
import { useVehicleHistory } from './checkin/hooks/useVehicleHistory';
import { generatePin, savePinToCheckin } from './checkin/services/pinService';

import './checkin/estilos/checkin.css';

const CheckInPagePremium = () => {
  const navigate = useNavigate();
  const { checkins, fetchCheckins, isLoading } = useCheckinStore();
  
  // Estados dos modais existentes
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [selectedForCheckout, setSelectedForCheckout] = useState(null);
  const [checkinToEdit, setCheckinToEdit] = useState(null);
  const [checkinForBudget, setCheckinForBudget] = useState(null);

  // Estados dos componentes premium
  const [showVehicleSummary, setShowVehicleSummary] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPinGenerator, setShowPinGenerator] = useState(false);
  const [showPinValidation, setShowPinValidation] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsCheckinId, setDetailsCheckinId] = useState(null);
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [comparisonPhotos, setComparisonPhotos] = useState(null);
  const [generatedPin, setGeneratedPin] = useState('');
  const [currentVehicleData, setCurrentVehicleData] = useState(null);
  const [currentPlate, setCurrentPlate] = useState('');
  const [currentCheckinId, setCurrentCheckinId] = useState(null);

  // Hook de histórico do veículo
  const { history: vehicleHistory, loading: loadingHistory } = useVehicleHistory(currentPlate);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  const handleCheckInSuccess = async (checkinData) => {
    try {
      await fetchCheckins();
      
      // Se temos dados do check-in, gerar PIN e mostrar sugestões
      if (checkinData && checkinData.id) {
        setCurrentCheckinId(checkinData.id);
        setCurrentVehicleData(checkinData);
        setCurrentPlate(checkinData.vehiclePlate);
        
        // Gerar PIN
        const pin = generatePin();
        await savePinToCheckin(checkinData.id, pin);
        setGeneratedPin(pin);
        setShowPinGenerator(true);
        
        // Mostrar sugestões após 2 segundos
        setTimeout(() => {
          setShowSuggestions(true);
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
    }
  };

  const handleCheckOutSuccess = async () => {
    try {
      await fetchCheckins();
      setSelectedForCheckout(null);
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
    }
  };

  const handleCheckoutClick = () => {
    if (selectedForCheckout) {
      setSelectedCheckin(selectedForCheckout);
      setCurrentCheckinId(selectedForCheckout.firestoreId || selectedForCheckout.id);
      // Mostrar validação de PIN
      setShowPinValidation(true);
    }
  };

  const handlePinValidationSuccess = () => {
    setShowPinValidation(false);
    // Abrir modal de checkout
    setIsCheckOutModalOpen(true);
  };

  const handleCheckinClick = (checkin) => {
    navigate(`/checkin/${checkin.firestoreId}`);
  };

  const handleSelectForCheckout = (checkin) => {
    if (selectedForCheckout?.firestoreId === checkin.firestoreId) {
      setSelectedForCheckout(null);
    } else {
      if (checkin.status !== 'completed') {
        setSelectedForCheckout(checkin);
      }
    }
  };

  const handleAcceptSuggestion = (service) => {
    console.log('Sugestão aceita:', service);
    // TODO: Adicionar ao orçamento
  };

  const handleViewPhotos = (photos, comparison = null) => {
    setCurrentPhotos(photos);
    setComparisonPhotos(comparison);
    setShowPhotoViewer(true);
  };

  // Converter checkin para formato RecentItem
  const convertCheckinToRecordItem = (checkin) => {
    const getVehicleType = () => {
      if (checkin.vehicleType) return checkin.vehicleType;
      const model = (checkin.vehicleModel || '').toLowerCase();
      const brand = (checkin.vehicleBrand || '').toLowerCase();
      
      if (model.includes('moto') || brand.includes('yamaha') || brand.includes('honda')) return 'motorcycle';
      if (model.includes('truck') || model.includes('caminhão')) return 'truck';
      if (model.includes('van') || model.includes('furgão')) return 'van';
      return 'car';
    };

    const getStatus = () => {
      switch (checkin.status) {
        case 'completed': return 'completed';
        case 'pending': return 'pending';
        case 'cancelled': return 'cancelled';
        default: return 'in_progress';
      }
    };

    // CRÍTICO: Usar firestoreId como ID principal, pois é o ID real do Firebase
    // O checkin.id é apenas um ID local gerado (CHK-xxx)
    const itemId = checkin.firestoreId || checkin.id || `checkin-${Date.now()}-${Math.random()}`;
    
    console.log('convertCheckinToRecordItem:', {
      'checkin.id': checkin.id,
      'checkin.firestoreId': checkin.firestoreId,
      'itemId usado': itemId
    });

    return {
      id: itemId,
      type: getVehicleType(),
      status: getStatus(),
      primaryText: checkin.clientName || 'Cliente não identificado',
      secondaryText: `${checkin.vehicleBrand || ''} ${checkin.vehicleModel || 'Veículo não especificado'}`.trim(),
      plate: checkin.vehiclePlate || '---',
      model: checkin.vehicleModel || 'Modelo não especificado',
      date: new Date(checkin.createdAt || Date.now()),
      tags: checkin.services ? [checkin.services] : [],
      metadata: {
        clientId: checkin.clientId,
        vehicleId: checkin.vehicleId,
        serviceType: checkin.services,
        notes: checkin.observations,
        hasBudget: false,
        entryPhotos: checkin.entryPhotos || [],
        exitPhotos: checkin.exitPhotos || [],
        // Timeline data
        currentStage: checkin.currentStage || 'checkin',
        stages: checkin.stages || {},
      },
    };
  };

  const handleItemAction = (action) => {
    const checkin = checkins.find(c => (c.firestoreId || c.id) === action.itemId);
    if (!checkin) return;

    console.log('Debug IDs:', {
      'checkin.id': checkin.id,
      'checkin.firestoreId': checkin.firestoreId,
      'action.itemId': action.itemId,
      'Usando para modal': checkin.firestoreId || checkin.id
    });

    switch (action.type) {
      case 'open':
        // Abrir modal de detalhes premium
        // CORREÇÃO: Usar action.itemId diretamente, pois ele já é o firestoreId correto
        const correctId = checkin.firestoreId || action.itemId;
        console.log('Abrindo modal com ID:', correctId);
        setDetailsCheckinId(correctId);
        setShowDetailsModal(true);
        break;
      case 'edit':
        setCheckinToEdit(checkin);
        setIsEditModalOpen(true);
        break;
      case 'createBudget':
        setCheckinForBudget(checkin);
        setIsBudgetModalOpen(true);
        break;
      case 'complete':
        handleSelectForCheckout(checkin);
        break;
      case 'viewPhotos':
        if (checkin.entryPhotos && checkin.entryPhotos.length > 0) {
          handleViewPhotos(checkin.entryPhotos, checkin.exitPhotos);
        }
        break;
      case 'viewTimeline':
        setCurrentCheckinId(checkin.firestoreId || checkin.id);
        break;
      case 'delete':
        if (window.confirm('Tem certeza que deseja excluir este registro?')) {
          console.log('Delete checkin:', checkin);
        }
        break;
      default:
        break;
    }
  };

  const empresaId = sessionStorage.getItem('empresaId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 transition-colors duration-500 w-full">
      {/* Fundo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(242, 140, 29, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 122, 255, 0.1) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      <div className="relative px-6 sm:px-8 lg:px-12 py-12 space-y-12 w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 relative"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-orange-500/70 to-transparent"
          />

          <div className="flex items-center justify-center gap-3">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 dark:from-white dark:via-gray-50 dark:to-white"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                letterSpacing: '-0.04em'
              }}
            >
              Check-in Premium
            </motion.h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-12 h-12 text-orange-500" />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-semibold max-w-2xl mx-auto"
          >
            Experiência premium com inteligência artificial e design Apple-like
          </motion.p>
        </motion.div>

        {/* Dashboard Operacional em Tempo Real */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <RealtimeDashboard empresaId={empresaId} />
        </motion.div>

        {/* Timeline do Check-in Atual */}
        {currentCheckinId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VehicleTimeline checkinId={currentCheckinId} />
          </motion.div>
        )}

        {/* Cards de Ação */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          {/* Card Check-in */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative"
          >
            <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 rounded-[2rem] p-8 shadow-[0_6px_18px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] dark:shadow-2xl border-[3px] border-gray-700 dark:border-gray-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 to-transparent dark:from-blue-900/10 dark:to-transparent" />
              <div className="relative space-y-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
                  >
                    <LogIn className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white">
                    Check-in
                  </h2>
                </div>

                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-bold">
                  Registre a entrada com PIN automático e sugestões inteligentes
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCheckInModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/30 transition-all duration-300"
                >
                  Fazer Check-in Premium
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Card Check-out */}
          <motion.div
            whileHover={selectedForCheckout ? { scale: 1.02, y: -4 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative"
          >
            <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 rounded-[2rem] p-8 shadow-[0_6px_18px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] dark:shadow-2xl border-[3px] border-gray-700 dark:border-gray-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/70 to-transparent dark:from-gray-700/10 dark:to-transparent" />
              <div className="relative space-y-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: -360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                      selectedForCheckout
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30'
                        : 'bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 shadow-gray-500/30'
                    }`}
                  >
                    <LogOut className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white">
                    Check-out
                  </h2>
                </div>

                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-bold">
                  {selectedForCheckout
                    ? `Selecionado: ${selectedForCheckout.clientName}`
                    : 'Validação com PIN e visualização 3D das fotos'
                  }
                </p>

                <motion.button
                  whileHover={selectedForCheckout ? { scale: 1.05 } : {}}
                  whileTap={selectedForCheckout ? { scale: 0.98 } : {}}
                  onClick={handleCheckoutClick}
                  disabled={!selectedForCheckout}
                  className={`w-full px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 ${
                    selectedForCheckout
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/30 cursor-pointer'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedForCheckout ? 'Validar PIN e Check-out' : 'Selecione um registro'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Resumo do Veículo e Histórico */}
        {showVehicleSummary && currentVehicleData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <VehicleSummary
              vehicleData={currentVehicleData}
              plate={currentPlate}
            />
            
            {vehicleHistory && vehicleHistory.length > 0 && (
              <VisitHistory
                history={vehicleHistory}
                loading={loadingHistory}
              />
            )}
          </motion.div>
        )}

        {/* Lista de Registros */}
        <RecentSectionThemeAware
          items={checkins.slice(0, 10).map(convertCheckinToRecordItem)}
          isLoading={isLoading}
          onItemClick={(item) => {
            const checkin = checkins.find(c => (c.firestoreId || c.id) === item.id);
            if (checkin) handleCheckinClick(checkin);
          }}
          onItemAction={handleItemAction}
          onItemSelect={(id) => {
            const checkin = checkins.find(c => (c.firestoreId || c.id) === id);
            if (checkin) handleSelectForCheckout(checkin);
          }}
          selectedItems={new Set(selectedForCheckout ? [selectedForCheckout.firestoreId || selectedForCheckout.id] : [])}
          title="Registros Recentes"
        />
      </div>

      {/* Modais Existentes */}
      <ModalCheckin
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onSuccess={handleCheckInSuccess}
      />

      <ModalCheckout
        isOpen={isCheckOutModalOpen}
        onClose={() => {
          setIsCheckOutModalOpen(false);
          setSelectedCheckin(null);
          setSelectedForCheckout(null);
        }}
        onSuccess={handleCheckOutSuccess}
        checkinData={selectedCheckin}
      />

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

      {/* Modais Premium */}
      <AnimatePresence mode="wait">
        {showDetailsModal && detailsCheckinId && (
          <CheckinDetailsModal
            key="checkin-details"
            checkinId={detailsCheckinId}
            onClose={() => {
              setShowDetailsModal(false);
              setDetailsCheckinId(null);
            }}
          />
        )}

        {showPinGenerator && (
          <PinGenerator
            key="pin-generator"
            pin={generatedPin}
            checkinId={currentCheckinId}
            vehicleInfo={currentVehicleData}
            onClose={() => setShowPinGenerator(false)}
          />
        )}

        {showPinValidation && (
          <PinValidation
            key="pin-validation"
            checkinId={currentCheckinId}
            onSuccess={handlePinValidationSuccess}
            onClose={() => setShowPinValidation(false)}
          />
        )}

        {showSuggestions && (
          <ServiceSuggestions
            key="service-suggestions"
            vehiclePlate={currentPlate}
            empresaId={empresaId}
            checkinId={currentCheckinId}
            onClose={() => setShowSuggestions(false)}
            onAccept={handleAcceptSuggestion}
          />
        )}

        {showPhotoViewer && (
          <PhotoViewer3D
            key="photo-viewer"
            photos={currentPhotos}
            comparisonPhotos={comparisonPhotos}
            onClose={() => setShowPhotoViewer(false)}
            title="Fotos do Veículo"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckInPagePremium;
