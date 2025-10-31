import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../utils';
import { useReducedMotion } from '../../../hooks';
import type { ComponentVariant, ComponentSize } from '../../../tokens/types';

export interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: ComponentVariant;
  size?: ComponentSize | 'compact';
  isLoading?: boolean;
  isEmpty?: boolean;
  children?: ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  compact: 'p-4',
};

const variantClasses = {
  default: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
  glass: 'glass-effect',
  highlight: 'bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-neutral-800 border border-primary-200 dark:border-primary-800',
};

export function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'glass',
  size = 'md',
  isLoading = false,
  isEmpty = false,
  children,
  className,
}: DashboardCardProps) {
  const prefersReducedMotion = useReducedMotion();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-2xl',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
        </div>
      </motion.div>
    );
  }

  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-2xl flex items-center justify-center',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        <div className="text-center text-neutral-400 dark:text-neutral-600">
          <p className="text-sm">Sem dados disponíveis</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        !prefersReducedMotion
          ? { y: -4, transition: { duration: 0.2 } }
          : undefined
      }
      className={cn(
        'rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 group',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {Icon && (
              <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {title}
            </h3>
          </div>

          <div className="mt-2">
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              {value}
            </p>
          </div>

          {(subtitle || trend) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    'inline-flex items-center text-xs font-medium px-2 py-1 rounded-full',
                    trend.isPositive
                      ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                      : 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
                  )}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {children && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          {children}
        </div>
      )}
    </motion.div>
  );
}
