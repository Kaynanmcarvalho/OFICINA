import React from 'react';
import IconLoader from './IconLoader';

interface ItemAvatarProps {
  type: 'car' | 'motorcycle' | 'truck' | 'van' | 'client';
  status?: 'completed';
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

const sizeMap = {
  sm: { container: 'w-12 h-12', icon: 'sm' as const },
  md: { container: 'w-14 h-14', icon: 'md' as const },
  lg: { container: 'w-16 h-16', icon: 'lg' as const },
};

const typeColors = {
  car: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
  motorcycle: 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400',
  truck: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400',
  van: 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400',
  client: 'bg-neutral-500/10 text-neutral-500 dark:bg-neutral-500/20 dark:text-neutral-400',
};

/**
 * ItemAvatar - Ícone visual para tipo de entidade
 * Design Apple premium com gradientes e badge de conclusão
 */
const ItemAvatar: React.FC<ItemAvatarProps> = ({
  type,
  status,
  size = 'md',
  showBadge = true,
}) => {
  const { container, icon } = sizeMap[size];
  const colorClass = typeColors[type];
  const showCompletedBadge = showBadge && status === 'completed';

  return (
    <div className="relative">
      <div
        className={`
          ${container}
          ${colorClass}
          rounded-2xl
          flex items-center justify-center
          transition-all duration-200
        `}
      >
        <IconLoader name={type} size={icon} />
      </div>

      {showCompletedBadge && (
        <div
          className="
            absolute -top-1 -right-1
            w-5 h-5
            bg-green-500 dark:bg-green-400
            rounded-full
            flex items-center justify-center
            border-2 border-white dark:border-neutral-900
            shadow-sm
          "
        >
          <IconLoader name="check" size="sm" className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};

export default ItemAvatar;
