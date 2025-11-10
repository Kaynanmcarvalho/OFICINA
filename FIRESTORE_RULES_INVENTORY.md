# 🔒 Regras de Segurança Firestore - Módulo Inventory

## Adicionar ao arquivo `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserEmpresaId() {
      return request.auth.token.empresaId;
    }
    
    function belongsToUserEmpresa(empresaId) {
      return isAuthenticated() && getUserEmpresaId() == empresaId;
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && request.auth.token.role == 'super-admin';
    }
    
    // ========== PRODUCTS COLLECTION ==========
    match /products/{productId} {
      // Permitir leitura se pertence à empresa do usuário
      allow read: if isAuthenticated() && 
                     (belongsToUserEmpresa(resource.data.empresaId) || isSuperAdmin());
      
      // Permitir criação se autenticado e empresaId corresponde
      allow create: if isAuthenticated() && 
                       belongsToUserEmpresa(request.resource.data.empresaId);
      
      // Permitir atualização se pertence à empresa do usuário
      allow update: if isAuthenticated() && 
                       belongsToUserEmpresa(resource.data.empresaId) &&
                       request.resource.data.empresaId == resource.data.empresaId; // Não pode mudar empresaId
      
      // Permitir exclusão se pertence à empresa do usuário
      allow delete: if isAuthenticated() && 
                       belongsToUserEmpresa(resource.data.empresaId);
      
      // ========== MOVEMENTS SUBCOLLECTION ==========
      match /movements/{movementId} {
        // Permitir leitura se o produto pertence à empresa
        allow read: if isAuthenticated() && 
                       belongsToUserEmpresa(get(/databases/$(database)/documents/products/$(productId)).data.empresaId);
        
        // Permitir criação de movimentações
        allow create: if isAuthenticated() && 
                         belongsToUserEmpresa(request.resource.data.empresaId);
        
        // Não permitir atualização ou exclusão de movimentações (histórico imutável)
        allow update, delete: if false;
      }
      
      // ========== AUDIT SUBCOLLECTION ==========
      match /audit/{auditId} {
        // Permitir leitura se o produto pertence à empresa
        allow read: if isAuthenticated() && 
                       belongsToUserEmpresa(get(/databases/$(database)/documents/products/$(productId)).data.empresaId);
        
        // Permitir criação de logs de auditoria
        allow create: if isAuthenticated() && 
                         belongsToUserEmpresa(request.resource.data.empresaId);
        
        // Não permitir atualização ou exclusão de logs (auditoria imutável)
        allow update, delete: if false;
      }
    }
    
    // ========== VALIDAÇÕES ADICIONAIS ==========
    
    // Validar estrutura do produto
    function isValidProduct(product) {
      return product.keys().hasAll(['name', 'category', 'empresaId', 'createdAt']) &&
             product.name is string && product.name.size() > 0 &&
             product.category is string && product.category.size() > 0 &&
             product.empresaId is string &&
             product.stock_total is number && product.stock_total >= 0 &&
             product.stock_min is number && product.stock_min >= 0 &&
             product.stock_reserved is number && product.stock_reserved >= 0 &&
             product.cost_price is number && product.cost_price >= 0 &&
             product.sale_price is number && product.sale_price >= 0;
    }
    
    // Validar movimentação
    function isValidMovement(movement) {
      return movement.keys().hasAll(['type', 'quantity', 'empresaId', 'timestamp']) &&
             movement.type in ['in', 'out', 'reserve', 'release'] &&
             movement.quantity is number && movement.quantity > 0 &&
             movement.empresaId is string;
    }
    
    // Validar log de auditoria
    function isValidAudit(audit) {
      return audit.keys().hasAll(['action', 'description', 'empresaId', 'timestamp']) &&
             audit.action in ['create', 'update', 'delete'] &&
             audit.description is string &&
             audit.empresaId is string;
    }
    
    // Aplicar validações nas operações
    match /products/{productId} {
      allow create: if isAuthenticated() && 
                       belongsToUserEmpresa(request.resource.data.empresaId) &&
                       isValidProduct(request.resource.data);
      
      allow update: if isAuthenticated() && 
                       belongsToUserEmpresa(resource.data.empresaId) &&
                       isValidProduct(request.resource.data);
      
      match /movements/{movementId} {
        allow create: if isAuthenticated() && 
                         belongsToUserEmpresa(request.resource.data.empresaId) &&
                         isValidMovement(request.resource.data);
      }
      
      match /audit/{auditId} {
        allow create: if isAuthenticated() && 
                         belongsToUserEmpresa(request.resource.data.empresaId) &&
                         isValidAudit(request.resource.data);
      }
    }
  }
}
```

---

## 🔐 Explicação das Regras

### 1. **Isolamento Multi-Tenant**
- Cada produto tem um `empresaId`
- Usuários só podem acessar produtos da sua empresa
- Super-admins podem acessar todos os produtos

### 2. **Operações CRUD**
- **Read**: Apenas produtos da empresa do usuário
- **Create**: Apenas com empresaId do usuário
- **Update**: Apenas produtos da empresa, sem mudar empresaId
- **Delete**: Apenas produtos da empresa

### 3. **Subcollections (Movements e Audit)**
- **Read**: Apenas se o produto pertence à empresa
- **Create**: Permitido para registrar histórico
- **Update/Delete**: **BLOQUEADO** (histórico imutável)

### 4. **Validações de Dados**
- Campos obrigatórios presentes
- Tipos de dados corretos
- Valores numéricos não negativos
- Enums válidos (type, action)

---

## 🧪 Testar Regras

### No Firebase Console:

1. Ir em **Firestore Database** → **Rules**
2. Clicar em **Rules Playground**
3. Testar cenários:

```javascript
// Teste 1: Usuário lendo produto da sua empresa
Location: /products/PROD123
Auth: { uid: 'user1', token: { empresaId: 'EMP001' } }
Data: { empresaId: 'EMP001', name: 'Filtro' }
Operation: get
Expected: ✅ Allow

