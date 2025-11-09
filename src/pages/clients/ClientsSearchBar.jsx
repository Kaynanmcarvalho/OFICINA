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
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative flex items-center gap-3 px-4 py-3.5 rounded-xl
          backdrop-blur-xl border transition-all duration-300
          ${isDarkMode 
            ? 'bg-gray-900/50 border-gray-800 focus-within:border-blue-500/50 shadow-xl' 
            : 'glass-effect focus-within:border-blue-500 focus-within:shadow-md'
          }
        `}
      >
        {/* Search Icon */}
        <Search className={`w-5 h-5 flex-shrink-0 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar por nome, e-mail, telefone ou CPF..."
          data-search-input
          className={`
            flex-1 bg-transparent outline-none text-base
            placeholder:transition-colors
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className={`
                p-1.5 rounded-lg transition-colors
                ${isDarkMode 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Keyboard Shortcut Hint */}
        {!value && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`
              hidden sm:flex items-center gap-1 px-2 py-1 rounded-md text-xs
              ${isDarkMode 
                ? 'bg-gray-800 text-gray-400' 
                : 'bg-gray-100 text-gray-600'
              }
            `}
          >
            <span>⌘K</span>
          </motion.div>
        )}
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
