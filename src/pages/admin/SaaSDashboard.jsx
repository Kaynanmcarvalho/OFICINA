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
  UserCog
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { startImpersonation } from '../../services/impersonationService';
import { useEmpresa } from '../../contexts/EmpresaContext';

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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Carregar todas as empresas
      const empresasSnapshot = await getDocs(
        query(collection(db, 'empresas'), orderBy('dataCriacao', 'desc'))
      );

      const empresasData = empresasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setEmpresas(empresasData);

      // Calcular estatísticas
      const totalEmpresas = empresasData.length;
      const empresasAtivas = empresasData.filter(e => e.ativo !== false).length;
      const empresasInativas = totalEmpresas - empresasAtivas;

      // Contar usuários totais
      let totalUsuarios = 0;
      for (const empresa of empresasData) {
        const usuariosSnapshot = await getDocs(
          collection(db, `empresas/${empresa.id}/usuarios`)
        );
        totalUsuarios += usuariosSnapshot.size;
      }

      // Contar clientes totais
      let totalClientes = 0;
      for (const empresa of empresasData) {
        const clientesSnapshot = await getDocs(
          collection(db, `empresas/${empresa.id}/clientes`)
        );
        totalClientes += clientesSnapshot.size;
      }

      // Contar cache de placas
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
      // Recarregar página para aplicar novo contexto
      window.location.href = '/dashboard';
    }
  };

  const filteredEmpresas = empresas.filter(empresa => {
    const matchesSearch = empresa.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa.cnpj?.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && empresa.ativo !== false) ||
                         (filterStatus === 'inactive' && empresa.ativo === false);

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

        {/* Alerta de Super Admin */}
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
        <StatCard
          icon={Building2}
          title="Total de Empresas"
          value={stats.totalEmpresas}
          subtitle={`${stats.empresasAtivas} ativas, ${stats.empresasInativas} inativas`}
          color="orange"
        />
        <StatCard
          icon={Users}
          title="Total de Usuários"
          value={stats.totalUsuarios}
          subtitle="Em todas as empresas"
          color="blue"
        />
        <StatCard
          icon={Database}
          title="Total de Clientes"
          value={stats.totalClientes}
          subtitle="Cadastrados no sistema"
          color="green"
        />
        <StatCard
          icon={Activity}
          title="Cache de Placas"
          value={stats.cachePlacas}
          subtitle="Placas consultadas (global)"
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          title="Taxa de Ativação"
          value={`${Math.round((stats.empresasAtivas / stats.totalEmpresas) * 100)}%`}
          subtitle="Empresas ativas"
          color="emerald"
        />
        <StatCard
          icon={Shield}
          title="Isolamento"
          value="100%"
          subtitle="Dados completamente isolados"
          color="cyan"
        />
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
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-3 rounded-xl font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-3 rounded-xl font-semibold transition-all ${
              filterStatus === 'active'
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Ativas
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-4 py-3 rounded-xl font-semibold transition-all ${
              filterStatus === 'inactive'
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Inativas
          </button>
        </div>
      </div>

      {/* Lista de Empresas */}
      <div className="space-y-4">
        {filteredEmpresas.map((empresaItem) => (
          <EmpresaCard 
            key={empresaItem.id} 
            empresa={empresaItem}
            onImpersonate={(empresaId) => handleImpersonate(empresaId)}
          />
        ))}

        {filteredEmpresas.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Nenhuma empresa encontrada
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Card de Estatística
const StatCard = ({ icon: Icon, title, value, subtitle, color }) => {
  const IconComponent = Icon;
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
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        {subtitle}
      </p>
    </div>
  );
};

// Componente de Card de Empresa
const EmpresaCard = ({ empresa, onImpersonate }) => {
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
                <p className="font-semibold text-gray-900 dark:text-white">
                  {empresa.cnpj || 'Não informado'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Plano</p>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">
                  {empresa.plano || 'Básico'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Slug</p>
                <p className="font-semibold text-gray-900 dark:text-white font-mono text-xs">
                  {empresa.slug || 'Não definido'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">ID</p>
                <p className="font-semibold text-gray-900 dark:text-white font-mono text-xs">
                  {empresa.id.substring(0, 8)}...
                </p>
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
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10">
              <button 
                onClick={handleImpersonate}
                disabled={isImpersonating || empresa.ativo === false}
                className="w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImpersonating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
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
              
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4" />
                Visualizar Detalhes
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm">
                <Edit className="w-4 h-4" />
                Editar Empresa
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm">
                <UserCog className="w-4 h-4" />
                Gerenciar Usuários
              </button>
              
              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
              
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <Trash2 className="w-4 h-4" />
                Desativar Empresa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaaSDashboard;
