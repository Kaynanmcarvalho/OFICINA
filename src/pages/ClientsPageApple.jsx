/**
 * ClientsPageApple - Página de clientes com design Apple-like premium
 * Reformulação completa com glassmorphism e microinterações
 */

import { useState, useEffect } from 'react';

import { useTheme } from '../hooks/useTheme';
import { useClientStore } from '../store';
import toast from 'react-hot-toast';

// Componentes
import PageHeader from './clients/components/PageHeader';
import SearchBar from './clients/components/SearchBar';
import ClientTable from './clients/components/ClientTable';
import ClientModal from './clients/components/ClientModal';
import EmptyState from './clients/components/EmptyState';

const ClientsPageApple = () => {
  const { isDark } = useTheme();
  const { clients, fetchClients, createClient, updateClient, deleteClient, isLoading } = useClientStore();
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
  
  // Filtrar clientes baseado na busca
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(client => 
        client.name?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.includes(query) ||
        client.cpf?.includes(query)

      setFilteredClients(filtered);
    }
  }, [clients, searchQuery]);
  
  const handleNewClient = () => {
    setSelectedClient(null);
    setIsClientModalOpen(true);
  };
  
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };
  
  const handleDeleteClient = async (client) => {
    if (window.confirm(`Tem certeza que deseja excluir ${client.name}?`)) {
      try {
        await deleteClient(client.firestoreId || client.id);
        toast.success('Cliente excluído com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir cliente:', err);
        toast.error('Erro ao excluir cliente');
      }
    }
  };
  
  const handleSaveClient = async (formData) => {
    try {
      if (selectedClient) {
        await updateClient(selectedClient.firestoreId || selectedClient.id, formData);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await createClient(formData);
        toast.success('Cliente criado com sucesso!');
      }
      setIsClientModalOpen(false);
      setSelectedClient(null);
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      toast.error('Erro ao salvar cliente');
    }
  };
  
  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  
  return (
    <div
      className="min-h-screen transition-colors duration-300 px-6 pb-12"
      style={{
        background: isDark 
          ? '#000000'
          : '#ffffff',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <PageHeader 
          clientCount={clients.length}
          onNewClient={handleNewClient}
        />
        
        {/* SearchBar */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
              },
            },
          }}
          className="mb-6"
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            isLoading={isLoading}
          />
        </motion.div>
        
        {/* Tabela de Clientes */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1,
              },
            },
          }}
        >
          {clients.length === 0 && !isLoading ? (
            <EmptyState onNewClient={handleNewClient} />
          ) : (
            <ClientTable
              clients={filteredClients}
              isLoading={isLoading}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
            />
          )}
        </motion.div>
      </motion.div>
      
      {/* Modal de Cliente */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setSelectedClient(null);
        }}
        onSave={handleSaveClient}
        client={selectedClient}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ClientsPageApple;
