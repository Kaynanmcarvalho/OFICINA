/**
 * SaaS Dashboard - Painel Administrativo Global
 * 
 * APENAS para o dono do Torq (super-admin)
 * Visualiza e gerencia todas as empresas do sistema
 */

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Database, 
  Activity,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  LogIn,
  UserCog,
  X,
  Save,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Crown,
  UserPlus,
  Loader2
} from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { startImpersonation } from '../../services/impersonationService';
import { useEmpresa } from '../../contexts/EmpresaContext';
import toast from 'react-hot-toast';

const SaaSDashboard = () => {
  const empresa = useEmpresa();
  const [empresas, setEmpresas] = useState([]);
  const [stats, setStats] = useState({
    totalEmpresas: 0,
    empresasAtivas: 0,
    empresasInativas: 0,
    totalUsuarios: 0,
    totalClientes: 0,
    cachePlacas: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'users'
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      const empresasSnapshot = await getDocs(
        query(collection(db, 'empresas'), orderBy('dataCriacao', 'desc'))
      );

      const empresasData = empresasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setEmpresas(empresasData);

      const totalEmpresas = empresasData.length;
      const empresasAtivas = empresasData.filter(e => e.ativo !== false).length;
      const empresasInativas = totalEmpresas - empresasAtivas;

      let totalUsuarios = 0;
      for (const emp of empresasData) {
        const usuariosSnapshot = await getDocs(
          collection(db, `empresas/${emp.id}/usuarios`)
        );
        totalUsuarios += usuariosSnapshot.size;
      }

      let totalClientes = 0;
      for (const emp of empresasData) {
        const clientesSnapshot = await getDocs(
          collection(db, `empresas/${emp.id}/clientes`)
        );
        totalClientes += clientesSnapshot.size;
      }

      const cachePlacasSnapshot = await getDocs(collection(db, 'cache_placas'));
      const cachePlacas = cachePlacasSnapshot.size;

      setStats({
        totalEmpresas,
        empresasAtivas,
        empresasInativas,
        totalUsuarios,
        totalClientes,
        cachePlacas
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setIsLoading(false);
    }
  };

  const handleImpersonate = async (empresaId) => {
    const success = await startImpersonation(empresaId, empresa?.empresaId);
    if (success) {
      window.location.href = '/dashboard';
    }
  };

  const openModal = (empresaItem, type) => {
    setSelectedEmpresa(empresaItem);
    setModalType(type);
    if (type === 'users') {
      loadUsuarios(empresaItem.id);
    }
  };

  const closeModal = () => {
    setSelectedEmpresa(null);
    setModalType(null);
    setUsuarios([]);
  };

  const loadUsuarios = async (empresaId) => {
    setLoadingUsuarios(true);
    try {
      const usuariosSnapshot = await getDocs(
        collection(db, `empresas/${empresaId}/usuarios`)
      );
      const usuariosData = usuariosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    }
    setLoadingUsuarios(false);
  };

  const handleUpdateEmpresa = async (updatedData) => {
    try {
      await updateDoc(doc(db, 'empresas', selectedEmpresa.id), {
        ...updatedData,
        dataAtualizacao: serverTimestamp()
      });
      
      setEmpresas(prev => prev.map(e => 
        e.id === selectedEmpresa.id ? { ...e, ...updatedData } : e
      ));
      
      toast.success('Empresa atualizada com sucesso!');
      closeModal();
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast.error('Erro ao atualizar empresa');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, `empresas/${selectedEmpresa.id}/usuarios`, userId), {
        ativo: !currentStatus
      });
      
      setUsuarios(prev => prev.map(u => 
        u.id === userId ? { ...u, ativo: !currentStatus } : u
      ));
      
      toast.success(`Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, `empresas/${selectedEmpresa.id}/usuarios`, userId), {
        role: newRole
      });
      
      setUsuarios(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      toast.success(`Usuário agora é ${newRole === 'admin' ? 'Administrador' : 'Usuário comum'}`);
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      toast.error('Erro ao atualizar permissão');
    }
  };

  const filteredEmpresas = empresas.filter(emp => {
    const matchesSearch = emp.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.cnpj?.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && emp.ativo !== false) ||
                         (filterStatus === 'inactive' && emp.ativo === false);

    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              SaaS Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Painel Administrativo Global - Torq
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-900 dark:text-red-100">
              Modo Super Admin Ativo
            </p>
            <p className="text-xs text-red-700 dark:text-red-300">
              Você tem acesso a TODAS as empresas do sistema. Use com responsabilidade.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Building2} title="Total de Empresas" value={stats.totalEmpresas} subtitle={`${stats.empresasAtivas} ativas, ${stats.empresasInativas} inativas`} color="orange" />
        <StatCard icon={Users} title="Total de Usuários" value={stats.totalUsuarios} subtitle="Em todas as empresas" color="blue" />
        <StatCard icon={Database} title="Total de Clientes" value={stats.totalClientes} subtitle="Cadastrados no sistema" color="green" />
        <StatCard icon={Activity} title="Cache de Placas" value={stats.cachePlacas} subtitle="Placas consultadas (global)" color="purple" />
        <StatCard icon={TrendingUp} title="Taxa de Ativação" value={`${stats.totalEmpresas > 0 ? Math.round((stats.empresasAtivas / stats.totalEmpresas) * 100) : 0}%`} subtitle="Empresas ativas" color="emerald" />
        <StatCard icon={Shield} title="Isolamento" value="100%" subtitle="Dados completamente isolados" color="cyan" />
      </div>

      {/* Filtros e Busca */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === status
                  ? status === 'all' ? 'bg-orange-500 text-white' : status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {status === 'all' ? 'Todas' : status === 'active' ? 'Ativas' : 'Inativas'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Empresas */}
      <div className="space-y-4">
        {filteredEmpresas.map((empresaItem) => (
          <EmpresaCard 
            key={empresaItem.id} 
            empresa={empresaItem}
            onImpersonate={handleImpersonate}
            onOpenModal={openModal}
          />
        ))}

        {filteredEmpresas.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Nenhuma empresa encontrada</p>
          </div>
        )}
      </div>

      {/* Modais */}
      {modalType === 'view' && selectedEmpresa && (
        <ModalVisualizarDetalhes empresa={selectedEmpresa} onClose={closeModal} />
      )}
      
      {modalType === 'edit' && selectedEmpresa && (
        <ModalEditarEmpresa empresa={selectedEmpresa} onClose={closeModal} onSave={handleUpdateEmpresa} />
      )}
      
      {modalType === 'users' && selectedEmpresa && (
        <ModalGerenciarUsuarios 
          empresa={selectedEmpresa} 
          usuarios={usuarios}
          loading={loadingUsuarios}
          onClose={closeModal}
          onToggleStatus={handleToggleUserStatus}
          onToggleRole={handleToggleUserRole}
        />
      )}
    </div>
  );
};


// Componente de Card de Estatística
const StatCard = ({ icon: Icon, title, value, subtitle, color }) => {
  const colorClasses = {
    orange: 'from-orange-500 to-orange-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    emerald: 'from-emerald-500 to-emerald-600',
    cyan: 'from-cyan-500 to-cyan-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
    </div>
  );
};

// Componente de Card de Empresa
const EmpresaCard = ({ empresa, onImpersonate, onOpenModal }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const handleImpersonate = async () => {
    setIsImpersonating(true);
    await onImpersonate(empresa.id);
    setIsImpersonating(false);
    setShowMenu(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {empresa.nomeFantasia || 'Sem nome'}
              </h3>
              {empresa.ativo !== false ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Ativa
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full">
                  <XCircle className="w-3 h-3" />
                  Inativa
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">CNPJ</p>
                <p className="font-semibold text-gray-900 dark:text-white">{empresa.cnpj || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Plano</p>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">{empresa.plano || 'Básico'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Slug</p>
                <p className="font-semibold text-gray-900 dark:text-white font-mono text-xs">{empresa.slug || 'Não definido'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">ID</p>
                <p className="font-semibold text-gray-900 dark:text-white font-mono text-xs">{empresa.id.substring(0, 8)}...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-20">
                <button 
                  onClick={handleImpersonate}
                  disabled={isImpersonating || empresa.ativo === false}
                  className="w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImpersonating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Entrar como Empresa
                    </>
                  )}
                </button>
                
                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                
                <button 
                  onClick={() => { onOpenModal(empresa, 'view'); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar Detalhes
                </button>
                <button 
                  onClick={() => { onOpenModal(empresa, 'edit'); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <Edit className="w-4 h-4" />
                  Editar Empresa
                </button>
                <button 
                  onClick={() => { onOpenModal(empresa, 'users'); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <UserCog className="w-4 h-4" />
                  Gerenciar Usuários
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


// Modal Visualizar Detalhes
const ModalVisualizarDetalhes = ({ empresa, onClose }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Não informado';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{empresa.nomeFantasia || 'Sem nome'}</h2>
                <p className="text-orange-100">{empresa.razaoSocial || empresa.cnpj}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                Informações da Empresa
              </h3>
              
              <InfoItem label="Nome Fantasia" value={empresa.nomeFantasia} />
              <InfoItem label="Razão Social" value={empresa.razaoSocial} />
              <InfoItem label="CNPJ" value={empresa.cnpj} />
              <InfoItem label="Inscrição Estadual" value={empresa.inscricaoEstadual} />
              <InfoItem label="Slug" value={empresa.slug} mono />
              <InfoItem label="ID" value={empresa.id} mono />
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-500" />
                Contato
              </h3>
              
              <InfoItem label="Telefone" value={empresa.telefone} icon={Phone} />
              <InfoItem label="Email" value={empresa.email} icon={Mail} />
              <InfoItem label="WhatsApp" value={empresa.whatsapp} icon={Phone} />
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                Endereço
              </h3>
              
              <InfoItem label="Logradouro" value={empresa.endereco?.logradouro} />
              <InfoItem label="Número" value={empresa.endereco?.numero} />
              <InfoItem label="Complemento" value={empresa.endereco?.complemento} />
              <InfoItem label="Bairro" value={empresa.endereco?.bairro} />
              <InfoItem label="Cidade/UF" value={empresa.endereco?.cidade ? `${empresa.endereco.cidade}/${empresa.endereco.uf}` : null} />
              <InfoItem label="CEP" value={empresa.endereco?.cep} />
            </div>

            {/* Sistema */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Sistema
              </h3>
              
              <InfoItem label="Plano" value={empresa.plano} />
              <InfoItem label="Status" value={empresa.ativo !== false ? 'Ativa' : 'Inativa'} status={empresa.ativo !== false} />
              <InfoItem label="Data de Criação" value={formatDate(empresa.dataCriacao)} />
              <InfoItem label="Última Atualização" value={formatDate(empresa.dataAtualizacao)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para exibir informações
const InfoItem = ({ label, value, icon: Icon, mono, status }) => (
  <div className="flex items-start gap-2">
    {Icon && <Icon className="w-4 h-4 text-gray-400 mt-1" />}
    <div className="flex-1">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      {status !== undefined ? (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
          status ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        }`}>
          {status ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {value}
        </span>
      ) : (
        <p className={`text-sm font-medium text-gray-900 dark:text-white ${mono ? 'font-mono text-xs' : ''}`}>
          {value || 'Não informado'}
        </p>
      )}
    </div>
  </div>
);


// Modal Editar Empresa
const ModalEditarEmpresa = ({ empresa, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nomeFantasia: empresa.nomeFantasia || '',
    razaoSocial: empresa.razaoSocial || '',
    cnpj: empresa.cnpj || '',
    inscricaoEstadual: empresa.inscricaoEstadual || '',
    telefone: empresa.telefone || '',
    email: empresa.email || '',
    whatsapp: empresa.whatsapp || '',
    plano: empresa.plano || 'basico',
    ativo: empresa.ativo !== false,
    endereco: {
      logradouro: empresa.endereco?.logradouro || '',
      numero: empresa.endereco?.numero || '',
      complemento: empresa.endereco?.complemento || '',
      bairro: empresa.endereco?.bairro || '',
      cidade: empresa.endereco?.cidade || '',
      uf: empresa.endereco?.uf || '',
      cep: empresa.endereco?.cep || ''
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Edit className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Editar Empresa</h2>
                <p className="text-blue-100">{empresa.nomeFantasia}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Nome Fantasia" value={formData.nomeFantasia} onChange={(v) => handleChange('nomeFantasia', v)} required />
              <InputField label="Razão Social" value={formData.razaoSocial} onChange={(v) => handleChange('razaoSocial', v)} />
              <InputField label="CNPJ" value={formData.cnpj} onChange={(v) => handleChange('cnpj', v)} />
              <InputField label="Inscrição Estadual" value={formData.inscricaoEstadual} onChange={(v) => handleChange('inscricaoEstadual', v)} />
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Telefone" value={formData.telefone} onChange={(v) => handleChange('telefone', v)} />
              <InputField label="Email" value={formData.email} onChange={(v) => handleChange('email', v)} type="email" />
              <InputField label="WhatsApp" value={formData.whatsapp} onChange={(v) => handleChange('whatsapp', v)} />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Logradouro" value={formData.endereco.logradouro} onChange={(v) => handleChange('endereco.logradouro', v)} className="md:col-span-2" />
              <InputField label="Número" value={formData.endereco.numero} onChange={(v) => handleChange('endereco.numero', v)} />
              <InputField label="Complemento" value={formData.endereco.complemento} onChange={(v) => handleChange('endereco.complemento', v)} />
              <InputField label="Bairro" value={formData.endereco.bairro} onChange={(v) => handleChange('endereco.bairro', v)} />
              <InputField label="CEP" value={formData.endereco.cep} onChange={(v) => handleChange('endereco.cep', v)} />
              <InputField label="Cidade" value={formData.endereco.cidade} onChange={(v) => handleChange('endereco.cidade', v)} />
              <InputField label="UF" value={formData.endereco.uf} onChange={(v) => handleChange('endereco.uf', v)} maxLength={2} />
            </div>
          </div>

          {/* Plano e Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plano e Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plano</label>
                <select
                  value={formData.plano}
                  onChange={(e) => handleChange('plano', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                >
                  <option value="basico">Básico</option>
                  <option value="profissional">Profissional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <div className="flex items-center gap-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleChange('ativo', true)}
                    className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
                      formData.ativo ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Ativa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('ativo', false)}
                    className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
                      !formData.ativo ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <XCircle className="w-4 h-4 inline mr-2" />
                    Inativa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de Input
const InputField = ({ label, value, onChange, type = 'text', required, maxLength, className = '' }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      maxLength={maxLength}
      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
    />
  </div>
);


// Modal Gerenciar Usuários
const ModalGerenciarUsuarios = ({ empresa, usuarios, loading, onClose, onToggleStatus, onToggleRole }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
                <p className="text-purple-100">{empresa.nomeFantasia} • {usuarios.length} usuário(s)</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        usuario.role === 'admin' 
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                        {usuario.role === 'admin' ? (
                          <Crown className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {usuario.nome || usuario.email?.split('@')[0] || 'Usuário'}
                          </h4>
                          {usuario.role === 'admin' && (
                            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-full">
                              Admin
                            </span>
                          )}
                          {usuario.ativo === false && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full">
                              Inativo
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{usuario.email}</p>
                        {usuario.telefone && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">{usuario.telefone}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle Role */}
                      <button
                        onClick={() => onToggleRole(usuario.id, usuario.role)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                          usuario.role === 'admin'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                        }`}
                        title={usuario.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                      >
                        <Crown className="w-4 h-4" />
                      </button>

                      {/* Toggle Status */}
                      <button
                        onClick={() => onToggleStatus(usuario.id, usuario.ativo !== false)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                          usuario.ativo !== false
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                        }`}
                        title={usuario.ativo !== false ? 'Desativar' : 'Ativar'}
                      >
                        {usuario.ativo !== false ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaaSDashboard;
