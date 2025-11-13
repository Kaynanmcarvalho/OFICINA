/**
 * TableTest - Teste dos componentes da tabela
 * Valida ClientTable, ClientRow, ClientAvatar, EmptyState e Skeleton
 */

import { useState } from 'react';
import ClientTable from '../components/ClientTable';
import ClientAvatar from '../components/ClientAvatar';
import EmptyState from '../components/EmptyState';
import AppleButton from '../components/base/AppleButton';

// Dados mock para teste
const mockClients = [
  {
    id: 1,
    firestoreId: '1',
    name: 'João Silva',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    email: 'joao@email.com',
    vehicles: [{ id: 1 }, { id: 2 }],
    lastServiceDate: new Date('2024-01-15'),
    totalServices: 5
  },
  {
    id: 2,
    firestoreId: '2',
    name: 'Maria Santos',
    cpf: '987.654.321-00',
    phone: '(11) 87654-3210',
    email: 'maria@empresa.com',
    vehicles: [{ id: 3 }],
    lastServiceDate: new Date('2024-01-10'),
    totalServices: 12
  },
  {
    id: 3,
    firestoreId: '3',
    name: 'Pedro Oliveira',
    cpf: '456.789.123-00',
    phone: '(11) 76543-2109',
    email: 'pedro@email.com',
    vehicles: [],
    lastServiceDate: null,
    totalServices: 0
  }
];

const TableTest = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState(mockClients);
  const [showEmpty, setShowEmpty] = useState(false);

  const handleEdit = (client) => {
    alert(`Editar: ${client.name}`);
  };

  const handleDelete = (client) => {
    if (confirm(`Excluir ${client.name}?`)) {
      setClients(clients.filter(c => c.id !== client.id));
    }
  };

  const handleNewClient = () => {
    alert('Novo cliente!');
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-8 space-y-8" style={{ background: 'var(--apple-bg-primary)', minHeight: '100vh' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--apple-text-primary)' }}>
          Teste da Tabela de Clientes
        </h1>
        <p className="mb-8" style={{ color: 'var(--apple-text-secondary)' }}>
          Teste todos os componentes: ClientTable, ClientRow, ClientAvatar, EmptyState e Skeleton
        </p>
      </div>

      {/* Controles de Teste */}
      <div className="flex flex-wrap gap-4 justify-center">
        <AppleButton onClick={simulateLoading}>
          Simular Loading
        </AppleButton>
        <AppleButton 
          variant="secondary"
          onClick={() => setShowEmpty(!showEmpty)}
        >
          {showEmpty ? 'Mostrar Clientes' : 'Mostrar Empty State'}
        </AppleButton>
        <AppleButton 
          onClick={() => setClients(mockClients)}
        >
          Resetar Dados
        </AppleButton>
      </div>

      {/* Teste dos Avatares */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--apple-bg-secondary)' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--apple-text-primary)' }}>
          ClientAvatar - Diferentes tamanhos
        </h2>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <ClientAvatar name="João Silva" size="sm" />
            <p className="text-sm mt-2" style={{ color: 'var(--apple-text-secondary)' }}>Small</p>
          </div>
          <div className="text-center">
            <ClientAvatar name="Maria Santos" size="md" />
            <p className="text-sm mt-2" style={{ color: 'var(--apple-text-secondary)' }}>Medium</p>
          </div>
          <div className="text-center">
            <ClientAvatar name="Pedro Oliveira" size="lg" />
            <p className="text-sm mt-2" style={{ color: 'var(--apple-text-secondary)' }}>Large</p>
          </div>
          <div className="text-center">
            <ClientAvatar name="" size="md" />
            <p className="text-sm mt-2" style={{ color: 'var(--apple-text-secondary)' }}>Sem nome</p>
          </div>
        </div>
      </div>

      {/* Tabela Principal */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--apple-text-primary)' }}>
          ClientTable - Tabela completa
        </h2>
        {showEmpty ? (
          <div className="p-6 rounded-2xl" style={{ background: 'var(--apple-bg-secondary)' }}>
            <EmptyState onNewClient={handleNewClient} />
          </div>
        ) : (
          <ClientTable
            clients={clients}
            isLoading={loading}
            onEditClient={handleEdit}
            onDeleteClient={handleDelete}
          />
        )}
      </div>

      {/* Instruções */}
      <div className="p-6 rounded-2xl" style={{ 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
        border: '1px solid var(--apple-border-light)'
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--apple-text-primary)' }}>
          🧪 Como testar:
        </h3>
        <ul className="space-y-1 text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
          <li>• Clique em "Simular Loading" para ver o skeleton</li>
          <li>• Clique em "Mostrar Empty State" para ver o estado vazio</li>
          <li>• Hover nas linhas da tabela para ver os efeitos</li>
          <li>• Clique nos botões de ação (Editar, Excluir)</li>
          <li>• Teste em modo claro e escuro</li>
          <li>• Redimensione a tela para testar responsividade</li>
        </ul>
      </div>
    </div>
  );
};

export default TableTest;
