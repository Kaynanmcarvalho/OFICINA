# 🔍 Busca de Produtos Premium - Modal de Orçamento

## ✅ Implementação Completa

Substituí o dropdown de produtos por uma **barra de busca elegante** que mostra produtos reais do inventário com quantidade disponível em tempo real.

## 🎨 Características

### 1. **Busca em Tempo Real**
- ✅ Filtra produtos do inventário (/inventory)
- ✅ Busca por nome, código ou categoria
- ✅ Mostra apenas produtos com estoque > 0
- ✅ Limita a 8 resultados

### 2. **Informações Completas**
- ✅ Nome do produto
- ✅ Código (se disponível)
- ✅ Preço em destaque
- ✅ Quantidade em estoque com badge colorido

### 3. **Badges de Estoque**
```javascript
// Verde: > 10 unidades
bg-green-100 text-green-700

// Amarelo: 1-10 unidades  
bg-yellow-100 text-yellow-700

// Vermelho: 0 unidades (não aparece na busca)
bg-red-100 text-red-700
```

### 4. **Layout Profissional**
- ✅ Grid 2 colunas (Tipo | Produto/Serviço)
- ✅ Labels minimalistas
- ✅ Ícone de lupa
- ✅ Dropdown elegante

## 💻 Código Implementado

### Estado
```javascript
const [productSearchTerm, setProductSearchTerm] = useState('');
const [showProductDropdown, setShowProductDropdown] = useState(false);
const [filteredProducts, setFilteredProducts] = useState([]);
```

### Busca de Produtos
```javascript
const handleProductSearch = (value) => {
  setProductSearchTerm(value);
  
  if (value.trim() === '') {
    setFilteredProducts([]);
    setShowProductDropdown(false);
    return;
  }

  const searchLower = value.toLowerCase();
  const filtered = parts.filter(part => 
    part.quantity > 0 && (
      part.name?.toLowerCase().includes(searchLower) ||
      part.code?.toLowerCase().includes(searchLower) ||
      part.category?.toLowerCase().includes(searchLower)
    )
  ).slice(0, 8);

  setFilteredProducts(filtered);
  setShowProductDropdown(filtered.length > 0);
};
```

### Seleção de Produto
```javascript
const handleProductSelect = (product) => {
  setCurrentItem(prev => ({
    ...prev,
    productId: product.firestoreId,
    name: product.name,
    price: product.price || 0,
    description: product.description || ''
  }));
  setProductSearchTerm(product.name);
  setShowProductDropdown(false);
};
```

## 🎨 Interface

### Input de Busca
```jsx
<input
  type="text"
  value={productSearchTerm}
  onChange={(e) => handleProductSearch(e.target.value)}
  placeholder="Buscar produto..."
  className="w-full px-3 py-2.5 pr-10 bg-white dark:bg-gray-900 
             border border-gray-300 dark:border-gray-600 
             rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50"
/>
```

### Item do Dropdown
```jsx
<button onClick={() => handleProductSelect(product)}>
  <div className="flex items-start justify-between gap-3">
    {/* Esquerda: Nome e Código */}
    <div className="flex-1">
      <div className="font-medium text-sm">{product.name}</div>
      <div className="text-xs text-gray-500">Código: {product.code}</div>
    </div>
    
    {/* Direita: Preço e Estoque */}
    <div className="flex flex-col items-end gap-1">
      <span className="text-sm font-semibold text-blue-600">
        R$ {product.price.toFixed(2)}
      </span>
      <span className="badge-estoque">
        {product.quantity} em estoque
      </span>
    </div>
  </div>
</button>
```

## 🎯 Badges de Estoque

### Verde (Estoque Alto)
```jsx
{product.quantity > 10 && (
  <span className="bg-green-100 dark:bg-green-900/30 
                   text-green-700 dark:text-green-400 
                   text-xs px-2 py-0.5 rounded-full">
    {product.quantity} em estoque
  </span>
)}
```

### Amarelo (Estoque Baixo)
```jsx
{product.quantity > 0 && product.quantity <= 10 && (
  <span className="bg-yellow-100 dark:bg-yellow-900/30 
                   text-yellow-700 dark:text-yellow-400 
                   text-xs px-2 py-0.5 rounded-full">
    {product.quantity} em estoque
  </span>
)}
```

## 🔄 Fluxo de Uso

### Adicionar Produto
```
1. Usuário seleciona "Produto" no tipo
   ↓
2. Campo de busca aparece
   ↓
3. Usuário digita: "Pneu"
   ↓
4. Dropdown mostra produtos com "Pneu" no nome
   ↓
5. Cada produto mostra:
   - Nome: "Pneu Firestone Aro 19"
   - Código: "PN-001"
   - Preço: R$ 450.00
   - Estoque: 15 em estoque (verde)
   ↓
6. Usuário clica no produto
   ↓
7. Campos preenchidos automaticamente:
   - Nome: "Pneu Firestone Aro 19"
   - Preço: 450.00
   - ProductId: "abc123"
```

