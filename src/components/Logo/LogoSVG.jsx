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
  const filterStyle = theme === 'dark' 
    ? 'brightness(0) invert(1)' // Branco no tema escuro
    : 'brightness(0)'; // Preto no tema claro
  
  return (
    <img
      src="/logo-torq.svg"
      alt="TORQ - Sistema de Gestão de Oficina"
      width={width}
      height={height}
      className={className}
      style={{
        filter: filterStyle,
        transition: 'filter 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        objectFit: 'contain'
      }}
    />
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
