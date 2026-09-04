/* oil-fluid — still-water droplet ripples.
 *
 * Usage:  <script src="oil-fluid.js"></script>
 *         <oil-fluid></oil-fluid>     <!-- once, anywhere in the body -->
 *
 * Optional attributes: palette="#C19A3E,#B08D4F,..."  z-index="190"
 *                      opacity="0.95"  blend="multiply"
 *
 * Idle state is perfectly calm: the rAF loop parks itself the moment no ripple is
 * alive, so nothing animates until the user moves or clicks.
 *
 * Pointer movement drops tiny droplets along the path (spaced by distance, not
 * time, so they read as discrete impacts rather than a trail). A click drops a
 * large one: sharp impact, strong leading ring, 2–4 weaker rings behind it, a
 * broad translucent oil layer, and a very soft background swell — each with its
 * own delay, speed, decay and distortion.
 *
 * One canvas at half resolution, lightly blurred, multiply-blended. No DOM node
 * per ripple, no React state, no dependencies. Honours prefers-reduced-motion.
 */
(function () {
  if (typeof customElements === 'undefined') return;
  if (customElements.get('oil-fluid')) return;

  const DEFAULT_PALETTE = [
    [193, 154, 62],   // amber
    [176, 141, 79],   // gold
    [212, 186, 133],  // warm cream
    [140, 160, 118],  // olive shadow
  ];
  const hexToRgb = h => {
    h = h.trim().replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgba = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  const easeOut = t => 1 - Math.pow(1 - t, 2.6);   // decelerating expansion
  const rand = (a, b) => a + Math.random() * (b - a);

  class OilFluid extends HTMLElement {
    static get observedAttributes() {
      return ['palette', 'z-index', 'opacity', 'blend'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'palette') {
        this.palette = newVal ? newVal.split(',').filter(Boolean).map(hexToRgb) : DEFAULT_PALETTE;
      }
      if (this.canvas) {
        if (name === 'blend') this.canvas.style.mixBlendMode = newVal;
        if (name === 'opacity') this.canvas.style.opacity = newVal;
      }
      if (name === 'z-index') {
        this.style.zIndex = newVal;
      }
    }

    connectedCallback() {
      if (this._up) return;
      this._up = true;

      this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.measure();

      if (!this.palette) {
        const pAttr = this.getAttribute('palette');
        this.palette = pAttr ? pAttr.split(',').filter(Boolean).map(hexToRgb) : DEFAULT_PALETTE;
      }

      const zIndex = this.getAttribute('z-index') || '190';
      const strength = this.getAttribute('opacity') || '0.95';
      const blend = this.getAttribute('blend') || 'multiply';

      this.style.cssText = 'position:fixed;inset:0;pointer-events:none;contain:strict;z-index:' + zIndex + ';';
      const c = this.canvas = document.createElement('canvas');
      c.style.cssText = 'width:100%;height:100%;display:block;mix-blend-mode:' + blend + ';' +
        'filter:blur(5px) saturate(1.04);transform:translateZ(0);opacity:' + strength + ';';
      this.appendChild(c);
      this.ctx = c.getContext('2d', { alpha: true });

      this.ripples = [];
      this.last = null;
      this.raf = 0;

      this.onResize = () => { this.measure(); this.resize(); };

      this.onMove = e => {
        if (this.reduce || this.tier === 'mobile' || e.pointerType === 'touch') return;
        const x = e.clientX, y = e.clientY, now = performance.now();
        if (!this.last) { this.last = { x, y, t: now }; return; }
        const dx = x - this.last.x, dy = y - this.last.y;
        const dist = Math.hypot(dx, dy);
        if (dist < this.step) return;                       // spacing = discrete impacts
        const v = dist / Math.max(16, now - this.last.t);   // px/ms
        this.last = { x, y, t: now };
        if (this.ripples.length > 25) return;
        this.droplet(x, y, Math.min(1, v / 2.2));
      };

      this.onDown = e => {
        const t = e.changedTouches ? e.changedTouches[0] : e;
        const onCta = !!(e.target && e.target.closest && e.target.closest('button,a,[role="button"],input,select'));
        this.splash(t.clientX, t.clientY, onCta ? 0.6 : 0.8);
      };

      addEventListener('resize', this.onResize, { passive: true });
      addEventListener('pointermove', this.onMove, { passive: true });
      addEventListener('pointerdown', this.onDown, { passive: true });
      this.resize();
    }

    disconnectedCallback() {
      cancelAnimationFrame(this.raf);
      removeEventListener('resize', this.onResize);
      removeEventListener('pointermove', this.onMove);
      removeEventListener('pointerdown', this.onDown);
      this.ripples.length = 0;
      this._up = false;
    }

    measure() {
      this.tier = innerWidth < 760 ? 'mobile' : innerWidth < 1180 ? 'tablet' : 'desktop';
      this.scale = this.tier === 'desktop' ? 0.5 : 0.36;
      this.step = this.tier === 'desktop' ? 65 : 85;   // slightly wider spacing for slow ripples
    }

    resize() {
      const s = this.scale;
      this.w = Math.max(1, Math.round(innerWidth * s));
      this.h = Math.max(1, Math.round(innerHeight * s));
      this.canvas.width = this.w;
      this.canvas.height = this.h;
    }

    wake() {
      if (!this.raf) {
        this.prev = performance.now();
        this.raf = requestAnimationFrame(this.tick = this.tick.bind(this));
      }
    }

    /* Very smooth, slow water ripple effect for hover */
    droplet(x, y, k) {
      const echo = Math.random() > 0.4;
      const rings = [
        // Very slow, soft expansion
        { delay: 0, r0: 2, r1: 80 + k * 40, life: 2500 + k * 1000, a: 0.12 + k * 0.05, w: 0.1, wob: rand(0.005, 0.015) },
      ];
      if (echo) rings.push({
        delay: 400 + k * 100, r0: 1, r1: 50 + k * 30, life: 2000 + k * 800,
        a: 0.08 + k * 0.04, w: 0.06, wob: rand(0.01, 0.02),
      });
      // Select a random color from the current palette array
      const color = this.palette[(Math.random() * this.palette.length) | 0];
      this.push(x, y, rings, color, 0.02);
    }

    /* Gentle, subtle water droplet ripple for clicks (no shading/fill) */
    splash(x, y, k) {
      if (this.reduce) return;
      const rings = [
        { delay: 0, r0: 2, r1: 120 * k, life: 1800, a: 0.2 * k, w: 0.12, wob: 0.01, fill: false },
        { delay: 300, r0: 4, r1: 180 * k, life: 2200, a: 0.12 * k, w: 0.08, wob: 0.015, fill: false },
        { delay: 600, r0: 8, r1: 240 * k, life: 2600, a: 0.06 * k, w: 0.05, wob: 0.02, fill: false }
      ];
      this.push(x, y, rings, this.palette[0], 0);
    }

    push(x, y, rings, col, drift) {
      this.ripples.push({
        x, y, col, t: 0, rings,
        rot: Math.random() * Math.PI * 2,
        dx: drift ? rand(-1, 1) * 30 : 0,
        dy: drift ? rand(-1, 1) * 30 : 0,
        squash: rand(0.96, 1.0),
      });
      this.wake();
    }

    ring(rp, g, s) {
      const p = (rp.t - g.delay) / g.life;
      if (p <= 0 || p >= 1) return true;
      const e = easeOut(p);
      const r = (g.r0 + (g.r1 - g.r0) * e) * s;
      if (r < 0.5) return true;
      
      const rise = p < 0.15 ? p / 0.15 : 1; // Slower rise for softer appearance
      const alpha = g.a * rise * Math.pow(1 - p, 1.8) * (1 - e * 0.45);
      if (alpha < 0.0015) return true;

      const ctx = this.ctx;
      const cx = (rp.x + rp.dx * e) * s, cy = (rp.y + rp.dy * e) * s;

      if (g.fill) {
        const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        rg.addColorStop(0, rgba(rp.col, alpha));
        rg.addColorStop(1, rgba(rp.col, 0));
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        return false;
      }

      const steps = r > 120 ? 44 : 26;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const wob = 1
          + Math.sin(a * 3 + rp.rot + p * 3.4) * g.wob
          + Math.sin(a * 5 - rp.rot * 1.7) * g.wob * 0.45;
        const rr = r * wob;
        const px = cx + Math.cos(a) * rr;
        const py = cy + Math.sin(a) * rr * rp.squash;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = rgba(rp.col, alpha);
      ctx.lineWidth = Math.max(0.6, r * g.w * (1 - e * 0.4));
      ctx.stroke();
      return false;
    }

    tick(now) {
      const dt = Math.min(48, now - this.prev);
      this.prev = now;
      const ctx = this.ctx, s = this.scale;
      ctx.clearRect(0, 0, this.w, this.h);

      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const rp = this.ripples[i];
        rp.t += dt;
        let dead = true;
        for (const g of rp.rings) if (!this.ring(rp, g, s)) dead = false;
        if (dead && rp.t > 60) this.ripples.splice(i, 1);
      }

      if (this.ripples.length) {
        this.raf = requestAnimationFrame(this.tick);
      } else {
        this.raf = 0;
        ctx.clearRect(0, 0, this.w, this.h);
      }
    }
  }
  customElements.define('oil-fluid', OilFluid);
})();

