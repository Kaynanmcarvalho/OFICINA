# ✅ Fase 1: Timeline Dinâmica - Estrutura Base Implementada

## 🎯 Objetivo da Fase 1

Criar a estrutura base para suportar fluxos de trabalho dinâmicos na timeline, permitindo que a ordem das etapas se adapte ao contexto (Check-in primeiro vs Orçamento primeiro).

---

## ✅ O Que Foi Implementado

### 1. Utilitários de Workflow (`workflowHelpers.js`)

**Arquivo:** `src/pages/checkin/utils/workflowHelpers.js`

**Funcionalidades:**

#### Constantes e Tipos
- `WORKFLOW_TYPES`: Define os tipos de fluxo
  - `CHECKIN_FIRST`: Veículo entra primeiro
  - `BUDGET_FIRST`: Orçamento criado primeiro
  
- `BUDGET_STATUS`: Status do orçamento
  - `PENDING`: Aguardando aprovação
  - `APPROVED_TOTAL`: Aprovado totalmente
  - `APPROVED_PARTIAL`: Aprovado parcialmente
  - `REJECTED_TOTAL`: Recusado totalmente
  - `EXPIRED`: Expirado (48h)

#### Funções Principais

**`determineWorkflowType(checkinId)`**
- Determina qual fluxo usar baseado na presença de checkinId
- Retorna: `'checkin-first'` ou `'budget-first'`

**`getStageOrder(workflowType)`**
- Retorna array com ordem das etapas para o fluxo
- Check-in First: `['checkin', 'diagnostico', 'orcamento', 'execucao', 'finalizacao', 'checkout']`
- Budget First: `['orcamento', 'checkin', 'diagnostico', 'execucao', 'finalizacao', 'checkout']`

**`getStageDefinitions(workflowType)`**
- Retorna definições completas (id, label, description) para cada etapa

**`getStageVisualStatus(stageData)`**
- Analisa dados da etapa e retorna status visual
- Retorna: `{ type, icon, color }`
- Tipos: `'completed'`, `'pending'`, `'skipped'`, `'rejected'`, `'expired'`, etc.

**`calculateProgress(currentStage, stageOrder)`**
- Calcula progresso baseado na etapa atual e ordem personalizada
- Retorna: porcentagem (0-100)

**`isBudgetExpired(expiresAt)`**
- Verifica se orçamento expirou
- Retorna: boolean

**`getTimeUntilExpiration(expiresAt)`**
- Calcula tempo restante até expiração
- Retorna: `{ hours, minutes, expired }`

**`formatTimeUntilExpiration(expiresAt)`**
- Formata tempo restante para exibição
- Retorna: string formatada ("2 dias", "5h 30m", "Expirado")

**`getNextStage(currentStage, stageOrder)`**
- Obtém próxima etapa na sequência
- Retorna: ID da próxima etapa ou null

**`getPreviousStage(currentStage, stageOrder)`**
- Obtém etapa anterior na sequência
- Retorna: ID da etapa anterior ou null

**`canAdvanceToNextStage(currentStage, stages)`**
- Valida se pode avançar para próxima etapa
- Verifica aprovação de orçamento, conclusão de etapa, etc.
- Retorna: `{ canAdvance: boolean, reason: string }`

---

### 2. Serviço de Timeline Atualizado (`timelineService.js`)

**Arquivo:** `src/pages/checkin/services/timelineService.js`

**Já Implementado:**

#### Funções de Gerenciamento de Orçamento

**`onBudgetCreated(checkinId, budgetId)`**
- Atualiza timeline quando orçamento é criado
- Define etapa atual como 'orcamento'
- Configura expiração (48h)
- Status: 'pending'

**`onBudgetApproved(checkinId, budgetId, approvalType, approvedItems)`**
- Atualiza timeline quando orçamento é aprovado
- Avança para etapa 'execucao'
- Suporta aprovação total ou parcial
- Registra itens aprovados (se parcial)

**`onBudgetRejected(checkinId, budgetId, rejectionReason)`**
- Atualiza timeline quando orçamento é recusado
- Pula para etapa 'checkout'
- Marca etapas intermediárias como 'skipped'
- Adiciona ícone ❌ vermelho

**`onBudgetExpired(checkinId, budgetId)`**
- Atualiza timeline quando orçamento expira
- Mesmo comportamento que rejeição
- Marca como 'expired' com ícone ⏰

