# KINETA — Technical & Brand Architecture

> **Product**: Small-batch craft botanical sparkling energy drinks (*Botanical energy, clean spark & real flavor*)  
> **Project Root**: `/Users/annorisfernandez/Documents/geminis/nova`  
> **Language**: English (`en`) — witty, anti-corporate, punchy editorial tone.

---

## 1. File Map

```text
/Users/annorisfernandez/Documents/geminis/nova
├── index.html                        # Semantic editorial landing page (Subagent 3)
├── docs/
│   └── ARCHITECTURE.md               # This document (contract for Subagents 3, 4, 5)
└── src/
    ├── assets/
    │   └── svg/
    │       ├── logo-kineta.svg       # Expressive script wordmark (fill/stroke currentColor)
    │       ├── sticker-run-club.svg  # Pink die-cut "KINETA RUN CLUB" sticker
    │       ├── sticker-kn.svg        # Cobalt/butter die-cut "KN" monogram sticker
    │       ├── sticker-kineta.svg    # Layered yellow/pink/cobalt "KINETA" sticker
    │       ├── sticker-puro-sabor.svg# Green hand + "NO FLUFF. PURE FLAVOR." sticker
    │       ├── scroll-badge.svg      # 108x108 periwinkle "THIS IS HOW WE SCROLL • KINETA •"
    │       ├── cursor-default.svg    # Custom 28x28 default pointer cursor
    │       └── cursor-pointer.svg    # Custom 32x32 cobalt interactive pointer cursor
    ├── data/
    │   └── brandData.js              # Single source of truth for all copy, colors & grid coords
    ├── styles/
    │   ├── tokens.css                # CSS custom properties (palette, fluid scale, radii, z-index)
    │   ├── base.css                  # Resets, variable font setup, custom cursor rules
    │   ├── layout.css                # Container, responsive grids, spacing utilities
    │   ├── components.css            # Nav, pill CTAs, badges, stickers, cursor marquee, cards
    │   ├── sections.css              # Hero, Intro, Featured 3D Stack, Flavors, Team, Footer
    │   └── animations.css            # Keyframes, draw-line underlines, variable weight transitions
    └── scripts/
        ├── main.js                   # App bootstrapper importing brandData + modules
        ├── animations.js             # GSAP + ScrollTrigger choreography (Subagent 4)
        ├── interactive.js            # Variable font hover, momentum, cursor marquee, trail (Subagent 5)
        └── canvas-art.js             # Procedural HTML5 Canvas visuals for cards/portraits (Subagent 5)
```

---

## 2. Visual System & Variable Typography

### Color Tokens (`src/styles/tokens.css`)
| Token | Hex | Usage |
|---|---|---|
| `--color-canvas-light` | `#f2f2f2` | Main light page canvas |
| `--color-canvas-light-alt` | `#f3f3f3` | Alternate light surface |
| `--color-canvas-dark` | `#131313` | `.theme-dark` sections (Pinned 3D Editions, Footer) |
| `--color-white` | `#ffffff` | Cards, Polaroid frames, sticker die-cut borders |
| `--color-cobalt` | `#0038ff` | Electric Cobalt Blue (`Volt Yuzu`, primary accents) |
| `--color-pink` | `#ff77cd` | Bubblegum Pink (`Berry Pulse`, Run Club sticker) |
| `--color-orange` | `#ff5f04` | Signal Orange (`Solar Mango`, Diego card) |
| `--color-butter` | `#fee897` | Butter Yellow (`Night Edition`, accents) |
| `--color-vermilion` | `#f4381f` | Vermilion Red-Orange (`Solar Mango Club` drop) |
| `--color-periwinkle` | `#95a8ff` | Circular Scroll Badge (`#95a8ff`) & Valeria card |
| `--color-sticker-green` | `#22c55e` | `NO FLUFF. PURE FLAVOR.` sticker & Bruno card |

### Google Fonts Import (Required in `index.html`)
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,300..800&family=Inter:wght@400;500;600&family=Roboto+Flex:opsz,wdth,wght@8..144,65..100,200..900&display=swap"
  rel="stylesheet"
