import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../../../store/index.jsx';
import { itemAnimations, textVariants, tooltipVariants } from '../../../utils/animations';

const SidebarItem = React.memo(({ item, isCollapsed, onClick }) => {
  const location = useLocation();
  const { isDarkMode } = useThemeStore();
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  // Color mapping
  const colorClasses = {
    blue: {
      active: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-l-blue-500',
      hover: 'hover:bg-blue-500/5 dark:hover:bg-blue-500/10'
    },
    amber: {
      active: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-l-amber-500',
      hover: 'hover:bg-amber-500/5 dark:hover:bg-amber-500/10'
    },
    green: {
      active: 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-l-green-500',
      hover: 'hover:bg-green-500/5 dark:hover:bg-green-500/10'
    },
    red: {
      active: 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-l-red-500',
      hover: 'hover:bg-red-500/5 dark:hover:bg-red-500/10'
    }
  };

  const colors = colorClasses[item.color || 'blue'];

  const itemClasses = `
    relative flex items-center gap-3 px-3 py-3 rounded-xl
    text-sm font-medium transition-all duration-200
    ${isActive 
      ? `${colors.active} border-l-3 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]` 
      : `text-gray-700 dark:text-gray-300 ${colors.hover}`
    }
    ${isCollapsed ? 'justify-center' : ''}
  `;

  return (
    <div className="relative">
      <motion.div
        variants={itemAnimations}
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => isCollapsed && setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
      >
        <Link
          to={item.path}
          className={itemClasses}
          onClick={onClick}
          aria-label={item.name}
          aria-current={isActive ? 'page' : undefined}
        >
          {/* Icon with inner reflection */}
          <div className="relative">
            <Icon className="w-5 h-5" style={{
              filter: isActive ? 'drop-shadow(0 0 8px currentColor)' : 'none'
            }} />
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>

          {/* Text label */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                variants={textVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="whitespace-nowrap overflow-hidden"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Badge */}
          {!isCollapsed && item.badge && (
            <motion.span
              className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-500 text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {item.badge}
            </motion.span>
          )}

          {/* Active indicator glow */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                boxShadow: `0 0 20px ${item.color === 'amber' ? 'rgba(245, 158, 11, 0.3)' : 
                                      item.color === 'green' ? 'rgba(34, 197, 94, 0.3)' :
                                      item.color === 'red' ? 'rgba(239, 68, 68, 0.3)' :
                                      'rgba(37, 99, 235, 0.3)'}`
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </Link>
      </motion.div>

      {/* Tooltip for collapsed state */}
      <AnimatePresence>
        {isCollapsed && showTooltip && (
          <motion.div
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50"
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className={`
              px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap
              ${isDarkMode 
                ? 'bg-gray-800 text-white border border-gray-700' 
                : 'bg-white text-gray-900 border border-gray-200'
              }
              shadow-lg backdrop-blur-md
            `}>
              {item.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default SidebarItem;
