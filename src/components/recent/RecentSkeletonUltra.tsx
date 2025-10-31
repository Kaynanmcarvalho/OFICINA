import React from 'react';
import { motion } from 'framer-motion';

interface RecentSkeletonUltraProps {
  count?: number;
}

const RecentSkeletonUltra: React.FC<RecentSkeletonUltraProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: index * 0.1, 
            duration: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="relative group"
        >
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          {/* Main skeleton card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-xl border border-white/[0.05] shadow-2xl shadow-black/40">
            
            {/* Animated background */}
            <div className="absolute inset-0 opacity-[0.02]">
              <motion.div 
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                    radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px',
                }}
              />
            </div>

            {/* Top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-center gap-5">
                
                {/* Avatar skeleton */}
                <div className="flex-shrink-0 relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      }}
                    />
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="flex-1 space-y-3">
                  {/* Primary text */}
                  <div className="h-5 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-xl w-48 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2 + 0.1,
                      }}
                    />
                  </div>
                  
                  {/* Secondary text */}
                  <div className="h-4 bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-lg w-36 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2 + 0.2,
                      }}
                    />
                  </div>
                  
                  {/* Meta row */}
                  <div className="flex items-center gap-3">
                    <div className="h-3 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-md w-20 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2 + 0.3,
                        }}
                      />
                    </div>
                    <div className="w-1 h-1 bg-gray-600/50 rounded-full" />
                    <div className="h-3 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-md w-16 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2 + 0.4,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status pill skeleton */}
                <div className="flex-shrink-0">
                  <div className="h-7 w-24 bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-full relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2 + 0.5,
                      }}
                    />
                  </div>
                </div>

                {/* Actions skeleton */}
                <div className="flex-shrink-0 flex gap-2">
                  {Array.from({ length: 3 }).map((_, actionIndex) => (
                    <div 
                      key={actionIndex}
                      className="w-9 h-9 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-lg relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2 + 0.6 + actionIndex * 0.1,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom highlight */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RecentSkeletonUltra;