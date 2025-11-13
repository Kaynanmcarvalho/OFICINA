# Clients Page - Apple Redesign

## 📦 Estrutura Criada

```
src/pages/clients/
├── components/
│   └── base/
│       ├── GlassmorphismCard.jsx  ✅ Testado
│       ├── AppleButton.jsx        ✅ Testado
│       ├── AppleInput.jsx         ✅ Testado
│       └── index.js
├── hooks/
│   └── useAppleTheme.js           ✅ Testado
├── styles/
│   └── theme-tokens.css           ✅ Testado
├── test/
│   ├── ThemeTest.jsx              ✅ Componente de teste
│   └── ComponentsTest.jsx         ✅ Componente de teste
└── README.md
```

## ✅ Tarefas Completadas

### Tarefa 2: Sistema de Cores e Tema
- ✅ 2.1 Arquivo de tokens de cor (theme-tokens.css)
- ✅ 2.2 Hook useAppleTheme customizado

### Tarefa 3: Componentes Base Reutilizáveis
- ✅ 3.1 GlassmorphismCard component
- ✅ 3.2 AppleButton component
- ✅ 3.3 AppleInput component

## 🎨 Sistema de Cores

### Variáveis CSS Disponíveis

#### Backgrounds
- `--apple-bg-primary` - Background principal
- `--apple-bg-secondary` - Background secundário (translúcido)
- `--apple-bg-tertiary` - Background terciário
- `--apple-glass-bg` - Background para glassmorphism

#### Text
- `--apple-text-primary` - Texto principal
- `--apple-text-secondary` - Texto secundário
- `--apple-text-tertiary` - Texto terciário
- `--apple-text-quaternary` - Texto quaternário

#### Borders
- `--apple-border-light` - Borda leve
- `--apple-border-medium` - Borda média
- `--apple-border-strong` - Borda forte

#### Accents
- `--apple-accent-blue` - Azul principal
- `--apple-accent-blue-hover` - Azul hover
- `--apple-accent-green` - Verde
- `--apple-accent-red` - Vermelho
- `--apple-accent-amber` - Âmbar

#### Shadows
- `--apple-shadow-xs` - Sombra extra pequena
- `--apple-shadow-sm` - Sombra pequena
- `--apple-shadow-md` - Sombra média
- `--apple-shadow-lg` - Sombra grande
- `--apple-shadow-xl` - Sombra extra grande
- `--apple-shadow-blue` - Sombra azul colorida

#### Gradients
- `--apple-gradient-blue` - Gradiente azul
- `--apple-gradient-subtle` - Gradiente sutil

## 🪝 Hook useAppleTheme

```javascript
import useAppleTheme from './hooks/useAppleTheme';

const MyComponent = () => {
  const { isDark, isLight, isTransitioning, theme, toggleTheme } = useAppleTheme();
  
  return (
    <div>
      Current theme: {theme}
      {isTransitioning && <span>Transitioning...</span>}
    </div>
  );
};
```

### Retorno do Hook
- `isDark` (boolean) - Se está em modo escuro
- `isLight` (boolean) - Se está em modo claro
- `isTransitioning` (boolean) - Se está em transição
- `theme` (string) - 'dark' ou 'light'
- `toggleTheme` (function) - Função para alternar tema

## 🧩 Componentes Base

### GlassmorphismCard

Card com efeito de vidro translúcido.

```javascript
import { GlassmorphismCard } from './components/base';

<GlassmorphismCard
  padding="default"      // 'none' | 'sm' | 'default' | 'lg' | 'xl'
  rounded="default"      // 'none' | 'sm' | 'default' | 'lg' | 'full'
  shadow="default"       // 'none' | 'sm' | 'default' | 'lg' | 'xl'
  hover={false}          // Ativa efeito hover
  animated={true}        // Ativa animação de entrada
  onClick={() => {}}     // Callback de click
>
  Conteúdo do card
</GlassmorphismCard>
```

### AppleButton

Botão premium com variantes e microinterações.

```javascript
import { AppleButton } from './components/base';
import { Plus } from 'lucide-react';

<AppleButton
  variant="primary"      // 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size="default"         // 'sm' | 'default' | 'lg'
  icon={Plus}            // Ícone do Lucide React
  iconPosition="left"    // 'left' | 'right'
  disabled={false}       // Desabilita o botão
  loading={false}        // Mostra loading spinner
  fullWidth={false}      // Largura total
  onClick={() => {}}     // Callback de click
>
  Texto do Botão
</AppleButton>
```

