# 🚀 KINETA — Viral Launch Kit (X/Twitter, Hacker News, Reddit & Product Hunt)

This document contains ready-to-publish, high-conversion launch posts engineered to propel **KINETA** to the top of **GitHub Trending**, **Hacker News (`Show HN`)**, **X/Twitter**, **Reddit (`r/webdev`, `r/javascript`, `r/solana`, `r/opensource`)**, and **Product Hunt**.

---

## 1. X / Twitter Viral Launch Thread (7-Part Engineering & Visual Thread)

### Tweet 1 (The Hook — Attach `docs/images/01-hero-editorial.png` & `docs/images/04-featured-3d-stack-night-drop.png`)
```text
What happens when you strip away 400MB of node_modules, Webpack/Vite bundlers, and frame-dropping CSS blurs—and build an Awwwards-grade 60fps editorial showcase on pure native ES Modules?

Meet KINETA ⚡🍋

Zero build step. Variable font physics. 3D GSAP stacks. Native Solana Pay.

100% Open Source (MIT) 👇🧵
```

### Tweet 2 (Variable Font Proximity Physics — Attach `docs/images/02-hero-cursor-trail.png`)
```text
1/ Variable Font Proximity Physics without Layout Thrashing:

Most kinetic typography demos kill the main thread by calling getBoundingClientRect() inside mousemove.

In KINETA, we cache character centers ONCE on pointerenter, quantize --wght in steps of 30, and never use will-change on individual chars. Locked 60fps.
```

### Tweet 3 (Pinned 3D Perspective Stack — Attach `docs/images/05-featured-3d-stack-volt-yuzu.png` & `docs/images/06-featured-3d-stack-solar-mango.png`)
```text
2/ Pinned 3D Perspective Editions Stack (perspective: 1400px):

Built with GSAP ScrollTrigger + Lenis running on a single synchronized ticker (`gsap.ticker.lagSmoothing(0)`).

As you scroll into the dark obsidian section:
• Navbar dynamically inverts to dark theme at 48px
• Cards advance through 3D Z-space (-240px → -120px → 0px)
```

### Tweet 4 (Pointer-Velocity Inertia & Elastic Springs — Attach `docs/images/08-team-editorial-grid.png` & `docs/images/08b-team-editorial-stickers.png`)
```text
3/ Tactile Pointer-Velocity Inertia & Elastic Rebound:

Swipe your cursor across the asymmetric 4-column team portraits or die-cut SVG stickers.

We measure instantaneous pointer velocity (vx = dx/dt, vy = dy/dt), fling the element along your swipe trajectory, and rebound with `elastic.out(1, 0.45)`.
```

### Tweet 5 (85px Cursor Image Trail & Zero-CPU Marquee — Attach `docs/images/09-footer-kinetic-trail.png`)
```text
4/ 85px Cursor Photo Trail & 0% JS CPU Marquees:

• Moving across the footer spawns tilted editorial prints every 85px of cursor travel (capped at 14 active nodes with automatic DOM cleanup).
• The stockists marquee runs on pure GPU CSS translate3d(-50%, 0, 0) with zero JS ticker overhead.
```

### Tweet 6 (Interactive Pack Builder & Native Solana Pay — Attach `docs/images/11-order-pack-drawer.png` & `docs/images/15-solana-pay-web3-modal.png`)
```text
5/ Full Pack Configurator + Native Solana Pay (SOL / USDC) Checkout:

• Interactive 6-pack / 12-pack state machine drawer
• Edition detail modal with animated tasting meters
• Instant Web3 Solana Pay modal with SVG QR code, `solana:` wallet deep-link & 1-click copy:
Wallet: 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm
```

### Tweet 7 (Call to Action — Attach `docs/images/07-flavors-craft-lineup.png`)
```text
6/ Clone it and run it locally in < 5 seconds (zero npm install required):

git clone https://github.com/annorisfernandez/kineta.git
cd kineta && npm run dev

Star the repo, fork the motion engine, or sponsor open-source 60fps web R&D via Solana! ⭐⚡
```

---

## 2. Hacker News (`Show HN`) Launch Post

**Title:**
```text
Show HN: Kineta – Locked-60fps editorial web showcase with zero build step and native ES modules
```

**Body / First Comment by Author:**
```text
Hi HN,

We built KINETA as an open-source reference architecture for high-craft, motion-heavy editorial websites that don't require a 500MB node_modules tree or a complex bundler pipeline just to ship HTML, CSS, and JavaScript.

Everything runs directly on native ES Modules (`<script type="module">`) and modular CSS custom properties (`tokens.css`, `base.css`, `layout.css`, `components.css`, `sections.css`, `animations.css`).

A few engineering decisions we made to keep the frame budget locked at 60fps on Retina displays:

1. Zero `backdrop-filter: blur()`: Glassmorphic blurs over scrolling layers are the #1 cause of dropped frames on high-DPI displays. Every card, modal, drawer, and navbar in Kineta uses crisp `0px` brutalist geometry and solid high-contrast editorial surfaces (`#F4F3EE` Warm Paper and `#111111` Matte Obsidian).
2. Zero Layout Thrashing in Pointer Loops: For the variable font proximity hover (`Roboto Flex` + `Instrument Serif`), character bounding boxes are cached once on `pointerenter`. Inside `requestAnimationFrame`, we compute Euclidean distance from cached coordinates and quantize `--wght` updates in steps of 30 so the browser doesn't re-rasterize glyphs on sub-pixel shifts.
3. Single-Ticker Lenis + GSAP ScrollTrigger Sync: Virtual scroll deltas are clamped to `[-100, 100]` and driven by a single `gsap.ticker` loop with `lagSmoothing(0)`.
4. On-Demand rAF Lifecycle: Both the desktop hero photo follower (which cycles studio shots every 130px of pointer travel) and the floating cursor marquee pill cancel their `requestAnimationFrame` loops immediately when `|target - current| <= 0.25px` or on `pointerleave`, consuming 0% CPU when idle.
5. Native Solana Pay Integration: Includes an interactive 6/12-pack drawer and a zero-dependency Solana Pay (`SOL` / `USDC`) modal with an inline SVG QR code and `solana:` URI deep-linking (`3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`).

