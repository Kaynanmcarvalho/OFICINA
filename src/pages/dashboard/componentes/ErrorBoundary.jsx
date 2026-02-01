import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary para capturar erros de renderização no Dashboard
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Dashboard ErrorBoundary] Erro capturado:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ops! Algo deu errado
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ocorreu um erro ao carregar o dashboard. Por favor, tente novamente.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-left">
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              Recarregar Dashboard
            </button>
          </div>
        </div>
  );
}

return this.props.children;
  }
}

export default ErrorBoundary;
