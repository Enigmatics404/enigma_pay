import React, { createContext, useContext, useState, useEffect } from 'react';
import { AutomationConfig } from '../types';
import { toast } from 'sonner';
import { useNotifications } from './NotificationProvider';

interface AutomationContextType {
  config: AutomationConfig;
  setFrequency: (freq: 'weekly' | 'monthly') => void;
  toggleAutomation: () => void;
  setRunDay: (day: number) => void;
  simulateTrigger: () => void;
}

const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

export function AutomationProvider({ children }: { children: React.ReactNode }) {
  const { addNotification } = useNotifications();
  const [config, setConfig] = useState<AutomationConfig>({
    isEnabled: false,
    frequency: 'monthly',
    nextRun: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    dayOfMonth: 1,
    dayOfWeek: 1,
  });

  const toggleAutomation = () => {
    setConfig(prev => {
      const newState = !prev.isEnabled;
      if (newState) {
        toast.success('Autonomous Disbursement Active');
      } else {
        toast.info('Autonomous Disbursement Paused');
      }
      return { ...prev, isEnabled: newState };
    });
  };

  const setFrequency = (frequency: 'weekly' | 'monthly') => {
    setConfig(prev => ({ ...prev, frequency }));
    toast.success(`Frequency set to ${frequency}`);
  };

  const setRunDay = (day: number) => {
    if (config.frequency === 'weekly') {
      setConfig(prev => ({ ...prev, dayOfWeek: day }));
    } else {
      setConfig(prev => ({ ...prev, dayOfMonth: day }));
    }
  };

  const simulateTrigger = () => {
    if (!config.isEnabled) {
      toast.error('Automation is disabled');
      return;
    }
    toast.info('Autonomous trigger sequence initiated...');
    addNotification({
      type: 'info',
      title: 'Automation Sequence Multi-sig',
      message: 'Self-executing smart contract call initiated for next payroll epoch.'
    });
    setTimeout(() => {
      toast.success('Payroll batch processed autonomously');
      addNotification({
        type: 'success',
        title: 'Autonomous Dispatch Success',
        message: 'A recurring distribution epoch has been finalized on the designated registry.'
      });
      setConfig(prev => ({
        ...prev,
        lastRun: new Date().toISOString(),
        nextRun: new Date(Date.now() + (config.frequency === 'weekly' ? 86400000 * 7 : 86400000 * 30)).toISOString()
      }));
    }, 2000);
  };

  return (
    <AutomationContext.Provider value={{ config, setFrequency, toggleAutomation, setRunDay, simulateTrigger }}>
      {children}
    </AutomationContext.Provider>
  );
}

export function useAutomation() {
  const context = useContext(AutomationContext);
  if (context === undefined) {
    throw new Error('useAutomation must be used within an AutomationProvider');
  }
  return context;
}
