import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Phone, Mail } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ClientForm from '../components/forms/ClientForm';
import { useClientStore } from '../store';
import toast from 'react-hot-toast';

const ClientsPage = () => {
  const { clients, fetchClients, createClient, updateClient, searchClients, isLoading, error } = useClientStore();
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    console.log('[ClientsPage] Mounting, fetching clients...');
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    console.log('[ClientsPage] Clients updated:', clients.length);
  }, [clients]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleNewClient = () => {
    setSelectedClient(null);
    setIsClientModalOpen(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  const handleClientSubmit = async (clientData) => {
    try {
      if (selectedClient) {
        // Edição de cliente existente
        await updateClient(selectedClient.firestoreId, clientData);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        // Criação de novo cliente
        await createClient(clientData);
        toast.success('Cliente cadastrado com sucesso!');
      }
      setIsClientModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      toast.error(selectedClient ? 'Erro ao atualizar cliente' : 'Erro ao cadastrar cliente');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const result = await searchClients(searchTerm);
      if (result.success) {
        setSearchResults(result.data);
      }
    } catch (error) {
      toast.error('Erro ao buscar clientes');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestão de Clientes
        </h1>
        <button 
          onClick={handleNewClient}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Novo Cliente
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lista de Clientes
          </h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Search className="w-4 h-4" />
            </button>
            {(searchTerm || searchResults.length > 0) && (
              <button 
                onClick={clearSearch}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Veículos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Última Visita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total de Serviços
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
                    Carregando clientes...
                  </td>
                </tr>
              ) : (
                (() => {
                  const clientsToShow = searchResults.length > 0 ? searchResults : clients;
                  return clientsToShow.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        {searchResults.length === 0 && searchTerm ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}
                      </td>
                    </tr>
                  ) : (
                    clientsToShow.map((client) => (
                      <tr key={client.firestoreId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {client.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {client.cpf && `CPF: ${client.cpf}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {client.phone}
                            </div>
                            {client.email && (
                              <div className="flex items-center mt-1">
                                <Mail className="w-4 h-4 mr-2" />
                                {client.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {client.vehicles?.length || 0} veículo(s)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {client.lastServiceDate 
                            ? new Date(client.lastServiceDate).toLocaleDateString('pt-BR')
                            : 'Nunca'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {client.totalServices || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleEditClient(client)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  );
                })()
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setSelectedClient(null);
        }}
        title={selectedClient ? "Editar Cliente" : "Novo Cliente"}
        size="lg"
      >
        <ClientForm
          client={selectedClient}
          onSubmit={handleClientSubmit}
          onClose={() => {
            setIsClientModalOpen(false);
            setSelectedClient(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ClientsPage;