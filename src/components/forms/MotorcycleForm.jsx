import React, { useState } from 'react';
import toast from 'react-hot-toast';

const MotorcycleForm = ({ onClose, onSubmit, motorcycle = null }) => {
  const [formData, setFormData] = useState({
    brand: motorcycle?.brand || '',
    model: motorcycle?.model || '',
    year: motorcycle?.year || '',
    plate: motorcycle?.plate || '',
    color: motorcycle?.color || '',
    engineSize: motorcycle?.engineSize || '',
    chassisNumber: motorcycle?.chassisNumber || '',
    renavam: motorcycle?.renavam || '',
    clientId: motorcycle?.clientId || '',
    clientName: motorcycle?.clientName || '',
    status: motorcycle?.status || 'ativa',
    observations: motorcycle?.observations || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPlate = (value) => {
    return value
      .replace(/[^A-Za-z0-9]/g, '')
      .replace(/^([A-Za-z]{3})(\d{4})$/, '$1-$2')
      .replace(/^([A-Za-z]{3})(\d{1}[A-Za-z]{1})(\d{2})$/, '$1$2$3')
      .toUpperCase();
  };

  const handlePlateChange = (e) => {
    const formatted = formatPlate(e.target.value);
    setFormData(prev => ({ ...prev, plate: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.brand || !formData.model || !formData.plate) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      // Simular processo de cadastro/atualização
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const motorcycleData = {
        ...formData,
        id: motorcycle?.id || `MOTO-${Date.now()}`,
        createdAt: motorcycle?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (onSubmit) {
        onSubmit(motorcycleData);
      }
      
      toast.success(motorcycle ? 'Moto atualizada com sucesso!' : 'Moto cadastrada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar moto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Marca *
          </label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Selecione a marca...</option>
            <option value="Honda">Honda</option>
            <option value="Yamaha">Yamaha</option>
            <option value="Suzuki">Suzuki</option>
            <option value="Kawasaki">Kawasaki</option>
            <option value="BMW">BMW</option>
            <option value="Ducati">Ducati</option>
            <option value="Harley-Davidson">Harley-Davidson</option>
            <option value="Triumph">Triumph</option>
            <option value="KTM">KTM</option>
            <option value="Aprilia">Aprilia</option>
            <option value="Outras">Outras</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modelo *
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: CB 600F Hornet"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ano
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2023"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Placa *
          </label>
          <input
            type="text"
            name="plate"
            value={formData.plate}
            onChange={handlePlateChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ABC-1234 ou ABC1D23"
            maxLength={8}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cor
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Vermelha"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cilindrada (cc)
          </label>
          <input
            type="number"
            name="engineSize"
            value={formData.engineSize}
            onChange={handleInputChange}
            min="50"
            max="2000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="600"
          />
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
            <option value="ativa">Ativa</option>
            <option value="em_manutencao">Em Manutenção</option>
            <option value="vendida">Vendida</option>
            <option value="inativa">Inativa</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número do Chassi
          </label>
          <input
            type="text"
            name="chassisNumber"
            value={formData.chassisNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="17 dígitos"
            maxLength={17}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            RENAVAM
          </label>
          <input
            type="text"
            name="renavam"
            value={formData.renavam}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="11 dígitos"
            maxLength={11}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID do Cliente
          </label>
          <input
            type="text"
            name="clientId"
            value={formData.clientId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="CLI-123456789"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome do Proprietário
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome do proprietário"
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
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Observações adicionais sobre a motocicleta..."
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
          {isLoading ? 'Salvando...' : (motorcycle ? 'Atualizar Moto' : 'Cadastrar Moto')}
        </button>
      </div>
    </form>
  );
};

export default MotorcycleForm;