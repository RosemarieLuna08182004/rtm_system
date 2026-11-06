// Roots & Morphology — site interactions.
// Theme (with circular wipe), mobile menu, scroll progress, reveals, split-text, tilt,
// card spotlight, cursor glow and back-to-top.
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

  // ---------- Illustration lightbox ----------
  const box = document.getElementById('lightbox');
  const items = [...document.querySelectorAll('.gallery__btn')];
  if (box && items.length && typeof box.showModal === 'function') {
    const img = document.getElementById('lightbox-img');
    let index = 0;
    const show = (i) => {
      index = (i + items.length) % items.length;
      const { full, term, volume } = items[index].dataset;
      img.src = full;
      img.alt = `Illustration of ${term}`;
      img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
      document.getElementById('lightbox-term').textContent = term;
      document.getElementById('lightbox-volume').textContent = volume;
    };
    items.forEach((btn, i) => btn.addEventListener('click', () => { show(i); box.showModal(); }));
    box.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => show(index + Number(b.dataset.step))));
    box.querySelector('[data-close]').addEventListener('click', () => box.close());
    box.addEventListener('click', (e) => { if (e.target === box) box.close(); });   // click outside the picture
    box.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'ArrowLeft') show(index - 1);
    });
    box.addEventListener('close', () => items[index].focus());
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
