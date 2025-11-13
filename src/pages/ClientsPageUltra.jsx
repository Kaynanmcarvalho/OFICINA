/**
 * ClientsPageUltra - Design Apple Premium de Alto Nível
 * Completamente redesenhado do zero com atenção aos mínimos detalhes
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, Grid3x3, List, 
  Phone, Mail, MapPin, Car, TrendingUp, Star,
  MessageCircle, Eye, Edit, Trash2, MoreVertical,
  X, ChevronRight, Calendar, Activity, Award
} from 'lucide-react';
import { useClientStore } from '../store/clientStore';
import { useThemeStore } from '../store/themeStore';
import { formatPhone, formatCPF } from '../utils/formatters';
import toast from 'react-hot-toast';

const ClientsPageUltra = () => {
  const { isDarkMode } = useThemeStore();
  const { clients, fetchClients, isLoading, deleteClient } = useClientStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter(c => c.status !== 'inactive').length;
    const withVehicles = clients.filter(c => c.vehicles?.length > 0).length;
    const recentlyAdded = clients.filter(c => {
      const created = new Date(c.createdAt || Date.now());
      const daysDiff = (Date.now() - created) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    }).length;
    
    return { total, active, withVehicles, recentlyAdded };
  }, [clients]);

  // Filtrar e buscar clientes
  const filteredClients = useMemo(() => {
    let filtered = clients;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => 
        filterStatus === 'active' ? c.status !== 'inactive' : c.status === 'inactive'
      );
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search) ||
        c.phone?.includes(searchTerm) ||
        c.cpf?.includes(searchTerm)
      );
    }
    
    return filtered;
  }, [clients, searchTerm, filterStatus]);

  return (
    <div className={`relative min-h-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Background Ultra Premium */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#FAFAFA] via-[#F5F5F7] to-[#ECECEE] dark:from-[#000000] dark:via-[#0A0A0F] dark:to-[#050508]" />
      
      {/* Animated Mesh Gradient */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-transparent dark:from-blue-400/20 dark:via-cyan-400/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-purple-500/30 via-pink-500/20 to-transparent dark:from-purple-400/20 dark:via-pink-400/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Noise Texture */}
      <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection stats={stats} isDarkMode={isDarkMode} />
        
        {/* Command Bar */}
        <CommandBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        
        {/* Clients Grid/List */}
        <ClientsView 
          clients={filteredClients}
          viewMode={viewMode}
          isLoading={isLoading}
          onSelectClient={setSelectedClient}
        />
      </div>

      {/* Client Detail Sidebar */}
      <ClientDetailSidebar 
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    </div>
  );
};

export default ClientsPageUltra;


// Hero Section Component
const HeroSection = ({ stats, isDarkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="px-8 pt-12 pb-8"
  >
    <div className="max-w-[1800px] mx-auto">
      {/* Title with Gradient */}
      <h1 className="text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-blue-100 dark:to-white"
        style={{ 
          fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
          letterSpacing: '-0.05em',
          lineHeight: '1.1'
        }}
      >
        Clientes
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Gerencie relacionamentos com excelência
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total" value={stats.total} color="blue" delay={0} />
        <StatCard icon={Activity} label="Ativos" value={stats.active} color="green" delay={0.1} />
        <StatCard icon={Car} label="Com Veículos" value={stats.withVehicles} color="purple" delay={0.2} />
        <StatCard icon={TrendingUp} label="Novos (30d)" value={stats.recentlyAdded} color="orange" delay={0.3} />
      </div>
    </div>
  </motion.div>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, delay }) => {
  const colors = {
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    green: 'from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-600 dark:text-green-400',
    purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
    orange: 'from-orange-500/10 to-red-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative bg-gradient-to-br ${colors[color]} backdrop-blur-xl border rounded-2xl p-6 overflow-hidden group cursor-pointer`}
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};


// Command Bar Component
const CommandBar = ({ searchTerm, setSearchTerm, viewMode, setViewMode, showFilters, setShowFilters, filterStatus, setFilterStatus }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="px-8 pb-6"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Buscar clientes..."
              className={`w-full pl-12 pr-4 py-3.5 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border ${isFocused ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-gray-200/50 dark:border-white/10'} rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
            />
          </div>

          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-3.5 rounded-2xl backdrop-blur-2xl border transition-all ${showFilters ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/60 dark:bg-white/5 border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300'}`}
          >
            <Filter className="w-5 h-5" />
          </motion.button>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <List className="w-5 h-5" />
            </motion.button>
          </div>

          {/* New Client Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <UserPlus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Novo Cliente</span>
          </motion.button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex gap-2">
                {['all', 'active', 'inactive'].map((status) => (
                  <motion.button
                    key={status}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filterStatus === status ? 'bg-blue-500 text-white' : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-300'}`}
                  >
                    {status === 'all' ? 'Todos' : status === 'active' ? 'Ativos' : 'Inativos'}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


// Clients View Component
const ClientsView = ({ clients, viewMode, isLoading, onSelectClient }) => {
  if (isLoading) {
    return (
      <div className="px-8 pb-8">
        <div className="max-w-[1800px] mx-auto">
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="px-8 pb-8"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
          {clients.map((client, index) => (
            <ClientCard
              key={client.id || client.firestoreId}
              client={client}
              index={index}
              viewMode={viewMode}
              onClick={() => onSelectClient(client)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Client Card Component
const ClientCard = ({ client, index, viewMode, onClick }) => {
  const initials = client.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  const vehicleCount = client.vehicles?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className="relative bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-3xl p-6 cursor-pointer group overflow-hidden"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 rounded-3xl" />
      
      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl" />

      <div className="relative">
        {/* Avatar & Name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
              {client.name}
            </h3>
            {client.cpf && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatCPF(client.cpf)}
              </p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {client.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4" />
              <span>{formatPhone(client.phone)}</span>
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200/50 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {vehicleCount} {vehicleCount === 1 ? 'veículo' : 'veículos'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};


// Skeleton Card
const SkeletonCard = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-3xl p-6 animate-pulse"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
    </div>
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
  </motion.div>
);

// Empty State
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="px-8 pb-8"
  >
    <div className="max-w-[1800px] mx-auto">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Nenhum cliente encontrado
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Comece adicionando seu primeiro cliente
        </p>
      </div>
    </div>
  </motion.div>
);

// Client Detail Sidebar
const ClientDetailSidebar = ({ client, onClose }) => {
  if (!client) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 p-6 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Detalhes do Cliente
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Avatar & Name */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-xl">
                {client.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {client.name}
              </h3>
              {client.cpf && (
                <p className="text-gray-600 dark:text-gray-400">
                  {formatCPF(client.cpf)}
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contato
              </h4>
              {client.phone && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">{formatPhone(client.phone)}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">{client.email}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">{client.address}</span>
                </div>
              )}
            </div>

            {/* Vehicles */}
            {client.vehicles && client.vehicles.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Veículos ({client.vehicles.length})
                </h4>
                {client.vehicles.map((vehicle, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {vehicle.model || 'Modelo não informado'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {vehicle.plate || 'Placa não informada'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
