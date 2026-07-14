const config = require('../config');
const { extractReportFields } = require('../services/claudeService');
const { createNotionRow } = require('../services/notionService');

async function handleForumPostMessage(thread, starterMessage) {
  const parentId = thread.parentId;
  const isBug = parentId === config.bugForumChannelId;
  const isSuggestion = parentId === config.suggestionForumChannelId;

  if (!isBug && !isSuggestion) {
    console.log('[skip] 대상 채널 아님 →', parentId);
    return;
  }

  const type = isBug ? '버그' : '개선사항';
  const content = starterMessage.content ?? '';

  const parsed = await extractReportFields({
    type,
    title: thread.name,
    content,
  });

  await createNotionRow({
    ...parsed,
    type,
    reporter: starterMessage.author?.username ?? 'unknown',
    sourceUrl: thread.url,
    rawContent: content,
  });

  console.log('[완료] Notion 저장 성공 →', thread.name);
}

module.exports = { handleForumPostMessage };