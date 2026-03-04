import Header from '@/components/Header';
import CarouselBanner from '@/components/CarouselBanner';
import ProductCarousel from '@/components/ProductCarousel';
import PaginatedProductGrid from '@/components/PaginatedProductGrid';
import Footer from '@/components/Footer';
import { fetchVTEXCollection } from '@/lib/vtex';
import siteContent from '@/site-content.json';
import ServiceHighlights from '@/components/ServiceHighlights';
import { VTEXProduct } from '@/types/vtex';

export default async function Home() {
  const { featuredSeller, newArrivals } = siteContent.sections;
  let sellerProducts: VTEXProduct[] = [];
  let arrivedProducts: VTEXProduct[] = [];

  try {
    // Fetch products from both collections in parallel
    // Request up to 50 items for New Arrivals to support pagination
    [sellerProducts, arrivedProducts] = await Promise.all([
      fetchVTEXCollection(featuredSeller.collectionId),
      fetchVTEXCollection(newArrivals.collectionId, { from: 0, to: 49 })
    ]);
  } catch (error) {
    console.error("Failed to fetch products on server:", error);
    // Proceed with empty arrays to render the page structure at least
  }

  // Extract seller name from first product of collection if dynamic title is enabled
  const sellerName = featuredSeller.dynamicTitle && sellerProducts.length > 0
    ? sellerProducts[0].items[0]?.sellers[0]?.sellerName || featuredSeller.fallbackTitle
    : featuredSeller.fallbackTitle;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CarouselBanner slides={siteContent.carousel.slides} />
      <ServiceHighlights />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">

        {/* Featured Seller Carousel */}
        {sellerProducts.length > 0 && (
          <ProductCarousel
            products={sellerProducts}
            title={sellerName}
          />
        )}

        {/* New Arrivals Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {newArrivals.title}
          </h2>
          <p className="text-gray-600">
            {newArrivals.subtitle}
          </p>
        </div>

        {arrivedProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Unable to load products
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We're having trouble connecting to our product catalog right now.
              Please check your connection or try again later.
            </p>
          </div>
        ) : (
          <PaginatedProductGrid products={arrivedProducts} itemsPerPage={16} />
        )}
      </main>

      <Footer />
    </div>
  );
}
