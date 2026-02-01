/**
 * ClientViewModal - Modal inteligente para visualizar dados completos do cliente
 * Inclui histórico de visitas, serviços, orçamentos e timeline interativo
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Car, 
  FileText, 
  Building2, 
  MessageCircle,
  Calendar,
  Clock,
  DollarSign,
  Wrench,
  ChevronRight,
  Activity,
  BarChart3,
  History,
  Award,
  Target
} from 'lucide-react';
import ClientAvatar from './ClientAvatar';
import VehicleThumbnail from '../../../components/VehicleThumbnail';
import { formatFullAddress, formatCEP } from '../../../utils/addressUtils';

const ClientViewModal = ({ isOpen, onClose, client }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [clientHistory, setClientHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Carregar histórico do cliente
  useEffect(() => {
    if (isOpen && client) {
      loadClientHistory();
    }
  }, [isOpen, client]);

  if (!client) return null;

  const loadClientHistory = async () => {
    setIsLoadingHistory(true);
    try {
      // Simular dados de histórico (substituir por API real)
      const mockHistory = [
        {
          id: 1,
          date: '2024-01-15',
          type: 'service',
          status: 'completed',
          vehicle: 'Honda CB 600F',
          plate: 'ABC-1234',
          services: [
            { name: 'Troca de óleo', price: 80.00, status: 'completed' },
            { name: 'Revisão geral', price: 150.00, status: 'completed' },
            { name: 'Limpeza do filtro', price: 30.00, status: 'completed' }
          ],
          total: 260.00,
          notes: 'Cliente solicitou revisão completa. Tudo ok.',
          technician: 'João Silva'
        },
        {
          id: 2,
          date: '2024-01-08',
          type: 'quote',
          status: 'pending',
          vehicle: 'Honda CB 600F',
          plate: 'ABC-1234',
          services: [
            { name: 'Troca de pneus', price: 400.00, status: 'quoted' },
            { name: 'Alinhamento', price: 80.00, status: 'quoted' }
          ],
          total: 480.00,
          notes: 'Orçamento para troca de pneus traseiro e dianteiro.',
          validUntil: '2024-02-08'
        },
        {
          id: 3,
          date: '2023-12-20',
          type: 'service',
          status: 'completed',
          vehicle: 'Honda CB 600F',
          plate: 'ABC-1234',
          services: [
            { name: 'Manutenção preventiva', price: 120.00, status: 'completed' }
          ],
          total: 120.00,
          notes: 'Primeira visita do cliente. Muito satisfeito.',
          technician: 'Carlos Santos'
        }
      ];
      
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 800));
      setClientHistory(mockHistory);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Formatação de CPF
  const formatCPF = (cpf) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Formatação de CNPJ
  const formatCNPJ = (cnpj) => {
    if (!cnpj) return '';
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) return cnpj;
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  // Formatação de telefone com DDD
  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  // Validação de WhatsApp
  const hasWhatsApp = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned.charAt(2) === '9';
  };

  // Função para abrir WhatsApp
  const openWhatsApp = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const whatsappNumber = cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
    const message = encodeURIComponent(`Olá ${client.name}! Como posso ajudá-lo?`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  // Determinar tipo de pessoa
  const isJuridica = client.cnpj && client.cnpj.length > 0;

  // Formatação de data
  const formatDate = (date) => {
    if (!date) return 'Não informado';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Endereço completo usando utilitário
  const getFullAddress = () => {
    return formatFullAddress(client);
  };

  // Calcular estatísticas do cliente
  const getClientStats = () => {
    const totalServices = clientHistory.filter(h => h.type === 'service' && h.status === 'completed').length;
    const totalSpent = clientHistory
      .filter(h => h.type === 'service' && h.status === 'completed')
      .reduce((sum, h) => sum + h.total, 0);
    const pendingQuotes = clientHistory.filter(h => h.type === 'quote' && h.status === 'pending').length;
    const lastVisit = clientHistory.length > 0 ? clientHistory[0].date : null;
    
    return { totalServices, totalSpent, pendingQuotes, lastVisit };
  };

  // Formatação de moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatação de data relativa
  const getRelativeDate = (date) => {
    const now = new Date();
    const visitDate = new Date(date);
    const diffTime = Math.abs(now - visitDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atrás`;
    return `${Math.floor(diffDays / 365)} anos atrás`;
  };

  // Ícone por tipo de visita
  const getVisitIcon = (type, status) => {
    if (type === 'service') {
      return status === 'completed' ? 
        <Wrench className="w-4 h-4 text-green-600" /> : 
        <Clock className="w-4 h-4 text-yellow-600" />;
    }
    return <FileText className="w-4 h-4 text-blue-600" />;
  };

  // Cor do status
  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      quoted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status] || colors.pending;
  };

  const stats = getClientStats();
  const cadastroDate = client.createdAt ? new Date(client.createdAt) : new Date();
  const diasCadastrado = Math.floor((new Date() - cadastroDate) / (1000 * 60 * 60 * 24));

  // Tabs do modal
  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: User },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'analytics', label: 'Análises', icon: BarChart3 }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-6xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl dark:shadow-neutral-950/50 border border-neutral-200 dark:border-neutral-800 flex flex-col"
            style={{ transform: 'scale(0.9)', height: '90vh' }}
          >
            {/* Header Minimalista Apple */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/50 dark:border-neutral-700/50 bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ClientAvatar name={client.name} size="lg" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {client.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
                      {isJuridica ? 'PJ' : 'PF'}
                    </span>
                    {(client.cpf || client.cnpj) && (
                      <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                        {isJuridica ? formatCNPJ(client.cnpj) : formatCPF(client.cpf)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">{stats.totalServices}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Serviços</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">{formatCurrency(stats.totalSpent)}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Total</div>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex-shrink-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400 bg-white dark:bg-neutral-800'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>

              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              
              {/* Aba: Visão Geral */}
              {activeTab === 'overview' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Informações Pessoais/Empresariais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    {isJuridica ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    {isJuridica ? 'Dados da Empresa' : 'Dados Pessoais'}
                  </h3>
                  
                  <div className="space-y-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                    {isJuridica ? (
                      <>
                        {client.razaoSocial && (
                          <div>
                            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                              Razão Social
                            </label>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mt-1">
                              {client.razaoSocial}
                            </p>
                          </div>
                        )}
                        {client.nomeFantasia && (
                          <div>
                            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                              Nome Fantasia
                            </label>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mt-1">
                              {client.nomeFantasia}
                            </p>
                          </div>
                        )}
                        {client.inscricaoEstadual && (
                          <div>
                            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                              Inscrição Estadual
                            </label>
                            <p className="text-sm font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                              {client.inscricaoEstadual}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {client.birthDate && (
                          <div>
                            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                              Data de Nascimento
                            </label>
                            <p className="text-sm text-neutral-900 dark:text-neutral-100 mt-1 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(client.birthDate)}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Contato */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contato
                  </h3>
                  
                  <div className="space-y-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                    {client.phone && (
                      <div>
                        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                          Telefone
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm font-mono text-neutral-900 dark:text-neutral-100">
                            {formatPhone(client.phone)}
                          </p>
                          {hasWhatsApp(client.phone) && (
                            <motion.button
                              onClick={() => openWhatsApp(client.phone)}
                              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200"
                              style={{
                                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                color: 'white',
                                boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                              }}

                              whileTap={{ scale: 0.95 }}
                            >
                              <MessageCircle size={12} />
                              WhatsApp
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {client.email && (
                      <div>
                        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                          Email
                        </label>
                        <p className="text-sm text-neutral-900 dark:text-neutral-100 mt-1 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Endereço
                  </h3>
                  
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">
                      {getFullAddress()}
                    </p>
                  </div>
                </div>

                {/* Veículos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Veículos ({client.vehicles?.length || 0})
                  </h3>
                  
                  <div className="space-y-2">
                    {client.vehicles && client.vehicles.length > 0 ? (
                      client.vehicles.map((vehicle, index) => (
                        <div key={index} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <VehicleThumbnail 
                                vehicle={vehicle}
                                size="md"
                                showLabel={false}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                {vehicle.brand} {vehicle.model}
                              </p>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {vehicle.year} • {vehicle.color}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {vehicle.plate}
                              </p>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 capitalize">
                                {vehicle.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 text-center">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Nenhum veículo cadastrado
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Observações */}
                {client.observations && (
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Observações
                    </h3>
                    
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                      <p className="text-sm text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap">
                        {client.observations}
                      </p>
                    </div>
                  </div>
                )}

                    {/* Estatísticas Rápidas */}
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div 
                          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 text-center"
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.totalServices}
                          </div>
                          <div className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">
                            Serviços Realizados
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 text-center"
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(stats.totalSpent)}
                          </div>
                          <div className="text-xs text-green-600/70 dark:text-green-400/70 font-medium">
                            Total Investido
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 text-center"
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {client.vehicles?.length || 0}
                          </div>
                          <div className="text-xs text-purple-600/70 dark:text-purple-400/70 font-medium">
                            Veículos Cadastrados
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 text-center"
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {stats.pendingQuotes}
                          </div>
                          <div className="text-xs text-orange-600/70 dark:text-orange-400/70 font-medium">
                            Orçamentos Pendentes
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Aba: Histórico de Visitas */}
              {activeTab === 'history' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Histórico de Visitas
                    </h3>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {clientHistory.length} registros encontrados
                    </div>
                  </div>

                  {isLoadingHistory ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-neutral-200 dark:bg-neutral-700 rounded-xl h-20"></div>
                        </div>
                      ))}
                    </div>
                  ) : clientHistory.length > 0 ? (
                    <div className="space-y-4">
                      {clientHistory.map((visit, index) => (
                        <motion.div
                          key={visit.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
                        >
                          <div 
                            className="p-4 cursor-pointer"
                            onClick={() => setExpandedVisit(expandedVisit === visit.id ? null : visit.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                  {getVisitIcon(visit.type, visit.status)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                                      {visit.type === 'service' ? 'Serviço Realizado' : 'Orçamento'}
                                    </h4>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(visit.status)}`}>
                                      {visit.status === 'completed' ? 'Concluído' : 
                                       visit.status === 'pending' ? 'Pendente' : 
                                       visit.status === 'quoted' ? 'Orçado' : visit.status}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(visit.date)} ({getRelativeDate(visit.date)})
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Car className="w-3 h-3" />
                                      {visit.vehicle} - {visit.plate}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                                    {formatCurrency(visit.total)}
                                  </div>
                                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {visit.services.length} {visit.services.length === 1 ? 'serviço' : 'serviços'}
                                  </div>
                                </div>
                                <motion.div
                                  animate={{ rotate: expandedVisit === visit.id ? 90 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                                </motion.div>
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedVisit === visit.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-neutral-200 dark:border-neutral-700"
                              >
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Serviços */}
                                    <div>
                                      <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                                        <Wrench className="w-4 h-4" />
                                        Serviços Executados
                                      </h5>
                                      <div className="space-y-2">
                                        {visit.services.map((service, idx) => (
                                          <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-neutral-800 rounded-lg">
                                            <span className="text-sm text-neutral-900 dark:text-neutral-100">
                                              {service.name}
                                            </span>
                                            <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                              {formatCurrency(service.price)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Detalhes */}
                                    <div>
                                      <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Detalhes
                                      </h5>
                                      <div className="space-y-2 text-sm">
                                        {visit.technician && (
                                          <div className="flex items-center gap-2">
                                            <User className="w-3 h-3 text-neutral-400" />
                                            <span className="text-neutral-600 dark:text-neutral-400">Técnico:</span>
                                            <span className="text-neutral-900 dark:text-neutral-100">{visit.technician}</span>
                                          </div>
                                        )}
                                        {visit.validUntil && (
                                          <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-neutral-400" />
                                            <span className="text-neutral-600 dark:text-neutral-400">Válido até:</span>
                                            <span className="text-neutral-900 dark:text-neutral-100">{formatDate(visit.validUntil)}</span>
                                          </div>
                                        )}
                                        {visit.notes && (
                                          <div className="mt-3">
                                            <div className="text-neutral-600 dark:text-neutral-400 mb-1">Observações:</div>
                                            <div className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 p-2 rounded-lg">
                                              {visit.notes}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <History className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        Nenhum histórico encontrado
                      </h4>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Este cliente ainda não possui visitas registradas.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Aba: Análises */}
              {activeTab === 'analytics' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Análises do Cliente
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Frequência de Visitas */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100">Frequência</h4>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Visitas por mês</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {(stats.totalServices / Math.max(diasCadastrado / 30, 1)).toFixed(1)}
                      </div>
                      <p className="text-sm text-blue-600/70 dark:text-blue-400/70">
                        Média mensal de visitas
                      </p>
                    </div>

                    {/* Ticket Médio */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-100">Ticket Médio</h4>
                          <p className="text-sm text-green-600 dark:text-green-400">Por serviço</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {formatCurrency(stats.totalServices > 0 ? stats.totalSpent / stats.totalServices : 0)}
                      </div>
                      <p className="text-sm text-green-600/70 dark:text-green-400/70">
                        Valor médio por visita
                      </p>
                    </div>

                    {/* Fidelidade */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-900 dark:text-purple-100">Fidelidade</h4>
                          <p className="text-sm text-purple-600 dark:text-purple-400">Score do cliente</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {Math.min(100, Math.round((stats.totalServices * 20) + (diasCadastrado / 10)))}%
                      </div>
                      <p className="text-sm text-purple-600/70 dark:text-purple-400/70">
                        Baseado em visitas e tempo
                      </p>
                    </div>
                  </div>

                  {/* Recomendações */}
                  <div className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Recomendações Inteligentes
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stats.totalServices === 0 && (
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
                          <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">Cliente Novo</h5>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Ofereça um desconto especial no primeiro serviço para incentivar a primeira visita.
                          </p>
                        </div>
                      )}
                      {stats.totalServices > 0 && stats.totalServices < 3 && (
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
                          <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">Fidelização</h5>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Cliente em fase de fidelização. Mantenha contato regular e ofereça serviços preventivos.
                          </p>
                        </div>
                      )}
                      {stats.totalServices >= 3 && (
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
                          <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">Cliente Fiel</h5>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Cliente fidelizado! Considere oferecer um programa de benefícios ou descontos especiais.
                          </p>
                        </div>
                      )}
                      {stats.pendingQuotes > 0 && (
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
                          <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">Follow-up Necessário</h5>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Há {stats.pendingQuotes} orçamento(s) pendente(s). Entre em contato para conversão.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Última atualização: {formatDate(new Date())}
                </div>
                <div className="flex gap-3">
                  {client.phone && hasWhatsApp(client.phone) && (
                    <motion.button
                      onClick={() => openWhatsApp(client.phone)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        color: 'white'
                      }}

                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </motion.button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClientViewModal;