import type { VercelRequest, VercelResponse } from '@vercel/node';
import { APP_CONFIG } from '../src/config';

interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
    language_code?: string;
  };
  chat: {
    id: number;
    first_name: string;
    username?: string;
    type: string;
  };
  date: number;
  text: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    from: TelegramMessage['from'];
    message: TelegramMessage;
    data: string;
  };
}

async function sendTelegramMessage(chatId: number, text: string, keyboard?: any): Promise<void> {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN not configured');
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const body: any = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  };

  if (keyboard) {
    body.reply_markup = keyboard;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
  }
}

async function answerCallbackQuery(queryId: string, text?: string): Promise<void> {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN not configured');
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`;
  
  const body: any = {
    callback_query_id: queryId
  };

  if (text) {
    body.text = text;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
  }
}

const gameKeyboard = {
  inline_keyboard: [[{
    text: "🎮 Play Wordle",
    web_app: {
      url: APP_CONFIG.url
    }
  }]]
};

const helpKeyboard = {
  inline_keyboard: [
    [{
      text: "🎮 Play Now",
      web_app: {
        url: APP_CONFIG.url
      }
    }],
    [{
      text: "📖 How to Play",
      callback_data: "howto"
    }],
    [{
      text: "🏆 Leaderboard",
      callback_data: "leaderboard"
    }]
  ]
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update: TelegramUpdate = req.body;
    
    // Handle callback queries (button clicks)
    if (update.callback_query) {
      const { id, from, data } = update.callback_query;
      const chatId = update.callback_query.message.chat.id;

      switch (data) {
        case 'howto':
          const howToText = `🎯 <b>How to Play Wordle</b>

1️⃣ You have 6 attempts to guess a 5-letter word
2️⃣ After each guess, the color of the tiles will change:

🟩 <b>Green:</b> Letter is correct and in the right spot
🟨 <b>Yellow:</b> Letter is in the word but in the wrong spot
⬜ <b>Gray:</b> Letter is not in the word

✨ <b>Tips:</b>
• Start with words that have common letters
• Use the colors to narrow down possibilities
• Keep track of eliminated letters

Ready to play? Click the button below! 👇`;
          
          await answerCallbackQuery(id);
          await sendTelegramMessage(chatId, howToText, gameKeyboard);
          break;

        case 'leaderboard':
          // TODO: Implement leaderboard functionality
          await answerCallbackQuery(id, "🏗️ Leaderboard coming soon!");
          break;

        default:
          await answerCallbackQuery(id, "⚠️ Unknown command");
      }

      return res.status(200).json({ ok: true });
    }

    // Handle regular messages
    if (!update.message) {
      return res.status(400).json({ error: 'No message in update' });
    }

    const { chat, text } = update.message;

    switch (text) {
      case '/start':
        const welcomeText = `🎮 <b>Welcome to Wordle Web!</b>

Try to guess the 5-letter word in 6 attempts. After each guess, the colors will show how close you are:

🟩 Green = Correct letter, right spot
🟨 Yellow = Correct letter, wrong spot
⬜ Gray = Letter not in word

Need help? Use these commands:
/play - Start a new game
/help - Show game instructions
/stats - View your statistics

Click below to start playing! 👇`;

        await sendTelegramMessage(chat.id, welcomeText, helpKeyboard);
        break;

      case '/play':
        await sendTelegramMessage(chat.id, "🎮 Ready to play? Click the button below!", gameKeyboard);
        break;

      case '/help':
        await sendTelegramMessage(chat.id, "❓ What would you like to know?", helpKeyboard);
        break;

      case '/stats':
        // TODO: Implement stats functionality
        await sendTelegramMessage(chat.id, "🏗️ Statistics feature coming soon!\n\nIn the meantime, why not play a game?", gameKeyboard);
        break;

      default:
        await sendTelegramMessage(
          chat.id,
          "🤔 I don't understand that command. Try /help to see what I can do!",
          helpKeyboard
        );
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error handling telegram webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
