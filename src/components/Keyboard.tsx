import React from 'react';
import { useGameStore } from '@/stores/gameStore';
import { LetterStatus } from '@/types';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

interface KeyboardProps {
  onKeyPress?: (key: string) => void;
}

export const Keyboard: React.FC<KeyboardProps> = () => {
  const { gameState, makeGuess, setCurrentGuess } = useGameStore();

  const getKeyStatus = (key: string): LetterStatus => {
    const { statuses, guesses } = gameState;
    const flatStatuses = statuses.flat();
    const flatGuesses = guesses.join('').toUpperCase();
    const keyIndex = flatGuesses.lastIndexOf(key);
    
    if (keyIndex === -1) return 'unused';
    return flatStatuses[keyIndex];
  };

  const handleKeyClick = (key: string) => {
    if (gameState.isFinished) return;

    if (key === 'BACKSPACE') {
      setCurrentGuess(gameState.currentGuess.slice(0, -1));
    } else if (key === 'ENTER') {
      if (gameState.currentGuess.length === 5) {
        makeGuess(gameState.currentGuess);
      }
    } else if (gameState.currentGuess.length < 5) {
      setCurrentGuess(gameState.currentGuess + key);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5">
          {row.map((key) => {
            const status = getKeyStatus(key);
            return (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`
                  font-bold text-sm sm:text-base transition-colors duration-150 
                  ${status === 'correct' ? 'bg-correct text-white' :
                    status === 'present' ? 'bg-present text-white' :
                    status === 'absent' ? 'bg-absent text-white' :
                    'bg-key-bg text-gray-900 hover:bg-gray-300'}
                  ${key === 'ENTER' || key === 'BACKSPACE' ? 'min-w-[65px] px-2' : 'min-w-[40px]'}
                `}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
