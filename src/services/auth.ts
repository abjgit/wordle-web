import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { auth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { useAddress, useSDK } from "@thirdweb-dev/react";

export const useMetaMaskAuth = () => {
  const address = useAddress();
  const sdk = useSDK();

  const authenticateWithWallet = async (address: string, sdk: ThirdwebSDK | undefined) => {
    if (!sdk) {
      throw new Error('ThirdWeb SDK not initialized');
    }

    try {
      // Crear el payload para firmar
      const payload = {
        address,
        timestamp: Date.now(),
      };

      // Firmar el payload con la wallet
      const signedPayload = await sdk.wallet.sign(JSON.stringify(payload));

      // Llamar al endpoint de autenticación
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

      // Iniciar sesión en Firebase con el token personalizado
      await signInWithCustomToken(auth, token);

      return true;
    } catch (error) {
      console.error('Error in wallet authentication:', error);
      throw error;
    }
  };

  const signInWithMetaMask = async () => {
    try {
      if (!address) {
        throw new Error("No wallet connected");
      }

      return await authenticateWithWallet(address, sdk);
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
