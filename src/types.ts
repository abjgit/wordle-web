export type LetterStatus = 'correct' | 'present' | 'absent' | 'unused';

export interface GameState {
  word: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  letterStatuses: Record<string, LetterStatus>;
  currentRow: number;
}

export interface User {
  id: string;
  address: string;
  points: number;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedAt: Date | null;
  [key: string]: string | number | Date | null | undefined;
}

export interface KeyboardState {
  [key: string]: LetterStatus;
}
