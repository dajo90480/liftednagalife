# UI Coding Standards

## Component Library — shadcn/ui only

All UI elements must be built exclusively with **shadcn/ui** components.

- **No custom components.** Do not create bespoke UI components (custom buttons, inputs, cards, modals, etc.). If a shadcn/ui component exists for the use case, use it. If one does not exist, install it from the shadcn/ui registry first.
- Install new components with the shadcn CLI: `npx shadcn@latest add <component>`.
- Shadcn components live in `src/components/ui/` — do not modify them beyond the initial install unless absolutely necessary, and never modify them to serve a one-off use case.
- Compose complex UI by combining shadcn primitives, not by building new abstractions on top of them.

## Date Formatting — date-fns only

All date formatting must use **date-fns**. Do not use `Date.prototype.toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting utility.

### Required format

Dates visible to the user must follow this pattern — ordinal day, abbreviated month, full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jan 2024
```

Use `date-fns/format` with the `do MMM yyyy` format token:

```ts
import { format } from 'date-fns';

format(date, 'do MMM yyyy'); // "1st Sep 2025"
```

This format applies everywhere a calendar date is shown to the user (workout dates, log entries, headers, etc.). Time-only or datetime values may include a time portion appended after the date, formatted with `HH:mm` or `h:mm a` as appropriate for the context.
