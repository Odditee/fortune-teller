/* ========================================
   circle.js — Three.js Card Circle
   Full-screen immersive card drawing experience.
   ======================================== */

const TarotCircle = {
  scene: null, camera: null, renderer: null, cards: [], raycaster: null, mouse: null,
  targetCount: 0, selectedCards: [], isDragging: false, prevMouseX: 0,
  rotationSpeed: 0, autoRotateSpeed: 0.0006, animationId: null,
  onSelectionComplete: null, circleGroup: null, circleOpacity: 0,

  _buildCardBack(THREE, cardW, cardH) {
    const group = new THREE.Group();
    const hw = cardW / 2, hh = cardH / 2;
    const silver = new THREE.LineBasicMaterial({ color: 0x8890a8, transparent: true, opacity: 0.55, depthTest: true, depthWrite: false });
    const dim    = new THREE.LineBasicMaterial({ color: 0x667088, transparent: true, opacity: 0.30, depthTest: true, depthWrite: false });

    const rect = (x1, y1, x2, y2) => new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y1, 0), new THREE.Vector3(x2, y2, 0), new THREE.Vector3(x1, y2, 0),
    ]);
    const circle = (cx, cy, r, n=48) => {
      const pts = []; for (let i = 0; i <= n; i++) { const a = (i/n)*Math.PI*2; pts.push(new THREE.Vector3(cx+Math.cos(a)*r, cy+Math.sin(a)*r, 0)); }
      return new THREE.BufferGeometry().setFromPoints(pts);
    };
    const diamond = (cx, cy, w, h) => new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(cx, cy-h, 0), new THREE.Vector3(cx+w, cy, 0), new THREE.Vector3(cx, cy+h, 0), new THREE.Vector3(cx-w, cy, 0),
    ]);

    const m = 0.028, m2 = m + 0.030;
    group.add(new THREE.LineLoop(rect(-hw+m, -hh+m, hw-m, hh-m), silver));
    group.add(new THREE.LineLoop(rect(-hw+m2, -hh+m2, hw-m2, hh-m2), dim));

    const cd = 0.018;
    [[-hw+m2,-hh+m2],[hw-m2,-hh+m2],[-hw+m2,hh-m2],[hw-m2,hh-m2]].forEach(([cx,cy]) => {
      group.add(new THREE.LineLoop(diamond(cx, cy, cd, cd*1.3), dim));
    });

    const cr = 0.088;
    group.add(new THREE.LineLoop(circle(0, 0, cr), silver));
    group.add(new THREE.LineLoop(diamond(0, 0, cr*0.42, cr*0.58), silver));

    const or = 0.16;
    for (let i = 0; i < 4; i++) {
      const a = Math.PI/4 + (Math.PI/2)*i;
      const ox = Math.cos(a)*or, oy = Math.sin(a)*or;
      const px = Math.cos(a+Math.PI/2)*or*0.32, py = Math.sin(a+Math.PI/2)*or*0.32;
      const pts = [];
      for (let j = 0; j <= 20; j++) {
        const t = j/20, ti = 1-t;
        pts.push(new THREE.Vector3(ti*ti*(ox-px)+2*ti*t*ox+t*t*(ox+px), ti*ti*(oy-py)+2*ti*t*oy+t*t*(oy+py), 0));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), dim));
    }
    return group;
  },

  async init(count, onComplete) {
    this.targetCount = count;
    this.selectedCards = [];
    this.onSelectionComplete = onComplete;
    this.circleOpacity = 0;
    this.updateProgress();

    const THREE = await import('three');
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000103, 0.00005);

    const w = window.innerWidth, h = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    this.camera.position.set(0, 0, 6.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    // Append to body for true full-screen
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.zIndex = '1';
    this.renderer.domElement.style.pointerEvents = 'auto';

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Dim lighting for deep-space mood
    this.scene.add(new THREE.AmbientLight(0x222233, 1.5));
    const pt1 = new THREE.PointLight(0x8890a8, 1.8, 20);
    pt1.position.set(0, 3, 4.5);
    this.scene.add(pt1);
    const pt2 = new THREE.PointLight(0x667088, 1.2, 16);
    pt2.position.set(0, -2, -5);
    this.scene.add(pt2);
    const pt3 = new THREE.PointLight(0x8899aa, 0.8, 12);
    pt3.position.set(3, 1, -3);
    this.scene.add(pt3);

    // Central glow
    const glowGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x8890a8, transparent: true, opacity: 0.15 });
    this.scene.add(new THREE.Mesh(glowGeo, glowMat));

    // Group for all cards (for opacity fade-in)
    this.circleGroup = new THREE.Group();
    this.scene.add(this.circleGroup);

    const cardW = 0.50, cardH = 0.75;
    const patternTemplate = this._buildCardBack(THREE, cardW, cardH);

    this.cards = [];
    const totalCards = 78;
    const radius = 4.8;
    const glowW = cardW + 0.10;
    const glowH = cardH + 0.10;

    for (let i = 0; i < totalCards; i++) {
      const angle = (i / totalCards) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.6;
      const y = Math.sin(angle * 2.5) * 0.25;

      const geo = new THREE.PlaneGeometry(cardW, cardH);
      const mat = new THREE.MeshBasicMaterial({ color: 0x030610, transparent: true, opacity: 0 });
      const card = new THREE.Mesh(geo, mat);
      card.position.set(x, y, z);
      card.lookAt(0, y * 1.1, 0);
      card.rotateY(Math.PI);
      card.userData = { index: i, cardId: i + 1, isCard: true, baseOpacity: 1 };

      // Glow behind card
      const glowPlaneGeo = new THREE.PlaneGeometry(glowW, glowH);
      const glowPlaneMat = new THREE.MeshBasicMaterial({
        color: 0x8890a8, transparent: true, opacity: 0, side: THREE.DoubleSide,
      });
      const glowPlane = new THREE.Mesh(glowPlaneGeo, glowPlaneMat);
      glowPlane.position.z = -0.003;
      card.add(glowPlane);
      card.userData.glow = glowPlane;

      // Silver line pattern
      const pattern = patternTemplate.clone();
      pattern.position.z = 0.004;
      card.add(pattern);
      card.userData.pattern = pattern;

      this.circleGroup.add(card);
      this.cards.push(card);
    }

    this._bindEvents();
    this._animate();

    // Fade cards in after a short delay
    setTimeout(() => this._fadeInCards(), 3000);
  },

  _fadeInCards() {
    const start = performance.now();
    const duration = 1200;
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      this.circleOpacity = ease;
      this.cards.forEach(card => {
        card.material.opacity = ease;
        if (card.userData.glow) card.userData.glow.material.opacity = 0.12 * ease;
      });
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  },

  _bindEvents() {
    const getX = (e) => e.touches ? e.touches[0].clientX : e.clientX;
    const getY = (e) => e.touches ? e.touches[0].clientY : e.clientY;
    const onDown = (e) => {
      if (!e.target.closest('#page-draw-circle') && e.target !== this.renderer?.domElement) return;
      e.preventDefault();
      this.isDragging = true; this.prevMouseX = getX(e); this.rotationSpeed = 0;
    };
    const onMove = (e) => {
      if (!this.isDragging) return;
      const dx = getX(e) - this.prevMouseX;
      this.rotationSpeed = dx * 0.005;
      this.prevMouseX = getX(e);
      this._rotateCards(this.rotationSpeed);
    };
    const onUp = (e) => {
      if (!this.isDragging) return;
      const cx = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const cy = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      const dx = Math.abs(cx - this.prevMouseX);
      this.isDragging = false;
      if (dx < 8 && Math.abs(this.rotationSpeed) < 0.008) this._trySelectCard(cx, cy);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    window.addEventListener('wheel', (e) => {
      if (!e.target.closest('#page-draw-circle') && e.target !== this.renderer?.domElement) return;
      e.preventDefault();
      this._rotateCards((e.deltaX || e.deltaY) * 0.003);
    }, { passive: false });
  },

  _trySelectCard(cx, cy) {
    if (this.selectedCards.length >= this.targetCount) return;
    this.mouse.x = (cx / window.innerWidth) * 2 - 1;
    this.mouse.y = -(cy / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cards, false);
    if (intersects.length > 0) {
      const card = intersects[0].object;
      const alreadySelected = this.selectedCards.find(c => c.cardId === card.userData.cardId);
      if (alreadySelected) return;
      this.selectedCards.push({ cardId: card.userData.cardId, mesh: card });
      card.material = card.material.clone();
      card.material.color.set(0x8890b0);
      if (card.userData.glow) {
        card.userData.glow.material = card.userData.glow.material.clone();
        card.userData.glow.material.opacity = 0.22;
        card.userData.glow.material.color.set(0x8890b0);
      }
      TarotAudio.play('select');
      burstParticles(cx, cy, 25);
      this.updateProgress();
      if (this.selectedCards.length >= this.targetCount) {
        // Show the "reveal" button
        const btn = document.getElementById('draw-action-btn');
        if (btn) btn.classList.add('visible');
      }
    }
  },

  _rotateCards(angle) {
    const r = 4.8;
    this.cards.forEach(card => {
      const ca = Math.atan2(card.position.z / 0.6, card.position.x);
      const newAngle = ca + angle;
      card.position.x = Math.cos(newAngle) * r;
      card.position.z = Math.sin(newAngle) * r * 0.6;
      card.position.y = Math.sin(newAngle * 2.5) * 0.25;
      card.lookAt(0, card.position.y * 1.1, 0);
      card.rotateY(Math.PI);
    });
  },

  _animate() {
    this.animationId = requestAnimationFrame(() => this._animate());
    // Auto-rotate
    if (!this.isDragging) {
      this._rotateCards(this.autoRotateSpeed);
    }
    // Manual rotation decay
    if (!this.isDragging && Math.abs(this.rotationSpeed) > 0.0003) {
      this.rotationSpeed *= 0.95;
      this._rotateCards(this.rotationSpeed);
    }
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  },

  reveal() {
    if (this.selectedCards.length < this.targetCount) return;
    const ids = this.selectedCards.map(c => c.cardId);
    this.destroy();
    if (this.onSelectionComplete) this.onSelectionComplete(ids);
  },

  updateProgress() {
    const el = document.getElementById('draw-progress');
    if (!el) return;
    const dots = [];
    for (let i = 0; i < this.targetCount; i++) {
      dots.push(`<span class="draw-progress-dot${i < this.selectedCards.length ? ' filled' : ''}"></span>`);
    }
    el.innerHTML = dots.join('');
  },

  destroy() {
    cancelAnimationFrame(this.animationId);
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }
    this.cards = [];
    this.selectedCards = [];
    this.circleGroup = null;
    this.scene = null;
  },
};
