# Implementation Plan - Sistema Multi-Tenant Torq

## Task Overview

Este plano de implementação divide o sistema multi-tenant em tarefas incrementais e executáveis. Cada task constrói sobre as anteriores, garantindo progresso contínuo e testável.

---

## Phase 1: Foundation & Core Infrastructure

### - [ ] 1. Setup Firebase Structure and Security Rules

- [ ] 1.1 Create new Firestore structure with `/empresas` collection
  - Create `/empresas/{empresaId}` document structure
  - Add subcollections: `clientes`, `veiculos`, `orcamentos`, `checkins`, `usuarios`, `whatsapp_session`, `configuracoes`
  - Create `/cache_placas` global collection
  - _Requirements: 1.1, 1.2, 7.1, 7.2, 7.3_

- [ ] 1.2 Implement Firestore security rules for multi-tenant isolation
  - Write rules to enforce empresaId validation on all queries
  - Allow read/write only to authenticated users of the same empresa
  - Allow global read access to `/cache_placas`
  - Test rules with Firebase Emulator
  - _Requirements: 1.4, 10.1_

- [ ] 1.3 Create Firestore composite indexes
  - Index for `empresas/{empresaId}/clientes` by `createdAt`
  - Index for `empresas/{empresaId}/orcamentos` by `status` and `createdAt`
  - Index for `empresas/{empresaId}/checkins` by `status` and `createdAt`
  - Document indexes in `firestore.indexes.json`
  - _Requirements: 7.4, 12.6_

- [ ] 1.4 Setup Firebase configuration file
  - Create `src/config/firebase.ts` with Firebase initialization
  - Enable Firestore persistence for offline support
  - Configure Firebase Auth
  - Add environment variables for Firebase credentials
  - _Requirements: 15.1_

---

## Phase 2: Authentication & User Management

### - [ ] 2. Implement Authentication System

- [ ] 2.1 Create AuthContext with Firebase Auth integration
  - Implement `AuthProvider` component
  - Create `useAuth` hook
  - Handle login, logout, and session persistence
  - Store user data in context (uid, email, displayName)
  - _Requirements: 2.1_

- [ ] 2.2 Create login page with slug detection
  - Build login UI with Apple-like design
  - Detect empresa slug from URL path (`/login/:slug`)
  - Validate slug exists before showing login form
  - Show empresa logo and name on login page
  - _Requirements: 8.3, 9.1, 9.2_

- [ ] 2.3 Implement user document structure
  - Create `/empresas/{empresaId}/usuarios/{userId}` documents
  - Store: `nome`, `email`, `role`, `ativo`, `permissoes`, `avatar`, `dataCriacao`, `ultimoAcesso`
  - Link Firebase Auth UID to user document
  - _Requirements: 2.1, 4.4_

- [ ] 2.4 Create user profile page
  - Display user information (name, email, role, avatar)
  - Allow user to update avatar and display name
  - Show empresa information (name, plan, logo)
  - _Requirements: 3.4_

---

## Phase 3: Empresa Context & Multi-Tenant Core

### - [ ] 3. Build EmpresaContext and Theme System

- [ ] 3.1 Create EmpresaContext provider
  - Implement `EmpresaProvider` component
  - Load empresa data after authentication
  - Fetch empresaId from user document
  - Load empresa configuration from `/empresas/{empresaId}`
  - Store empresaId in sessionStorage
  - _Requirements: 2.2, 2.3, 2.4_

- [ ] 3.2 Implement dynamic theme system
  - Create `ThemeProvider` component
  - Load theme from `/empresas/{empresaId}/configuracoes/tema`
  - Apply CSS variables dynamically based on empresa theme
  - Support: `corPrimaria`, `corSecundaria`, `corFundo`, `gradiente`
  - Implement smooth transitions (300ms cubic-bezier)
  - _Requirements: 3.1, 3.2, 3.5_

- [ ] 3.3 Create empresa configuration page (admin only)
  - Build UI for editing empresa settings
  - Allow upload of logo (max 200KB, WebP format)
  - Color pickers for primary, secondary, background colors
  - Gradient builder with preview
  - Save configuration to Firestore
  - _Requirements: 3.1, 12.4_

- [ ] 3.4 Implement logo display in sidebar and header
  - Show empresa logo in sidebar top
  - Display empresa name and plan in header
  - Format: "{nomeFantasia} | Plano {plano}"
  - Fallback to default Torq logo if not configured
  - _Requirements: 3.3, 3.4_

---

## Phase 4: Data Access Layer

