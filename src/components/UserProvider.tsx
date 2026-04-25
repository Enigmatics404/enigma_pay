import React, { createContext, useContext, useState } from 'react';
import { AppRole, TeamMember } from '../types';

interface UserContextType {
  currentUser: TeamMember;
  team: TeamMember[];
  inviteMember: (email: string, role: AppRole) => void;
  updateMemberRole: (id: string, role: AppRole) => void;
  removeMember: (id: string) => void;
  hasPermission: (action: string) => boolean;
}

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Adriel Putra', email: 'adriel@example.com', role: 'owner', status: 'active', walletAddress: '0x123...456' },
  { id: '2', name: 'Sarah Connor', email: 'sarah@example.com', role: 'admin', status: 'active', walletAddress: '0xabc...def' },
  { id: '3', name: 'John Doe', email: 'john@example.com', role: 'finance', status: 'active', walletAddress: '0x789...012' },
  { id: '4', name: 'Jane Smith', email: 'jane@example.com', role: 'employer', status: 'pending' },
];

const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  owner: ['*', 'manage_team', 'execute_payroll', 'manage_recipients', 'edit_automation', 'view_reports'],
  admin: ['manage_team', 'manage_recipients', 'edit_automation', 'view_reports'],
  finance: ['execute_payroll', 'view_reports'],
  employer: ['manage_recipients', 'view_reports'],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
  const [currentUser] = useState<TeamMember>(MOCK_TEAM[0]); // Default to owner for demo

  const inviteMember = (email: string, role: AppRole) => {
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      status: 'pending',
    };
    setTeam(prev => [...prev, newMember]);
  };

  const updateMemberRole = (id: string, role: AppRole) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, role } : m));
  };

  const removeMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const hasPermission = (action: string) => {
    const permissions = ROLE_PERMISSIONS[currentUser.role];
    return permissions.includes('*') || permissions.includes(action);
  };

  return (
    <UserContext.Provider value={{ currentUser, team, inviteMember, updateMemberRole, removeMember, hasPermission }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
