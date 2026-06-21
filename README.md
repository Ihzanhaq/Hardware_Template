# Forge — Hardware & Power Tools Storefront

A modern, animated e-commerce frontend for a hardware tools brand, built with React, Vite, Tailwind CSS v4, and GSAP. Industrial design system with a full light/dark theme, scroll-driven animations, hover micro-interactions, and real, situation-matched imagery.

> Frontend only — there is no backend. Cart state is persisted to `localStorage` and checkout is a demo (no payment is taken).

## Tech stack

- **React 19** + **React Router v7**
- **Vite** (dev server + build)
- **Tailwind CSS v4** (`@tailwindcss/vite`) with CSS-variable theming
- **GSAP 3** + **ScrollTrigger** (reveals, parallax, pinned horizontal scroll, count-ups)
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Features

- **Light / dark mode** — persisted, system-aware, no flash on load (`ThemeContext` + pre-paint script in `index.html`).
- **GSAP animations** — hero intro timeline, on-scroll reveals, image parallax, a pinned horizontal "Shop by trade" showcase, animated stat count-ups, an infinite perks marquee, and a cart-badge pop. All respect `prefers-reduced-motion`.
- **Hover interactions** — product image swap + zoom, quick-add, category tile zoom, animated link underlines, button arrow nudges.
- **Responsive** — mobile-first layouts across home, shop, product, and cart.
- **Resilient imagery** — `Img` component falls back to keyword-matched photos so nothing ever renders broken.

## Project structure

```
src/
  components/   Reusable UI (Navbar, Footer, ProductCard, Button, Img, ...)
  context/      ThemeContext (light/dark) + CartContext (localStorage cart)
  data/         catalog.json (hardware products) + products.js (data layer)
  hooks/        useGsapReveal (reveal / parallax / count-up hooks)
  lib/          animations.js (GSAP setup), images.js (imagery), format.js
  pages/        Home, Shop, ProductDetail, Cart, NotFound
```

## Customising

- **Brand colours / fonts** — edit the `@theme` tokens and light/dark variables in `src/index.css`.
- **Products** — edit `src/data/catalog.json`. Pricing, badges, ratings, and imagery are derived in `src/data/products.js`.
- **Imagery** — photos are pulled by keyword in `src/lib/images.js`; swap in your own URLs there.
