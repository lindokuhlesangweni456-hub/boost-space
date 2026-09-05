# AI Workplace Productivity Assistant

A modern, responsive SaaS dashboard that brings together three AI-powered workplace tools in one place: a **Smart Email Generator**, a **Meeting Notes Summarizer**, and an **AI Workplace Assistant**.

Built as a single-page application with file-based routing, it is designed to feel like a polished, production-quality product with light/dark themes, persistent local settings, activity history, and thoughtful loading, error, and empty states.

## Live preview

Open the project in [Lovable](https://lovable.dev) to see the latest preview, make changes in chat, and publish or sync to GitHub.

## Features

- **Dashboard** — a central overview with productivity stats, quick-links to each tool, and a feed of recent activity.
- **Smart Email Generator** — enter a purpose, audience, tone, and optional context to generate a complete professional email with subject and body. Copy, regenerate, edit, or clear the result.
- **Meeting Summarizer** — paste raw meeting notes and receive an executive summary, key points, decisions, action items with owners and deadlines, and a deadline breakdown.
- **AI Assistant** — a multi-turn workplace chat with suggested prompts, follow-up refinements (shorter, more persuasive, more formal), and full message history.
- **History** — every generation, summary, and chat is stored locally for the current session and surfaced in the activity feed.
- **Settings** — manage your profile, default AI preferences (tone, length, response style), notifications, and theme.
- **Dark mode** — switch between light, dark, and system themes; persisted across reloads.
- **Responsive layout** — persistent sidebar on desktop, slide-out drawer on mobile, and adaptive card grids.

## Tech stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework with file-based routing and server functions
- [TanStack Router](https://tanstack.com/router) — type-safe file-based routing
- [TanStack Query](https://tanstack.com/query) — async state management
- [React 19](https://react.dev) — UI library
- [TypeScript](https://www.typescriptlang.org) — type safety
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling via CSS theme variables
- [shadcn/ui](https://ui.shadcn.com) — accessible, composable UI primitives
- [Lucide React](https://lucide.dev) — consistent iconography
- [Sonner](https://sonner.emilkowal.ski) — toast notifications

## Project structure

```text
src/
  components/
    ai/                 # Shared AI UI primitives (states, formatted text)
    layout/             # AppLayout (sidebar, header, mobile drawer)
    ui/                   # shadcn/ui components
  lib/
    app-store.tsx         # Global app state, preferences, history, theme
    utils.ts              # Tailwind class merging helpers
  routes/
    __root.tsx            # Root layout, providers, fonts, head metadata
    index.tsx             # Dashboard
    email.tsx             # Smart Email Generator
    meetings.tsx          # Meeting Notes Summarizer
    assistant.tsx         # AI Workplace Assistant
    history.tsx           # Activity history
    settings.tsx          # Profile and preferences
  services/
    aiService.ts          # Mock AI service layer (email, meetings, chat)
  styles.css              # Tailwind v4 theme tokens and custom utilities
```

## Getting started locally

Prerequisites:

- Node.js 20+ (recommended: install with [nvm](https://github.com/nvm-sh/nvm))
- npm or bun

Clone the repository and install dependencies:

```sh
git clone <repository-url>
cd <repository-name>
npm install
```

Start the development server:

```sh
npm run dev
```

The app will be available at `http://localhost:8080` by default.

Other useful scripts:

```sh
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview the production build
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## AI integration notes

The app ships with a fully functional mock AI service in `src/services/aiService.ts` so every feature works immediately without API keys.

To switch to a real provider:

1. Add a server function or API route that keeps the provider API key server-side.
2. Replace the mock implementations in `src/services/aiService.ts` with calls to that endpoint.
3. Set the required environment variables in your hosting provider or Lovable Cloud settings.

No API keys are included in the client bundle.

## Persistence

- **Profile, preferences, and theme** are saved to `localStorage` and restored on reload.
- **Activity history** is stored in memory for the current session and can be cleared from the History page.
- All data stays in the browser unless you connect a backend.

## Design system

The UI uses a professional navy/indigo palette with semantic CSS variables. Colors, shadows, and radii are defined in `src/styles.css` and consumed by Tailwind and shadcn components, so switching themes or building new components stays consistent.

Key design tokens:

- Primary action color: indigo/navy
- Card backgrounds: light `oklch(1 0 0)` / dark `oklch(0.17 0.02 265)`
- Subtle shadows and lifted hover states
- Rounded corners with a base radius of `0.75rem`
- Inter for body text, system sans as fallback

## Responsible AI

Generated content is clearly marked with an "AI-generated" badge. The app encourages human review before sending emails or acting on meeting summaries.

## License

This project is generated through Lovable and is owned by the project creator. You are free to modify, deploy, and distribute the code as you see fit.
