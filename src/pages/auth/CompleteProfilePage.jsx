import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    personType: 'fisica', // fisica ou juridica
    cpfCnpj: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documentValidation, setDocumentValidation] = useState({
    isValidating: false,
    isValid: false,
    exists: false,
    error: null
  });

  // Redirect if user is not authenticated or already has complete profile
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // If user already has CPF/CNPJ, redirect to dashboard
    if (user.cpfCnpj) {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);

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
    setIsLoading(true);
    
    // Validate document
    if (!documentValidation.isValid) {
      setError('Por favor, insira um CPF/CNPJ válido');
      setIsLoading(false);
      return;
    }

    try {
      // Update user profile with additional data
      const result = await updateUser({
        displayName: formData.displayName,
        personType: formData.personType,
        cpfCnpj: formData.cpfCnpj,
        profileCompleted: true,
        profileCompletedAt: new Date().toISOString()
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError('Erro ao completar perfil. Tente novamente.');
      }
    } catch (error) {
      setError('Erro ao completar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const floatingIcons = [
    { Icon: FaCar, delay: 0, x: '10%', y: '20%' },
    { Icon: FaMotorcycle, delay: 0.5, x: '80%', y: '15%' },
    { Icon: FaWrench, delay: 1, x: '15%', y: '70%' },
    { Icon: FaCog, delay: 1.5, x: '85%', y: '75%' },
    { Icon: FaOilCan, delay: 2, x: '50%', y: '10%' },
    { Icon: FaTools, delay: 2.5, x: '20%', y: '45%' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="%23ffffff" stroke-width="1" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>')`,
            filter: 'blur(1px)'
          }}
        />
      </div>

      {/* Floating animated icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-white/20 text-4xl"
          style={{ left: x, top: y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon />
        </motion.div>
      ))}

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4 shadow-2xl"
            >
              <FaUserPlus className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Complete seu Perfil
            </h1>
            <p className="text-gray-300">
              Para continuar, precisamos de algumas informações adicionais
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-200 mb-2">
                  {formData.personType === 'fisica' ? 'Nome Completo *' : 'Razão Social *'}
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
                  <option value="fisica" className="bg-gray-800">Pessoa Física</option>
                  <option value="juridica" className="bg-gray-800">Pessoa Jurídica</option>
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

              <button 
                type="submit" 
                disabled={isLoading || !documentValidation.isValid}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Completando perfil...
                  </div>
                ) : (
                  'Completar Perfil'
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;