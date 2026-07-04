# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Turbopack dev server, http://localhost:3000
npm run build    # Production build (Turbopack) — also validates types via `next build`
npm start        # Serve the production build
npm run lint     # eslint-config-next (core-web-vitals + typescript)
```

There is no test suite configured (no jest/vitest/playwright) and no CI workflow.

**Windows/Turbopack gotcha**: if `npm run dev` throws `ChunkLoadError: Failed to load chunk .../.next/dev/build/chunks/...`, it's a stale/corrupted `.next` cache, usually from a previous dev server that crashed or was interrupted mid-delete and still holds a file lock on `.next`. Find and kill the process bound to the port (`netstat -ano | findstr :3000`, then `taskkill /PID <pid> /F`) before deleting `.next` and restarting — not a code regression.

## Architecture

This is a headless VTEX storefront: Next.js is purely a presentation/BFF layer over a live VTEX commerce backend (account is `sobharealtypoc`, a VTEX POC — see `src/config.json`). Two architectural rules drive most of the code:

**1. Zero hardcoded content — everything customer-facing lives in JSON files at `src/`:**
- `config.json` — VTEX account name/checkout path/seller ID, currency, GTM container ID, Google Maps API key, PDP stock-threshold and display flags, marketplace seller-display flag. Read directly (`import config from '@/config.json'`) by both client components and API routes — it's the single source of truth for VTEX account switching.
- `site-content.json`, `header-content.json`, `footer-content.json`, `menu-content.json`, `storelocator-content.json` — all copy/nav/store data. No component should have literal user-facing strings for these areas; add/edit the JSON instead. See `CONTENT_ARCHITECTURE.md` for the intended migration path (these files → future content API).

**2. VTEX calls never happen client-side directly — everything is proxied through `src/app/api/*` route handlers**, which read `config.json` server-side to build the VTEX URL, forward the request, and return the raw VTEX response (avoids CORS and keeps the VTEX account/topology out of the browser):
- `api/product`, `api/search`, `api/top-searches` — Catalog / Intelligent Search proxies, consumed by `src/lib/product.ts` and `src/lib/search.ts`.
- `api/cart/create`, `api/cart/add`, `api/cart/update`, `api/cart/shipping`, `api/cart/[id]` — VTEX Checkout `orderForm` proxies, consumed by `src/lib/cart.ts`. The `orderFormId` is persisted in `localStorage` (`vtex_orderFormId`) by `src/lib/cart.ts`, not in the API routes — routes are stateless.

`src/lib/vtex.ts` is the exception: it calls the VTEX Catalog **Collection** API directly (server components / SSG only, not a client-facing proxy) and falls back to in-file `MOCK_PRODUCTS` if the request fails, so pages still render with data during outages or offline dev.

**Data model**: `src/types/vtex.ts` defines the VTEX response shapes (`VTEXProduct` → `VTEXItem` (SKU) → `VTEXSeller` → `VTEXCommercialOffer`). Price/stock/installment logic throughout the app reads from `item.sellers[n].commertialOffer`, not from a flattened product-level field — always drill through that path when adding price- or stock-related features.

**State**: `CartContext` (cart contents/count, backed by `src/lib/cart.ts` + localStorage) and `LocationContext` (selected address for shipping simulation, localStorage-persisted) are the only global state; both wrap the tree in `src/app/layout.tsx`.

Path alias `@/*` maps to `src/*` (see `tsconfig.json`), and `resolveJsonModule` is on, so JSON content files are imported directly rather than fetched.
