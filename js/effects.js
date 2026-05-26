/* ========================================
   effects.js — Starfield + Particles + Toast
   ======================================== */

class StarField {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.beacons = [];
    this.meteors = [];
    this.time = 0;
    this.resize();
    this.initStars();
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    // Clear any lingering content
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.initStars();
  }
  initStars() {
    const count = Math.floor((this.width * this.height) / 5000);
    this.stars = [];
    this.beacons = [];
    for (let i = 0; i < count; i++) {
      const isBeacon = Math.random() < 0.03;
      const star = {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: isBeacon ? Math.random() * 1.0 + 1.0 : Math.random() * 0.9 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.025 + 0.008,
        hue: Math.random() < 0.15 ? 200 + Math.random() * 40 : Math.random() < 0.06 ? 260 + Math.random() * 20 : 0,
        saturation: Math.random() < 0.2 ? 12 : 0,
        baseAlpha: isBeacon ? 0.45 + Math.random() * 0.35 : 0.2 + Math.random() * 0.4,
      };
      if (isBeacon) {
        star.glowRadius = star.r * (3 + Math.random() * 4);
        star.glowAlpha = 0.03 + Math.random() * 0.05;
        this.beacons.push(star);
      }
      this.stars.push(star);
    }
  }
  spawnMeteor() {
    if (Math.random() < 0.006 && this.meteors.length < 3) {
      this.meteors.push({
        x: Math.random() * this.width * 0.8,
        y: Math.random() * this.height * 0.3,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 5 + 3,
        life: 1,
        decay: Math.random() * 0.012 + 0.006,
      });
    }
  }
  draw() {
    const { ctx, width, height, stars, beacons, meteors } = this;
    this.time += 0.016;

    // Deep near-black night sky with a whisper of dark blue at center
    const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.8);
    bg.addColorStop(0, '#040610');
    bg.addColorStop(0.4, '#020308');
    bg.addColorStop(1, '#000102');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Draw beacon glow halos first (behind stars, for depth)
    for (const b of beacons) {
      const flicker = Math.sin(this.time * b.speed * 100 + b.phase) * 0.5 + 0.5;
      const glowAlpha = b.glowAlpha * (0.5 + flicker * 0.5);
      const glowGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.glowRadius);
      if (b.hue > 0) {
        glowGrad.addColorStop(0, `hsla(${b.hue},30%,80%,${glowAlpha})`);
        glowGrad.addColorStop(0.4, `hsla(${b.hue},25%,70%,${glowAlpha * 0.35})`);
      } else {
        glowGrad.addColorStop(0, `rgba(210,218,240,${glowAlpha})`);
        glowGrad.addColorStop(0.4, `rgba(190,200,225,${glowAlpha * 0.25})`);
      }
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();
    }

    // Draw all stars with organic sine-wave twinkling
    for (const s of stars) {
      const twinkle = Math.sin(this.time * s.speed * 120 + s.phase) * 0.5 + 0.5;
      const alpha = s.baseAlpha * (0.1 + twinkle * 0.9);

      // Core dot
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.hue > 0
        ? `hsla(${s.hue},${s.saturation}%,98%,${Math.min(1, alpha * 1.4)})`
        : `rgba(248,250,255,${Math.min(1, alpha * 1.4)})`;
      ctx.fill();

      // Soft inner glow on brighter stars
      if (s.r > 0.6 || s.baseAlpha > 0.35) {
        const innerGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
        const color = s.hue > 0
          ? `hsla(${s.hue},${s.saturation}%,82%`
          : 'rgba(205,215,236';
        innerGlow.addColorStop(0, `${color},${alpha * 0.2})`);
        innerGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = innerGlow;
        ctx.fill();
      }
    }

    // Meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.speed;
      m.y += m.speed * 0.4;
      m.life -= m.decay;
      if (m.life <= 0) { meteors.splice(i, 1); continue; }
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y - m.len * 0.4);
      grad.addColorStop(0, `rgba(255,255,255,${m.life})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.len, m.y - m.len * 0.4);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }
  animate() { this.draw(); this.spawnMeteor(); requestAnimationFrame(() => this.animate()); }
  start() { this.animate(); }
}

function burstParticles(x, y, count = 30) {
  const container = document.createElement('div');
  container.style.cssText = `position:fixed;left:${x}px;top:${y}px;pointer-events:none;z-index:50;`;
  document.body.appendChild(container);
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const angle = (Math.PI*2*i)/count + Math.random()*0.3;
    const distance = 40 + Math.random()*80;
    const size = 2 + Math.random()*4;
    particle.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${Math.random()<0.4?'#a0afca':'#c8d0d8'};box-shadow:0 0 ${size*2}px ${Math.random()<0.4?'rgba(160,175,210,0.5)':'rgba(200,210,220,0.35)'};animation:particleBurst 1.2s ease-out forwards;animation-delay:${Math.random()*0.15}s;--tx:${Math.cos(angle)*distance}px;--ty:${Math.sin(angle)*distance}px;`;
    container.appendChild(particle);
  }
  setTimeout(() => container.remove(), 1500);
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `@keyframes particleBurst{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}`;
document.head.appendChild(particleStyle);

let toastTimer = null;
function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Stardust Transition ── */
function stardustTransition(fromEl, toEl, callback, duration = 600) {
  if (!fromEl || !toEl) {
    if (callback) callback();
    return;
  }

  const fromRect = fromEl.getBoundingClientRect();
  const cx = fromRect.left + fromRect.width / 2;
  const cy = fromRect.top + fromRect.height / 2;
  const count = 40;

  // Burst particles from source
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'stardust-particle';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 40 + Math.random() * 120;
    const size = 1.5 + Math.random() * 3;
    const isBright = Math.random() < 0.4;
    particle.style.cssText = `
      left: ${cx}px; top: ${cy}px; width: ${size}px; height: ${size}px;
      background: ${isBright ? 'rgba(200,210,240,0.9)' : 'rgba(184,192,216,0.8)'};
      box-shadow: 0 0 ${size * 3}px ${isBright ? 'rgba(200,210,240,0.6)' : 'rgba(184,192,216,0.4)'};
      --sdx: ${Math.cos(angle) * dist}px;
      --sdy: ${Math.sin(angle) * dist}px;
      animation-duration: ${duration * 0.8 + Math.random() * duration * 0.4}ms;
    `;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration + 200);
  }

  // Fade out source, fade in target
  fromEl.style.transition = `opacity ${duration * 0.5}ms ease, transform ${duration * 0.5}ms ease`;
  fromEl.style.opacity = '0';
  fromEl.style.transform = 'scale(0.95)';

  toEl.style.opacity = '0';
  toEl.style.transform = 'scale(0.95)';
  toEl.style.transition = `opacity ${duration * 0.5}ms ease ${duration * 0.3}ms, transform ${duration * 0.5}ms ease ${duration * 0.3}ms`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toEl.style.opacity = '1';
      toEl.style.transform = 'scale(1)';
    });
  });

  setTimeout(() => {
    fromEl.style.opacity = '';
    fromEl.style.transform = '';
    fromEl.style.transition = '';
    toEl.style.transition = '';
    if (callback) callback();
  }, duration);
}
