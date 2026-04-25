import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Zap, 
  X,
  Search,
  Users,
  Activity,
  ChevronDown,
  Coins
} from 'lucide-react';
import { cn, formatCurrency, truncateAddress } from '../lib/utils';
import { MOCK_EMPLOYEES, TOKENS } from '../constants';
import { toast } from 'sonner';
import { useWeb3 } from './Web3Provider';
import { useNotifications } from './NotificationProvider';
import { useUser } from './UserProvider';
import { useApprovals } from './ApprovalProvider';
import { useOrg } from './OrgProvider';

import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { Table } from './ui/Table';

export default function BatchPay() {
  const { currentChain, selectedToken, setSelectedToken, gasPrice } = useWeb3();
  const { addNotification } = useNotifications();
  const { hasPermission, team } = useUser();
  const { requestApproval } = useApprovals();
  const { getEstimatedTax } = useOrg();
  const [selected, setSelected] = useState<string[]>(MOCK_EMPLOYEES.filter(e => e.status !== 'inactive').map(e => e.id));
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);

  const canExecute = hasPermission('execute_payroll');

  const overhead = useMemo(() => {
    // Dynamic gas estimation based on selected recipients and network
    const baseFee = gasPrice * 0.5;
    const perRecipientFee = gasPrice * 0.15;
    return baseFee + (selected.length * perRecipientFee);
  }, [selected.length, gasPrice]);

  const totalPayload = useMemo(() => {
    return MOCK_EMPLOYEES
      .filter(e => selected.includes(e.id))
      .reduce((acc, curr) => acc + curr.salary, 0);
  }, [selected]);

  const estimatedTax = useMemo(() => {
    return getEstimatedTax(totalPayload);
  }, [totalPayload, getEstimatedTax]);

  const toggleSelect = (id: string) => {
    if (!hasPermission('manage_recipients')) return;
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (!hasPermission('manage_recipients')) return;
    if (selected.length === MOCK_EMPLOYEES.length) {
      setSelected([]);
    } else {
      setSelected(MOCK_EMPLOYEES.map(e => e.id));
    }
  };

  const handleExecute = () => {
    if (!canExecute) {
      toast.error('Insufficient clearance level for payroll execution');
      return;
    }
    if (selected.length === 0) {
      toast.error('Identity selection required');
      return;
    }
    setIsConfirming(true);
  };

  const confirmPayment = () => {
    setIsConfirming(false);
    
    const batchId = `BATCH-${Math.floor(Math.random() * 9000) + 1000}`;
    const totalPayload = selected.reduce((acc, id) => {
      const emp = MOCK_EMPLOYEES.find(e => e.id === id);
      return acc + (emp?.salary || 0);
    }, 0);

    requestApproval({
      batchId,
      date: new Date().toISOString().split('T')[0],
      network: currentChain.name,
      recipientsCount: selected.length,
      totalAmount: totalPayload,
      recipients: selected.map(id => MOCK_EMPLOYEES.find(e => e.id === id)?.name || 'Unknown')
    });

    toast.info('Consensus request initiated. Awaiting node authorization.');
    setSelected([]);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button className="text-zinc-600 hover:text-white transition-all flex items-center gap-2 font-black uppercase text-[9px] tracking-[0.3em] mb-4 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dispatch Console
          </button>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
              Batch <span className="text-accent">#4092</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Draft Stage
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-500/5 border border-green-500/20 text-green-500/80 text-[10px] uppercase font-black tracking-widest">
                <ShieldCheck size={12} />
                Verified
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right px-4 border-r border-black/5 dark:border-white/5">
            <div className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Network Logic</div>
            <div className="text-xs font-bold flex items-center gap-2 justify-end">
              <div className={cn("w-1 h-1 rounded-full", currentChain.isTestnet ? "bg-amber-500" : "bg-green-500")} />
              {currentChain.name}
            </div>
          </div>
          <Button 
            size="lg" 
            onClick={handleExecute}
            disabled={selected.length === 0 || isSending || !canExecute}
            className={cn("btn-glow px-8", !canExecute && "opacity-50 cursor-not-allowed grayscale")}
            leftIcon={canExecute ? <Zap size={18} /> : <ShieldCheck size={18} />}
          >
            {canExecute ? 'Dispatch Batch' : 'Restricted Access'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Recipient List */}
        <Card className="col-span-12 lg:col-span-8 overflow-hidden p-0 border border-black/5 dark:border-white/5 glass-card shadow-premium">
          <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-zinc-900/5 dark:bg-white/[0.01]">
            <div className="flex flex-col">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 text-left">Recipient Matrix</h3>
              <p className="text-[9px] font-mono text-zinc-600 uppercase mt-0.5 text-left">Automated Multi-Address Dispatch</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:inline">
                {selected.length} / {MOCK_EMPLOYEES.length} Node(s) Selected
              </span>
              {hasPermission('manage_recipients') && (
                <button 
                  onClick={toggleSelectAll}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-zinc-800 dark:hover:text-white transition-colors"
                >
                  {selected.length === MOCK_EMPLOYEES.length ? 'Clear All' : 'Select All'}
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[600px] technical-scrollbar">
            <Table headers={[hasPermission('manage_recipients') ? '' : null, 'Identity Node', 'Target Allocation', 'Status'].filter(Boolean) as string[]}>
              {MOCK_EMPLOYEES.map((employee) => {
                const isSelected = selected.includes(employee.id);
                const isExcluded = employee.status === 'inactive';
                const canManage = hasPermission('manage_recipients');
                return (
                   <tr 
                     key={employee.id} 
                     onClick={() => !isExcluded && canManage && toggleSelect(employee.id)}
                     className={cn(
                       "border-b border-black/5 dark:border-white/5 transition-all group relative",
                       !isExcluded && canManage && "cursor-pointer",
                       !isSelected && "bg-black/5 dark:bg-black/20 text-zinc-500 dark:text-zinc-600",
                       isExcluded && "opacity-20 cursor-not-allowed grayscale"
                     )}
                   >
                     {canManage && (
                      <td className="py-4 px-8 w-12 text-left">
                        <div className={cn(
                          "w-5 h-5 rounded-md border transition-all flex items-center justify-center",
                          isSelected ? "bg-primary border-primary shadow-[0_0_10px_rgba(139,92,246,0.3)]" : "border-black/10 dark:border-zinc-800 bg-white/50 dark:bg-black/40"
                        )}>
                          {isSelected && <Check size={12} className="text-white" strokeWidth={4} />}
                        </div>
                      </td>
                     )}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hidden sm:flex group-hover:border-primary/30 transition-all p-0.5">
                          {employee.avatar ? (
                            <img src={employee.avatar} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="w-full h-full accent-gradient flex items-center justify-center text-white font-black text-[10px] rounded-lg">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold group-hover:text-primary transition-colors text-xs uppercase tracking-tight opacity-90">{employee.name}</p>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">{truncateAddress(employee.walletAddress)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-mono font-black text-sm">{formatCurrency(employee.salary)}</span>
                        <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-600 uppercase tracking-widest">{employee.tokenType || 'USDC'} Node</span>
                      </div>
                    </td>
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1 h-1 rounded-full",
                          isSelected ? "bg-green-500 animate-pulse" : "bg-zinc-300 dark:bg-zinc-800"
                        )} />
                        <span className={cn(
                          "text-[9px] uppercase font-black tracking-widest",
                          isSelected ? "text-green-600 dark:text-green-500/80" : "text-zinc-500 dark:text-zinc-600"
                        )}>
                          {isExcluded ? 'Omit' : (isSelected ? 'Pending' : 'Standby')}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </Table>
          </div>
        </Card>

        {/* Distribution Summary */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="p-6 md:p-8 flex flex-col flex-1 border border-black/5 dark:border-white/5 glass-card shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={80} className="text-primary rotate-12" />
            </div>

            <div className="flex items-center gap-2 mb-8">
              <Activity size={14} className="text-primary" />
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Payroll Orchestration</h3>
            </div>

            {/* Token Selector UI */}
            <div className="space-y-4 mb-8">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Currency Layer</label>
              <div className="relative">
                <button 
                  onClick={() => setIsTokenSelectorOpen(!isTokenSelectorOpen)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900/5 dark:bg-black/40 border border-black/5 dark:border-white/10 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center text-white shadow-xl shadow-primary/20">
                      <Coins size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-widest leading-none">{selectedToken.symbol}</p>
                      <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase">Bal: {selectedToken.balance}</p>
                    </div>
                  </div>
                  <ChevronDown size={14} className={cn("text-zinc-600 transition-transform", isTokenSelectorOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isTokenSelectorOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsTokenSelectorOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute left-0 right-0 mt-2 p-2 glass-card rounded-2xl border border-black/5 dark:border-white/10 shadow-premium z-50 space-y-1"
                      >
                        {TOKENS.map((token) => (
                          <button
                            key={token.id}
                            onClick={() => {
                              setSelectedToken(token);
                              setIsTokenSelectorOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                              selectedToken.id === token.id 
                                ? "bg-primary/10 text-primary border border-primary/20" 
                                : "text-zinc-500 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-xs font-black uppercase tracking-widest">{token.symbol}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[9px] font-black uppercase">{token.balance}</div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                  <span>Batch Volume</span>
                  <span className="font-mono">{formatCurrency(totalPayload)} <span className="text-primary">{selectedToken.symbol}</span></span>
                </div>
                <div className="w-full h-1 bg-zinc-900/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: selected.length > 0 ? `${(selected.length / MOCK_EMPLOYEES.length) * 100}%` : '0%' }}
                    className="h-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estimated Gas</span>
                    <span className="text-[8px] font-mono text-zinc-600 uppercase">Registry: {currentChain.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold opacity-80">+${overhead.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estimated Tax</span>
                  </div>
                  <span className="text-xs font-mono font-bold opacity-80">${estimatedTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-zinc-500">Dispatch Security</span>
                  <span className="text-green-600 dark:text-green-500/80 flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    Verified
                  </span>
                </div>
                <div className="pt-4 flex flex-col gap-1">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Total On-Chain Commit</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tighter">
                      {formatCurrency(totalPayload + estimatedTax + overhead)}
                    </span>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Incl. Est. Tax</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-zinc-900/5 dark:bg-black/20 border border-black/5 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle size={10} className="text-zinc-500" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">Legal Logic</span>
              </div>
              <p className="text-[8px] font-medium leading-relaxed text-zinc-500 uppercase">
                THIS IS AN ESTIMATE ONLY. TAX LIABILITY IS CALCULATED BASED ON REGIONAL PROTOCOLS. VERIFY LOCAL REGULATIONS BEFORE DISPATCH.
              </p>
            </div>

            <Button 
              className="mt-10 hidden md:flex btn-glow py-8" 
              size="lg"
              onClick={handleExecute}
              disabled={selected.length === 0 || isSending}
            >
              Authorize Transaction
            </Button>
          </Card>

          <div className="p-5 rounded-2xl border border-yellow-500/5 bg-yellow-500/[0.02] flex items-start gap-4">
            <AlertCircle className="text-yellow-500/60 shrink-0" size={16} />
            <p className="text-[10px] text-yellow-500/60 uppercase font-black tracking-widest leading-loose">
              Security Notice: Finalize all audits before dispatch. On-chain actions are immutable.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <Card className="max-w-md w-full rounded-[40px] p-10 text-center border-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 accent-gradient opacity-5 animate-pulse" />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-20 h-20 rounded-full accent-gradient flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40"
              >
                <Check size={40} className="text-white" strokeWidth={3} />
              </motion.div>
              <h2 className="text-3xl font-black mb-4 tracking-tighter">BATCH SENT!</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Payroll execution for {selected.length} members has been broadcasted to {currentChain.name}.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => setIsSuccess(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Close
                </Button>
                <Button className="w-full">
                  Explorer Details
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isConfirming} 
        onClose={() => setIsConfirming(false)}
        title="Payment Review"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Selected Members</span>
                <span className="text-xl font-mono font-black text-white">{selected.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Total Amount</span>
                <span className="text-xl font-mono font-black text-white">{formatCurrency(totalPayload)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Estimated Tax</span>
                <span className="text-sm font-mono text-zinc-300 font-bold">${estimatedTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Network Fee</span>
                <span className="text-sm font-mono text-primary font-bold">~${overhead.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm font-bold text-accent uppercase tracking-widest">Total Commitment</span>
                <span className="text-2xl font-mono font-black text-white">{formatCurrency(totalPayload + estimatedTax + overhead)}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-yellow-400/10 rounded-2xl border border-yellow-400/20 text-yellow-400">
              <AlertCircle size={24} className="shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tight mb-1">Blockchain Invariant</p>
                <p className="text-xs leading-relaxed opacity-80">
                  Transactions on-chain are irreversible. Funds will be immutable once broadcast.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
            <Button 
              variant="outline"
              onClick={() => setIsConfirming(false)}
              className="h-14"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmPayment}
              className="h-14"
              rightIcon={<Zap size={16} />}
            >
              Sign & Pay
            </Button>
          </div>
        </div>
      </Modal>

      {/* Sticky Mobile Action */}
      <div className="fixed bottom-24 left-6 right-6 z-30 md:hidden animate-in slide-in-from-bottom-8">
        <Button 
          size="lg" 
          className="w-full shadow-2xl shadow-primary/40 h-16 rounded-2xl"
          onClick={handleExecute}
          disabled={selected.length === 0 || isSending}
          leftIcon={<Zap size={20} />}
        >
          Review & Execute ({selected.length})
        </Button>
      </div>
    </div>
  );
}
