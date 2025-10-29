# Logo Component

Sistema de logo dinâmico profissional que se adapta automaticamente ao tema do sistema (light/dark), com transições suaves e animações elegantes seguindo padrões Apple-like de design.

## Features

✨ **Adaptação Automática ao Tema** - Detecta e se adapta ao tema ativo (light/dark)  
🎨 **Transições Suaves** - Animações imperceptíveis entre mudanças de tema  
📱 **Totalmente Responsivo** - Adapta-se perfeitamente a qualquer tamanho de tela  
♿ **Acessível** - WCAG AAA compliant com suporte a leitores de tela  
⚡ **Otimizado** - Performance máxima com React.memo e GPU acceleration  
🎭 **Variantes** - Múltiplos tamanhos e variantes disponíveis  
🛡️ **Error Handling** - Error boundary com fallback elegante  

## Instalação

O componente já está instalado no projeto. Para usar, basta importar:

```jsx
import Logo from '../components/Logo';
// ou
import { Logo } from '../components/Logo';
```

## Uso Básico

### Logo Simples

```jsx
import Logo from '../components/Logo';

function Header() {
  return (
    <header>
      <Logo />
    </header>
  );
}
```

### Logo com Navegação

```jsx
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  
  return (
    <header>
      <Logo 
        onClick={() => navigate('/')}
        size="medium"
      />
    </header>
  );
}
```

### Logo Compacta (Mobile)

```jsx
<Logo 
  variant="compact"
  size="small"
/>
```

## API

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `size` | `'small' \| 'medium' \| 'large' \| 'auto'` | `'medium'` | Tamanho da logo |
| `variant` | `'full' \| 'compact' \| 'icon'` | `'full'` | Variante da logo |
| `onClick` | `function` | `undefined` | Callback executado ao clicar |
| `className` | `string` | `''` | Classes CSS adicionais |
| `animate` | `boolean` | `true` | Habilitar animação de entrada |
| `ariaLabel` | `string` | `undefined` | Label customizado para acessibilidade |

### Tamanhos

- **small**: 120x36px (mobile)
- **medium**: 160x48px (padrão)
- **large**: 200x60px (desktop)
- **auto**: Tamanho automático baseado no container

### Variantes

- **full**: Logo completa com texto
- **compact**: Apenas ícone (ideal para mobile)
- **icon**: Versão minimalista

## Exemplos Avançados

### Logo com Error Boundary

```jsx
import { Logo, LogoErrorBoundary } from '../components/Logo';
import { useThemeStore } from '../store';

function Header() {
  const { isDarkMode } = useThemeStore();
  
  return (
    <LogoErrorBoundary 
      isDarkMode={isDarkMode}
      onError={(error) => console.error('Logo error:', error)}
    >
      <Logo size="large" />
    </LogoErrorBoundary>
  );
}
```

### Logo Responsiva

```jsx
import Logo from '../components/Logo';
import { useMediaQuery } from '../hooks/useMediaQuery';

function Header() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <Logo 
      size={isMobile ? 'small' : 'medium'}
      variant={isMobile ? 'compact' : 'full'}
    />
  );
}
```

### Logo com Animação Customizada

```jsx
<Logo 
  animate={true}
  className="custom-logo-animation"
/>
```

## Temas

A logo se adapta automaticamente ao tema ativo:

- **Tema Light**: Logo preta em fundo claro
- **Tema Dark**: Logo branca em fundo escuro

A transição entre temas é suave (200ms) com easing cubic-bezier.

## Acessibilidade

O componente segue as melhores práticas de acessibilidade:

- ✅ Atributos ARIA apropriados
- ✅ Suporte a navegação por teclado (Tab, Enter, Space)
- ✅ Labels descritivos para leitores de tela
- ✅ Contraste WCAG AAA
- ✅ Focus ring visível
- ✅ Respeita `prefers-reduced-motion`

### Navegação por Teclado

- **Tab**: Navegar até a logo (se clicável)
- **Enter/Space**: Executar ação de clique
- **Esc**: Remover foco

## Performance

O componente é otimizado para máxima performance:

- React.memo para evitar re-renders desnecessários
- useMemo para cálculos de dimensões
- useCallback para event handlers
- GPU acceleration com transform3d
- will-change durante transições
- Lazy loading inteligente

## Responsividade

Breakpoints automáticos:

```css
/* Desktop */
@media (min-width: 1024px) {
  /* Tamanho padrão */
}

/* Tablet */
@media (max-width: 768px) {
  /* Tamanho reduzido */
}

/* Mobile */
@media (max-width: 480px) {
  /* Tamanho compacto */
}
```

## Customização

### CSS Customizado

```jsx
<Logo 
  className="my-custom-logo"
  style={{ marginLeft: '20px' }}
/>
```

```css
.my-custom-logo {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}
```

### CSS Variables

O componente respeita as seguintes CSS variables:

```css
:root {
  --focus-ring-color: #3b82f6;
}
```

## Troubleshooting

### Logo não aparece

Verifique se o tema está configurado corretamente:

```jsx
import { useThemeStore } from '../store';

const { isDarkMode } = useThemeStore();
console.log('Tema atual:', isDarkMode ? 'dark' : 'light');
```

### Animação não funciona

Verifique se `prefers-reduced-motion` não está ativo:

```jsx
<Logo animate={true} />
```

### Erro ao renderizar

O Error Boundary captura automaticamente erros e exibe fallback:

```jsx
<LogoErrorBoundary>
  <Logo />
</LogoErrorBoundary>
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari 14+
- ✅ Chrome Android 90+

## Changelog

### v1.0.0 (2024)

- ✨ Implementação inicial
- 🎨 Suporte a temas light/dark
- 📱 Responsividade completa
- ♿ Acessibilidade WCAG AAA
- ⚡ Otimizações de performance
- 🛡️ Error boundary

## Licença

Este componente faz parte do sistema ReparoFácil.

## Suporte

Para dúvidas ou problemas, consulte a documentação do projeto ou entre em contato com a equipe de desenvolvimento.
