import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[95vw]',
};

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  description,
  children, 
  className,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
}: ModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className={cn(
              "glass w-full rounded-3xl border border-white/20 shadow-2xl relative z-10 overflow-hidden",
              "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl",
              sizeClasses[size],
              className
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-black/5 dark:border-white/5">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h3 id="modal-title" className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-sm text-zinc-500 mt-1">{description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
            
            {/* Body */}
            <div className="px-6 py-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Modal Trigger component for easier usage
interface ModalTriggerProps {
  children: React.ReactNode;
  onOpen: () => void;
  className?: string;
}

export const ModalTrigger = ({ children, onOpen, className }: ModalTriggerProps) => {
  return (
    <button onClick={onOpen} className={className}>
      {children}
    </button>
  );
};
