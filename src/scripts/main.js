/**
 * KINETA — Main Application Entry Point
 * Bootstraps trail assets, hover state hooks, interactive UI, and 60fps GSAP/Lenis motion choreography.
 */

import { initCanvasArt, createTrailAssetDataUrls } from './canvas-art.js';
import { initInteractive } from './interactive.js';
import { initAnimations } from './animations.js';

/**
 * Client-side Brand Asset & Sponsorware Source Protection Guardrails
 */
function initSponsorwareProtection() {
  console.log(
    '%c🔒 KINETA — Protected Commercial & Sponsorware Build\n%cTo unlock full editable source code (annoris/kineta-pro-source), contribute via Solana: 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm',
    'background:#00994D;color:#111111;padding:8px 14px;font-family:sans-serif;font-weight:700;font-size:12px;letter-spacing:0.06em;border-left:4px solid #D8FF00;',
    'background:#111111;color:#F4F3EE;padding:6px 14px;font-family:monospace;font-size:11px;'
  );

  // Prevent right-click contextmenu on editorial photography, SVGs, and canvases
  document.addEventListener('contextmenu', (e) => {
    if (e.target && e.target.closest('img, svg, canvas, .featured_card, .hero, .footer-cta')) {
      e.preventDefault();
    }
  });

  // Prevent image & sticker dragging
  document.addEventListener('dragstart', (e) => {
    if (e.target && e.target.closest('img, svg')) {
      e.preventDefault();
    }
  });

  // Gently intercept source-view / inspection shortcuts (Ctrl+U / Cmd+U / F12 / Cmd+Option+I / Ctrl+Shift+I)
  document.addEventListener('keydown', (e) => {
    const key = (e.key || '').toLowerCase();
    const isViewSource = (e.ctrlKey || e.metaKey) && key === 'u';
    const isDevTools =
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.altKey && (key === 'i' || key === 'j' || key === 'c')) ||
      (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'));

    if (isViewSource || isDevTools) {
      e.preventDefault();
    }
  });
}

function boot() {
  // Never block initial paint with a preloader
  document.documentElement.dataset.pageReady = 'true';
  initSponsorwareProtection();

  let trailImages = [];

  try {
    if (typeof initCanvasArt === 'function') {
      initCanvasArt();
    }
  } catch (err) {
    console.warn('[KINETA] initCanvasArt failed:', err);
  }

  try {
    if (typeof createTrailAssetDataUrls === 'function') {
      trailImages = createTrailAssetDataUrls() || [];
    }
  } catch (err) {
    console.warn('[KINETA] createTrailAssetDataUrls failed:', err);
  }

  try {
    if (typeof initInteractive === 'function') {
      initInteractive();
    }
  } catch (err) {
    console.warn('[KINETA] initInteractive failed:', err);
  }

  try {
    if (typeof initAnimations === 'function') {
      initAnimations({ trailImages });
    }
  } catch (err) {
    console.warn('[KINETA] initAnimations failed:', err);
    document.documentElement.dataset.pageReady = 'true';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
