import React from 'react';
import { cn } from '../../lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'current';
}

const sizes = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
};

const variants = {
  primary: 'text-primary border-t-transparent',
  white: 'text-white border-t-transparent',
  current: 'border-t-transparent',
};

export const Spinner = ({ className, size = 'md', variant = 'primary' }: SpinnerProps) => {
  return (
    <div 
      className={cn(
        "rounded-full animate-spin",
        sizes[size],
        variants[variant],
        className
      )} 
    />
  );
};

// LoadingOverlay component for full-screen or container loading states
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullscreen?: boolean;
  children?: React.ReactNode;
}

export const LoadingOverlay = ({ isLoading, message, fullscreen = false, children }: LoadingOverlayProps) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn(
      "relative",
      fullscreen && "fixed inset-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm"
    )}>
      {children}
      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-4",
        fullscreen && "fixed inset-0"
      )}>
        <Spinner size="lg" />
        {message && (
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// Skeleton component for loading placeholders
interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export const Skeleton = ({ 
  className, 
  variant = 'rect', 
  width, 
  height,
  animation = 'pulse'
}: SkeletonProps) => {
  return (
    <div 
      className={cn(
        "bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden relative",
        variant === 'circular' && "rounded-full",
        variant === 'text' && "h-4 rounded",
        animation === 'pulse' && "animate-pulse",
        animation === 'wave' && "animate-pulse",
        className
      )}
      style={{ width, height }}
    >
      {animation === 'wave' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      )}
    </div>
  );
};

// SkeletonText component for text-like loading placeholders
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText = ({ lines = 1, className }: SkeletonTextProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          className={cn(i === lines - 1 ? "w-3/4" : "w-full")} 
        />
      ))}
    </div>
  );
};
