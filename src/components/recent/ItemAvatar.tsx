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

  // Type-specific gradient backgrounds
  const getTypeStyles = () => {
    switch (type) {
      case 'car':
        return {
          background: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20',
          iconColor: 'text-blue-600 dark:text-white',
        };
      case 'motorcycle':
        return {
          background: 'bg-gradient-to-br from-red-500/15 to-orange-500/25 dark:from-red-400/20 dark:to-orange-400/30',
          iconColor: 'text-red-600 dark:text-white',
        };
      case 'truck':
        return {
          background: 'bg-gradient-to-br from-purple-500/10 to-purple-600/20',
          iconColor: 'text-purple-600 dark:text-white',
        };
      case 'van':
        return {
          background: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/20',
          iconColor: 'text-emerald-600 dark:text-white',
        };
      case 'client':
        return {
          background: 'bg-gradient-to-br from-neutral-500/10 to-neutral-600/20',
          iconColor: 'text-neutral-600 dark:text-white',
        };
      default:
        return {
          background: 'bg-gradient-to-br from-neutral-500/10 to-neutral-600/20',
          iconColor: 'text-neutral-600 dark:text-white',
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