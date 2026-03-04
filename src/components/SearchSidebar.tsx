'use client';

import { useMemo } from 'react';
import { VTEXProduct } from '@/types/vtex';

export interface FilterState {
    brand: string[];
    category: string[];
    subcategory: string[];
    seller: string[];
    priceRange: [number, number];
}

interface SearchSidebarProps {
    products: VTEXProduct[];
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export default function SearchSidebar({ products, filters, onFilterChange }: SearchSidebarProps) {
    // Extract Facets from Products dynamically
    const facets = useMemo(() => {
        const brands = new Set<string>();
        const categories = new Set<string>();
        const subcategories = new Set<string>();
        const sellers = new Set<string>();
        let minPrice = Infinity;
        let maxPrice = 0;

        products.forEach(product => {
            if (product.brand) brands.add(product.brand);

            // Extract Categories
            // Format: ["/Tools/Power Tools/Drills/", "/Tools/"]
            // We want to extract "Tools" as category, "Power Tools" as subcategory
            if (product.categories) {
                product.categories.forEach(path => {
                    const parts = path.split('/').filter(Boolean);
                    if (parts.length > 0) categories.add(parts[0]);
                    if (parts.length > 1) subcategories.add(parts[1]);
                });
            }

            const price = product.items[0]?.sellers[0]?.commertialOffer?.Price || 0;
            if (price < minPrice) minPrice = price;
            if (price > maxPrice) maxPrice = price;

            product.items[0]?.sellers.forEach(seller => {
                if (seller.sellerName) sellers.add(seller.sellerName);
            });
        });

        return {
            brands: Array.from(brands).sort(),
            categories: Array.from(categories).sort(),
            subcategories: Array.from(subcategories).sort(),
            sellers: Array.from(sellers).sort(),
            minPrice: minPrice === Infinity ? 0 : Math.floor(minPrice),
            maxPrice: Math.ceil(maxPrice)
        };
    }, [products]);

    // Handle Checkbox Changes
    const handleCheckboxChange = (category: keyof FilterState, value: string) => {
        const current = filters[category] as string[];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];

        onFilterChange({
            ...filters,
            [category]: updated
        });
    };

    if (products.length === 0) return null;

    return (
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            {/* Filter Header - Mobile Only */}
            <div className="lg:hidden mb-4 border-b pb-2">
                <span className="font-bold text-gray-900">Filters</span>
            </div>

            {/* Categories */}
            {facets.categories.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {facets.categories.map(cat => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.category.includes(cat)}
                                    onChange={() => handleCheckboxChange('category', cat)}
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 transition-colors"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-red-500 transition-colors">
                                    {cat}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Subcategories */}
            {facets.subcategories.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Subcategory</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {facets.subcategories.map(subcat => (
                            <label key={subcat} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.subcategory.includes(subcat)}
                                    onChange={() => handleCheckboxChange('subcategory', subcat)}
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 transition-colors"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-red-500 transition-colors">
                                    {subcat}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Brands */}
            {facets.brands.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {facets.brands.map(brand => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.brand.includes(brand)}
                                    onChange={() => handleCheckboxChange('brand', brand)}
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 transition-colors"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-red-500 transition-colors">
                                    {brand}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Sellers */}
            {facets.sellers.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Seller</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {facets.sellers.map(seller => (
                            <label key={seller} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.seller.includes(seller)}
                                    onChange={() => handleCheckboxChange('seller', seller)}
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 transition-colors"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-red-500 transition-colors">
                                    {seller}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Range Info */}
            <div className="pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Price Range</h3>
                <p className="text-sm text-gray-600 font-medium">
                    ${facets.minPrice} - ${facets.maxPrice}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Sort by price to order results
                </p>
            </div>

            {/* Clear Filters */}
            {(filters.brand.length > 0 || filters.seller.length > 0 || filters.category.length > 0 || filters.subcategory.length > 0) && (
                <button
                    onClick={() => onFilterChange({ brand: [], category: [], subcategory: [], seller: [], priceRange: [0, 0] })}
                    className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline pt-2"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
}
