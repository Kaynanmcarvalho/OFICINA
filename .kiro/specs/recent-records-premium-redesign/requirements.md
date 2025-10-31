# Requirements Document

## Introduction

This specification defines the requirements for a complete ground-up redesign of the "Registros Recentes" (Recent Records) section of an automotive workshop management system. The redesign must achieve Apple-level premium quality in visual design, user experience, accessibility, and performance. This is not an incremental improvement but a total reconstruction of the UI/UX layer, replacing all existing markup, styles, and interactions with a cohesive, production-ready implementation using React, Tailwind CSS, and Framer Motion.

## Glossary

- **RecentRecordsSection**: The complete container component that orchestrates the display of recent check-in records with search, filters, and actions
- **RecentList**: The main list container component that manages item rendering, grouping, and virtualization
- **RecentItem**: An individual card component representing a single check-in record with all metadata and actions
- **ItemAvatar**: A visual icon component indicating the type of entity (car, motorcycle, truck, client, completed status)
- **StatusPill**: A pill-shaped badge component displaying the current state with color coding and optional glow effect
- **ItemActions**: A component containing quick action buttons and contextual menu for item operations
- **ItemMetaRow**: A horizontal layout component displaying metadata like plate, model, date/time, and tags
- **RecentFilters**: A filter panel component allowing users to refine the list by type, status, period, and text search
- **EmptyState**: A placeholder component displayed when no records match the current filters
- **RecentSkeleton**: A loading placeholder component that mimics the structure of RecentItem during data fetch
- **PreviewPanel**: A side panel component showing detailed information about a selected record
- **BulkActions**: A toolbar component that appears when multiple items are selected for batch operations
- **DesignTokens**: A centralized configuration object defining colors, typography, spacing, shadows, and animation values
- **Glassmorphism**: A visual design technique using translucent backgrounds with backdrop blur effects
- **Virtualization**: A performance optimization technique that renders only visible items in large lists
- **WCAG AA**: Web Content Accessibility Guidelines Level AA compliance standard
- **Microinteraction**: Subtle animations and visual feedback responding to user actions within 200-300ms
- **AppleEasing**: A cubic-bezier timing function (0.2, 0.9, 0.2, 1) characteristic of Apple's motion design

## Requirements

### Requirement 1: Visual Design Foundation

**User Story:** As a product designer, I want the Recent Records section to embody Apple's design principles of clarity, depth, and deference, so that users perceive the application as premium and trustworthy.

#### Acceptance Criteria

1. THE RecentRecordsSection SHALL apply border radius values between 20px and 24px to all card components for soft, approachable corners
2. THE RecentRecordsSection SHALL use glassmorphism effects with backdrop-filter blur between 8px and 16px on translucent surfaces
3. THE RecentRecordsSection SHALL apply multi-layer shadows with blur radius between 12px and 32px to create natural depth perception
4. THE RecentRecordsSection SHALL use subtle gradients with opacity between 0.03 and 0.08 to add visual richness without distraction
5. THE RecentRecordsSection SHALL maintain consistent spacing using an 8px base unit grid system throughout all components

### Requirement 2: Design Token System

**User Story:** As a frontend engineer, I want a comprehensive design token system, so that visual consistency is maintained and theme changes are centralized.

#### Acceptance Criteria

1. THE System SHALL define a DesignTokens configuration file containing color scales with 10 steps (0-900) for neutral, primary, success, warning, and error palettes
2. THE System SHALL define typography tokens including font families (sans-serif stack with SF Pro or Inter), size scales (xs through 6xl), and weight values (300-700)
3. THE System SHALL define spacing tokens from 4px to 96px following an exponential scale
4. THE System SHALL define shadow tokens for elevation levels 1 through 4 with separate values for light and dark modes
5. THE System SHALL define animation tokens including duration values (150ms, 200ms, 300ms, 500ms) and easing functions including AppleEasing

### Requirement 3: Responsive Layout Architecture

**User Story:** As a user, I want the Recent Records section to adapt seamlessly across desktop, tablet, and mobile devices, so that I can access information comfortably on any screen size.

#### Acceptance Criteria

