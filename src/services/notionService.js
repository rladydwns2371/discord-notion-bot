const { Client } = require('@notionhq/client');
const config = require('../config');
const { DOMAIN_OWNERS } = require('../domainOwners');

const notion = new Client({ auth: config.notionApiKey });

async function createNotionRow({ summary, domain, type, reporter, sourceUrl, rawContent }) {
  const assignee = DOMAIN_OWNERS[domain];

  const properties = {
    '제목': { title: [{ text: { content: summary } }] },
    '유형': { select: { name: type } },
    '도메인': { select: { name: domain } },
    '상태': { select: { name: '접수' } },
    '제보자(Discord 닉네임)': { rich_text: [{ text: { content: reporter } }] },
    '원본링크': { url: sourceUrl },
    '제보 내용': { rich_text: [{ text: { content: rawContent.slice(0, 1900) } }] },
    '접수일': { date: { start: new Date().toISOString().slice(0, 10) } },
  };

  if (assignee) {
    properties['담당자'] = { select: { name: assignee } };
  }

  await notion.pages.create({
    parent: { database_id: config.notionDatabaseId },
    properties,
  });
}

module.exports = { createNotionRow };