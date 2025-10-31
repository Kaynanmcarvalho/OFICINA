# Design Document

## Overview

This document defines the comprehensive design for the premium redesign of the "Registros Recentes" (Recent Records) section. The design follows Apple's Human Interface Guidelines principles of clarity, deference, and depth, creating a visually stunning, highly functional interface that sets a new standard for the application.

### Design Philosophy

The redesign is built on three core principles:

1. **Clarity**: Information hierarchy is immediately apparent through typography, spacing, and color
2. **Depth**: Layered surfaces with glassmorphism and shadows create natural spatial relationships
3. **Deference**: The interface stays out of the way, letting content take center stage

### Visual Language

- **Soft Geometry**: 20-24px border radius creates approachable, premium feel
- **Natural Shadows**: Multi-layer shadows with 12-32px blur simulate real-world lighting
- **Translucent Surfaces**: Backdrop blur (8-16px) with subtle gradients add depth
- **Refined Motion**: 200-300ms animations with Apple easing (0.2, 0.9, 0.2, 1)
- **Purposeful Color**: Restrained palette with accent colors used sparingly for emphasis

## Architecture

### Component Hierarchy

```
RecentRecordsSection (Container)
├── RecentHeader
│   ├── Title & Count
│   └── GlobalActions (Filter toggle, Settings)
├── SearchBar
│   └── SearchInput with icon
├── RecentFilters (Conditional)
│   ├── StatusFilter
│   ├── TypeFilter
│   ├── PeriodFilter
│   └── FilterActions (Apply, Clear)
├── BulkActions (Conditional)
│   ├── SelectionCount
│   └── BatchActionButtons
├── RecentList
│   ├── GroupHeader (Sticky)
│   └── RecentItem[]
│       ├── SelectionCheckbox
│       ├── ItemAvatar
│       ├── ItemContent
│       │   ├── PrimaryText
│       │   ├── SecondaryText
│       │   └── ItemMetaRow
│       ├── StatusPill
│       └── ItemActions
└── PreviewPanel (Conditional)
    ├── PreviewHeader
    ├── PreviewContent
    └── PreviewActions
```


### State Management

The component uses local React state with the following structure:

```typescript
interface RecentRecordsState {
  searchQuery: string;
  filters: {
    status: StatusType | 'all';
    type: EntityType | 'all';
    period: PeriodType | 'all';
  };
  selectedItems: Set<string>;
  showFilters: boolean;
  selectedItemId: string | null;
  isLoading: boolean;
  error: Error | null;
}
```

### Data Flow

1. **Initial Load**: Parent component passes `items` array via props
2. **Filtering**: Local state filters applied to items array, creating `filteredItems`
3. **Grouping**: `filteredItems` grouped by date into temporal categories
4. **Rendering**: Virtualized rendering of visible items only
5. **Selection**: User interactions update `selectedItems` Set
6. **Actions**: Callbacks passed to parent via `onItemClick`, `onItemAction`, `onBulkAction`

## Components and Interfaces

### 1. RecentRecordsSection (Main Container)

**Purpose**: Orchestrates the entire Recent Records experience

**Props Interface**:
```typescript
interface RecentRecordsSectionProps {
  items: RecordItem[];
  isLoading?: boolean;
  error?: Error | null;
  onItemClick?: (item: RecordItem) => void;
  onItemAction?: (action: ItemAction, item: RecordItem) => void;
  onBulkAction?: (action: BulkAction, items: RecordItem[]) => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
  enablePreview?: boolean;
  enableBulkActions?: boolean;
  enableVirtualization?: boolean;
  virtualizationThreshold?: number;
}
```

**Visual Specifications**:
- Container padding: 24px (desktop), 16px (tablet), 12px (mobile)
- Max width: 100% with responsive breakpoints
- Background: transparent (inherits from parent layout)
- Gap between sections: 24px


### 2. RecentItem (Card Component)

**Purpose**: Displays individual record with all metadata and actions

