import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email?: string; walletAddress?: string; role: string } | null;
  login: (credentials: { email?: string; walletAddress?: string }) => Promise<void>;
  logout: () => void;
  sessionExpiry: Date | null;
}

const AUTH_STORAGE_KEY = 'enigma_auth_token';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_EXPIRY_MS = 5 * 60 * 1000; // Warn 5 minutes before expiry

const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * AuthProvider handles authentication state, session management, and auto-logout.
 * Uses secure practices with token storage and idle detection.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthState['user']>(null);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  /**
   * Handle user logout (defined early to avoid hoisting issues)
   */
  const handleLogout = useCallback((reason?: string) => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSessionExpiry(null);
    setUser(null);
    setIsAuthenticated(false);
    warningShownRef.current = false;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    if (reason) {
      toast.info(reason, { duration: 3000 });
    } else {
      toast.success('Logged out successfully');
    }
  }, []);

  /**
   * Reset idle timer on user activity
   */
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    if (isAuthenticated) {
      idleTimerRef.current = setTimeout(() => {
        handleLogout('Session expired due to inactivity');
      }, SESSION_TIMEOUT_MS);
    }
  }, [isAuthenticated, handleLogout]);

  /**
   * Check session expiry and show warning
   */
  const checkSessionExpiry = useCallback(() => {
    if (!sessionExpiry || !isAuthenticated) return;

    const now = new Date();
    const timeUntilExpiry = sessionExpiry.getTime() - now.getTime();

    // Show warning if session is about to expire
    if (timeUntilExpiry <= WARNING_BEFORE_EXPIRY_MS && !warningShownRef.current) {
      warningShownRef.current = true;
      toast.warning('Session expiring soon', {
        description: 'Your session will expire in 5 minutes. Please continue working to stay logged in.',
        duration: 30000,
      });
    }

    if (timeUntilExpiry <= 0) {
      handleLogout('Session expired');
    }
  }, [sessionExpiry, isAuthenticated, handleLogout]);

  /**
   * Handle user login
   */
  const handleLogin = useCallback(async (credentials: { email?: string; walletAddress?: string }) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        walletAddress: credentials.walletAddress,
        role: 'owner',
      };

      // Store auth token securely (in production, use HTTP-only cookies)
      const token = btoa(JSON.stringify({ ...mockUser, exp: Date.now() + SESSION_TIMEOUT_MS }));
      localStorage.setItem(AUTH_STORAGE_KEY, token);

      const expiryDate = new Date(Date.now() + SESSION_TIMEOUT_MS);
      setSessionExpiry(expiryDate);
      setUser(mockUser);
      setIsAuthenticated(true);
      warningShownRef.current = false;

      toast.success('Authentication successful', {
        description: `Welcome back, ${mockUser.email || mockUser.walletAddress?.slice(0, 6)}`,
      });

      resetIdleTimer();
    } catch (error) {
      toast.error('Authentication failed', {
        description: 'Please try again or contact support.',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [resetIdleTimer]);

  /**
   * Restore session from storage on mount
   */
  useEffect(() => {
    const restoreSession = () => {
      try {
        const token = localStorage.getItem(AUTH_STORAGE_KEY);
        if (token) {
          const decoded = JSON.parse(atob(token));
          const now = Date.now();
          
          if (decoded.exp && decoded.exp > now) {
            // Valid session
            const { exp, ...userData } = decoded;
            setUser(userData);
            setIsAuthenticated(true);
            setSessionExpiry(new Date(decoded.exp));
            resetIdleTimer();
          } else {
            // Expired session
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [resetIdleTimer]);

  /**
   * Set up idle detection and session expiry checks
   */
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetIdleTimer();
      if (warningShownRef.current) {
        warningShownRef.current = false;
      }
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    const expiryCheckInterval = setInterval(checkSessionExpiry, 30000); // Check every 30 seconds

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      clearInterval(expiryCheckInterval);
    };
  }, [resetIdleTimer, checkSessionExpiry]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login: handleLogin,
        logout: handleLogout,
        sessionExpiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
