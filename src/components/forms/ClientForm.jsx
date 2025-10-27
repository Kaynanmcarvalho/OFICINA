import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ClientForm = ({ onClose, onSubmit, client = null }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    cpf: client?.cpf || '',
    address: client?.address || '',
    city: client?.city || '',
    state: client?.state || '',
    zipCode: client?.zipCode || '',
    birthDate: client?.birthDate || '',
    observations: client?.observations || '',
    vehicles: client?.vehicles || []
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatZipCode = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleZipCodeChange = async (e) => {
    const formatted = formatZipCode(e.target.value);
    setFormData(prev => ({ ...prev, zipCode: formatted }));
    
    // Buscar CEP quando tiver 8 dígitos
    const value = e.target.value.replace(/\D/g, '');
    if (value.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: data.logradouro || prev.address,
            city: data.localidade || prev.city,
            state: data.uf || prev.state
          }));
          toast.success('CEP encontrado!');
        } else {
          toast.error('CEP não encontrado');
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, {
        id: Date.now(),
        brand: '',
        model: '',
        plate: '',
        year: '',
        color: ''
      }]
    }));
  };

  const removeVehicle = (vehicleId) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(v => v.id !== vehicleId)
    }));
  };

  const updateVehicle = (vehicleId, field, value) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(v => 
        v.id === vehicleId ? { ...v, [field]: value } : v
      )
    }));
  };

  const formatPlate = (value) => {
    return value
      .replace(/[^A-Za-z0-9]/g, '')
      .replace(/^([A-Za-z]{3})(\d{4})$/, '$1-$2')
      .replace(/^([A-Za-z]{3})(\d{1}[A-Za-z]{1})(\d{2})$/, '$1$2$3')
      .toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      // Simular processo de cadastro/atualização
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const clientData = {
        ...formData,
        id: client?.id || `CLI-${Date.now()}`,
        createdAt: client?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (onSubmit) {
        onSubmit(clientData);
      }
      
      toast.success(client ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o nome completo"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefone *
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(11) 99999-9999"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="cliente@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CPF
          </label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleCPFChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="000.000.000-00"
            maxLength={14}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Endereço
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Rua, número, complemento"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cidade
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Cidade"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione...</option>
            <option value="SP">São Paulo</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="MG">Minas Gerais</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="PR">Paraná</option>
            <option value="SC">Santa Catarina</option>
            <option value="BA">Bahia</option>
            <option value="GO">Goiás</option>
            <option value="ES">Espírito Santo</option>
            <option value="DF">Distrito Federal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CEP
          </label>
          <div className="relative">
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleZipCodeChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="00000-000"
              maxLength={9}
            />
            {isLoadingCep && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Data de Nascimento
        </label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Seção de Veículos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Veículos
          </label>
          <button
            type="button"
            onClick={addVehicle}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Veículo</span>
          </button>
        </div>
        
        {formData.vehicles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">
            Nenhum veículo cadastrado
          </p>
        ) : (
          <div className="space-y-4">
            {formData.vehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Veículo {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeVehicle(vehicle.id)}
                    className="p-1 text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Marca
                    </label>
                    <select
                      value={vehicle.brand}
                      onChange={(e) => updateVehicle(vehicle.id, 'brand', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Selecione...</option>
                      <option value="Honda">Honda</option>
                      <option value="Yamaha">Yamaha</option>
                      <option value="Suzuki">Suzuki</option>
                      <option value="Kawasaki">Kawasaki</option>
                      <option value="BMW">BMW</option>
                      <option value="Ducati">Ducati</option>
                      <option value="Harley-Davidson">Harley-Davidson</option>
                      <option value="Outras">Outras</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Modelo
                    </label>
                    <input
                      type="text"
                      value={vehicle.model}
                      onChange={(e) => updateVehicle(vehicle.id, 'model', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Ex: CB 600F"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Placa
                    </label>
                    <input
                      type="text"
                      value={vehicle.plate}
                      onChange={(e) => updateVehicle(vehicle.id, 'plate', formatPlate(e.target.value))}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="ABC-1234"
                      maxLength={8}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Ano
                    </label>
                    <input
                      type="number"
                      value={vehicle.year}
                      onChange={(e) => updateVehicle(vehicle.id, 'year', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="2023"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Cor
                    </label>
                    <input
                      type="text"
                      value={vehicle.color}
                      onChange={(e) => updateVehicle(vehicle.id, 'color', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Ex: Vermelha"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
          placeholder="Observações adicionais sobre o cliente..."
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
          {isLoading ? 'Salvando...' : (client ? 'Atualizar Cliente' : 'Cadastrar Cliente')}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;