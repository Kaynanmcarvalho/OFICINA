import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import SuggestionCard from './SuggestionCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useServiceSuggestions } from '../../hooks/useServiceSuggestions';

const ServiceSuggestions = ({ vehiclePlate, empresaId, checkinId, onClose, onAccept }) => {
  const {
    suggestions,
    loading,
    error,
    acceptSuggestion,
    ignoreSuggestion,
    acceptAll,
    ignoreAll
  } = useServiceSuggestions(vehiclePlate, empresaId, checkinId);

  const handleAccept = async (suggestion) => {
    const result = await acceptSuggestion(suggestion);
    if (result.success && onAccept) {
      onAccept(suggestion.service);
    }
  };

  const handleAcceptAll = async () => {
    const result = await acceptAll();
    if (result.success && onAccept) {
      onAccept('all');
    }
  };

  const handleIgnoreAll = async () => {
    await ignoreAll();
    onClose();
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
          <LoadingSpinner text="Analisando histórico..." />
        </GlassCard>
      </motion.div>
  );
}

if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <GlassCard className="p-8 text-center" animate={false}>
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white mb-4">Erro ao carregar sugestões</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </GlassCard>
      </motion.div>
  );
}

if (suggestions.length === 0) {
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
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 text-center" animate={false}>
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Tudo em dia!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Não há sugestões de manutenção no momento
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
            >
              Continuar
            </button>
          </GlassCard>
        </motion.div>
      </motion.div>
  );
}

return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl my-8"
      >
        <GlassCard className="p-6" animate={false}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Sugestões Inteligentes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {suggestions.length} sugestão{suggestions.length !== 1 ? 'ões' : ''} baseada{suggestions.length !== 1 ? 's' : ''} no histórico
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Suggestions List */}
          <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto pr-2">
            <AnimatePresence>
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.service}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SuggestionCard
                    suggestion={suggestion}
                    onAccept={() => handleAccept(suggestion)}
                    onIgnore={() => ignoreSuggestion(suggestion)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleIgnoreAll}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Ignorar Todas
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
            >
              Adicionar Todas
            </button>
          </div>

          {/* Info */}
          <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
              💡 As sugestões são baseadas no histórico de manutenção do veículo
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default ServiceSuggestions;
