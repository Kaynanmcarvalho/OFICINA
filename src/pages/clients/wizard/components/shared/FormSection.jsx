/**
 * FormSection - Seção de formulário para agrupar campos relacionados
 */

import { useThemeStore } from '../../../../../store/themeStore';

const FormSection = ({ title, subtitle, children, className = '' }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`space-y-4 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-sm mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default FormSection;
