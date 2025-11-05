import {
  LayoutDashboard,
  CreditCard,
  ClipboardCheck,
  Users,
  Car,
  Package,
  Wrench,
  Calendar,
  BarChart3,
  Settings
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
