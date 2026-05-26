/* ========================================
   spread-diagram.js — CSS Card Layout Diagrams
   牌阵简图：为26种牌阵生成CSS定位的小卡牌布局
   ======================================== */

/**
 * Layout generators — each returns [{x%, y%}] for n cards
 * All coordinates clamped to safe range: x 8-92, y 12-88
 */

const DiagramLayouts = {
  // Single card centered
  single: () => [{ x: 50, y: 50 }],

  // Horizontal line
  lineH: (n) => {
    const arr = [];
    const spacing = 80 / (n - 1 || 1);
    for (let i = 0; i < n; i++) {
      arr.push({ x: 10 + i * spacing, y: 50 });
    }
    return arr;
  },

  // Vertical line
  lineV: (n) => {
    const arr = [];
    const spacing = 80 / (n - 1 || 1);
    for (let i = 0; i < n; i++) {
      arr.push({ x: 50, y: 10 + i * spacing });
    }
    return arr;
  },

  // Triangle (3-4 cards)
  triangle: (n) => {
    if (n === 3) return [{ x: 50, y: 15 }, { x: 18, y: 78 }, { x: 82, y: 78 }];
    // 4 cards: tetrahedron/钻石
    return [{ x: 50, y: 10 }, { x: 15, y: 65 }, { x: 85, y: 65 }, { x: 50, y: 88 }];
  },

  // Celtic Cross (10 cards)
  celticCross: () => [
    { x: 48, y: 38 },  // 1: Center (Present)
    { x: 60, y: 42 },  // 2: Crossing (laid across, visibly offset)
    { x: 50, y: 16 },  // 3: Crown (above)
    { x: 50, y: 64 },  // 4: Root (below)
    { x: 22, y: 40 },  // 5: Past (left)
    { x: 78, y: 40 },  // 6: Future (right)
    { x: 26, y: 72 },  // 7: Self (bottom-left, staff start)
    { x: 42, y: 72 },  // 8: Environment
    { x: 58, y: 72 },  // 9: Hopes
    { x: 74, y: 72 },  // 10: Outcome
  ],

  // Circle / Wheel (n cards evenly around a circle)
  circle: (n) => {
    const arr = [];
    const r = 32;
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      arr.push({ x: 50 + Math.cos(angle) * r, y: 50 + Math.sin(angle) * r });
    }
    return arr;
  },

  // Horseshoe (U-shape, 7 cards)
  horseshoe: () => {
    const positions = [];
    const angles = [-120, -90, -60, 0, 60, 90, 120];
    const r = 28;
    for (const a of angles) {
      const rad = (a * Math.PI) / 180;
      positions.push({ x: 50 + Math.cos(rad) * r, y: 50 + Math.sin(rad) * r });
    }
    return positions;
  },

  // Pyramid (5 cards ascending)
  pyramid: () => [
    { x: 50, y: 12 },
    { x: 25, y: 42 }, { x: 75, y: 42 },
    { x: 15, y: 72 }, { x: 85, y: 72 },
  ],

  // Hexagram / Star (7 cards)
  hexagram: () => [
    { x: 50, y: 50 },  // Center
    { x: 50, y: 14 },  // Top
    { x: 82, y: 32 },  // Top-right
    { x: 82, y: 68 },  // Bottom-right
    { x: 50, y: 86 },  // Bottom
    { x: 18, y: 68 },  // Bottom-left
    { x: 18, y: 32 },  // Top-left
  ],

  // Tree of Life (10 Sephiroth in Kabbalistic layout)
  treeOfLife: () => [
    { x: 50, y: 16 },  // 1: Crown
    { x: 33, y: 28 },  // 2: Wisdom
    { x: 67, y: 28 },  // 3: Understanding
    { x: 67, y: 42 },  // 4: Mercy
    { x: 33, y: 42 },  // 5: Severity
    { x: 50, y: 52 },  // 6: Beauty
    { x: 33, y: 63 },  // 7: Victory
    { x: 67, y: 63 },  // 8: Splendor
    { x: 50, y: 76 },  // 9: Foundation
    { x: 50, y: 88 },  // 10: Kingdom
  ],

  // Two columns
  twoCol: (n) => {
    const arr = [];
    const half = Math.ceil(n / 2);
    const spacingL = 80 / (half - 1 || 1);
    const spacingR = 80 / (n - half - 1 || 1);
    for (let i = 0; i < half; i++) arr.push({ x: 26, y: 10 + i * spacingL });
    for (let i = 0; i < n - half; i++) arr.push({ x: 74, y: 10 + i * spacingR });
    return arr;
  },

  // Diamond (4 cards)
  diamond: () => [
    { x: 50, y: 12 },  // Top
    { x: 80, y: 50 },  // Right
    { x: 50, y: 86 },  // Bottom
    { x: 20, y: 50 },  // Left
  ],

  // Cross simple (5 cards)
  crossSimple: () => [
    { x: 50, y: 50 },  // Center
    { x: 50, y: 20 },  // Top
    { x: 50, y: 80 },  // Bottom
    { x: 20, y: 50 },  // Left
    { x: 80, y: 50 },  // Right
  ],

  // V-shape / fork (5 cards for crossroads)
  forkShape: () => [
    { x: 50, y: 16 },  // Top center
    { x: 22, y: 50 },  // Left path
    { x: 78, y: 50 },  // Right path
    { x: 12, y: 84 },  // Far left outcome
    { x: 88, y: 84 },  // Far right outcome
  ],

  // T-shape (4 cards, 1 top + 3 bottom row)
  tShape: () => [
    { x: 50, y: 20 },
    { x: 22, y: 70 },
    { x: 50, y: 70 },
    { x: 78, y: 70 },
  ],

  // Triangle + Center (4 cards: 3 outer + 1 core)
  triangleCenter: () => [
    { x: 50, y: 14 },  // Top — Heaven
    { x: 18, y: 74 },  // Bottom-left — Humanity
    { x: 82, y: 74 },  // Bottom-right — Earth
    { x: 50, y: 48 },  // Center — Core
  ],

  // Three-layer pyramid (6 cards: 2-2-2)
  pyramid3: () => [
    { x: 30, y: 16 }, { x: 70, y: 16 },
    { x: 20, y: 48 }, { x: 50, y: 48 }, { x: 80, y: 48 },
    { x: 50, y: 80 },
  ],
};

