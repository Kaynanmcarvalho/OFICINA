/**
 * EmptyState - Estado vazio elegante
 */

import { motion } from 'framer-motion';
import { Users, Search, Plus } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const EmptyState = ({ hasClients, hasFilters, onNewClient, onClearFilters }) => {
  const { isDarkMode } = useThemeStore();

  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          flex flex-col items-center justify-center py-20 px-6
          rounded-2xl backdrop-blur-xl border
          ${isDarkMode 
            ? 'bg-gray-900/30 border-gray-800 shadow-xl' 
            : 'glass-effect'
          }
        `}
      >
        <div className={`
          w-20 h-20 rounded-full flex items-center justify-center mb-6
          ${isDarkMode 
            ? 'bg-gray-800' 
            : 'bg-gray-100'
          }
        `}>
          <Search className={`w-10 h-10 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
        </div>
        
        <h3 className={`text-2xl font-bold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Nenhum resultado encontrado
        </h3>
        
        <p className={`text-center mb-6 max-w-md ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Não encontramos clientes com os filtros aplicados. Tente ajustar sua busca.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearFilters}
          className={`
            px-6 py-3 rounded-xl font-semibold transition-all
            ${isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          Limpar Filtros
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex flex-col items-center justify-center py-20 px-6
        rounded-2xl backdrop-blur-xl border
        ${isDarkMode 
          ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800' 
          : 'glass-effect'
        }
      `}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className={`
          w-24 h-24 rounded-full flex items-center justify-center mb-6
          ${isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' 
            : 'bg-gradient-to-br from-blue-100 to-purple-100'
          }
        `}
      >
        <Users className={`w-12 h-12 ${
          isDarkMode ? 'text-blue-400' : 'text-blue-600'
        }`} />
      </motion.div>
      
      <h3 className={`text-2xl font-bold mb-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Nenhum cliente cadastrado ainda
      </h3>
      
      <p className={`text-center mb-8 max-w-md ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Adicione o primeiro cliente e comece seu fluxo de gestão em segundos.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNewClient}
        className={`
          flex items-center gap-2 px-8 py-4 rounded-xl font-semibold
          transition-all shadow-lg
          ${isDarkMode 
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/30' 
            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-500/30'
          }
        `}
      >
        <Plus className="w-5 h-5" />
        Adicionar Primeiro Cliente
      </motion.button>
    </motion.div>
  );
};

export default EmptyState;
