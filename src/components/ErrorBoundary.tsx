import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary component for catching and handling React errors.
 * Provides a fallback UI and prevents entire app crashes.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log to monitoring service (e.g., Sentry) in production
    if (process.env.NODE_ENV === 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // Call optional onError callback
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
          <Card className="max-w-md w-full p-8 text-center space-y-6 border-red-500/20">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
              <ShieldAlert className="text-red-500" size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Application Error
              </h2>
              <p className="text-sm text-zinc-500 font-medium">
                Something went wrong. Our team has been notified.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-mono text-red-500 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={this.handleReset}
                className="flex-1"
                leftIcon={<RefreshCw size={16} />}
              >
                Reload Application
              </Button>
            </div>

            <details className="text-left mt-4">
              <summary className="text-xs font-bold uppercase tracking-widest text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300">
                Technical Details
              </summary>
              <pre className="mt-2 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-[10px] overflow-auto max-h-48 font-mono text-zinc-600 dark:text-zinc-400">
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Async Error Boundary wrapper for lazy-loaded components
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  displayName?: string
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
