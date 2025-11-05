import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';
import { useThemeStore } from '../../../store/index.jsx';
import ThemeToggle from './ThemeToggle';
import NavbarProfile from './NavbarProfile';
import { badgeBounce } from '../../../utils/animations';

const NavbarActions = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="relative flex items-center gap-3">
      {/* Search Icon */}
      <motion.div whileTap={{ scale: 0.9 }}>
        <button 
          className={`p-2 rounded-full transition-colors duration-300 ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          aria-label="Buscar"
        >
          <Search size={22} />
        </button>
      </motion.div>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Profile */}
      <NavbarProfile />
    </div>
  );
};

export default NavbarActions;
