/**
 * EmptyState - Estado vazio elegante
 * Exibido quando não há clientes cadastrados
 */

import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import AppleButton from './base/AppleButton';

const EmptyState = ({ onNewClient }) => {
  
  return (
    <div className="py-16 px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        {/* Ilustração */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {/* Círculo de fundo */}
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
              }}
            >
              {/* Círculo tracejado */}
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  border: '2px dashed var(--apple-border-light)',
                }}
              >
                <Users 
                  size={32} 
                  style={{ color: 'var(--apple-text-tertiary)' }}
                  strokeWidth={1.5}
                />
              </div>
            </div>
            
            {/* Pontos flutuantes */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
              style={{ background: 'var(--apple-accent-blue)' }}
            />
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full"
              style={{ background: 'var(--apple-accent-purple)' }}
            />
          </div>
        </motion.div>

        {/* Título */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--apple-text-primary)' }}
        >
          Nenhum cliente cadastrado
        </motion.h3>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 leading-relaxed"
          style={{ color: 'var(--apple-text-secondary)' }}
        >
          Comece adicionando seu primeiro cliente para gerenciar veículos, 
          serviços e histórico de atendimentos.
        </motion.p>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AppleButton
            variant="primary"
            onClick={onNewClient}
            className="px-8"
          >
            <Plus size={20} />
            Novo Cliente
          </AppleButton>
        </motion.div>

        {/* Dica */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6"
          style={{ borderTop: '1px solid var(--apple-border-light)' }}
        >
          <p className="text-sm" style={{ color: 'var(--apple-text-tertiary)' }}>
            💡 Dica: Use{' '}
            <kbd 
              className="px-2 py-1 rounded text-xs font-mono"
              style={{ background: 'var(--apple-bg-tertiary)' }}
            >
              ⌘ + N
            </kbd>
            {' '}para adicionar rapidamente
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmptyState;
