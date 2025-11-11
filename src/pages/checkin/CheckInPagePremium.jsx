import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, LogOut } from 'lucide-react';
import ModalCheckin from './componentes/ModalCheckin';
import ModalCheckout from './componentes/ModalCheckout';
import RecentSectionThemeAware from '../../components/recent/RecentSectionThemeAware';
import RealtimeDashboard from './components/dashboard/RealtimeDashboard';
import VehicleTimeline from './components/timeline/VehicleTimeline';
import VehicleSummary from './components/summary/VehicleSummary';
import { useCheckinStore } from '../../store';
import './estilos/checkin.css';

const CheckInPagePremium = () => {
  const navigate = useNavigate();
  const { checkins, fetchCheckins, isLoading } = useCheckinStore();
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [selectedForCheckout, setSelectedForCheckout] = useState(null);
  const [vehicleDataForSummary, setVehicleDataForSummary] = useState(null);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  const handleCheckInSuccess = async (checkinData) => {
    try {
      await fetchCheckins();
      // Se tiver dados do veículo, mostrar resumo
      if (checkinData) {
        setVehicleDataForSummary(checkinData);
      }
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
    }
  };

  const handleCheckOutSuccess = async () => {
    try {
      await fetchCheckins();
      setSelectedForCheckout(null);
      setVehicleDataForSummary(null);
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
    }
  };

  const handleCheckinClick = (checkin) => {
    setSelectedCheckin(checkin);
    setVehicleDataForSummary(checkin);
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

  const convertCheckinToRecordItem = (checkin) => {
    const getVehicleType = () => {
      if (checkin.vehicleType) return checkin.vehicleType;
      const model = (checkin.vehicleModel || '').toLowerCase();
      if (model.includes('moto')) return 'motorcycle';
      if (model.includes('truck')) return 'truck';
      if (model.includes('van')) return 'van';
      return 'car';
    };

    return {
      id: checkin.firestoreId || checkin.id,
      type: getVehicleType(),
      status: checkin.status || 'in_progress',
      primaryText: checkin.clientName || 'Cliente não identificado',
      secondaryText: `${checkin.vehicleBrand || ''} ${checkin.vehicleModel || ''}`.trim(),
      plate: checkin.vehiclePlate || '---',
      model: checkin.vehicleModel || 'Modelo não especificado',
      date: new Date(checkin.createdAt || Date.now()),
      tags: checkin.services ? [checkin.services] : [],
      metadata: {
        clientId: checkin.clientId,
        vehicleId: checkin.vehicleId,
        serviceType: checkin.services,
        notes: checkin.observations,
      },
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 transition-colors duration-500 w-full">
      {/* Fundo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
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
          className="text-center space-y-4"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 dark:from-white dark:via-gray-50 dark:to-white">
            Check-in Premium
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-semibold max-w-2xl mx-auto">
            Gerencie entradas e saídas com inteligência e elegância
          </p>
        </motion.div>

        {/* Dashboard Operacional em Tempo Real */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <RealtimeDashboard checkins={checkins} />
        </motion.div>

        {/* Timeline do Check-in Selecionado */}
        {selectedCheckin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VehicleTimeline checkinId={selectedCheckin.firestoreId || selectedCheckin.id} />
          </motion.div>
        )}

        {/* Resumo do Veículo */}
        {vehicleDataForSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VehicleSummary
              vehicleData={vehicleDataForSummary}
              plate={vehicleDataForSummary.vehiclePlate}
              empresaId={vehicleDataForSummary.empresaId}
            />
          </motion.div>
        )}

        {/* Cards de Ação */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
                  Registre a entrada de veículos com agilidade e precisão
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCheckInModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/30 transition-all duration-300"
                >
                  Fazer Check-in
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
                    : 'Finalize o atendimento selecionando um registro ativo abaixo'
                  }
                </p>

                <motion.button
                  whileHover={selectedForCheckout ? { scale: 1.05 } : {}}
                  whileTap={selectedForCheckout ? { scale: 0.98 } : {}}
                  onClick={() => {
                    if (selectedForCheckout) {
                      setSelectedCheckin(selectedForCheckout);
                      setIsCheckOutModalOpen(true);
                    }
                  }}
                  disabled={!selectedForCheckout}
                  className={`w-full px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 ${
                    selectedForCheckout
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/30 cursor-pointer'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedForCheckout ? 'Fazer Check-out' : 'Selecione um registro'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Lista de Registros */}
        <RecentSectionThemeAware
          items={checkins.slice(0, 10).map(convertCheckinToRecordItem)}
          isLoading={isLoading}
          onItemClick={(item) => {
            const checkin = checkins.find(c => (c.firestoreId || c.id) === item.id);
            if (checkin) handleCheckinClick(checkin);
          }}
          onItemSelect={(id) => {
            const checkin = checkins.find(c => (c.firestoreId || c.id) === id);
            if (checkin) handleSelectForCheckout(checkin);
          }}
          selectedItems={new Set(selectedForCheckout ? [selectedForCheckout.firestoreId || selectedForCheckout.id] : [])}
          title="Registros Recentes"
        />
      </div>

      {/* Modais */}
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
    </div>
  );
};

export default CheckInPagePremium;
