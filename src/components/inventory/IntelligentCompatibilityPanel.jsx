/**
 * IntelligentCompatibilityPanel - Painel de Análise Inteligente
 * Mostra sugestões de compatibilidade para produtos
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, X, Loader2, AlertCircle, Info } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useProductStore } from '../../store/productStore';
import { analyzeAllProducts, saveSuggestedCompatibilities } from '../../services/intelligentCompatibilityService';

const IntelligentCompatibilityPanel = ({ isOpen, onClose }) => {
  const { isDarkMode } = useThemeStore();
  const { products } = useProductStore();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Força uso do motion
  const MotionDiv = motion.div;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const analysisReport = await analyzeAllProducts(products);
      setReport(analysisReport);
    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSuggestion = (productId, suggestionIndex) => {
    const key = `${productId}-${suggestionIndex}`;
    const newSelected = new Set(selectedSuggestions);
    
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    
    setSelectedSuggestions(newSelected);
  };

  const handleSaveSelected = async () => {
    if (selectedSuggestions.size === 0) return;
    
    setIsSaving(true);
    try {
      for (const key of selectedSuggestions) {
        const [productId, suggestionIndex] = key.split('-');
        const productReport = report.suggestions.find(s => s.product.id === productId);
        
        if (productReport) {
          const suggestion = productReport.suggestions[parseInt(suggestionIndex)];
          await saveSuggestedCompatibilities(productId, [suggestion]);
        }
      }
      
      alert(`${selectedSuggestions.size} compatibilidades salvas com sucesso!`);
      setSelectedSuggestions(new Set());
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar compatibilidades');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
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
                ${isDarkMode ? 'bg-purple-600/20' : 'bg-purple-100'}
              `}>
                <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Análise Inteligente de Compatibilidade
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  IA analisa seus produtos e sugere compatibilidades automaticamente
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {!report ? (
            <div className="text-center py-12">
              <Sparkles className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Pronto para Analisar
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Vamos analisar {products.length} produtos e sugerir compatibilidades inteligentes
              </p>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="
                  px-6 py-3 rounded-xl font-medium
                  bg-purple-600 hover:bg-purple-700 text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors flex items-center gap-2 mx-auto
                "
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Iniciar Análise
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Resumo */}
              <div className={`
                p-4 rounded-xl mb-6
                ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}
              `}>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total de Produtos
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {report.total}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Analisados
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {report.analyzed}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Com Sugestões
                    </p>
                    <p className={`text-2xl font-bold text-green-500`}>
                      {report.withSuggestions}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Selecionadas
                    </p>
                    <p className={`text-2xl font-bold text-purple-500`}>
                      {selectedSuggestions.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sugestões */}
              <div className="space-y-4">
                {report.suggestions.map((item) => (
                  <div
                    key={item.product.id}
                    className={`
                      p-4 rounded-xl border-2
                      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                    `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.product.name}
                        </h4>
                        {item.product.sku && (
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            SKU: {item.product.sku}
                          </p>
                        )}
                      </div>
                      <span className={`
                        px-3 py-1 rounded-lg text-sm font-medium
                        ${isDarkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700'}
                      `}>
                        {item.suggestions.length} sugestões
                      </span>
                    </div>

                    <div className="space-y-2">
                      {item.suggestions.map((suggestion, index) => {
                        const key = `${item.product.id}-${index}`;
                        const isSelected = selectedSuggestions.has(key);

                        return (
                          <div
                            key={index}
                            onClick={() => toggleSuggestion(item.product.id, index)}
                            className={`
                              p-3 rounded-lg border-2 cursor-pointer transition-all
                              ${isSelected
                                ? isDarkMode
                                  ? 'bg-purple-600/20 border-purple-600'
                                  : 'bg-purple-50 border-purple-500'
                                : isDarkMode
                                  ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                                  : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                              }
                            `}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {suggestion.marca} {suggestion.modelo}
                                  </span>
                                  <span className={`
                                    px-2 py-0.5 rounded text-xs font-medium
                                    ${suggestion.confidenceScore >= 70
                                      ? 'bg-green-100 text-green-700'
                                      : suggestion.confidenceScore >= 50
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-orange-100 text-orange-700'
                                    }
                                  `}>
                                    {suggestion.confidenceScore}% confiança
                                  </span>
                                </div>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {suggestion.anoInicio} - {suggestion.anoFim} • {suggestion.reason}
                                </p>
                              </div>
                              <div className={`
                                w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                                ${isSelected
                                  ? 'bg-purple-600'
                                  : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                                }
                              `}>
                                {isSelected && <Check className="w-4 h-4 text-white" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {report.errors.length > 0 && (
                <div className={`
                  mt-4 p-4 rounded-xl border-2
                  ${isDarkMode ? 'bg-red-600/20 border-red-600/30' : 'bg-red-50 border-red-200'}
                `}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                        {report.errors.length} erro(s) durante análise
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {report && (
          <div className={`
            px-6 py-4 border-t flex items-center justify-between
            ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
          `}>
            <div className="flex items-center gap-2 text-sm">
              <Info className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Selecione as sugestões que deseja salvar
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setReport(null)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                Nova Análise
              </button>
              <button
                onClick={handleSaveSelected}
                disabled={selectedSuggestions.size === 0 || isSaving}
                className="
                  px-6 py-2 rounded-lg font-medium
                  bg-purple-600 hover:bg-purple-700 text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors flex items-center gap-2
                "
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Salvar Selecionadas ({selectedSuggestions.size})
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </MotionDiv>
    </div>
  );
};

export default IntelligentCompatibilityPanel;
