/**
 * SegmentedControl - Toggle estilo iOS para seleção entre opções
 */

import { motion } from 'framer-motion';
import { useThemeStore } from '../../../../../store/themeStore';

const SegmentedControl = ({ options, value, onChange, className = '' }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`
      relative inline-flex p-1 rounded-xl
      ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}
      ${className}
    `}>
      {options.map((option) => {
        const isSelected = value === option.value;
        
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              relative z-10 px-6 py-2 rounded-lg text-sm font-semibold
              transition-colors duration-200
              ${isSelected
                ? isDarkMode
                  ? 'text-white'
                  : 'text-gray-900'
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-700'
              }
            `}
          >
            {option.label}
            
            {isSelected && (
              <motion.div
                layoutId="segmented-control-bg"
                className={`
                  absolute inset-0 rounded-lg -z-10
                  ${isDarkMode ? 'bg-gray-700' : 'bg-white'}
                  shadow-sm
                `}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 300
                }}
              />
            )}
          </button>

      })}
    </div>
  );
};

export default SegmentedControl;
