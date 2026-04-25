import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  CreditCard, 
  ChevronRight, 
  Moon, 
  Sun, 
  Users, 
  UserPlus, 
  Trash2, 
  Mail,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useUser } from './UserProvider';
import { useOrg } from './OrgProvider';
import { cn } from '../lib/utils';
import { AppRole } from '../types';
import { toast } from 'sonner';
import { Globe, AlertCircle } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, team, inviteMember, removeMember, updateMemberRole, hasPermission } = useUser();
  const { settings, updateSettings } = useOrg();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AppRole>('employer');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMember(inviteEmail, inviteRole);
    setInviteEmail('');
    toast.success(`Invite sent to ${inviteEmail}`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="relative z-10 w-full">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-left leading-none uppercase">Organization <br className="hidden md:block"/><span className="text-secondary dark:text-accent">Settings</span></h1>
          <p className="text-zinc-500 font-bold text-left text-xs uppercase tracking-widest max-w-sm leading-relaxed">Manage dispatch protocols, security thresholds, and system preferences.</p>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[150%] bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {hasPermission('manage_team') && (
            <Card className="p-0 overflow-hidden border border-black/5 dark:border-white/5 glass-card shadow-premium bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl">
              <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 bg-zinc-900/5 dark:bg-white/[0.02]">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                   <Globe size={16} className="text-primary" />
                   Regional Protocol
                </h3>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Organization Region</label>
                  <div className="relative">
                    <select 
                      value={settings.region}
                      onChange={(e) => updateSettings({ region: e.target.value })}
                      className="w-full h-12 bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl px-4 pr-10 text-xs font-bold tracking-widest text-zinc-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none transition-all cursor-pointer shadow-sm"
                    >
                      <option value="us">United States (15% Tax Estimation)</option>
                      <option value="uk">United Kingdom (20% Tax Estimation)</option>
                      <option value="eu">European Union (22% Tax Estimation)</option>
                      <option value="sg">Singapore (7% Tax Estimation)</option>
                      <option value="global">Global Standard (10% Tax Estimation)</option>
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none rotate-90" />
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                    <AlertCircle size={16} className="text-amber-600 dark:text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-1">Tax Estimation Awareness</p>
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-500 font-bold leading-relaxed uppercase tracking-wider">
                      Tax rates shown are estimated averages. Actual liability depends on local regulations, employee specific nexus, and treaty status. 
                      <span className="text-amber-600 dark:text-amber-400 font-black ml-1 block mt-1">THIS IS AN ESTIMATE ONLY.</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Team Management - Only for Owner/Admin */}
          {hasPermission('manage_team') && (
            <Card className="p-0 overflow-hidden border border-black/5 dark:border-white/5 glass-card shadow-premium bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl">
              <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 bg-zinc-900/5 dark:bg-white/[0.02] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                  <Users size={16} className="text-primary" />
                  Fleet Authority Registry
                </h3>
                <span className="text-[9px] font-black tracking-[0.2em] uppercase text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full shadow-sm">
                  {team.length} Active Nodes
                </span>
              </div>

              <div className="p-8 border-b border-black/5 dark:border-white/5 bg-zinc-900/5 dark:bg-zinc-950/20">
                <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input 
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter fleet member email..."
                      className="w-full h-12 bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <select 
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as AppRole)}
                      className="w-full md:w-auto h-12 bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl px-4 pr-10 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none transition-all cursor-pointer shadow-sm min-w-[140px]"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="finance">Finance</option>
                      <option value="employer">Employer</option>
                    </select>
                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none rotate-90" />
                  </div>
                  <Button type="submit" className="h-12 px-8 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20" leftIcon={<UserPlus size={14} />}>
                    Invite Node
                  </Button>
                </form>
              </div>

              <div className="divide-y divide-black/5 dark:divide-white/5 overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-black/5 dark:bg-white/[0.02]">
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Identity</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Auth Role</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {team.map((member) => (
                      <tr key={member.id} className="group hover:bg-black/5 dark:hover:bg-white/[0.01] transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] uppercase border border-primary/20 shadow-sm">
                              {member.name.slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">{member.name}</p>
                              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <div className="relative inline-block w-full max-w-[120px] mx-auto group/select">
                            <select 
                              value={member.role}
                              disabled={member.id === currentUser.id || !hasPermission('manage_team')}
                              onChange={(e) => updateMemberRole(member.id, e.target.value as AppRole)}
                              className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 pr-8 text-[9px] font-black uppercase tracking-widest text-zinc-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-center transition-all shadow-sm"
                            >
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                              <option value="finance">Finance</option>
                              <option value="employer">Employer</option>
                            </select>
                            <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none rotate-90" />
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={cn(
                            "text-[8px] font-black tracking-widest uppercase px-2.5 py-1.5 rounded-md border inline-block shadow-sm",
                            member.status === 'active' 
                              ? "bg-green-50 dark:bg-green-500/5 text-green-600 dark:text-green-500 border-green-200 dark:border-green-500/20" 
                              : "bg-amber-50 dark:bg-amber-500/5 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20"
                          )}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => removeMember(member.id)}
                            disabled={member.id === currentUser.id}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card className="p-0 overflow-hidden border border-white/5 glass-card shadow-premium">
            <div className="px-8 py-6 border-b border-white/5 bg-zinc-900/5 dark:bg-white/[0.01]">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                <Shield size={16} className="text-primary" />
                Security & Hardening
              </h3>
            </div>
            <div className="divide-y divide-black/5 dark:divide-white/5">
              <SettingItem 
                title="Multi-signature Authorization" 
                description="Require m-of-n signatures for on-chain dispatch sequences."
                action={<Button variant="outline" size="sm" className="font-black text-[9px] uppercase tracking-widest border-black/5 dark:border-white/5 bg-zinc-900/5 dark:bg-zinc-900/50">Configure</Button>}
              />
              <SettingItem 
                title="Disbursement Limits" 
                description="Daily and monthly maximum volume throttles per epoch."
                action={<Button variant="outline" size="sm" className="font-black text-[9px] uppercase tracking-widest border-black/5 dark:border-white/5 bg-zinc-900/5 dark:bg-zinc-900/50">Set Throttles</Button>}
              />
              <SettingItem 
                title="Governance Logic v2.4" 
                description="Current active distribution contract on Sepolia registry."
                action={<span className="text-[9px] bg-green-500/5 text-green-500 px-2.5 py-1 rounded-lg border border-green-500/10 font-black tracking-widest">SYNCHRONIZED</span>}
              />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border border-black/5 dark:border-white/5 glass-card shadow-premium">
            <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 bg-zinc-900/5 dark:bg-white/[0.01]">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                <Bell size={16} className="text-primary" />
                Communication Matrices
              </h3>
            </div>
            <div className="divide-y divide-black/5 dark:divide-white/5">
              <SettingItem 
                title="Browser Pulse Alerts" 
                description="Real-time notifications for cross-chain registry events."
                action={<Toggle active={true} />}
              />
              <SettingItem 
                title="Email Digest Protocol" 
                description="Weekly telemetry summary of all distribution epochs."
                action={<Toggle active={true} />}
              />
              <SettingItem 
                title="Treasury Thresholds" 
                description="Alert organizers when treasury balance drops below 10% target."
                action={<Toggle active={false} />}
              />
              <SettingItem 
                title="Autonomous Triggers" 
                description="Notify when schedule-based dispatches are initiated."
                action={<Toggle active={true} />}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="accent-gradient p-8 text-white overflow-hidden relative border-none shadow-2xl shadow-primary/20">
            <div className="absolute -top-4 -right-4 p-4 opacity-10">
              <Shield size={160} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/20 px-2 py-0.5 rounded-md">
                  {currentUser.role}
                </span>
              </div>
              <h4 className="text-2xl font-black mb-2 tracking-tighter uppercase">{currentUser.name}</h4>
              <p className="text-xs opacity-70 mb-8 font-medium leading-relaxed uppercase tracking-widest">
                Identified as Organization Node. Authority Level: High. Sync Rank: 0.
              </p>
              <Button variant="secondary" className="w-full bg-white text-black hover:bg-zinc-100 font-black text-[10px] uppercase tracking-[0.2em] py-6 rounded-xl shadow-xl">
                Identity Profile
              </Button>
            </div>
          </Card>

          <Card className="p-8 border border-black/5 dark:border-white/5 glass-card">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Visual Interface</h4>
            <div className="flex items-center justify-between p-4 bg-zinc-900/5 dark:bg-zinc-900/50 rounded-2xl border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                  {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-1">Theme</span>
                  <span className="text-xs font-black uppercase tracking-widest">{theme} State</span>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className="w-14 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 p-1 relative transition-all border border-black/5 dark:border-white/5 group ring-offset-bg-main focus:ring-2 ring-primary/40 ring-offset-2"
              >
                <div className={`w-5 h-5 rounded-lg bg-primary shadow-lg shadow-primary/40 transition-all ${theme === 'dark' ? 'translate-x-[1.75rem]' : 'translate-x-0'}`} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ title, description, action }: any) {
  return (
    <div className="px-8 py-7 flex items-center justify-between gap-8 group">
      <div className="min-w-0">
        <h4 className="text-xs font-black mb-2 uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function Toggle({ active }: { active: boolean }) {
  return (
    <button className={cn(
      "w-12 h-6 rounded-full transition-all p-1 border border-black/5 dark:border-white/5 group",
      active ? "bg-primary/20" : "bg-zinc-100 dark:bg-zinc-900"
    )}>
      <div className={cn(
        "w-4 h-4 rounded-lg transition-all shadow-md",
        active ? "translate-x-6 bg-primary shadow-primary/30" : "translate-x-0 bg-zinc-400 dark:bg-zinc-700"
      )} />
    </button>
  );
}
