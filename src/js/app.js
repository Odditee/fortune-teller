/* ========================================
   app.js — Main App Logic: Router, State, Init
   ======================================== */

const AppState = {
  currentPage: 'spread-select', selectedSpread: null, drawMode: null,
  question: '', context: '', drawnCards: [], readingResult: null,
};

// --- Router ---
function navigateTo(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${pageName}`);
  if (target) { target.classList.add('active'); AppState.currentPage = pageName; }
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const bp = btn.dataset.page;
    btn.classList.toggle('active', bp === pageName || (pageName === 'question' && bp === 'spread-select') || (pageName === 'reveal' && bp === 'spread-select'));
  });
  document.querySelector('.app-content').scrollTop = 0;
  if (pageName === 'spread-select') renderSpreadGrid();
  if (pageName === 'history') renderHistory();
}

// --- Spread Selection ---
function renderSpreadGrid() {
  const grid = document.getElementById('spread-grid');
  if (!grid) return;
  grid.innerHTML = TAROT_SPREADS.map(s => `
    <div class="spread-card" data-spread-id="${s.id}" onclick="selectSpread('${s.id}')">
      <div class="spread-card-icon">${s.icon}</div>
      <div class="spread-card-name">${s.name}</div>
      <div class="spread-card-name-zh">${s.nameZh}</div>
      <div class="spread-card-count">${s.cardCount} Cards</div>
      <div class="spread-card-desc">${s.shortDesc}</div>
    </div>
  `).join('');
}

function selectSpread(id) {
  document.querySelectorAll('.spread-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`[data-spread-id="${id}"]`);
  if (card) card.classList.add('selected');
  AppState.selectedSpread = TAROT_SPREADS.find(s => s.id === id);
  setTimeout(() => navigateTo('question'), 300);
}

// --- Question Page ---
function setupQuestionPage() {
  const input = document.getElementById('question-input');
  const btn = document.getElementById('btn-start-draw');
  const info = document.getElementById('selected-spread-info');
  const modeBtns = document.querySelectorAll('.btn-mode');
  const spread = AppState.selectedSpread;
  if (info && spread) info.innerHTML = `Selected · 已选：<strong>${spread.icon} ${spread.name} / ${spread.nameZh}</strong>（${spread.cardCount} Cards）`;
  input.addEventListener('input', () => { AppState.question = input.value.trim(); validateQ(); });
  const ctxInput = document.getElementById('context-input');
  if (ctxInput) ctxInput.addEventListener('input', () => { AppState.context = ctxInput.value.trim(); });
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

// --- Number Draw ---
function initNumberDraw() {
  const spread = AppState.selectedSpread;
  const container = document.getElementById('number-inputs');
  const info = document.getElementById('num-needed');
  const confirmBtn = document.getElementById('btn-confirm-numbers');
  if (!spread || !container) return;
  info.textContent = spread.cardCount;
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
  spreadName.textContent = `${spread.icon} ${spread.name} · ${spread.nameZh}`;
  display.innerHTML = AppState.drawnCards.map((dc, i) => {
    const card = getCardById(dc.cardId);
    if (!card) return '';
    const pos = spread.positions[i];
    const cls = dc.isReversed ? 'reversed' : 'upright';
    return `<div class="card-reveal" data-index="${i}">
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
  setTimeout(() => {
    document.querySelectorAll('.card-inner').forEach((el, i) => {
      setTimeout(() => { el.classList.add('flipped'); TarotAudio.play('flip'); }, i * 300);
    });
  }, 400);
  startAIReading();
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
    ${!hasContent ? '<p style="text-align:center;color:var(--text-dim);padding:20px">Content under development</p>' : ''}
  `;
  document.getElementById('card-modal').classList.add('show');
}

function closeCardModal() { document.getElementById('card-modal').classList.remove('show'); }

// --- AI Reading ---
async function startAIReading() {
  const container = document.getElementById('ai-reading');
  if (!container) return;
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Connecting to the tarot... 正在感应塔罗的力量……</p></div>';
  try {
    AppState.readingResult = await getTarotReading(AppState.question, AppState.selectedSpread, AppState.drawnCards, AppState.context);
    container.innerHTML = AppState.readingResult;
  } catch (err) {
    console.error('AI reading failed:', err);
    container.innerHTML = '<p style="text-align:center;color:var(--text-dim)">Reading unavailable. Please try again later.</p>';
  }
}

// --- History ---
async function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;
  const records = await getHistoryRecords();
  if (!records.length) { list.innerHTML = '<p class="empty-hint">No readings yet. Begin your first tarot journey.</p>'; return; }
  list.innerHTML = records.reverse().map(r => `
    <div class="history-item" onclick="viewHistoryDetail('${r.id}')">
      <div class="history-item-time">${new Date(r.timestamp).toLocaleString('zh-CN')}</div>
      <div class="history-item-question">${r.question || '(No question)'}</div>
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
  if (!AppState.readingResult) { showToast('Please wait for the reading to complete'); return; }
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
  new StarField('star-canvas').start();
  renderSpreadGrid();
  setupQuestionPage();
  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => navigateTo(btn.dataset.page)));
  document.getElementById('btn-back-to-question')?.addEventListener('click', () => navigateTo('question'));
  document.getElementById('btn-back-circle')?.addEventListener('click', () => { TarotCircle.destroy(); navigateTo('question'); });
  document.getElementById('btn-back-to-home')?.addEventListener('click', () => navigateTo('spread-select'));
  document.getElementById('btn-save-reading')?.addEventListener('click', saveCurrentReading);
  document.getElementById('btn-new-reading')?.addEventListener('click', () => {
    Object.assign(AppState, { selectedSpread: null, drawMode: null, question: '', context: '', drawnCards: [], readingResult: null });
    navigateTo('spread-select');
  });
  console.log('🔮 Stellar Oracle ready · 星空之谕已就绪');
}

document.addEventListener('DOMContentLoaded', initApp);
