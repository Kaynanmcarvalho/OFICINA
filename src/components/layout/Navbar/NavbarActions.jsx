import React from 'react';
import { motion } from 'framer-motion';
import { MdNotifications } from 'react-icons/md';
import ThemeToggle from './ThemeToggle';
import NavbarProfile from './NavbarProfile';
import { badgeBounce } from '../../../utils/animations';

const NavbarActions = () => {
  const [notificationCount] = React.useState(3); // Example notification count

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <motion.button
        className="relative p-2 rounded-xl hover:bg-gray-500/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Notificações"
      >
        <MdNotifications className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        {notificationCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            animate={badgeBounce}
          >
            {notificationCount}
          </motion.span>
        )}
      </motion.button>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Profile */}
      <NavbarProfile />
    </div>
  );
};

export default NavbarActions;
