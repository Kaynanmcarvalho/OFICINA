import React from 'react';
import { registerIcon, type IconComponent } from './IconLoader';

// Import Lucide icons as base
import {
  User,
  Car,
  Wrench,
  Package,
  LayoutDashboard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Filter,
  SortAsc,
  SortDesc,
} from 'lucide-react';

// Register Lucide icons
const icons: Record<string, IconComponent> = {
  // Users & Clients
  client: User,
  user: User,
  
  // Vehicles
  vehicle: Car,
  car: Car,
  
  // Tools & Services
  wrench: Wrench,
  tool: Wrench,
  
  // Inventory
  inventory: Package,
  package: Package,
  
  // Navigation
  dashboard: LayoutDashboard,
  menu: Menu,
  close: X,
  
  // Status
  alert: AlertCircle,
  success: CheckCircle,
  error: XCircle,
  info: Info,
  
  // Trends
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  
  // Time
  calendar: Calendar,
  clock: Clock,
  
  // Actions
  search: Search,
  bell: Bell,
  settings: Settings,
  plus: Plus,
  minus: Minus,
  edit: Edit,
  delete: Trash2,
  save: Save,
  download: Download,
  upload: Upload,
  filter: Filter,
  
  // Sorting
  'sort-asc': SortAsc,
  'sort-desc': SortDesc,
  
  // Chevrons
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
};

// Register all icons
Object.entries(icons).forEach(([name, component]) => {
  registerIcon(name, component);
});

// Export icon loader utilities
export { Icon, registerIcon, getIcon, loadSvgIcon } from './IconLoader';
export type { IconComponent, IconProps } from './IconLoader';
