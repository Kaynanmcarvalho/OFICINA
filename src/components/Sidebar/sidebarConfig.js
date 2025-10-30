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
    path: '/',
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
    id: 'clientes',
    label: 'Clientes',
    path: '/clientes',
    icon: Users,
  },
  {
    id: 'veiculos',
    label: 'Veículos',
    path: '/veiculos',
    icon: Car,
  },
  {
    id: 'estoque',
    label: 'Estoque',
    path: '/estoque',
    icon: Package,
  },
  {
    id: 'ferramentas',
    label: 'Ferramentas',
    path: '/ferramentas',
    icon: Wrench,
  },
  {
    id: 'agenda',
    label: 'Agenda',
    path: '/agenda',
    icon: Calendar,
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    path: '/relatorios',
    icon: BarChart3,
    dividerAfter: true, // Adiciona divisor visual após este item
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    path: '/configuracoes',
    icon: Settings,
  },
];
