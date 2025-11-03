/**
 * ClientModal - Modal para criar/editar clientes
 * Design Apple-like com glassmorphism e animações suaves
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AppleButton from './base/AppleButton';
import ClientForm from './ClientForm';

const ClientModal = ({
  isOpen = false,
  onClose,
  onSave,
  client = null,
  isLoading = false,
}) => {
  
  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll do body quando modal aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Backdrop variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Modal variants
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--apple-backdrop)',
              backdropFilter: 'var(--apple-backdrop-blur)',
              WebkitBackdropFilter: 'var(--apple-backdrop-blur)',
              zIndex: 9998,
            }}
          />

          {/* Modal Container */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                borderRadius: '24px',
                background: 'var(--apple-glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--apple-glass-border)',
                boxShadow: 'var(--apple-shadow-xl)',
                overflow: 'hidden',
                pointerEvents: 'auto',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '24px',
                  borderBottom: '1px solid var(--apple-border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'var(--apple-text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {client ? 'Editar Cliente' : 'Novo Cliente'}
                </h2>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--apple-bg-tertiary)',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--apple-text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  <X size={20} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Body */}
              <div
                style={{
                  padding: '24px',
                  maxHeight: 'calc(90vh - 180px)',
                  overflowY: 'auto',
                }}
              >
                <ClientForm
                  client={client}
                  onSave={onSave}
                  onCancel={onClose}
                  isLoading={isLoading}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClientModal;
