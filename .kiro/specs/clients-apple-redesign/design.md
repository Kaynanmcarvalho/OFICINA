# Design Document - Clients Page Apple Redesign

## Overview

Este documento define o design completo da reformulação Apple-like da página `/clients`. O design segue os princípios de minimalismo, elegância e usabilidade fluida característicos dos produtos Apple.

## Design Philosophy

### Core Principles

1. **Minimalismo Sofisticado**: Menos é mais - cada elemento tem propósito
2. **Fluidez Natural**: Transições suaves que guiam o usuário intuitivamente
3. **Clareza Visual**: Hierarquia tipográfica perfeita e espaçamento harmonioso
4. **Imersão Premium**: Glassmorphism e microinterações que encantam

### Visual Language

- **Apple-like Aesthetics**: Glassmorphism, sombras naturais, cantos arredondados (16-24px)
- **Adaptive Theming**: Suporte completo a dark/light mode
- **Micro-interactions**: Animações sutis com Framer Motion (0.15s - 0.3s)
- **Typography**: SF Pro Display/Text inspired, hierarquia clara
- **Color System**: Tons suaves e translúcidos com acentos em azul elétrico

## Architecture

### Component Hierarchy

```
ClientsPage (Apple Redesign)
├── PageHeader
│   ├── Title + Badge (client count)
│   └── NewClientButton (glassmorphism)
├── SearchBar (with keyboard shortcut hint)
│   ├── SearchIcon
│   ├── Input (animated placeholder)
│   └── LoadingSpinner
├── ClientTable (responsive)
│   ├── TableHeader
│   ├── TableBody
│   │   └── ClientRow (with hover microinteraction)
│   │       ├── ClientAvatar
│   │       ├── ClientInfo
│   │       ├── ContactInfo
│   │       ├── VehicleCount
│   │       ├── LastVisit
│   │       ├── TotalServices
│   │       └── ActionButtons
│   └── EmptyState (elegant illustration)
├── ClientModal (glassmorphism)
│   ├── ModalHeader
│   ├── ClientForm (minimal borders)
│   └── ModalActions
└── ClientDrawer (slide from right)
    ├── DrawerHeader
    ├── ClientDetails
    ├── VehicleHistory
    └── ServiceSummary
```

## Component Specifications

### 1. PageHeader

**Visual Design**:
- Background: Transparent with subtle gradient
- Title: 48px, font-weight 700, letter-spacing -0.03em
- Badge: Glassmorphism pill with client count
- Spacing: 64px top padding, 32px bottom

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  Gestão de Clientes  [23 clientes]  [+ Novo]   │
└─────────────────────────────────────────────────┘
```

### 2. SearchBar

**Visual Specifications**:
- Height: 56px
- Border radius: 16px
- Background: rgba(255,255,255,0.8) light / rgba(28,28,30,0.8) dark
- Backdrop filter: blur(20px)
- Border: 1px solid rgba(0,0,0,0.08) light / rgba(255,255,255,0.08) dark
- Shadow: 0 4px 16px rgba(0,0,0,0.08)

**Placeholder Animation**:
```javascript
const placeholders = [
  "Buscar clientes por nome...",
  "Buscar por CPF...",
  "Buscar por e-mail...",
  "Buscar por telefone..."
];
// Rotate every 3 seconds with fade transition
```

**Keyboard Shortcut Hint**:
- Display: "⌘K" badge on right side
- Style: Monospace font, subtle gray

### 3. ClientTable

**Visual Design**:
- Container: Glassmorphism card
- Row height: 72px
- Row hover: Background rgba(0,0,0,0.02) light / rgba(255,255,255,0.02) dark
- Row transition: 0.2s ease-out
- Divider: 1px solid rgba(0,0,0,0.06) light / rgba(255,255,255,0.06) dark

**Column Specifications**:

| Column | Width | Alignment | Content |
|--------|-------|-----------|---------|
| Cliente | 25% | Left | Avatar + Name + CPF |
| Contato | 20% | Left | Phone + Email |
| Veículos | 12% | Center | Count badge |
| Última Visita | 15% | Center | Date formatted |
| Total Serviços | 13% | Center | Number |
| Ações | 15% | Right | Edit + Delete buttons |

**Row Hover Effect**:
```css
.client-row {
  transition: all 0.2s cubic-bezier(0.2, 0.9, 0.2, 1);
}

