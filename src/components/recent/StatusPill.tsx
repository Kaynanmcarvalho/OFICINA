import React from 'react';

interface StatusPillProps {
  status: 'in_progress' | 'completed' | 'pending' | 'cancelled';
  showGlow?: boolean;
  size?: 'sm' | 'md';
}

const StatusPill: React.FC<StatusPillProps> = ({ 
  status, 
  showGlow = false, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-6 px-2 text-xs',
    md: 'h-7 px-3 text-sm',
  };

  // Status configuration
  const getStatusConfig = () => {
    switch (status) {
      case 'in_progress':
        return {
          text: 'Em andamento',
          bgColor: 'bg-amber-100 dark:bg-amber-900/30',
          textColor: 'text-amber-800 dark:text-amber-200',
          borderColor: 'border-amber-200 dark:border-amber-700',
          glowColor: showGlow ? 'shadow-amber-500/30' : '',
        };
      case 'completed':
        return {
          text: 'Concluído',
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
          textColor: 'text-emerald-800 dark:text-emerald-200',
          borderColor: 'border-emerald-200 dark:border-emerald-700',
          glowColor: showGlow ? 'shadow-emerald-500/30' : '',
        };
      case 'pending':
        return {
          text: 'Pendente',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-200',
          borderColor: 'border-blue-200 dark:border-blue-700',
          glowColor: showGlow ? 'shadow-blue-500/30' : '',
        };
      case 'cancelled':
        return {
          text: 'Cancelado',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-800 dark:text-red-200',
          borderColor: 'border-red-200 dark:border-red-700',
          glowColor: showGlow ? 'shadow-red-500/30' : '',
        };
      default:
        return {
          text: 'Desconhecido',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          textColor: 'text-gray-800 dark:text-gray-200',
          borderColor: 'border-gray-200 dark:border-gray-700',
          glowColor: '',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      role="status"
      aria-label={`Status: ${config.text}`}
      className={`
        inline-flex 
        items-center 
        justify-center 
        rounded-full 
        font-medium 
        border 
        transition-all 
        duration-200
        ${sizeClasses[size]}
        ${config.bgColor}
        ${config.textColor}
        ${config.borderColor}
        ${showGlow ? `shadow-lg ${config.glowColor}` : ''}
      `}
    >
      {config.text}
    </span>
  );
};

export default StatusPill;