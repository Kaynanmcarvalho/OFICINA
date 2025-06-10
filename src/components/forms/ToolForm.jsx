import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ToolForm = ({ onClose, onSubmit, tool = null }) => {
  const [formData, setFormData] = useState({
    name: tool?.name || '',
    category: tool?.category || '',
    brand: tool?.brand || '',
    model: tool?.model || '',
    serialNumber: tool?.serialNumber || '',
    description: tool?.description || '',
    location: tool?.location || '',
    status: tool?.status || 'disponivel',
    responsible: tool?.responsible || '',
    acquisitionDate: tool?.acquisitionDate || '',
    acquisitionValue: tool?.acquisitionValue || '',
    observations: tool?.observations || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      // Simular processo de cadastro/atualização
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const toolData = {
        ...formData,
        id: tool?.id || `TOOL-${Date.now()}`,
        acquisitionValue: parseFloat(formData.acquisitionValue) || 0,
        createdAt: tool?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (onSubmit) {
        onSubmit(toolData);
      }
      
      toast.success(tool ? 'Ferramenta atualizada com sucesso!' : 'Ferramenta cadastrada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar ferramenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome da Ferramenta *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Chave de Fenda Phillips"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoria *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Selecione a categoria...</option>
            <option value="chaves">Chaves</option>
            <option value="alicates">Alicates</option>
            <option value="martelos">Martelos</option>
            <option value="furadeiras">Furadeiras</option>
            <option value="parafusadeiras">Parafusadeiras</option>
            <option value="morsa">Morsa</option>
            <option value="bancada">Bancada</option>
            <option value="medicao">Medição</option>
            <option value="corte">Corte</option>
            <option value="soldagem">Soldagem</option>
            <option value="pneumaticas">Pneumáticas</option>
            <option value="eletricas">Elétricas</option>
            <option value="especiais">Especiais</option>
            <option value="outros">Outros</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Marca
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Bosch, Makita, Stanley"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modelo
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Modelo da ferramenta"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número de Série
          </label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Número de série"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Localização
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Bancada 1, Gaveta A3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descrição
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descrição detalhada da ferramenta..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="disponivel">Disponível</option>
            <option value="em_uso">Em Uso</option>
            <option value="manutencao">Manutenção</option>
            <option value="quebrada">Quebrada</option>
            <option value="emprestada">Emprestada</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Responsável
          </label>
          <input
            type="text"
            name="responsible"
            value={formData.responsible}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome do responsável atual"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data de Aquisição
          </label>
          <input
            type="date"
            name="acquisitionDate"
            value={formData.acquisitionDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valor de Aquisição (R$)
          </label>
          <input
            type="number"
            name="acquisitionValue"
            value={formData.acquisitionValue}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Observações
        </label>
        <textarea
          name="observations"
          value={formData.observations}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Observações adicionais sobre a ferramenta..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
        >
          {isLoading ? 'Salvando...' : (tool ? 'Atualizar Ferramenta' : 'Cadastrar Ferramenta')}
        </button>
      </div>
    </form>
  );
};

export default ToolForm;