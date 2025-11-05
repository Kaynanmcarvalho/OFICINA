import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useThemeStore } from '../../../store/themeStore';

const NavbarProfile = () => {
  const { user, logout } = useAuthStore();
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center p-1 rounded-full cursor-pointer transition-colors duration-300 ${isOpen ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-500 text-white">
            <User size={24} />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        <div className="ml-3 text-left">
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {user?.displayName || user?.email}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {user?.role || 'Usuário'}
          </p>
        </div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <ChevronDown
            size={20}
            className={`ml-2 cursor-pointer transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
          />
        </motion.div>
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20`}
        >
          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <User size={16} className="mr-3" />
              Perfil
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings size={16} className="mr-3" />
              Configurações
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut size={16} className="mr-3" />
              Sair
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NavbarProfile;
