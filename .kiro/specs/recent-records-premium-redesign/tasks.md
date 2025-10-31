# Implementation Plan

## Overview

This implementation plan breaks down the premium redesign of "Registros Recentes" into discrete, manageable coding tasks. Each task builds incrementally on previous work, ensuring the feature can be integrated and tested at each step. The plan follows an implementation-first approach, with optional testing tasks marked with *.

## Task List

- [x] 1. Setup project structure and design tokens




  - Create directory structure `/src/components/recent/` for all new components
  - Create `/src/components/recent/design-tokens.json` with complete color, typography, spacing, radius, shadow, and animation token definitions
  - Create `/src/components/recent/tailwind.config.recent.js` extending base Tailwind config with custom tokens




  - Create `/src/icons/recent/` directory for optimized SVG icons
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_









- [ ] 2. Create SVG icon system
  - [ ] 2.1 Create and optimize vehicle type icons (car, motorcycle, truck, van, client)
    - Design SVG icons at 24px with 2px stroke width






    - Optimize with SVGO using currentColor for fill/stroke
    - Export to `/src/icons/recent/` with consistent naming (icon-car.svg, icon-motorcycle.svg, etc.)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_




  
  - [ ] 2.2 Create action and UI icons
    - Create icons for: search, filter, more-vertical, external-link, edit, trash, check, x-close






    - Optimize and export to `/src/icons/recent/`
    - _Requirements: 10.1, 10.5_
  
  - [ ] 2.3 Create IconLoader utility component
    - Write `/src/components/recent/IconLoader.tsx` that dynamically imports icons by name

    - Support size prop (sm: 20px, md: 24px, lg: 28px)


    - Support className prop for custom styling
    - _Requirements: 5.1, 5.2_

