/* ========================================
   api.js — DeepSeek API integration
   Uses embedded key — AI reading works out of the box.
   ======================================== */

const TAROT_API_KEY = 'sk-127484eb7cba4aac895a05c14e6d233c';

function buildReadingPrompt(question, spread, drawnCards, context) {
  let p = `你是一位资深塔罗解读师。请根据以下信息做详细中文解读。

## 用户问题
${question}
`;
  if (context) {
    p += `## 问题背景
${context}
`;
  }
  p += `## 牌阵：${spread.name} / ${spread.nameZh}（${spread.cardCount} Cards）
${spread.descriptionZh || spread.description}

## 抽到的牌
`;
  drawnCards.forEach((dc, i) => {
    const card = getCardById(dc.cardId);
    const pos = spread.positions[i];
    if (!card) return;
    const m = dc.isReversed ? card.reversed : card.upright;
    p += `### ${pos.nameZh || pos.name}（${pos.descriptionZh || pos.description}）：${card.name}（${card.nameEn}）${dc.isReversed ? '逆位' : '正位'}
含义：${m.meaning || ''}
象征：${m.symbolism || ''}
典故：${m.story || ''}
`;
  });
  p += `\n## 要求
1. 回顾用户问题
2. 按牌阵位置逐一解读（结合正逆位、象征、典故）
3. 分析牌阵联动关系
4. 给出综合建议
5. 风格：神秘深刻、温暖有力，500-800字`;
  return p;
}

async function callDeepSeekAPI(prompt) {
  const apiKey = (await getSetting('tarot-api-key')) || TAROT_API_KEY;
  const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 1500,
      temperature: 0.8,
      messages: [
        { role: 'system', content: '你是资深塔罗解读师，精通78张牌的含义与典故。解读神秘深刻，温暖有力。始终用中文，用"你"称呼用户。' },
        { role: 'user', content: prompt },
      ],
    }),
  });
  if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error(e.error?.message || `API Error(${resp.status})`); }
  const data = await resp.json();
  return data.choices[0].message.content;
}

async function getTarotReading(question, spread, drawnCards, context) {
  try {
    return await callDeepSeekAPI(buildReadingPrompt(question, spread, drawnCards, context));
  } catch (err) {
    console.warn('AI reading failed, using offline fallback:', err.message);
    return `<p style="text-align:center;color:var(--text-accent);margin-bottom:10px;font-family:var(--font-display);">Offline Reading · 离线解读</p>
<p style="text-align:center;color:var(--text-dim);font-size:0.85rem;margin-bottom:18px;">AI service temporarily unavailable</p>
${generateFallbackCardSummary()}`;
  }
}

function generateFallbackCardSummary() {
  const spread = AppState.selectedSpread;
  if (!spread) return '';
  let html = '';
  AppState.drawnCards.forEach((dc, i) => {
    const card = getCardById(dc.cardId);
    const pos = spread.positions[i];
    if (!card) return;
    const meaning = dc.isReversed ? card.reversed.meaning : card.upright.meaning;
    html += `<div style="margin-bottom:14px;padding:10px;border-left:2px solid var(--border-accent);padding-left:12px">
      <strong style="color:var(--text-accent)">【${pos ? (pos.nameZh || pos.name) : ''}】${card.name} / ${card.nameEn}（${dc.isReversed ? 'Reversed 逆位' : 'Upright 正位'}）</strong>
      <p style="margin-top:6px;line-height:1.8">${meaning || 'Content pending...'}</p>
    </div>`;
  });
  return html;
}
