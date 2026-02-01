import React, { useState } from 'react';
import RecentRecordsSection from './RecentRecordsSection';
import { RecordItem } from './RecentItem';

/**
 * Exemplo de uso do RecentRecordsSection
 * Demonstra todas as funcionalidades principais
 */
const Example: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Dados de exemplo
  const sampleItems: RecordItem[] = [
    {
      id: '1',
      type: 'car',
      status: 'in_progress',
      primaryText: 'João Silva',
      secondaryText: 'Honda Civic 2020',
      plate: 'ABC1234',
      model: 'Civic',
      date: new Date(),
      tags: ['Urgente', 'Revisão'],
    },
    {
      id: '2',
      type: 'motorcycle',
      status: 'completed',
      primaryText: 'Maria Santos',
      secondaryText: 'Yamaha MT-07',
      plate: 'XYZ5678',
      model: 'MT-07',
      date: new Date(Date.now() - 86400000), // Ontem
      tags: ['Manutenção'],
    },
    {
      id: '3',
      type: 'truck',
      status: 'pending',
      primaryText: 'Pedro Oliveira',
      secondaryText: 'Mercedes-Benz Actros',
      plate: 'DEF9012',
      model: 'Actros',
      date: new Date(Date.now() - 172800000), // 2 dias atrás
    },
    {
      id: '4',
      type: 'van',
      status: 'in_progress',
      primaryText: 'Ana Costa',
      secondaryText: 'Fiat Ducato',
      plate: 'GHI3456',
      model: 'Ducato',
      date: new Date(Date.now() - 3600000), // 1 hora atrás
      tags: ['Express'],
    },
    {
      id: '5',
      type: 'car',
      status: 'cancelled',
      primaryText: 'Carlos Mendes',
      secondaryText: 'Toyota Corolla',
      plate: 'JKL7890',
      model: 'Corolla',
      date: new Date(Date.now() - 604800000), // 1 semana atrás
    },
  ];

  const handleItemClick = (item: RecordItem) => {
    alert(`Abrindo detalhes de: ${item.primaryText}`);
  };

  const handleItemAction = (action: string, item: RecordItem) => {
    switch (action) {
      case 'open':
        alert(`Abrindo: ${item.primaryText}`);
        break;
      case 'edit':
        alert(`Editando: ${item.primaryText}`);
        break;
      case 'more':
        alert(`Mais opções para: ${item.primaryText}`);
        break;
    }
  };

  const handleBulkAction = (action: string, items: RecordItem[]) => {
    const itemNames = items.map(i => i.primaryText).join(', ');
    
    switch (action) {
      case 'complete':
        alert(`Marcando como concluído: ${itemNames}`);
        break;
      case 'delete':
        if (confirm(`Deseja realmente excluir ${items.length} item(ns)?`)) {
          alert(`Excluindo: ${itemNames}`);
        }
        break;
    }
  };

  const handleSearch = (query: string) => {
    };

  const handleFilterChange = (filters: any) => {
    };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-0 mb-2">
            Exemplo: Recent Records Premium
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Sistema completo de registros recentes com design Apple-level
          </p>
        </div>

        <RecentRecordsSection
          items={sampleItems}
          isLoading={isLoading}
          onItemClick={handleItemClick}
          onItemAction={handleItemAction}
          onBulkAction={handleBulkAction}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          enablePreview={true}
          enableBulkActions={true}
          enableVirtualization={true}
        />

        {/* Controles de Teste */}
        <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-0">
            Controles de Teste
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setIsLoading(!isLoading)}
              className="px-4 py-2 rounded-lg bg-accent-500 text-white hover:bg-accent-600 transition-colors"
            >
              {isLoading ? 'Parar Loading' : 'Simular Loading'}
            </button>
            <button
              onClick={() => {
                const root = document.documentElement;
                root.classList.toggle('dark');
              }}
              className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
            >
              Toggle Dark Mode
            </button>
          </div>
        </div>

        {/* Informações */}
        <div className="mt-6 p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Dicas de Uso
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Clique em um item para ver os detalhes</li>
            <li>• Use o botão de filtros para refinar a busca</li>
            <li>• Selecione múltiplos itens para ações em lote</li>
            <li>• Teste o dark mode com o botão acima</li>
            <li>• Navegue com Tab e ative com Enter/Space</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Example;
