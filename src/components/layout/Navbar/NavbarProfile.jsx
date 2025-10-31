import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MdPerson, MdLogout, MdSettings } from 'react-icons/md';
import { useAuthStore, useThemeStore } from '../../../store/index.jsx';
import { dropdownVariants } from '../../../utils/animations';

const NavbarProfile = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: MdPerson, label: 'Perfil', path: '/profile' },
    { icon: MdSettings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 p-2 rounded-xl
          transition-colors
          ${isDarkMode
            ? 'hover:bg-white/10'
            : 'hover:bg-black/5'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm">
          {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`
              absolute right-0 mt-2 w-64 rounded-2xl p-2
              ${isDarkMode
                ? 'bg-gray-800/90 border border-gray-700'
                : 'bg-white/90 border border-gray-200'
              }
              backdrop-blur-xl shadow-2xl
            `}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* User Info */}
            <div className="px-3 py-3 border-b border-gray-700 dark:border-gray-700 border-gray-200">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.displayName || user?.email}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-xl
                    text-sm font-medium transition-colors
                    ${isDarkMode
                      ? 'text-gray-300 hover:bg-white/10'
                      : 'text-gray-700 hover:bg-black/5'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="pt-2 border-t border-gray-700 dark:border-gray-700 border-gray-200">
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl
                  text-sm font-medium transition-colors
                  ${isDarkMode
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-red-600 hover:bg-red-50'
                  }
                `}
              >
                <MdLogout className="w-5 h-5" />
                Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarProfile;
