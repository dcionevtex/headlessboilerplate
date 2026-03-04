# 🛒 Headless VTEX E-Commerce Storefront — Build Prompt

> **Use this prompt with any AI coding assistant (Cursor, Copilot, Claude, etc.) to replicate and customize this headless e-commerce template for any VTEX-based store.**

---

## 📌 What You're Building

A **production-grade, headless e-commerce storefront** that uses **Next.js** as the presentation layer for a **VTEX** backend. The architecture is **fully configuration-driven** — all branding, content, feature flags, and VTEX credentials are externalized into JSON files so the same codebase can serve _any_ VTEX account by only editing config and content files. **Zero hardcoded content** in React components.

---

## 🧱 Technology Stack

| Layer              | Technology                                    |
|--------------------|-----------------------------------------------|
| **Framework**      | Next.js 16.x (App Router)                     |
| **Language**       | TypeScript (Strict Mode)                      |
| **Styling**        | Tailwind CSS v4 (Mobile-first, `@tailwindcss/postcss`) |
| **State**          | React Context API (`CartContext`, `LocationContext`) |
| **Backend / API**  | VTEX REST APIs (Catalog, Checkout, Intelligent Search) |
| **Images**         | `next/image` (remote patterns for VTEX CDN)   |
| **Fonts**          | `next/font/google` – Geist Sans + Geist Mono  |
| **Linting**        | ESLint + `eslint-config-next` (core-web-vitals + typescript) |
| **Deployment**     | Vercel (via `npx vercel`)                      |
| **Analytics**      | Google Tag Manager (config-driven, optional)   |
| **Maps**           | Google Maps API via `@googlemaps/js-api-loader` |

### Prerequisites
- Node.js 18+
- npm

---

## 📂 Complete File Structure

```
project-root/
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
│
├── public/
│   ├── images/
│   │   ├── banner.png              # Hero banner image
│   │   ├── cione_logo.png          # ⚙️ REPLACE: Your store logo
│   │   ├── logo.png                # ⚙️ REPLACE: Alternative logo
│   │   └── store-placeholder.png   # ⚙️ REPLACE: Store locator images
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
└── src/
    ├── config.json                 # ⚙️ CUSTOMIZE: Global config (VTEX account, features, currency)
    ├── site-content.json           # ⚙️ CUSTOMIZE: Homepage content (carousel, sections, search text)
    ├── header-content.json         # ⚙️ CUSTOMIZE: Logo path, search placeholder
    ├── footer-content.json         # ⚙️ CUSTOMIZE: Footer links, social, copyright
    ├── menu-content.json           # ⚙️ CUSTOMIZE: Navigation categories & subcategories
    ├── storelocator-content.json   # ⚙️ CUSTOMIZE: Store locations
    │
    ├── app/
    │   ├── layout.tsx              # Root layout (Providers, GTM, fonts)
    │   ├── page.tsx                # Homepage (carousel, product grid)
    │   ├── globals.css             # Tailwind + custom animations
    │   │
    │   ├── product/
    │   │   └── [id]/page.tsx       # Product Detail Page (PDP)
    │   │
    │   ├── search/
    │   │   ├── page.tsx            # Search results wrapper
    │   │   └── SearchPageContent.tsx # Search results logic (client)
    │   │
    │   ├── store-locator/
    │   │   └── page.tsx            # Store locator page
    │   │
    │   └── api/                    # --- Server-side API Proxy Routes ---
    │       ├── cart/
    │       │   ├── create/route.ts     # GET  → Creates new VTEX orderForm
    │       │   ├── add/route.ts        # POST → Add/update items in cart
    │       │   ├── update/route.ts     # POST → Update item quantities
    │       │   ├── shipping/route.ts   # POST → Attach shipping address
    │       │   └── [id]/route.ts       # GET  → Fetch cart details by orderFormId
    │       ├── product/route.ts        # GET  → Fetch product by productId
    │       ├── search/route.ts         # GET  → Proxy VTEX Intelligent Search
    │       └── top-searches/route.ts   # GET  → Proxy VTEX Top Searches
    │
    ├── components/
    │   ├── Header.tsx              # Nav bar: logo, search, location, cart icon
    │   ├── Footer.tsx              # Footer: links, social, copyright
    │   ├── Navigation.tsx          # Desktop mega-menu + mobile accordion drawer
    │   ├── CarouselBanner.tsx      # Hero image carousel (auto-scroll)
    │   ├── Banner.tsx              # Simple static banner
    │   ├── ServiceHighlights.tsx   # Icons bar (returns, shipping, pickup, loyalty)
    │   ├── ProductCard.tsx         # Product card (image, price, brand, installments)
    │   ├── ProductCarousel.tsx     # Horizontal scrollable product list
    │   ├── PaginatedProductGrid.tsx # Paginated product grid with pagination controls
    │   ├── ProductGallery.tsx      # PDP image gallery
    │   ├── SKUSelector.tsx         # PDP SKU/variant selector
    │   ├── QuantitySelector.tsx    # PDP quantity ± controls
    │   ├── ShippingSimulation.tsx  # PDP shipping cost estimator
    │   ├── MiniCart.tsx            # Slide-out cart drawer with seller grouping
    │   ├── GoogleTagManager.tsx    # Config-driven GTM script loader
    │   ├── AddressSelectorModal.tsx # Google Maps address picker modal
    │   ├── SearchSidebar.tsx       # Search facet filters (brand, category, seller)
    │   └── SortDropdown.tsx        # Search results sort control
    │
    ├── context/
    │   ├── CartContext.tsx          # Cart state (item count, items, sellers, total)
    │   └── LocationContext.tsx      # Location/address state (persisted to localStorage)
    │
    ├── lib/
    │   ├── vtex.ts                 # VTEX Catalog API + mock data fallback
    │   ├── cart.ts                  # VTEX Checkout API client (via proxy routes)
    │   ├── search.ts               # VTEX Intelligent Search client (via proxy routes)
    │   ├── product.ts              # Single product fetch (via proxy route)
    │   └── simulation.ts           # Shipping simulation server action
    │
    └── types/
        └── vtex.ts                 # TypeScript interfaces (VTEXProduct, VTEXItem, VTEXSeller, etc.)
```

