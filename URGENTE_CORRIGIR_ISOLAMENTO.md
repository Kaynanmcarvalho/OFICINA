# 🚨 URGENTE: Correção de Isolamento de Dados

## ❌ PROBLEMA CRÍTICO

**TODAS as empresas estão vendo dados umas das outras!**

Quando uma empresa nova é criada, ela já vem com:
- ✅ Check-ins de outras empresas
- ✅ Clientes de outras empresas  
- ✅ Produtos de outras empresas
- ✅ Veículos de outras empresas
- ✅ Orçamentos de outras empresas

**Isso é uma violação grave de privacidade e LGPD!**

---

## 🎯 CAUSA RAIZ

Todos os stores (exceto checkinStore) estão acessando coleções diretamente na raiz do Firestore:

```javascript
// ❌ ERRADO - Acessa dados GLOBAIS
collection(db, 'clients')      // Todos os clientes de todas as empresas
collection(db, 'budgets')      // Todos os orçamentos de todas as empresas
collection(db, 'inventory')    // Todo o estoque de todas as empresas
```

**Estrutura ERRADA atual:**
```
firestore/
├── clients/           ← GLOBAL (todas as empresas veem)
├── budgets/           ← GLOBAL (todas as empresas veem)
├── inventory/         ← GLOBAL (todas as empresas veem)
└── vehicles/          ← GLOBAL (todas as empresas veem)
```

**Estrutura CORRETA necessária:**
```
firestore/
├── empresas/
│   ├── empresaA/
│   │   ├── clientes/      ← Isolado
│   │   ├── orcamentos/    ← Isolado
│   │   └── estoque/       ← Isolado
│   └── empresaB/
│       ├── clientes/      ← Isolado
│       ├── orcamentos/    ← Isolado
│       └── estoque/       ← Isolado
└── cache_placas/          ← Compartilhado (OK)
```

---

## ✅ SOLUÇÃO IMPLEMENTADA

### 1. Criado `storeHelpers.js`
Arquivo com funções que garantem isolamento automático:

```javascript
import { addDocument, getAllDocuments, subscribeToCollection } from '../services/storeHelpers';

// ✅ Automaticamente isolado por empresa
const clients = await getAllDocuments('clients');
```

### 2. Mapeamento de Coleções
```javascript
clients → empresas/{empresaId}/clientes
budgets → empresas/{empresaId}/orcamentos
inventory → empresas/{empresaId}/estoque
vehicles → empresas/{empresaId}/veiculos
tools → empresas/{empresaId}/ferramentas
team_members → empresas/{empresaId}/equipe
schedules → empresas/{empresaId}/agendamentos
motorcycles → empresas/{empresaId}/motos
```

---

## 🔧 COMO CORRIGIR CADA STORE

### Template de Correção

**ANTES:**
```javascript
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const docRef = await addDoc(collection(db, 'clients'), data);
const snapshot = await getDocs(collection(db, 'clients'));
```

**DEPOIS:**
```javascript
import { addDocument, getAllDocuments } from '../services/storeHelpers';

const newClient = await addDocument('clients', data);
const clients = await getAllDocuments('clients');
```

### Stores que PRECISAM ser corrigidos:

1. **src/store/clientStore.jsx** ⚠️ CRÍTICO
   - Substituir: `collection(db, 'clients')` → `storeHelpers`
   - Substituir: `addDoc()` → `addDocument('clients', ...)`
   - Substituir: `getDocs()` → `getAllDocuments('clients')`
   - Substituir: `onSnapshot()` → `subscribeToCollection('clients', ...)`

2. **src/store/budgetStore.jsx** ⚠️ CRÍTICO
   - Substituir: `collection(db, 'budgets')` → `storeHelpers`
   - Mesmas substituições

3. **src/store/inventoryStore.jsx** ⚠️ ALTO
   - Substituir: `collection(db, 'inventory')` → `storeHelpers`
   - Mesmas substituições

4. **src/store/vehicleStore.jsx** ⚠️ ALTO
   - Substituir: `collection(db, 'vehicles')` → `storeHelpers`
   - Mesmas substituições

5. **src/store/toolStore.jsx** ⚠️ MÉDIO
   - Substituir: `collection(db, 'tools')` → `storeHelpers`
   - Mesmas substituições

6. **src/store/teamStore.jsx** ⚠️ MÉDIO
   - Substituir: `collection(db, 'team_members')` → `storeHelpers`
   - Substituir: `collection(db, 'schedules')` → `storeHelpers`
   - Mesmas substituições

7. **src/store/motorcycleStore.jsx** ⚠️ MÉDIO
   - Substituir: `collection(db, 'motorcycles')` → `storeHelpers`
   - Mesmas substituições

8. **src/pages/dashboard/servicos/dashboardService.js** ⚠️ ALTO
   - Substituir todas as queries diretas
   - Usar `getAllDocuments()` para cada coleção

---

## 📋 CHECKLIST DE CORREÇÃO

Para cada store:

- [ ] Remover imports do Firebase diretos:
  ```javascript
  // REMOVER
  import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
  import { db } from '../config/firebase';
  ```

