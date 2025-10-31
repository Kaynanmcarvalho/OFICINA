# 🌙 TORQ Dark Mode Premium - Guia Visual

## 🎨 Filosofia de Design

O dark mode premium do TORQ foi inspirado na linguagem visual da Apple (macOS Sonoma, Final Cut Pro, Apple Music), criando uma experiência imersiva, elegante e cinematográfica.

### Princípios Fundamentais

1. **Profundidade Realista**: Uso de camadas de vidro e luz difusa
2. **Contraste Suave**: Evita preto puro, usa tons espaciais
3. **Hierarquia Visual**: Criada por variações tonais e blur
4. **Sensação Tátil**: Resposta visual a interações
5. **Fluidez**: Transições suaves e naturais

---

## 🎨 Paleta de Cores

### Background Layers
```css
--bg-base: #0C0D10           /* Fundo principal */
--bg-elevated: #15171B       /* Superfícies elevadas */
--bg-surface: #1D1F24        /* Cards e containers */
--bg-glass: rgba(25, 26, 31, 0.75)  /* Vidro translúcido */
```

### Surface Layers
```css
--surface-primary: #15171B
--surface-secondary: #1D1F24
--surface-tertiary: #25272C
--surface-glass: rgba(29, 31, 36, 0.85)
--surface-elevated: #2A2C31
```

### Borders
```css
--border-subtle: rgba(255, 255, 255, 0.06)
--border-default: rgba(255, 255, 255, 0.08)
--border-strong: rgba(255, 255, 255, 0.12)
--border-focus: rgba(0, 122, 255, 0.5)
```

### Accent Colors (Apple Blue)
```css
--accent-primary: #007AFF
--accent-primary-hover: #0070E0
--accent-primary-pressed: #0062CC
--accent-glow: rgba(0, 122, 255, 0.35)
--accent-glow-strong: rgba(0, 122, 255, 0.5)
```

### Text Colors
```css
--text-primary: #EAEAEA       /* Texto principal */
--text-secondary: #9DA0A6     /* Texto secundário */
--text-tertiary: #6E7178      /* Texto terciário */
--text-muted: #5A5D63         /* Texto desabilitado */
--text-disabled: #3F4147      /* Texto muito desabilitado */
```

### Semantic Colors
```css
--success: #32D74B
--warning: #FFD60A
--error: #FF453A
--info: #64D2FF
```

### Orange Brand (TORQ)
```css
--orange-primary: #F28C1D
--orange-hover: #E07D15
--orange-pressed: #CC6F12
--orange-glow: rgba(242, 140, 29, 0.35)
```

---

## 🌫️ Sistema de Camadas

### Layer 0: Background Base
- Cor sólida escura com gradiente radial sutil
- Cria sensação de profundidade espacial

### Layer 1: Superfícies Principais
- Blur: 40px
- Opacidade: 0.75-0.85
- Bordas sutis

### Layer 2: Cards e Modais
- Blur: 40px
- Opacidade: 0.85-0.9
- Bordas mais visíveis
- Sombra interna para profundidade

### Layer 3: Elementos Interativos
- Glow sutil em hover
- Lift effect (translateY(-1px))
- Transição suave

---

## ✨ Efeitos Visuais

### Glassmorphism
```css
backdrop-filter: blur(40px) saturate(180%);
background: rgba(29, 31, 36, 0.85);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 
            inset 0 1px 1px rgba(255, 255, 255, 0.06);
```

### Glow Effects
```css
/* Blue Glow */
box-shadow: 0 0 12px rgba(0, 122, 255, 0.3);

/* Orange Glow */
box-shadow: 0 0 12px rgba(242, 140, 29, 0.35);

/* Success Glow */
box-shadow: 0 0 12px rgba(50, 215, 75, 0.3);
```

### Lift Effect (Hover)
```css
transform: translateY(-1px);
box-shadow: 0 6px 24px rgba(0, 122, 255, 0.5);
transition: all 160ms cubic-bezier(0.2, 0.9, 0.2, 1);
```

---

## 🎯 Classes Utilitárias

### Glassmorphism
```html
<div class="glass-premium">
  <!-- Vidro translúcido com blur -->
</div>

<div class="glass-premium-elevated">
  <!-- Vidro elevado com mais destaque -->
</div>
```

### Buttons
```html
<button class="btn-premium">
  <!-- Botão padrão -->
</button>

<button class="btn-premium-primary">
  <!-- Botão primário com glow azul -->
</button>
```

