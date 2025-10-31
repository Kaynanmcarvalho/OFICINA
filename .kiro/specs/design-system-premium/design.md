# Design Document - Premium Design System

## Overview

This design document outlines the architecture and implementation strategy for a comprehensive premium design system inspired by Apple's design principles. The system will provide a cohesive, accessible, and performant foundation for the workshop management ERP interface while maintaining full compatibility with existing light/dark theme functionality.

### Design Philosophy

The design system follows Apple's core principles:
- **Clarity**: Typography and visual hierarchy guide users through content
- **Deference**: Interface elements defer to content, using subtle depth and translucency
- **Depth**: Layering and motion provide hierarchy and vitality
- **Consistency**: Reusable patterns ensure predictable interactions
- **Accessibility**: WCAG AA compliance ensures usability for all users

### Key Design Decisions

1. **Token-First Architecture**: All visual properties derive from design tokens, enabling consistent theming and easy maintenance
2. **Glass Morphism**: Subtle translucency with backdrop-filter creates depth without heavy shadows
3. **Micro-interactions**: 180ms animations with Apple's cubic-bezier easing provide polish
4. **Component Composition**: Headless patterns with styled variants enable flexibility
5. **Progressive Enhancement**: Modern features degrade gracefully in older browsers

## Architecture

### System Layers

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Pages, Features, Business Logic)      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       Component Library Layer           │
│  (Navbar, Sidebar, Cards, Forms, etc.)  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│        Design Token Layer               │
│  (Colors, Typography, Spacing, etc.)    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         CSS Foundation Layer            │
│  (Tailwind, CSS Variables, Utilities)   │
└─────────────────────────────────────────┘
```

### Technology Stack


**Core Technologies**:
- React 19.1.0 with TypeScript for type-safe components
- Tailwind CSS 3.3.6 for utility-first styling
- Framer Motion 10.16.16 for animations
- Lucide React 0.460.0 for icon system
- Radix UI primitives for accessible headless components

**Build Tools**:
- Vite 6.3.5 for fast development and optimized builds
- PostCSS for CSS processing and optimization
- SVGO for SVG optimization

**Testing & Documentation**:
- Storybook for component documentation and visual testing
- Vitest for unit testing
- React Testing Library for component testing

### File Structure

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── colors.ts          # Color token definitions
│   │   ├── typography.ts      # Typography scales
│   │   ├── spacing.ts         # Spacing system
│   │   ├── elevation.ts       # Shadow definitions
│   │   └── index.ts           # Token exports
│   ├── components/
│   │   ├── primitives/        # Base components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   └── ...
│   │   ├── composed/          # Complex components
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── DataTable/
│   │   │   └── ...
│   │   └── index.ts
│   ├── icons/
│   │   ├── svg/               # Optimized SVG files
│   │   ├── IconLoader.tsx     # Icon registration system
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useMediaQuery.ts
│   │   └── useReducedMotion.ts
│   └── utils/
│       ├── cn.ts              # Class name utility
│       └── theme.ts           # Theme utilities
```

## Components and Interfaces

### 1. Design Token System


#### Token Structure

The design token system extends the existing `design-tokens.json` with additional semantic tokens:

**Color System**:
- 6 color palettes (primary, secondary, neutral, success, warning, error, info)
- 10-step scales (50-900) for granular control
- Semantic mappings for light/dark themes
- Alpha variants for translucency effects

**Typography System**:
- Font families: SF Pro Display (fallback to Inter/system fonts)
- 10 size scales (xs to 6xl) with corresponding line heights
- 5 weight variants (light to bold)
- Letter spacing presets for different contexts

**Spacing System**:
- 4px base unit
- 13 scale steps (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24)
- Consistent application across padding, margin, gap

**Elevation System**:
- 7 shadow levels (xs, sm, base, md, lg, xl, glass)
- Light/dark mode variants
- Glass effect with backdrop-filter support

#### Theme Mapping

CSS custom properties bridge tokens to theme context:

```css
:root {
  /* Light mode defaults */
  --color-bg-primary: var(--neutral-50);
  --color-bg-secondary: var(--neutral-100);
  --color-bg-glass: rgba(255, 255, 255, 0.8);
  --color-text-primary: var(--neutral-900);
  --color-text-secondary: var(--neutral-600);
  --backdrop-blur: 12px;
}

.dark {
  /* Dark mode overrides */
  --color-bg-primary: var(--neutral-900);
  --color-bg-secondary: var(--neutral-800);
  --color-bg-glass: rgba(23, 23, 23, 0.8);
  --color-text-primary: var(--neutral-50);
  --color-text-secondary: var(--neutral-400);
  --backdrop-blur: 16px;
}
```

