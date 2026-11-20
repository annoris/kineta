/**
 * KINETA — 60fps GSAP, ScrollTrigger & Lenis Motion Choreography Engine
 *
 * Faithful replication of extrafazant.nl motion language:
 *  - Lenis + ScrollTrigger single-ticker sync with virtualScroll delta clamping
 *  - Instant page-ready Hero SplitText upward mask reveal (zero preloader block)
 *  - SplitText line & char reveals preserving .heading-alt and <br>
 *  - Scoped, quantized variable font-weight proximity hover (zero rAF layout thrash)
 *  - Desktop hero cursor photo trail (130px travel cycle, on-demand rAF)
 *  - DrawSVG wavy & persistent underlines
 *  - Seamless GPU marquee duplication (0% JS CPU)
 *  - Cached-rect interactive collage parallax
 *  - Instant dark/light navbar theme switching
 *  - Pinned 3D perspective case stack (desktop matchMedia)
 *  - On-demand custom cursor-marquee pill
 *  - Hover poster motion state toggles
 *  - Desktop team scrub parallax
 *  - Velocity-measured inertia momentum hover with elastic spring return
 *  - Cached-rect footer cursor image trail (85px spawn, GPU pop & cleanup)
 */

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const lerp = (a, b, t) => a + (b - a) * t;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const DEFAULT_TRAIL_IMAGES = [
  './src/assets/images/featured-volt-yuzu.jpg',
  './src/assets/images/flavor-berry-pulse.jpg',
  './src/assets/images/featured-solar-mango.jpg',
  './src/assets/images/featured-night-drop.jpg',
  './src/assets/images/intro-polaroid-1.jpg',
  './src/assets/images/intro-polaroid-2.jpg',
];

/* --------------------------------------------------------------------------
   1. Lenis Smooth Scroll + ScrollTrigger Single-Ticker Sync
   -------------------------------------------------------------------------- */
function initSmoothScroll(gsap, ScrollTrigger, reduced) {
  let lenis = null;

  if (!reduced && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
      smoothWheel: true,
      autoRaf: false,
      syncTouch: false,
      virtualScroll: (e) => {
        e.deltaY = Math.max(-100, Math.min(100, e.deltaY));
        e.deltaX = Math.max(-100, Math.min(100, e.deltaX));
        return true;
      },
    });

    window.__lenis = lenis;

    if (ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.config({ ignoreMobileResize: true });
      ScrollTrigger.addEventListener('refresh', () => {
        if (lenis && typeof lenis.resize === 'function') {
          lenis.resize();
        }
      });
    }

    if (gsap && gsap.ticker) {
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const fallbackRaf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(fallbackRaf);
      };
      requestAnimationFrame(fallbackRaf);
    }
  } else if (ScrollTrigger) {
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  // Smooth anchor scrolling on a[href^="#"] (skip triggers that open drawers/modals)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (
      anchor.hasAttribute('data-open-order-drawer') ||
      anchor.hasAttribute('data-drawer-open') ||
      anchor.hasAttribute('data-open-cookie-settings')
    ) {
      return;
    }
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      if (lenis && !reduced) {
        lenis.scrollTo(target, { offset: 0, duration: 0.9 });
      } else {
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      }
    });
  });

  // Smooth scroll-to-top buttons
  document.querySelectorAll('[data-scroll-top], .scroll-top-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis && !reduced) {
        lenis.scrollTo(0, { duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      }
    });
  });

  return lenis;
}

/* --------------------------------------------------------------------------
   2. SplitText DOM Utility (Preserves .heading-alt & <br>)
   -------------------------------------------------------------------------- */
function wrapTextChars(text, isAlt) {
  const frag = document.createDocumentFragment();
  const baseWght = isAlt ? 300 : 700;

  // Preserve whitespace tokens as real spaces so natural line wrapping stays intact
  const tokens = text.split(/(\s+)/);
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (!token) continue;
    if (/^\s+$/.test(token)) {
      frag.appendChild(document.createTextNode(' '));
      continue;
    }

    const wordSpan = document.createElement('span');
    wordSpan.className = 'split-word';
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';

    for (let c = 0; c < token.length; c += 1) {
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      charSpan.textContent = token[c];
      charSpan.dataset.baseWght = String(baseWght);
      charSpan.dataset.isAlt = isAlt ? '1' : '0';
      wordSpan.appendChild(charSpan);
    }

    frag.appendChild(wordSpan);
  }
  return frag;
}