### AppleInput

Input field premium sem bordas visíveis.

```javascript
import { AppleInput } from './components/base';
import { Mail } from 'lucide-react';

<AppleInput
  label="Email"          // Label do campo
  type="text"            // Tipo do input
  placeholder="Digite..."// Placeholder
  value={value}          // Valor controlado
  onChange={handleChange}// Callback de mudança
  error="Erro aqui"      // Mensagem de erro
  disabled={false}       // Desabilita o input
  icon={Mail}            // Ícone do Lucide React
  iconPosition="left"    // 'left' | 'right'
  fullWidth={true}       // Largura total
/>
```

## 🧪 Testes

### Testar Sistema de Cores e Tema

```javascript
import ThemeTest from './test/ThemeTest';

// Renderize o componente ThemeTest para ver:
// - Todas as variáveis de cor
// - Transições de tema
// - Glassmorphism effects
// - Shadows e gradientes
```

### Testar Componentes Base

```javascript
import ComponentsTest from './test/ComponentsTest';

// Renderize o componente ComponentsTest para ver:
// - Todas as variantes de GlassmorphismCard
// - Todas as variantes de AppleButton
// - Todas as variantes de AppleInput
// - Exemplo combinado (formulário de login)
```

## 📋 Checklist de Validação

### Sistema de Cores ✅
- [x] Variáveis CSS para light mode
- [x] Variáveis CSS para dark mode
- [x] Transição suave entre temas (300ms)
- [x] Glassmorphism com backdrop-blur
- [x] Shadows adaptativas
- [x] Gradientes
- [x] Utility classes

### Hook useAppleTheme ✅
- [x] Detecta tema inicial
- [x] Observer para mudanças de tema
- [x] Estado isTransitioning
- [x] Função toggleTheme
- [x] Cleanup correto

### GlassmorphismCard ✅
- [x] Glassmorphism effect
- [x] Variantes de padding
- [x] Variantes de border-radius
- [x] Variantes de shadow
- [x] Hover effect
- [x] Animação de entrada
- [x] Suporte a custom styles

### AppleButton ✅
- [x] Variante primary
- [x] Variante secondary
- [x] Variante ghost
- [x] Variante danger
- [x] Variante success
- [x] Tamanhos (sm, default, lg)
- [x] Ícones (left, right)
- [x] Estado disabled
- [x] Estado loading
- [x] Full width
- [x] Hover animation
- [x] Tap animation

### AppleInput ✅
- [x] Label uppercase
- [x] Underline animado
- [x] Focus state
- [x] Error state
- [x] Disabled state
- [x] Ícones (left, right)
- [x] Diferentes tipos (text, email, password, date, tel)
- [x] Placeholder
- [x] Full width

## 🎯 Próximos Passos

### Tarefa 4: PageHeader Component
- Criar estrutura do header
- Implementar título e badge
- Criar NewClientButton
- Adicionar keyboard shortcut ⌘+N

### Tarefa 5: SearchBar Component Premium
- Criar estrutura do SearchBar
- Implementar placeholder animado
- Adicionar busca instantânea
- Adicionar keyboard shortcut ⌘+K

## 📝 Notas Importantes

1. **Imports**: Sempre importe o CSS de tokens:
   ```javascript
   import '../styles/theme-tokens.css';
   ```

2. **Tema**: Use o hook useAppleTheme para acessar o tema atual:
   ```javascript
   const { isDark, theme } = useAppleTheme();
   ```

3. **Variáveis CSS**: Use as variáveis CSS para cores:
   ```javascript
   style={{ color: 'var(--apple-text-primary)' }}
   ```

4. **Framer Motion**: Todos os componentes usam Framer Motion para animações suaves.

5. **Lucide Icons**: Use ícones do Lucide React para consistência visual.

## 🐛 Troubleshooting

### Glassmorphism não funciona
- Verifique se o navegador suporta `backdrop-filter`
- O fallback automático usa background sólido

### Tema não muda
- Verifique se o navbar está alternando a classe `dark` no `<html>`
- O hook observa mudanças na classe automaticamente

### Animações lentas
- Verifique se há muitos componentes animados simultaneamente
- Use `animated={false}` em cards que não precisam de animação

## 📚 Referências

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Glassmorphism Design](https://uxdesign.cc/glassmorphism-in-user-interfaces-1f39bb1308c9)