.client-row:hover {
  background: rgba(0, 0, 0, 0.02); /* light mode */
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
```

### 4. ClientAvatar

**Visual Design**:
- Size: 48px diameter
- Background: Gradient based on client name hash
- Icon: User icon centered, 24px
- Border: 2px solid white/black with opacity

**Gradient Colors** (based on name hash):
```javascript
const gradients = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-green-400 to-green-600',
  'from-amber-400 to-amber-600',
];
```

### 5. NewClientButton

**Visual Specifications**:
- Height: 48px
- Padding: 16px 24px
- Border radius: 12px
- Background: Linear gradient blue-500 to blue-600
- Shadow: 0 4px 12px rgba(59, 130, 246, 0.3)
- Text: 16px, font-weight 600, white

**Hover State**:
```css
.new-client-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}
```

**Active State**:
```css
.new-client-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}
```

### 6. ClientModal

**Visual Design**:
- Width: 600px (max-width: 90vw)
- Border radius: 24px
- Background: rgba(255,255,255,0.95) light / rgba(28,28,30,0.95) dark
- Backdrop filter: blur(40px)
- Shadow: 0 20px 60px rgba(0,0,0,0.3)
- Backdrop: rgba(0,0,0,0.4)

**Animation**:
```javascript
const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20 
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 }
  }
};
```

**Form Fields**:
- No visible borders, only bottom line on focus
- Label: 12px, uppercase, letter-spacing 0.05em, gray-500
- Input: 16px, padding 12px 0
- Focus: Blue underline with 0.3s transition

### 7. ClientDrawer

**Visual Design**:
- Width: 480px (mobile: 100vw)
- Height: 100vh
- Position: Fixed right
- Background: Same as modal
- Shadow: -4px 0 24px rgba(0,0,0,0.15)

**Slide Animation**:
```javascript
const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: '100%',
    transition: { duration: 0.3 }
  }
};
```

**Content Sections**:
1. Header: Client name + close button
2. Contact Info: Cards with icons
3. Vehicle List: Expandable accordion
4. Service History: Timeline view
5. Actions: Edit + Delete buttons

### 8. EmptyState

**Visual Design**:
- Centered vertically and horizontally
- Illustration: Minimalist SVG (user icon with dashed circle)
- Title: "Nenhum cliente cadastrado"
- Subtitle: "Comece adicionando seu primeiro cliente"
- CTA Button: "+ Novo Cliente"

**Illustration Style**:
- Monochrome with theme-aware color
- Size: 120px
- Opacity: 0.6
- Subtle animation: Float up/down 10px over 3s

## Color System

### Light Mode

```css
:root {
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: rgba(255, 255, 255, 0.8);
  --bg-tertiary: #f5f5f7;
  
  /* Text */
  --text-primary: #1d1d1f;
  --text-secondary: #6e6e73;
  --text-tertiary: #86868b;
  
  /* Borders */
  --border-light: rgba(0, 0, 0, 0.06);
  --border-medium: rgba(0, 0, 0, 0.12);
  
  /* Accents */
  --accent-blue: #007aff;
  --accent-blue-hover: #0051d5;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
}
```

### Dark Mode

```css
.dark {
  /* Backgrounds */
  --bg-primary: #000000;
  --bg-secondary: rgba(28, 28, 30, 0.8);
  --bg-tertiary: #1c1c1e;
  
  /* Text */
  --text-primary: #f5f5f7;
  --text-secondary: #98989d;
  --text-tertiary: #636366;
  
  /* Borders */
  --border-light: rgba(255, 255, 255, 0.06);
  --border-medium: rgba(255, 255, 255, 0.12);
  
  /* Accents */
  --accent-blue: #0a84ff;
  --accent-blue-hover: #409cff;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
}
```

## Typography System

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 
             'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Page Title | 48px | 700 | 1.1 | -0.03em |
| Section Title | 32px | 600 | 1.2 | -0.02em |
| Card Title | 20px | 600 | 1.3 | -0.01em |
| Body Large | 17px | 400 | 1.5 | 0 |
| Body | 15px | 400 | 1.5 | 0 |
| Caption | 13px | 400 | 1.4 | 0 |
| Label | 12px | 500 | 1.3 | 0.05em |

## Animation Tokens

```javascript
const animations = {
  easing: {
    apple: [0.2, 0.9, 0.2, 1],
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
  },
};
```

## Responsive Breakpoints

```javascript
const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};
```

### Mobile Adaptations

**< 640px**:
- Table converts to card list
- Search bar full width
- Modal full screen
- Drawer full screen
- Font sizes reduced by 10%

**640px - 768px**:
- Table with horizontal scroll
- Modal 90% width
- Drawer 80% width

**> 768px**:
- Full table layout
- Modal fixed 600px
- Drawer fixed 480px

## Accessibility

1. **Keyboard Navigation**: All interactive elements accessible via Tab
2. **Screen Readers**: Proper ARIA labels and roles
3. **Focus Management**: Visible focus indicators, focus trap in modals
4. **Color Contrast**: WCAG AA compliance in both themes
5. **Touch Targets**: Minimum 44x44px on mobile

## Performance Optimizations

1. **Lazy Loading**: Virtualize table for 100+ clients
2. **Debouncing**: Search input debounced at 300ms
3. **Memoization**: React.memo for expensive components
4. **Code Splitting**: Lazy load modal and drawer components
5. **Image Optimization**: Use WebP for illustrations

## Testing Strategy

1. **Unit Tests**: Component logic and state management
2. **Integration Tests**: User flows (create, edit, search)
3. **Visual Regression**: Screenshot comparison
4. **Performance Tests**: Load time, animation FPS
5. **Accessibility Tests**: axe-core automated checks

## Success Metrics

- Page load time < 1s on 3G
- Search results < 300ms
- User satisfaction rating > 4.5/5
- Zero accessibility violations
- 60fps maintained on all animations
