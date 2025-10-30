import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, AlertCircle, Sparkles } from 'lucide-react';
import ModalCheckin from './checkin/componentes/ModalCheckin';
import ModalCheckout from './checkin/componentes/ModalCheckout';
import RegistroCard from './checkin/componentes/RegistroCard';
import { useCheckinStore } from '../store';

const CheckInPage = () => {
  const navigate = useNavigate();
  const { checkins, fetchCheckins, isLoading } = useCheckinStore();
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [selectedForCheckout, setSelectedForCheckout] = useState(null);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

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

  const handleCheckinClick = (checkin) => {
    navigate(`/checkin/${checkin.firestoreId}`);
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

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 transition-colors duration-500">
      {/* Fundo animado sutil */}
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center space-y-4 relative"
        >
          {/* Linha de destaque animada */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent blur-sm"
          />
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white"
          >
            Check-in / Check-out
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto"
          >
            Gerencie entradas e saídas com elegância e eficiência
          </motion.p>
        </motion.div>

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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] dark:shadow-2xl border border-gray-300/50 dark:border-gray-700/30 overflow-hidden">
              {/* Gradiente de fundo */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent" />
              
              <div className="relative space-y-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
                  >
                    <LogIn className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Check-in
                  </h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
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
            <div className={`absolute inset-0 rounded-[2rem] blur-xl transition-all duration-500 ${
              selectedForCheckout 
                ? 'bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 opacity-100' 
                : 'bg-gradient-to-br from-gray-400/20 to-gray-500/20 opacity-0 group-hover:opacity-100'
            }`} />
            <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] dark:shadow-2xl border border-gray-300/50 dark:border-gray-700/30 overflow-hidden">
              {/* Gradiente de fundo */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-700/10 dark:to-transparent" />
              
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
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Check-out
                  </h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {selectedForCheckout 
                    ? `Selecionado: ${selectedForCheckout.clientName}`
                    : 'Finalize o atendimento selecionando um registro ativo abaixo'
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
                  {selectedForCheckout ? 'Fazer Check-out' : 'Selecione um registro'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Lista de Registros */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative"
        >
          {/* Container branco elegante estilo Apple - com sombra profunda */}
          <div className="bg-white dark:bg-white rounded-[2rem] p-8 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-gray-300/50 dark:border-gray-300/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
              Registros Recentes
            </h2>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {[...Array(3)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </motion.div>
              ) : checkins.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-16 space-y-4"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertCircle className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" />
                  </motion.div>
                  <p className="text-xl text-gray-500 dark:text-gray-400 font-light">
                    Nenhum registro ainda. Comece um novo check-in.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {checkins.slice(0, 10).map((checkin, index) => (
                    <motion.div
                      key={checkin.firestoreId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <RegistroCard
                        checkin={checkin}
                        onViewDetails={handleCheckinClick}
                        onSelect={handleSelectForCheckout}
                        isSelected={selectedForCheckout?.firestoreId === checkin.firestoreId}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
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
        onSuccess={() => {
          handleCheckOutSuccess();
          setSelectedForCheckout(null);
        }}
        checkinData={selectedCheckin}
      />
    </div>
  );
};

export default CheckInPage;
