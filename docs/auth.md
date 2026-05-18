# Auth Standards

## Authentication Provider — Clerk only

This application uses **Clerk** for all authentication. Do not use NextAuth, Auth.js, custom JWT logic, session cookies, or any other auth mechanism.

- Never implement your own login, registration, or session logic.
- Never store passwords, tokens, or credentials of any kind in the database.
- All auth UI (sign-in, sign-up, user profile, etc.) must use Clerk's pre-built components.

## Getting the Current User

Always retrieve the authenticated user via Clerk's server-side helpers. Never read user identity from URL params, request bodies, or client-supplied data.

### In Server Components and Server Actions

```ts
import { auth, currentUser } from '@clerk/nextjs/server';

// Get the userId only (preferred — lightweight)
const { userId } = await auth();

// Get the full user object (only when you need profile data)
const user = await currentUser();
```

### In Client Components

```tsx
'use client';

import { useAuth, useUser } from '@clerk/nextjs';

const { userId } = useAuth();         // userId only
const { user } = useUser();           // full user object
```

## Protecting Routes

Use Clerk middleware to protect routes. Configure protected and public routes in `middleware.ts` (or `proxy.ts` for Next.js 16+) at the project root — do not add manual auth checks inside layouts or pages as a substitute for middleware.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
```

## Passing userId to Data Helpers

The `userId` from Clerk is the sole source of truth for identifying the current user. Always pass it explicitly from the Server Component into `/data` helper functions — never derive or accept it from anywhere else.

```tsx
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { getUserWorkouts } from '@/data/workouts';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null; // middleware should prevent this, but guard anyway

  const workouts = await getUserWorkouts(userId);
  return <WorkoutList workouts={workouts} />;
}
```

## Clerk Components

Use Clerk's built-in components for all auth-related UI. Do not build custom sign-in or profile forms.

| Use case | Component |
|----------|-----------|
| Sign in | `<SignIn />` |
| Sign up | `<SignUp />` |
| User profile | `<UserProfile />` |
| User avatar / menu | `<UserButton />` |
| Conditional rendering | `<SignedIn>`, `<SignedOut>` |

```tsx
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

<SignedIn>
  <UserButton />
</SignedIn>
<SignedOut>
  {/* redirect or show sign-in prompt */}
</SignedOut>
```

## Summary

| Rule | Requirement |
|------|-------------|
| Auth provider | Clerk — no alternatives |
| Auth UI | Clerk pre-built components only |
| Current user (server) | `auth()` or `currentUser()` from `@clerk/nextjs/server` |
| Current user (client) | `useAuth()` or `useUser()` from `@clerk/nextjs` |
| Route protection | Clerk middleware — not manual checks in layouts |
| `userId` source | Clerk session only — never URL params or request body |
