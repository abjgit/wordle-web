import React from 'react';
import styled from 'styled-components';
import { ConnectWallet } from '@thirdweb-dev/react';
import { useAuthStore } from '@/stores/authStore';

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
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #538d4e;
  }
`;

const AuthButtons: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const { loginWithEmail, error } = useAuthStore();

  const handleEmailLogin = async () => {
    if (email) {
      await loginWithEmail(email);
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
