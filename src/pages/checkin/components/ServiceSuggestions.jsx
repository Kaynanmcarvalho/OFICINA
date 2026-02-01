/**
 * ServiceSuggestions - Sugestões preditivas de serviços
 * Baseado no modelo, ano e quilometragem
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, AlertTriangle, Clock, Wrench } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import serviceSuggestions from '../data/service_suggestions.json';

const ServiceSuggestions = ({ vehicleData, onServicesChange }) => {
  const { isDarkMode } = useThemeStore();
  const [selectedServices, setSelectedServices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (vehicleData) {
      generateSuggestions();
    }
  }, [vehicleData]);

  useEffect(() => {
    if (onServicesChange) {
      onServicesChange(selectedServices);
    }
  }, [selectedServices, onServicesChange]);

  const generateSuggestions = () => {
    const { ano } = vehicleData;
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(ano);
    
    let allSuggestions = [];
    
    // Sugestões por quilometragem (simulada baseada no ano)
    const estimatedKm = vehicleAge * 15000; // 15k km por ano
    const kmRanges = Object.keys(serviceSuggestions.quilometragem)
      .map(k => parseInt(k))
      .sort((a, b) => b - a);
    
    const applicableKmRange = kmRanges.find(range => estimatedKm >= range);
    if (applicableKmRange) {
      allSuggestions.push(...serviceSuggestions.quilometragem[applicableKmRange]);
    }
    
    // Sugestões por ano
    const yearRanges = Object.keys(serviceSuggestions.ano);
    const applicableYearRange = yearRanges.find(range => {
      const [start, end] = range.split('-').map(y => parseInt(y));
      return parseInt(ano) >= start && parseInt(ano) <= end;
    }) || yearRanges.find(range => range === 'antes-2010' && parseInt(ano) < 2010);
    
    if (applicableYearRange) {
      allSuggestions.push(...serviceSuggestions.ano[applicableYearRange]);
    }
    
    // Remove duplicatas e ordena por prioridade
    const uniqueSuggestions = allSuggestions.reduce((acc, current) => {
      const existing = acc.find(item => item.id === current.id);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    const priorityOrder = { 'critica': 0, 'alta': 1, 'media': 2, 'baixa': 3 };
    uniqueSuggestions.sort((a, b) => priorityOrder[a.prioridade] - priorityOrder[b.prioridade]);
    
    setSuggestions(uniqueSuggestions);
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const getPriorityColor = (prioridade) => {
    const colors = {
      critica: isDarkMode ? 'text-red-400 bg-red-600/20' : 'text-red-600 bg-red-100',
      alta: isDarkMode ? 'text-orange-400 bg-orange-600/20' : 'text-orange-600 bg-orange-100',
      media: isDarkMode ? 'text-yellow-400 bg-yellow-600/20' : 'text-yellow-600 bg-yellow-100',
      baixa: isDarkMode ? 'text-green-400 bg-green-600/20' : 'text-green-600 bg-green-100'
    };
    return colors[prioridade] || colors.media;
  };

  const getPriorityIcon = (prioridade) => {
    switch (prioridade) {
      case 'critica':
        return AlertTriangle;
      case 'alta':
        return Clock;
      default:
        return Wrench;
    }
  };

  if (!vehicleData || suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-2xl border-2 p-6
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        shadow-xl
      `}
    >
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Serviços Recomendados
      </h3>
      
      <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Baseado no modelo e ano do veículo. Selecione os serviços desejados:
      </p>

      <div className="space-y-3">
        {suggestions.map((service, index) => {
          const isSelected = selectedServices.includes(service.id);
          const PriorityIcon = getPriorityIcon(service.prioridade);
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleService(service.id)}
              className={`
                flex items-start gap-3 p-4 rounded-xl cursor-pointer
                transition-all duration-200 border-2
                ${isSelected
                  ? isDarkMode
                    ? 'bg-blue-600/20 border-blue-600/50'
                    : 'bg-blue-50 border-blue-200'
                  : isDarkMode
                    ? 'bg-gray-700/30 border-gray-700 hover:border-gray-600'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Checkbox */}
              <div className="flex-shrink-0 mt-0.5">
                {isSelected ? (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                ) : (
                  <Circle className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                )}
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.nome}
                  </h4>
                  
                  {/* Badge de prioridade */}
                  <div className={`
                    flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${getPriorityColor(service.prioridade)}
                  `}>
                    <PriorityIcon className="w-3 h-3" />
                    {service.prioridade}
                  </div>
                </div>
                
                {service.descricao && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {service.descricao}
                  </p>
                )}
              </div>
            </motion.div>

        })}
      </div>
      
      {/* Resumo */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mt-6 p-4 rounded-lg border-2
            ${isDarkMode 
              ? 'bg-blue-600/10 border-blue-600/30' 
              : 'bg-blue-50 border-blue-200'
            }
          `}
        >
          <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            {selectedServices.length} serviço(s) selecionado(s)
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ServiceSuggestions;
