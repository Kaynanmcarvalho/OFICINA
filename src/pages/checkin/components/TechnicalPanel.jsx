/**
 * TechnicalPanel - Painel de especificações técnicas
 * Exibe dados técnicos do veículo
 */

import { motion } from 'framer-motion';
import { Fuel, Gauge, Wrench, AlertTriangle } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import carSpecs from '../data/car_specs.json';

const TechnicalPanel = ({ vehicleData }) => {
  const { isDarkMode } = useThemeStore();
  
  if (!vehicleData) return null;

  const { marca, modelo } = vehicleData;

  // Busca especificações
  const getSpecs = () => {
    try {
      const brandData = carSpecs[marca];
      if (brandData && brandData[modelo]) {
        return brandData[modelo];
      }
      return carSpecs.default;
    } catch {
      return carSpecs.default;
    }
  };

  const specs = getSpecs();

  const specItems = [
    { icon: Fuel, label: 'Combustível', value: specs.combustivel, color: 'blue' },
    { icon: Gauge, label: 'Consumo', value: specs.consumo, color: 'green' },
    { icon: Wrench, label: 'Motor', value: specs.motor, color: 'purple' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-2xl border-2 p-6
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        shadow-xl
      `}
    >
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Especificações Técnicas
      </h3>

      <div className="space-y-4">
        {specItems.map((item, index) => {
          const Icon = item.icon;
          const colorClasses = {
            blue: isDarkMode ? 'text-blue-400 bg-blue-600/20' : 'text-blue-600 bg-blue-100',
            green: isDarkMode ? 'text-green-400 bg-green-600/20' : 'text-green-600 bg-green-100',
            purple: isDarkMode ? 'text-purple-400 bg-purple-600/20' : 'text-purple-600 bg-purple-100'
          };

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-start gap-3 p-3 rounded-lg
                ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}
              `}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[item.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.label}
                </p>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.value}
                </p>
              </div>
            </motion.div>

        })}
      </div>

      {/* Alertas */}
      {specs.alertas && specs.alertas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`
            mt-6 p-4 rounded-lg border-2
            ${isDarkMode 
              ? 'bg-yellow-600/10 border-yellow-600/30' 
              : 'bg-yellow-50 border-yellow-200'
            }
          `}
        >
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h4 className={`font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
              Alertas Importantes
            </h4>
          </div>
          <ul className="space-y-1 ml-7">
            {specs.alertas.map((alerta, index) => (
              <li 
                key={index}
                className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}
              >
                • {alerta}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TechnicalPanel;