- [ ] 3. Build primitive components
  - [ ] 3.1 Create ItemAvatar component
    - Write `/src/components/recent/ItemAvatar.tsx` with props: type, status, size, showBadge


    - Implement 56px container with 14px border radius and gradient background
    - Render IconLoader with type-specific icon at 24px
    - Apply type-specific gradient backgrounds (car: blue, motorcycle: orange, truck: purple, van: green, client: neutral)
    - Add completed badge overlay (20px circle, emerald background, checkmark icon) when status is "completed"
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [-] 3.2 Create StatusPill component

    - Write `/src/components/recent/StatusPill.tsx` with props: status, showGlow, size
    - Implement pill shape (14px border radius, 12px horizontal padding, 6px vertical padding)
    - Map status to colors: in_progress (amber #F59E0B), completed (emerald #10B981), pending (blue #3B82F6), cancelled (red #EF4444)
    - Map status to Portuguese text: "Em andamento", "Concluído", "Pendente", "Cancelado"
    - Apply glow effect with box-shadow when showGlow is true
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_


  
  - [ ] 3.3 Create ItemMetaRow component
    - Write `/src/components/recent/ItemMetaRow.tsx` with props: plate, model, date, tags, showRelativeTime
    - Display metadata items separated by "•" with 12px gap
    - Format plate in uppercase with monospace font
    - Format date using Intl.DateTimeFormat with pt-BR locale
    - Display relative time ("há 5 minutos") for dates within last 24 hours when showRelativeTime is true
    - Render tags as small pills with 6px border radius
    - _Requirements: 18.1, 18.2, 18.3, 18.5_


- [ ] 4. Build ItemActions component with context menu
  - [ ] 4.1 Create ItemActions component
    - Write `/src/components/recent/ItemActions.tsx` with props: onOpen, onEdit, onMore, disabled
    - Render three icon buttons (36px × 36px, 10px border radius) for open, edit, and more actions
    - Apply hover state: background visible, scale(1.1), 150ms transition
    - Apply active state: scale(0.95)
    - Add tooltips with 500ms delay showing action labels
    - _Requirements: 10.1, 10.2, 10.3, 10.5_
  
  - [ ] 4.2 Create ContextMenu component
    - Write `/src/components/recent/ContextMenu.tsx` with props: items, position, onClose
    - Implement 200px width menu with 12px border radius
    - Apply glassmorphism: backdrop-blur 16px, translucent background
    - Render menu items (40px height, 12px padding) with hover states
    - Support keyboard navigation (arrow keys, enter, escape)
    - Position menu at cursor or relative to trigger element
    - _Requirements: 10.4, 17.1, 17.2_
  
  - [ ] 4.3 Integrate ContextMenu into ItemActions
    - Show ContextMenu when "more" button is clicked
    - Populate menu with options: "Duplicar", "Marcar como concluído", "Excluir"
    - Close menu when clicking outside or pressing Escape
    - Invoke appropriate callbacks when menu items are selected
    - _Requirements: 10.3, 10.4_

- [ ] 5. Build RecentItem card component
  - [ ] 5.1 Create RecentItem base structure
    - Write `/src/components/recent/RecentItem.tsx` with props: item, isSelected, onSelect, onClick, onAction, variant, showCheckbox, delay
    - Implement 88px height card with 20px border radius
    - Apply glassmorphism: rgba(255,255,255,0.8) background (light), rgba(28,28,30,0.8) (dark), 12px backdrop-blur
    - Apply 1px border with rgba(0,0,0,0.06) (light), rgba(255,255,255,0.1) (dark)
    - Apply shadow: 0 4px 12px rgba(0,0,0,0.08)
    - Layout: flex row with 16px horizontal padding, 12px vertical padding
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 7.1_
  
  - [ ] 5.2 Add content sections to RecentItem
    - Render SelectionCheckbox (24px) on left when showCheckbox is true
    - Render ItemAvatar (56px) with item.type and item.status
    - Render content column (flex-1) with primaryText (16px semibold), secondaryText (14px regular)
    - Render ItemMetaRow with plate, model, date, tags
    - Render StatusPill with item.status
    - Render ItemActions with callbacks
    - Apply text truncation with ellipsis to prevent overflow
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 5.3 Implement RecentItem interactions
    - Add hover state: translateY(-2px), shadow 0 8px 24px rgba(0,0,0,0.12), 200ms transition with apple easing
    - Add active state: scale(0.995), 100ms duration
    - Add click handler that invokes onClick callback
    - Add keyboard support: Enter/Space to activate
    - Apply ARIA attributes: role="article", aria-label with item description
    - _Requirements: 7.1, 7.2, 17.1, 17.2, 17.3_
  
  - [ ] 5.4 Add Framer Motion animations to RecentItem
    - Wrap component with motion.div
    - Apply entry animation: opacity 0 → 1, translateY(8px) → 0, 260ms duration with apple easing
    - Apply staggered delay based on delay prop (delay * 50ms)
    - Apply exit animation: opacity 1 → 0, translateY(-8px), 150ms duration
    - Respect prefers-reduced-motion by disabling animations when set
    - _Requirements: 7.3, 7.5_


- [ ] 6. Create loading and empty states
  - [ ] 6.1 Create RecentSkeleton component
    - Write `/src/components/recent/RecentSkeleton.tsx` matching RecentItem dimensions (88px height, 20px radius)
    - Create placeholder blocks for avatar (56px circle), primary text (180px × 16px), secondary text (140px × 14px), meta (100px × 12px), status (80px × 28px)
    - Apply neutral gray background with 0.05-0.1 opacity
    - Implement shimmer animation: linear gradient moving left to right, 1500ms duration, infinite loop
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [ ] 6.2 Create EmptyState component
    - Write `/src/components/recent/EmptyState.tsx` with props: searchQuery, hasFilters, onClearFilters, onCreateNew
    - Center content vertically and horizontally with flex layout
    - Display icon (64px) with muted color (0.2 opacity)
    - Display title (20px, semibold, 0.8 opacity) and description (15px, regular, 0.5 opacity)
    - Show "Nenhum registro encontrado" when no data and no filters
    - Show "Nenhum resultado para os filtros aplicados" with "Limpar filtros" button when filters are active
    - Show "Criar novo registro" button when appropriate
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 7. Build search and filter components
  - [ ] 7.1 Create SearchBar component
    - Write `/src/components/recent/SearchBar.tsx` with props: value, onChange, placeholder, debounceMs
    - Implement 48px height input with 12px border radius
    - Apply glassmorphism background and 12px backdrop-blur
    - Position search icon (20px) at left with 16px offset
    - Implement debounced onChange with 300ms default delay using useMemo or custom hook
    - Apply focus state: accent border color, ring with 0.1 opacity
    - Add ARIA attributes: role="searchbox", aria-label="Buscar registros"
    - _Requirements: 8.1, 15.4, 17.3_
  
  - [ ] 7.2 Create RecentFilters component
    - Write `/src/components/recent/RecentFilters.tsx` with props: filters, onChange, onClose
    - Implement responsive grid: 3 columns on desktop (lg+), 1 column on mobile
    - Create three filter dropdowns: status, type, period
    - Status options: "Todos", "Em andamento", "Concluído", "Pendente", "Cancelado"
    - Type options: "Todos", "Carro", "Moto", "Caminhão", "Van"
    - Period options: "Todos", "Hoje", "Ontem", "Últimos 7 dias", "Últimos 30 dias"
    - Apply glassmorphism: 0.9 opacity background, 16px backdrop-blur
    - Add "Aplicar" and "Limpar" action buttons
    - _Requirements: 8.2, 8.3, 8.4_
  
  - [ ] 7.3 Add animations to RecentFilters
    - Wrap with AnimatePresence and motion.div
    - Entry animation: opacity 0 → 1, translateY(-10px) → 0, 200ms
    - Exit animation: opacity 1 → 0, translateY(0) → -10px, 150ms
    - _Requirements: 7.3_

- [ ] 8. Implement bulk selection and actions
  - [ ] 8.1 Create BulkActions toolbar component
    - Write `/src/components/recent/BulkActions.tsx` with props: selectedCount, onMarkComplete, onDelete, onCancel
    - Implement 64px height toolbar with 16px border radius
    - Apply accent background with 0.1 opacity and 0.3 opacity border
    - Display selection count: "X itens selecionados"
    - Render action buttons: "Marcar como concluído" (primary), "Excluir" (secondary)
    - Layout: flex with space-between, align-center
    - _Requirements: 11.3, 11.4_
  
  - [ ] 8.2 Add animations to BulkActions
    - Entry animation: slideDown from -64px to 0, 200ms
    - Exit animation: slideUp from 0 to -64px, 150ms
    - Wrap with AnimatePresence for mount/unmount animations
    - _Requirements: 11.2_
  
  - [ ] 8.3 Integrate selection logic into RecentItem
    - Add checkbox rendering when showCheckbox prop is true or any item is selected
    - Style checkbox: 20px size, accent color, rounded corners
    - Invoke onSelect callback when checkbox is clicked
    - Apply visual indication when isSelected is true (border accent color, background tint)
    - _Requirements: 11.1_


- [ ] 9. Build RecentList with grouping and virtualization
  - [ ] 9.1 Create RecentList component structure
    - Write `/src/components/recent/RecentList.tsx` with props: items, isLoading, onItemClick, onItemAction, enableVirtualization, virtualizationThreshold
    - Implement filtering logic using useMemo: filter items by searchQuery matching primaryText, secondaryText, plate
    - Implement grouping logic: group filtered items into "Hoje", "Ontem", "Últimos 7 dias", "Mais antigos" based on date
    - Sort items within each group by date descending (most recent first)
    - _Requirements: 8.1, 9.1, 9.4_
  
  - [ ] 9.2 Render grouped items with sticky headers
    - Render each group with a sticky header (12px uppercase text, semibold, 0.05em letter-spacing)
    - Apply backdrop-blur to sticky headers for glass effect
    - Hide empty groups from display
    - Render RecentItem components for each item in the group with staggered delay
    - _Requirements: 9.2, 9.3, 9.5_
  
  - [ ] 9.3 Implement virtualization for large lists
    - Install and import react-window or react-virtual
    - Wrap item rendering with FixedSizeList when item count exceeds virtualizationThreshold (default 30)
    - Calculate item height (88px) and container height dynamically
    - Maintain scroll position accuracy when items are added/removed
    - Render buffer of 5 items above and below visible area
    - _Requirements: 15.1, 15.2_
  
  - [ ] 9.4 Add loading and empty state rendering
    - When isLoading is true, render 5 RecentSkeleton components
    - When items.length is 0 and not loading, render EmptyState component
    - Pass searchQuery and hasFilters props to EmptyState
    - Animate transition from skeleton to content with 200ms fade
    - _Requirements: 13.5_

- [ ] 10. Create PreviewPanel component
  - [ ] 10.1 Create PreviewPanel structure
    - Write `/src/components/recent/PreviewPanel.tsx` with props: item, onClose, onEdit, onDelete, onDuplicate
    - Implement fixed positioning on right side with 38% width (min 400px, max 600px)
    - Apply glassmorphism: 0.95 opacity background, 20px backdrop-blur
    - Add 1px left border and shadow: -8px 0 32px rgba(0,0,0,0.1)
    - Create three sections: header, content (scrollable), footer with actions
    - _Requirements: 12.1, 12.2_
  
  - [ ] 10.2 Implement PreviewPanel content sections
    - Header: display item.primaryText (20px semibold), close button (top-right)
    - Content: display all item metadata, status history, related entities
    - Use ItemAvatar, StatusPill, and ItemMetaRow components for consistency
    - Footer: render action buttons (Editar, Duplicar, Marcar como concluído, Excluir)
    - _Requirements: 12.2, 12.3_
  
  - [ ] 10.3 Add PreviewPanel animations
    - Entry animation: translateX(100%) → 0, 300ms with apple easing
    - Exit animation: translateX(0) → 100%, 250ms
    - Add backdrop overlay with rgba(0,0,0,0.2) and 6px backdrop-blur
    - Backdrop animation: opacity 0 → 1 (200ms) on enter, 1 → 0 (150ms) on exit
    - _Requirements: 12.1, 12.5_
  
  - [ ] 10.4 Implement PreviewPanel interactions
    - Close panel when clicking backdrop overlay
    - Close panel when pressing Escape key
    - Trap focus within panel when open
    - Return focus to trigger element on close
    - Support keyboard navigation through action buttons
    - _Requirements: 12.4, 17.2, 17.3_
  
  - [ ] 10.5 Create mobile variant of PreviewPanel
    - On mobile (< 768px), render as bottom sheet with 100% width, 90vh height
    - Apply border radius: 24px 24px 0 0
    - Animation: translateY(100%) → 0 on enter
    - Support swipe-down gesture to close
    - _Requirements: 3.2_


- [ ] 11. Build main RecentRecordsSection container
  - [ ] 11.1 Create RecentRecordsSection component
    - Write `/src/components/recent/RecentRecordsSection.tsx` with props: items, isLoading, error, onItemClick, onItemAction, onBulkAction, onSearch, onFilterChange, enablePreview, enableBulkActions, className
    - Initialize local state: searchQuery, filters, selectedItems (Set), showFilters, selectedItemId
    - Implement responsive padding: 24px (desktop), 16px (tablet), 12px (mobile)
    - Apply 24px gap between sections
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ] 11.2 Compose RecentRecordsSection layout
    - Render header with title "Registros Recentes" (24px bold) and filtered count
    - Render filter toggle button in header actions
    - Render SearchBar with searchQuery state and onChange handler
    - Conditionally render RecentFilters when showFilters is true
    - Conditionally render BulkActions when selectedItems.size > 0
    - Render RecentList with filtered items and callbacks
    - Conditionally render PreviewPanel when selectedItemId is set and enablePreview is true
    - _Requirements: 8.1, 8.6_
  
  - [ ] 11.3 Implement state management and callbacks
    - Handle search query changes with debouncing
    - Handle filter changes and update filtered items
    - Handle item selection and update selectedItems Set
    - Handle "select all" functionality
    - Handle item click to open PreviewPanel (if enabled) or invoke onItemClick callback
    - Handle item actions and invoke onItemAction callback
    - Handle bulk actions and invoke onBulkAction callback
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 11.5_
  
  - [ ] 11.4 Add responsive layout for desktop two-column view
    - On desktop (>= 1024px), apply grid layout: 62% for list, 38% for PreviewPanel
    - PreviewPanel appears inline (not overlay) when item is selected
    - On tablet/mobile, PreviewPanel appears as modal/bottom sheet overlay
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 12. Implement error handling and resilience
  - [ ] 12.1 Create ErrorBanner component
    - Write `/src/components/recent/ErrorBanner.tsx` with props: message, onRetry, onDismiss
    - Implement 56px height banner with 12px border radius
    - Apply error colors: rgba(239,68,68,0.1) background, rgba(239,68,68,0.3) border
    - Display alert icon (20px), error message (14px), and retry button
    - _Requirements: 19.1_
  
  - [ ] 12.2 Create Toast notification component
    - Write `/src/components/recent/Toast.tsx` with props: message, type, duration, onClose
    - Position fixed bottom-right with 24px offset
    - Apply glassmorphism: 0.95 opacity, 16px backdrop-blur
    - Support types: success, error, info, warning with appropriate colors
    - Auto-dismiss after duration (default 5000ms)
    - Animation: slideUp + fadeIn on enter, slideDown + fadeOut on exit
    - _Requirements: 19.2_
  
  - [ ] 12.3 Integrate error handling into RecentRecordsSection
    - Display ErrorBanner at top when error prop is provided
    - Show Toast notifications for bulk action failures
    - Display offline indicator when navigator.onLine is false
    - Implement undo mechanism for destructive actions with 5-second timeout
    - Log errors to console with structured information
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 13. Add mobile gesture support
  - [ ] 13.1 Implement swipe gestures for RecentItem on mobile
    - Install and import react-swipeable or use Framer Motion drag
    - On swipe left (>= 60px), reveal action buttons (Edit, Delete) with slide animation
    - On swipe right (>= 60px), mark item as completed with visual feedback
    - Reset swipe state when tapping outside or scrolling
    - Add haptic feedback if Vibration API is available
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_