### 2. Component Architecture

#### Base Component Pattern

All components follow a consistent API pattern:

```typescript
interface BaseComponentProps {
  variant?: 'default' | 'glass' | 'highlight';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}
```


#### Component Specifications

**Navbar Component**:
- Fixed position with glass background
- Responsive search bar (expands on focus)
- Avatar with dropdown menu
- Theme toggle with smooth icon transition
- Notification badge with count
- Mobile hamburger menu (< 768px)
- Breadcrumb navigation for context
- Keyboard shortcuts support (Cmd+K for search)

**Sidebar Component**:
- Collapsible with smooth animation
- Icon-only mode when collapsed
- Section grouping with dividers
- Active state with accent border
- Hover states with subtle lift
- Keyboard navigation (Tab, Arrow keys)
- Transforms to bottom nav on mobile (< 768px)
- Persistent state in localStorage

**DashboardCard Component**:
- Glass effect background with backdrop-filter
- Loading state with skeleton animation
- Empty state with placeholder message
- Highlight variant with gradient background
- Compact variant for dense layouts
- Icon with colored background
- Trend indicator (up/down arrow with percentage)
- Optional footer section for actions
- Hover lift animation (4px translate)

**AlertCenter Component**:
- Filterable by type (info, warning, error, success)
- Priority sorting (high, medium, low)
- Quick action buttons per alert
- Dismiss animation with fade-out
- Badge count indicator
- Expandable detail view
- Real-time updates with smooth transitions
- Empty state when no alerts

**DataTable Component**:
- Virtualized rendering for 1000+ rows
- Sortable columns with indicator icons
- Filterable with search input
- Selectable rows with checkbox
- Pagination controls
- Column resize and reorder
- Sticky header on scroll
- Loading skeleton for async data
- Empty state with call-to-action
- Export functionality (CSV, PDF)

**FormControls Components**:
- Text Input: floating label, validation states, prefix/suffix icons
- Select: searchable dropdown, multi-select support, custom option rendering
- DatePicker: calendar popup, range selection, keyboard navigation
- Masked Input: phone, CPF/CNPJ, credit card formatting
- Checkbox/Radio: custom styling, indeterminate state
- Toggle Switch: smooth animation, disabled state
- File Upload: drag-and-drop, preview, progress indicator


**Modal Component**:
- Focus trap with keyboard navigation
- Backdrop with blur effect
- Enter/exit animations (scale + fade)
- Close on ESC key or backdrop click
- Scrollable content area
- Header with title and close button
- Footer with action buttons
- Size variants (sm, md, lg, xl, full)
- Nested modal support

**Drawer Component**:
- Slide-in from left/right/top/bottom
- Overlay with backdrop blur
- Swipe-to-close on mobile
- Persistent vs temporary modes
- Resizable width/height
- Header with title and close
- Scrollable content area

**WidgetWeather Component**:
- Current weather with icon
- Temperature display
- 5-day forecast cards
- Animated weather icons
- Location display
- Refresh button
- Loading skeleton
- Error state with retry

### 3. Icon System

#### Icon Specifications

**Grid System**: 24x24px artboard with 1.5px stroke weight
**Variants**: Outline (default) and Filled
**Color**: Uses `currentColor` for theme adaptation
**Optimization**: SVGO with precision 2, remove viewBox false

**Icon Categories**:
- Navigation: home, dashboard, settings, search, menu
- Actions: add, edit, delete, save, cancel, refresh
- Status: success, warning, error, info, pending
- Business: clients, vehicles, inventory, tools, team
- Weather: sun, cloud, rain, snow, wind
- UI: chevron, arrow, close, check, minus, plus

#### Icon Loader Implementation

```typescript
interface IconProps {
  name: string;
  size?: number;
  className?: string;
  fallback?: ReactNode;
}

// Icon registry with lazy loading
const iconRegistry = new Map<string, React.FC>();

// Register icon
registerIcon('client', ClientIcon);

// Use icon
<Icon name="client" size={24} />
```


## Data Models

### Theme Configuration

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryHue: number; // 0-360 for custom primary color
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  density: 'compact' | 'comfortable' | 'spacious';
  reducedMotion: boolean;
}
```

### Component State Models

```typescript
// Card state
interface CardState {
  isLoading: boolean;
  isEmpty: boolean;
  isHighlighted: boolean;
  data?: any;
}

