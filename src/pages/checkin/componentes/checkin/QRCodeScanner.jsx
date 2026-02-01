import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * QRCodeScanner Component
 * 
 * Scanner de QR Code para check-in rápido de veículos
 * Usa html5-qrcode para leitura via câmera
 * Auto-preenche dados do veículo quando código válido é escaneado
 * 
 * @param {Function} onScan - Callback quando QR code válido é escaneado
 * @param {Function} onClose - Callback para fechar o scanner
 * @param {Boolean} isOpen - Controla visibilidade do scanner
 */
const QRCodeScanner = ({ onScan, onClose, isOpen = false }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Inicializar scanner quando modal abre
  useEffect(() => {
    if (isOpen && !html5QrCodeRef.current) {
      initializeScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  /**
   * Inicializa o scanner de QR Code
   */
  const initializeScanner = async () => {
    try {
      setError(null);
      
      // Criar instância do scanner
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      
      // Configurações do scanner
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      // Iniciar scanner
      await html5QrCodeRef.current.start(
        { facingMode: "environment" }, // Câmera traseira
        config,
        onScanSuccess,
        onScanFailure

      setIsScanning(true);
    } catch (err) {
      console.error('Erro ao inicializar scanner:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  /**
   * Para o scanner
   */
  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error('Erro ao parar scanner:', err);
      }
    }
  };

  /**
   * Callback quando QR code é escaneado com sucesso
   */
  const onScanSuccess = (decodedText, decodedResult) => {
    try {
      // Tentar parsear JSON do QR code
      const data = JSON.parse(decodedText);
      
      // Validar estrutura do QR code
      if (data.type === 'vehicle' && data.vehicleId && data.plate) {
        setScanResult(data);
        
        // Parar scanner
        stopScanner();
        
        // Chamar callback com dados
        setTimeout(() => {
          onScan(data);
          handleClose();
        }, 1000);
      } else {
        setError('QR Code inválido. Use um código de veículo válido.');
      }
    } catch (err) {
      setError('QR Code não reconhecido. Formato inválido.');
    }
  };

  /**
   * Callback quando falha ao escanear
   */
  const onScanFailure = (error) => {
    // Ignorar erros de "not found" (normais durante scan)
    if (!error.includes('NotFoundException')) {
      }
  };

  /**
   * Fecha o scanner
   */
  const handleClose = async () => {
    await stopScanner();
    setScanResult(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card do Scanner */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Escanear QR Code
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Aponte a câmera para o código do veículo
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scanner Area */}
            <div className="p-6">
              <div className="relative">
                {/* QR Reader Container */}
                <div 
                  id="qr-reader" 
                  className="rounded-2xl overflow-hidden"
                  style={{ width: '100%' }}
                />

                {/* Scanning Overlay */}
                {isScanning && !scanResult && !error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {/* Corner Markers */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

                    {/* Scanning Line */}
                    <motion.div
                      animate={{ y: [0, 200, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                      style={{ top: '50%' }}
                    />
                  </motion.div>
                )}

                {/* Success State */}
                {scanResult && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-green-500/90 rounded-2xl"
                  >
                    <div className="text-center text-white">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <p className="text-lg font-semibold">QR Code Escaneado!</p>
                      <p className="text-sm mt-1 opacity-90">{scanResult.plate}</p>
                    </div>
                  </motion.div>
                )}

                {/* Error State */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          {error}
                        </p>
                        <button
                          onClick={() => {
                            setError(null);
                            initializeScanner();
                          }}
                          className="text-sm text-red-600 dark:text-red-400 hover:underline mt-1"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Instructions */}
              {isScanning && !scanResult && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Posicione o QR code dentro da área marcada
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClose}
                className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRCodeScanner;
