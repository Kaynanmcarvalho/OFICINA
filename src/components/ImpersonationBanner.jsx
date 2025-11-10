/**
 * Impersonation Banner
 * 
 * Banner fixo no topo da tela quando Super Admin está em modo impersonation
 */

import { Shield, X, ArrowLeft } from 'lucide-react';
import { useEmpresa } from '../contexts/EmpresaContext';
import { stopImpersonation } from '../services/impersonationService';

const ImpersonationBanner = () => {
  const empresa = useEmpresa();

  if (!empresa?.isImpersonating) {
    return null;
  }

  const handleStopImpersonation = () => {
    const success = stopImpersonation();
    if (success) {
      // Recarregar página para voltar ao contexto original
      window.location.href = '/admin/dashboard';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 shadow-2xl animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <Shield className="w-5 h-5 text-white animate-pulse" />
              <span className="text-sm font-bold text-white">
                MODO SUPER ADMIN
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-white">
              <span className="text-sm opacity-90">
                Visualizando como:
              </span>
              <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                {empresa.nomeFantasia}
              </span>
              <span className="text-xs opacity-75 font-mono">
                ({empresa.empresaId.substring(0, 8)}...)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStopImpersonation}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold transition-all hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Voltar ao Admin</span>
              <span className="md:hidden">Voltar</span>
            </button>

            <button
              onClick={handleStopImpersonation}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Sair do modo impersonation"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Alerta Mobile */}
        <div className="md:hidden mt-2 text-xs text-white/90">
          Visualizando: <span className="font-bold">{empresa.nomeFantasia}</span>
        </div>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
