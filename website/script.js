// Roots & Morphology — site interactions.
// Theme (with circular wipe), mobile menu, scroll progress, reveals, split-text, tilt,
// card spotlight, cursor glow, back-to-top, and the auto-playing word-part demo.
(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---------- Theme (remembered per browser; falls back to the system setting) ----------
  const themeBtn = document.getElementById('theme-toggle');
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };
  applyTheme(store.get('rm-theme') || (systemDark.matches ? 'dark' : 'light'));

  themeBtn.addEventListener('click', (event) => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store.set('rm-theme', next);
    if (!document.startViewTransition || reduceMotion) return applyTheme(next);
    // New theme grows out of the button as a circle.
    const rect = themeBtn.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  });

  // ---------- Mobile menu ----------
  const menuBtn = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  const setMenu = (open) => {
    links.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ---------- Scroll: nav state, progress bar, back-to-top ----------
  const nav = document.querySelector('.nav');
  const toTop = document.getElementById('to-top');
  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const progress = max > 0 ? Math.min(1, scrollY / max) : 0;
    root.style.setProperty('--progress', progress.toFixed(4));
    nav.classList.toggle('is-scrolled', scrollY > 8);
    toTop.classList.toggle('is-visible', scrollY > innerHeight * 0.8);
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  // ---------- Split headline into words that rise in ----------
  let wordIndex = 0;
  document.querySelectorAll('[data-split]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const outer = document.createElement('span');
      outer.className = 'word';
      const inner = document.createElement('span');
      inner.textContent = w;
      inner.style.setProperty('--i', wordIndex++);
      outer.append(inner);
      el.append(outer);
      if (i < words.length - 1) el.append(' ');
    });
  });

  // ---------- Reveal on scroll, active nav link, steps line ----------
  const navLinks = [...links.querySelectorAll('a')];
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean).forEach((s) => spy.observe(s));

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 80}ms`;
        el.classList.add('revealed');
        // Clear the delay afterwards so hover transitions stay instant.
        setTimeout(() => { el.style.transitionDelay = ''; }, 1400);
        reveal.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));

    const steps = document.querySelector('.steps');
    if (steps) {
      new IntersectionObserver(([entry], obs) => {
        if (entry.isIntersecting) { steps.classList.add('is-drawn'); obs.disconnect(); }
      }, { threshold: 0.4 }).observe(steps);
    }
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed'));
  }

  // ---------- Pointer effects (desktop only) ----------
  if (finePointer && !reduceMotion) {
    // Soft glow that follows the cursor.
    const glow = document.querySelector('.cursor-glow');
    window.addEventListener('pointermove', (e) => {
      glow.style.setProperty('--cx', `${e.clientX}px`);
      glow.style.setProperty('--cy', `${e.clientY}px`);
    }, { passive: true });

    // Spotlight that tracks the cursor inside cards.
    document.querySelectorAll('.card, .pill-card, .step').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    // 3D tilt toward the cursor.
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = el.classList.contains('hero__phone') ? 10 : 7;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`);
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--rx', '0deg');
      });
    });

    // Buttons lean slightly toward the cursor.
    document.querySelectorAll('.btn--lg').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 8}px ${((e.clientY - r.top) / r.height - 0.5) * 6}px`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.translate = ''; });
    });
  }

  // ---------- Word-part demo (auto-plays until you pick a term) ----------
  const TERMS = {
    adrenaline: {
      segments: ['Ad', 'ren', 'al', 'ine'],
      parts: [
        { text: 'Ad', meaning: 'to, toward', origin: 'Latin' },
        { text: 'Ren', meaning: 'the kidney', origin: 'Latin' },
        { text: '-al', meaning: 'pertaining to', suffix: true },
        { text: '-ine', meaning: 'substance', suffix: true },
      ],
      literal: 'the hormone from the gland at the kidney',
    },
    cardiomyopathy: {
      segments: ['Cardio', 'myo', 'pathy'],
      parts: [
        { text: 'Kardia', meaning: 'heart', origin: 'Greek' },
        { text: 'Myo', meaning: 'muscle', origin: 'Greek' },
        { text: '-pathy', meaning: 'disease', suffix: true },
      ],
      literal: 'a disease of the heart muscle',
    },
    hepatitis: {
      segments: ['Hepat', 'itis'],
      parts: [
        { text: 'Hepar', meaning: 'the liver', origin: 'Greek' },
        { text: '-itis', meaning: 'inflammation', suffix: true },
      ],
      literal: 'inflammation of the liver',
    },
    osteoporosis: {
      segments: ['Osteo', 'poro', 'sis'],
      parts: [
        { text: 'Osteon', meaning: 'bone', origin: 'Greek' },
        { text: 'Poros', meaning: 'pore, passage', origin: 'Greek' },
        { text: '-osis', meaning: 'condition', suffix: true },
      ],
      literal: 'a condition of porous bone',
    },
  };
  const ORDER = Object.keys(TERMS);
  const AUTOPLAY_MS = 5000;

  const wordEl = document.getElementById('demo-word');
  const partsEl = document.getElementById('demo-parts');
  const literalEl = document.getElementById('demo-literal');
  const timerEl = document.querySelector('.demo__timer');
  const pill = document.querySelector('.demo__pill');
  const tabs = [...document.querySelectorAll('.demo__tab')];
  let current = ORDER[0];
  let autoplay = !reduceMotion;
  let timer = null;

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  };

  const movePill = () => {
    const active = tabs.find((t) => t.dataset.term === current);
    if (!active || !pill) return;
    pill.style.left = `${active.offsetLeft}px`;
    pill.style.width = `${active.offsetWidth}px`;
    // Keep the active tab visible on narrow screens (scrolls only the tab strip, never the page).
    const strip = active.parentElement;
    strip.scrollTo({ left: active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const restartTimer = () => {
    clearTimeout(timer);
    timerEl.classList.remove('is-running');
    if (!autoplay) { timerEl.classList.add('is-off'); return; }
    void timerEl.offsetWidth;
    timerEl.style.setProperty('--dur', `${AUTOPLAY_MS}ms`);
    timerEl.classList.add('is-running');
    timer = setTimeout(() => show(ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]), AUTOPLAY_MS);
  };

  const show = (key) => {
    const term = TERMS[key];
    if (!term) return;
    current = key;
    tabs.forEach((t) => {
      const selected = t.dataset.term === key;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    movePill();

    // The word, split into its pieces.
    wordEl.replaceChildren();
    term.segments.forEach((s, i) => {
      const seg = el('span', `seg${i % 2 ? ' seg--alt' : ''}`, s);
      seg.style.animationDelay = `${i * 90}ms`;
      wordEl.append(seg);
    });

    // The chips.
    partsEl.replaceChildren();
    term.parts.forEach((part, i) => {
      if (i > 0) {
        const plus = el('span', 'demo__plus', '+');
        plus.style.animationDelay = `${250 + i * 140 - 60}ms`;
        partsEl.append(plus);
      }
      const chip = el('div', `part${part.suffix ? ' part--suffix' : ''}`);
      chip.style.animationDelay = `${250 + i * 140}ms`;
      chip.append(el('b', '', part.text), el('small', '', part.meaning), el('em', '', part.suffix ? 'suffix' : part.origin));
      chip.addEventListener('animationend', () => chip.classList.add('is-in'), { once: true });
      partsEl.append(chip);
    });

    literalEl.replaceChildren(el('b', '', 'Literally: '), document.createTextNode(`“${term.literal}”`));
    literalEl.style.animation = 'none';
    void literalEl.offsetWidth;
    literalEl.style.animation = '';
    literalEl.style.animationDelay = `${350 + term.parts.length * 140}ms`;

    restartTimer();
  };

  const pick = (key) => { autoplay = false; show(key); };
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => pick(tab.dataset.term));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const i = tabs.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1);
      const next = tabs[(i + tabs.length) % tabs.length];
      next.focus();
      pick(next.dataset.term);
    });
  });

  // Only auto-play while the demo is on screen.
  const demo = document.querySelector('.demo');
  if ('IntersectionObserver' in window && demo) {
    new IntersectionObserver(([entry]) => {
      if (!autoplay) return;
      if (entry.isIntersecting) restartTimer();
      else { clearTimeout(timer); timerEl.classList.remove('is-running'); }
    }, { threshold: 0.3 }).observe(demo);
  }
  window.addEventListener('resize', movePill);
  document.fonts?.ready.then(movePill);
  show(current);
  clearTimeout(timer); // start once the demo scrolls into view

  document.getElementById('year').textContent = new Date().getFullYear();
})();
