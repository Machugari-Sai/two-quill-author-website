# Two Quill Stories

Professional author website for Machugari Yashwanth Reddy.

## Stack

- TypeScript and TSX for the modern application code
- JavaScript for the legacy browser pages and Node.js API server
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
- `backend/` — Node.js server code and API support
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

## Build

```bash
npm run build
```
