/* ========================================
   audio.js — Web Audio API synthesized sounds
   ======================================== */

const TarotAudio = {
  ctx: null, enabled: true,

  init() {
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { this.enabled = false; }
  },

  play(type) {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    switch (type) {
      case 'draw': this._tone([400,800,1200], [0,0.3,0.5], 0.08, 0.6, 'sine'); break;
      case 'select': this._tone([880,1760], [0,0.1], 0.1, 0.3, 'sine'); break;
      case 'flip': this._noise(0.1, 0.02, 0.06); break;
      case 'reveal': [523,659,784,1047].forEach((f,i) => this._tone([f], [i*0.15], 0.06, 0.4, 'sine')); break;
    }
  },

  _tone(freqs, times, vol, dur, type) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    freqs.forEach((f,i) => osc.frequency.setValueAtTime(f, now + (times[i]||0)));
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + dur);
  },

  _noise(dur, decay, vol) {
    const now = this.ctx.currentTime;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random()*2-1) * Math.exp(-i/(this.ctx.sampleRate*decay));
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, now); gain.gain.exponentialRampToValueAtTime(0.001, now+dur);
    src.connect(gain); gain.connect(this.ctx.destination); src.start(now);
  },
};

document.addEventListener('click', () => { if (!TarotAudio.ctx) TarotAudio.init(); }, { once: true });
