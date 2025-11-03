# Requirements Document - Clients Page Apple Redesign

## Introduction

Esta especificação define a reformulação completa da página `/clients` do sistema TORQ com design Apple-like premium. O objetivo é criar uma experiência minimalista, elegante e imersiva, mantendo todas as funcionalidades existentes e adicionando microinterações sofisticadas.

## Glossary

- **ClientsPage**: Página principal de gestão de clientes
- **ClientTable**: Tabela dinâmica com lista de clientes
- **ClientModal**: Modal flutuante para criação/edição de clientes
- **SearchBar**: Campo de busca inteligente com filtros
- **ClientDrawer**: Painel lateral deslizante com detalhes do cliente
- **GlassmorphismCard**: Card com efeito de vidro translúcido
- **MicroInteraction**: Animação sutil de feedback visual
- **ThemeAware**: Componente que adapta ao modo claro/escuro
- **KeyboardShortcut**: Atalho de teclado para ações rápidas

## Requirements

### Requirement 1: Layout e Estrutura Premium

**User Story:** Como usuário, quero uma interface limpa e elegante estilo Apple, para ter uma experiência visual premium.

#### Acceptance Criteria

1. THE ClientsPage SHALL use glassmorphism design with backdrop-blur(20px) and subtle shadows
2. THE ClientsPage SHALL adapt automatically to light and dark themes
3. THE ClientsPage SHALL display a clean header with title "Gestão de Clientes" and client count badge
4. THE ClientsPage SHALL use SF Pro Display typography with clear visual hierarchy
5. THE ClientsPage SHALL maintain consistent spacing and proportions following Apple design guidelines

### Requirement 2: Search and Filtering System

**User Story:** Como usuário, quero buscar clientes instantaneamente enquanto digito, para encontrar informações rapidamente.

#### Acceptance Criteria

1. THE SearchBar SHALL provide instant search as user types
2. THE SearchBar SHALL display animated placeholder "Buscar clientes por nome, CPF ou e-mail…"
3. THE SearchBar SHALL show loading indicator during Firebase queries
4. THE SearchBar SHALL highlight matching results in real-time
5. THE SearchBar SHALL support keyboard shortcut ⌘+K (Ctrl+K on Windows) for quick access

### Requirement 3: Client Table with Microinteractions

**User Story:** Como usuário, quero uma tabela responsiva com animações suaves, para navegar facilmente pelos dados.

#### Acceptance Criteria

1. THE ClientTable SHALL display columns: Cliente, Contato, Veículos, Última Visita, Total de Serviços, Ações
2. THE ClientTable SHALL apply subtle hover effect (0.2s transition) on table rows
3. THE ClientTable SHALL use fade-in animation when loading data
4. THE ClientTable SHALL be fully responsive with horizontal scroll on mobile
5. THE ClientTable SHALL display empty state with elegant illustration when no clients exist

### Requirement 4: New Client Button and Modal

**User Story:** Como usuário, quero criar novos clientes com um modal flutuante elegante, para manter o foco na tarefa.

#### Acceptance Criteria

1. THE "+ Novo Cliente" button SHALL use blue electric accent color with glassmorphism effect
2. THE button SHALL support keyboard shortcut ⌘+N (Ctrl+N on Windows)
3. THE ClientModal SHALL open with smooth fade-in and scale animation
4. THE ClientModal SHALL be centered and translucent with backdrop blur
5. THE ClientModal SHALL display form fields with subtle separations (no visible borders)

### Requirement 5: Edit Client Drawer

**User Story:** Como usuário, quero editar clientes em um painel lateral deslizante, para ver detalhes completos.

#### Acceptance Criteria

1. THE "Editar" button SHALL open a ClientDrawer sliding from the right
2. THE ClientDrawer SHALL display client details with elegant card layout
3. THE ClientDrawer SHALL include vehicle history and service summary
4. THE ClientDrawer SHALL close with swipe gesture on mobile
5. THE ClientDrawer SHALL save changes with visual feedback notification

### Requirement 6: Visual Feedback and Notifications

**User Story:** Como usuário, quero feedback visual claro para minhas ações, para confirmar operações.

#### Acceptance Criteria

1. THE system SHALL display floating notification "Cliente salvo com sucesso ✅" after save
2. THE notifications SHALL use glassmorphism design with auto-dismiss after 3 seconds
3. THE system SHALL show loading states with minimal spinner animation
4. THE system SHALL provide haptic feedback on mobile devices
5. THE system SHALL use color-coded feedback (green for success, red for error, blue for info)

### Requirement 7: Keyboard Shortcuts

**User Story:** Como usuário avançado, quero atalhos de teclado, para trabalhar mais rapidamente.

#### Acceptance Criteria

1. THE system SHALL support ⌘+K / Ctrl+K for global search
2. THE system SHALL support ⌘+N / Ctrl+N for new client
3. THE system SHALL support ESC key to close modals and drawers
4. THE system SHALL support arrow keys for table navigation
5. THE system SHALL display keyboard shortcuts hint on hover

### Requirement 8: Responsive Design

**User Story:** Como usuário mobile, quero uma experiência otimizada para dispositivos móveis, para acessar de qualquer lugar.

#### Acceptance Criteria

1. THE ClientsPage SHALL be fully responsive for mobile, tablet, and desktop
2. THE table SHALL collapse to card view on mobile devices
3. THE search bar SHALL remain accessible and prominent on all screen sizes
4. THE modals SHALL adapt to screen size with appropriate padding
5. THE touch targets SHALL be minimum 44px for mobile usability

### Requirement 9: Performance and Loading States

**User Story:** Como usuário, quero uma interface rápida e responsiva, para não perder tempo esperando.

#### Acceptance Criteria

1. THE ClientsPage SHALL load initial data within 1 second on 3G connection
2. THE search SHALL provide results within 300ms of last keystroke
3. THE system SHALL use skeleton loaders during data fetch
4. THE system SHALL implement virtualization for lists with 100+ clients
5. THE animations SHALL maintain 60fps performance

### Requirement 10: Theme Consistency

**User Story:** Como usuário, quero que o tema claro/escuro seja consistente, para conforto visual.

#### Acceptance Criteria

1. THE ClientsPage SHALL sync with navbar theme toggle
2. THE theme transition SHALL be smooth with 300ms fade
3. THE colors SHALL use Apple-inspired palette (white/gray/graphite for light, deep gray/black for dark)
4. THE text SHALL maintain WCAG AA contrast ratios in both themes
5. THE glassmorphism effects SHALL adapt opacity based on theme
