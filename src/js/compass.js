/* ========================================
   compass.js — Stellar Compass (星辰罗盘)
   Medieval astrolabe with autorotation,
   circular category medallions, and
   3D perspective lay-flat animation
   ======================================== */

class AlchemyCompass {
  constructor(container, options = {}) {
    this.container = container;
    this.onCategorySelect = options.onCategorySelect || (() => {});
    this.activeCategory = null;
    this.build();
  }

  build() {
    this.container.innerHTML = '';

    // ── Wrapper (positioning container, no rotation) ──
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'compass-wrapper';

    // ── Rotating body (contains decorative rings 0-3) ──
    this.body = document.createElement('div');
    this.body.className = 'compass-body';

    // Ring 0: Outer tick ring with degree marks
    const ring0 = document.createElement('div');
    ring0.className = 'compass-ring compass-ring-0';
    this.body.appendChild(ring0);

    // Ring 1: Gothic filigree ring
    const ring1 = document.createElement('div');
    ring1.className = 'compass-ring compass-ring-1';
    this.body.appendChild(ring1);

    // Ring 2: Inner track A (independent CW rotation)
    const ring2 = document.createElement('div');
    ring2.className = 'compass-ring compass-ring-2';
    this.body.appendChild(ring2);

    // Ring 3: Inner track B (independent CCW rotation)
    const ring3 = document.createElement('div');
    ring3.className = 'compass-ring compass-ring-3';
    this.body.appendChild(ring3);

    // Ring 4: Innermost star track (CW rotation)
    const ring4 = document.createElement('div');
    ring4.className = 'compass-ring compass-ring-4';
    this.body.appendChild(ring4);

    // Ring 4b: Counter-rotating star track (CCW, medium speed)
    const ring4b = document.createElement('div');
    ring4b.className = 'compass-ring compass-ring-4b';
    this.body.appendChild(ring4b);

    // Ring 4c: Slow inner star track (CW, large bright stars)
    const ring4c = document.createElement('div');
    ring4c.className = 'compass-ring compass-ring-4c';
    this.body.appendChild(ring4c);

    // Rete: astrolabe cut-out star map overlay (slow CW rotation)
    const rete = document.createElement('div');
    rete.className = 'compass-rete';
    this.body.appendChild(rete);

    this.wrapper.appendChild(this.body);

    // ── Medallion ring (fixed, not rotating) ──
    this.medallionLayer = document.createElement('div');
    this.medallionLayer.className = 'compass-medallion-layer';
    this.buildCategoryMedallions();
    this.wrapper.appendChild(this.medallionLayer);

    // ── Inner decoration ring 5 (fixed) ──
    const ring5 = document.createElement('div');
    ring5.className = 'compass-ring-5';
    this.wrapper.appendChild(ring5);

    // ── Center medallion ──
    this.center = document.createElement('div');
    this.center.className = 'compass-center';
    this.center.innerHTML = '<span class="compass-center-symbol">✦</span>';
    this.center.addEventListener('click', () => this.clearCategory());
    this.wrapper.appendChild(this.center);

    // ── Heraldic corner pieces (cardinal + ordinal directions) ──
    const heraldryPositions = [
      { cls: 'n', x: 50, y: 6 },
      { cls: 's', x: 50, y: 94 },
      { cls: 'e', x: 94, y: 50 },
      { cls: 'w', x: 6, y: 50 },
      { cls: 'ne', x: 81, y: 19 },
      { cls: 'nw', x: 19, y: 19 },
      { cls: 'se', x: 81, y: 81 },
      { cls: 'sw', x: 19, y: 81 },
    ];
    heraldryPositions.forEach(({ cls, x, y }) => {
      const el = document.createElement('div');
      el.className = `compass-heraldry compass-heraldry-${cls}`;
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.textContent = cls.length === 1 ? '✧' : '·';
      this.wrapper.appendChild(el);
    });

    this.container.appendChild(this.wrapper);

    // ── Hint text (outside wrapper, not affected by 3D transform) ──
    this.hint = document.createElement('div');
    this.hint.className = 'compass-hint';
    this.hint.textContent = 'Select a category to reveal spreads · 选择分类以显现牌阵';
    this.container.appendChild(this.hint);
    setTimeout(() => this.hint.classList.add('visible'), 600);
  }

  buildCategoryMedallions() {
    const total = SPREAD_CATEGORIES.length;
    const radiusPct = 36;

    SPREAD_CATEGORIES.forEach((cat, i) => {
      const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
      const cx = 50 + Math.cos(angle) * radiusPct;
      const cy = 50 + Math.sin(angle) * radiusPct;

      // Split 4-char Chinese name into two rows of 2 chars each
      const chars = [...cat.name];
      const row1 = chars.slice(0, 2).join('');
      const row2 = chars.slice(2, 4).join('');

      const medallion = document.createElement('div');
      medallion.className = 'compass-cat-medallion';
      medallion.dataset.catId = cat.id;
      medallion.style.left = `${cx}%`;
      medallion.style.top = `${cy}%`;
      medallion.innerHTML = `
        <span class="compass-cat-icon">${cat.icon}</span>
        <span class="compass-cat-text">
          <span class="compass-cat-line">${row1}</span>
          <span class="compass-cat-line">${row2}</span>
        </span>
      `;
      medallion.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectCategory(cat.id);
      });
      this.medallionLayer.appendChild(medallion);
    });
  }

  selectCategory(catId) {
    if (this.activeCategory === catId) return;
    this.activeCategory = catId;
    this.hint.classList.remove('visible');

    // Highlight active medallion
    this.medallionLayer.querySelectorAll('.compass-cat-medallion').forEach(m => {
      m.classList.toggle('active', m.dataset.catId === catId);
    });

    // Update center symbol
    const sym = this.center.querySelector('.compass-center-symbol');
    const cat = getCategoryById(catId);
    if (sym && cat) sym.textContent = cat.icon;

    // Pulse center
    this.center.classList.add('pulse');

    // 3D lay-flat
    this.wrapper.classList.add('laying-flat');

    // After animation, trigger callback
    const spreads = getSpreadsByCategory(catId);
    setTimeout(() => {
      this.onCategorySelect(cat, spreads);
    }, 800);
  }

  clearCategory() {
    this.activeCategory = null;
    this.medallionLayer.querySelectorAll('.compass-cat-medallion').forEach(m => m.classList.remove('active'));
    this.center.classList.remove('pulse');
    const sym = this.center.querySelector('.compass-center-symbol');
    if (sym) sym.textContent = '✦';
    this.wrapper.classList.remove('laying-flat');
    setTimeout(() => this.hint.classList.add('visible'), 300);
  }

  standUp() {
    this.wrapper.classList.remove('laying-flat');
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
