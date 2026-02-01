/**
 * PermissionGuard - Controle de Acesso Baseado em Permissões
 * 
 * Componente para controlar exibição baseado em role ou permissões específicas
 * Integrado com EmpresaContext
 */

import { useEmpresa } from '../contexts/EmpresaContext';

/**
 * PermissionGuard Component
 * 
 * @param {Object} props
 * @param {string} props.requiredRole - Role necessária (admin, atendente, financeiro)
 * @param {string} props.requiredPermission - Permissão específica necessária
 * @param {React.ReactNode} props.children - Conteúdo a exibir se autorizado
 * @param {React.ReactNode} props.fallback - Conteúdo a exibir se não autorizado
 * @param {boolean} props.showFallback - Se deve mostrar fallback ou null
 */
export const PermissionGuard = ({
  requiredRole,
  requiredPermission,
  children,
  fallback = null,
  showFallback = true
}) => {
  const empresaData = useEmpresa();

  // Se não há empresa carregada, não mostrar nada
  if (!empresaData) {
    return showFallback ? fallback : null;
  }

  const { role, permissoes } = empresaData;

  /**
   * Verifica se usuário tem permissão
   */
  const hasPermission = () => {
    // Admin sempre tem acesso total
    if (role === 'admin') {
      return true;
    }

    // Verificar role específica
    if (requiredRole) {
      return role === requiredRole;
    }

    // Verificar permissão específica
    if (requiredPermission) {
      return permissoes && permissoes.includes(requiredPermission);
    }

    // Se não especificou nada, permitir
    return true;
  };

  const authorized = hasPermission();

  if (authorized) {
    return <>{children}</>;
  }

  return showFallback ? <>{fallback}</> : null;
};

/**
 * Hook para verificar permissões
 * @returns {Object} Funções de verificação de permissão
 */
export const usePermissions = () => {
  const empresaData = useEmpresa();

  const hasRole = (requiredRole) => {
    if (!empresaData) return false;
    
    const { role } = empresaData;
    
    // Admin sempre tem acesso
    if (role === 'admin') return true;
    
    return role === requiredRole;
  };

  const hasPermission = (requiredPermission) => {
    if (!empresaData) return false;
    
    const { role, permissoes } = empresaData;
    
    // Admin sempre tem acesso
    if (role === 'admin') return true;
    
    return permissoes && permissoes.includes(requiredPermission);
  };

  const isAdmin = () => {
    if (!empresaData) return false;
    return empresaData.role === 'admin';
  };

  const isAtendente = () => {
    if (!empresaData) return false;
    return empresaData.role === 'atendente' || empresaData.role === 'admin';
  };

  const isFinanceiro = () => {
    if (!empresaData) return false;
    return empresaData.role === 'financeiro' || empresaData.role === 'admin';
  };

  return {
    hasRole,
    hasPermission,
    isAdmin,
    isAtendente,
    isFinanceiro,
    role: empresaData?.role,
    permissoes: empresaData?.permissoes || []
  };
};

/**
 * HOC para proteger rotas
 */
export const withPermission = (Component, requiredRole, requiredPermission) => {
  return (props) => (
    <PermissionGuard
      requiredRole={requiredRole}
      requiredPermission={requiredPermission}
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">🔒</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Acesso Negado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Você não tem permissão para acessar esta página.
            </p>
          </div>
        </div>
      }
    >
      <Component {...props} />
    </PermissionGuard>
  );
};

export default PermissionGuard;
