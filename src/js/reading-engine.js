/* ========================================
   reading-engine.js — Professional Local Tarot Engine
   Deep integration of all TarotKnowledge modules.
   Zero API calls. Bilingual output.
   Modes: Structured + Narrative Story
   v3.0 — Three-layer readability + collapsible sections + keyword echoes
   ======================================== */

// --- Deep Analysis Pipeline ---

function analyzeReading(question, spread, drawnCards, context) {
  const TK = TarotKnowledge;
  const cards = drawnCards.map(dc => {
    const data = getCardById(dc.cardId);
    return { ...dc, data };
  }).filter(c => c.data);

  const domain = TK.QUESTION_SYSTEM.detectDomain(question || '');
  const qType = TK.QUESTION_SYSTEM.classify(question || '');

  // Extract keywords from question + context
  let keywords = null;
  if (TK.QUESTION_GUIDANCE && question) {
    keywords = TK.QUESTION_GUIDANCE.extractKeywords(question, context || '');
  }

  // Six-step methodology
  const step1 = TK.METHODOLOGY.sixSteps[0].fn(cards);
  const step2 = TK.METHODOLOGY.sixSteps[1].fn(cards);
  const step3 = TK.METHODOLOGY.sixSteps[2].fn(TK.UTILS.countReversed(drawnCards), cards.length);
  const step4 = TK.METHODOLOGY.sixSteps[3].fn(TK.UTILS.countNumbers(cards));
  const step5 = TK.METHODOLOGY.sixSteps[4].fn(cards);
  const step6 = TK.METHODOLOGY.sixSteps[5].fn(cards, spread, step1, step2);

  // Element analysis
  const elCounts = TK.UTILS.countElements(cards);
  const elTotal = Object.values(elCounts).reduce((a, b) => a + b, 0) || 1;
  const elPcts = {};
  for (const [k, v] of Object.entries(elCounts)) elPcts[k] = Math.round(v / elTotal * 100);
  const elAbsent = Object.entries(elCounts).filter(([,c]) => c === 0).map(([k]) => k);
  const elExcess = Object.entries(elCounts).filter(([,c]) => c / elTotal > 0.5).map(([k]) => k);
  const elDominant = Object.entries(elCounts).sort((a,b) => b[1] - a[1])[0];

  let elSummaryEn = '', elSummaryZh = '';
  if (elDominant && elDominant[1] > 0) {
    const domInfo = TK.ELEMENT_DYNAMICS.elements[elDominant[0]];
    elSummaryEn = `${domInfo.name} energy leads this reading. `;
    elSummaryZh = `${domInfo.nameZh}元素主导此牌阵。`;
    if (elAbsent.length > 0) {
      const absInfo = elAbsent.map(e => TK.ELEMENT_DYNAMICS.elements[e]);
      elSummaryEn += absInfo.map(a => `${a.name} is absent — ${a.absence.en}`).join(' ');
      elSummaryZh += absInfo.map(a => `${a.nameZh}缺失——${a.absence.zh}`).join('');
    }
    if (elExcess.length > 0) {
      const excInfo = TK.ELEMENT_DYNAMICS.elements[elExcess[0]];
      elSummaryEn += ` ${excInfo.name} is in excess — ${excInfo.excess.en}`;
      elSummaryZh += ` ${excInfo.nameZh}过剩——${excInfo.excess.zh}`;
    }
  }

  // Card combinations
  let combos = [];
  if (typeof TAROT_COMBINATIONS !== 'undefined') {
    const ids = drawnCards.map(dc => dc.cardId);
    combos = TAROT_COMBINATIONS.filter(cb => cb.cards.every(id => ids.includes(id)));
  }

  // Dynamic pair analysis
  const dynamicPairs = [];
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      const result = TK.PAIR_RULES.analyze(cards[i], cards[j]);
      if (result) dynamicPairs.push({ indices: [i, j], insights: result });
    }
  }

  const mainCard = findMainCard(cards, spread);
  const courtCards = cards.filter(c => c.data?.rank && ['king','queen','knight','page'].includes(c.data.rank));

  // Suit arcs
  const suitGroups = {};
  cards.forEach(c => {
    if (c.data?.suit && c.data?.number) {
      if (!suitGroups[c.data.suit]) suitGroups[c.data.suit] = [];
      suitGroups[c.data.suit].push(c);
    }
  });
  const suitArcs = [];
  for (const [suit, group] of Object.entries(suitGroups)) {
    if (group.length >= 2 && TK.SUIT_STORIES[suit]) {
      group.sort((a, b) => (a.data.number || 0) - (b.data.number || 0));
      suitArcs.push({ suit, cards: group, story: TK.SUIT_STORIES[suit] });
    }
  }

  const reversalLessons = cards.filter(c => c.isReversed)
    .map(c => ({ card: c, lesson: TK.UTILS.getReversalLesson(c.data) })).filter(r => r.lesson);

  const numberPatterns = step4 || [];
  const rowAnalysis = TK.THREE_ROWS.analyze(cards);
  const rowSummary = rowAnalysis ? TK.THREE_ROWS.buildSummary(rowAnalysis) : null;
  const dignity = TK.CARD_DIGNITY.analyze(cards, spread);
  const contradictions = TK.CONTRADICTORY.detect(cards);
  const contradictionResolution = TK.CONTRADICTORY.buildResolution(contradictions);
  const gateCards = TK.GATE_CARDS.detect(cards);
  const healthNote = TK.HEALTH.buildNote(cards);

  return {
    question, context, domain, qType, spread, cards, keywords,
    step1, step2, step3, step4, step5, step6, numberPatterns,
    elCounts, elPcts, elAbsent, elExcess, elDominant, elSummaryEn, elSummaryZh,
    combos, dynamicPairs, mainCard, courtCards, suitArcs, reversalLessons,
    rowAnalysis, rowSummary, dignity, contradictions, contradictionResolution,
    gateCards, healthNote,
    reversedCount: TK.UTILS.countReversed(drawnCards),
    totalCards: cards.length,
  };
}

