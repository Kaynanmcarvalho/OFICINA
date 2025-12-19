import {
  LayoutDashboard,
  CreditCard,
  ClipboardCheck,
  FileText,
  Users,
  Car,
  Package,
  Wrench,
  Calendar,
  BarChart3,
  Settings,
  Building2,
  Shield,
} from 'lucide-react';

/**
 * Configuração dos itens de menu da sidebar
 * Cada item representa uma seção principal do sistema
 */
export const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'caixa',
    label: 'Caixa / PDV',
    path: '/caixa',
    icon: CreditCard,
  },
  {
    id: 'checkin',
    label: 'Check-in',
    path: '/checkin',
    icon: ClipboardCheck,
  },
  {
    id: 'orcamentos',
    label: 'Orçamentos',
    path: '/orcamentos',
    icon: FileText,
  },
  {
    id: 'clients',
    label: 'Clientes',
    path: '/clients',
    icon: Users,
  },
  {
    id: 'vehicles',
    label: 'Veículos',
    path: '/vehicles',
    icon: Car,
  },
  {
    id: 'inventory',
    label: 'Estoque',
    path: '/inventory',
    icon: Package,
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    path: '/tools',
    icon: Wrench,
  },
  {
    id: 'schedule',
    label: 'Agenda',
    path: '/schedule',
    icon: Calendar,
  },
  {
    id: 'reports',
    label: 'Relatórios',
    path: '/reports',
    icon: BarChart3,
    dividerAfter: true, // Adiciona divisor visual após este item
  },
];

/**
 * Itens de menu do rodapé da sidebar
 */
export const footerItems = [
  {
    id: 'settings',
    label: 'Configurações',
    path: '/settings',
    icon: Settings,
  },
];

/**
 * Itens de menu exclusivos para super-admin
 * Apenas visíveis para e-mails autorizados
 */
export const superAdminItems = [
  {
    id: 'saas-dashboard',
    label: 'SaaS Dashboard',
    path: '/admin/dashboard',
    icon: Building2,
    badge: 'ADMIN',
    badgeColor: 'red',
  },
  {
    id: 'onboarding',
    label: 'Nova Empresa',
    path: '/admin/onboarding',
    icon: Shield,
    badge: 'ADMIN',
    badgeColor: 'red',
  },
];
