import type { ReactElement } from 'react';
import { GameContainer } from './components/GameContainer';
import { initializeTelegramWebApp } from './services/telegram';
import { useEffect } from 'react';

const App = (): ReactElement => {
  useEffect(() => {
    // Initialize Telegram WebApp
    initializeTelegramWebApp();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 py-8 px-4">
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
  );
};

export default App;
