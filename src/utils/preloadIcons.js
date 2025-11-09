/**
 * Pré-carregamento de ícones
 * Garante que todos os ícones do lucide-react sejam carregados antes da renderização
 */

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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Moon,
  Sun,
  User,
  LogOut,
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Download,
  Upload,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Save,
  Copy,
  Share2,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  MessageSquare,
  MessageCircle,
  Grid,
  List,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  History,
} from 'lucide-react';

/**
 * Lista de todos os ícones usados no sistema
 * Mantém referências para garantir que sejam incluídos no bundle
 */
export const preloadedIcons = {
  // Menu principal
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
  
  // Navegação
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  
  // Ações
  Bell,
  Search,
  Moon,
  Sun,
  User,
  LogOut,
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  Save,
  Copy,
  Share2,
  ExternalLink,
  Download,
  Upload,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  MoreVertical,
  MoreHorizontal,
  
  // Feedback
  AlertCircle,
  Info,
  HelpCircle,
  CheckCircle,
  XCircle,
  
  // Contato e Comunicação
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  MessageCircle,
  
  // Financeiro e Métricas
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  
  // UI e Layout
  Grid,
  List,
  Loader2,
  Clock,
  History,
  Zap,
};

/**
 * Função para pré-carregar todos os ícones
 * Deve ser chamada no início da aplicação
 */
export const preloadAllIcons = () => {
  // Força o carregamento de todos os ícones
  Object.keys(preloadedIcons).forEach(iconName => {
    const Icon = preloadedIcons[iconName];
    if (Icon) {
      // Mantém referência para forçar inclusão no bundle
      void Icon;
    }
  });
  
  console.log('✅ Ícones pré-carregados com sucesso');
  return true;
};

// Pré-carrega imediatamente ao importar o módulo
preloadAllIcons();

export default preloadedIcons;