**Props Interface**:
```typescript
interface RecentItemProps {
  item: RecordItem;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
  onAction?: (action: ItemAction) => void;
  variant?: 'default' | 'compact' | 'expanded';
  showCheckbox?: boolean;
  delay?: number;
}

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

**Visual Specifications**:
- Height: 88px (default), 72px (compact), auto (expanded)
- Border radius: 20px
- Padding: 16px horizontal, 12px vertical
- Background (light): rgba(255, 255, 255, 0.8)
- Background (dark): rgba(28, 28, 30, 0.8)
- Border: 1px solid rgba(0, 0, 0, 0.06) (light), rgba(255, 255, 255, 0.1) (dark)
- Shadow (default): 0 4px 12px rgba(0, 0, 0, 0.08)
- Shadow (hover): 0 8px 24px rgba(0, 0, 0, 0.12)
- Backdrop blur: 12px
- Transition: all 200ms cubic-bezier(0.2, 0.9, 0.2, 1)

**Hover State**:
- Transform: translateY(-2px)
- Shadow: 0 8px 24px rgba(0, 0, 0, 0.12)
- Border opacity: increased by 0.05

**Active State**:
- Transform: scale(0.995)
- Duration: 100ms

**Layout Grid**:
```
[Checkbox 24px] [Avatar 56px] [Content flex-1] [Status 80px] [Actions 80px]
```


### 3. ItemAvatar (Icon Component)

**Purpose**: Visual indicator for entity type and status

**Props Interface**:
```typescript
interface ItemAvatarProps {
  type: 'car' | 'motorcycle' | 'truck' | 'van' | 'client';
  status?: 'completed';
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}
```

**Visual Specifications**:
- Container size: 56px (md), 48px (sm), 64px (lg)
- Icon size: 24px (md), 20px (sm), 28px (lg)
- Border radius: 14px (rounded square)
- Background gradient: type-specific with 0.1-0.2 opacity
- Icon color: type-specific accent color

**Type Color Mapping**:
- Car: Blue (#3B82F6)
- Motorcycle: Orange (#F97316)
- Truck: Purple (#A855F7)
- Van: Green (#10B981)
- Client: Neutral (#737373)

**Completed Badge**:
- Position: absolute top-right with -4px offset
- Size: 20px circle
- Background: emerald (#10B981)
- Icon: checkmark at 12px
- Border: 2px solid white/dark background

### 4. StatusPill (Badge Component)

**Purpose**: Displays current status with color coding

**Props Interface**:
```typescript
interface StatusPillProps {
  status: 'in_progress' | 'completed' | 'pending' | 'cancelled';
  showGlow?: boolean;
  size?: 'sm' | 'md';
}
```

**Visual Specifications**:
- Height: 28px (md), 24px (sm)
- Padding: 12px horizontal, 6px vertical
- Border radius: 14px (full pill)
- Font size: 13px (md), 11px (sm)
- Font weight: 500 (medium)
- Text transform: none

**Status Color Mapping**:
- in_progress: Amber (#F59E0B) - "Em andamento"
- completed: Emerald (#10B981) - "Concluído"
- pending: Blue (#3B82F6) - "Pendente"
- cancelled: Red (#EF4444) - "Cancelado"

**Glow Effect**:
- Box shadow: 0 0 0 4px [status-color with 0.15 opacity]
- Additional shadow: 0 2px 8px [status-color with 0.3 opacity]


### 5. ItemActions (Action Buttons)

**Purpose**: Quick actions and contextual menu

**Props Interface**:
```typescript
interface ItemActionsProps {
  onOpen?: () => void;
  onEdit?: () => void;
  onMore?: () => void;
  disabled?: boolean;
}
```

**Visual Specifications**:
- Button size: 36px × 36px
- Border radius: 10px
- Gap between buttons: 8px
- Icon size: 18px
- Background (hover): rgba(0, 0, 0, 0.05) (light), rgba(255, 255, 255, 0.1) (dark)
- Transition: all 150ms ease

**Button States**:
- Default: transparent background, icon at 0.6 opacity
- Hover: background visible, icon at 1.0 opacity, scale(1.1)
- Active: scale(0.95)
- Disabled: opacity 0.3, cursor not-allowed

**Context Menu**:
- Width: 200px
- Border radius: 12px
- Padding: 8px
- Background: white (light), #2C2C2E (dark)
- Shadow: 0 8px 24px rgba(0, 0, 0, 0.15)
- Backdrop blur: 16px
- Menu item height: 40px
- Menu item padding: 12px
- Menu item hover: background rgba(0, 0, 0, 0.05)

### 6. ItemMetaRow (Metadata Display)

**Purpose**: Displays secondary information (plate, model, date, tags)

**Props Interface**:
```typescript
interface ItemMetaRowProps {
  plate?: string;
  model?: string;
  date: Date;
  tags?: string[];
  showRelativeTime?: boolean;
}
```

**Visual Specifications**:
- Height: 20px
- Gap between items: 12px
- Font size: 12px
- Font weight: 400
- Color: rgba(0, 0, 0, 0.6) (light), rgba(255, 255, 255, 0.6) (dark)
- Separator: "•" with 0.4 opacity

**Plate Formatting**:
- Font family: monospace (SF Mono, Monaco, Cascadia Code)
- Text transform: uppercase
- Format: ABC-1234

**Tag Styling**:
- Display: inline-flex
- Padding: 2px 8px
- Border radius: 6px
- Background: rgba(0, 0, 0, 0.05) (light), rgba(255, 255, 255, 0.1) (dark)
- Font size: 11px


### 7. SearchBar (Search Input)

**Purpose**: Text search with fuzzy matching

**Props Interface**:
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}
```

