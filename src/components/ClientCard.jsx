import { motion } from 'framer-motion';
import { User, Phone, Mail, Car } from 'lucide-react';

/**
 * ClientCard - Card responsivo para visualização mobile de clientes
 */
const ClientCard = ({ client, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition-all duration-200 w-full"
      style={{ maxWidth: '100%', boxSizing: 'border-box' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {client.name}
          </h3>
          {client.cpf && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              CPF: {client.cpf}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">{client.phone}</span>
        </div>
        {client.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300 truncate">{client.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">
            {client.vehicles?.length || 0} veículo(s)
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {client.lastServiceDate 
            ? `Última visita: ${new Date(client.lastServiceDate).toLocaleDateString('pt-BR')}`
            : 'Nunca visitou'
          }
        </div>
        <button 
          onClick={() => onEdit(client)}
          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        >
          Editar
        </button>
      </div>
    </motion.div>
  );
};

export default ClientCard;
