# 📋 Especificação: Timeline Dinâmica de Atendimento

## 🎯 Objetivo

Implementar uma timeline inteligente que se adapta ao fluxo de trabalho, com dois cenários principais:
1. **Fluxo Check-in → Orçamento** (veículo já está na oficina)
2. **Fluxo Orçamento → Check-in** (orçamento feito antes do veículo chegar)

---

## 📊 Cenários de Uso

### Cenário 1: Check-in Primeiro (Fluxo Normal)

**Ordem das Etapas:**
```
1. Check-in (veículo entra na oficina)
2. Diagnóstico (análise técnica)
3. Orçamento (criação e envio)
4. Execução (após aprovação)
5. Finalização (controle de qualidade)
6. Check-out (entrega do veículo)
```

**Regras:**
- Timeline avança para "Orçamento" quando orçamento é criado
- Fica aguardando aprovação do cliente
- Se aprovado (total ou parcial) → avança para "Execução"
- Se recusado totalmente → pula para "Check-out" com ❌ vermelho
- Se expirar (48h) → pula para "Check-out" com ⏰ amarelo

### Cenário 2: Orçamento Primeiro (Fluxo Invertido)

**Ordem das Etapas:**
```
1. Orçamento (criado sem check-in)
2. Check-in (veículo entra após aprovação)
3. Diagnóstico (análise técnica)
4. Execução (realização dos serviços)
5. Finalização (controle de qualidade)
6. Check-out (entrega do veículo)
```

**Regras:**
- Timeline começa em "Orçamento"
- Aguarda aprovação do cliente
- Se aprovado → cliente traz o veículo (Check-in)
- Se recusado → orçamento arquivado (sem timeline)
- Se expirar → orçamento arquivado

---

## 🔄 Estados do Orçamento

### 1. Aguardando Aprovação
- **Status**: `pending`
- **Timeline**: Parada em "Orçamento"
- **Visual**: Ícone pulsando em laranja
- **Ação**: Aguardar resposta do cliente

### 2. Aprovado Total
- **Status**: `approved_total`
- **Timeline**: Avança para próxima etapa
- **Visual**: ✅ Verde
- **Ação**: Iniciar execução dos serviços

### 3. Aprovado Parcial
- **Status**: `approved_partial`
- **Timeline**: Avança para próxima etapa
- **Visual**: ✅ Verde com badge "Parcial"
- **Ação**: Executar apenas serviços aprovados

### 4. Recusado Total
- **Status**: `rejected_total`
- **Timeline**: Pula para Check-out
- **Visual**: ❌ Vermelho em todas as etapas intermediárias
- **Ação**: Cliente busca veículo sem serviços

### 5. Expirado (48h)
- **Status**: `expired`
- **Timeline**: Pula para Check-out
- **Visual**: ⏰ Amarelo em "Orçamento"
- **Ação**: Contatar cliente ou devolver veículo

---

## 🗂️ Estrutura de Dados

### Check-in com Timeline

