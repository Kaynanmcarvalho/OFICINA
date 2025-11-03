/**
 * ThemeTest - Componente para testar a aplicação do tema
 */

import { useTheme } from '../hooks/useTheme';

const ThemeTest = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg"
      style={{
        background: 'var(--apple-glass-bg)',
        border: '1px solid var(--apple-glass-border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="text-sm font-medium"
          style={{ color: 'var(--apple-text-primary)' }}
        >
          Tema: {isDark ? 'Escuro' : 'Claro'}
        </div>
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded-md text-sm font-medium transition-all duration-200"
          style={{
            background: 'var(--apple-accent-blue)',
            color: 'white',
          }}
        >
          Alternar
        </button>
      </div>
    </div>
  );
};

export default ThemeTest;