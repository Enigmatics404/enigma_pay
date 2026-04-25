import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  History, 
  FileText, 
  HelpCircle, 
  Zap,
  ChevronRight,
  Clock,
  LogOut
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  const { theme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'employees', label: 'Recipients', icon: Users },
    { id: 'payroll', label: 'Distributions', icon: Zap },
    { id: 'automation', label: 'Autonomous', icon: Clock },
    { id: 'transactions', label: 'Audit Log', icon: History },
    { id: 'settings', label: 'Organization', icon: CreditCard },
  ];

  return (
    <aside className={cn(
      "hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r transition-all duration-500 z-40 overflow-hidden",
      theme === 'dark' ? "bg-zinc-950 border-white/5" : "bg-white border-black/5"
    )}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none opacity-50 transition-opacity duration-1000" />
      <div className="noise-bg" />
      {/* Brand */}
      <div className="h-20 flex items-center px-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl accent-gradient flex items-center justify-center p-2 shadow-lg shadow-primary/20">
            <svg viewBox="0 0 24 24" fill="none" className="text-white w-full h-full" stroke="currentColor" strokeWidth="3">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter">ENIGMAPAY</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-8 space-y-1">
        <div className="px-4 mb-4 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Management</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest relative group",
                isActive 
                  ? "bg-zinc-900/5 dark:bg-white/5 text-zinc-900 dark:text-white" 
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white/80 hover:bg-zinc-900/5 dark:hover:bg-white/[0.02]"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-4 bg-primary rounded-r-full"
                />
              )}
              <Icon size={16} className={cn("transition-transform group-hover:scale-110", isActive ? "text-primary" : "opacity-50")} />
              {item.label}
              {item.id === 'payroll' && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Status & Profile */}
      <div className="p-4 space-y-4">
        <div className="p-4 rounded-2xl bg-zinc-900/5 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Network Load</div>
            <div className="text-[10px] font-mono text-primary font-bold">12 Gwei</div>
          </div>
          <div className="w-full h-1 bg-zinc-900/5 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-primary rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          </div>
        </div>

        <div className="p-3 flex items-center gap-3 rounded-2xl bg-zinc-900/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:bg-zinc-900/10 dark:hover:bg-white/[0.05] transition-all group">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5 overflow-hidden flex items-center justify-center p-1 group-hover:border-primary/30 transition-all">
            <div className="w-full h-full accent-gradient rounded-lg flex items-center justify-center text-white font-black text-xs">AD</div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate opacity-90">Adriel Putra</p>
            <p className="text-[10px] text-zinc-500 font-mono truncate">0x71...f92a</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLogout?.();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors bg-white/5"
            title="Terminate Session"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
