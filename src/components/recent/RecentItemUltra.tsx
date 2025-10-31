import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import ItemAvatar from './ItemAvatar';
import StatusPill from './StatusPill';
import ItemMetaRow from './ItemMetaRow';
import ItemActions from './ItemActions';
import { RecordItem, ItemAction } from './RecentItem';

interface RecentItemUltraProps {
  item: RecordItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
  onAction?: (action: ItemAction) => void;
  showCheckbox?: boolean;
  delay?: number;
  index?: number;
}

const RecentItemUltra: React.FC<RecentItemUltraProps> = ({
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
  const [isPressed, setIsPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Advanced motion values for ultra-smooth animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-5, 5]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });
  const brightness = useSpring(1, { stiffness: 300, damping: 30 });

  // Parallax effect for inner elements
  const avatarX = useTransform(mouseX, [-100, 100], [-2, 2]);
  const avatarY = useTransform(mouseY, [-100, 100], [-1, 1]);
  const contentX = useTransform(mouseX, [-100, 100], [-1, 1]);
  const actionsX = useTransform(mouseX, [-100, 100], [1, -1]);

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

  // Mouse move handler for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.02);
    brightness.set(1.1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scale.set(1);
    brightness.set(1);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    scale.set(0.98);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    scale.set(isHovered ? 1.02 : 1);
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;
    onClick?.();
  };

  // Entrance animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay * 0.1,
        duration: 0.8,
      },
    },
  };

  // Floating animation for the card
  const floatingVariants = {
    animate: {
      y: [0, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{
        scale,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className="relative group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {/* Floating subtle animation */}
      <motion.div variants={floatingVariants} animate="animate">
        
        {/* Outer glow effect */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x + 200}px ${mousePosition.y + 100}px, ${getStatusAccent()}20, transparent 70%)`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
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
              radial-gradient(circle at ${mousePosition.x + 200}px ${mousePosition.y + 100}px, 
                ${getStatusAccent()}10, transparent 60%
              )
            `,
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.6),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.2),
              ${isHovered ? `0 0 80px -20px ${getStatusAccent()}40` : ''}
            `,
            filter: `brightness(${isHovered ? 1.05 : 1}) saturate(${isHovered ? 1.1 : 1})`,
          }}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                  radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
                animation: isHovered ? 'pulse 2s ease-in-out infinite' : 'none',
              }}
            />
          </div>

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
              
              {/* Selection checkbox with premium styling */}
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
                        style={{
                          boxShadow: isSelected ? `0 0 20px ${getStatusAccent()}50` : undefined,
                        }}
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

              {/* Avatar with 3D parallax */}
              <motion.div 
                style={{ x: avatarX, y: avatarY }}
                className="flex-shrink-0 relative"
              >
                <div className="relative">
                  {/* Avatar glow */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle, ${getStatusAccent()}30, transparent 70%)`,
                      filter: 'blur(10px)',
                      transform: 'scale(1.2)',
                    }}
                  />
                  <ItemAvatar 
                    type={item.type} 
                    status={item.status === 'completed' ? 'completed' : undefined}
                    size="md"
                  />
                </div>
              </motion.div>

              {/* Content with parallax */}
              <motion.div 
                style={{ x: contentX }}
                className="flex-1 min-w-0 space-y-2"
              >
                {/* Primary text with gradient */}
                <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">
                  {item.primaryText}
                </h3>
                
                {/* Secondary text */}
                <p className="text-gray-400 text-sm truncate font-medium">
                  {item.secondaryText}
                </p>
                
                {/* Meta row */}
                <ItemMetaRow
                  plate={item.plate}
                  model={item.model}
                  date={item.date}
                  tags={item.tags}
                  showRelativeTime={true}
                />
              </motion.div>

              {/* Status pill with enhanced glow */}
              <div className="flex-shrink-0 relative">
                <div 
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${getStatusAccent()}40, transparent 70%)`,
                    filter: 'blur(8px)',
                    transform: 'scale(1.5)',
                  }}
                />
                <StatusPill 
                  status={item.status} 
                  showGlow={isHovered}
                  size="md"
                />
              </div>

              {/* Actions with parallax */}
              <motion.div 
                style={{ x: actionsX }}
                className="flex-shrink-0"
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
          <div 
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x + 200}px ${mousePosition.y + 100}px, rgba(255,255,255,0.03), transparent 50%)`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecentItemUltra;