# Contributing to KINETA

Thank you for your interest in contributing to **KINETA** — our open-source editorial motion showcase for craft botanical sparkling energy drinks. Every contribution, whether it is refining 60fps GSAP/ScrollTrigger choreography, optimizing procedural HTML5 Canvas shaders, improving accessibility, or fixing documentation, helps keep this repository at a world-class standard.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Zero-Build Architecture Principles](#zero-build-architecture-principles)
3. [Getting Started Locally](#getting-started-locally)
4. [Contribution Workflow](#contribution-workflow)
5. [Design & Engineering Standards](#design--engineering-standards)
6. [Supporting the Project (Solana / Web3)](#supporting-the-project-solana--web3)

---

## Code of Conduct

This project and everyone participating in it are governed by the [Kineta Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code and foster an open, welcoming, and harassment-free environment.

---

## Zero-Build Architecture Principles

Kineta is intentionally engineered with **zero build-step overhead**:
- **Native ES Modules (`type="module"`)**: All JavaScript in `src/scripts/` runs directly in modern browsers without Webpack, Vite, or Rollup bundling.
- **Modular CSS Custom Properties**: Styles are cleanly partitioned into `tokens.css`, `base.css`, `layout.css`, `components.css`, `sections.css`, and `animations.css`.
- **Locked 60fps Performance**: Animations rely on GPU-composited transforms (`transform`, `opacity`), passive pointer/scroll listeners, and `requestAnimationFrame`-throttled physics.
- **Crisp Brutalist Geometry**: All UI cards, drawers, modals, and buttons adhere to our signature `0px` border-radius token (`--radius-none: 0px`) and high-contrast editorial palette.

Please **do not** introduce heavyweight build dependencies, CSS preprocessors, or runtime frameworks unless discussed and approved in an issue first.

---

## Getting Started Locally

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/kineta.git
   cd kineta
   ```
2. **Start a local static server** on port `4173`:
   ```bash
   # Using Python 3
   npm run dev

   # Or using zero-config Node serve
   npm run preview
   ```
3. Open **[http://localhost:4173](http://localhost:4173)** in your browser and verify there are zero console or network errors.

---

## Contribution Workflow

1. **Check Existing Issues**: Search the issue tracker to see if your bug report or feature enhancement has already been raised.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
3. **Commit with Clear Messages**: Follow conventional commit prefixes (`feat:`, `fix:`, `perf:`, `docs:`, `style:`, `refactor:`).
4. **Verify Across Viewports**: Test your changes on desktop (`1440px+`), tablet (`991px`), and mobile (`375px`), ensuring smooth scrolling, keyboard accessibility (`Escape` closes overlays, focus states remain clear), and reduced-motion respect.
5. **Open a Pull Request**: Provide a concise summary of the change, before/after screenshots or screen recordings for visual updates, and reference any related issues.

---

## Design & Engineering Standards

- **Palette Fidelity**: Always reference CSS tokens defined in `src/styles/tokens.css` (`--color-bg-light`, `--color-bg-dark`, `--color-accent`, `--color-lime`, `--color-lavender`, `--color-coral`) instead of hardcoding hex values.
- **Semantic & Accessible HTML**: Use appropriate ARIA attributes (`aria-expanded`, `aria-modal`, `aria-hidden`, `role="dialog"`) for interactive overlays and buttons.
- **Defensive JavaScript**: Wrap optional third-party motion hooks (`gsap`, `ScrollTrigger`, `Lenis`) in defensive checks so the document remains 100% readable and interactive even if a CDN script is blocked.

---

## Supporting the Project (Solana / Web3)

If Kineta accelerates your commercial client work, agency pitch, or creative coding journey, you can directly fund ongoing development via the **Solana Network (SOL / USDC)**:

- **Solana Wallet Address**: `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`
- **Full Sponsorship Guide**: See [FUNDING.md](./FUNDING.md)