### - [ ] 4. Create Firestore Service Layer

- [ ] 4.1 Implement FirestoreService class
  - Create `src/services/firestoreService.ts`
  - Implement methods: `getAll`, `getById`, `create`, `update`, `delete`, `query`
  - Automatically inject empresaId from sessionStorage
  - Build collection paths as `/empresas/{empresaId}/{collection}`
  - Add error handling for missing empresaId
  - _Requirements: 1.3, 1.5, 10.1_

- [ ] 4.2 Create typed service methods for each collection
  - `ClienteService` for clientes operations
  - `VeiculoService` for veiculos operations
  - `OrcamentoService` for orcamentos operations
  - `CheckinService` for checkins operations
  - Each service extends base FirestoreService
  - _Requirements: 1.2_

- [ ] 4.3 Implement PlacaCacheService
  - Create `src/services/placaCacheService.ts`
  - Implement local cache with Map
  - Check local cache → global cache → external API
  - Save results to `/cache_placas/{placa}`
  - Include timestamp for future expiration
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 4.4 Write unit tests for FirestoreService
  - Mock Firestore methods
  - Test empresaId injection
  - Test error handling for missing empresaId
  - Test CRUD operations
  - _Requirements: Testing Strategy_

---

## Phase 5: Permission System

### - [ ] 5. Implement Role-Based Access Control

- [ ] 5.1 Create PermissionGuard component
  - Build `src/components/PermissionGuard.tsx`
  - Accept `requiredRole` and `requiredPermission` props
  - Check user role and permissions from context
  - Render children if authorized, fallback otherwise
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5.2 Apply PermissionGuard to sensitive routes
  - Wrap financial routes with `requiredRole="financeiro"`
  - Wrap admin routes with `requiredRole="admin"`
  - Wrap checkin creation with `requiredRole="atendente"`
  - _Requirements: 4.2, 4.3_

- [ ] 5.3 Create user management page (admin only)
  - List all users of the empresa
  - Allow admin to create new users
  - Allow admin to edit user roles and permissions
  - Allow admin to activate/deactivate users
  - _Requirements: 4.4, 4.5_

- [ ] 5.4 Implement backend permission validation
  - Create Cloud Function or API middleware
  - Validate JWT token contains empresaId and role
  - Reject requests without valid permissions
  - _Requirements: 10.2, 10.3_

---

## Phase 6: WhatsApp Integration

### - [ ] 6. Implement WhatsApp Session Management

- [ ] 6.1 Create WhatsApp session storage structure
  - Store session data in `/empresas/{empresaId}/whatsapp_session`
  - Fields: `token`, `sessionId`, `webhook`, `ativo`, `ultimaConexao`
  - _Requirements: 5.1_

- [ ] 6.2 Build WhatsApp connection UI
  - Create WhatsApp settings page
  - Display connection status ("Conectado ✅" or "Desconectado ❌")
  - Button "Conectar WhatsApp" to initiate connection
  - Show QR Code modal for authentication
  - _Requirements: 5.2, 5.3_

- [ ] 6.3 Implement WhatsApp session isolation
  - Ensure each empresa has independent session
  - Prevent cross-empresa message sending
  - Validate empresaId before sending messages
  - _Requirements: 5.4_

- [ ] 6.4 Create WhatsApp notification system
  - Notify users when session expires
  - Show reconnection prompt
  - Only notify users of affected empresa
  - _Requirements: 5.5_

---

## Phase 7: Slug-Based Routing

### - [ ] 7. Implement Slug System

- [ ] 7.1 Add slug field to empresa documents
  - Update empresa model with `slug` field
  - Validate slug format (lowercase, alphanumeric, hyphens only)
  - Create unique index on slug field
  - _Requirements: 8.1, 8.2_

- [ ] 7.2 Create slug validation and generation
  - Function to validate slug format
  - Function to check slug uniqueness
  - Auto-generate slug from empresa name if not provided
  - _Requirements: 8.2, 8.5_

- [ ] 7.3 Implement slug-based routing
  - Update routes to accept `/:slug` parameter
  - Load empresa by slug on route access
  - Redirect to 404 if slug not found
  - _Requirements: 8.3, 8.4_

- [ ] 7.4 Update login flow to use slug
  - Login URL format: `/login/:slug`
  - Detect slug and load empresa before showing login
  - Show empresa branding on login page
  - _Requirements: 8.3_

---

## Phase 8: UI/UX Enhancements

### - [ ] 8. Implement Apple-like Design System

