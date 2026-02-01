/**
 * TORQ OBD Scanner - Scanner Button Component
 * Botão premium para iniciar scan OBD-II
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Bluetooth,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Zap,
  Car,
  Settings,
  Activity,
  Gauge,
} from 'lucide-react';
import { useOBDScanner } from '../hooks/useOBDScanner';
import type { OBDScanRequest, OBDScanResult } from '../types';
import { OBDResultsPanel } from './OBDResultsPanel';

interface OBDScannerButtonProps {
  vehicleInfo?: {
    plate?: string;
    make?: string;
    model?: string;
    year?: number;
  };
  checkinId?: string;
  budgetId?: string;
  onScanComplete?: (result: OBDScanResult) => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function OBDScannerButton({
  vehicleInfo,
  checkinId,
  budgetId,
  onScanComplete,
  variant = 'primary',
  size = 'md',
}: OBDScannerButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [scanType, setScanType] = useState<'quick' | 'full'>('quick');
  const [showResults, setShowResults] = useState(false);
  
  const {
    connectionState,
    currentScan,
    connectDevice,
    performScan,
    disconnect,
    isSupported,
    error,
  } = useOBDScanner();

  const { isConnected, isScanning, device, progress, currentStep } = connectionState;

  const handleStartScan = async () => {
    const request: OBDScanRequest = {
      vehicleInfo,
      scanType,
      includeLiveData: scanType === 'full',
      checkinId,
      budgetId,
    };

    const result = await performScan(request);
    if (result) {
      setShowResults(true);
      onScanComplete?.(result);
    }
  };

  const handleConnect = async () => {
    await connectDevice();
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm';
      case 'lg': return 'px-6 py-4 text-lg';
      default: return 'px-4 py-3 text-base';
    }
  };

  const getButtonStyle = () => {
    if (variant === 'secondary') {
      return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700';
    }
    return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25';
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm">Bluetooth não suportado</span>
      </div>
  );
}

return (
    <>
      {/* Botão principal */}
      <motion.button
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          ${getButtonSize()}
          ${getButtonStyle()}
          rounded-xl font-medium
          flex items-center gap-2
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        disabled={isScanning}
      >
        {isScanning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Escaneando...</span>
          </>
        ) : isConnected ? (
          <>
            <Zap className="w-4 h-4" />
            <span>Scanner OBD</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </>
        ) : (
          <>
            <Scan className="w-4 h-4" />
            <span>Scanner OBD-II</span>
          </>
        )}
      </motion.button>

      {/* Modal do Scanner */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 bg-white dark:bg-neutral-800 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                      <Scan className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Scanner OBD-II
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Diagnóstico do veículo
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Mostrar resultados se disponíveis */}
                {showResults && currentScan ? (
                  <OBDResultsPanel 
                    result={currentScan} 
                    onClose={() => setShowResults(false)}
                  />
                ) : (
                  <>
                    {/* Informações do veículo */}
                    {vehicleInfo && (
                      <div className="mb-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Veículo
                          </span>
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {vehicleInfo.make} {vehicleInfo.model} {vehicleInfo.year}
                          {vehicleInfo.plate && (
                            <span className="ml-2 px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-xs font-mono">
                              {vehicleInfo.plate}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status da conexão */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Status da Conexão
                        </span>
                        {isConnected ? (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium">Conectado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-neutral-500">
                            <Bluetooth className="w-4 h-4" />
                            <span className="text-sm">Desconectado</span>
                          </div>
                        )}
                      </div>

                      {device && (
                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                {device.deviceName}
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-400">
                                Protocolo: {device.protocol} • Sinal: {device.signalStrength}%
                              </p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                      )}

                      {!isConnected && (
                        <motion.button
                          onClick={handleConnect}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full mt-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-medium flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <Bluetooth className="w-4 h-4" />
                          Conectar Dispositivo OBD
                        </motion.button>
                      )}
                    </div>

                    {/* Tipo de scan */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Settings className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Tipo de Scan
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setScanType('quick')}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            scanType === 'quick'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className={`w-4 h-4 ${scanType === 'quick' ? 'text-blue-600' : 'text-neutral-500'}`} />
                            <span className={`text-sm font-medium ${scanType === 'quick' ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-700 dark:text-neutral-300'}`}>
                              Rápido
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Apenas códigos de falha ativos
                          </p>
                        </button>
                        <button
                          onClick={() => setScanType('full')}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            scanType === 'full'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Activity className={`w-4 h-4 ${scanType === 'full' ? 'text-blue-600' : 'text-neutral-500'}`} />
                            <span className={`text-sm font-medium ${scanType === 'full' ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-700 dark:text-neutral-300'}`}>
                              Completo
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Códigos + dados ao vivo
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Progresso do scan */}
                    {isScanning && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {currentStep}
                          </span>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Erro */}
                    {error && (
                      <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                        </div>
                      </div>
                    )}

                    {/* Dica */}
                    <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-start gap-2">
                        <Gauge className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                            Dica
                          </p>
                          <p className="text-xs text-amber-700 dark:text-amber-300">
                            Certifique-se de que a ignição está ligada e o motor pode estar ligado ou desligado.
                            O dispositivo OBD deve estar conectado à porta de diagnóstico do veículo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              {!showResults && (
                <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      onClick={handleStartScan}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isScanning}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Escaneando...
                        </>
                      ) : (
                        <>
                          <Scan className="w-4 h-4" />
                          Iniciar Scan
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>

}

export default OBDScannerButton;
