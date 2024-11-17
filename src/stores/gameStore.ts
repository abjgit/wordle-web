import { create } from 'zustand';
import { GameState, GameStore } from '@/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { WORD_LENGTH, MAX_ATTEMPTS, BASE_POINTS, BONUS_POINTS_PER_REMAINING_TRY, TIERS } from '@/config';
import { useAuthStore } from './authStore';

// Lista de palabras de prueba para desarrollo
const TEST_WORDS = ['HOUSE', 'LIGHT', 'BRAIN', 'PHONE', 'WATER'];

const calculatePoints = (attempts: number, tier: string): number => {
  if (attempts >= MAX_ATTEMPTS) return 0;
  
  const remainingTries = MAX_ATTEMPTS - attempts;
  const base = BASE_POINTS;
  const bonus = remainingTries * BONUS_POINTS_PER_REMAINING_TRY;
  const multiplier = TIERS[tier].pointsMultiplier;
  
  return Math.floor((base + bonus) * multiplier);
};

const checkGuess = (guess: string, word: string): string[] => {
  const result: string[] = Array(WORD_LENGTH).fill('');
  const wordArray = word.split('');
  const guessArray = guess.split('');

  // First pass: check for correct positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArray[i] === wordArray[i]) {
      result[i] = 'correct';
      wordArray[i] = '*';
      guessArray[i] = '*';
    }
  }

  // Second pass: check for correct letters in wrong positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArray[i] !== '*') {
      const index = wordArray.indexOf(guessArray[i]);
      if (index !== -1) {
        result[i] = 'present';
        wordArray[index] = '*';
      } else if (result[i] === '') {
        result[i] = 'absent';
      }
    }
  }

  return result;
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  isLoading: false,
  error: null,

  initGame: async () => {
    set({ isLoading: true, error: null });
    try {
      const today = new Date().toISOString().split('T')[0];
      const wordDoc = await getDoc(doc(db, 'dailyWords', today));
      
      let word;
      if (!wordDoc.exists()) {
        // Si no hay palabra para hoy, usar una palabra de prueba
        const randomIndex = Math.floor(Math.random() * TEST_WORDS.length);
        word = TEST_WORDS[randomIndex];
        
        // Guardar la palabra en Firestore
        await setDoc(doc(db, 'dailyWords', today), { word });
      } else {
        word = wordDoc.data().word;
      }

      set({
        gameState: {
          word,
          currentGuess: '',
          guesses: Array(MAX_ATTEMPTS).fill(''),
          statuses: Array(MAX_ATTEMPTS).fill(Array(WORD_LENGTH).fill('')),
          attempts: [],
          isFinished: false,
          won: false,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Error initializing game:', error);
      // En caso de error, usar una palabra de prueba
      const randomIndex = Math.floor(Math.random() * TEST_WORDS.length);
      const word = TEST_WORDS[randomIndex];
      
      set({
        gameState: {
          word,
          currentGuess: '',
          guesses: Array(MAX_ATTEMPTS).fill(''),
          statuses: Array(MAX_ATTEMPTS).fill(Array(WORD_LENGTH).fill('')),
          attempts: [],
          isFinished: false,
          won: false,
        },
        isLoading: false,
        error: null,
      });
    }
  },

  makeGuess: async (guess: string) => {
    const { gameState } = get();
    if (!gameState || gameState.isFinished || guess.length !== WORD_LENGTH) return;

    const newGuesses = [...gameState.guesses];
    const newStatuses = [...gameState.statuses];
    const currentAttempt = gameState.attempts.length;

    newGuesses[currentAttempt] = guess;
    newStatuses[currentAttempt] = checkGuess(guess, gameState.word);

    const isWon = guess === gameState.word;
    const isFinished = isWon || currentAttempt + 1 >= MAX_ATTEMPTS;

    set({
      gameState: {
        ...gameState,
        guesses: newGuesses,
        statuses: newStatuses,
        attempts: [...gameState.attempts, guess],
        currentGuess: '',
        isFinished,
        won: isWon,
      },
    });

    if (isFinished) {
      const { user } = useAuthStore.getState();
      if (user) {
        const points = isWon ? calculatePoints(currentAttempt + 1, user.tier) : 0;
        await setDoc(doc(db, 'users', user.id), {
          points: user.points + points,
          gamesPlayed: user.gamesPlayed + 1,
          lastPlayed: new Date(),
        }, { merge: true });
      }
    }
  },

  resetGame: () => {
    set({
      gameState: null,
      error: null,
    });
  },
}));
