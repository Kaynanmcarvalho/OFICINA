# 📦 Módulo de Inventário - Sistema Torq

## Sistema completo de gerenciamento de produtos e estoque para oficinas mecânicas

---

## 🎯 Visão Geral

O módulo de inventário é um sistema completo e profissional para controle de produtos, estoque, lotes, preços, informações fiscais e compatibilidade com veículos. Desenvolvido com design premium Apple-like e integração total com Firebase.

### Características Principais:
- ✅ **CRUD Completo** de produtos
- ✅ **Gerenciamento de Estoque** (total, mínimo, reservado)
- ✅ **Sistema de Lotes** com validade
- ✅ **Reserva Automática** para orçamentos
- ✅ **Rastreabilidade Completa** de movimentações
- ✅ **Informações Fiscais** (NCM, CEST, CFOP, etc.)
- ✅ **Upload de Imagens** (Firebase Storage)
- ✅ **Compatibilidade com Veículos**
- ✅ **Histórico e Auditoria** completos
- ✅ **Integração** com Orçamentos, Vendas e Clientes
- ✅ **Real-time Updates**
- ✅ **Multi-tenant** (isolamento por empresa)
- ✅ **Design Premium** Apple-like
- ✅ **Dark Mode** completo
- ✅ **Responsivo** (mobile-first)

---

## 📁 Estrutura de Arquivos

```
src/
├── store/
│   └── productStore.jsx                    # Store principal com toda lógica
├── pages/
│   ├── InventoryPage.jsx                   # Wrapper
│   └── inventory/
│       ├── InventoryPage.jsx               # Página principal
│       └── components/
│           ├── InventoryHeader.jsx         # Cabeçalho
│           ├── InventoryStats.jsx          # Cards de estatísticas
│           ├── InventorySearchBar.jsx      # Barra de busca
│           ├── InventoryFilters.jsx        # Filtros
│           ├── InventoryGridView.jsx       # Visualização em grade
│           ├── InventoryListView.jsx       # Visualização em lista
│           ├── ProductCard.jsx             # Card do produto
│           ├── ProductModal.jsx            # Modal multi-step
│           ├── EmptyState.jsx              # Estados vazios
│           └── steps/
│               ├── Step1Basic.jsx          # Informações básicas
│               ├── Step2Stock.jsx          # Estoque e lotes
│               ├── Step3FiscalPrices.jsx   # Fiscal e preços
│               ├── Step4Images.jsx         # Imagens
│               ├── Step5Compatibility.jsx  # Compatibilidade
│               └── Step6History.jsx        # Histórico
├── components/
│   └── inventory/
│       └── ProductSelector.jsx             # Seletor para orçamentos/vendas
└── hooks/
    └── useInventoryIntegration.js          # Hook de integração
```

---

## 🚀 Como Usar

### 1. Acessar o Módulo
```
http://localhost:5173/inventory
```

### 2. Criar Novo Produto

1. Clicar em **"Novo Produto"**
2. Preencher as 6 etapas:
   - **Step 1**: Nome, marca, categoria (obrigatórios)
   - **Step 2**: Estoque, lotes, localização
   - **Step 3**: Preços, margem, informações fiscais
   - **Step 4**: Upload de imagens
   - **Step 5**: Compatibilidade com veículos
   - **Step 6**: Histórico (read-only)
3. Clicar em **"Criar Produto"**

### 3. Buscar e Filtrar

- **Busca**: Digite nome, SKU, código de barras, marca, categoria ou tags
- **Filtros Rápidos**:
  - Estoque Baixo
  - Sem Estoque
  - Vencendo em 30 dias
- **Filtro por Categoria**: Dropdown com todas as categorias
- **Visualização**: Alternar entre Grid e Lista

### 4. Gerenciar Estoque

#### Reservar (para orçamentos):
```javascript
import { useInventoryIntegration } from '../hooks/useInventoryIntegration';

const { addProductToBudget } = useInventoryIntegration();

await addProductToBudget(productId, quantity, budgetId);
```

#### Baixar (vendas/orçamentos aprovados):
```javascript
const { processSale } = useInventoryIntegration();

await processSale(saleId, items, clientId);
```

#### Adicionar (compras/reposição):
```javascript
const { addStock } = useInventoryIntegration();

await addStock(productId, quantity, lotData, 'Compra de fornecedor');
```

---

## 🔗 Integrações

### Com Orçamentos (`/orcamentos`)