You can inspect every visual section directly in the README (we captured 15 high-res Retina screenshots + all 12 studio photos and 8 SVG stickers inline) or run it locally with `python3 -m http.server 4173`.

Feedback on the motion engine (`src/scripts/animations.js`) and zero-build structure is very welcome!
```

---

## 3. Reddit Launch Posts

### A. `r/webdev` & `r/javascript`

**Title:**
```text
[Open Source] I engineered an Awwwards-style 60fps editorial showcase with ZERO build step, native ES modules, variable font proximity physics, and 3D GSAP stacks
```

**Body:**
```markdown
Hey r/webdev!

I often see developers ask how studio/Awwwards-style websites achieve buttery-smooth 60fps scroll choreography, cursor trails, and variable font physics without turning the browser fan into a jet engine.

So we open-sourced **KINETA** — a complete editorial showcase for a craft botanical sparkling energy brand built with **zero build-step overhead** (no Webpack, no Vite, no React/Next bloat—just semantic HTML5, modular CSS tokens, and native ES Modules).

### Key Technical Highlights (`src/scripts/animations.js`):
* **Instant Page-Ready Paint**: Zero blocking preloaders. SplitText line masks reveal immediately on load (`yPercent: 110 -> 0`).
* **Variable Font Proximity Hover**: Modulates `Roboto Flex` character weights (`700 ↔ 210`) based on cursor distance using cached character centers on `pointerenter` and quantized steps of `30` (zero `getBoundingClientRect` inside `pointermove`).
* **Pinned 3D Perspective Stack**: 3D card stack (`perspective: 1400px`) with scrubbed depth slots (`z: 0`, `-120px`, `-240px`) and automatic light/dark navbar theme switching.
* **Pointer-Velocity Momentum Physics**: Measures cursor velocity (`vx`, `vy`) across team portraits and SVG die-cut stickers to fling elements and rebound with `elastic.out(1, 0.45)`.
* **85px Cursor Image Trail**: Spawns tilted editorial photos every `85px` of pointer travel in the footer with automatic DOM cleanup.
* **Interactive Pack Builder & Solana Pay Modal**: Includes a 6/12-pack drawer state machine, edition tasting modal, and native Solana Pay (`SOL` / `USDC`) checkout modal.

Every single view and asset is rendered inline in the `README.md`. Clone it and run `npm run dev` (uses Python's built-in HTTP server) to try it locally in 5 seconds!
```

### B. `r/solana`

**Title:**
```text
Built an open-source, zero-build 60fps DTC beverage showcase with native Solana Pay (SOL / USDC) checkout & instant SVG QR deep-linking
```

**Body:**
```markdown
Hey r/solana!

We just open-sourced **KINETA**, a locked-60fps editorial web showcase and DTC pack configurator for craft botanical sparkling energy drinks that integrates native **Solana Pay (`SOL` & `USDC`)** with zero heavy Web3 bundle bloat.

### How the Solana Pay Integration Works:
* **Zero Heavy Wallet-Adapter Bundle**: Instead of forcing a 2MB client bundle on page load, the site uses an instant, zero-dependency **Solana Pay Modal (`#solana-modal`)** wired into the top navbar, footer, and the **"Build Your Pack"** checkout drawer.
* **Instant SVG QR + `solana:` Deep-Linking**: Scanning with Phantom, Solflare, or Backpack (or clicking **Open in Solana Wallet**) triggers a native `solana:3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm` transaction request.
* **One-Click Clipboard Verification & Solscan Link**: Includes instant address copy with visual confirmation and direct verification on Solscan (`3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`).

It's 100% MIT licensed and ready to fork for any physical product drop, creative studio, or Web3 storefront!
```

---

## 4. Product Hunt Launch Blueprint

- **Product Name**: KINETA — 60fps Editorial Web & Solana Pay Showcase
- **Tagline**: Zero-build 60fps kinetic typography, 3D GSAP stacks & native Solana Pay.
- **Topics**: Web Development, Open Source, Design Tools, Web3, Solana, Typography
- **Maker's First Comment**:
  > "Hey Product Hunt! 👋 We built **KINETA** for creative developers, design engineers, and studios who love high-contrast editorial typography and tactile 60fps motion, but hate waiting on bloated build pipelines. Clone the repo, run a static server in 1 second, and explore 13 custom motion systems—from variable font proximity hover and pinned 3D card stacks to pointer-velocity spring stickers and native Solana Pay (`3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`). It's 100% open-source under MIT!"
- **Recommended Gallery Upload Order**:
  1. `docs/images/01-hero-editorial.png`
  2. `docs/images/02-hero-cursor-trail.png`
  3. `docs/images/04-featured-3d-stack-night-drop.png`
  4. `docs/images/07-flavors-craft-lineup.png`
  5. `docs/images/08-team-editorial-grid.png`
  6. `docs/images/09-footer-kinetic-trail.png`
  7. `docs/images/10-edition-detail-modal.png`
  8. `docs/images/11-order-pack-drawer.png`
  9. `docs/images/15-solana-pay-web3-modal.png`
