# Server Component Standards

## params and searchParams MUST be Awaited

Since Next.js 15, `params` and `searchParams` are **Promises**. You must `await` them before accessing any property. This is a breaking change — do not treat them as plain objects.

```tsx
// CORRECT — await params before use
interface Props {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  // ...
}

// WRONG — accessing params directly without awaiting
export default async function EditWorkoutPage({ params }: { params: { workoutId: string } }) {
  const { workoutId } = params; // ✗ runtime error in Next.js 15+
}
```

The same rule applies to `searchParams`:

```tsx
interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  // ...
}
```

## Server Components Are the Default

All `page.tsx` and `layout.tsx` files are Server Components by default — do not add `'use client'` unless the component needs state, event handlers, lifecycle hooks, or browser APIs.

## Async Page Functions

All pages that fetch data or read params must be declared `async`:

```tsx
export default async function MyPage({ params }: Props) {
  const { id } = await params;
  const data = await fetchSomething(id);
  return <div>{data.name}</div>;
}
```

## No Data Fetching in Client Components

If a component needs data, keep it as a Server Component. Pass data down as props to any child Client Components — never fetch inside `'use client'` components. See `docs/data-fetching.md` for full rules.

## notFound() for Missing Resources

Use Next.js's `notFound()` to return a 404 when a resource doesn't exist or the user doesn't own it:

```tsx
import { notFound } from 'next/navigation';

const workout = await getWorkoutById(id, userId);
if (!workout) notFound();
```

## Summary

| Rule | Requirement |
|------|-------------|
| `params` / `searchParams` type | `Promise<{ ... }>` — always |
| Accessing `params` / `searchParams` | Must `await` before reading any property |
| Page function signature | `async` whenever params or data fetching is needed |
| Data fetching | Server Components only — see `docs/data-fetching.md` |
| Missing resources | `notFound()` from `next/navigation` |
