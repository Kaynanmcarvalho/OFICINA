import { motion } from 'framer-motion';
import { Car, User, Calendar, Clock } from '@/utils/icons';
import LoaderAnimado from './LoaderAnimado';

/**
 * Veículos Ativos
 * Exibe veículos atualmente em serviço
 */

const VeiculosAtivos = ({ veiculos, isLoading = false }) => {
  // Função para obter cor do status
  const getStatusColor = (status) => {
    const cores = {
      'Em Montagem': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Aguardando Peças': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Teste': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'em_servico': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'in_service': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    };
    return cores[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  // Função para calcular dias em serviço
  const calcularDiasEmServico = (dataEntrada) => {
    if (!dataEntrada) return 0;
    const dataObj = dataEntrada instanceof Date ? dataEntrada : new Date(dataEntrada);
    // Verifica se a data é válida antes de calcular
    if (isNaN(dataObj.getTime())) {
      return 0;
    }
    return Math.floor((new Date() - dataObj) / (1000 * 60 * 60 * 24));
  };

  // Função para formatar data
  const formatarData = (data) => {
    if (!data) return 'Data não disponível';
    const dataObj = data instanceof Date ? data : new Date(data);
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Função para obter cor baseada em dias em serviço
  const getCorDias = (dias) => {
    if (dias <= 3) return 'text-green-600 dark:text-green-400';
    if (dias <= 7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Veículos em Serviço
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {veiculos?.length || 0} {veiculos?.length === 1 ? 'veículo' : 'veículos'} ativos
          </p>
        </div>
      </div>

      {/* Lista de Veículos */}
      {veiculos && veiculos.length > 0 ? (
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
          {veiculos.map((veiculo, index) => {
            const diasEmServico = calcularDiasEmServico(veiculo.dataEntrada);

            return (
              <motion.div
                key={veiculo.id}
                variants={{
                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 }
                }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer group"
              >
                {/* Header do Veículo */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="px-3 py-1 bg-gray-900 dark:bg-gray-600 rounded-lg">
                        <span className="text-sm font-bold text-white tracking-wider">
                          {veiculo.placa}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(veiculo.status)}`}>
                        {veiculo.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {veiculo.marca} {veiculo.modelo}
                      {veiculo.ano && <span className="text-gray-500 dark:text-gray-400"> • {veiculo.ano}</span>}
                    </h4>
                  </div>

                  {/* Dias em Serviço */}
                  <div className="flex flex-col items-end">
                    <span className={`text-2xl font-bold ${getCorDias(diasEmServico)}`}>
                      {diasEmServico}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {diasEmServico === 1 ? 'dia' : 'dias'}
                    </span>
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div className="flex items-center gap-2 mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cliente</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {veiculo.cliente}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>Entrada: {formatarData(veiculo.dataEntrada)}</span>
                  </div>
                  
                  {/* Indicador de urgência */}
                  {diasEmServico > 7 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <Clock className="w-3 h-3 text-red-600 dark:text-red-400" />
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">
                        Urgente
                      </span>
                    </div>
                  )}
                </div>

                {/* Barra de Progresso baseada em dias */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min((diasEmServico / 10) * 100, 100)}%` 
                      }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`h-full rounded-full ${
                        diasEmServico <= 3
                          ? 'bg-green-500'
                          : diasEmServico <= 7
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
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
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Nenhum veículo em serviço
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Os veículos em manutenção aparecerão aqui
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default VeiculosAtivos;
