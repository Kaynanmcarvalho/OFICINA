import React, { ReactNode, Suspense, lazy } from 'react';
import { cn } from '../utils';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  fallback?: ReactNode;
}

// Icon registry for lazy loading
const iconRegistry = new Map<string, React.LazyExoticComponent<React.FC<any>>>();

/**
 * Register an icon for lazy loading
 * @param name - Icon name
 * @param loader - Dynamic import function
 */
export function registerIcon(name: string, loader: () => Promise<{ default: React.FC<any> }>) {
  iconRegistry.set(name, lazy(loader));
}

/**
 * Icon component with lazy loading and fallback support
 */
export function Icon({ name, size = 24, className, fallback }: IconProps) {
  const IconComponent = iconRegistry.get(name);

  if (!IconComponent) {
    return fallback ? <>{fallback}</> : (
      <div 
        className={cn('inline-block bg-neutral-200 dark:bg-neutral-700 rounded', className)}
        style={{ width: size, height: size }}
        aria-label={`Icon: ${name}`}
      />

  }

  return (
    <Suspense fallback={fallback || (
      <div 
        className={cn('inline-block animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded', className)}
        style={{ width: size, height: size }}
      />
    )}>
      <IconComponent 
        size={size} 
        className={cn('inline-block', className)}
        aria-hidden="true"
      />
    </Suspense>

}

// Pre-register common icons from lucide-react
import { 
  Home, LayoutDashboard, Settings, Search, Menu,
  Plus, Edit, Trash2, Save, X,
  Check, AlertCircle, Info, AlertTriangle, CheckCircle2,
  Users, Car, Wrench, Package, Calendar,
  Sun, Cloud, CloudRain, CloudSnow, Wind,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Bell, User, LogOut, HelpCircle, Eye, EyeOff,
  Upload, Download, RefreshCw, Filter, SortAsc, SortDesc,
  MoreVertical, MoreHorizontal, Copy, ExternalLink,
  FileText, Image as ImageIcon, File, Folder,
  Mail, Phone, MapPin, Globe,
  TrendingUp, TrendingDown, DollarSign, CreditCard,
  Clock, Zap, Star, Heart, Bookmark,
  Lock, Unlock, Shield, Key,
  Loader2, Loader,
} from 'lucide-react';

// Register lucide icons
const lucideIcons = {
  // Navigation
  home: Home,
  dashboard: LayoutDashboard,
  settings: Settings,
  search: Search,
  menu: Menu,
  
  // Actions
  add: Plus,
  edit: Edit,
  delete: Trash2,
  save: Save,
  close: X,
  check: Check,
  
  // Status
  alert: AlertCircle,
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  
  // Business
  clients: Users,
  vehicles: Car,
  tools: Wrench,
  inventory: Package,
  schedule: Calendar,
  
  // Weather
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  wind: Wind,
  
  // UI
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  
  // User
  bell: Bell,
  user: User,
  logout: LogOut,
  help: HelpCircle,
  eye: Eye,
  'eye-off': EyeOff,
  
  // File operations
  upload: Upload,
  download: Download,
  refresh: RefreshCw,
  filter: Filter,
  'sort-asc': SortAsc,
  'sort-desc': SortDesc,
  'more-vertical': MoreVertical,
  'more-horizontal': MoreHorizontal,
  copy: Copy,
  'external-link': ExternalLink,
  
  // Files
  'file-text': FileText,
  image: ImageIcon,
  file: File,
  folder: Folder,
  
  // Contact
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  globe: Globe,
  
  // Finance
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  dollar: DollarSign,
  'credit-card': CreditCard,
  
  // Misc
  clock: Clock,
  zap: Zap,
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
  
  // Security
  lock: Lock,
  unlock: Unlock,
  shield: Shield,
  key: Key,
  
  // Loading
  loader: Loader2,
  'loader-alt': Loader,
};

// Register all lucide icons
Object.entries(lucideIcons).forEach(([name, Component]) => {
  registerIcon(name, async () => ({ default: Component }));
});

export { registerIcon as default };