function splitElement(el, { wrapLines, wrapChars }) {
  if (el.dataset.splitDone === 'true') {
    return {
      lines: Array.from(el.querySelectorAll('.line')),
      chars: Array.from(el.querySelectorAll('.char')),
    };
  }

  // Group child nodes into explicit lines separated by <br>
  const lineBuckets = [[]];
  const children = Array.from(el.childNodes);

  children.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
      lineBuckets.push([]);
    } else {
      lineBuckets[lineBuckets.length - 1].push(node);
    }
  });

  el.textContent = '';

  const lines = [];

  lineBuckets.forEach((bucket, lineIdx) => {
    const lineInner = document.createElement('span');
    lineInner.className = 'line';
    lineInner.style.display = 'inline-block';

    bucket.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.textContent;
        if (!raw) return;
        if (wrapChars) {
          lineInner.appendChild(wrapTextChars(raw, false));
        } else {
          lineInner.appendChild(document.createTextNode(raw));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        const isAlt = clone.classList.contains('heading-alt');
        const text = node.textContent || '';
        if (wrapChars) {
          clone.appendChild(wrapTextChars(text, isAlt));
        } else {
          clone.textContent = text;
        }
        lineInner.appendChild(clone);
      }
    });

    if (wrapLines) {
      const mask = document.createElement('span');
      mask.className = 'line-mask';
      mask.appendChild(lineInner);
      el.appendChild(mask);
    } else {
      el.appendChild(lineInner);
      if (lineIdx < lineBuckets.length - 1) {
        el.appendChild(document.createElement('br'));
      }
    }

    lines.push(lineInner);
  });

  el.dataset.splitDone = 'true';

  return {
    lines,
    chars: Array.from(el.querySelectorAll('.char')),
  };
}

/* --------------------------------------------------------------------------
   3. SplitText Line & Char Reveals ([data-text-reveal], [data-scroll-reveal])
   -------------------------------------------------------------------------- */