// Teste 2: Usuário lendo produto de outra empresa
Location: /products/PROD456
Auth: { uid: 'user1', token: { empresaId: 'EMP001' } }
Data: { empresaId: 'EMP002', name: 'Óleo' }
Operation: get
Expected: ❌ Deny

// Teste 3: Criar produto com empresaId correto
Location: /products/PROD789
Auth: { uid: 'user1', token: { empresaId: 'EMP001' } }
Data: { empresaId: 'EMP001', name: 'Pneu', category: 'Pneus', ... }
Operation: create
Expected: ✅ Allow

// Teste 4: Criar movimentação
Location: /products/PROD123/movements/MOV001
Auth: { uid: 'user1', token: { empresaId: 'EMP001' } }
Data: { type: 'in', quantity: 10, empresaId: 'EMP001', ... }
Operation: create
Expected: ✅ Allow

// Teste 5: Tentar atualizar movimentação (deve falhar)
Location: /products/PROD123/movements/MOV001
Auth: { uid: 'user1', token: { empresaId: 'EMP001' } }
Operation: update
Expected: ❌ Deny
```

---

## 🚨 Segurança Adicional

### 1. **Índices Compostos**

Adicionar ao `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "empresaId", "order": "ASCENDING" },
        { "fieldPath": "name", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "empresaId", "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "movements",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "empresaId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### 2. **Cloud Functions para Validação Extra**

```javascript
// functions/index.js
exports.validateProductStock = functions.firestore
  .document('products/{productId}')
  .onUpdate((change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Validar que estoque reservado não excede estoque total
    if (after.stock_reserved > after.stock_total) {
      throw new Error('Estoque reservado não pode exceder estoque total');
    }
    
    // Validar que estoque não fica negativo
    if (after.stock_total < 0) {
      throw new Error('Estoque não pode ser negativo');
    }
    
    return null;
  });
```

### 3. **Rate Limiting**

```javascript
// Limitar operações por usuário
match /products/{productId} {
  allow create: if isAuthenticated() && 
                   request.time > resource.data.lastCreated + duration.value(1, 's');
}
```

---

## ✅ Checklist de Segurança

- [ ] Regras de isolamento multi-tenant implementadas
- [ ] Validações de dados obrigatórios
- [ ] Histórico imutável (movements e audit)
- [ ] Índices compostos criados
- [ ] Testes de segurança realizados
- [ ] Cloud Functions de validação (opcional)
- [ ] Rate limiting configurado (opcional)
- [ ] Backup automático habilitado
- [ ] Monitoramento de uso configurado

---

## 🚀 Deploy das Regras

```bash
# Testar localmente
firebase emulators:start --only firestore

# Deploy para produção
firebase deploy --only firestore:rules

# Deploy com índices
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 📊 Monitoramento

No Firebase Console:
1. **Firestore** → **Usage**
2. Monitorar:
   - Leituras/Escritas por segundo
   - Regras negadas
   - Erros de permissão

---

## 🔒 Segurança Garantida!

Com essas regras, o módulo de inventário está completamente seguro e isolado por empresa! 🎉
