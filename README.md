# Two Quill Stories

Professional author website for Machugari Yashwanth Reddy.

## Stack

- TypeScript and TSX for the modern application code
- JavaScript for the legacy browser pages and Node.js SAK API server
- NestJS + TypeORM backend in `backend/` for the main site's authentication API
- React, Vite, Tailwind CSS, Framer Motion, React Router, and React Icons
- HTML for page structure and CSS for presentation
- JSON and XML for data/configuration and the sitemap

## Language review

This project does not contain low-level languages such as C, C++, Rust, or assembly.
All executable code is written in high-level TypeScript or JavaScript. The legacy
JavaScript pages remain compatible with the existing standalone SAK website, while
new application code should continue to use TypeScript/TSX for stronger typing and
maintainability.

## Project structure

- `src/` — React application, routes, styles, and imported book artwork
- `SAK_WEBSITE/` — standalone SAK Universe pages and their browser assets
- `backend/` — NestJS TypeScript API with JWT authentication and SQLite storage
- `scripts/` — project maintenance and audit utilities
- `assets/source-covers/` — original source cover images kept outside the application code

HTML and CSS are retained because they are required to structure and style a website;
they are not low-level programming languages.

## Routes

- `/`
- `/books`
- `/books/she-was-the-friend-i-dreamed-for`
- `/books/what-love-reveals`
- `/books/the-girl-i-never-met`
- `/sak-novels` and its three detail routes
- `/author`
- `/author-journey`
- `/contact`

## Development

```bash
npm install
npm run dev
```

The main authentication API runs separately from the legacy SAK API:

```bash
cd backend
npm install
copy .env.example .env
npm run start:dev
```

Set `JWT_SECRET` in `backend/.env`. SQLite is stored locally at `backend/two-quill.sqlite`; no external database server is required. The Vite development proxy sends `/api/auth/*` to NestJS on port 3001 and preserves the legacy SAK API on port 8010.

## Build

```bash
npm run build
```

## Environment variables

Copy `.env.example` to `.env` for local frontend development. The frontend uses
`VITE_API_URL=/api` locally so Vite proxies authentication requests to NestJS.

For production, set the Vercel variable `VITE_API_URL` to the deployed backend
base URL, for example `https://your-render-service.onrender.com/api`.

For the backend, copy `backend/.env.example` to `backend/.env` and set a long
private `JWT_SECRET`. `FRONTEND_URL` must be the Vercel origin without a trailing
slash. Never commit either `.env` file.

## Deployment

### Vercel frontend

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-render-service.onrender.com/api`
- Redeploy after changing the environment variable.

`vercel.json` preserves built static files and provides SPA fallback routing for
React Router direct navigation.

### Render backend

The backend is a monorepo service rooted at `backend/`:

- Runtime: Node
- Root directory: `backend`
- Build command: `npm ci --include=dev && npm run build`
- Start command: `npm start`
- Health check: `/api/health`
- Required variables: `NODE_ENV=production`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`,
  `SQLITE_PATH=two-quill.sqlite`, and the Vercel origin as `FRONTEND_URL`.

The server binds to Render's `PORT` on `0.0.0.0`; do not hardcode a production
port.

## Database and deployment limitation

The backend uses TypeORM with SQLite and automatically creates the `users` table
with `synchronize: true`. Render's default filesystem is ephemeral, so SQLite
user data can be lost after a redeploy or restart. A Render persistent disk can
preserve it, but persistent disks are not available on Render's free service.
Keep SQLite for now if this is a demo or early deployment; choose a persistent
storage plan or approve a database migration before treating it as production
data storage.

The legacy `SAK_WEBSITE/server.js` API is a separate local Node server on port
8010. Vercel deploys its static assets through the Vite build, but it does not
run that legacy Node API. The React authentication API is the NestJS service
described above.
