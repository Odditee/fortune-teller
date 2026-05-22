/* ========================================
   card-art.js — SVG Stained-Glass Card Face Art
   Each card's geometry abstracts its traditional
   Rider-Waite-Smith imagery in stained-glass style.
   ======================================== */

// --- Color palettes (low saturation, cool moonlight tones) ---
const ART_PALETTES = {
  major: ['rgba(62,68,108,0.78)', 'rgba(78,62,102,0.74)', 'rgba(135,145,180,0.64)', 'rgba(68,85,122,0.76)', 'rgba(95,80,120,0.70)', 'rgba(52,62,92,0.80)', 'rgba(112,100,140,0.66)', 'rgba(145,150,175,0.62)'],
  wands: ['rgba(108,72,65,0.76)', 'rgba(142,118,92,0.68)', 'rgba(88,48,58,0.78)', 'rgba(128,95,75,0.72)', 'rgba(98,58,52,0.80)', 'rgba(152,132,110,0.64)'],
  cups:  ['rgba(70,112,122,0.74)', 'rgba(112,142,162,0.66)', 'rgba(45,65,95,0.80)', 'rgba(82,122,140,0.70)', 'rgba(55,84,106,0.78)', 'rgba(122,152,168,0.64)'],
  swords:['rgba(140,150,170,0.66)', 'rgba(120,112,152,0.68)', 'rgba(170,175,192,0.60)', 'rgba(95,105,132,0.74)', 'rgba(132,136,160,0.66)', 'rgba(152,145,175,0.62)'],
  pentacles:['rgba(92,104,76,0.76)', 'rgba(145,138,102,0.68)', 'rgba(55,75,65,0.80)', 'rgba(118,112,84,0.72)', 'rgba(82,95,72,0.78)', 'rgba(138,132,108,0.66)'],
};

// Lead-line color
const LEAD = 'rgba(18,16,36,0.85)';

function paletteFor(cardId) {
  if (cardId <= 22) return 'major';
  const s = Math.floor((cardId - 23) / 14);
  return ['wands','cups','swords','pentacles'][s] || 'major';
}

function pick(cardId, idx) {
  const p = ART_PALETTES[paletteFor(cardId)];
  return p[idx % p.length];
}

// SVG helpers — each returns a string of SVG elements
function rectEl(x, y, w, h, fill, strokeW) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${LEAD}" stroke-width="${strokeW||1.5}"/>`;
}
function circleEl(cx, cy, r, fill, strokeW) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${LEAD}" stroke-width="${strokeW||1.5}"/>`;
}
function polyEl(points, fill, strokeW) {
  return `<polygon points="${points}" fill="${fill}" stroke="${LEAD}" stroke-width="${strokeW||1.5}"/>`;
}
function lineEl(x1, y1, x2, y2, strokeW) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${LEAD}" stroke-width="${strokeW||2}"/>`;
}

// --- Major Arcana geometric abstractions ---
// Each function returns an SVG fragment that abstracts the card's traditional imagery

function artFool(id) {
  // Cliff diagonal, sun circle, small dog triangle, figure
  const bg = pick(id,0), sun = pick(id,2), cliff = pick(id,3), dog = pick(id,5), fig = pick(id,1);
  return `
    ${rectEl(0,0,100,150,bg,1)}
    ${polyEl(`0,85 100,145 100,150 0,150`,cliff,1.5)}
    ${circleEl(72,22,12,sun,1.5)}
    ${polyEl(`65,115 72,108 79,115`,dog,1.5)}
    ${lineEl(38,70,42,55,2)}
    ${lineEl(42,55,35,38,2)}
    ${lineEl(42,55,50,40,2)}
    ${lineEl(38,70,38,100,2)}
    ${lineEl(38,100,30,115,2)}
    ${lineEl(38,100,46,115,2)}
    ${circleEl(42,48,6,pick(id,4),1)}`;
}

