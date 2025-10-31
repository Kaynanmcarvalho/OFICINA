import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Logo';
import { fadeIn } from '../../../utils/animations';

const SidebarLogo = React.memo(({ isCollapsed }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
  };

  return (
    <motion.div
      className="flex items-center justify-center h-20 px-4 border-b border-white/[0.08] dark:border-white/[0.08] cursor-pointer"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Logo 
          size={isCollapsed ? 'small' : 'medium'}
          className="transition-all duration-300"
        />
      </motion.div>
    </motion.div>
  );
});

export default SidebarLogo;
