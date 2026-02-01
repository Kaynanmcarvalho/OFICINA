import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface DashboardCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'glass' | 'highlight';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isEmpty?: boolean;
  children?: ReactNode;
}

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantClasses = {
  default: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
  glass: 'bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50',
  highlight: 'bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-neutral-800 border border-primary-200 dark:border-primary-800',
};

export const DashboardCard = ({
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
  className = '',
  ...props
}: DashboardCardProps) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
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
        className={`rounded-2xl ${sizeClasses[size]} ${variantClasses[variant]} ${className} flex items-center justify-center`}
        {...props}
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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`rounded-2xl ${sizeClasses[size]} ${variantClasses[variant]} ${className} shadow-sm hover:shadow-md transition-shadow duration-200 group`}
      {...props}
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
                  className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                    trend.isPositive
                      ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                      : 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
                  }`}
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

      {children && <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">{children}</div>}
    </motion.div>
  );
};

export default DashboardCard;
