import { motion } from 'framer-motion';
import { Search, Bell, Settings, User, Menu } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { cn } from '../../../utils';
import { ThemeToggle } from '../../primitives/ThemeToggle';

export interface NavbarUser {
  name: string;
  email: string;
  avatar?: string;
}

export interface NavbarProps {
  user?: NavbarUser;
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
  notificationCount?: number;
  className?: string;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Navbar({
  user,
  onSearch,
  onToggleSidebar,
  notificationCount = 0,
  className,
  logo,
  actions,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
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
      className={cn('sticky top-0 z-50 w-full', className)}
    >
      {/* Glass Background */}
      <div className="absolute inset-0 glass-effect border-b border-neutral-200/50 dark:border-neutral-800/50" />

      {/* Content */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            )}

            {/* Logo */}
            {logo || (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="hidden sm:block text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  TORQ
                </span>
              </div>
            )}
          </div>

          {/* Center Section - Search */}
          {onSearch && (
            <div className="flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-neutral-900 dark:text-neutral-50 placeholder-neutral-500"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              className="hidden sm:block p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </motion.button>

            {/* Custom Actions */}
            {actions}

            {/* User Profile */}
            {user && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
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
}
