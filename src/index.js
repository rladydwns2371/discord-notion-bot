const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config');
const { handleForumThreadCreate } = require('./handlers/forumPostHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('threadCreate', async (thread) => {
  try {
    await handleForumThreadCreate(thread);
  } catch (err) {
    console.error('forum thread handling failed', err);
  }
});

client.login(config.discordBotToken);
