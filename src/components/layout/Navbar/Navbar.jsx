import React from 'react';
import { useThemeStore } from '../../../store/index.jsx';
import NavbarSearch from './NavbarSearch';
import NavbarActions from './NavbarActions';
import Logo from '../../Logo/Logo';

const Navbar = ({ onSearch }) => {
  const { isDarkMode } = useThemeStore();

  const navbarClasses = isDarkMode
    ? 'fixed top-0 left-0 right-0 z-50 h-14 bg-[rgba(18,18,20,0.95)] border-b border-black/60 shadow-[0_2px_12px_rgba(0,0,0,0.4)] backdrop-blur-xl'
    : 'fixed top-0 left-0 right-0 z-50 h-14 bg-white/[0.95] border-b border-black/25 shadow-[0_2px_12px_rgba(0,0,0,0.16)] backdrop-blur-md';

  return (
    <header
      className={navbarClasses}
    >
      <div className="w-full px-4 sm:px-6 h-full">
        <div className="flex items-center h-full gap-3.5 sm:gap-4 max-w-full">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Logo />
          </div>

          {/* Center: Search Button (centralizado) */}
          <div className="flex-1 flex justify-center">
            <NavbarActions showSearchOnly />
          </div>

          {/* Right: Theme Toggle + Profile */}
          <div className="flex items-center justify-end flex-shrink-0">
            <NavbarActions showActionsOnly />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