- [ ] 14. Implement dark mode support
  - [ ] 14.1 Add dark mode color variants to all components
    - Update ItemAvatar, StatusPill, ItemMetaRow with dark mode colors using Tailwind dark: prefix
    - Update RecentItem background, border, shadow for dark mode
    - Update SearchBar, RecentFilters with dark mode glassmorphism
    - Update BulkActions, PreviewPanel with dark mode backgrounds
    - Update EmptyState, RecentSkeleton with dark mode colors
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  
  - [ ] 14.2 Add smooth theme transition
    - Apply transition-colors duration-300 to all color-changing elements
    - Ensure shadows transition smoothly between light and dark values
    - Test theme toggle for visual smoothness
    - _Requirements: 16.5_

- [ ] 15. Enhance accessibility compliance
  - [ ] 15.1 Add comprehensive ARIA attributes
    - Add role="article" and descriptive aria-label to RecentItem
    - Add role="status" and aria-label to StatusPill
    - Add role="toolbar" and aria-label to BulkActions
    - Add role="searchbox" and aria-label to SearchBar
    - Add aria-live="polite" to results count element
    - _Requirements: 17.3, 17.4_
  
  - [ ] 15.2 Implement keyboard navigation
    - Ensure logical tab order: search → filters → list items → actions → preview
    - Add Enter/Space activation for all interactive elements
    - Add Escape key handler to close modals and panels
    - Add arrow key navigation for dropdown menus
    - Add Cmd/Ctrl+A for select all functionality
    - _Requirements: 17.1, 17.2_
  
  - [ ] 15.3 Add visible focus indicators
    - Apply 2px solid accent outline with 2px offset to all focusable elements
    - Ensure focus indicators are visible in both light and dark modes
    - Test focus visibility with keyboard navigation
    - _Requirements: 17.6_
  
  - [ ] 15.4 Verify color contrast ratios
    - Test all text colors against backgrounds using contrast checker
    - Ensure normal text (14-15px) meets 4.5:1 minimum
    - Ensure large text (18px+) meets 3:1 minimum
    - Ensure interactive elements meet 3:1 minimum
    - Fix any failing contrast ratios
    - _Requirements: 17.5_

