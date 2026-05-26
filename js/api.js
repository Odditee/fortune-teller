/* ========================================
   api.js — Local Reading Engine Interface
   Zero API calls. Calls reading-engine.js (rule-based).
   ======================================== */

async function getTarotReading(question, spread, drawnCards, context, options = {}) {
  // Delay for flip animation to complete
  const delay = Math.max(0, 400 + drawnCards.length * 300 + 200 - 200);
  await new Promise(r => setTimeout(r, Math.min(delay, 2000)));

  console.log('[getTarotReading] Starting generation...', { question, spreadId: spread?.id, cardCount: drawnCards.length, mode: options.mode });

  let result;
  try {
    if (typeof generateReading !== 'function') {
      throw new Error('generateReading function not found — reading-engine.js may not have loaded');
    }
    result = generateReading(question, spread, drawnCards, {
      context,
      mode: options.mode || 'structured',
      includeTiming: options.includeTiming || false,
    });
    console.log('[getTarotReading] generateReading succeeded');
  } catch (e) {
    console.error('[getTarotReading] generateReading failed:', e.message, e.stack);
    throw new Error('解读生成失败: ' + e.message);
  }

  let html = '';

  // Mode toggle buttons
  html += `<div class="reading-mode-toggle">`;
  html += `<button class="btn-mode-toggle ${options.mode !== 'narrative' ? 'active' : ''}" onclick="switchReadingMode('structured')">Structured · 结构解读</button>`;
  html += `<button class="btn-mode-toggle ${options.mode === 'narrative' ? 'active' : ''}" onclick="switchReadingMode('narrative')">Narrative · 命运叙事</button>`;
  html += `</div>`;

  // Summary
  html += `<div class="reading-summary">${result.summary}</div>`;

  // Divider
  html += `<div class="reading-divider">✦ ✦ ✦</div>`;

  // Detailed content
  html += `<div class="reading-detail" id="reading-detail">${result.detailed}</div>`;

  return html;
}

// Mode switching (called from UI)
async function switchReadingMode(mode) {
  const container = document.getElementById('ai-reading');
  if (!container) return;

  // Find elements BEFORE modifying DOM
  const detailEl = document.getElementById('reading-detail');
  const summaryEl = container.querySelector('.reading-summary');
  const oldPrompt = document.getElementById('timing-prompt');
  if (oldPrompt) oldPrompt.remove();

  // Show loading only in the detail area — don't destroy the container
  if (detailEl) {
    detailEl.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Weaving the narrative... 正在编织命运之线……</p></div>';
  }

  await new Promise(r => setTimeout(r, 400));

  const result = generateReading(AppState.question, AppState.selectedSpread, AppState.drawnCards, {
    context: AppState.context,
    mode: mode,
    includeTiming: AppState.includeTiming || false,
  });

  // Update detail
  if (detailEl) {
    detailEl.innerHTML = result.detailed;
    detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Update summary
  if (summaryEl) {
    summaryEl.innerHTML = result.summary;
  }

  // Update toggle buttons
  const toggleBtns = document.querySelectorAll('.btn-mode-toggle');
  toggleBtns.forEach(btn => {
    const onclick = btn.getAttribute('onclick') || '';
    btn.classList.toggle('active', onclick.includes(mode));
  });

  // Update app state
  AppState.readingMode = mode;
  AppState.readingResult = result;

  // Re-inject timing prompt if not already included
  if (!AppState.includeTiming) {
    injectTimingPrompt(container);
  }
}
