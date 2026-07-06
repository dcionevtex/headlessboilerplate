# Global Configuration Guide

This document explains how to use the global configuration file (`src/config.json`) to control application behavior.

## Configuration File Location

`src/config.json`

## Available Settings

### VTEX Settings

#### `vtex.accountName`

**Type:** `string`  
**Default:** `"sobharealtypoc"`

**Description:**  
Specifies the VTEX account name used for all API calls. This centralizes the account configuration and makes it easy to switch between different VTEX environments or accounts.

**Usage:**  
This setting is automatically used in:
- Product catalog API calls (`src/lib/vtex.ts`)
- Cart API operations (`src/lib/cart.ts`) All API proxy routes (`src/app/api/cart/*`)
- Checkout URL redirection (`src/components/MiniCart.tsx`)

**Example:**
```json
{
    "vtex": {
        "accountName": "your-store-name"
    }
}
```

**Important:** After changing the account name, ensure all API endpoints are accessible for the new account.

#### `vtex.checkoutPath`

**Type:** `string`  
**Default:** `".vtexcommercestable.com.br/checkout"`

**Description:**  
Specifies the domain and path for the VTEX checkout URL. This allows you to configure different checkout environments (production, staging, custom domains).

**Usage:**  
The checkout URL is constructed as:  
`https://${accountName}${checkoutPath}?orderFormId=${orderFormId}#/cart`

**Common Values:**
- `".vtexcommercestable.com.br/checkout"` - Standard stable environment
- `".myvtex.com/checkout"` - Standard production environment  
- `".vtexcommercebeta.com.br/checkout"` - Beta environment
- Custom domain paths for white-label stores

**Example:**
```json
{
    "vtex": {
        "accountName": "sobharealtypoc",
        "checkoutPath": ".myvtex.com/checkout"
    }
}
```

**Result:** Clicking "Go to Checkout" redirects to:  
`https://sobharealtypoc.myvtex.com/checkout?orderFormId=...#/cart`

### Global Settings

#### `globalSettings.currency`

**Type:** `string`  
**Default:** `"USD"`

**Description:**  
Specifies the currency code (ISO 4217) used for displaying prices throughout the application. This affects all price formatting in product cards, cart, and checkout displays.

**Supported Values:**  
Any valid ISO 4217 currency code, such as:
- `"USD"` - US Dollar
- `"AED"` - UAE Dirham
- `"EUR"` - Euro
- `"GBP"` - British Pound
- `"SAR"` - Saudi Riyal

**Usage:**  
This setting automatically updates price formatting in:
- Product cards (list price, selling price, installments)
- Mini cart (item prices, subtotals, totals)
- All components that display monetary values

**Example:**
```json
{
    "globalSettings": {
        "currency": "AED"
    }
}
```

**Note:** Changing the currency only affects the display format. Actual prices are still retrieved from VTEX in their original currency.

#### `globalSettings.installmentProductCard`

**Type:** `boolean`  
**Default:** `true`

**Description:**  
Controls whether installment payment information is displayed on product cards. When enabled, shows the available payment plan below the product price (e.g., "or 6x of AED 5.00").

**When `true`:**
- Product cards display installment options below the price
- Helps customers understand financing options at a glance
- Example: "AED 30.00" followed by "or 6x of AED 5.00"

**When `false`:**
- Installment information is hidden
- Only the main price is displayed
- Cleaner, simpler product card design

**Example:**
```json
{
    "globalSettings": {
        "currency": "AED",
        "installmentProductCard": true
    }
}
```

**Use Cases:**
- Set to `false` for markets where installment payments are not common
- Set to `false` to simplify the product card design
- Set to `true` to promote flexible payment options

#### `globalSettings.gtmContainerId`

**Type:** `string`  
**Default:** `""` (empty string - GTM disabled)

**Description:**  
Specifies the Google Tag Manager (GTM) container ID for tracking and analytics. When provided, automatically loads the GTM script on all pages. Leave empty to disable GTM integration.

**Format:**  
GTM container IDs follow the pattern `GTM-XXXXXXX` where X represents alphanumeric characters.

**When Configured:**
- GTM script automatically loads on all pages
- dataLayer is initialized for event tracking
- Works with both JavaScript-enabled and noscript environments
- Analytics and conversion tracking become available

