/**
 * VehicleCompatibilitySearch - Componente Integrado Premium
 * Substitui o botão "Buscar por veículo" com funcionalidade completa
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, AlertCircle } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useProductStore } from '../../store/productStore';
import VehicleSelector from './VehicleSelector';
import CompatiblePartsList from './CompatiblePartsList';
import EvidenceModal from './EvidenceModal';
import { getOrCreateVehicle, findCompatibleParts } from '../../services/compatibilityService';

const VehicleCompatibilitySearch = ({ isOpen, onClose, onPartSelect }) => {
  const { isDarkMode } = useThemeStore();
  const { products } = useProductStore();

  // Estados
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [compatibleParts, setCompatibleParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOEMOnly, setShowOEMOnly] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  // Força uso do motion
  const MotionDiv = motion.div;

  const handleVehicleSelect = async (vehicle) => {
    setSelectedVehicle(vehicle);
    setError(null);
    setIsLoading(true);

    try {
      // Buscar ou criar veículo no Firestore
      const vehicleId = await getOrCreateVehicle({
        tipo: vehicle.tipo,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        anoInicio: parseInt(vehicle.ano.split('-')[0]),
        anoFim: parseInt(vehicle.ano.split('-')[0])
      });

      // Buscar peças compatíveis (Firestore + Inventário)
      const ano = parseInt(vehicle.ano.split('-')[0]);
      const vehicleData = {
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        tipo: vehicle.tipo
      };
      
      const parts = await findCompatibleParts(vehicleId, ano, vehicleData, products);
      
      setCompatibleParts(parts);
    } catch (err) {
      console.error('Erro ao buscar compatibilidades:', err);
      setError('Erro ao buscar peças compatíveis. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowEvidence = (compatibility) => {
    setSelectedEvidence(compatibility);
  };

  const handlePartSelect = (part) => {
    if (onPartSelect) {
      onPartSelect(part);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`
              relative w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden
              ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
              shadow-2xl
            `}
          >
            {/* Header */}
            <div className={`
              px-6 py-4 border-b
              ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-100'}
                  `}>
                    <Search className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Buscar Peças por Veículo
                    </h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Sistema inteligente com dados da FIPE
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex h-[calc(90vh-120px)]">
              {/* Left Panel - Vehicle Selection */}
              <div className={`
                w-2/5 border-r overflow-y-auto
                ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
              `}>
                <div className="p-6">
                  <VehicleSelector
                    onVehicleSelect={handleVehicleSelect}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Right Panel - Results */}
              <div className="w-3/5 overflow-y-auto">
                <div className="p-6">
                  {error && (
                    <div className={`
                      p-4 rounded-xl mb-4 flex items-start gap-3
                      ${isDarkMode ? 'bg-red-600/20 border-2 border-red-600/30' : 'bg-red-50 border-2 border-red-200'}
                    `}>
                      <AlertCircle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                      <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                        {error}
                      </p>
                    </div>
                  )}

                  {!selectedVehicle ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Search className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                      <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Selecione um veículo
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Escolha tipo, marca, modelo e ano para ver as peças compatíveis
                      </p>
                    </div>
                  ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Buscando peças compatíveis...
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Filtro OEM */}
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedVehicle.marca} {selectedVehicle.modelo}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Ano: {selectedVehicle.ano}
                          </p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showOEMOnly}
                            onChange={(e) => setShowOEMOnly(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Apenas OEM
                          </span>
                        </label>
                      </div>

                      <CompatiblePartsList
                        parts={compatibleParts}
                        onPartSelect={handlePartSelect}
                        onShowEvidence={handleShowEvidence}
                        showOEMOnly={showOEMOnly}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </AnimatePresence>

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        compatibility={selectedEvidence}
      />
    </>

};

export default VehicleCompatibilitySearch;
