export type Theme = 'light' | 'dark';

export interface Chain {
  id: string;
  name: string;
  icon: string;
  isTestnet: boolean;
  gasMultiplier: number;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  decimals: number;
}

export type AppRole = 'owner' | 'admin' | 'finance' | 'employer';

export interface Permission {
  action: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  status: 'active' | 'pending';
  walletAddress?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface AutomationConfig {
  isEnabled: boolean;
  frequency: 'weekly' | 'monthly';
  nextRun: string;
  lastRun?: string;
  dayOfWeek?: number; // 0-6
  dayOfMonth?: number; // 1-31
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  roles: string[];
  department: string;
  walletAddress: string;
  salary: number;
  tokenType: string;
  status: 'active' | 'onboarding' | 'inactive';
  avatar?: string;
}

export interface ApprovalInfo {
  required: number;
  approvedBy: string[]; // User IDs
  status: 'pending' | 'partially_approved' | 'approved' | 'executed';
}

export interface SalaryRun {
  id: string;
  batchId: string;
  date: string;
  network: string;
  recipientsCount: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'failed';
  txHash: string;
  recipients?: string[];
  approvalInfo?: ApprovalInfo;
}

export interface OrganizationSettings {
  name: string;
  region: string;
  taxRate: number;
}

export interface NavItem {
  label: string;
  icon: string;
  path: string;
}
