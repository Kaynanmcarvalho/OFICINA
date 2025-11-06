import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useThemeStore } from '../../../store/index.jsx';

const NavbarProfile = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    console.log('Toggle clicked, current state:', isOpen);
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    console.log('Dropdown state changed:', isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        type="button"
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
          isOpen 
            ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') 
            : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
        }`}
      >
        <div className="relative">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-500 text-white">
            <User size={24} />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </div>

        <div className="text-left hidden md:block">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {user?.displayName || user?.email?.split('@')[0] || 'Usuário'}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {user?.role || 'Usuário'}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl z-[60] overflow-hidden ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="py-2">
              {/* User Info Header */}
              <div className={`px-4 py-3 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <p className={`text-sm font-semibold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {user?.displayName || user?.email?.split('@')[0] || 'Usuário'}
                </p>
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                    isDarkMode 
                      ? 'text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User size={18} className="mr-3" />
                  Perfil
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                    isDarkMode 
                      ? 'text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={18} className="mr-3" />
                  Configurações
                </Link>
              </div>

              {/* Logout */}
              <div className={`border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className={`flex items-center w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    isDarkMode 
                      ? 'text-red-400 hover:bg-gray-700' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut size={18} className="mr-3" />
                  Sair
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarProfile;
