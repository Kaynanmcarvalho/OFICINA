/**
 * Painel de Compatibilidade de Peças
 * Exibe peças compatíveis com cross-compatibility e alternativas mais baratas
 * 
 * @version 2.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  RefreshCw,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Tag,
  Truck,
  Wrench,
} from 'lucide-react';
import { usePartsFullCompatibility } from '../hooks/usePartsFullCompatibility';
import type { PartData, CheaperAlternative } from '../services/partsFullService';

interface PartsCompatibilityPanelProps {
  vehicleId?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  onPartSelect?: (part: PartData) => void;
  className?: string;
}

const categoryLabels: Record<string, string> = {
  oil_filters: 'Filtros de Óleo',
  air_filters: 'Filtros de Ar',
  brake_pads: 'Pastilhas de Freio',
  spark_plugs: 'Velas de Ignição',
  brake_discs: 'Discos de Freio',
  shock_absorbers: 'Amortecedores',
  batteries: 'Baterias',
  chain_kits: 'Kits de Corrente',
  timing_belts: 'Correias Dentadas',
  water_pumps: 'Bombas d\'Água',
  clutch_kits: 'Kits de Embreagem',
  wheel_bearings: 'Rolamentos de Roda',
};

const categoryIcons: Record<string, React.ReactNode> = {
  oil_filters: <Wrench className="w-5 h-5" />,
  air_filters: <Wrench className="w-5 h-5" />,
  brake_pads: <Wrench className="w-5 h-5" />,
  spark_plugs: <Sparkles className="w-5 h-5" />,
  brake_discs: <Wrench className="w-5 h-5" />,
  shock_absorbers: <Wrench className="w-5 h-5" />,
  batteries: <Sparkles className="w-5 h-5" />,
  chain_kits: <Wrench className="w-5 h-5" />,
  timing_belts: <Wrench className="w-5 h-5" />,
  water_pumps: <Wrench className="w-5 h-5" />,
  clutch_kits: <Wrench className="w-5 h-5" />,
  wheel_bearings: <Wrench className="w-5 h-5" />,
};

export function PartsCompatibilityPanel({
  vehicleId,
  vehicleBrand,
  vehicleModel,
  vehicleYear,
  onPartSelect,
  className = '',
}: PartsCompatibilityPanelProps) {
  const {
    vehicleData,
    categories,
    isLoading,
    error,
    selectedCategory,
    selectedPart,
    loadVehicle,
    loadVehicleByInfo,
    selectCategory,
    selectPart,
    getPartsByCategory,
    getTotalSavings,
    formatPrice,
    clearError,
  } = usePartsFullCompatibility();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showAlternatives, setShowAlternatives] = useState<string | null>(null);

  // Load vehicle data
  useEffect(() => {
    if (vehicleId) {
      loadVehicle(vehicleId);
    } else if (vehicleBrand && vehicleModel && vehicleYear) {
      loadVehicleByInfo(vehicleBrand, vehicleModel, vehicleYear);
    }
  }, [vehicleId, vehicleBrand, vehicleModel, vehicleYear, loadVehicle, loadVehicleByInfo]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handlePartClick = (part: PartData) => {
    selectPart(part);
    onPartSelect?.(part);
  };

  const savings = getTotalSavings();

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">Carregando peças compatíveis...</span>
        </div>
      </div>
  );
}

if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-center py-12 text-red-500">
          <AlertTriangle className="w-8 h-8" />
          <span className="ml-3">{error}</span>
          <button onClick={clearError} className="ml-4 text-blue-500 hover:underline">
            Tentar novamente
          </button>
        </div>
      </div>
  );
}

if (!vehicleData) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 ${className}`}>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Truck className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Selecione um veículo para ver as peças compatíveis</p>
        </div>
      </div>
  );
}

return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{vehicleData.vehicleName}</h2>
            <p className="text-blue-100 text-sm mt-1">
              Plataforma: {vehicleData.platform} • {vehicleData.totalParts} peças compatíveis
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{vehicleData.totalParts}</div>
            <div className="text-blue-100 text-sm">peças</div>
          </div>
        </div>

        {/* Savings Banner */}
        {savings.totalSavings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white/20 rounded-xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-300" />
              <div>
                <p className="text-sm text-blue-100">Economia possível com alternativas</p>
                <p className="text-2xl font-bold text-green-300">
                  {formatPrice(savings.totalSavings)} ({savings.savingsPercent.toFixed(1)}%)
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Categories */}
      <div className="p-4">
        {Object.entries(vehicleData.partsByCategory).map(([category, parts]) => (
          <div key={category} className="mb-2">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                  {categoryIcons[category] || <Wrench className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {categoryLabels[category] || category}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {parts.length} {parts.length === 1 ? 'peça' : 'peças'}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedCategories.has(category) ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Parts List */}
            <AnimatePresence>
              {expandedCategories.has(category) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 pr-2 py-2 space-y-2">
                    {parts.map((part, index) => (
                      <PartCard
                        key={`${part.partNumber}-${index}`}
                        part={part}
                        isSelected={selectedPart?.partNumber === part.partNumber}
                        showAlternatives={showAlternatives === part.partNumber}
                        onSelect={() => handlePartClick(part)}
                        onToggleAlternatives={() => 
                          setShowAlternatives(
                            showAlternatives === part.partNumber ? null : part.partNumber
                          )
                        }
                        formatPrice={formatPrice}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// Part Card Component
interface PartCardProps {
  part: PartData;
  isSelected: boolean;
  showAlternatives: boolean;
  onSelect: () => void;
  onToggleAlternatives: () => void;
  formatPrice: (price: number) => string;
}

function PartCard({
  part,
  isSelected,
  showAlternatives,
  onSelect,
  onToggleAlternatives,
  formatPrice,
}: PartCardProps) {
  const hasAlternatives = part.cheaperAlternatives && part.cheaperAlternatives.length > 0;
  const hasCrossCompatible = part.crossCompatible && part.crossCompatible.length > 0;

  return (
    <motion.div
      layout
      className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-blue-500 shadow-lg shadow-blue-500/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
      }`}
    >
      {/* Main Part Info */}
      <div
        className="p-4 cursor-pointer"
        onClick={onSelect}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
                {part.partNumber}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {part.brand}
              </span>
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mt-2">
              {part.name}
            </h4>
            
            {/* Equivalents */}
            {part.equivalents && part.equivalents.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {part.equivalents.slice(0, 3).map((eq, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400"
                  >
                    {eq}
                  </span>
                ))}
                {part.equivalents.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{part.equivalents.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(part.avgPrice || 0)}
            </div>
            <div className="text-xs text-gray-500">preço médio</div>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {hasAlternatives && (
            <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
              <DollarSign className="w-3 h-3" />
              {part.cheaperAlternatives!.length} alternativas mais baratas
            </span>
          )}
          {hasCrossCompatible && (
            <span className="inline-flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              Compatível com {part.sharedWithCount || part.crossCompatible!.length} veículos
            </span>
          )}
          {part.confidence >= 0.9 && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Alta confiança
            </span>
          )}
        </div>
      </div>

      {/* Alternatives Section */}
      {hasAlternatives && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleAlternatives();
            }}
            className="w-full px-4 py-2 flex items-center justify-between text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Ver alternativas mais baratas
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${showAlternatives ? 'rotate-90' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showAlternatives && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-green-50 dark:bg-green-900/10"
              >
                <div className="p-4 space-y-2">
                  {part.cheaperAlternatives!.map((alt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <span className="font-mono text-sm text-green-600 dark:text-green-400">
                          {alt.partNumber}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">{alt.brand}</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{alt.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 dark:text-green-400">
                          {formatPrice(alt.avgPrice)}
                        </div>
                        <div className="text-xs text-green-500">
                          Economia: {alt.savingsPercent}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Cross Compatible Section */}
      {hasCrossCompatible && showAlternatives && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/10 p-4">
          <h5 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
            Também compatível com:
          </h5>
          <div className="flex flex-wrap gap-2">
            {part.crossCompatible!.slice(0, 5).map((cc, i) => (
              <span
                key={i}
                className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded"
              >
                {cc.vehicle}
              </span>
            ))}
            {part.crossCompatible!.length > 5 && (
              <span className="text-xs text-purple-500">
                +{part.crossCompatible!.length - 5} veículos
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default PartsCompatibilityPanel;