function artMagician(id) {
  // Table below, wand raised, infinity above, four suit symbols
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${rectEl(22,105,56,18,pick(id,3),1.5)}
    ${circleEl(50,70,14,pick(id,2),1.5)}
    ${lineEl(50,70,50,42,2.5)}
    ${circleEl(38,95,5,pick(id,4),1)}
    ${circleEl(62,95,5,pick(id,5),1)}
    ${polyEl(`44,88 50,78 56,88`,pick(id,5),1)}
    ${polyEl(`44,104 50,94 56,104`,pick(id,1),1)}
    ${lineEl(30,65,42,55,1.5)}
    ${lineEl(70,65,58,55,1.5)}
    ${lineEl(50,42,44,32,1.5)}
    ${lineEl(50,42,56,32,1.5)}`;
}

function artHighPriestess(id) {
  // Two pillars, veil between, moon at feet
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${rectEl(18,20,16,110,pick(id,3),1.5)}
    ${rectEl(66,20,16,110,pick(id,3),1.5)}
    ${polyEl(`34,25 66,25 62,130 38,130`,pick(id,1),1.5)}
    ${polyEl(`44,55 56,55 53,95 47,95`,pick(id,4),1)}
    ${circleEl(50,50,10,pick(id,2),1.5)}
    ${polyEl(`42,130 58,130 50,142`,pick(id,5),1.5)}`;
}

function artEmpress(id) {
  // Crown of stars, heart shield, organic shapes
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${circleEl(30,22,6,pick(id,2),1)}
    ${circleEl(50,16,7,pick(id,2),1)}
    ${circleEl(70,22,6,pick(id,2),1)}
    ${polyEl(`42,60 58,60 55,95 45,95`,pick(id,1),1.5)}
    ${polyEl(`38,45 62,45 58,60 42,60`,pick(id,3),1.5)}
    ${circleEl(50,75,9,pick(id,4),1.5)}
    ${lineEl(50,30,50,50,2)}
    ${polyEl(`30,115 70,115 58,135 42,135`,pick(id,5),1.5)}`;
}

function artEmperor(id) {
  // Throne, ram curves, orb, scepter, crown
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${rectEl(28,100,44,30,pick(id,3),1.5)}
    ${polyEl(`22,90 78,90 82,100 18,100`,pick(id,3),1.5)}
    ${polyEl(`30,25 70,25 74,40 26,40`,pick(id,1),1.5)}
    ${polyEl(`34,40 66,40 62,55 38,55`,pick(id,2),1.5)}
    ${circleEl(28,75,7,pick(id,4),1.5)}
    ${lineEl(72,40,72,85,2.5)}
    ${circleEl(72,30,5,pick(id,5),1)}`;
}

function artHierophant(id) {
  // Two pillars, papal crown, crossed keys, three figures
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${rectEl(16,18,12,112,pick(id,3),1.5)}
    ${rectEl(72,18,12,112,pick(id,3),1.5)}
    ${polyEl(`36,60 64,60 60,130 40,130`,pick(id,1),1.5)}
    ${polyEl(`34,22 66,22 70,38 30,38`,pick(id,2),1.5)}
    ${polyEl(`38,38 62,38 58,50 42,50`,pick(id,4),1)}
    ${circleEl(50,52,8,pick(id,5),1.5)}
    ${circleEl(42,105,5,pick(id,0),1)}
    ${circleEl(58,105,5,pick(id,0),1)}
    ${lineEl(44,118,56,105,2)}
    ${lineEl(56,118,44,105,2)}`;
}

function artLovers(id) {
  // Two figures, angel above, tree, mountain
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${polyEl(`38,15 62,15 66,35 34,35`,pick(id,2),1.5)}
    ${polyEl(`42,35 58,35 54,48 46,48`,pick(id,3),1.5)}
    ${lineEl(50,35,50,15,1.5)}
    ${polyEl(`28,50 42,50 38,115 34,115`,pick(id,4),1.5)}
    ${polyEl(`58,50 72,50 66,115 62,115`,pick(id,5),1.5)}
    ${circleEl(35,38,5,pick(id,1),1)}
    ${circleEl(65,38,5,pick(id,1),1)}
    ${polyEl(`20,60 38,70 22,95`,pick(id,0),1)}`;
}

