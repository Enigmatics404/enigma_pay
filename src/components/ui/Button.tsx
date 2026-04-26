import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'accent-gradient text-white shadow-lg shadow-primary/20 btn-glow',
      secondary: 'bg-zinc-900/5 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-zinc-900/10 dark:hover:bg-white/20',
      outline: 'bg-transparent border border-black/10 dark:border-white/20 text-zinc-900 dark:text-white hover:border-black/20 dark:hover:border-white/40',
      ghost: 'bg-transparent text-zinc-500 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5',
      danger: 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[44px]',
      md: 'px-6 py-3 text-base min-h-[48px]',
      lg: 'px-10 py-5 text-base font-bold uppercase tracking-widest min-h-[56px]',
      xl: 'px-12 py-6 text-lg font-black uppercase tracking-widest min-h-[64px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none font-sans',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-900',
          'touch-manipulation',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);
