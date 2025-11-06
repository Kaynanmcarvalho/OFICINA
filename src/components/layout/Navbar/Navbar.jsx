import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/index.jsx';
import NavbarSearch from './NavbarSearch';
import NavbarActions from './NavbarActions';
import Logo from '../../Logo/Logo';

const Navbar = ({ onSearch }) => {
  const { isDarkMode } = useThemeStore();

  const navbarClasses = isDarkMode
    ? 'sticky top-0 z-50 h-16 bg-[rgba(18,18,20,0.95)] border-b border-white/[0.08] backdrop-blur-xl'
    : 'sticky top-0 z-50 h-16 bg-white/[0.95] border-b border-black/[0.06] backdrop-blur-md';

  return (
    <motion.header
      className={navbarClasses}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full px-6 h-full">
        <div className="flex items-center justify-between h-full gap-4 max-w-full">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Logo />
          </div>

          {/* Center: Search (optional) */}
          {onSearch && (
            <div className="hidden md:block flex-1 max-w-2xl mx-auto">
              <NavbarSearch onSearch={onSearch} />
            </div>
          )}

          {/* Spacer para empurrar actions para direita quando não há search */}
          {!onSearch && <div className="flex-1" />}

          {/* Right: Actions */}
          <div className="flex items-center justify-end flex-shrink-0 ml-auto">
            <NavbarActions />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
