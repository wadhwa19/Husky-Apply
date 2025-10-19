Fusion Starter — simplified instructions

Minimal steps to run this project locally or on your own server.

Prerequisites

- Node.js 18+ and pnpm installed

Development (hot-reload)

1. Install dependencies:

   pnpm install

2. Start dev server (Vite + Express middleware):

   pnpm dev

3. Open the app in your browser:

   http://localhost:8080/

Production build and run (single server)

1. Build the client and server bundles:

   pnpm run build

   This builds the SPA to `dist/spa` and the server bundle to `dist/server/production.mjs`.

2. Set environment variables (optional):

   Copy `.env.example` to `.env` and edit values.

3. Start the server:

   pnpm run start:prod

   The server will serve both static SPA files and the API on the configured `PORT` (default 3000 in code, but you can set `PORT` in `.env`).

Notes

- The repo uses pnpm and `pnpm-lock.yaml`. If you're using pnpm, you can safely remove `package-lock.json`.
- Don't commit `.env` — use `.env.example` as a template.
- If you want to persist scholarship form submissions, I can add an API endpoint and simple file or DB storage.
