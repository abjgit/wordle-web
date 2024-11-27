import dotenv from 'dotenv';

dotenv.config();

export const APP_CONFIG = {
  url: process.env.VITE_APP_URL || 'https://wordle-web-nu.vercel.app',
  botToken: process.env.BOT_TOKEN
};
