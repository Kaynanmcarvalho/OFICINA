/**
 * VehicleInfoPanel - Painel de informações do veículo
 * Exibe dados retornados do backend com design premium
 */

import { motion } from 'framer-motion';
import { Car, Calendar, Palette, Tag } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import maintenanceData from '../data/maintenance_data.json';

const VehicleInfoPanel = ({ vehicleData }) => {
  const { isDarkMode } = useThemeStore();
  
  if (!vehicleData) return null;

  const { marca, modelo, ano, cor } = vehicleData;

  // Busca recomendações
  const getRecommendations = () => {
    try {
      const brandData = maintenanceData[marca];
      if (brandData && brandData[modelo]) {
        return brandData[modelo].recomendacoes;
      }
      return maintenanceData.default.recomendacoes;
    } catch {
      return maintenanceData.default.recomendacoes;
    }
  };

  const recommendations = getRecommendations();

  // Gera gradiente baseado na cor do veículo
  const getGradient = () => {
    if (!cor) return isDarkMode ? 'from-gray-800 to-gray-900' : 'from-gray-50 to-gray-100';
    
    // Converte hex para RGB e cria gradiente suave
    const opacity = isDarkMode ? '15' : '10';
    return `bg-gradient-to-br from-[${cor}${opacity}] to-transparent`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Card Principal */}
      <div className={`
        rounded-2xl border-2 overflow-hidden
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        shadow-2xl
      `}>
        {/* Header com Gradiente */}
        <div 
          className={`
            relative p-8 ${getGradient()}
            ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}
          `}
          style={cor ? { 
            background: `linear-gradient(135deg, ${cor}${isDarkMode ? '20' : '15'}, transparent)` 
          } : {}}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {marca} {modelo}
              </motion.h2>
              
              <div className="flex flex-wrap gap-4 mt-4">
                {/* Ano */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/80'}
                  `}
                >
                  <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {ano}
                  </span>
                </motion.div>

                {/* Cor */}
                {cor && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/80'}
                    `}
                  >
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: cor }}
                    />
                    <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {cor}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Ícone do Veículo */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className={`
                w-20 h-20 rounded-2xl flex items-center justify-center
                ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-100'}
              `}
            >
              <Car className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
          </div>
        </div>

        {/* Recomendações */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recomendações de Manutenção
            </h3>
          </div>

          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`
                  flex items-start gap-3 p-3 rounded-lg
                  ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}
                `}
              >
                <div className={`
                  w-2 h-2 rounded-full mt-2 flex-shrink-0
                  ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}
                `} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {rec}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleInfoPanel;
