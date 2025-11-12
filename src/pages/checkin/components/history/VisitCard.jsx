import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Clock, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { formatDate, getHoursSince } from '../../utils/dateHelpers';

const VisitCard = ({ visit, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Concluído',
          icon: CheckCircle,
          className: 'bg-green-500 text-white'
        };
      case 'in_progress':
        return {
          label: 'Em andamento',
          icon: AlertCircle,
          className: 'bg-orange-500 text-white'
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          icon: AlertCircle,
          className: 'bg-red-500 text-white'
        };
      default:
        return {
          label: 'Desconhecido',
          icon: AlertCircle,
          className: 'bg-gray-500 text-white'
        };
    }
  };

  const statusConfig = getStatusConfig(visit.status);
  const StatusIcon = statusConfig.icon;
  const duration = visit.completedAt && visit.createdAt 
    ? getHoursSince(visit.createdAt) - getHoursSince(visit.completedAt)
    : null;

  return (
    <GlassCard
      className="overflow-hidden cursor-pointer group"
      onClick={onClick}
      hover={true}
    >
      {/* Image */}
      <div className="relative h-36 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {visit.entryPhotos && visit.entryPhotos[0] && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={visit.entryPhotos[0]}
              alt="Entrada do veículo"
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Wrench className="w-10 h-10 text-gray-400" />
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-1.5 right-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${statusConfig.className}`}>
          <StatusIcon className="w-2.5 h-2.5" />
          {statusConfig.label}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-3 space-y-2.5">
        {/* Date and Value */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(visit.createdAt)}</span>
          </div>
          {visit.totalValue && (
            <div className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400">
              <DollarSign className="w-3.5 h-3.5" />
              <span>
                {visit.totalValue.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0
                })}
              </span>
            </div>
          )}
        </div>

        {/* Services */}
        {visit.services && visit.services.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {visit.services.slice(0, 2).map((service, index) => (
              <span
                key={index}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {service}
              </span>
            ))}
            {visit.services.length > 2 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium">
                +{visit.services.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Duration */}
        {duration && (
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
            <Clock className="w-2.5 h-2.5" />
            <span>{Math.abs(duration)}h de atendimento</span>
          </div>
        )}

        {/* Click indicator */}
        <div className="text-[10px] text-center text-gray-400 dark:text-gray-500 pt-1.5 border-t border-gray-200 dark:border-gray-700">
          Clique para ver detalhes
        </div>
      </div>
    </GlassCard>
  );
};

export default VisitCard;
