import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import SidebarItem from './SidebarItem';
import { useThemeStore } from '../../../store/index.jsx';

const SidebarFooter = ({ items, isCollapsed, onToggleCollapse }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="border-t border-white/[0.08] dark:border-white/[0.08]">
      {/* Footer Items */}
      <div className="px-3 py-3 space-y-1">
        {items && items.map((item) => (
          <SidebarItem 
            key={item.path}
            item={item} 
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {/* Toggle Button - Seta Minimalista Apple Style */}
      <div className="px-3 pb-4">
        <motion.button
          onClick={onToggleCollapse}
          className={`
            relative w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
            text-sm font-medium transition-all duration-300 overflow-hidden group
            ${isDarkMode
              ? 'bg-gradient-to-r from-gray-800/60 to-gray-800/40 hover:from-gray-800/80 hover:to-gray-800/60 text-gray-300 border border-white/[0.08] hover:border-white/[0.12]'
              : 'bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 border border-gray-200/50 hover:border-gray-300/50'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {/* Glow effect on hover */}
          <div className={`
            absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
            ${isDarkMode 
              ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' 
              : 'bg-gradient-to-r from-blue-500/5 to-purple-500/5'
            }
          `} />
          
          {/* Icon with smooth rotation */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1] // Apple's easing curve
            }}
          >
            {isCollapsed ? (
              <MdChevronRight className={`
                w-5 h-5 transition-colors duration-300
                ${isDarkMode 
                  ? 'text-gray-400 group-hover:text-blue-400' 
                  : 'text-gray-600 group-hover:text-blue-600'
                }
              `} />
            ) : (
              <MdChevronLeft className={`
                w-5 h-5 transition-colors duration-300
                ${isDarkMode 
                  ? 'text-gray-400 group-hover:text-blue-400' 
                  : 'text-gray-600 group-hover:text-blue-600'
                }
              `} />
            )}
          </motion.div>
          
          {/* Text with fade animation */}
          {!isCollapsed && (
            <motion.span 
              className="relative z-10"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              Recolher
            </motion.span>
          )}
          
          {/* Shine effect */}
          <motion.div
            className={`
              absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100
              bg-gradient-to-r from-transparent via-white/10 to-transparent
            `}
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default SidebarFooter;