1. WHEN the viewport width exceeds 1024px, THE RecentRecordsSection SHALL display a two-column layout with the list occupying 62% width and PreviewPanel occupying 38% width
2. WHEN the viewport width is between 768px and 1023px, THE RecentRecordsSection SHALL display a single-column list with PreviewPanel appearing as a modal overlay
3. WHEN the viewport width is below 768px, THE RecentRecordsSection SHALL display a single-column list with expandable items replacing the PreviewPanel
4. THE RecentRecordsSection SHALL apply responsive padding values: 24px on desktop, 16px on tablet, and 12px on mobile
5. THE RecentRecordsSection SHALL ensure all interactive elements have minimum touch target dimensions of 44px by 44px on mobile devices

### Requirement 4: Item Card Structure and Hierarchy

**User Story:** As a user, I want each record card to present information in a clear visual hierarchy, so that I can quickly scan and identify relevant details.

#### Acceptance Criteria

1. THE RecentItem SHALL organize content into three horizontal zones: left avatar area (56px width), center information column (flexible), and right actions area (80px width)
2. THE RecentItem SHALL display the primary identifier (client name or vehicle owner) in semibold typography at 16px size as the most prominent text element
3. THE RecentItem SHALL display secondary information (vehicle model and plate) in regular weight at 14px size below the primary identifier
4. THE RecentItem SHALL display tertiary metadata (date, time, tags) in light weight at 12px size with reduced opacity between 0.6 and 0.7
5. THE RecentItem SHALL apply text truncation with ellipsis to prevent horizontal overflow while maintaining minimum readable character count of 20

### Requirement 5: Avatar and Icon System

**User Story:** As a user, I want visual icons that instantly communicate the type and status of each record, so that I can identify items without reading text labels.

#### Acceptance Criteria

1. THE ItemAvatar SHALL display optimized SVG icons with currentColor fill to inherit theme colors
2. THE ItemAvatar SHALL render icons at 24px dimensions within a 56px circular or rounded-square container
3. THE ItemAvatar SHALL apply distinct icons for entity types: car (sedan outline), motorcycle (bike outline), truck (truck outline), van (van outline), and client (user outline)
4. THE ItemAvatar SHALL apply gradient backgrounds with opacity between 0.1 and 0.2 using colors corresponding to entity type
5. THE ItemAvatar SHALL display a checkmark overlay icon when the record status is "completed" with 0.9 opacity

### Requirement 6: Status Badge System

**User Story:** As a user, I want status indicators to be immediately recognizable through color and text, so that I can understand the current state of each record at a glance.

#### Acceptance Criteria

