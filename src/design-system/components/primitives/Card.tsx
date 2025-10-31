import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { cn } from '../../utils';
import { useReducedMotion } from '../../hooks';
import type { ComponentVariant, ComponentSize } from '../../tokens/types';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: ComponentVariant;
  size?: ComponentSize;
  hover?: boolean;
  children: ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
  glass: 'glass-effect',
  highlight: 'bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-neutral-800 border border-primary-200 dark:border-primary-800',
};

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      hover = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
        whileHover={
          hover && !prefersReducedMotion
            ? { y: -4, transition: { duration: 0.2 } }
            : undefined
        }
        className={cn(
          'rounded-2xl',
          'shadow-sm transition-shadow duration-200',
          hover && 'hover:shadow-md',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700', className)}>
      {children}
    </div>
  );
}
