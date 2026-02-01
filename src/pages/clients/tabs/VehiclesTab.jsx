/**
 * VehiclesTab - Aba de veículos do cliente
 */

import { useState, useEffect, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import { Car, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { useClientStore } from '../../../store/clientStore';
import toast from 'react-hot-toast';

const VehiclesTab = ({ client }) => {
  const { isDarkMode } = useThemeStore();
  const { updateClient } = useClientStore();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    plate: '',
    color: ''
  });

  const loadVehicles = useCallback(() => {
    if (!client) return;
    
    try {
      setIsLoading(true);
      // Pega os veículos do array do cliente
      const clientVehicles = client.vehicles || [];
      setVehicles(clientVehicles);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      toast.error('Erro ao carregar veículos');
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const handleSave = async () => {
    if (!formData.brand || !formData.model) {
      toast.error('Preencha marca e modelo');
      return;
    }

    try {
      let updatedVehicles;
      
      if (editingVehicle) {
        // Atualiza veículo existente
        updatedVehicles = vehicles.map(v => 
          v.id === editingVehicle.id 
            ? { ...v, ...formData, updatedAt: new Date().toISOString() }
            : v
        );

        toast.success('Veículo atualizado!');
      } else {
        // Adiciona novo veículo
        const newVehicle = {
          id: Date.now().toString(),
          ...formData,
          addedAt: new Date().toISOString()
        };
        updatedVehicles = [...vehicles, newVehicle];
        toast.success('Veículo adicionado!');
      }
      
      // Atualiza no Firebase
      await updateClient(client.firestoreId, { vehicles: updatedVehicles });
      
      setVehicles(updatedVehicles);
      setFormData({ brand: '', model: '', year: '', plate: '', color: '' });
      setIsAdding(false);
      setEditingVehicle(null);
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      toast.error('Erro ao salvar veículo');
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!confirm('Deseja excluir este veículo?')) return;
    
    try {
      const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
      
      // Atualiza no Firebase
      await updateClient(client.firestoreId, { vehicles: updatedVehicles });
      
      setVehicles(updatedVehicles);
      toast.success('Veículo excluído!');
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      toast.error('Erro ao excluir veículo');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className={`w-8 h-8 animate-spin ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`} />
      </div>
  );
}

return (
    <Motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Veículos ({vehicles.length})
        </h3>
        
        <Motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            ${isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </Motion.button>
      </div>

      {/* Form */}
      {(isAdding || editingVehicle) && (
        <div className={`
          p-4 rounded-xl border
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}
        `}>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Marca *"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              className={`
                px-3 py-2 rounded-lg border text-sm
                ${isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }
              `}
            />
            <input
              type="text"
              placeholder="Modelo *"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              className={`
                px-3 py-2 rounded-lg border text-sm
                ${isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }
              `}
            />
            <input
              type="text"
              placeholder="Ano"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              className={`
                px-3 py-2 rounded-lg border text-sm
                ${isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }
              `}
            />
            <input
              type="text"
              placeholder="Placa"
              value={formData.plate}
              onChange={(e) => setFormData({...formData, plate: e.target.value.toUpperCase()})}
              className={`
                px-3 py-2 rounded-lg border text-sm
                ${isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }
              `}
            />
            <input
              type="text"
              placeholder="Cor"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className={`
                px-3 py-2 rounded-lg border text-sm col-span-2
                ${isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }
              `}
            />
          </div>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSave}
              className={`
                flex-1 py-2 rounded-lg font-medium text-sm
                ${isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              {editingVehicle ? 'Atualizar' : 'Salvar'}
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingVehicle(null);
                setFormData({ brand: '', model: '', year: '', plate: '', color: '' });
              }}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                ${isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }
              `}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <Car className={`w-16 h-16 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Nenhum veículo cadastrado
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`
                p-4 rounded-xl border
                ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`
                    p-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                  `}>
                    <Car className={`w-5 h-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div>
                    <h4 className={`font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {vehicle.brand} {vehicle.model}
                    </h4>
                    <div className={`text-sm mt-1 space-y-0.5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {vehicle.year && <div>Ano: {vehicle.year}</div>}
                      {vehicle.plate && <div>Placa: {vehicle.plate}</div>}
                      {vehicle.color && <div>Cor: {vehicle.color}</div>}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingVehicle(vehicle);
                      setFormData(vehicle);
                      setIsAdding(false);
                    }}
                    className={`
                      p-2 rounded-lg
                      ${isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className={`
                      p-2 rounded-lg
                      ${isDarkMode 
                        ? 'hover:bg-red-900/20 text-red-400' 
                        : 'hover:bg-red-50 text-red-600'
                      }
                    `}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Motion.div>
  );
};

export default VehiclesTab;

