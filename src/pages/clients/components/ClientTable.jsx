/**
 * ClientTable - Tabela de clientes com design Apple-like
 * Tabela responsiva com hover effects e microinterações
 */

import GlassmorphismCard from './base/GlassmorphismCard';
import ClientRow from './ClientRow';
import ClientTableSkeleton from './ClientTableSkeleton';
import EmptyState from './EmptyState';

const ClientTable = ({ 
  clients = [], 
  isLoading = false,
  onEditClient,
  onToggleClientStatus,
  onViewClient,
  onViewVehicles,
}) => {

  return (
    <GlassmorphismCard className="overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto table-scrollbar">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--apple-border-light)',
            }}>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--apple-text-secondary)' }}>
                Cliente
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--apple-text-secondary)' }}>
                Contato
              </th>
              <th className="text-center px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--apple-text-secondary)' }}>
                Veículos
              </th>
              <th className="text-center px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--apple-text-secondary)' }}>
                Última Visita
              </th>
              <th className="text-center px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--apple-text-secondary)' }}>
                Total Serviços
              </th>
              <th className="text-center px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--apple-text-secondary)' }}>
                Status
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              <ClientTableSkeleton rows={5} />
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-0">
                  <EmptyState onNewClient={() => {}} />
                </td>
              </tr>
            ) : (
              clients.map((client, index) => (
                <ClientRow
                  key={client.firestoreId || client.id}
                  client={client}
                  index={index}
                  onEdit={() => onEditClient?.(client)}
                  onToggleStatus={(clientId, newStatus) => onToggleClientStatus?.(clientId, newStatus)}
                  onView={() => onViewClient?.(client)}
                  onViewVehicles={() => onViewVehicles?.(client)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassmorphismCard>
  );
};

export default ClientTable;
