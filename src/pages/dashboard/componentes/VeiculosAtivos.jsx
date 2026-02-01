import { motion, AnimatePresence } from 'framer-motion';
import { Car, User, Calendar, Clock, ChevronUp, ChevronDown } from '@/utils/icons';
import LoaderAnimado from './LoaderAnimado';
import { useState, useEffect } from 'react';

/**
 * Veículos Ativos
 * Exibe veículos cadastrados no sistema com carrossel vertical
 */

const VeiculosAtivos = ({ veiculos, isLoading = false }) => {
  const ITEMS_PER_PAGE = 3; // Número de veículos por página
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const totalPages = Math.ceil((veiculos?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = veiculos?.slice(startIndex, endIndex) || [];

  // Auto-play do carrossel
  useEffect(() => {
    if (!isAutoPlaying || totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalPages]);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setIsAutoPlaying(false);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setIsAutoPlaying(false);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    setIsAutoPlaying(false);
  };
  // Função para obter cor do status
  const getStatusColor = (status) => {
    const cores = {
      'Em Montagem': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Aguardando Peças': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Teste': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'em_servico': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'in_service': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Cadastrado': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
      style={{ height: '600px' }} // Altura fixa para o card
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Veículos Cadastrados
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {veiculos?.length || 0} {veiculos?.length === 1 ? 'veículo' : 'veículos'} no sistema
            </p>
          </div>
        </div>

        {/* Controles de Navegação */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Página anterior"
            >
              <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={nextPage}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Próxima página"
            >
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* Lista de Veículos com AnimatePresence */}
      <div className="flex-1 overflow-hidden relative">
        {veiculos && veiculos.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {currentVehicles.map((veiculo, index) => {
            const diasEmServico = calcularDiasEmServico(veiculo.dataEntrada);

            return (
              <motion.div
                key={veiculo.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
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
      </AnimatePresence>
    ) : (
      // Empty State
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
          <Car className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Nenhum veículo cadastrado
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Os veículos dos clientes aparecerão aqui
        </p>
      </div>
    )}
  </div>

  {/* Indicadores de Página */}
  {totalPages > 1 && (
    <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => goToPage(index)}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === currentPage
              ? 'w-8 bg-purple-500'
              : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-purple-300'
          }`}
          aria-label={`Ir para página ${index + 1}`}
        />
      ))}
      
      {/* Indicador de Auto-play */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className={`ml-2 p-1.5 rounded-lg transition-colors ${
          isAutoPlaying
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
        }`}
        title={isAutoPlaying ? 'Pausar rotação automática' : 'Ativar rotação automática'}
      >
        <svg
          className="w-3 h-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {isAutoPlaying ? (
            <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
          ) : (
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          )}
        </svg>
      </button>
    </div>
  )}
</motion.div>
  );
};

export default VeiculosAtivos;