function findMainCard(cards, spread) {
  const centralRoles = ['present', 'self', 'outcome'];
  for (const role of centralRoles) {
    const idx = spread?.positions?.findIndex(p => getPositionRole(p) === role);
    if (idx >= 0 && cards[idx]?.data?.arcana === 'major') return { ...cards[idx], positionIndex: idx, reason: 'central' };
  }
  const firstMajor = cards.find(c => c.data?.arcana === 'major');
  if (firstMajor) return { ...firstMajor, positionIndex: cards.indexOf(firstMajor), reason: 'major' };
  return cards.length > 0 ? { ...cards[0], positionIndex: 0, reason: 'first' } : null;
}

function getPositionRole(pos) {
  if (!pos) return null;
  const n = (pos.name || '').toLowerCase();
  const nz = pos.nameZh || '';
  const combined = n + nz;
  if (/past|过去|曾经|之前|以往|往昔/.test(combined)) return 'past';
  if (/present|现在|当前|目前|此刻|当下|今/.test(combined)) return 'present';
  if (/future|将来|之后|未来|以后|前景/.test(combined)) return 'future';
  if (/obstacle|阻碍|挑战|困难|障碍|block|challenge|cross/.test(combined)) return 'obstacle';
  if (/advice|建议|指导|指引|启示/.test(combined)) return 'advice';
  if (/environment|环境|外部|周围|surrounding|氛围/.test(combined)) return 'environment';
  if (/outcome|结果|最终|结局|ending|result/.test(combined)) return 'outcome';
  if (/hope|fear|希望|恐惧|期望|担忧/.test(combined)) return 'hope_fear';
  if (/foundation|基础|根基|根源|basis|bottom|root/.test(combined)) return 'foundation';
  if (/self|自我|自己|本人|querent|significator/.test(combined)) return 'self';
  return null;
}

// ═══════════════════════════════════════════
// DYNAMIC PLAIN SUMMARY v2
// Hybrid: template skeleton + algorithmic slot-filling
// Domain-aware, position-aware, keyword-woven
// ═══════════════════════════════════════════

const DOMAIN_LABELS = {
  love: { zh: '感情', en: 'love and relationships' },
  career: { zh: '事业', en: 'career and work' },
  wealth: { zh: '财富', en: 'finances' },
  study: { zh: '学业', en: 'study and learning' },
  destiny: { zh: '人生方向', en: 'life direction' },
  general: { zh: '生活', en: 'life' },
};

function determineSentiment(a) {
  const kwSents = a.keywords?.sentiment || [];
  if (kwSents.includes('painful') || kwSents.includes('heartbreak')) return 'painful';
  if (kwSents.includes('confused') || kwSents.includes('uncertain')) return 'confused';
  if (kwSents.includes('determined')) return 'determined';
  if (kwSents.includes('anxious') || kwSents.includes('worried')) return 'anxious';
  if (kwSents.includes('hopeful')) return 'hopeful';
  const revRatio = a.reversedCount / Math.max(a.totalCards, 1);
  if (revRatio >= 0.5) return 'anxious';
  if (revRatio >= 0.3) return 'confused';
  return 'hopeful';
}

function getDomainLabel(domain, lang) {
  return DOMAIN_LABELS[domain]?.[lang] || (lang === 'zh' ? '生活' : 'life');
}

// ── Slot builders ──

function buildKeywordEcho(a) {
  const keywords = a.keywords?.keywords || [];
  if (keywords.length > 0) {
    const kwZh = keywords.slice(0, 2).join('、');
    const kwEn = keywords.slice(0, 2).join(', ');
    return {
      zh: `说到你心里放不下的"${kwZh}"`,
      en: `When it comes to "${kwEn}" on your mind`,
    };
  }
  if (a.question) {
    const shortQ = a.question.length > 15 ? a.question.substring(0, 15) + '…' : a.question;
    return { zh: `你问的"${shortQ}"`, en: `You asked about "${shortQ}"` };
  }
  return { zh: '', en: '' };
}

function buildDomainFrame(a) {
  const frames = {
    love: { zh: '在感情的世界里', en: 'In matters of the heart' },
    career: { zh: '在事业的维度上', en: 'In your career landscape' },
    wealth: { zh: '在财富的层面', en: 'On the financial front' },
    study: { zh: '在学业的道路上', en: 'On your learning path' },
    destiny: { zh: '在人生的岔路口', en: 'At life\'s crossroads' },
  };
  return frames[a.domain] || { zh: '', en: '' };
}

function buildCardDomainInsight(card, isReversed, domain) {
  if (!card) return { zh: '', en: '' };
  var meaning = isReversed ? card.reversed : card.upright;
  var dm = meaning?.domains?.[domain];
  var revMarkZh = isReversed ? '（逆位）' : '';
  var revMarkEn = isReversed ? ' (reversed)' : '';

  if (dm) {
    return {
      zh: card.name + revMarkZh + '在' + getDomainLabel(domain, 'zh') + '的维度揭示了：' + dm,
      en: card.nameEn + revMarkEn + ', in ' + getDomainLabel(domain, 'en') + ', reveals: ' + dm,
    };
  }
  var genericZh = (meaning?.meaning || '').split('。')[0] + '。';
  var genericEn = (meaning?.meaning_en || meaning?.meaning || '').split('.')[0] + '.';
  return {
    zh: card.name + revMarkZh + '带来的信息是：' + genericZh,
    en: card.nameEn + revMarkEn + ' brings this: ' + genericEn,
  };
}

function buildMainCardInsight(a) {
  var card = a.mainCard?.data;
  var isRev = a.mainCard?.isReversed;
  if (card) return buildCardDomainInsight(card, isRev, a.domain);
  if (a.cards.length > 0) {
    var c = a.cards[0];
    return buildCardDomainInsight(c.data, c.isReversed, a.domain);
  }
  return { zh: '', en: '' };
}

function buildCardJourney(a) {
  if (a.totalCards < 2) return { zh: '', en: '' };

  var positioned = a.cards.map(function(dc, i) {
    return { cardId: dc.cardId, isReversed: dc.isReversed, data: dc.data, posRole: getPositionRole(a.spread?.positions?.[i]) };
  });

  var past = positioned.filter(function(c) { return c.posRole === 'past'; });
  var present = positioned.filter(function(c) { return c.posRole === 'present'; });
  var future = positioned.filter(function(c) { return c.posRole === 'future'; });

  if (past.length || present.length || future.length) {
    return buildTimeArcJourney(past, present, future);
  }

  var obstacle = positioned.filter(function(c) { return c.posRole === 'obstacle'; });
  var advice = positioned.filter(function(c) { return c.posRole === 'advice'; });
  var outcome = positioned.filter(function(c) { return c.posRole === 'outcome'; });

  if (obstacle.length || advice.length || outcome.length) {
    return buildGuidanceArcJourney(obstacle, advice, outcome);
  }

  var first = positioned[0]?.data;
  var last = positioned[positioned.length - 1]?.data;
  if (first && last && first.id !== last.id) {
    return {
      zh: '牌面从' + first.name + '走向' + last.name + '，一条属于你的路径正在展开。',
      en: 'The spread moves from ' + first.nameEn + ' to ' + last.nameEn + ' — a path uniquely yours is unfolding.',
    };
  }
  return { zh: '', en: '' };
}

