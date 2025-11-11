import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useStore, useAuthStore, useThemeStore } from './store/index.jsx';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Layout from './components/layout/LayoutPremium';
import { EmpresaProvider } from './contexts/EmpresaContext';
import ImpersonationBanner from './components/ImpersonationBanner';
import './utils/preloadIcons'; // Import direto para executar o pré-carregamento
import './i18n/index.jsx';

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const CompleteProfilePage = React.lazy(() => import('./pages/auth/CompleteProfilePage'));
const DashboardPage = React.lazy(() => import('./pages/dashboard/index'));
const EmployeeManagementPage = React.lazy(() => import('./pages/EmployeeManagementPage'));
const CheckinPage = React.lazy(() => import('./pages/checkin/index'));
const CheckInDetailsPage = React.lazy(() => import('./pages/CheckInDetailsPage'));
const ClientsPage = React.lazy(() => import('./pages/ClientsPage'));
const InventoryPage = React.lazy(() => import('./pages/InventoryPage'));
const VehiclesPage = React.lazy(() => import('./pages/VehiclesPage'));
const ToolsPage = React.lazy(() => import('./pages/ToolsPage'));
const TeamPage = React.lazy(() => import('./pages/TeamPage'));
const SchedulePage = React.lazy(() => import('./pages/SchedulePage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const IntegrationsPage = React.lazy(() => import('./pages/IntegrationsPage'));
const CaixaPage = React.lazy(() => import('./pages/Caixa'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'));
const DevPage = React.lazy(() => import('./pages/DevPage'));
const BudgetsPage = React.lazy(() => import('./pages/BudgetsPage'));
const BudgetApprovalPage = React.lazy(() => import('./pages/BudgetApprovalPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Admin pages (super-admin only)
const SaaSDashboard = React.lazy(() => import('./pages/admin/SaaSDashboard'));
const OnboardingEmpresa = React.lazy(() => import('./pages/admin/OnboardingEmpresa'));

function App() {
  const { initializeStores, setupRealtimeListeners, isGlobalLoading } = useStore();
  const { user, isLoading: authLoading } = useAuthStore();
  const { isDarkMode, initializeTheme } = useThemeStore();
  const [iconsReady, setIconsReady] = useState(false);

  // Preload icons FIRST (critical for UI) - executa de forma síncrona
  useEffect(() => {
    // Pequeno delay para garantir que o módulo foi carregado
    const timer = setTimeout(() => {
      setIconsReady(true);
      console.log('✅ App: Ícones prontos para renderização');
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Initialize theme SECOND (before anything else)
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    // Initialize all stores on app start
    initializeStores();
  }, [initializeStores]);

  useEffect(() => {
    // Setup real-time listeners when user is authenticated AND empresaId is available
    if (user) {
      // Aguardar empresaId estar disponível no sessionStorage
      let attempts = 0;
      const maxAttempts = 50; // 5 segundos máximo (50 * 100ms)
      
      const checkEmpresaId = () => {
        const empresaId = sessionStorage.getItem('empresaId');
        
        if (empresaId) {
          console.log('[App] empresaId available, setting up listeners');
          try {
            const unsubscribe = setupRealtimeListeners();
            return unsubscribe;
          } catch (error) {
            console.error('[App] Error setting up listeners:', error);
            return () => {};
          }
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            console.log(`[App] Waiting for empresaId... (attempt ${attempts}/${maxAttempts})`);
            // Tentar novamente após um pequeno delay
            const timer = setTimeout(checkEmpresaId, 100);
            return () => clearTimeout(timer);
          } else {
            console.warn('[App] empresaId not available after max attempts, skipping listeners');
            return () => {};
          }
        }
      };
      
      return checkEmpresaId();
    }
  }, [user, setupRealtimeListeners]);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Show loading spinner while initializing or waiting for icons
  if (!iconsReady || authLoading || isGlobalLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <EmpresaProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Banner de Impersonation (apenas quando ativo) */}
            <ImpersonationBanner />
            
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <LoginPage />
                }
              />
              <Route
                path="/register"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <RegisterPage />
                }
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
                <Route path="vehicles" element={<VehiclesPage />} />
                <Route path="tools" element={<ToolsPage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="caixa" element={<CaixaPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="dev" element={<DevPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="integrations" element={<IntegrationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="employees" element={<EmployeeManagementPage />} />
                
                {/* Admin routes (super-admin only) */}
                <Route path="admin/dashboard" element={<SaaSDashboard />} />
                <Route path="admin/onboarding" element={<OnboardingEmpresa />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'glass-card',
                style: {
                  background: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  backdropFilter: 'blur(10px)',
                  border: isDarkMode ? '1px solid rgba(75, 85, 99, 0.3)' : '1px solid rgba(209, 213, 219, 0.3)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </EmpresaProvider>
    </ErrorBoundary>
  );
}

export default App;
