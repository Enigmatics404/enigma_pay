import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Copy, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Trash2,
  Edit2,
  X,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { cn, truncateAddress, formatCurrency } from '../lib/utils';
import { MOCK_EMPLOYEES } from '../constants';
import { Employee } from '../types';
import { toast } from 'sonner';
import { useUser } from './UserProvider';
import { Shield } from 'lucide-react';

import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { Table } from './ui/Table';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [filter, setFilter] = useState('All Depts');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee> | null>(null);
  const { hasPermission } = useUser();

  const canManageRecipients = hasPermission('manage_recipients');

  const categories = ['All Depts', 'Engineering', 'Design', 'Product', 'Marketing'];

  const filteredEmployees = employees.filter(emp => {
    const matchesDept = filter === 'All Depts' || emp.department === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchLower) || 
      emp.walletAddress.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower) ||
      emp.department.toLowerCase().includes(searchLower) ||
      emp.roles.some(role => role.toLowerCase().includes(searchLower));
    return matchesDept && matchesSearch;
  });

  const handleDelete = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    toast.error('Member detached from registry');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      walletAddress: formData.get('wallet') as string,
      salary: Number(formData.get('salary')),
      tokenType: formData.get('tokenType') as string,
      department: formData.get('department') as string,
      roles: [formData.get('role') as string],
      status: 'active' as const,
    };

    if (currentEmployee?.id) {
      setEmployees(prev => prev.map(emp => emp.id === currentEmployee.id ? { ...emp, ...data } : emp));
      toast.success('Member updated successfully');
      setIsModalOpen(false);
      setCurrentEmployee(null);
    } else {
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            const newEmployee: Employee = {
              ...data,
              id: Math.random().toString(36).substr(2, 9),
            };
            setEmployees(prev => [...prev, newEmployee]);
            resolve(newEmployee);
          }, 1500);
        }),
        {
          loading: 'Synchronizing member with smart registry...',
          success: () => {
            setIsModalOpen(false);
            setCurrentEmployee(null);
            return 'Member indexed on-chain!';
          },
          error: 'Failed to add member',
        }
      );
    }
  };

  const openAddModal = () => {
    setCurrentEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    if (!canManageRecipients) return;
    setCurrentEmployee(emp);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">Member Lifecycle</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Team <span className="text-accent">Directory</span></h1>
          <p className="text-zinc-500 font-medium text-left">Manage on-chain identities, permission levels, and distribution logic.</p>
        </div>
        {canManageRecipients && (
          <Button 
            onClick={openAddModal}
            size="lg"
            className="hidden md:flex btn-glow"
            leftIcon={<Plus size={18} />}
          >
            Add Member
          </Button>
        )}
      </div>

      {employees.length === 0 ? (
        <Card className="p-12 md:p-20 flex flex-col items-center justify-center text-center border-dashed border-white/5 bg-white/[0.01]">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 animate-bounce">
            <UserPlus size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Registry is Empty</h2>
          <p className="text-zinc-500 max-w-sm mb-8">Start by indexing your first organization member into the EnigmaPay smart contract.</p>
          {canManageRecipients && (
            <Button 
              onClick={openAddModal}
              size="lg"
              rightIcon={<ArrowRight size={18} />}
            >
              Initiate Registry
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap gap-1 p-1 bg-zinc-900/5 dark:bg-zinc-900/40 rounded-xl border border-black/5 dark:border-white/5 w-full lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all",
                    filter === cat 
                      ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-lg" 
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white/60"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-primary" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter name, wallet, or dept..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 h-11 bg-zinc-900/5 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:border-primary/50 transition-all font-bold uppercase tracking-widest placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <Card className="hidden lg:block overflow-hidden p-0 border border-black/5 dark:border-white/5 glass-card shadow-premium">
            <Table headers={['Identity', 'Organization Unit', 'Infrastructure', 'Allocation', 'Lifecycle', '']}>
              {filteredEmployees.map((employee) => (
                <tr 
                  key={employee.id} 
                  className={cn(
                    "border-b border-black/5 dark:border-white/5 hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-colors group relative",
                    employee.status === 'inactive' && "opacity-40"
                  )}
                >
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-0.5 group-hover:border-primary/30 transition-all">
                        {employee.avatar ? (
                          <img src={employee.avatar} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="w-full h-full accent-gradient flex items-center justify-center text-white font-black text-xs rounded-lg">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold group-hover:text-primary transition-colors truncate opacity-90">{employee.name}</span>
                        <span className="text-zinc-500 dark:text-zinc-600 text-[10px] font-bold uppercase tracking-widest truncate">{employee.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-tighter">{employee.roles[0]}</span>
                      <span className="text-[10px] uppercase font-black tracking-[0.2em] text-primary/60">{employee.department}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-2 group/wallet cursor-pointer" onClick={() => {
                      navigator.clipboard.writeText(employee.walletAddress);
                      toast.success('Wallet Detached to Clipboard');
                    }}>
                      <span className="font-mono text-zinc-500 text-[11px] bg-black/5 dark:bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-black/5 dark:border-white/5 group-hover/wallet:border-primary/20 transition-all">
                        {truncateAddress(employee.walletAddress)}
                      </span>
                      <Copy size={12} className="text-zinc-400 dark:text-zinc-700 opacity-0 group-hover/wallet:opacity-100 hover:text-primary transition-all" />
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-black text-sm">{formatCurrency(employee.salary)}</span>
                      <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{employee.tokenType} per cycle</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        employee.status === 'active' ? "bg-green-500" : (employee.status === 'onboarding' ? "bg-primary" : "bg-red-500")
                      )} />
                      <span className={cn(
                        "text-[10px] uppercase font-black tracking-widest",
                        employee.status === 'active' && "text-green-600 dark:text-green-500/80",
                        employee.status === 'onboarding' && "text-primary/80",
                        employee.status === 'inactive' && "text-red-500/80"
                      )}>
                        {employee.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      {canManageRecipients ? (
                        <>
                          <button 
                            onClick={() => openEditModal(employee)}
                            className="p-2 text-zinc-600 hover:text-white transition-all rounded-lg hover:bg-white/5"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(employee.id)}
                            className="p-2 text-zinc-600 hover:text-red-500 transition-all rounded-lg hover:bg-white/5"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <div className="p-2 text-zinc-700">
                          <Shield size={14} />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            
            <div className="bg-white/[0.01] border-t border-white/5 px-8 py-4 flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600">
                Registry Index: {filteredEmployees.length} active nodes
              </span>
              <div className="flex items-center gap-4">
                <button className="p-2 text-zinc-600 hover:text-white transition-all disabled:opacity-20" disabled>
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[10px] font-black text-white px-3 py-1 rounded-md bg-white/5 border border-white/10 uppercase tracking-widest">Page 1</span>
                <button className="p-2 text-zinc-600 hover:text-white transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </Card>

          {/* Mobile Card List View */}
          <div className="lg:hidden space-y-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="p-5 flex flex-col gap-4 border border-black/5 dark:border-white/5 shadow-premium">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full accent-gradient flex items-center justify-center text-white font-bold text-sm">
                      {employee.avatar ? (
                        <img src={employee.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        employee.name.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold">{employee.name}</h4>
                      <p className="text-[10px] text-zinc-500 dark:text-white/30 uppercase tracking-widest font-bold">{employee.department} • {employee.roles[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditModal(employee)} className="p-2 text-zinc-400 dark:text-white/30"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(employee.id)} className="p-2 text-zinc-400 dark:text-white/30 active:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-black/5 dark:border-white/5">
                  <div>
                    <p className="text-[9px] text-zinc-500 dark:text-white/30 uppercase tracking-widest mb-1">Weekly Salary</p>
                    <p className="font-mono font-bold">{formatCurrency(employee.salary)} <span className="text-secondary text-[10px] ml-1">{employee.tokenType}</span></p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500 dark:text-white/30 uppercase tracking-widest mb-1">Status</p>
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[8px] uppercase font-bold tracking-widest border",
                      employee.status === 'active' && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
                      employee.status === 'onboarding' && "bg-primary/10 text-primary border-primary/20",
                      employee.status === 'inactive' && "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {employee.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-zinc-500 text-xs">{truncateAddress(employee.walletAddress)}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    navigator.clipboard.writeText(employee.walletAddress);
                    toast.success('Copied Address');
                  }} leftIcon={<Copy size={12} />}>
                    Copy
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Mobile FAB */}
          {canManageRecipients && (
            <div className="fixed bottom-24 right-6 z-30 md:hidden animate-in zoom-in duration-500 delay-300">
              <Button 
                size="lg" 
                className="w-16 h-16 rounded-full shadow-2xl shadow-primary/40 p-0"
                onClick={openAddModal}
              >
                <Plus size={32} />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentEmployee ? 'Update Member' : 'New Member'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 dark:text-white/40 tracking-widest mb-2 ml-1">Full Name</label>
              <input 
                required
                name="name"
                defaultValue={currentEmployee?.name}
                placeholder="e.g. John Doe"
                className="w-full h-14 bg-zinc-900/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 dark:text-white/40 tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                required
                type="email"
                name="email"
                defaultValue={currentEmployee?.email}
                placeholder="john@organization.com"
                className="w-full h-14 bg-zinc-900/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 dark:text-white/40 tracking-widest mb-2 ml-1">Wallet Address</label>
              <input 
                required
                name="wallet"
                defaultValue={currentEmployee?.walletAddress}
                placeholder="0x... or name.eth"
                className="w-full h-14 bg-zinc-900/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 text-sm font-mono focus:outline-none focus:border-primary transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 dark:text-white/40 tracking-widest mb-2 ml-1">Salary</label>
                <input 
                  required
                  type="number"
                  name="salary"
                  defaultValue={currentEmployee?.salary}
                  className="w-full h-14 bg-zinc-900/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 text-sm focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 dark:text-white/40 tracking-widest mb-2 ml-1">Token Type</label>
                <select 
                  name="tokenType"
                  defaultValue={currentEmployee?.tokenType || 'USDC'}
                  className="w-full h-14 bg-zinc-100 dark:bg-[#1A1A1A] border border-black/5 dark:border-white/10 rounded-2xl px-5 text-sm focus:outline-none focus:border-primary transition-all appearance-none"
                >
                  <option>USDC</option>
                  <option>USDT</option>
                  <option>ETH</option>
                  <option>DAI</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 dark:text-white/40 tracking-widest mb-2 ml-1">Department</label>
                <select 
                  name="department"
                  defaultValue={currentEmployee?.department || 'Engineering'}
                  className="w-full h-14 bg-zinc-100 dark:bg-[#1A1A1A] border border-black/5 dark:border-white/10 rounded-2xl px-5 text-sm focus:outline-none focus:border-primary transition-all appearance-none"
                >
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Product</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 dark:text-white/40 tracking-widest mb-2 ml-1">Role</label>
                <input 
                  required
                  name="role"
                  defaultValue={currentEmployee?.roles?.[0]}
                  placeholder="Sr. Developer"
                  className="w-full h-14 bg-zinc-900/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>
          <Button 
            type="submit" 
            size="lg" 
            className="w-full mt-2"
          >
            {currentEmployee ? 'Update Member' : 'Add to Organization'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
