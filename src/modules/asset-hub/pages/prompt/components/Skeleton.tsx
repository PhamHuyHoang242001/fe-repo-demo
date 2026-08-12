// Shimmer skeleton primitives for loading states (reuses the ah-shimmer keyframe).
// Full-frame rounded-2xl blocks matching the redesigned card layout.
// Reduced-motion: animate-ah-shimmer is suppressed (motion-reduce:animate-none).

import React from 'react';

interface SkeletonProps {
  className?: string;
}

/** A single shimmer block. Size/shape via className (h-*, w-*, rounded-*). */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div
    className={`relative overflow-hidden bg-ah-pale ${className}`}
    aria-hidden="true"
  >
    <span className="absolute inset-0 -translate-x-full animate-ah-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent motion-reduce:animate-none" />
  </div>
);

/** Card-shaped skeleton matching the redesigned PromptCard layout. */
export const PromptCardSkeletonBlock: React.FC = () => (
  <div className="flex h-full flex-col gap-3 rounded-2xl border border-ah-line bg-ah-card p-5 shadow-ah-float-md">
    {/* Header: avatar + name + category pill */}
    <div className="flex items-start gap-3">
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2 pt-0.5">
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-1/3 rounded-full" />
      </div>
    </div>

    {/* Description lines */}
    <Skeleton className="h-3 w-full rounded-lg" />
    <Skeleton className="h-3 w-5/6 rounded-lg" />

    {/* Tags row */}
    <div className="flex gap-1.5">
      <Skeleton className="h-4 w-14 rounded-full" />
      <Skeleton className="h-4 w-12 rounded-full" />
      <Skeleton className="h-4 w-16 rounded-full" />
    </div>

    {/* Footer meta */}
    <div className="mt-auto flex items-center justify-between border-t border-ah-line pt-3">
      <Skeleton className="h-3 w-10 rounded" />
      <Skeleton className="h-3 w-16 rounded" />
    </div>
  </div>
);
