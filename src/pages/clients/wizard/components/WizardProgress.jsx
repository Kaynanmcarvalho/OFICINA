/**
 * WizardProgress - Indicador de progresso do wizard
 */

import { motion as Motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useThemeStore } from '../../../../store/themeStore';

const STEPS = [
  { number: 1, title: 'Básico' },
  { number: 2, title: 'Contato' },
  { number: 3, title: 'Adicional' },
  { number: 4, title: 'Veículos' },
  { number: 5, title: 'Revisão' }
];

const WizardProgress = ({ currentStep, onStepClick }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="w-full px-6 py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className={`absolute top-5 left-0 right-0 h-0.5 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
        }`} style={{ zIndex: 0 }} />
        
        <Motion.div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            transition: {
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1]
            }
          }}
          style={{ zIndex: 1 }}
        />

        {/* Steps */}
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <div
              key={step.number}
              className="flex flex-col items-center relative"
              style={{ zIndex: 2 }}
            >
              <Motion.button
                type="button"
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                initial={false}
                animate={{
                  scale: isCurrent ? [1, 1.05, 1] : 1,
                  transition: {
                    duration: 0.6,
                    repeat: isCurrent ? Infinity : 0,
                    repeatDelay: 2
                  }
                }}
                whileHover={isClickable ? { 
                  scale: 1.15,
                  transition: { duration: 0.2 }
                } : {}}
                whileTap={isClickable ? { 
                  scale: 0.9,
                  transition: { duration: 0.1 }
                } : {}}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-bold text-sm transition-all duration-300
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  ${isCompleted
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : isCurrent
                      ? isDarkMode
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-4 ring-blue-500/30 shadow-lg shadow-blue-600/40'
                        : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-4 ring-blue-500/30 shadow-lg shadow-blue-600/40'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-400 border-2 border-gray-700'
                        : 'bg-white text-gray-400 border-2 border-gray-300'
                  }
                `}
              >
                <Motion.div
                  initial={false}
                  animate={{
                    scale: isCompleted ? [0, 1] : 1,
                    rotate: isCompleted ? [0, 360] : 0
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </Motion.div>
              </Motion.button>

              <span className={`
                text-xs font-medium mt-2 whitespace-nowrap
                ${isCurrent
                  ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  : isDarkMode ? 'text-gray-500' : 'text-gray-600'
                }
              `}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;