/>
```
- **Condensed Display Sans (`.heading-display`)**: `Roboto Flex` with `font-variation-settings: "wdth" 75, "wght" 800;` — supports genuine variable hover down to `wght: 200`.
- **High-Contrast Editorial Serif (`.heading-alt`, `.eyebrow`)**: `Fraunces` with `font-variation-settings: "opsz" 72, "wght" 300;` — supports genuine variable hover up to `wght: 800`.
- **UI/Body Fallback**: `Inter`.

---

## 3. DOM / CSS / JS Hook Conventions

All subagents MUST use these exact `data-*` attributes and class names so HTML, CSS, GSAP, and interactive scripts connect with zero selector drift:

| Hook Attribute / Class | Placed On | Owner | Behavior Specification |
|---|---|---|---|
| `data-text-reveal` | Display headings (`h1`, `h2`, `.reveal-line`) | Subagent 4 (`animations.js`) | Splits or masks lines/words and reveals upward (`yPercent: 110 -> 0`) via GSAP ScrollTrigger (`once: true`). |
| `data-font-weight-hover` | Interactive headings & `.heading-alt` spans | Subagent 5 (`interactive.js`) | Splits characters into `<span class="fw-char">`. Proximity hover smoothly animates `wght` (`700 -> 200` on `Roboto Flex` display, `300 -> 800` on `Fraunces` `.heading-alt`). |
| `data-featured-stack` | `.featured-editions` pinned wrapper + `[data-featured-card]` children | Subagent 4 (`animations.js`) | GSAP ScrollTrigger `pin: true, scrub: true` 3D card stack: each card enters from bottom with subtle 3D tilt (`rotateX`, `scale`, `yPercent`) while previous cards recede and darken slightly. |
| `data-cursor-marquee-text="..."` | Hero motion cards, Featured drop cards, Flavor cards | Subagent 5 (`interactive.js`) | Activates floating pill cursor follower displaying continuously scrolling marquee text from the attribute value. |
| `data-video-on-hover` | Cards containing animated `<canvas data-canvas-art="...">` | Subagent 5 (`canvas-art.js` + `interactive.js`) | Boosts procedural canvas animation speed, turbulence, and scale smoothly on pointer enter; eases back to ambient idle speed on leave. |
| `data-team-parallax-distance="<px>"` | Each team member card in `#team` | Subagent 4 (`animations.js`) | Scrubbed ScrollTrigger vertical parallax offset using the numeric value (e.g., `-48`, `42`, `-34`, `56`, `-28`, `46`) across the 4-column asymmetric grid. |
| `data-momentum-hover-init` | Hero motion cards, Polaroids, Stickers, Flavor cards | Subagent 5 (`interactive.js`) | Pointer-velocity inertia physics: hovering/moving across target imparts subtle spring-damped `x`, `y`, and `rotation` momentum. |
| `data-image-trail` | Intro section (`#about`) or dedicated trail zone | Subagent 5 (`interactive.js`) | Spawns lightweight procedural mini-cards / SVG stickers along pointer movement with fade + scale-out decay (throttled for 60fps). |
| `data-nav-theme="dark"` | `.theme-dark` sections (`#editions`, `#contact` footer) | Subagent 4 (`animations.js`) | ScrollTrigger toggles `.is-dark` on `<header class="site-nav">` when a `data-nav-theme="dark"` section intersects the top viewport bar, inverting nav text & `logo-kineta.svg` (`currentColor`) to `#f2f2f2`. |
| `data-draw-line-always` | Nav links, footer links, inline editorial links | Subagent 3 (`animations.css`) / Subagent 4 | Animated underline SVG/pseudo-element that draws left-to-right on hover and exits right. |
| `data-draw-line-persist` | Key editorial emphasis words / active links | Subagent 4 (`animations.js`) | Draws an expressive hand-drawn underline SVG path once on scroll into view and persists it. |
| `data-canvas-art="<artTheme>"` | `<canvas>` elements inside cards, polaroids & portraits | Subagent 5 (`canvas-art.js`) | Renders deterministic, high-DPI procedural botanical/kinetic art matching `brandData.js` `artTheme` keys (`volt-yuzu`, `berry-pulse`, `solar-mango`, `edicion-nocturna`, `polaroid-lab`, `polaroid-club`, `drop-*`, `can-*`, `portrait-*`). |