// Table state
interface TableState {
  data: any[];
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  filters: Record<string, any>;
  selectedRows: Set<string>;
  page: number;
  pageSize: number;
}

// Alert state
interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  timestamp: Date;
  actions?: AlertAction[];
  isDismissed: boolean;
}
```

### Design Token Model

```typescript
interface DesignTokens {
  colors: ColorPalettes;
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: RadiusScale;
  elevation: ElevationScale;
  animation: AnimationConfig;
  breakpoints: BreakpointConfig;
}

interface ColorPalettes {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}

interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}
```


## Error Handling

### Component Error Boundaries

Each major component includes error boundary protection:

```typescript
<ErrorBoundary fallback={<ComponentErrorFallback />}>
  <ComplexComponent />
</ErrorBoundary>
```

### Error States

**Loading Errors**:
- Display skeleton with error indicator
- Retry button with exponential backoff
- Error message with technical details (dev mode only)

**Validation Errors**:
- Inline error messages below inputs
- Red border and error icon
- Accessible error announcements

**Network Errors**:
- Toast notification with retry action
- Offline indicator in navbar
- Queue actions for when connection restored

### Fallback Strategies

**Icon Loading Failure**:
- Display generic icon placeholder
- Log error to console (dev mode)
- Continue rendering without breaking layout

**Theme Loading Failure**:
- Fall back to system theme
- Use default light theme if system unavailable
- Preserve user preference in localStorage

**Component Loading Failure**:
- Display error boundary with reload option
- Log error to monitoring service
- Provide navigation to safe route

## Testing Strategy

### Unit Testing

**Token Tests**:
- Verify all color scales have 10 steps
- Validate contrast ratios meet WCAG AA
- Ensure spacing follows 4px base unit
- Check animation durations are consistent

**Component Tests**:
- Render all variants without errors
- Verify prop types and defaults
- Test keyboard navigation
- Validate ARIA attributes
- Check responsive behavior

### Integration Testing

**Theme Switching**:
- Toggle between light/dark modes
- Verify CSS variables update correctly
- Check component re-renders
- Validate localStorage persistence

**Component Composition**:
- Test nested components
- Verify event propagation
- Check context providers
- Validate state management


### Visual Regression Testing

**Storybook Integration**:
- Capture screenshots of all component variants
- Compare against baseline images
- Flag visual changes for review
- Test across multiple viewports

**Chromatic/Percy Setup**:
- Automated visual testing on PR
- Cross-browser screenshot comparison
- Responsive breakpoint testing
- Dark mode variant testing

### Accessibility Testing

**Automated Tests**:
- axe-core integration in Storybook
- Lighthouse accessibility audits
- Color contrast validation
- ARIA attribute verification

**Manual Tests**:
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Focus indicator visibility
- Touch target size verification

### Performance Testing

**Metrics**:
- Lighthouse performance score >= 80 (desktop), >= 60 (mobile)
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Bundle size per component < 5KB gzip

**Optimization Strategies**:
- Code splitting by route
- Lazy loading non-critical components
- Tree-shaking unused code
- Image optimization and lazy loading
- Critical CSS extraction

## Responsive Design Patterns

### Breakpoint Strategy

```typescript
const breakpoints = {
  mobile: '< 480px',    // Phone portrait
  tablet: '< 768px',    // Tablet portrait
  desktop: '< 1280px',  // Desktop
  wide: '>= 1280px'     // Wide desktop
};
```

### Layout Adaptations

**Mobile (< 480px)**:
- Single column layout
- Sidebar transforms to bottom navigation
- Cards stack vertically
- Typography scales down (h1: 2xl → xl)
- Touch targets minimum 44x44px
- Simplified navigation menu
- Collapsible sections

**Tablet (< 768px)**:
- Two column grid for cards
- Sidebar collapses to icon-only
- Search bar remains full width
- Modal becomes full screen
- Table switches to card view

**Desktop (< 1280px)**:
- Three column grid for cards
- Full sidebar with labels
- Multi-column forms
- Side-by-side modals
- Full data table view

**Wide (>= 1280px)**:
- Four column grid for cards
- Extended sidebar with descriptions
- Dashboard widgets in grid
- Split-screen views
- Advanced table features


### Component Responsive Behavior

**Navbar**:
- Mobile: Hamburger menu, compact search icon
- Tablet: Collapsible search, visible icons
- Desktop: Full search bar, all actions visible

**Sidebar**:
- Mobile: Bottom navigation bar (4-5 items)
- Tablet: Icon-only sidebar (collapsed)
- Desktop: Full sidebar with labels

**DataTable**:
- Mobile: Card list view with key fields
- Tablet: Horizontal scroll with sticky columns
- Desktop: Full table with all columns

**Forms**:
- Mobile: Single column, full width inputs
- Tablet: Two column layout for related fields
- Desktop: Multi-column with logical grouping

## Animation and Micro-interactions

### Animation Principles

**Duration Guidelines**:
- Instant: 0ms (immediate feedback)
- Fast: 150ms (hover states, focus)
- Base: 200ms (transitions, toggles)
- Slow: 300ms (page transitions, modals)
- Slower: 500ms (complex animations)

**Easing Functions**:
- Default: `cubic-bezier(0.4, 0, 0.2, 1)` - Standard easing
- Apple: `cubic-bezier(0.2, 0.9, 0.2, 1)` - Smooth, natural
- In: `cubic-bezier(0.4, 0, 1, 1)` - Accelerate
- Out: `cubic-bezier(0, 0, 0.2, 1)` - Decelerate

### Interaction Patterns

**Hover Effects**:
```typescript
// Card hover
whileHover={{ 
  y: -4, 
  transition: { duration: 0.2, ease: [0.2, 0.9, 0.2, 1] } 
}}

