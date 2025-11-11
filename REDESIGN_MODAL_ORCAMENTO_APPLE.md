# 🍎 Redesign Modal "Editar Orçamento" - Estilo Apple

## 🎯 Objetivo
Transformar o modal de orçamento em uma experiência premium, responsiva e elegante no mais puro estilo Apple.

---

## 📐 Estrutura Proposta

### Layout Responsivo Inteligente

```
┌─────────────────────────────────────────────────────────┐
│  [X]  Novo Orçamento                            [Salvar]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────────────────┐│
│  │   CLIENTE        │  │   VEÍCULO                    ││
│  │   [Buscar...]    │  │   [ABC-1234] [Buscar API]    ││
│  │   Nome           │  │   Marca  Modelo  Ano  Cor    ││
│  │   Telefone       │  │                              ││
│  │   Email          │  │                              ││
│  └──────────────────┘  └──────────────────────────────┘│
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │   ITENS DO ORÇAMENTO                               │ │
│  │   ┌──────────────────────────────────────────────┐ │ │
│  │   │ + Adicionar Item                             │ │ │
│  │   │   [Produto ▼] [Buscar...]                    │ │ │
│  │   │   Qtd: [1]  Preço: [R$ 0,00]                 │ │ │
│  │   └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │   Lista de Itens:                                 │ │
│  │   ┌────────────────────────────────────────────┐  │ │
│  │   │ 1. Óleo 5W30 - 4L    R$ 120,00  [Remover]  │  │ │
│  │   │ 2. Filtro de Óleo    R$  45,00  [Remover]  │  │ │
│  │   └────────────────────────────────────────────┘  │ │
│  │                                                    │ │
│  │   Total: R$ 165,00                                │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │   OBSERVAÇÕES                                      │ │
│  │   [Notas para o cliente...]                        │ │
│  │   [Notas internas...]                              │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Melhorias de Design

### 1. **Header Minimalista**
- Título grande e bold à esquerda
- Botão X discreto à direita
- Botão "Salvar" azul vibrante
- Sem bordas pesadas

### 2. **Seções em Cards Limpos**
- Cards com fundo suave
- Bordas finas e arredondadas (rounded-2xl)
- Espaçamento generoso
- Sombras sutis

### 3. **Inputs Premium**
- Background: `bg-white dark:bg-gray-800`
- Bordas: `border-gray-300 dark:border-gray-600`
- Rounded: `rounded-xl` ou `rounded-2xl`
- Focus: ring azul suave
- Placeholders em cinza médio
- Transições suaves (200ms)

### 4. **Botões Elegantes**
- Primário: Azul sólido com gradiente sutil
- Secundário: Cinza claro com borda
- Destrutivo: Vermelho suave
- Hover: elevação sutil
- Active: scale 0.98

### 5. **Lista de Itens Moderna**
- Cards individuais para cada item
- Hover effect suave
- Botão remover discreto
- Números em badges circulares
- Preços alinhados à direita

### 6. **Responsividade Inteligente**

#### Desktop (> 1024px)
- 2 colunas: Cliente | Veículo
- Itens em lista vertical
- Modal: max-w-6xl

#### Tablet (768px - 1024px)
- 2 colunas compactas
- Campos menores
- Modal: max-w-4xl

#### Mobile (< 768px)
- 1 coluna
- Stack vertical
- Modal: full width com padding
- Botões full width

---

## 🔤 Tipografia Apple

### Tamanhos
- **Título Modal**: `text-2xl font-bold`
- **Títulos de Seção**: `text-sm font-semibold uppercase tracking-wider`
- **Labels**: `text-sm font-medium`
- **Inputs**: `text-base`
- **Hints**: `text-xs text-gray-500`

### Pesos
- **Bold**: Títulos principais
- **Semibold**: Subtítulos e labels
- **Medium**: Inputs e texto normal
- **Regular**: Hints e descrições

---

## 🎨 Paleta de Cores

### Light Mode
- **Background Modal**: `white`
- **Background Cards**: `gray-50`
- **Inputs**: `white`
- **Bordas**: `gray-300`
- **Texto**: `gray-900`
- **Labels**: `gray-700`
- **Hints**: `gray-500`
- **Primary**: `blue-600`

### Dark Mode
- **Background Modal**: `gray-900`
- **Background Cards**: `gray-800/50`
- **Inputs**: `gray-800`
- **Bordas**: `gray-600`
- **Texto**: `white`
- **Labels**: `gray-300`
- **Hints**: `gray-400`
- **Primary**: `blue-500`

---

## 📱 Breakpoints

```css
/* Mobile First */
base: 0px - 640px (1 coluna)
sm: 640px - 768px (1 coluna)
md: 768px - 1024px (2 colunas compactas)
lg: 1024px - 1280px (2 colunas full)
xl: 1280px+ (2 colunas + espaçamento extra)
```

---

## ✨ Animações Sutis

### Entrada do Modal
```javascript
initial={{ opacity: 0, scale: 0.95, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
```

### Hover nos Cards
```javascript
whileHover={{ y: -2 }}
transition={{ duration: 0.15 }}
```

### Click nos Botões
```javascript
whileTap={{ scale: 0.98 }}
```

---

## 🔧 Melhorias Funcionais

### 1. **Busca de Cliente Melhorada**
- Dropdown com scroll suave
- Highlight no termo buscado
- Avatar do cliente
- Informações resumidas

### 2. **Busca de Produto Inteligente**
- Autocomplete rápido
- Mostra estoque disponível
- Badge de status (disponível/baixo/esgotado)
- Preço sugerido automático

### 3. **Validação em Tempo Real**
- Feedback visual imediato
- Mensagens de erro elegantes
- Ícones de status

### 4. **Cálculo Automático**
- Total atualizado em tempo real
- Formatação de moeda brasileira
- Destaque visual no total

---

## 🎯 Prioridades de Implementação

### Fase 1: Estrutura e Layout ✅
- [ ] Reorganizar seções em cards
- [ ] Implementar grid responsivo
- [ ] Ajustar espaçamentos

### Fase 2: Estilização ✅
- [ ] Aplicar tipografia Apple
- [ ] Atualizar cores e bordas
- [ ] Melhorar inputs e botões

### Fase 3: Responsividade ✅
- [ ] Testar em mobile
- [ ] Ajustar breakpoints
- [ ] Otimizar para tablets

### Fase 4: Animações ✅
- [ ] Adicionar transições suaves
- [ ] Implementar hover effects
- [ ] Polir interações

---

## 📝 Código de Referência

### Input Apple-Style
```jsx
<input
  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
/>
```

### Botão Primário
```jsx
<button
  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
>
  Salvar
</button>
```

### Card de Seção
```jsx
<div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
  {/* Conteúdo */}
</div>
```

---

**Design Apple autêntico - Elegante, Funcional e Responsivo** 🍎✨
