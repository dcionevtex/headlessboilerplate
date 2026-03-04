'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchProducts, getTopSearches, TopSearch } from '@/lib/search';
import { VTEXProduct } from '@/types/vtex';
import PaginatedProductGrid from '@/components/PaginatedProductGrid';
import SortDropdown from '@/components/SortDropdown';
import SearchSidebar, { FilterState } from '@/components/SearchSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import content from '@/site-content.json';

export default function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState<VTEXProduct[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [topSearches, setTopSearches] = useState<TopSearch[]>([]);

    // Filter State
    const [filters, setFilters] = useState<FilterState>({
        brand: [],
        category: [],
        subcategory: [],
        seller: [],
        priceRange: [0, 0]
    });

    const { search } = content;

    // Reset filters when query changes
    useEffect(() => {
        setFilters({ brand: [], category: [], subcategory: [], seller: [], priceRange: [0, 0] });
    }, [query]);

    // 1. Filter Products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Brand Filter
            if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
                return false;
            }

            // Category Filter
            if (filters.category.length > 0) {
                const inCategory = product.categories?.some(path => {
                    const parts = path.split('/').filter(Boolean);
                    return parts.length > 0 && filters.category.includes(parts[0]);
                });
                if (!inCategory) return false;
            }

            // Subcategory Filter
            if (filters.subcategory.length > 0) {
                const inSubcategory = product.categories?.some(path => {
                    const parts = path.split('/').filter(Boolean);
                    return parts.length > 1 && filters.subcategory.includes(parts[1]);
                });
                if (!inSubcategory) return false;
            }

            // Seller Filter
            if (filters.seller.length > 0) {
                const productSellers = product.items[0]?.sellers.map(s => s.sellerName) || [];
                const hasSeller = filters.seller.some(s => productSellers.includes(s));
                if (!hasSeller) return false;
            }

            return true;
        });
    }, [products, filters]);

    // Fetch top searches on mount
    useEffect(() => {
        const fetchTopSearches = async () => {
            const data = await getTopSearches();
            setTopSearches(data.searches || []);
        };
        fetchTopSearches();
    }, []);

    // Fetch search results when query changes
    useEffect(() => {
        if (!query) {
            setLoading(false);
            return;
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            setError(false);

            try {
                const data = await searchProducts(query);
                setProducts(data.products || []);
                setTotalResults(data.recordsFiltered || 0);
            } catch (err) {
                console.error('Search error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <a href="/" className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </a>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 font-medium">Search Results</span>
                    </nav>

                    {/* Search Header */}
                    {query && (
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {search.searchingFor} &quot;{query}&quot;
                            </h1>
                            {!loading && !error && (
                                <p className="text-gray-600">
                                    {filteredProducts.length} {search.resultsFound}
                                    {products.length !== filteredProducts.length && ` (filtered from ${products.length})`}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mb-4"></div>
                            <p className="text-gray-600 text-lg">{search.loading}</p>
                        </div>
                    )}

                    {/* Content Layout: Sidebar + Grid */}
                    {!loading && !error && products.length > 0 && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sidebar Filters - Pass original products to calculate total available facets */}
                            <SearchSidebar
                                products={products}
                                filters={filters}
                                onFilterChange={setFilters}
                            />

                            {/* Main Content */}
                            <div className="flex-1">
                                <PaginatedProductGrid products={filteredProducts} itemsPerPage={12} />
                            </div>
                        </div>
                    )}

                    {/* Fallback for no data or error (reusing previous empty state logic if empty) */}
                    {!loading && !error && products.length === 0 && query && (
                        <div className="max-w-2xl mx-auto text-center py-20">
                            {/* Empty State SVG and Message */}
                            <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{search.noResults.title}</h2>
                            <p className="text-gray-600 mb-8 text-lg">{search.noResults.message}</p>
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <p className="text-sm font-semibold text-gray-700 mb-3">{search.noResults.suggestion}</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {search.suggestions.map((suggestion, index) => (
                                        <a key={index} href={`/search?q=${encodeURIComponent(suggestion)}`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors text-sm">{suggestion}</a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="max-w-md mx-auto text-center py-20">
                            {/* Error UI */}
                            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{search.error.title}</h2>
                            <p className="text-gray-600 mb-6">{search.error.message}</p>
                            <button onClick={handleRetry} className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">{search.error.retry}</button>
                        </div>
                    )}

                    {/* Top Searches when no query */}
                    {!query && !loading && (
                        <div className="text-center py-20">
                            <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{search.topSearches.emptyTitle}</h2>
                            <p className="text-gray-600 mb-8 text-lg">{search.topSearches.emptyMessage}</p>

                            {/* Top/Trending Searches */}
                            {topSearches.length > 0 && (
                                <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-sm">
                                    <div className="flex items-center justify-center gap-2 mb-6">
                                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        <h3 className="text-xl font-bold text-gray-900">{search.topSearches.title}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {topSearches.slice(0, 10).map((topSearch, index) => (
                                            <a key={index} href={`/search?q=${encodeURIComponent(topSearch.term)}`} className="group px-5 py-3 bg-gray-50 text-gray-700 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 text-sm font-medium border border-gray-200 hover:border-red-500 flex items-center gap-2">
                                                <span className="text-xs text-gray-400 group-hover:text-red-100">#{index + 1}</span>
                                                {topSearch.term}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
