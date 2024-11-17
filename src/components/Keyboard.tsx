import React from 'react';
import { useGameStore } from '@/stores/gameStore';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  const { gameState } = useGameStore();
  
  const getKeyStatus = (key: string) => {
    if (!gameState?.statuses) return '';
    const flatStatuses = gameState.statuses.flat();
    const keyIndices = gameState.attempts
      .join('')
      .split('')
      .map((letter, index) => letter === key ? index : -1)
      .filter(index => index !== -1);
    
    if (keyIndices.length === 0) return '';
    
    const statuses = keyIndices.map(index => flatStatuses[index]);
    if (statuses.includes('🟩')) return '🟩';
    if (statuses.includes('🟨')) return '🟨';
    if (statuses.includes('⬜')) return '⬜';
    return '';
  };

  const getKeyClasses = (key: string, isWide = false) => {
    const status = getKeyStatus(key);
    let classes = 'keyboard-key font-bold text-sm sm:text-base transition-colors duration-150 ';
    classes += isWide ? 'min-w-[65px] px-2 ' : 'min-w-[40px] ';
    
    switch (status) {
      case '🟩':
        classes += 'bg-correct text-white';
        break;
      case '🟨':
        classes += 'bg-present text-white';
        break;
      case '⬜':
        classes += 'bg-absent text-white';
        break;
      default:
        classes += 'bg-key-bg text-gray-900 hover:bg-gray-300';
    }
    
    return classes;
  };

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={getKeyClasses(key, key === 'ENTER' || key === 'BACKSPACE')}
            >
              {key === 'BACKSPACE' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
