import React from 'react';

/**
 * RecentSkeleton - Placeholder de loading
 * Shimmer animation Apple-style
 */
const RecentSkeleton: React.FC = () => {
  return (
    <div className="h-22 px-4 py-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/50 animate-pulse">
      <div className="flex items-center gap-4 h-full">
        {/* Avatar skeleton */}
        <div className="w-14 h-14 rounded-2xl bg-neutral-200 dark:bg-neutral-700" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-44 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="h-3.5 w-36 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-700 rounded" />
        </div>

        {/* Status skeleton */}
        <div className="w-20 h-7 bg-neutral-200 dark:bg-neutral-700 rounded-full" />

        {/* Actions skeleton */}
        <div className="flex gap-2">
          <div className="w-9 h-9 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
          <div className="w-9 h-9 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default RecentSkeleton;