function initTextReveals(gsap, ScrollTrigger, reduced) {
  const revealEls = document.querySelectorAll('[data-text-reveal], [data-scroll-reveal]');
  if (!revealEls.length) return;

  revealEls.forEach((el) => {
    const wantsChars = el.hasAttribute('data-font-weight-hover');
    const { lines } = splitElement(el, { wrapLines: true, wrapChars: wantsChars });

    if (reduced || !gsap || !lines.length) {
      return;
    }

    const isHero = Boolean(el.closest('.section_hero'));
    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;

    if (isHero || alreadyInView) {
      gsap.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.95,
          stagger: 0.09,
          delay: isHero ? 0.05 : 0,
          ease: 'power4.out',
          force3D: true,
          clearProps: 'transform',
        }
      );
      return;
    }

    gsap.set(lines, { yPercent: 110, force3D: true });

    let revealed = false;
    const playReveal = () => {
      if (revealed) return;
      revealed = true;
      gsap.to(lines, {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power4.out',
        force3D: true,
        clearProps: 'transform',
      });
    };

    if (ScrollTrigger) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        onEnter: playReveal,
        onEnterBack: playReveal,
      });
    } else {
      playReveal();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Variable Font Weight Proximity Hover ([data-font-weight-hover])
      Scoped to hovered heading only; cached centers on pointerenter;
      quantized --wght steps of 30; zero getBoundingClientRect in move/rAF.
   -------------------------------------------------------------------------- */
function initFontWeightHover(reduced) {
  if (reduced || !isFinePointer()) return;

  const headings = document.querySelectorAll('[data-font-weight-hover]');
  if (!headings.length) return;

  headings.forEach((heading) => {
    const { chars } = splitElement(heading, {
      wrapLines: heading.hasAttribute('data-text-reveal') || heading.hasAttribute('data-scroll-reveal'),
      wrapChars: true,
    });
    if (!chars.length) return;

    let cachedChars = [];
    let radius = 220;
    let rafId = 0;
    let pointerX = 0;
    let pointerY = 0;
    let active = false;

    const cacheCharCenters = () => {
      const hRect = heading.getBoundingClientRect();
      radius = Math.max(180, Math.min(340, hRect.height * 1.15));
      cachedChars = chars.map((el) => {
        const r = el.getBoundingClientRect();
        const isAlt = el.dataset.isAlt === '1';
        return {
          el,
          cx: r.left + r.width * 0.5,
          cy: r.top + r.height * 0.5,
          restWght: isAlt ? 300 : 700,
          targetWght: isAlt ? 750 : 210,
          lastWght: isAlt ? 300 : 700,
        };
      });
    };

    const renderWeights = () => {
      rafId = 0;
      if (!active) return;

      for (let i = 0; i < cachedChars.length; i += 1) {
        const item = cachedChars[i];
        const dx = pointerX - item.cx;
        const dy = pointerY - item.cy;
        const dist = Math.hypot(dx, dy);

        let wght = item.restWght;
        if (dist < radius) {
          const t = 1 - dist / radius;
          const eased = t * t * (3 - 2 * t);
          const raw = item.restWght + (item.targetWght - item.restWght) * eased;
          wght = Math.round(raw / 30) * 30;
        }

        if (wght !== item.lastWght) {
          item.lastWght = wght;
          item.el.style.setProperty('--wght', String(wght));
        }
      }
    };

    heading.addEventListener(
      'pointerenter',
      (e) => {
        active = true;
        cacheCharCenters();
        pointerX = e.clientX;
        pointerY = e.clientY;
        if (!rafId) rafId = requestAnimationFrame(renderWeights);
      },
      { passive: true }
    );

    heading.addEventListener(
      'pointermove',
      (e) => {
        if (!active) return;
        pointerX = e.clientX;
        pointerY = e.clientY;
        if (!rafId) rafId = requestAnimationFrame(renderWeights);
      },
      { passive: true }
    );

    heading.addEventListener(
      'pointerleave',
      () => {
        active = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        for (let i = 0; i < cachedChars.length; i += 1) {
          const item = cachedChars[i];
          if (item.lastWght !== item.restWght) {
            item.lastWght = item.restWght;
            item.el.style.setProperty('--wght', String(item.restWght));
          }
        }
      },
      { passive: true }
    );
  });
}

/* --------------------------------------------------------------------------
   5. Hero Center Photo Trail (.cursor-card.is-home)
      Desktop (> 991px) hidden until pointer moves inside .section_hero;
      cycles through all .cursor-card_media every 130px; stops rAF on leave.
   -------------------------------------------------------------------------- */
function initHeroCursorCard(reduced) {
  if (reduced || !isFinePointer()) return;

  const hero = document.querySelector('.section_hero');
  const card = document.querySelector('.cursor-card.is-home');
  if (!hero || !card) return;

  const medias = Array.from(card.querySelectorAll('.cursor-card_media'));
  if (!medias.length) return;

  const desktopMq = window.matchMedia('(min-width: 992px)');

  let activeIndex = 0;
  let isInside = false;
  let rafId = 0;
  let heroRect = null;
  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  let lastCycleX = 0;
  let lastCycleY = 0;
  let travelDist = 0;
  let hasMoved = false;

  const showSlide = (idx) => {
    medias.forEach((media, i) => {
      const isCurrent = i === idx;
      media.style.opacity = isCurrent ? '1' : '0';
      media.style.zIndex = isCurrent ? '2' : '1';
    });
  };

  showSlide(0);

  const tick = () => {
    if (!isInside || !desktopMq.matches) {
      rafId = 0;
      return;
    }

    curX = lerp(curX, targetX, 0.14);
    curY = lerp(curY, targetY, 0.14);

    card.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0) scale(1.08)`;

    if (Math.abs(targetX - curX) > 0.25 || Math.abs(targetY - curY) > 0.25) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  };

  hero.addEventListener(
    'pointerenter',
    (e) => {
      if (!desktopMq.matches) return;
      heroRect = hero.getBoundingClientRect();
      isInside = true;
      hasMoved = false;
      targetX = clamp(e.clientX, heroRect.left, heroRect.right);
      targetY = clamp(e.clientY, heroRect.top, heroRect.bottom);
      curX = targetX;
      curY = targetY;
      lastCycleX = e.clientX;
      lastCycleY = e.clientY;
      travelDist = 0;
    },
    { passive: true }
  );

  hero.addEventListener(
    'pointermove',
    (e) => {
      if (!desktopMq.matches) return;

      if (!isInside) {
        heroRect = hero.getBoundingClientRect();
        isInside = true;
        curX = e.clientX;
        curY = e.clientY;
        lastCycleX = e.clientX;
        lastCycleY = e.clientY;
      }

      if (!hasMoved) {
        hasMoved = true;
        card.classList.add('on');
        card.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0) scale(1.08)`;
      }

      targetX = e.clientX;
      targetY = e.clientY;

      const step = Math.hypot(e.clientX - lastCycleX, e.clientY - lastCycleY);
      travelDist += step;
      lastCycleX = e.clientX;
      lastCycleY = e.clientY;

      if (travelDist >= 130) {
        travelDist = 0;
        activeIndex = (activeIndex + 1) % medias.length;
        showSlide(activeIndex);
      }

      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    },
    { passive: true }
  );

  hero.addEventListener(
    'pointerleave',
    () => {
      isInside = false;
      hasMoved = false;
      card.classList.remove('on');
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    },
    { passive: true }
  );

  // Clean inline transform if resized below desktop breakpoint
  desktopMq.addEventListener('change', (ev) => {
    if (!ev.matches) {
      isInside = false;
      card.classList.remove('on');
      card.style.transform = '';
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }
  });
}

