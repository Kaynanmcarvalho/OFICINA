import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Calendar, 
  DollarSign, 
  Clock,
  TrendingUp,
  Award,
  Wrench,
  Gauge,
  Fuel,
  Palette,
  Hash,
  MapPin,
  Star,
  Activity
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { useVehicleHistory } from '../../hooks/useVehicleHistory';
import { formatDate } from '../../utils/dateHelpers';

const VehicleSummary = ({ vehicleData, plate, empresaId, className = '' }) => {
  const { stats, loading } = useVehicleHistory(plate, empresaId);
  const [showDetails, setShowDetails] = useState(false);

  if (!vehicleData && !plate) return null;

  // Dados do veículo com fallbacks
  const brand = vehicleData?.brand || vehicleData?.vehicleBrand || 'Marca';
  const model = vehicleData?.model || vehicleData?.vehicleModel || 'Modelo';
  const year = vehicleData?.year || vehicleData?.vehicleYear;
  const color = vehicleData?.color || vehicleData?.vehicleColor;
  const mileage = vehicleData?.mileage || vehicleData?.kilometragem;
  const fuelLevel = vehicleData?.fuelLevel || vehicleData?.nivelCombustivel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {/* Apple-style Minimalist Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Minimalist Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {brand} {model}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-mono font-medium">{plate}</span>
                {year && <><span>•</span><span>{year}</span></>}
                {color && <><span>•</span><span>{color}</span></>}
              </div>
            </div>
            
            {stats && stats.totalVisits > 0 && (
              <div className="text-right">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalVisits}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.totalVisits === 1 ? 'visita' : 'visitas'}
                </div>
              </div>
            )}
          </div>

          {/* Clean Details */}
          {(mileage || fuelLevel) && (
            <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              {mileage && (
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Kilometragem</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parseInt(mileage).toLocaleString('pt-BR')} km
                  </div>
                </div>
              )}
              {fuelLevel && (
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Combustível</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {fuelLevel}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Minimalist Stats */}
          {!loading && stats && stats.totalVisits > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              <div className="bg-white dark:bg-gray-900 p-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Visitas</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalVisits}</div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 p-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dias atrás</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.daysSinceLastVisit || 0}</div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 p-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total gasto</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalSpent?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0
                  }) || 'R$ 0'}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 p-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ticket médio</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.averageTicket?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0
                  }) || 'R$ 0'}
                </div>
              </div>
            </div>
          )}

          {/* Minimalist Services */}
          {stats?.frequentServices && stats.frequentServices.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Serviços frequentes</div>
              <div className="flex flex-wrap gap-2">
                {stats.frequentServices.slice(0, 5).map((service) => (
                  <div
                    key={service.name}
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {service.name} <span className="text-gray-400">({service.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minimalist Last Visit */}
          {stats?.lastVisit && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Última visita</div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(stats.lastVisit.date)}
                  </div>
                  {stats.lastVisit.services && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stats.lastVisit.services.join(', ')}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {showDetails ? 'Ocultar' : 'Ver mais'}
                </button>
              </div>
            </div>
          )}

          {/* Minimalist Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Carregando...
              </p>
            </div>
          )}

          {/* Minimalist Empty State */}
          {!loading && (!stats || stats.totalVisits === 0) && (
            <div className="text-center py-8">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Primeira visita deste veículo
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleSummary;
