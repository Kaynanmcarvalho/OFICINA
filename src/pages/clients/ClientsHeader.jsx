/**
 * ClientsHeader - Header premium para página de clientes
 * Design Apple-like com gradientes e micro-animações
 */

import { motion as Motion } from 'framer-motion';
import { Users, Plus, Sparkles } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const ClientsHeader = ({ clientCount, activeCount, onNewClient }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <Motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Title Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.1 
              }}
              className={`p-3 rounded-2xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                  : 'bg-gradient-to-br from-blue-100 to-purple-100'
              }`}
            >
              <Users className={`w-7 h-7 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </Motion.div>
            
            <div>
              <h1 className={`text-4xl font-bold tracking-tight ${
                isDarkMode 
                  ? 'text-white' 
                  : 'text-gray-900'
              }`}>
                Gestão de Clientes
              </h1>
            </div>
          </div>
          
          <Motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-base ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Gerencie seus clientes com eficiência e estilo
          </Motion.p>
        </div>

        {/* Action Button */}
        <Motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewClient}
          className={`
            group relative px-6 py-3.5 rounded-xl font-semibold
            flex items-center gap-2.5 overflow-hidden
            transition-all duration-300
            ${isDarkMode 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/30' 
              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30'
            }
          `}
        >
          {/* Shine effect */}
          <Motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          
          <Plus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Novo Cliente</span>
          
          {/* Glow effect */}
          <Motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3), transparent 70%)',
              filter: 'blur(10px)'
            }}
          />
        </Motion.button>
      </div>

      {/* Stats Cards */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Clients */}
        <Motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className={`
            relative p-5 rounded-2xl backdrop-blur-xl
            border transition-all duration-300
            ${isDarkMode 
              ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700 shadow-xl' 
              : 'glass-effect hover:shadow-md'
            }
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Total de Clientes
            </span>
            <Users className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </div>
          <div className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {clientCount}
          </div>
        </Motion.div>

        {/* Active Clients */}
        <Motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className={`
            relative p-5 rounded-2xl backdrop-blur-xl
            border transition-all duration-300
            ${isDarkMode 
              ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700 shadow-xl' 
              : 'glass-effect hover:shadow-md'
            }
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Clientes Ativos
            </span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {activeCount}
          </div>
          <div className="mt-1 text-xs text-green-500 font-medium">
            {clientCount > 0 ? Math.round((activeCount / clientCount) * 100) : 0}% do total
          </div>
        </Motion.div>

        {/* Inactive Clients */}
        <Motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className={`
            relative p-5 rounded-2xl backdrop-blur-xl
            border transition-all duration-300
            ${isDarkMode 
              ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700 shadow-xl' 
              : 'glass-effect hover:shadow-md'
            }
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Clientes Inativos
            </span>
            <div className="w-2 h-2 rounded-full bg-gray-500" />
          </div>
          <div className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {clientCount - activeCount}
          </div>
          <div className="mt-1 text-xs text-gray-500 font-medium">
            {clientCount > 0 ? Math.round(((clientCount - activeCount) / clientCount) * 100) : 0}% do total
          </div>
        </Motion.div>

        {/* Quick Action */}
        <Motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewClient}
          className={`
            relative p-5 rounded-2xl backdrop-blur-xl
            border transition-all duration-300 cursor-pointer group
            ${isDarkMode 
              ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-800 hover:border-blue-700' 
              : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300'
            }
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Ação Rápida
            </span>
            <Sparkles className={`w-4 h-4 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            } group-hover:rotate-12 transition-transform`} />
          </div>
          <div className={`text-lg font-semibold ${
            isDarkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            Adicionar Cliente
          </div>
          <div className={`mt-1 text-xs ${
            isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70'
          }`}>
            Pressione "N" ou clique aqui
          </div>
        </Motion.div>
      </Motion.div>

      {/* Keyboard Shortcuts Hint */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={`mt-4 flex items-center gap-4 text-xs ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <kbd className={`px-2 py-1 rounded ${
            isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}>
            ⌘K
          </kbd>
          <span>Buscar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className={`px-2 py-1 rounded ${
            isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}>
            N
          </kbd>
          <span>Novo Cliente</span>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default ClientsHeader;

