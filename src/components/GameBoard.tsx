import React from 'react';
import { useGameStore } from '@/stores/gameStore';

export const GameBoard = () => {
  const { gameState } = useGameStore();
  const { guesses, currentGuess } = gameState;

  const empties = 
    Array(6 - (guesses.length + (currentGuess ? 1 : 0)))
      .fill('     ');

  const guessRows = [
    ...guesses,
    currentGuess + ' '.repeat(5 - currentGuess.length),
    ...empties
  ];

  return (
    <div className="grid grid-rows-6 gap-1">
      {guessRows.map((guess, i) => (
        <div key={i} className="grid grid-cols-5 gap-1">
          {guess.split('').map((letter: string, j: number) => {
            let status = 'unused';
            if (i < guesses.length && gameState.statuses[i]) {
              status = gameState.statuses[i][j];
            }

            return (
              <div
                key={j}
                className={`
                  w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold
                  ${status === 'correct' ? 'bg-green-500 text-white border-green-600' :
                    status === 'present' ? 'bg-yellow-500 text-white border-yellow-600' :
                    status === 'absent' ? 'bg-gray-500 text-white border-gray-600' :
                    'bg-white text-black border-gray-300'}
                `}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export { GameBoard };
