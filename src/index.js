const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const config = require('./config');
const { handleForumPostMessage } = require('./handlers/forumPostHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.channel?.isThread()) return;

    const thread = message.channel;

    // 포럼 게시글의 첫 메시지만 처리
    if (message.id !== thread.id) return;

    await handleForumPostMessage(thread, message);
  } catch (err) {
    console.error('forum post message handling failed', err);
  }
});

client.login(config.discordBotToken);