/* --------------------------------------------------------------------------
   6. DrawSVG Wavy & Persist Underlines
      ([data-draw-line-always], [data-draw-line-persist])
   -------------------------------------------------------------------------- */
function initDrawLines(gsap, ScrollTrigger, reduced) {
  if (reduced || !gsap) return;

  // Wavy SVG underlines on .btn-link [data-draw-line-always]
  document.querySelectorAll('[data-draw-line-always]').forEach((el) => {
    if (el.hasAttribute('data-draw-line-persist')) return;
    const path = el.querySelector('path');
    if (!path || typeof path.getTotalLength !== 'function') return;

    const hoverTarget = el.closest('.btn-link') || el;
    const len = Math.ceil(path.getTotalLength());
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;

    const drawIn = () => {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.85,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const rect = hoverTarget.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      gsap.delayedCall(0.25, drawIn);
    } else if (ScrollTrigger) {
      ScrollTrigger.create({
        trigger: hoverTarget,
        start: 'top 92%',
        onEnter: drawIn,
        onEnterBack: drawIn,
      });
    } else {
      drawIn();
    }

    hoverTarget.addEventListener('pointerenter', () => {
      gsap.killTweensOf(path);
      gsap
        .timeline()
        .to(path, { strokeDashoffset: -len, duration: 0.28, ease: 'power2.in' })
        .set(path, { strokeDashoffset: len })
        .to(path, { strokeDashoffset: 0, duration: 0.55, ease: 'power3.out' });
    });
  });

  // Persistent draw-line SVG boxes on nav links ([data-draw-line-persist])
  document.querySelectorAll('[data-draw-line-persist]').forEach((el) => {
    const path = el.querySelector('path');
    if (!path || typeof path.getTotalLength !== 'function') return;

    const hoverTarget = el.closest('.nav-link') || el;
    const len = Math.ceil(path.getTotalLength());
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = hoverTarget.classList.contains('is-active') ? '0' : `${len}`;

    hoverTarget.addEventListener('pointerenter', () => {
      gsap.killTweensOf(path);
      gsap.fromTo(
        path,
        { strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 0.45, ease: 'power3.out' }
      );
    });

    hoverTarget.addEventListener('pointerleave', () => {
      if (hoverTarget.classList.contains('is-active')) return;
      gsap.to(path, {
        strokeDashoffset: -len,
        duration: 0.35,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Seamless GPU Marquee ([data-marquee-duplicate]) — 0% JS CPU
   -------------------------------------------------------------------------- */
function initMarquee() {
  document.querySelectorAll('[data-marquee-duplicate]').forEach((marquee) => {
    if (marquee.dataset.marqueeReady === 'true') return;

    const collections = marquee.querySelectorAll(
      '.marquee-advanced__collection, .hero_clients-track'
    );
    if (collections.length === 1) {
      const clone = collections[0].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marquee.appendChild(clone);
    } else if (
      marquee.classList.contains('marquee-advanced__collection') &&
      marquee.parentElement &&
      marquee.parentElement.querySelectorAll('.marquee-advanced__collection').length === 1
    ) {
      const clone = marquee.cloneNode(true);
      clone.removeAttribute('data-marquee-duplicate');
      clone.setAttribute('aria-hidden', 'true');
      marquee.parentElement.appendChild(clone);
    }

    marquee.dataset.marqueeReady = 'true';
  });
}

/* --------------------------------------------------------------------------
   8. Interactive Collage Parallax ([data-interactive-collage-init])
      Cached container rect on pointerenter; GPU shift; smooth reset on leave.
   -------------------------------------------------------------------------- */
function initInteractiveCollage(gsap, reduced) {
  if (reduced || !gsap || !isFinePointer()) return;

  const containers = document.querySelectorAll('[data-interactive-collage-init]');
  if (!containers.length) return;

  containers.forEach((container) => {
    const items = Array.from(
      container.querySelectorAll(
        '[data-collage-item], .intro-media-l, .intro-media-m, .intro-media-s, .services-cards_item'
      )
    );
    if (!items.length) return;

    const depths = items.map((item, idx) => {
      if (item.classList.contains('intro-media-s')) return 24;
      if (item.classList.contains('services-cards_item')) return idx === 1 ? 12 : 18;
      return idx % 2 === 0 ? 14 : 20;
    });

    // Animate inner card/image so base CSS rotation on outer wrappers stays intact
    const targets = items.map(
      (item) =>
        item.querySelector(
          '.intro-media-l_card, .intro-media-m_card, .services-card_wrap'
        ) ||
        (item.classList.contains('intro-media-s') ? item.querySelector('img') || item : item)
    );

    let rect = null;
    let rafId = 0;
    let nx = 0;
    let ny = 0;

    const applyShift = () => {
      rafId = 0;
      targets.forEach((target, idx) => {
        const depth = depths[idx];
        const dir = idx % 2 === 0 ? 1 : -1;
        gsap.to(target, {
          x: nx * depth * dir,
          y: ny * depth * dir,
          duration: 0.55,
          ease: 'power2.out',
          force3D: true,
          overwrite: 'auto',
        });
      });
    };

    container.addEventListener(
      'pointerenter',
      () => {
        rect = container.getBoundingClientRect();
      },
      { passive: true }
    );

    container.addEventListener(
      'pointermove',
      (e) => {
        if (!rect || rect.width === 0 || rect.height === 0) return;
        nx = clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
        ny = clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
        if (!rafId) rafId = requestAnimationFrame(applyShift);
      },
      { passive: true }
    );

    container.addEventListener(
      'pointerleave',
      () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        targets.forEach((target) => {
          gsap.to(target, {
            x: 0,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            force3D: true,
            overwrite: 'auto',
          });
        });
      },
      { passive: true }
    );
  });
}

/* --------------------------------------------------------------------------
   9. Instant Dark/Light Navbar Theme Switch ([data-nav-theme="dark"])
   -------------------------------------------------------------------------- */
function initNavThemeSwitch(ScrollTrigger) {
  const nav = document.querySelector('.nav, .site-nav');
  if (!nav) return;

  nav.setAttribute('data-nav-theme-active', 'light');
  nav.classList.remove('is-dark');

  const darkSections = document.querySelectorAll('[data-nav-theme="dark"]');
  if (!darkSections.length || !ScrollTrigger) return;

  const activeDark = new Set();

  const syncTheme = () => {
    const isDark = activeDark.size > 0;
    nav.setAttribute('data-nav-theme-active', isDark ? 'dark' : 'light');
    nav.classList.toggle('is-dark', isDark);
  };

  darkSections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 48px',
      end: 'bottom 48px',
      onEnter: () => {
        activeDark.add(section);
        syncTheme();
      },
      onEnterBack: () => {
        activeDark.add(section);
        syncTheme();
      },
      onLeave: () => {
        activeDark.delete(section);
        syncTheme();
      },
      onLeaveBack: () => {
        activeDark.delete(section);
        syncTheme();
      },
    });
  });
}

/* --------------------------------------------------------------------------
   10. Pinned 3D Perspective Case Stack ([data-featured-stack])
       Desktop matchMedia (>= 992px), scrub: 0.35, end: '+=220%',
       pinSpacing: true, refreshPriority: 1, anticipatePin: 1.
   -------------------------------------------------------------------------- */
function initFeaturedStack(gsap, ScrollTrigger, reduced) {
  if (reduced || !gsap || !ScrollTrigger) return;

  const stackSection = document.querySelector('[data-featured-stack]');
  if (!stackSection) return;

  const pinEl = stackSection.querySelector('[data-featured-stack-pin], .featured_pin');
  const slides = Array.from(
    stackSection.querySelectorAll('[data-featured-stack-slide], [data-featured-card], .featured-card')
  );
  if (!pinEl || slides.length < 2) return;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 992px)', () => {
    const total = slides.length;

    // Initial 3D depth:
    // Slide 0: (0, 0, 0, zIndex: 3)
    // Slide 1: (0, -40px, -120px, zIndex: 2)
    // Slide 2: (0, -80px, -240px, zIndex: 1)
    slides.forEach((slide, i) => {
      gsap.set(slide, {
        x: 0,
        y: -40 * i,
        z: -120 * i,
        rotationX: 0,
        rotationZ: 0,
        opacity: 1,
        zIndex: total - i,
        force3D: true,
        transformPerspective: 1400,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinEl,
        start: 'top top',
        end: '+=220%',
        pin: true,
        pinSpacing: true,
        scrub: 0.35,
        refreshPriority: 1,
        anticipatePin: 1,
      },
    });

    for (let i = 0; i < total - 1; i += 1) {
      const currentSlide = slides[i];
      const stepLabel = `step-${i}`;
      tl.addLabel(stepLabel);

      // Lift and tilt active slide away
      tl.to(
        currentSlide,
        {
          yPercent: -115,
          rotationZ: i % 2 === 0 ? -5 : 5,
          rotationX: 14,
          opacity: 0,
          duration: 1,
          ease: 'power1.inOut',
          force3D: true,
        },
        stepLabel
      );

      // Pull remaining slides one depth slot forward toward (0, 0, 0)
      for (let j = i + 1; j < total; j += 1) {
        const slot = j - i - 1;
        tl.to(
          slides[j],
          {
            y: -40 * slot,
            z: -120 * slot,
            duration: 1,
            ease: 'power1.inOut',
            force3D: true,
          },
          stepLabel
        );
      }
    }

    return () => {
      slides.forEach((slide) => {
        gsap.set(slide, { clearProps: 'transform,opacity,zIndex' });
      });
    };
  });
}

