import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * LogoFallback Component
 * Componente de fallback exibido quando a logo falha ao carregar
 */
const LogoFallback = ({ isDarkMode }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 16px',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSize: '18px',
      fontWeight: '700',
      color: isDarkMode ? '#ffffff' : '#000000',
      letterSpacing: '-0.5px',
      userSelect: 'none',
    }}
  >
    ReparoFácil
  </div>
);

LogoFallback.propTypes = {
  isDarkMode: PropTypes.bool,
};

LogoFallback.defaultProps = {
  isDarkMode: false,
};

/**
 * LogoErrorBoundary Component
 * Error Boundary específico para o componente Logo
 * 
 * Captura erros durante renderização e exibe fallback elegante
 */
class LogoErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
    this.retryTimer = null;
  }

  static getDerivedStateFromError(error) {
    // Atualizar estado para exibir fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro em modo desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('Logo Error Boundary caught an error:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // Tentar retry automático após 2 segundos (máximo 2 tentativas)
    if (this.state.retryCount < 2) {
      this.retryTimer = setTimeout(() => {
        this.setState((prevState) => ({
          hasError: false,
          error: null,
          errorInfo: null,
          retryCount: prevState.retryCount + 1,
        }));
      }, 2000);
    }

    // Callback de erro opcional
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    // Limpar timer ao desmontar
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  render() {
    if (this.state.hasError) {
      // Renderizar fallback customizado ou padrão
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <LogoFallback isDarkMode={this.props.isDarkMode} />;
    }

    return this.props.children;
  }
}

LogoErrorBoundary.propTypes = {
  /** Componentes filhos */
  children: PropTypes.node.isRequired,
  
  /** Componente de fallback customizado */
  fallback: PropTypes.node,
  
  /** Callback executado quando erro é capturado */
  onError: PropTypes.func,
  
  /** Indica se está em modo escuro */
  isDarkMode: PropTypes.bool,
};

LogoErrorBoundary.defaultProps = {
  fallback: null,
  onError: null,
  isDarkMode: false,
};

export default LogoErrorBoundary;
export { LogoFallback };
