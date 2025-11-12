import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Car, 
  Calendar, 
  Clock, 
  FileText, 
  Image as ImageIcon,
  Phone,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import GlassCard from '../ui/GlassCard';
import VehicleTimeline from '../timeline/VehicleTimeline';
import VehicleSummary from '../summary/VehicleSummary';
import VisitHistory from '../history/VisitHistory';
import PhotoViewer3D from '../photos/PhotoViewer3D';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useVehicleHistory } from '../../hooks/useVehicleHistory';
import { formatDateTime } from '../../utils/dateHelpers';
import { formatPhone } from '../../../../utils/formatters';
import './CheckinDetailsModal.css';

const CheckinDetailsModal = ({ checkinId, onClose }) => {
  const [checkinData, setCheckinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, timeline, history, photos
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [photoType, setPhotoType] = useState('entry');

  const { history: vehicleHistory, loading: loadingHistory } = useVehicleHistory(
    checkinData?.vehiclePlate
  );

  useEffect(() => {
    if (checkinId) {
      loadCheckinData();
    }
  }, [checkinId]);

  const loadCheckinData = async () => {
    setLoading(true);
    console.log('CheckinDetailsModal - Buscando checkin com ID:', checkinId);
    
    try {
      const docRef = doc(db, 'checkins', checkinId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        console.log('CheckinDetailsModal - Dados encontrados:', {
          id: data.id,
          clientName: data.clientName,
          currentStage: data.currentStage,
          hasStages: !!data.stages
        });
        setCheckinData(data);
      } else {
        console.error('CheckinDetailsModal - Documento não encontrado:', checkinId);
      }
    } catch (error) {
      console.error('CheckinDetailsModal - Erro ao buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPhotos = (photos, type = 'entry') => {
    setCurrentPhotos(photos);
    setPhotoType(type);
    setShowPhotoViewer(true);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Concluído',
          color: 'bg-green-500',
          textColor: 'text-green-600 dark:text-green-400'
        };
      case 'in_progress':
        return {
          label: 'Em Andamento',
          color: 'bg-orange-500',
          textColor: 'text-orange-600 dark:text-orange-400'
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          color: 'bg-red-500',
          textColor: 'text-red-600 dark:text-red-400'
        };
      default:
        return {
          label: 'Pendente',
          color: 'bg-gray-500',
          textColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <GlassCard className="p-8" animate={false}>
          <LoadingSpinner text="Carregando detalhes..." />
        </GlassCard>
      </motion.div>
    );
  }

  if (!checkinData) {
    return null;
  }

  const statusConfig = getStatusConfig(checkinData.status);
  const vehicleData = {
    brand: checkinData.vehicleBrand,
    model: checkinData.vehicleModel,
    year: checkinData.vehicleYear,
    color: checkinData.vehicleColor,
    plate: checkinData.vehiclePlate
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'history', label: 'Histórico', icon: Calendar },
    { id: 'photos', label: 'Fotos', icon: ImageIcon }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <div className="min-h-screen flex items-start justify-center p-2 sm:p-4 md:p-6 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ 
              duration: 0.15, 
              ease: [0.16, 1, 0.3, 1]
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-5xl lg:max-w-6xl xl:max-w-7xl"
          >
          <GlassCard className="overflow-hidden" animate={false}>
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Detalhes do Check-in
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {checkinData.id} • {formatDateTime(checkinData.createdAt)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors duration-150 ${
                        isActive
                          ? 'text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      whileHover={{ scale: isActive ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/30"
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 35,
                            mass: 0.8
                          }}
                        />
                      )}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 max-h-[calc(90vh-200px)] overflow-y-auto scroll-smooth">
              <AnimatePresence mode="wait" initial={false}>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ 
                      duration: 0.15,
                      ease: "easeOut"
                    }}
                    className="space-y-5"
                  >
                    {/* Client Info */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        Informações do Cliente
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 shadow-sm">
                          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">Nome</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">
                            {checkinData.clientName || 'Não informado'}
                          </p>
                        </div>
                        {checkinData.clientPhone && (
                          <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 shadow-sm">
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              Telefone
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white text-lg">
                              {formatPhone(checkinData.clientPhone)}
                            </p>
                          </div>
                        )}
                        {checkinData.clientEmail && (
                          <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 shadow-sm md:col-span-2">
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">Email</p>
                            <p className="font-semibold text-gray-900 dark:text-white text-lg">
                              {checkinData.clientEmail}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Info with Summary */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-900/30">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                          <Car className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        Informações do Veículo
                      </h3>
                      <VehicleSummary
                        vehicleData={vehicleData}
                        plate={checkinData.vehiclePlate}
                      />
                    </div>

                    {/* Services */}
                    {checkinData.services && checkinData.services.length > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/30">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                            <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          Serviços Solicitados
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {checkinData.services.map((service, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-purple-100 dark:border-purple-900/30 text-sm font-semibold text-purple-700 dark:text-purple-300 shadow-sm"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {checkinData.notes && (
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-gray-500/10 dark:bg-gray-500/20">
                            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          Observações
                        </h3>
                        <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {checkinData.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Photos Preview */}
                    {(checkinData.entryPhotos?.length > 0 || checkinData.exitPhotos?.length > 0) && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-6 border border-green-100 dark:border-green-900/30">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20">
                            <ImageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          Fotos do Veículo
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {checkinData.entryPhotos?.length > 0 && (
                            <button
                              onClick={() => handleViewPhotos(checkinData.entryPhotos, 'entry')}
                              className="relative group rounded-2xl overflow-hidden aspect-video bg-gray-200 dark:bg-gray-700 hover:ring-2 hover:ring-orange-500 transition-all shadow-lg hover:shadow-xl"
                            >
                              <img
                                src={checkinData.entryPhotos[0]}
                                alt="Foto de entrada"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                <div className="text-white text-center">
                                  <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                                  <p className="font-semibold text-sm">Fotos de Entrada</p>
                                  <p className="text-xs opacity-90">{checkinData.entryPhotos.length} foto(s)</p>
                                </div>
                              </div>
                            </button>
                          )}
                          {checkinData.exitPhotos?.length > 0 && (
                            <button
                              onClick={() => handleViewPhotos(checkinData.exitPhotos, 'exit')}
                              className="relative group rounded-2xl overflow-hidden aspect-video bg-gray-200 dark:bg-gray-700 hover:ring-2 hover:ring-green-500 transition-all shadow-lg hover:shadow-xl"
                            >
                              <img
                                src={checkinData.exitPhotos[0]}
                                alt="Foto de saída"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                <div className="text-white text-center">
                                  <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                                  <p className="font-semibold text-sm">Fotos de Saída</p>
                                  <p className="text-xs opacity-90">{checkinData.exitPhotos.length} foto(s)</p>
                                </div>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ 
                      duration: 0.15,
                      ease: "easeOut"
                    }}
                  >
                    <VehicleTimeline checkinId={checkinId} />
                  </motion.div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ 
                      duration: 0.15,
                      ease: "easeOut"
                    }}
                  >
                    <VisitHistory
                      history={vehicleHistory}
                      loading={loadingHistory}
                    />
                  </motion.div>
                )}

                {/* Photos Tab */}
                {activeTab === 'photos' && (
                  <motion.div
                    key="photos"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ 
                      duration: 0.15,
                      ease: "easeOut"
                    }}
                    className="space-y-6"
                  >
                    {/* Entry Photos */}
                    {checkinData.entryPhotos?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Fotos de Entrada
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {checkinData.entryPhotos.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => handleViewPhotos(checkinData.entryPhotos, 'entry')}
                              className="relative group rounded-xl overflow-hidden aspect-square bg-gray-200 dark:bg-gray-700 hover:ring-2 hover:ring-orange-500 transition-all"
                            >
                              <img
                                src={photo}
                                alt={`Entrada ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exit Photos */}
                    {checkinData.exitPhotos?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Fotos de Saída
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {checkinData.exitPhotos.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => handleViewPhotos(checkinData.exitPhotos, 'exit')}
                              className="relative group rounded-xl overflow-hidden aspect-square bg-gray-200 dark:bg-gray-700 hover:ring-2 hover:ring-green-500 transition-all"
                            >
                              <img
                                src={photo}
                                alt={`Saída ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comparison Button */}
                    {checkinData.entryPhotos?.length > 0 && checkinData.exitPhotos?.length > 0 && (
                      <button
                        onClick={() => {
                          setCurrentPhotos(checkinData.entryPhotos);
                          setShowPhotoViewer(true);
                        }}
                        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                      >
                        <ImageIcon className="w-5 h-5" />
                        Comparar Entrada e Saída
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}

                    {!checkinData.entryPhotos?.length && !checkinData.exitPhotos?.length && (
                      <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Nenhuma foto disponível
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Photo Viewer 3D */}
      <AnimatePresence>
        {showPhotoViewer && (
          <PhotoViewer3D
            key="photo-viewer-details"
            photos={currentPhotos}
            comparisonPhotos={photoType === 'entry' && checkinData.exitPhotos?.length > 0 ? checkinData.exitPhotos : null}
            onClose={() => setShowPhotoViewer(false)}
            title={photoType === 'entry' ? 'Fotos de Entrada' : 'Fotos de Saída'}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CheckinDetailsModal;
