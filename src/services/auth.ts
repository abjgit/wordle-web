import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { ConnectWallet, useAddress, useSDK } from "@thirdweb-dev/react";
import { FIREBASE_CONFIG } from '../config';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

export const useMetaMaskAuth = () => {
  const address = useAddress();
  const sdk = useSDK();

  const signInWithMetaMask = async () => {
    try {
      if (!address) {
        throw new Error("No wallet connected");
      }

      // Get the currently connected wallet's address
      const payload = {
        address: address,
        chainId: await sdk?.getChainId(),
      };

      // Sign the payload with the wallet
      const signedPayload = await sdk?.wallet.sign(JSON.stringify(payload));
      
      // Call your backend to verify the signature and get a Firebase custom token
      const response = await fetch('/api/auth/metamask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          signature: signedPayload,
          payload: JSON.stringify(payload),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const { token } = await response.json();

      // Sign in to Firebase with the custom token
      await signInWithCustomToken(auth, token);

      return true;
    } catch (error) {
      console.error('Error signing in with MetaMask:', error);
      throw error;
    }
  };

  return {
    signInWithMetaMask,
    isConnected: !!address,
    address,
  };
};
