import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lock, AlertTriangle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { usePinValidation } from '../../hooks/usePinValidation';
import { cn } from '../../../../utils/cn';

const PinValidation = ({ checkinId, onSuccess, onClose }) => {
  const { pin, status, attempts, loading, error, handlePinChange, resetPin } = usePinValidation(checkinId);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus no primeiro input ao montar
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Chamar onSuccess quando validado
    if (status === 'valid' && onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }
  }, [status, onSuccess]);

  const handleInputChange = (index, value) => {
    handlePinChange(index, value);

    // Auto-focus no próximo input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: voltar para input anterior
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Setas: navegar entre inputs
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      digits.forEach((digit, index) => {
        handlePinChange(index, digit);
      });
      inputRefs.current[3]?.focus();
    }
  };

  const getInputClassName = () => {
    const baseClasses = `
      w-16 h-16 text-center text-2xl font-bold rounded-2xl
      transition-all duration-200 outline-none
      focus:ring-2 focus:ring-orange-500
    `;

    if (status === 'valid') {
      return cn(baseClasses, 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 text-green-600 dark:text-green-400');
    }
    if (status === 'invalid') {
      return cn(baseClasses, 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-600 dark:text-red-400');
    }
    if (status === 'blocked') {
      return cn(baseClasses, 'bg-gray-200 dark:bg-gray-700 border-2 border-gray-400 text-gray-500 cursor-not-allowed');
    }
    return cn(baseClasses, 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8" animate={false}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              PIN de Retirada
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Digite o PIN fornecido no check-in
            </p>
          </div>

          {/* PIN Inputs */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <motion.input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={pin[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={status === 'blocked' || loading}
                className={getInputClassName()}
                animate={status === 'invalid' ? {
                  x: [0, -10, 10, -10, 10, 0],
                  transition: { duration: 0.4 }
                } : {}}
              />
            ))}
          </div>

          {/* Feedback Messages */}
          <AnimatePresence mode="wait">
            {status === 'valid' && (
              <motion.div
                key="valid"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-4"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">PIN correto! Liberando check-out...</span>
              </motion.div>
            )}
            
            {status === 'invalid' && error && (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-4"
              >
                <XCircle className="w-5 h-5" />
                <span className="font-semibold text-sm text-center">{error}</span>
              </motion.div>
            )}

            {status === 'blocked' && (
              <motion.div
                key="blocked"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 mb-4"
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold text-sm text-center">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attempts Counter */}
          {attempts > 0 && status !== 'blocked' && status !== 'valid' && (
            <div className="text-center mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tentativas: {attempts}/3
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {status !== 'valid' && (
              <>
                <button
                  onClick={resetPin}
                  disabled={loading || status === 'blocked'}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Limpar
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Não tem o PIN? Entre em contato com o atendimento
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default PinValidation;
