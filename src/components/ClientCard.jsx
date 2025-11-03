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
      className="rounded-xl p-4 shadow hover:shadow-lg transition-all duration-200 w-full apple-glass-card"
      style={{ maxWidth: '100%', boxSizing: 'border-box' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'var(--apple-accent-blue)',
            opacity: 0.1,
          }}
        >
          <User 
            className="w-6 h-6" 
            style={{ color: 'var(--apple-accent-blue)' }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold truncate"
            style={{ color: 'var(--apple-text-primary)' }}
          >
            {client.name}
          </h3>
          {client.cpf && (
            <p 
              className="text-sm truncate"
              style={{ color: 'var(--apple-text-tertiary)' }}
            >
              CPF: {client.cpf}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2">
          <Phone 
            className="w-4 h-4 flex-shrink-0" 
            style={{ color: 'var(--apple-text-quaternary)' }}
          />
          <span style={{ color: 'var(--apple-text-secondary)' }}>{client.phone}</span>
        </div>
        {client.email && (
          <div className="flex items-center gap-2">
            <Mail 
              className="w-4 h-4 flex-shrink-0" 
              style={{ color: 'var(--apple-text-quaternary)' }}
            />
            <span 
              className="truncate"
              style={{ color: 'var(--apple-text-secondary)' }}
            >
              {client.email}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Car 
            className="w-4 h-4 flex-shrink-0" 
            style={{ color: 'var(--apple-text-quaternary)' }}
          />
          <span style={{ color: 'var(--apple-text-secondary)' }}>
            {client.vehicles?.length || 0} veículo(s)
          </span>
        </div>
      </div>

      <div 
        className="flex items-center justify-between pt-3 border-t"
        style={{ borderColor: 'var(--apple-border-light)' }}
      >
        <div 
          className="text-xs"
          style={{ color: 'var(--apple-text-tertiary)' }}
        >
          {client.lastServiceDate 
            ? `Última visita: ${new Date(client.lastServiceDate).toLocaleDateString('pt-BR')}`
            : 'Nunca visitou'
          }
        </div>
        <button 
          onClick={() => onEdit(client)}
          className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
          style={{ color: 'var(--apple-accent-blue)' }}
        >
          Editar
        </button>
      </div>
    </motion.div>
  );
};

export default ClientCard;
