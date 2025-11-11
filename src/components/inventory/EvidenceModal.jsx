/**
 * EvidenceModal - Modal Premium de Evidências
 * Glass effect com timeline de fontes
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, FileText, ShoppingCart, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const EvidenceModal = ({ isOpen, onClose, compatibility }) => {
  const { isDarkMode } = useThemeStore();

  // Força uso do motion
  const MotionDiv = motion.div;

  if (!isOpen || !compatibility) return null;

  const getSourceIcon = (tipo) => {
    switch (tipo) {
      case 'OEM':
        return FileText;
      case 'Marketplace':
        return ShoppingCart;
      case 'Forum':
        return MessageSquare;
      case 'CoPurchase':
        return TrendingUp;
      default:
        return FileText;
    }
  };

  const getSourceColor = (tipo) => {
    const colors = {
      OEM: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      Marketplace: isDarkMode ? 'text-green-400' : 'text-green-600',
      Forum: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
      CoPurchase: isDarkMode ? 'text-purple-400' : 'text-purple-600'
    };
    return colors[tipo] || (isDarkMode ? 'text-gray-400' : 'text-gray-600');
  };

  const evidencias = compatibility.evidencias || [];
  const part = compatibility.part || {};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay com blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal */}
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`
            relative w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden
            ${isDarkMode 
              ? 'bg-gray-900/95 backdrop-blur-xl border border-gray-800' 
              : 'bg-white/95 backdrop-blur-xl border border-gray-200'
            }
            shadow-2xl
          `}
        >
          {/* Header */}
          <div className={`
            px-6 py-4 border-b
            ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
          `}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Evidências de Compatibilidade
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {part.nome || 'Peça'}
                </p>
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
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {/* Score Summary */}
            <div className={`
              p-4 rounded-xl mb-6
              ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}
            `}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Pontuação de Confiança
                  </p>
                  <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {compatibility.confidenceScore || 0}%
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Fontes Verificadas
                  </p>
                  <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {evidencias.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline de Evidências */}
            {evidencias.length === 0 ? (
              <div className="text-center py-12">
                <FileText className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Nenhuma evidência registrada
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {evidencias.map((evidencia, index) => {
                  const Icon = getSourceIcon(evidencia.tipo);
                  const colorClass = getSourceColor(evidencia.tipo);

                  return (
                    <MotionDiv
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        p-4 rounded-xl border-2
                        ${isDarkMode
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-white border-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                          ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                        `}>
                          <Icon className={`w-5 h-5 ${colorClass}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold ${colorClass}`}>
                              {evidencia.tipo}
                            </span>
                            {evidencia.data && (
                              <>
                                <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                                <span className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <Calendar className="w-3 h-3" />
                                  {new Date(evidencia.data).toLocaleDateString('pt-BR')}
                                </span>
                              </>
                            )}
                          </div>

                          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {evidencia.descricao}
                          </p>

                          {evidencia.url && (
                            <a
                              href={evidencia.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`
                                inline-flex items-center gap-1 text-sm font-medium
                                ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}
                                transition-colors
                              `}
                            >
                              <ExternalLink className="w-4 h-4" />
                              Ver fonte
                            </a>
                          )}
                        </div>
                      </div>
                    </MotionDiv>
                  );
                })}
              </div>
            )}

            {/* Última atualização */}
            {compatibility.updatedAt && (
              <div className={`
                mt-6 pt-4 border-t text-center text-sm
                ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'}
              `}>
                Última atualização: {new Date(compatibility.updatedAt.toDate?.() || compatibility.updatedAt).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        </MotionDiv>
      </div>
    </AnimatePresence>
  );
};

export default EvidenceModal;
