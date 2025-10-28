# Design Document - Sincronização de Clientes

## Overview

Este documento descreve o design da solução para resolver a inconsistência na exibição de clientes entre a página /clients e o modal de check-in. O problema ocorre porque o sistema atualmente usa duas fontes de dados diferentes:

- **ClientsPage** usa `useClientStore` (Firebase)
- **CampoBuscaCliente** (modal de check-in) usa `clientService` (localStorage)

A solução unificará ambos os componentes para usar o Firebase como fonte única de verdade através do `useClientStore`.

## Architecture

### Current Architecture (Problema)

```
┌─────────────────┐         ┌──────────────────┐
│  ClientsPage    │────────▶│  useClientStore  │────────▶ Firebase
└─────────────────┘         └──────────────────┘

┌─────────────────────────┐         ┌──────────────────┐
│  CampoBuscaCliente      │────────▶│  clientService   │────────▶ localStorage
│  (Modal Check-in)       │         └──────────────────┘
└─────────────────────────┘
```

### Target Architecture (Solução)

```
┌─────────────────┐         ┌──────────────────┐
│  ClientsPage    │────────▶│  useClientStore  │────────▶ Firebase
└─────────────────┘         └──────────────────┘
                                      ▲
┌─────────────────────────┐          │
│  CampoBuscaCliente      │──────────┘
│  (Modal Check-in)       │
└─────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│  clientService   │────────▶│  useClientStore  │ (delegação)
└──────────────────┘         └──────────────────┘
```

## Components and Interfaces

### 1. ClientStore (Zustand + Firebase)

**Localização:** `src/store/clientStore.jsx`

**Status:** Já implementado e funcional

**Responsabilidades:**
- Gerenciar estado global de clientes
- Realizar operações CRUD no Firebase
- Fornecer métodos de busca otimizados
- Manter cache local dos clientes

**Interface Pública:**
```javascript
{
  // State
  clients: Client[],
  currentClient: Client | null,
  isLoading: boolean,
  error: string | null,
  searchResults: Client[],

  // Actions
  createClient(clientData): Promise<Result>,
  updateClient(clientId, updates): Promise<Result>,
  deleteClient(clientId): Promise<Result>,
  fetchClients(): Promise<Result>,
  getClientById(clientId): Promise<Result>,
  searchClients(searchTerm): Promise<Result>,
  clearSearchResults(): void,
}
```

### 2. ClientService (Camada de Compatibilidade)

**Localização:** `src/services/clientService.js`

**Status:** Precisa ser refatorado

**Mudanças Necessárias:**
- Remover dependência do `localDB` (localStorage)
- Delegar todas as operações para `useClientStore`
- Manter interface atual para compatibilidade com código existente
- Adicionar lógica de migração de dados do localStorage para Firebase

**Nova Interface:**
```javascript
// Mantém a mesma interface externa, mas delega para clientStore
export const createClient = async (clientData) => {
  const store = useClientStore.getState();
  return store.createClient(clientData);
};

export const searchClients = async (searchTerm) => {
  const store = useClientStore.getState();
  const result = await store.searchClients(searchTerm);
  return result.success ? result.data : [];
};

// ... outras funções seguem o mesmo padrão
```

### 3. CampoBuscaCliente

**Localização:** `src/pages/checkin/componentes/CampoBuscaCliente.jsx`

**Status:** Funcional, mas usa clientService

**Mudanças Necessárias:**
- Continuar usando `clientService` (que agora delega para clientStore)
- Nenhuma mudança necessária na interface do componente
- Beneficia-se automaticamente da migração

**Alternativa (Opcional):**
- Usar `useClientStore` diretamente para melhor performance
- Eliminar camada intermediária do clientService

### 4. ClientsPage

**Localização:** `src/pages/ClientsPage.jsx`

**Status:** Já usa clientStore corretamente

**Mudanças Necessárias:**
- Nenhuma mudança necessária
- Já está usando a arquitetura correta

## Data Models

### Client Model

```typescript
interface Client {
  // Identificadores
  firestoreId: string;        // ID do documento no Firebase
  clientId: string;           // ID legível (CLI-timestamp)
  
  // Dados pessoais
  name: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
  address?: string;
  
  // Veículos
  vehicles: Vehicle[];
  
  // Histórico
  serviceHistory: Service[];
  totalServices: number;
  lastServiceDate: string | null;
  
  // Metadados
  createdAt: string;
  updatedAt: string;
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year?: number;
  addedAt: string;
}

interface Service {
  id: string;
  date: string;
  description: string;
  value: number;
  vehicleId?: string;
}
```

### Migration Data Structure

```typescript
interface MigrationStatus {
  isComplete: boolean;
  migratedCount: number;
  failedCount: number;
  errors: string[];
  timestamp: string;
}
```

