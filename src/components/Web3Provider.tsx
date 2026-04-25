import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chain, Token } from '../types';
import { NETWORKS, TOKENS } from '../constants';
import { toast } from 'sonner';

interface Web3ContextType {
  currentChain: Chain;
  selectedToken: Token;
  setCurrentChain: (chain: Chain) => void;
  setSelectedToken: (token: Token) => void;
  isWrongNetwork: boolean;
  gasPrice: number; // in some mock unit
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [currentChain, setCurrentChain] = useState<Chain>(NETWORKS[2]); // Default to Base
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]); // Default to USDC
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [gasPrice, setGasPrice] = useState(currentChain.gasMultiplier);

  // Mock auto-detect network logic
  useEffect(() => {
    // In a real app, this would be window.ethereum.on('chainChanged')
    setGasPrice(currentChain.gasMultiplier + (Math.random() * 2));
  }, [currentChain]);

  const value = {
    currentChain,
    selectedToken,
    setCurrentChain: (chain: Chain) => {
      setCurrentChain(chain);
      toast.success(`Switched to ${chain.name}`);
    },
    setSelectedToken,
    isWrongNetwork,
    gasPrice
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
