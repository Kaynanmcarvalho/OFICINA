import React, { useState, useEffect, useCallback } from 'react';
import IconLoader from './IconLoader';

export interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Whether the search is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SearchBar - Text search input with debouncing and glassmorphism design
 * 
 * Features:
 * - Debounced input to prevent excessive API calls
 * - Glassmorphism design with backdrop blur
 * - Search icon with proper positioning
 * - Focus states with accent colors
 * - Accessibility support with ARIA attributes
 * - Clear button when text is present
 * 
 * @example
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Buscar registros..."
 *   debounceMs={300}
 * />
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar registros...',
  debounceMs = 300,
  disabled = false,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced onChange callback
  const debouncedOnChange = useCallback(
    debounceMs > 0
      ? (() => {
          let timeoutId: NodeJS.Timeout;
          return (newValue: string) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => onChange(newValue), debounceMs);
          };
        })()
      : onChange,
    [onChange, debounceMs]

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  // Handle clear button
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  // Handle key down for accessibility
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleClear();
      event.currentTarget.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        {/* Search Icon */}
        <div className="
          absolute left-4 top-1/2 -translate-y-1/2
          pointer-events-none
          z-10
        ">
          <IconLoader
            name="search"
            size="sm"
            className={`
              transition-colors duration-200
              ${isFocused 
                ? 'text-blue-500' 
                : 'text-neutral-400 dark:text-neutral-500'
              }
            `}
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            h-12
            pl-12 pr-12
            rounded-xl
            bg-white/80 dark:bg-neutral-800/80
            backdrop-blur-[12px]
            border border-black/6 dark:border-white/10
            text-base
            text-neutral-900 dark:text-neutral-100
            placeholder-neutral-400 dark:placeholder-neutral-500
            transition-all duration-200
            focus:outline-none
            focus:ring-2 focus:ring-blue-500/30
            focus:border-blue-500/30
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:border-black/8 dark:hover:border-white/15'
            }
            ${isFocused 
              ? 'shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
              : 'shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
            }
          `}
          role="searchbox"
          aria-label="Buscar registros"
          aria-describedby="search-help"
        />

        {/* Clear Button */}
        {localValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              w-6 h-6
              flex items-center justify-center
              rounded-full
              bg-neutral-200 dark:bg-neutral-700
              hover:bg-neutral-300 dark:hover:bg-neutral-600
              text-neutral-500 dark:text-neutral-400
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-blue-500/30
            "
            aria-label="Limpar busca"
            title="Limpar"
          >
            <IconLoader
              name="x-close"
              className="w-3 h-3"
            />
          </button>
        )}
      </div>

      {/* Screen reader help text */}
      <div id="search-help" className="sr-only">
        Digite para buscar por nome do cliente, modelo do veículo ou placa
      </div>
    </div>
  );
};

export default SearchBar;