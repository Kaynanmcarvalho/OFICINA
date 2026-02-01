import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';
import { useReducedMotion } from '../../hooks';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700',
  primary: 'bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 shadow-sm',
  secondary: 'bg-secondary-500 text-white border border-secondary-500 hover:bg-secondary-600 shadow-sm',
  ghost: 'bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800',
  danger: 'bg-error-500 text-white border border-error-500 hover:bg-error-600 shadow-sm',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      isLoading = false,
      disabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileHover={!isDisabled && !prefersReducedMotion ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled && !prefersReducedMotion ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.15 }}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-lg font-medium',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        )}
        {children}
      </motion.button>

  }
);

Button.displayName = 'Button';
