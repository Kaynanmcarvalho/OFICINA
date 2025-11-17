# 💡 Exemplo de Integração - Histórico Veicular

## 🎯 Integração no ClientCard

### Passo 1: Importar Componentes

```jsx
// src/pages/clients/ClientCard.jsx
import React, { useState } from 'react';
import { VehicleHistoryBadge } from '../../components/vehicle-history/VehicleHistoryBadge';
import { VehicleHistoryModal } from '../../components/vehicle-history/VehicleHistoryModal';
```

### Passo 2: Adicionar Estado

```jsx
function ClientCard({ client }) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // ... resto do código
}
```

### Passo 3: Adicionar Badge e Modal

```jsx
return (
  <div className="client-card">
    {/* Conteúdo existente do card */}
    <div className="client-info">
      <h3>{client.nome}</h3>
      <p>{client.telefone}</p>
      
      {/* Informações do veículo */}
      {client.veiculo && (
        <div className="vehicle-info">
          <p>{client.veiculo.marca} {client.veiculo.modelo}</p>
          <p className="placa">{client.veiculo.placa}</p>
          
          {/* ADICIONAR BADGE AQUI */}
          <VehicleHistoryBadge 
            placa={client.veiculo.placa}
            onClick={() => setShowHistoryModal(true)}
          />
        </div>
      )}
    </div>

    {/* ADICIONAR MODAL AQUI */}
    {client.veiculo?.placa && (
      <VehicleHistoryModal
        placa={client.veiculo.placa}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    )}
  </div>
);
```

---

## 🎨 Exemplo Completo com Estilo

```jsx
// src/pages/clients/ClientCard.jsx
import React, { useState } from 'react';
import { Car, Phone, Mail, MapPin } from 'lucide-react';
import { VehicleHistoryBadge } from '../../components/vehicle-history/VehicleHistoryBadge';
import { VehicleHistoryModal } from '../../components/vehicle-history/VehicleHistoryModal';
import './ClientCard.css';

export function ClientCard({ client, onEdit, onDelete }) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  return (
    <div className="client-card">
      {/* Header */}
      <div className="card-header">
        <div className="client-avatar">
          {client.nome.charAt(0).toUpperCase()}
        </div>
        <div className="client-basic-info">
          <h3>{client.nome}</h3>
          <span className="client-id">#{client.id}</span>
        </div>
      </div>

      {/* Contatos */}
      <div className="card-section">
        <div className="info-row">
          <Phone size={16} />
          <span>{client.telefone}</span>
        </div>
        {client.email && (
          <div className="info-row">
            <Mail size={16} />
            <span>{client.email}</span>
          </div>
        )}
        {client.endereco && (
          <div className="info-row">
            <MapPin size={16} />
            <span>{client.endereco}</span>
          </div>
        )}
      </div>

      {/* Veículo */}
      {client.veiculo && (
        <div className="card-section vehicle-section">
          <div className="section-header">
            <Car size={16} />
            <span>Veículo</span>
          </div>
          
          <div className="vehicle-details">
            <p className="vehicle-name">
              {client.veiculo.marca} {client.veiculo.modelo}
            </p>
            <p className="vehicle-year">{client.veiculo.ano}</p>
            <p className="vehicle-placa">{client.veiculo.placa}</p>
            
            {/* Badge de Histórico */}
            <div className="vehicle-history">
              <VehicleHistoryBadge 
                placa={client.veiculo.placa}
                onClick={() => setShowHistoryModal(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="card-actions">
        <button onClick={() => onEdit(client)} className="btn-edit">
          Editar
        </button>
        <button onClick={() => onDelete(client)} className="btn-delete">
          Excluir
        </button>
      </div>

      {/* Modal de Histórico */}
      {client.veiculo?.placa && (
        <VehicleHistoryModal
          placa={client.veiculo.placa}
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}
```

---

## 🎨 CSS Adicional

```css
/* src/pages/clients/ClientCard.css */

.vehicle-section {
  background: var(--surface-secondary);
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.vehicle-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vehicle-name {
  font-weight: 600;
  color: var(--text-primary);
}

.vehicle-year {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.vehicle-placa {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-size: 1rem;
  color: var(--primary);
  margin-top: 4px;
}

.vehicle-history {
  margin-top: 12px;
}
```

