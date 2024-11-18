export type GameTier = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface User {
  id: string;
  email?: string;
  address?: string;
  totalPoints: number;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayed?: Date;
}

export interface GameState {
  word: string;
  currentGuess: string;
  guesses: string[];
  statuses: string[][];
  attempts: string[];
  isFinished: boolean;
  won: boolean;
}

export interface TierConfig {
  dailyAttempts: number;
  pointsMultiplier: number;
  requiredPoints?: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface GameStore {
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  initGame: () => Promise<void>;
  makeGuess: (guess: string) => Promise<void>;
  resetGame: () => void;
}

export interface LeaderboardEntry {
  id: string;
  email?: string;
  address?: string;
  totalPoints: number;
  gamesPlayed: number;
  gamesWon: number;
  bestStreak: number;
}
