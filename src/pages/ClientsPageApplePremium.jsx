/**
 * ClientsPageApplePremium - Gestão de Clientes Estilo Apple
 * Design ultra-refinado com glassmorphism, depth real e microinterações precisas
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Plus, 
  Search,
  Phone,
  Mail,
  MapPin,
  Car,
  Calendar,
  MessageCircle,
  Grid3x3,
  List
} from 'lucide-react';
import { useClientStore } from '../store/clientStore';
import { useThemeStore } from '../store/themeStore';
import { formatPhone, formatCPF } from '../utils/formatters';
import toast from 'react-hot-toast';
import './clients/ClientsPageApple.css';
import '../styles/clients-apple-scale-20.css';

const ClientsPageApplePremium = () => {
  const { isDarkMode } = useThemeStore();
  const { clients, fetchClients, isLoading } = useClientStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter(c => c.status === 'active' || !c.status).length;
    const inactive = total - active;
    
    return { total, active, inactive };
  }, [clients]);

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    
    const search = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search) ||
      client.phone?.includes(searchTerm) ||
      client.cpf?.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  const handleWhatsApp = (phone) => {
    if (!phone) {
      toast.error('Cliente sem telefone cadastrado');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  return (
    <div className={`clients-apple-page h-screen overflow-y-auto ${isDarkMode ? 'dark' : ''}`}>
      {/* Background com Depth Real */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#F5F5F7] via-[#EDEDED] to-[#E8E8EA] dark:from-[#0E1117] dark:via-[#12151D] dark:to-[#0A0C10]" />
      
      {/* Light Falloff - Iluminação Superior */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-radial from-white/10 via-transparent to-transparent dark:from-white/5 pointer-events-none" />
      
      {/* Animated Background Orbs com Motion Blur */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-400/10 dark:to-cyan-400/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.12, 0.22, 0.12],
          x: [0, -40, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed bottom-20 left-20 w-[550px] h-[550px] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 dark:from-purple-400/10 dark:to-pink-400/10 rounded-full blur-[120px]"
      />

      <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto">
        {/* Header com Tipografia Refinada */}
        <motion.div
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10"
        >
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-[#4A5568] to-gray-900 dark:from-white dark:via-[#9AAFFF] dark:to-white mb-2"
              style={{ 
                letterSpacing: '-0.04em',
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif'
              }}
            >
              Gestão de Clientes
            </h1>
            <p className="text-base text-[#6B7280] dark:text-[#A2A8C3] font-medium">
              Gerencie seus clientes com eficiência e estilo
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 122, 255, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-[#007AFF] to-[#005BBB] text-white px-8 py-3.5 rounded-2xl font-semibold text-base shadow-[0_0_25px_rgba(0,122,255,0.3)] hover:shadow-[0_0_35px_rgba(0,122,255,0.5)] transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Novo Cliente</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <StatCard
            icon={Users}
            label="Total de Clientes"
            value={stats.total}
            color="blue"
            delay={0}
          />
          <StatCard
            icon={UserCheck}
            label="Clientes Ativos"
            value={stats.active}
            color="green"
            delay={0.1}
          />
          <StatCard
            icon={UserX}
            label="Clientes Inativos"
            value={stats.inactive}
            color="gray"
            delay={0.2}
          />
        </motion.div>

        {/* Search Bar com Foco Refinado e View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="relative flex-1 max-w-2xl">
            <motion.div
              animate={{
                scale: searchFocused ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative"
            >
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${searchFocused ? 'text-[#007AFF]' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Buscar por nome, e-mail, telefone ou CPF..."
                className={`w-full pl-14 pr-6 py-3.5 bg-white/5 dark:bg-white/5 backdrop-blur-lg border ${searchFocused ? 'border-[#007AFF]/50 shadow-[0_0_20px_rgba(0,122,255,0.2)]' : 'border-white/10 dark:border-white/10'} rounded-full text-gray-900 dark:text-white placeholder-[#6B7280] focus:outline-none transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]`}
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                }}
              />
            </motion.div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white/5 dark:bg-white/5 backdrop-blur-lg border border-white/10 rounded-full p-1.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-full transition-all duration-300 ${viewMode === 'grid' ? 'bg-[#007AFF] text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-white/10'}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-full transition-all duration-300 ${viewMode === 'list' ? 'bg-[#007AFF] text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-white/10'}`}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Clients Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} delay={i * 0.1} />
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <EmptyStateComponent searchTerm={searchTerm} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredClients.map((client, index) => (
                <ClientCard
                  key={client.id || client.firestoreId}
                  client={client}
                  index={index}
                  onWhatsApp={handleWhatsApp}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, delay }) => {
  const colors = {
    blue: 'from-blue-500/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/10 border-blue-500/20',
    green: 'from-green-500/10 to-green-600/10 dark:from-green-400/10 dark:to-green-500/10 border-green-500/20',
    gray: 'from-gray-500/10 to-gray-600/10 dark:from-gray-400/10 dark:to-gray-500/10 border-gray-500/20'
  };

  const iconColors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    gray: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`bg-gradient-to-br ${colors[color]} backdrop-blur-md border ${colors[color]} rounded-2xl p-6 shadow-lg shadow-black/5`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-white/50 dark:bg-gray-800/50 flex items-center justify-center ${iconColors[color]}`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </motion.div>
  );
};

// Client Card Component
const ClientCard = ({ client, index, onWhatsApp }) => {
  const initials = client.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const vehicleCount = client.vehicles?.length || 0;
  const lastVisit = client.lastVisit || 'Nunca';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all"
    >
      {/* Avatar e Nome */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {initials}
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

      {/* Informações */}
      <div className="space-y-2 mb-4">
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{formatPhone(client.phone)}</span>
          </div>
        )}
        {client.address && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{client.address}</span>
          </div>
        )}
      </div>

      {/* Mini Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {vehicleCount} {vehicleCount === 1 ? 'veículo' : 'veículos'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {lastVisit}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-sm transition-colors"
        >
          Ver Detalhes
        </motion.button>
        {client.phone && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onWhatsApp(client.phone)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
        )}
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
    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 animate-pulse"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
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
const EmptyStateComponent = ({ searchTerm }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="col-span-full flex flex-col items-center justify-center py-20"
  >
    <Users className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
    <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-500 mb-2">
      {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
    </h3>
    <p className="text-gray-400 dark:text-gray-500">
      {searchTerm ? 'Tente buscar com outros termos' : 'Adicione seu primeiro cliente para começar'}
    </p>
  </motion.div>
);

export default ClientsPageApplePremium;
