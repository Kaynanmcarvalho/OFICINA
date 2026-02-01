import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Plus, Search, User, UserPlus } from 'lucide-react';
import { useClientStore } from '../../store';
import toast from 'react-hot-toast';

const CheckInForm = ({ onClose, onSubmit }) => {
  const { clients, searchClients, createClient } = useClientStore();
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientPhone: '',
    clientCpf: '',
    motorcycle: '',
    plate: '',
    observations: '',
    photos: []
  });
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    phone: '',
    cpf: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClientData(prev => ({
      ...prev,
      [name]: value
    }));
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
        // Buscar por nome, CPF, CNPJ
        let clientResults = result.data;
        
        // Buscar também por placa nos veículos dos clientes
        const allClients = clients || [];
        const vehicleResults = allClients.filter(client => 
          client.vehicles && client.vehicles.some(vehicle => 
            vehicle.placa && vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase())
          )

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
      toast.error('Erro ao buscar clientes');
    } finally {
      setIsSearching(false);
    }
  };

  const selectClient = (client) => {
    // Se o cliente tem veículos, preenche automaticamente com o primeiro
    const firstVehicle = client.vehicles && client.vehicles.length > 0 ? client.vehicles[0] : null;
    
    setFormData(prev => ({
      ...prev,
      clientId: client.firestoreId,
      clientName: client.name,
      clientPhone: client.phone || '',
      clientCpf: client.cpf || '',
      motorcycle: firstVehicle ? `${firstVehicle.marca || ''} ${firstVehicle.modelo || ''}`.trim() : '',
      plate: firstVehicle ? firstVehicle.placa || '' : ''
    }));
    setSearchTerm(firstVehicle ? `${client.name} - ${firstVehicle.placa}` : client.name);
    setShowSearchResults(false);
  };

  const selectVehicle = (client, vehicle) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.firestoreId,
      clientName: client.name,
      clientPhone: client.phone || '',
      clientCpf: client.cpf || '',
      motorcycle: `${vehicle.marca || ''} ${vehicle.modelo || ''}`.trim(),
      plate: vehicle.placa || ''
    }));
    setSearchTerm(`${client.name} - ${vehicle.placa}`);
    setShowSearchResults(false);
  };

  const handleCreateNewClient = async () => {
    if (!newClientData.name || !newClientData.phone) {
      toast.error('Nome e telefone são obrigatórios');
      return;
    }

    try {
      const clientData = {
        ...newClientData,
        vehicles: []
      };
      
      const newClient = await createClient(clientData);
      
      setFormData(prev => ({
        ...prev,
        clientId: newClient.firestoreId,
        clientName: newClient.name,
        clientPhone: newClient.phone,
        clientCpf: newClient.cpf || ''
      }));
      
      setSearchTerm(newClient.name);
      setShowNewClientForm(false);
      setNewClientData({ name: '', phone: '', cpf: '', email: '' });
      toast.success('Cliente criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar cliente');
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.photos.length + files.length > 10) {
      toast.error('Máximo de 10 fotos permitidas');
      return;
    }
    
    const newPhotos = [];
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        newPhotos.push({
          id: Date.now() + Math.random(),
          file,
          preview: URL.createObjectURL(file)
        });
      }
    });
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const openCamera = () => {
    if (formData.photos.length >= 10) {
      toast.error('Máximo de 10 fotos permitidas');
      return;
    }
    cameraInputRef.current?.click();
  };

  const openFileSelector = () => {
    if (formData.photos.length >= 10) {
      toast.error('Máximo de 10 fotos permitidas');
      return;
    }
    fileInputRef.current?.click();
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.motorcycle) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      // Simular processo de check-in
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const checkInData = {
        ...formData,
        id: `CHK-${Date.now()}`,
        checkInDate: new Date().toISOString(),
        status: 'checked-in'
      };
      
      if (onSubmit) {
        onSubmit(checkInData);
      }
      
      toast.success('Check-in realizado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao realizar check-in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Seção de Busca de Cliente */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar Cliente
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Digite nome, CPF, CNPJ ou placa do veículo..."
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowNewClientForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <UserPlus className="w-4 h-4" />
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
                        {client.phone} {client.cpf && `• CPF: ${client.cpf}`} • {client.vehicles?.length || 0} veículo(s)
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
                              {vehicle.marca} {vehicle.modelo} - {vehicle.placa}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {vehicle.ano} • {vehicle.cor}
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
        
        {/* Modal para Novo Cliente */}
        {showNewClientForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Criar Novo Cliente
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newClientData.name}
                    onChange={handleNewClientChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={newClientData.phone}
                    onChange={handleNewClientChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CPF/CNPJ
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={newClientData.cpf}
                    onChange={handleNewClientChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newClientData.email}
                    onChange={handleNewClientChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="cliente@email.com"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewClientForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewClient}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Criar Cliente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Dados do Cliente Selecionado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome do Cliente *
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o nome do cliente"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefone
          </label>
          <input
            type="text"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Telefone do cliente"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modelo do Veículo *
          </label>
          <input
            type="text"
            name="motorcycle"
            value={formData.motorcycle}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Honda CB 600F"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Placa
        </label>
        <input
          type="text"
          name="plate"
          value={formData.plate}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ABC-1234"
        />
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
          placeholder="Descreva o problema ou serviço solicitado..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Fotos ({formData.photos.length}/10)
        </label>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {/* Input para câmera */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            {/* Input para galeria */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            
            <button
              type="button"
              onClick={openCamera}
              disabled={formData.photos.length >= 10}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
            >
              <Camera className="w-4 h-4" />
              <span>Tirar Foto</span>
            </button>
            
            <button
              type="button"
              onClick={openFileSelector}
              disabled={formData.photos.length >= 10}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
            >
              <Upload className="w-4 h-4" />
              <span>Galeria</span>
            </button>
          </div>
          
          {/* Grid de fotos com slot para adicionar mais */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {formData.photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.preview}
                  alt="Preview"
                  className="w-full h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {/* Slot para adicionar mais fotos */}
            {formData.photos.length < 10 && (
              <button
                type="button"
                onClick={openFileSelector}
                className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-xs">Adicionar</span>
              </button>
            )}
          </div>
        </div>
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
          {isLoading ? 'Processando...' : 'Fazer Check-in'}
        </button>
      </div>
    </form>
  );
};

export default CheckInForm;