---

## ⚙️ Configuration System

### `src/config.json` — The Control Center

This is the **single most important file** to customize. It controls all VTEX integration, feature flags, and display behavior.

```json
{
    "vtex": {
        "accountName": "YOUR_VTEX_ACCOUNT_NAME",
        "checkoutPath": ".myvtex.com/checkout",
        "sellerId": "1"
    },
    "globalSettings": {
        "currency": "USD",
        "installmentProductCard": true,
        "gtmContainerId": "",
        "googleMapsApiKey": ""
    },
    "marketplace": {
        "showSellerId": true
    },
    "pdp": {
        "showBrandName": true,
        "showInStock": true,
        "stockThresholds": {
            "low": 10,
            "medium": 100
        }
    }
}
```

#### Config Field Reference

| Path | Type | Description |
|------|------|-------------|
| `vtex.accountName` | `string` | VTEX account name. Used in ALL API URLs automatically. |
| `vtex.checkoutPath` | `string` | Checkout domain suffix. Options: `.myvtex.com/checkout`, `.vtexcommercestable.com.br/checkout` |
| `vtex.sellerId` | `string` | Default seller ID for cart operations. |
| `globalSettings.currency` | `string` | ISO 4217 currency code (`USD`, `AED`, `EUR`, `SAR`, etc.) |
| `globalSettings.installmentProductCard` | `boolean` | Show/hide installment info on product cards. |
| `globalSettings.gtmContainerId` | `string` | GTM container ID (`GTM-XXXXXXX`). Empty = GTM disabled. |
| `globalSettings.googleMapsApiKey` | `string` | Google Maps API key for address selector. |
| `marketplace.showSellerId` | `boolean` | `true` = show "Sold by [Seller]" + seller grouping in cart. `false` = hide seller info. |
| `pdp.showBrandName` | `boolean` | Show/hide brand name on Product Detail Page. |
| `pdp.showInStock` | `boolean` | Show/hide stock status indicator on PDP. |
| `pdp.stockThresholds.low` | `number` | Stock ≤ this = "Low Stock" (red). |
| `pdp.stockThresholds.medium` | `number` | Stock ≤ this = "Medium Stock" (yellow). Above = "High Stock" (green). |

---

## 📝 Content JSON Files — What to Customize

### `src/header-content.json`
```json
{
    "logo": {
        "src": "/images/your-logo.png",
        "alt": "Your Store Name"
    },
    "searchPlaceholder": "Search for products..."
}
```

