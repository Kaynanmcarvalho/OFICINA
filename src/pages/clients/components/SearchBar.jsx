/**
 * SearchBar Component - Busca premium estilo Apple
 * Inclui busca instantânea, placeholder animado, keyboard shortcut ⌘+K
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, X } from 'lucide-react';
import { useThemeStore } from '../../../store';
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
  const { isDarkMode } = useThemeStore();
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
    background: 'var(--apple-glass-bg)',
    border: isFocused
      ? `2px solid var(--apple-accent-blue)`
      : `1px solid var(--apple-glass-border)`,
    boxShadow: isFocused
      ? 'var(--apple-shadow-blue-hover)'
      : 'var(--apple-shadow-sm)',
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
    color: 'var(--apple-text-primary)',
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
            style={{
              color: isFocused 
                ? 'var(--apple-accent-blue)'
                : 'var(--apple-text-secondary)',
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
              className="placeholder:transition-opacity placeholder:duration-300 apple-search-input"
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
                    style={{ color: 'var(--apple-accent-blue)' }}
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

                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                className="flex items-center justify-center w-6 h-6 rounded-full transition-colors"
                style={{
                  background: 'var(--apple-overlay-medium)',
                  color: 'var(--apple-text-secondary)',
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
                background: 'var(--apple-overlay-light)',
                color: 'var(--apple-text-tertiary)',
                border: '1px solid var(--apple-border-light)',
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
              background: 'radial-gradient(circle at center, var(--apple-accent-blue) 0%, transparent 70%)',
              opacity: isDarkMode ? 0.05 : 0.03,
            }}
          />
        )}
      </AnimatePresence>

      {/* CSS para placeholder */}
      <style>{`
        .apple-search-input::placeholder {
          color: var(--apple-text-tertiary) !important;
          opacity: 1 !important;
        }
        
        .apple-search-input::-webkit-input-placeholder {
          color: var(--apple-text-tertiary) !important;
          opacity: 1 !important;
        }
        
        .apple-search-input::-moz-placeholder {
          color: var(--apple-text-tertiary) !important;
          opacity: 1 !important;
        }
        
        .apple-search-input:-ms-input-placeholder {
          color: var(--apple-text-tertiary) !important;
          opacity: 1 !important;
        }
      `}</style>
    </motion.div>
  );
};

export default SearchBar;
