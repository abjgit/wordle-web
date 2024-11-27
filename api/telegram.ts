import type { VercelRequest, VercelResponse } from '@vercel/node';
import { APP_CONFIG } from './config';

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

async function sendTelegramMessage(chatId: number, text: string, keyboard?: any) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${APP_CONFIG.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          reply_markup: keyboard,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

async function answerCallbackQuery(queryId: string, text?: string) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${APP_CONFIG.botToken}/answerCallbackQuery`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callback_query_id: queryId,
          text,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error('Error answering callback query:', error);
    throw error;
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
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const update = req.body as TelegramUpdate;
    console.log('Received update:', JSON.stringify(update, null, 2));

    if (update.message?.text) {
      const { chat, text } = update.message;

      switch (text.toLowerCase()) {
        case '/start':
          await sendTelegramMessage(
            chat.id,
            `👋 Welcome to Wordle Web!\n\nPlay the classic word game with a Web3 twist. Earn points, compete with others, and climb the leaderboard!\n\nClick the button below to start playing:`,
            gameKeyboard
          );
          break;

        case '/help':
          await sendTelegramMessage(
            chat.id,
            `🎮 <b>How to Play Wordle Web</b>\n\n` +
            `1️⃣ You have 6 attempts to guess a 5-letter word\n` +
            `2️⃣ After each guess, the color of the tiles will change:\n` +
            `   🟩 Green: Letter is correct and in right position\n` +
            `   🟨 Yellow: Letter is in the word but wrong position\n` +
            `   ⬜ Gray: Letter is not in the word\n\n` +
            `3️⃣ Connect your wallet to save progress and earn points!\n\n` +
            `Ready to play? Click the button below:`,
            helpKeyboard
          );
          break;

        case '/stats':
          // TODO: Implement stats
          await sendTelegramMessage(
            chat.id,
            '📊 Stats feature coming soon!',
            gameKeyboard
          );
          break;

        default:
          await sendTelegramMessage(
            chat.id,
            `Sorry, I don't understand that command. Try /help for available commands.`,
            gameKeyboard
          );
      }
    } else if (update.callback_query) {
      const { id, message, data } = update.callback_query;

      switch (data) {
        case 'howto':
          await answerCallbackQuery(id);
          await sendTelegramMessage(
            message.chat.id,
            `🎮 <b>How to Play Wordle Web</b>\n\n` +
            `1️⃣ You have 6 attempts to guess a 5-letter word\n` +
            `2️⃣ After each guess, the color of the tiles will change:\n` +
            `   🟩 Green: Letter is correct and in right position\n` +
            `   🟨 Yellow: Letter is in the word but wrong position\n` +
            `   ⬜ Gray: Letter is not in the word\n\n` +
            `3️⃣ Connect your wallet to save progress and earn points!\n\n` +
            `Ready to play? Click the button below:`,
            gameKeyboard
          );
          break;

        case 'leaderboard':
          await answerCallbackQuery(id);
          await sendTelegramMessage(
            message.chat.id,
            '🏆 Leaderboard feature coming soon!',
            gameKeyboard
          );
          break;
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error handling update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
