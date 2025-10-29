import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

const CentralAlertas = ({ alertas = [] }) => {
  const [alertasVisiveis, setAlertasVisiveis] = useState(alertas);

  const removerAlerta = (id) => {
    setAlertasVisiveis(prev => prev.filter(a => a.id !== id));
  };

  const getIcone = (tipo) => {
    switch (tipo) {
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
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        Alertas e Notificações
      </h3>

      <AnimatePresence>
        {alertasVisiveis.map((alerta, index) => {
          const Icone = getIcone(alerta.tipo);
          const cores = getCores(alerta.tipo);

          return (
            <motion.div
              key={alerta.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
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
                onClick={() => removerAlerta(alerta.id)}
                className={`flex-shrink-0 ${cores.icon} hover:opacity-70 transition-opacity`}
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CentralAlertas;
