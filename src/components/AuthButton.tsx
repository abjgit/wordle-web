import React from 'react';
import { ConnectWallet } from "@thirdweb-dev/react";
import { useMetaMaskAuth } from '../services/auth';

export const AuthButton: React.FC = () => {
  const { signInWithMetaMask, isConnected } = useMetaMaskAuth();

  const handleConnect = async () => {
    if (isConnected) {
      try {
        await signInWithMetaMask();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  return (
    <div className="auth-button-container">
      <ConnectWallet 
        theme="dark"
        btnTitle="Connect Wallet"
        modalTitle="Select Your Wallet"
        onConnect={handleConnect}
      />
    </div>
  );
};
