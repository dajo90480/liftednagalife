# Data Mutation Standards

## CRITICAL RULE: Server Actions Only

All data mutations in this application **must** be done via **Next.js Server Actions**.

**Never** mutate data via:

- Route handlers (`app/api/` routes)
- Client-side `fetch` / `axios` calls
- Direct database calls from components or layouts

## Server Action File Placement

Server actions must live in colocated `actions.ts` files, placed alongside the route segment they serve.

```
app/
  workouts/
    page.tsx
    actions.ts        ✓ colocated server actions for this route
    new/
      page.tsx
      actions.ts      ✓ colocated server actions for this nested route
```

Do not create a single global `actions.ts` file — keep actions close to the UI that calls them.

## Server Action Rules

Every server action **must**:

1. Have the `'use server'` directive at the top of the file (file-level, not function-level)
2. Accept typed parameters — **never** `FormData`
3. Validate all arguments with **Zod** before touching the database
4. Call a `/data` directory helper for the actual database write — never inline Drizzle calls inside the action itself
5. Scope any mutation to the currently authenticated user — fetch `userId` from the session, never from the action's parameters

## Example: Correct Pattern

```ts
// app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().datetime(),
  notes: z.string().optional(),
});

export async function createWorkoutAction(params: {
  name: string;
  date: string;
  notes?: string;
}) {
  const parsed = CreateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const session = await auth();

  await createWorkout({
    userId: session.user.id, // always from session, never params
    ...parsed.data,
  });
}
```

```ts
// data/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/schema";

export async function createWorkout(data: {
  userId: string;
  name: string;
  date: string;
  notes?: string;
}) {
  return db.insert(workouts).values(data);
}
```

## `/data` Helper Rules for Mutations

The same `/data` directory rules that apply to queries apply to mutations:

- Every database write lives in a `/data` helper function — never inline `db.insert` / `db.update` / `db.delete` in actions or components
- All writes must use **Drizzle ORM** — never raw SQL strings
- Every helper that writes user-owned data **must** accept `userId` as an explicit parameter and include it in the write

## Parameter Typing

Action parameters must be typed with explicit TypeScript types or interfaces. `FormData` is explicitly banned because it bypasses type safety and Zod validation.

```ts
// CORRECT — typed parameters
export async function updateWorkoutAction(params: {
  workoutId: string;
  name: string;
}) { ... }

// WRONG — FormData bypasses type safety
export async function updateWorkoutAction(formData: FormData) { ... }
```

## User Isolation

The same user isolation requirement from data fetching applies to mutations. `userId` must always come from the server-side session:

```ts
// CORRECT — userId from session
const session = await auth();
await updateWorkout({ userId: session.user.id, workoutId, name });

// WRONG — userId from caller-supplied params (allows acting on other users' data)
export async function updateWorkoutAction(params: {
  userId: string;   // never accept userId as a param
  workoutId: string;
  name: string;
}) { ... }
```

## Redirects After Mutations

**Never call `redirect()` inside a server action.** Redirects must be handled client-side after the server action resolves.

```ts
// WRONG — redirect() inside a server action
export async function createWorkoutAction(params: { ... }) {
  await createWorkout({ ... });
  redirect('/dashboard'); // ✗
}

// CORRECT — action returns, client handles navigation
export async function createWorkoutAction(params: { ... }) {
  await createWorkout({ ... });
  // just return; let the caller redirect
}
```

```tsx
// Client Component — redirect after the action resolves
'use client';
import { useRouter } from 'next/navigation';

const router = useRouter();

async function handleSubmit() {
  await createWorkoutAction({ ... });
  router.push('/dashboard'); // ✓
}
```

## Summary

| Rule                    | Requirement                                      |
| ----------------------- | ------------------------------------------------ |
| Where to mutate data    | Server Actions only                              |
| Action file location    | Colocated `actions.ts` next to the route segment |
| Parameter type          | Typed TypeScript params — never `FormData`       |
| Argument validation     | Zod — every action, every param                  |
| Where to write DB calls | `/data` directory helper functions only          |
| Query method            | Drizzle ORM — no raw SQL                         |
| `userId` source         | Session object only — never action parameters    |
| Redirects               | Client-side via `router.push()` — never `redirect()` in actions |
