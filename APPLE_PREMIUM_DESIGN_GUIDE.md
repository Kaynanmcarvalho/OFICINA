# 🍎 TORQ Apple Premium Design System

## 🎨 Visão Geral

Sistema de design premium inspirado em macOS Sonoma e iOS 18, criando uma experiência visual imersiva, elegante e cinematográfica.

---

## 🌟 Filosofia de Design

### Princípios Fundamentais

1. **Profundidade Física**: Camadas de vidro e luz difusa
2. **Luxo Visual**: Sombras realistas e reflexos sutis
3. **Fluidez**: Transições suaves e naturais
4. **Realismo**: Sensação tátil e física
5. **Elegância**: Minimalismo sofisticado

---

## 🎨 Paleta de Cores

### Background
```css
/* Light Mode */
background: radial-gradient(circle at 25% 25%, #fdfdfd 0%, #f7f8fa 100%);

/* Dark Mode */
background: radial-gradient(circle at 25% 25%, #0a0a0f 0%, #050507 100%);
```

### Gradientes de Ícones
- **Blue**: `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)`
- **Purple**: `linear-gradient(135deg, #a855f7 0%, #9333ea 100%)`
- **Orange**: `linear-gradient(135deg, #f97316 0%, #ea580c 100%)`
- **Green**: `linear-gradient(135deg, #10b981 0%, #059669 100%)`

---

## 🏗️ Componentes Premium

### 1. Sidebar Premium

#### Características
- Glassmorphism com blur 40px
- Sombra interna e externa
- Gradiente de profundidade
- Reflexo de luz superior

#### Classes
```html
<aside class="sidebar-premium">
  <!-- Conteúdo -->
</aside>
```

#### Efeitos
- **Light Mode**: Fundo branco translúcido com reflexo
- **Dark Mode**: Fundo escuro com sombras azuladas
- **Item Ativo**: Glow azul com glassmorphism

---

### 2. Navbar Premium

#### Características
- Superfície de vidro flutuante
- Blur 40px + saturação 180%
- Reflexo de luz no topo
- Botões pill luminosos

#### Classes
```html
<nav class="navbar-premium">
  <button class="navbar-pill-button">
    <!-- Ícone -->
  </button>
</nav>
```

#### Efeitos
- **Hover**: Lift 1px + sombra mais profunda
- **Active**: Glow sutil
- **Transition**: 250ms cubic-bezier

---

### 3. Dashboard Cards

#### KPI Cards
```html
<div class="kpi-card-premium">
  <div class="kpi-icon-gradient-blue">
    <!-- Ícone -->
  </div>
  <!-- Conteúdo -->
</div>
```

#### Características
- Bordas arredondadas 20px
- Gradiente radial leve
- Sombra difusa realista
- Luz superior simulada
- Hover: levitar 2px

#### Efeitos de Hover
```css
transform: translateY(-2px);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
```

---

### 4. Cards Gerais

```html
<div class="card-premium">
  <!-- Conteúdo -->
</div>
```

#### Características
- Bordas 24px
- Gradiente de fundo
- Reflexo de luz superior
- Sombra em múltiplas camadas

#### Light Mode
```css
background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
box-shadow: 
  0 8px 32px rgba(0, 0, 0, 0.06),
  0 2px 8px rgba(0, 0, 0, 0.04),
  inset 0 1px 0 rgba(255, 255, 255, 0.9);
```

#### Dark Mode
```css
background: linear-gradient(135deg, #1a1c22 0%, #15171b 100%);
box-shadow: 
  0 8px 32px rgba(0, 0, 0, 0.5),
  inset 0 1px 0 rgba(255, 255, 255, 0.08);
```

---

### 5. Central de Alertas

#### Crítico
```html
<div class="alert-card-critical">
  <!-- Alerta crítico -->
</div>
```

#### Warning
```html
<div class="alert-card-warning">
  <!-- Alerta de aviso -->
</div>
```

#### Características
- Borda luminosa colorida
- Glow difuso
- Gradiente de fundo
- Hierarquia visual clara

---

### 6. Weather Widget (iOS 18 Style)

```html
<div class="weather-widget-premium">
  <!-- Conteúdo do clima -->
</div>
```

#### Características
- Gradiente de céu
- Sombra realista
- Reflexo de luz superior
- Estilo widget iOS 18

---

## ✨ Efeitos Visuais

