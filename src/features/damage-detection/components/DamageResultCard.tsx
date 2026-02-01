/**
 * TORQ Damage Detection - Result Card Component
 * Card premium para exibir resultado da análise de danos
 */

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import type { DamageDetectionResult } from '../types';
import {
  DAMAGE_TYPE_LABELS,
  SEVERITY_LABELS,
  CONDITION_LABELS,
  SEVERITY_COLORS,
} from '../types';
import { DamageOverlay } from './DamageOverlay';

interface DamageResultCardProps {
  result: DamageDetectionResult;
  imageUrl: string;
  compact?: boolean;
  onViewDetails?: () => void;
}

export function DamageResultCard({
  result,
  imageUrl,
  compact = false,
  onViewDetails,
}: DamageResultCardProps) {
  const { damages, overallCondition, confidence, processingTime } = result;

  const getConditionColor = () => {
    switch (overallCondition) {
      case 'excellent':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'good':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'fair':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'poor':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    }
  };

  const getConditionIcon = () => {
    switch (overallCondition) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="w-5 h-5" />;
      case 'fair':
      case 'poor':
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      >
        {/* Mini preview */}
        <div className="relative h-32">
          <img
            src={imageUrl}
            alt="Análise"
            className="w-full h-full object-cover"
          />
          {/* Badge de condição */}
          <div className="absolute top-2 right-2">
            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getConditionColor()}`}>
              {CONDITION_LABELS[overallCondition]}
            </div>
          </div>
          {/* Contador de danos */}
          {damages.length > 0 && (
            <div className="absolute bottom-2 left-2">
              <div className="px-2 py-1 rounded-lg bg-black/70 text-white text-xs font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {damages.length}
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {damages.length === 0
                ? 'Sem danos'
                : `${damages.length} ${damages.length === 1 ? 'dano' : 'danos'}`}
            </span>
            <button
              onClick={onViewDetails}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver detalhes
            </button>
          </div>
        </div>
      </motion.div>
  );
}

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${getConditionColor()}`}>
              {getConditionIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Análise de Danos
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Condição: {CONDITION_LABELS[overallCondition]}
              </p>
            </div>
          </div>

          {/* Métricas */}
          <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>{Math.round(confidence * 100)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{(processingTime / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Imagem com overlay */}
      <div className="p-4">
        <DamageOverlay imageUrl={imageUrl} damages={damages} />
      </div>

      {/* Lista de danos */}
      {damages.length > 0 && (
        <div className="px-5 pb-5">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
            Danos Detectados
          </h4>
          <div className="space-y-2">
            {damages.map((damage, index) => (
              <motion.div
                key={damage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-xl border ${SEVERITY_COLORS[damage.severity].bg} ${SEVERITY_COLORS[damage.severity].border}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${
                        damage.severity === 'severe'
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : damage.severity === 'moderate'
                            ? 'bg-orange-100 dark:bg-orange-900/30'
                            : 'bg-yellow-100 dark:bg-yellow-900/30'
                      }`}
                    >
                      <AlertTriangle
                        className={`w-4 h-4 ${SEVERITY_COLORS[damage.severity].text}`}
                      />
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${SEVERITY_COLORS[damage.severity].text}`}>
                        {DAMAGE_TYPE_LABELS[damage.type]}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {damage.location.position}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[damage.severity].bg} ${SEVERITY_COLORS[damage.severity].text}`}
                    >
                      {SEVERITY_LABELS[damage.severity]}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {Math.round(damage.confidence * 100)}% confiança
                    </span>
                  </div>
                </div>
                {damage.description && (
                  <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 pl-9">
                    {damage.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Sem danos */}
      {damages.length === 0 && (
        <div className="px-5 pb-5">
          <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="font-medium text-green-800 dark:text-green-200">
              Nenhum dano detectado
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              O veículo aparenta estar em boas condições
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default DamageResultCard;
