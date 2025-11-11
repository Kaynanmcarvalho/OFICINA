import React, { useState, useEffect } from 'react';
import { X, Search, Car } from 'lucide-react';
import { useClientStore } from '../../store';
import { consultarPlaca, isValidPlate } from '../../services/vehicleApiService';
import toast from 'react-hot-toast';

const MotorcycleForm = ({ onClose, onSubmit, motorcycle = null }) => {
  const { clients, searchClients } = useClientStore();
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isConsultingPlate, setIsConsultingPlate] = useState(false);

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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchClients(searchTerm);
      if (result.success) {
        // Buscar por nome do cliente
        let clientResults = result.data;
        
        // Buscar também por placa nos veículos dos clientes
        const allClients = clients || [];
        const vehicleResults = allClients.filter(client => 
          client.vehicles && client.vehicles.some(vehicle => 
            vehicle.plate && vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        
        // Combinar resultados e remover duplicatas
        const combinedResults = [...clientResults];
        vehicleResults.forEach(client => {
          if (!combinedResults.find(c => c.firestoreId === client.firestoreId)) {
            combinedResults.push(client);
          }
        });
        
        setSearchResults(combinedResults);
        setShowSearchResults(true);
      }
    } catch (error) {
      toast.error('Erro ao buscar clientes/veículos');
    } finally {
      setIsSearching(false);
    }
  };

  const selectClient = (client) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.firestoreId,
      clientName: client.name
    }));
    setSearchTerm(client.name);
    setShowSearchResults(false);
  };

  const selectVehicle = (client, vehicle) => {
    setFormData({
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      plate: vehicle.plate || '',
      color: vehicle.color || '',
      engineSize: vehicle.engineSize || '',
      chassisNumber: vehicle.chassisNumber || '',
      renavam: vehicle.renavam || '',
      clientId: client.firestoreId,
      clientName: client.name,
      status: vehicle.status || 'ativa',
      observations: vehicle.observations || ''
    });
    setSearchTerm(`${client.name} - ${vehicle.plate}`);
    setShowSearchResults(false);
  };

  const handlePlateChange = (e) => {
    const formatted = formatPlate(e.target.value);
    setFormData(prev => ({ ...prev, plate: formatted }));
  };

  const handleConsultarPlaca = async () => {
    console.log('[VehicleForm] handleConsultarPlaca called');
    console.log('[VehicleForm] Placa:', formData.plate);
    
    if (!formData.plate) {
      console.log('[VehicleForm] Placa vazia');
      toast.error('Digite uma placa para consultar');
      return;
    }

    if (!isValidPlate(formData.plate)) {
      console.log('[VehicleForm] Placa inválida:', formData.plate);
      toast.error('Placa inválida. Use o formato ABC-1234 ou ABC1D23');
      return;
    }

    console.log('[VehicleForm] Iniciando consulta...');
    setIsConsultingPlate(true);
    const loadingToast = toast.loading('Consultando placa...');

    try {
      console.log('[VehicleForm] Chamando consultarPlaca...');
      const result = await consultarPlaca(formData.plate);
      console.log('[VehicleForm] Resultado:', result);

      if (result.success) {
        // Preencher formulário com dados da API
        setFormData(prev => ({
          ...prev,
          brand: result.data.brand || prev.brand,
          model: result.data.model || prev.model,
          year: result.data.year || prev.year,
          color: result.data.color || prev.color,
          chassisNumber: result.data.chassisNumber || prev.chassisNumber,
          renavam: result.data.renavam || prev.renavam,
          engineSize: result.data.engineSize || prev.engineSize,
        }));

        toast.success('Dados do veículo carregados com sucesso!', {
          id: loadingToast,
        });

        // Mostrar informações adicionais se disponíveis
        if (result.data.owner) {
          toast.success(`Proprietário: ${result.data.owner}`, {
            duration: 5000,
          });
        }
      } else {
        toast.error(result.error || 'Erro ao consultar placa', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Erro ao consultar placa:', error);
      toast.error('Erro ao consultar placa. Tente novamente.', {
        id: loadingToast,
      });
    } finally {
      setIsConsultingPlate(false);
    }
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

      {/* Placa com botão de busca */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Placa *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="plate"
              value={formData.plate}
              onChange={handlePlateChange}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ABC-1234 ou ABC1D23"
              maxLength={8}
              required
            />
            <button
              type="button"
              onClick={() => {
                console.log('[VehicleForm] Botão clicado!');
                handleConsultarPlaca();
              }}
              disabled={isConsultingPlate || !formData.plate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:cursor-not-allowed whitespace-nowrap"
              title="Consultar dados do veículo pela placa"
            >
              <Car className="w-4 h-4" />
              {isConsultingPlate ? 'Consultando...' : 'Buscar Veículo'}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            💡 Digite a placa e clique em "Buscar Veículo" para preencher automaticamente os dados
          </p>
        </div>
      </div>

      {/* Ano e Cor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar Cliente ou Veículo
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Digite o nome do cliente ou placa do veículo..."
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          
          {showSearchResults && (
            <div className="mt-2 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              {searchResults.length === 0 ? (
                <div className="p-3 text-gray-500 dark:text-gray-400 text-center">
                  Nenhum resultado encontrado
                </div>
              ) : (
                searchResults.map((client) => (
                  <div key={client.firestoreId} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                    <div 
                      onClick={() => selectClient(client)}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {client.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {client.phone} • {client.vehicles?.length || 0} veículo(s)
                      </div>
                    </div>
                    {client.vehicles && client.vehicles.length > 0 && (
                      <div className="pl-6 pb-2">
                        {client.vehicles.map((vehicle, index) => (
                          <div 
                            key={index}
                            onClick={() => selectVehicle(client, vehicle)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded text-sm"
                          >
                            <div className="text-gray-700 dark:text-gray-300">
                              {vehicle.brand} {vehicle.model} - {vehicle.plate}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {vehicle.year} • {vehicle.color}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
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
              readOnly
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