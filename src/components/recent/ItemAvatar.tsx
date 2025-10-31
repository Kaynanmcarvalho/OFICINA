import React from 'react';
import IconLoader from './IconLoader';

export type EntityType = 'car' | 'motorcycle' | 'truck' | 'van' | 'client';
export type AvatarSize = 'sm' | 'md' | 'lg';

export interface ItemAvatarProps {
  /** Type of entity */
  type: EntityType;
  /** Status - shows completed badge if 'completed' */
  status?: 'completed';
  /** Size variant */
  size?: AvatarSize;
  /** Show completed badge overlay */
  showBadge?: boolean;
}

// Type-specific gradient backgrounds
const typeGradients: Record<EntityType, string> = {
  car: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20',
  motorcycle: 'bg-gradient-to-br from-orange-500/10 to-orange-600/20',
  truck: 'bg-gradient-to-br from-purple-500/10 to-purple-600/20',
  van: 'bg-gradient-to-br from-green-500/10 to-green-600/20',
  client: 'bg-gradient-to-br from-neutral-400/10 to-neutral-500/20',
};

// Type-specific icon colors
const typeColors: Record<EntityType, string> = {
  car: 'text-blue-500',
  motorcycle: 'text-orange-500',
  truck: 'text-purple-500',
  van: 'text-green-500',
  client: 'text-neutral-500',
};

/**
 * ItemAvatar - Visual indicator for entity type and status
 * 
 * @example
 * <ItemAvatar type="car" />
 * <ItemAvatar type="motorcycle" status="completed" showBadge />
 * <ItemAvatar type="client" size="lg" />
 */
const ItemAvatar: React.FC<ItemAvatarProps> = ({
  type,
  status,
  size = 'md',
  showBadge = true,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12', // 48px
    md: 'w-14 h-14', // 56px
    lg: 'w-16 h-16', // 64px
  };

  const iconSizes = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  };

  const showCompletedBadge = status === 'completed' && showBadge;

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`
          ${sizeClasses[size]}
          rounded-[14px]
          ${typeGradients[type]}
          flex items-center justify-center
          transition-all duration-200
        `}
      >
        <IconLoader
          name={type}
          size={iconSizes[size]}
          className={typeColors[type]}
          aria-label={`${type} icon`}
        />
      </div>

      {/* Completed Badge Overlay */}
      {showCompletedBadge && (
        <div
          className="
            absolute -top-1 -right-1
            w-5 h-5
            rounded-full
            bg-emerald-500
            border-2 border-white dark:border-neutral-900
            flex items-center justify-center
            shadow-elevation-2
          "
          aria-label="Completed"
        >
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
