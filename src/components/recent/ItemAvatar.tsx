import React from 'react';
import IconLoader from './IconLoader';
import VehicleIcons from './VehicleIcons';

interface ItemAvatarProps {
  type: 'car' | 'motorcycle' | 'truck' | 'van' | 'client';
  status?: 'completed';
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

const ItemAvatar: React.FC<ItemAvatarProps> = ({ 
  type, 
  status, 
  size = 'md', 
  showBadge = true 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  };

  // Type-specific gradient backgrounds - Premium sober colors
  const getTypeStyles = () => {
    switch (type) {
      case 'car':
        return {
          background: 'bg-gradient-to-br from-slate-500/10 to-slate-600/15 dark:from-slate-400/15 dark:to-slate-500/20',
          iconColor: 'text-slate-600 dark:text-slate-300',
        };
      case 'motorcycle':
        return {
          background: 'bg-gradient-to-br from-gray-500/10 to-gray-600/15 dark:from-gray-400/15 dark:to-gray-500/20',
          iconColor: 'text-gray-600 dark:text-gray-300',
        };
      case 'truck':
        return {
          background: 'bg-gradient-to-br from-zinc-500/10 to-zinc-600/15 dark:from-zinc-400/15 dark:to-zinc-500/20',
          iconColor: 'text-zinc-600 dark:text-zinc-300',
        };
      case 'van':
        return {
          background: 'bg-gradient-to-br from-stone-500/10 to-stone-600/15 dark:from-stone-400/15 dark:to-stone-500/20',
          iconColor: 'text-stone-600 dark:text-stone-300',
        };
      case 'client':
        return {
          background: 'bg-gradient-to-br from-neutral-500/10 to-neutral-600/15 dark:from-neutral-400/15 dark:to-neutral-500/20',
          iconColor: 'text-neutral-600 dark:text-neutral-300',
        };
      default:
        return {
          background: 'bg-gradient-to-br from-neutral-500/10 to-neutral-600/15 dark:from-neutral-400/15 dark:to-neutral-500/20',
          iconColor: 'text-neutral-600 dark:text-neutral-300',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="relative">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${typeStyles.background}
          rounded-2xl 
          flex 
          items-center 
          justify-center 
          transition-all 
          duration-200
        `}
      >
        <VehicleIcons 
          type={type} 
          size={iconSizes[size]} 
          className={typeStyles.iconColor}
        />
      </div>
      
      {/* Completed Badge */}
      {status === 'completed' && showBadge && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
          <IconLoader 
            name="check" 
            size="sm" 
            className="text-white w-3 h-3"
          />
        </div>
      )}
    </div>
  );
};

export default ItemAvatar;