### Adicionar Serviço
```
1. Usuário seleciona "Serviço" no tipo
   ↓
2. Campo de texto livre aparece
   ↓
3. Usuário digita: "Troca de óleo"
   ↓
4. Preenche quantidade e preço manualmente
```

## 📊 Filtros de Busca

### Por Nome
```javascript
"Pneu" → encontra "Pneu Firestone", "Pneu Michelin"
```

### Por Código
```javascript
"PN-001" → encontra produto com código PN-001
```

### Por Categoria
```javascript
"Freios" → encontra todos produtos da categoria Freios
```

### Apenas com Estoque
```javascript
// Automático: só mostra produtos com quantity > 0
parts.filter(part => part.quantity > 0)
```

## 🎨 Visual

### Dropdown de Produtos
```
┌─────────────────────────────────────────┐
│ Pneu Firestone Aro 19          R$ 450.00│
│ Código: PN-001          [15 em estoque] │
├─────────────────────────────────────────┤
│ Pneu Michelin Aro 17           R$ 380.00│
│ Código: PN-002           [8 em estoque] │
├─────────────────────────────────────────┤
│ Pneu Continental Aro 18        R$ 420.00│
│ Código: PN-003           [3 em estoque] │
└─────────────────────────────────────────┘
```

### Cores dos Badges
- 🟢 Verde: 15 em estoque (> 10)
- 🟡 Amarelo: 8 em estoque (1-10)
- 🟡 Amarelo: 3 em estoque (1-10)

## ✨ Validações

### Ao Adicionar Item
```javascript
// Verifica estoque disponível
if (currentItem.type === 'product' && currentItem.productId) {
  const product = parts.find(p => p.firestoreId === currentItem.productId);
  if (product && product.quantity < currentItem.quantity) {
    toast.error(`Estoque insuficiente! Disponível: ${product.quantity}`);
    return;
  }
}
```

### Feedback Visual
- ✅ Badge verde: Estoque confortável
- ⚠️ Badge amarelo: Estoque baixo (atenção)
- ❌ Não aparece: Sem estoque

## 🔧 Integração com Inventário

### Fonte de Dados
```javascript
// Busca produtos do inventoryStore
const { parts, fetchParts } = useInventoryStore();

// parts contém:
{
  firestoreId: "abc123",
  name: "Pneu Firestone Aro 19",
  code: "PN-001",
  category: "Pneus",
  price: 450.00,
  quantity: 15,
  description: "Pneu de alta performance"
}
```

### Atualização em Tempo Real
- ✅ Ao criar orçamento: estoque diminui
- ✅ Ao expirar orçamento: estoque volta
- ✅ Ao rejeitar item: estoque volta

## 📱 Responsividade

### Desktop
- Grid 2 colunas
- Dropdown largura total
- 8 produtos visíveis

### Mobile
- Grid 1 coluna (stack)
- Dropdown largura total
- Scroll suave

## ♿ Acessibilidade

- ✅ Labels descritivos
- ✅ Placeholder informativo
- ✅ Focus ring visível
- ✅ Contraste adequado
- ✅ Badges com cores distintas

## 🎯 Comparação

### Antes
```
❌ Dropdown estático
❌ Lista longa difícil de navegar
❌ Sem informação de estoque
❌ Sem busca
```

### Depois
```
✅ Busca em tempo real
✅ Filtra por nome/código/categoria
✅ Badge de estoque colorido
✅ Preço em destaque
✅ Apenas produtos disponíveis
✅ Máximo 8 resultados
✅ Visual premium
```

## 🎨 SVG do Empty State

```svg
<svg className="w-10 h-10 mx-auto text-gray-300" 
     fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
</svg>
```

## ✅ Checklist

- [x] Substituir dropdown por busca
- [x] Implementar busca em tempo real
- [x] Filtrar por nome, código e categoria
- [x] Mostrar apenas produtos com estoque
- [x] Limitar a 8 resultados
- [x] Criar dropdown elegante
- [x] Adicionar badges de estoque coloridos
- [x] Mostrar preço em destaque
- [x] Implementar seleção de produto
- [x] Fechar dropdown ao clicar fora
- [x] Adicionar empty state
- [x] Validar estoque ao adicionar
- [x] Integrar com inventoryStore

---

**Status**: ✅ Implementado e Funcional
**Fonte de Dados**: /inventory (tempo real)
**Data**: Novembro 2025