function buildTimeArcJourney(past, present, future) {
  var partsZh = [], partsEn = [];

  if (past.length > 0) {
    var p = past[0].data;
    var rev = past[0].isReversed ? '（逆位）' : '';
    partsZh.push('过去被' + p.name + rev + '的能量塑造');
    partsEn.push('the past shaped by ' + p.nameEn + (past[0].isReversed ? ' (reversed)' : ''));
  }
  if (present.length > 0) {
    var p2 = present[0].data;
    var rev2 = present[0].isReversed ? '（逆位）' : '';
    partsZh.push('现在' + p2.name + rev2 + '正在影响你');
    partsEn.push('the present held by ' + p2.nameEn + (present[0].isReversed ? ' (reversed)' : ''));
  }
  if (future.length > 0) {
    var f = future[0].data;
    var rev3 = future[0].isReversed ? '（逆位）' : '';
    partsZh.push('未来' + f.name + rev3 + '在前方召唤');
    partsEn.push('the future calling with ' + f.nameEn + (future[0].isReversed ? ' (reversed)' : ''));
  }

  if (partsZh.length === 0) return { zh: '', en: '' };
  return {
    zh: partsZh.join('，') + '——这是牌面为你展开的时间之流。',
    en: partsEn.join(', ') + ' — this is the flow of time the cards reveal for you.',
  };
}

function buildGuidanceArcJourney(obstacle, advice, outcome) {
  var partsZh = [], partsEn = [];

  if (obstacle.length > 0) {
    var c = obstacle[0].data;
    partsZh.push(c.name + '是你的障碍');
    partsEn.push(c.nameEn + ' is your challenge');
  }
  if (advice.length > 0) {
    var c2 = advice[0].data;
    partsZh.push(c2.name + '给出了建议的方向');
    partsEn.push(c2.nameEn + ' shows the way forward');
  }
  if (outcome.length > 0) {
    var c3 = outcome[0].data;
    partsZh.push(c3.name + '指向可能的结局');
    partsEn.push(c3.nameEn + ' points to the outcome');
  }

  if (partsZh.length === 0) return { zh: '', en: '' };
  return { zh: partsZh.join('，') + '。', en: partsEn.join(', ') + '.' };
}

function buildReversalNote(a) {
  if (a.reversedCount === 0) return { zh: '', en: '' };
  if (a.reversedCount === 1) {
    return {
      zh: '一张逆位牌在提醒你：有一个地方需要向内看，而不是向外找答案。',
      en: 'One reversed card nudges you: there is a place that asks you to look inward, not outward.',
    };
  }
  return {
    zh: a.reversedCount + '张逆位牌——不是坏消息，是需要你换一个角度理解的能量。',
    en: a.reversedCount + ' reversed cards — not bad news, just energy inviting a fresh perspective.',
  };
}

function buildAdviceHint(a, sentiment) {
  var major = a.cards.find(function(c) { return c.data?.arcana === 'major'; });
  if (!major?.data) return { zh: '', en: '' };

  var card = major.data;
  var meaning = major.isReversed ? card.reversed : card.upright;
  var dm = meaning?.domains?.[a.domain];

  if (dm) {
    var oneLine = dm.split('。')[0] + '。';
    return {
      zh: '星辰的指引很清晰：' + oneLine,
      en: 'The stars offer clear guidance through ' + card.nameEn + '.',
    };
  }
  return { zh: '', en: '' };
}

// ── New v3 slot builders: entity-aware, time-aware, conflict-aware ──

function buildEntityEcho(a) {
  const entities = a.keywords?.entities || {};
  const person = entities.person;
  const event = entities.event;

  if (person && event) {
    return {
      zh: `说到"${event}"和"${person}"——`,
      en: `When it comes to "${event}" and "${person}" — `,
    };
  }
  if (person) {
    return {
      zh: `心里那个人——"${person}"——`,
      en: `That person on your mind — "${person}" — `,
    };
  }
  if (event) {
    return {
      zh: `"${event}"这件事——`,
      en: `This "${event}" situation — `,
    };
  }
  return buildKeywordEcho(a);
}

function buildConflictNote(a) {
  var coreConflict = a.keywords?.coreConflict;
  if (!coreConflict) return { zh: '', en: '' };
  var TK = TarotKnowledge;
  var frame = TK.CONFLICT_FRAMES?.[coreConflict];
  if (frame) return { zh: frame.zh, en: frame.en };
  return { zh: '', en: '' };
}

function buildTimeContext(a) {
  var tf = a.keywords?.timeFrame;
  if (tf === 'past') return { zh: '回头看这一路，', en: 'Looking back on this journey, ' };
  if (tf === 'future') return { zh: '望向还没到的前方，', en: 'Gazing toward what lies ahead, ' };
  if (tf === 'immediate') return { zh: '眼前这件事，', en: 'Right now, ' };
  if (tf === 'present') return { zh: '此刻，', en: 'In this moment, ' };
  return { zh: '', en: '' };
}

function buildQuestionTypeFrame(a) {
  var qt = a.keywords?.questionType || a.qType;
  if (qt === 'choice') return { zh: '你在做选择——这不是件容易的事。', en: 'You are choosing — it is never easy. ' };
  if (qt === 'prediction') return { zh: '你想知道前方等的是什么。', en: 'You want to know what awaits. ' };
  if (qt === 'guidance') return { zh: '你在找路。', en: 'You are looking for a way forward. ' };
  if (qt === 'exploration') return { zh: '你想弄明白到底发生了什么。', en: 'You want to understand what is really happening. ' };
  return { zh: '', en: '' };
}

