import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemAvatar from './ItemAvatar';
import StatusPill from './StatusPill';
import ItemMetaRow from './ItemMetaRow';
import ItemActions from './ItemActions';
import { RecordItem, ItemAction } from './RecentItem';

interface RecentItemVariedProps {
  item: RecordItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
  onAction?: (action: ItemAction) => void;
  showCheckbox?: boolean;
  delay?: number;
  index?: number;
}

const RecentItemVaried: React.FC<RecentItemVariedProps> = ({
  item,
  isSelected = false,
  onSelect,
  onClick,
  onAction,
  showCheckbox = false,
  delay = 0,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Layout variations based on index
  const getLayoutVariant = () => {
    const variants = ['compact', 'expanded', 'minimal', 'detailed'];
    return variants[index % variants.length];
  };

  const layoutVariant = getLayoutVariant();

  // Theme-aware colors
  const isDark = document.documentElement.classList.contains('dark');
  
  const themeColors = {
    cardBg: isDark ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200/50',
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-700',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    shadow: isDark ? 'shadow-xl shadow-black/20' : 'shadow-lg shadow-gray-900/10',
    accent: getVehicleAccent(),
  };

  // Vehicle-specific accent colors
  function getVehicleAccent() {
    const accents = {
      car: isDark ? 'border-blue-500/50 hover:border-blue-400/70' : 'border-blue-500/50 hover:border-blue-600/70',
      motorcycle: isDark ? 'border-orange-500/50 hover:border-orange-400/70' : 'border-orange-500/50 hover:border-orange-600/70',
      truck: isDark ? 'border-purple-500/50 hover:border-purple-400/70' : 'border-purple-500/50 hover:border-purple-600/70',
      van: isDark ? 'border-emerald-500/50 hover:border-emerald-400/70' : 'border-emerald-500/50 hover:border-emerald-600/70',
      client: isDark ? 'border-gray-500/50 hover:border-gray-400/70' : 'border-gray-500/50 hover:border-gray-600/70',
    };
    return accents[item.type] || accents.car;
  }

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;
    onClick?.();
  };

  // Compact Layout
  const CompactLayout = () => (
    <div className="flex items-center gap-4 p-4">
      <ItemAvatar type={item.type} status={item.status === 'completed' ? 'completed' : undefined} size="sm" />
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold truncate ${themeColors.text}`}>{item.primaryText}</h3>
        <p className={`text-sm truncate ${themeColors.textMuted}`}>{item.secondaryText}</p>
      </div>
      <StatusPill status={item.status} size="sm" />
      <ItemActions
        onOpen={() => onAction?.({ type: 'open', itemId: item.id })}
        onEdit={() => onAction?.({ type: 'edit', itemId: item.id })}
        onComplete={() => onAction?.({ type: 'complete', itemId: item.id })}
        onDelete={() => onAction?.({ type: 'delete', itemId: item.id })}
      />
    </div>

  // Expanded Layout
  const ExpandedLayout = () => (
    <div className="p-6">
      <div className="flex items-start gap-4 mb-4">
        <ItemAvatar type={item.type} status={item.status === 'completed' ? 'completed' : undefined} size="lg" />
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${themeColors.text} mb-1`}>{item.primaryText}</h3>
          <p className={`${themeColors.textSecondary} mb-2`}>{item.secondaryText}</p>
          <ItemMetaRow
            plate={item.plate}
            model={item.model}
            date={item.date}
            tags={item.tags}
            showRelativeTime={true}
          />
        </div>
        <div className="flex flex-col gap-2">
          <StatusPill status={item.status} size="md" showGlow={isHovered} />
          <ItemActions
            onOpen={() => onAction?.({ type: 'open', itemId: item.id })}
            onEdit={() => onAction?.({ type: 'edit', itemId: item.id })}
            onComplete={() => onAction?.({ type: 'complete', itemId: item.id })}
            onDelete={() => onAction?.({ type: 'delete', itemId: item.id })}
          />
        </div>
      </div>
    </div>

  // Minimal Layout
  const MinimalLayout = () => (
    <div className="flex items-center gap-3 p-3">
      <div className="flex items-center gap-3 flex-1">
        <ItemAvatar type={item.type} status={item.status === 'completed' ? 'completed' : undefined} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold truncate ${themeColors.text}`}>{item.primaryText}</h3>
            <StatusPill status={item.status} size="sm" />
          </div>
          <p className={`text-sm truncate ${themeColors.textMuted}`}>{item.secondaryText}</p>
        </div>
      </div>
      <ItemActions
        onOpen={() => onAction?.({ type: 'open', itemId: item.id })}
        onEdit={() => onAction?.({ type: 'edit', itemId: item.id })}
        onComplete={() => onAction?.({ type: 'complete', itemId: item.id })}
        onDelete={() => onAction?.({ type: 'delete', itemId: item.id })}
      />
    </div>

  // Detailed Layout
  const DetailedLayout = () => (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <ItemAvatar type={item.type} status={item.status === 'completed' ? 'completed' : undefined} size="md" />
          <div>
            <h3 className={`text-lg font-semibold ${themeColors.text}`}>{item.primaryText}</h3>
            <p className={`text-sm ${themeColors.textSecondary}`}>{item.secondaryText}</p>
          </div>
        </div>
        <StatusPill status={item.status} size="md" showGlow={isHovered} />
      </div>
      <div className="flex items-center justify-between">
        <ItemMetaRow
          plate={item.plate}
          model={item.model}
          date={item.date}
          tags={item.tags}
          showRelativeTime={true}
        />
        <ItemActions
          onOpen={() => onAction?.({ type: 'open', itemId: item.id })}
          onEdit={() => onAction?.({ type: 'edit', itemId: item.id })}
          onComplete={() => onAction?.({ type: 'complete', itemId: item.id })}
          onDelete={() => onAction?.({ type: 'delete', itemId: item.id })}
        />
      </div>
    </div>

  const renderLayout = () => {
    switch (layoutVariant) {
      case 'compact': return <CompactLayout />;
      case 'expanded': return <ExpandedLayout />;
      case 'minimal': return <MinimalLayout />;
      case 'detailed': return <DetailedLayout />;
      default: return <CompactLayout />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: delay * 0.05,
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div 
        className={`
          relative group cursor-pointer rounded-2xl
          ${themeColors.cardBg}
          ${themeColors.shadow}
          border backdrop-blur-sm
          ${isSelected ? themeColors.accent : 'hover:' + themeColors.accent}
          transition-all duration-300 ease-out
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        )}

        {/* Checkbox */}
        <AnimatePresence>
          {(showCheckbox || isSelected || isHovered) && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <div className="absolute top-3 left-3 z-10">
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect?.(item.id)}
                    className="w-5 h-5 rounded border-2 border-blue-500 text-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className={showCheckbox || isSelected || isHovered ? 'ml-8' : ''}>
          {renderLayout()}
        </div>

        {/* Hover accent line */}
        <div 
          className={`
            absolute bottom-0 left-0 h-1 bg-gradient-to-r 
            from-blue-500 to-blue-600 
            rounded-b-2xl transition-all duration-300
            ${isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'}
          `}
        />
      </div>
    </motion.div>
  );
};

export default RecentItemVaried;