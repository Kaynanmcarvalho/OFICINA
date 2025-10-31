import React from 'react';

interface RecentSkeletonProps {
  count?: number;
}

const RecentSkeleton: React.FC<RecentSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-22 rounded-2xl bg-white dark:bg-gray-800 border border-black/6 dark:border-white/10 p-4 animate-pulse"
        >
          <div className="flex items-center gap-4">
            {/* Avatar Skeleton */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer"></div>
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 space-y-2">
              {/* Primary Text */}
              <div className="h-4 bg-gradient-to-r from-gray-200/70 to-gray-300/70 dark:from-gray-700/70 dark:to-gray-600/70 rounded-lg w-44 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Secondary Text */}
              <div className="h-3.5 bg-gradient-to-r from-gray-200/60 to-gray-300/60 dark:from-gray-700/60 dark:to-gray-600/60 rounded-lg w-36 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Meta Row */}
              <div className="h-3 bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg w-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer"></div>
              </div>
            </div>

            {/* Status Pill Skeleton */}
            <div className="h-7 w-20 bg-gradient-to-r from-gray-200/60 to-gray-300/60 dark:from-gray-700/60 dark:to-gray-600/60 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer"></div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, actionIndex) => (
                <div
                  key={actionIndex}
                  className="w-9 h-9 bg-gradient-to-r from-gray-200/40 to-gray-300/40 dark:from-gray-700/40 dark:to-gray-600/40 rounded-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentSkeleton;