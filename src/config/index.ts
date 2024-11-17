import { TierConfig } from '@/types';

export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;
export const BASE_POINTS = 100;
export const BONUS_POINTS_PER_REMAINING_TRY = 50;

export const TIERS: Record<string, TierConfig> = {
  BEGINNER: {
    dailyAttempts: 1,
    pointsMultiplier: 1,
  },
  INTERMEDIATE: {
    dailyAttempts: 2,
    pointsMultiplier: 1.5,
    requiredPoints: 1000,
  },
  ADVANCED: {
    dailyAttempts: 3,
    pointsMultiplier: 2,
    requiredPoints: 2500,
  },
};

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const THIRDWEB_CONFIG = {
  activeChain: "avalanche",
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
};