### `src/footer-content.json`
```json
{
    "about": {
        "title": "About Us",
        "text": "Your brand description here."
    },
    "links": [
        { "label": "Link Label", "href": "/page" }
    ],
    "socials": [
        { "platform": "Instagram", "href": "https://instagram.com/..." },
        { "platform": "Facebook", "href": "#" },
        { "platform": "Twitter", "href": "#" }
    ],
    "contact": {
        "email": "hello@yourstore.com",
        "phone": "+1 (555) 000-0000"
    },
    "copyright": "© 2025 Your Brand. All rights reserved."
}
```

### `src/menu-content.json`
```json
{
    "categories": [
        {
            "id": 1,
            "name": "Category Name",
            "href": "/category/slug",
            "subcategories": [
                { "id": 11, "name": "Subcategory", "href": "/category/slug/sub" }
            ]
        }
    ]
}
```

### `src/site-content.json`
Controls: search messages, cart text, hero carousel slides, service highlights, and homepage product sections.

```json
{
    "search": {
        "title": "Search Results",
        "searchingFor": "Searching for",
        "resultsFound": "results found",
        "noResults": { "title": "...", "message": "...", "suggestion": "..." },
        "suggestions": ["term1", "term2"],
        "loading": "Searching for products...",
        "error": { "title": "...", "message": "...", "retry": "Try Again" },
        "topSearches": { "title": "Trending Searches", "emptyTitle": "...", "emptyMessage": "..." }
    },
    "cart": {
        "title": "My Shopping Cart",
        "empty": "Your cart is empty",
        "subtotal": "Total",
        "checkout": "Go to Checkout",
        "continueShopping": "Continue Shopping",
        "soldBy": "Sold by"
    },
    "carousel": {
        "slides": [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-abc?w=1920&h=600&fit=crop",
                "title": "Sale Title",
                "subtitle": "Subtitle text",
                "ctaText": "Shop Now",
                "ctaLink": "#section"
            }
        ]
    },
    "serviceHighlights": [
        { "id": 1, "icon": "returns", "title": "Free Returns", "subtitle": "30 days" },
        { "id": 2, "icon": "shipping", "title": "Free Shipping", "subtitle": "Orders above $99" },
        { "id": 3, "icon": "pickup", "title": "Store Pickup", "subtitle": "Free in stores" },
        { "id": 4, "icon": "loyalty", "title": "Loyalty Points", "subtitle": "Earn & Save" }
    ],
    "sections": {
        "featuredSeller": {
            "collectionId": "YOUR_VTEX_COLLECTION_ID",
            "type": "carousel",
            "dynamicTitle": true,
            "fallbackTitle": "Featured Products"
        },
        "newArrivals": {
            "collectionId": "YOUR_VTEX_COLLECTION_ID",
            "type": "grid",
            "title": "New Arrivals",
            "subtitle": "Check out our latest additions"
        }
    }
}
```

### `src/storelocator-content.json`
```json
{
    "title": "Our Stores",
    "subtitle": "Find a location near you",
    "stores": [
        {
            "id": "store-1",
            "name": "Flagship Store",
            "image": "/images/store-placeholder.png",
            "address": "123 Main Street, City",
            "phone": "+1 555 0000",
            "email": "store@brand.com",
            "hours": "Mon-Sun: 10AM - 10PM"
        }
    ]
}
```

---

## 🔌 VTEX API Integration Architecture

All VTEX API calls go through **server-side Next.js API Routes** (proxy pattern) to avoid CORS issues and keep credentials server-side.

### API Endpoints Used

| Purpose | VTEX API Endpoint | Proxy Route |
|---------|-------------------|-------------|
| Catalog (Collections) | `{account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search/?fq=productClusterIds%3A{id}` | Direct server fetch (SSR) |
| Product by ID | `{account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search?fq=productId:{id}` | `/api/product` |
| Intelligent Search | `{account}.myvtex.com/api/io/_v/api/intelligent-search/product_search` | `/api/search` |
| Top Searches | `{account}.myvtex.com/api/io/_v/api/intelligent-search/top_searches` | `/api/top-searches` |
| Create Cart | `{account}.vtexcommercestable.com.br/api/checkout/pub/orderForm` | `/api/cart/create` |
| Get Cart | `{account}.vtexcommercestable.com.br/api/checkout/pub/orderForm/{id}` | `/api/cart/{id}` |
| Add to Cart | `{account}.vtexcommercestable.com.br/api/checkout/pub/orderForm/{id}/items` (PATCH) | `/api/cart/add` |
| Update Cart | `{account}.vtexcommercestable.com.br/api/checkout/pub/orderForm/{id}/items/update` | `/api/cart/update` |
| Attach Shipping | `{account}.vtexcommercestable.com.br/api/checkout/pub/orderForm/{id}/attachments/shippingData` | `/api/cart/shipping` |
| Shipping Simulation | `{account}.vtexcommercestable.com.br/api/checkout/pub/orderForms/simulation` | Server Action (`'use server'`) |

