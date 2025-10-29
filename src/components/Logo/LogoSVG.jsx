import React from 'react';
import PropTypes from 'prop-types';

/**
 * LogoSVG Component
 * Renderiza a logo em formato SVG otimizado com suporte a temas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {'light' | 'dark'} props.theme - Tema atual (light ou dark)
 * @param {number} props.width - Largura da logo em pixels
 * @param {number} props.height - Altura da logo em pixels
 * @param {string} props.className - Classes CSS adicionais
 */
const LogoSVG = ({ theme, width, height, className = '' }) => {
  // Cores baseadas no tema
  const fillColor = theme === 'dark' ? '#ffffff' : '#000000';
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-labelledby="logoTitle"
      role="img"
      style={{ 
        color: fillColor,
        transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <title id="logoTitle">ReparoFácil - Sistema de Gestão de Oficina</title>
      
      {/* Ícone de Ferramenta (Chave Inglesa) */}
      <g transform="translate(10, 10)">
        <path
          d="M35 8L28 15L25 12L18 19L21 22L15 28L12 25L5 32L8 35L15 28L18 31L25 24L22 21L29 14L32 17L39 10L35 8Z"
          fill="currentColor"
          opacity="0.9"
        />
        <circle cx="32" cy="12" r="6" fill="currentColor" opacity="0.7" />
        <circle cx="12" cy="32" r="6" fill="currentColor" opacity="0.7" />
      </g>

      {/* Texto "ReparoFácil" */}
      <g transform="translate(55, 15)">
        {/* Reparo */}
        <text
          x="0"
          y="15"
          fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
          fontSize="18"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="-0.5"
        >
          Reparo
        </text>
        
        {/* Fácil */}
        <text
          x="0"
          y="35"
          fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
          fontSize="16"
          fontWeight="600"
          fill="currentColor"
          opacity="0.85"
          letterSpacing="-0.3"
        >
          Fácil
        </text>
      </g>

      {/* Detalhe decorativo (linha sutil) */}
      <line
        x1="55"
        y1="52"
        x2="145"
        y2="52"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
        strokeLinecap="round"
      />
    </svg>
  );
};

LogoSVG.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

LogoSVG.defaultProps = {
  width: 160,
  height: 48,
  className: '',
};

export default LogoSVG;
