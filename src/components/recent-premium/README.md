# Recent Records Premium - Componentes

Sistema completo de Registros Recentes com design Apple-level premium.

## 🎨 Características

- **Glassmorphism**: Superfícies translúcidas com backdrop-blur
- **Microinterações**: Animações fluidas com Framer Motion
- **Dark Mode**: Suporte completo com transições suaves
- **Responsivo**: Desktop, tablet e mobile
- **Acessível**: WCAG AA compliant
- **Performático**: Virtualização para listas grandes

## 📦 Instalação

```bash
npm install framer-motion
```

## 🚀 Uso Básico

```tsx
import { RecentRecordsSection } from './components/recent-premium';

function App() {
  const items = [
    {
      id: '1',
      type: 'car',
      status: 'in_progress',
      primaryText: 'João Silva',
      secondaryText: 'Honda Civic 2020',
      plate: 'ABC1234',
      model: 'Civic',
      date: new Date(),
      tags: ['Urgente'],
    },
  ];

  return (
    <RecentRecordsSection
      items={items}
      onItemClick={(item) => console.log('Clicked:', item)}
      onItemAction={(action, item) => console.log(action, item)}
      onBulkAction={(action, items) => console.log(action, items)}
    />
  );
}
```

## 🎯 Props Principais

### RecentRecordsSection

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `items` | `RecordItem[]` | **required** | Array de registros |
| `isLoading` | `boolean` | `false` | Estado de carregamento |
| `error` | `Error \| null` | `null` | Erro a exibir |
| `onItemClick` | `(item) => void` | - | Callback ao clicar no item |
| `onItemAction` | `(action, item) => void` | - | Callback de ações |
| `onBulkAction` | `(action, items) => void` | - | Callback de ações em lote |
| `enablePreview` | `boolean` | `true` | Habilitar painel de preview |
| `enableBulkActions` | `boolean` | `true` | Habilitar seleção múltipla |

### RecordItem Type

```typescript
interface RecordItem {
  id: string;
  type: 'car' | 'motorcycle' | 'truck' | 'van' | 'client';
  status: 'in_progress' | 'completed' | 'pending' | 'cancelled';
  primaryText: string;
  secondaryText: string;
  plate?: string;
  model?: string;
  date: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}
```

## 🎨 Componentes Individuais

### ItemAvatar

```tsx
<ItemAvatar type="car" status="completed" size="md" />
```

### StatusPill

```tsx
<StatusPill status="in_progress" showGlow />
```

### ItemMetaRow

```tsx
<ItemMetaRow
  plate="ABC1234"
  model="Honda Civic"
  date={new Date()}
  tags={['Urgente']}
/>
```

### SearchBar

```tsx
<SearchBar
  value={query}
  onChange={setQuery}
  placeholder="Buscar..."
  debounceMs={300}
/>
```

### RecentFilters

```tsx
<RecentFilters
  filters={filters}
  onChange={setFilters}
  onClose={() => setShowFilters(false)}
/>
```

## 🎭 Estados

### Loading

```tsx
<RecentRecordsSection items={[]} isLoading={true} />
```

### Empty

```tsx
<RecentRecordsSection items={[]} />
```

### Error

```tsx
<RecentRecordsSection
  items={[]}
  error={new Error('Falha ao carregar')}
/>
```

## 🎨 Customização

### Tailwind Config

Importe a configuração customizada:

```js
// tailwind.config.js
const recentConfig = require('./src/components/recent-premium/tailwind.config');

module.exports = {
  ...recentConfig,
  // suas configurações
};
```

### Design Tokens

Os tokens estão em `design-tokens.json`:

- Cores (neutral, accent, success, warning, error)
- Tipografia (font-family, sizes, weights)
- Espaçamento (4px - 96px)
- Border radius (6px - 24px)
- Sombras (elevation 1-4)
- Animações (durações e easings)

## 🌙 Dark Mode

O componente detecta automaticamente o dark mode via classe `dark` no HTML:

```html
<html class="dark">
```

## ♿ Acessibilidade

- Navegação por teclado completa
- ARIA labels em todos os elementos interativos
- Contraste mínimo 4.5:1
- Focus indicators visíveis
- Screen reader friendly

### Atalhos de Teclado

- `Tab`: Navegar entre elementos
- `Enter/Space`: Ativar elemento focado
- `Escape`: Fechar modais/menus
- `Cmd/Ctrl + A`: Selecionar todos (quando focado na lista)

## 📱 Responsividade

### Desktop (>= 1024px)
- Layout de duas colunas opcional
- Preview panel inline

### Tablet (768px - 1023px)
- Lista única
- Preview em modal

### Mobile (< 768px)
- Lista única
- Itens expansíveis
- Swipe gestures para ações

## ⚡ Performance

- **Virtualização**: Ativa automaticamente para listas > 30 itens
- **Lazy Loading**: Preview panel carregado sob demanda
- **Debouncing**: Busca com delay de 300ms
- **Memoization**: Filtros e agrupamentos otimizados
- **Bundle Size**: < 25KB gzipped

## 🧪 Testes

```bash
# Unit tests
npm test

# Accessibility tests
npm run test:a11y

# Visual regression
npm run test:visual
```

## 📚 Exemplos Avançados

### Com Dados Reais

```tsx
import { useQuery } from 'react-query';
import { RecentRecordsSection } from './components/recent-premium';

function Dashboard() {
  const { data, isLoading, error } = useQuery('records', fetchRecords);

  return (
    <RecentRecordsSection
      items={data || []}
      isLoading={isLoading}
      error={error}
      onItemClick={(item) => navigate(`/records/${item.id}`)}
      onItemAction={(action, item) => {
        if (action === 'edit') navigate(`/records/${item.id}/edit`);
        if (action === 'delete') deleteRecord(item.id);
      }}
      onBulkAction={(action, items) => {
        if (action === 'complete') markAsComplete(items.map(i => i.id));
        if (action === 'delete') deleteRecords(items.map(i => i.id));
      }}
    />
  );
}
```

### Com Filtros Persistentes

```tsx
import { useState, useEffect } from 'react';

function Dashboard() {
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('recent-filters');
    return saved ? JSON.parse(saved) : { status: 'all', type: 'all', period: 'all' };
  });

  useEffect(() => {
    localStorage.setItem('recent-filters', JSON.stringify(filters));
  }, [filters]);

  return (
    <RecentRecordsSection
      items={items}
      onFilterChange={setFilters}
    />
  );
}
```

## 🐛 Troubleshooting

### Animações não funcionam

Certifique-se de ter o Framer Motion instalado:
```bash
npm install framer-motion
```

### Dark mode não funciona

Adicione a classe `dark` ao elemento HTML:
```js
document.documentElement.classList.add('dark');
```

### Estilos não aplicados

Verifique se o Tailwind está configurado corretamente e inclui os arquivos do componente:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/components/recent-premium/**/*.{ts,tsx}',
  ],
};
```

## 📄 Licença

MIT

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças maiores, abra uma issue primeiro.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
