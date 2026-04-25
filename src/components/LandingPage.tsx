import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Zap, 
  Shield, 
  Users, 
  Globe, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Clock,
  Lock, 
  Eye, 
  Layers, 
  RefreshCw,
  BarChart3,
  Moon,
  Sun,
  Layout,
  Cpu,
  Fingerprint,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useTheme } from './ThemeProvider';

interface LandingPageProps {
  onLaunch: () => void;
  onTrySandbox: () => void;
}

export default function LandingPage({ onLaunch, onTrySandbox }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeModal, setActiveModal] = useState<{ title: string, content: string } | null>(null);


  const burnData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 61000 },
    { month: 'May', amount: 55000 },
    { month: 'Jun', amount: 67000 },
  ];

  const distributionData = [
    { name: 'Engineering', value: 45, color: '#8B5CF6' },
    { name: 'Design', value: 20, color: '#D946EF' },
    { name: 'Marketing', value: 15, color: '#3B82F6' },
    { name: 'Product', value: 20, color: '#10B981' },
  ];

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-700 overflow-x-hidden",
      theme === 'dark' ? "bg-[#0D0D0D] text-white" : "bg-zinc-50 text-zinc-900"
    )}>
      {/* Background Visuals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className={cn(
          "absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[160px] opacity-20 animate-pulse transition-all duration-1000",
          theme === 'dark' ? "bg-primary/30" : "bg-primary/10"
        )} />
        <div className={cn(
          "absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[160px] opacity-15 animate-pulse transition-all duration-1000",
          theme === 'dark' ? "bg-accent/30" : "bg-accent/10"
        )} style={{ animationDelay: '3s' }} />
        <div className="mesh-grid absolute inset-0 opacity-[0.1] dark:opacity-[0.03]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 dark:border-white/5 backdrop-blur-2xl px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">ENIGMAPAY</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          <a href="#features" className="hover:text-primary transition-all">Logic</a>
          <a href="#how-it-works" className="hover:text-primary transition-all">Protocol</a>
          <a href="#security" className="hover:text-primary transition-all">Security</a>
          <a href="#analytics" className="hover:text-primary transition-all">Intelligence</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl border border-black/5 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all text-zinc-500"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button 
            variant="ghost" 
            className="hidden sm:flex border border-black/5 dark:border-white/10"
            onClick={onTrySandbox}
          >
            Sandbox
          </Button>
          <Button 
            className="btn-glow px-6"
            onClick={onLaunch}
          >
            Launch App
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 md:pt-56 pb-24 px-6 md:px-12 text-center max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
           whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            V0.4.2 Mainnet Protocol Active
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            Automate <span className="gradient-text">Payroll</span> for <br className="hidden md:block" /> Your Web3 Team
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Send salaries in seconds, manage teams globally, and track payments transparently on-chain with our multi-send salary smart contract.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button size="lg" className="h-16 px-10 rounded-2xl text-base btn-glow w-full sm:w-auto" onClick={onLaunch}>
              Launch App <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button size="lg" variant="ghost" className="h-16 px-10 rounded-2xl text-base border-black/5 dark:border-white/10 w-full sm:w-auto" onClick={onTrySandbox}>
              Try Sandbox (No Wallet)
            </Button>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mt-24 relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-75 -z-10 animate-pulse" />
          <div className="relative rounded-3xl md:rounded-[2rem] border border-black/10 dark:border-white/10 bg-zinc-950 md:backdrop-blur-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] aspect-auto md:aspect-[16/9] min-h-[500px]">
             
             {/* High-Fidelity Mock Dashboard UI */}
             <div className="absolute inset-0 p-4 md:p-8 flex flex-col gap-6 md:gap-8 font-sans text-white pointer-events-none bg-gradient-to-br from-zinc-900/50 to-black/80">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/10 pb-4 md:pb-6">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                       <Layout size={20} className="text-white" />
                     </div>
                     <div>
                       <h3 className="text-base md:text-xl font-black uppercase tracking-widest text-white mb-1">Protocol Interface</h3>
                       <p className="text-[8px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed max-w-[200px] md:max-w-none">Real-time salary distribution and multi-chain liquidity management dashboard</p>
                     </div>
                   </div>
                   <div className="hidden sm:flex gap-3">
                      <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        System Live
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                         <Globe size={16} className="text-zinc-400" />
                      </div>
                   </div>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                   {[
                     { label: "Treasury Liquidity", value: "$4.2M", diff: "+12.4%" },
                     { label: "Active Nodes", value: "142", diff: "Strict" },
                     { label: "Next Epoch", value: "48h", diff: "Scheduled" },
                     { label: "Burn Rate", value: "64k/mo", diff: "-2.1%" },
                   ].map((stat, i) => (
                     <div key={i} className="p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                        <p className="text-[9px] md:text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                          <p className="text-lg md:text-2xl font-mono font-bold tracking-tight">{stat.value}</p>
                          <span className={cn("text-[9px] font-black tracking-widest uppercase", i === 0 || i === 3 ? "text-green-500" : "text-zinc-400")}>{stat.diff}</span>
                        </div>
                     </div>
                   ))}
                </div>
                
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                   {/* Chart Area */}
                   <div className="flex-[2] rounded-2xl bg-white/[0.02] border border-white/5 p-4 md:p-6 flex flex-col relative overflow-hidden backdrop-blur-md">
                      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Zap size={120} />
                      </div>
                      <div className="flex justify-between items-center mb-6 relative z-10">
                         <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Liquidity Distribution Trend</h4>
                         <div className="flex gap-2">
                            <div className="w-6 h-1.5 rounded-full bg-primary/50" />
                            <div className="w-6 h-1.5 rounded-full bg-accent/50" />
                         </div>
                      </div>
                      <div className="flex-1 w-full relative min-h-[100px] md:min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={burnData}>
                               <defs>
                                  <linearGradient id="colorPrimaryPulse" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                                     <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <Area 
                                 type="monotone" 
                                 dataKey="amount" 
                                 stroke="#8B5CF6" 
                                 strokeWidth={3}
                                 fillOpacity={1} 
                                 fill="url(#colorPrimaryPulse)" 
                               />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                   
                   {/* Side Panel */}
                   <div className="flex-1 hidden md:flex flex-col gap-6">
                      <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/5 p-6 backdrop-blur-md">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Execution Queue</h4>
                         <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                               <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                       <Cpu size={16} className={i === 1 ? "text-accent" : "text-zinc-500"} />
                                    </div>
                                    <div>
                                       <p className="text-[11px] font-black uppercase tracking-tight text-zinc-200">Batch TX-{i}9X</p>
                                       <p className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">Pending consensus</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-sm font-mono font-bold text-white">$12.4k</p>
                                 </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Ticker */}
      <div className="border-y border-black/5 dark:border-white/5 py-12 bg-black/20 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-12 group">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-primary transition-colors">Smart Contract Verified</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-primary transition-colors">Cross-Chain Ready</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-primary transition-colors">Decentralized Auth</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-primary transition-colors">Multisig Secured</span>
            </div>
          ))}
        </div>
      </div>

      {/* Problems & Solutions */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">The Genesis Problem</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Legacy Payroll is a <br /> Web3 Bottleneck</h2>
            <div className="space-y-8">
              {[
                { icon: Clock, title: "Time Loss", desc: "Manual transfers are slow, error-prone, and unsustainable for scaling DAOs." },
                { icon: Globe, title: "Global Friction", desc: "Cross-border fees and banking latency eat into employee compensation." },
                { icon: Eye, title: "Opacity", desc: "Traditional payroll offers zero transparency for on-chain stakeholders." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-[100px] -z-10 rounded-full" />
            <div className="glass-card rounded-[2rem] p-12 border border-primary/20 bg-primary/5">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4 block">The Enigma Solution</span>
              <h3 className="text-3xl font-black mb-8 leading-tight">Autonomous Distribution Logic</h3>
              <ul className="space-y-6">
                {[
                  "Batch dispatch to 100+ nodes in 1 tx",
                  "Automated smart contract triggers",
                  "Real-time on-chain transparency",
                  "Multi-token distribution protocols"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold text-zinc-300">
                    <CheckCircle2 size={18} className="text-primary" />
                    {text}
                  </li>
                ))}
              </ul>
              <Button className="mt-10 btn-glow w-full" onClick={onLaunch}>Switch to Autopilot</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-black/40 border-y border-white/5 relative">
        <div className="absolute inset-0 mesh-grid opacity-[0.02]" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Engine Core</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Protocol Capabilities</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Layers, title: "Multi-Token", desc: "Support for all ERC-20 tokens and native gas assets." },
              { icon: RefreshCw, title: "Automation", desc: "Schedule payroll sequences with smart execution engines." },
              { icon: Shield, title: "Multisig Auth", desc: "Secure multi-governance approval for fund distribution." },
              { icon: Users, title: "Identity Hub", desc: "On-chain role management and employee registry." },
              { icon: BarChart3, title: "Intelligence", desc: "Real-time analytics for burn rate and allocation." },
              { icon: Globe, title: "Cross-Chain", desc: "Deploy payroll logic across multiple L1 and L2 networks." },
              { icon: Lock, title: "Privacy Ops", desc: "Zero-knowledge proofs for sensitive transaction meta-data." },
              { icon: Cpu, title: "Smart Invoices", desc: "Request-to-pay logic for global contractor management." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full group hover:border-primary/50 transition-all border-white/5 bg-white/[0.02] p-8 flex flex-col gap-6">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                    <f.icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-2">{f.title}</h4>
                    <p className="text-zinc-500 text-[11px] leading-normal">{f.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Sequence Protocol</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Onboarding Flow</h2>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-800 hidden lg:block -translate-y-1/2 -z-10" />
          
          <div className="grid lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { step: "01", icon: Fingerprint, title: "Sync Wallet", desc: "Connect your organization node to the Enigma gateway." },
              { step: "02", icon: Users, title: "Add Nodes", desc: "Input employee wallet addresses into the secure registry." },
              { step: "03", icon: BarChart3, title: "Set Logic", desc: "Define salary allocations, tokens, and payment frequencies." },
              { step: "04", icon: Rocket, title: "Run Payload", desc: "Broadcast payment sequences to the global network." }
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="w-20 h-20 rounded-3xl bg-[#0D0D0D] border-2 border-zinc-800 flex items-center justify-center mx-auto mb-8 text-primary shadow-xl group hover:border-primary transition-all">
                  <s.icon size={32} />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 px-3 py-1 rounded bg-primary text-white text-[10px] font-black tracking-widest">
                  {s.step}
                </div>
                <h4 className="text-lg font-black uppercase tracking-widest mb-2">{s.title}</h4>
                <p className="text-zinc-500 text-xs leading-relaxed max-w-[180px] mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sandbox Demo CTA */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <Card className="rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border-black/10 dark:border-white/10 bg-zinc-900/10 dark:bg-white/[0.02]">
           <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-radial-gradient from-primary/10 to-transparent -z-10" />
           <Layout size={48} className="mx-auto mb-8 text-primary" />
           <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Try Before You <span className="text-accent">Execute</span></h2>
           <p className="text-zinc-500 text-lg max-w-2xl mx-auto mb-12">
             Access our gas-less sandbox environment. Simulate complex payroll sequences, test multisig logic, and explore automation without spending a single wei.
           </p>
           <Button size="lg" className="h-16 px-12 rounded-2xl btn-glow text-lg" onClick={onTrySandbox}>
             Enter Sandbox Protocol
           </Button>
        </Card>
      </section>

      {/* Security Section */}
      <section id="security" className="py-32 px-6 md:px-12 bg-zinc-900/5 dark:bg-[#080808] border-y border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Security Layer</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Impenetrable Trust Architecture</h2>
              <p className="text-zinc-500 mb-12 leading-relaxed">
                EnigmaPay is built on the principle of maximum security. Every transaction is a signed cryptographic proof verified by decentralized networks.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { title: "Secure", icon: Shield },
                   { title: "Verified", icon: CheckCircle2 },
                   { title: "Immutable", icon: Lock },
                   { title: "Transparent", icon: Eye }
                 ].map((badge, i) => (
                   <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
                      <badge.icon size={20} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{badge.title}</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="relative p-12">
               <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
               <div className="relative w-full aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-[15%] border border-accent/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_80px_rgba(139,92,246,0.3)]">
                     <Lock size={64} className="text-white" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section id="analytics" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">On-Chain Intelligence</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Real-Time Data Streams</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <Card className="p-8 border-black/5 dark:border-white/10 bg-zinc-900/10 dark:bg-white/[0.02] flex flex-col gap-6">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Burn Rate Dynamics</h3>
                    <p className="text-xl font-bold">$67,240 <span className="text-[10px] text-green-500">+12.4%</span></p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <BarChart3 size={18} />
                 </div>
              </div>
              <div className="h-[240px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={burnData}>
                       <defs>
                          <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis 
                         dataKey="month" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 10, fill: theme === 'dark' ? '#52525b' : '#a1a1aa', fontWeight: 900 }} 
                         dy={10}
                       />
                       <Tooltip 
                         contentStyle={{ 
                           backgroundColor: theme === 'dark' ? '#0d0d0d' : '#ffffff', 
                           borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                           borderRadius: '12px',
                           fontSize: '10px',
                           fontWeight: '900',
                           textTransform: 'uppercase'
                         }} 
                       />
                       <Area 
                         type="monotone" 
                         dataKey="amount" 
                         stroke="var(--color-primary)" 
                         strokeWidth={3}
                         fillOpacity={1} 
                         fill="url(#colorBurn)" 
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <Card className="p-8 border-black/5 dark:border-white/10 bg-zinc-900/10 dark:bg-white/[0.02] flex flex-col gap-6">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Allocation Strategy</h3>
                    <p className="text-xl font-bold">DAO Diversity Index</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <Users size={18} />
                 </div>
              </div>
              <div className="flex-1 flex items-center justify-center h-[240px]">
                 <div className="h-full w-full max-w-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={distributionData}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={8}
                             dataKey="value"
                          >
                             {distributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                             ))}
                          </Pie>
                          <Tooltip 
                             contentStyle={{ 
                               backgroundColor: theme === 'dark' ? '#0d0d0d' : '#ffffff', 
                               borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                               borderRadius: '12px',
                               fontSize: '10px',
                               fontWeight: '900'
                             }} 
                          />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex flex-col gap-3 ml-4">
                    {distributionData.map((item, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.name}</span>
                          <span className="text-[10px] font-black text-zinc-400 ml-auto">{item.value}%</span>
                       </div>
                    ))}
                 </div>
              </div>
           </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 text-center px-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85]">
            Start Paying Your <br /> Team <span className="gradient-text">Smarter</span>
          </h2>
          <p className="text-zinc-500 text-lg mb-12 max-w-xl mx-auto">
            Join the decentralized payroll revolution. Scalable, secure, and fully automated.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="h-16 px-12 rounded-2xl btn-glow text-lg w-full sm:w-auto" onClick={onLaunch}>
              Launch Protocol <Rocket size={20} className="ml-2" />
            </Button>
            <Button size="lg" variant="ghost" className="h-16 px-12 rounded-2xl text-lg border-white/10 w-full sm:w-auto" onClick={onTrySandbox}>
              Try Sandbox
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/5 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">ENIGMAPAY</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Global Web3 payroll infrastructure. Built for the era of sovereign work and autonomous organizations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24 w-full md:w-auto">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Protocol</h4>
              <ul className="space-y-4 text-sm font-bold text-zinc-500">
                <li><button onClick={() => setActiveModal({ title: 'Documentation', content: 'Comprehensive guides, protocol specifications, and technical documentation for the EnigmaPay system.' })} className="hover:text-primary transition-colors text-left">Documentation</button></li>
                <li><button onClick={() => setActiveModal({ title: 'Smart Contract', content: 'Immutable multi-send contract addresses and verified source code on Etherscan.' })} className="hover:text-primary transition-colors text-left">Smart Contract</button></li>
                <li><button onClick={() => setActiveModal({ title: 'Network Status', content: 'All systems operational. RPC nodes and indexers are fully synced.' })} className="hover:text-primary transition-colors text-left">Network Status</button></li>
                <li><button onClick={() => setActiveModal({ title: 'Security Audit', content: 'Latest security audit reports by industry-leading firms (CertiK, Trail of Bits).' })} className="hover:text-primary transition-colors text-left">Security Audit</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Organization</h4>
              <ul className="space-y-4 text-sm font-bold text-zinc-500">
                <li><button onClick={() => setActiveModal({ title: 'Github', content: 'Explore our open-source repositories, SDKs, and contribute to the protocol.' })} className="hover:text-primary transition-colors text-left">Github</button></li>
                <li><button onClick={() => setActiveModal({ title: 'Discord', content: 'Join the EnigmaPay developer community and governance discussions.' })} className="hover:text-primary transition-colors text-left">Discord</button></li>
                <li><button onClick={() => setActiveModal({ title: 'X / Twitter', content: 'Follow @EnigmaPay for real-time updates and protocol announcements.' })} className="hover:text-primary transition-colors text-left">X / Twitter</button></li>
                <li><button onClick={() => setActiveModal({ title: 'Contact', content: 'Get in touch with our partnerships and enterprise support team.' })} className="hover:text-primary transition-colors text-left">Contact</button></li>
              </ul>
            </div>
            <div className="hidden sm:block">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-bold text-zinc-500">
                <li><button onClick={() => setActiveModal({ title: 'Privacy Policy', content: 'Learn how we secure your data and maintain confidentiality.' })} className="hover:text-primary transition-colors text-left">Privacy</button></li>
                <li><button onClick={() => setActiveModal({ title: 'Terms of Service', content: 'General terms and conditions for utilizing the EnigmaPay interface and protocol.' })} className="hover:text-primary transition-colors text-left">Terms</button></li>
                <li><button onClick={() => setActiveModal({ title: 'License', content: 'MIT License. Open and permissionless.' })} className="hover:text-primary transition-colors text-left">License</button></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">© 2026 Enigma Protocol System. All Rights Reserved.</p>
          <div className="flex gap-8">
             <Globe size={18} className="text-zinc-600" />
             <Fingerprint size={18} className="text-zinc-600" />
             <Cpu size={18} className="text-zinc-600" />
          </div>
        </div>
      </footer>

      {/* Modern Pop-up Modal */}
      <AnimatePresence>
        {activeModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setActiveModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-6"
            >
              <div className="bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-20%] w-[120%] h-[150%] bg-radial-gradient from-primary/10 to-transparent -z-10 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Globe size={24} />
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <h3 className="text-2xl font-black tracking-tight mb-4">{activeModal.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-bold mb-8">
                  {activeModal.content}
                </p>
                
                <Button 
                  className="w-full h-12 font-black text-xs uppercase tracking-widest rounded-xl"
                  onClick={() => setActiveModal(null)}
                >
                  Acknowledge
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Rocket(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.81.2-2.55L4.5 16.5Z" />
      <path d="M15 7s-4-4-7 1c-1.37 2.31-2 5-2 5l10 10s2.69-.63 5-2c5-3 1-7 1-7Z" />
      <path d="m14 10 2 2" />
      <path d="M9 15l2 2" />
      <path d="M18 4l2 2" />
    </svg>
  );
}
