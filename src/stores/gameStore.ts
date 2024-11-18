import { create } from 'zustand';
import { User } from '@/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from './authStore';

interface GameStore {
  word: string | null;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  error: string | null;
  isLoading: boolean;
  makeGuess: (guess: string) => Promise<void>;
  setCurrentGuess: (guess: string) => void;
  initGame: () => Promise<void>;
  resetGame: () => void;
}

const POINTS_CONFIG = {
  BASE_POINTS: 100,
  STREAK_MULTIPLIER: 0.1,  // 10% extra por cada juego en racha
  ATTEMPTS_MULTIPLIER: 20,  // 20 puntos extra por cada intento restante
};

export const useGameStore = create<GameStore>((set, get) => ({
  word: null,
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  error: null,
  isLoading: false,

  initGame: async () => {
    set({ isLoading: true, error: null });
    try {
      // Aquí iría la lógica para obtener una nueva palabra
      set({ word: 'WORLD', isLoading: false });
    } catch (error) {
      set({ error: 'Failed to start game', isLoading: false });
    }
  },

  makeGuess: async (guess: string) => {
    const { word, guesses } = get();
    const { user } = useAuthStore.getState();

    if (!word || !user) return;

    if (guess.length !== 5) {
      set({ error: 'Guess must be 5 letters' });
      return;
    }

    if (guesses.length >= 6) {
      set({ error: 'No more attempts allowed' });
      return;
    }

    const newGuesses = [...guesses, guess];
    set({ guesses: newGuesses, currentGuess: '' });

    if (guess === word) {
      // Calcular puntos
      const remainingAttempts = 6 - newGuesses.length;
      const streakBonus = Math.floor(POINTS_CONFIG.BASE_POINTS * (user.currentStreak * POINTS_CONFIG.STREAK_MULTIPLIER));
      const attemptsBonus = remainingAttempts * POINTS_CONFIG.ATTEMPTS_MULTIPLIER;
      const totalPoints = POINTS_CONFIG.BASE_POINTS + streakBonus + attemptsBonus;

      // Actualizar estadísticas del usuario
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        gamesPlayed: user.gamesPlayed + 1,
        gamesWon: user.gamesWon + 1,
        currentStreak: user.currentStreak + 1,
        bestStreak: Math.max(user.currentStreak + 1, user.bestStreak),
        totalPoints: user.totalPoints + totalPoints,
      });

      set({ gameStatus: 'won' });
    } else if (newGuesses.length === 6) {
      // Actualizar estadísticas del usuario para juego perdido
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        gamesPlayed: user.gamesPlayed + 1,
        currentStreak: 0,
      });

      set({ gameStatus: 'lost' });
    }
  },

  setCurrentGuess: (guess: string) => {
    set({ currentGuess: guess.toUpperCase() });
  },

  resetGame: () => {
    set({
      word: null,
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      error: null,
    });
  },
}));
