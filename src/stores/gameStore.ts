import { create } from 'zustand';
import { LetterStatus } from '@/types';

interface GameState {
  word: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  letterStatuses: Record<string, LetterStatus>;
  currentRow: number;
  statuses: LetterStatus[][];
}

interface GameStore {
  gameState: GameState;
  initializeGame: () => void;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
}

const WORDS = [
  'WORLD', 'HELLO', 'GAMES', 'HOUSE', 'TABLE',
  'CHAIR', 'PLATE', 'PHONE', 'WATER', 'LIGHT',
  'PAPER', 'MUSIC', 'CLOCK', 'BEACH', 'NIGHT',
  'SPACE', 'EARTH', 'DREAM', 'BRAIN', 'SMILE'
];

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const createInitialState = (): GameState => ({
  word: getRandomWord(),
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  letterStatuses: {},
  currentRow: 0,
  statuses: []
});

const checkGuess = (guess: string, word: string): LetterStatus[] => {
  const result: LetterStatus[] = Array(5).fill('absent');
  const wordArray = word.split('');
  const guessArray = guess.split('');

  // Check for correct letters first
  guessArray.forEach((letter, i) => {
    if (letter === wordArray[i]) {
      result[i] = 'correct';
      wordArray[i] = '#'; // Mark as used
    }
  });

  // Check for present letters
  guessArray.forEach((letter, i) => {
    if (result[i] === 'correct') return;
    
    const index = wordArray.indexOf(letter);
    if (index !== -1) {
      result[i] = 'present';
      wordArray[index] = '#'; // Mark as used
    }
  });

  return result;
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createInitialState(),

  initializeGame: () => {
    set({ gameState: createInitialState() });
  },

  addLetter: (letter: string) => {
    const { gameState } = get();
    if (gameState.currentGuess.length < 5 && gameState.gameStatus === 'playing') {
      set({
        gameState: {
          ...gameState,
          currentGuess: gameState.currentGuess + letter
        }
      });
    }
  },

  removeLetter: () => {
    const { gameState } = get();
    if (gameState.currentGuess.length > 0 && gameState.gameStatus === 'playing') {
      set({
        gameState: {
          ...gameState,
          currentGuess: gameState.currentGuess.slice(0, -1)
        }
      });
    }
  },

  submitGuess: () => {
    const { gameState } = get();
    if (gameState.currentGuess.length !== 5 || gameState.gameStatus !== 'playing') return;

    const newStatuses = [...gameState.statuses];
    const currentStatus = checkGuess(gameState.currentGuess, gameState.word);
    newStatuses.push(currentStatus);

    const newLetterStatuses = { ...gameState.letterStatuses };
    gameState.currentGuess.split('').forEach((letter, i) => {
      const currentLetterStatus = currentStatus[i];
      const existingStatus = newLetterStatuses[letter];
      
      if (!existingStatus || 
          (existingStatus === 'absent' && currentLetterStatus !== 'absent') ||
          (existingStatus === 'present' && currentLetterStatus === 'correct')) {
        newLetterStatuses[letter] = currentLetterStatus;
      }
    });

    const isWon = gameState.currentGuess === gameState.word;
    const isLost = gameState.guesses.length === 5 && !isWon;

    set({
      gameState: {
        ...gameState,
        guesses: [...gameState.guesses, gameState.currentGuess],
        currentGuess: '',
        currentRow: gameState.currentRow + 1,
        gameStatus: isWon ? 'won' : isLost ? 'lost' : 'playing',
        letterStatuses: newLetterStatuses,
        statuses: newStatuses
      }
    });
  }
}));
