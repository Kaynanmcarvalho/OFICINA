/**
 * ClientTableSkeleton - Loading state para a tabela
 * Skeleton loader com animação shimmer
 */

import { motion } from 'framer-motion';

const ClientTableSkeleton = ({ rows = 5 }) => {
  
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <motion.tr
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          style={{
            borderBottom: '1px solid var(--apple-border-light)',
            height: '72px',
          }}
        >
          {/* Cliente - Avatar + Nome */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div 
                className="skeleton-shimmer"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--apple-bg-tertiary)',
                }}
              />
              <div className="flex-1 space-y-2">
                <div 
                  className="skeleton-shimmer"
                  style={{
                    height: '16px',
                    width: '60%',
                    borderRadius: '4px',
                    background: 'var(--apple-bg-tertiary)',
                  }}
                />
                <div 
                  className="skeleton-shimmer"
                  style={{
                    height: '14px',
                    width: '40%',
                    borderRadius: '4px',
                    background: 'var(--apple-bg-tertiary)',
                  }}
                />
              </div>
            </div>
          </td>

          {/* Contato */}
          <td className="px-6 py-4">
            <div className="space-y-2">
              <div 
                className="skeleton-shimmer"
                style={{
                  height: '14px',
                  width: '80%',
                  borderRadius: '4px',
                  background: 'var(--apple-bg-tertiary)',
                }}
              />
              <div 
                className="skeleton-shimmer"
                style={{
                  height: '14px',
                  width: '70%',
                  borderRadius: '4px',
                  background: 'var(--apple-bg-tertiary)',
                }}
              />
            </div>
          </td>

          {/* Veículos */}
          <td className="px-6 py-4">
            <div className="flex justify-center">
              <div 
                className="skeleton-shimmer"
                style={{
                  height: '24px',
                  width: '48px',
                  borderRadius: '12px',
                  background: 'var(--apple-bg-tertiary)',
                }}
              />
            </div>
          </td>

          {/* Última Visita */}
          <td className="px-6 py-4">
            <div className="flex justify-center">
              <div 
                className="skeleton-shimmer"
                style={{
                  height: '14px',
                  width: '80px',
                  borderRadius: '4px',
                  background: 'var(--apple-bg-tertiary)',
                }}
              />
            </div>
          </td>

          {/* Total Serviços */}
          <td className="px-6 py-4">
            <div className="flex justify-center">
              <div 
                className="skeleton-shimmer"
                style={{
                  height: '14px',
                  width: '32px',
                  borderRadius: '4px',
                  background: 'var(--apple-bg-tertiary)',
                }}
              />
            </div>
          </td>

          {/* Ações */}
          <td className="px-6 py-4">
            <div className="flex justify-end gap-2">
              <div 
                className="skeleton-shimmer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--apple-bg-tertiary)',
                }}
              />
              <div 
                className="skeleton-shimmer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--apple-bg-tertiary)',
                }}
              />
            </div>
          </td>
        </motion.tr>
      ))}

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            var(--apple-bg-tertiary) 0px,
            var(--apple-overlay-light) 40px,
            var(--apple-bg-tertiary) 80px
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </>
  );
};

export default ClientTableSkeleton;