- [ ] 16. Optimize performance
  - [ ] 16.1 Implement lazy loading for PreviewPanel
    - Use React.lazy() to code-split PreviewPanel component
    - Add Suspense boundary with loading fallback
    - Verify bundle size reduction in build output
    - _Requirements: 15.3, 23.3_
  
  - [ ] 16.2 Add memoization to expensive computations
    - Wrap filtering logic in useMemo with dependencies [items, searchQuery, filters]
    - Wrap grouping logic in useMemo with dependencies [filteredItems]
    - Wrap RecentItem with React.memo to prevent unnecessary re-renders
    - _Requirements: 15.2_
  
  - [ ] 16.3 Optimize SVG icons
    - Run SVGO on all icon files with precision: 2, currentColor: true
    - Create SVG sprite or icon registry to reduce HTTP requests
    - Verify file size reduction
    - _Requirements: 23.2, 23.4_
  
  - [ ] 16.4 Measure and optimize bundle size
    - Run webpack-bundle-analyzer to identify large dependencies
    - Ensure RecentRecordsSection bundle is under 25KB gzipped
    - Document bundle size in PR description
    - _Requirements: 23.1, 23.5_


- [ ] 17. Create Storybook stories and documentation
  - [ ] 17.1 Create stories for primitive components
    - Write `/src/components/recent/ItemAvatar.stories.tsx` with all variants (types, sizes, with/without badge)
    - Write `/src/components/recent/StatusPill.stories.tsx` with all status types and glow variants
    - Write `/src/components/recent/ItemMetaRow.stories.tsx` with various metadata combinations
    - Write `/src/components/recent/IconLoader.stories.tsx` with all icons and sizes
    - _Requirements: 21.3_
  
  - [ ] 17.2 Create stories for composed components
    - Write `/src/components/recent/RecentItem.stories.tsx` with variants (default, compact, expanded, selected, hover)
    - Write `/src/components/recent/SearchBar.stories.tsx` with empty, filled, focused states
    - Write `/src/components/recent/RecentFilters.stories.tsx` with various filter combinations
    - Write `/src/components/recent/BulkActions.stories.tsx` with different selection counts
    - Write `/src/components/recent/PreviewPanel.stories.tsx` with sample data
    - _Requirements: 21.3_
  
  - [ ] 17.3 Create story for main RecentRecordsSection
    - Write `/src/components/recent/RecentRecordsSection.stories.tsx` with scenarios:
      - Default with sample data
      - Loading state
      - Empty state
      - Error state
      - With filters applied
      - With items selected
      - With preview panel open
      - Dark mode variants
    - _Requirements: 21.3_
  
  - [ ] 17.4 Create comprehensive README documentation
    - Write `/src/components/recent/README.md` with:
      - Overview and design philosophy
      - Installation and setup instructions
      - Component API documentation with prop tables
      - Usage examples for common scenarios
      - Integration guide with existing codebase
      - Troubleshooting section
    - _Requirements: 25.1, 25.2, 25.3_

