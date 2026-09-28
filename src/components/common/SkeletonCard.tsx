import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-3 border border-stone-200/80 shadow-soft flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/3] rounded-2xl skeleton-shimmer mb-3" />

      {/* Body Skeleton */}
      <div className="flex flex-col flex-grow px-1.5 pb-1 gap-2">
        <div className="h-5 bg-stone-200 rounded-md w-3/4 skeleton-shimmer" />
        <div className="flex justify-between items-center mt-1">
          <div className="h-3 bg-stone-200 rounded w-1/3 skeleton-shimmer" />
          <div className="h-3 bg-stone-200 rounded w-1/4 skeleton-shimmer" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-stone-200 skeleton-shimmer" />
            <div className="h-3 bg-stone-200 rounded w-16 skeleton-shimmer" />
          </div>
          <div className="h-7 bg-stone-200 rounded-xl w-16 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};