```javascript
{
  id: "CHK-123",
  firestoreId: "abc123",
  
  // Tipo de fluxo
  workflowType: "checkin-first" | "budget-first",
  
  // Timeline atual
  currentStage: "orcamento",
  
  // Etapas personalizadas (ordem pode variar)
  stageOrder: [
    "checkin",      // ou "orcamento" se budget-first
    "diagnostico",
    "orcamento",    // ou "checkin" se budget-first
    "execucao",
    "finalizacao",
    "checkout"
  ],
  
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
      userName: "João Técnico"
    },
    orcamento: {
      completed: false,
      status: "pending", // pending, approved_total, approved_partial, rejected_total, expired
      timestamp: Timestamp,
      budgetId: "BDG-456",
      expiresAt: Timestamp, // 48h após criação
      approvedAt: null,
      rejectedAt: null,
      approvalType: null, // total, partial, null
      userId: "user789",
      userName: "Carlos Vendedor"
    },
    execucao: {
      completed: false,
      skipped: false, // true se orçamento recusado
      skipReason: null // "budget_rejected" ou "budget_expired"
    },
    finalizacao: {
      completed: false,
      skipped: false
    },
    checkout: {
      completed: false
    }
  },
  
  // Referência ao orçamento
  budgetId: "BDG-456",
  budgetStatus: "pending",
  
  // Timestamps importantes
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Orçamento com Referência ao Check-in

```javascript
{
  id: "BDG-456",
  firestoreId: "def456",
  
  // Referência ao check-in (pode ser null se budget-first)
  checkinId: "CHK-123" | null,
  
  // Status do orçamento
  status: "pending" | "approved_total" | "approved_partial" | "rejected_total" | "expired",
  
  // Aprovação
  approvedAt: Timestamp | null,
  approvedBy: "client" | "system",
  approvalType: "total" | "partial" | null,
  approvedItems: ["item1", "item2"], // se parcial
  
  // Rejeição
  rejectedAt: Timestamp | null,
  rejectionReason: "price" | "time" | "other",
  
  // Expiração
  expiresAt: Timestamp, // 48h após criação
  expiredAt: Timestamp | null,
  
  // Dados do orçamento
  items: [...],
  total: 1500.00,
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🎨 Visualização da Timeline

### Fluxo Normal (Check-in Primeiro)

**Orçamento Pendente:**
```
✅ Check-in → ✅ Diagnóstico → 🟠 Orçamento → ⚪ Execução → ⚪ Finalização → ⚪ Check-out
                              (pulsando)
```

**Orçamento Aprovado:**
```
✅ Check-in → ✅ Diagnóstico → ✅ Orçamento → 🟠 Execução → ⚪ Finalização → ⚪ Check-out
```

**Orçamento Recusado:**
```
✅ Check-in → ✅ Diagnóstico → ❌ Orçamento → ❌ Execução → ❌ Finalização → 🟠 Check-out
                              (vermelho)    (pulado)     (pulado)
```

**Orçamento Expirado:**
```
✅ Check-in → ✅ Diagnóstico → ⏰ Orçamento → ❌ Execução → ❌ Finalização → 🟠 Check-out
                              (amarelo)     (pulado)     (pulado)
```

### Fluxo Invertido (Orçamento Primeiro)

**Orçamento Pendente:**
```
🟠 Orçamento → ⚪ Check-in → ⚪ Diagnóstico → ⚪ Execução → ⚪ Finalização → ⚪ Check-out
(pulsando)
```

**Orçamento Aprovado + Check-in Realizado:**
```
✅ Orçamento → ✅ Check-in → 🟠 Diagnóstico → ⚪ Execução → ⚪ Finalização → ⚪ Check-out
```

**Orçamento Recusado:**
```
❌ Orçamento → (timeline não continua, orçamento arquivado)
```

---

## 🔧 Implementação Técnica

### 1. Detectar Tipo de Fluxo

```javascript
// Ao criar orçamento
function determineWorkflowType(checkinId) {
  if (checkinId) {
    return 'checkin-first'; // Veículo já está na oficina
  } else {
    return 'budget-first'; // Orçamento antes do check-in
  }
}
```

### 2. Definir Ordem das Etapas

```javascript
function getStageOrder(workflowType) {
  if (workflowType === 'checkin-first') {
    return ['checkin', 'diagnostico', 'orcamento', 'execucao', 'finalizacao', 'checkout'];
  } else {
    return ['orcamento', 'checkin', 'diagnostico', 'execucao', 'finalizacao', 'checkout'];
  }
}
```

### 3. Atualizar Timeline ao Criar Orçamento

```javascript
async function onBudgetCreated(budgetId, checkinId) {
  if (checkinId) {
    // Fluxo normal: avançar timeline do check-in
    await updateStage(checkinId, 'orcamento', {
      budgetId,
      status: 'pending',
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48h
    });
  } else {
    // Fluxo invertido: criar check-in virtual ou aguardar
    // (não cria timeline ainda, aguarda aprovação)
  }
}
```

### 4. Atualizar Timeline ao Aprovar Orçamento

```javascript
async function onBudgetApproved(budgetId, approvalType) {
  const budget = await getBudget(budgetId);
  const checkinId = budget.checkinId;
  
  if (checkinId) {
    // Fluxo normal: avançar para execução
    await updateStage(checkinId, 'orcamento', {
      status: approvalType === 'total' ? 'approved_total' : 'approved_partial',
      approvedAt: new Date(),
      completed: true
    });
    
    await updateStage(checkinId, 'execucao', {
      status: 'in_progress'
    });
  } else {
    // Fluxo invertido: aguardar check-in do veículo
    // Atualizar orçamento para aguardar veículo
    await updateBudget(budgetId, {
      status: 'approved_awaiting_checkin'
    });
  }
}
```

### 5. Atualizar Timeline ao Recusar Orçamento

```javascript
async function onBudgetRejected(budgetId) {
  const budget = await getBudget(budgetId);
  const checkinId = budget.checkinId;
  
  if (checkinId) {
    // Fluxo normal: pular para checkout
    await updateStage(checkinId, 'orcamento', {
      status: 'rejected_total',
      rejectedAt: new Date(),
      completed: true
    });
    
    // Marcar etapas intermediárias como puladas
    await updateStage(checkinId, 'execucao', {
      skipped: true,
      skipReason: 'budget_rejected'
    });
    
    await updateStage(checkinId, 'finalizacao', {
      skipped: true,
      skipReason: 'budget_rejected'
    });
    
    // Avançar para checkout
    await updateCheckin(checkinId, {
      currentStage: 'checkout'
    });
  } else {
    // Fluxo invertido: arquivar orçamento
    await updateBudget(budgetId, {
      status: 'rejected_archived'
    });
  }
}
```

### 6. Verificar Expiração (Cron Job)

```javascript
async function checkExpiredBudgets() {
  const now = new Date();
  const expiredBudgets = await getExpiredBudgets(now);
  
  for (const budget of expiredBudgets) {
    if (budget.checkinId) {
      // Mesmo tratamento que rejeição
      await onBudgetExpired(budget.id);
    } else {
      // Arquivar orçamento
      await updateBudget(budget.id, {
        status: 'expired_archived',
        expiredAt: now
      });
    }
  }
}
```

---

## 📱 Integrações Necessárias

### 1. Modal de Orçamento

**Ao salvar orçamento:**
```javascript
// Em BudgetModal.jsx
const handleSave = async (budgetData) => {
  // Salvar orçamento
  const budgetId = await saveBudget(budgetData);
  
  // Se tem checkinId, atualizar timeline
  if (checkinId) {
    await updateCheckinTimeline(checkinId, 'orcamento', {
      budgetId,
      status: 'pending'
    });
  }
  
  // Enviar link de aprovação para cliente
  await sendBudgetApprovalLink(budgetId, clientEmail);
};
```

### 2. Página de Aprovação do Cliente

**Link enviado ao cliente:**
```
https://seusite.com/orcamento/approve/BDG-456?token=abc123
```

**Ações do cliente:**
- Aprovar Total
- Aprovar Parcial (selecionar itens)
- Recusar Total

### 3. Webhook de Aprovação

```javascript
// Endpoint que recebe aprovação do cliente
app.post('/api/budgets/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { approvalType, approvedItems } = req.body;
  
  await onBudgetApproved(id, approvalType, approvedItems);
  
  res.json({ success: true });
});
```

---

## 🎯 Próximos Passos

### Fase 1: Estrutura Base
1. ✅ Criar estrutura de dados no Firebase
2. ✅ Implementar detecção de tipo de fluxo
3. ✅ Criar funções de atualização de timeline

### Fase 2: Integração com Orçamentos
1. ⏳ Modificar modal de orçamento para atualizar timeline
2. ⏳ Criar página de aprovação para cliente
3. ⏳ Implementar webhook de aprovação

### Fase 3: Visualização
1. ⏳ Atualizar VehicleTimeline para suportar ordem dinâmica
2. ⏳ Adicionar ícones de status (❌, ⏰, ✅)
3. ⏳ Implementar animações de transição

### Fase 4: Automação
1. ⏳ Criar cron job para verificar expirações
2. ⏳ Implementar notificações automáticas
3. ⏳ Adicionar alertas para orçamentos pendentes

---

## ✅ Checklist de Implementação

- [ ] Adicionar campos `workflowType` e `stageOrder` ao check-in
- [ ] Adicionar campo `budgetId` ao check-in
- [ ] Adicionar campos de status ao orçamento
- [ ] Criar função `updateCheckinTimeline()`
- [ ] Modificar `BudgetModal` para atualizar timeline
- [ ] Criar página de aprovação de orçamento
- [ ] Implementar webhook de aprovação
- [ ] Atualizar `VehicleTimeline` para ordem dinâmica
- [ ] Adicionar ícones de status especiais
- [ ] Criar cron job de expiração
- [ ] Adicionar testes automatizados

---

**Documentação criada em:** 11/11/2025
**Status:** 📋 ESPECIFICAÇÃO COMPLETA
**Próximo passo:** Implementação Fase 1
