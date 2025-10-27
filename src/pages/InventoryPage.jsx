import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import Modal from '../components/ui/Modal';
import InventoryForm from '../components/forms/InventoryForm';
import { useInventoryStore } from '../store/inventoryStore';

const InventoryPage = () => {
  const { 
    parts, 
    fetchParts, 
    createPart, 
    updatePart, 
    deletePart, 
    searchParts,
    getInventoryStatistics,
    isLoading 
  } = useInventoryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filteredParts, setFilteredParts] = useState([]);

  useEffect(() => {
    loadParts();
  }, []);

  useEffect(() => {
    filterParts();
  }, [parts, categoryFilter]);

  const loadParts = async () => {
    await fetchParts();
  };

  const filterParts = () => {
    let filtered = [...parts];
    
    if (categoryFilter) {
      filtered = filtered.filter(part => part.category === categoryFilter);
    }
    
    setFilteredParts(filtered);
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setIsInventoryModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsInventoryModalOpen(true);
  };

  const handleInventorySubmit = async (inventoryData) => {
    try {
      const partData = {
        name: inventoryData.name,
        category: inventoryData.category,
        brand: inventoryData.brand || '',
        partNumber: inventoryData.partNumber || '',
        description: inventoryData.description || '',
        currentStock: parseInt(inventoryData.quantity) || 0,
        minStock: parseInt(inventoryData.minQuantity) || 0,
        unitPrice: parseFloat(inventoryData.unitPrice) || 0,
        supplier: inventoryData.supplier || '',
        location: inventoryData.location || '',
        status: inventoryData.status || 'disponivel',
        observations: inventoryData.observations || ''
      };

      if (editingItem) {
        const result = await updatePart(editingItem.firestoreId, partData);
        if (result.success) {
          toast.success('Item atualizado com sucesso!');
          setIsInventoryModalOpen(false);
          setEditingItem(null);
        } else {
          toast.error(result.error || 'Erro ao atualizar item');
        }
      } else {
        const result = await createPart(partData);
        if (result.success) {
          toast.success('Item cadastrado com sucesso!');
          setIsInventoryModalOpen(false);
        } else {
          toast.error(result.error || 'Erro ao cadastrar item');
        }
      }
    } catch (error) {
      toast.error('Erro ao salvar item');
    }
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {
      const result = await deletePart(item.firestoreId);
      if (result.success) {
        toast.success('Item excluído com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao excluir item');
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      filterParts();
      return;
    }
    
    const result = await searchParts(searchTerm);
    if (result.success) {
      setFilteredParts(result.data);
      if (result.data.length === 0) {
        toast.info('Nenhum item encontrado');
      }
    } else {
      toast.error('Erro ao buscar itens');
    }
  };

  const stats = getInventoryStatistics();

  const getStatusBadge = (part) => {
    if (part.currentStock <= 0) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Esgotado</span>;
    }
    if (part.currentStock <= part.minStock) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Baixo Estoque</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Disponível</span>;
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
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total de Itens</h3>
            <Package className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.totalParts}</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Estoque Baixo</h3>
            <AlertTriangle className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.lowStockCount}</p>
          <p className="text-xs opacity-80 mt-1">{stats.lowStockPercentage.toFixed(1)}% do total</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Valor Total</h3>
            <TrendingDown className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">
            R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
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
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Carregando...
                  </td>
                </tr>
              ) : filteredParts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum item no estoque.
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => (
                  <tr key={part.firestoreId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {part.name}
                      </div>
                      {part.brand && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {part.brand}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {part.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {part.currentStock}
                      </div>
                      {part.minStock && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Mín: {part.minStock}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        R$ {part.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(part)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditItem(part)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(part)}
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
        isOpen={isInventoryModalOpen}
        onClose={() => {
          setIsInventoryModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Editar Item de Estoque' : 'Novo Item de Estoque'}
        size="lg"
      >
        <InventoryForm
          item={editingItem ? {
            name: editingItem.name,
            category: editingItem.category,
            brand: editingItem.brand,
            partNumber: editingItem.partNumber,
            description: editingItem.description,
            quantity: editingItem.currentStock,
            minQuantity: editingItem.minStock,
            unitPrice: editingItem.unitPrice,
            supplier: editingItem.supplier,
            location: editingItem.location,
            status: editingItem.status,
            observations: editingItem.observations
          } : null}
          onSubmit={handleInventorySubmit}
          onClose={() => {
            setIsInventoryModalOpen(false);
            setEditingItem(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default InventoryPage;