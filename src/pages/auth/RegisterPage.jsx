import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/index.jsx';
import { motion } from 'framer-motion';
import { FaTools, FaCar, FaMotorcycle, FaWrench, FaCog, FaOilCan, FaUserPlus, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { 
  formatCPF, 
  formatCNPJ, 
  isValidCPFFormat, 
  isValidCNPJFormat, 
  validateDocument 
} from '../../utils/cpfCnpjValidator.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, authError } = useAuthStore();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin', // Default role - Administrativo
    personType: 'fisica', // fisica ou juridica
    cpfCnpj: ''
  });
  const [error, setError] = useState('');
  const [documentValidation, setDocumentValidation] = useState({
    isValidating: false,
    isValid: false,
    exists: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cpfCnpj') {
      // Formatar CPF ou CNPJ automaticamente
      const formattedValue = formData.personType === 'fisica' 
        ? formatCPF(value) 
        : formatCNPJ(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      
      // Validar documento em tempo real
      validateDocumentRealTime(formattedValue, formData.personType);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Validação em tempo real do documento
  const validateDocumentRealTime = async (document, type) => {
    if (!document || document.length < 11) {
      setDocumentValidation({ isValidating: false, isValid: false, exists: false, error: null });
      return;
    }
    
    setDocumentValidation(prev => ({ ...prev, isValidating: true }));
    
    try {
      const documentType = type === 'fisica' ? 'cpf' : 'cnpj';
      const result = await validateDocument(document, documentType);
      
      setDocumentValidation({
        isValidating: false,
        isValid: result.valid,
        exists: result.exists,
        error: result.error
      });
    } catch (error) {
      setDocumentValidation({
        isValidating: false,
        isValid: false,
        exists: false,
        error: 'Erro ao validar documento'
      });
    }
  };
  
  // Revalidar documento quando tipo de pessoa mudar
  useEffect(() => {
    if (formData.cpfCnpj) {
      const formattedValue = formData.personType === 'fisica' 
        ? formatCPF(formData.cpfCnpj) 
        : formatCNPJ(formData.cpfCnpj);
      setFormData(prev => ({ ...prev, cpfCnpj: formattedValue }));
      validateDocumentRealTime(formattedValue, formData.personType);
    }
  }, [formData.personType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    // Validate document
    if (!documentValidation.isValid) {
      setError('Por favor, insira um CPF/CNPJ válido');
      return;
    }

    // Register user with additional data
    const result = await register(formData.email, formData.password, {
      displayName: formData.displayName,
      role: formData.role,
      personType: formData.personType,
      cpfCnpj: formData.cpfCnpj
    });

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Fundo com blur estilo Figma */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800" />
      <div className="absolute inset-0 bg-[url('/workshop-bg.jpg')] bg-cover bg-center filter blur-lg scale-110 opacity-30" />
      
      {/* Ícones flutuantes temáticos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 text-purple-500/20 text-6xl"
        >
          <FaCar />
        </motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, 80, 0],
            y: [0, -60, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 27, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 left-32 text-blue-500/20 text-5xl"
        >
          <FaMotorcycle />
        </motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, -60, 0],
            y: [0, 40, 0],
            rotate: [0, -90, -180]
          }}
          transition={{ duration: 17, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 right-40 text-green-500/20 text-4xl"
        >
          <FaWrench />
        </motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, 40, 0],
            y: [0, -80, 0],
            rotate: [0, 90, 180]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 text-orange-500/20 text-5xl"
        >
          <FaCog />
        </motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, -120, 0],
            y: [0, 70, 0],
            rotate: [0, -270, -360]
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute top-60 right-1/3 text-red-500/20 text-4xl"
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
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mr-3">
              <FaUserPlus className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Criar Conta
            </h1>
          </div>
          <p className="text-gray-300 mt-2">
            Junte-se à nossa oficina premium
          </p>
        </div>
        {(error || authError) && (
          <p className="text-red-400 text-center mb-6 bg-red-900/30 p-3 rounded-lg backdrop-blur-sm">
            {error || authError}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <label htmlFor="personType" className="block text-sm font-medium text-gray-200 mb-2">
               Tipo de Pessoa *
             </label>
             <select
               id="personType"
               name="personType"
               value={formData.personType}
               onChange={handleChange}
               className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
               required
             >
               <option value="fisica" className="bg-gray-800 text-white">Pessoa Física</option>
               <option value="juridica" className="bg-gray-800 text-white">Pessoa Jurídica</option>
             </select>
           </div>
           <div>
              <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-200 mb-2">
                {formData.personType === 'fisica' ? 'CPF *' : 'CNPJ *'}
              </label>
              <div className="relative">
                <input
                  id="cpfCnpj"
                  type="text"
                  name="cpfCnpj"
                  placeholder={formData.personType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                  value={formData.cpfCnpj}
                  onChange={handleChange}
                  maxLength={formData.personType === 'fisica' ? 14 : 18}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition duration-200 ${
                    documentValidation.isValid 
                      ? 'border-green-500 focus:ring-green-500' 
                      : documentValidation.error 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-purple-500'
                  }`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {documentValidation.isValidating ? (
                    <FaSpinner className="animate-spin text-blue-400" />
                  ) : documentValidation.isValid ? (
                    <FaCheckCircle className="text-green-400" />
                  ) : documentValidation.error ? (
                    <FaTimesCircle className="text-red-400" />
                  ) : null}
                </div>
              </div>
              {documentValidation.error && (
                <p className="text-red-400 text-sm mt-1">{documentValidation.error}</p>
              )}
              {documentValidation.isValid && (
                <p className="text-green-400 text-sm mt-1">
                  {formData.personType === 'fisica' ? 'CPF' : 'CNPJ'} válido
                </p>
              )}
            </div>
           <div>
             <label htmlFor="displayName" className="block text-sm font-medium text-gray-200 mb-2">
               {formData.personType === 'fisica' ? 'Nome Completo' : 'Razão Social'}
             </label>
             <input
               id="displayName"
               type="text"
               name="displayName"
               placeholder={formData.personType === 'fisica' ? 'Seu nome completo' : 'Nome da empresa'}
               value={formData.displayName}
               onChange={handleChange}
               className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
               required
             />
           </div>
           <div>
             <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
               Email *
             </label>
             <input
               id="email"
               type="email"
               name="email"
               placeholder="seu@email.com"
               value={formData.email}
               onChange={handleChange}
               className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
               required
             />
           </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:via-blue-700 hover:to-purple-900 transition duration-300 shadow-lg transform hover:scale-105"
          >
            Criar Conta
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          <span className="text-gray-300">
            Já tem uma conta?{' '}
          </span>
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition duration-200">
            Faça login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;