---

## 4. Section-by-Section Contract

1. **Header (`.site-nav`)**: Fixed top bar, inline `logo-kineta.svg` (using `currentColor`), 3 uppercase links (`ABOUT`, `EDITIONS`, `FLAVORS`) with `data-draw-line-always`, and pill CTA (`Contact`). Switches to `.is-dark` over `data-nav-theme="dark"` sections.
2. **Hero (`#hero`)**: Light canvas `#f2f2f2`. Eyebrow + giant H1 (`PUTS YOUR DAY IN` + `<span class="heading-alt">MOTION</span>`) with `data-text-reveal` & `data-font-weight-hover`, CTA `Discover more`, rotating `scroll-badge.svg`, 4 interactive motion cards (`data-video-on-hover`, `data-momentum-hover-init`, `data-cursor-marquee-text`), and 8-partner infinite marquee strip.
3. **Intro (`#about`)**: Light canvas, `data-image-trail` zone. Eyebrow `Who we are`, H2 `THE MAKERS BEHIND` + `KINETA`, anti-corporate copy, CTA `MORE ABOUT US`, 2 tilted Polaroid cards (`data-momentum-hover-init`) + die-cut stickers (`sticker-run-club.svg`, `sticker-puro-sabor.svg`).
4. **Featured Editions (`#editions`, `.theme-dark`, `data-nav-theme="dark"`)**: Dark canvas `#131313`. H2 `RECENT` + `EDITIONS`, pinned 3D card stack (`data-featured-stack`) with 3 cards (`Night Edition` `#fee897`, `Volt Yuzu 01` `#0038ff`, `Solar Mango Club` `#f4381f`), card link `View edition →`, plus CTA `SEE ALL EDITIONS`.
5. **Flavors (`#flavors`)**: Light canvas `#f2f2f2`. H2 `WHAT WE` + `CRAFT`, 3 tilted cards (`Volt Yuzu` `#0038ff`, `Berry Pulse` `#ff77cd`, `Solar Mango` `#ff5f04`) with `data-momentum-hover-init`, `data-video-on-hover`, `data-cursor-marquee-text`, and CTA `Explore the range`.
6. **Team (`#team`)**: Light canvas `#f2f2f2`. Eyebrow `Meet the team`, H2 `KINETA-` + `Team`, 4-column asymmetric desktop grid (`grid-template-columns: repeat(4, 1fr)`) placing Mateo `(1,1)`, Lucia `(3,1)`, Sofia `(2,2)`, Diego `(4,2)`, Valeria `(1,3)`, Bruno `(3,3)` with `data-team-parallax-distance` and procedural portrait canvases.
7. **Footer (`#contact`, `.theme-dark`, `data-nav-theme="dark"`)**: Dark canvas `#131313`. Giant H2 `READY TO SET THINGS IN` + `MOTION?`, pill CTA `ORDER YOUR PACK`, 3-column directory (Amsterdam & Berlin lab addresses), stickers (`sticker-kn.svg`, `sticker-kineta.svg`), and legal bar.

---

## 5. Subagent Ownership Boundaries

- **Subagent 2 (Brand & Technical Architect)**: `src/data/brandData.js`, `src/assets/svg/*`, `src/styles/tokens.css`, folder skeleton, `docs/ARCHITECTURE.md`. *(Complete)*
- **Subagent 3 (Editorial Frontend & CSS)**: `index.html` and full stylesheets in `src/styles/base.css`, `layout.css`, `components.css`, `sections.css`, `animations.css`.
- **Subagent 4 (GSAP & Scroll Choreography)**: `src/scripts/animations.js` + GSAP ScrollTrigger wiring in `src/scripts/main.js`.
- **Subagent 5 (Interactive Physics & Procedural Art)**: `src/scripts/interactive.js`, `src/scripts/canvas-art.js`, and integration in `src/scripts/main.js`.
