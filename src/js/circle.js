/* ========================================
   circle.js — Three.js Card Circle
   Elegant card backs matching reveal-page design,
   subtle silver glow on every card edge.
   ======================================== */

const TarotCircle = {
  scene: null, camera: null, renderer: null, cards: [], raycaster: null, mouse: null,
  targetCount: 0, selectedCards: [], isDragging: false, prevMouseX: 0,
  rotationSpeed: 0, animationId: null, onSelectionComplete: null,

  // Build silver line patterns directly on each card (no textures → no mipmap artifacts)
  _buildCardBack(THREE, cardW, cardH) {
    const group = new THREE.Group();
    const hw = cardW / 2, hh = cardH / 2;

    const silver = new THREE.LineBasicMaterial({ color: 0xc8cfde, transparent: true, opacity: 0.78, depthTest: true, depthWrite: false });
    const dim    = new THREE.LineBasicMaterial({ color: 0x9098b0, transparent: true, opacity: 0.45, depthTest: true, depthWrite: false });

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

    // Outer & inner border
    group.add(new THREE.LineLoop(rect(-hw+m, -hh+m, hw-m, hh-m), silver));
    group.add(new THREE.LineLoop(rect(-hw+m2, -hh+m2, hw-m2, hh-m2), dim));

    // Corner diamonds
    const cd = 0.018;
    [[-hw+m2,-hh+m2],[hw-m2,-hh+m2],[-hw+m2,hh-m2],[hw-m2,hh-m2]].forEach(([cx,cy]) => {
      group.add(new THREE.LineLoop(diamond(cx, cy, cd, cd*1.3), dim));
    });

    // Central circle + diamond
    const cr = 0.088;
    group.add(new THREE.LineLoop(circle(0, 0, cr), silver));
    group.add(new THREE.LineLoop(diamond(0, 0, cr*0.42, cr*0.58), silver));

    // 4 S-curves
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
    this.updateProgress();
    const container = document.getElementById('circle-container');
    if (!container) return;
    if (this.renderer) { container.innerHTML = ''; cancelAnimationFrame(this.animationId); }

    const THREE = await import('three');
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x080c18, 0.00008);

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    this.camera.position.set(0, 0.05, 5.8);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.scene.add(new THREE.AmbientLight(0x445566, 2.2));
    const pt1 = new THREE.PointLight(0xc8d0d8, 2.4, 18);
    pt1.position.set(0, 2.5, 4);
    this.scene.add(pt1);
    const pt2 = new THREE.PointLight(0x8890a8, 1.5, 14);
    pt2.position.set(0, -1.5, -4);
    this.scene.add(pt2);

    const glowGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xa0afca, transparent: true, opacity: 0.35 });
    this.scene.add(new THREE.Mesh(glowGeo, glowMat));

    // Build one master card-back pattern (shared geometry, cloned per card)
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

      // Card mesh — solid black, no texture
      const geo = new THREE.PlaneGeometry(cardW, cardH);
      const mat = new THREE.MeshBasicMaterial({ color: 0x080a14 });
      const card = new THREE.Mesh(geo, mat);
      card.position.set(x, y, z);
      card.lookAt(0, y * 1.1, 0);
      card.rotateY(Math.PI);
      card.userData = { index: i, cardId: i + 1, isCard: true };

      // Glow plane — child of card, behind it (z=-0.003)
      const glowPlaneGeo = new THREE.PlaneGeometry(glowW, glowH);
      const glowPlaneMat = new THREE.MeshBasicMaterial({
        color: 0xbcc4d4, transparent: true, opacity: 0.22, side: THREE.DoubleSide,
      });
      const glowPlane = new THREE.Mesh(glowPlaneGeo, glowPlaneMat);
      glowPlane.position.z = -0.003;
      card.add(glowPlane);
      card.userData.glow = glowPlane;

      // Silver line pattern — child of card, in front (z=+0.004)
      const pattern = patternTemplate.clone();
      pattern.position.z = 0.004;
      card.add(pattern);
      card.userData.pattern = pattern;

      this.scene.add(card);
      this.cards.push(card);
    }

    this._bindEvents(container);
    this._animate();
  },

  _bindEvents(container) {
    const getX = (e) => e.touches ? e.touches[0].clientX : e.clientX;
    const onDown = (e) => {
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
    container.addEventListener('mousedown', onDown);
    container.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      this._rotateCards((e.deltaX || e.deltaY) * 0.003);
    }, { passive: false });
  },

  _trySelectCard(cx, cy) {
    const container = document.getElementById('circle-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    this.mouse.x = ((cx - rect.left) / container.clientWidth) * 2 - 1;
    this.mouse.y = -((cy - rect.top) / container.clientHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cards, false);
    if (intersects.length > 0) {
      const card = intersects[0].object;
      const alreadySelected = this.selectedCards.find(c => c.cardId === card.userData.cardId);
      if (alreadySelected) return;
      this.selectedCards.push({ cardId: card.userData.cardId, mesh: card });
      card.material = card.material.clone();
      card.material.color.set(0xc8d0e0);
      if (card.userData.glow) {
        card.userData.glow.material = card.userData.glow.material.clone();
        card.userData.glow.material.opacity = 0.42;
        card.userData.glow.material.color.set(0xbcc4d4);
      }
      TarotAudio.play('select');
      burstParticles(cx, cy, 25);
      this.updateProgress();
      if (this.selectedCards.length >= this.targetCount) {
        setTimeout(() => {
          const ids = this.selectedCards.map(c => c.cardId);
          this.destroy();
          if (this.onSelectionComplete) this.onSelectionComplete(ids);
        }, 600);
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
    if (!this.isDragging && Math.abs(this.rotationSpeed) > 0.0003) {
      this.rotationSpeed *= 0.95;
      this._rotateCards(this.rotationSpeed);
    }
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  },

  updateProgress() {
    const el = document.getElementById('circle-progress');
    if (el) {
      const r = this.targetCount - this.selectedCards.length;
      el.textContent = r > 0 ? `Remaining · 还需：${r}` : 'Complete!';
    }
  },

  destroy() {
    cancelAnimationFrame(this.animationId);
    if (this.renderer) { this.renderer.dispose(); this.renderer = null; }
    const container = document.getElementById('circle-container');
    if (container) container.innerHTML = '';
  },
};