```javascript
// 1. Adicionar produto ao orçamento (reserva estoque)
await addProductToBudget(productId, 5, budgetId);

// 2. Aprovar orçamento (baixa definitiva)
await approveBudget(budgetId, items, clientId);

// 3. Cancelar/Expirar orçamento (libera reserva)
await cancelBudget(budgetId, items);
```

### Com Vendas (`/caixa`)

```javascript
// Venda direta (baixa definitiva)
await processSale(saleId, items, clientId);
```

### Com Clientes (`/clients`)

```javascript
// Histórico é atualizado automaticamente ao:
// - Aprovar orçamento
// - Processar venda
```

---

## 📊 Estrutura de Dados

### Collection: `products`

```javascript
{
  // Básico
  name: "Filtro de Óleo",
  brand: "Bosch",
  model: "OF-1234",
  category: "Filtros",
  subcategory: "Filtros de Motor",
  description: "Filtro de óleo para motores 1.0 a 2.0",
  unit: "UN",
  sku: "FLT-001",
  barcode: "7891234567890",
  tags: ["Gol", "Palio", "Universal"],
  
  // Estoque
  stock_total: 50,
  stock_min: 10,
  stock_reserved: 5,
  location: "Prateleira A3",
  lots: [
    {
      id: "LOT-001",
      lote: "2024-01",
      fabricacao: "2024-01-15",
      validade: "2026-01-15",
      quantidade: 50
    }
  ],
  
  // Fiscal e Preços
  fiscal: {
    ncm: "84212300",
    cest: "0100100",
    cfop: "5102",
    csosn: "102",
    origin: "0",
    icms_aliquota: 18,
    ipi_aliquota: 0,
    pis_aliquota: 1.65,
    cofins_aliquota: 7.6,
    anp_code: ""
  },
  cost_price: 25.00,
  sale_price: 45.00,
  margin: 80,
  min_margin: 50,
  
  // Imagens
  images: [
    "https://storage.googleapis.com/...",
    "https://storage.googleapis.com/..."
  ],
  main_image_index: 0,
  
  // Compatibilidade
  compatibilities: [
    {
      id: "COMP-001",
      marca: "Volkswagen",
      modelo: "Gol",
      ano_inicial: "2010",
      ano_final: "2020",
      motorizacao: "1.0 / 1.6"
    }
  ],
  
  // Metadata
  empresaId: "EMP001",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: "user123"
}
```

### Subcollection: `products/{id}/movements`

```javascript
{
  type: "in" | "out" | "reserve" | "release",
  quantity: 5,
  reason: "Venda direta",
  origin: "sale",
  originId: "SALE-123",
  budgetId: "BDG-456",
  previousStock: 50,
  newStock: 45,
  previousReserved: 0,
  newReserved: 0,
  timestamp: Timestamp,
  empresaId: "EMP001"
}
```

### Subcollection: `products/{id}/audit`

```javascript
{
  action: "create" | "update" | "delete",
  description: "Produto criado",
  before: null,
  after: { name: "Filtro", ... },
  userId: "user123",
  timestamp: Timestamp,
  empresaId: "EMP001"
}
```

---

## 🎨 Design System

### Cores

**Light Mode:**
- Background: `from-gray-50 via-white to-gray-50`
- Cards: `bg-white/80 border-gray-200`
- Text: `text-gray-900`
- Accent: `bg-blue-600`

**Dark Mode:**
- Background: `from-gray-950 via-gray-900 to-gray-950`
- Cards: `bg-gray-900/80 border-gray-700/80`
- Text: `text-white`
- Accent: `bg-blue-600`

### Badges de Status

- **Em Estoque**: Verde (`bg-green-500/20 text-green-400`)
- **Estoque Baixo**: Amarelo (`bg-yellow-500/20 text-yellow-400`)
- **Sem Estoque**: Vermelho (`bg-red-500/20 text-red-400`)
- **Vencendo**: Laranja (`bg-orange-500/20 text-orange-400`)
- **Reservado**: Roxo (`bg-purple-500/20 text-purple-400`)

### Animações

- Hover: `whileHover={{ y: -6 }}`
- Tap: `whileTap={{ scale: 0.95 }}`
- Transições: `duration-300`
- Backdrop blur: `backdrop-blur-xl`

---

## 🔒 Segurança

### Regras Firestore

