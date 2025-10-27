import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Wrench, Pencil, Trash2, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ToolForm from '../components/forms/ToolForm';
import { useToolStore } from '../store/toolStore';

const ToolsPage = () => {
  const { 
    tools, 
    fetchTools, 
    createTool, 
    updateTool, 
    deleteTool, 
    searchTools,
    getToolStatistics,
    isLoading 
  } = useToolStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [filteredTools, setFilteredTools] = useState([]);

  useEffect(() => {
    loadTools();
  }, []);

  useEffect(() => {
    filterTools();
  }, [tools, statusFilter]);

  const loadTools = async () => {
    await fetchTools();
  };

  const filterTools = () => {
    let filtered = [...tools];
    
    if (statusFilter) {
      filtered = filtered.filter(tool => tool.status === statusFilter);
    }
    
    setFilteredTools(filtered);
  };

  const handleNewTool = () => {
    setEditingTool(null);
    setIsToolModalOpen(true);
  };

  const handleEditTool = (tool) => {
    setEditingTool(tool);
    setIsToolModalOpen(true);
  };

  const handleToolSubmit = async (toolData) => {
    try {
      if (editingTool) {
        const result = await updateTool(editingTool.firestoreId, toolData);
        if (result.success) {
          toast.success('Ferramenta atualizada com sucesso!');
          setIsToolModalOpen(false);
          setEditingTool(null);
        } else {
          toast.error(result.error || 'Erro ao atualizar ferramenta');
        }
      } else {
        const result = await createTool(toolData);
        if (result.success) {
          toast.success('Ferramenta cadastrada com sucesso!');
          setIsToolModalOpen(false);
        } else {
          toast.error(result.error || 'Erro ao cadastrar ferramenta');
        }
      }
    } catch (error) {
      toast.error('Erro ao salvar ferramenta');
    }
  };

  const handleDeleteTool = async (tool) => {
    if (window.confirm(`Tem certeza que deseja excluir "${tool.name}"?`)) {
      const result = await deleteTool(tool.firestoreId);
      if (result.success) {
        toast.success('Ferramenta excluída com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao excluir ferramenta');
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      filterTools();
      return;
    }
    
    const result = await searchTools(searchTerm);
    if (result.success) {
      setFilteredTools(result.data);
      if (result.data.length === 0) {
        toast.info('Nenhuma ferramenta encontrada');
      }
    } else {
      toast.error('Erro ao buscar ferramentas');
    }
  };

  const stats = getToolStatistics();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'disponivel':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Disponível</span>;
      case 'em_uso':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Em Uso</span>;
      case 'manutencao':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Manutenção</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{status}</span>;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestão de Ferramentas
        </h1>
        <button 
          onClick={handleNewTool}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Nova Ferramenta
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total de Ferramentas</h3>
            <Settings className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Disponíveis</h3>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.available}</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Em Uso</h3>
            <Wrench className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.inUse}</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Manutenção</h3>
            <AlertCircle className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{stats.maintenance}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lista de Ferramentas
          </h2>
          <div className="flex space-x-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todos os status</option>
              <option value="disponivel">Disponível</option>
              <option value="em_uso">Em Uso</option>
              <option value="manutencao">Manutenção</option>
            </select>
            <input
              type="text"
              placeholder="Buscar ferramentas..."
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Responsável
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
              ) : filteredTools.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma ferramenta cadastrada.
                  </td>
                </tr>
              ) : (
                filteredTools.map((tool) => (
                  <tr key={tool.firestoreId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {tool.name}
                      </div>
                      {tool.serialNumber && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          S/N: {tool.serialNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {tool.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tool.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {tool.location || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {tool.assignedTo || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditTool(tool)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTool(tool)}
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
        isOpen={isToolModalOpen}
        onClose={() => {
          setIsToolModalOpen(false);
          setEditingTool(null);
        }}
        title={editingTool ? 'Editar Ferramenta' : 'Nova Ferramenta'}
        size="lg"
      >
        <ToolForm
          tool={editingTool}
          onSubmit={handleToolSubmit}
          onClose={() => {
            setIsToolModalOpen(false);
            setEditingTool(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ToolsPage;