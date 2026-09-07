# DIY Tools Co. — Headless VTEX Storefront Template

A config-driven Next.js storefront over a live VTEX backend. "DIY Tools Co." is placeholder branding — the point of this repo is to be forked and rebranded per project (see [`HEADLESS_VTEX_TEMPLATE_PROMPT.md`](HEADLESS_VTEX_TEMPLATE_PROMPT.md) for the full brief this template was built from). It ships with a home page, PDP, live search, a real VTEX Checkout cart, VTEX ID passwordless login, a store locator, and installable PWA support.

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables needed — the VTEX account and all feature flags live in `src/config.json`.

```bash
npm run build && npm start   # production build
```

The site is also installable as an app straight from the browser (Add to Home Screen on mobile, install from the address bar on desktop) — see [PWA.md](PWA.md).

## What's real vs. what's mocked

Product, search, cart, and account data all come from a live VTEX account (`sobharealtypoc` by default). The only mock fallback in the app is in `src/lib/vtex.ts`: the homepage's featured/new-arrivals sections call the VTEX Catalog Collection API directly, and fall back to a hardcoded `MOCK_PRODUCTS` array only if that specific call fails (outage, offline dev). PDP, search, cart, and auth have no mock fallback — if VTEX is unreachable, those show real errors or empty states rather than fabricated data.

## VTEX configuration

`src/config.json` is the single source of truth:

| Key | Purpose |
|---|---|
| `vtex.accountName` | The VTEX account every API call hits — change this to point the whole app at a different account. |
| `vtex.checkoutPath`, `vtex.sellerId` | Checkout domain suffix and default seller for cart operations. |
| `globalSettings.currency` | ISO 4217 code used for all price formatting. |
| `globalSettings.installmentProductCard` | Toggles installment pricing on product cards. |
| `globalSettings.gtmContainerId` | Google Tag Manager container, injected by `GoogleTagManager.tsx`. Leave empty to disable GTM entirely. |
| `globalSettings.googleMapsApiKey` | Used by the store locator's map and the shipping-simulation address selector (`@googlemaps/js-api-loader`). |
| `marketplace.showSellerId` | Toggles "Sold by [Seller]" display. |
| `pdp.showBrandName`, `pdp.showInStock`, `pdp.stockThresholds` | PDP brand-name visibility and the low/medium/high stock label thresholds — see `PDP_CONFIG_SUMMARY.md`. |
| `topBar.enabled`, `topBar.message` | The dismissible announcement strip at the top of every page. |

## Content files

All in `src/`, imported directly (`import x from '@/whatever.json'`) — no fetch needed, and no component should have literal user-facing strings for these areas:

