// components/ui/Skeleton.tsx
'use client';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-[#ccbeac]/20 rounded-xl ${className}`} />
);