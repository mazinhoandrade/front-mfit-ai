# Project Overview: front-treino

A modern web application built with **Next.js (App Router)**, **React 19**, and **TypeScript**. It utilizes **Tailwind CSS v4** for styling and **better-auth** for authentication.

## Key Technologies
- **Framework:** Next.js (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4 (with PostCSS)
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Language:** TypeScript
- **Package Manager:** pnpm (inferred from `pnpm-lock.yaml` and `pnpm-workspace.yaml`)

## Architecture & Structure
- `app/`: Contains the application routes and components (App Router).
  - `_lib/`: Shared client-side libraries and utilities (e.g., `auth-client.ts`).
  - `auth/`: Authentication-related pages.
- `public/`: Static assets like images and icons.
- `tasks/`: Documentation or task-related files.
- `.gemini/rules/`: Project-specific AI instructions and coding standards.

## Building and Running

### Development
Run the development server with:
```bash
pnpm dev
```

### Production
Build the project for production:
```bash
pnpm build
```
Start the production server:
```bash
pnpm start
```

### Linting
Run ESLint:
```bash
pnpm lint
```

## Development Conventions

- **Next.js App Router:** Follow standard Next.js App Router conventions (Server Components by default, `'use client'` where needed).
- **Styling:** Use Tailwind CSS v4 utility classes. Prefer semantic color names or zinc/neutral palettes as seen in `app/page.tsx`.
- **Authentication:** Use `authClient` from `app/_lib/auth-client.ts` for client-side authentication interactions.
- **Rules & Standards:** Adhere to the rules defined in `.gemini/rules/`:
  - `api.md`: API design and interaction standards.
  - `react.md`: React-specific patterns and best practices.
  - `typescript.md`: TypeScript configuration and usage.
  - `general.md`: General coding standards.
- **Formatting:** ESLint is configured for linting.
