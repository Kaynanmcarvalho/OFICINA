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
  metadata?: {
    clientId?: string;
    vehicleId?: string;
    serviceType?: string;
    assignedTo?: string;
    priority?: 'low' | 'medium' | 'high';
    estimatedCompletion?: Date;
    notes?: string;
  };
}

export interface ItemAction {
  type: 'open' | 'edit' | 'duplicate' | 'complete' | 'delete';
  itemId: string;
}

interface RecentItemProps {
  item: RecordItem;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
  onAction?: (action: ItemAction) => void;
  variant?: 'default' | 'compact' | 'expanded';
  showCheckbox?: boolean;
  delay?: number;
}

const RecentItem: React.FC<RecentItemProps> = ({
  item,
  isSelected = false,
  isHovered = false,
  onSelect,
  onClick,
  onAction,
  variant = 'default',
  showCheckbox = false,
  delay = 0,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const heightClasses = {
    default: 'h-22',
    compact: 'h-18',
    expanded: 'h-auto min-h-22',
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, input')) {
      return;
    }
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect?.(item.id);
  };

  // Animation variants
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 8 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.26,
        delay: delay * 0.05,
        ease: [0.2, 0.9, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { 
        duration: 0.15 
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: [0.2, 0.9, 0.2, 1],
      },
    },
    tap: {
      scale: 0.995,
      transition: {
        duration: 0.1,
      },
    },
  };

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={prefersReducedMotion ? {} : "hover"}
      whileTap={prefersReducedMotion ? {} : "tap"}
    >
      <div
        className={`
          ${heightClasses[variant]}
          rounded-2xl 
          bg-white dark:bg-gray-800 
          border 
          ${isSelected 
            ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20' 
            : 'border-black/6 dark:border-white/10'
          }
          shadow-sm 
          hover:shadow-md 
          cursor-pointer
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500/20 
          focus:ring-offset-2
        `}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        role="article"
        aria-label={`${item.primaryText}, ${item.status}`}
        tabIndex={0}
      >
      <div className="flex items-center gap-4 p-4 h-full">
        {/* Selection Checkbox */}
        {(showCheckbox || isSelected || isHovering) && (
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="
                w-5 h-5 
                text-blue-600 
                bg-white dark:bg-gray-700 
                border-gray-300 dark:border-gray-600 
                rounded 
                focus:ring-blue-500 
                focus:ring-2
                transition-all
                duration-200
              "
              aria-label={`Selecionar ${item.primaryText}`}
            />
          </div>
        )}

        {/* Avatar */}
        <div className="flex-shrink-0">
          <ItemAvatar 
            type={item.type} 
            status={item.status === 'completed' ? 'completed' : undefined}
            size="md"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Primary Text */}
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {item.primaryText}
          </h3>
          
          {/* Secondary Text */}
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {item.secondaryText}
          </p>
          
          {/* Meta Row */}
          <ItemMetaRow
            plate={item.plate}
            model={item.model}
            date={item.date}
            tags={item.tags}
            showRelativeTime={true}
          />
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <StatusPill 
            status={item.status} 
            showGlow={isHovering}
            size="md"
          />
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          <ItemActions
            onOpen={() => onAction?.({ type: 'open', itemId: item.id })}
            onEdit={() => onAction?.({ type: 'edit', itemId: item.id })}
            onDuplicate={() => onAction?.({ type: 'duplicate', itemId: item.id })}
            onComplete={() => onAction?.({ type: 'complete', itemId: item.id })}
            onDelete={() => onAction?.({ type: 'delete', itemId: item.id })}
          />
        </div>
      </div>
      </div>
    </motion.div>
  );
};

export default RecentItem;