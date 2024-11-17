export type GameTier = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface User {
  id: string;
  walletAddress?: string;
  email?: string;
  tier: GameTier;
  points: number;
  gamesPlayed: number;
  attemptsToday: number;
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
  userId: string;
  username: string;
  points: number;
  tier: GameTier;
  gamesWon: number;
}