## Migration Strategy

### Fase 1: Detecção e Migração Automática

**Quando:** Na inicialização do `useClientStore`

**Processo:**
1. Verificar se existe chave `oficina_clients` no localStorage
2. Se existir, ler todos os clientes
3. Para cada cliente no localStorage:
   - Verificar se já existe no Firebase (por clientId ou dados únicos)
   - Se não existir, criar no Firebase
   - Se existir, comparar timestamps e manter o mais recente
4. Após migração bem-sucedida, marcar como concluída
5. Manter dados no localStorage por 7 dias como backup
6. Após 7 dias, limpar localStorage

**Implementação:**
```javascript
const migrateFromLocalStorage = async () => {
  const localClients = JSON.parse(localStorage.getItem('oficina_clients') || '[]');
  
  if (localClients.length === 0) return;
  
  const migrationStatus = {
    isComplete: false,
    migratedCount: 0,
    failedCount: 0,
    errors: [],
    timestamp: new Date().toISOString()
  };
  
  for (const localClient of localClients) {
    try {
      // Verificar duplicatas
      const existing = await checkExistingClient(localClient);
      
      if (!existing) {
        await createClient(localClient);
        migrationStatus.migratedCount++;
      }
    } catch (error) {
      migrationStatus.failedCount++;
      migrationStatus.errors.push(error.message);
    }
  }
  
  migrationStatus.isComplete = true;
  localStorage.setItem('migration_status', JSON.stringify(migrationStatus));
};
```

### Fase 2: Refatoração do ClientService

**Objetivo:** Fazer clientService delegar para clientStore

**Mudanças:**
1. Importar `useClientStore`
2. Usar `useClientStore.getState()` para acessar métodos
3. Adaptar formato de retorno quando necessário
4. Remover todas as chamadas para `localDB`

### Fase 3: Otimização (Opcional)

**Objetivo:** Eliminar camada intermediária

**Mudanças:**
1. Atualizar `CampoBuscaCliente` para usar `useClientStore` diretamente
2. Deprecar `clientService` gradualmente
3. Atualizar outros componentes que usam `clientService`

## Error Handling

### Cenários de Erro

1. **Falha na Migração**
   - Manter dados no localStorage
   - Registrar erro no console
   - Exibir notificação ao usuário
   - Permitir tentativa manual

2. **Falha na Busca do Firebase**
   - Retornar array vazio
   - Exibir mensagem de erro
   - Não quebrar a interface

3. **Conflito de Dados**
   - Priorizar dados do Firebase (mais recente)
   - Registrar conflito para análise
   - Notificar usuário se necessário

4. **Timeout de Rede**
   - Implementar retry com backoff exponencial
   - Máximo de 3 tentativas
   - Fallback para cache local se disponível

### Error Messages

```javascript
const ERROR_MESSAGES = {
  MIGRATION_FAILED: 'Falha ao migrar dados. Seus dados estão seguros no armazenamento local.',
  SEARCH_FAILED: 'Erro ao buscar clientes. Tente novamente.',
  CREATE_FAILED: 'Erro ao criar cliente. Verifique sua conexão.',
  NETWORK_ERROR: 'Sem conexão com o servidor. Verifique sua internet.',
};
```

## Testing Strategy

### Unit Tests

1. **ClientStore Tests**
   - Testar criação de cliente
   - Testar busca de clientes
   - Testar atualização de cliente
   - Testar remoção de duplicatas na busca

2. **ClientService Tests**
   - Testar delegação para clientStore
   - Testar compatibilidade de interface
   - Testar formato de retorno

3. **Migration Tests**
   - Testar migração de dados válidos
   - Testar detecção de duplicatas
   - Testar tratamento de erros
   - Testar limpeza do localStorage

### Integration Tests

1. **ClientsPage Integration**
   - Testar carregamento de clientes
   - Testar busca de clientes
   - Testar criação de novo cliente

2. **CampoBuscaCliente Integration**
   - Testar busca em tempo real
   - Testar seleção de cliente
   - Testar criação de novo cliente

3. **End-to-End Tests**
   - Criar cliente no modal de check-in
   - Verificar aparição na página /clients
   - Buscar cliente em ambos os locais
   - Verificar consistência dos dados

### Performance Tests

1. **Search Performance**
   - Busca deve retornar em < 2 segundos
   - Testar com 100, 1000, 10000 clientes
   - Verificar uso de índices do Firebase

2. **Migration Performance**
   - Migração de 100 clientes deve completar em < 30 segundos
   - Não bloquear interface durante migração
   - Mostrar progresso ao usuário

## Performance Considerations

### Firebase Query Optimization