| File | Drives |
|---|---|
| `header-content.json` | Logo image + alt text, search bar placeholder. |
| `menu-content.json` | The header's category dropdown — `categories[]`, each with an `href` and `subcategories[]`. Some entries link to `/category/...` paths, which this template doesn't implement as a route (that's added per-fork, e.g. in the `tatademo` project) — point new entries at `/search?q=...` unless you're adding your own category page. |
| `footer-content.json` | About-us blurb, quick links, socials, contact info, copyright. |
| `site-content.json` | Search page copy (empty/loading/error states, trending searches), cart drawer labels, hero banner, homepage carousel slides, service-highlight icons/text, and the two homepage product sections (`sections.featuredSeller`/`.newArrivals`, each just a VTEX collection ID + title). |
| `storelocator-content.json` | Store list for `/store-locator`. |
| `pwa-content.json` | App name/short name/description and theme/background color for the installable PWA — see `PWA.md`. |
| `config.json` | See table above. |

Note: PDP button labels and delivery copy are currently inline in `src/app/product/[id]/page.tsx`, not yet externalized to JSON — see `PDP_IMPLEMENTATION.md` if you're moving those out for a rebrand.

## Pages

- **Home** (`/`) — hero banner, carousel, service highlights, then two live product sections backed by VTEX Collection API queries defined in `site-content.json`.
- **PDP** (`/product/[id]`) — gallery, brand/price/stock (VTEX Catalog API, live), SKU selection, quantity stepper, shipping simulation, Add to Cart (hits the real VTEX cart API and opens the mini-cart).
- **Search** (`/search`) — VTEX Intelligent Search, trending searches, loading/empty/error states, all copy from `site-content.json`.
- **Store Locator** (`/store-locator`) — store list from `storelocator-content.json`, rendered with the Google Maps loader.
- **My Account** (`/my-account`) — real VTEX ID passwordless login (`api/auth/start` → `send-code` → `verify-code` proxy the actual VTEX ID authentication API, not a cosmetic form), plus `api/account/profile` and `api/account/orders`.

There's no dedicated PLP/category route in the base template — nav category links go to `/search?q=...` or to a `/category/[slug]` route that individual forks add themselves.

## Other docs in this repo

- [`CLAUDE.md`](CLAUDE.md) — architecture notes for AI coding assistants: the JSON-content pattern, the API-proxy pattern, data model quirks.
- [`CONTENT_ARCHITECTURE.md`](CONTENT_ARCHITECTURE.md) — the intended JSON → content-API → CMS migration path.
- [`PWA.md`](PWA.md) — how to install the site as an app, and how the manifest/service worker/icons are wired up.
- [`DEPLOY.md`](DEPLOY.md) — deploying to Vercel.
- [`PDP_CONFIG_SUMMARY.md`](PDP_CONFIG_SUMMARY.md), [`PDP_IMPLEMENTATION.md`](PDP_IMPLEMENTATION.md) — PDP config flags and implementation notes.
- [`HEADLESS_VTEX_TEMPLATE_PROMPT.md`](HEADLESS_VTEX_TEMPLATE_PROMPT.md) — the original build brief for this template, useful if you're prompting an AI assistant to replicate the pattern for a new VTEX account.

## Starting a new project from this template

1. Point `src/config.json`'s `vtex.accountName` (and `checkoutPath`/`sellerId` if different) at your VTEX account.
2. Rebrand: `header-content.json` (logo), `footer-content.json`, `pwa-content.json` (app name/colors), and swap the image assets in `public/images/`.
3. Regenerate the PWA icons for your brand: edit the colors/mark in `scripts/generate-pwa-icons.py` and run it (`pip install pillow` first).
4. Update `menu-content.json` to your real category structure and VTEX search queries.
5. Everything else — API routes, cart logic, auth flow, PWA plumbing — works unchanged.

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: React Context (`CartContext`, `LocationContext`, `AuthContext`)
- **Backend**: VTEX REST APIs — Catalog, Checkout, Intelligent Search, VTEX ID
- **Maps**: `@googlemaps/js-api-loader`
- **Analytics**: Google Tag Manager (optional, config-driven)
- **Package manager**: npm

## Repo layout

```
src/
├── app/          # Pages: home, /product/[id], /search, /store-locator, /my-account, and 14 API proxy routes under api/
├── components/    # Header, Navigation, TopBar, MiniCart, SKUSelector, ProductGallery, SearchAutocomplete, AuthModal, ...
├── context/       # CartContext, LocationContext, AuthContext
├── lib/           # VTEX API clients (vtex.ts, search.ts, product.ts, cart.ts, auth.ts, simulation.ts)
├── types/         # VTEX response TypeScript interfaces
└── *.json         # Every content/config file listed above
```

See `CLAUDE.md` for the full architectural breakdown.

## Troubleshooting

**Images not loading**: add the image's domain to `next.config.ts` under `images.remotePatterns`.

**PDP, search, cart, or auth errors**: these have no mock fallback (unlike the homepage) — check the console for the actual VTEX API error. A 4xx/5xx usually means `config.json`'s `accountName` is wrong or the account's APIs are down.

**Build errors**: clear the `.next` folder and rebuild:
```bash
rm -rf .next
npm run build
```

## License

This project is created for demonstration purposes.

## Contributing

This is a template project. Fork and customize for your own VTEX account.
