import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Fingerprint, Mail, Wallet, RefreshCw, X, CheckCircle2, ChevronRight, Layout } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { useTheme } from './ThemeProvider';
import { NETWORKS } from '../constants';
import { useWeb3 } from './Web3Provider';
import { toast } from 'sonner';

type AuthStep = 'initial' | 'connecting' | 'success';

interface LoginProps {
  onSuccess: () => void;
  onSandboxToggle: (enabled: boolean) => void;
}

export default function Login({ onSuccess, onSandboxToggle }: LoginProps) {
  const { theme, toggleTheme } = useTheme();
  const { currentChain, setCurrentChain } = useWeb3();
  const [step, setStep] = useState<AuthStep>('initial');
  const [sandboxMode, setSandboxMode] = useState(true);
  const [showNetworkSelect, setShowNetworkSelect] = useState(false);
  const [isHoveringGoogle, setIsHoveringGoogle] = useState(false);

  // Filter networks to testnets only when in sandbox mode
  const testnetChains = NETWORKS.filter(n => n.isTestnet);
  
  useEffect(() => {
    if (sandboxMode && !currentChain.isTestnet) {
      setCurrentChain(testnetChains[0]);
    }
  }, [sandboxMode, currentChain, setCurrentChain, testnetChains]);

  const testnetsOnly = typeof testnetChains !== 'undefined' ? testnetChains : [];

  const handleConnect = () => {
    setStep('connecting');
    setTimeout(() => {
      setStep('success');
      toast.success('Wallet connected. Verification successful.', {
        icon: <ShieldCheck className="text-green-500" size={16} />
      });
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2000);
  };

  const handleToggleSandbox = () => {
    const newVal = !sandboxMode;
    setSandboxMode(newVal);
    onSandboxToggle(newVal);
    if (newVal) toast.info('Sandbox mode initialized. Operating in local registry.');
    else toast.warning('Warning: Operating in live mainnet environments.');
  };

  return (
    <div className={cn(
      "min-h-screen w-full flex items-center justify-center relative overflow-hidden transition-colors duration-500",
      theme === 'dark' ? "dark bg-zinc-950 text-white" : "bg-white text-zinc-900"
    )}>
      {/* Background Elements */}
      <div className="absolute inset-0 noise-bg" />
      <div className="mesh-grid fixed inset-0 pointer-events-none opacity-[0.2] dark:opacity-[0.05]" />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[140px] animate-pulse opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 dark:bg-accent/10 rounded-full blur-[140px] animate-pulse opacity-30" style={{ animationDelay: '3s' }} />
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 h-screen flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 z-10">
        
        {/* Left Side: Branding */}
        <div className="flex-1 flex flex-col justify-center max-w-lg mb-10 md:mb-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck size={32} className="text-white relative z-10" />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase dark:text-white">
              Enigma<span className="text-primary">Pay</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1] uppercase">
              Decentralized <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Payroll Protocol
              </span>
            </h1>
            <p className="text-base text-zinc-500 font-bold uppercase tracking-widest leading-relaxed max-w-md">
              Secure Web3 authentication gate. Connect your wallet or social account to inherit your organizational roles.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex items-center gap-4 text-zinc-400 font-bold text-[10px] uppercase tracking-widest"
          >
            <ShieldCheck size={16} /> Audited by CertiK
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <Fingerprint size={16} /> Zero-Knowledge Proofs
          </motion.div>
        </div>

        {/* Right Side: Login Component */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex-1 w-full max-w-md relative"
        >
          {/* Neon Glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-accent/30 rounded-[2.5rem] blur-xl opacity-50 dark:opacity-100" />
          
          <div className="relative rounded-[2rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl border border-black/10 dark:border-white/10 p-8 md:p-10 shadow-2xl overflow-hidden glass-card">
            
            {/* Header: Network & Theme Toggle */}
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-black/20 text-zinc-600 dark:text-zinc-300 text-[10px] uppercase font-black tracking-widest cursor-pointer hover:border-primary/50 transition-all group"
                onClick={() => sandboxMode && setShowNetworkSelect(!showNetworkSelect)}
              >
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  currentChain.isTestnet ? "bg-amber-500 animate-pulse" : "bg-green-500 animate-pulse"
                )} />
                {currentChain.name}
              </div>

              <div className="flex items-center gap-4">
                 <button 
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all bg-white dark:bg-black/20"
                >
                  <RefreshCw size={14} className={theme === 'dark' ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"} />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 'initial' && (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="relative z-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-2">Gate Access</h2>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Connect your unified identity</p>
                  </div>

                  <div className="space-y-4">
                    {/* Social Logic */}
                    <div className="space-y-3">
                      <button 
                        onClick={handleConnect}
                        onMouseEnter={() => setIsHoveringGoogle(true)}
                        onMouseLeave={() => setIsHoveringGoogle(false)}
                        className="w-full h-14 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-center gap-3 relative overflow-hidden transition-all hover:border-black/20 dark:hover:border-white/20 group"
                      >
                         {/* Optional hover effect inside social button */}
                         <div className={cn(
                           "absolute inset-0 bg-gradient-to-r from-blue-500/10 via-red-500/10 to-yellow-500/10 opacity-0 transition-opacity duration-300",
                           isHoveringGoogle ? "opacity-100" : ""
                         )} />
                        
                        <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="font-black text-xs uppercase tracking-widest text-zinc-800 dark:text-zinc-200 relative z-10">Continue with Google</span>
                      </button>

                      <button 
                        onClick={handleConnect}
                        className="w-full h-14 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-zinc-50 dark:hover:bg-white/5"
                      >
                        <Mail className="text-zinc-500 shrink-0" size={18} />
                        <span className="font-black text-xs uppercase tracking-widest text-zinc-800 dark:text-zinc-200">Continue with Email</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                       <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Or web3 wallet</span>
                       <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                    </div>

                    {/* Crypto Auth */}
                    <button 
                      onClick={handleConnect}
                      className="w-full h-14 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-between px-6 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 text-white"
                    >
                      <div className="flex items-center gap-3">
                         <Wallet size={18} />
                         <span className="font-black text-xs uppercase tracking-widest">Connect Wallet</span>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                       Powered by <span className="text-primary font-black">Privy</span> / <span className="text-primary font-black">Web3Auth</span>
                     </p>
                     
                     <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                          <input type="checkbox" className="sr-only" checked={sandboxMode} onChange={handleToggleSandbox} />
                          <div className={cn(
                            "w-8 h-4 rounded-full transition-colors",
                            sandboxMode ? "bg-amber-500" : "bg-black/10 dark:bg-white/10"
                          )} />
                          <div className={cn(
                             "absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform shadow-sm",
                             sandboxMode ? "translate-x-4" : "translate-x-0"
                          )} />
                        </div>
                        <span className={cn(
                           "text-[9px] font-black uppercase tracking-[0.2em] transition-colors",
                           sandboxMode ? "text-amber-500" : "text-zinc-500"
                        )}>Sandbox</span>
                     </label>
                  </div>
                </motion.div>
              )}

              {step === 'connecting' && (
                <motion.div
                  key="connecting"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center relative z-10"
                >
                  <div className="w-20 h-20 relative mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-black/5 dark:border-white/5 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                    <Fingerprint className="text-primary animate-pulse" size={32} />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2">Establishing Link</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Authenticating via {currentChain.name}...</p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center relative z-10"
                >
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                  >
                    <CheckCircle2 className="text-green-500" size={40} />
                  </motion.div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-green-500 mb-2">Connected</h3>
                  <p className="text-[10px] text-zinc-500 font-mono text-center tracking-widest break-all px-8">Root privileges inherited.</p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>

        {/* Network Selection Modal (Sandbox Mode Only) */}
        <AnimatePresence>
          {showNetworkSelect && sandboxMode && (
             <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-20 right-8 w-64 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-50 glass-card"
             >
                <div className="flex justify-between items-center mb-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Testnets</h4>
                   <button onClick={() => setShowNetworkSelect(false)} className="text-zinc-500 hover:text-white">
                     <X size={14} />
                   </button>
                </div>
                <div className="space-y-2">
                   {testnetsOnly.map(n => (
                      <button
                        key={n.id}
                        onClick={() => {
                          setCurrentChain(n);
                          setShowNetworkSelect(false);
                        }}
                        className={cn(
                           "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                           currentChain.id === n.id 
                             ? "bg-primary/10 border-primary/30" 
                             : "border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                      >
                         <div className={cn(
                            "w-2 h-2 rounded-full",
                            currentChain.id === n.id ? "bg-primary shadow-[0_0_10px_rgba(139,92,246,0.6)]" : "bg-zinc-600 group-hover:bg-zinc-400"
                         )} />
                         <span className={cn(
                            "text-[11px] font-black uppercase tracking-widest",
                            currentChain.id === n.id ? "text-primary" : "text-zinc-700 dark:text-zinc-300"
                         )}>
                            {n.name}
                         </span>
                      </button>
                   ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
