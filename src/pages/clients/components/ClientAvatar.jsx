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

  // Paleta de gradientes Apple-like
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
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
