import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks';
import { cn } from '../../utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function ThemeToggle({ className, size = 'md' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={cn(
        'rounded-xl transition-colors',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        sizeClasses[size],
        className
      )}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
      >
        {isDark ? (
          <Sun className="text-amber-500" size={iconSizes[size]} />
        ) : (
          <Moon className="text-neutral-600" size={iconSizes[size]} />
        )}
      </motion.div>
    </motion.button>
  );
}
