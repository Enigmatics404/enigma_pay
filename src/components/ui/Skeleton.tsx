import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse bg-white/5 rounded-xl", className)} />
  );
};
