/**
 * ClientAvatar - Avatar do cliente com gradiente único
 * Gera cores baseadas no hash do nome
 */

import { User } from 'lucide-react';

const ClientAvatar = ({ name, size = 'md' }) => {
  
  // Gerar hash do nome para cor consistente
  const generateHash = (str) => {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Paleta de gradientes com foco na cor laranja vibrante
  const gradients = [
    'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)', // Laranja vibrante principal
    'linear-gradient(135deg, #ff8a50 0%, #ff6b35 100%)', // Laranja suave
    'linear-gradient(135deg, #ff7043 0%, #ff5722 100%)', // Laranja intenso
    'linear-gradient(135deg, #ffab40 0%, #ff9800 100%)', // Laranja dourado
    'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)', // Laranja puro
    'linear-gradient(135deg, #ff9500 0%, #ff6200 100%)', // Laranja energético
    'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)', // Laranja coral
    'linear-gradient(135deg, #ff7849 0%, #ff5722 100%)', // Laranja vermelho
    'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)', // Laranja claro
    'linear-gradient(135deg, #ff6b35 0%, #e65100 100%)', // Laranja escuro
  ];

  const hash = generateHash(name);
  const gradient = gradients[hash % gradients.length];

  // Obter iniciais
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Tamanhos
  const sizes = {
    sm: { width: '32px', height: '32px', fontSize: '12px', iconSize: 14 },
    md: { width: '48px', height: '48px', fontSize: '16px', iconSize: 20 },
    lg: { width: '64px', height: '64px', fontSize: '20px', iconSize: 24 },
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <div
      style={{
        width: sizeConfig.width,
        height: sizeConfig.height,
        borderRadius: '50%',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '600',
        fontSize: sizeConfig.fontSize,
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {name ? initials : <User size={sizeConfig.iconSize} />}
    </div>
  );
};

export default ClientAvatar;
