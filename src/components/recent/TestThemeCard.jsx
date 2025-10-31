import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const TestThemeCard = () => {
  const { isDark } = useTheme();
  
  console.log('🧪 TestThemeCard - isDark:', isDark);
  
  return (
    <div
      style={{
        padding: '20px',
        margin: '20px',
        borderRadius: '12px',
        background: isDark 
          ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(55, 65, 81, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
        border: isDark 
          ? '1px solid rgba(75, 85, 99, 0.5)'
          : '1px solid rgba(229, 231, 235, 0.5)',
        color: isDark ? 'white' : 'black'
      }}
    >
      <h3>🧪 TESTE DE TEMA</h3>
      <p>isDark: {isDark ? 'TRUE (escuro)' : 'FALSE (claro)'}</p>
      <p>Este card deve ser {isDark ? 'ESCURO' : 'CLARO'}</p>
      <div style={{
        background: isDark ? '#374151' : '#f3f4f6',
        padding: '10px',
        borderRadius: '8px',
        marginTop: '10px'
      }}>
        Conteúdo interno
      </div>
    </div>
  );
};

export default TestThemeCard;