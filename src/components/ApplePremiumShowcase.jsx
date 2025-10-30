import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Star } from 'lucide-react';

/**
 * Apple Premium Theme Showcase
 * Demonstra os componentes e estilos do tema Apple Premium Dark Mode
 */
const ApplePremiumShowcase = () => {
  return (
    <div className="min-h-screen p-8 space-y-8">
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-dark-accent via-dark-accent-alt to-dark-purple bg-clip-text text-transparent dark:from-dark-accent dark:via-dark-accent-alt dark:to-dark-purple">
          Apple Premium Dark Mode
        </h1>
        <p className="text-dark-muted dark:text-dark-muted text-lg">
          macOS Sonoma & VisionOS inspired design system
        </p>
      </motion.div>

      {/* Glass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 - Glass Apple */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="glass-apple rounded-2xl p-6 space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-dark-text dark:text-dark-text">
            Glassmorphism
          </h3>
          <p className="text-sm text-dark-muted dark:text-dark-muted">
            Vidro fosco com blur e profundidade
          </p>
        </motion.div>

        {/* Card 2 - Elevated */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="card-elevated p-6 space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-dark-text dark:text-dark-text">
            Elevated Card
          </h3>
          <p className="text-sm text-dark-muted dark:text-dark-muted">
            Camada elevada com mais destaque
          </p>
        </motion.div>

        {/* Card 3 - Standard */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="card-macos p-6 space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-dark-text dark:text-dark-text">
            Standard Card
          </h3>
          <p className="text-sm text-dark-muted dark:text-dark-muted">
            Card padrão com hover suave
          </p>
        </motion.div>

        {/* Card 4 - Accent */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="glass-apple rounded-2xl p-6 space-y-4 border-dark-accent dark:border-dark-accent"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-dark-accent dark:text-dark-accent">
            Accent Card
          </h3>
          <p className="text-sm text-dark-muted dark:text-dark-muted">
            Com borda de acento Apple Blue
          </p>
        </motion.div>
      </div>

      {/* Buttons Section */}
      <div className="card-macos p-8 space-y-6">
        <h2 className="text-2xl font-bold text-dark-text dark:text-dark-text">
          Buttons & Interactions
        </h2>
        
        <div className="flex flex-wrap gap-4">
          <button className="btn-macos">
            Standard Button
          </button>
          
          <button className="btn-primary">
            Primary Action
          </button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-dark-accent to-dark-accent-alt dark:from-dark-accent dark:to-dark-accent-alt text-white font-medium shadow-glow-blue"
          >
            Gradient Button
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl glass-apple text-dark-text dark:text-dark-text font-medium"
          >
            Glass Button
          </motion.button>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="card-macos p-8 space-y-6">
        <h2 className="text-2xl font-bold text-dark-text dark:text-dark-text">
          Form Elements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-text dark:text-dark-text">
              Standard Input
            </label>
            <input
              type="text"
              placeholder="Digite algo..."
              className="input-macos"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-text dark:text-dark-text">
              Email Input
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="input-macos"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-text dark:text-dark-text">
            Textarea
          </label>
          <textarea
            placeholder="Escreva uma mensagem..."
            rows={4}
            className="input-macos resize-none"
          />
        </div>
      </div>

      {/* Color Palette */}
      <div className="card-macos p-8 space-y-6">
        <h2 className="text-2xl font-bold text-dark-text dark:text-dark-text">
          Color Palette
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <div className="w-full h-20 rounded-xl bg-dark-bg dark:bg-dark-bg border border-dark-border dark:border-dark-border" />
            <p className="text-xs text-dark-muted dark:text-dark-muted">Background</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-full h-20 rounded-xl bg-dark-surface dark:bg-dark-surface border border-dark-border dark:border-dark-border" />
            <p className="text-xs text-dark-muted dark:text-dark-muted">Surface</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-full h-20 rounded-xl bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border" />
            <p className="text-xs text-dark-muted dark:text-dark-muted">Card</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-full h-20 rounded-xl bg-dark-elevated dark:bg-dark-elevated border border-dark-border dark:border-dark-border" />
            <p className="text-xs text-dark-muted dark:text-dark-muted">Elevated</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-full h-20 rounded-xl bg-dark-accent dark:bg-dark-accent" />
            <p className="text-xs text-dark-muted dark:text-dark-muted">Accent</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-full h-20 rounded-xl bg-dark-purple dark:bg-dark-purple" />
            <p className="text-xs text-dark-muted dark:text-dark-muted">Purple</p>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="card-macos p-8 space-y-6">
        <h2 className="text-2xl font-bold text-dark-text dark:text-dark-text">
          Typography
        </h2>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-dark-text dark:text-dark-text">
            Heading 1 - Bold & Clear
          </h1>
          <h2 className="text-3xl font-semibold text-dark-text dark:text-dark-text">
            Heading 2 - Semibold
          </h2>
          <h3 className="text-2xl font-medium text-dark-text dark:text-dark-text">
            Heading 3 - Medium
          </h3>
          <p className="text-base text-dark-text dark:text-dark-text">
            Body text - Regular weight, acetinado e legível
          </p>
          <p className="text-sm text-dark-muted dark:text-dark-muted">
            Secondary text - Cinza elegante para informações secundárias
          </p>
          <p className="text-xs text-dark-subtle dark:text-dark-subtle">
            Subtle text - Para metadados e informações terciárias
          </p>
        </div>
      </div>

      {/* Dividers */}
      <div className="card-macos p-8 space-y-6">
        <h2 className="text-2xl font-bold text-dark-text dark:text-dark-text">
          Dividers & Separators
        </h2>
        
        <div className="space-y-4">
          <p className="text-dark-muted dark:text-dark-muted">Conteúdo acima</p>
          <div className="divider-apple" />
          <p className="text-dark-muted dark:text-dark-muted">Conteúdo abaixo</p>
        </div>
      </div>

    </div>
  );
};

export default ApplePremiumShowcase;