---

## 🔧 Integração no ClientsPage

```jsx
// src/pages/ClientsPage.jsx
import React, { useState, useEffect } from 'react';
import { ClientCard } from './clients/ClientCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadClients();
  }, [currentUser]);

  async function loadClients() {
    try {
      const empresaId = currentUser.empresaId;
      const snapshot = await getDocs(
        collection(db, `empresas/${empresaId}/clientes`)
      );
      
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setClients(clientsData);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Carregando clientes...</div>;
  }

  return (
    <div className="clients-page">
      <div className="page-header">
        <h1>Clientes</h1>
        <button className="btn-primary">Novo Cliente</button>
      </div>

      <div className="clients-grid">
        {clients.map(client => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 🚀 Uso Direto do Hook

### Exemplo 1: Componente Customizado

```jsx
import React from 'react';
import { useVehicleHistory } from '../hooks/useVehicleHistory';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function VehicleHistoryWidget({ placa }) {
  const {
    history,
    loading,
    error,
    hasRecalls,
    hasSinistros,
    hasLeiloes,
    riskLevel,
    refreshHistory
  } = useVehicleHistory(placa);

  if (loading) {
    return (
      <div className="widget-loading">
        <Clock className="animate-spin" />
        <span>Consultando histórico...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="widget-error">
        <AlertTriangle />
        <span>Erro ao consultar histórico</span>
        <button onClick={refreshHistory}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className={`vehicle-history-widget risk-${riskLevel}`}>
      <div className="widget-header">
        <h4>Histórico do Veículo</h4>
        <button onClick={refreshHistory} className="btn-refresh">
          Atualizar
        </button>
      </div>

      <div className="widget-content">
        {/* Status Geral */}
        <div className="status-item">
          {riskLevel === 'baixo' ? (
            <CheckCircle className="text-success" />
          ) : (
            <AlertTriangle className="text-warning" />
          )}
          <span>Risco: {riskLevel.toUpperCase()}</span>
        </div>

        {/* Recalls */}
        <div className="status-item">
          <span className="label">Recalls:</span>
          <span className={hasRecalls ? 'text-warning' : 'text-success'}>
            {history?.recalls?.length || 0}
          </span>
        </div>

        {/* Leilões */}
        <div className="status-item">
          <span className="label">Leilões:</span>
          <span className={hasLeiloes ? 'text-danger' : 'text-success'}>
            {history?.leiloes?.length || 0}
          </span>
        </div>

        {/* Sinistros */}
        <div className="status-item">
          <span className="label">Sinistros:</span>
          <span className={hasSinistros ? 'text-danger' : 'text-success'}>
            {history?.sinistros?.length || 0}
          </span>
        </div>
      </div>

      {history?.lastUpdate && (
        <div className="widget-footer">
          <small>
            Atualizado: {new Date(history.lastUpdate.toDate()).toLocaleString()}
          </small>
        </div>
      )}
    </div>
  );
}
```

### Exemplo 2: Alerta Condicional

```jsx
import React from 'react';
import { useVehicleHistory } from '../hooks/useVehicleHistory';
import { AlertTriangle } from 'lucide-react';

export function VehicleAlert({ placa }) {
  const { hasAlert, alertMessage, riskLevel } = useVehicleHistory(placa);

  if (!hasAlert) {
    return null;
  }

  return (
    <div className={`alert alert-${riskLevel}`}>
      <AlertTriangle size={20} />
      <div className="alert-content">
        <strong>Atenção!</strong>
        <p>{alertMessage}</p>
      </div>
    </div>
  );
}
```

---

## 📱 Exemplo Mobile-Friendly

```jsx
import React, { useState } from 'react';
import { useVehicleHistory } from '../hooks/useVehicleHistory';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function MobileVehicleHistory({ placa }) {
  const [expanded, setExpanded] = useState(false);
  const { history, loading, riskLevel } = useVehicleHistory(placa);

  if (loading) {
    return <div className="skeleton-loader" />;
  }

  return (
    <div className="mobile-history">
      {/* Header Compacto */}
      <button 
        className="history-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`risk-indicator risk-${riskLevel}`} />
        <span>Histórico do Veículo</span>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {/* Conteúdo Expansível */}
      {expanded && (
        <div className="history-details">
          <div className="detail-row">
            <span>Recalls:</span>
            <strong>{history?.recalls?.length || 0}</strong>
          </div>
          <div className="detail-row">
            <span>Leilões:</span>
            <strong>{history?.leiloes?.length || 0}</strong>
          </div>
          <div className="detail-row">
            <span>Sinistros:</span>
            <strong>{history?.sinistros?.length || 0}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Integração em Formulários

```jsx
import React, { useEffect } from 'react';
import { useVehicleHistory } from '../hooks/useVehicleHistory';

export function VehicleForm({ formData, setFormData }) {
  const { history, loading, hasAlert } = useVehicleHistory(formData.placa);

  // Atualizar formulário com dados do histórico
  useEffect(() => {
    if (history && !loading) {
      setFormData(prev => ({
        ...prev,
        historicoVerificado: true,
        nivelRisco: history.summary?.risco,
        temRecalls: history.recalls?.length > 0,
        temSinistros: history.sinistros?.length > 0
      }));
    }
  }, [history, loading]);

  return (
    <div className="vehicle-form">
      <input
        type="text"
        placeholder="Placa"
        value={formData.placa}
        onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
      />

      {/* Alerta se houver problemas */}
      {hasAlert && (
        <div className="form-alert">
          ⚠️ Este veículo possui pendências no histórico
        </div>
      )}

      {/* Indicador de verificação */}
      {formData.historicoVerificado && (
        <div className="form-success">
          ✓ Histórico verificado
        </div>
      )}
    </div>
  );
}
```

---

## 🔔 Notificações

```jsx
import React, { useEffect } from 'react';
import { useVehicleHistory } from '../hooks/useVehicleHistory';
import { toast } from 'react-toastify';

export function VehicleHistoryNotifier({ placa }) {
  const { history, loading, hasRecalls, hasSinistros } = useVehicleHistory(placa);

  useEffect(() => {
    if (!loading && history) {
      if (hasRecalls) {
        toast.warning(`${history.recalls.length} recall(s) pendente(s) para este veículo`);
      }
      
      if (hasSinistros) {
        toast.error(`Este veículo possui histórico de sinistros`);
      }
    }
  }, [loading, history, hasRecalls, hasSinistros]);

  return null; // Componente apenas para notificações
}
```

---

## 📊 Dashboard Widget

```jsx
import React from 'react';
import { useVehicleHistory } from '../hooks/useVehicleHistory';

export function DashboardVehicleStats({ vehicles }) {
  const stats = vehicles.reduce((acc, vehicle) => {
    const { hasRecalls, hasSinistros, riskLevel } = useVehicleHistory(vehicle.placa);
    
    if (hasRecalls) acc.recalls++;
    if (hasSinistros) acc.sinistros++;
    if (riskLevel === 'alto') acc.riskAlto++;
    
    return acc;
  }, { recalls: 0, sinistros: 0, riskAlto: 0 });

  return (
    <div className="dashboard-widget">
      <h3>Alertas de Veículos</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.recalls}</span>
          <span className="stat-label">Recalls Pendentes</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.sinistros}</span>
          <span className="stat-label">Com Sinistros</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.riskAlto}</span>
          <span className="stat-label">Risco Alto</span>
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Integração

- [ ] Importar componentes no ClientCard
- [ ] Adicionar estado para modal
- [ ] Adicionar badge na seção de veículo
- [ ] Adicionar modal no final do componente
- [ ] Testar abertura/fechamento do modal
- [ ] Verificar responsividade
- [ ] Testar dark mode
- [ ] Validar com dados reais
- [ ] Adicionar tratamento de erros
- [ ] Documentar uso no README

---

**Criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Status**: ✅ Exemplos Completos
