# Clever Focus Space

Demo marketing site for **FocusFlow**, a fictional AI productivity product. The UI is a single long-form landing page built with **React 19**, **Vite 7**, **Tailwind CSS 4**, and **React Router**.

## Design idea

The page sells a calm, “premium editorial” productivity brand rather than a dense dashboard. Layout choices support that story: a **vertical side rail** on large screens for section anchors, an **asymmetric hero** (copy vs. live-style cards), a **bento** feature grid, a **horizontal day-in-flow carousel** (responsive: 1–4 cards visible, no page-level horizontal scroll), social proof, pricing, and a strong closing CTA. **Motion** is restrained: scroll-based **parallax** on decorative blurs, **reveal-on-scroll** for sections, and behavior that respects **`prefers-reduced-motion`**. Forms (register, book demo) are **UI-only demos** with inline validation and success states—no backend.

## Technology choice

- **Vite + React (SPA)** — fast local dev, a single static `dist/` output, and straightforward hosting.
- **React Router** — minimal routing (`/`, `/register`, 404) without a full meta-framework.
- **Tailwind CSS 4** (`@tailwindcss/vite`) — tokens and utilities in one pipeline; no component library so the bundle stays small and the landing stays custom.
- **i18next** — JSON locale files, browser + `localStorage` language detection, and a small switcher; easy to add more languages later.
- **No chart/form/Radix stack** — only what the landing needs (`lucide-react`, `clsx`, `tailwind-merge` for `cn()`).

## Assumptions

- **FocusFlow is fictional**; metrics, quotes, and company names are placeholder content.
- **Registration and “book demo”** do not send data or email; they exist to show UX patterns only.
- **SEO meta in `index.html`** stays in one language; runtime copy and `document.title` follow i18n (e.g. register page title).
- **Node 22.12+** is available locally (aligned with the toolchain used here).
- **Hosting** is a static file server or CDN with **SPA fallback** to `index.html` for unknown paths.

## Prerequisites

- **Node.js** 22.12 or newer (matches the toolchain used with Vite 7 and React 19)
- **npm** 10+

## Commands

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm install`  | Install dependencies                 |
| `npm run dev`  | Dev server at `http://localhost:8080` |
| `npm run build`| Production bundle to `dist/`         |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint                               |
| `npm run format` | Prettier                          |

## Project layout

```
src/
  App.tsx           # Route table + I18nHead
  main.tsx          # React root + BrowserRouter; loads ./i18n
  i18n/
    index.ts        # i18next + detector + resources
    I18nHead.tsx    # document title + html lang
    languages.ts    # supported locale codes
    locales/en.json # default copy
    locales/bg.json # second locale (example)
  components/
    LanguageSwitcher.tsx
    BookDemoModal.tsx
  pages/
    HomePage.tsx    # FocusFlow landing (all sections)
    RegisterPage.tsx
    NotFoundPage.tsx
  lib/
    utils.ts        # `cn()` helper for Tailwind class merging (optional for new UI)
  styles.css        # Tailwind entry + design tokens
index.html          # Document shell + SEO meta tags
vite.config.ts      # Vite + React + Tailwind + path alias `@/*`
```

Path alias **`@/`** maps to **`src/`** (see `tsconfig.json` and `vite.config.ts`).

## Stack

- **Vite** + **React** (SPA): production output is a static `dist/` folder you can host on Netlify, Vercel, S3, nginx, or similar.
- **React Router** for client-side routes and a 404 page. Add routes under `src/pages/` and register them in `App.tsx`.
- **Tailwind CSS 4** with `@tailwindcss/vite`; design tokens live in `styles.css`.
- **lucide-react** for icons (tree-shaken in production builds).
- **i18next**, **react-i18next**, and **i18next-browser-languagedetector**: copy lives in `src/i18n/locales/*.json`. The active language is stored in `localStorage` (`i18nextLng`), with the browser language as a fallback.

### Adding a language

1. Add the locale code to `SUPPORTED_LANGUAGES` in `src/i18n/languages.ts`.
2. Create `src/i18n/locales/<code>.json` by copying `en.json` and translating every key (keep the same JSON shape).
3. Register the file in `src/i18n/index.ts` (`resources` and `import`).
4. Add a short label under `lang.<code>` in each locale file for the switcher.

Static SEO strings in `index.html` are English-only unless you add a client or server layer to localize meta tags.

## UI helpers

`src/lib/utils.ts` exports **`cn()`** for merging Tailwind class names (`clsx` + `tailwind-merge`). Use it when you introduce shared components.

## Environment variables

Any variable prefixed with **`VITE_`** in `.env` / `.env.local` is exposed to the client via `import.meta.env` (see `vite.config.ts`).

## Deployment

After `npm run build`, upload the **`dist/`** folder to any static host. Configure the host for **SPA fallback**: all paths should serve `index.html` so client-side routing (including `/` and unknown URLs) works.

## License

Private / use per your team policy.
