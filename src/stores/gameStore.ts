import { create } from 'zustand';
import { GameState, User, LetterStatus } from '@/types';
import { useAuthStore } from './authStore';

interface GameStore {
  gameState: GameState;
  makeGuess: (guess: string) => void;
  setCurrentGuess: (guess: string) => void;
  resetGame: () => void;
}

const WORD_LENGTH = 5;
const INITIAL_STATE: GameState = {
  word: 'REACT',
  guesses: [],
  currentGuess: '',
  statuses: [],
  isFinished: false,
};

const calculateStatuses = (guess: string, word: string): LetterStatus[] => {
  const statuses: LetterStatus[] = new Array(WORD_LENGTH).fill('absent');
  const wordArray = word.split('');
  const guessArray = guess.split('');

  // First pass: mark correct letters
  guessArray.forEach((letter, i) => {
    if (letter === wordArray[i]) {
      statuses[i] = 'correct';
      wordArray[i] = '#'; // mark as used
    }
  });

  // Second pass: mark present letters
  guessArray.forEach((letter, i) => {
    if (statuses[i] !== 'correct') {
      const index = wordArray.indexOf(letter);
      if (index !== -1) {
        statuses[i] = 'present';
        wordArray[index] = '#'; // mark as used
      }
    }
  });

  return statuses;
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: INITIAL_STATE,

  makeGuess: (guess: string) => {
    const { gameState } = get();
    if (gameState.isFinished || guess.length !== WORD_LENGTH) return;

    const newStatuses = calculateStatuses(guess, gameState.word);
    const isWin = guess === gameState.word;

    set((state) => ({
      gameState: {
        ...state.gameState,
        guesses: [...state.gameState.guesses, guess],
        statuses: [...state.gameState.statuses, newStatuses],
        currentGuess: '',
        isFinished: isWin || state.gameState.guesses.length + 1 >= 6
      }
    }));

    if (isWin || gameState.guesses.length + 1 >= 6) {
      const auth = useAuthStore.getState();
      const user = auth.user;
      if (user) {
        const points = isWin ? 100 : 0;
        const updates: Partial<User> = {
          points: (user.points || 0) + points,
          gamesPlayed: (user.gamesPlayed || 0) + 1,
          gamesWon: (user.gamesWon || 0) + (isWin ? 1 : 0),
          currentStreak: isWin ? (user.currentStreak || 0) + 1 : 0,
          maxStreak: Math.max(user.maxStreak || 0, isWin ? (user.currentStreak || 0) + 1 : 0),
          lastPlayedAt: new Date(),
        };
        auth.updateUser(updates);
      }
    }
  },

  setCurrentGuess: (guess: string) => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        currentGuess: guess.toUpperCase()
      }
    }));
  },

  resetGame: () => {
    set({ gameState: INITIAL_STATE });
  }
}));
