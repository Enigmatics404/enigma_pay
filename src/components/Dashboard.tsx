import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ArrowDown, 
  Plus, 
  Rocket, 
  Wallet, 
  Calendar, 
  Users,
  CheckCircle2,
  Clock,
  Zap,
  ShieldCheck,
  Users as UsersIcon,
  LogOut
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn, formatCurrency } from '../lib/utils';
import { MOCK_HISTORY } from '../constants';
import AnimatedCounter from './AnimatedCounter';

const chartData = [
  { name: 'Jul', value: 80 },
  { name: 'Aug', value: 95 },
  { name: 'Sep', value: 85 },
  { name: 'Oct', value: 120 },
  { name: 'Nov', value: 110 },
  { name: 'Dec', value: 185 },
];

import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useTheme } from './ThemeProvider';
import { useUser } from './UserProvider';
import { useApprovals } from './ApprovalProvider';

export default function Dashboard({ onNavigate, onLogout }: { onNavigate?: (tab: string) => void; onLogout?: () => void }) {
  const { theme } = useTheme();
  const { hasPermission, currentUser, team } = useUser();
  const { pendingApprovals, approveRun, executeRun } = useApprovals();

  const canExecute = hasPermission('execute_payroll');

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="relative z-10 w-full md:w-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-left leading-none uppercase">
            Intelligence <br className="hidden md:block"/><span className="text-accent">Overview</span>
          </h1>
          <p className="text-zinc-500 font-bold text-left text-xs uppercase tracking-widest max-w-sm leading-relaxed">Real-time payroll intelligence and asset distribution dynamics.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
          <Button 
            variant="outline"
            onClick={onLogout}
            className="flex-1 sm:flex-none border-red-500/20 text-red-500 hover:bg-red-500/10 bg-white/50 dark:bg-black/20 backdrop-blur-md"
            leftIcon={<LogOut size={16} />}
          >
            Logout
          </Button>
          <Button 
            variant="outline"
            onClick={() => onNavigate?.('automation')}
            className="flex-1 sm:flex-none border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md"
            leftIcon={<Calendar size={16} />}
          >
            Manage Schedule
          </Button>
          <Button 
            size="lg"
            onClick={() => onNavigate?.('payroll')}
            className={cn("flex-1 sm:flex-none btn-glow overflow-hidden relative group", !canExecute && "opacity-50 grayscale cursor-not-allowed")}
            leftIcon={canExecute ? <Rocket size={18} className="relative z-10" /> : <ShieldCheck size={18} className="relative z-10" />}
            disabled={!canExecute}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">{canExecute ? 'Run Payroll' : 'Restricted'}</span>
          </Button>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[150%] bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Treasury Balance" 
          value={2450000} 
          prefix="$"
          decimals={2}
          trend="+5.2%" 
          trendType="up" 
          icon={Wallet} 
          primary
        />
        <StatCard 
          label="Contract Balance" 
          value={425.82} 
          suffix=" ETH"
          decimals={2}
          subtext="Mainnet Ready ● v2.4" 
          icon={Rocket}
        />
        <StatCard 
          label="Security Pulse" 
          value="Secured" 
          subtext="OZE Verified Audited" 
          icon={Users}
          isSpecial
        />
        <StatCard 
          label="Recipients Active" 
          value={842} 
          subtext="Across 12 networks" 
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 p-6 md:p-10 flex flex-col glow-purple overflow-hidden relative group border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
            <TrendingUp size={160} />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <TrendingUp size={16} />
                </div>
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">Payroll Velocity</h3>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-11">Volume trend across all batches</p>
            </div>
            <div className="flex gap-2 p-1.5 bg-zinc-900/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 w-full md:w-auto">
              {['1M', '3M', 'YTD'].map((t) => (
                <button key={t} className={cn(
                  "flex-1 md:flex-none px-4 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all",
                  t === '3M' 
                    ? "accent-gradient text-white shadow-xl" 
                    : "text-zinc-500 dark:text-white/30 hover:text-zinc-800 dark:hover:text-white/60"
                )}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[300px] w-full relative z-10 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                  cursor={{ stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-card p-3 rounded-xl shadow-2xl">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">{payload[0].payload.name}</p>
                          <p className="text-sm font-black">${payload[0].value}K</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 md:p-8 flex flex-col border border-black/5 dark:border-white/5 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl shadow-premium lg:col-span-1">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                <UsersIcon size={16} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">Live Pulse</h3>
            </div>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </div>
          </div>
          
          <div className="space-y-3">
            {MOCK_HISTORY.slice(0, 5).map((item) => (
              <div key={item.id} className="group p-4 rounded-2xl border border-transparent hover:border-black/5 dark:hover:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:border-primary/20 transition-all">
                      {item.status === 'confirmed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate opacity-90">{item.batchId}</p>
                      <p className="text-[10px] text-zinc-500 font-mono tracking-tight">{item.network}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold whitespace-nowrap">-{formatCurrency(item.totalAmount)}</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-tighter">{item.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-auto border-black/5 dark:border-white/5 text-[10px] uppercase font-bold tracking-widest">
             View Immutable Logs
          </Button>
        </Card>

        {/* Consensus Verification Queue */}
        <Card className="lg:col-span-3 border border-black/5 dark:border-white/5 glass-card shadow-premium p-0 overflow-hidden bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl">
          <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 bg-zinc-900/5 dark:bg-white/[0.02] flex items-center justify-between backdrop-blur-md">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
              <ShieldCheck size={16} className="text-primary" />
              Consensus Verification Queue
            </h3>
            <span className="text-[9px] font-black tracking-widest uppercase bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 shadow-sm">
              {pendingApprovals.length} Pending Actions
            </span>
          </div>
          
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {pendingApprovals.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4 border border-black/5 dark:border-white/5">
                  <CheckCircle2 size={20} className="text-zinc-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Registry synchronized. No pending authorizations.</p>
              </div>
            ) : (
              pendingApprovals.map((run) => {
                const approvedCount = run.approvalInfo?.approvedBy.length || 0;
                const requiredCount = run.approvalInfo?.required || 1;
                const progress = (approvedCount / requiredCount) * 100;
                const hasApproved = run.approvalInfo?.approvedBy.includes(currentUser.id);
                const isReady = approvedCount >= requiredCount;

                return (
                  <div key={run.id} className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Clock size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-xs font-black uppercase tracking-tight">{run.batchId}</h4>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/5 text-[8px] font-black text-zinc-500 uppercase tracking-widest border border-black/5 dark:border-white/5">
                            {run.network}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          {run.recipientsCount} nodes • {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(run.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 max-w-md w-full">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                           <UsersIcon size={12} className="text-primary" />
                           {approvedCount} / {requiredCount} Signatures
                        </span>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          isReady ? "text-green-500" : "text-primary"
                        )}>
                          {Math.round(progress)}% Consensus
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-black/5 dark:border-white/5 overflow-hidden p-0.5">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${progress}%` }}
                           className={cn(
                             "h-full rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]",
                             isReady ? "bg-green-500 shadow-green-500/20" : "bg-primary"
                           )}
                         />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {team.filter(m => run.approvalInfo?.approvedBy.includes(m.id)).map((member) => (
                           <div key={member.id} className="px-2 py-1 rounded-md bg-zinc-900/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5 text-zinc-500">
                             <div className="w-1 h-1 rounded-full bg-green-500" />
                             {member.name}
                           </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {!isReady ? (
                        <Button 
                          size="sm" 
                          onClick={() => approveRun(run.id)}
                          disabled={hasApproved}
                          className={cn(
                            "w-full md:w-auto h-11 px-6 font-black text-[9px] uppercase tracking-widest transition-all",
                            hasApproved && "opacity-50 grayscale"
                          )}
                          leftIcon={hasApproved ? <CheckCircle2 size={14} /> : <Zap size={14} />}
                        >
                          {hasApproved ? 'Signed & Verified' : 'Authorize Sequence'}
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => executeRun(run.id)}
                          className="w-full md:w-auto h-11 px-6 font-black text-[9px] uppercase tracking-widest bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                          leftIcon={<Rocket size={14} />}
                        >
                          Execute Payload
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Sticky Mobile Action */}
      <div className="fixed bottom-28 left-6 right-6 z-30 md:hidden animate-in slide-in-from-bottom-8">
        <Button 
          size="lg" 
          disabled={!canExecute}
          className={cn(
            "w-full shadow-[0_20px_40px_rgba(139,92,246,0.3)] h-16 rounded-2xl glow-purple btn-glow text-xs uppercase tracking-[0.2em] font-black",
            !canExecute && "opacity-50 grayscale"
          )}
          leftIcon={canExecute ? <Zap size={18} /> : <ShieldCheck size={18} />}
        >
          {canExecute ? 'Execute Payroll' : 'Restricted Access'}
        </Button>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, trendType, icon: Icon, primary, subtext, isSpecial, prefix, suffix, decimals }: any) {
  return (
    <Card 
      isGlow={primary}
      className={cn(
        "p-6 relative overflow-hidden group border border-black/5 dark:border-white/5 transition-all hover:border-black/10 dark:hover:border-white/10 shadow-premium",
        isSpecial && "border-primary/20 bg-primary/5 dark:bg-primary/5"
      )}
    >
      <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-all transform group-hover:scale-110 group-hover:rotate-6">
        <Icon size={120} />
      </div>
      
      <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-4 font-black">{label}</div>
      
      <div className="text-4xl font-black tracking-tighter mb-4">
        {typeof value === 'number' ? (
          <AnimatedCounter value={value} prefix={prefix || ""} decimals={decimals} />
        ) : (
          value
        )}
        {suffix}
      </div>
      
      <div className="flex items-center gap-2">
        {trend && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full",
            trendType === 'up' ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
          )}>
            {trend}
          </span>
        )}
        {subtext && (
          <div className={cn(
            "text-[11px] font-medium tracking-tight",
            isSpecial ? "text-primary" : "text-zinc-500 dark:text-zinc-500"
          )}>
            {subtext}
          </div>
        )}
      </div>
    </Card>
  );
}
