/**
 * SearchBar Component - Busca premium estilo Apple
 * Inclui busca instantânea, placeholder animado, keyboard shortcut ⌘+K
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, X } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import '../styles/theme-tokens.css';

const SearchBar = ({
  value = '',
  onChange,
  onSearch,
  onClear,
  placeholder = 'Buscar clientes...',
  isLoading = false,
  debounceMs = 300,
  showKeyboardHint = true,
}) => {
  const { isDark } = useTheme();
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Placeholders rotativos
  const placeholders = [
    'Buscar clientes por nome...',
    'Buscar por CPF...',
    'Buscar por e-mail...',
    'Buscar por telefone...',
  ];

  // Rotacionar placeholder a cada 3 segundos
  useEffect(() => {
    if (!isFocused) {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isFocused, placeholders.length]);

  // Keyboard shortcut: ⌘+K / Ctrl+K para focar busca
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounce para busca instantânea
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (localValue !== value) {
        onChange?.(localValue);
        onSearch?.(localValue);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localValue, debounceMs, onChange, onSearch, value]);

  // Sincronizar com prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Container style
  const containerStyle = {
    height: '56px',
    borderRadius: '16px',
    background: isDark 
      ? 'rgba(28, 28, 30, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: isFocused
      ? `2px solid ${isDark ? '#0a84ff' : '#007aff'}`
      : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
    boxShadow: isFocused
      ? isDark
        ? '0 4px 16px rgba(10, 132, 255, 0.3), 0 0 0 4px rgba(10, 132, 255, 0.1)'
        : '0 4px 16px rgba(0, 122, 255, 0.2), 0 0 0 4px rgba(0, 122, 255, 0.05)'
      : isDark
        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s cubic-bezier(0.2, 0.9, 0.2, 1)',
  };

  // Input style
  const inputStyle = {
    width: '100%',
    height: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    fontWeight: 400,
    color: isDark ? '#f5f5f7' : '#1d1d1f',
    padding: '0 16px',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className="relative w-full"
    >
      <div style={containerStyle}>
        <div className="flex items-center h-full px-4 gap-3">
          
          {/* Search Icon */}
          <motion.div
            animate={{
              scale: isFocused ? 1.1 : 1,
              color: isFocused 
                ? (isDark ? '#0a84ff' : '#007aff')
                : (isDark ? '#98989d' : '#6e6e73'),
            }}
            transition={{ duration: 0.2 }}
          >
            <Search size={20} strokeWidth={2.5} />
          </motion.div>

          {/* Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={inputStyle}
              placeholder={isFocused ? placeholder : placeholders[currentPlaceholder]}
              className="placeholder:transition-opacity placeholder:duration-300"
            />
          </div>

          {/* Loading Spinner */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Loader2 
                    size={18} 
                    strokeWidth={2.5}
                    style={{ color: isDark ? '#0a84ff' : '#007aff' }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clear Button */}
          <AnimatePresence>
            {localValue && !isLoading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                className="flex items-center justify-center w-6 h-6 rounded-full transition-colors"
                style={{
                  background: isDark 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)',
                  color: isDark ? '#98989d' : '#6e6e73',
                }}
              >
                <X size={14} strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Keyboard Hint */}
          {showKeyboardHint && !isFocused && !localValue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-semibold"
              style={{
                background: isDark 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)',
                color: isDark ? '#636366' : '#86868b',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
              }}
            >
              ⌘K
            </motion.div>
          )}
        </div>
      </div>

      {/* Focus Ring Animation */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: isDark
                ? 'radial-gradient(circle at center, rgba(10, 132, 255, 0.05) 0%, transparent 70%)'
                : 'radial-gradient(circle at center, rgba(0, 122, 255, 0.03) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
