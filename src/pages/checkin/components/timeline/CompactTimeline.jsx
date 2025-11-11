import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STAGES = [
  { id: 'checkin', label: 'Check-in', short: 'IN' },
  { id: 'diagnostico', label: 'Diagnóstico', short: 'DG' },
  { id: 'orcamento', label: 'Orçamento', short: 'OR' },
  { id: 'execucao', label: 'Execução', short: 'EX' },
  { id: 'finalizacao', label: 'Finalização', short: 'FN' },
  { id: 'checkout', label: 'Check-out', short: 'OUT' }
];

const CompactTimeline = ({ currentStage = 'checkin', stages = {}, className = '' }) => {
  const getCurrentStageIndex = () => {
    const index = STAGES.findIndex(s => s.id === currentStage);
    return index >= 0 ? index : 0; // Default to first stage if not found
  };

  const getStageStatus = (stageId) => {
    const stageIndex = STAGES.findIndex(s => s.id === stageId);
    const currentIndex = getCurrentStageIndex();
    
    // Check if stage is explicitly completed in stages data
    if (stages[stageId]?.completed) return 'completed';
    
    // Otherwise use index comparison
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  };

  const currentIndex = getCurrentStageIndex();
  const progress = ((currentIndex + 1) / STAGES.length) * 100;

  return (
    <div className={`relative ${className}`}>
      {/* Progress Bar */}
      <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Stages */}
      <div className="flex items-center justify-between gap-1">
        {STAGES.map((stage, index) => {
          const status = getStageStatus(stage.id);
          const stageData = stages[stage.id];

          return (
            <div
              key={stage.id}
              className="flex flex-col items-center flex-1"
              title={stage.label}
            >
              {/* Stage Indicator */}
              <div className="relative">
                <div
                  className={`
                    w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold
                    transition-all duration-300
                    ${status === 'completed'
                      ? 'bg-green-500 text-white shadow-md'
                      : status === 'current'
                        ? 'bg-orange-500 text-white shadow-md animate-pulse'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{stage.short}</span>
                  )}
                </div>

                {/* Current Stage Indicator */}
                {status === 'current' && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Stage Label (only for current) */}
              {status === 'current' && (
                <span className="text-[9px] font-semibold text-orange-600 dark:text-orange-400 mt-1 whitespace-nowrap">
                  {stage.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Text */}
      <div className="text-center mt-2">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {currentIndex + 1} de {STAGES.length} etapas
        </span>
      </div>
    </div>
  );
};

export default CompactTimeline;
