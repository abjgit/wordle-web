import React from 'react';
import styled from 'styled-components';
import { ConnectWallet, useAddress, useSDK } from '@thirdweb-dev/react';
import { useAuthStore } from '@/stores/authStore';
import { signInWithCustomToken, auth } from 'firebase/auth';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  margin: 20px 0;
`;

const EmailContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d3d6da;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #6aaa64;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #538d4e;
  }
`;

const AuthButtons: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const { loginWithEmail, login, error } = useAuthStore();
  const address = useAddress();
  const sdk = useSDK();

  const handleEmailLogin = async () => {
    if (email) {
      await loginWithEmail(email);
    }
  };

  const handleWalletConnect = async () => {
    if (address) {
      try {
        // Get the currently connected wallet's address
        const payload = {
          address: address,
          chainId: await sdk?.getChainId(),
        };

        // Sign the payload with the wallet
        const signedPayload = await sdk?.wallet.sign(JSON.stringify(payload));
        
        // Call our backend to verify the signature and get a Firebase token
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
        
        // Login with the wallet address
        await login(address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  return (
    <Container>
      <ConnectWallet
        theme="dark"
        btnTitle="Connect Wallet"
        modalTitle="Choose your wallet"
        modalSize="wide"
        welcomeScreen={{
          title: "Welcome to Wordle",
          subtitle: "Connect your wallet to start playing",
        }}
        modalTitleIconUrl="/wordle-icon.png"
        onConnect={handleWalletConnect}
      />
      
      <EmailContainer>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleEmailLogin}>
          Login with Email
        </Button>
      </EmailContainer>
      
      {error && (
        <div style={{ color: 'red' }}>{error}</div>
      )}
    </Container>
  );
};

export default AuthButtons;
