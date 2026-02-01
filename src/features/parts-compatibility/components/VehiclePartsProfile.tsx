/**
 * TORQ Parts Compatibility - Vehicle Parts Profile
 * Perfil de peças de um veículo
 */

import React, { useEffect } from 'react';
import {
  Car,
  Package,
  TrendingUp,
  Clock,
  DollarSign,
  AlertCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { usePartsCompatibility } from '../hooks/usePartsCompatibility';
import type { PartCategory } from '../types';
import { PART_CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS } from '../types';

interface VehiclePartsProfileProps {
  empresaId: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    engine?: string;
  };
  onPartClick?: (partId: string) => void;
  onCategoryClick?: (category: PartCategory) => void;
  className?: string;
}

export const VehiclePartsProfile: React.FC<VehiclePartsProfileProps> = ({
  empresaId,
  vehicleId,
  vehiclePlate,
  vehicleInfo,
  onPartClick,
  onCategoryClick,
  className = '',
}) => {
  const {
    vehicleProfile,
    isLoading,
    error,
    loadVehicleProfile,
  } = usePartsCompatibility({ empresaId });

  useEffect(() => {
    loadVehicleProfile(vehicleId, vehiclePlate, vehicleInfo);
  }, [vehicleId, vehiclePlate, vehicleInfo, loadVehicleProfile]);

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-gray-500 dark:text-gray-400">
            Carregando perfil de peças...
          </span>
        </div>
      </div>
  );
}

if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="flex items-center justify-center gap-3 text-red-500">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
        </div>
      </div>
  );
}

if (!vehicleProfile) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Top 5 categorias com mais peças
  const topCategories = Object.entries(vehicleProfile.compatiblePartsByCategory)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">
              {vehicleProfile.vehicleInfo.make} {vehicleProfile.vehicleInfo.model}
            </h3>
            <p className="text-sm text-blue-100">
              {vehicleProfile.vehicleInfo.year} • {vehicleProfile.vehiclePlate}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
            <Package className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {vehicleProfile.totalPartsUsed}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Peças usadas</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(vehicleProfile.totalSpentOnParts)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total gasto</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-purple-500 mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {PART_CATEGORY_LABELS[vehicleProfile.mostUsedCategory]}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Mais usada</p>
        </div>
      </div>

      {/* Categorias compatíveis */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Peças Compatíveis por Categoria
        </h4>
        <div className="space-y-2">
          {topCategories.map(([category, count]) => {
            const cat = category as PartCategory;
            const colors = CATEGORY_COLORS[cat];
            
            return (
              <button
                key={category}
                onClick={() => onCategoryClick?.(cat)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                    <Package className={`w-4 h-4 ${colors.icon}`} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {PART_CATEGORY_LABELS[cat]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {count}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recomendações */}
      {vehicleProfile.recommendedParts.length > 0 && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Recomendações
          </h4>
          <div className="space-y-2">
            {vehicleProfile.recommendedParts.map((rec, index) => (
              <button
                key={index}
                onClick={() => onPartClick?.(rec.partId)}
                className="w-full flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {rec.partName}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    {rec.reason}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  rec.priority === 'high'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : rec.priority === 'medium'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Histórico recente */}
      {vehicleProfile.partsHistory.length > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            Histórico Recente
          </h4>
          <div className="space-y-2">
            {vehicleProfile.partsHistory.slice(0, 5).map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {record.partName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {record.partNumber} • {formatDate(record.usedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(record.price)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    x{record.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