// Button hover
whileHover={{ 
  scale: 1.02,
  transition: { duration: 0.15 } 
}}
```

**Press Effects**:
```typescript
whileTap={{ 
  scale: 0.98,
  transition: { duration: 0.1 } 
}}
```

**Focus States**:
- 2px ring with primary color
- 2px offset for visibility
- Smooth transition (150ms)
- High contrast in dark mode

**Loading States**:
- Skeleton shimmer animation (2s loop)
- Pulse animation for icons
- Progress indicators for long operations
- Optimistic UI updates


### Page Transitions

**Route Changes**:
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  duration: 0.3,
  ease: [0.2, 0.9, 0.2, 1]
};
```

**Modal Animations**:
```typescript
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};
```

**Notification Animations**:
```typescript
const notificationVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 }
};
```

### Reduced Motion Support

```typescript
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
};

// Usage in components
const shouldAnimate = !useReducedMotion();
```

## Design Guidelines

### Color Usage

**Light Mode**:
- Background: neutral-50 (primary), neutral-100 (secondary)
- Text: neutral-900 (primary), neutral-600 (secondary)
- Borders: neutral-200 with 50% opacity
- Glass: white with 80% opacity + 12px blur
- Shadows: Subtle, low opacity (10-15%)

**Dark Mode**:
- Background: neutral-900 (primary), neutral-800 (secondary)
- Text: neutral-50 (primary), neutral-400 (secondary)
- Borders: neutral-700 with 50% opacity
- Glass: black with 80% opacity + 16px blur
- Shadows: Deeper, higher opacity (25-50%)

**Semantic Colors**:
- Success: Green (operations completed, positive trends)
- Warning: Amber (caution, pending actions)
- Error: Red (failures, destructive actions)
- Info: Blue (informational messages, tips)


### Typography Hierarchy

**Headings**:
- H1: 3xl (1.875rem), bold, tight leading - Page titles
- H2: 2xl (1.5rem), semibold, tight leading - Section headers
- H3: xl (1.25rem), semibold, normal leading - Subsections
- H4: lg (1.125rem), medium, normal leading - Card titles
- H5: base (1rem), medium, normal leading - Labels
- H6: sm (0.875rem), medium, normal leading - Captions

**Body Text**:
- Large: lg (1.125rem), normal weight - Emphasis text
- Base: base (1rem), normal weight - Primary content
- Small: sm (0.875rem), normal weight - Secondary content
- Tiny: xs (0.75rem), normal weight - Metadata, timestamps

**Special Text**:
- Label: sm, medium weight, wide letter spacing - Form labels
- Caption: xs, normal weight, normal spacing - Help text
- Code: mono font, sm, neutral-700 bg - Inline code

### Spacing and Layout

**Container Padding**:
- Mobile: 4 (1rem)
- Tablet: 6 (1.5rem)
- Desktop: 8 (2rem)

**Component Spacing**:
- Compact: gap-2 (0.5rem)
- Comfortable: gap-4 (1rem)
- Spacious: gap-6 (1.5rem)

**Section Spacing**:
- Between sections: mb-8 or mb-12
- Between cards: gap-4 or gap-6
- Within cards: p-4, p-6, or p-8