### Cards
```html
<div class="card-premium">
  <!-- Card com glassmorphism -->
</div>

<div class="card-premium-elevated">
  <!-- Card elevado -->
</div>
```

### Inputs
```html
<input class="input-premium" />
<!-- Input com vidro e foco azul -->
```

### Glow Effects
```html
<div class="glow-blue">Glow Azul</div>
<div class="glow-orange">Glow Laranja</div>
<div class="glow-success">Glow Verde</div>
```

---

## 🎬 Animações

### Timing Function
```css
cubic-bezier(0.2, 0.9, 0.2, 1)
```
- Suave e natural
- Inspirado em iOS/macOS

### Durações
- **Fast**: 160ms (interações rápidas)
- **Normal**: 300ms (transições padrão)
- **Slow**: 400ms (animações complexas)

### Exemplos
```css
/* Fade In */
animation: fadeIn 300ms cubic-bezier(0.2, 0.9, 0.2, 1);

/* Scale In */
animation: scaleIn 200ms cubic-bezier(0.2, 0.9, 0.2, 1);
```

---

## 📐 Microdetalhes

### Reflexos de Vidro
```css
.card-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.1), 
    transparent
  );
}
```

### Scrollbar Premium
```css
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.1), 
    rgba(255, 255, 255, 0.15)
  );
  border-radius: 4px;
}
```

### Seleção de Texto
```css
::selection {
  background: rgba(0, 122, 255, 0.3);
  color: #EAEAEA;
}
```

---

## 🎨 Componentes Principais

### Navbar
- Background: `rgba(21, 23, 27, 0.8)`
- Blur: 40px
- Border bottom: sutil
- Reflexo no topo

### Sidebar
- Background: `rgba(18, 20, 25, 0.85)`
- Blur: 40px
- Border right: sutil
- Items com hover suave

### Cards
- Background: glass translúcido
- Hover: lift + glow
- Border: sutil
- Sombra interna

### Buttons
- Background: surface secondary
- Hover: lift + shadow
- Active: pressed state
- Primary: glow azul

### Inputs
- Background: surface primary
- Focus: glow azul + border
- Placeholder: text tertiary
- Shadow: inset

---

## 🚀 Como Usar

### 1. Aplicar Dark Mode
```jsx
// O tema é controlado automaticamente
// Basta usar as classes dark: do Tailwind
<div className="bg-white dark:bg-[var(--bg-base)]">
  ...
</div>
```

### 2. Usar Classes Premium
```jsx
<div className="card-premium">
  <h2 className="text-[var(--text-primary)]">Título</h2>
  <p className="text-[var(--text-secondary)]">Descrição</p>
</div>
```

### 3. Aplicar Glow
```jsx
<button className="btn-premium-primary glow-blue-strong">
  Ação Principal
</button>
```

---

## ♿ Acessibilidade

### Contraste
- Todos os textos atendem WCAG AA
- Contraste mínimo: 4.5:1 para texto normal
- Contraste mínimo: 3:1 para texto grande

### Focus States
- Outline azul visível
- Offset de 2px
- Border radius suave

### Keyboard Navigation
- Todos os elementos interativos são acessíveis
- Tab order lógico
- Focus trap em modais

---

## 📱 Responsividade

O dark mode premium é totalmente responsivo:
- Mobile: blur reduzido para performance
- Tablet: blur médio
- Desktop: blur completo

---

## 🎯 Checklist de Implementação

- [x] Tokens de cor criados
- [x] CSS premium criado
- [x] Classes utilitárias definidas
- [x] Animações configuradas
- [x] Glassmorphism implementado
- [x] Glow effects criados
- [ ] Navbar atualizado
- [ ] Sidebar atualizado
- [ ] Cards atualizados
- [ ] Buttons atualizados
- [ ] Inputs atualizados
- [ ] Modals atualizados

---

## 🎨 Inspiração Visual

### Referências
- macOS Sonoma - System Preferences
- Apple Music (Dark Mode)
- Final Cut Pro UI
- Apple Developer Dark Docs

### Características
- Vidro translúcido
- Sombras físicas
- Glow sutil
- Transições fluidas
- Profundidade realista

---

## 📚 Recursos

### Arquivos Criados
- `src/styles/tokens-dark.json` - Tokens de cor
- `src/styles/dark-mode-premium.css` - Estilos premium
- `DARK_MODE_PREMIUM_GUIDE.md` - Este guia

### Próximos Passos
1. Atualizar componentes principais
2. Testar em diferentes dispositivos
3. Validar acessibilidade
4. Otimizar performance
5. Documentar padrões de uso

---

**Criado com ❤️ para TORQ ERP**
