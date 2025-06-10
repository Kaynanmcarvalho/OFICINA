import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/index.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const handleDemoLogin = () => {
    // Create a demo user
    const demoUser = {
      uid: 'demo-user-123',
      email: 'demo@oficina.com',
      displayName: 'Usuário Demo',
      photoURL: null,
      role: 'admin',
      permissions: ['all']
    };

    // Set the demo user in the auth store
    authStore.user = demoUser;
    authStore.isAuthenticated = true;
    authStore.userRole = 'admin';
    authStore.permissions = ['all'];

    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Login
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Página de login em construção
        </p>
        
        {/* Demo Login Button */}
        <div className="mb-6">
          <button
            onClick={handleDemoLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            🚀 Entrar como Demo
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Acesso completo para testar a aplicação
          </p>
        </div>
        
        <div className="text-center">
          <Link 
            to="/register" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Não tem uma conta? Registre-se
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;