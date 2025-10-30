/**
 * ErrorBoundary Component
 * Catches and handles errors in RecentCheckinsSection
 */

import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('RecentCheckins Error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.25))',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 16px rgba(239,68,68,0.25)'
              }}
            >
              <AlertTriangle size={32} className="text-red-400" strokeWidth={2} />
            </div>
            
            <h3 
              className="text-white font-semibold mb-2"
              style={{ fontSize: '16px' }}
            >
              Erro ao carregar check-ins
            </h3>
            
            <p 
              className="text-gray-400 text-center mb-4"
              style={{ fontSize: '14px' }}
            >
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            
            <button
              onClick={this.handleReload}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#60A5FA',
                fontSize: '14px'
              }}
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
