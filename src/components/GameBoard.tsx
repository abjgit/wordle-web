import { useGameStore } from '@/stores/gameStore';
import { LetterStatus } from '@/types';

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
    <div className="flex flex-col items-center justify-center gap-1.5 mb-6">
      <div className="w-full max-w-[330px] mx-auto">
        {guessRows.map((guess, i) => (
          <div key={i} className="grid grid-cols-5 gap-1.5 justify-items-center mb-1.5">
            {guess.split('').map((letter: string, j: number) => {
              let status: LetterStatus = 'unused';
              if (i < guesses.length && gameState.statuses[i]) {
                status = gameState.statuses[i][j];
              }

              const isCurrentGuess = i === guesses.length && letter !== ' ';
              const isEmpty = letter === ' ';

              return (
                <div
                  key={j}
                  className={`
                    w-[62px] h-[62px] 
                    flex items-center justify-center 
                    text-2xl font-bold uppercase
                    border-2 rounded-md
                    ${isEmpty ? 'border-gray-200' : 'border-gray-400'}
                    ${isCurrentGuess ? 'border-gray-600 scale-105 animate-pop' : ''}
                    ${status === 'correct' ? 'bg-correct text-white border-correct/80' :
                      status === 'present' ? 'bg-present text-white border-present/80' :
                      status === 'absent' ? 'bg-absent text-white border-absent/80' :
                      'bg-white text-black'}
                    transition-all duration-150
                  `}
                >
                  {!isEmpty ? letter : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
