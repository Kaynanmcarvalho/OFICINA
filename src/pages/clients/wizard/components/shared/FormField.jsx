/**
 * FormField - Campo de formulário reutilizável com label e validação
 */

import { motion as Motion } from 'framer-motion';
import { useThemeStore } from '../../../../../store/themeStore';
import ValidationMessage from './ValidationMessage';

const FormField = ({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  maxLength,
  rows,
  className = ''
}) => {
  const { isDarkMode } = useThemeStore();
  const isTextarea = type === 'textarea';
  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className={className}>
      {label && (
        <label className={`
          flex items-center gap-2 text-sm font-semibold mb-2
          ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
        `}>
          {Icon && <Icon className="w-4 h-4" />}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Motion.div
        animate={{
          scale: error ? [1, 1.02, 1] : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <InputComponent
          type={!isTextarea ? type : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isTextarea ? 'resize-none' : ''}
            ${error 
              ? 'border-red-500 focus:ring-red-500' 
              : isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' 
                : 'bg-white border-[2px] border-gray-900/70 text-gray-900 placeholder:text-gray-400 focus:border-gray-900'
            }
          `}
        />
      </Motion.div>
      
      {error && <ValidationMessage message={error} />}
      
      {maxLength && isTextarea && (
        <div className={`text-xs text-right mt-1 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {value?.length || 0} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default FormField;
