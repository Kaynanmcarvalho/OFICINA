/**
 * CompatiblePartsList - Lista Premium de Peças Compatíveis
 * Design Apple-like com badges de confiança
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Shield, ShieldCheck, ShieldAlert, ExternalLink, Info } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { getConfidenceLevel } from '../../services/compatibilityService';

const CompatiblePartsList = ({ parts = [], onPartSelect, onShowEvidence, showOEMOnly = false }) => {
  const { isDarkMode } = useThemeStore();
  const [sortBy, setSortBy] = useState('confidence'); // confidence | name | price

  // Força uso do motion
  const MotionDiv = motion.div;

  // Filtrar e ordenar
  const filteredParts = parts
    .filter(item => {
      if (showOEMOnly) {
        return item.evidencias?.some(e => e.tipo === 'OEM');
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return (b.confidenceScore || 0) - (a.confidenceScore || 0);
        case 'name':
          return (a.part?.nome || '').localeCompare(b.part?.nome || '');
        case 'price':
          return (a.part?.preco || 0) - (b.part?.preco || 0);
        default:
          return 0;
      }
    });

  const getConfidenceBadge = (score) => {
    const level = getConfidenceLevel(score);
    
    const colors = {
      high: {
        bg: isDarkMode ? 'bg-green-600/20' : 'bg-green-100',
        text: isDarkMode ? 'text-green-400' : 'text-green-700',
        border: isDarkMode ? 'border-green-600/30' : 'border-green-300',
        icon: ShieldCheck
      },
      medium: {
        bg: isDarkMode ? 'bg-yellow-600/20' : 'bg-yellow-100',
        text: isDarkMode ? 'text-yellow-400' : 'text-yellow-700',
        border: isDarkMode ? 'border-yellow-600/30' : 'border-yellow-300',
        icon: Shield
      },
      low: {
        bg: isDarkMode ? 'bg-red-600/20' : 'bg-red-100',
        text: isDarkMode ? 'text-red-400' : 'text-red-700',
        border: isDarkMode ? 'border-red-600/30' : 'border-red-300',
        icon: ShieldAlert
      }
    };

    const config = colors[level.level];
    const Icon = config.icon;

    return (
      <div className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2
        ${config.bg} ${config.text} ${config.border}
      `}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold">{level.label}</span>
        <span className="text-xs opacity-75">({score}%)</span>
      </div>
    );
  };

  if (parts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Nenhuma peça encontrada
        </h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Selecione um veículo para ver as peças compatíveis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {filteredParts.length} Peça(s) Compatível(is)
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Ordenadas por confiabilidade
          </p>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`
            px-4 py-2 rounded-lg border-2 text-sm font-medium
            ${isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
            }
            focus:outline-none focus:border-blue-500
          `}
        >
          <option value="confidence">Confiança</option>
          <option value="name">Nome</option>
          <option value="price">Preço</option>
        </select>
      </div>

      {/* Lista de peças */}
      <div className="space-y-3">
        {filteredParts.map((item, index) => (
          <MotionDiv
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              p-5 rounded-xl border-2 transition-all
              ${isDarkMode
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                : 'bg-white border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* Imagem */}
              {item.part?.imagemURL ? (
                <img
                  src={item.part.imagemURL}
                  alt={item.part.nome}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className={`
                  w-20 h-20 rounded-lg flex items-center justify-center
                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                `}>
                  <Package className={`w-8 h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              )}

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h4 className={`font-semibold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.part?.nome || 'Sem nome'}
                    </h4>
                    <div className="flex items-center gap-3 text-sm">
                      {item.part?.categoria && (
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {item.part.categoria}
                        </span>
                      )}
                      {item.part?.fabricante && (
                        <>
                          <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {item.part.fabricante}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Badge de confiança */}
                  {getConfidenceBadge(item.confidenceScore || 0)}
                </div>

                {/* Códigos OE */}
                {item.part?.codigosOE && item.part.codigosOE.length > 0 && (
                  <div className="mb-3">
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Códigos OE:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.part.codigosOE.map((code, i) => (
                        <span
                          key={i}
                          className={`
                            px-2 py-1 rounded text-xs font-mono
                            ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
                          `}
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidências */}
                {item.evidencias && item.evidencias.length > 0 && (
                  <div className="mb-3">
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Fontes: {item.evidencias.length}
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {[...new Set(item.evidencias.map(e => e.tipo))].map((tipo, i) => (
                        <span
                          key={i}
                          className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${tipo === 'OEM'
                              ? isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                              : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }
                          `}
                        >
                          {tipo}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center gap-2">
                  {onShowEvidence && (
                    <button
                      onClick={() => onShowEvidence(item)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                        transition-colors
                        ${isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      <Info className="w-4 h-4" />
                      Ver Evidências
                    </button>
                  )}
                  
                  {onPartSelect && (
                    <button
                      onClick={() => onPartSelect(item.part)}
                      className="
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                        bg-blue-600 text-white hover:bg-blue-700
                        transition-colors
                      "
                    >
                      <ExternalLink className="w-4 h-4" />
                      Selecionar Peça
                    </button>
                  )}
                </div>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

export default CompatiblePartsList;
