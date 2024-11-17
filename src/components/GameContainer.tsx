import React, { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useAuthStore } from '@/stores/authStore';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import { WORD_LENGTH } from '@/config';

const GameContainer: React.FC = () => {
  const { initGame, gameState, makeGuess, isLoading } = useGameStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (user && !gameState) {
      initGame();
    }
  }, [user, gameState, initGame]);

  const handleKeyPress = (key: string) => {
    if (!gameState || gameState.isFinished) return;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length === WORD_LENGTH) {
        makeGuess(gameState.currentGuess);
      }
    } else if (key === 'BACKSPACE') {
      useGameStore.setState(state => ({
        ...state,
        gameState: state.gameState ? {
          ...state.gameState,
          currentGuess: state.gameState.currentGuess.slice(0, -1)
        } : null
      }));
    } else if (gameState.currentGuess.length < WORD_LENGTH) {
      useGameStore.setState(state => ({
        ...state,
        gameState: state.gameState ? {
          ...state.gameState,
          currentGuess: state.gameState.currentGuess + key
        } : null
      }));
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center p-5 max-w-2xl mx-auto">
      <div className="flex justify-between items-center w-full mb-5">
        <div className="flex flex-col">
          <h2 className="text-lg font-medium text-gray-900">Welcome, {user.email || user.walletAddress}</h2>
          <p className="text-sm text-gray-600">Points: {user.points}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading game...</div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto">
          <GameBoard />
          <div className="h-8" /> {/* Espaciador */}
          <Keyboard onKeyPress={handleKeyPress} />
        </div>
      )}

      {gameState?.isFinished && (
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold mb-2">
            {gameState.won ? '¡Felicitaciones!' : 'Game Over'}
          </h2>
          <p className="text-gray-600">
            {gameState.won
              ? `¡Ganaste en ${gameState.attempts.length} intentos!`
              : `La palabra era: ${gameState.word}`}
          </p>
          <button
            onClick={() => initGame()}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default GameContainer;