function buildCardPersonality(a) {
  var card = a.mainCard?.data;
  if (!card) return { zh: '', en: '' };
  var TK = TarotKnowledge;
  var lib = TK.CARD_PERSONALITIES;
  if (!lib) return { zh: '', en: '' };
  var entry = lib[card.id];
  if (!entry) return { zh: '', en: '' };
  // Try domain-specific first, fallback to general
  var d = a.domain || 'general';
  var dm = entry[d] || entry.general;
  if (dm) return { zh: dm.zh, en: dm.en };
  return { zh: '', en: '' };
}

function buildSummaryVars(a, sentiment) {
  return {
    entityEcho: buildEntityEcho(a),
    conflictNote: buildConflictNote(a),
    timeContext: buildTimeContext(a),
    questionTypeFrame: buildQuestionTypeFrame(a),
    domainFrame: buildDomainFrame(a),
    mainCardInsight: buildMainCardInsight(a),
    cardPersonality: buildCardPersonality(a),
    cardJourney: buildCardJourney(a),
    reversalNote: buildReversalNote(a),
    adviceHint: buildAdviceHint(a, sentiment),
    keywordEcho: buildKeywordEcho(a),
  };
}

function buildPlainSummary(a) {
  var TK = TarotKnowledge;
  var TL = TK.TEMPLATE_LIBRARY;
  var sentiment = determineSentiment(a);

  var tpl = TL.selectSummaryV2(a.domain, sentiment, a.totalCards, a);
  var zh, en;

  if (tpl) {
    var slots = buildSummaryVars(a, sentiment);
    // Build language-specific flat var maps
    var zhVars = {}, enVars = {};
    for (var key in slots) {
      zhVars[key] = slots[key].zh || '';
      enVars[key] = slots[key].en || '';
    }
    zh = fillTemplate(tpl.zh, zhVars);
    en = fillTemplate(tpl.en, enVars);
  } else {
    var v = buildSummaryVars(a, sentiment);
    zh = [v.entityEcho.zh, v.conflictNote.zh, v.timeContext.zh, v.questionTypeFrame.zh, v.domainFrame.zh, v.mainCardInsight.zh, v.cardPersonality.zh, v.cardJourney.zh, v.reversalNote.zh, v.adviceHint.zh, v.keywordEcho.zh].filter(Boolean).join('');
    en = [v.entityEcho.en, v.conflictNote.en, v.timeContext.en, v.questionTypeFrame.en, v.domainFrame.en, v.mainCardInsight.en, v.cardPersonality.en, v.cardJourney.en, v.reversalNote.en, v.adviceHint.en, v.keywordEcho.en].filter(Boolean).join(' ');
  }

  return '<div class="reading-plain-summary">' +
    '<div class="plain-summary-label-zh">✦ 一目了然</div>' +
    '<p class="reading-prose-zh">' + zh + '</p>' +
    '<div class="plain-summary-label-en">✦ Quick Glimpse</div>' +
    '<p class="reading-prose">' + en + '</p>' +
    '</div>';
}

function fillTemplate(str, vars) {
  if (!str) return '';
  var result = str;
  for (var k in vars) {
    result = result.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k] || '');
  }
  return result;
}

// ═══════════════════════════════════════════
// STRUCTURED READING — Three-Layer Output
// Layer 1: Concise plain summary (always visible)
// Layer 2: Deep card analysis (open by default)
// Layer 3: Practical advice + closing
// ═══════════════════════════════════════════

