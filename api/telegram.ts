import type { VercelRequest, VercelResponse } from '@vercel/node';
import { APP_CONFIG } from '../src/config';

async function sendTelegramMessage(chatId: number, text: string, keyboard?: any): Promise<void> {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const body: any = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  };

  if (keyboard) {
    body.reply_markup = keyboard;
  }
  
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'No message in request body' });
    }

    const chatId = message.chat.id;

    if (message.text === '/start') {
      const welcomeText = `🎮 Welcome to Wordle Web! 
      
🎯 Try to guess the 5-letter word in 6 attempts.
🟩 Green means the letter is correct and in the right position
🟨 Yellow means the letter is in the word but in the wrong position
⬜ Gray means the letter is not in the word

Click the button below to start playing!`;

      const keyboard = {
        inline_keyboard: [[{
          text: "🎮 Play Wordle",
          web_app: {
            url: APP_CONFIG.url
          }
        }]]
      };

      await sendTelegramMessage(chatId, welcomeText, keyboard);
    } 
    else if (message.text === '/play') {
      const keyboard = {
        inline_keyboard: [[{
          text: "🎮 Play Wordle",
          web_app: {
            url: APP_CONFIG.url
          }
        }]]
      };

      await sendTelegramMessage(chatId, "🎮 Click the button below to play Wordle!", keyboard);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error handling telegram webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