function artChariot(id) {
  // Canopy, charioteer, two sphinxes, wheels
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${rectEl(30,15,40,20,pick(id,2),1.5)}
    ${polyEl(`38,35 62,35 58,80 42,80`,pick(id,1),1.5)}
    ${circleEl(50,58,9,pick(id,3),1.5)}
    ${circleEl(30,122,10,pick(id,4),1.5)}
    ${circleEl(70,122,10,pick(id,4),1.5)}
    ${polyEl(`22,108 38,108 34,135 26,135`,pick(id,5),1.5)}
    ${polyEl(`62,108 78,108 74,135 66,135`,pick(id,5),1.5)}
    ${polyEl(`50,20 58,15 58,25`,pick(id,3),1)}`;
}

function artStrength(id) {
  // Woman above, lion below, infinity symbol
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${polyEl(`38,28 62,28 58,75 42,75`,pick(id,1),1.5)}
    ${circleEl(50,48,10,pick(id,2),1.5)}
    ${polyEl(`32,80 68,80 62,120 38,120`,pick(id,3),1.5)}
    ${circleEl(50,102,11,pick(id,4),1.5)}
    ${polyEl(`30,118 70,118 66,130 34,130`,pick(id,5),1.5)}
    ${lineEl(38,28,50,32,1.5)}
    ${lineEl(62,28,50,32,1.5)}`;
}

function artHermit(id) {
  // Hooded figure, lantern, staff, mountain background
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${polyEl(`10,45 90,45 85,75 15,75`,pick(id,3),1)}
    ${polyEl(`38,30 62,30 60,105 40,105`,pick(id,1),1.5)}
    ${polyEl(`42,38 58,38 56,65 44,65`,pick(id,2),1)}
    ${circleEl(50,38,12,pick(id,4),1.5)}
    ${lineEl(28,60,28,140,2.5)}
    ${circleEl(72,70,8,pick(id,5),1.5)}
    ${circleEl(72,70,3,'rgba(220,225,240,0.6)',0.5)}`;
}

function artWheelFortune(id) {
  // Wheel with spokes, four creatures at corners
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${circleEl(50,70,30,pick(id,2),1.5)}
    ${circleEl(50,70,22,pick(id,1),1)}
    ${circleEl(50,70,8,pick(id,4),1.5)}
    ${lineEl(50,40,50,100,2)}
    ${lineEl(20,70,80,70,2)}
    ${lineEl(30,50,70,90,2)}
    ${lineEl(30,90,70,50,2)}
    ${polyEl(`15,20 30,20 28,35 17,35`,pick(id,5),1)}
    ${polyEl(`70,20 85,20 83,35 72,35`,pick(id,3),1)}
    ${polyEl(`15,115 30,115 28,130 17,130`,pick(id,3),1)}
    ${polyEl(`70,115 85,115 83,130 72,130`,pick(id,5),1)}`;
}

function artJustice(id) {
  // Central figure, scales, sword, pillars
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${rectEl(16,18,10,112,pick(id,3),1.5)}
    ${rectEl(74,18,10,112,pick(id,3),1.5)}
    ${polyEl(`40,32 60,32 56,120 44,120`,pick(id,1),1.5)}
    ${circleEl(50,48,9,pick(id,2),1.5)}
    ${lineEl(50,32,50,18,2.5)}
    ${polyEl(`28,55 44,55 40,68 32,68`,pick(id,4),1.5)}
    ${polyEl(`56,55 72,55 68,68 60,68`,pick(id,4),1.5)}
    ${circleEl(36,60,3,pick(id,5),1)}
    ${circleEl(64,60,3,pick(id,5),1)}`;
}

function artHangedMan(id) {
  // Inverted figure, T-cross/tree, halo
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${rectEl(42,10,16,100,pick(id,3),1.5)}
    ${rectEl(20,55,60,14,pick(id,3),1.5)}
    ${circleEl(50,30,16,pick(id,2),1.5)}
    ${polyEl(`38,45 62,45 56,85 44,85`,pick(id,1),1.5)}
    ${lineEl(50,85,50,105,2)}
    ${lineEl(50,105,42,120,2)}
    ${lineEl(50,105,58,120,2)}`;
}

