import { create } from 'zustand';
import { LetterStatus } from '@/types';

interface GameState {
  word: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  letterStatuses: Record<string, LetterStatus>;
  currentRow: number;
}

interface GameStore {
  gameState: GameState;
  initializeGame: () => void;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
}

const initialState: GameState = {
  word: '',
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  letterStatuses: {},
  currentRow: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  gameState: initialState,
  
  initializeGame: () => {
    set({ gameState: initialState });
  },

  addLetter: (letter: string) => {
    set((state) => {
      if (state.gameState.currentGuess.length >= 5) return state;
      return {
        gameState: {
          ...state.gameState,
          currentGuess: state.gameState.currentGuess + letter,
        },
      };
    });
  },

  removeLetter: () => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        currentGuess: state.gameState.currentGuess.slice(0, -1),
      },
    }));
  },

  submitGuess: () => {
    set((state) => {
      if (state.gameState.currentGuess.length !== 5) return state;

      const newGuesses = [...state.gameState.guesses, state.gameState.currentGuess];
      const won = state.gameState.currentGuess === state.gameState.word;
      const lost = newGuesses.length >= 6;

      return {
        gameState: {
          ...state.gameState,
          guesses: newGuesses,
          currentGuess: '',
          gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
          currentRow: state.gameState.currentRow + 1,
        },
      };
    });
  },
}));
