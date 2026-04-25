import React, { createContext, useContext, useState } from 'react';
import { SalaryRun, ApprovalInfo } from '../types';
import { useUser } from './UserProvider';
import { toast } from 'sonner';
import { useNotifications } from './NotificationProvider';

interface ApprovalContextType {
  pendingApprovals: SalaryRun[];
  requestApproval: (run: Omit<SalaryRun, 'id' | 'status' | 'txHash'>) => void;
  approveRun: (id: string) => void;
  executeRun: (id: string) => void;
}

const MOCK_APPROVALS: SalaryRun[] = [
  {
    id: 'app-1',
    batchId: 'BATCH-AP-442',
    date: '2026-04-24',
    network: 'Ethereum Mainnet',
    recipientsCount: 8,
    totalAmount: 12500,
    status: 'pending',
    txHash: '',
    approvalInfo: {
      required: 3,
      approvedBy: ['2'], // Sarah Connor approved
      status: 'partially_approved'
    }
  }
];

const ApprovalContext = createContext<ApprovalContextType | undefined>(undefined);

export function ApprovalProvider({ children }: { children: React.ReactNode }) {
  const [approvals, setApprovals] = useState<SalaryRun[]>(MOCK_APPROVALS);
  const { currentUser, hasPermission } = useUser();
  const { addNotification } = useNotifications();

  const requestApproval = (run: Omit<SalaryRun, 'id' | 'status' | 'txHash'>) => {
    const newRequest: SalaryRun = {
      ...run,
      id: `req-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      txHash: '',
      approvalInfo: {
        required: 3, // Logic could be dynamic
        approvedBy: [currentUser.id],
        status: 'pending'
      }
    };
    setApprovals(prev => [newRequest, ...prev]);
    addNotification({
      type: 'info',
      title: 'Consensus Required',
      message: `Execution request ${newRequest.batchId} submitted for multi-sig verification.`
    });
  };

  const approveRun = (id: string) => {
    if (!hasPermission('manage_team') && currentUser.role !== 'owner') {
       toast.error('Insufficient clearance for multi-sig authorization');
       return;
    }

    setApprovals(prev => prev.map(run => {
      if (run.id === id && run.approvalInfo) {
        if (run.approvalInfo.approvedBy.includes(currentUser.id)) {
          toast.error('Node has already signed this sequence');
          return run;
        }

        const newApprovedBy = [...run.approvalInfo.approvedBy, currentUser.id];
        const isFullyApproved = newApprovedBy.length >= run.approvalInfo.required;

        toast.success(isFullyApproved ? 'Threshold reached! Sequence unlocked.' : 'Signature recorded on registry');
        
        addNotification({
          type: 'success',
          title: 'Signature Recorded',
          message: `Node ${currentUser.name} has authorized sequence ${run.batchId}.`
        });

        return {
          ...run,
          approvalInfo: {
            ...run.approvalInfo,
            approvedBy: newApprovedBy,
            status: isFullyApproved ? 'approved' : 'partially_approved'
          }
        };
      }
      return run;
    }));
  };

  const executeRun = (id: string) => {
    setApprovals(prev => prev.filter(run => run.id !== id));
    toast.success('Sequence broadcasted to mainnet registry');
  };

  return (
    <ApprovalContext.Provider value={{ pendingApprovals: approvals, requestApproval, approveRun, executeRun }}>
      {children}
    </ApprovalContext.Provider>
  );
}

export function useApprovals() {
  const context = useContext(ApprovalContext);
  if (context === undefined) {
    throw new Error('useApprovals must be used within an ApprovalProvider');
  }
  return context;
}
