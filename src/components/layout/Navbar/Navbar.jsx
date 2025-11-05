import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/index.jsx';
import NavbarSearch from './NavbarSearch';
import NavbarActions from './NavbarActions';
import Logo from '../../Logo/Logo';

const Navbar = ({ onSearch }) => {
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
          {/* Left: Logo */}
          <div className="flex items-center">
            <Logo />
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
