require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN not found in environment variables');
  process.exit(1);
}

const commands = [
  {
    command: 'start',
    description: 'Start the bot and get game instructions'
  },
  {
    command: 'play',
    description: 'Play Wordle Web'
  }
];

async function setupBot() {
  try {
    // Set bot commands
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commands })
      }
    );

    const data = await response.json();

    if (data.ok) {
      console.log('✅ Bot commands configured successfully!');
    } else {
      console.error('❌ Failed to configure bot commands:', data.description);
    }
  } catch (error) {
    console.error('❌ Error setting up bot:', error);
  }
}

setupBot();
