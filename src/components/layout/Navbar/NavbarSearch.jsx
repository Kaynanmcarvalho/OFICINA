import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdClose } from 'react-icons/md';
import { useThemeStore } from '../../../store/index.jsx';
import { searchVariants } from '../../../utils/animations';

const NavbarSearch = ({ onSearch }) => {
  const { isDarkMode } = useThemeStore();
  const [isFocused, setIsFocused] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  };

  const searchClasses = `
    relative flex items-center gap-2 px-4 py-2 rounded-xl
    transition-all duration-300
    ${isDarkMode
      ? 'bg-white/8 border border-white/10 focus-within:border-primary-500'
      : 'bg-black/4 border border-black/8 focus-within:border-primary-500'
    }
  `;

  return (
    <motion.div
      className={searchClasses}
      variants={searchVariants}
      initial="default"
      animate={isFocused ? 'focused' : 'default'}
      whileFocus="focused"
    >
      {/* Search Icon */}
      <MdSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Buscar..."
        className={`
          flex-1 bg-transparent border-none outline-none
          text-sm placeholder:text-gray-400
          ${isDarkMode ? 'text-white' : 'text-gray-900'}
        `}
      />

      {/* Clear Button */}
      <AnimatePresence>
        {query && (
          <motion.button
            onClick={handleClear}
            className="p-1 rounded-lg hover:bg-gray-500/10 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MdClose className="w-4 h-4 text-gray-400" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NavbarSearch;
