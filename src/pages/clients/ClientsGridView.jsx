/**
 * ClientsGridView - Visualização em grade premium
 */

import { motion } from 'framer-motion';
import ClientCard from './ClientCard';

const ClientsGridView = ({ clients, onViewClient, onEditClient, onDeleteClient }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
    >
      {clients.map((client, index) => (
        <motion.div
          key={client.firestoreId || client.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ClientCard
            client={client}
            onView={onViewClient}
            onEdit={onEditClient}
            onDelete={onDeleteClient}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ClientsGridView;