function buildStructuredReading(a) {
  const TK = TarotKnowledge;
  const TL = TK.TEMPLATE_LIBRARY;
  const sentiment = (a.step3 && a.reversedCount / a.totalCards >= 0.4) ? 'anxious' : 'hopeful';

  let html = '';

  // ═══ LAYER 1: Dynamic plain-language summary — card-specific, keyword-aware ═══
  html += buildPlainSummary(a);

  // ═══ SECTION 1: Opening with question echo — default OPEN ═══
  const openTpl = TL.selectOpening(a.domain, a.qType, sentiment);
  html += `<details class="reading-details" open>`;
  html += `<summary class="reading-section-title">I · Celestial Whisper · 星辰絮语</summary>`;
  html += `<div class="reading-section reading-opening">`;
  html += `<p class="reading-prose-zh">${openTpl.zh}</p>`;
  html += `<p class="reading-prose">${openTpl.en}</p>`;
  if (a.question) {
    const qTypeNames = { choice: { en: 'Decision', zh: '抉择' }, prediction: { en: 'Forecast', zh: '预见' }, guidance: { en: 'Guidance', zh: '指引' }, exploration: { en: 'Exploration', zh: '探索' }, general: { en: 'Inquiry', zh: '求索' } };
    const ql = qTypeNames[a.qType] || qTypeNames.general;
    html += `<div class="reading-question-reflect"><p class="reading-question-zh">你问：<em>"${escapeHTML(a.question)}"</em> — ${ql.zh}之问</p><p class="reading-question-en">You asked: <em>"${escapeHTML(a.question)}"</em> — ${ql.en}</p></div>`;
  }
  html += `</div></details>`;

  // ═══ SECTION 2: Elemental Forces — collapsed ═══
  html += `<details class="reading-details">`;
  html += `<summary class="reading-section-title">II · Elemental Forces · 元素之力</summary>`;
  html += `<div class="reading-section reading-elements">`;
  html += buildElementDisplay(a);
  html += `</div></details>`;

  // ═══ SECTION 3: Threads of Fate — collapsed ═══
  html += `<details class="reading-details">`;
  html += `<summary class="reading-section-title">III · Threads of Fate · 命运之线</summary>`;
  html += `<div class="reading-section reading-threads">`;
  html += `<p class="reading-insight-zh">${a.step1.zh}</p>`;
  html += `<p class="reading-insight">${a.step1.en}</p>`;
  if (a.step2) {
    html += `<p class="reading-insight-zh">${a.step2.zh}</p>`;
    html += `<p class="reading-insight">${a.step2.en}</p>`;
  }
  html += `<p class="reading-insight-zh">${a.step3.zh}</p>`;
  html += `<p class="reading-insight">${a.step3.en}</p>`;
  a.numberPatterns.forEach(np => {
    html += `<p class="reading-insight-zh">${np.zh}</p>`;
    html += `<p class="reading-insight">${np.en}</p>`;
  });
  if (a.step5 && a.step5.length > 0) {
    a.step5.forEach(pair => {
      html += `<p class="reading-insight-zh" style="font-size:0.85rem;padding-left:1em;">${pair.zh}</p>`;
      html += `<p class="reading-insight" style="font-size:0.9rem;padding-left:1em;border-left:2px solid var(--text-accent)">${pair.en}</p>`;
    });
  }
  if (a.step6 && a.step6.arc) {
    html += `<p class="reading-insight-zh">${a.step6.arc.zh}</p>`;
    html += `<p class="reading-insight">${a.step6.arc.en}</p>`;
    if (a.step6.curve) {
      html += `<p class="reading-insight-zh">${a.step6.curve.zh}</p>`;
      html += `<p class="reading-insight">${a.step6.curve.en}</p>`;
    }
  }
  a.suitArcs.forEach(arc => {
    html += `<p class="reading-insight-zh">${arc.story.name}讲述着它的故事：${arc.story.character.zh}穿行——${arc.cards.map(c => c.data.name).join(' → ')}。</p>`;
    html += `<p class="reading-insight">The ${arc.story.name} tells its story: ${arc.story.character.en} journeys through — ${arc.cards.map(c => c.data.nameEn).join(' → ')}.</p>`;
  });
  if (a.mainCard) {
    html += `<p class="reading-insight-zh">此牌阵的核心是<strong>${a.mainCard.data.name}</strong>——其他牌围之而转的关键。</p>`;
    html += `<p class="reading-insight">At the center stands <strong>${a.mainCard.data.name} / ${a.mainCard.data.nameEn}</strong> — the key around which the other cards orbit.</p>`;
  }
  html += `</div></details>`;

  // ═══ SECTION 4: Per-card deep analysis — default OPEN ═══
  html += `<details class="reading-details" open>`;
  html += `<summary class="reading-section-title">IV · The Cards Revealed · 逐牌细解</summary>`;
  html += `<div class="reading-section reading-cards">`;
  a.cards.forEach((dc, i) => {
    html += buildCardReadingBlock(dc, i, a);
  });
  html += `</div>`;

  // Practical advice block within card analysis
  const adviceTpl = TL.selectAdvice(a.domain, sentiment);
  if (adviceTpl) {
    html += `<div class="reading-plain-advice"><p class="plain-advice-label">✦ 白话建议 · Plain Advice</p>`;
    html += `<p class="reading-prose-zh">${adviceTpl.zh}</p>`;
    html += `<p class="reading-prose">${adviceTpl.en}</p></div>`;
  }
  html += `</details>`;

  // ═══ SECTION 5: Three Rows of Consciousness — collapsed ═══
  if (a.rowSummary) {
    html += `<details class="reading-details">`;
    html += `<summary class="reading-section-title">V · Three Rows of Consciousness · 三层意识</summary>`;
    html += `<div class="reading-section reading-consciousness">`;
    html += `<p class="reading-prose-zh">${a.rowSummary.zh}</p>`;
    html += `<p class="reading-prose">${a.rowSummary.en}</p>`;
    if (a.rowAnalysis) {
      html += `<div class="consciousness-rows">`;
      const rows = [
        { key: 'conscious', label: 'Conscious · 意识层', range: 'I–VII', color: '#c9b894' },
        { key: 'subconscious', label: 'Subconscious · 潜意识层', range: 'VIII–XIV', color: '#7ab8a0' },
        { key: 'superconscious', label: 'Superconscious · 超意识层', range: 'XV–XXI', color: '#8890a8' },
      ];
      rows.forEach(r => {
        const count = a.rowAnalysis.counts[r.key] || 0;
        const pct = a.rowAnalysis.totalMajors > 0 ? Math.round(count / a.rowAnalysis.totalMajors * 100) : 0;
        html += `<div class="consciousness-row"><span class="cr-label">${r.label} <small>${r.range}</small></span><div class="cr-track"><div class="cr-fill" style="width:${pct}%;background:${r.color}"></div></div><span class="cr-count">${count} cards · ${pct}%</span></div>`;
      });
      html += `</div>`;
    }
    html += `</div></details>`;
  }

  // ═══ SECTION: Starlight Guidance — default OPEN ═══
  html += `<details class="reading-details" open>`;
  html += `<summary class="reading-section-title">✦ · Starlight Guidance · 星光指引</summary>`;
  html += `<div class="reading-section reading-guidance">`;
  html += buildGuidance(a);
  if (a.healthNote) {
    html += `<div class="health-note"><p class="guidance-item-zh">${a.healthNote.zh}</p><p class="guidance-item">${a.healthNote.en}</p></div>`;
  }
  html += `</div></details>`;

  // ═══ SECTION: Closing — always visible ═══
  const closeTpl = TL.selectClosing(sentiment, a.totalCards, 1 - (a.reversedCount / a.totalCards));
  html += `<div class="reading-section reading-closing">`;
  html += `<p class="reading-prose-zh">${closeTpl.zh}</p>`;
  html += `<p class="reading-prose">${closeTpl.en}</p>`;
  html += `</div>`;

  return html;
}

