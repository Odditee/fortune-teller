/* ========================================
   app.js — Main App Logic: Router, State, Init
   ======================================== */

const AppState = {
  currentPage: 'welcome', selectedSpread: null, drawMode: null,
  question: '', context: '', drawnCards: [], readingResult: null,
  readingMode: 'narrative', includeTiming: false,
  extractedKeywords: null,
};

// --- Router ---
let appCompass = null;

function navigateTo(pageName) {
  const prevPage = AppState.currentPage;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${pageName}`);
  if (target) { target.classList.add('active'); AppState.currentPage = pageName; }
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const bp = btn.dataset.page;
    const isActive = bp === pageName ||
      (pageName === 'question' && bp === 'spread-select') ||
      (pageName === 'reveal' && bp === 'spread-select') ||
      (pageName === 'draw-circle' && bp === 'spread-select') ||
      (pageName === 'draw-number' && bp === 'spread-select');
    btn.classList.toggle('active', isActive);
  });
  // Hide nav on welcome and full-screen draw pages
  const nav = document.querySelector('.app-nav');
  const header = document.querySelector('.app-header');
  const isFullScreen = pageName === 'welcome' || pageName === 'draw-circle' || pageName === 'daily';
  if (nav) nav.style.display = isFullScreen ? 'none' : 'flex';
  if (header) header.style.display = pageName === 'draw-circle' ? 'none' : '';
  // Show/hide draw-circle UI (body-level elements)
  const drawUI = document.querySelectorAll('#draw-prompt, #draw-progress, #draw-action-btn, #btn-back-circle');
  drawUI.forEach(el => el.style.display = pageName === 'draw-circle' ? '' : 'none');
  document.querySelector('.app-content').scrollTop = 0;
  // Destroy compass when leaving spread-select page
  if (prevPage === 'spread-select' && pageName !== 'spread-select' && appCompass) {
    appCompass.destroy();
    // Unlock scroll and clean up observer
    document.querySelector('.app-content').style.overflowY = '';
    if (compassScrollObserver) { compassScrollObserver.disconnect(); compassScrollObserver = null; }
  }
  if (pageName === 'question') updateQuestionPlaceholder();
  if (pageName === 'spread-select') initCompassPage();
  if (pageName === 'history') renderHistory();
}

// --- Compass Page ---
let compassScrollObserver = null;

function initCompassPage() {
  const container = document.getElementById('compass-container');
  if (!container) return;

  if (appCompass) appCompass.destroy();

  appCompass = new AlchemyCompass(container, {
    onCategorySelect: (cat, spreads) => {
      openBookModalForCategory(cat, spreads);
    },
  });

  // Lock background scroll whenever compass is laying flat
  if (compassScrollObserver) compassScrollObserver.disconnect();
  compassScrollObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        const laying = m.target.classList.contains('laying-flat');
        const content = document.querySelector('.app-content');
        if (content) content.style.overflowY = laying ? 'hidden' : '';
      }
    }
  });
  compassScrollObserver.observe(appCompass.wrapper, { attributes: true, attributeFilter: ['class'] });
}

// --- Book Modal ---
let bookCatSpreads = [];
let bookCatIndex = 0;
let bookCategory = null;

function openBookModalForCategory(cat, spreads) {
  bookCatSpreads = spreads;
  bookCatIndex = 0;
  bookCategory = cat;
  // Enable hologram mode: transparent backdrop, book floats above compass
  const modal = document.getElementById('book-modal');
  if (modal) modal.classList.add('hologram-mode');
  // Lock background scroll behind the hologram book
  const content = document.querySelector('.app-content');
  if (content) content.style.overflowY = 'hidden';
  showBookSpread(spreads[0]);
}

function showBookSpread(spread) {
  const modal = document.getElementById('book-modal');

  // Fill right page details
  document.getElementById('book-spread-icon').textContent = spread.icon;
  document.getElementById('book-spread-name').textContent = spread.name;
  document.getElementById('book-spread-name-zh').textContent = spread.nameZh;
  document.getElementById('book-spread-count').textContent = `${spread.cardCount} Cards · ${spread.cardCount} 张牌`;
  // Render usage tags if available
  const bestForEl = document.getElementById('book-spread-bestfor');
  if (bestForEl && spread.bestFor) {
    bestForEl.innerHTML = `<span class="book-spread-bestfor-zh">${spread.bestForZh || ''}</span><span class="book-spread-bestfor-en">${spread.bestFor || ''}</span>`;
    bestForEl.style.display = 'block';
  } else if (bestForEl) {
    bestForEl.style.display = 'none';
  }
  document.getElementById('book-spread-desc').innerHTML = `${spread.description}<span style="display:block;width:40px;height:0.5px;background:var(--silver-line);margin:8px auto"></span><span style="font-family:var(--font-body);font-size:0.85rem;opacity:0.75;display:block">${spread.descriptionZh}</span>`;

  // Fill positions list
  const posList = document.getElementById('book-spread-positions');
  posList.innerHTML = spread.positions.map(p => `
    <li class="book-position-item">
      <span class="book-position-num">${p.index}</span>
      <span class="book-position-name">${p.name} / ${p.nameZh}</span>
      <span class="book-position-desc">${p.description}</span>
      ${p.descriptionZh ? '<span class="book-position-desc-zh">' + p.descriptionZh + '</span>' : ''}
    </li>
  `).join('');

  // Render diagram on left page
  const diagram = document.getElementById('book-diagram');
  renderSpreadDiagram(spread, diagram);

  // Setup select button
  const selectBtn = document.getElementById('btn-book-select');
  selectBtn.onclick = () => confirmSpreadSelection(spread);

  // Update page indicator
  document.getElementById('book-page-indicator').textContent = `${bookCatIndex + 1} / ${bookCatSpreads.length}`;

  // Enable/disable nav buttons
  document.getElementById('btn-page-prev').disabled = bookCatIndex <= 0;
  document.getElementById('btn-page-next').disabled = bookCatIndex >= bookCatSpreads.length - 1;

  // Show modal
  if (!modal.classList.contains('show')) {
    modal.style.display = 'flex';
    modal.classList.add('show');
    if (modal.classList.contains('hologram-mode')) {
      const book = modal.querySelector('.book-container');
      book.style.animation = 'none';
      book.offsetHeight;
      book.style.animation = 'hologramRise 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
      book.addEventListener('animationend', function onEnd() {
        book.removeEventListener('animationend', onEnd);
        book.style.animation = 'hologramFloat 3.8s ease-in-out infinite';
      });
    } else {
      const book = modal.querySelector('.book-container');
      book.style.animation = 'none';
      book.offsetHeight;
      book.style.animation = 'bookRiseFromCompass 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  }
}

function flipBookPage(direction) {
  const newIndex = bookCatIndex + direction;
  if (newIndex < 0 || newIndex >= bookCatSpreads.length) return;

  // Quick flip animation
  const book = document.querySelector('.book-container');
  if (book) {
    book.classList.add('book-page-flip-out');
    setTimeout(() => {
      bookCatIndex = newIndex;
      showBookSpread(bookCatSpreads[bookCatIndex]);
      book.classList.remove('book-page-flip-out');
      book.classList.add('book-page-flip-in');
      setTimeout(() => book.classList.remove('book-page-flip-in'), 250);
    }, 200);
  }
}

function closeBookModal() {
  const modal = document.getElementById('book-modal');
  modal.style.display = 'none';
  modal.classList.remove('show', 'hologram-mode');
  // Unlock background scroll
  const content = document.querySelector('.app-content');
  if (content) content.style.overflowY = '';
  bookCatSpreads = [];
  bookCatIndex = 0;
  bookCategory = null;
  if (appCompass) appCompass.standUp();
}

function confirmSpreadSelection(spread) {
  // Close the book and stand compass back up first
  closeBookModal();
  // Store pending spread for confirmation
  window._pendingSpread = spread;
  // Show confirmation dialog after book closes + compass stands up
  setTimeout(() => {
    const dialog = document.getElementById('confirm-dialog');
    if (!dialog) return;
    document.getElementById('confirm-icon').textContent = spread.icon || '✧';
    document.getElementById('confirm-name').textContent = spread.name;
    document.getElementById('confirm-name-zh').textContent = spread.nameZh;
    document.getElementById('confirm-count').textContent = `${spread.cardCount} Cards · ${spread.cardCount} 张牌`;
    dialog.style.display = 'flex';
    dialog.classList.add('show');
  }, 600);
}

function closeConfirmDialog() {
  const dialog = document.getElementById('confirm-dialog');
  if (!dialog) return;
  dialog.classList.remove('show');
  setTimeout(() => {
    dialog.style.display = 'none';
    window._pendingSpread = null;
  }, 300);
}

function confirmSpreadYes() {
  const spread = window._pendingSpread;
  if (!spread) return;
  closeConfirmDialog();
  AppState.selectedSpread = spread;
  const info = document.getElementById('selected-spread-info');
  if (info) info.innerHTML = `Selected · 已选：<strong>${spread.icon} ${spread.name} / ${spread.nameZh}</strong>（${spread.cardCount} Cards）`;
  const icon = spread.icon || '✧';
  showToast(`${icon} ${spread.name} / ${spread.nameZh} — Selected · 已选择`, 1200);
  setTimeout(() => navigateTo('question'), 200);
}

// --- Question Page ---
function getDomainForSpread(spread) {
  if (!spread) return 'general';
  const cat = spread.category || '';
  if (/love|relationship|感情/.test(cat)) return 'love';
  if (/career|work|事业/.test(cat)) return 'career';
  if (/wealth|money|财富/.test(cat)) return 'wealth';
  if (/study|exam|学业/.test(cat)) return 'study';
  return 'destiny';
}

function getGuidancePlaceholder(spread) {
  const domain = getDomainForSpread(spread);
  try {
    const TK = TarotKnowledge;
    const domainData = TK.QUESTION_SYSTEM.domains[domain];
    if (domainData && domainData.refinements && domainData.refinements.length > 0) {
      const idx = Math.floor(Math.random() * domainData.refinements.length);
      const ref = domainData.refinements[idx];
      return ref.zh + '  ' + ref.en;
    }
  } catch (e) { /* fallback */ }
  return '写下你想问的事情…… Write your question here…';
}

function setupQuestionPage() {
  const input = document.getElementById('question-input');
  const btn = document.getElementById('btn-start-draw');
  const info = document.getElementById('selected-spread-info');
  const modeBtns = document.querySelectorAll('.btn-mode');
  const hintEl = document.getElementById('question-refine-hint');
  const spread = AppState.selectedSpread;
  const QG = TarotKnowledge.QUESTION_GUIDANCE;

  if (info && spread) info.innerHTML = `Selected · 已选：<strong>${spread.icon} ${spread.name} / ${spread.nameZh}</strong>（${spread.cardCount} Cards）`;

  // Layer 1 & 5: Spread-aware placeholders for question + context
  if (input && spread) {
    input.placeholder = QG.getPlaceholder(spread);
  }
  const ctxInput = document.getElementById('context-input');
  if (ctxInput && spread) {
    ctxInput.placeholder = QG.getContextPlaceholder(spread);
  }

  // Real-time adaptive guidance on input
  input.addEventListener('input', () => {
    AppState.question = input.value.trim();
    validateQ();
    if (!hintEl) return;

    const q = AppState.question;
    if (!q || q.length < 3) { hintEl.classList.remove('visible'); return; }

    // Layer 2: Adaptive follow-up
    const adaptive = QG.getAdaptiveHint(q);
    // Layer 3: Missing info prompts
    const missing = QG.getMissingPrompts(q);

    const hints = [];
    if (adaptive) hints.push(adaptive);
    hints.push(...missing);

    if (hints.length > 0) {
      hintEl.innerHTML = '<span class="hint-label">✨ 星辰轻语 · The stars whisper：</span>' +
        hints.slice(0, 3).map(h => `<span class="hint-suggestion">${h.zh}<br><span class="hint-suggestion-en">${h.en}</span></span>`).join('');
      hintEl.classList.add('visible');
    } else {
      hintEl.classList.remove('visible');
    }

    // Layer 4: Extract and store keywords for reading engine
    AppState.extractedKeywords = QG.extractKeywords(AppState.question, AppState.context || '');
  });

  if (ctxInput) ctxInput.addEventListener('input', () => {
    AppState.context = ctxInput.value.trim();
    // Re-extract keywords when context changes too
    if (AppState.question) {
      AppState.extractedKeywords = QG.extractKeywords(AppState.question, AppState.context || '');
    }
  });

  modeBtns.forEach(b => b.addEventListener('click', () => { modeBtns.forEach(x => x.classList.remove('selected')); b.classList.add('selected'); AppState.drawMode = b.dataset.mode; validateQ(); }));
  btn.addEventListener('click', () => {
    if (!AppState.drawMode || !AppState.question) return;
    if (AppState.drawMode === 'circle') { navigateTo('draw-circle'); initCardCircle(); }
    else { navigateTo('draw-number'); initNumberDraw(); }
  });
  const dm = document.querySelector('[data-mode="circle"]');
  if (dm) { dm.classList.add('selected'); AppState.drawMode = 'circle'; }
}

function validateQ() { const btn = document.getElementById('btn-start-draw'); if (btn) btn.disabled = !(AppState.question && AppState.drawMode); }

function updateQuestionPlaceholder() {
  const input = document.getElementById('question-input');
  const spread = AppState.selectedSpread;
  if (input && spread) {
    input.placeholder = getGuidancePlaceholder(spread);
  }
  // Reset state when entering question page
  AppState.question = '';
  AppState.drawMode = 'circle';
  if (input) input.value = '';
  const ctxInput = document.getElementById('context-input');
  if (ctxInput) ctxInput.value = '';
  const modeBtns = document.querySelectorAll('.btn-mode');
  modeBtns.forEach(b => b.classList.remove('selected'));
  const dm = document.querySelector('[data-mode="circle"]');
  if (dm) { dm.classList.add('selected'); AppState.drawMode = 'circle'; }
  validateQ();
}

// --- Number Draw ---
function initNumberDraw() {
  const spread = AppState.selectedSpread;
  const container = document.getElementById('number-inputs');
  const info = document.getElementById('num-needed');
  const confirmBtn = document.getElementById('btn-confirm-numbers');
  if (!spread || !container) return;
  info.textContent = spread.cardCount;
  const infoZh = document.getElementById('num-needed-zh');
  if (infoZh) infoZh.textContent = spread.cardCount;
  container.innerHTML = Array.from({length: spread.cardCount}, (_, i) => `<input type="number" min="1" max="78" placeholder="${i+1}" class="num-input" data-index="${i}">`).join('');
  const checkInputs = () => {
    const vals = []; let valid = true;
    container.querySelectorAll('input').forEach(inp => {
      const v = parseInt(inp.value);
      if (isNaN(v) || v < 1 || v > 78 || vals.includes(v)) valid = false;
      else vals.push(v);
    });
    confirmBtn.disabled = !valid || vals.length !== spread.cardCount;
    return valid ? vals : null;
  };
  container.addEventListener('input', () => {
    const vals = checkInputs();
    if (vals) confirmBtn.onclick = () => drawCardsByNumber(vals);
  });
}

function drawCardsByNumber(numbers) {
  AppState.drawnCards = numbers.map(num => ({ cardId: num, isReversed: Math.random() < 0.5 }));
  TarotAudio.play('draw');
  navigateTo('reveal');
  showReveal();
}

// --- Circle Draw ---
function initCardCircle() {
  const spread = AppState.selectedSpread;
  if (!spread) return;

  // Circle prose — removed per user request
  const proseEl = document.getElementById('circle-prose');
  if (proseEl) proseEl.innerHTML = '';

  // Show entry prompt
  const prompt = document.getElementById('draw-prompt');
  if (prompt) {
    prompt.textContent = `请听从内心的指引，抽取${spread.cardCount}张牌`;
    prompt.classList.remove('animate');
    void prompt.offsetWidth; // reflow to restart animation
    prompt.classList.add('animate');
  }

  // Hide action button
  const btn = document.getElementById('draw-action-btn');
  if (btn) btn.classList.remove('visible');

  // Init the 3D circle (starts card fade-in after delay)
  TarotCircle.init(spread.cardCount, (selectedIds) => {
    AppState.drawnCards = selectedIds.map(id => ({ cardId: id, isReversed: Math.random() < 0.5 }));
    TarotAudio.play('reveal');
    navigateTo('reveal');
    showReveal();
  });
}

// --- Reveal ---
function showReveal() {
  const display = document.getElementById('cards-display');
  const spreadName = document.getElementById('reveal-spread-name');
  const spread = AppState.selectedSpread;
  if (!display || !spread) return;
  spreadName.innerHTML = `<span style="opacity:0.6;font-size:0.8rem;letter-spacing:0.15em">${spread.icon}</span> ${spread.name} <span style="opacity:0.5">·</span> <span style="opacity:0.7">${spread.nameZh}</span>`;

  // Get spread layout coordinates
  const coords = typeof getDiagramCoords === 'function'
    ? getDiagramCoords(spread.id, spread.cardCount)
    : null;

  // Use spread layout if coords available, otherwise grid fallback
  const useLayout = coords && coords.length === AppState.drawnCards.length;
  display.className = useLayout ? 'cards-display cards-display-layout' : 'cards-display cards-display-grid';

  // Card sizing: fewer cards = larger, many cards = smaller
  const totalCards = AppState.drawnCards.length;
  const cardScale = totalCards <= 1 ? 1.0 : totalCards <= 3 ? 0.85 : totalCards <= 5 ? 0.72 : totalCards <= 7 ? 0.62 : 0.55;

  // Coordinate stretching — spread cards apart while preserving layout shape
  const spreadFactor = totalCards <= 1 ? 1.0 : totalCards <= 3 ? 1.15 : totalCards <= 5 ? 1.2 : totalCards <= 7 ? 1.25 : 1.25;

  const baseW = 150;
  const baseH = 225;
  const cardW = Math.round(baseW * cardScale);
  const cardH = Math.round(baseH * cardScale);

  display.innerHTML = AppState.drawnCards.map((dc, i) => {
    const card = getCardById(dc.cardId);
    if (!card) return '';
    const pos = spread.positions[i];
    const cls = dc.isReversed ? 'reversed' : 'upright';
    const coord = useLayout ? coords[i] : null;
    const style = coord
      ? (() => {
          const sx = 50 + (coord.x - 50) * spreadFactor;
          const sy = 50 + (coord.y - 50) * spreadFactor;
          return `style="position:absolute;left:${sx}%;top:${sy}%;transform:translate(-50%,-50%);width:${cardW}px;height:${cardH}px;z-index:${i}"`;
        })()
      : `style="width:${cardW}px;height:${cardH}px"`;
    return `<div class="card-reveal" data-index="${i}" ${style}>
      <div class="card-inner">
        <div class="card-back" onclick="event.stopPropagation();flipCard(this.parentElement.parentElement)"><div class="card-back-design"><div class="card-back-design-inner"></div></div></div>
        <div class="card-front" onclick="showCardDetail(${i})">
          ${generateCardArt(dc.cardId)}
          <div class="glass-sheen"></div>
          <div class="card-content">
            <div style="font-size:0.7rem;color:var(--text-dim);margin-bottom:2px">${pos ? (pos.nameZh || pos.name) : ''}</div>
            <div style="font-size:1rem;color:var(--text-accent);font-family:var(--font-display)">${card.name}</div>
            <div style="font-size:0.65rem;color:var(--text-dim)">${card.nameEn}</div>
            <span class="card-detail-position ${cls}" style="font-size:0.7rem;margin-top:4px">${dc.isReversed ? 'Reversed 逆位' : 'Upright 正位'}</span>
          </div>
        </div>
      </div></div>`;
  }).join('');

  // Staggered flip animation
  setTimeout(() => {
    document.querySelectorAll('.card-inner').forEach((el, i) => {
      setTimeout(() => { el.classList.add('flipped'); TarotAudio.play('flip'); }, i * 300);
    });
  }, 400);

  // Start reading after all cards flip
  const totalFlipTime = 400 + AppState.drawnCards.length * 300 + 200;
  setTimeout(() => startAIReading(), totalFlipTime);
}

function flipCard(el) {
  const inner = el.querySelector('.card-inner');
  if (inner) { inner.classList.toggle('flipped'); TarotAudio.play('flip'); }
}

function showCardDetail(index) {
  const dc = AppState.drawnCards[index];
  const card = getCardById(dc.cardId);
  const spread = AppState.selectedSpread;
  const pos = spread ? spread.positions[index] : null;
  if (!card) return;
  const meaning = dc.isReversed ? card.reversed : card.upright;
  const cls = dc.isReversed ? 'reversed' : 'upright';
  const hasContent = meaning.meaning || meaning.symbolism || meaning.story;
  const body = document.getElementById('card-modal-body');
  body.innerHTML = `
    <div class="card-detail-art">${generateCardArt(dc.cardId)}</div>
    <div class="card-detail-header">
      <div class="card-detail-name">${card.name}</div>
      <div class="card-detail-en">${card.nameEn}</div>
      <span class="card-detail-position ${cls}">${dc.isReversed ? 'Reversed 逆位' : 'Upright 正位'}</span>
      ${pos ? `<div style="font-size:0.85rem;color:var(--text-dim);margin-top:4px">${pos.nameZh||pos.name}：${pos.descriptionZh||pos.description}</div>` : ''}
    </div>
    ${card.keywords ? `<div class="card-detail-keywords">${card.keywords.map(k => `<span class="card-detail-keyword">${k}</span>`).join('')}</div>` : ''}
    ${meaning.meaning ? `<div class="card-detail-section"><h4>Meaning · 含义解读</h4><p>${meaning.meaning}</p></div>` : ''}
    ${meaning.symbolism ? `<div class="card-detail-section"><h4>Symbolism · 象征意象</h4><p>${meaning.symbolism}</p></div>` : ''}
    ${meaning.story ? `<div class="card-detail-section"><h4>Lore · 历史典故</h4><p>${meaning.story}</p></div>` : ''}
    ${meaning.cases && meaning.cases.length ? `<div class="card-detail-section"><h4>Cases · 事件案例</h4>${meaning.cases.map(c => `<div class="card-detail-case">${c}</div>`).join('')}</div>` : ''}
    ${!hasContent ? '<p style="text-align:center;color:var(--text-dim);padding:20px">Content under development · 内容完善中</p>' : ''}
  `;
  document.getElementById('card-modal').classList.add('show');
}

function closeCardModal() { document.getElementById('card-modal').classList.remove('show'); }

// --- Reading (local engine, no API) ---
async function startAIReading() {
  const container = document.getElementById('ai-reading');
  if (!container) return;
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Reading the stars... 正在解读星辰的排列……</p></div>';
  try {
    AppState.readingResult = await getTarotReading(AppState.question, AppState.selectedSpread, AppState.drawnCards, AppState.context, {
      mode: AppState.readingMode,
      includeTiming: AppState.includeTiming,
    });
    container.innerHTML = AppState.readingResult;

    // Inject timing prompt if not already included
    if (!AppState.includeTiming) {
      injectTimingPrompt(container);
    }
  } catch (err) {
    console.error('Reading failed:', err);
    const stackTrace = (err.stack || '').split('\n').slice(0, 3).join('<br>');
    container.innerHTML = '<p style="text-align:center;color:var(--text-dim)">The stars are momentarily silent. Please try again.<br>星辰暂默，请稍后重试。</p><p style="text-align:center;color:#a06050;font-size:0.7rem;margin-top:12px;word-break:break-all;line-height:1.5">' + err.message + '</p><p style="text-align:center;color:#887070;font-size:0.6rem;margin-top:8px;word-break:break-all;line-height:1.4">' + stackTrace + '</p>';
  }
}

function injectTimingPrompt(container) {
  const prompt = document.createElement('div');
  prompt.id = 'timing-prompt';
  prompt.className = 'timing-prompt';
  prompt.innerHTML = `
    <p class="timing-prompt-text">Would you like the stars to reveal the timing? · 是否希望星辰揭示时机？</p>
    <div class="timing-prompt-actions">
      <button class="btn btn-primary btn-timing-yes" id="btn-timing-yes">Yes · 是</button>
      <button class="btn btn-ghost btn-timing-no" id="btn-timing-no">Not now · 暂不</button>
    </div>
    <div id="timing-result" class="timing-result"></div>
  `;
  container.appendChild(prompt);

  document.getElementById('btn-timing-yes').addEventListener('click', () => {
    const resultEl = document.getElementById('timing-result');
    if (resultEl) {
      resultEl.innerHTML = buildTimingPrediction(AppState.drawnCards.map(dc => {
        const data = getCardById(dc.cardId);
        return { ...dc, data };
      }));
      resultEl.classList.add('visible');
    }
    const yesBtn = document.getElementById('btn-timing-yes');
    if (yesBtn) {
      yesBtn.textContent = 'Timing Revealed · 时机已揭示';
      yesBtn.disabled = true;
    }
  });
}

// --- History ---
async function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;
  const records = await getHistoryRecords();
  if (!records.length) { list.innerHTML = '<p class="empty-hint">No readings yet. Begin your first tarot journey.<br>暂无记录，开启你的第一次塔罗之旅吧。</p>'; return; }
  list.innerHTML = records.reverse().map(r => `
    <div class="history-item" onclick="viewHistoryDetail('${r.id}')">
      <div class="history-item-time">${new Date(r.timestamp).toLocaleString('zh-CN')}</div>
      <div class="history-item-question">${r.question || '(No question · 无提问)'}</div>
      <div class="history-item-spread">${r.spreadName || '?'} · ${r.cards.length} Cards</div>
    </div>`).join('');
}

async function viewHistoryDetail(id) {
  const r = await getHistoryRecord(id);
  if (!r) return;
  AppState.selectedSpread = TAROT_SPREADS.find(s => s.id === r.spreadId);
  AppState.question = r.question || '';
  AppState.context = r.context || '';
  AppState.drawnCards = r.cards;
  AppState.readingResult = r.interpretation || '';
  navigateTo('reveal');
  showReveal();
}

async function saveCurrentReading() {
  if (!AppState.readingResult) { showToast('Please wait for the reading to complete · 请等待解读完成'); return; }
  const s = AppState.selectedSpread;
  await saveReadingRecord({
    timestamp: Date.now(), question: AppState.question, context: AppState.context,
    spreadId: s.id, spreadName: `${s.name} / ${s.nameZh}`, spreadIcon: s.icon,
    cards: AppState.drawnCards, interpretation: AppState.readingResult, notes: '',
  });
  showToast('Reading saved · 记录已保存');
}

// --- API Key Management ---
async function saveAPIKey() {
  const input = document.getElementById('api-key-input');
  const msg = document.getElementById('api-msg');
  const key = input.value.trim();
  if (!key) { msg.textContent = 'Please enter a valid API key'; msg.style.color = '#c97a5a'; return; }
  await setSetting('tarot-api-key', key);
  msg.textContent = 'Key saved! AI reading enabled. · 密钥已保存！';
  msg.style.color = '#7ab8a0';
  setTimeout(() => {
    document.getElementById('api-modal').classList.remove('show');
    if (AppState.currentPage === 'reveal') startAIReading();
  }, 1000);
}

function skipAPIKey() {
  document.getElementById('api-modal').classList.remove('show');
  showToast('Offline mode · 离线模式');
}

// --- Init ---
function initApp() {
  // Language preference — default Chinese
  const savedLang = localStorage.getItem('tarot-lang') || 'zh';
  document.body.className = savedLang === 'zh' ? 'lang-zh' : savedLang === 'en' ? 'lang-en' : '';
  updateLangToggleBtn();

  // Hide draw-circle UI on initial load
  document.querySelectorAll('#draw-prompt, #draw-progress, #draw-action-btn, #btn-back-circle').forEach(el => el.style.display = 'none');
  new StarField('star-canvas').start();
  setupQuestionPage();
  // Welcome page — dual gates
  document.getElementById('btn-gate-daily')?.addEventListener('click', () => {
    TarotAudio.init();
    navigateTo('daily');
  });
  document.getElementById('btn-gate-seek')?.addEventListener('click', () => {
    TarotAudio.init();
    navigateTo('spread-select');
  });
  // Daily card page
  document.getElementById('btn-draw-daily')?.addEventListener('click', drawDailyCard);
  document.getElementById('btn-back-from-daily')?.addEventListener('click', () => navigateTo('welcome'));
  document.getElementById('btn-journal-daily')?.addEventListener('click', toggleDailyJournal);
  document.getElementById('btn-save-journal')?.addEventListener('click', saveDailyJournal);
  // Keep old gate button for compatibility
  document.getElementById('btn-enter-gate')?.addEventListener('click', () => {
    TarotAudio.init();
    navigateTo('spread-select');
  });

  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => navigateTo(btn.dataset.page)));
  document.getElementById('btn-back-to-question')?.addEventListener('click', () => navigateTo('question'));
  document.getElementById('btn-back-to-spread')?.addEventListener('click', () => {
    AppState.selectedSpread = null;
    navigateTo('spread-select');
  });
  document.getElementById('btn-back-circle')?.addEventListener('click', () => { TarotCircle.destroy(); navigateTo('question'); });
  document.getElementById('btn-back-to-home')?.addEventListener('click', () => navigateTo('spread-select'));
  document.getElementById('btn-save-reading')?.addEventListener('click', saveCurrentReading);
  document.getElementById('btn-new-reading')?.addEventListener('click', () => {
    Object.assign(AppState, { selectedSpread: null, drawMode: null, question: '', context: '', drawnCards: [], readingResult: null, readingMode: 'narrative', includeTiming: false });
    navigateTo('spread-select');
  });
  // Hide nav on welcome page initially
  const nav = document.querySelector('.app-nav');
  if (nav) nav.style.display = 'none';
  // Confirm dialog
  document.getElementById('btn-confirm-yes')?.addEventListener('click', confirmSpreadYes);
  console.log('🔮 Stellar Oracle ready · 星空之谕已就绪');
}

// --- Daily Card ---

let currentDailyCard = null;

function drawDailyCard() {
  // Set single-card spread and navigate to circle draw
  const singleSpread = TAROT_SPREADS.find(s => s.id === 'single');
  AppState.selectedSpread = singleSpread || { id: 'single', name: 'Daily Card', nameZh: '每日一牌', cardCount: 1, icon: '✧', positions: [{ index: 1, name: 'Today\'s Whisper', nameZh: '今日低语', description: 'A single card for today\'s guidance', descriptionZh: '一张牌，今日指引' }] };
  AppState.question = 'Daily Whisper · 星辰低语';
  AppState.context = '';
  AppState.drawMode = 'circle';
  navigateTo('draw-circle');
  initCardCircle();
}

function buildDailyAdvice(card) {
  const TK = TarotKnowledge;
  const elInfo = card.element ? TK.ELEMENT_DYNAMICS.elements[card.element] : null;
  const suitStory = card.suit && card.number ? TK.SUIT_STORIES[card.suit] : null;
  const arcDesc = suitStory?.arc[card.number];

  let en = `Today, <strong>${card.name} / ${card.nameEn}</strong> walks beside you. `;
  let zh = `今日，<strong>${card.name}</strong>与你同行。`;

  if (card.arcana === 'major') {
    en += `As a Major Arcana, this is not a casual visitor — it is an archetypal force inviting you to a deeper conversation with yourself. `;
    zh += `作为大阿尔卡纳，这并非偶然过客——它是一股原型之力，邀请你与自己进行一场更深的对话。`;
  }
  if (arcDesc) {
    en += arcDesc.en.split('.')[0] + '. ';
    zh += arcDesc.zh.split('。')[0] + '。';
  }
  if (elInfo) {
    en += `The ${elInfo.name} element colors this day with its gift: ${elInfo.gift.en.split('—')[0]?.trim() || elInfo.gift.en}. `;
    zh += `${elInfo.nameZh}元素以其恩赐为今日着色：${elInfo.gift.zh.split('—')[0]?.trim() || elInfo.gift.zh}。`;
  }
  en += `Carry this energy with you. Let it be a quiet companion through the hours ahead.`;
  zh += `携带这份能量前行。让它成为你未来时光中一位安静的同伴。`;

  return { en, zh };
}

function toggleDailyJournal() {
  const input = document.getElementById('daily-journal-input');
  const btn = document.getElementById('btn-save-journal');
  const isHidden = input.style.display === 'none';
  input.style.display = isHidden ? '' : 'none';
  btn.style.display = isHidden ? '' : 'none';
  if (isHidden) input.focus();
}

async function saveDailyJournal() {
  const input = document.getElementById('daily-journal-input');
  const note = input.value.trim();
  if (!note || !currentDailyCard) return;
  await saveReadingRecord({
    timestamp: Date.now(),
    question: 'Daily Whisper · 星辰低语',
    context: note,
    spreadId: 'single',
    spreadName: 'Daily Card / 每日一牌',
    spreadIcon: '✧',
    cards: [{ cardId: currentDailyCard.cardId, isReversed: false }],
    interpretation: document.getElementById('daily-card-advice')?.textContent || '',
    notes: note,
  });
  input.value = '';
  input.style.display = 'none';
  document.getElementById('btn-save-journal').style.display = 'none';
  document.getElementById('btn-journal-daily').style.display = 'none';
  showToast('Reflection saved · 感悟已保存');
}

// --- Language Toggle ---
function cycleLanguage() {
  const body = document.body;
  if (body.classList.contains('lang-zh')) {
    body.className = 'lang-en';
    localStorage.setItem('tarot-lang', 'en');
  } else if (body.classList.contains('lang-en')) {
    body.className = '';
    localStorage.setItem('tarot-lang', 'bilingual');
  } else {
    body.className = 'lang-zh';
    localStorage.setItem('tarot-lang', 'zh');
  }
  updateLangToggleBtn();
}

function updateLangToggleBtn() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  const body = document.body;
  if (body.classList.contains('lang-zh')) {
    btn.textContent = '中文';
    btn.classList.remove('active');
  } else if (body.classList.contains('lang-en')) {
    btn.textContent = 'English';
    btn.classList.add('active');
  } else {
    btn.textContent = '中英';
    btn.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', initApp);
