---
name: project-docs-registry
description: Tracks all docs files registered in CLAUDE.md and their descriptions, to avoid duplicates and maintain consistent style
metadata:
  type: project
---

Registered docs entries in CLAUDE.md (under `## IMPORTANT: Consult /docs before writing any code`):

- `docs/ui.md` — UI component and date formatting standards
- `docs/data-fetching.md` — data fetching rules: Server Components only, `/data` helpers, Drizzle ORM, user isolation
- `docs/auth.md` — auth standards: Clerk only, protected routes, getting the current user, userId sourcing
- `docs/data-mutations.md` — mutation rules: Server Actions only, colocated `actions.ts`, typed params, Zod validation, `/data` helpers
- `docs/server-components.md` — Server Component rules: params/searchParams must be awaited (Promise in Next.js 15+), async pages, notFound() usage
- `docs/routing.md` — routing standards: all routes under /dashboard, protection via Clerk middleware only, App Router file conventions

**Why:** The CLAUDE.md docs list is the authoritative registry for documentation Claude must consult before writing code. Keeping a memory of registered entries prevents duplicate registrations and ensures description style stays consistent.

**How to apply:** Before adding a new entry, check this list. If the file is already here, skip. When writing a description, match the existing style: key topic first, colon-separated sub-points, under 15 words.
