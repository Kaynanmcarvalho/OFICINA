import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore, useThemeStore } from './store/index.jsx';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Layout from './components/layout/LayoutPremium';
import { VoiceAssistantButton } from './features/voice-assistant';
import './i18n/index.jsx';
import './styles/design-tokens.css';
// pdv-premium.css is imported directly in CaixaPremium.jsx

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const CompleteProfilePage = React.lazy(() => import('./pages/auth/CompleteProfilePage'));
const DashboardPage = React.lazy(() => import('./pages/dashboard/index'));
const EmployeeManagementPage = React.lazy(() => import('./pages/EmployeeManagementPage'));
const CheckinPage = React.lazy(() => import('./pages/CheckInPage'));
const CheckInDetailsPage = React.lazy(() => import('./pages/CheckInDetailsPage'));
const ClientsPage = React.lazy(() => import('./pages/ClientsPage'));
const InventoryPage = React.lazy(() => import('./pages/InventoryPage'));

const ToolsPage = React.lazy(() => import('./pages/ToolsPage'));
const TeamPage = React.lazy(() => import('./pages/TeamPage'));
const SchedulePage = React.lazy(() => import('./pages/SchedulePage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const IntegrationsPage = React.lazy(() => import('./pages/IntegrationsPage'));
const CaixaPage = React.lazy(() => import('./pages/CaixaPremium'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ReportsPage = React.lazy(() => import('./pages/reports/index'));
const FinancialReport = React.lazy(() => import('./pages/reports/FinancialReport'));
const ClientsReport = React.lazy(() => import('./pages/reports/ClientsReport'));
const CheckinsReport = React.lazy(() => import('./pages/reports/CheckinsReport'));
const DevPage = React.lazy(() => import('./pages/DevPage'));
const BudgetsPage = React.lazy(() => import('./pages/BudgetsPage'));
const BudgetApprovalPage = React.lazy(() => import('./pages/BudgetApprovalPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Admin pages (Super Admin only)
const SaaSDashboard = React.lazy(() => import('./pages/admin/SaaSDashboard'));
const OnboardingEmpresa = React.lazy(() => import('./pages/admin/OnboardingEmpresa'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  const { user, isLoading: authLoading, initializeAuth } = useAuthStore();
  const { isDarkMode, initializeTheme } = useThemeStore();

  // Initialize theme immediately
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Initialize auth
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Show loading only during auth check
  if (authLoading) {
    return <PageLoader />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
              />
              <Route
                path="/register"
                element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
              />

              {/* Public budget approval route */}
              <Route path="/orcamento/aprovar/:approvalLink" element={<BudgetApprovalPage />} />

              {/* Profile completion route */}
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute>
                    <CompleteProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="checkin" element={<CheckinPage />} />
                <Route path="checkin/:id" element={<CheckInDetailsPage />} />
                <Route path="orcamentos" element={<BudgetsPage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="inventory" element={<InventoryPage />} />

                <Route path="tools" element={<ToolsPage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="caixa" element={<CaixaPage />} />
                <Route path="reports" element={<ReportsPage />}>
                  <Route path="financial" element={<FinancialReport />} />
                  <Route path="clients" element={<ClientsReport />} />
                  <Route path="checkins" element={<CheckinsReport />} />
                </Route>
                <Route path="dev" element={<DevPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="integrations" element={<IntegrationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="employees" element={<EmployeeManagementPage />} />
                
                {/* Admin routes (Super Admin only) */}
                <Route path="admin/dashboard" element={<SaaSDashboard />} />
                <Route path="admin/onboarding" element={<OnboardingEmpresa />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          {/* Voice Assistant - Disponível em todas as páginas */}
          {user && (
            <VoiceAssistantButton
              onCommand={(command) => {
                console.log('[VoiceAssistant] Comando recebido:', command);
                // TODO: Implementar navegação e ações baseadas no comando
              }}
              onError={(error) => {
                console.error('[VoiceAssistant] Erro:', error);
              }}
            />
          )}

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                color: isDarkMode ? '#f9fafb' : '#111827',
                backdropFilter: 'blur(10px)',
                border: isDarkMode ? '1px solid rgba(75, 85, 99, 0.3)' : '1px solid rgba(209, 213, 219, 0.3)',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#ffffff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
