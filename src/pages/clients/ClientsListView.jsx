/**
 * ClientsListView - Visualização em lista/tabela premium
 */

import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import ClientRow from './ClientRow';

const ClientsListView = ({ clients, onViewClient, onEditClient, onDeleteClient }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        rounded-2xl backdrop-blur-xl border
        ${isDarkMode 
          ? 'bg-gray-900/50 border-gray-800 shadow-xl' 
          : 'glass-effect shadow-sm hover:shadow-md transition-shadow duration-200'
        }
      `}
    >
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full">
          <thead>
            <tr className={`
              border-b
              ${isDarkMode 
                ? 'bg-gray-900/80 border-gray-800' 
                : 'bg-gray-50/80 border-gray-200'
              }
            `}>
              <th className={`
                px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Cliente
              </th>
              <th className={`
                px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Contato
              </th>
              <th className={`
                px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Veículos
              </th>
              <th className={`
                px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Última Visita
              </th>
              <th className={`
                px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Total Serviços
              </th>
              <th className={`
                px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Status
              </th>
              <th className={`
                px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider
                ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody className={`
            divide-y
            ${isDarkMode ? 'divide-gray-800' : 'divide-gray-200'}
          `}>
            {clients.map((client) => (
              <ClientRow
                key={client.firestoreId || client.id}
                client={client}
                onView={onViewClient}
                onEdit={onEditClient}
                onDelete={onDeleteClient}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      {clients.length > 20 && (
        <div className={`
          px-6 py-4 border-t flex items-center justify-between
          ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
        `}>
          <div className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Mostrando {clients.length} clientes
          </div>
          <div className={`text-sm ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Paginação em breve
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ClientsListView;
