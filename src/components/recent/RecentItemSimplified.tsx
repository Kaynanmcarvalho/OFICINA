import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemAvatar from './ItemAvatar';
import StatusPill from './StatusPill';
import ItemMetaRow from './ItemMetaRow';
import ItemActions from './ItemActions';
import { RecordItem, ItemAction } from './RecentItem';

interface RecentItemSimplifiedProps {
  item: RecordItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
  onAction?: (action: ItemAction) => void;
  showCheckbox?: boolean;
  delay?: number;
  index?: number;
}

const RecentItemSimplified: React.FC<RecentItemSimplifiedProps> = ({
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
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Dynamic gradient based on vehicle type
  const getVehicleGradient = () => {
    const gradients = {
      car: 'from-blue-900/20 via-blue-800/10 to-cyan-900/20',
      motorcycle: 'from-orange-900/20 via-red-800/10 to-yellow-900/20',
      truck: 'from-purple-900/20 via-violet-800/10 to-indigo-900/20',
      van: 'from-emerald-900/20 via-green-800/10 to-teal-900/20',
      client: 'from-gray-900/20 via-slate-800/10 to-zinc-900/20',
    };
    return gradients[item.type] || gradients.car;
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay * 0.1,
      }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Outer glow effect */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${getStatusAccent()}20, transparent 70%)`,
        }}
      />

      {/* Main card container */}
      <div
        className={`
          relative overflow-hidden rounded-3xl
          bg-gradient-to-br ${getVehicleGradient()}
          backdrop-blur-2xl
          border border-white/[0.08]
          shadow-2xl shadow-black/40
          ${isSelected ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-transparent' : ''}
          transition-all duration-500 ease-out
        `}
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(15, 15, 15, 0.95) 0%,
              rgba(25, 25, 30, 0.9) 50%,
              rgba(20, 20, 25, 0.95) 100%
            ),
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              ${getStatusAccent()}10, transparent 60%
            )
          `,
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            ${isHovered ? `0 0 80px -20px ${getStatusAccent()}40` : ''}
          `,
        }}
      >
        {/* Top highlight */}
        <div 
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            background: `linear-gradient(90deg, transparent, ${getStatusAccent()}40, transparent)`,
          }}
        />

        {/* Content container */}
        <div className="relative p-6">
          <div className="flex items-center gap-5">
            
            {/* Selection checkbox */}
            <AnimatePresence>
              {(showCheckbox || isSelected || isHovered) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex-shrink-0"
                >
                  <label className="relative cursor-pointer group/checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelect?.(item.id)}
                      className="sr-only"
                    />
                    <div 
                      className={`
                        w-6 h-6 rounded-lg border-2 transition-all duration-300
                        ${isSelected 
                          ? `bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 shadow-lg shadow-blue-500/30` 
                          : 'border-white/20 bg-white/5 group-hover/checkbox:border-white/40 group-hover/checkbox:bg-white/10'
                        }
                      `}
                    >
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="w-4 h-4 text-white absolute top-0.5 left-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
                  style={{
                    background: `radial-gradient(circle, ${getStatusAccent()}30, transparent 70%)`,
                  }}
                />
                <ItemAvatar 
                  type={item.type} 
                  status={item.status === 'completed' ? 'completed' : undefined}
                  size="md"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">
                {item.primaryText}
              </h3>
              
              <p className="text-gray-400 text-sm truncate font-medium">
                {item.secondaryText}
              </p>
              
              <ItemMetaRow
                plate={item.plate}
                model={item.model}
                date={item.date}
                tags={item.tags}
                showRelativeTime={true}
              />
            </div>

            {/* Status pill */}
            <div className="flex-shrink-0 relative">
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
                style={{
                  background: `radial-gradient(circle, ${getStatusAccent()}40, transparent 70%)`,
                }}
              />
              <StatusPill 
                status={item.status} 
                showGlow={isHovered}
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

        {/* Bottom highlight */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Interactive light effect */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.03), transparent 50%)`,
          }}
        />
      </div>
    </motion.div>
  );
};

export default RecentItemSimplified;