### Mock Data Fallback
The catalog fetch (`lib/vtex.ts`) includes **8 complete mock products** that are returned automatically if the VTEX API is unreachable. This ensures the UI always renders during development/demos.

---

## 🗂 TypeScript Data Models

```typescript
interface VTEXProduct {
    productId: string;
    productName: string;
    brand: string;
    linkText: string;
    productReference: string;
    categoryId: string;
    categories: string[];
    description: string;
    items: VTEXItem[];
}

interface VTEXItem {
    itemId: string;
    name: string;
    nameComplete: string;
    complementName: string;
    ean: string;
    referenceId: Array<{ Key: string; Value: string }>;
    measurementUnit: string;
    unitMultiplier: number;
    modalType: string | null;
    isKit: boolean;
    images: VTEXImage[];
    sellers: VTEXSeller[];
    variations?: string[];
    variationValues?: Record<string, string[]>;
}

interface VTEXImage {
    imageId: string;
    imageLabel: string | null;
    imageTag: string;
    imageUrl: string;
    imageText: string;
}

interface VTEXSeller {
    sellerId: string;
    sellerName: string;
    addToCartLink: string;
    sellerDefault: boolean;
    commertialOffer: VTEXCommercialOffer;
}

interface VTEXCommercialOffer {
    Price: number;
    ListPrice: number;
    PriceWithoutDiscount: number;
    AvailableQuantity: number;
    Installments: VTEXInstallment[];
    // ... additional fields
}

interface VTEXInstallment {
    Value: number;
    InterestRate: number;
    TotalValuePlusInterestRate: number;
    NumberOfInstallments: number;
    PaymentSystemName: string;
}
```

---

## 🎯 Feature Summary

### Pages

| Route | Server/Client | Description |
|-------|---------------|-------------|
| `/` | Server (SSR) | Homepage: hero carousel, service highlights, product carousel (collection A), paginated product grid (collection B) |
| `/product/[id]` | Client | PDP: gallery, SKU selector, quantity, shipping simulation, add-to-cart |
| `/search?q=term` | Client | Search results with sidebar filters (brand, category, seller), paginated grid, top searches |
| `/store-locator` | Server (SSR) | Store location cards from JSON |

### Components Behavior

| Component | Key Features |
|-----------|-------------|
| **Header** | Logo → home link, search bar → `/search?q=`, location selector (opens Google Maps modal), cart icon with badge → opens MiniCart, mobile hamburger → opens Navigation drawer |
| **Navigation** | Desktop: horizontal category bar with subcategory dropdowns. Mobile: off-canvas accordion drawer |
| **CarouselBanner** | Auto-scrolling hero slides with fade-in animations, dot indicators, prev/next controls |
| **ProductCard** | Product image, brand (config-driven), name (2-line clamp), price with optional strikethrough, discount badge, installment info (config-driven), seller name (config-driven), add-to-cart |
| **MiniCart** | Slide-out overlay, quantity ±, seller grouping (config-driven), shipping estimate, checkout redirect to VTEX checkout |
| **ShippingSimulation** | Uses `LocationContext` to simulate shipping costs via VTEX Simulation API, shows Express/Standard options |
| **AddressSelectorModal** | Google Maps autocomplete + map pin, stores lat/lng/postalCode/countryCode |
| **PDP** | Breadcrumb, image gallery, brand (configurable), price + installments, seller info (configurable), stock status (configurable thresholds), SKU selector, quantity, shipping sim, add to cart, description (HTML) |

### State Management

| Context | Purpose | Persistence |
|---------|---------|-------------|
| `CartContext` | Cart items, count, total, open/close state | VTEX orderFormId in `localStorage` |
| `LocationContext` | User address, lat/lng, postal code, country | `localStorage` (`user_location_data`) |

---

## 🏗 Setup Instructions (For New Installations)

### Step 1: Create the Next.js Project