**When Empty (`""`):**
- GTM scripts are not loaded
- No tracking overhead
- Ideal for development or when analytics aren't needed

**Example:**
```json
{
    "globalSettings": {
        "currency": "AED",
        "installmentProductCard": false,
        "gtmContainerId": "GTM-XXXXXXX"
    }
}
```

**Implementation Details:**
- Uses Next.js `Script` component with `afterInteractive` strategy
- Includes both the main script and noscript fallback
- Automatically injects into the `<head>` and `<body>` sections
- Only loads when a valid container ID is provided

**How to Get Your GTM Container ID:**
1. Sign in to [Google Tag Manager](https://tagmanager.google.com)
2. Select your account and container
3. Find your container ID in the format `GTM-XXXXXXX`
4. Copy and paste into this configuration

**Security Note:**  
The GTM container ID is safe to expose publicly as it's meant to be visible in the page source.

### Marketplace Settings

#### `marketplace.showSellerId`

**Type:** `boolean`  
**Default:** `true`

**Description:**  
Controls whether seller information is displayed throughout the application. This setting is useful for differentiating between marketplace and single-seller e-commerce setups.

**When `true` (Marketplace Mode):**
- Product cards display "Sold by [Seller Name]" below the product name
- Mini cart groups items by seller with seller headers
- Seller information is prominently visible

**When `false` (Single Seller Mode):**
- Product cards do not show seller information
- Mini cart displays all items in a flat list without seller grouping
- Cleaner interface for single-seller stores

**Example:**
```json
{
    "marketplace": {
        "showSellerId": true
    }
}
```

### Top Bar Settings

#### `topBar.enabled`

**Type:** `boolean`
**Default:** `true`

**Description:**
Controls whether the site-wide announcement bar is shown above the header (e.g. a promo message or, for a
POC/demo store, a disclaimer). When `false`, or when `topBar.message` is empty, the bar renders nothing.

#### `topBar.message`

**Type:** `string`
**Default:** `""`

**Description:**
The text displayed inside the top bar when `topBar.enabled` is `true`. Plain text only (no HTML).

**Example:**
```json
{
    "topBar": {
        "enabled": true,
        "message": "This is a demo account using a VTEX headless implementation"
    }
}
```

## Usage

To modify the configuration:

1. Open `src/config.json`
2. Change the desired setting value
3. Save the file
4. The changes will take effect immediately in development mode
5. For production, rebuild and redeploy your application

## Affected Components

### VTEX Account Name (`vtex.accountName`)
- **Product Catalog** (`src/lib/vtex.ts`): Fetches products from configured VTEX account
- **Cart Operations** (`src/lib/cart.ts`): Manages cart via configured VTEX account
- **Cart API Routes** (`src/app/api/cart/*`): Proxy to configured VTEX account
- **MiniCart** (`src/components/MiniCart.tsx`): Redirects to configured VTEX checkout

### Currency Display (`globalSettings.currency`)
- **ProductCard** (`src/components/ProductCard.tsx`): Formats all product prices
- **MiniCart** (`src/components/MiniCart.tsx`): Formats cart item prices and totals

### Installment Display (`globalSettings.installmentProductCard`)
- **ProductCard** (`src/components/ProductCard.tsx`): Shows/hides installment payment information

### Google Tag Manager (`globalSettings.gtmContainerId`)
- **GoogleTagManager** (`src/components/GoogleTagManager.tsx`): Loads GTM script when container ID is configured
- **RootLayout** (`src/app/layout.tsx`): Integrates GTM component into all pages

### Seller Display (`marketplace.showSellerId`)
- **ProductCard** (`src/components/ProductCard.tsx`): Shows/hides seller name
- **MiniCart** (`src/components/MiniCart.tsx`): Toggles seller grouping

### Top Bar (`topBar.enabled` / `topBar.message`)
- **TopBar** (`src/components/TopBar.tsx`): Renders (or hides) the announcement bar
- **Header** (`src/components/Header.tsx`): Renders TopBar above the sticky header on every page

## Future Configuration Options

Additional configuration options can be added to this file as needed, such as:
- Payment methods
- Shipping options
- Feature flags for A/B testing
- Regional settings
