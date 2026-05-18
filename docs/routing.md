# Routing Standards

## Route Structure — /dashboard prefix

All application routes must live under `/dashboard`. There are no user-facing routes outside of `/dashboard` (aside from auth routes like `/sign-in` and `/sign-up`).

```
/dashboard              → main dashboard page
/dashboard/workout/[id] → workout detail/edit page
/dashboard/create       → create workout page
```

Do not create top-level routes (e.g. `/profile`, `/settings`) — nest everything under `/dashboard`.

## Route Protection — Middleware only

All `/dashboard` routes are protected and require an authenticated user. Route protection must be enforced via **Next.js middleware** using Clerk. Do not add manual auth checks inside layouts or pages as a substitute for middleware.

```ts
// middleware.ts (project root)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

This configuration treats every route as protected except `/sign-in` and `/sign-up`. Unauthenticated users are automatically redirected to `/sign-in` by Clerk.

## File System Routing Conventions

Follow Next.js App Router conventions:

- Each route segment is a folder under `src/app/`
- The page file is always `page.tsx`
- Layouts shared across a subtree go in `layout.tsx` at the appropriate level
- Dynamic segments use bracket notation: `[workoutId]`

```
src/app/
  dashboard/
    page.tsx                        # /dashboard
    layout.tsx                      # shared layout for all /dashboard routes
    workout/
      [workoutId]/
        page.tsx                    # /dashboard/workout/:workoutId
    create/
      page.tsx                      # /dashboard/create
```

## Summary

| Rule | Requirement |
|------|-------------|
| Route prefix | All app routes under `/dashboard` |
| Route protection | Clerk middleware in `middleware.ts` — not layout-level guards |
| Public routes | `/sign-in`, `/sign-up` only |
| Page files | `page.tsx` per segment, App Router conventions |
