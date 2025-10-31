import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/index.jsx';
import NavbarSearch from './NavbarSearch';
import NavbarActions from './NavbarActions';

const Navbar = ({ title, subtitle, onSearch }) => {
  const { isDarkMode } = useThemeStore();

  const navbarClasses = isDarkMode
    ? 'sticky top-0 z-50 h-16 transition-all duration-500 bg-[rgba(18,18,20,0.55)] border-b border-white/[0.08] backdrop-blur-xl'
    : 'sticky top-0 z-50 h-16 transition-all duration-500 bg-white/[0.6] border-b border-black/[0.06] backdrop-blur-md';

  return (
    <motion.header
      className={navbarClasses}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          {/* Left: Title and Subtitle */}
          <div className="flex-1 min-w-0">
            <motion.h1
              className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white truncate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                className="text-sm text-gray-600 dark:text-gray-400 truncate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* Center: Search (optional) */}
          {onSearch && (
            <div className="hidden md:block">
              <NavbarSearch onSearch={onSearch} />
            </div>
          )}

          {/* Right: Actions */}
          <NavbarActions />
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
