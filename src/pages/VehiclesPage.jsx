import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Eye } from 'lucide-react';
import Modal from '../components/ui/Modal';
import VehicleForm from '../components/forms/VehicleForm';
import { useVehicleStore } from '../store';

const VehiclesPage = () => {
  const { vehicles, fetchVehicles, searchVehicles, createVehicle, updateVehicle, deleteVehicle, isLoading: storeLoading, error } = useVehicleStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredVehicles = statusFilter ? vehicles.filter(v => v.status === statusFilter) : vehicles;

  const totalVehicles = vehicles.length;
  const inAssembly = vehicles.filter(v => v.status === 'montagem').length;
  const completed = vehicles.filter(v => v.status === 'concluida').length;
  const sold = vehicles.filter(v => v.status === 'vendida').length;

  const handleNewVehicle = () => {
    setIsVehicleModalOpen(true);
  };

  const handleVehicleSubmit = async (vehicleData) => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.firestoreId, vehicleData);
        toast.success('Veículo atualizado com sucesso!');
      } else {
        await createVehicle(vehicleData);
        toast.success('Veículo criado com sucesso!');
      }
      setIsVehicleModalOpen(false);
      setEditingVehicle(null);
    } catch (err) {
      toast.error(editingVehicle ? 'Erro ao atualizar veículo' : 'Erro ao criar veículo');
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await deleteVehicle(vehicleId);
        toast.success('Veículo excluído com sucesso!');
      } catch (err) {
        toast.error('Erro ao excluir veículo');
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() && !statusFilter) {
      toast.error('Digite um termo para buscar ou selecione um status');
      return;
    }
    
    setIsLoading(true);
    try {
      const searchInfo = [];
      if (searchTerm) searchInfo.push(`termo: ${searchTerm}`);
      if (statusFilter) searchInfo.push(`status: ${statusFilter}`);
      await searchVehicles(searchTerm);
      // TODO: Implementar filtro por status se necessário
      toast.success(`Buscando por: ${searchInfo.join(', ')}`);
    } catch (error) {
      toast.error('Erro ao buscar veículos');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Veículos Montados
        </h1>
        <button 
          onClick={handleNewVehicle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Novo Veículo
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total de Veículos
          </h3>
          <p className="text-3xl font-bold text-blue-600">{totalVehicles}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Em Montagem
          </h3>
          <p className="text-3xl font-bold text-yellow-600">{inAssembly}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Concluídas
          </h3>
          <p className="text-3xl font-bold text-green-600">{completed}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Vendidas
          </h3>
          <p className="text-3xl font-bold text-purple-600">{sold}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lista de Veículos
          </h2>
          <div className="flex space-x-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todos os status</option>
              <option value="montagem">Em Montagem</option>
              <option value="concluida">Concluída</option>
              <option value="vendida">Vendida</option>
            </select>
            <input
              type="text"
              placeholder="Buscar veículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum veículo encontrado.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.firestoreId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {vehicle.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {vehicle.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {vehicle.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {vehicle.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {vehicle.progress || '0%'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.firestoreId)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal
        isOpen={isVehicleModalOpen}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setEditingVehicle(null);
        }}
        title={editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
        size="lg"
      >
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleVehicleSubmit}
          onClose={() => {
            setIsVehicleModalOpen(false);
            setEditingVehicle(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default VehiclesPage;