- [ ] 18. Write unit and integration tests
  - [ ] 18.1 Write unit tests for primitive components
    - Test ItemAvatar renders correct icon and colors for each type
    - Test StatusPill displays correct text and colors for each status
    - Test ItemMetaRow formats dates and plates correctly
    - Test IconLoader loads and renders icons dynamically
    - _Requirements: 22.1_
  
  - [ ] 18.2 Write unit tests for composed components
    - Test RecentItem renders all sections correctly
    - Test RecentItem hover and click interactions
    - Test SearchBar debounces input correctly
    - Test RecentFilters updates filter state
    - Test BulkActions displays correct count and invokes callbacks
    - _Requirements: 22.1, 22.2_
  
  - [ ] 18.3 Write integration tests for RecentRecordsSection
    - Test search filters items correctly
    - Test filter combinations work together
    - Test item selection and bulk actions
    - Test preview panel opens and closes
    - Test error handling displays error banner
    - _Requirements: 22.2_
  
  - [ ] 18.4 Write accessibility tests
    - Use @axe-core/react to test WCAG AA compliance
    - Test keyboard navigation through all interactive elements
    - Test focus management in modals and panels
    - Test screen reader announcements with aria-live
    - _Requirements: 22.3_
  
  - [ ] 18.5 Write visual regression tests
    - Capture screenshots of all component states using Storybook
    - Test light and dark mode variants
    - Test responsive breakpoints (mobile, tablet, desktop)
    - Compare screenshots against baseline
    - _Requirements: 22.4_
  
  - [ ] 18.6 Write performance tests
    - Measure initial render time with 100 items
    - Verify virtualization activates for lists > 30 items
    - Test scroll performance maintains 60fps
    - Verify bundle size is under 25KB gzipped
    - _Requirements: 22.5_