/* --------------------------------------------------------------------------
   11. Custom Cursor-Marquee Pill ([data-cursor-marquee-text], .cursor-marquee)
       On-demand rAF ONLY while hovering a trigger; zero idle CPU.
   -------------------------------------------------------------------------- */
function initCursorMarquee(reduced) {
  if (reduced || !isFinePointer()) return;

  const pill = document.querySelector('.cursor-marquee');
  if (!pill) return;

  const labels = Array.from(
    pill.querySelectorAll('[data-cursor-marquee-label], .cursor-marquee_text, .cursor-marquee__text')
  );
  const triggers = document.querySelectorAll('[data-cursor-marquee-text]');
  if (!triggers.length) return;

  let active = false;
  let rafId = 0;
  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;

  const tick = () => {
    if (!active) {
      rafId = 0;
      return;
    }

    curX = lerp(curX, targetX, 0.18);
    curY = lerp(curY, targetY, 0.18);

    pill.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0)`;

    if (Math.abs(targetX - curX) > 0.25 || Math.abs(targetY - curY) > 0.25) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  };

  triggers.forEach((trigger) => {
    // Skip hidden hero cursor-card_media children (not directly hovered)
    if (trigger.classList.contains('cursor-card_media')) return;

    trigger.addEventListener(
      'pointerenter',
      (e) => {
        const text = trigger.getAttribute('data-cursor-marquee-text') || 'Explore →';
        labels.forEach((span) => {
          span.textContent = text;
        });

        active = true;
        targetX = e.clientX;
        targetY = e.clientY;
        curX = targetX;
        curY = targetY;

        pill.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0)`;
        pill.classList.add('is-active');
      },
      { passive: true }
    );

    trigger.addEventListener(
      'pointermove',
      (e) => {
        if (!active) return;
        targetX = e.clientX;
        targetY = e.clientY;
        if (!rafId) rafId = requestAnimationFrame(tick);
      },
      { passive: true }
    );

    trigger.addEventListener(
      'pointerleave',
      () => {
        active = false;
        pill.classList.remove('is-active');
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { passive: true }
    );
  });
}