- [ ] Adicionar import do storeHelpers:
  ```javascript
  // ADICIONAR
  import {
    addDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    subscribeToCollection
  } from '../services/storeHelpers';
  ```

- [ ] Substituir todas as operações:
  - `addDoc(collection(db, 'xxx'), data)` → `addDocument('xxx', data)`
  - `getDocs(query(collection(db, 'xxx')))` → `getAllDocuments('xxx')`
  - `getDoc(doc(db, 'xxx', id))` → `getDocumentById('xxx', id)`
  - `updateDoc(doc(db, 'xxx', id), data)` → `updateDocument('xxx', id, data)`
  - `deleteDoc(doc(db, 'xxx', id))` → `deleteDocument('xxx', id)`
  - `onSnapshot(query(...))` → `subscribeToCollection('xxx', callback, options)`

- [ ] Testar isolamento:
  - Criar empresa A
  - Adicionar dados
  - Criar empresa B
  - Verificar que B não vê dados de A

---

## 🧪 TESTE DE VALIDAÇÃO

### Cenário 1: Empresas Isoladas
```
1. Login como Empresa A
2. Criar cliente "João Silva"
3. Criar orçamento "ORÇ-001"
4. Logout

5. Login como Empresa B
6. Verificar lista de clientes → DEVE ESTAR VAZIA ✅
7. Verificar lista de orçamentos → DEVE ESTAR VAZIA ✅
8. Criar cliente "Maria Santos"
9. Logout

10. Login como Empresa A
11. Verificar clientes → DEVE VER APENAS "João Silva" ✅
12. NÃO DEVE VER "Maria Santos" ✅
```

### Cenário 2: Impersonation
```
1. Login como Super Admin
2. Acessar /admin/dashboard
3. Entrar como Empresa A
4. Verificar clientes → DEVE VER APENAS dados da Empresa A ✅
5. Voltar ao admin
6. Entrar como Empresa B
7. Verificar clientes → DEVE VER APENAS dados da Empresa B ✅
```

---

## ⚠️ IMPACTO SE NÃO CORRIGIR

### Riscos Legais
- ❌ Violação da LGPD (Lei Geral de Proteção de Dados)
- ❌ Vazamento de dados sensíveis entre empresas
- ❌ Possíveis processos judiciais
- ❌ Multas de até 2% do faturamento

### Riscos de Negócio
- ❌ Perda de confiança dos clientes
- ❌ Cancelamento de contratos
- ❌ Reputação danificada
- ❌ Impossibilidade de vender o sistema

### Riscos Técnicos
- ❌ Dados misturados impossíveis de separar
- ❌ Corrupção de dados
- ❌ Impossibilidade de fazer backup por empresa
- ❌ Dificuldade de debug

---

## 🚀 PLANO DE AÇÃO IMEDIATO

### Fase 1: Correção Urgente (AGORA)
1. ✅ Criar `storeHelpers.js` (FEITO)
2. ⏳ Corrigir `clientStore.jsx`
3. ⏳ Corrigir `budgetStore.jsx`
4. ⏳ Corrigir `inventoryStore.jsx`

### Fase 2: Correção Complementar (HOJE)
5. ⏳ Corrigir `vehicleStore.jsx`
6. ⏳ Corrigir `toolStore.jsx`
7. ⏳ Corrigir `teamStore.jsx`
8. ⏳ Corrigir `motorcycleStore.jsx`

### Fase 3: Validação (HOJE)
9. ⏳ Testar isolamento entre empresas
10. ⏳ Testar impersonation
11. ⏳ Verificar Firestore Rules
12. ⏳ Documentar correções

---

## 📊 STATUS ATUAL

### ✅ Correto
- checkinStore.jsx - Já usa firestoreService
- authStore.jsx - Usa coleção global (correto)
- cache_placas - Compartilhado (correto)

### ❌ PRECISA CORREÇÃO URGENTE
- clientStore.jsx - **CRÍTICO**
- budgetStore.jsx - **CRÍTICO**
- inventoryStore.jsx - **ALTO**
- vehicleStore.jsx - **ALTO**
- toolStore.jsx - **MÉDIO**
- teamStore.jsx - **MÉDIO**
- motorcycleStore.jsx - **MÉDIO**
- dashboardService.js - **ALTO**

---

## 💡 ARQUIVOS CRIADOS

1. ✅ `src/services/storeHelpers.js` - Funções de isolamento
2. ✅ `CORRECAO_ISOLAMENTO_DADOS.md` - Documentação técnica
3. ✅ `EXEMPLO_STORE_CORRIGIDO.md` - Exemplo de correção
4. ✅ `URGENTE_CORRIGIR_ISOLAMENTO.md` - Este arquivo

---

## 🎯 PRÓXIMOS PASSOS

**AÇÃO IMEDIATA NECESSÁRIA:**

Aplicar correções em todos os stores listados acima usando o template fornecido.

**Prioridade:** 🔴 MÁXIMA  
**Urgência:** 🔴 IMEDIATA  
**Impacto:** 🔴 CRÍTICO

---

**⚠️ ESTE É UM PROBLEMA DE SEGURANÇA CRÍTICO QUE DEVE SER CORRIGIDO IMEDIATAMENTE!**
