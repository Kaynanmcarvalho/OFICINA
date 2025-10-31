# Recent Records Premium Components

Uma coleção de componentes React premium para exibir registros recentes com design inspirado no Apple Human Interface Guidelines. Os componentes implementam glassmorphism, microinterações suaves e suporte completo para modo escuro.

## 🎨 Design Philosophy

- **Clarity**: Hierarquia de informações imediatamente aparente através de tipografia, espaçamento e cor
- **Depth**: Superfícies em camadas com glassmorphism e sombras criam relacionamentos espaciais naturais  
- **Deference**: A interface fica fora do caminho, deixando o conteúdo em destaque

## 📦 Components

### IconLoader
Componente utilitário para carregar ícones SVG dinamicamente.

```tsx
import IconLoader from './IconLoader';

<IconLoader 
  name="car" 
  size="md" 
  className="text-blue-600" 
/>
```

**Props:**
- `name`: string - Nome do ícone (car, motorcycle, truck, van, client, etc.)
- `size`: 'sm' | 'md' | 'lg' - Tamanho do ícone (20px, 24px, 28px)
- `className`: string - Classes CSS adicionais

### ItemAvatar
Avatar visual indicando tipo de entidade e status.

```tsx
import ItemAvatar from './ItemAvatar';

<ItemAvatar 
  type="car" 
  status="completed" 
  size="md" 
  showBadge={true} 
/>
```

**Props:**
- `type`: 'car' | 'motorcycle' | 'truck' | 'van' | 'client' - Tipo da entidade
- `status`: 'completed' - Status opcional para mostrar badge de concluído
- `size`: 'sm' | 'md' | 'lg' - Tamanho do avatar
- `showBadge`: boolean - Mostrar badge de status

### StatusPill
Badge em formato de pílula para exibir status com cores.

```tsx
import StatusPill from './StatusPill';

<StatusPill 
  status="in_progress" 
  showGlow={true} 
  size="md" 
/>
```

**Props:**
- `status`: 'in_progress' | 'completed' | 'pending' | 'cancelled' - Status do item
- `showGlow`: boolean - Aplicar efeito de brilho
- `size`: 'sm' | 'md' - Tamanho da pílula

### ItemMetaRow
Linha de metadados com placa, modelo, data e tags.

```tsx
import ItemMetaRow from './ItemMetaRow';

<ItemMetaRow
  plate="ABC-1234"
  model="Honda Civic"
  date={new Date()}
  tags={['Revisão', 'Urgente']}
  showRelativeTime={true}
/>
```

**Props:**
- `plate`: string - Placa do veículo
- `model`: string - Modelo do veículo
- `date`: Date - Data do registro
- `tags`: string[] - Tags do registro
- `showRelativeTime`: boolean - Mostrar tempo relativo

### ItemActions
Botões de ação rápida com menu contextual.

```tsx
import ItemActions from './ItemActions';

<ItemActions
  onOpen={() => console.log('Open')}
  onEdit={() => console.log('Edit')}
  onDuplicate={() => console.log('Duplicate')}
  onComplete={() => console.log('Complete')}
  onDelete={() => console.log('Delete')}
/>
```

**Props:**
- `onOpen`: () => void - Callback para abrir
- `onEdit`: () => void - Callback para editar
- `onDuplicate`: () => void - Callback para duplicar
- `onComplete`: () => void - Callback para marcar como concluído
- `onDelete`: () => void - Callback para excluir
- `disabled`: boolean - Desabilitar ações

### ContextMenu
Menu contextual com navegação por teclado.

```tsx
import ContextMenu from './ContextMenu';

const items = [
  {
    id: 'duplicate',
    label: 'Duplicar',
    icon: 'external-link',
    onClick: () => console.log('Duplicate'),
  },
  {
    id: 'delete',
    label: 'Excluir',
    icon: 'trash',
    onClick: () => console.log('Delete'),
    destructive: true,
  },
];

<ContextMenu
  items={items}
  position={{ x: 100, y: 200 }}
  isVisible={true}
  onClose={() => setVisible(false)}
/>
```

### RecentItem
Componente principal do card de registro.

```tsx
import RecentItem, { RecordItem } from './RecentItem';

const item: RecordItem = {
  id: '1',
  type: 'car',
  status: 'in_progress',
  primaryText: 'João Silva',
  secondaryText: 'Honda Civic 2020',
  plate: 'ABC-1234',
  model: 'Honda Civic',
  date: new Date(),
  tags: ['Revisão'],
};

<RecentItem
  item={item}
  isSelected={false}
  onSelect={(id) => console.log('Selected:', id)}
  onClick={() => console.log('Clicked')}
  onAction={(action) => console.log('Action:', action)}
  showCheckbox={false}
  delay={0}
/>
```

### RecentSkeleton
Placeholder de carregamento com animação shimmer.

```tsx
import RecentSkeleton from './RecentSkeleton';

<RecentSkeleton count={5} />
```

### EmptyState
Estado vazio com call-to-action.

```tsx
import EmptyState from './EmptyState';

<EmptyState
  searchQuery=""
  hasFilters={false}
  onClearFilters={() => console.log('Clear filters')}
  onCreateNew={() => console.log('Create new')}
/>
```

## 🎭 Animations

Os componentes utilizam Framer Motion para animações suaves:

