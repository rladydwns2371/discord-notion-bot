require('dotenv').config();

module.exports = {
  discordBotToken: process.env.DISCORD_BOT_TOKEN,
  bugForumChannelId: process.env.BUG_FORUM_CHANNEL_ID,
  suggestionForumChannelId: process.env.SUGGESTION_FORUM_CHANNEL_ID,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  notionApiKey: process.env.NOTION_API_KEY,
  notionDatabaseId: process.env.NOTION_DATABASE_ID,
};