### Depth and Elevation

**Shadow Levels**:
- Level 0: No shadow - Flat elements
- Level 1: xs shadow - Subtle lift (inputs)
- Level 2: sm shadow - Cards at rest
- Level 3: base shadow - Cards on hover
- Level 4: md shadow - Dropdowns, popovers
- Level 5: lg shadow - Modals, drawers
- Level 6: xl shadow - Overlays, notifications

**Glass Effect**:
- Light mode: white/80 + blur(12px) + border white/20
- Dark mode: black/80 + blur(16px) + border white/10
- Use for: Navbar, sidebar, overlays, floating elements

**Border Radius**:
- Small elements: 0.5rem (buttons, inputs)
- Medium elements: 0.75rem (cards, modals)
- Large elements: 1rem (dashboard cards)
- Extra large: 1.5rem (hero sections)


## Accessibility Guidelines

### Keyboard Navigation

**Focus Management**:
- Visible focus indicators on all interactive elements
- Logical tab order following visual layout
- Skip links for main content
- Focus trap in modals and drawers
- Arrow key navigation in menus and lists

**Keyboard Shortcuts**:
- Cmd/Ctrl + K: Open search
- Cmd/Ctrl + B: Toggle sidebar
- Cmd/Ctrl + /: Show keyboard shortcuts
- Esc: Close modals, cancel actions
- Enter: Submit forms, activate buttons
- Space: Toggle checkboxes, expand items

### Screen Reader Support

**ARIA Attributes**:
- `role` for custom components (menu, dialog, tablist)
- `aria-label` for icon-only buttons
- `aria-labelledby` for section headers
- `aria-describedby` for help text
- `aria-live` for dynamic content updates
- `aria-expanded` for collapsible sections
- `aria-selected` for selected items

**Semantic HTML**:
- Use `<nav>` for navigation
- Use `<main>` for primary content
- Use `<aside>` for sidebars
- Use `<button>` for actions
- Use `<a>` for navigation
- Use proper heading hierarchy

### Color Contrast

**WCAG AA Requirements**:
- Normal text (< 18px): 4.5:1 minimum
- Large text (>= 18px): 3:1 minimum
- UI components: 3:1 minimum
- Focus indicators: 3:1 minimum

**Testing Tools**:
- Chrome DevTools contrast checker
- axe DevTools browser extension
- Lighthouse accessibility audit
- Manual testing with color blindness simulators

### Touch Targets

**Minimum Sizes**:
- Mobile: 44x44px (iOS guideline)
- Desktop: 32x32px (mouse precision)
- Spacing: 8px minimum between targets

**Implementation**:
```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}
```

## Performance Optimization

### Bundle Size Strategy

**Code Splitting**:
- Route-based splitting (React.lazy)
- Component-based splitting for large components
- Vendor chunk separation
- Dynamic imports for heavy libraries

**Tree Shaking**:
- ES modules for all components
- Named exports instead of default
- Avoid barrel exports for large libraries
- Use `sideEffects: false` in package.json


### Asset Optimization

**SVG Icons**:
- SVGO optimization (precision: 2)
- Remove unnecessary metadata
- Inline critical icons
- Lazy load non-critical icons
- Use SVG sprites for repeated icons

**Images**:
- WebP format with JPEG fallback
- Responsive images with srcset
- Lazy loading below fold
- Blur placeholder while loading
- Compression with quality 80-85

**Fonts**:
- System font stack as primary
- Subset custom fonts to used characters
- Preload critical font files
- Font-display: swap for custom fonts
- WOFF2 format for modern browsers

### CSS Optimization

**Critical CSS**:
- Extract above-the-fold styles
- Inline critical CSS in HTML
- Defer non-critical CSS
- Remove unused Tailwind classes

