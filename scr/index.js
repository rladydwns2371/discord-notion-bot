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
  console.log('설정된 버그 채널 ID:', config.bugForumChannelId);
  console.log('설정된 개선사항 채널 ID:', config.suggestionForumChannelId);
});

client.on('threadCreate', async (thread) => {
  console.log('새 스레드 감지됨 →', thread.name, '| parentId:', thread.parentId);
  try {
    await handleForumThreadCreate(thread);
  } catch (err) {
    console.error('forum thread handling failed', err);
  }
});

client.login(config.discordBotToken);