```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

### Step 2: Install Dependencies

```bash
npm install @googlemaps/js-api-loader @types/google.maps
```

### Step 3: Configure `next.config.ts`

Add remote image patterns for VTEX + Unsplash:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: '**.vteximg.com.br' },
            { protocol: 'https', hostname: 'YOUR_ACCOUNT.vtexcommercestable.com.br' },
            { protocol: 'https', hostname: 'YOUR_ACCOUNT.vtexassets.com' },
        ],
    },
};

export default nextConfig;
```

### Step 4: Configure `postcss.config.mjs`

```javascript
const config = {
    plugins: {
        "@tailwindcss/postcss": {},
    },
};

export default config;
```

### Step 5: Configure `tsconfig.json`

Ensure `resolveJsonModule: true` is set (needed for JSON imports):

```json
{
    "compilerOptions": {
        "resolveJsonModule": true,
        "paths": { "@/*": ["./src/*"] }
    }
}
```

### Step 6: Create All JSON Config/Content Files

Create the 6 JSON files inside `src/` as described above. Customize with your brand and VTEX account.

### Step 7: Build the Application

Follow the file structure above to create all files. The order should be:

1. **Types** → `src/types/vtex.ts`
2. **Config/Content JSONs** → all 6 files in `src/`
3. **Lib/API Clients** → `src/lib/vtex.ts`, `cart.ts`, `search.ts`, `product.ts`, `simulation.ts`
4. **Context Providers** → `src/context/CartContext.tsx`, `LocationContext.tsx`
5. **API Routes** → all routes in `src/app/api/`
6. **Components** → all 18 components
7. **Pages** → homepage, PDP, search, store-locator
8. **Layout + CSS** → `src/app/layout.tsx`, `src/app/globals.css`

### Step 8: Add Images

Place your logo and store images in `public/images/`.

### Step 9: Run

```bash
npm run dev
```

---

## 🔄 Customization Checklist

When adapting this template for a **new client/store**, you only need to modify:

- [ ] `src/config.json` — VTEX account name, currency, feature toggles
- [ ] `src/header-content.json` — Logo image and search placeholder
- [ ] `src/footer-content.json` — Brand info, links, contact, copyright
- [ ] `src/menu-content.json` — Navigation categories tree
- [ ] `src/site-content.json` — Carousel images, section titles, collection IDs
- [ ] `src/storelocator-content.json` — Store locations
- [ ] `public/images/` — Logo, banner, store photos
- [ ] `next.config.ts` — Add your VTEX image CDN hostnames
- [ ] `src/app/layout.tsx` — Update `<title>` and `<meta description>`
- [ ] Color scheme — Search for `red-500` / `red-600` in components to swap brand colors

**No TypeScript/component code changes are needed for basic customization.**

---

## 🚀 Deployment

```bash
# Quick deploy (no Git needed)
npx vercel

# Production deploy
npx vercel --prod

# Or connect via GitHub → Vercel dashboard
```

---

## 🏛 Architecture Principles

1. **Configuration over Code** — All behavior is JSON-driven
2. **Content Decoupling** — JSON files can be swapped for API endpoints (CMS-ready)
3. **API Proxy Pattern** — All VTEX calls route through Next.js API routes (CORS-free, credentials hidden)
4. **Mock Data Fallback** — Always renders even without VTEX connectivity
5. **Mobile-First** — Responsive at every breakpoint
6. **Component Isolation** — Every UI piece is a self-contained component
7. **Feature Flags** — Turn features on/off via config without code changes

---

## ❓ FAQ

**Q: How do I change the brand color from red to something else?**
A: Search for `red-500`, `red-600`, `red-50`, `red-100`, `red-700`, `red-800` across all files in `src/components/` and `src/app/` and replace with your brand color (e.g., `blue-500`).

**Q: How do I add a new homepage product section?**
A: Add a new entry to `site-content.json > sections` with a VTEX collection ID, then reference it in `src/app/page.tsx`.

**Q: How do I switch VTEX accounts?**
A: Change `vtex.accountName` in `src/config.json`. Also update `next.config.ts` image hostnames. That's it.

**Q: Can I run this without a real VTEX account?**
A: Yes! The mock data fallback in `lib/vtex.ts` will display 8 sample products. Cart features won't work but the UI is fully browsable.

**Q: How to add new API routes?**
A: Create a new folder under `src/app/api/` with a `route.ts` file exporting HTTP method handlers (GET, POST, etc.).
