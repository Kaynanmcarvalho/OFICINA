import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import ClientForm from '../components/forms/ClientForm';

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const handleNewClient = () => {
    setIsClientModalOpen(true);
  };

  const handleClientSubmit = (clientData) => {
    console.log('Client data:', clientData);
    // Aqui você salvaria os dados no banco/store
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Digite um termo para buscar');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simular busca
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Buscando por: ${searchTerm}`);
    } catch (error) {
      toast.error('Erro ao buscar clientes');
    } finally {
      setIsLoading(false);
    }
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Telefone
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
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Nenhum cliente cadastrado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        title="Novo Cliente"
        size="lg"
      >
        <ClientForm
          onSubmit={handleClientSubmit}
          onClose={() => setIsClientModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ClientsPage;