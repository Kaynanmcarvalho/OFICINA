import PropTypes from 'prop-types';

/**
 * LogoSVG Component - Logo TORQ Inline SVG
 * Renderiza a logo TORQ em formato SVG inline com suporte a temas
 * Design: Texto "TORQ" com engrenagem e chave integradas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {'light' | 'dark'} props.theme - Tema atual (light ou dark)
 * @param {number} props.width - Largura da logo em pixels
 * @param {number} props.height - Altura da logo em pixels
 * @param {string} props.className - Classes CSS adicionais
 */
const LogoSVG = ({ theme, width = 200, height = 60, className = '' }) => {
  // Cores baseadas no tema
  const mainColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  const accentColor = '#FF8C42'; // Laranja característico da TORQ
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      aria-label="TORQ - Sistema de Gestão de Oficina"
      role="img"
    >
      {/* Letra T */}
      <path
        d="M20 25 L90 25 L90 40 L65 40 L65 95 L45 95 L45 40 L20 40 Z"
        fill={mainColor}
      />
      
      {/* Letra O com Engrenagem */}
      <g>
        {/* Círculo externo do O */}
        <circle
          cx="125"
          cy="60"
          r="32"
          fill="none"
          stroke={mainColor}
          strokeWidth="12"
        />
        
        {/* Engrenagem dentro do O */}
        <g transform="translate(125, 60)">
          {/* Dentes da engrenagem */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = Math.cos(rad) * 15;
            const y1 = Math.sin(rad) * 15;
            const x2 = Math.cos(rad) * 22;
            const y2 = Math.sin(rad) * 22;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={mainColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}
          {/* Círculo central da engrenagem */}
          <circle cx="0" cy="0" r="8" fill={mainColor} />
        </g>
      </g>
      
      {/* Letra R */}
      <path
        d="M180 25 L210 25 Q235 25 235 45 Q235 60 220 63 L240 95 L218 95 L200 65 L195 65 L195 95 L180 95 Z M195 40 L195 52 L210 52 Q220 52 220 46 Q220 40 210 40 Z"
        fill={mainColor}
      />
      
      {/* Letra Q */}
      <g>
        {/* Círculo do Q */}
        <circle
          cx="285"
          cy="60"
          r="32"
          fill="none"
          stroke={mainColor}
          strokeWidth="12"
        />
        
        {/* Chave atravessando o Q */}
        <g transform="translate(285, 60) rotate(-30)">
          {/* Cabo da chave */}
          <rect
            x="-3"
            y="-25"
            width="6"
            height="50"
            fill={accentColor}
            rx="3"
          />
          {/* Cabeça da chave (círculo) */}
          <circle
            cx="0"
            cy="-28"
            r="8"
            fill="none"
            stroke={accentColor}
            strokeWidth="3"
          />
          {/* Dentes da chave */}
          <g transform="translate(0, 25)">
            <rect x="-3" y="0" width="8" height="4" fill={accentColor} />
            <rect x="-3" y="6" width="6" height="4" fill={accentColor} />
            <rect x="-3" y="12" width="8" height="4" fill={accentColor} />
          </g>
        </g>
      </g>
    </svg>
  );
};

LogoSVG.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

export default LogoSVG;