/* --------------------------------------------------------------------------
   12. Hover Poster Motion ([data-video-on-hover])
   -------------------------------------------------------------------------- */
function initVideoOnHover() {
  document.querySelectorAll('[data-video-on-hover]').forEach((el) => {
    if (el.dataset.videoHoverBound === 'true') return;
    el.dataset.videoHoverBound = 'true';

    el.addEventListener(
      'pointerenter',
      () => {
        el.setAttribute('data-video-on-hover', 'active');
      },
      { passive: true }
    );

    el.addEventListener(
      'pointerleave',
      () => {
        el.setAttribute('data-video-on-hover', 'not-active');
      },
      { passive: true }
    );
  });
}

/* --------------------------------------------------------------------------
   13. Team Scrub Parallax ([data-team-parallax-distance], .team_item)
   -------------------------------------------------------------------------- */
function initTeamParallax(gsap, ScrollTrigger, reduced) {
  if (reduced || !gsap || !ScrollTrigger) return;

  const teamSection = document.querySelector('.section_team');
  const teamItems = Array.from(document.querySelectorAll('.team_item'));
  if (!teamSection || !teamItems.length) return;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 992px)', () => {
    const parallaxTargets = [];
    teamItems.forEach((item, index) => {
      // Animate inner .team_card so CSS translateX/translateY offsets on .team_item stay intact
      const target = item.querySelector('.team_card') || item;
      parallaxTargets.push(target);

      const attrVal = parseFloat(item.getAttribute('data-team-parallax-distance'));
      const distance = Number.isFinite(attrVal)
        ? attrVal
        : index % 2 === 0
          ? -55
          : 55;

      gsap.fromTo(
        target,
        { y: -distance * 0.5, force3D: true },
        {
          y: distance * 0.5,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: teamSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.35,
          },
        }
      );
    });

    return () => {
      parallaxTargets.forEach((target) => gsap.set(target, { clearProps: 'transform' }));
    };
  });
}

