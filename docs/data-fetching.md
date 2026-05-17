# Data Fetching Standards

## CRITICAL RULE: Server Components Only

All data fetching in this application **must** be done exclusively via **React Server Components**.

**Never** fetch data via:
- Route handlers (`app/api/` routes)
- Client components (`'use client'`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side fetching library
- `getServerSideProps` or `getStaticProps` (legacy patterns)

If a component needs data, it must be a Server Component (no `'use client'` directive) that `await`s data directly.

## Database Access: `/data` Directory Only

All database queries must go through helper functions in the `/data` directory.

**Rules:**
- Every database query lives in a `/data` helper function — never inline queries in components or layouts
- All queries must use **Drizzle ORM** — never raw SQL strings
- Every helper function that returns user data **must** scope its query to the currently authenticated user

## Data Security: User Isolation is Mandatory

Every query that touches user-owned data **must** filter by the authenticated user's ID. A user must never be able to access another user's data.

```ts
// CORRECT — always scope to the current user
export async function getUserWorkouts(userId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

// WRONG — never return unscoped data
export async function getAllWorkouts() {
  return db.select().from(workouts); // anyone's data leaks through
}
```

The `userId` passed to helper functions must always come from the authenticated session — never from user-supplied input such as URL params or request bodies.

## Example: Correct Pattern

```tsx
// app/dashboard/page.tsx — Server Component, no 'use client'
import { auth } from '@/lib/auth';
import { getUserWorkouts } from '@/data/workouts';

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getUserWorkouts(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```

```ts
// data/workouts.ts
import { db } from '@/lib/db';
import { workouts } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function getUserWorkouts(userId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}
```

## Summary

| Rule | Requirement |
|------|-------------|
| Where to fetch data | Server Components only |
| Where to write queries | `/data` directory helper functions only |
| Query method | Drizzle ORM — no raw SQL |
| User data scoping | Every query filtered by authenticated `userId` |
| `userId` source | Session object only — never URL params or request body |