- [ ] 8.1 Create design tokens and CSS variables
  - Define spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px)
  - Define typography scale (12px, 14px, 16px, 18px, 24px, 32px, 48px)
  - Define shadow system (sm, md, lg, xl)
  - Define border radius system (sm: 8px, md: 12px, lg: 16px, xl: 24px)
  - _Requirements: 9.2, 9.3_

- [ ] 8.2 Implement Framer Motion animations
  - Add smooth page transitions (200-400ms)
  - Implement card hover effects (scale, shadow)
  - Add modal enter/exit animations
  - Implement list item stagger animations
  - _Requirements: 9.1_

- [ ] 8.3 Apply glassmorphism effects
  - Implement backdrop-filter blur(12px) on modals
  - Add semi-transparent backgrounds (80-95% opacity)
  - Apply subtle gradients and shadows
  - _Requirements: 9.4_

- [ ] 8.4 Integrate Lucide React icons
  - Replace existing icons with Lucide React
  - Standardize icon sizes (20px, 24px, 32px)
  - Apply consistent icon colors
  - _Requirements: 9.5_

- [ ] 8.5 Implement responsive design
  - Mobile-first approach
  - Breakpoints: 640px, 768px, 1024px, 1280px, 1536px
  - Test on mobile, tablet, desktop
  - _Requirements: 12.1_

---

## Phase 9: Dashboard & Analytics

### - [ ] 9. Build Empresa-Specific Dashboard

- [ ] 9.1 Create dashboard page with empresa metrics
  - Total clientes this month
  - Total orçamentos (pending, approved, rejected)
  - Total checkins (active, completed)
  - Revenue chart (if financeiro role)
  - _Requirements: 11.2, 11.3_

- [ ] 9.2 Implement real-time updates
  - Use Firestore onSnapshot for live data
  - Update metrics automatically
  - Show loading states during updates
  - _Requirements: 12.1_

- [ ] 9.3 Create admin dashboard (super-admin only)
  - Route: `/admin/dashboard`
  - Show total empresas (active, inactive)
  - Show total users across all empresas
  - Show cache_placas statistics (total entries, hit rate)
  - Show WhatsApp sessions status
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 9.4 Implement data export functionality
  - Export clientes to CSV
  - Export orçamentos to PDF
  - Export checkins to Excel
  - _Requirements: 12.2_

---

## Phase 10: Offline Support

### - [ ] 10. Implement Offline Mode

- [ ] 10.1 Enable Firestore persistence
  - Call `enableIndexedDbPersistence()` on Firestore init
  - Handle persistence errors gracefully
  - _Requirements: 15.1_

- [ ] 10.2 Create offline indicator
  - Show "Modo Offline" badge in header when disconnected
  - Use `navigator.onLine` and Firestore connection state
  - _Requirements: 15.2_

- [ ] 10.3 Implement offline queue
  - Store pending operations in IndexedDB
  - Sync automatically when connection restored
  - Show sync progress indicator
  - _Requirements: 15.3, 15.4_

- [ ] 10.4 Handle sync conflicts
  - Detect conflicts on sync
  - Show conflict resolution UI
  - Allow user to choose version to keep
  - _Requirements: 15.5_

---

## Phase 11: Migration & Onboarding

### - [ ] 11. Data Migration and Onboarding

- [ ] 11.1 Create migration script
  - Backup current Firestore data
  - Create default empresa for existing data
  - Move collections to `/empresas/{defaultEmpresaId}`
  - Update user documents with empresaId
  - Validate data integrity after migration
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 11.2 Build onboarding flow for new empresas
  - Registration form (nome fantasia, CNPJ, email, telefone, slug)
  - Create empresa structure automatically
  - Create first admin user
  - Apply default theme
  - Send welcome email
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 11.3 Create onboarding tutorial
  - Interactive walkthrough of main features
  - Highlight key actions (create client, create checkin, create budget)
  - Skip option for experienced users
  - _Requirements: 14.5_

- [ ] 11.4 Implement empresa activation/deactivation
  - Admin can activate/deactivate empresas
  - Deactivated empresas cannot login
  - Show expiration warning before deactivation
  - _Requirements: Data Model - Empresa.ativo_

---

## Phase 12: Security & Monitoring

### - [ ] 12. Security Hardening and Monitoring

- [ ] 12.1 Implement rate limiting
  - Limit API calls to 100 requests/minute per user
  - Return 429 status code when limit exceeded
  - _Requirements: 10.4_

- [ ] 12.2 Add audit logging
  - Log sensitive operations to `/empresas/{empresaId}/logs`
  - Include: timestamp, userId, action, details
  - Log: user creation, role changes, data deletion
  - _Requirements: 10.3_

