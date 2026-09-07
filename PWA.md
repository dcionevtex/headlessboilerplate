# Installing the site as an app (PWA)

This site is installable straight from the browser — no App Store, no Play Store, no separate build. It's the same Vercel deployment; installing just adds a home-screen icon and drops the browser chrome.

## Android (Chrome)

1. Open the site in Chrome.
2. Tap the **⋮** menu → **Install app** (or **Add to Home screen**). Chrome may also show this as a banner/prompt automatically after a couple of visits.
3. Confirm. The icon appears on the home screen and opens full-screen, no address bar.

## iPhone / iPad (Safari)

Safari doesn't offer an auto-install prompt — it has to be done manually:

1. Open the site in **Safari** (not Chrome — iOS only allows this from Safari).
2. Tap the **Share** icon (square with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**. The icon appears on the home screen.

## Desktop (Chrome / Edge)

1. Open the site.
2. Click the **install icon** in the address bar (a monitor-with-arrow icon on the right side), or **⋮** menu → **Install [site name]…**.
3. It opens in its own window, separate from your regular browser tabs.

## What actually changes

- Same live VTEX data — product, price, and stock are fetched fresh from the connected account. Installing it doesn't change what's real vs. mocked (`src/lib/vtex.ts`'s `MOCK_PRODUCTS` fallback only kicks in if the live Collection API call itself fails).
- The app shell (icons, static assets) is cached so it opens instantly and shows *something* if you briefly lose signal, but this isn't an offline-shopping app — cart, pricing, and search all need a live connection.
- No push notifications, no background sync, no native device APIs. It's a browser tab wearing an icon, not a native app.

## For developers

Architecture (manifest, service worker, icon generation) is documented in `CLAUDE.md` under **PWA**. Short version: `src/pwa-content.json` drives the name/colors, `src/app/manifest.ts` and `src/app/apple-icon.png` are Next.js's file-convention routes, `public/sw.js` is a hand-written service worker that only caches static assets and never touches `/api/*`. To change the icon, edit `scripts/generate-pwa-icons.py` and re-run it.

This is also the reference implementation to copy into any project seeded from this boilerplate — the whole PWA layer is six files (`src/pwa-content.json`, `src/app/manifest.ts`, `src/app/apple-icon.png`, `public/sw.js`, `src/components/PWARegister.tsx`, plus wiring in `src/app/layout.tsx`) and one icon set in `public/icons/`. Regenerate the icons for the new brand before copying it over.
