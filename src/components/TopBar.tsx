import React, { useState } from 'react';
import { Search, Bell, Settings, Sun, Moon, Wallet, ChevronDown, LogOut, User, Shield, Activity, Globe, Zap, Check, X, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useWeb3 } from './Web3Provider';
import { useNotifications } from './NotificationProvider';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { NETWORKS } from '../constants';

import { Button } from './ui/Button';

export default function TopBar({ onLogout }: { onLogout?: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const { currentChain, setCurrentChain } = useWeb3();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  
  const handleConnect = () => {
    if (isConnected) {
      setIsWalletMenuOpen(!isWalletMenuOpen);
    } else {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)),
        {
          loading: 'Connecting to MetaMask...',
          success: () => {
            setIsConnected(true);
            return 'Wallet connected successfully!';
          },
          error: 'Connection rejected',
        }
      );
    }
  };

  return (
    <header className={cn(
      "fixed top-0 right-0 left-0 md:left-64 h-16 md:h-20 z-30 transition-all duration-500 backdrop-blur-xl flex items-center justify-between px-4 md:px-8",
      theme === 'dark' ? "bg-zinc-950/40 border-b border-white/5" : "bg-white/60 border-b border-black/5"
    )}>
      {/* Search - Refined Technical Search */}
      <div className="flex-1 max-w-xl hidden sm:block">
        <div className="relative group">
          <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-all" size={14} />
          <input 
            type="text" 
            placeholder="Search audit logs, recipients, or batch IDs..."
            className={cn(
              "w-full pl-11 pr-4 py-2.5 rounded-xl border transition-all text-xs font-medium uppercase tracking-wider",
              theme === 'dark' 
                ? "bg-zinc-900/50 border-white/5 text-white placeholder:text-zinc-600 focus:border-primary/50 focus:bg-zinc-900" 
                : "bg-zinc-50 border-zinc-200 text-black focus:border-primary"
            )}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] text-zinc-500 font-black">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] text-zinc-500 font-black">K</kbd>
          </div>
        </div>
      </div>

      {/* Brand icon for mobile only */}
      <div className="md:hidden flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl accent-gradient flex items-center justify-center shadow-lg shadow-primary/20">
          <Zap size={18} className="text-white" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Network Switcher */}
        <div className="relative hidden md:block">
          <button 
            onClick={() => setIsNetworkMenuOpen(!isNetworkMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/5 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 hover:bg-zinc-900/10 dark:hover:bg-zinc-900 transition-all group"
          >
            <div className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              currentChain.isTestnet ? "bg-amber-500" : "bg-accent"
            )} />
            <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-[0.2em]">{currentChain.name}</span>
            <ChevronDown size={12} className={cn("text-zinc-500 transition-transform", isNetworkMenuOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isNetworkMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNetworkMenuOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-3 w-48 glass-card rounded-2xl p-1 shadow-premium z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-black/5 dark:border-white/5 mb-1">
                    <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Switch Registry</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto technical-scrollbar">
                    {NETWORKS.map((chain) => (
                      <button
                        key={chain.id}
                        onClick={() => {
                          setCurrentChain(chain);
                          setIsNetworkMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all",
                          currentChain.id === chain.id 
                            ? "bg-primary/10 text-primary" 
                            : "text-zinc-500 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1 h-1 rounded-full",
                            chain.isTestnet ? "bg-amber-500" : "bg-accent"
                          )} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{chain.name}</span>
                        </div>
                        {currentChain.id === chain.id && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center h-10 px-1 rounded-xl bg-zinc-900/5 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
          <button 
            onClick={() => theme !== 'light' && toggleTheme()}
            className={cn(
              "px-3 h-8 rounded-lg flex items-center justify-center transition-all",
              theme === 'light' ? "bg-white text-primary shadow-lg" : "text-zinc-500 hover:text-white"
            )}
          >
            <Sun size={14} />
          </button>
          <button 
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={cn(
              "px-3 h-8 rounded-lg flex items-center justify-center transition-all",
              theme === 'dark' ? "bg-zinc-900 text-primary shadow-lg" : "text-zinc-500 hover:text-black dark:hover:text-white"
            )}
          >
            <Moon size={14} />
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900/5 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all relative group"
          >
            <Bell size={18} className="group-hover:rotate-12 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-4 ring-white dark:ring-[#0A0A0A]" />
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 glass-card rounded-2xl p-0 shadow-premium z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-zinc-900/5 dark:bg-white/[0.02]">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dispatch Alerts</h3>
                    <div className="flex gap-4">
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-[9px] font-black uppercase text-primary hover:underline"
                        >
                          Acknowledge All
                        </button>
                      )}
                      <button 
                        onClick={clearAll}
                        className="text-[9px] font-black uppercase text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto technical-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <Bell size={24} className="mx-auto text-zinc-800 mb-2 opacity-20" />
                        <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">No active alerts</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                          }}
                          className={cn(
                            "w-full text-left p-4 border-b border-black/5 dark:border-white/5 hover:bg-zinc-900/5 dark:hover:bg-white/[0.03] transition-all relative group",
                            !n.isRead && "bg-primary/[0.02]"
                          )}
                        >
                          {!n.isRead && (
                            <div className="absolute top-5 left-2 w-1 h-1 rounded-full bg-primary" />
                          )}
                          <div className="flex gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              n.type === 'success' && "bg-green-500/10 text-green-500",
                              n.type === 'error' && "bg-red-500/10 text-red-500",
                              n.type === 'warning' && "bg-amber-500/10 text-amber-500",
                              n.type === 'info' && "bg-primary/10 text-primary",
                            )}>
                              {n.type === 'success' && <CheckCircle2 size={16} />}
                              {n.type === 'error' && <X size={16} />}
                              {n.type === 'warning' && <AlertTriangle size={16} />}
                              {n.type === 'info' && <Info size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black uppercase text-zinc-900 dark:text-white truncate">{n.title}</p>
                              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-[8px] font-mono text-zinc-600 uppercase mt-2">{new Date(n.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="p-3 bg-zinc-900/5 dark:bg-white/[0.01]">
                    <button className="w-full py-2 rounded-xl border border-black/5 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-all">
                      View Audit Registry
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <Button 
            variant={isConnected ? "outline" : "primary"}
            size="sm"
            onClick={handleConnect}
            className={cn(
              "font-black h-10 px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all",
              isConnected 
                ? "border-black/5 dark:border-white/5 bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900 hover:border-primary/20" 
                : "btn-glow"
            )}
            leftIcon={isConnected ? <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> : <Wallet size={14} />}
            rightIcon={isConnected ? <ChevronDown size={14} className={cn("transition-transform opacity-40", isWalletMenuOpen && "rotate-180")} /> : null}
          >
            {isConnected ? '0x71...f92a' : 'Engage'}
          </Button>

          <AnimatePresence>
            {isWalletMenuOpen && isConnected && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-60 glass-card rounded-2xl p-2 shadow-premium z-50 overflow-hidden"
              >
                <div className="px-4 py-4 border-b border-black/5 dark:border-white/5 mb-2 bg-zinc-900/5 dark:bg-white/[0.03] rounded-t-xl">
                  <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Treasury Core</p>
                  <p className="text-xl font-black tracking-tighter">425.82 <span className="text-primary">ETH</span></p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400/80 uppercase tracking-widest">Mainnet Ready</span>
                  </div>
                </div>
                <div className="p-1 space-y-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-900/5 dark:hover:bg-white/5 text-[11px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-left">
                    <User size={14} /> Organization
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-900/5 dark:hover:bg-white/5 text-[11px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-left">
                    <Shield size={14} /> Hardened Auth
                  </button>
                  <div className="h-px bg-black/5 dark:bg-white/5 my-1 mx-2" />
                  <button 
                    onClick={() => {
                      setIsConnected(false);
                      setIsWalletMenuOpen(false);
                      toast.info('Session Terminated');
                      onLogout?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-500/10 text-[11px] uppercase tracking-widest font-black text-red-600 dark:text-red-500/80 transition-all text-left"
                  >
                    <LogOut size={14} /> Terminate
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
