import React from 'react';
import { GameBoard } from './GameBoard';
import { Keyboard } from './Keyboard';
import { useGameStore } from '@/stores/gameStore';

export const GameContainer: React.FC = () => {
  const { 
    addLetter,
    removeLetter,
    submitGuess,
    initializeGame,
    gameState
  } = useGameStore();

  React.useEffect(() => {
    // Initialize the game when component mounts
    initializeGame();
  }, [initializeGame]);

  const handleKeyPress = React.useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;
    
    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      removeLetter();
    } else if (/^[A-Za-z]$/.test(key)) {
      addLetter(key.toUpperCase());
    }
  }, [gameState.gameStatus, addLetter, removeLetter, submitGuess]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-8 bg-yellow-100 p-4 rounded-lg shadow-lg">
      <div className="text-2xl font-bold text-blue-600 text-center">
        {gameState.gameStatus === 'won' && 'Congratulations! 🎉'}
        {gameState.gameStatus === 'lost' && `Game Over! The word was ${gameState.word}`}
        {gameState.gameStatus === 'playing' && 'Guess the word!'}
      </div>
      
      <div className="w-full">
        <GameBoard />
      </div>
      <div className="w-full">
        <Keyboard onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
};
