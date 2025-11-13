/**
 * ClientsPagePremium - Gestão de Clientes Premium
 * Design Apple-like com experiência imersiva e funcionalidades inteligentes
 * 
 * Features:
 * - Grid e Lista view com transições suaves
 * - Busca inteligente em tempo real
 * - Filtros avançados com Smart Segments
 * - Slide-over premium para detalhes do cliente
 * - Integração completa com Firebase
 * - WhatsApp integration
 * - Micro-animações e feedback visual
 */

import './clients/estilos/clients-premium-light.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClientStore } from '../store/clientStore';
import { useThemeStore } from '../store/themeStore';
import toast from 'react-hot-toast';

// Components
import ClientsHeader from './clients/ClientsHeader';
import ClientsSearchBar from './clients/ClientsSearchBar';
import ClientsFilters from './clients/ClientsFilters';
import ClientsGridView from './clients/ClientsGridView';
import ClientsListView from './clients/ClientsListView';
import ClientSlideOver from './clients/ClientSlideOver';
import ModalNovoCliente from './checkin/componentes/ModalNovoCliente';
import EmptyState from './clients/EmptyState';

// View modes
const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

const ClientsPagePremium = () => {
  const { isDarkMode } = useThemeStore();
  const { 
    clients, 
    fetchClients, 
    createClient, 
    updateClient, 
    deleteClient,
    isLoading 
  } = useClientStore();

  // View state
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    tags: [],
    dateRange: null
  });

  // Modal states
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  // Load clients on mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filtered clients with intelligent search
  const filteredClients = useMemo(() => {
    let filtered = [...clients];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(client => 
        client.name?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.includes(query) ||
        client.cpf?.includes(query) ||
        client.cnpj?.includes(query)
      );
    }

    // Status filter
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

    // Tags filter
    if (activeFilters.tags.length > 0) {
      filtered = filtered.filter(client => 
        activeFilters.tags.some(tag => 
          client.tags?.includes(tag)
        )
      );
    }

    // Date range filter
    if (activeFilters.dateRange) {
      const { start, end } = activeFilters.dateRange;
      filtered = filtered.filter(client => {
        if (!client.lastServiceDate) return false;
        const serviceDate = new Date(client.lastServiceDate);
        return serviceDate >= start && serviceDate <= end;
      });
    }

    return filtered;
  }, [clients, searchQuery, activeFilters]);

  // Statistics
  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.active !== false).length,
    inactive: clients.filter(c => c.active === false).length,
    withVehicles: clients.filter(c => c.vehicles?.length > 0).length
  }), [clients]);

  // Handlers
  const handleNewClient = useCallback(() => {
    setEditingClient(null);
    setIsClientModalOpen(true);
  }, []);

  const handleEditClient = useCallback((client) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  }, []);

  const handleViewClient = useCallback((client) => {
    setSelectedClient(client);
    setIsSlideOverOpen(true);
  }, []);

  const handleSaveClient = useCallback(async (clientData) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.firestoreId, clientData);
        toast.success('Cliente atualizado com sucesso!', {
          icon: '✅',
          style: {
            borderRadius: '12px',
            background: isDarkMode ? '#1f2937' : '#fff',
            color: isDarkMode ? '#f9fafb' : '#111827',
          }
        });
      } else {
        await createClient(clientData);
        toast.success('Cliente criado com sucesso!', {
          icon: '🎉',
          style: {
            borderRadius: '12px',
            background: isDarkMode ? '#1f2937' : '#fff',
            color: isDarkMode ? '#f9fafb' : '#111827',
          }
        });
      }
      setIsClientModalOpen(false);
      setEditingClient(null);
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      toast.error('Erro ao salvar cliente', {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: isDarkMode ? '#1f2937' : '#fff',
          color: isDarkMode ? '#f9fafb' : '#111827',
        }
      });
    }
  }, [editingClient, updateClient, createClient, isDarkMode]);

  const handleDeleteClient = useCallback(async (clientId) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
    
    try {
      await deleteClient(clientId);
      toast.success('Cliente excluído com sucesso!', {
        icon: '🗑️',
        style: {
          borderRadius: '12px',
          background: isDarkMode ? '#1f2937' : '#fff',
          color: isDarkMode ? '#f9fafb' : '#111827',
        }
      });
      setIsSlideOverOpen(false);
      setSelectedClient(null);
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      toast.error('Erro ao excluir cliente', {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: isDarkMode ? '#1f2937' : '#fff',
          color: isDarkMode ? '#f9fafb' : '#111827',
        }
      });
    }
  }, [deleteClient, isDarkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + K - Open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('[data-search-input]')?.focus();
      }
      
      // N - New client
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleNewClient();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNewClient]);

  return (
    <div 
      data-page="clients"
      className={`clients-page-container min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      <div className="w-full space-y-4 md:space-y-6 px-3 md:px-4 lg:px-6 py-4 md:py-6">
        {/* Header */}
        <ClientsHeader 
          clientCount={stats.total}
          activeCount={stats.active}
          onNewClient={handleNewClient}
        />

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <ClientsSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                isLoading={isLoading}
                resultCount={filteredClients.length}
              />
            </div>
            
            <ClientsFilters
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
              stats={stats}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading && clients.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Carregando clientes...
                </p>
              </div>
            </motion.div>
          ) : filteredClients.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <EmptyState 
                hasClients={clients.length > 0}
                hasFilters={searchQuery || activeFilters.status !== 'all' || activeFilters.tags.length > 0}
                onNewClient={handleNewClient}
                onClearFilters={() => {
                  setSearchQuery('');
                  setActiveFilters({ status: 'all', tags: [], dateRange: null });
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === VIEW_MODES.GRID ? (
                <ClientsGridView
                  clients={filteredClients}
                  onViewClient={handleViewClient}
                  onEditClient={handleEditClient}
                  onDeleteClient={handleDeleteClient}
                />
              ) : (
                <ClientsListView
                  clients={filteredClients}
                  onViewClient={handleViewClient}
                  onEditClient={handleEditClient}
                  onDeleteClient={handleDeleteClient}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Novo Cliente (mesmo do checkin) */}
      <ModalNovoCliente
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setEditingClient(null);
        }}
        onSuccess={() => {
          setIsClientModalOpen(false);
          setEditingClient(null);
          fetchClients(); // Recarrega a lista de clientes
        }}
        existingClient={editingClient}
      />

      {/* Client Slide Over */}
      <ClientSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => {
          setIsSlideOverOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />
    </div>
  );
};

export default ClientsPagePremium;
