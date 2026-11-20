/**
 * KINETA — Interactive UI Controllers
 * Wires edition detail modal ([data-edition-open]), pack builder drawer ([data-drawer-open]),
 * mobile navigation drawer (.nav-toggle / [data-nav-status]), cookie consent (.cookie-card),
 * scroll-to-top ([data-scroll-top]), and copyright year ([data-current-year]).
 */

const EDITION_DETAILS = {
  'edicion-nocturna': {
    id: 'edicion-nocturna',
    imageSrc: './src/assets/images/featured-night-drop.jpg',
    imageAlt: 'Kineta Night Drop limited edition photography',
    eyebrow: 'Limited Edition · Drop 01',
    batch: 'DROP 01 · 1,200 CANS',
    title: 'Night Drop',
    subtitle: 'Smoked yerba mate, raw cacao & bitter orange',
    specs: ['80mg Natural Caffeine', '0g Added Sugar', 'Fine Sparkle', '19 kcal'],
    notes:
      'Slow 18-hour cold maceration with Ecuadorian cacao husks, toasted yerba mate, and cold-pressed Valencia bitter orange oil. Crisp, dry, and built for late-night creative sessions.',
    meters: [
      { label: 'Clean Energy', value: 80 },
      { label: 'Citrus Bite', value: 62 },
      { label: 'Botanical Depth', value: 94 },
    ],
    packFlavor: 'berry-pulse',
  },
  'volt-yuzu-01': {
    id: 'volt-yuzu-01',
    imageSrc: './src/assets/images/featured-volt-yuzu.jpg',
    imageAlt: 'Kineta Volt Yuzu limited edition photography',
    eyebrow: 'Limited Edition · Drop 02',
    batch: 'DROP 02 · 2,500 CANS',
    title: 'Volt Yuzu',
    subtitle: 'Cold-pressed Japanese yuzu, ceremonial matcha & sea salt',
    specs: ['95mg Natural Caffeine', 'L-Theanine', 'Bright Citrus', '18 kcal'],
    notes:
      'Cold-pressed Japanese yuzu juice layered over guayusa leaf, ceremonial-grade matcha, and a pinch of Mediterranean sea salt. Razor-sharp focus, electric effervescence, zero jitters.',
    meters: [
      { label: 'Clean Energy', value: 95 },
      { label: 'Citrus Bite', value: 92 },
      { label: 'Botanical Depth', value: 84 },
    ],
    packFlavor: 'volt-yuzu',
  },
  'solar-mango-club': {
    id: 'solar-mango-club',
    imageSrc: './src/assets/images/featured-solar-mango.jpg',
    imageAlt: 'Kineta Solar Mango limited edition photography',
    eyebrow: 'Limited Edition · Drop 03',
    batch: 'DROP 03 · 1,800 CANS',
    title: 'Solar Mango',
    subtitle: 'Ripe Alphonso mango, Amazonian guayusa & ginger fire',
    specs: ['85mg Natural Caffeine', 'Electrolytes', 'Warm Spice Finish', '24 kcal'],
    notes:
      'Clarified ripe Alphonso mango puree, freshly squeezed lime, natural electrolytes, and a clean kick of fresh ginger root. Born for Mile 6 of the Kineta Run Club.',
    meters: [
      { label: 'Clean Energy', value: 85 },
      { label: 'Citrus Bite', value: 74 },
      { label: 'Botanical Depth', value: 88 },
    ],
    packFlavor: 'solar-mango',
  },
};

const COOKIE_STORAGE_KEY = 'kineta_cookie_consent_v1';

/* --------------------------------------------------------------------------
   1. Dynamic Copyright Year & Scroll-to-Top Fallback
   -------------------------------------------------------------------------- */

