import { motion } from 'framer-motion';
import { Search, Bell, Settings, User, Moon, Sun, Menu } from 'lucide-react';
import { useState } from 'react';

export interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSearch?: (query: string) => void;
  onToggleTheme?: () => void;
  onToggleSidebar?: () => void;
  isDark?: boolean;
  notificationCount?: number;
}

export const PremiumNavbar = ({
  user,
  onSearch,
  onToggleTheme,
  onToggleSidebar,
  isDark = false,
  notificationCount = 0,
}: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
      className="sticky top-0 z-50 w-full"
    >
      {/* Glass Background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50" />

      {/* Content */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="hidden sm:block text-lg font-bold text-neutral-900 dark:text-neutral-50">
                TORQ
              </span>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-neutral-900 dark:text-neutral-50 placeholder-neutral-500"
                />
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleTheme}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-neutral-600" />
              )}
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
              )}
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </motion.button>

            {/* User Profile */}
            {user && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user.email}
                  </p>
                </div>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default PremiumNavbar;