function buildCardReadingBlock(dc, index, a) {
  const TK = TarotKnowledge;
  const card = dc.data;
  const pos = a.spread.positions?.[index];
  const posRole = getPositionRole(pos);
  const meaning = dc.isReversed ? card.reversed : card.upright;
  const domainMeaning = meaning?.domains?.[a.domain];

  const domainLabels = {
    love: 'Love · 感情', career: 'Career · 事业', wealth: 'Wealth · 财富',
    study: 'Study · 学业', destiny: 'Destiny · 命运',
  };

  let html = `<div class="card-reading"><div class="card-reading-position">${pos ? (pos.name || '') + ' · ' + (pos.nameZh || '') : ''}</div>`;
  html += `<div class="card-reading-header">`;
  html += `<span class="card-reading-name">${card.name}</span>`;
  html += `<span class="card-reading-en">${card.nameEn}</span>`;
  html += `<span class="card-reading-orientation ${dc.isReversed ? 'reversed' : 'upright'}">${dc.isReversed ? 'Reversed · 逆位' : 'Upright · 正位'}</span>`;
  html += `</div>`;

  // Position frame
  if (posRole && TK.POSITION_MODIFIERS[posRole]) {
    const pm = TK.POSITION_MODIFIERS[posRole];
    html += `<p class="card-reading-context">${pm.frame.zh}<br><span class="zh">${pm.frame.en}</span></p>`;
  }

  // Card-context specific insight from TEMPLATE_LIBRARY
  if (posRole && TK.TEMPLATE_LIBRARY) {
    const ctxTpl = TK.TEMPLATE_LIBRARY.selectCardContext(posRole, a.domain);
    if (ctxTpl) {
      const filled = TK.TEMPLATE_LIBRARY.fill(ctxTpl, {
        cardName: card.name,
        cardNameEn: card.nameEn,
        positionName: pos?.nameZh || pos?.name || '',
        positionNameEn: pos?.name || '',
      });
      html += `<p class="card-reading-context-insight">${filled.zh}</p>`;
      html += `<p class="card-reading-context-insight-en">${filled.en}</p>`;
    }
  }

  // Dignity note
  if (a.dignity && a.dignity[index]) {
    const d = a.dignity[index];
    if (d.level !== 'neutral') {
      html += `<p class="card-reading-dignity dignity-${d.level}"><span class="dignity-label">${d.levelName.en} · ${d.levelName.zh}</span>`;
      d.modifiers.forEach(m => {
        html += `<br>${m.zh}<br><span class="zh">${m.en}</span>`;
      });
      html += `</p>`;
    }
  }

  // Reversal lesson
  if (dc.isReversed) {
    const rl = a.reversalLessons.find(r => r.card === dc);
    if (rl?.lesson) {
      html += `<div class="reversal-note"><span class="reversal-method">Sequential Return · 回溯</span>${rl.lesson.zh}<br><span class="zh">${rl.lesson.en}</span></div>`;
    }
  }

  // Court card
  const courtInterpretation = TK.UTILS.getCourtInterpretation(card, dc.isReversed);
  if (courtInterpretation) {
    html += `<p class="card-reading-court">${courtInterpretation.description.zh}<br><span class="zh">${courtInterpretation.description.en}</span></p>`;
  }

  // Element note
  if (card.element && TK.ELEMENT_DYNAMICS.elements[card.element]) {
    const elInfo = TK.ELEMENT_DYNAMICS.elements[card.element];
    html += `<p class="card-reading-element"><span class="element-tag">${elInfo.name} · ${elInfo.nameZh}</span> ${elInfo.nature.zh.split('。')[0]}<br><span class="zh">${elInfo.nature.en.split('.')[0]}</span></p>`;
  }

  // Domain meaning
  if (domainMeaning) {
    html += `<p class="card-reading-domain"><span class="domain-tag">${domainLabels[a.domain] || ''}</span>${domainMeaning}</p>`;
  }

  // General meaning
  if (meaning?.meaning && meaning.meaning !== domainMeaning) {
    html += `<p class="card-reading-meaning">${meaning.meaning}</p>`;
  }

  // Symbolism
  if (meaning?.symbolism) {
    html += `<div class="card-reading-symbolism"><span class="label">Symbolism · 象征意象</span>${meaning.symbolism}</div>`;
  }

  html += `</div>`;
  return html;
}

// --- Element Display ---

function buildElementDisplay(a) {
  const TK = TarotKnowledge;
  const elements = [
    { key:'fire', label:'Fire · 火', color:'#c97a5a', icon:'🜂' },
    { key:'water', label:'Water · 水', color:'#5a8db8', icon:'🜄' },
    { key:'air', label:'Air · 风', color:'#8890a8', icon:'🜁' },
    { key:'earth', label:'Earth · 土', color:'#7ab8a0', icon:'🜃' },
  ];
  let html = `<div class="element-bars">`;
  elements.forEach(el => {
    const pct = a.elPcts[el.key] || 0;
    html += `<div class="element-bar-row"><span class="element-label">${el.label}</span><div class="element-bar-track"><div class="element-bar-fill" style="width:${pct}%;background:${el.color}"></div></div><span class="element-pct">${pct}%</span></div>`;
  });
  html += `</div>`;
  html += `<p class="element-summary-zh">${a.elSummaryZh}</p>`;
  html += `<p class="element-summary">${a.elSummaryEn}</p>`;

  if (a.elDominant && a.elDominant[1] > 0) {
    const domInfo = TK.ELEMENT_DYNAMICS.elements[a.elDominant[0]];
    html += `<p class="element-gift"><strong>${domInfo.name}'s Gift · ${domInfo.nameZh}之礼：</strong>${domInfo.gift.zh}<br><span class="zh">${domInfo.gift.en}</span></p>`;
  }

  if (a.elAbsent.length > 0) {
    html += `<div class="element-advice">`;
    a.elAbsent.forEach(e => {
      const info = TK.ELEMENT_DYNAMICS.elements[e];
      if (info) {
        html += `<p class="element-advice-item"><strong>${info.name} · ${info.nameZh} is absent</strong><br>${info.absence.zh}<br><span class="zh">${info.absence.en}</span></p>`;
      }
    });
    html += `</div>`;
  }

  if (a.elExcess.length > 0) {
    html += `<div class="element-advice element-excess">`;
    a.elExcess.forEach(e => {
      const info = TK.ELEMENT_DYNAMICS.elements[e];
      if (info) {
        html += `<p class="element-advice-item"><strong>${info.name} · ${info.nameZh} is in excess</strong><br>${info.excess.zh}<br><span class="zh">${info.excess.en}</span></p>`;
      }
    });
    html += `</div>`;
  }

  // Color symbolism
  const colorHints = TK.COLOR_SYMBOLISM.dominantInCards(a.cards);
  if (colorHints && a.elDominant) {
    const elColors = colorHints[a.elDominant[0]] || [];
    const majorCards = a.cards.filter(c => c.data?.arcana === 'major');
    let majorColors = [];
    majorCards.forEach(c => {
      if (colorHints.major && colorHints.major[c.data.id]) {
        majorColors = majorColors.concat(colorHints.major[c.data.id]);
      }
    });
    const allColorKeys = [...new Set([...elColors, ...majorColors])].slice(0, 4);
    if (allColorKeys.length > 0) {
      const zhNames = allColorKeys.map(k => { const i = TK.COLOR_SYMBOLISM.colors[k]; return i ? i.zh : ''; }).filter(Boolean).join(' · ');
      html += `<p class="element-color-note">牌面浸润着这些色彩的光芒：${zhNames}</p>`;
    }
  }

  return html;
}

// --- Guidance Builder ---

