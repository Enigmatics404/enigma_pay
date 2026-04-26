import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import BatchPay from './components/BatchPay';
import History from './components/History';
import Settings from './components/Settings';
import Automation from './components/Automation';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from './lib/utils';
import { Toaster } from 'sonner';
import BottomNav from './components/BottomNav';
import { Web3Provider, useWeb3 } from './components/Web3Provider';
import { AutomationProvider } from './components/AutomationProvider';
import { NotificationProvider } from './components/NotificationProvider';
import { UserProvider } from './components/UserProvider';
import { ApprovalProvider } from './components/ApprovalProvider';
import { OrgProvider } from './components/OrgProvider';
import { AlertTriangle } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { Spinner } from './components/ui/Spinner';

// Lazy load heavy components for code splitting
const LazyLandingPage = lazy(() => import('./components/LandingPage'));
const LazyLogin = lazy(() => import('./components/Login'));

/**
 * Wrapper component for LandingPage to handle lazy loading with required props
 */
function LandingPageRoute() {
  const navigate = useNavigate();
  
  const handleLaunch = () => navigate('/login');
  const handleSandbox = () => navigate('/login');
  
  return <LazyLandingPage onLaunch={handleLaunch} onTrySandbox={handleSandbox} />;
}

/**
 * Wrapper component for Login to handle lazy loading with required props
 */
function LoginRoute() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSuccess = async () => {
    // Auth is handled by AuthProvider, just redirect after successful login
    navigate('/dashboard', { replace: true });
  };
  
  const handleSandboxToggle = (enabled: boolean) => {
    // Sandbox toggle logic can be extended here
  };
  
  return <LazyLogin onSuccess={handleSuccess} onSandboxToggle={handleSandboxToggle} />;
}

/**
 * Network warning banner for testnet environments
 */
function NetworkBanner() {
  const { currentChain } = useWeb3();
  
  if (!currentChain.isTestnet) return null;

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="mb-6 overflow-hidden"
    >
      <div className="flex items-center justify-between p-3 px-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
        <div className="flex items-center gap-3">
          <AlertTriangle size={16} />
          <p className="text-[10px] font-black uppercase tracking-widest">
            Registry Warning: You are operating on <span className="underline">{currentChain.name}</span>. Sandbox mode active.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Loading fallback for lazy-loaded components
 */
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Main application shell with navigation
 */
function AppShell() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} onLogout={logout} />;
      case 'employees':
        return <Employees />;
      case 'payroll':
        return <BatchPay />;
      case 'automation':
        return <Automation />;
      case 'transactions':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveTab} onLogout={logout} />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex selection:bg-primary/20 transition-all duration-500",
      theme === 'dark' ? "dark text-white/70" : "text-zinc-900"
    )}>
      {/* Premium Background Effects */}
      <div className="noise-bg" />
      <div className="mesh-grid fixed inset-0 pointer-events-none opacity-[0.2] dark:opacity-[0.05]" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[140px] animate-pulse opacity-50 transition-all duration-1000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 dark:bg-accent/10 rounded-full blur-[140px] animate-pulse opacity-30 transition-all duration-1000" style={{ animationDelay: '3s' }} />
      </div>

      <Toaster position="top-right" theme={theme as any} toastOptions={{
        className: 'glass-card border-white/10 text-white dark:text-white',
      }} />
      
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />
      
      <div className="flex-1 flex flex-col md:ml-64 relative min-w-0">
        <TopBar onLogout={logout} />
        
        <main className="flex-1 pt-28 md:pt-32 px-4 md:px-10 pb-40 md:pb-20 max-w-7xl mx-auto w-full">
          <NetworkBanner />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

/**
 * Main application component with routing and authentication
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <Web3Provider>
            <NotificationProvider>
              <UserProvider>
                <OrgProvider>
                  <AutomationProvider>
                    <ApprovalProvider>
                      <AuthProvider>
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={
                            <PublicRoute>
                              <Suspense fallback={<PageLoader />}>
                                <LandingPageRoute />
                              </Suspense>
                            </PublicRoute>
                          } />
                          <Route path="/login" element={
                            <PublicRoute>
                              <Suspense fallback={<PageLoader />}>
                                <LoginRoute />
                              </Suspense>
                            </PublicRoute>
                          } />
                          
                          {/* Protected Routes */}
                          <Route path="/dashboard" element={
                            <ProtectedRoute>
                              <AppShell />
                            </ProtectedRoute>
                          } />
                          <Route path="/employees" element={
                            <ProtectedRoute>
                              <AppShell />
                            </ProtectedRoute>
                          } />
                          <Route path="/payroll" element={
                            <ProtectedRoute>
                              <AppShell />
                            </ProtectedRoute>
                          } />
                          <Route path="/automation" element={
                            <ProtectedRoute>
                              <AppShell />
                            </ProtectedRoute>
                          } />
                          <Route path="/transactions" element={
                            <ProtectedRoute>
                              <AppShell />
                            </ProtectedRoute>
                          } />
                          <Route path="/settings" element={
                            <ProtectedRoute>
                              <AppShell />
                            </ProtectedRoute>
                          } />
                          
                          {/* Catch all - redirect to dashboard */}
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </AuthProvider>
                    </ApprovalProvider>
                  </AutomationProvider>
                </OrgProvider>
              </UserProvider>
            </NotificationProvider>
          </Web3Provider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}