**Visual Specifications**:
- Height: 48px
- Border radius: 12px
- Padding: 0 16px 0 48px (space for icon)
- Background: rgba(255, 255, 255, 0.8) (light), rgba(28, 28, 30, 0.8) (dark)
- Border: 1px solid rgba(0, 0, 0, 0.06)
- Backdrop blur: 12px
- Font size: 15px
- Icon position: absolute left 16px
- Icon size: 20px
- Icon color: rgba(0, 0, 0, 0.4)

**Focus State**:
- Border color: accent (#007AFF)
- Ring: 0 0 0 4px rgba(0, 122, 255, 0.1)
- Outline: none

### 8. RecentFilters (Filter Panel)

**Purpose**: Advanced filtering controls

**Props Interface**:
```typescript
interface RecentFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose: () => void;
}

interface FilterState {
  status: StatusType | 'all';
  type: EntityType | 'all';
  period: PeriodType | 'all';
}
```

**Visual Specifications**:
- Display: grid with 3 columns on desktop, 1 column on mobile
- Gap: 16px
- Padding: 20px
- Border radius: 16px
- Background: rgba(255, 255, 255, 0.9) (light), rgba(28, 28, 30, 0.9) (dark)
- Border: 1px solid rgba(0, 0, 0, 0.06)
- Backdrop blur: 16px

**Filter Dropdown**:
- Height: 44px
- Border radius: 10px
- Padding: 0 12px
- Background: rgba(0, 0, 0, 0.03) (light), rgba(255, 255, 255, 0.05) (dark)
- Font size: 14px

**Animation**:
- Enter: opacity 0 → 1, translateY(-10px) → 0, 200ms
- Exit: opacity 1 → 0, translateY(0) → -10px, 150ms


### 9. BulkActions (Batch Operations Toolbar)

**Purpose**: Actions for multiple selected items

**Props Interface**:
```typescript
interface BulkActionsProps {
  selectedCount: number;
  onMarkComplete: () => void;
  onDelete: () => void;
  onCancel: () => void;
}
```

**Visual Specifications**:
- Height: 64px
- Padding: 16px 20px
- Border radius: 16px
- Background: rgba(0, 122, 255, 0.1) (light), rgba(0, 122, 255, 0.2) (dark)
- Border: 1px solid rgba(0, 122, 255, 0.3)
- Display: flex, justify-between, align-center

**Animation**:
- Enter: slideDown from -64px to 0, 200ms
- Exit: slideUp from 0 to -64px, 150ms

**Action Buttons**:
- Primary button (Complete): accent background, white text
- Secondary button (Delete): neutral background
- Height: 36px
- Padding: 0 16px
- Border radius: 10px
- Font size: 14px
- Font weight: 500

### 10. PreviewPanel (Detail Sidebar)

**Purpose**: Detailed view of selected record

**Props Interface**:
```typescript
interface PreviewPanelProps {
  item: RecordItem | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}
```

**Visual Specifications (Desktop)**:
- Width: 38% of container (min 400px, max 600px)
- Height: 100% of viewport
- Position: fixed right
- Background: rgba(255, 255, 255, 0.95) (light), rgba(28, 28, 30, 0.95) (dark)
- Backdrop blur: 20px
- Border left: 1px solid rgba(0, 0, 0, 0.06)
- Shadow: -8px 0 32px rgba(0, 0, 0, 0.1)
- Z-index: 40

**Animation**:
- Enter: translateX(100%) → 0, 300ms cubic-bezier(0.2, 0.9, 0.2, 1)
- Exit: translateX(0) → 100%, 250ms cubic-bezier(0.4, 0, 1, 1)

**Backdrop Overlay**:
- Background: rgba(0, 0, 0, 0.2)
- Backdrop blur: 6px
- Z-index: 39

**Mobile Behavior**:
- Width: 100%
- Height: 90vh
- Position: fixed bottom
- Border radius: 24px 24px 0 0
- Animation: translateY(100%) → 0


### 11. EmptyState (Zero Data View)

**Purpose**: Guidance when no records are available

**Props Interface**:
```typescript
interface EmptyStateProps {
  searchQuery?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onCreateNew?: () => void;
}
```

**Visual Specifications**:
- Display: flex column, center aligned
- Padding: 64px 24px
- Icon size: 64px
- Icon color: rgba(0, 0, 0, 0.2) (light), rgba(255, 255, 255, 0.2) (dark)
- Title font size: 20px
- Title font weight: 600
- Title color: rgba(0, 0, 0, 0.8)
- Description font size: 15px
- Description color: rgba(0, 0, 0, 0.5)
- Button margin top: 24px

### 12. RecentSkeleton (Loading Placeholder)

**Purpose**: Loading state that mimics RecentItem structure

**Visual Specifications**:
- Height: 88px (matches RecentItem)
- Border radius: 20px
- Background: rgba(0, 0, 0, 0.05) (light), rgba(255, 255, 255, 0.05) (dark)
- Shimmer gradient: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)
- Animation: translateX(-100%) → 100%, 1500ms infinite

