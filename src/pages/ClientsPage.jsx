/**
 * ClientsPage - Página de clientes com design Apple-like premium
 * Reformulação completa com glassmorphism e microinterações
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store';
import { useClientStore } from '../store';
import toast from 'react-hot-toast';
import '../styles/clients-scale.css';
import '../styles/clients-no-blur.css';
import '../styles/clients-force-no-blur.css';
import '../styles/clients-scale-20.css';

// Componentes
import PageHeader from './clients/components/PageHeader';
import SearchBar from './clients/components/SearchBar';
import ClientTable from './clients/components/ClientTable';
import ClientModal from './clients/components/ClientModal';
import ClientViewModal from './clients/components/ClientViewModal';
import VehicleGalleryModal from '../components/VehicleGalleryModal';
import ClientFilter from '../components/ui/ClientFilter';
import EmptyState from './clients/components/EmptyState';

const ClientsPage = () => {
  const { isDarkMode } = useThemeStore();
  const { clients, fetchClients, createClient, updateClient, deleteClient, isLoading } = useClientStore();
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [vehicleClient, setVehicleClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [activeFilters, setActiveFilters] = useState({ 
    status: 'all', 
    period: 'all', 
    location: 'all' 
  });
  
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
  
  // Filtrar clientes baseado na busca e filtros
  useEffect(() => {
    let filtered = clients;

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(client => 
        client.name?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.includes(query) ||
        client.cpf?.includes(query)
      );
    }

    // Filtro por status
    if (activeFilters.status !== 'all') {
      filtered = filtered.filter(client => {
        if (activeFilters.status === 'active') {
          return client.active !== false;
        } else if (activeFilters.status === 'inactive') {
          return client.active === false;
        }
        return true;
      });
    }

    // Filtro por período (exemplo básico)
    if (activeFilters.period !== 'all') {
      const now = new Date();
      filtered = filtered.filter(client => {
        if (!client.createdAt) return true;
        const clientDate = new Date(client.createdAt);
        
        switch (activeFilters.period) {
          case 'today':
            return clientDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return clientDate >= weekAgo;
          case 'month':
            return clientDate.getMonth() === now.getMonth() && 
                   clientDate.getFullYear() === now.getFullYear();
          case 'year':
            return clientDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredClients(filtered);
  }, [clients, searchQuery, activeFilters]);
  
  const handleNewClient = () => {
    setSelectedClient(null);
    setIsClientModalOpen(true);
  };
  
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  const handleViewClient = (client) => {
    setViewingClient(client);
    setIsViewModalOpen(true);
  };

  const handleViewVehicles = (client) => {
    if (client.vehicles && client.vehicles.length > 0) {
      setVehicleClient(client);
      setIsVehicleModalOpen(true);
    } else {
      toast.error('Este cliente não possui veículos cadastrados');
    }
  };

  // Nova função para toggle de status - otimizada
  const handleToggleClientStatus = async (clientId, newStatus) => {
    try {
      const client = clients.find(c => c.id === clientId || c.firestoreId === clientId);
      if (!client) {
        console.error('Cliente não encontrado:', clientId);
        return;
      }

      // Atualização otimizada - apenas os campos necessários
      const updateData = { 
        active: newStatus,
        updatedAt: new Date().toISOString()
      };

      await updateClient(client.firestoreId || client.id, updateData);
      
      // Toast mais discreto
      toast.success(
        newStatus ? 'Cliente ativado' : 'Cliente desativado',
        { 
          duration: 2000,
          style: {
            fontSize: '14px',
            padding: '8px 12px'
          }
        }
      );
    } catch (error) {
      console.error('Erro ao alterar status do cliente:', error);
      toast.error('Erro ao alterar status do cliente');
    }
  };

  // Função para lidar com mudanças de filtro
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  // Calcular estatísticas para o filtro
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.active !== false).length;
  const inactiveClients = clients.filter(c => c.active === false).length;
  

  
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
      className="transition-colors duration-300 px-6 pb-12 clients-page-container"
      style={{
        background: isDarkMode 
          ? 'var(--apple-bg-primary, #000000)'
          : 'var(--apple-bg-primary, #ffffff)',
        color: isDarkMode 
          ? 'var(--apple-text-primary, #f5f5f7)'
          : 'var(--apple-text-primary, #1d1d1f)',
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
        
        {/* SearchBar e Filtros */}
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
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                isLoading={isLoading}
              />
            </div>
            <ClientFilter
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
              totalClients={totalClients}
              activeClients={activeClients}
              inactiveClients={inactiveClients}
            />
          </div>
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
              onToggleClientStatus={handleToggleClientStatus}
              onViewClient={handleViewClient}
              onViewVehicles={handleViewVehicles}
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

      {/* Modal de Visualização */}
      <ClientViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingClient(null);
        }}
        client={viewingClient}
      />

      {/* Modal de Galeria de Veículos */}
      <VehicleGalleryModal
        isOpen={isVehicleModalOpen}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setVehicleClient(null);
        }}
        client={vehicleClient}
        vehicles={vehicleClient?.vehicles || []}
      />
    </div>
  );
};

export default ClientsPage;