/* --------------------------------------------------------------------------
   14. Inertia Momentum Hover
       ([data-momentum-hover-init], [data-momentum-hover-target],
        [data-momentum-hover-element])
       Velocity-measured fling (x, y, rotation) with elastic.out(1, 0.45) return.
   -------------------------------------------------------------------------- */
function initMomentumHover(gsap, reduced) {
  if (reduced || !gsap || !isFinePointer()) return;

  const targets = new Set();

  // Explicit targets and sticker elements
  document
    .querySelectorAll('[data-momentum-hover-target], [data-momentum-hover-element]')
    .forEach((el) => targets.add(el));

  // Standalone [data-momentum-hover-init] items without nested targets/elements
  document.querySelectorAll('[data-momentum-hover-init]').forEach((el) => {
    const hasNested = el.querySelector(
      '[data-momentum-hover-target], [data-momentum-hover-element]'
    );
    if (!hasNested) {
      targets.add(el);
    }
  });

  targets.forEach((trigger) => {
    // Animate inner layer when present so ScrollTrigger y-parallax or CSS base rotation never conflict
    const animTarget =
      trigger.querySelector('.team_img, .team_media, .polaroid-card_frame') ||
      (trigger.classList.contains('team-sticker') ||
      trigger.classList.contains('team_sticker') ||
      trigger.classList.contains('intro_sticker')
        ? trigger.querySelector('img') || trigger
        : trigger);

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let lastFlingTime = 0;

    const fling = (vx, vy) => {
      const now = performance.now();
      if (now - lastFlingTime < 110) return;
      lastFlingTime = now;

      const flingX = clamp(vx * 18, -32, 32);
      const flingY = clamp(vy * 18, -28, 28);
      const flingRot = clamp(vx * 5.5, -9, 9);

      if (Math.abs(flingX) < 1.5 && Math.abs(flingY) < 1.5) return;

      gsap.killTweensOf(animTarget);
      gsap
        .timeline()
        .to(animTarget, {
          x: flingX,
          y: flingY,
          rotation: flingRot,
          duration: 0.22,
          ease: 'power2.out',
          force3D: true,
        })
        .to(animTarget, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 1.15,
          ease: 'elastic.out(1, 0.45)',
          force3D: true,
        });
    };

    trigger.addEventListener(
      'pointerenter',
      (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = performance.now();
      },
      { passive: true }
    );

    trigger.addEventListener(
      'pointermove',
      (e) => {
        const now = performance.now();
        const dt = Math.max(now - lastTime, 8);
        const vx = (e.clientX - lastX) / dt;
        const vy = (e.clientY - lastY) / dt;

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;

        if (Math.hypot(vx, vy) > 0.35) {
          fling(vx, vy);
        }
      },
      { passive: true }
    );
  });
}

/* --------------------------------------------------------------------------
   15. Footer Cursor Image Trail ([data-image-trail])
       Cached container rect on pointerenter; spawns .created-img every 85px
       with random tilt (-10..+10deg), GSAP pop-in & fade-out + DOM removal.
   -------------------------------------------------------------------------- */
