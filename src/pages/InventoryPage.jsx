import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import InventoryForm from '../components/forms/InventoryForm';

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const handleNewItem = () => {
    setIsInventoryModalOpen(true);
  };

  const handleInventorySubmit = (inventoryData) => {
    console.log('Inventory data:', inventoryData);
    // Aqui você salvaria os dados no banco/store
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() && !categoryFilter) {
      toast.error('Digite um termo para buscar ou selecione uma categoria');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simular busca
      await new Promise(resolve => setTimeout(resolve, 1000));
      const searchInfo = [];
      if (searchTerm) searchInfo.push(`termo: ${searchTerm}`);
      if (categoryFilter) searchInfo.push(`categoria: ${categoryFilter}`);
      toast.success(`Buscando por: ${searchInfo.join(', ')}`);
    } catch (error) {
      toast.error('Erro ao buscar itens');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestão de Estoque
        </h1>
        <button 
          onClick={handleNewItem}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Novo Item
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total de Itens
          </h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Estoque Baixo
          </h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Valor Total
          </h3>
          <p className="text-3xl font-bold text-green-600">R$ 0,00</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Itens do Estoque
          </h2>
          <div className="flex space-x-2">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todas as categorias</option>
              <option value="pecas">Peças</option>
              <option value="ferramentas">Ferramentas</option>
              <option value="consumiveis">Consumíveis</option>
            </select>
            <input
              type="text"
              placeholder="Buscar itens..."
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
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Nenhum item no estoque.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        title="Novo Item de Estoque"
        size="lg"
      >
        <InventoryForm
          onSubmit={handleInventorySubmit}
          onClose={() => setIsInventoryModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default InventoryPage;