function artDeath(id) {
  // Skeletal figure, horse, rising sun, figures below
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${circleEl(50,35,18,pick(id,2),1.5)}
    ${polyEl(`30,35 70,35 75,90 25,90`,pick(id,1),1.5)}
    ${polyEl(`35,60 65,60 62,85 38,85`,pick(id,4),1)}
    ${lineEl(50,75,50,85,2)}
    ${polyEl(`20,95 40,95 35,128 25,128`,pick(id,5),1)}
    ${polyEl(`60,95 80,95 75,128 65,128`,pick(id,5),1)}
    ${circleEl(30,108,6,pick(id,3),1)}
    ${circleEl(70,108,6,pick(id,3),1)}`;
}

function artTemperance(id) {
  // Winged angel, two cups, flowing liquid
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${polyEl(`34,20 66,20 70,45 30,45`,pick(id,2),1.5)}
    ${polyEl(`36,45 64,45 58,110 42,110`,pick(id,1),1.5)}
    ${circleEl(50,60,8,pick(id,3),1.5)}
    ${polyEl(`38,50 62,50 58,48 42,48`,pick(id,4),1)}
    ${polyEl(`38,70 62,70 58,68 42,68`,pick(id,4),1)}
    ${circleEl(36,78,7,pick(id,5),1.5)}
    ${circleEl(64,42,7,pick(id,5),1.5)}
    ${lineEl(43,75,57,45,2)}`;
}

function artDevil(id) {
  // Devil figure, two chained figures, inverted pentagram
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${polyEl(`34,18 66,18 70,55 30,55`,pick(id,3),1.5)}
    ${polyEl(`38,32 50,18 62,32 50,42`,pick(id,2),1.5)}
    ${circleEl(50,35,5,pick(id,1),1)}
    ${polyEl(`28,55 42,55 38,100 32,100`,pick(id,4),1.5)}
    ${polyEl(`58,55 72,55 68,100 62,100`,pick(id,4),1.5)}
    ${lineEl(38,72,62,72,2)}
    ${lineEl(38,88,62,88,2)}`;
}

function artTower(id) {
  // Tower, lightning bolt, falling figures
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${rectEl(36,30,28,90,pick(id,3),1.5)}
    ${polyEl(`32,30 68,30 58,18 42,18`,pick(id,1),1.5)}
    ${polyEl(`36,55 64,55 62,60 38,60`,pick(id,5),1)}
    ${polyEl(`36,80 64,80 62,85 38,85`,pick(id,5),1)}
    ${polyEl(`46,18 56,18 62,4 42,0`,pick(id,2),1.5)}
    ${polyEl(`22,110 34,110 30,128 26,128`,pick(id,4),1)}
    ${polyEl(`66,105 78,105 74,125 70,125`,pick(id,4),1)}`;
}

