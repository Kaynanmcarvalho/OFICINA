import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Registro
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Página de registro em construção
        </p>
        <div className="text-center">
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;