**Skeleton Elements**:
- Avatar circle: 56px diameter
- Primary text bar: 180px × 16px
- Secondary text bar: 140px × 14px
- Meta text bar: 100px × 12px
- Status pill: 80px × 28px

## Data Models

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
  metadata?: {
    clientId?: string;
    vehicleId?: string;
    serviceType?: string;
    assignedTo?: string;
    priority?: 'low' | 'medium' | 'high';
    estimatedCompletion?: Date;
    notes?: string;
  };
}
```

### Action Types

```typescript
type ItemAction = 
  | { type: 'open'; itemId: string }
  | { type: 'edit'; itemId: string }
  | { type: 'duplicate'; itemId: string }
  | { type: 'complete'; itemId: string }
  | { type: 'delete'; itemId: string };

type BulkAction =
  | { type: 'complete'; itemIds: string[] }
  | { type: 'delete'; itemIds: string[] }
  | { type: 'export'; itemIds: string[] };
```


## Error Handling

### Error States

1. **Network Error**: Display banner with retry button
2. **Validation Error**: Inline error messages with red accent
3. **Permission Error**: Disabled state with tooltip explanation
4. **Not Found Error**: Empty state with navigation suggestions

### Error UI Components

**Error Banner**:
- Height: 56px
- Background: rgba(239, 68, 68, 0.1)
- Border: 1px solid rgba(239, 68, 68, 0.3)
- Border radius: 12px
- Icon: alert circle at 20px
- Message font size: 14px
- Retry button: secondary style

**Toast Notification**:
- Width: 360px (max)
- Position: fixed bottom-right with 24px offset
- Background: rgba(28, 28, 30, 0.95) (dark), rgba(255, 255, 255, 0.95) (light)
- Backdrop blur: 16px
- Border radius: 12px
- Padding: 16px
- Shadow: 0 8px 24px rgba(0, 0, 0, 0.2)
- Auto-dismiss: 5 seconds
- Animation: slideUp + fadeIn

## Testing Strategy

### Unit Tests

1. **Component Rendering**: Verify each component renders with default props
2. **Prop Validation**: Test all prop combinations and edge cases
3. **State Management**: Test state updates and side effects
4. **Event Handlers**: Verify callbacks are invoked with correct arguments
5. **Conditional Rendering**: Test visibility logic for conditional elements

### Integration Tests

1. **Search Functionality**: Verify filtering by text query
2. **Filter Combinations**: Test multiple filter criteria together
3. **Selection Logic**: Test single and bulk selection
4. **Action Flows**: Test complete user workflows (select → action → confirm)
5. **Preview Panel**: Test open/close and data display

### Accessibility Tests

1. **Keyboard Navigation**: Tab through all interactive elements
2. **Screen Reader**: Verify ARIA labels and announcements
3. **Focus Management**: Test focus trap in modals
4. **Color Contrast**: Automated contrast ratio checks
5. **Reduced Motion**: Verify animations respect prefers-reduced-motion

### Visual Regression Tests

1. **Component States**: Capture screenshots of all states (default, hover, active, disabled)
2. **Theme Variants**: Test light and dark modes
3. **Responsive Breakpoints**: Test desktop, tablet, mobile layouts
4. **Empty States**: Verify empty and error states
5. **Loading States**: Capture skeleton screens

### Performance Tests

1. **Initial Render**: Measure time to first paint with 100 items
2. **Scroll Performance**: Verify 60fps during virtualized scroll
3. **Search Debounce**: Verify search doesn't trigger excessive re-renders
4. **Bundle Size**: Verify component bundle stays under 25KB gzipped
5. **Memory Leaks**: Test for memory leaks during mount/unmount cycles


## Design Tokens

### Color System

```typescript
const colors = {
  // Neutral scale (light mode)
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Accent (Apple Blue)
  accent: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Semantic colors
  success: {
    light: '#10B981',
    dark: '#34D399',
  },
  warning: {
    light: '#F59E0B',
    dark: '#FBBF24',
  },
  error: {
    light: '#EF4444',
    dark: '#F87171',
  },
  
  // Glass surfaces
  glass: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(28, 28, 30, 0.8)',
  },
};
```

### Typography Scale

```typescript
const typography = {
  fontFamily: {
    sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'sans-serif'],
    mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', 'monospace'],
  },
  
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.05em',
  },
};
```

### Spacing Scale

```typescript
const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};
```

### Border Radius

```typescript
const radius = {
  sm: '6px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
};
```

### Shadows (Elevation)

```typescript
const shadows = {
  light: {
    1: '0 1px 3px rgba(0, 0, 0, 0.08)',
    2: '0 4px 12px rgba(0, 0, 0, 0.08)',
    3: '0 8px 24px rgba(0, 0, 0, 0.12)',
    4: '0 16px 48px rgba(0, 0, 0, 0.16)',
  },
  dark: {
    1: '0 1px 3px rgba(0, 0, 0, 0.4)',
    2: '0 4px 12px rgba(0, 0, 0, 0.5)',
    3: '0 8px 24px rgba(0, 0, 0, 0.6)',
    4: '0 16px 48px rgba(0, 0, 0, 0.7)',
  },
  glass: '0 8px 32px rgba(31, 38, 135, 0.15)',
};
```

### Animation Tokens

```typescript
const animation = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    apple: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
  },
};
```

## Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape / Small desktop
  xl: '1280px',  // Desktop
  '2xl': '1536px', // Large desktop
};
```