function artStar(id) {
  // Kneeling woman, vessels, seven stars
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${circleEl(25,18,4,pick(id,2),1)}
    ${circleEl(50,12,5,pick(id,2),1)}
    ${circleEl(75,18,4,pick(id,2),1)}
    ${circleEl(35,28,3,pick(id,2),1)}
    ${circleEl(65,28,3,pick(id,2),1)}
    ${circleEl(20,30,3,pick(id,2),1)}
    ${circleEl(80,30,3,pick(id,2),1)}
    ${polyEl(`32,60 68,60 62,120 38,120`,pick(id,1),1.5)}
    ${circleEl(50,82,9,pick(id,3),1.5)}
    ${polyEl(`28,110 50,95 50,140`,pick(id,5),1.5)}
    ${polyEl(`50,95 72,110 50,140`,pick(id,5),1.5)}`;
}

function artMoon(id) {
  // Moon, two towers, path, crayfish, dogs
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${circleEl(50,30,18,pick(id,2),1.5)}
    ${circleEl(42,26,14,pick(id,0),1.5)}
    ${rectEl(12,50,16,40,pick(id,3),1.5)}
    ${rectEl(72,50,16,40,pick(id,3),1.5)}
    ${polyEl(`44,80 56,80 78,130 22,130`,pick(id,1),1.5)}
    ${polyEl(`40,108 60,108 56,125 44,125`,pick(id,4),1.5)}
    ${polyEl(`22,120 38,120 34,135 26,135`,pick(id,5),1)}
    ${polyEl(`62,120 78,120 74,135 66,135`,pick(id,5),1)}`;
}

function artSun(id) {
  // Large sun, child on horse, sunflowers
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${circleEl(50,35,28,pick(id,2),1.5)}
    ${circleEl(50,35,18,pick(id,1),1)}
    ${polyEl(`32,60 68,60 72,75 28,75`,pick(id,3),1.5)}
    ${polyEl(`35,75 65,75 62,115 38,115`,pick(id,4),1.5)}
    ${polyEl(`40,105 60,105 56,110 44,110`,pick(id,5),1.5)}
    ${circleEl(28,90,5,pick(id,0),1)}
    ${circleEl(72,90,5,pick(id,0),1)}
    ${lineEl(50,30,50,12,1.5)}
    ${lineEl(38,25,22,18,1.5)}
    ${lineEl(62,25,78,18,1.5)}`;
}

function artJudgment(id) {
  // Angel blowing trumpet, figures rising, coffins
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${polyEl(`32,12 68,12 72,48 28,48`,pick(id,2),1.5)}
    ${polyEl(`38,48 62,48 66,35 34,35`,pick(id,1),1.5)}
    ${lineEl(68,20,80,14,2)}
    ${lineEl(80,14,84,18,2)}
    ${rectEl(20,85,16,22,pick(id,5),1.5)}
    ${rectEl(42,85,16,22,pick(id,5),1.5)}
    ${rectEl(64,85,16,22,pick(id,5),1.5)}
    ${polyEl(`22,30 40,30 36,85 26,85`,pick(id,3),1)}
    ${polyEl(`44,30 56,30 52,85 46,85`,pick(id,3),1)}
    ${polyEl(`60,30 78,30 74,85 64,85`,pick(id,3),1)}`;
}

function artWorld(id) {
  // Dancing figure in wreath, four corner creatures
  return `
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${circleEl(50,68,32,pick(id,1),1.5)}
    ${circleEl(50,68,26,pick(id,2),1)}
    ${polyEl(`42,50 58,50 54,86 46,86`,pick(id,3),1.5)}
    ${circleEl(50,60,7,pick(id,4),1.5)}
    ${lineEl(50,68,50,50,2)}
    ${lineEl(50,68,38,78,2)}
    ${lineEl(50,68,62,78,2)}
    ${polyEl(`12,12 28,12 26,28 14,28`,pick(id,5),1)}
    ${polyEl(`72,12 88,12 86,28 74,28`,pick(id,5),1)}
    ${polyEl(`12,115 28,115 26,135 14,135`,pick(id,5),1)}
    ${polyEl(`72,115 88,115 86,135 74,135`,pick(id,5),1)}`;
}

