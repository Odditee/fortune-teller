/* ========================================
   effects.js — Starfield + Particles + Toast
   ======================================== */

class StarField {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.meteors = [];
    this.resize();
    this.initStars();
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }
  initStars() {
    const count = Math.floor((this.width * this.height) / 1200);
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width, y: Math.random() * this.height,
        r: Math.random() * 1.6 + 0.3, brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        hue: Math.random() < 0.15 ? 210 + Math.random() * 30 : Math.random() < 0.1 ? 260 + Math.random() * 20 : 0,
        saturation: Math.random() < 0.2 ? 20 : 0,
      });
    }
  }
  spawnMeteor() {
    if (Math.random() < 0.003 && this.meteors.length < 2) {
      this.meteors.push({
        x: Math.random() * this.width * 0.8, y: Math.random() * this.height * 0.3,
        len: Math.random() * 80 + 40, speed: Math.random() * 6 + 4,
        life: 1, decay: Math.random() * 0.015 + 0.008,
      });
    }
  }
  draw() {
    const { ctx, width, height, stars, meteors } = this;
    const bg = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)*0.8);
    bg.addColorStop(0, '#0d1128'); bg.addColorStop(0.5, '#0a0e20'); bg.addColorStop(1, '#060912');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
    for (const s of stars) {
      s.brightness += s.twinkleSpeed;
      if (s.brightness > 1 || s.brightness < 0.3) s.twinkleSpeed *= -1;
      const alpha = s.brightness * 0.8 + 0.2;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = s.hue > 0 ? `hsla(${s.hue},${s.saturation}%,90%,${alpha})` : `rgba(255,255,255,${alpha})`;
      ctx.fill();
      if (s.r > 1.1 && s.brightness > 0.65) {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r*2.8, 0, Math.PI*2);
        ctx.fillStyle = s.hue > 0 ? `hsla(${s.hue},${s.saturation}%,90%,${alpha*0.1})` : `rgba(255,255,255,${alpha*0.08})`;
        ctx.fill();
      }
    }
    for (let i = meteors.length-1; i >= 0; i--) {
      const m = meteors[i]; m.x += m.speed; m.y += m.speed * 0.4; m.life -= m.decay;
      if (m.life <= 0) { meteors.splice(i, 1); continue; }
      const grad = ctx.createLinearGradient(m.x, m.y, m.x-m.len, m.y-m.len*0.4);
      grad.addColorStop(0, `rgba(255,255,255,${m.life})`); grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x-m.len, m.y-m.len*0.4);
      ctx.strokeStyle = grad; ctx.lineWidth = 1.2; ctx.stroke();
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
