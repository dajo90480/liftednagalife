# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## IMPORTANT: Consult /docs before writing any code

Before generating any code, **always read the relevant file(s) in the `/docs` directory first**. The docs define mandatory standards (component libraries, formatting conventions, patterns) that all generated code must follow. Do not rely on defaults or prior knowledge when a `/docs` file covers the topic.

Current docs:
- `docs/ui.md` — UI component and date formatting standards
- `docs/data-fetching.md` — data fetching rules: Server Components only, `/data` helpers, Drizzle ORM, user isolation
- `docs/auth.md` — auth standards: Clerk only, protected routes, getting the current user, userId sourcing
- `docs/data-mutations.md` — mutation rules: Server Actions only, colocated `actions.ts`, typed params, Zod validation, `/data` helpers

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css` and `@tailwindcss/postcss`
- **Geist** fonts loaded via `next/font/google`

## Architecture

This is a Next.js App Router project. Source lives under `src/app/`:

- `layout.tsx` — root layout; sets up fonts and base HTML shell
- `page.tsx` — home page (`/`)
- `globals.css` — global styles; defines CSS custom properties for theme colors and maps Tailwind tokens via `@theme inline`

Path alias `@/*` maps to `src/*`.

## Next.js Version Notes

This uses **Next.js 16**, which may differ significantly from training data. Before writing code, read the relevant guide in `node_modules/next/dist/docs/`. Key things that differ:

- **Instant navigation**: `Suspense` alone is not enough for instant client-side navigations — you must also export `unstable_instant` from the route. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.
- **Server vs Client Components**: All layouts and pages are Server Components by default. Add `'use client'` directive only when you need state, event handlers, lifecycle hooks, or browser APIs.
- **Tailwind v4**: Uses the new `@import "tailwindcss"` syntax and `@theme inline` for token mapping — not the v3 `tailwind.config.js` approach.