function initYearAndScrollTop() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = year;
  });

  document.querySelectorAll('[data-scroll-top]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer (.nav-toggle & [data-nav-status])
   -------------------------------------------------------------------------- */

function initMobileNav() {
  const nav = document.querySelector('.nav[data-nav-status]');
  const toggleBtn = document.querySelector('.nav-toggle, [data-nav-toggle]');
  const drawer = document.getElementById('mobile-nav-drawer') || document.querySelector('.nav-mobile');
  if (!nav || !toggleBtn || !drawer) return;

  const setNavOpen = (isOpen) => {
    nav.setAttribute('data-nav-status', isOpen ? 'open' : 'closed');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    drawer.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('is-nav-open', isOpen);
  };

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyOpen = nav.getAttribute('data-nav-status') === 'open';
    setNavOpen(!isCurrentlyOpen);
  });

  drawer.querySelectorAll('[data-mobile-nav-link], .nav-mobile_link').forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.getAttribute('data-nav-status') === 'open') {
      setNavOpen(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. Cookie Consent Card (.cookie-card)
   -------------------------------------------------------------------------- */

function initCookieBanner() {
  const banner = document.getElementById('cookie-consent') || document.querySelector('.cookie-card');
  if (!banner) return;

  const analyticsInput = document.getElementById('cookie-analytics');
  const marketingInput = document.getElementById('cookie-marketing');

  const showBanner = () => {
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add('is-visible'));
  };

  const hideBanner = () => {
    banner.classList.remove('is-visible');
    window.setTimeout(() => {
      banner.hidden = true;
    }, 240);
  };

  const savePreference = (analytics, marketing) => {
    try {
      localStorage.setItem(
        COOKIE_STORAGE_KEY,
        JSON.stringify({
          essential: true,
          analytics: Boolean(analytics),
          marketing: Boolean(marketing),
          updatedAt: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore storage quota or private mode errors
    }
    hideBanner();
  };

  let hasStored = false;
  try {
    hasStored = Boolean(localStorage.getItem(COOKIE_STORAGE_KEY));
  } catch {
    hasStored = false;
  }

  if (!hasStored) {
    window.setTimeout(showBanner, 1400);
  }

  banner.querySelector('[data-cookie-reject]')?.addEventListener('click', () => {
    if (analyticsInput) analyticsInput.checked = false;
    if (marketingInput) marketingInput.checked = false;
    savePreference(false, false);
  });

  banner.querySelector('[data-cookie-save]')?.addEventListener('click', () => {
    savePreference(analyticsInput?.checked, marketingInput?.checked);
  });

  banner.querySelector('[data-cookie-close]')?.addEventListener('click', () => {
    savePreference(false, false);
  });

  document.querySelectorAll('[data-open-cookie-settings]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      showBanner();
    });
  });
}

/* --------------------------------------------------------------------------
   4. "Order Your Pack" Drawer ([data-drawer-open])
   -------------------------------------------------------------------------- */

function initOrderDrawer() {
  const drawer = document.getElementById('order-drawer') || document.querySelector('.kineta-drawer');
  if (!drawer) return { openDrawer: () => {} };

  const builderView = drawer.querySelector('[data-drawer-builder]');
  const successView = drawer.querySelector('[data-drawer-success]');
  const statusEl = drawer.querySelector('[data-pack-status]');
  const priceEl = drawer.querySelector('[data-pack-price]');
  const fillEl = drawer.querySelector('[data-pack-fill]');
  const errorEl = drawer.querySelector('[data-pack-error]');
  const receiptEl = drawer.querySelector('[data-success-receipt]');
  const summaryEl = drawer.querySelector('[data-success-summary]');
  const form = document.getElementById('pack-order-form');

  const state = {
    packSize: 6,
    flavors: {
      'volt-yuzu': 2,
      'berry-pulse': 2,
      'solar-mango': 2,
    },
  };

  const getTotal = () =>
    state.flavors['volt-yuzu'] + state.flavors['berry-pulse'] + state.flavors['solar-mango'];

  const getPriceLabel = () => (state.packSize === 12 ? '€36.00' : '€19.50');

  const syncUI = () => {
    const total = getTotal();
    const pct = Math.min((total / state.packSize) * 100, 100);

    if (statusEl) {
      statusEl.textContent = `${total} / ${state.packSize} cans selected`;
    }
    if (priceEl) {
      priceEl.textContent = getPriceLabel();
    }
    if (fillEl) {
      fillEl.style.width = `${pct}%`;
    }

    drawer.querySelectorAll('[data-pack-size]').forEach((btn) => {
      const size = Number(btn.dataset.packSize);
      const active = size === state.packSize;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    drawer.querySelectorAll('[data-flavor-key]').forEach((row) => {
      const key = row.dataset.flavorKey;
      const countEl = row.querySelector('[data-flavor-count]');
      if (countEl && key in state.flavors) {
        countEl.textContent = String(state.flavors[key]);
      }
    });
  };

  const openDrawer = (presetFlavor = null) => {
    if (presetFlavor && presetFlavor in state.flavors) {
      state.packSize = 6;
      state.flavors = { 'volt-yuzu': 1, 'berry-pulse': 1, 'solar-mango': 1 };
      state.flavors[presetFlavor] = 4;
    }

    if (builderView) builderView.hidden = false;
    if (successView) successView.hidden = true;
    if (errorEl) errorEl.hidden = true;

    syncUI();
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    document.body.classList.add('is-overlay-open');
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    document.body.classList.remove('is-overlay-open');
    window.setTimeout(() => {
      drawer.hidden = true;
    }, 260);
  };

  drawer.querySelectorAll('[data-pack-size]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextSize = Number(btn.dataset.packSize);
      if (nextSize === state.packSize) return;
      state.packSize = nextSize;
      state.flavors =
        nextSize === 12
          ? { 'volt-yuzu': 4, 'berry-pulse': 4, 'solar-mango': 4 }
          : { 'volt-yuzu': 2, 'berry-pulse': 2, 'solar-mango': 2 };
      if (errorEl) errorEl.hidden = true;
      syncUI();
    });
  });

  drawer.querySelectorAll('[data-flavor-key]').forEach((row) => {
    const key = row.dataset.flavorKey;
    row.querySelectorAll('[data-step]').forEach((stepBtn) => {
      stepBtn.addEventListener('click', () => {
        const delta = Number(stepBtn.dataset.step);
        const current = state.flavors[key];
        const total = getTotal();

        if (delta > 0 && total >= state.packSize) return;
        if (delta < 0 && current <= 0) return;

        state.flavors[key] = current + delta;
        if (errorEl) errorEl.hidden = true;
        syncUI();
      });
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const total = getTotal();
    const name = form.elements.name?.value.trim() || '';
    const email = form.elements.email?.value.trim() || '';
    const city = form.elements.city?.value.trim() || '';

    if (total !== state.packSize) {
      if (errorEl) {
        errorEl.textContent = `Complete your ${state.packSize}-can box before confirming (${total} selected).`;
        errorEl.hidden = false;
      }
      return;
    }

    if (!name || !email.includes('@') || !city) {
      if (errorEl) {
        errorEl.textContent = 'Please enter your name, a valid email, and your delivery city.';
        errorEl.hidden = false;
      }
      return;
    }

    const orderCode = `KN-${Math.floor(10000 + Math.random() * 89999)}`;
    if (summaryEl) {
      summaryEl.textContent = `Thanks ${name}. Your ${state.packSize}-can pack headed to ${city} is reserved. Confirmation sent to ${email}.`;
    }
    if (receiptEl) {
      receiptEl.innerHTML = `
        <div><span>Order</span><strong>#${orderCode}</strong></div>
        <div><span>Volt Yuzu</span><strong>${state.flavors['volt-yuzu']} cans</strong></div>
        <div><span>Berry Pulse</span><strong>${state.flavors['berry-pulse']} cans</strong></div>
        <div><span>Solar Mango</span><strong>${state.flavors['solar-mango']} cans</strong></div>
        <div><span>Total</span><strong>${getPriceLabel()}</strong></div>
      `;
    }

    if (builderView) builderView.hidden = true;
    if (successView) successView.hidden = false;
    form.reset();
  });

  drawer.querySelector('[data-drawer-reset]')?.addEventListener('click', () => {
    if (builderView) builderView.hidden = false;
    if (successView) successView.hidden = true;
    syncUI();
  });

  drawer.querySelectorAll('[data-drawer-close]').forEach((el) => {
    el.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) closeDrawer();
  });

  document.querySelectorAll('[data-drawer-open], [data-open-order-drawer]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer(trigger.dataset.presetFlavor || null);
    });
    if (trigger.getAttribute('role') === 'button') {
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDrawer(trigger.dataset.presetFlavor || null);
        }
      });
    }
  });

  syncUI();
  return { openDrawer, closeDrawer };
}

