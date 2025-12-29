import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Command } from 'lucide-react';
import { useThemeStore } from '../../../store/index.jsx';
import ThemeToggle from './ThemeToggle';
import NavbarProfile from './NavbarProfile';
import GlobalSearch from '../../Navbar/GlobalSearch';

const NavbarActions = () => {
  const { isDarkMode } = useThemeStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut: Ctrl+K or Cmd+K to open search
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative flex items-center gap-3">
      {/* Search Button - Premium Style */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsSearchOpen(true)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl
          transition-all duration-200 cursor-pointer
          ${isDarkMode 
            ? 'bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-gray-300' 
            : 'bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] text-gray-600'
          }
        `}
        aria-label="Busca global (Ctrl+K)"
        title="Busca global (Ctrl+K)"
      >
        <Search size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
        <span className={`text-sm hidden sm:inline ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Buscar...
        </span>
        <div className={`
          hidden sm:flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-medium
          ${isDarkMode 
            ? 'bg-white/[0.08] text-gray-400' 
            : 'bg-black/[0.06] text-gray-500'
          }
        `}>
          <Command size={10} />
          <span>K</span>
        </div>
      </motion.button>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Profile */}
      <NavbarProfile />

      {/* Global Search Modal */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
};

export default NavbarActions;