// --- Minor Arcana patterns ---
const MINOR_ART_FNS = {
  0: artFool, 1: artMagician, 2: artHighPriestess, 3: artEmpress,
  4: artEmperor, 5: artHierophant, 6: artLovers, 7: artChariot,
  8: artStrength, 9: artHermit, 10: artWheelFortune, 11: artJustice,
  12: artHangedMan, 13: artDeath, 14: artTemperance, 15: artDevil,
  16: artTower, 17: artStar, 18: artMoon, 19: artSun,
  20: artJudgment, 21: artWorld,
};

// Suit symbol generators
function wandSymbol(cx, cy, s) {
  // A rod/column with small branches
  const h2 = s * 2.8, hw = s * 0.18;
  return `${rectEl(cx-hw, cy-h2, hw*2, h2*2, 'rgba(140,115,90,0.72)', 1)}
    ${polyEl(`${cx-hw-s*0.3},${cy-h2+s*0.4} ${cx+hw},${cy-h2+s*0.2} ${cx+hw},${cy-h2-s*0.4}`, 'rgba(125,90,72,0.76)', 0.8)}
    ${polyEl(`${cx+hw},${cy+h2-s*0.6} ${cx+hw+s*0.35},${cy+h2-s*0.2} ${cx+hw},${cy+h2+s*0.1}`, 'rgba(125,90,72,0.76)', 0.8)}`;
}

function cupSymbol(cx, cy, s) {
  // A chalice shape
  return `${polyEl(`${cx-s},${cy-s*2} ${cx+s},${cy-s*2} ${cx+s*0.7},${cy+s*1.5} ${cx-s*0.7},${cy+s*1.5}`, 'rgba(108,138,158,0.70)', 1.3)}
    ${rectEl(cx-s*0.5, cy+s*1.3, s, s*1.4, 'rgba(78,118,135,0.74)', 1)}
    ${rectEl(cx-s*0.8, cy+s*2.5, s*1.6, s*0.4, 'rgba(68,108,118,0.78)', 1)}`;
}

function swordSymbol(cx, cy, s) {
  // A blade shape via polygon + crossguard
  return `${polyEl(`${cx},${cy-s*3} ${cx+s*0.25},${cy-s*0.5} ${cx+s*0.7},${cy+s*1.5} ${cx-s*0.7},${cy+s*1.5} ${cx-s*0.25},${cy-s*0.5}`, 'rgba(135,145,165,0.70)', 1.2)}
    ${rectEl(cx-s, cy-s*0.2, s*2, s*0.35, 'rgba(115,108,148,0.72)', 1)}
    ${rectEl(cx-s*0.2, cy+s*1.3, s*0.4, s*1.5, 'rgba(90,100,128,0.78)', 1)}`;
}

function pentacleSymbol(cx, cy, s) {
  // Circle with inner pentagram
  return `${circleEl(cx, cy, s, 'rgba(142,135,98,0.72)', 1.2)}
    ${circleEl(cx, cy, s*0.5, 'rgba(115,108,80,0.76)', 0.8)}
    ${polyEl(`${cx},${cy-s*0.45} ${cx+s*0.14},${cy-s*0.12} ${cx+s*0.42},${cy-s*0.12} ${cx+s*0.22},${cy+s*0.08} ${cx+s*0.28},${cy+s*0.38} ${cx},${cy+s*0.18} ${cx-s*0.28},${cy+s*0.38} ${cx-s*0.22},${cy+s*0.08} ${cx-s*0.42},${cy-s*0.12} ${cx-s*0.14},${cy-s*0.12}`, 'rgba(88,100,72,0.80)', 0.6)}`;
}

function getSuitSymbol(suit) {
  return suit === 'wands' ? wandSymbol : suit === 'cups' ? cupSymbol : suit === 'swords' ? swordSymbol : pentacleSymbol;
}

