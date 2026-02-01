import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import AlertCardPremium from './AlertCardPremium';

const CentralAlertas = ({ alertas = [] }) => {
  const [alertasVisiveis, setAlertasVisiveis] = useState(alertas);
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [alertasLidos, setAlertasLidos] = useState(() => {
    const lidos = localStorage.getItem('alertasLidos');
    return lidos ? JSON.parse(lidos) : [];
  });

  // Atualizar alertas quando prop mudar
  useEffect(() => {
    setAlertasVisiveis(alertas);
  }, [alertas]);

  // Marcar como lido e remover
  const marcarComoLido = (id) => {
    const novosLidos = [...alertasLidos, id];
    setAlertasLidos(novosLidos);
    localStorage.setItem('alertasLidos', JSON.stringify(novosLidos));
    setAlertasVisiveis(prev => prev.filter(a => a.id !== id));
  };

  // Filtrar alertas
  const alertasFiltrados = alertasVisiveis.filter(alerta => {
    if (filtroAtivo === 'todos') return true;
    if (filtroAtivo === 'criticos') return alerta.tipo === 'critico';
    if (filtroAtivo === 'avisos') return alerta.tipo === 'aviso';
    if (filtroAtivo === 'informativos') return alerta.tipo === 'info';
    return true;
  });

  // Contar alertas não lidos
  const alertasNaoLidos = alertasVisiveis.filter(a => !alertasLidos.includes(a.id)).length;

  // Removidas funções getIcone e getCores - agora no AlertCardPremium

  if (alertasVisiveis.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/40 shadow-sm"
    >
      {/* Header Premium - Minimalista e elegante */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Ícone discreto */}
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Alertas
              </h3>
              {alertasNaoLidos > 0 && (
                <span className="px-2 py-0.5 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium border border-red-500/20">
                  {alertasNaoLidos}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              Notificações do sistema
            </p>
          </div>
        </div>

        {/* Ícone de Filtro - Discreto */}
        <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Filtros Premium - Pills discretos */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'todos', label: 'Todos', count: alertasVisiveis.length },
          { id: 'criticos', label: 'Críticos', count: alertasVisiveis.filter(a => a.tipo === 'critico').length },
          { id: 'avisos', label: 'Avisos', count: alertasVisiveis.filter(a => a.tipo === 'aviso').length },
          { id: 'informativos', label: 'Informativos', count: alertasVisiveis.filter(a => a.tipo === 'info').length }
        ].map(filtro => (
          <button
            key={filtro.id}
            onClick={() => setFiltroAtivo(filtro.id)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap
              ${filtroAtivo === filtro.id
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 border border-transparent hover:border-gray-300 dark:hover:border-gray-700'
              }
            `}
          >
            {filtro.label}
            {filtro.count > 0 && (
              <span className={`ml-1.5 ${filtroAtivo === filtro.id ? 'opacity-70' : 'opacity-50'}`}>
                {filtro.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de Alertas - Design Premium Apple-like */}
      <AnimatePresence mode="popLayout">
        {alertasFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Tudo em ordem
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Nenhum alerta no momento
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {alertasFiltrados.map((alerta, index) => (
              <AlertCardPremium
                key={alerta.id}
                alerta={alerta}
                onDismiss={marcarComoLido}
                index={index}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CentralAlertas;