### Glassmorphism
```css
.glass-effect {
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}
```

### Sombras Premium
```css
.shadow-premium {
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.04);
}
```

### Text Gradients
```html
<h1 class="text-gradient-blue">Título</h1>
<h2 class="text-gradient-purple">Subtítulo</h2>
<h3 class="text-gradient-orange">Destaque</h3>
```

---

## 🎬 Animações

### Timing Function
```css
cubic-bezier(0.4, 0, 0.2, 1)
```

### Durações
- **Fast**: 250ms (interações rápidas)
- **Normal**: 300ms (transições padrão)
- **Slow**: 400ms (animações complexas)

### Float In
```html
<div class="animate-float-in">
  <!-- Conteúdo -->
</div>
```

### Glow Pulse
```html
<div class="animate-glow-pulse">
  <!-- Elemento com glow pulsante -->
</div>
```

---

## 📐 Microdetalhes

### Reflexos de Luz

Todos os cards premium têm reflexo de luz superior:

```css
.card-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.6) 0%, 
    transparent 100%
  );
}
```

### Sombras Internas

Profundidade realista com sombras internas:

```css
inset 0 1px 0 rgba(255, 255, 255, 0.9)
```

### Bordas Translúcidas

Bordas sutis que criam separação:

```css
border: 1px solid rgba(0, 0, 0, 0.06);
```

---

## 🎯 Guia de Uso

### Dashboard

```jsx
<div className="dashboard-premium-bg">
  <div className="kpi-card-premium">
    <div className="kpi-icon-gradient-blue">
      <Icon />
    </div>
    <h3>Valor</h3>
    <p>Título</p>
  </div>
</div>
```

### Sidebar

```jsx
<aside className="sidebar-premium">
  <nav>
    <button className="sidebar-item-active">
      <Icon />
      <span>Item Ativo</span>
    </button>
  </nav>
</aside>
```

### Navbar

```jsx
<nav className="navbar-premium">
  <button className="navbar-pill-button">
    <Search />
  </button>
  <button className="navbar-pill-button">
    <Moon />
  </button>
</nav>
```

---

## 🎨 Inspiração Visual

### Referências
- macOS Sonoma - System Preferences
- iOS 18 - Widgets e Cards
- Apple Music Desktop
- Final Cut Pro UI
- Apple Developer Docs

### Características Apple
- Vidro translúcido
- Sombras físicas
- Glow sutil
- Transições fluidas
- Profundidade realista
- Reflexos de luz
- Gradientes suaves

---

## 📱 Responsividade

### Mobile
- Blur reduzido para performance
- Cards menores
- Espaçamento ajustado

### Tablet
- Blur médio
- Layout adaptativo

### Desktop
- Blur completo
- Efeitos premium completos

---

## ♿ Acessibilidade

### Contraste
- WCAG AA em todos os textos
- Contraste mínimo: 4.5:1

### Focus States
- Outline visível
- Glow azul em foco
- Keyboard navigation

### Animações
- Respeita `prefers-reduced-motion`
- Transições suaves

---

## 🚀 Performance

### Otimizações
- GPU acceleration
- Will-change em elementos animados
- Blur reduzido em mobile
- Lazy loading de efeitos

### Best Practices
```css
.optimized-element {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  will-change: transform;
}
```

---

## 📦 Arquivos

### CSS
- `src/styles/apple-premium.css` - Estilos premium
- `src/styles/dark-mode-premium.css` - Dark mode

### Componentes Atualizados
- `src/components/Sidebar/SidebarAppleLike.jsx`
- `src/components/Navbar/Navbar.jsx`
- `src/pages/dashboard/index.jsx`
- `src/pages/dashboard/componentes/CartaoIndicador.jsx`

---

## ✅ Checklist de Implementação

- [x] CSS premium criado
- [x] Sidebar atualizada
- [x] Navbar atualizada
- [x] Dashboard background atualizado
- [x] KPI cards atualizados
- [ ] Central de Alertas atualizada
- [ ] Weather Widget atualizado
- [ ] Gráficos atualizados
- [ ] Listas atualizadas
- [ ] Modais atualizados

---

## 🎯 Próximos Passos

1. Atualizar componentes restantes
2. Testar em diferentes dispositivos
3. Validar acessibilidade
4. Otimizar performance
5. Documentar padrões de uso

---

**Criado com ❤️ para TORQ ERP**
*Design System Premium - Apple Inspired*
