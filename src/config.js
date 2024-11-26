"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIERS = exports.BOT_CONFIG = exports.THIRDWEB_CONFIG = exports.FIREBASE_CONFIG = exports.APP_CONFIG = exports.BONUS_POINTS_PER_REMAINING_TRY = exports.BASE_POINTS = exports.MAX_ATTEMPTS = exports.WORD_LENGTH = void 0;
// Game configuration
exports.WORD_LENGTH = 5;
exports.MAX_ATTEMPTS = 6;
exports.BASE_POINTS = 100;
exports.BONUS_POINTS_PER_REMAINING_TRY = 20;
// App configuration
exports.APP_CONFIG = {
    name: 'Wordle Web',
    description: 'A Web3-enabled Wordle game',
    domain: process.env.NODE_ENV === 'production'
        ? 'wordle-web-nu.vercel.app'
        : 'localhost:5173',
    url: process.env.NODE_ENV === 'production'
        ? 'https://wordle-web-nu.vercel.app'
        : 'http://localhost:5173',
};
// Firebase configuration
exports.FIREBASE_CONFIG = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
// ThirdWeb configuration
exports.THIRDWEB_CONFIG = {
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
};
// Bot configuration
exports.BOT_CONFIG = {
    token: import.meta.env.BOT_TOKEN,
};
// Game tiers configuration
exports.TIERS = {
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
        dailyAttempts: 7,
        pointsMultiplier: 2,
        requiredPoints: 5000,
    }
};
