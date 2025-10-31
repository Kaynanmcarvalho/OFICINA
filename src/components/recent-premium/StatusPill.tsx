import React from 'react';

interface StatusPillProps {
  status: 'in_progress' | 'completed' | 'pending' | 'cancelled';
  showGlow?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig = {
  in_progress: {
    label: 'Em andamento',
    color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    glow: 'shadow-[0_0_0_4px_rgba(245,158,11,0.15)] shadow-amber-500/30',
  },
  completed: {
    label: 'Concluído',
    color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    glow: 'shadow-[0_0_0_4px_rgba(16,185,129,0.15)] shadow-emerald-500/30',
  },
  pending: {
    label: 'Pendente',
    color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    glow: 'shadow-[0_0_0_4px_rgba(59,130,246,0.15)] shadow-blue-500/30',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    glow: 'shadow-[0_0_0_4px_rgba(239,68,68,0.15)] shadow-red-500/30',
  },
};

const sizeClasses = {
  sm: 'px-2.5 py-1 text-xs h-6',
  md: 'px-3 py-1.5 text-sm h-7',
};

/**
 * StatusPill - Badge de status com cores e glow opcional
 * Design Apple premium com estados visuais distintos
 */
const StatusPill: React.FC<StatusPillProps> = ({
  status,
  showGlow = false,
  size = 'md',
}) => {
  const config = statusConfig[status];
  const sizeClass = sizeClasses[size];

  return (
    <span
      role="status"
      aria-label={`Status: ${config.label}`}
      className={`
        inline-flex items-center justify-center
        rounded-full
        font-medium
        transition-all duration-200
        ${sizeClass}
        ${config.color}
        ${showGlow ? config.glow : ''}
      `}
    >
      {config.label}
    </span>
  );
};

export default StatusPill;