- [ ] 12.3 Implement input sanitization
  - Sanitize all user inputs before saving
  - Prevent XSS attacks
  - Validate data types and formats
  - _Requirements: 10.4_

- [ ] 12.4 Setup error monitoring
  - Integrate Sentry or similar tool
  - Track errors by empresa
  - Alert on critical errors
  - _Requirements: Error Handling_

- [ ] 12.5 Create security documentation
  - Document security best practices
  - Document Firestore rules
  - Document JWT validation
  - _Requirements: 10.1, 10.2_

---

## Phase 13: Testing & Quality Assurance

### - [ ]* 13. Comprehensive Testing

- [ ]* 13.1 Write unit tests for core services
  - Test FirestoreService methods
  - Test PlacaCacheService
  - Test EmpresaContext
  - Test PermissionGuard
  - _Requirements: Testing Strategy - Unit Tests_

- [ ]* 13.2 Write integration tests
  - Test login flow with empresa loading
  - Test theme application
  - Test data isolation between empresas
  - Test WhatsApp session management
  - _Requirements: Testing Strategy - Integration Tests_

- [ ]* 13.3 Write E2E tests
  - Test complete user journey
  - Test slug-based routing
  - Test permission-based UI
  - Test offline mode and sync
  - _Requirements: Testing Strategy - E2E Tests_

- [ ]* 13.4 Perform load testing
  - Test with 100 concurrent users
  - Test with 1000 empresas
  - Measure response times
  - Identify bottlenecks
  - _Requirements: 12.1, 12.2_

- [ ]* 13.5 Conduct security audit
  - Test Firestore rules
  - Test JWT validation
  - Test rate limiting
  - Test input sanitization
  - _Requirements: Security Considerations_

---

## Phase 14: Deployment & Rollout

### - [ ] 14. Production Deployment

- [ ] 14.1 Deploy Firestore rules and indexes
  - Deploy security rules to production
  - Deploy composite indexes
  - Verify rules are active
  - _Requirements: 1.2, 1.3_

- [ ] 14.2 Deploy backend changes
  - Deploy Cloud Functions (if any)
  - Deploy API middleware
  - Configure environment variables
  - _Requirements: Deployment Plan - Step 1_

- [ ] 14.3 Deploy frontend with feature flag
  - Build production bundle
  - Deploy to hosting
  - Enable feature flag for 10% of users
  - Monitor errors and metrics
  - _Requirements: Deployment Plan - Steps 2, 3, 4_

- [ ] 14.4 Run migration script
  - Execute migration on production data
  - Monitor migration progress
  - Validate data integrity
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 14.5 Gradual rollout
  - Increase feature flag to 50% after 24h
  - Increase to 100% after 48h
  - Monitor metrics continuously
  - Prepare rollback plan
  - _Requirements: Deployment Plan - Steps 5, 6_

---

## Phase 15: Documentation & Training

### - [ ] 15. Documentation and Training Materials

- [ ] 15.1 Create technical documentation
  - Document architecture and design decisions
  - Document API endpoints
  - Document Firestore structure
  - Document deployment process
  - _Requirements: 7.5_

- [ ] 15.2 Create user documentation
  - User guide for each role (admin, atendente, financeiro)
  - FAQ section
  - Troubleshooting guide
  - Video tutorials
  - _Requirements: 14.5_

- [ ] 15.3 Create admin documentation
  - Guide for managing empresas
  - Guide for user management
  - Guide for theme customization
  - Guide for WhatsApp setup
  - _Requirements: 11.1_

- [ ] 15.4 Conduct training sessions
  - Train existing users on new multi-tenant features
  - Train new empresa admins
  - Record training sessions for future reference
  - _Requirements: Deployment Plan_

---

## Summary

**Total Tasks**: 15 phases, 60+ individual tasks
**Estimated Timeline**: 8-12 weeks
**Priority**: High-priority tasks marked with core functionality
**Testing**: Optional testing tasks marked with * for faster MVP

**Key Milestones**:
1. Week 2: Foundation complete (Firebase, Auth, Context)
2. Week 4: Core multi-tenant features (Empresa, Theme, Permissions)
3. Week 6: Advanced features (WhatsApp, Slug routing, Dashboard)
4. Week 8: Testing and security hardening
5. Week 10: Migration and deployment
6. Week 12: Documentation and training

**Next Steps**: Begin with Phase 1 (Foundation & Core Infrastructure) and progress sequentially through each phase.