function buildGuidance(a) {
  const TK = TarotKnowledge;
  let html = '';

  const guidanceByDomain = {
    love: {
      en: `In matters of the heart, the cards remind you: love is not a problem to be solved but a mystery to be lived. Every relationship is a mirror reflecting the parts of yourself that seek to be seen, held, and healed.`,
      zh: `在心灵之事上，牌面提醒你：爱不是需要解决的难题，而是需要去活出的奥秘。每一段关系都是一面镜子，映照出你内在渴望被看见、被拥抱、被疗愈的部分。`,
    },
    career: {
      en: `Your work in the world is an extension of your inner gifts. The cards suggest that the next chapter of your professional life will be written by the courage to align what you do with who you truly are.`,
      zh: `你在世上的工作是内在天赋的延伸。牌面暗示，你职业生涯的下一章将由将所做之事与真实所是对齐的勇气写就。`,
    },
    wealth: {
      en: `True abundance flows from a well that no market can touch. Prosperity is not a number — it is a relationship. Tend it with gratitude, share it with generosity.`,
      zh: `真正的丰盛来自任何市场都无法触及的泉源。繁荣不是数字——它是一种关系。以感恩浇灌它，以慷慨分享它。`,
    },
    study: {
      en: `Knowledge is not a destination but a way of seeing. The most important lessons often arrive not through effort but through receptivity. Trust the rhythm of absorption and rest.`,
      zh: `知识不是终点，而是一种观看的方式。最重要的课题往往并非通过努力而来，而是通过接纳。信任吸收与休息的节奏。`,
    },
    destiny: {
      en: `You stand at a threshold where the person you have been meets the person you are becoming. Trust the timing of your life. Nothing is delayed; everything is ripening.`,
      zh: `你站在曾是的你与正在成为的你相遇的门槛上。信任你生命的时间。没有什么是延迟的；一切都在成熟。`,
    },
    general: {
      en: `The cards have shown their faces, but the meaning lives in you. Trust your intuition as you move forward. Let the starlight be your companion, not your commander.`,
      zh: `牌已示其面，而意义居于你心。向前行时，信任你的直觉。让星光是你的同伴，而非你的指挥官。`,
    },
  };
  const g = guidanceByDomain[a.domain] || guidanceByDomain.general;
  html += `<p class="guidance-item-zh">${g.zh}</p>`;
  html += `<p class="guidance-item">${g.en}</p>`;

  if (a.reversedCount > 0) {
    html += `<p class="guidance-item-zh">你牌阵中的逆位牌不是失败，而是老师。它们标记着能量内转之处——反思、耐心、或不同的方式，将在力量无法打开之处打开门。你所抗拒看见的，可能藏着最大的礼物。</p>`;
  }

  if (a.gateCards && a.gateCards.length > 0) {
    html += `<p class="guidance-item-zh">你正站在门槛之上。${a.gateCards.map(g => g.nameZh).join('、')}在召唤你穿越——不是以后，不是等你准备好了，而是此刻。</p>`;
  }

  if (a.contradictions && a.contradictions.length > 0) {
    html += `<p class="guidance-item-zh">你的牌阵中含有表面的矛盾——而这正是最深智慧隐藏之处。解决之道不在于选边站，而在于找到更高的综合。</p>`;
  }

  return html;
}

// ═══════════════════════════════════════════
// NARRATIVE STORY MODE
// ═══════════════════════════════════════════

function buildNarrativeReading(a) {
  const TK = TarotKnowledge;
  const TL = TK.TEMPLATE_LIBRARY;
  const sentiment = (a.reversedCount / a.totalCards >= 0.4) ? 'anxious' : 'hopeful';

  let html = `<div class="narrative-reading">`;

  // Layer 1: Dynamic plain summary — card-specific, keyword-aware
  html += buildPlainSummary(a);

  // Opening
  const openTpl = TL.selectOpening(a.domain, a.qType, sentiment);
  html += `<p class="narrative-text-zh">${openTpl.zh}</p>`;
  html += `<p class="narrative-text">${openTpl.en}</p>`;

  // Question echo — keyword-matched resonance
  const kwList = a.keywords?.keywords || [];
  if (kwList.length > 0) {
    const echoTpl = TL.selectEcho(a.domain, kwList);
    if (echoTpl) {
      html += `<p class="narrative-text-zh" style="font-style:italic;opacity:0.9">${echoTpl.zh}</p>`;
      html += `<p class="narrative-text" style="font-style:italic;opacity:0.85">${echoTpl.en}</p>`;
    }
  }

  // Story arc
  if (a.step6 && a.step6.arc) {
    html += `<p class="narrative-text" style="font-style:italic;opacity:0.85">${a.step6.arc.en}</p>`;
  }

  // Weave cards into causal story
  a.cards.forEach((dc, i) => {
    const card = dc.data;
    const pos = a.spread.positions?.[i];
    const posRole = getPositionRole(pos);
    const posName = pos ? (pos.name || '') : '';
    const posNameZh = pos ? (pos.nameZh || '') : '';
    const meaning = dc.isReversed ? card.reversed : card.upright;
    const trans = TL.selectTransition(i % 2 === 0 ? 'causal' : 'contrast');

    let enPara = '', zhPara = '';

    if (i === 0) {
      enPara = `The first card to emerge is <strong>${card.name} / ${card.nameEn}</strong>`;
      if (posName) enPara += `, revealing itself in the position of <em>${posName}</em> — ${posNameZh}`;
      enPara += `. ${meaning?.meaning?.split('。')[0] || meaning?.meaning?.split('.')[0] || ''}. `;
      if (dc.isReversed) enPara += `It appears reversed — its energy not absent, but turned inward.`;
      if (card.arcana === 'major') enPara += ` As a Major Arcana, this is an archetypal force in the great story of the soul.`;

      zhPara = `第一张牌浮现：<strong>${card.name}</strong>`;
      if (posNameZh) zhPara += `，在<em>${posNameZh}</em>的位置显现自身`;
      zhPara += `。${card.upright?.meaning?.split('。')[0] || ''}。`;
      if (dc.isReversed) zhPara += `它以逆位出现——能量并非不存在，而是内转了。`;
      if (card.arcana === 'major') zhPara += `作为大阿尔卡纳，这是一股原型之力，是灵魂宏大叙事中的一个角色。`;
    } else {
      enPara = `${trans.en} <strong>${card.name} / ${card.nameEn}</strong>`;
      if (posName) enPara += ` arrives in the realm of ${posName}`;
      enPara += ` — and the story deepens. `;
      const short = (meaning?.meaning || '').split('。').slice(0, 2).join('。');
      enPara += short + (short.endsWith('.') || short.endsWith('。') ? '' : '.');
      if (dc.isReversed) enPara += ` Reversed, ${card.nameEn} invites inward reflection.`;

      zhPara = `${trans.zh} <strong>${card.name}</strong>`;
      if (posNameZh) zhPara += ` 降临于${posNameZh}之境`;
      zhPara += `——故事愈发深沉。`;
      const shortZh = (meaning?.meaning || '').split('。').slice(0, 2).join('。');
      zhPara += shortZh + (shortZh.endsWith('。') ? '' : '。');
      if (dc.isReversed) zhPara += ` 此牌以逆位显现——能量内转，呼唤更深刻的审视。`;
    }

    html += `<p class="narrative-text-zh">${zhPara}</p>`;
    html += `<p class="narrative-text">${enPara}</p>`;

    // Domain-specific context for this card's position
    if (posRole) {
      const ctxTpl = TL.selectCardContext(posRole, a.domain);
      if (ctxTpl) {
        const filled = TL.fill(ctxTpl, {
          cardName: card.name,
          cardNameEn: card.nameEn,
          positionName: posName,
          positionNameEn: posNameZh
        });
        html += `<p class="narrative-text-zh" style="font-size:0.9rem;opacity:0.85;padding-left:0.5em;border-left:2px solid var(--text-accent)">${filled.zh}</p>`;
        html += `<p class="narrative-text" style="font-size:0.85rem;opacity:0.8;padding-left:0.5em">${filled.en}</p>`;
      }
    }
  });

  // Practical advice insertion
  const adviceTpl = TL.selectAdvice(a.domain, sentiment);
  if (adviceTpl) {
    html += `<p class="narrative-text-zh" style="margin-top:1.2em;font-weight:600">${adviceTpl.zh}</p>`;
    html += `<p class="narrative-text">${adviceTpl.en}</p>`;
  }

  // Closing
  const closeTpl = TL.selectClosing(sentiment, a.totalCards, 1 - (a.reversedCount / a.totalCards));
  html += `<p class="narrative-text-zh">${closeTpl.zh}</p>`;
  html += `<p class="narrative-text">${closeTpl.en}</p>`;

  html += `</div>`;

  // Compact element overview
  html += `<details class="reading-details">`;
  html += `<summary class="reading-section-title">Elemental Forces · 元素之力</summary>`;
  html += buildElementDisplay(a);
  html += `</details>`;

  return html;
}

