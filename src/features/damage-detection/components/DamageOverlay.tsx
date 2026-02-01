/**
 * TORQ Damage Detection - Overlay Component
 * Exibe marcações visuais dos danos detectados sobre a foto
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X } from 'lucide-react';
import type { DetectedDamage, DamageSeverity } from '../types';
import { DAMAGE_TYPE_LABELS, SEVERITY_LABELS, SEVERITY_COLORS } from '../types';

interface DamageOverlayProps {
  imageUrl: string;
  damages: DetectedDamage[];
  showLabels?: boolean;
  onDamageClick?: (damage: DetectedDamage) => void;
}

export function DamageOverlay({
  imageUrl,
  damages,
  showLabels = true,
  onDamageClick,
}: DamageOverlayProps) {
  const [selectedDamage, setSelectedDamage] = useState<DetectedDamage | null>(null);
  const [hoveredDamage, setHoveredDamage] = useState<string | null>(null);

  const handleDamageClick = (damage: DetectedDamage) => {
    setSelectedDamage(damage);
    onDamageClick?.(damage);
  };

  const getSeverityColor = (severity: DamageSeverity) => {
    switch (severity) {
      case 'severe':
        return { border: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)' };
      case 'moderate':
        return { border: '#F97316', bg: 'rgba(249, 115, 22, 0.2)' };
      case 'minor':
      default:
        return { border: '#EAB308', bg: 'rgba(234, 179, 8, 0.2)' };
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      {/* Imagem de fundo */}
      <img
        src={imageUrl}
        alt="Foto do veículo"
        className="w-full h-auto object-contain"
      />

      {/* Overlay com marcações */}
      <div className="absolute inset-0">
        {damages.map((damage) => {
          const colors = getSeverityColor(damage.severity);
          const isHovered = hoveredDamage === damage.id;
          const isSelected = selectedDamage?.id === damage.id;

          return (
            <motion.div
              key={damage.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute cursor-pointer"
              style={{
                left: `${damage.boundingBox.x}%`,
                top: `${damage.boundingBox.y}%`,
                width: `${damage.boundingBox.width}%`,
                height: `${damage.boundingBox.height}%`,
              }}
              onMouseEnter={() => setHoveredDamage(damage.id)}
              onMouseLeave={() => setHoveredDamage(null)}
              onClick={() => handleDamageClick(damage)}
            >
              {/* Bounding box */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  borderWidth: isHovered || isSelected ? 3 : 2,
                  backgroundColor: isHovered || isSelected ? colors.bg : 'transparent',
                }}
                style={{
                  borderColor: colors.border,
                  borderStyle: 'solid',
                }}
              />

              {/* Ícone de alerta */}
              <motion.div
                className="absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: colors.border }}
                animate={{ scale: isHovered ? 1.2 : 1 }}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </motion.div>

              {/* Label flutuante */}
              {showLabels && (isHovered || isSelected) && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 top-full mt-2 z-10"
                >
                  <div
                    className="px-3 py-2 rounded-xl shadow-lg backdrop-blur-xl text-xs font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.85)',
                      color: 'white',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.border }}
                      />
                      <span>{DAMAGE_TYPE_LABELS[damage.type]}</span>
                      <span className="opacity-60">•</span>
                      <span className="opacity-80">{SEVERITY_LABELS[damage.severity]}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

        })}
      </div>

      {/* Contador de danos */}
      {damages.length > 0 && (
        <div className="absolute top-3 left-3">
          <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{damages.length} {damages.length === 1 ? 'dano' : 'danos'} detectado{damages.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {/* Sem danos */}
      {damages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 py-2 rounded-full bg-green-500/90 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Nenhum dano detectado</span>
          </div>
        </div>
      )}

      {/* Modal de detalhes do dano */}
      <AnimatePresence>
        {selectedDamage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4"
            onClick={() => setSelectedDamage(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={`px-4 py-3 flex items-center justify-between ${SEVERITY_COLORS[selectedDamage.severity].bg}`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`w-5 h-5 ${SEVERITY_COLORS[selectedDamage.severity].text}`}
                  />
                  <span className={`font-semibold ${SEVERITY_COLORS[selectedDamage.severity].text}`}>
                    {DAMAGE_TYPE_LABELS[selectedDamage.type]}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDamage(null)}
                  className="p-1 rounded-full hover:bg-black/10 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">Severidade</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[selectedDamage.severity].bg} ${SEVERITY_COLORS[selectedDamage.severity].text}`}
                  >
                    {SEVERITY_LABELS[selectedDamage.severity]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">Localização</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedDamage.location.position}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">Confiança</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {Math.round(selectedDamage.confidence * 100)}%
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {selectedDamage.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DamageOverlay;
