import React, { useState } from 'react';
import toast from 'react-hot-toast';

const InventoryForm = ({ onClose, onSubmit, item = null }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    brand: item?.brand || '',
    partNumber: item?.partNumber || '',
    description: item?.description || '',
    quantity: item?.quantity || '',
    minQuantity: item?.minQuantity || '',
    unitPrice: item?.unitPrice || '',
    supplier: item?.supplier || '',
    location: item?.location || '',
    status: item?.status || 'disponivel',
    observations: item?.observations || ''
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
      
      const itemData = {
        ...formData,
        id: item?.id || `INV-${Date.now()}`,
        quantity: parseInt(formData.quantity) || 0,
        minQuantity: parseInt(formData.minQuantity) || 0,
        unitPrice: parseFloat(formData.unitPrice) || 0,
        createdAt: item?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (onSubmit) {
        onSubmit(itemData);
      }
      
      toast.success(item ? 'Item atualizado com sucesso!' : 'Item cadastrado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome do Item *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Óleo de Motor 10W40"
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
            <option value="oleos_lubrificantes">Óleos e Lubrificantes</option>
            <option value="pecas_motor">Peças do Motor</option>
            <option value="pecas_freio">Peças de Freio</option>
            <option value="pecas_suspensao">Peças de Suspensão</option>
            <option value="pecas_transmissao">Peças de Transmissão</option>
            <option value="pecas_eletrica">Peças Elétricas</option>
            <option value="pneus_camaras">Pneus e Câmaras</option>
            <option value="acessorios">Acessórios</option>
            <option value="ferramentas">Ferramentas</option>
            <option value="consumiveis">Consumíveis</option>
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
            placeholder="Ex: Motul, Castrol, NGK"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número da Peça
          </label>
          <input
            type="text"
            name="partNumber"
            value={formData.partNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Código do fabricante"
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
          placeholder="Descrição detalhada do item..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantidade
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantidade Mínima
          </label>
          <input
            type="number"
            name="minQuantity"
            value={formData.minQuantity}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preço Unitário (R$)
          </label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fornecedor
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome do fornecedor"
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
            placeholder="Ex: Prateleira A1, Gaveta 3"
          />
        </div>
      </div>

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
          <option value="baixo_estoque">Baixo Estoque</option>
          <option value="esgotado">Esgotado</option>
          <option value="descontinuado">Descontinuado</option>
        </select>
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
          placeholder="Observações adicionais sobre o item..."
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
          {isLoading ? 'Salvando...' : (item ? 'Atualizar Item' : 'Cadastrar Item')}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;