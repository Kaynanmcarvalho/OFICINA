import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, X, Package } from 'lucide-react';
import LoaderAnimado from './LoaderAnimado';

/**
 * Estoque Crítico
 * Exibe produtos com estoque baixo ou esgotado
 */

const EstoqueCritico = ({ produtos, isLoading = false }) => {
  // Função para obter badge de status
  const getStatusBadge = (status) => {
    if (status === 'esgotado') {
      return {
        icon: X,
        label: 'Esgotado',
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      };
    }
    return {
      icon: AlertCircle,
      label: 'Baixo',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
  };

  // Função para formatar preço
  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <LoaderAnimado tipo="list" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Estoque Crítico
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Produtos que precisam de reposição
          </p>
        </div>
      </div>

      {/* Lista de Produtos */}
      {produtos && produtos.length > 0 ? (
        <motion.div
          className="space-y-3"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="initial"
          animate="animate"
        >
          {produtos.map((produto, index) => {
            const statusBadge = getStatusBadge(produto.status);
            const StatusIcon = statusBadge.icon;

            return (
              <motion.div
                key={produto.id}
                variants={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-l-4 border-transparent hover:border-red-500 dark:hover:border-red-400 transition-all duration-200"
                style={{
                  borderLeftColor: produto.status === 'esgotado' ? '#ef4444' : '#f59e0b'
                }}
              >
                {/* Header do Produto */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {produto.nome}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.label}
                      </span>
                    </div>
                    {produto.codigo && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Código: {produto.codigo}
                      </p>
                    )}
                  </div>
                </div>

                {/* Informações do Produto */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Quantidade */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Quantidade Atual
                    </p>
                    <p className={`text-lg font-bold ${
                      produto.quantidade === 0 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {produto.quantidade}
                    </p>
                  </div>

                  {/* Mínimo */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Quantidade Mínima
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {produto.minimo}
                    </p>
                  </div>
                </div>

                {/* Footer do Produto */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {produto.categoria}
                    </span>
                  </div>
                  {produto.preco > 0 && (
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {formatarPreco(produto.preco)}
                    </span>
                  )}
                </div>

                {/* Barra de Progresso */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min((produto.quantidade / produto.minimo) * 100, 100)}%` 
                      }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`h-full rounded-full ${
                        produto.quantidade === 0
                          ? 'bg-red-500'
                          : produto.quantidade <= produto.minimo
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Estoque em níveis adequados
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Todos os produtos estão com estoque suficiente
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default EstoqueCritico;