- [ ] 19. Create migration and deployment artifacts
  - [ ] 19.1 Create feature flag integration
    - Add feature flag `ENABLE_PREMIUM_RECENT_RECORDS` to feature flag system
    - Create wrapper component that conditionally renders old or new RecentRecordsSection based on flag
    - Ensure prop interface compatibility between old and new components
    - _Requirements: 24.1, 24.3_
  
  - [ ] 19.2 Write migration guide document
    - Create `/docs/recent-records-migration.md` with:
      - Step-by-step migration instructions
      - Prop mapping from old to new component
      - Breaking changes and workarounds
      - Testing checklist before enabling feature flag
      - Rollback procedure
    - _Requirements: 24.2, 24.5_
  
  - [ ] 19.3 Create comparison document
    - Create `/docs/recent-records-comparison.md` with:
      - Side-by-side screenshots of old vs new design
      - Feature comparison table
      - Performance comparison metrics
      - Accessibility improvements
    - _Requirements: 24.4_
  
  - [ ] 19.4 Create QA checklist document
    - Create `/docs/recent-records-qa-checklist.md` with:
      - Functional testing checklist (search, filters, actions, preview)
      - Visual testing checklist (light/dark mode, responsive, animations)
      - Accessibility testing checklist (keyboard, screen reader, contrast)
      - Performance testing checklist (load time, scroll, bundle size)
      - Browser compatibility checklist
    - _Requirements: 22.5_