// ═══════════════════════════════════════════
// TIMING OUTPUT
// ═══════════════════════════════════════════

function buildTimingPrediction(cards) {
  const TK = TarotKnowledge;
  const majorCards = cards.filter(c => c.data?.arcana === 'major');
  if (majorCards.length === 0) return '';

  const mc = majorCards[0].data;
  const num = mc.number;

  let html = `<div class="reading-section reading-timing">`;
  html += `<div class="reading-section-title">Timing Oracle · 时间之谕</div>`;

  const numResult = TK.TIMING.methods.number(num);
  html += `<p class="timing-text-zh">${numResult.zh}</p>`;
  html += `<p class="timing-text">${numResult.en}</p>`;

  const zodiacResult = TK.TIMING.methods.zodiac(num);
  if (zodiacResult) {
    html += `<p class="timing-text-zh">${zodiacResult.zh}</p>`;
    html += `<p class="timing-text">${zodiacResult.en}</p>`;
  }

  const suitCounts = TK.UTILS.countSuits(cards);
  const domSuit = Object.entries(suitCounts).filter(([k]) => k !== 'major').sort((a,b) => b[1] - a[1])[0];
  if (domSuit && domSuit[1] > 0) {
    const seasonResult = TK.TIMING.methods.suitSeason(domSuit[0]);
    if (seasonResult) {
      html += `<p class="timing-text-zh">${seasonResult.zh}</p>`;
      html += `<p class="timing-text">${seasonResult.en}</p>`;
    }
  }

  const lunarResult = TK.TIMING.methods.lunarPhase(cards);
  if (lunarResult) {
    html += `<p class="timing-text-zh">${lunarResult.zh}</p>`;
    html += `<p class="timing-text">${lunarResult.en}</p>`;
  }

  html += `<p class="timing-disclaimer">时间是引导，不是保证。星辰建议；你决定。<br><span class="zh">Timing is guidance, not guarantee. The stars suggest; you decide.</span></p>`;
  html += `</div>`;
  return html;
}

// --- Main Entry Points ---

function generateReading(question, spread, drawnCards, options = {}) {
  const analysis = analyzeReading(question, spread, drawnCards, options.context);
  const mode = options.mode || 'structured';

  let detailed = mode === 'narrative'
    ? buildNarrativeReading(analysis)
    : buildStructuredReading(analysis);

  if (options.includeTiming) {
    detailed += buildTimingPrediction(analysis.cards);
  }

  const summary = buildReadingSummary(analysis);
  return { summary, detailed, analysis };
}

function buildReadingSummary(a) {
  const domainLabels = {
    love: 'Love · 感情', career: 'Career · 事业', wealth: 'Wealth · 财富',
    study: 'Study · 学业', destiny: 'Destiny · 命运', general: 'Inquiry · 求索',
  };
  let html = '';
  html += `<p class="summary-line"><span class="summary-domain">${domainLabels[a.domain] || domainLabels.general}</span></p>`;
  html += `<p class="summary-line">${a.totalCards} cards · ${a.spread.icon} ${a.spread.name} / ${a.spread.nameZh}</p>`;
  html += `<p class="summary-line">${a.step1.zh}</p>`;
  html += `<p class="summary-line summary-zh">${a.step1.en}</p>`;
  if (a.step2?.dominant && a.step2.dominant !== 'balanced') {
    html += `<p class="summary-line">${a.step2.zh}</p>`;
    html += `<p class="summary-line summary-zh">${a.step2.en}</p>`;
  }
  if (a.rowSummary && a.rowAnalysis && a.rowAnalysis.totalMajors >= 2) {
    html += `<p class="summary-line">${a.rowSummary.zh}</p>`;
  }
  return html;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
