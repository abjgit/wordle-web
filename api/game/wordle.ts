import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

interface GameState {
  word: string;
  attempts: string[];
  startedAt: Date;
  completed: boolean;
  won: boolean;
}

interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayed: Date;
}

// List of valid 5-letter words in English
const WORDS = [
  'WORLD', 'HELLO', 'GAMES', 'HOUSE', 'TABLE',
  'CHAIR', 'PLATE', 'PHONE', 'WATER', 'LIGHT',
  'PAPER', 'MUSIC', 'CLOCK', 'BEACH', 'NIGHT',
  'SPACE', 'EARTH', 'DREAM', 'BRAIN', 'SMILE'
];

export async function startNewGame(userId: string): Promise<string> {
  // Select a random word
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  
  // Create new game state
  const gameState: GameState = {
    word,
    attempts: [],
    startedAt: new Date(),
    completed: false,
    won: false
  };

  // Save state to Firestore
  await db.collection('games').doc(userId).set(gameState);

  return 'New game started! You have 6 attempts to guess the 5-letter word.\n\nSend a 5-letter word as your guess.';
}

export async function makeGuess(userId: string, guess: string): Promise<string> {
  // Get current game state
  const gameDoc = await db.collection('games').doc(userId).get();
  if (!gameDoc.exists) {
    return 'No active game found. Use /play to start a new game.';
  }

  const gameState = gameDoc.data() as GameState;
  
  // Check if game is already finished
  if (gameState.completed) {
    return 'This game is already finished. Use /play to start a new one.';
  }

  // Validate guess
  guess = guess.toUpperCase();
  if (guess.length !== WORD_LENGTH) {
    return `Word must be ${WORD_LENGTH} letters long.`;
  }

  if (!WORDS.includes(guess)) {
    return 'Not a valid word. Try again.';
  }

  // Process guess
  const result = evaluateGuess(gameState.word, guess);
  gameState.attempts.push(guess);

  // Check for win or loss
  if (guess === gameState.word) {
    gameState.completed = true;
    gameState.won = true;
    await updateStats(userId, true);
    await db.collection('games').doc(userId).set(gameState);
    return `Congratulations! You guessed the word ${gameState.word} in ${gameState.attempts.length} attempts.\n\n${formatGameResult(gameState)}`;
  }

  if (gameState.attempts.length >= MAX_ATTEMPTS) {
    gameState.completed = true;
    await updateStats(userId, false);
    await db.collection('games').doc(userId).set(gameState);
    return `Game Over! The word was ${gameState.word}.\n\n${formatGameResult(gameState)}`;
  }

  // Update state and return result
  await db.collection('games').doc(userId).set(gameState);
  return `Attempt ${gameState.attempts.length}/${MAX_ATTEMPTS}:\n${result}\n\nKeep trying...`;
}

function evaluateGuess(word: string, guess: string): string {
  let result = '';
  const wordArray = word.split('');
  const guessArray = guess.split('');

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArray[i] === wordArray[i]) {
      result += '🟩'; // Correct letter in correct position
    } else if (wordArray.includes(guessArray[i])) {
      result += '🟨'; // Correct letter in wrong position
    } else {
      result += '⬜'; // Wrong letter
    }
  }

  return `${guess}\n${result}`;
}

async function updateStats(userId: string, won: boolean) {
  const statsRef = db.collection('stats').doc(userId);
  const statsDoc = await statsRef.get();
  
  let stats: UserStats;
  if (statsDoc.exists) {
    stats = statsDoc.data() as UserStats;
    stats.gamesPlayed++;
    if (won) {
      stats.gamesWon++;
      stats.currentStreak++;
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
      stats.currentStreak = 0;
    }
    stats.lastPlayed = new Date();
  } else {
    stats = {
      gamesPlayed: 1,
      gamesWon: won ? 1 : 0,
      currentStreak: won ? 1 : 0,
      maxStreak: won ? 1 : 0,
      lastPlayed: new Date()
    };
  }

  await statsRef.set(stats);
}

function formatGameResult(gameState: GameState): string {
  let result = 'Wordle Web ' + (gameState.won ? gameState.attempts.length : 'X') + '/6\n\n';
  for (const attempt of gameState.attempts) {
    result += evaluateGuess(gameState.word, attempt) + '\n';
  }
  return result;
}

export async function getStats(userId: string): Promise<string> {
  const statsDoc = await db.collection('stats').doc(userId).get();
  if (!statsDoc.exists) {
    return 'You haven\'t played any games yet. Use /play to start.';
  }

  const stats = statsDoc.data() as UserStats;
  const winRate = Math.round((stats.gamesWon / stats.gamesPlayed) * 100);

  return `📊 Statistics:\n\n` +
         `Games played: ${stats.gamesPlayed}\n` +
         `Games won: ${stats.gamesWon}\n` +
         `Win rate: ${winRate}%\n` +
         `Current streak: ${stats.currentStreak}\n` +
         `Best streak: ${stats.maxStreak}`;
}
