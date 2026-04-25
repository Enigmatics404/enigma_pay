import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  isGlow?: boolean;
  [key: string]: any;
}

export const Card = ({ className, children, isGlow, ...props }: CardProps) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-3xl p-6 shadow-xl transition-all duration-300",
        isGlow && "glow-purple border-primary/20",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};
