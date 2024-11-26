export type LetterStatus = 'unused' | 'absent' | 'present' | 'correct';

export interface GameState {
  word: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  letterStatuses: Record<string, LetterStatus>;
  currentRow: number;
  statuses: LetterStatus[][];
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayed: Date;
}
