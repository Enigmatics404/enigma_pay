import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Code, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Globe,
  Activity,
  ArrowUpDown,
  ChevronDown,
  FileDown
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { MOCK_HISTORY } from '../constants';
import { toast } from 'sonner';

import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Table } from './ui/Table';

type SortKey = 'date' | 'totalAmount' | 'recipientsCount' | 'batchId';
type SortOrder = 'asc' | 'desc';

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({ key: 'date', order: 'desc' });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 dark:text-green-500/80 bg-green-500/5 border-green-500/10';
      case 'pending': return 'text-primary bg-primary/5 border-primary/10';
      case 'failed': return 'text-red-600 dark:text-red-500/80 bg-red-500/5 border-red-500/10';
      default: return 'text-zinc-500 bg-zinc-900/5 dark:bg-white/5 border-black/5 dark:border-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'failed': return <XCircle size={12} />;
      default: return null;
    }
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const filteredAndSortedHistory = useMemo(() => {
    let result = MOCK_HISTORY.filter(item => {
      const matchesSearch = item.batchId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.network.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.recipients && item.recipients.some(name => name.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return sortConfig.order === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [searchQuery, statusFilter, sortConfig]);

  const exportToCSV = () => {
    const headers = ['Batch ID', 'Date', 'Network', 'Recipients', 'Amount', 'Status', 'TX Hash'];
    const rows = filteredAndSortedHistory.map(item => [
      item.batchId,
      item.date,
      item.network,
      item.recipientsCount,
      item.totalAmount,
      item.status,
      item.txHash
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `payroll_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Export Initiated');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">Immutable Ledger</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Audit <span className="text-accent">Log</span></h1>
          <p className="text-zinc-500 font-medium">Transparent, cryptographic record of all organizational dispatch sequences.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="uppercase tracking-[0.2em] font-black text-[9px] h-10 border-black/5 dark:border-white/5 bg-zinc-900/5 dark:bg-zinc-900/50"
            leftIcon={<Download size={14} />}
            onClick={exportToCSV}
          >
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="uppercase tracking-[0.2em] font-black text-[9px] h-10 border-black/5 dark:border-white/5 bg-zinc-900/5 dark:bg-zinc-900/50"
            leftIcon={<FileDown size={14} />}
            onClick={() => {
              toast.info('Generating PDF Report...');
              setTimeout(() => toast.success('PDF Export Complete'), 1500);
            }}
          >
            Report PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Metric label="Aggregate Volume" value="$2.4M" trend="+12.4%" />
        <Metric label="Sequence Count" value="142" />
        <Metric label="Total Nodes" value="845" />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text"
            placeholder="Search by ID, Registry, or Hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-zinc-900/5 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl border border-black/5 dark:border-white/5">
            {['All', 'Confirmed', 'Pending', 'Failed'].map((status) => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 h-10 rounded-xl text-[9px] uppercase font-black tracking-widest transition-all",
                  statusFilter === status 
                    ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-lg" 
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white/60"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block overflow-hidden p-0 border border-black/5 dark:border-white/5 glass-card shadow-premium">
        <Table headers={[
          <SortableHeader label="Sequence ID" active={sortConfig.key === 'batchId'} order={sortConfig.order} onClick={() => handleSort('batchId')} />,
          <SortableHeader label="Timestamp" active={sortConfig.key === 'date'} order={sortConfig.order} onClick={() => handleSort('date')} />,
          'Registry', 
          <SortableHeader label="Nodes" active={sortConfig.key === 'recipientsCount'} order={sortConfig.order} onClick={() => handleSort('recipientsCount')} />,
          <SortableHeader label="Quantized Volume" active={sortConfig.key === 'totalAmount'} order={sortConfig.order} onClick={() => handleSort('totalAmount')} />,
          'Lifecycle', 
          ''
        ]}>
          {filteredAndSortedHistory.map((item) => (
            <React.Fragment key={item.id}>
              <tr 
                className={cn(
                  "border-b border-black/5 dark:border-white/5 hover:bg-zinc-900/5 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer",
                  expandedId === item.id && "bg-zinc-900/5 dark:bg-white/[0.04]"
                )}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <td className="py-6 px-8 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center text-primary group-hover:border-primary/30 transition-all p-2">
                    <FileText size={16} />
                  </div>
                  <span className="font-black text-xs uppercase tracking-tight group-hover:text-primary transition-colors opacity-90">{item.batchId}</span>
                </td>
                <td className="py-6 px-8">
                  <div className="flex flex-col">
                    <span className="text-zinc-500 dark:text-zinc-400 font-bold text-[11px]">{item.date}</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">UTC-0 System Time</span>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <span className="px-2.5 py-1 bg-zinc-100 dark:bg-white/[0.03] rounded-lg border border-black/5 dark:border-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                    {item.network}
                  </span>
                </td>
                <td className="py-6 px-8 text-center text-zinc-500 dark:text-zinc-400 font-black text-xs tracking-widest">{item.recipientsCount}</td>
                <td className="py-6 px-8 text-right font-mono font-black text-sm">{formatCurrency(item.totalAmount)}</td>
                <td className="py-6 px-8">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] uppercase font-black tracking-[0.2em]",
                    getStatusColor(item.status)
                  )}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </div>
                  {item.approvalInfo && item.status === 'pending' && (
                    <div className="mt-2 flex items-center gap-2">
                       <div className="w-16 h-1 bg-zinc-900/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(item.approvalInfo.approvedBy.length / item.approvalInfo.required) * 100}%` }} 
                          />
                       </div>
                       <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">
                         {item.approvalInfo.approvedBy.length}/{item.approvalInfo.required} SIGS
                       </span>
                    </div>
                  )}
                </td>
                <td className="py-6 px-8 text-right">
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      "text-zinc-400 mx-auto transition-transform duration-300",
                      expandedId === item.id && "rotate-180"
                    )} 
                  />
                </td>
              </tr>
              <AnimatePresence>
                {expandedId === item.id && (
                  <tr>
                    <td colSpan={7} className="p-0 border-b border-black/5 dark:border-white/5 bg-zinc-900/[0.02] dark:bg-white/[0.01]">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-8 grid md:grid-cols-3 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Protocol Details</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-zinc-400">HASH</span>
                                <span className="text-[10px] font-mono text-zinc-600 truncate max-w-[150px]">{item.txHash}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-zinc-400">NODES</span>
                                <span className="text-[10px] font-mono text-zinc-600">{item.recipientsCount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-zinc-400">REGISTRY</span>
                                <span className="text-[10px] font-mono text-zinc-600">{item.network}</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-[9px] uppercase tracking-widest font-black h-9 border-black/5 dark:border-white/10"
                              leftIcon={<ExternalLink size={12} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://etherscan.io/tx/${item.txHash}`, '_blank');
                              }}
                            >
                              View on Explorer
                            </Button>
                          </div>

                          <div className="space-y-4 col-span-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Recipient Matrix (Sample)</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.recipients?.map((name, i) => (
                                <div key={i} className="px-3 py-1.5 rounded-lg bg-zinc-900/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[9px] font-bold flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-primary" />
                                  {name}
                                </div>
                              ))}
                              {item.recipientsCount > (item.recipients?.length || 0) && (
                                <div className="px-3 py-1.5 rounded-lg bg-zinc-900/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[9px] font-bold text-zinc-500">
                                  + {item.recipientsCount - (item.recipients?.length || 0)} more recipients
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </Table>

        {filteredAndSortedHistory.length === 0 && (
          <div className="py-20 text-center">
            <Search size={40} className="mx-auto text-zinc-800 mb-4 opacity-20" />
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">No matching sequences found</p>
          </div>
        )}

        <div className="px-8 py-4 bg-zinc-900/5 dark:bg-white/[0.01] border-t border-black/5 dark:border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-600 uppercase tracking-widest">
            {filteredAndSortedHistory.length} Record(s) indexed
          </span>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-all disabled:opacity-20" disabled>
              <ChevronLeft size={16} />
            </button>
            <span className="text-[10px] font-black px-3 py-1 rounded-md bg-zinc-100 dark:bg-white/5 border border-black/5 dark:border-white/10 uppercase tracking-widest">Page 1</span>
            <button className="p-2 text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>

      {/* Mobile History View */}
      <div className="md:hidden space-y-4">
        {filteredAndSortedHistory.map((item) => (
          <Card key={item.id} className="p-5 border border-black/5 dark:border-white/10 active:scale-[0.98] transition-all shadow-premium">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold tracking-tight opacity-90">{item.batchId}</h4>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{item.date}</p>
                </div>
              </div>
              <div className={cn(
                "px-2 py-1 rounded-lg border text-[8px] uppercase font-bold tracking-widest",
                getStatusColor(item.status)
              )}>
                {item.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-black/5 dark:border-white/5 my-4">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Recipients</p>
                <p className="text-sm font-bold opacity-80">{item.recipientsCount}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Total</p>
                <p className="text-sm font-bold font-mono">{formatCurrency(item.totalAmount)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Globe size={12} className="text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.network}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-[10px] uppercase tracking-widest border-black/5 dark:border-white/10"
                onClick={() => window.open(`https://etherscan.io/tx/${item.txHash}`, '_blank')}
                rightIcon={<ExternalLink size={12} />}
              >
                Explorer
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SortableHeader({ label, active, order, onClick }: { label: string; active: boolean; order: SortOrder; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 hover:text-primary transition-colors uppercase tracking-[0.2em] text-[9px] font-black">
      {label}
      <ArrowUpDown size={10} className={cn("transition-opacity", active ? "opacity-100" : "opacity-20")} />
    </button>
  );
}

function Metric({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="relative glass rounded-3xl p-6 overflow-hidden border border-black/5 dark:border-white/10 shadow-premium bg-zinc-900/5 dark:bg-white/5">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Activity size={20} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">{trend}</span>
        )}
      </div>
      <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 mb-1">{label}</p>
      <div className="text-3xl font-bold tracking-tighter opacity-90">{value}</div>
    </div>
  );
}
