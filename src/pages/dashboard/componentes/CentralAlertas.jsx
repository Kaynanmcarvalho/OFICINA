import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

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

  const getIcone = (tipo) => {
    switch (tipo) {
      case 'critico':
      case 'erro':
        return AlertCircle;
      case 'aviso':
        return AlertTriangle;
      case 'info':
        return Info;
      case 'sucesso':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getCores = (tipo) => {
    switch (tipo) {
      case 'critico':
      case 'erro':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          text: 'text-red-900 dark:text-red-100'
        };
      case 'aviso':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          text: 'text-yellow-900 dark:text-yellow-100'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          text: 'text-blue-900 dark:text-blue-100'
        };
      case 'sucesso':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          text: 'text-green-900 dark:text-green-100'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          icon: 'text-gray-600 dark:text-gray-400',
          text: 'text-gray-900 dark:text-gray-100'
        };
    }
  };

  if (alertasVisiveis.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
    >
      {/* Header com Badge de Contador */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Central de Alertas
              </h3>
              {alertasNaoLidos > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold">
                  {alertasNaoLidos}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Notificações do sistema
            </p>
          </div>
        </div>

        {/* Ícone de Filtro */}
        <Filter className="w-5 h-5 text-gray-400" />
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { id: 'todos', label: 'Todos', count: alertasVisiveis.length },
          { id: 'criticos', label: 'Críticos', count: alertasVisiveis.filter(a => a.tipo === 'critico').length },
          { id: 'avisos', label: 'Avisos', count: alertasVisiveis.filter(a => a.tipo === 'aviso').length },
          { id: 'informativos', label: 'Informativos', count: alertasVisiveis.filter(a => a.tipo === 'info').length }
        ].map(filtro => (
          <button
            key={filtro.id}
            onClick={() => setFiltroAtivo(filtro.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              filtroAtivo === filtro.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filtro.label} {filtro.count > 0 && `(${filtro.count})`}
          </button>
        ))}
      </div>

      {/* Lista de Alertas */}
      <AnimatePresence mode="popLayout">
        {alertasFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-12 h-12 text-green-300 dark:text-green-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Nenhum alerta no momento
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {alertasFiltrados.map((alerta, index) => {
              const Icone = getIcone(alerta.tipo);
              const cores = getCores(alerta.tipo);

              return (
                <motion.div
                  key={alerta.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3
                  }}
                  layout
                  className={`${cores.bg} ${cores.border} border rounded-xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-all duration-300`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${cores.bg} flex items-center justify-center`}>
                    <Icone className={`w-5 h-5 ${cores.icon}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium ${cores.text} mb-1`}>
                      {alerta.titulo}
                    </h4>
                    <p className={`text-sm ${cores.text} opacity-80`}>
                      {alerta.mensagem}
                    </p>
                    {alerta.acao && (
                      <button
                        onClick={alerta.acao.onClick}
                        className={`mt-2 text-sm font-medium ${cores.icon} hover:underline`}
                      >
                        {alerta.acao.texto}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => marcarComoLido(alerta.id)}
                    className={`flex-shrink-0 ${cores.icon} hover:opacity-70 transition-opacity`}
                    aria-label="Marcar como lido"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CentralAlertas;
