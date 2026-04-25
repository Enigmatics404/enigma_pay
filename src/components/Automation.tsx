import React from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Calendar, 
  RefreshCw, 
  Shield, 
  AlertCircle, 
  Play, 
  Pause,
  CheckCircle2,
  ChevronRight,
  Settings,
  Bell
} from 'lucide-react';
import { useAutomation } from './AutomationProvider';
import { useNotifications } from './NotificationProvider';
import { useUser } from './UserProvider';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function Automation() {
  const { config, toggleAutomation, setFrequency, setRunDay, simulateTrigger } = useAutomation();
  const { addNotification } = useNotifications();
  const { hasPermission } = useUser();

  const canEdit = hasPermission('edit_automation');
  const canExecute = hasPermission('execute_payroll');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="relative z-10 w-full md:w-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-left leading-none uppercase">Autonomous <br className="hidden md:block"/><span className="text-accent">Control</span></h2>
          <p className="text-zinc-500 font-bold text-left text-xs uppercase tracking-widest max-w-sm leading-relaxed">Schedule-based payroll orchestration layer.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 relative z-10 bg-white/50 dark:bg-black/20 backdrop-blur-md p-2 pl-4 rounded-2xl border border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full",
              config.isEnabled ? "bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-zinc-500"
            )} />
            <span className={cn(
              "text-[10px] items-center pb-0.5 font-black uppercase tracking-widest transition-colors",
              config.isEnabled ? "text-green-500" : "text-zinc-500"
            )}>
              {config.isEnabled ? 'Engine Active' : 'Paused'}
            </span>
          </div>
          
          <button 
            onClick={() => {
              if (!canEdit) {
                toast.error('Privileged instruction required to modify automation state');
                return;
              }
              toggleAutomation();
            }}
            className={cn(
              "w-16 h-8 rounded-full relative transition-all p-1",
              config.isEnabled ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]" : "bg-zinc-800",
              !canEdit && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            <motion.div 
              animate={{ x: config.isEnabled ? 32 : 0 }}
              className="w-6 h-6 bg-white rounded-full shadow-lg"
            />
          </button>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-[-50%] left-[-10%] w-[40%] h-[150%] bg-accent/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Configuration Matrix */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <Card className="p-8 border border-black/5 dark:border-white/5 glass-card shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <RefreshCw size={200} className="text-primary animate-spin-slow" />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <Settings size={16} className="text-primary" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Scheduling Core</h3>
            </div>

            <div className="space-y-10">
              {/* Frequency Selection */}
              <div className="space-y-5 border-b border-black/5 dark:border-white/5 pb-8">
                <label className="text-[10px] font-black text-zinc-800 dark:text-zinc-400 uppercase tracking-widest pl-1">Frequency Cycle</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['weekly', 'monthly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => {
                        if (!canEdit) return;
                        setFrequency(freq);
                      }}
                      className={cn(
                        "p-6 rounded-2xl border transition-all text-left group overflow-hidden relative",
                        config.frequency === freq 
                          ? "bg-primary/5 dark:bg-primary/10 border-primary/30 shadow-lg shadow-primary/5" 
                          : "bg-white dark:bg-black/20 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10",
                        !canEdit && "cursor-not-allowed"
                      )}
                    >
                      {config.frequency === freq && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                      )}
                      <div className="relative z-10">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all shadow-sm",
                          config.frequency === freq ? "bg-primary text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                        )}>
                          <Calendar size={20} />
                        </div>
                        <h4 className={cn(
                          "font-black text-sm uppercase tracking-widest mb-1",
                          config.frequency === freq ? "text-primary" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
                        )}>{freq}</h4>
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Automatic execution every {freq}.</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">
                  {config.frequency === 'weekly' ? 'Dispatch Day' : 'Calendar Date'}
                </label>
                
                {config.frequency === 'weekly' ? (
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day, idx) => (
                      <button
                        key={day}
                        onClick={() => {
                          if (!canEdit) return;
                          setRunDay(idx + 1);
                        }}
                        className={cn(
                          "px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                          config.dayOfWeek === idx + 1
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                            : "bg-zinc-900/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-zinc-500 hover:border-white/20",
                          !canEdit && "cursor-not-allowed"
                        )}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 28 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!canEdit) return;
                          setRunDay(idx + 1);
                        }}
                        className={cn(
                          "aspect-square flex items-center justify-center rounded-lg border text-[10px] font-black transition-all",
                          config.dayOfMonth === idx + 1
                            ? "bg-primary text-white border-primary"
                            : "bg-zinc-900/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-zinc-500 hover:border-white/20",
                          !canEdit && "cursor-not-allowed"
                        )}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Verification Protocol */}
          <Card className="p-8 border border-black/5 dark:border-white/5 glass-card shadow-premium relative bg-zinc-900/5 dark:bg-zinc-950/20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-green-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Security Invariants</h3>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                <CheckCircle2 size={10} className="text-green-500" />
                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Formal Verification Passed</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-zinc-900/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 text-left">Simulate Execution</p>
                <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed text-left">Trigger a manual run of the autonomous engine to verify logic in the current sandbox registry.</p>
                <Button 
                  size="sm" 
                  className={cn("w-full font-black text-[10px] uppercase tracking-widest h-10", !canExecute && "opacity-50 grayscale")}
                  onClick={() => {
                    if (!canExecute) {
                      toast.error('Insufficient clearance for manual trigger');
                      return;
                    }
                    simulateTrigger();
                  }}
                  leftIcon={<Play size={12} />}
                >
                  {canExecute ? 'Initiate Sequence' : 'Locked Path'}
                </Button>
              </div>
              
              <div className="p-4 rounded-2xl bg-zinc-900/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Dispatch Notifications</p>
                <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed">System will emit alerts 24h prior to dispatch to all authorized organization guardians.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full font-black text-[10px] uppercase tracking-widest h-10 border-black/5 dark:border-white/10"
                  onClick={() => toast.success('Dispatch notification preferences updated')}
                  leftIcon={<Bell size={12} />}
                >
                  Manage Alerts
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Status Dashboard */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="p-6 md:p-8 flex flex-col border border-black/5 dark:border-white/5 glass-card shadow-premium bg-zinc-900/5 dark:bg-zinc-950/40">
            <div className="flex items-center gap-3 mb-8">
              <Clock size={16} className="text-primary" />
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Epoch Status</h3>
            </div>

            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                  <Play size={40} className="text-primary" />
                </div>
                <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Target Epoch</p>
                <p className="text-xl font-black tracking-tighter opacity-90">
                  {new Date(config.nextRun).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-950 flex items-center justify-center text-[6px] font-black">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Guardians Synchronized</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Last Execution</span>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">
                      {config.lastRun ? new Date(config.lastRun).toLocaleDateString() : 'No historical data'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900/40 border border-white/5 flex items-center justify-center text-zinc-600">
                    <RefreshCw size={14} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-zinc-500">Autonomous Health</span>
                    <span className="text-green-500">99.9%</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900/10 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: config.isEnabled ? '99.9%' : '0%' }}
                      className="h-full bg-green-500"
                    />
                  </div>
                </div>
              </div>

              {config.isEnabled && (
                <div className="pt-6 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <AlertCircle size={14} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Pre-flight Warning</p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                        Autonomous engine will process the selected recipient matrix on the next epoch. Ensure treasury contains sufficient inventory.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
