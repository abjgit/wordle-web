export const GAME_CONFIG = {
  MAX_ATTEMPTS: 6,
  WORD_LENGTH: 5,
  BASE_POINTS: 100,
  STREAK_MULTIPLIER: 0.1,  // 10% bonus for each game in streak
  ATTEMPTS_MULTIPLIER: 20,  // 20 points bonus for each remaining attempt
} as const;

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
} as const;

export const THIRDWEB_CONFIG = {
  activeChain: "avalanche",
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID
} as const;
