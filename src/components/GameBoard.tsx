import React from 'react';
import { WORD_LENGTH, MAX_ATTEMPTS } from '@/config';
import { useGameStore } from '@/stores/gameStore';

const GameBoard: React.FC = () => {
  const { gameState, isLoading } = useGameStore();

  if (isLoading || !gameState) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <div className="text-center text-gray-500">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
            const letter = gameState.guesses[rowIndex]?.[colIndex] || '';
            const status = gameState.statuses[rowIndex]?.[colIndex] || '';
            const isCurrentRow = rowIndex === gameState.attempts.length;
            const isCurrentGuess = isCurrentRow && gameState.currentGuess[colIndex];
            
            let bgColor = 'bg-gray-200';
            if (status === 'correct') bgColor = 'bg-green-500';
            else if (status === 'present') bgColor = 'bg-yellow-500';
            else if (status === 'absent') bgColor = 'bg-gray-500';
            else if (isCurrentGuess) bgColor = 'bg-gray-300';
            
            return (
              <div
                key={colIndex}
                className={`
                  w-14 h-14 
                  flex items-center justify-center 
                  text-2xl font-bold 
                  border-2 border-gray-300 
                  ${bgColor}
                  ${isCurrentGuess ? 'animate-pop' : ''}
                  transition-all duration-300 ease-in-out
                `}
              >
                {isCurrentRow ? gameState.currentGuess[colIndex] : letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
