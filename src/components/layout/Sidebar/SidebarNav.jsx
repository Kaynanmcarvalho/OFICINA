import React from 'react';
import { motion } from 'framer-motion';
import SidebarItem from './SidebarItem';
import { staggerContainer } from '../../../utils/animations';

const SidebarNav = ({ items, isCollapsed, onItemClick }) => {
  return (
    <motion.nav
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-1"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.path}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                delay: index * 0.05,
                duration: 0.3
              }
            }
          }}
        >
          <SidebarItem 
            item={item} 
            isCollapsed={isCollapsed}
            onClick={onItemClick}
          />
        </motion.div>
      ))}
    </motion.nav>
  );
};

export default SidebarNav;
