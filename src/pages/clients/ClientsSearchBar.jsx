/**
 * ClientsSearchBar - Barra de busca inteligente com feedback visual
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const ClientsSearchBar = ({ value, onChange, isLoading, resultCount }) => {
  const { isDarkMode } = useThemeStore();

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative group">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Glow Effect on Focus */}
        <div className={`
          absolute -inset-0.5 rounded-2xl opacity-0 group-focus-within:opacity-100 
          transition-opacity duration-500 blur-xl
          ${isDarkMode 
            ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20' 
            : 'bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-blue-400/30'
          }
        `} />

        {/* Main Container */}
        <div className={`
          relative flex items-center gap-3 px-5 py-4 rounded-2xl
          backdrop-blur-xl border-2 transition-all duration-300
          ${isDarkMode 
            ? 'bg-gray-900/80 border-gray-700/50 group-focus-within:border-blue-500/50 group-focus-within:bg-gray-900/90' 
            : 'bg-white/90 border-gray-200/50 group-focus-within:border-blue-400/50 group-focus-within:bg-white'
          }
          shadow-lg group-focus-within:shadow-2xl
        `}>
          {/* Search Icon with Animation */}
          <motion.div
            animate={{ 
              scale: value ? 1.1 : 1,
              rotate: value ? 90 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Search className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
              value 
                ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
            }`} />
          </motion.div>

          {/* Input */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar por nome, e-mail, telefone ou CPF..."
            data-search-input
            className={`
              flex-1 bg-transparent outline-none text-base font-medium
              placeholder:transition-colors placeholder:font-normal
              ${isDarkMode 
                ? 'text-white placeholder:text-gray-500' 
                : 'text-gray-900 placeholder:text-gray-400'
              }
            `}
          />

          {/* Loading Indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Loader2 className={`w-5 h-5 animate-spin ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clear Button */}
          <AnimatePresence>
            {value && !isLoading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                className={`
                  p-2 rounded-xl transition-all duration-200
                  ${isDarkMode 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                  }
                `}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Keyboard Shortcut Hint */}
          <AnimatePresence>
            {!value && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`
                  hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                  border transition-all duration-200
                  ${isDarkMode 
                    ? 'bg-gray-800/80 border-gray-700 text-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                  }
                `}
              >
                <span className="text-xs">⌘</span>
                <span>K</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Result Count */}
      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`
              absolute left-0 -bottom-6 text-xs font-medium
              ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            {resultCount === 0 ? (
              <span className="text-red-500">Nenhum resultado encontrado</span>
            ) : resultCount === 1 ? (
              <span>1 cliente encontrado</span>
            ) : (
              <span>{resultCount} clientes encontrados</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientsSearchBar;