- **Entry**: Fade in + slide up com delay escalonado
- **Hover**: Lift effect com sombra aumentada
- **Tap**: Scale down para feedback tátil
- **Exit**: Fade out + slide up

### Respeito por Preferências de Acessibilidade

```tsx
// Animações são desabilitadas automaticamente quando o usuário prefere movimento reduzido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

## 🎨 Design Tokens

### Cores

```css
/* Tipos de veículo */
--car-color: #3B82F6;      /* Blue */
--motorcycle-color: #F97316; /* Orange */
--truck-color: #A855F7;    /* Purple */
--van-color: #10B981;      /* Emerald */
--client-color: #737373;   /* Neutral */

/* Status */
--in-progress: #F59E0B;    /* Amber */
--completed: #10B981;      /* Emerald */
--pending: #3B82F6;        /* Blue */
--cancelled: #EF4444;      /* Red */
```

### Tipografia

```css
/* Tamanhos */
--text-xs: 11px;
--text-sm: 12px;
--text-base: 14px;
--text-md: 15px;
--text-lg: 16px;

/* Pesos */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Espaçamento

```css
/* Grid base de 8px */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

### Border Radius

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 20px;
--radius-3xl: 24px;
```

### Sombras

```css
/* Light mode */
--shadow-1: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-2: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-3: 0 8px 24px rgba(0, 0, 0, 0.12);

/* Dark mode */
--shadow-1-dark: 0 1px 3px rgba(0, 0, 0, 0.4);
--shadow-2-dark: 0 4px 12px rgba(0, 0, 0, 0.5);
--shadow-3-dark: 0 8px 24px rgba(0, 0, 0, 0.6);
```

## 🌙 Dark Mode

Todos os componentes suportam modo escuro automaticamente através de classes Tailwind:

```css
/* Light mode */
.bg-white/80 

/* Dark mode */
.dark:bg-gray-800/80
```

## ♿ Accessibility

### Keyboard Navigation
- **Tab**: Navegar entre elementos interativos
- **Enter/Space**: Ativar botões e selecionar itens
- **Escape**: Fechar menus e modais
- **Arrow Keys**: Navegar em menus dropdown

### ARIA Attributes
```tsx
// Exemplo de atributos ARIA aplicados
<div
  role="article"
  aria-label={`${item.primaryText}, ${item.status}`}
  tabIndex={0}
>

<span
  role="status"
  aria-label={`Status: ${statusText}`}
>
```

### Focus Management
- Indicadores de foco visíveis (2px outline)
- Ordem lógica de tabulação
- Trap de foco em modais

### Color Contrast
- Texto normal: mínimo 4.5:1
- Texto grande: mínimo 3:1
- Elementos interativos: mínimo 3:1

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 767px) {
  padding: 12px;
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  padding: 16px;
}

/* Desktop */
@media (min-width: 1024px) {
  padding: 24px;
}
```

### Touch Targets
- Mínimo 44px × 44px em dispositivos móveis
- Espaçamento adequado entre elementos interativos

## 🚀 Performance

### Otimizações Implementadas
- **Virtualization**: Para listas com mais de 30 itens
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoization**: React.memo para prevenir re-renders desnecessários
- **Debouncing**: Busca com delay de 300ms
- **SVG Optimization**: Ícones otimizados com SVGO

### Bundle Size
- Target: < 25KB gzipped
- Tree shaking habilitado
- Imports dinâmicos para componentes grandes

## 🧪 Testing

### Unit Tests
```bash
npm test -- --testPathPattern=recent
```

### Accessibility Tests
```bash
npm run test:a11y
```

### Visual Regression Tests
```bash
npm run test:visual
```

## 📖 Usage Examples

### Basic List
```tsx
import { RecentItem } from './components/recent';

const items = [
  // ... your items
];

return (
  <div className="space-y-3">
    {items.map((item, index) => (
      <RecentItem
        key={item.id}
        item={item}
        delay={index}
        onAction={handleAction}
      />
    ))}
  </div>
);
```

### With Loading State
```tsx
import { RecentSkeleton } from './components/recent';

return (
  <div>
    {isLoading ? (
      <RecentSkeleton count={5} />
    ) : (
      // ... render items
    )}
  </div>
);
```

### With Empty State
```tsx
import { EmptyState } from './components/recent';

return (
  <div>
    {items.length === 0 ? (
      <EmptyState
        onCreateNew={() => navigate('/create')}
      />
    ) : (
      // ... render items
    )}
  </div>
);
```

## 🔧 Customization

### Custom Themes
```tsx
// Extend the default theme
const customTheme = {
  colors: {
    primary: '#007AFF', // Apple Blue
    success: '#34C759', // Apple Green
    warning: '#FF9500', // Apple Orange
    error: '#FF3B30',   // Apple Red
  },
};
```

### Custom Icons
```tsx
// Add new icons to IconLoader
const customIcons = {
  'custom-icon': (
    <svg>
      {/* Your custom SVG */}
    </svg>
  ),
};
```

## 🐛 Troubleshooting

### Common Issues

**1. Animations not working**
```tsx
// Check if Framer Motion is installed
npm install framer-motion

// Verify reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

**2. Dark mode not applying**
```tsx
// Ensure dark class is on html element
document.documentElement.classList.add('dark');
```

**3. Icons not displaying**
```tsx
// Check if icon name exists in IconLoader
<IconLoader name="car" /> // ✅ Valid
<IconLoader name="invalid" /> // ❌ Will show default icon
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.