/* --------------------------------------------------------------------------
   5. Edition Detail Modal ([data-edition-open])
   -------------------------------------------------------------------------- */

function initEditionModal(openOrderDrawer) {
  const modal = document.getElementById('edition-modal') || document.querySelector('.kineta-modal');
  if (!modal) return;

  const imgEl = document.getElementById('edition-modal-img');
  const batchEl = modal.querySelector('[data-modal-batch]');
  const eyebrowEl = modal.querySelector('[data-modal-eyebrow]');
  const titleEl = modal.querySelector('[data-modal-title]');
  const subtitleEl = modal.querySelector('[data-modal-subtitle]');
  const specsEl = modal.querySelector('[data-modal-specs]');
  const notesEl = modal.querySelector('[data-modal-notes]');
  const metersEl = modal.querySelector('[data-modal-meters]');
  const addPackBtn = modal.querySelector('[data-modal-add-pack]');

  let activeEdition = EDITION_DETAILS['edicion-nocturna'];

  const openModal = (editionId) => {
    const data = EDITION_DETAILS[editionId];
    if (!data) return;
    activeEdition = data;

    if (imgEl) {
      imgEl.src = data.imageSrc;
      imgEl.alt = data.imageAlt;
    }
    if (batchEl) batchEl.textContent = data.batch;
    if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
    if (titleEl) titleEl.textContent = data.title;
    if (subtitleEl) subtitleEl.textContent = data.subtitle;
    if (notesEl) notesEl.textContent = data.notes;

    if (specsEl) {
      specsEl.innerHTML = data.specs
        .map((spec) => `<span class="kineta-modal_spec-pill">${spec}</span>`)
        .join('');
    }

    if (metersEl) {
      metersEl.innerHTML = data.meters
        .map(
          (m) => `
            <div class="kineta-meter">
              <div class="kineta-meter_head">
                <span>${m.label}</span>
                <strong>${m.value}%</strong>
              </div>
              <div class="kineta-meter_track">
                <div class="kineta-meter_fill" style="width: ${m.value}%"></div>
              </div>
            </div>
          `
        )
        .join('');
    }

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.classList.add('is-overlay-open');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('is-overlay-open');
    window.setTimeout(() => {
      modal.hidden = true;
    }, 240);
  };

  modal.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  addPackBtn?.addEventListener('click', () => {
    const targetFlavor = activeEdition?.packFlavor || 'volt-yuzu';
    closeModal();
    window.setTimeout(() => openOrderDrawer(targetFlavor), 260);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  document.querySelectorAll('[data-edition-open], [data-edition-id]').forEach((card) => {
    const id = card.dataset.editionOpen || card.dataset.editionId;
    if (!id) return;
    card.addEventListener('click', () => openModal(id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(id);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Solana Pay & Open-Source Support Modal ([data-solana-open])
   -------------------------------------------------------------------------- */

function initSolanaModal() {
  const modal = document.getElementById('solana-modal');
  if (!modal) return;

  const copyBtn = modal.querySelector('[data-solana-copy]');
  const copyLabel = modal.querySelector('[data-solana-copy-label]');
  const defaultWallet = '3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm';

  const openSolanaModal = () => {
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.classList.add('is-overlay-open');
  };

  const closeSolanaModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('is-overlay-open');
    window.setTimeout(() => {
      modal.hidden = true;
    }, 240);
  };

  document.querySelectorAll('[data-solana-open]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openSolanaModal();
    });
  });

  modal.querySelectorAll('[data-solana-close]').forEach((el) => {
    el.addEventListener('click', closeSolanaModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeSolanaModal();
    }
  });

  copyBtn?.addEventListener('click', async () => {
    const address = copyBtn.getAttribute('data-solana-copy') || defaultWallet;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = address;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      copyBtn.classList.add('is-copied');
      if (copyLabel) copyLabel.textContent = 'COPIED ✓';
      window.setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        if (copyLabel) copyLabel.textContent = 'COPY ADDRESS';
      }, 2200);
    } catch {
      if (copyLabel) copyLabel.textContent = 'SELECT & COPY';
    }
  });
}

/* --------------------------------------------------------------------------
   Public Bootstrap Export
   -------------------------------------------------------------------------- */

export function initInteractive() {
  initYearAndScrollTop();
  initMobileNav();
  initCookieBanner();
  const { openDrawer } = initOrderDrawer();
  initEditionModal(openDrawer);
  initSolanaModal();
}
