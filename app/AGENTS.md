# Project Setup

Last updated: 2026-11-08

Factual state of this project, for the assistant's reference. Record project
state here only — structure, installed packages, active patterns. Keep it brief.

## Stack

A **Vite + React** single-page app written in JSX, styled with **Tailwind CSS v4**.
The app uses React Router for client-side routing and is rendered inside
**React StrictMode** in development. StrictMode intentionally re-runs parts of
rendering and effects to surface unsafe side effects. Keep rendering and state
updaters pure, and clean up effects so they tolerate re-running.

The platform provides React, react-dom, react-router, Vite,
@vitejs/plugin-react, lucide-react, pocketbase, `tailwind-merge`, and the
Tailwind v4 engine at runtime. `package.json` currently has empty dependency
and devDependency objects; do not add packages or install styling dependencies
unless the project requirements change.

## Tailwind v4 notes

This is Tailwind **v4**, not v3:

- The stylesheet entry is `@import "tailwindcss";` in `src/index.css`.
- `src/index.css` loads `tailwind.config.cjs` with `@config`; theme extensions
  are currently defined in that config.
- Do not add `postcss.config`, `postcss`, or `autoprefixer`.
- Some renamed utilities versus v3: `shadow` → `shadow-sm`, `shadow-sm` →
  `shadow-xs`, `rounded` → `rounded-sm`, `outline-none` → `outline-hidden`,
  `flex-shrink-0` → `shrink-0`, and `bg-opacity-50` → slash opacity syntax.
  Set border colors explicitly when needed.
- Arbitrary values such as `w-[473px]` and `text-[#1da1f2]` are supported.

## Structure

```
index.html                 # App metadata and HTML entry point
src/
  App.jsx                  # Route declarations
  main.jsx                 # React StrictMode, BrowserRouter, and app entry
  index.css                # Tailwind import and global styles
  components/
    layout/                # Landing and application layouts
    ui/                    # Shared UI components
  pages/                   # Landing, dashboard, trends, reports, admin, etc.
  lib/                     # PocketBase client, providers, demo data, census helper
api/
  census.js                # Vercel serverless proxy for api.census.gov; holds
                           # CENSUS_API_KEY server-side (env var / .env.local)
.env.local                 # Server-only secrets, gitignored
public/
  favicon.svg
  manifest.json
package.json
vite.config.js
tailwind.config.cjs
```

Live data integration: `CensusProvider` in `src/lib/providers.js` fetches US
Census demographics (state population + median household income, ACS 5-year)
through the `/api/census` proxy and falls back to demo data when the proxy or
`CENSUS_API_KEY` is unavailable. Consumed by the Market Snapshot panel in
`src/pages/SocialIntelligence.jsx`. Other providers still serve demo data.

The application is a marketing intelligence product branded **Gloryus
Intelligence**. `src/App.jsx` defines the landing route and application pages
including dashboard, trends, trend radar, social intelligence, opportunities,
AI discoverability, audiences, competitors, content lab, assistant, scenarios,
reports, and admin, plus a not-found route. The page components live in
`src/pages/`.

## Routing and paths

`src/main.jsx` currently wraps the app in `<BrowserRouter>`; `src/App.jsx`
declares routes with `<Routes>` and `<Route>`. If adapting routing for a
non-root deployment, derive the router basename from `document.baseURI` rather
than hardcoding `/`, and keep links and asset URLs compatible with the
application's base path.

The platform serves files in the project's `static/` directory at fixed
`/static/<filename>` URLs. Reference those files with that exact path; do not
copy them into `public/` or `src/`. Avoid root-absolute URLs for other
in-app assets and links when they need to work under a non-root base path.

## Current application state

This is not a placeholder starter page: the application already contains its
product landing page, routed product pages, shared layouts and UI, demo data,
and PocketBase/provider helpers. Preserve the existing product and routing
structure when making changes. The HTML title, description, favicon, and web
manifest are already branded for Gloryus Intelligence; update them if the
product branding changes.
