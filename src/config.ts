// Game configuration
export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;
export const BASE_POINTS = 100;
export const BONUS_POINTS_PER_REMAINING_TRY = 20;

// Firebase configuration
export const FIREBASE_CONFIG = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// ThirdWeb configuration
export const THIRDWEB_CONFIG = {
  activeChain: "mumbai",
  clientId: process.env.VITE_THIRDWEB_CLIENT_ID,
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