// Minor Arcana number card layout patterns
const NUMBER_LAYOUTS = {
  1: [{x:50, y:72}],
  2: [{x:50, y:35},{x:50, y:108}],
  3: [{x:50, y:30},{x:35, y:95},{x:65, y:95}],
  4: [{x:30, y:30},{x:70, y:30},{x:30, y:108},{x:70, y:108}],
  5: [{x:50, y:26},{x:28, y:62},{x:72, y:62},{x:35, y:105},{x:65, y:105}],
  6: [{x:30, y:28},{x:70, y:28},{x:30, y:65},{x:70, y:65},{x:30, y:102},{x:70, y:102}],
  7: [{x:50, y:22},{x:28, y:50},{x:72, y:50},{x:35, y:78},{x:65, y:78},{x:28, y:110},{x:72, y:110}],
  8: [{x:30, y:22},{x:70, y:22},{x:30, y:55},{x:70, y:55},{x:30, y:88},{x:70, y:88},{x:30, y:118},{x:70, y:118}],
  9: [{x:30, y:20},{x:70, y:20},{x:30, y:48},{x:70, y:48},{x:50, y:72},{x:30, y:96},{x:70, y:96},{x:30, y:122},{x:70, y:122}],
  10:[{x:30, y:18},{x:70, y:18},{x:30, y:42},{x:70, y:42},{x:50, y:60},{x:30, y:78},{x:70, y:78},{x:30, y:100},{x:70, y:100},{x:50, y:125}],
};

// Court card figure + symbol
function courtFigure(id, suit, isKing, isQueen, isKnight) {
  const bg = pick(id, 0), bodyFill = pick(id, 1), head = pick(id, 2), symFill = pick(id, 3), throne = pick(id, 4);
  let art = rectEl(0, 0, 100, 150, bg, 1);
  // Throne
  art += rectEl(30, 98, 40, 22, throne, 1.5);
  // Body
  art += polyEl(`38,50 62,50 58,100 42,100`, bodyFill, 1.5);
  // Head
  art += circleEl(50, 38, 10, head, 1.5);
  // Crown for king/queen
  if (isKing || isQueen) {
    art += polyEl(`38,22 62,22 60,32 40,32`, pick(id, 5), 1.2);
    art += polyEl(`42,32 58,32 56,28 44,28`, pick(id, 2), 1);
  }
  // Suit symbol held
  const symFn = getSuitSymbol(suit);
  art += symFn(isKing || isQueen ? 50 : 50, isKing || isQueen ? 30 : 26, 8);
  return art;
}

// Build minor arcana art
function buildMinorArt(id) {
  const idx = id - 23;
  const suitIdx = Math.floor(idx / 14);
  const number = (idx % 14) + 1;
  const suits = ['wands', 'cups', 'swords', 'pentacles'];
  const suit = suits[suitIdx];

  let inner = '';

  if (number <= 10) {
    // Number cards — arrange suit symbols
    const layout = NUMBER_LAYOUTS[number];
    const symFn = getSuitSymbol(suit);
    const symSize = number <= 4 ? 10 : number <= 8 ? 9 : 7;
    layout.forEach(pos => {
      inner += symFn(pos.x, pos.y, symSize);
    });
  } else {
    // Court cards
    const isPage = number === 11;
    const isKnight = number === 12;
    const isQueen = number === 13;
    const isKing = number === 14;
    inner = courtFigure(id, suit, isKing, isQueen, isKnight);
  }

  return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" class="card-svg">
    ${rectEl(0,0,100,150,pick(id,0),1)}
    ${inner}
  </svg>`;
}

// --- Main export ---
function generateCardArt(cardId) {
  let svgContent = '';

  if (cardId <= 22) {
    // Major Arcana — hand-crafted geometric abstraction
    const fn = MINOR_ART_FNS[(cardId - 1)];
    svgContent = fn ? fn(cardId) : rectEl(0, 0, 100, 150, pick(cardId, 0), 1);
  } else {
    // Minor Arcana — generated from suit+number
    return buildMinorArt(cardId);
  }

  return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" class="card-svg">
    ${svgContent}
  </svg>`;
}