**Tailwind Configuration**:
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [], // Avoid dynamic class generation
  theme: {
    extend: {
      // Only extend what's needed
    }
  }
}
```

### Runtime Performance

**React Optimization**:
- React.memo for pure components
- useMemo for expensive calculations
- useCallback for event handlers
- Virtualization for long lists (react-window)
- Debounce search inputs
- Throttle scroll handlers

**Animation Performance**:
- Use transform and opacity (GPU accelerated)
- Avoid animating layout properties
- Use will-change sparingly
- Disable animations on low-end devices
- Respect prefers-reduced-motion

## Migration Strategy

### Phase 1: Foundation (Week 1-2)

**Objectives**:
- Establish design token system
- Configure Tailwind with tokens
- Set up Storybook
- Create base utilities

**Deliverables**:
- `design-tokens.json` with complete token set
- `tailwind.config.premium.js` configured
- Storybook instance running
- Theme provider component
- CSS variable system

**Success Criteria**:
- All tokens accessible via Tailwind classes
- Theme switching works in Storybook
- No breaking changes to existing app


### Phase 2: Core Components (Week 3-4)

**Objectives**:
- Build Navbar and Sidebar
- Create DashboardCard component
- Implement icon system
- Set up animation library

**Deliverables**:
- PremiumNavbar with all features
- PremiumSidebar with responsive behavior
- DashboardCard with variants
- Icon loader and 20+ optimized icons
- Framer Motion integration

**Success Criteria**:
- Components render in Storybook
- All variants documented
- Accessibility tests pass
- Performance budget met

**Migration Steps**:
1. Create new components in `src/design-system/`
2. Add feature flag `USE_PREMIUM_NAVBAR`
3. Conditionally render new vs old components
4. Test in staging environment
5. Gradual rollout to production
6. Remove old components after validation

### Phase 3: Data Components (Week 5-6)

**Objectives**:
- Build DataTable component
- Create FormControls suite
- Implement AlertCenter
- Add Modal and Drawer

**Deliverables**:
- DataTable with virtualization
- Complete form control set
- AlertCenter with filtering
- Modal and Drawer components

**Success Criteria**:
- Handle 1000+ rows smoothly
- Form validation works
- Keyboard navigation complete
- Mobile responsive

### Phase 4: Polish and Optimization (Week 7-8)

**Objectives**:
- Performance optimization
- Accessibility audit
- Visual regression testing
- Documentation completion

**Deliverables**:
- Lighthouse score >= 80
- WCAG AA compliance
- Complete Storybook documentation
- Migration guide for developers

**Success Criteria**:
- All performance metrics met
- Zero accessibility violations
- 100% component coverage in Storybook
- Developer feedback incorporated


### Rollback Strategy

**Feature Flags**:
```typescript
const featureFlags = {
  USE_PREMIUM_NAVBAR: true,
  USE_PREMIUM_SIDEBAR: true,
  USE_PREMIUM_CARDS: true,
  USE_PREMIUM_FORMS: true,
  USE_PREMIUM_TABLE: true
};

// Component wrapper
const Navbar = featureFlags.USE_PREMIUM_NAVBAR 
  ? PremiumNavbar 
  : LegacyNavbar;
```

**Rollback Procedure**:
1. Identify issue in production
2. Toggle feature flag to false
3. Deploy flag change (< 5 minutes)
4. Verify legacy component works
5. Investigate and fix issue
6. Re-enable feature flag

**Monitoring**:
- Error tracking (Sentry/LogRocket)
- Performance monitoring (Web Vitals)
- User feedback collection
- A/B testing metrics

## Advanced Features

### Dynamic Theming

**Custom Primary Color**:
```typescript
const setCustomPrimaryColor = (hue: number) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-hue', hue.toString());
  
  // Generate color scale from hue
  for (let i = 50; i <= 900; i += 50) {
    const lightness = calculateLightness(i);
    root.style.setProperty(
      `--primary-${i}`,
      `hsl(${hue}, 80%, ${lightness}%)`
    );
  }
};
```

**User Preferences**:
```typescript
interface UserThemePreferences {
  mode: 'light' | 'dark' | 'system';
  primaryHue: number;
  accentColor: string;
  borderRadius: 'sm' | 'md' | 'lg';
  density: 'compact' | 'comfortable' | 'spacious';
  reducedMotion: boolean;
  highContrast: boolean;
}
```

### Premium Glass Mode

**Intensified Glass Effect**:
- Increased blur: 24px (vs 12px standard)
- Lower opacity: 70% (vs 80% standard)
- Stronger borders: 30% opacity (vs 20%)
- Enhanced shadows: glass-dark variant
- Animated gradient backgrounds

**Activation**:
```typescript
const enablePremiumGlass = () => {
  document.documentElement.classList.add('premium-glass');
};
```

### Branding System

**Logo Variants**:
- Full logo (light/dark)
- Icon only (light/dark)
- Wordmark (light/dark)
- Lockup variations

**SVG Structure**:
```xml
<svg viewBox="0 0 200 50">
  <g id="icon"><!-- Icon paths --></g>
  <g id="wordmark"><!-- Text paths --></g>
</svg>
```

**Usage**:
```typescript
<Logo 
  variant="full" 
  theme="dark" 
  size="md"
  className="navbar-logo"
