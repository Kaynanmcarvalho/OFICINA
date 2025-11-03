/**
 * VehicleGalleryModal - Modal premium para exibir galeria de veículos do cliente
 * Design elegante com cards interativos e animações suaves
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Car, 
  Bike, 
  Truck, 
  Calendar, 
  Palette, 
  Hash, 
  Fuel,
  Gauge,
  MapPin,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Info
} from 'lucide-react';
import VehicleThumbnail from './VehicleThumbnail';

const VehicleGalleryModal = ({ isOpen, onClose, client, vehicles = [] }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset quando modal abre
  useEffect(() => {
    if (isOpen && vehicles.length > 0) {
      setSelectedVehicle(vehicles[0]);
      setCurrentIndex(0);
    }
  }, [isOpen, vehicles]);

  if (!isOpen || !vehicles || vehicles.length === 0) return null;

  // Navegação entre veículos
  const nextVehicle = () => {
    const nextIndex = (currentIndex + 1) % vehicles.length;
    setCurrentIndex(nextIndex);
    setSelectedVehicle(vehicles[nextIndex]);
  };

  const prevVehicle = () => {
    const prevIndex = currentIndex === 0 ? vehicles.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedVehicle(vehicles[prevIndex]);
  };

  // Ícone por tipo de veículo
  const getVehicleIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'moto':
      case 'motocicleta':
        return Bike;
      case 'caminhao':
      case 'caminhão':
      case 'truck':
        return Truck;
      default:
        return Car;
    }
  };

  // Cor do tipo de veículo
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'moto':
      case 'motocicleta':
        return 'from-orange-500 to-red-500';
      case 'caminhao':
      case 'caminhão':
      case 'truck':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  // Formatação de dados
  const formatVehicleInfo = (vehicle) => {
    if (!vehicle) return [];
    
    const info = [];
    if (vehicle.year) info.push({ icon: Calendar, label: 'Ano', value: vehicle.year });
    if (vehicle.color) info.push({ icon: Palette, label: 'Cor', value: vehicle.color });
    if (vehicle.plate) info.push({ icon: Hash, label: 'Placa', value: vehicle.plate });
    return info;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl dark:shadow-black/50 border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            {/* Header Premium */}
            <div className="relative overflow-hidden">
              {/* Background gradient dinâmico */}
              <div className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(selectedVehicle?.type)} opacity-10`} />
              
              <div className="relative flex items-center justify-between px-8 py-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getTypeColor(selectedVehicle?.type)} flex items-center justify-center shadow-lg`}>
                    {(() => {
                      const IconComponent = getVehicleIcon(selectedVehicle?.type);
                      return <IconComponent className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      Veículos de {client?.name}
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      {vehicles.length} {vehicles.length === 1 ? 'veículo cadastrado' : 'veículos cadastrados'}
                    </p>
                  </div>
                </div>

                {/* Navegação e Close */}
                <div className="flex items-center gap-3">
                  {vehicles.length > 1 && (
                    <>
                      <button
                        onClick={prevVehicle}
                        className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                        {currentIndex + 1} / {vehicles.length}
                      </span>
                      <button
                        onClick={nextVehicle}
                        className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
              
              {/* Veículo Principal */}
              <div className="flex-1 p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedVehicle?.id || currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                  >
                    {/* Imagem do Veículo */}
                    <div className="flex-1 flex items-center justify-center mb-6">
                      <div className="relative">
                        <VehicleThumbnail 
                          vehicle={selectedVehicle}
                          size="xl"
                          showLabel={false}
                          className="transform scale-150"
                        />
                        <motion.div
                          className="absolute -inset-4 rounded-3xl opacity-20"
                          style={{
                            background: `linear-gradient(135deg, ${getTypeColor(selectedVehicle?.type).replace('from-', '').replace(' to-', ', ')})`,
                          }}
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    </div>

                    {/* Informações Principais */}
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        {selectedVehicle?.brand} {selectedVehicle?.model}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className={`px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getTypeColor(selectedVehicle?.type)} shadow-lg`}>
                          {selectedVehicle?.type?.charAt(0).toUpperCase() + selectedVehicle?.type?.slice(1)}
                        </span>
                      </div>

                      {/* Informações Detalhadas */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {formatVehicleInfo(selectedVehicle).map((info, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-4 text-center"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center mx-auto mb-2">
                              <info.icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wide">
                              {info.label}
                            </p>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                              {info.value}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Sidebar com Lista de Veículos */}
              {vehicles.length > 1 && (
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <Maximize2 className="w-5 h-5" />
                      Todos os Veículos
                    </h4>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {vehicles.map((vehicle, index) => (
                        <motion.button
                          key={vehicle.id || index}
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setCurrentIndex(index);
                          }}
                          className={`w-full p-4 rounded-2xl text-left transition-all duration-200 ${
                            currentIndex === index
                              ? 'bg-white dark:bg-neutral-800 shadow-lg border-2 border-blue-200 dark:border-blue-800'
                              : 'bg-white dark:bg-neutral-800 hover:shadow-md border border-neutral-200 dark:border-neutral-700'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <VehicleThumbnail 
                              vehicle={vehicle}
                              size="sm"
                              showLabel={false}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                {vehicle.brand} {vehicle.model}
                              </p>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {vehicle.plate} • {vehicle.year}
                              </p>
                            </div>
                            {currentIndex === index && (
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer com Estatísticas */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Cliente Premium
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Última atualização: hoje
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {vehicles.length} {vehicles.length === 1 ? 'veículo' : 'veículos'} • {client?.name}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VehicleGalleryModal;