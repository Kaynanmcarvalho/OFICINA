import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ItemAvatar from './ItemAvatar';
import StatusPill from './StatusPill';
import ItemMetaRow from './ItemMetaRow';
import ItemActions from './ItemActions';

export interface RecordItem {
  id: string;
  type: 'car' | 'motorcycle' | 'truck' | 'van' | 'client';
  status: 'in_progress' | 'completed' | 'pending' | 'cancelled';
  primaryText: string;
  secondaryText: string;
  plate?: string;
  model?: string;
  date: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface RecentItemProps {
  item: RecordItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
  onAction?: (action: string) => void;
  variant?: 'default' | 'compact' | 'expanded';
  showCheckbox?: boolean;
  delay?: number;
}

/**
 * RecentItem - Card individual de registro
 * Design Apple premium com glassmorphism e microinterações
 */
const RecentItem: React.FC<RecentItemProps> = ({
  item,
  isSelected = false,
  onSelect,
  onClick,
  onAction,
  variant = 'default',
  showCheckbox = false,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const heightClass = {
    default: 'h-22',
    compact: 'h-18',
    expanded: 'h-auto',
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.26,
        delay: delay * 0.05,
        ease: [0.2, 0.9, 0.2, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="article"
      aria-label={`${item.primaryText}, ${item.status}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`
        ${heightClass}
        px-4 py-3
        rounded-2xl
        bg-white/80 dark:bg-neutral-800/80
        backdrop-blur-md
        border border-neutral-200/50 dark:border-neutral-700/50
        shadow-elevation-2
        transition-all duration-200 ease-apple
        cursor-pointer
        ${isHovered ? '-translate-y-0.5 shadow-elevation-3' : ''}
        ${isSelected ? 'ring-2 ring-accent-500 border-accent-500/50' : ''}
        hover:border-neutral-300/50 dark:hover:border-neutral-600/50
        active:scale-[0.995]
        focus:outline-none focus:ring-2 focus:ring-accent-500/50
      `}
    >
      <div className="flex items-center gap-4 h-full">
        {/* Checkbox */}
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect?.(item.id);
            }}
            className="
              w-5 h-5
              rounded
              border-2 border-neutral-300 dark:border-neutral-600
              text-accent-500
              focus:ring-2 focus:ring-accent-500/50
              transition-colors
            "
            aria-label={`Selecionar ${item.primaryText}`}
          />
        )}

        {/* Avatar */}
        <ItemAvatar
          type={item.type}
          status={item.status === 'completed' ? 'completed' : undefined}
          size="md"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-0 truncate">
            {item.primaryText}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
            {item.secondaryText}
          </p>
          <div className="mt-1.5">
            <ItemMetaRow
              plate={item.plate}
              model={item.model}
              date={item.date}
              tags={item.tags}
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <StatusPill status={item.status} showGlow={isHovered} />
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          <ItemActions
            onOpen={() => onAction?.('open')}
            onEdit={() => onAction?.('edit')}
            onMore={() => onAction?.('more')}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RecentItem;
