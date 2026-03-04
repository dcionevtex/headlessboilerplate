# DIY Tools Co. - Product Listing Page

A modern, responsive Product Listing Page (PLP) built for a DIY company using Next.js 16, TypeScript, and Tailwind CSS. This headless implementation fetches products from the VTEX API and displays them in a clean, professional interface.

## 🚀 Features

- **Headless VTEX Integration**: Fetches products from VTEX Collection API
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **Server-Side Rendering**: Built with Next.js App Router for optimal performance
- **TypeScript**: Fully typed for better developer experience
- **Tailwind CSS**: Modern, utility-first styling
- **Separated Content**: Static content managed via JSON configuration
- **Mock Data Fallback**: Demonstrates full functionality even when API is unavailable

## 📦 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main PLP page
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Header with logo, search, and cart
│   ├── Banner.tsx          # Hero banner section
│   ├── ProductCard.tsx     # Individual product card
│   └── Footer.tsx          # Footer with links and info
├── lib/
│   └── vtex.ts            # VTEX API integration
├── types/
│   └── vtex.ts            # TypeScript types for VTEX API
└── site-content.json      # Static content configuration
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Optimization**: Next.js Image component
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### VTEX API Endpoint

The VTEX API endpoint is configured in `src/lib/vtex.ts`:

```typescript
const VTEX_API_URL = 
  'https://sobharealtypoc.vtexcommercestable.com.br/api/catalog_system/pub/products/search/?fq=productClusterIds%3A137&sc=1';
```

### Static Content

All static content (header, banner, footer) is managed in `src/site-content.json`. Update this file to change:
- Logo and branding
- Search bar placeholder
- Banner text and CTA
- Footer links and contact information

### Image Domains

External image domains are configured in `next.config.ts`:
- Unsplash (for mock product images)
- VTEX image CDN domains

## 📱 Page Components

### Header
- DIY Tools logo
- Search bar (static, no backend)
- Shopping cart icon with item count

### Banner
- Full-width hero image
- Compelling headline and subtitle
- Call-to-action button

### Product Grid
- Responsive grid (1-4 columns based on screen size)
- Product cards with:
  - High-quality product images
  - Brand name
  - Product name
  - Price with discount badges
  - Installment options
  - "Add to Cart" button

### Footer
- About Us section
- Quick Links
- Contact Information
- Social Media links
- Copyright notice

## 🎨 Design Features

- **Clean & Minimal**: Professional DIY aesthetic
- **Responsive**: Works on mobile, tablet, and desktop
- **Interactive**: Hover effects and smooth transitions
- **Accessible**: Semantic HTML and proper ARIA labels
- **SEO Optimized**: Proper meta tags and heading structure

## 🔄 API Integration

The application attempts to fetch products from the VTEX API. If the API is unavailable, it falls back to mock data to demonstrate full functionality.

### VTEX Product Structure
Each product includes:
- Product ID and name
- Brand information
- Multiple items/SKUs
- Images
- Pricing (regular and sale)
- Installment options
- Availability

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 📝 Customization

### Adding New Products (Mock Data)
Edit `src/lib/vtex.ts` and add new products to the `MOCK_PRODUCTS` array.

### Changing Styles
- Global styles: `src/app/globals.css`
- Component styles: Inline Tailwind classes in component files

### Updating Content
Edit `src/site-content.json` to update:
- Header text and placeholders
- Banner content
- Footer information

## 🐛 Troubleshooting

### Images Not Loading
Ensure the image domain is added to `next.config.ts` under `images.remotePatterns`.

### API Errors
Check the console for VTEX API errors. The app will automatically fall back to mock data.

### Build Errors
Clear the `.next` folder and rebuild:
```bash
rm -rf .next
npm run build
```

## 📄 License

This project is created for demonstration purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

---

**Built with ❤️ for DIY enthusiasts and makers**
