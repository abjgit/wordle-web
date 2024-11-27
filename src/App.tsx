import type { ReactElement } from 'react';
import { GameContainer } from './components/GameContainer';
import { WalletButton } from './components/WalletButton';
import { initializeTelegramWebApp, isTelegramWebView } from './services/telegram';
import { useEffect } from 'react';

const App = (): ReactElement => {
  useEffect(() => {
    // Initialize Telegram WebApp
    if (isTelegramWebView()) {
      initializeTelegramWebApp();
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-500 to-blue-600">
      {/* Wallet Button - solo se muestra si no estamos en Telegram */}
      {!isTelegramWebView() && (
        <div className="fixed top-4 right-4 z-50">
          <WalletButton />
        </div>
      )}
      
      <div className="py-8 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-xl p-6">
          <div className="flex justify-center items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              Wordle Web
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <GameContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
