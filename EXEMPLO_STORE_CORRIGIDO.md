# 📝 Exemplo: Store Corrigido para Multi-Tenant

## Antes (ERRADO - Acessa dados globais)

```javascript
import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useClientStore = create((set, get) => ({
  clients: [],
  isLoading: false,

  // ❌ ERRADO - Acessa coleção global
  addClient: async (clientData) => {
    const docRef = await addDoc(collection(db, 'clients'), clientData);
    // ...
  },

  // ❌ ERRADO - Busca dados globais
  fetchClients: async () => {
    const q = query(
      collection(db, 'clients'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    // ...
  },

  // ❌ ERRADO - Escuta dados globais
  subscribeToClients: () => {
    const q = query(
      collection(db, 'clients'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      // ...
    });
  }
}));
```

## Depois (CORRETO - Isolado por empresa)

```javascript
import { create } from 'zustand';
import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  subscribeToCollection
} from '../services/storeHelpers';
import toast from 'react-hot-toast';

export const useClientStore = create((set, get) => ({
  clients: [],
  isLoading: false,
  error: null,

  // ✅ CORRETO - Usa storeHelpers que garante isolamento
  addClient: async (clientData) => {
    try {
      set({ isLoading: true, error: null });
      
      const newClient = await addDocument('clients', {
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      set((state) => ({
        clients: [newClient, ...state.clients],
        isLoading: false
      }));
      
      toast.success('Cliente adicionado com sucesso!');
      return newClient;
    } catch (error) {
      console.error('[ClientStore] Error adding client:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao adicionar cliente');
      throw error;
    }
  },

  // ✅ CORRETO - Busca apenas dados da empresa
  fetchClients: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const clients = await getAllDocuments('clients', {
        orderBy: { field: 'createdAt', direction: 'desc' }
      });
      
      set({ clients, isLoading: false });
      return clients;
    } catch (error) {
      console.error('[ClientStore] Error fetching clients:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ✅ CORRETO - Escuta apenas dados da empresa
  subscribeToClients: () => {
    return subscribeToCollection('clients', (clients) => {
      set({ clients, isLoading: false });
    }, {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  },

  // ✅ CORRETO - Atualiza documento isolado
  updateClient: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      await updateDocument('clients', id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      set((state) => ({
        clients: state.clients.map(client =>
          client.id === id ? { ...client, ...updates } : client
        ),
        isLoading: false
      }));
      
      toast.success('Cliente atualizado com sucesso!');
    } catch (error) {
      console.error('[ClientStore] Error updating client:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao atualizar cliente');
      throw error;
    }
  },

  // ✅ CORRETO - Deleta documento isolado
  deleteClient: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      await deleteDocument('clients', id);
      
      set((state) => ({
        clients: state.clients.filter(client => client.id !== id),
        isLoading: false
      }));
      
      toast.success('Cliente removido com sucesso!');
    } catch (error) {
      console.error('[ClientStore] Error deleting client:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Erro ao remover cliente');
      throw error;
    }
  },

  // ✅ CORRETO - Busca por ID isolado
  getClientById: async (id) => {
    try {
      const client = await getDocumentById('clients', id);
      return client;
    } catch (error) {
      console.error('[ClientStore] Error getting client:', error);
      throw error;
    }
  },

  // Limpar erro
  clearError: () => set({ error: null })
}));
```

## Benefícios da Correção

### 1. Isolamento Total
```javascript
// Empresa A
addClient({ nome: 'João' }) 
// Salvo em: empresas/empresaA/clientes/xxx

// Empresa B  
fetchClients()
// Busca em: empresas/empresaB/clientes/
// Resultado: [] (vazio, não vê João)
```

### 2. Código Mais Limpo
```javascript
// Antes: 10 linhas
const q = query(
  collection(db, 'clients'),
  orderBy('createdAt', 'desc')
);
const snapshot = await getDocs(q);
const clients = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));

// Depois: 3 linhas
const clients = await getAllDocuments('clients', {
  orderBy: { field: 'createdAt', direction: 'desc' }
});
```

### 3. Segurança Garantida
- ✅ Impossível acessar dados de outra empresa
- ✅ Validação automática de empresaId
- ✅ Logs de auditoria
- ✅ Sanitização de dados

### 4. Manutenção Facilitada
- ✅ Mudanças centralizadas em storeHelpers
- ✅ Código consistente em todos os stores
- ✅ Fácil adicionar novas funcionalidades

## Aplicar em Todos os Stores

Esta mesma estrutura deve ser aplicada em:
- ✅ clientStore.jsx
- ✅ budgetStore.jsx
- ✅ inventoryStore.jsx
- ✅ vehicleStore.jsx
- ✅ toolStore.jsx
- ✅ teamStore.jsx
- ✅ motorcycleStore.jsx

## Validação

Após correção, testar:
1. Criar empresa A
2. Adicionar dados na empresa A
3. Criar empresa B
4. Verificar que empresa B não vê dados da empresa A
5. Adicionar dados na empresa B
6. Verificar que empresa A não vê dados da empresa B
7. Usar impersonation para alternar entre empresas
8. Verificar que cada empresa vê apenas seus dados

✅ **Isolamento total garantido!**
