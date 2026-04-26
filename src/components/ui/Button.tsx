import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled, 
    fullWidth,
    ...props 
  }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-300',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900',
      'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
      'active:scale-[0.98] hover:scale-[1.02]',
      'touch-manipulation select-none',
      'font-sans tracking-wide',
      fullWidth && 'w-full'
    );

    const variants = {
      primary: cn(
        'accent-gradient text-white shadow-lg shadow-primary/25 hover:shadow-primary/40',
        'btn-glow border border-transparent'
      ),
      secondary: cn(
        'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white',
        'hover:bg-zinc-200 dark:hover:bg-zinc-700',
        'border border-zinc-200 dark:border-zinc-700'
      ),
      outline: cn(
        'bg-transparent border-2 text-zinc-900 dark:text-white',
        'border-zinc-200 dark:border-zinc-700',
        'hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary',
        'hover:bg-primary/5 dark:hover:bg-primary/10'
      ),
      ghost: cn(
        'bg-transparent text-zinc-600 dark:text-zinc-400',
        'hover:text-zinc-900 dark:hover:text-white',
        'hover:bg-zinc-100 dark:hover:bg-zinc-800'
      ),
      danger: cn(
        'bg-red-500/10 text-red-600 dark:text-red-400',
        'border border-red-500/20',
        'hover:bg-red-500/20 hover:border-red-500/30',
        'dark:hover:bg-red-500/25'
      ),
      success: cn(
        'bg-green-500/10 text-green-600 dark:text-green-400',
        'border border-green-500/20',
        'hover:bg-green-500/20 hover:border-green-500/30',
        'dark:hover:bg-green-500/25'
      ),
    };

    const sizes = {
      xs: 'px-3 py-1.5 text-xs min-h-[32px] gap-1.5',
      sm: 'px-4 py-2 text-sm min-h-[40px] gap-2',
      md: 'px-5 py-2.5 text-sm min-h-[44px] gap-2',
      lg: 'px-6 py-3 text-base font-semibold min-h-[52px] gap-2.5 uppercase tracking-wider',
      xl: 'px-8 py-4 text-base font-bold min-h-[60px] gap-3 uppercase tracking-widest',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="!w-4 !h-4 !border-2" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
