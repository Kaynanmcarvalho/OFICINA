/**
 * WizardNavigation - Botões de navegação do wizard
 */

import { motion as Motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { useThemeStore } from '../../../../store/themeStore';

const WizardNavigation = ({
  currentStep,
  totalSteps,
  canGoNext,
  isLoading,
  onNext,
  onBack,
  onSave,
  onCancel
}) => {
  const { isDarkMode } = useThemeStore();
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className={`
      px-6 py-4 border-t flex items-center justify-between
      ${isDarkMode ? 'border-gray-700/60 bg-gray-900/50' : 'border-gray-300/80 bg-gray-50/50'}
    `}>
      <Motion.button
        type="button"
        whileHover={!isFirstStep ? { 
          scale: 1.03,
          x: -2,
          transition: { duration: 0.2 }
        } : {}}
        whileTap={!isFirstStep ? { 
          scale: 0.97,
          transition: { duration: 0.1 }
        } : {}}
        onClick={onBack}
        disabled={isFirstStep}
        className={`
          flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold
          transition-all disabled:opacity-30 disabled:cursor-not-allowed
          ${isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }
        `}
      >
        <Motion.div
          animate={!isFirstStep ? {
            x: [-2, 0, -2],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          } : {}}
        >
          <ChevronLeft className="w-5 h-5" />
        </Motion.div>
        Voltar
      </Motion.button>

      <div className="flex items-center gap-3">
        <Motion.button
          type="button"
          whileHover={{ 
            scale: 1.03,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.97,
            transition: { duration: 0.1 }
          }}
          onClick={onCancel}
          className={`
            px-6 py-2.5 rounded-xl font-semibold transition-all
            ${isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }
          `}
        >
          Cancelar
        </Motion.button>

        {isLastStep ? (
          <Motion.button
            type="button"
            whileHover={!isLoading && canGoNext ? { 
              scale: 1.05,
              boxShadow: isDarkMode 
                ? '0 10px 30px rgba(59, 130, 246, 0.4)' 
                : '0 10px 30px rgba(59, 130, 246, 0.3)',
              transition: { duration: 0.2 }
            } : {}}
            whileTap={!isLoading && canGoNext ? { 
              scale: 0.95,
              transition: { duration: 0.1 }
            } : {}}
            onClick={onSave}
            disabled={isLoading || !canGoNext}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${isDarkMode 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/30'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Cliente
              </>
            )}
          </Motion.button>
        ) : (
          <Motion.button
            type="button"
            whileHover={canGoNext ? { 
              scale: 1.05,
              x: 2,
              boxShadow: isDarkMode 
                ? '0 10px 30px rgba(59, 130, 246, 0.4)' 
                : '0 10px 30px rgba(59, 130, 246, 0.3)',
              transition: { duration: 0.2 }
            } : {}}
            whileTap={canGoNext ? { 
              scale: 0.95,
              transition: { duration: 0.1 }
            } : {}}
            onClick={onNext}
            disabled={!canGoNext}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${isDarkMode 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/30'
              }
            `}
          >
            Próximo
            <Motion.div
              animate={canGoNext ? {
                x: [0, 2, 0],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              } : {}}
            >
              <ChevronRight className="w-5 h-5" />
            </Motion.div>
          </Motion.button>
        )}
      </div>
    </div>
  );
};

export default WizardNavigation;
