import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useThemeStore } from '../../store/index.jsx';
import LogoSVG from './LogoSVG';
import styles from './Logo.module.css';

// Logo personalizada para tema escuro
const DARK_MODE_LOGO = '/logos/torq-dark.png';

/**
 * Logo Component - Sistema de Logo Dinâmico
 * 
 * Componente profissional de logo que se adapta automaticamente ao tema
 * do sistema (light/dark), com transições suaves e animações elegantes.
 * 
 * Features:
 * - Adaptação automática ao tema
 * - Transições suaves entre temas
 * - Animação de entrada opcional
 * - Responsivo e acessível
 * - Otimizado para performance
 * - Suporte a diferentes tamanhos
 * 
 * @example
 * // Uso básico
 * <Logo />
 * 
 * @example
 * // Com tamanho e callback
 * <Logo size="large" onClick={() => navigate('/')} />
 * 
 * @example
 * // Versão compacta sem animação
 * <Logo variant="compact" animate={false} />
 */
const Logo = ({
  size = 'medium',
  variant = 'full',
  onClick = undefined,
  className = '',
  animate = true,
  ariaLabel = undefined,
}) => {
  const { isDarkMode } = useThemeStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Determinar tema atual
  const currentTheme = isDarkMode ? 'dark' : 'light';

  // Detectar mudança de tema e aplicar transição
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [isDarkMode]);

  // Marcar como animado após primeira renderização
  useEffect(() => {
    if (animate && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [animate, hasAnimated]);

  // Handler de clique com feedback
  const handleClick = useCallback((event) => {
    if (onClick && !isLoading && !hasError) {
      onClick(event);
    }
  }, [onClick, isLoading, hasError]);

  // Handler de teclado para acessibilidade
  const handleKeyPress = useCallback((event) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick) {
      event.preventDefault();
      handleClick(event);
    }
  }, [handleClick, onClick]);

  // Calcular dimensões baseado no tamanho
  const dimensions = useMemo(() => {
    const sizes = {
      small: { width: 140, height: 42 },
      medium: { width: 180, height: 54 },
      large: { width: 220, height: 66 },
      auto: { width: undefined, height: undefined },
    };
    return sizes[size] || sizes.medium;
  }, [size]);

  // Gerar aria-label contextual
  const computedAriaLabel = useMemo(() => {
    if (ariaLabel) return ariaLabel;
    const themeText = isDarkMode ? 'tema escuro' : 'tema claro';
    return `TORQ - Sistema de Gestão de Oficina - ${themeText}`;
  }, [ariaLabel, isDarkMode]);

  // Classes CSS combinadas
  const containerClasses = useMemo(() => {
    const classes = [
      styles.logoContainer,
      styles[size],
      variant === 'compact' && styles.compact,
      animate && !hasAnimated && styles.animate,
      isTransitioning && styles.transitioning,
      isLoading && styles.loading,
      hasError && styles.error,
      className,
    ].filter(Boolean);
    
    return classes.join(' ');
  }, [size, variant, animate, hasAnimated, isTransitioning, isLoading, hasError, className]);

  // Renderizar componente
  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : -1}
      aria-label={computedAriaLabel}
      aria-busy={isLoading}
      aria-disabled={hasError}
    >
      {isDarkMode ? (
        <div
          style={{
            width: dimensions.width * 2.2,
            height: dimensions.height * 1.5,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            isolation: 'isolate',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgb(18, 18, 20)',
              zIndex: 0,
            }}
          />
          <img
            src={DARK_MODE_LOGO}
            alt="TORQ"
            style={{
              width: dimensions.width * 3,
              height: 'auto',
              objectFit: 'cover',
              objectPosition: 'center top',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              clipPath: 'inset(15% 10% 35% 10%)',
              transform: 'scale(1.4)',
              position: 'relative',
              zIndex: 1,
              mixBlendMode: 'lighten',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: dimensions.width * 2.2,
            height: dimensions.height * 1.5,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            isolation: 'isolate',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgb(255, 255, 255)',
              zIndex: 0,
            }}
          />
          <img
            src={DARK_MODE_LOGO}
            alt="TORQ"
            style={{
              width: dimensions.width * 3,
              height: 'auto',
              objectFit: 'cover',
              objectPosition: 'center top',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              clipPath: 'inset(15% 10% 35% 10%)',
              transform: 'scale(1.4)',
              position: 'relative',
              zIndex: 1,
              mixBlendMode: 'darken',
              filter: 'invert(1) hue-rotate(180deg)',
            }}
          />
        </div>
      )}
    </div>
  );
};

// Memoizar componente para evitar re-renders desnecessários
export default React.memo(Logo);
