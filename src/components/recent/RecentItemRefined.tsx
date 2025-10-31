import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemAvatar from './ItemAvatar';
import StatusPill from './StatusPill';
import ItemMetaRow from './ItemMetaRow';
import ItemActions from './ItemActions';
import { RecordItem, ItemAction } from './RecentItem';

interface RecentItemRefinedProps {
  item: RecordItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
  onAction?: (action: ItemAction) => void;
  showCheckbox?: boolean;
  delay?: number;
  index?: number;
}

const RecentItemRefined: React.FC<RecentItemRefinedProps> = ({
  item,
  isSelected = false,
  onSelect,
  onClick,
  onAction,
  showCheckbox = false,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Status-based accent color
  const getStatusAccent = () => {
    const accents = {
      in_progress: '#F59E0B',
      completed: '#10B981',
      pending: '#3B82F6',
      cancelled: '#EF4444',
    };
    return accents[item.status] || accents.in_progress;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;
    onClick?.();
  };

  // Refined animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8,
        delay: delay * 0.08,
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -3,
      scale: 1.015,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5,
      },
    },
    tap: {
      scale: 0.995,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      {...hoverVariants}
    >
      <div 
        className="relative group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Outer glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-3xl blur-xl"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ 
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${getStatusAccent()}25, transparent 70%)`,
          }}
        />

        {/* Main card container - ALTURA FIXA */}
        <div
          className={`
            relative overflow-hidden rounded-3xl
            h-24
            backdrop-blur-xl
            border border-white/[0.08]
            shadow-lg shadow-black/20
            ${isSelected ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-transparent' : ''}
            transition-all duration-300 ease-out
          `}
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(15, 15, 15, 0.95) 0%,
                rgba(25, 25, 30, 0.9) 50%,
                rgba(20, 20, 25, 0.95) 100%
              ),
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                ${getStatusAccent()}08, transparent 60%
              )
            `,
            boxShadow: `
              0 8px 32px -8px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              ${isHovered ? `0 0 40px -10px ${getStatusAccent()}30` : ''}
            `,
          }}
        >
          {/* Top highlight */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-px"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: isHovered ? 0.6 : 0.3 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `linear-gradient(90deg, transparent, ${getStatusAccent()}60, transparent)`,
            }}
          />

          {/* Content container - ALTURA FIXA COM FLEXBOX */}
          <div className="relative h-full flex items-center px-5 py-4">
            <div className="flex items-center gap-4 w-full">
              
              {/* Selection checkbox */}
              <AnimatePresence>
                {(showCheckbox || isSelected || isHovered) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, x: -15 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0, x: -15 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      mass: 0.5
                    }}
                    className="flex-shrink-0"
                  >
                    <label className="relative cursor-pointer group/checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect?.(item.id)}
                        className="sr-only"
                      />
                      <motion.div 
                        className={`
                          w-5 h-5 rounded-lg border-2 transition-all duration-200
                          ${isSelected 
                            ? `bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500` 
                            : 'border-white/20 bg-white/5 group-hover/checkbox:border-white/40'
                          }
                        `}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isSelected && (
                          <motion.svg
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 500, 
                              damping: 25 
                            }}
                            className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </motion.div>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Avatar */}
              <motion.div 
                className="flex-shrink-0 relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.div 
                  className="absolute inset-0 rounded-2xl blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 0.6 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: `radial-gradient(circle, ${getStatusAccent()}40, transparent 70%)`,
                  }}
                />
                <ItemAvatar 
                  type={item.type} 
                  status={item.status === 'completed' ? 'completed' : undefined}
                  size="md"
                />
              </motion.div>

              {/* Content - ALTURA CONTROLADA */}
              <div className="flex-1 min-w-0 py-1">
                <motion.h3 
                  className="text-base font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate leading-tight mb-1"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: isHovered ? 1 : 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.primaryText}
                </motion.h3>
                
                <p className="text-gray-400 text-sm truncate font-medium leading-tight mb-1">
                  {item.secondaryText}
                </p>
                
                <div className="text-xs">
                  <ItemMetaRow
                    plate={item.plate}
                    model={item.model}
                    date={item.date}
                    tags={item.tags}
                    showRelativeTime={true}
                  />
                </div>
              </div>

              {/* Status pill */}
              <motion.div 
                className="flex-shrink-0 relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.div 
                  className="absolute inset-0 rounded-full blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 0.8 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: `radial-gradient(circle, ${getStatusAccent()}50, transparent 70%)`,
                  }}
                />
                <StatusPill 
                  status={item.status} 
                  showGlow={isHovered}
                  size="sm"
                />
              </motion.div>

              {/* Actions */}
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ItemActions
                  onOpen={() => onAction?.({ type: 'open', itemId: item.id })}
                  onEdit={() => onAction?.({ type: 'edit', itemId: item.id })}
                  onDuplicate={() => onAction?.({ type: 'duplicate', itemId: item.id })}
                  onComplete={() => onAction?.({ type: 'complete', itemId: item.id })}
                  onDelete={() => onAction?.({ type: 'delete', itemId: item.id })}
                />
              </motion.div>
            </div>
          </div>

          {/* Bottom highlight */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {/* Interactive light effect */}
          <motion.div 
            className="absolute inset-0 rounded-3xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.04), transparent 50%)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RecentItemRefined;