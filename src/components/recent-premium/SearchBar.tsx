import React, { useState, useEffect } from 'react';
import IconLoader from './IconLoader';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * SearchBar - Input de busca com debounce
 * Design Apple premium com glassmorphism
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar por placa, modelo ou cliente...',
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
        <IconLoader name="search" size="sm" />
      </div>

      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        role="searchbox"
        aria-label="Buscar registros"
        className="
          w-full
          h-12
          pl-12 pr-4
          rounded-xl
          bg-white/80 dark:bg-neutral-800/80
          backdrop-blur-md
          border border-neutral-200/50 dark:border-neutral-700/50
          text-md text-neutral-900 dark:text-neutral-0
          placeholder:text-neutral-400
          focus:outline-none
          focus:ring-2 focus:ring-accent-500/50
          focus:border-accent-500
          transition-all duration-200
        "
      />
    </div>
  );
};

export default SearchBar;
