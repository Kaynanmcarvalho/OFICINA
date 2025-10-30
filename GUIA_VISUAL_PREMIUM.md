# 👁️ Guia Visual Premium - Dark Mode

## 🎨 Estrutura Visual

### Layout Geral (Dark Mode)
```
┌─────────────────────────────────────────────────────────┐
│  Fundo: Gradiente Preto/Cinza Escuro                   │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Container Branco Elegante (Estilo Apple)         │ │
│  │  Sombra: Dramática e Profunda                     │ │
│  │  Bordas: Super Arredondadas (2rem)                │ │
│  │                                                    │ │
│  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │ │
│  │  ┃ Ring Verde Gradiente (Blur)                ┃  │ │
│  │  ┃  ┌────────────────────────────────────┐   ┃  │ │
│  │  ┃  │ Card Preto Premium                 │   ┃  │ │
│  │  ┃  │ Gradiente: gray-900 → black        │   ┃  │ │
│  │  ┃  │ Texto: Branco                      │   ┃  │ │
│  │  ┃  │ Sombra: XL + Verde                 │   ┃  │ │
│  │  ┃  └────────────────────────────────────┘   ┃  │ │
│  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │ │
│  │                                                    │ │
│  │  ┌────────────────────────────────────────────┐  │ │
│  │  │ Card Preto Premium (Não Selecionado)      │  │ │
│  │  │ Sem Ring                                   │  │ │
│  │  │ Sombra: XL                                 │  │ │
│  │  └────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Cores e Gradientes

### Container Principal (Dark Mode)
```css
Fundo: #FFFFFF (Branco puro)
Texto Título: #111827 (gray-900)
Borda: rgba(209, 213, 219, 0.2)
Sombra: 0 20px 60px -15px rgba(0, 0, 0, 0.5)
Border Radius: 2rem (32px)
```

### Card Preto Premium
```css
Fundo: linear-gradient(
  to bottom right,
  #111827,  /* gray-900 */
  #000000,  /* black */
  #111827   /* gray-900 */
)
Texto: #FFFFFF (white)
Borda: rgba(55, 65, 81, 0.3) /* gray-700/30 */
Sombra Normal: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
Sombra Hover: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
Border Radius: 1.5rem (24px)
```

### Ring de Seleção
```css
Fundo: linear-gradient(
  to right,
  #10b981,  /* emerald-500 */
  #34d399,  /* emerald-400 */
  #10b981   /* emerald-500 */
)
Opacity: 0.75
Blur: 2px
Position: absolute -inset-1
Border Radius: 1.75rem (28px)
Animação: scale(0.95 → 1) + opacity(0 → 1)
```

## 📐 Dimensões e Espaçamentos

### Bordas Arredondadas
```
Container Principal: 2rem (32px)
Cards de Ação: 2rem (32px)
Cards de Registro: 1.5rem (24px)
Ring de Seleção: 1.75rem (28px)
Badges: 9999px (full)
Botões: 0.75rem (12px)
```

### Sombras
```
Container: Custom dramática
Cards Normal: shadow-xl
Cards Hover: shadow-2xl
Cards Selecionado: shadow-2xl + shadow-emerald-500/30
Ring: blur-sm
```

### Padding
```
Container: 2rem (32px)
Cards: 1.5rem (24px)
Badges: 0.75rem 1rem
Botões: 0.5rem
```

## 🎨 Estados Visuais

### Card Normal (Não Selecionado)
```
┌────────────────────────────────────────┐
│ Fundo: Preto Premium (Gradiente)      │
│ Borda: Cinza Translúcido              │
│ Sombra: XL                             │
│                                        │
│ 🚗 Cliente A                  🟡 Em andamento │
│    HONDA CG 160 • ABC-1234            │
│    ⏰ 29/10/2025, 14:30               │
└────────────────────────────────────────┘
```

### Card Selecionado
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ← Ring Verde Blur
┃ ┌────────────────────────────────────┐ ┃
┃ │ Fundo: Preto Premium + Verde Sutil │ ┃
┃ │ Borda: Verde Translúcido           │ ┃
┃ │ Sombra: 2XL + Verde                │ ┃
┃ │                                    │ ┃
┃ │ 🚗 Cliente A          🟢 Selecionado │ ┃
┃ │    HONDA CG 160 • ABC-1234        │ ┃
┃ │    ⏰ 29/10/2025, 14:30           │ ┃
┃ └────────────────────────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Card Hover
```
┌────────────────────────────────────────┐
│ Fundo: Preto + Gradiente Azul/Roxo    │ ← Gradiente aparece
│ Sombra: 2XL                            │ ← Sombra aumenta
│ Transform: translateY(-2px)            │ ← Elevação
│                                        │
│ 🚗 Cliente A                  🟡 Em andamento │
│    HONDA CG 160 • ABC-1234            │
│    ⏰ 29/10/2025, 14:30               │
└────────────────────────────────────────┘
```

## 🎨 Elementos Individuais

### Ícone do Veículo
```
Normal:
┌──────────┐
│ Fundo: Azul Translúcido (20%)
│ Ícone: Azul (#2563eb)
│ Size: 3.5rem
│ Border Radius: 1rem
└──────────┘

Selecionado:
┌──────────┐
│ Fundo: Verde Translúcido (20%)
│ Ícone: Verde (#059669)
│ Size: 3.5rem
│ Border Radius: 1rem
└──────────┘
```

### Badge de Status
```
Em Andamento:
┌─────────────────┐
│ Fundo: Amarelo Escuro (amber-900/50)
│ Texto: Amarelo Claro (amber-300)
│ Sombra: amber-500/20
│ Border Radius: full
└─────────────────┘

Selecionado:
┌─────────────────┐
│ Fundo: Verde Escuro (emerald-900/50)
│ Texto: Verde Claro (emerald-300)
│ Sombra: emerald-500/20
│ Border Radius: full
└─────────────────┘
```

### Botão Ver Detalhes
```
┌────┐
│ Fundo: Cinza Escuro (gray-800)
│ Ícone: Verde (emerald-400)
│ Hover: Cinza Mais Escuro (gray-700)
│ Sombra: sm + md
│ Border Radius: 0.75rem
└────┘
```

## 🎨 Animações

### Ring de Seleção
```
Entrada:
- opacity: 0 → 1
- scale: 0.95 → 1
- duration: 300ms
- ease: ease-out
```

### Card Hover
```
Hover:
- scale: 1 → 1.01
- translateY: 0 → -2px
- shadow: xl → 2xl
- duration: 300ms
- ease: spring
```

### Badge
```
Entrada:
- scale: 0.8 → 1
- opacity: 0 → 1
- duration: 200ms
- ease: ease-out
```

## 🎯 Hierarquia de Profundidade

```
Camada 1 (Fundo):
└─ Gradiente da página

Camada 2 (Container):
└─ Branco com sombra dramática

Camada 3 (Cards):
└─ Preto premium com sombra XL

Camada 4 (Ring):
└─ Verde com blur

Camada 5 (Conteúdo):
└─ Texto, ícones, badges
```

## 💡 Dicas de Implementação

### Sombra Dramática Custom
```jsx
className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
```

### Gradiente Preto Premium
```jsx
className="bg-gradient-to-br from-gray-900 via-black to-gray-900"
```

### Ring Arredondado Perfeito
```jsx
className="rounded-[1.75rem]"
// Deve ser ligeiramente maior que o card (1.5rem)
```

### Bordas Super Arredondadas
```jsx
className="rounded-[2rem]"
// 2rem = 32px
```

## 🎨 Paleta Completa

### Pretos e Cinzas
```
black: #000000
gray-900: #111827
gray-800: #1f2937
gray-700: #374151
gray-600: #4b5563
gray-500: #6b7280
gray-400: #9ca3af
gray-300: #d1d5db
gray-200: #e5e7eb
gray-100: #f3f4f6
white: #ffffff
```

### Verdes (Seleção)
```
emerald-300: #6ee7b7
emerald-400: #34d399
emerald-500: #10b981
emerald-600: #059669
emerald-700: #047857
emerald-900: #064e3b
```

### Amarelos (Em Andamento)
```
amber-300: #fcd34d
amber-500: #f59e0b
amber-700: #b45309
amber-900: #78350f
```

### Azuis (Normal)
```
blue-400: #60a5fa
blue-500: #3b82f6
blue-600: #2563eb
blue-900: #1e3a8a
```

---

**Use este guia como referência visual!** 👁️✨