// Map each spread ID to a layout generator
const SPREAD_DIAGRAMS = {
  // Love
  'relationship':   { layout: 'twoCol',     args: [7] },
  'venus':           { layout: 'twoCol',     args: [8] },
  'helen':           { layout: 'twoCol',     args: [6] },
  // Career
  'celtic-cross':    { layout: 'celticCross', args: [] },
  'sacred-triangle': { layout: 'triangleCenter', args: [] },
  'horus':           { layout: 'crossSimple', args: [] },
  'work-cycle':      { layout: 'circle',     args: [6] },
  // Wealth
  'kether-cross':    { layout: 'treeOfLife',  args: [] },
  'alchemical-lion': { layout: 'crossSimple', args: [] },
  'four-elements':   { layout: 'diamond',    args: [] },
  // Study
  'giza-pyramid':    { layout: 'pyramid',    args: [] },
  'hexagram':        { layout: 'hexagram',   args: [] },
  // Relations
  'thothmosis':      { layout: 'crossSimple', args: [] },
  'horseshoe':       { layout: 'horseshoe',  args: [] },
  // Destiny
  'tree-of-life':    { layout: 'treeOfLife', args: [] },
  'zodiac':          { layout: 'circle',     args: [12] },
  'faith':           { layout: 'crossSimple', args: [] },
  'three-card':      { layout: 'lineH',      args: [3] },
  // Decision
  'choice':          { layout: 'forkShape',  args: [] },
  'reinforcement':   { layout: 'tShape',     args: [] },
  'action-result':   { layout: 'diamond',    args: [] },
  // Family
  'shaka-wo':        { layout: 'twoCol',     args: [7] },
  'ancestral-tree':  { layout: 'pyramid3',   args: [] },
  // Quick
  'single':          { layout: 'single',     args: [] },
  'essence':         { layout: 'lineV',      args: [3] },
  'daily-triangle':  { layout: 'triangle',   args: [3] },
};

/**
 * Clamp value to safe diagram bounds
 */
function clampDiagram(val, axis) {
  const min = axis === 'x' ? 8 : 12;
  const max = axis === 'x' ? 92 : 88;
  return Math.max(min, Math.min(max, val));
}

/**
 * Special handling: kether-cross uses first 6 slots of treeOfLife
 */
function getDiagramCoords(spreadId, cardCount) {
  const def = SPREAD_DIAGRAMS[spreadId];
  if (!def) {
    return DiagramLayouts.lineH(cardCount);
  }

  const generator = DiagramLayouts[def.layout];
  if (!generator) return DiagramLayouts.lineH(cardCount);

  const coords = generator(...def.args);

  // For spreads whose layout generator produces more/less coords than actual cards
  if (coords.length > cardCount) {
    return coords.slice(0, cardCount).map(c => ({ x: clampDiagram(c.x, 'x'), y: clampDiagram(c.y, 'y') }));
  }
  if (coords.length < cardCount) {
    const extra = DiagramLayouts.lineH(cardCount - coords.length);
    return [...coords, ...extra].map(c => ({ x: clampDiagram(c.x, 'x'), y: clampDiagram(c.y, 'y') }));
  }
  return coords.map(c => ({ x: clampDiagram(c.x, 'x'), y: clampDiagram(c.y, 'y') }));
}

/**
 * Render spread diagram into a container element
 */
function renderSpreadDiagram(spread, container) {
  container.innerHTML = '';
  const coords = getDiagramCoords(spread.id, spread.cardCount);

  coords.forEach((coord, i) => {
    const card = document.createElement('div');
    card.className = 'diagram-card';
    card.style.left = `${coord.x}%`;
    card.style.top = `${coord.y}%`;
    card.style.transform = 'translate(-50%, -50%)';

    const num = document.createElement('span');
    num.className = 'diagram-card-num';
    num.textContent = i + 1;
    card.appendChild(num);

    container.appendChild(card);
  });
}
