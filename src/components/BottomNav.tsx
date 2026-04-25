import React from 'react';
import { motion } from 'motion/react';
import { Home, Users, Zap, History, LayoutDashboard, Settings, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'employees', icon: Users, label: 'Nodes' },
    { id: 'payroll', icon: Zap, label: 'Dispatch' },
    { id: 'automation', icon: Clock, label: 'Auto' },
    { id: 'transactions', icon: History, label: 'Audit' },
    { id: 'settings', icon: Settings, label: 'System' },
  ];

  return (
    <div className="fixed bottom-6 left-6 right-6 md:hidden z-40">
      <nav className="h-16 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/5 dark:border-white/10 flex items-center justify-around px-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                isActive ? "text-primary" : "text-zinc-500"
              )}>
                <Icon size={20} strokeWidth={isActive ? 3 : 2} className={cn("transition-transform", isActive && "scale-110")} />
              </div>
              <span className={cn(
                "text-[7px] font-black uppercase tracking-[0.2em]",
                isActive ? "text-white" : "text-zinc-600"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-bottom-indicator"
                  className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
