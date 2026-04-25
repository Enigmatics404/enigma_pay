import { Employee, SalaryRun, Chain, Token } from './types';

export const NETWORKS: Chain[] = [
  { id: '1', name: 'Ethereum', icon: 'Eth', isTestnet: false, gasMultiplier: 12.5 },
  { id: '137', name: 'Polygon', icon: 'Polygon', isTestnet: false, gasMultiplier: 0.15 },
  { id: '8453', name: 'Base', icon: 'Base', isTestnet: false, gasMultiplier: 0.08 },
  { id: '42161', name: 'Arbitrum', icon: 'Arb', isTestnet: false, gasMultiplier: 0.12 },
  { id: '11155111', name: 'Sepolia', icon: 'Sep', isTestnet: true, gasMultiplier: 0.05 },
  { id: '84532', name: 'Base Sepolia', icon: 'BSep', isTestnet: true, gasMultiplier: 0.05 },
  { id: '421614', name: 'Arb Sepolia', icon: 'ASep', isTestnet: true, gasMultiplier: 0.05 },
];

export const TOKENS: Token[] = [
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', icon: 'USDC', balance: '1,245.80', decimals: 6 },
  { id: 'usdt', symbol: 'USDT', name: 'Tether USD', icon: 'USDT', balance: '850.40', decimals: 6 },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', icon: 'ETH', balance: '42.5', decimals: 18 },
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Alex Mercer',
    email: 'alex@payflow.xyz',
    roles: ['Senior Smart Contract Engineer'],
    department: 'Engineering',
    walletAddress: '0x71C234E5F6G7H8I9J0K1L2M3N4O5P6Q7A3A9f',
    salary: 12500,
    tokenType: 'USDC',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'Elena Rostova',
    email: 'elena@payflow.xyz',
    roles: ['Lead Product Designer'],
    department: 'Design',
    walletAddress: '0x2B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q91E2',
    salary: 10000,
    tokenType: 'USDC',
    status: 'onboarding',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    email: 'marcus@payflow.xyz',
    roles: ['Frontend Developer'],
    department: 'Engineering',
    walletAddress: '0x9fA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P44Bc',
    salary: 8500,
    tokenType: 'USDT',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  },
  {
    id: '4',
    name: 'David Chen',
    email: 'david@payflow.xyz',
    roles: ['VP of Marketing'],
    department: 'Marketing',
    walletAddress: '0xE11F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T88Ff',
    salary: 15000,
    tokenType: 'USDC',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
  }
];

export const MOCK_HISTORY: SalaryRun[] = [
  {
    id: '1',
    batchId: 'PF-892A',
    date: 'Oct 28, 14:32',
    network: 'Base',
    recipientsCount: 42,
    totalAmount: 124500,
    status: 'confirmed',
    txHash: '0x8f...3a9b',
    recipients: ['Alex Mercer', 'Marcus Johnson', 'Sarah Chen']
  },
  {
    id: '2',
    batchId: 'PF-891B',
    date: 'Oct 28, 09:15',
    network: 'Arbitrum',
    recipientsCount: 1,
    totalAmount: 45200,
    status: 'pending',
    txHash: '0x2c...1f4e',
    recipients: ['Elena Rostova']
  },
  {
    id: '3',
    batchId: 'PF-890C',
    date: 'Oct 27, 18:45',
    network: 'Base',
    recipientsCount: 156,
    totalAmount: 312850,
    status: 'confirmed',
    txHash: '0x4e...d8e1',
    recipients: ['Alex Mercer', 'David Chen']
  },
  {
    id: '4',
    batchId: 'PF-889X',
    date: 'Oct 26, 11:20',
    network: 'Arbitrum',
    recipientsCount: 3,
    totalAmount: 8400,
    status: 'failed',
    txHash: '0x9a...7d2c',
    recipients: ['Marcus Johnson']
  }
];
