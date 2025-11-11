/**
 * Checklist - Checklist inteligente interativo
 * Baseado no tipo de veículo
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Circle } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { detectVehicleType } from '../../../services/vehicleDataService';
import checklistData from '../data/checklist_data.json';

const Checklist = ({ vehicleData, onChecklistChange }) => {
  const { isDarkMode } = useThemeStore();
  const [checklistItems, setChecklistItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (vehicleData) {
      loadChecklist();
    }
  }, [vehicleData]);

  useEffect(() => {
    if (onChecklistChange) {
      const results = Object.entries(checkedItems).map(([id, data]) => ({
        id,
        item: checklistItems.find(item => item.id === id)?.label || id,
        status: data.status,
        observacao: data.observacao || ''
      }));
      onChecklistChange(results);
    }
  }, [checkedItems, checklistItems, onChecklistChange]);

  const loadChecklist = () => {
    const { marca, modelo } = vehicleData;
    const vehicleType = detectVehicleType(marca, modelo);
    
    const items = checklistData[vehicleType] || checklistData.carro;
    setChecklistItems(items);
    
    // Inicializa estados
    const initialState = {};
    items.forEach(item => {
      initialState[item.id] = { status: null, observacao: '' };
    });
    setCheckedItems(initialState);
  };

  const updateItemStatus = (itemId, status) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        status
      }
    }));
  };

  const updateItemObservation = (itemId, observacao) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        observacao
      }
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok':
        return { icon: CheckCircle, color: 'text-green-500' };
      case 'atencao':
        return { icon: AlertTriangle, color: 'text-yellow-500' };
      case 'critico':
        return { icon: XCircle, color: 'text-red-500' };
      default:
        return { icon: Circle, color: isDarkMode ? 'text-gray-600' : 'text-gray-400' };
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ok: isDarkMode ? 'bg-green-600/20 border-green-600/50' : 'bg-green-50 border-green-200',
      atencao: isDarkMode ? 'bg-yellow-600/20 border-yellow-600/50' : 'bg-yellow-50 border-yellow-200',
      critico: isDarkMode ? 'bg-red-600/20 border-red-600/50' : 'bg-red-50 border-red-200',
      null: isDarkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'
    };
    return colors[status] || colors.null;
  };

  // Agrupa por categoria
  const groupedItems = checklistItems.reduce((acc, item) => {
    const category = item.categoria || 'Geral';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const getCompletionStats = () => {
    const total = checklistItems.length;
    const completed = Object.values(checkedItems).filter(item => item.status !== null).length;
    const ok = Object.values(checkedItems).filter(item => item.status === 'ok').length;
    const attention = Object.values(checkedItems).filter(item => item.status === 'atencao').length;
    const critical = Object.values(checkedItems).filter(item => item.status === 'critico').length;
    
    return { total, completed, ok, attention, critical };
  };

  const stats = getCompletionStats();

  if (!vehicleData || checklistItems.length === 0) return null;

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
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Checklist de Inspeção
        </h3>
        
        {/* Progresso */}
        <div className="text-right">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {stats.completed}/{stats.total} itens
          </p>
          <div className={`w-24 h-2 rounded-full mt-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {stats.completed > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-green-600/20' : 'bg-green-100'}`}>
            <p className="text-2xl font-bold text-green-500">{stats.ok}</p>
            <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>OK</p>
          </div>
          <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-yellow-600/20' : 'bg-yellow-100'}`}>
            <p className="text-2xl font-bold text-yellow-500">{stats.attention}</p>
            <p className={`text-xs ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Atenção</p>
          </div>
          <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-red-600/20' : 'bg-red-100'}`}>
            <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
            <p className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>Crítico</p>
          </div>
        </div>
      )}

      {/* Checklist por categoria */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {category}
            </h4>
            
            <div className="space-y-3">
              {items.map((item, itemIndex) => {
                const itemData = checkedItems[item.id] || { status: null, observacao: '' };
                const statusInfo = getStatusIcon(itemData.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${getStatusColor(itemData.status)}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <StatusIcon className={`w-5 h-5 mt-0.5 ${statusInfo.color}`} />
                      
                      <div className="flex-1">
                        <h5 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.label}
                        </h5>
                        
                        {item.descricao && (
                          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.descricao}
                          </p>
                        )}
                        
                        {/* Botões de status */}
                        <div className="flex gap-2 mb-3">
                          {['ok', 'atencao', 'critico'].map(status => {
                            const isSelected = itemData.status === status;
                            const statusLabels = { ok: 'OK', atencao: 'Atenção', critico: 'Crítico' };
                            const statusColors = {
                              ok: 'bg-green-500 hover:bg-green-600',
                              atencao: 'bg-yellow-500 hover:bg-yellow-600',
                              critico: 'bg-red-500 hover:bg-red-600'
                            };
                            
                            return (
                              <button
                                key={status}
                                onClick={() => updateItemStatus(item.id, status)}
                                className={`
                                  px-3 py-1 rounded-lg text-xs font-medium transition-all
                                  ${isSelected
                                    ? `${statusColors[status]} text-white`
                                    : isDarkMode
                                      ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }
                                `}
                              >
                                {statusLabels[status]}
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Campo de observação */}
                        {itemData.status && itemData.status !== 'ok' && (
                          <textarea
                            value={itemData.observacao}
                            onChange={(e) => updateItemObservation(item.id, e.target.value)}
                            placeholder="Observações (opcional)"
                            className={`
                              w-full p-2 text-sm rounded-lg border resize-none
                              ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                              }
                              focus:outline-none focus:ring-2 focus:ring-blue-500
                            `}
                            rows={2}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Checklist;
