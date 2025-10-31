import { motion } from 'framer-motion';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoaderAnimado from './LoaderAnimado';

/**
 * Lista de Clientes Recentes
 * Exibe os 5 últimos clientes cadastrados com animações Apple-like
 */

const ListaClientesRecentes = ({ clientes, isLoading = false }) => {
  const navigate = useNavigate();

  // Função para gerar iniciais do nome
  const getInitials = (nome) => {
    if (!nome) return '?';
    const parts = nome.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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

  // Handler de click no cliente
  const handleClienteClick = (clienteId) => {
    // Por enquanto, navega para a página de clientes
    // TODO: Implementar página de detalhes do cliente
    navigate('/clients');
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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Clientes Recentes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Últimos cadastros
          </p>
        </div>
      </div>

      {/* Lista de Clientes */}
      {clientes && clientes.length > 0 ? (
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
          {clientes.map((cliente, index) => (
            <motion.div
              key={cliente.id}
              variants={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.02, x: 4 }}
              onClick={() => handleClienteClick(cliente.id)}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer group"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {cliente.photoURL ? (
                  <img
                    src={cliente.photoURL}
                    alt={cliente.nome}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {getInitials(cliente.nome)}
                  </div>
                )}
                {/* Badge de novo cliente (se cadastrado há menos de 7 dias) */}
                {(() => {
                  const diasDesde = Math.floor((new Date() - new Date(cliente.dataCadastro)) / (1000 * 60 * 60 * 24));
                  return diasDesde <= 7 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">N</span>
                    </div>
                  );
                })()}
              </div>

              {/* Informações */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {cliente.nome}
                  </h4>
                  {cliente.totalServicos > 0 && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium">
                      {cliente.totalServicos} {cliente.totalServicos === 1 ? 'serviço' : 'serviços'}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  {cliente.email && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{cliente.email}</span>
                    </div>
                  )}
                  {cliente.telefone && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <span>{cliente.telefone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span>Cadastrado em {formatarData(cliente.dataCadastro)}</span>
                  </div>
                </div>
              </div>

              {/* Indicador de hover */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Nenhum cliente cadastrado
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Os novos clientes aparecerão aqui
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ListaClientesRecentes;
