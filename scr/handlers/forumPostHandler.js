const config = require('../config');
const { extractReportFields } = require('../services/claudeService');
const { createNotionRow } = require('../services/notionService');

async function handleForumThreadCreate(thread) {
  const parentId = thread.parentId;
  const isBug = parentId === config.bugForumChannelId;
  const isSuggestion = parentId === config.suggestionForumChannelId;
  if (!isBug && !isSuggestion) return;

  const type = isBug ? '버그' : '개선사항';
  const starterMessage = await thread.fetchStarterMessage();
  const content = starterMessage?.content ?? '';

  const parsed = await extractReportFields({ type, title: thread.name, content });

  await createNotionRow({
    ...parsed,
    type,
    reporter: starterMessage?.author?.username ?? 'unknown',
    sourceUrl: thread.url,
    rawContent: content,
  });
}

module.exports = { handleForumThreadCreate };