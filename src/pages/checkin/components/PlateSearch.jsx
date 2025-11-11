/**
 * PlateSearch - Componente de busca de placa
 * Design premium com validação em tempo real
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { isValidPlaca } from '../../../services/vehicleDataService';

// Formata a placa apenas para exibição no input (insere hífen após 3 caracteres)
const formatPlateDisplay = (value) => {
  if (!value) return '';
  const clean = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
  // Insere hífen após 3 caracteres se tiver mais de 3
  if (clean.length > 3) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  return clean;
};

const PlateSearch = ({ onSearch, isLoading }) => {
  const { isDarkMode } = useThemeStore();
  const [plate, setPlate] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (value.length <= 7) {
      setPlate(value);
      setError('');
      
      if (value.length === 7) {
        const valid = isValidPlaca(value);
        setIsValid(valid);
        if (!valid) {
          setError('Formato de placa inválido');
        }
      } else {
        setIsValid(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValidPlaca(plate)) {
      setError('Placa inválida. Use o formato ABC1234 ou ABC1D23');
      return;
    }
    
    onSearch(plate);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input de Placa */}
        <div className="relative">
          <div className={`
            relative rounded-2xl border-2 transition-all duration-300
            ${error 
              ? 'border-red-500 shadow-lg shadow-red-500/20' 
              : isValid 
                ? 'border-green-500 shadow-lg shadow-green-500/20'
                : isDarkMode
                  ? 'border-gray-700 hover:border-gray-600'
                  : 'border-gray-300 hover:border-gray-400'
            }
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
          `}>
            <input
              type="text"
              value={formatPlateDisplay(plate)}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Digite a placa do veículo"
              disabled={isLoading}
              className={`
                w-full px-6 py-5 text-2xl font-bold text-center
                bg-transparent outline-none tracking-wider
                ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
                ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
              `}
              maxLength={8}
              autoFocus
            />
            
            {/* Ícone de Status */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              ) : error ? (
                <AlertCircle className="w-6 h-6 text-red-500" />
              ) : isValid ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : null}
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-500 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.p>
          )}

          {/* Dica */}
          {!error && plate.length === 0 && (
            <p className={`mt-2 text-sm text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Formato: ABC-1234 ou ABC-1D23 (Mercosul)
            </p>
          )}
        </div>

        {/* Botão de Busca */}
        <motion.button
          type="submit"
          disabled={!isValid || isLoading}
          whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
          whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
          className={`
            w-full py-4 rounded-xl font-semibold text-lg
            flex items-center justify-center gap-3
            transition-all duration-300
            ${isValid && !isLoading
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30'
              : isDarkMode
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Buscando dados...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Buscar Veículo
            </>
          )}
        </motion.button>
      </form>

      {/* Exemplos */}
      <div className={`mt-6 text-center ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        <p className="text-xs mb-2">Exemplos de placas válidas:</p>
        <div className="flex justify-center gap-4 text-sm font-mono">
          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>ABC-1234</span>
          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>ABC-1D23</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PlateSearch;
