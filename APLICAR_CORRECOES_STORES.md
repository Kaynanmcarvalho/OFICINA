# 🔧 Aplicação de Correções - Isolamento de Dados

## Stores Prioritários (Ordem de Correção)

### 1. clientStore.jsx ⚠️ CRÍTICO
- Clientes devem ser isolados por empresa
- Usado em: Check-in, Orçamentos, Veículos

### 2. budgetStore.jsx ⚠️ CRÍTICO  
- Orçamentos devem ser isolados por empresa
- Contém dados financeiros sensíveis

### 3. inventoryStore.jsx ⚠️ ALTO
- Estoque deve ser isolado por empresa
- Cada empresa tem seus próprios produtos

### 4. vehicleStore.jsx ⚠️ ALTO
- Veículos devem ser isolados por empresa
- Vinculados a clientes da empresa

### 5. toolStore.jsx ⚠️ MÉDIO
- Ferramentas devem ser isoladas por empresa

### 6. teamStore.jsx ⚠️ MÉDIO
- Equipe e agendamentos isolados por empresa

### 7. motorcycleStore.jsx ⚠️ MÉDIO
- Motos devem ser isoladas por empresa

## ✅ Já Corretos
- checkinStore.jsx - Usa firestoreService
- authStore.jsx - Usa coleção global 'usuarios' (correto)
- themeStore.jsx - Não acessa Firestore
- notificationStore.jsx - Não acessa Firestore
- settingsStore.jsx - Configurações locais
- organizationStore.jsx - Usa coleção 'empresas' (correto)

## Estratégia de Correção

Para cada store, substituir:

```javascript
// ANTES
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const docRef = await addDoc(collection(db, 'clients'), data);
const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
const snapshot = await getDocs(q);

// DEPOIS
import { firestoreService } from '../services/firestoreService';

const newClient = await firestoreService.add('clientes', data);
const clients = await firestoreService.getAll('clientes', {
  orderBy: { field: 'createdAt', direction: 'desc' }
});
```

## Mapeamento de Nomes de Coleções

```javascript
// Inglês (código) → Português (Firestore)
clients → clientes
inventory → estoque  
vehicles → veiculos
tools → ferramentas
team_members → equipe
schedules → agendamentos
budgets → orcamentos
motorcycles → motos
```

## Aplicando Correções...
