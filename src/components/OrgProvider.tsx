import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrganizationSettings } from '../types';

interface OrgContextType {
  settings: OrganizationSettings;
  updateSettings: (newSettings: Partial<OrganizationSettings>) => void;
  getEstimatedTax: (amount: number) => number;
}

const REGIONS = [
  { id: 'us', name: 'United States', rate: 0.15 },
  { id: 'uk', name: 'United Kingdom', rate: 0.20 },
  { id: 'eu', name: 'European Union', rate: 0.22 },
  { id: 'sg', name: 'Singapore', rate: 0.07 },
  { id: 'global', name: 'Global Standard', rate: 0.10 },
];

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<OrganizationSettings>(() => {
    const saved = localStorage.getItem('enigma_org_settings');
    return saved ? JSON.parse(saved) : {
      name: 'Enigma HQ',
      region: 'global',
      taxRate: 0.10
    };
  });

  useEffect(() => {
    localStorage.setItem('enigma_org_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<OrganizationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.region) {
        const regionData = REGIONS.find(r => r.id === newSettings.region);
        if (regionData) updated.taxRate = regionData.rate;
      }
      return updated;
    });
  };

  const getEstimatedTax = (amount: number) => {
    return amount * settings.taxRate;
  };

  return (
    <OrgContext.Provider value={{ settings, updateSettings, getEstimatedTax }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
}
