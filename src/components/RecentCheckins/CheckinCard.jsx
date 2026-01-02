/**
 * CheckinCard Component
 * Premium Apple-level UI for displaying vehicle check-in information
 * 
 * Features:
 * - Three-zone horizontal layout (icon, info, actions)
 * - Adaptive dark/light theming
 * - Smooth microinteractions with Framer Motion
 * - Responsive design with no overflow
 * - Accessibility compliant
 * - Performance optimized with React.memo
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Copy, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { detectVehicleType } from '../../services/vehicleTypeDetector';
import { VehicleTypeIcon } from '../../utils/icons/vehicleIcons';

const CheckinCard = memo(({ checkin, isSelected, onSelect, onViewDetails }) => {
  // Data validation and fallbacks
  const clientName = checkin.clientName || 'Cliente não identificado';
  const vehicleModel = checkin.vehicleModel || 'Veículo não especificado';
  const vehiclePlate = checkin.vehiclePlate || '---';
  const status = checkin.status || 'active';
  
  // Vehicle type detection
  const vehicleType = checkin.vehicleType || detectVehicleType(
    checkin.vehicleBrand, 
    checkin.vehicleModel
  );
  
  // Status helpers
  const isCompleted = status === 'completed';
  const isPending = status === 'pending';
  const isActive = status === 'active';
  
  // Date formatting
  const formatDate = (date) => {
    try {
      const d = new Date(date);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Invalid date format:', date);
      return 'Data inválida';
    }
  };
  
  // Copy ID to clipboard
  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(checkin.id);
    toast.success('ID copiado!', {
      duration: 2000,
      style: {
        background: '#1C1C1E',
        color: '#FFFFFF',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  };
  
  // Handle card click
  const handleCardClick = () => {
    onSelect(checkin);
  };
  
  // Handle action button click
  const handleActionClick = (e) => {
    e.stopPropagation();
    onViewDetails(checkin);
  };
  
  // Status badge configuration
  const getStatusConfig = () => {
    if (isCompleted) {
      return {
        label: 'Concluído',
        bgColor: 'rgba(16,185,129,0.15)',
        textColor: '#6EE7B7',
        borderColor: 'rgba(16,185,129,0.3)',
        glowColor: 'rgba(16,185,129,0.2)'
      };
    }
    if (isPending) {
      return {
        label: 'Aguardando',
        bgColor: 'rgba(59,130,246,0.15)',
        textColor: '#93C5FD',
        borderColor: 'rgba(59,130,246,0.3)',
        glowColor: 'rgba(59,130,246,0.2)'
      };
    }
    return {
      label: 'Em andamento',
      bgColor: 'rgba(245,158,11,0.15)',
      textColor: '#FCD34D',
      borderColor: 'rgba(245,158,11,0.3)',
      glowColor: 'rgba(245,158,11,0.2)'
    };
  };
  
  const statusConfig = getStatusConfig();
  
  // Icon container configuration - Premium sober colors
  const getIconConfig = () => {
    // Detecta tipo de veículo
    const isMoto = vehicleType === 'motorcycle' || vehicleType === 'moto';
    
    if (isCompleted || isSelected) {
      return {
        bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.18))',
        shadow: '0 4px 12px rgba(16,185,129,0.15)',
        iconColor: '#10B981'
      };
    }
    
    // Cores sóbrias e premium por tipo de veículo
    if (isMoto) {
      return {
        bgGradient: 'linear-gradient(135deg, rgba(107,114,128,0.12), rgba(75,85,99,0.18))',
        shadow: '0 4px 12px rgba(107,114,128,0.15)',
        iconColor: '#6B7280' // Cinza neutro elegante
      };
    }
    
    // Carro - azul slate sóbrio
    return {
      bgGradient: 'linear-gradient(135deg, rgba(100,116,139,0.12), rgba(71,85,105,0.18))',
      shadow: '0 4px 12px rgba(100,116,139,0.15)',
      iconColor: '#64748B' // Slate elegante
    };
  };
  
  const iconConfig = getIconConfig();
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.01,
        y: -2,
        willChange: 'transform',
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
      }}
      onClick={handleCardClick}
      role="button"
      aria-label={`Check-in de ${clientName} - ${vehicleModel} - ${statusConfig.label}`}
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="w-full max-w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      style={{
        transition: 'all 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      {/* Card Container */}
      <div 
        className={`
          relative w-full rounded-2xl p-4
          transition-all duration-300 ease-out
        `}
        style={{
          background: isSelected 
            ? 'linear-gradient(135deg, #1A1A1C 0%, #2A2A2E 100%)' 
            : 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
          border: isSelected 
            ? '1px solid rgba(16,185,129,0.5)' 
            : '1px solid rgba(255,255,255,0.08)',
          boxShadow: isSelected 
            ? '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.3)' 
            : '0 4px 20px rgba(0,0,0,0.4)',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Content Layout - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full max-w-full">
          
          {/* Left Zone - Vehicle Icon */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              minHeight: '48px',
              borderRadius: '12px',
              background: iconConfig.bgGradient,
              boxShadow: iconConfig.shadow,
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isCompleted ? (
              <CheckCircle 
                className="text-emerald-400" 
                size={24}
                strokeWidth={2}
              />
            ) : (
              <VehicleTypeIcon 
                type={vehicleType}
                className={isSelected ? 'text-emerald-400' : 'text-blue-400'}
                size={24}
              />
            )}
          </motion.div>
          
          {/* Middle Zone - Info Column */}
          <div className="flex-1 min-w-0" style={{ overflow: 'hidden' }}>
            
            {/* Owner Name Row */}
            <div className="flex items-center gap-2 mb-1">
              <h4 
                className="font-semibold text-white truncate"
                style={{ fontSize: '14px', lineHeight: '1.5' }}
              >
                {clientName}
              </h4>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={copyToClipboard}
                className="flex-shrink-0 text-gray-500 hover:text-emerald-400 transition-colors"
                aria-label="Copiar ID do check-in"
                title="Copiar ID"
                style={{ width: '20px', height: '20px' }}
              >
                <Copy size={12} />
              </motion.button>
            </div>
            
            {/* Vehicle Info Row */}
            <p 
              className="text-gray-400 truncate mb-1"
              style={{ fontSize: '12px', lineHeight: '1.5' }}
            >
              {vehicleModel} • <span className="font-mono text-gray-300">{vehiclePlate}</span>
            </p>
            
            {/* Timestamp Row */}
            <div 
              className="flex items-center gap-1 text-gray-500"
              style={{ fontSize: '11px', lineHeight: '1.5' }}
            >
              <Clock size={12} className="flex-shrink-0" />
              <time 
                dateTime={checkin.createdAt}
                className="truncate"
              >
                {formatDate(checkin.createdAt)}
              </time>
            </div>
          </div>
          
          {/* Right Zone - Action Column */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto sm:ml-0">
            
            {/* Status Badge */}
            <span
              role="status"
              aria-label={`Status: ${statusConfig.label}`}
              className="px-2.5 py-1 rounded-full font-semibold"
              style={{
                fontSize: '11px',
                letterSpacing: '0.01em',
                background: statusConfig.bgColor,
                color: statusConfig.textColor,
                border: `1px solid ${statusConfig.borderColor}`,
                boxShadow: `0 0 12px ${statusConfig.glowColor}`
              }}
            >
              {statusConfig.label}
            </span>
            
            {/* Action Button */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.15 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              onClick={handleActionClick}
              className="rounded-lg transition-all duration-200"
              aria-label="Ver detalhes do check-in"
              title="Ver detalhes"
              style={{
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isSelected 
                  ? 'rgba(16,185,129,0.12)' 
                  : 'rgba(100,116,139,0.08)',
                border: isSelected 
                  ? '1px solid rgba(16,185,129,0.25)' 
                  : '1px solid rgba(100,116,139,0.15)',
                color: isSelected ? '#10B981' : '#64748B'
              }}
            >
              <ExternalLink size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if checkin.id or isSelected changes
  return prevProps.checkin.id === nextProps.checkin.id &&
         prevProps.isSelected === nextProps.isSelected;
});

CheckinCard.displayName = 'CheckinCard';

export default CheckinCard;