1. **Índices Necessários:**
   - `name` (ascending)
   - `clientId` (ascending)
   - `phone` (ascending)
   - `cpf` (ascending)
   - `createdAt` (descending)

2. **Limites de Busca:**
   - Máximo 10 resultados por busca
   - Implementar paginação se necessário

3. **Caching:**
   - Manter clientes em memória após fetch
   - Atualizar cache em tempo real com onSnapshot
   - Invalidar cache após 5 minutos

### Network Optimization

1. **Debouncing:**
   - Busca com debounce de 300ms
   - Evitar múltiplas requisições simultâneas

2. **Lazy Loading:**
   - Carregar clientes sob demanda
   - Implementar scroll infinito na lista

## Security Considerations

### Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clients/{clientId} {
      // Permitir leitura para usuários autenticados
      allow read: if request.auth != null;
      
      // Permitir escrita para usuários autenticados
      allow create: if request.auth != null
        && request.resource.data.name is string
        && request.resource.data.phone is string;
      
      allow update: if request.auth != null
        && request.resource.data.name is string
        && request.resource.data.phone is string;
      
      // Permitir deleção apenas para admins
      allow delete: if request.auth != null
        && request.auth.token.admin == true;
    }
  }
}
```

### Data Validation

1. **Client Data:**
   - Nome: obrigatório, mínimo 3 caracteres
   - Telefone: obrigatório, formato válido
   - CPF/CNPJ: opcional, formato válido se fornecido
   - Email: opcional, formato válido se fornecido

2. **Sanitization:**
   - Remover espaços extras
   - Normalizar telefone
   - Validar CPF/CNPJ com algoritmo

## Rollback Plan

### Se a Migração Falhar

1. **Manter localStorage Intacto:**
   - Não deletar dados até confirmação de sucesso
   - Manter por 7 dias após migração

2. **Reverter ClientService:**
   - Manter código antigo comentado
   - Possibilidade de reverter com flag de feature

3. **Comunicação:**
   - Notificar usuário sobre falha
   - Fornecer instruções de recuperação
   - Oferecer suporte técnico

### Feature Flag

```javascript
const USE_FIREBASE_CLIENTS = true; // Pode ser alterado para rollback

export const searchClients = async (searchTerm) => {
  if (USE_FIREBASE_CLIENTS) {
    // Nova implementação
    const store = useClientStore.getState();
    const result = await store.searchClients(searchTerm);
    return result.success ? result.data : [];
  } else {
    // Implementação antiga (fallback)
    return await localDB.searchClients(searchTerm);
  }
};
```

## Implementation Timeline

### Fase 1: Preparação (1 dia)
- Revisar código existente
- Criar testes unitários
- Documentar casos de uso

### Fase 2: Migração (2 dias)
- Implementar lógica de migração
- Refatorar clientService
- Testar migração

### Fase 3: Integração (1 dia)
- Atualizar componentes
- Testar integração
- Corrigir bugs

### Fase 4: Validação (1 dia)
- Testes end-to-end
- Testes de performance
- Validação com usuários

### Fase 5: Deploy (1 dia)
- Deploy gradual
- Monitoramento
- Ajustes finais

**Total Estimado:** 6 dias de desenvolvimento

## Monitoring and Metrics

### Métricas a Monitorar

1. **Taxa de Sucesso da Migração:**
   - % de clientes migrados com sucesso
   - Tempo médio de migração
   - Erros durante migração

2. **Performance de Busca:**
   - Tempo médio de resposta
   - Taxa de erro
   - Número de buscas por dia

3. **Consistência de Dados:**
   - Clientes duplicados detectados
   - Conflitos de dados
   - Sincronização entre componentes

### Logging

```javascript
const logMigration = (status) => {
  console.log('[Migration]', {
    timestamp: new Date().toISOString(),
    status: status.isComplete ? 'SUCCESS' : 'FAILED',
    migrated: status.migratedCount,
    failed: status.failedCount,
    errors: status.errors
  });
};

const logSearch = (searchTerm, resultCount, duration) => {
  console.log('[Search]', {
    timestamp: new Date().toISOString(),
    term: searchTerm,
    results: resultCount,
    duration: `${duration}ms`
  });
};
```

## Future Enhancements

1. **Busca Avançada:**
   - Filtros por data de cadastro
   - Filtros por número de serviços
   - Ordenação customizada

2. **Sincronização Offline:**
   - Cache local com IndexedDB
   - Sincronização automática ao reconectar
   - Indicador de status de sincronização

3. **Importação/Exportação:**
   - Importar clientes de CSV
   - Exportar lista de clientes
   - Backup automático

4. **Analytics:**
   - Dashboard de clientes
   - Relatórios de crescimento
   - Análise de retenção
