import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/index.jsx';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { FaTools, FaCar, FaMotorcycle, FaWrench, FaCog, FaOilCan } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, authError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      // Limpar apenas a senha em caso de erro, mantendo o email
      setPassword('');
    }
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      if (result.needsProfileCompletion) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Fundo com blur estilo Figma */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800" />
      <div className="absolute inset-0 bg-[url('/workshop-bg.jpg')] bg-cover bg-center filter blur-lg scale-110 opacity-30" />
      
      {/* Ícones flutuantes temáticos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 text-blue-500/20 text-6xl"
        >
          <FaCar />
        </motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 right-32 text-orange-500/20 text-5xl"
        >
          <FaMotorcycle />
        </motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, 60, 0],
            y: [0, -40, 0],
            rotate: [0, 90, 180]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-40 text-green-500/20 text-4xl"
        >
          <FaWrench />
        </motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 80, 0],
            rotate: [0, -90, -180]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 text-purple-500/20 text-5xl"
        >
          <FaCog />
        </motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, 120, 0],
            y: [0, -70, 0],
            rotate: [0, 270, 360]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-60 left-1/3 text-red-500/20 text-4xl"
        >
          <FaOilCan />
        </motion.div>
      </div>
      
      {/* Overlay com efeito glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-md w-full p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          boxShadow: '0 25px 45px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3">
              <FaTools className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Oficina Premium
            </h1>
          </div>
          <p className="text-gray-300 mt-2">
            Acesse sua área de gerenciamento
          </p>
        </div>
        {authError && <p className="text-red-400 text-center mb-6 bg-red-900/30 p-3 rounded-lg backdrop-blur-sm">{authError}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Senha
              </label>
              <button 
                type="button"
                onClick={() => alert('Funcionalidade em desenvolvimento. Entre em contato com o administrador.')}
                className="text-sm text-blue-400 hover:text-blue-300 transition duration-200"
              >
                Esqueceu a senha?
              </button>
            </div>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 transition duration-300 shadow-lg transform hover:scale-105"
          >
            Entrar
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-transparent px-2 text-gray-300">
              Ou continue com
            </span>
          </div>
        </div>
        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-white/10 backdrop-blur-sm text-white py-3 rounded-xl font-medium border border-white/20 hover:bg-white/20 transition duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
        >
          <FcGoogle className="mr-2 text-xl" />
          Entrar com Google
        </button>
        <div className="text-center mt-6 text-sm">
          <span className="text-gray-300">
            Não tem uma conta?{' '}
          </span>
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition duration-200">
            Registre-se
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;