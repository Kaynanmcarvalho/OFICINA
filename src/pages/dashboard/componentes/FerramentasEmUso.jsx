import { motion } from 'framer-motion';
import { Wrench, User, MapPin, Calendar, Tag } from 'lucide-react';
import LoaderAnimado from './LoaderAnimado';

/**
 * Ferramentas em Uso
 * Exibe ferramentas atualmente em uso com efeito glassmorphism
 */

const FerramentasEmUso = ({ ferramentas, isLoading = false }) => {
  // Função para formatar data
  const formatarData = (data) => {
    if (!data) return 'Data não disponível';
    const dataObj = data instanceof Date ? data : new Date(data);
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para calcular dias desde a retirada
  const calcularDiasDesde = (data) => {
    if (!data) return null;
    const dataObj = data instanceof Date ? data : new Date(data);
    const dias = Math.floor((new Date() - dataObj) / (1000 * 60 * 60 * 24));
    if (dias === 0) return 'Hoje';
    if (dias === 1) return 'Há 1 dia';
    return `Há ${dias} dias`;
  };

  // Cores para categorias
  const getCategoriaColor = (categoria) => {
    const cores = {
      'Elétrica': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Mecânica': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Pintura': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Diagnóstico': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Outros': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return cores[categoria] || cores['Outros'];
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
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ferramentas em Uso
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {ferramentas?.length || 0} {ferramentas?.length === 1 ? 'ferramenta' : 'ferramentas'} em uso
          </p>
        </div>
      </div>

      {/* Grid de Ferramentas */}
      {ferramentas && ferramentas.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
          {ferramentas.map((ferramenta, index) => (
            <motion.div
              key={ferramenta.id}
              variants={{
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200"
            >
              {/* Header da Ferramenta */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
                    {ferramenta.nome}
                  </h4>
                  {ferramenta.codigo && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      #{ferramenta.codigo}
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getCategoriaColor(ferramenta.categoria)}`}>
                  <Tag className="w-3 h-3" />
                  {ferramenta.categoria}
                </span>
              </div>

              {/* Informações */}
              <div className="space-y-2">
                {/* Responsável */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Responsável</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {ferramenta.responsavel || 'Não atribuído'}
                    </p>
                  </div>
                </div>

                {/* Localização */}
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{ferramenta.localizacao}</span>
                </div>

                {/* Data de Retirada */}
                {ferramenta.dataRetirada && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatarData(ferramenta.dataRetirada)}</span>
                    </div>
                    <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                      {calcularDiasDesde(ferramenta.dataRetirada)}
                    </span>
                  </div>
                )}
              </div>

              {/* Indicador de Status */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                  />
                </div>
                <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                  Em uso
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Todas as ferramentas disponíveis
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Nenhuma ferramenta está em uso no momento
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default FerramentasEmUso;