function initFooterImageTrail(gsap, trailImages, reduced) {
  if (reduced || !gsap || !isFinePointer()) return;

  const zones = document.querySelectorAll('[data-image-trail]');
  if (!zones.length) return;

  const images =
    Array.isArray(trailImages) && trailImages.length > 0 ? trailImages : DEFAULT_TRAIL_IMAGES;

  const MAX_ACTIVE_NODES = 14;
  const SPAWN_DISTANCE = 85;

  zones.forEach((zone) => {
    let rect = null;
    let lastX = 0;
    let lastY = 0;
    let hasOrigin = false;
    let imgIndex = 0;
    let activeCount = 0;

    const spawnImage = (x, y) => {
      if (activeCount >= MAX_ACTIVE_NODES) return;

      const src = images[imgIndex % images.length];
      imgIndex += 1;

      const img = document.createElement('img');
      img.className = 'created-img';
      img.src = src;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.decoding = 'async';
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;

      zone.appendChild(img);
      activeCount += 1;

      const tilt = (Math.random() * 20 - 10).toFixed(1);

      gsap
        .timeline({
          onComplete: () => {
            img.remove();
            activeCount = Math.max(0, activeCount - 1);
          },
        })
        .fromTo(
          img,
          {
            scale: 0.65,
            opacity: 0,
            rotation: Number(tilt) * 0.5,
            force3D: true,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: Number(tilt),
            duration: 0.34,
            ease: 'back.out(1.7)',
            force3D: true,
          }
        )
        .to(img, {
          opacity: 0,
          scale: 0.82,
          y: 26,
          duration: 0.55,
          delay: 0.45,
          ease: 'power2.in',
          force3D: true,
        });
    };

    zone.addEventListener(
      'pointerenter',
      (e) => {
        rect = zone.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        hasOrigin = true;
      },
      { passive: true }
    );

    zone.addEventListener(
      'pointermove',
      (e) => {
        if (!rect) rect = zone.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (!hasOrigin) {
          lastX = x;
          lastY = y;
          hasOrigin = true;
          return;
        }

        const dist = Math.hypot(x - lastX, y - lastY);
        if (dist >= SPAWN_DISTANCE) {
          lastX = x;
          lastY = y;
          spawnImage(x, y);
        }
      },
      { passive: true }
    );

    zone.addEventListener(
      'pointerleave',
      () => {
        hasOrigin = false;
        rect = null;
      },
      { passive: true }
    );
  });
}

/* --------------------------------------------------------------------------
   Public Entry Point
   -------------------------------------------------------------------------- */
export function initAnimations({ trailImages = [] } = {}) {
  // Immediately mark page ready — ZERO preloader blocking
  document.documentElement.dataset.pageReady = 'true';

  const reduced = prefersReducedMotion();
  const gsap = typeof window !== 'undefined' ? window.gsap : null;
  const ScrollTrigger = typeof window !== 'undefined' ? window.ScrollTrigger : null;

  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Lenis + ScrollTrigger sync
  const lenis = initSmoothScroll(gsap, ScrollTrigger, reduced);

  // 2. Hero & scroll SplitText reveals + variable font weight proximity hover
  initTextReveals(gsap, ScrollTrigger, reduced);
  initFontWeightHover(reduced);

  // 3. Hero desktop cursor photo trail
  initHeroCursorCard(reduced);

  // 4. DrawSVG wavy & persistent underlines
  initDrawLines(gsap, ScrollTrigger, reduced);

  // 5. GPU marquee duplication
  initMarquee();

  // 6. Interactive collage parallax
  initInteractiveCollage(gsap, reduced);

  // 7. Instant dark/light navbar theme switch
  initNavThemeSwitch(ScrollTrigger);

  // 8. Pinned 3D perspective case stack
  initFeaturedStack(gsap, ScrollTrigger, reduced);

  // 9. On-demand custom cursor-marquee pill
  initCursorMarquee(reduced);

  // 10. Hover poster motion toggles
  initVideoOnHover();

  // 11. Desktop team scrub parallax
  initTeamParallax(gsap, ScrollTrigger, reduced);

  // 12. Inertia momentum hover (team portraits + stickers + polaroids)
  initMomentumHover(gsap, reduced);

  // 13. Footer cursor image trail
  initFooterImageTrail(gsap, trailImages, reduced);

  // Keep ScrollTrigger & Lenis measurements synced once web fonts finish loading
  if (ScrollTrigger) {
    const refreshLayout = () => {
      ScrollTrigger.refresh();
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshLayout);
    }
    window.addEventListener('load', refreshLayout, { once: true });
  }

  return { lenis };
}