/>
```


## Visual Testing Strategy

### Chromatic Integration

**Setup**:
```bash
npm install --save-dev chromatic
npx chromatic --project-token=<token>
```

**Configuration**:
```javascript
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-themes'
  ]
};
```

**Test Matrix**:
- All component variants
- Light and dark themes
- Mobile, tablet, desktop viewports
- Hover, focus, active states
- Loading and error states

### Percy Integration

**Snapshot Strategy**:
- Capture baseline on main branch
- Compare PR changes against baseline
- Flag visual regressions
- Require approval for intentional changes

**Coverage**:
- All Storybook stories
- Key user flows
- Responsive breakpoints
- Theme variations

## Documentation Structure

### Storybook Organization

```
Design System/
├── Introduction
├── Design Tokens/
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Elevation
│   └── Animation
├── Components/
│   ├── Primitives/
│   │   ├── Button
│   │   ├── Input
│   │   ├── Card
│   │   └── ...
│   └── Composed/
│       ├── Navbar
│       ├── Sidebar
│       ├── DataTable
│       └── ...
├── Patterns/
│   ├── Forms
│   ├── Navigation
│   ├── Data Display
│   └── Feedback
└── Guidelines/
    ├── Accessibility
    ├── Responsive Design
    ├── Animation
    └── Performance
```

### Component Documentation Template

```markdown
# Component Name

## Overview
Brief description of component purpose and use cases.

## Variants
- Default: Standard appearance
- Glass: Translucent with backdrop blur
- Highlight: Emphasized with gradient

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'default' | Visual variant |
| size | string | 'md' | Size variant |

## Examples
### Basic Usage
[Code example]

### With Custom Props
[Code example]

## Accessibility
- Keyboard navigation support
- ARIA attributes
- Screen reader announcements

## Performance
- Bundle size: X KB gzip
- Render time: X ms

## Related Components
- [Link to related components]
```


## Implementation Examples

### Example 1: Dashboard Page with Premium Components

```typescript
import { PremiumNavbar } from '@/design-system/components/Navbar';
import { PremiumSidebar } from '@/design-system/components/Sidebar';
import { DashboardCard } from '@/design-system/components/DashboardCard';
import { AlertCenter } from '@/design-system/components/AlertCenter';
import { Users, Car, Wrench, TrendingUp } from 'lucide-react';

export const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PremiumNavbar
        user={{ name: 'João Silva', email: 'joao@oficina.com' }}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isDark={isDarkMode}
        notificationCount={3}
      />
      
      <div className="flex">
        <PremiumSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Clientes"
              value="1,234"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
              subtitle="vs. mês anterior"
              variant="glass"
            />
            <DashboardCard
              title="Veículos Ativos"
              value="856"
              icon={Car}
              trend={{ value: 5, isPositive: true }}
              variant="glass"
            />
            <DashboardCard
              title="Serviços Hoje"
              value="23"
              icon={Wrench}
              variant="highlight"
            />
            <DashboardCard
              title="Receita Mensal"
              value="R$ 45.2K"
              icon={TrendingUp}
              trend={{ value: 18, isPositive: true }}
              variant="glass"
            />
          </div>
          
          {/* Alert Center */}
          <AlertCenter
            alerts={alerts}
            onDismiss={handleDismissAlert}
            onAction={handleAlertAction}
          />
        </main>
      </div>
    </div>
  );
};
```

### Example 2: Form with Premium Controls

```typescript
import { FormInput, FormSelect, FormDatePicker } from '@/design-system/components/FormControls';
import { Modal } from '@/design-system/components/Modal';
import { useForm } from 'react-hook-form';

export const ClientForm = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Cliente"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Nome Completo"
          {...register('name', { required: true })}
          error={errors.name?.message}
          placeholder="Digite o nome"
        />
        
        <FormInput
          label="CPF/CNPJ"
          {...register('document')}
          mask="cpf-cnpj"
          placeholder="000.000.000-00"
        />
        
        <FormDatePicker
          label="Data de Nascimento"
          {...register('birthDate')}
        />
        
        <FormSelect
          label="Tipo de Cliente"
          options={[
            { value: 'individual', label: 'Pessoa Física' },
            { value: 'business', label: 'Pessoa Jurídica' }
          ]}
          {...register('type')}
        />
        
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Salvar Cliente
          </button>
        </div>
      </form>
    </Modal>
  );
};
```


### Example 3: Data Table with Premium Styling

```typescript
import { DataTable } from '@/design-system/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

