import React from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { useAuthStore } from './stores/authStore';
import { AuthButtons } from './components/AuthButtons';
import { GameContainer } from './components/GameContainer';
import { THIRDWEB_CONFIG } from './config';

const App: React.FC = () => {
  const { user, isLoading } = useAuthStore();

  return (
    <ThirdwebProvider
      activeChain={THIRDWEB_CONFIG.activeChain}
      clientId={THIRDWEB_CONFIG.clientId}
    >
      <div className="min-h-screen bg-white p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Wordle Web</h1>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="text-xl">Loading...</div>
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center">
            <AuthButtons />
          </div>
        ) : (
          <GameContainer />
        )}
      </div>
    </ThirdwebProvider>
  );
};

export default App;
