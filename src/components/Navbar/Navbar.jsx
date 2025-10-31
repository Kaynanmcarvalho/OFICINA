import { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Moon, Sun, User, LogOut, Settings, UserCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/index.jsx';

/**
 * Navbar Premium - Estilo Apple
 * Design imersivo com glassmorphism, animações fluidas e atenção aos detalhes
 * Agora se adapta ao espaço disponível quando a sidebar muda de tamanho
 */
const Navbar = ({ onMenuClick, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const isDark = theme === 'dark';

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 w-full"
    >
      {/* Glassmorphism Container */}
      <div className="relative w-full">
        {/* Background com blur */}
        <div className="absolute inset-0 bg-white/70 dark:bg-[#14161D]/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/[0.08]" />
        
        {/* Gradient overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-[#181A20]/50 dark:to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 w-full">
            
            {/* Logo Section - Esquerda */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 min-w-0"
            >
              {/* Menu Button for Mobile */}
              {onMenuClick && (
                <button
                  onClick={onMenuClick}
                  className="lg:hidden p-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-300"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              {/* Logo TORQ - SVG Inline */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {/* Brilho laranja animado no hover */}
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 rounded-xl blur-xl opacity-0 group-hover:opacity-100"
                  animate={{
                    x: [-50, 50],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut'
                  }}
                />
                
                <svg
                  width="120"
                  height="35"
                  viewBox="0 0 400 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative transition-all duration-300 w-[100px] sm:w-[120px] lg:w-[140px] h-auto"
                  aria-label="TORQ"
                  role="img"
                >
                  {/* Letra T */}
                  <path
                    d="M20 25 L90 25 L90 40 L65 40 L65 95 L45 95 L45 40 L20 40 Z"
                    fill={isDark ? '#FFFFFF' : '#1F2937'}
                    className="transition-colors duration-300"
                  />
                  
                  {/* Letra O com Engrenagem */}
                  <g>
                    <circle
                      cx="125"
                      cy="60"
                      r="32"
                      fill="none"
                      stroke={isDark ? '#FFFFFF' : '#1F2937'}
                      strokeWidth="12"
                      className="transition-colors duration-300"
                    />
                    <g transform="translate(125, 60)">
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180;
                        const x1 = Math.cos(rad) * 15;
                        const y1 = Math.sin(rad) * 15;
                        const x2 = Math.cos(rad) * 22;
                        const y2 = Math.sin(rad) * 22;
                        return (
                          <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={isDark ? '#FFFFFF' : '#1F2937'}
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="transition-colors duration-300"
                          />
                        );
                      })}
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="8" 
                        fill={isDark ? '#FFFFFF' : '#1F2937'}
                        className="transition-colors duration-300"
                      />
                    </g>
                  </g>
                  
                  {/* Letra R */}
                  <path
                    d="M180 25 L210 25 Q235 25 235 45 Q235 60 220 63 L240 95 L218 95 L200 65 L195 65 L195 95 L180 95 Z M195 40 L195 52 L210 52 Q220 52 220 46 Q220 40 210 40 Z"
                    fill={isDark ? '#FFFFFF' : '#1F2937'}
                    className="transition-colors duration-300"
                  />
                  
                  {/* Letra Q com Chave */}
                  <g>
                    <circle
                      cx="285"
                      cy="60"
                      r="32"
                      fill="none"
                      stroke={isDark ? '#FFFFFF' : '#1F2937'}
                      strokeWidth="12"
                      className="transition-colors duration-300"
                    />
                    <g transform="translate(285, 60) rotate(-30)">
                      <rect
                        x="-3"
                        y="-25"
                        width="6"
                        height="50"
                        fill="#FF8C42"
                        rx="3"
                      />
                      <circle
                        cx="0"
                        cy="-28"
                        r="8"
                        fill="none"
                        stroke="#FF8C42"
                        strokeWidth="3"
                      />
                      <g transform="translate(0, 25)">
                        <rect x="-3" y="0" width="8" height="4" fill="#FF8C42" />
                        <rect x="-3" y="6" width="6" height="4" fill="#FF8C42" />
                        <rect x="-3" y="12" width="8" height="4" fill="#FF8C42" />
                      </g>
                    </g>
                  </g>
                </svg>
              </motion.div>
            </motion.div>

            {/* Actions Section - Direita */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0 relative z-50"
            >
              
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative p-2 sm:p-2.5 lg:p-3 rounded-xl bg-gray-100/80 dark:bg-[#181A20]/80 hover:bg-gray-200/80 dark:hover:bg-[#1C1E26]/90 backdrop-blur-sm transition-all duration-300 group border border-transparent dark:border-white/[0.08]"
                aria-label="Pesquisar"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-[#A7A8AE] group-hover:text-gray-900 dark:group-hover:text-[#E8E8EA] transition-colors" />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-blue-500/0 group-hover:bg-blue-500/10 dark:group-hover:bg-[#0A84FF]/10 transition-all duration-300" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="relative p-2 sm:p-2.5 lg:p-3 rounded-xl bg-gray-100/80 dark:bg-[#181A20]/80 hover:bg-gray-200/80 dark:hover:bg-[#1C1E26]/90 backdrop-blur-sm transition-all duration-300 group overflow-hidden border border-transparent dark:border-white/[0.08]"
                aria-label="Alternar tema"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-amber-500/0 dark:bg-indigo-500/0 group-hover:bg-amber-500/10 dark:group-hover:bg-indigo-500/10 transition-all duration-300" />
              </motion.button>

              {/* Divider */}
              <div className="hidden lg:block w-px h-8 bg-gray-300/50 dark:bg-white/[0.08]" />

              {/* User Profile Button with Dropdown */}
              {user && (
                <div className="relative hidden lg:block" ref={profileMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-[#181A20]/80 backdrop-blur-sm transition-all duration-300 hover:bg-gray-200/80 dark:hover:bg-[#1C1E26]/90 group border border-transparent dark:border-white/[0.08]"
                    aria-label="Perfil do usuário"
                  >
                    {/* User Avatar */}
                    <div className="relative">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'Usuário'}
                          className="w-9 h-9 rounded-full object-cover shadow-lg group-hover:shadow-orange-500/50 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg group-hover:shadow-orange-400/50 transition-all duration-300">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#14161D]" />
                    </div>

                    {/* User Details */}
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900 dark:text-[#E8E8EA] leading-tight">
                        {user.displayName || user.email?.split('@')[0] || 'Usuário'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-[#A7A8AE] leading-tight">
                        {user.role || 'Mecânico'}
                      </span>
                    </div>

                    {/* Chevron Icon */}
                    <motion.div
                      animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-[#A7A8AE]" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-2 w-64 origin-top-right"
                      >
                        <div className="bg-white/90 dark:bg-[#181A20]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/[0.08] overflow-hidden">
                          {/* User Info Header */}
                          <div className="px-4 py-3 border-b border-gray-200/50 dark:border-white/[0.08]">
                            <p className="text-sm font-semibold text-gray-900 dark:text-[#E8E8EA]">
                              {user.displayName || 'Usuário'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-[#A7A8AE] truncate">
                              {user.email}
                            </p>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <motion.button
                              whileHover={{ x: 4 }}
                              onClick={() => {
                                navigate('/profile');
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#E8E8EA] hover:bg-gray-100/80 dark:hover:bg-white/[0.05] transition-all duration-200"
                            >
                              <UserCircle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                              <span>Meu Perfil</span>
                            </motion.button>

                            <motion.button
                              whileHover={{ x: 4 }}
                              onClick={() => {
                                navigate('/settings');
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#E8E8EA] hover:bg-gray-100/80 dark:hover:bg-white/[0.05] transition-all duration-200"
                            >
                              <Settings className="w-5 h-5 text-gray-500 dark:text-[#A7A8AE]" />
                              <span>Configurações</span>
                            </motion.button>
                          </div>

                          {/* Logout Button */}
                          <div className="border-t border-gray-200/50 dark:border-white/[0.08] py-2">
                            <motion.button
                              whileHover={{ x: 4 }}
                              onClick={() => {
                                handleLogout();
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200"
                            >
                              <LogOut className="w-5 h-5" />
                              <span>Sair</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Logout Button - Sempre visível com z-index alto */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="relative p-2.5 lg:p-3 rounded-xl bg-red-50/80 dark:bg-red-900/20 hover:bg-red-100/80 dark:hover:bg-red-900/30 backdrop-blur-sm transition-all duration-300 group border border-transparent dark:border-red-500/20 flex-shrink-0 z-50"
                aria-label="Sair"
                title="Sair"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-red-500/0 group-hover:bg-red-500/10 transition-all duration-300" />
              </motion.button>

            </motion.div>
          </div>
        </div>

        {/* Bottom shadow for depth */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 dark:via-white/[0.08] to-transparent" />
      </div>

      {/* Search Modal (opcional - expandir se necessário) */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 px-6 lg:px-8"
          >
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/90 dark:bg-[#181A20]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/[0.08] p-4">
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="w-full px-4 py-3 bg-gray-100/50 dark:bg-[#14161D]/50 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-[#0A84FF]/50 text-gray-900 dark:text-[#E8E8EA] placeholder-gray-500 dark:placeholder-[#6E6F76]"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