## Accessibility Guidelines

### Keyboard Navigation

- **Tab**: Move focus to next interactive element
- **Shift + Tab**: Move focus to previous element
- **Enter/Space**: Activate focused button or select item
- **Escape**: Close modal, dropdown, or preview panel
- **Arrow Keys**: Navigate within dropdown menus
- **Cmd/Ctrl + A**: Select all items (when focus is in list)

### ARIA Attributes

```typescript
// RecentItem
<div
  role="article"
  aria-label={`${item.primaryText}, ${item.status}`}
  tabIndex={0}
>

// StatusPill
<span
  role="status"
  aria-label={`Status: ${statusText}`}
>

// BulkActions
<div
  role="toolbar"
  aria-label="Ações em lote"
  aria-live="polite"
>

// SearchBar
<input
  role="searchbox"
  aria-label="Buscar registros"
  aria-describedby="search-help"
>
```

### Focus Management

- Visible focus ring: 2px solid accent color with 2px offset
- Focus trap in modal/preview panel
- Return focus to trigger element on close
- Skip to content link for keyboard users

### Color Contrast

- Normal text (14-15px): minimum 4.5:1
- Large text (18px+): minimum 3:1
- Interactive elements: minimum 3:1 against background
- Disabled state: minimum 3:1 (informational only)


