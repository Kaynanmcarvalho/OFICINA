# Exemplo de Integração - Recent Check-ins Component

## Como Integrar no CheckInPage

### Opção 1: Substituir RegistroCard Existente

```jsx
// src/pages/CheckInPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, AlertCircle } from 'lucide-react';
import ModalCheckin from './checkin/componentes/ModalCheckin';
import ModalCheckout from './checkin/componentes/ModalCheckout';
// Importar o novo componente
import { RecentCheckinsSection } from '../components/RecentCheckins';
import { useCheckinStore } from '../store';
import './checkin/estilos/checkin.css';

const CheckInPage = () => {
  const navigate = useNavigate();
  const { checkins, fetchCheckins, isLoading } = useCheckinStore();
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  const handleCheckInSuccess = async () => {
    try {
      await fetchCheckins();
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
    }
  };

  const handleCheckOutSuccess = async () => {
    try {
      await fetchCheckins();
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
    }
  };

  // Handler para seleção de check-in
  const handleSelectCheckin = (checkin) => {
    setSelectedCheckin(checkin);
    console.log('Check-in selecionado:', checkin);
  };

  // Handler para ver detalhes
  const handleViewDetails = (checkin) => {
    navigate(`/checkin/${checkin.firestoreId || checkin.id}`);
  };

  return (
    <div className="min-h-screen bg-[#0C0D11]">
      {/* Header com botões de ação */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Check-in / Check-out
            </h1>
            <p className="text-gray-400">
              Gerencie a entrada e saída de veículos
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsCheckInModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#10B981'
              }}
            >
              <LogIn size={20} />
              Novo Check-in
            </button>
            
            <button
              onClick={() => setIsCheckOutModalOpen(true)}
              disabled={!selectedCheckin}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#60A5FA'
              }}
            >
              <LogOut size={20} />
              Check-out
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Recent Check-ins Component */}
        {!isLoading && (
          <RecentCheckinsSection
            checkins={checkins}
            maxItems={10}
            onSelectCheckin={handleSelectCheckin}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>

      {/* Modals */}
      <ModalCheckin
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onSuccess={handleCheckInSuccess}
      />

      <ModalCheckout
        isOpen={isCheckOutModalOpen}
        onClose={() => setIsCheckOutModalOpen(false)}
        checkin={selectedCheckin}
        onSuccess={handleCheckOutSuccess}
      />
    </div>
  );
};

export default CheckInPage;
```

### Opção 2: Adicionar em Seção Separada

```jsx
// Manter RegistroCard existente e adicionar RecentCheckinsSection em outra seção

return (
  <div className="min-h-screen bg-[#0C0D11]">
    {/* Seção de Check-ins Ativos (RegistroCard existente) */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        Check-ins Ativos
      </h2>
      {/* Seus RegistroCard existentes */}
    </div>

    {/* Seção de Check-ins Recentes (Novo componente) */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <RecentCheckinsSection
        checkins={checkins.filter(c => c.status === 'completed')}
        maxItems={5}
        onSelectCheckin={handleSelectCheckin}
        onViewDetails={handleViewDetails}
      />
    </div>
  </div>
);
```

## Integração no Dashboard

```jsx
// src/pages/dashboard/index.jsx

import { RecentCheckinsSection } from '../../components/RecentCheckins';
import { useCheckinStore } from '../../store';

const Dashboard = () => {
  const { checkins } = useCheckinStore();

  return (
    <div className="dashboard-container">
      {/* Outros widgets do dashboard */}
      
      {/* Widget de Check-ins Recentes */}
      <div className="dashboard-widget">
        <RecentCheckinsSection
          checkins={checkins}
          maxItems={5}
          onSelectCheckin={(checkin) => {
            console.log('Checkin selecionado:', checkin);
          }}
          onViewDetails={(checkin) => {
            window.location.href = `/checkin/${checkin.id}`;
          }}
        />
      </div>
    </div>
  );
};
```

## Integração com Filtros

