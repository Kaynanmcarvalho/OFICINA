import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success = false,
      prefix,
      suffix,
      size = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const showSuccess = success && !hasError;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg border transition-all duration-200',
              'bg-white dark:bg-neutral-800',
              'text-neutral-900 dark:text-neutral-50',
              'placeholder-neutral-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              hasError
                ? 'border-error-500 focus:ring-error-500/20'
                : showSuccess
                ? 'border-success-500 focus:ring-success-500/20'
                : 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20',
              disabled && 'opacity-50 cursor-not-allowed bg-neutral-50 dark:bg-neutral-900',
              prefix && 'pl-10',
              (suffix || hasError || showSuccess) && 'pr-10',
              sizeClasses[size],
              className
            )}
            {...props}
          />

          {(suffix || hasError || showSuccess) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {hasError ? (
                <AlertCircle className="text-error-500" size={18} />
              ) : showSuccess ? (
                <CheckCircle2 className="text-success-500" size={18} />
              ) : (
                suffix
              )}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              hasError ? 'text-error-500' : 'text-neutral-500 dark:text-neutral-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
