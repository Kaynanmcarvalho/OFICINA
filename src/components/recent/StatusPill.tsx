import React from 'react';

export type StatusType = 'in_progress' | 'completed' | 'pending' | 'cancelled';
export type PillSize = 'sm' | 'md';

export interface StatusPillProps {
  /** Current status */
  status: StatusType;
  /** Show glow effect */
  showGlow?: boolean;
  /** Size variant */
  size?: PillSize;
}

// Status configuration
const statusConfig: Record<StatusType, {
  label: string;
  color: string;
  bgColor: string;
  glowColor: string;
}> = {
  in_progress: {
    label: 'Em andamento',
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-100 dark:bg-amber-500/20',
    glowColor: 'shadow-[0_0_0_4px_rgba(245,158,11,0.15),0_2px_8px_rgba(245,158,11,0.3)]',
  },
  completed: {
    label: 'Concluído',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/20',
    glowColor: 'shadow-[0_0_0_4px_rgba(16,185,129,0.15),0_2px_8px_rgba(16,185,129,0.3)]',
  },
  pending: {
    label: 'Pendente',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-500/20',
    glowColor: 'shadow-[0_0_0_4px_rgba(59,130,246,0.15),0_2px_8px_rgba(59,130,246,0.3)]',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100 dark:bg-red-500/20',
    glowColor: 'shadow-[0_0_0_4px_rgba(239,68,68,0.15),0_2px_8px_rgba(239,68,68,0.3)]',
  },
};

/**
 * StatusPill - Badge component displaying current status with color coding
 * 
 * @example
 * <StatusPill status="in_progress" />
 * <StatusPill status="completed" showGlow />
 * <StatusPill status="pending" size="sm" />
 */
const StatusPill: React.FC<StatusPillProps> = ({
  status,
  showGlow = false,
  size = 'md',
}) => {
  const config = statusConfig[status];

  const sizeClasses = {
    sm: 'h-6 px-2.5 text-[11px]', // 24px height
    md: 'h-7 px-3 text-[13px]',   // 28px height
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        rounded-[14px]
        ${config.bgColor}
        ${config.color}
        font-medium
        transition-all duration-200
        ${showGlow ? config.glowColor : ''}
      `}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  );
};

export default StatusPill;
