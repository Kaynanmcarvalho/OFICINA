# 🔒 Correção Crítica: Isolamento Total de Dados Multi-Tenant

## ❌ PROBLEMA CRÍTICO IDENTIFICADO

**Herança de dados entre empresas!**

Todos os stores estão acessando coleções diretamente na raiz do Firestore:
```javascript
// ❌ ERRADO - Acessa dados globais
collection(db, 'checkins')
collection(db, 'clientes')
collection(db, 'produtos')
collection(db, 'veiculos')
```

**Resultado:** Empresas novas veem dados de outras empresas!

---

## 🎯 Estrutura Correta Multi-Tenant

### Firestore Structure
```
firestore/
├── empresas/
│   ├── {empresaId}/
│   │   ├── checkins/          ← Isolado por empresa
│   │   ├── clientes/          ← Isolado por empresa
│   │   ├── produtos/          ← Isolado por empresa
│   │   ├── veiculos/          ← Isolado por empresa
│   │   ├── orcamentos/        ← Isolado por empresa
│   │   ├── ferramentas/       ← Isolado por empresa
│   │   ├── estoque/           ← Isolado por empresa
│   │   ├── equipe/            ← Isolado por empresa
│   │   └── agendamentos/      ← Isolado por empresa
│   └── {outraEmpresaId}/
│       └── ... (dados isolados)
├── cache_placas/              ← Compartilhado (OK)
└── usuarios/                  ← Global (OK)
```

---

## 🔧 Solução: Usar FirestoreService

### Antes (ERRADO)
```javascript
// clientStore.jsx
const docRef = await addDoc(collection(db, 'clients'), newClient);
const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
```

### Depois (CORRETO)
```javascript
// clientStore.jsx
import { firestoreService } from '../services/firestoreService';

const docRef = await firestoreService.add('clientes', newClient);
const clients = await firestoreService.getAll('clientes', { 
  orderBy: { field: 'createdAt', direction: 'desc' }
});
```

---

## 📋 Stores que Precisam de Correção

### ✅ Já Correto
- [x] `checkinStore.jsx` - Usa firestoreService

### ❌ Precisam Correção
- [ ] `clientStore.jsx` - Acessa `collection(db, 'clients')`
- [ ] `inventoryStore.jsx` - Acessa `collection(db, 'inventory')`
- [ ] `vehicleStore.jsx` - Acessa `collection(db, 'vehicles')`
- [ ] `toolStore.jsx` - Acessa `collection(db, 'tools')`
- [ ] `teamStore.jsx` - Acessa `collection(db, 'team_members')` e `collection(db, 'schedules')`
- [ ] `budgetStore.jsx` - Acessa `collection(db, 'budgets')`
- [ ] `motorcycleStore.jsx` - Acessa `collection(db, 'motorcycles')`
- [ ] `dashboardService.js` - Acessa múltiplas coleções diretamente

---

## 🚀 Plano de Ação

### 1. Atualizar Mapeamento de Coleções
```javascript
// Mapeamento de nomes de coleções
const COLLECTION_NAMES = {
  clients: 'clientes',
  inventory: 'estoque',
  vehicles: 'veiculos',
  tools: 'ferramentas',
  team_members: 'equipe',
  schedules: 'agendamentos',
  budgets: 'orcamentos',
  motorcycles: 'motos'
};
```

### 2. Substituir Todas as Queries
Substituir em cada store:
- `collection(db, 'xxx')` → `firestoreService.getCollectionPath('xxx')`
- `addDoc()` → `firestoreService.add()`
- `getDocs()` → `firestoreService.getAll()`
- `getDoc()` → `firestoreService.getById()`
- `updateDoc()` → `firestoreService.update()`
- `deleteDoc()` → `firestoreService.delete()`
- `onSnapshot()` → `firestoreService.onSnapshot()`

### 3. Testar Isolamento
- Criar empresa A
- Criar dados na empresa A
- Criar empresa B
- Verificar que empresa B está vazia
- Entrar como empresa A via impersonation
- Verificar que vê apenas dados da empresa A

---

## 📝 Exemplo de Correção Completa

### clientStore.jsx - ANTES
```javascript
// ❌ ERRADO
addClient: async (clientData) => {
  const docRef = await addDoc(collection(db, 'clients'), newClient);
  // ...
},

fetchClients: async () => {
  const q = query(
    collection(db, 'clients'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  // ...
},

subscribeToClients: () => {
  const q = query(
    collection(db, 'clients'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    // ...
  });
}
```

### clientStore.jsx - DEPOIS
```javascript
// ✅ CORRETO
import { firestoreService } from '../services/firestoreService';

addClient: async (clientData) => {
  const newClient = await firestoreService.add('clientes', clientData);
  // ...
},

fetchClients: async () => {
  const clients = await firestoreService.getAll('clientes', {
    orderBy: { field: 'createdAt', direction: 'desc' }
  });
  // ...
},

subscribeToClients: () => {
  return firestoreService.onSnapshot('clientes', (clients) => {
    set({ clients, isLoading: false });
  }, {
    orderBy: { field: 'createdAt', direction: 'desc' }
  });
}
```

---

## ⚠️ Impacto da Correção

### Antes da Correção
```
Empresa A cria cliente "João"
Empresa B vê cliente "João" ❌
Empresa C vê cliente "João" ❌
```

### Depois da Correção
```
Empresa A cria cliente "João"
Empresa B não vê nada ✅
Empresa C não vê nada ✅
```

---

## 🔒 Garantias de Segurança

### FirestoreService Garante:
1. ✅ Todas as queries incluem `empresaId` automaticamente
2. ✅ Impossível acessar dados de outra empresa sem impersonation
3. ✅ Validação de `empresaId` em todas as operações
4. ✅ Logs de auditoria automáticos
5. ✅ Sanitização de dados

### Firestore Rules Garantem:
```javascript
// Regra de segurança
match /empresas/{empresaId}/{collection}/{document} {
  allow read, write: if request.auth.token.empresaId == empresaId;
}
```

---

## 📊 Checklist de Validação

Após correção, validar:

- [ ] Empresa nova não vê dados de outras empresas
- [ ] Cada empresa vê apenas seus próprios dados
- [ ] Cache de placas continua compartilhado (OK)
- [ ] Impersonation funciona corretamente
- [ ] Super admin vê dados corretos de cada empresa
- [ ] Não há queries diretas ao Firestore (exceto cache_placas)
- [ ] Todos os stores usam firestoreService
- [ ] Dashboard mostra dados corretos por empresa

---

## 🚨 PRIORIDADE MÁXIMA

Esta correção é **CRÍTICA** e deve ser aplicada **IMEDIATAMENTE**.

**Risco:** Vazamento de dados entre empresas
**Impacto:** Violação de privacidade e LGPD
**Urgência:** ALTA

---

**Iniciando correção agora...**