#### Funções Auxiliares

**`determineWorkflowType(checkinId, budgetId)`**
- Determina tipo de fluxo
- Integrado com workflowHelpers

**`getStageOrder(workflowType)`**
- Retorna ordem das etapas
- Integrado com workflowHelpers

**`updateStage(checkinId, stageId, data)`**
- Atualiza uma etapa específica
- Valida progressão (não permite retroceder)

**`addStageNote(checkinId, stageId, note)`**
- Adiciona nota a uma etapa

**`calculateProgress(currentStage)`**
- Calcula progresso (compatibilidade)

**`getStageStatus(currentStage, targetStage)`**
- Retorna status de uma etapa ('completed', 'current', 'pending')

---

### 3. Hook Atualizado (`useVehicleTimeline.js`)

**Arquivo:** `src/pages/checkin/hooks/useVehicleTimeline.js`

**Já Implementado:**

#### Estado Gerenciado
```javascript
{
  timeline,        // Dados completos do check-in
  currentStage,    // Etapa atual
  progress,        // Progresso em %
  loading,         // Estado de carregamento
  error,           // Erros
  stageOrder,      // Ordem das etapas (dinâmica!)
  updateStage,     // Função para atualizar etapa
  addStageNote     // Função para adicionar nota
}
```

#### Funcionalidades

- **Escuta em Tempo Real**: Usa `onSnapshot` para atualizar automaticamente
- **Ordem Dinâmica**: Lê `stageOrder` do documento ou determina baseado em `workflowType`
- **Logs de Debug**: Console logs para rastreamento
- **Tratamento de Erros**: Captura e expõe erros

---

## 📊 Estrutura de Dados no Firebase

### Check-in com Timeline Dinâmica

```javascript
{
  id: "CHK-123",
  firestoreId: "abc123",
  
  // Tipo de fluxo
  workflowType: "checkin-first" | "budget-first",
  
  // Ordem personalizada das etapas
  stageOrder: [
    "checkin",
    "diagnostico",
    "orcamento",
    "execucao",
    "finalizacao",
    "checkout"
  ],
  
  // Etapa atual
  currentStage: "orcamento",
  
  // Referência ao orçamento
  budgetId: "BDG-456",
  budgetStatus: "pending",
  
  // Dados de cada etapa
  stages: {
    checkin: {
      completed: true,
      timestamp: Timestamp,
      userId: "user123",
      userName: "Maria"
    },
    diagnostico: {
      completed: true,
      timestamp: Timestamp,
      userId: "user456",
      userName: "João"
    },
    orcamento: {
      completed: false,
      status: "pending",
      timestamp: Timestamp,
      budgetId: "BDG-456",
      expiresAt: Timestamp,
      approvedAt: null,
      rejectedAt: null,
      approvalType: null,
      userId: "user789",
      userName: "Carlos"
    },
    execucao: {
      completed: false,
      skipped: false
    },
    finalizacao: {
      completed: false,
      skipped: false
    },
    checkout: {
      completed: false
    }
  },
  
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🎨 Fluxos Suportados

### Fluxo 1: Check-in Primeiro (Normal)

```
1. Check-in (veículo entra)
2. Diagnóstico (análise técnica)
3. Orçamento (criação e aprovação)
   ├─ Aprovado → 4. Execução
   ├─ Recusado → 6. Check-out (❌)
   └─ Expirado → 6. Check-out (⏰)
4. Execução (serviços)
5. Finalização (qualidade)
6. Check-out (entrega)
```

### Fluxo 2: Orçamento Primeiro (Invertido)

```
1. Orçamento (criação e aprovação)
   ├─ Aprovado → 2. Check-in
   └─ Recusado → Arquivado
2. Check-in (veículo entra)
3. Diagnóstico (análise técnica)
4. Execução (serviços)
5. Finalização (qualidade)
6. Check-out (entrega)
```

---

## 🔧 Como Usar

### 1. Criar Check-in com Workflow Type

```javascript
import { WORKFLOW_TYPES } from './utils/workflowHelpers';

