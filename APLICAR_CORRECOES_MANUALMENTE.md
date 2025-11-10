# 🚨 CORREÇÕES URGENTES - Aplicar AGORA

## ✅ JÁ CORRIGIDOS
1. ✅ clientStore.jsx
2. ✅ budgetStore.jsx

## ⏳ APLICAR AGORA (CRÍTICO)

### inventoryStore.jsx

**Linha 1-16: Substituir imports**
```javascript
// DELETAR
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

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

**Linha ~65: Substituir addDoc**
```javascript
// ANTES
const docRef = await addDoc(collection(db, 'inventory'), newPart);
const partWithId = { ...newPart, firestoreId: docRef.id };

// DEPOIS
const partWithId = await addDocument('inventory', newPart);
```

**Linha ~135: Substituir getDocs**
```javascript
// ANTES
const q = query(
  collection(db, 'inventory'),
  orderBy('name')
);
const querySnapshot = await getDocs(q);
const parts = querySnapshot.docs.map(doc => ({
  ...doc.data(),
  firestoreId: doc.id,
}));

// DEPOIS
const parts = await getAllDocuments('inventory', {
  orderBy: { field: 'name', direction: 'asc' }
});
```

**Linha ~384: Substituir onSnapshot**
```javascript
// ANTES
const q = query(
  collection(db, 'inventory'),
  orderBy('name')
);
return onSnapshot(q, (querySnapshot) => {
  const parts = querySnapshot.docs.map(doc => ({
    ...doc.data(),
    firestoreId: doc.id,
  }));
  set({ parts });
});

// DEPOIS
return subscribeToCollection('inventory', (parts) => {
  set({ parts });
}, {
  orderBy: { field: 'name', direction: 'asc' }
});
```

---

### vehicleStore.jsx

**Mesmas substituições:**
- `collection(db, 'vehicles')` → usar storeHelpers
- `addDoc()` → `addDocument('vehicles', ...)`
- `getDocs()` → `getAllDocuments('vehicles', ...)`
- `onSnapshot()` → `subscribeToCollection('vehicles', ...)`

---

### toolStore.jsx

**Mesmas substituições:**
- `collection(db, 'tools')` → usar storeHelpers
- `addDoc()` → `addDocument('tools', ...)`
- `getDocs()` → `getAllDocuments('tools', ...)`
- `onSnapshot()` → `subscribeToCollection('tools', ...)`

---

### teamStore.jsx

**Mesmas substituições:**
- `collection(db, 'team_members')` → usar storeHelpers
- `collection(db, 'schedules')` → usar storeHelpers
- `addDoc()` → `addDocument('team_members', ...)` ou `addDocument('schedules', ...)`
- `getDocs()` → `getAllDocuments(...)`
- `onSnapshot()` → `subscribeToCollection(...)`

---

### motorcycleStore.jsx

**Mesmas substituições:**
- `collection(db, 'motorcycles')` → usar storeHelpers
- `addDoc()` → `addDocument('motorcycles', ...)`
- `getDocs()` → `getAllDocuments('motorcycles', ...)`
- `onSnapshot()` → `subscribeToCollection('motorcycles', ...)`

---

## 🎯 AÇÃO IMEDIATA

1. Abrir cada store
2. Ctrl+H (Find & Replace)
3. Aplicar substituições acima
4. Salvar
5. Testar

**Tempo estimado:** 5 minutos por store = 25 minutos total

---

## ✅ VALIDAÇÃO

Após correções:
1. Fazer logout
2. Criar nova empresa de teste
3. Verificar que não vê dados de outras empresas
4. Adicionar dados próprios
5. Verificar isolamento

---

**URGENTE: Sistema está expondo dados entre empresas!**
