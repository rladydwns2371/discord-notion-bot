const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config');

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const DOMAINS = [
  'admin', 'auth', 'badge', 'chatbot', 'course', 'enrollment',
  'learning', 'lecture', 'problems', 'ranking', 'recommendation',
  'reward', 'submission', 'user',
];

async function extractReportFields({ type, title, content }) {
  const prompt = `다음은 Discord ${type} 제보입니다. 아래 JSON 형식으로만, 다른 말 없이 답하세요.
{"summary": "20자 이내 제목 요약", "domain": "${DOMAINS.join('|')} 중 가장 가까운 하나"}

제목: ${title}
본문: ${content}`;

  console.log('[1] Claude에게 보낼 프롬프트 준비 완료 →', title);

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const rawText = response.content[0].text;
  console.log('[2] Claude 응답 원문 →', rawText);

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Claude 응답에서 JSON을 찾을 수 없음: ${rawText}`);
  }

  const parsed = JSON.parse(jsonMatch[0]);
  console.log('[3] 파싱된 결과 →', parsed);

  return parsed;
}

module.exports = { extractReportFields };
