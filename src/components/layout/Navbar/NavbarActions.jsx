import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useThemeStore } from '../../../store/index.jsx';
import ThemeToggle from './ThemeToggle';
import NavbarProfile from './NavbarProfile';

const NavbarActions = () => {
  const { isDarkMode } = useThemeStore();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscar:', searchQuery);
    // TODO: Implementar busca
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* Search */}
      <div className="relative">
        <AnimatePresence>
          {showSearch ? (
            <motion.form
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSearch}
              className="overflow-hidden"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  autoFocus
                  className={`w-full pl-10 pr-10 py-2 rounded-lg text-sm transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600'
                      : 'bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Search 
                  size={18} 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                    isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                >
                  <X size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setShowSearch(true)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Buscar"
              title="Buscar"
            >
              <Search size={22} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Profile */}
      <NavbarProfile />
    </div>
  );
};

export default NavbarActions;
