import React from 'react';
import { useGameStore } from '@/stores/gameStore';
import { LetterStatus } from '@/types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

const getKeyClass = (status: LetterStatus | undefined): string => {
  switch (status) {
    case 'correct':
      return 'bg-correct text-white hover:bg-correct/90';
    case 'present':
      return 'bg-present text-white hover:bg-present/90';
    case 'absent':
      return 'bg-absent text-white hover:bg-absent/90';
    default:
      return 'bg-key-bg text-black hover:bg-key-bg/80';
  }
};

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  const { gameState } = useGameStore();

  return (
    <div className="flex flex-col gap-2 px-1 select-none max-w-[500px] mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((key) => {
            const status = key.length === 1 ? gameState.letterStatuses[key] : undefined;
            const isSpecialKey = key.length > 1;
            
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`
                  ${isSpecialKey ? 'px-3 min-w-[4rem]' : 'w-10'} 
                  h-14
                  rounded-md
                  font-bold 
                  text-sm 
                  uppercase
                  transition-colors
                  active:scale-95
                  ${isSpecialKey ? 'bg-key-bg hover:bg-key-bg/80' : getKeyClass(status)}
                `}
              >
                {key === 'Backspace' ? '←' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