const checkinData = {
  clientName: "João Silva",
  vehiclePlate: "ABC-1234",
  workflowType: WORKFLOW_TYPES.CHECKIN_FIRST,
  currentStage: 'checkin',
  stages: {
    checkin: {
      completed: true,
      timestamp: new Date(),
      userId: 'user123',
      userName: 'Maria'
    }
  }
};
```

### 2. Usar Hook com Ordem Dinâmica

```javascript
import { useVehicleTimeline } from './hooks/useVehicleTimeline';

function MyComponent({ checkinId }) {
  const { 
    timeline, 
    currentStage, 
    progress, 
    stageOrder  // ← Ordem dinâmica!
  } = useVehicleTimeline(checkinId);
  
  return (
    <div>
      <p>Progresso: {progress}%</p>
      <p>Etapa: {currentStage}</p>
      <p>Ordem: {stageOrder.join(' → ')}</p>
    </div>
  );
}
```

### 3. Criar Orçamento e Atualizar Timeline

```javascript
import { onBudgetCreated } from './services/timelineService';

async function handleCreateBudget(checkinId, budgetData) {
  // Salvar orçamento
  const budgetId = await saveBudget(budgetData);
  
  // Atualizar timeline
  await onBudgetCreated(checkinId, budgetId);
  
  // Enviar link de aprovação
  await sendApprovalLink(budgetId, clientEmail);
}
```

### 4. Aprovar Orçamento

```javascript
import { onBudgetApproved } from './services/timelineService';

async function handleApproveBudget(checkinId, budgetId, type) {
  await onBudgetApproved(checkinId, budgetId, type);
  // Timeline avança automaticamente para 'execucao'
}
```

### 5. Recusar Orçamento

```javascript
import { onBudgetRejected } from './services/timelineService';

async function handleRejectBudget(checkinId, budgetId) {
  await onBudgetRejected(checkinId, budgetId, 'price_too_high');
  // Timeline pula para 'checkout' com etapas marcadas como skipped
}
```

---

## ✅ Checklist da Fase 1

- [x] Criar utilitários de workflow (`workflowHelpers.js`)
- [x] Definir constantes e tipos
- [x] Implementar funções de determinação de fluxo
- [x] Implementar funções de cálculo de progresso
- [x] Implementar funções de validação
- [x] Atualizar serviço de timeline
- [x] Adicionar funções de gerenciamento de orçamento
- [x] Integrar com workflowHelpers
- [x] Atualizar hook useVehicleTimeline
- [x] Adicionar suporte a ordem dinâmica
- [x] Documentar estrutura de dados
- [x] Documentar fluxos suportados
- [x] Criar exemplos de uso

---

## 🚀 Próximos Passos (Fase 2)

### Integração com Orçamentos

1. **Modificar BudgetModal**
   - Detectar se tem checkinId
   - Chamar `onBudgetCreated` ao salvar
   - Atualizar timeline automaticamente

2. **Criar Página de Aprovação**
   - Link único para cliente
   - Opções: Aprovar Total, Parcial, Recusar
   - Webhook para atualizar timeline

3. **Implementar Webhook**
   - Endpoint `/api/budgets/:id/approve`
   - Chamar `onBudgetApproved` ou `onBudgetRejected`
   - Notificar oficina

4. **Cron Job de Expiração**
   - Verificar orçamentos pendentes
   - Chamar `onBudgetExpired` após 48h
   - Enviar notificações

---

## 📝 Arquivos Criados/Modificados

### Criados:
- ✅ `src/pages/checkin/utils/workflowHelpers.js` - Utilitários completos

### Modificados:
- ✅ `src/pages/checkin/services/timelineService.js` - Imports atualizados
- ✅ `src/pages/checkin/hooks/useVehicleTimeline.js` - Já estava atualizado

### Próximos:
- ⏳ `src/pages/checkin/components/timeline/VehicleTimeline.jsx` - Visualização
- ⏳ `src/pages/budgets/components/BudgetModal.jsx` - Integração
- ⏳ `src/pages/budgets/BudgetApprovalPage.jsx` - Nova página

---

## ✅ Status da Fase 1

**Implementação:** ✅ COMPLETA

**Testes:** ⏳ PENDENTE

**Documentação:** ✅ COMPLETA

**Próxima Fase:** Fase 2 - Integração com Orçamentos

---

**Data:** 11/11/2025
**Versão:** 1.0.0
**Status:** ✅ PRONTO PARA FASE 2
