// Game configuration
export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;
export const BASE_POINTS = 100;
export const BONUS_POINTS_PER_REMAINING_TRY = 20;

// App configuration
export const APP_CONFIG = {
  name: 'Wordle Web',
  description: 'A Web3-enabled Wordle game',
  domain: process.env.NODE_ENV === 'production' 
    ? 'wordle-f398zs3g7-abjgits-projects.vercel.app'
    : 'localhost:5173',
  url: process.env.NODE_ENV === 'production'
    ? 'https://wordle-f398zs3g7-abjgits-projects.vercel.app'
    : 'http://localhost:5173',
};

// Firebase configuration
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ThirdWeb configuration
export const THIRDWEB_CONFIG = {
  activeChain: "mumbai",
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
};

// Bot configuration
export const BOT_CONFIG = {
  token: import.meta.env.BOT_TOKEN,
};

// Game tiers configuration
export const TIERS = {
  BEGINNER: {
    dailyAttempts: 3,
    pointsMultiplier: 1,
  },
  INTERMEDIATE: {
    dailyAttempts: 5,
    pointsMultiplier: 1.5,
    requiredPoints: 1000,
  },
  ADVANCED: {
    dailyAttempts: 10,
    pointsMultiplier: 2,
    requiredPoints: 5000,
  },
} as const;
