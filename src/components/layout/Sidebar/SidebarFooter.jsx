import React from 'react';
import { motion } from 'framer-motion';
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

      {/* Toggle Button */}
      <div className="px-3 pb-4">
        <motion.button
          onClick={onToggleCollapse}
          className={`
            w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl
            text-sm font-medium transition-all duration-200
            ${isDarkMode
              ? 'bg-gray-800/50 hover:bg-gray-800 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isCollapsed ? <MdChevronRight className="w-5 h-5" /> : <MdChevronLeft className="w-5 h-5" />}
          </motion.div>
          {!isCollapsed && <span>Recolher</span>}
        </motion.button>
      </div>
    </div>
  );
};

export default SidebarFooter;