```jsx
import { useState } from 'react';
import { RecentCheckinsSection } from '../components/RecentCheckins';

const CheckInPageWithFilters = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const { checkins } = useCheckinStore();

  // Filtrar check-ins por status
  const filteredCheckins = checkins.filter(checkin => {
    if (statusFilter === 'all') return true;
    return checkin.status === statusFilter;
  });

  return (
    <div>
      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setStatusFilter('all')}>Todos</button>
        <button onClick={() => setStatusFilter('active')}>Ativos</button>
        <button onClick={() => setStatusFilter('completed')}>Concluídos</button>
        <button onClick={() => setStatusFilter('pending')}>Aguardando</button>
      </div>

      {/* Lista filtrada */}
      <RecentCheckinsSection
        checkins={filteredCheckins}
        maxItems={10}
        onSelectCheckin={handleSelectCheckin}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};
```

## Integração com Real-time Updates

```jsx
import { useEffect } from 'react';
import { RecentCheckinsSection } from '../components/RecentCheckins';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

const CheckInPageRealtime = () => {
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    // Listener em tempo real do Firebase
    const unsubscribe = onSnapshot(
      collection(db, 'checkins'),
      (snapshot) => {
        const updatedCheckins = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCheckins(updatedCheckins);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <RecentCheckinsSection
      checkins={checkins}
      maxItems={10}
      onSelectCheckin={handleSelectCheckin}
      onViewDetails={handleViewDetails}
    />
  );
};
```

## Customização de Estilos

```jsx
// Adicionar classes customizadas
<RecentCheckinsSection
  checkins={checkins}
  className="my-custom-class"
  maxItems={10}
  onSelectCheckin={handleSelectCheckin}
  onViewDetails={handleViewDetails}
/>

// CSS customizado
.my-custom-class {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
```

## Tratamento de Erros Customizado

```jsx
import { RecentCheckinsSection, ErrorBoundary } from '../components/RecentCheckins';

const CheckInPageWithCustomError = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="custom-error">
          <h2>Ops! Algo deu errado</h2>
          <button onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      }
    >
      <RecentCheckinsSection
        checkins={checkins}
        maxItems={10}
        onSelectCheckin={handleSelectCheckin}
        onViewDetails={handleViewDetails}
      />
    </ErrorBoundary>
  );
};
```

## Integração com Modal de Detalhes

```jsx
import { useState } from 'react';
import { RecentCheckinsSection } from '../components/RecentCheckins';
import ModalDetalhesCheckin from './componentes/ModalDetalhesCheckin';

const CheckInPageWithModal = () => {
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (checkin) => {
    setSelectedCheckin(checkin);
    setIsModalOpen(true);
  };

  return (
    <>
      <RecentCheckinsSection
        checkins={checkins}
        maxItems={10}
        onSelectCheckin={(checkin) => console.log(checkin)}
        onViewDetails={handleViewDetails}
      />

      <ModalDetalhesCheckin
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        checkin={selectedCheckin}
      />
    </>
  );
};
```

## Dicas de Integração

### 1. Performance
```jsx
// Use useCallback para handlers
const handleSelectCheckin = useCallback((checkin) => {
  setSelectedCheckin(checkin);
}, []);

const handleViewDetails = useCallback((checkin) => {
  navigate(`/checkin/${checkin.id}`);
}, [navigate]);
```

### 2. Memoização
```jsx
// Memoize checkins filtrados
const filteredCheckins = useMemo(() => {
  return checkins.filter(c => c.status === 'active');
}, [checkins]);
```

### 3. Loading State
```jsx
{isLoading ? (
  <div className="loading-skeleton">
    {/* Skeleton loader */}
  </div>
) : (
  <RecentCheckinsSection checkins={checkins} />
)}
```

### 4. Error Handling
```jsx
{error ? (
  <div className="error-message">
    {error.message}
  </div>
) : (
  <RecentCheckinsSection checkins={checkins} />
)}
```

## Testes de Integração

```jsx
// __tests__/CheckInPage.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import CheckInPage from '../CheckInPage';

test('seleciona check-in ao clicar', () => {
  render(<CheckInPage />);
  
  const card = screen.getByText('João Silva');
  fireEvent.click(card);
  
  expect(screen.getByText('Check-in Selecionado')).toBeInTheDocument();
});
```

## Conclusão

O componente RecentCheckinsSection é altamente flexível e pode ser integrado de várias formas no seu sistema. Escolha a abordagem que melhor se adequa às suas necessidades!
