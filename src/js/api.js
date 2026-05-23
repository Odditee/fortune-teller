/* ========================================
   api.js — Calls backend proxy (key stays on server)
   ======================================== */

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
`;
  });
  p += `\n## 要求
1. 回顾用户问题
2. 按牌阵位置逐一解读（结合正逆位）
3. 分析牌阵联动关系
4. 给出综合建议
5. 风格：神秘深刻、温暖有力，400-600字`;
  return p;
}

async function callDeepSeekAPI(prompt, retries = 2) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const resp = await fetch('/api/reading', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      clearTimeout(timeout);
      const data = await resp.json();
      if (!resp.ok) {
        const msg = data.error || `Server Error(${resp.status})`;
        if (resp.status === 429 || resp.status >= 500) throw new Error(msg);
        throw new Error(msg);
      }
      return data.content;
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;
      const isRetryable = err.name === 'AbortError' ||
        err.message?.includes('429') || err.message?.includes('500') ||
        err.message?.includes('503') || err.message?.includes('fetch') ||
        err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError');
      if (attempt < retries && isRetryable) {
        await new Promise(r => setTimeout(r, (attempt + 1) * 1500));
        continue;
      }
      break;
    }
  }
  throw lastError;
}

async function getTarotReading(question, spread, drawnCards, context) {
  try {
    return await callDeepSeekAPI(buildReadingPrompt(question, spread, drawnCards, context));
  } catch (err) {
    console.warn('AI reading failed after retries:', err.message);
    return `<p style="text-align:center;color:var(--text-accent);margin-bottom:10px;font-family:var(--font-display);">Offline Reading · 离线解读</p>
<p style="text-align:center;color:var(--text-dim);font-size:0.85rem;margin-bottom:18px;">AI service temporarily unavailable · AI 服务暂不可用<br><small>${err.message || 'Network error'}</small></p>
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
      <p style="margin-top:6px;line-height:1.8">${meaning || 'Content pending... 内容待补充'}</p>
    </div>`;
  });
  return html;
}