1. THE StatusPill SHALL render as a pill-shaped badge with 16px border radius and padding of 6px horizontal by 4px vertical
2. WHEN the record status is "in_progress" or "active", THE StatusPill SHALL display amber color (#F59E0B) with text "Em andamento"
3. WHEN the record status is "completed", THE StatusPill SHALL display emerald color (#10B981) with text "Concluído"
4. WHEN the record status is "pending", THE StatusPill SHALL display blue color (#3B82F6) with text "Pendente"
5. WHEN the record status is "cancelled", THE StatusPill SHALL display red color (#EF4444) with text "Cancelado"
6. THE StatusPill SHALL apply a subtle glow effect using box-shadow with the badge color at 0.3 opacity and 8px blur radius

### Requirement 7: Microinteractions and Animations

**User Story:** As a user, I want smooth, responsive animations when interacting with records, so that the interface feels polished and provides clear feedback.

#### Acceptance Criteria

1. WHEN the user hovers over a RecentItem, THE System SHALL apply translateY(-2px) transformation and increase box-shadow blur by 8px within 200ms using AppleEasing
2. WHEN the user clicks a RecentItem, THE System SHALL apply scale(0.995) transformation for 100ms to simulate tactile press feedback
3. WHEN RecentItem components enter the viewport, THE System SHALL animate from opacity 0 and translateY(8px) to opacity 1 and translateY(0) over 260ms with staggered delays of 50ms per item
4. WHEN the user hovers over action buttons, THE System SHALL apply scale(1.1) transformation within 150ms
5. THE System SHALL disable all animations WHEN the user's system has prefers-reduced-motion enabled

### Requirement 8: Search and Filter Functionality

**User Story:** As a user, I want to search and filter records by multiple criteria, so that I can quickly find specific items in large datasets.

#### Acceptance Criteria

1. THE RecentFilters SHALL provide a text search input that filters records by matching client name, vehicle model, or license plate with case-insensitive comparison
2. THE RecentFilters SHALL provide a status filter dropdown with options: "Todos", "Em andamento", "Concluído", "Pendente", "Cancelado"
3. THE RecentFilters SHALL provide a type filter dropdown with options: "Todos", "Carro", "Moto", "Caminhão", "Van"
4. THE RecentFilters SHALL provide a period filter dropdown with options: "Todos", "Hoje", "Ontem", "Últimos 7 dias", "Últimos 30 dias"
5. THE System SHALL highlight matching search terms in filtered results using background color with 0.2 opacity
6. THE System SHALL display the count of filtered results in the format "X registros" below the section title

### Requirement 9: Intelligent Grouping and Organization

**User Story:** As a user, I want records to be automatically grouped by recency, so that I can understand temporal context without checking individual timestamps.

#### Acceptance Criteria

1. THE RecentList SHALL group records into four categories: "Hoje" (today), "Ontem" (yesterday), "Últimos 7 dias" (last 7 days), and "Mais antigos" (older)
2. THE RecentList SHALL display group headers as sticky elements that remain visible during scroll with backdrop blur effect
3. THE RecentList SHALL render group headers in uppercase text at 12px size with semibold weight and letter-spacing of 0.05em
4. THE RecentList SHALL sort records within each group by timestamp in descending order (most recent first)
5. THE RecentList SHALL hide empty groups from display to reduce visual clutter

### Requirement 10: Quick Actions and Context Menu

**User Story:** As a user, I want to perform common actions directly from the list, so that I can work efficiently without navigating to detail pages.

#### Acceptance Criteria

1. THE ItemActions SHALL display quick action buttons for "Abrir" (open), "Editar" (edit), and "Mais" (more menu) aligned to the right of each RecentItem
2. WHEN the user clicks the "Abrir" button, THE System SHALL invoke a callback function passing the record identifier
3. WHEN the user clicks the "Mais" button, THE System SHALL display a contextual dropdown menu with options: "Duplicar", "Marcar como concluído", "Excluir"
4. WHEN the user right-clicks a RecentItem, THE System SHALL display the same contextual menu at the cursor position
5. THE ItemActions SHALL render action buttons as icon-only with 36px dimensions and tooltip labels appearing on hover after 500ms delay

### Requirement 11: Bulk Selection and Batch Operations

**User Story:** As a user, I want to select multiple records and perform batch operations, so that I can manage large numbers of items efficiently.

#### Acceptance Criteria

1. THE RecentItem SHALL display a checkbox in the left margin when the user hovers over the item or when any item is selected
2. WHEN the user selects one or more items, THE BulkActions toolbar SHALL appear at the top of the list with slide-down animation over 200ms
3. THE BulkActions SHALL display the count of selected items in the format "X itens selecionados"
4. THE BulkActions SHALL provide action buttons for "Marcar como concluído" and "Excluir" with confirmation dialogs
5. THE System SHALL provide a "Selecionar todos" checkbox in the list header that selects all visible filtered items

### Requirement 12: Preview Panel and Detail View

**User Story:** As a user, I want to see detailed information about a record without leaving the list view, so that I can maintain context while reviewing details.

#### Acceptance Criteria

1. WHEN the user clicks a RecentItem on desktop, THE PreviewPanel SHALL slide in from the right over 300ms using AppleEasing
2. THE PreviewPanel SHALL display comprehensive record information including all metadata, status history, and related entities
3. THE PreviewPanel SHALL provide action buttons for "Editar", "Duplicar", "Marcar como concluído", and "Excluir" in a footer toolbar
4. WHEN the user clicks outside the PreviewPanel or presses the Escape key, THE PreviewPanel SHALL slide out and close
5. THE PreviewPanel SHALL apply a backdrop overlay with rgba(0,0,0,0.2) opacity and backdrop-blur of 6px

### Requirement 13: Loading States and Skeletons

**User Story:** As a user, I want to see placeholder content while data loads, so that I understand the system is working and perceive faster load times.

#### Acceptance Criteria

1. WHEN data is loading, THE RecentList SHALL display 5 RecentSkeleton components that mimic the structure of RecentItem
2. THE RecentSkeleton SHALL use gradient shimmer animation moving from left to right over 1500ms duration
3. THE RecentSkeleton SHALL apply neutral gray colors with opacity between 0.1 and 0.2 for placeholder blocks
4. THE RecentSkeleton SHALL match the exact dimensions and spacing of actual RecentItem components
5. THE System SHALL transition from skeleton to actual content with fade animation over 200ms

### Requirement 14: Empty State and Zero Data Experience

**User Story:** As a user, I want clear guidance when no records are available, so that I understand the situation and know what actions to take.

#### Acceptance Criteria

1. WHEN no records exist and no filters are applied, THE EmptyState SHALL display an illustration or icon with message "Nenhum registro encontrado"
2. WHEN no records match the current filters, THE EmptyState SHALL display message "Nenhum resultado para os filtros aplicados" with a "Limpar filtros" button
3. THE EmptyState SHALL center content vertically and horizontally within the available space
4. THE EmptyState SHALL display a call-to-action button "Criar novo registro" when appropriate for the user's permissions
5. THE EmptyState SHALL use muted colors with opacity between 0.4 and 0.6 to indicate inactive state

### Requirement 15: Performance and Virtualization

**User Story:** As a user, I want the list to remain responsive even with hundreds of records, so that I can scroll smoothly without lag or jank.

#### Acceptance Criteria

1. WHEN the record count exceeds 30 items, THE RecentList SHALL implement virtualization to render only visible items plus a buffer of 5 items above and below
2. THE System SHALL maintain scroll position accuracy within 1px when items are added or removed from the virtualized list
3. THE System SHALL lazy-load preview panel content and images only when the panel is opened
4. THE System SHALL debounce search input with 300ms delay to prevent excessive filtering operations
5. THE System SHALL complete initial render of 100 records within 500ms on a mid-range device (measured via performance.now())

### Requirement 16: Dark Mode and Theme Adaptation

**User Story:** As a user, I want the interface to adapt seamlessly between light and dark themes, so that I can work comfortably in any lighting environment.

#### Acceptance Criteria

1. WHEN dark mode is active, THE RecentItem SHALL use background color between #1C1C1E and #2C2C2E with subtle gradient overlay
2. WHEN dark mode is active, THE System SHALL apply elevated shadow values with increased opacity between 0.4 and 0.6
3. WHEN dark mode is active, THE System SHALL use translucent overlays with rgba(255,255,255,0.05) to rgba(255,255,255,0.1) for depth
4. WHEN light mode is active, THE RecentItem SHALL use background color between #FFFFFF and #F9F9FB with soft shadows
5. THE System SHALL transition all color values smoothly over 300ms when theme mode changes

### Requirement 17: Accessibility Compliance

**User Story:** As a user with disabilities, I want the interface to be fully accessible via keyboard and screen readers, so that I can use the application independently.

#### Acceptance Criteria

1. THE RecentItem SHALL be keyboard navigable with Tab key and activatable with Enter or Space key
2. THE System SHALL maintain a logical tab order: search input, filter controls, list items, action buttons, preview panel
3. THE System SHALL apply ARIA labels to all icon-only buttons describing their function in Portuguese
4. THE System SHALL apply aria-live="polite" to the results count element to announce filter changes to screen readers
5. THE System SHALL maintain minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text in both light and dark modes
6. THE System SHALL provide visible focus indicators with 2px outline and 2px offset on all interactive elements

### Requirement 18: Internationalization and Formatting

**User Story:** As a user, I want dates, times, and numbers formatted according to Brazilian Portuguese conventions, so that information is presented in familiar formats.

#### Acceptance Criteria

1. THE System SHALL format dates using Intl.DateTimeFormat with locale "pt-BR" and options { day: '2-digit', month: 'short', year: 'numeric' }
2. THE System SHALL format times using Intl.DateTimeFormat with locale "pt-BR" and options { hour: '2-digit', minute: '2-digit' }
3. THE System SHALL format license plates with uppercase letters and hyphen separator (e.g., "ABC-1234")
4. THE System SHALL support i18n string keys for all user-facing text using react-i18next or similar library
5. THE System SHALL display relative time labels ("há 5 minutos", "há 2 horas") for records created within the last 24 hours

### Requirement 19: Error Handling and Resilience

**User Story:** As a user, I want clear feedback when errors occur, so that I understand what went wrong and how to recover.

#### Acceptance Criteria

1. WHEN a data fetch fails, THE System SHALL display an error banner at the top of the list with message "Erro ao carregar registros" and a "Tentar novamente" button
2. WHEN a bulk action fails, THE System SHALL display a toast notification with the error message and affected item count
3. WHEN the user is offline, THE System SHALL display an indicator badge with message "Offline - Dados podem estar desatualizados"
4. THE System SHALL provide an undo mechanism for destructive actions (delete, cancel) with a 5-second timeout
5. THE System SHALL log errors to the console with structured information including timestamp, action, and error details

### Requirement 20: Mobile Gestures and Touch Interactions

**User Story:** As a mobile user, I want to use swipe gestures for quick actions, so that I can work efficiently on touch devices.

#### Acceptance Criteria

1. WHEN the user swipes left on a RecentItem on mobile, THE System SHALL reveal quick action buttons for "Editar" and "Excluir" with slide animation
2. WHEN the user swipes right on a RecentItem on mobile, THE System SHALL mark the item as completed with visual feedback
3. THE System SHALL require a swipe distance of at least 60px to trigger the action
4. THE System SHALL provide haptic feedback (if available) when a swipe action is triggered
5. THE System SHALL reset the swipe state when the user taps outside the item or scrolls the list

### Requirement 21: Component Modularity and Reusability

**User Story:** As a frontend engineer, I want components to be modular and well-documented, so that they can be reused and maintained easily.

#### Acceptance Criteria

1. THE System SHALL define TypeScript interfaces for all component props with JSDoc comments describing each property
2. THE System SHALL export each component as a named export with a default export for the main RecentRecordsSection
3. THE System SHALL provide Storybook stories for each component demonstrating all variants and states
4. THE System SHALL limit each component file to a maximum of 300 lines of code, extracting sub-components when necessary
5. THE System SHALL include prop validation and default values for all optional props

### Requirement 22: Testing and Quality Assurance

**User Story:** As a quality assurance engineer, I want comprehensive test coverage, so that I can verify functionality and prevent regressions.

#### Acceptance Criteria

1. THE System SHALL include unit tests for each component verifying render output and prop handling
2. THE System SHALL include interaction tests verifying click, hover, and keyboard events
3. THE System SHALL include accessibility tests using axe-core or similar tool to verify WCAG AA compliance
4. THE System SHALL include visual regression tests capturing screenshots of key states and variants
5. THE System SHALL provide a QA checklist document covering functional, visual, accessibility, and performance criteria

### Requirement 23: Performance Budget and Optimization

**User Story:** As a performance engineer, I want the component bundle to be optimized, so that page load times remain fast.

#### Acceptance Criteria

1. THE RecentRecordsSection component bundle SHALL not exceed 25KB gzipped including all dependencies
2. THE System SHALL use SVG sprite or icon registry to reduce HTTP requests for icon assets
3. THE System SHALL lazy-load the PreviewPanel component using React.lazy() to reduce initial bundle size
4. THE System SHALL optimize SVG icons using SVGO with precision of 2 decimal places and removal of unnecessary attributes
5. THE System SHALL measure and report bundle size impact in the pull request description

### Requirement 24: Migration and Rollout Strategy

**User Story:** As a product manager, I want a safe migration path from the old component, so that we can deploy incrementally and rollback if needed.

#### Acceptance Criteria

1. THE System SHALL provide a feature flag mechanism to toggle between old and new RecentRecordsSection implementations
2. THE System SHALL include a migration guide document describing the steps to replace the old component
3. THE System SHALL maintain API compatibility with the existing component's props interface where possible
4. THE System SHALL provide a comparison document showing visual and functional differences between old and new versions
5. THE System SHALL include rollback instructions in case issues are discovered in production

### Requirement 25: Documentation and Developer Experience

**User Story:** As a developer integrating this component, I want comprehensive documentation, so that I can implement it correctly without trial and error.

#### Acceptance Criteria

1. THE System SHALL provide a README.md file in the component directory with overview, installation, and usage examples
2. THE System SHALL provide API documentation for each component listing all props, types, and default values
3. THE System SHALL provide code examples demonstrating common use cases including search, filtering, and bulk actions
4. THE System SHALL provide a video screen capture (30-60 seconds) demonstrating key interactions on desktop and mobile
5. THE System SHALL provide a Figma link or exported PNG wireframes showing the design for desktop, tablet, and mobile viewports