## Implementation Notes

### Tailwind Configuration

The design requires extending the default Tailwind config:

```javascript
// tailwind.config.recent.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Import from design-tokens.json
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'elevation-2': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'elevation-3': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'elevation-4': '0 16px 48px rgba(0, 0, 0, 0.16)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.2, 0.9, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
```

### Framer Motion Variants

```typescript
// Animation variants for consistent motion
export const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      delay: delay * 0.05,
      ease: [0.2, 0.9, 0.2, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15 },
  },
};

export const panelVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.2, 0.9, 0.2, 1],
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};
```

### SVG Icon Optimization

All icons should be optimized with SVGO:

```json
{
  "plugins": [
    {
      "name": "preset-default",
      "params": {
        "overrides": {
          "removeViewBox": false,
          "cleanupIDs": true
        }
      }
    },
    "removeDimensions",
    {
      "name": "convertColors",
      "params": {
        "currentColor": true
      }
    }
  ],
  "floatPrecision": 2
}
```

### Performance Optimizations

1. **Virtualization**: Use `react-window` or `react-virtual` for lists > 30 items
2. **Lazy Loading**: Code-split PreviewPanel with React.lazy()
3. **Memoization**: Wrap expensive computations with useMemo
4. **Debouncing**: Debounce search input with 300ms delay
5. **Image Optimization**: Use WebP format with fallback
6. **Bundle Analysis**: Monitor bundle size with webpack-bundle-analyzer

### Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions (iOS 14+)
- Backdrop-filter fallback for older browsers

### Migration Strategy

1. **Phase 1**: Deploy behind feature flag `ENABLE_PREMIUM_RECENT_RECORDS`
2. **Phase 2**: A/B test with 10% of users
3. **Phase 3**: Gradual rollout to 50% of users
4. **Phase 4**: Full rollout with old component as fallback
5. **Phase 5**: Remove old component after 2 weeks of stability

### Rollback Plan

If critical issues are discovered:

1. Disable feature flag immediately
2. Investigate and fix issues in development
3. Deploy hotfix with additional tests
4. Re-enable feature flag for gradual rollout

## Deliverables Checklist

- [ ] Component source files in `/src/components/recent/`
- [ ] Design tokens JSON file
- [ ] Tailwind config extension
- [ ] Optimized SVG icons in `/src/icons/recent/`
- [ ] Storybook stories for all components
- [ ] Unit tests with >80% coverage
- [ ] Accessibility tests with axe-core
- [ ] Visual regression test screenshots
- [ ] Performance benchmark results
- [ ] README.md with API documentation
- [ ] Migration guide document
- [ ] Video demo (30-60 seconds)
- [ ] Figma/PNG wireframes (desktop, tablet, mobile)
- [ ] QA checklist document
- [ ] Bundle size report

## Success Metrics

### Performance Targets

- Initial render: < 500ms for 100 items
- Scroll performance: 60fps maintained
- Search response: < 100ms after debounce
- Bundle size: < 25KB gzipped
- Lighthouse score: > 95

### User Experience Targets

- Task completion rate: > 95%
- Time to find item: < 5 seconds
- Error rate: < 1%
- User satisfaction: > 4.5/5

### Accessibility Targets

- WCAG AA compliance: 100%
- Keyboard navigation: All features accessible
- Screen reader compatibility: NVDA, JAWS, VoiceOver
- Color contrast: All text meets minimum ratios

## Future Enhancements

Potential features for future iterations:

1. **Advanced Filters**: Custom date ranges, multiple status selection
2. **Saved Views**: Save filter combinations as presets
3. **Drag and Drop**: Reorder items or drag to other sections
4. **Inline Editing**: Edit fields directly in the list
5. **Export**: Export filtered results to CSV/PDF
6. **Keyboard Shortcuts**: Power user shortcuts for common actions
7. **Customizable Columns**: User-configurable metadata display
8. **Real-time Updates**: WebSocket integration for live updates
9. **Collaborative Features**: See who else is viewing/editing
10. **AI-Powered Search**: Natural language queries and suggestions