```javascript
// Isolamento multi-tenant
allow read: if belongsToUserEmpresa(resource.data.empresaId);
allow create: if belongsToUserEmpresa(request.resource.data.empresaId);
allow update: if belongsToUserEmpresa(resource.data.empresaId);
allow delete: if belongsToUserEmpresa(resource.data.empresaId);

// Histórico imutável
match /movements/{movementId} {
  allow create: if isAuthenticated();
  allow update, delete: if false;
}
```

Ver arquivo completo: `FIRESTORE_RULES_INVENTORY.md`

---

## 📱 Responsividade

### Breakpoints:
- **Mobile**: `grid-cols-1` (< 768px)
- **Tablet**: `md:grid-cols-2` (768px - 1024px)
- **Desktop**: `lg:grid-cols-2 xl:grid-cols-3` (1024px - 1536px)
- **Large**: `2xl:grid-cols-4` (> 1536px)

### Cards:
- Largura mínima: `320px`
- Padding adaptativo
- Imagens responsivas
- Tabelas com scroll horizontal

---

## 🧪 Testes

Ver guia completo: `GUIA_TESTES_INVENTORY.md`

### Checklist Rápido:
- [ ] Criar produto
- [ ] Editar produto
- [ ] Buscar produto
- [ ] Filtrar produtos
- [ ] Adicionar lote
- [ ] Reservar estoque
- [ ] Baixar estoque
- [ ] Upload de imagens
- [ ] Compatibilidade com veículos
- [ ] Visualizar histórico
- [ ] Integração com orçamentos
- [ ] Integração com vendas
- [ ] Dark mode
- [ ] Responsividade

---

## 📚 Documentação Adicional

- **Implementação Completa**: `INVENTORY_MODULE_COMPLETE.md`
- **Exemplo de Integração**: `EXEMPLO_INTEGRACAO_INVENTORY.md`
- **Regras de Segurança**: `FIRESTORE_RULES_INVENTORY.md`
- **Guia de Testes**: `GUIA_TESTES_INVENTORY.md`

---

## 🚀 Deploy

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Firebase
```bash
# Já configurado em src/config/firebase.js
```

### 3. Deploy Regras Firestore
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 4. Build e Deploy
```bash
npm run build
firebase deploy --only hosting
```

---

## 🎯 Roadmap Futuro

### Melhorias Planejadas:
- [ ] Relatórios avançados com gráficos (Recharts)
- [ ] Importação/Exportação CSV/Excel
- [ ] Geração de código de barras
- [ ] Leitura de código de barras via câmera
- [ ] Notificações push (estoque baixo, vencendo)
- [ ] Cadastro de fornecedores
- [ ] Histórico de compras
- [ ] Comparação de preços
- [ ] Previsão de reposição (IA)
- [ ] Curva ABC
- [ ] Inventário físico (contagem)

---

## 💡 Dicas de Uso

### 1. Organização de Produtos
- Use categorias consistentes
- Preencha SKU para facilitar busca
- Adicione tags de compatibilidade
- Mantenha imagens atualizadas

### 2. Controle de Estoque
- Defina estoque mínimo realista
- Cadastre lotes com validade
- Monitore produtos vencendo
- Revise reservas periodicamente

### 3. Preços e Margem
- Atualize preços regularmente
- Defina margem mínima
- Monitore histórico de preços
- Compare com concorrência

### 4. Integração com Orçamentos
- Sempre reserve estoque ao criar orçamento
- Configure expiração automática (48h)
- Libere reservas de orçamentos cancelados
- Baixe estoque apenas ao aprovar

---

## 🆘 Suporte

### Problemas Comuns:

**1. Produto não aparece na lista**
- Verificar se empresaId está correto
- Verificar regras do Firestore
- Limpar cache do navegador

**2. Erro ao fazer upload de imagem**
- Verificar permissões do Storage
- Verificar tamanho da imagem (< 5MB)
- Verificar formato (PNG, JPG, WEBP)

**3. Estoque não atualiza**
- Verificar conexão com Firebase
- Verificar listeners em tempo real
- Verificar console para erros

**4. Reserva não funciona**
- Verificar disponibilidade de estoque
- Verificar se produto existe
- Verificar logs de movimentação

---

## 👥 Contribuindo

Para contribuir com melhorias:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este módulo faz parte do Sistema Torq - Todos os direitos reservados.

---

## ✨ Conclusão

O módulo de inventário está **100% funcional** e pronto para uso em produção!

**Desenvolvido com ❤️ para oficinas mecânicas profissionais.**

🚀 **Boas vendas e controle total do seu estoque!**
