import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { APP_CONFIG } from './config.js';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN not found in environment variables');
  process.exit(1);
}

interface TelegramResponse {
  ok: boolean;
  description?: string;
  result?: any;
}

async function setWebhook() {
  try {
    const webhookUrl = `${APP_CONFIG.url}/api/telegram`;
    
    // Delete any existing webhook
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
    
    // Set the new webhook
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query']
        })
      }
    );

    const data = await response.json() as TelegramResponse;

    if (data.ok) {
      console.log('✅ Webhook set successfully!');
      console.log('📡 Webhook URL:', webhookUrl);
    } else {
      console.error('❌ Failed to set webhook:', data.description);
    }

    // Get webhook info
    const infoResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
    );
    const infoData = await infoResponse.json() as TelegramResponse;
    console.log('\n📊 Webhook Info:', JSON.stringify(infoData, null, 2));

  } catch (error) {
    console.error('❌ Error setting webhook:', error);
  }
}

setWebhook();