export const ClientsTable = () => {
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {row.original.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-neutral-500">{row.original.email}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'vehicles',
      header: 'Veículos',
      cell: ({ row }) => (
        <span className="px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm">
          {row.original.vehicles.length}
        </span>
      )
    },
    {
      accessorKey: 'lastVisit',
      header: 'Última Visita',
      cell: ({ row }) => formatDate(row.original.lastVisit)
    }
  ];
  
  return (
    <DataTable
      columns={columns}
      data={clients}
      searchable
      sortable
      pagination
      onRowClick={(client) => navigate(`/clients/${client.id}`)}
    />
  );
};
```

## Design Decisions and Rationale

### Why Glass Morphism?

**Benefits**:
- Creates visual hierarchy without heavy shadows
- Maintains readability with backdrop blur
- Adapts naturally to light and dark themes
- Feels modern and premium
- Reduces visual weight compared to solid backgrounds

**Considerations**:
- Browser support (fallback to solid backgrounds)
- Performance impact (GPU acceleration required)
- Accessibility (ensure sufficient contrast)

### Why 180ms Animation Duration?

**Research**:
- Human perception threshold: 100ms
- Comfortable feedback: 150-200ms
- Apple's standard: 180ms
- Too fast (< 100ms): Jarring, hard to follow
- Too slow (> 300ms): Feels sluggish

**Application**:
- Hover states: 150ms (instant feedback)
- Transitions: 200ms (comfortable)
- Page changes: 300ms (allows comprehension)

### Why Tailwind Over CSS-in-JS?

**Advantages**:
- Zero runtime overhead
- Smaller bundle size
- Better performance
- Easier to optimize (PurgeCSS)
- Design token integration
- Familiar to team

**Trade-offs**:
- Less dynamic styling
- Longer class names
- Requires build step


### Why Component Variants Over Props?

**Pattern**:
```typescript
// Preferred: Variants
<Button variant="primary" size="lg">Click</Button>

// Avoided: Boolean props
<Button isPrimary isLarge>Click</Button>
```

**Reasoning**:
- Clearer intent and semantics
- Easier to extend with new variants
- Better TypeScript autocomplete
- Prevents invalid combinations
- Follows industry standards (Radix, shadcn)

### Why Framer Motion Over CSS Animations?

**Advantages**:
- Declarative animation API
- Gesture support (drag, hover, tap)
- Layout animations
- Orchestration and sequencing
- Exit animations
- Reduced motion support built-in

**Trade-offs**:
- Larger bundle size (~30KB gzip)
- Runtime overhead
- Learning curve

**Mitigation**:
- Tree-shake unused features
- Lazy load for non-critical animations
- Provide CSS fallbacks

## Future Enhancements

### Phase 5: Advanced Features (Future)

**AI-Powered Theming**:
- Analyze brand colors and generate optimal palette
- Suggest accessible color combinations
- Auto-adjust for WCAG compliance

**Component Playground**:
- Live code editor in Storybook
- Real-time prop manipulation
- Export code snippets
- Share configurations

**Design Tokens Studio**:
- Visual token editor
- Export to multiple formats (CSS, SCSS, JSON)
- Version control for tokens
- Team collaboration features

**Advanced Analytics**:
- Component usage tracking
- Performance monitoring per component
- User interaction heatmaps
- A/B testing framework

### Potential Integrations

**Figma Plugin**:
- Sync design tokens from Figma
- Generate components from designs
- Export styles to code
- Maintain design-dev parity

**Storybook Addons**:
- Design token inspector
- Accessibility checker
- Performance profiler
- Responsive preview

**Developer Tools**:
- VS Code extension for component snippets
- ESLint rules for design system usage
- Automated migration scripts
- Component generator CLI

## Conclusion

This design system provides a comprehensive foundation for building a premium, accessible, and performant workshop management interface. By following Apple's design principles and modern web standards, we create an experience that feels polished and professional while maintaining excellent usability and performance.

The phased migration approach ensures minimal disruption to ongoing development while allowing for iterative improvements and feedback incorporation. Feature flags enable safe rollouts and quick rollbacks if issues arise.

Success will be measured by:
- Lighthouse performance scores >= 80 (desktop), >= 60 (mobile)
- WCAG AA compliance across all components
- Developer satisfaction and adoption rate
- Reduced time to implement new features
- Consistent visual language across the application

The system is designed to evolve with the product, supporting future enhancements while maintaining backward compatibility and performance standards.