- [ ] 20. Create demo video and wireframes
  - [ ] 20.1 Record screen capture demo video
    - Record 30-60 second video demonstrating:
      - Desktop view with search and filtering
      - Hover interactions and microanimations
      - Opening preview panel
      - Bulk selection and actions
      - Mobile view with swipe gestures
      - Dark mode toggle
    - Export as MP4 with 1080p resolution
    - _Requirements: 25.4_
  
  - [ ] 20.2 Create wireframes or export from Figma
    - Create or export wireframes showing:
      - Desktop layout (1440px width)
      - Tablet layout (768px width)
      - Mobile layout (375px width)
      - Key interaction states (hover, selected, preview open)
    - Export as PNG files to `/docs/wireframes/`
    - _Requirements: 25.5_

- [ ] 21. Final integration and polish
  - [ ] 21.1 Integrate with existing application
    - Import RecentRecordsSection into parent dashboard or page component
    - Connect to existing data fetching logic
    - Wire up callbacks to existing action handlers
    - Test with real production data
    - _Requirements: 24.3_
  
  - [ ] 21.2 Perform cross-browser testing
    - Test in Chrome, Firefox, Safari, Edge (latest 2 versions)
    - Verify backdrop-filter fallback for older browsers
    - Fix any browser-specific issues
    - Document any known limitations
    - _Requirements: 23.1_
  
  - [ ] 21.3 Conduct final accessibility audit
    - Run automated accessibility tests with axe DevTools
    - Perform manual keyboard navigation testing
    - Test with screen readers (NVDA, JAWS, VoiceOver)
    - Fix any remaining accessibility issues
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_
  
  - [ ] 21.4 Optimize and finalize
    - Run final bundle size analysis
    - Optimize any remaining performance bottlenecks
    - Review and clean up code comments
    - Ensure all TypeScript types are properly defined
    - Run linter and fix any warnings
    - _Requirements: 23.1, 23.5_
  
  - [ ] 21.5 Prepare pull request
    - Create feature branch `feature/recent-records-premium-redesign`
    - Commit changes with descriptive messages
    - Write comprehensive PR description with:
      - Overview of changes
      - Screenshots/video demo
      - Testing instructions
      - Bundle size impact
      - Rollout plan
    - Request code review
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

## Notes

- All tasks should be implemented incrementally, testing each component before moving to the next
- Focus on core functionality first, optional testing tasks can be completed later
- Ensure each component is fully functional and styled before integration
- Use existing design tokens and Tailwind config from the project where possible
- Maintain consistency with the existing design system while elevating to premium quality
- Test responsiveness at each breakpoint as components are built
- Verify dark mode support as each component is completed
- Document any deviations from the design spec with justification
