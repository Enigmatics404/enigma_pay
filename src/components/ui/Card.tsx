import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  isGlow?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  [key: string]: any;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export const Card = ({ 
  className, 
  children, 
  isGlow, 
  hover = false,
  padding = 'md',
  ...props 
}: CardProps) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-3xl transition-all duration-300",
        paddingClasses[padding],
        isGlow && "glow-purple border-primary/20 shadow-lg shadow-primary/10",
        hover && "hover:shadow-xl hover:scale-[1.01] hover:border-primary/30 cursor-pointer",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const CardHeader = ({ title, description, action, icon, className, children, ...props }: CardHeaderProps) => {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)} {...props}>
      <div className="flex items-start gap-3 flex-1">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && <h3 className="font-black text-sm uppercase tracking-[0.15em] text-zinc-900 dark:text-white">{title}</h3>}
          {description && <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {children}
    </div>
  );
};

// Card Content component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = ({ className, ...props }: CardContentProps) => {
  return <div className={cn("", className)} {...props} />;
};

// Card Footer component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = ({ className, ...props }: CardFooterProps) => {
  return (
    <div className={cn("flex items-center gap-3 pt-6 mt-6 border-t border-black/5 dark:border-white/5", className)} {...props} />
  );
};
