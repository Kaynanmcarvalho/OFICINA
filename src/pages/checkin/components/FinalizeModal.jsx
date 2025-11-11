/**
 * FinalizeModal - Modal de finalização com PIN de retirada
 * Captura localização e gera PIN único
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Key, Copy, Check, Loader } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';

const FinalizeModal = ({ isOpen, onClose, onFinalize, vehicleData, placa }) => {
  const { isDarkMode } = useThemeStore();
  const [step, setStep] = useState('confirm'); // confirm, processing, success
  const [location, setLocation] = useState(null);
  const [pin, setPin] = useState('');
  const [copied, setCopied] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (isOpen && step === 'confirm') {
      getLocation();
    }
  }, [isOpen, step]);

  const getLocation = async () => {
    try {
      if (!navigator.geolocation) {
        console.warn('Geolocalização não suportada');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Converte coordenadas em cidade/estado usando Nominatim
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`
            );
            const data = await response.json();
            
            setLocation({
              latitude,
              longitude,
              cidade: data.address.city || data.address.town || data.address.village || 'Desconhecida',
              estado: data.address.state || 'Desconhecido'
            });
          } catch (error) {
            console.error('Erro ao obter endereço:', error);
            setLocation({
              latitude,
              longitude,
              cidade: 'Desconhecida',
              estado: 'Desconhecido'
            });
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    } catch (error) {
      console.error('Erro na geolocalização:', error);
    }
  };

  const generatePIN = () => {
    // Gera PIN de 6 dígitos único
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleFinalize = async () => {
    setStep('processing');
    
    // Gera PIN
    const generatedPin = generatePIN();
    setPin(generatedPin);
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Chama callback com dados completos
    if (onFinalize) {
      await onFinalize({
        localizacao: location,
        pinRetirada: generatedPin,
        observacoes,
        dataHora: new Date()
      });
    }
    
    setStep('success');
  };

  const copyPIN = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep('confirm');
    setObservacoes('');
    setPin('');
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`
            relative w-full max-w-lg rounded-2xl shadow-2xl
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
          `}
        >
          {/* Header */}
          <div className={`
            flex items-center justify-between p-6 border-b
            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {step === 'confirm' && 'Finalizar Check-in'}
              {step === 'processing' && 'Processando...'}
              {step === 'success' && 'Check-in Concluído!'}
            </h2>
            
            {step !== 'processing' && (
              <button
                onClick={handleClose}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                `}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step: Confirm */}
            {step === 'confirm' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Resumo do veículo */}
                <div className={`
                  p-4 rounded-lg
                  ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Veículo
                  </p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {placa?.toUpperCase()}
                  </p>
                  {vehicleData && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {vehicleData.marca} {vehicleData.modelo} - {vehicleData.ano}
                    </p>
                  )}
                </div>

                {/* Localização */}
                {location && (
                  <div className={`
                    flex items-start gap-3 p-4 rounded-lg
                    ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-50'}
                  `}>
                    <MapPin className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Localização capturada
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {location.cidade}, {location.estado}
                      </p>
                    </div>
                  </div>
                )}

                {/* Data/Hora */}
                <div className={`
                  flex items-start gap-3 p-4 rounded-lg
                  ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <Clock className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Data e hora
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Intl.DateTimeFormat('pt-BR', {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      }).format(new Date())}
                    </p>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Observações (opcional)
                  </label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Adicione observações sobre o check-in..."
                    rows={3}
                    className={`
                      w-full p-3 rounded-lg border-2 resize-none
                      ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className={`
                      flex-1 py-3 px-4 rounded-lg font-medium transition-colors
                      ${isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }
                    `}
                  >
                    Cancelar
                  </button>
                  
                  <button
                    onClick={handleFinalize}
                    className="flex-1 py-3 px-4 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    Finalizar Check-in
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: Processing */}
            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <Loader className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Finalizando check-in...
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Gerando PIN de retirada
                </p>
              </motion.div>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Ícone de sucesso */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* PIN */}
                <div className={`
                  p-6 rounded-xl text-center
                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}
                `}>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Key className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      PIN de Retirada
                    </p>
                  </div>
                  
                  <p className={`text-4xl font-bold tracking-wider mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {pin}
                  </p>
                  
                  <button
                    onClick={copyPIN}
                    className={`
                      flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg
                      font-medium transition-colors
                      ${copied
                        ? 'bg-green-500 text-white'
                        : isDarkMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }
                    `}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar PIN
                      </>
                    )}
                  </button>
                </div>

                {/* Info */}
                <div className={`
                  p-4 rounded-lg border-2
                  ${isDarkMode ? 'bg-yellow-600/20 border-yellow-600/50' : 'bg-yellow-50 border-yellow-200'}
                `}>
                  <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                    <strong>Importante:</strong> Guarde este PIN. Ele será necessário para a retirada do veículo.
                  </p>
                </div>

                {/* Localização e hora */}
                {location && (
                  <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    📍 Check-in realizado em {location.cidade}, {location.estado}
                    <br />
                    às {new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(new Date())}
                  </div>
                )}

                {/* Botão fechar */}
                <button
                  onClick={handleClose}
                  className="w-full py-3 px-4 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                >
                  Concluir
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FinalizeModal;
